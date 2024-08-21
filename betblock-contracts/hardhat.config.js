require("@nomicfoundation/hardhat-toolbox");
require('@chainlink/env-enc').config();
require('./tasks')

const { networks } = require("./networks")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  solidity: "0.8.20",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: process.env.PRIVATE_KEY
        ? [
            {
              privateKey: process.env.PRIVATE_KEY,
              balance: "10000000000000000000000",
            },
          ]
        : [],
    },
    ...networks
  },
  paths: {
    sources: "./contracts",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
};
