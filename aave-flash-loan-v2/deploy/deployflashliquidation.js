const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("deploying...");

  const aaveLendingPoolAddressProvider =
    "0xdaF4ae8917F17de67F3D0E1D5568FA997ed67f09"; // lendingpool from scripts
  // const dexAddress = "0xA2B650236734DE65DaBd7b4EE6292fd8A4908aBF";

    const Dex = await hre.ethers.getContractFactory("GenericDex");
    const dex = await Dex.deploy();
    await dex.deployed();

    console.log("Dex contract deployed: ", dex.address);

  const FlashLoan = await hre.ethers.getContractFactory(
    "FlashLoanLiquidationSwap"
  );
  const flashLoan = await FlashLoan.deploy(
    aaveLendingPoolAddressProvider,
    dex.address
  );

  await flashLoan.deployed();

  console.log("Flash loan contract deployed: ", flashLoan.address);

  // Create an object with the deployed addresses
  const deployedAddresses = {
    DexAddress: dex.address,
    FlashLoanAddress: flashLoan.address,
  };

  // Convert the object to a JSON string
  const jsonContent = JSON.stringify(deployedAddresses, null, 2);

  // Write the JSON string to a file
  fs.writeFileSync(
    "deployedAddressesFlashloanDex.json",
    jsonContent,
    "utf8",
    (err) => {
      if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    }
  );

  console.log("Addresses saved to deployedAddresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
