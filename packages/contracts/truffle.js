module.exports = {
  compilers: {
    solc: {
      version: 'v0.5.12+commit.7709ece9',
      parser: 'solcjs', // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
          yul: true
        },
        evmVersion: 'istanbul'
      }
    }
  }
}
