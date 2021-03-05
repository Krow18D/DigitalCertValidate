const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();
// npm install -g truffle-hdwallet-provider dotenv
// const path = require("path");

console.log(process.env.INFURA_KEY);
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: "./client/src/artifacts/",
  networks: {
    development: {
      host: "127.0.0.1",
      port: process.env.GANACHE_PORT,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: process.env.GANACHE_PORT,
      network_id: "*",
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
        );
      },
      network_id: 4,
      skipDryRun: true,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
  },
};

// module.exports = {
//   networks: {
//     development: {
//       host: '127.0.0.1',
//       port: process.env.GANACHE_PORT,
//       network_id: '*'
//     },
//     test: {
//       host: '127.0.0.1',
//       port: process.env.GANACHE_PORT,
//       network_id: '*'
//     },
//     rinkeby: {
//       provider: function() {
//         return new HDWalletProvider(
//           process.env.PRIVATE_KEY,
//           `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
//         )
//       },
//       network_id: 3,
//       skipDryRun: true,
//       gas: 4000000 //make sure this gas allocation isn't over 4M, which is the max
//     }
//   }
// }
