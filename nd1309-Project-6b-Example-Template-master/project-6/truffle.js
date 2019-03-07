const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "e9d1b0f4541b415284f1e03b60a3fee7";
//
// const fs = require('fs');
const mnemonic = "note youth excite puzzle guide few firm crazy security fall asthma easily";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
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