const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const aaveLendingPoolAddressProvider =
    "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e​"; // Pool address provider ETH Mainnet

  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy();
  await dex.deployed();

  console.log("Dex contract deployed: ", dex.address);

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoan = await FlashLoan.deploy(
    aaveLendingPoolAddressProvider,
    dex.address
  );

  await flashLoan.deployed();

  console.log("Flash loan contract deployed: ", flashLoan.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
