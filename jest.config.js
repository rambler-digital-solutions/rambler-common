module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['packages', 'node_modules'],
  collectCoverage: true,
  coverageReporters: ['text'],
  setupFilesAfterEnv: ['./jest.setup.js']
}
