const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "e9d1b0f4541b415284f1e03b60a3fee7";
//
// const fs = require('fs');
const mnemonic = "unveil sugar library owner faint avocado clerk off target junior used shoot";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/e9d1b0f4541b415284f1e03b60a3fee7`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    }
  }
};