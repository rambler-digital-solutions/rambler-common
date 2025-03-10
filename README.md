# Rambler Common

Common utils used by Rambler team

## Packages

- [@rambler-tech/async](packages/async)
- [@rambler-tech/cookie-storage](packages/cookie-storage)
- [@rambler-tech/crypto](packages/crypto)
- [@rambler-tech/debug](packages/debug)
- [@rambler-tech/dom](packages/dom)
- [@rambler-tech/errors](packages/errors)
- [@rambler-tech/local-storage](packages/local-storage)
- [@rambler-tech/session-storage](packages/session-storage)
- [@rambler-tech/lhci-report](packages/lhci-report)
- [@rambler-tech/local-storage](packages/local-storage)
- [@rambler-tech/react](packages/react)
- [@rambler-tech/session-storage](packages/session-storage)
- [@rambler-tech/splits](packages/splits)
- [@rambler-tech/tns-counter](packages/tns-counter)
- [@rambler-tech/top-100](packages/top-100)
- [@rambler-tech/transport](packages/transport)
- [@rambler-tech/url](packages/url)
- [@rambler-tech/use-is-visible](packages/use-is-visible)
- [@rambler-tech/use-transition-visible](packages/use-transition-visible)
- [@rambler-tech/yandex-metrica](packages/yandex-metrica)

## Contributing

### Dev environment

#### Start

To start development you need install `yarn` and deps:

```sh
yarn install
```

#### Testing

We have a test suite consisting of a bunch of unit tests to verify utils keep working as expected. Test suit is run in CI on every commit.

To run tests:

```sh
yarn test
```

To run tests in watch mode:

```sh
yarn test:watch
```

#### Code quality

To run linting the codebase:

```sh
yarn lint
```

To check typings:

```sh
yarn typecheck
```

To check bundle size:

```sh
yarn sizecheck
```

To check licenses:

```sh
yarn licenselint
```

### Publish

To bump version of changed packages and generate changelog run:

```sh
yarn release
```

## License

MIT
