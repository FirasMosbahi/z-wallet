module.exports = {
  contracts_build_directory:"./ui/src/abi",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  compilers:{
  solc: {
    version:"0.8.19",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
}