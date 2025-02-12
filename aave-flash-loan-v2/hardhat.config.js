require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require('dotenv').config({path: '../.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.12",
  networks: {
    tenderly: {
      url: process.env.RPC_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
      // gas: 200000000,
      // gasPrice: 100000000000,
    },
  },
};
