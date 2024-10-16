const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const aaveLendingPoolAddressProvider =
    "0xdaF4ae8917F17de67F3D0E1D5568FA997ed67f09"; // Mainnet address (forked)

  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy();
  await dex.deployed();

 console.log("Dex contract deployed: ", dex.address);

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoanWithDex");
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
