const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

const aaveLendingPoolAddressProvider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"; // Mainnet fork address

async function main() {
  console.log("Deploying contract...");

  // Deploy Flashloan
  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(
    aaveLendingPoolAddressProvider,
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
