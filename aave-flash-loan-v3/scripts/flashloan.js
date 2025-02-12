const hre = require("hardhat");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

async function main() {
  // Read deployed contract addresses
  const deployedContracts = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "deployed-contracts.json"),
      "utf8"
    )
  );

  // Contract addresses
  const usdcContractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const flashLoanContractAddress = deployedContracts.flashLoan;

  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_ENDPOINT
  );
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new hre.ethers.Wallet(privateKey, provider);

  // Contract ABIs
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const flashLoanAbi = [
    "function requestFlashLoan(address _token, uint256 _amount) public",
    "function getBalance(address _tokenAddress) external view returns (uint256)",
    "function withdraw(address _tokenAddress) external",
  ];

  // Create contract instances
  const usdcContract = new hre.ethers.Contract(
    usdcContractAddress,
    erc20Abi,
    wallet
  );
  const flashLoanContract = new hre.ethers.Contract(
    flashLoanContractAddress,
    flashLoanAbi,
    wallet
  );

  // Fund flashloan contract with initial USDC
  const fundingAmount = hre.ethers.utils.parseUnits("1000", 6); // 1000 USDC
  console.log("Approving USDC transfer to flashloan contract...");
  await usdcContract.approve(flashLoanContractAddress, fundingAmount);

  console.log("Transferring initial USDC to flashloan contract...");
  await usdcContract.transfer(flashLoanContractAddress, fundingAmount);

  // Check balance
  const balance = await flashLoanContract.getBalance(usdcContractAddress);
  console.log("Flashloan contract USDC balance:", balance.toString());

  // Execute flashloan
  const flashLoanAmount = hre.ethers.utils.parseUnits("100000", 6); // 100,000 USDC
  console.log("Requesting flashloan...");
  await flashLoanContract.requestFlashLoan(
    usdcContractAddress,
    flashLoanAmount
  );
  console.log("Flashloan executed successfully");

  // withdraw remaining USDC
  console.log("Withdrawing remaining USDC...");
  await flashLoanContract.withdraw(usdcContractAddress);
  console.log("Remaining USDC withdrawn successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
