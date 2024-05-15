const hre = require("hardhat");

async function main() {
  console.log("deploying...");

  // const Dex = await hre.ethers.getContractFactory("Dex");
  // const dex = await Dex.deploy();
  // await dex.deployed();

  // console.log("Dex contract deployed: ", dex.address);

  const dexAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoan = await FlashLoan.deploy(
    "0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C", // Ava Fuji Aave LendingPool
    dexAddress
  );

  await flashLoan.deployed();

  console.log("Flash loan contract deployed: ", flashLoan.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
