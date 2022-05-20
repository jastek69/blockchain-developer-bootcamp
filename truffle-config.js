// const HDWalletProvider = require('@truffle/hdwallet-provider');

require('babel-register');
require('babel-polyfill');
require('dotenv').config();
// const HDWalletProvider = require('truffle-hdwallet-provider-privkey');  >>> ERROR: Private key does not satisfy the curve requirements
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKeys = process.env.PRIVATE_KEYS || ""
console.log(privateKeys)

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //Match any network id
      },
      kovan: {
        provider: function() {
          return new HDWalletProvider(
            privateKeys.split(','),   //Private Key - an Array of account private keys
           `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`  // Url to an Ethereum Node
           //`wss://kovan.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
           )
        },
        gas: 5000000,
        gasPrice: 25000000000,
        network_id: 42
      }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
