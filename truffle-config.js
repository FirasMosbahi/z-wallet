module.exports = {
  contracts_build_directory: "./ui/src/abi",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1337", // Match any network id
      gas: 6721975,
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}