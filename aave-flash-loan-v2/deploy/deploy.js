const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  const aaveLendingPoolAddressProvider =
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"; // Mainnet address (forked)

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
