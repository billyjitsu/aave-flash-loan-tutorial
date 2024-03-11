const hre = require("hardhat");

async function main() {
  console.log("deploying...");
  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(
    "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A" // Pool address provider
  );

  await flashLoan.deployed();

  console.log("Flash loan contract deployed: ", flashLoan.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
