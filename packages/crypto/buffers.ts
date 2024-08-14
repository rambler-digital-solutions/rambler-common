/** Get buffer from string */
export function bufferFromString(string: string) {
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }

  return buffer
}

/** Get string from buffer */
export function stringFromBuffer(buffer: ArrayBuffer) {
  const bufferView = new Uint8Array(buffer)
  let string = ''

  for (let i = 0; i < bufferView.byteLength; i++) {
    string += String.fromCharCode(bufferView[i])
  }

  return string
}

/* eslint-disable max-depth, sonarjs/cognitive-complexity, @typescript-eslint/no-magic-numbers */
/**
 * Get buffer from unicode string
 *
 * NOTE: based on `buffer` realization
 * https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L1956-L2034
 */
export function bufferFromUnicode(string: string) {
  const bytes = []
  let codePoint
  let units = Infinity
  let leadSurrogate = null

  for (let i = 0; i < string.length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xd7ff && codePoint < 0xe000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xdbff || i + 1 === string.length) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xdc00) {
        if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint =
        (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000
      // eslint-disable-next-line sonarjs/no-collapsible-if
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80)
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        (codePoint >> 0xc) | 0xe0,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        (codePoint >> 0x12) | 0xf0,
        ((codePoint >> 0xc) & 0x3f) | 0x80,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  const buffer = new ArrayBuffer(bytes.length)
  const bufferView = new Uint8Array(buffer)

  for (let i = 0; i < bytes.length; ++i) {
    if (i >= bufferView.length || i >= bytes.length) {
      break
    }

    bufferView[i] = bytes[i]
  }

  return buffer
}

// NOTE: based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

/**
 * Get unicode string from buffer
 *
 * NOTE: based on `buffer` realization
 * https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L954-L1028
 */
export function unicodeFromBuffer(buffer: ArrayBuffer) {
  const bufferView = new Uint8Array(buffer)
  const codePoints = []
  let i = 0

  while (i < bufferView.length) {
    const firstByte = bufferView[i]
    let codePoint = null
    let bytesPerSequence =
      // eslint-disable-next-line no-nested-ternary
      firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1

    if (i + bytesPerSequence <= bufferView.length) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }

          break
        case 2:
          secondByte = bufferView[i + 1]

          if ((secondByte & 0xc0) === 0x80) {
            tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f)

            if (tempCodePoint > 0x7f) {
              codePoint = tempCodePoint
            }
          }

          break
        case 3:
          secondByte = bufferView[i + 1]
          thirdByte = bufferView[i + 2]

          if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
            tempCodePoint =
              ((firstByte & 0xf) << 0xc) |
              ((secondByte & 0x3f) << 0x6) |
              (thirdByte & 0x3f)

            if (
              tempCodePoint > 0x7ff &&
              (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
            ) {
              codePoint = tempCodePoint
            }
          }

          break

        case 4:
          secondByte = bufferView[i + 1]
          thirdByte = bufferView[i + 2]
          fourthByte = bufferView[i + 3]

          if (
            (secondByte & 0xc0) === 0x80 &&
            (thirdByte & 0xc0) === 0x80 &&
            (fourthByte & 0xc0) === 0x80
          ) {
            tempCodePoint =
              ((firstByte & 0xf) << 0x12) |
              ((secondByte & 0x3f) << 0xc) |
              ((thirdByte & 0x3f) << 0x6) |
              (fourthByte & 0x3f)

            if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xfffd
      bytesPerSequence = 1
    } else if (codePoint > 0xffff) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      codePoints.push(((codePoint >>> 10) & 0x3ff) | 0xd800)
      codePoint = 0xdc00 | (codePoint & 0x3ff)
    }

    codePoints.push(codePoint)
    i += bytesPerSequence
  }

  if (codePoints.length <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode(...codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let string = ''
  let j = 0

  while (j < codePoints.length) {
    string += String.fromCharCode(
      ...codePoints.slice(j, (j += MAX_ARGUMENTS_LENGTH))
    )
  }

  return string
}
/* eslint-enable max-depth, sonarjs/cognitive-complexity, @typescript-eslint/no-magic-numbers */

/** Get base64url from string */
export function base64urlFromString(string: string) {
  return window
    .btoa(string)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/** Get string from base64url */
export function stringFromBase64Url(string: string) {
  return window.atob(
    string.replace(/-/g, '+').replace(/_/g, '/').replace(/\n/g, '')
  )
}

/** Concatenate buffers */
export function concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  const result = new Uint8Array(buffer1.byteLength + buffer2.byteLength)

  result.set(new Uint8Array(buffer1), 0)
  result.set(new Uint8Array(buffer2), buffer1.byteLength)

  return result.buffer
}
