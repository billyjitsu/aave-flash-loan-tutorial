const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

// V3 Mainnet address
const aaveLendingPoolAddressProvider = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";

async function main() {
  console.log("Deploying contracts...");

  // Deploy Flashloan
  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(
    aaveLendingPoolAddressProvider
  );
  await flashLoan.deployed();
  console.log("Flashloan deployed to:", flashLoan.address);

  // Deploy Dex
  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy();
  await dex.deployed();
  console.log("Dex deployed to:", dex.address);

  // Deploy FlashLoanArbitrage
  const FlashLoanArb = await hre.ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoanArb = await FlashLoanArb.deploy(
    aaveLendingPoolAddressProvider,
    dex.address
  );
  await flashLoanArb.deployed();
  console.log("FlashLoanArbitrage deployed to:", flashLoanArb.address);

  // Save deployment addresses
  const deployments = {
    flashLoan: flashLoan.address,
    dex: dex.address,
    flashLoanArbitrage: flashLoanArb.address,
  };

  // Write to deployments.json in root folder
  fs.writeFileSync(
    path.join(__dirname, '..', 'deployed-contracts.json'),
    JSON.stringify(deployments, null, 2)
  );
  console.log("Deployment addresses saved to deployed-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });