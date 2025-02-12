require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require('dotenv').config({path: '../.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    tenderly: {
      url: process.env.RPC_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
