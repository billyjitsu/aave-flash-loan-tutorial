const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Contract addresses
  const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI forked from mainnet
  const usdcContractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC forked from mainnet
  const dexContractAddress = "0x8176BC99C7e50617f9A89dAE1288e6a7e7732D2c"; // Dex contract deployed on the forked network
  const flashLoanContractAddress = "0x8F130Aac76683180BdbC2f3fa3FC31D499F45628"; // Flash Loan contract deployed on the forked network

  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.tenderly.co/fork/1fbafd46-d3ad-4c4f-a6b6-a761ca5ecf1c"
  );
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new hre.ethers.Wallet(privateKey, provider);

  // console.log("Wallet address:", wallet.address);

  // ABI for ERC20 token (DAI and USDC)
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
  ];

  // ABI for the Dex contract
  const dexAbi = [
    "function depositDAI(uint256 amount) external",
    "function depositUSDC(uint256 amount) external",
    "function getBalance(address token) external view returns (uint256)",
    "function buyDAI() external",
    "function previewDAISwap(uint256 amount) external view returns (uint256)",
    "function sellDAI() external",
    "function withdraw(address token) external",
  ];

  // ABI for the Flash Loan contract
  const flashLoanAbi = [
    "function requestFlashLoan(address _token, uint256 _amount) public",
    "function approveUSDC(uint256 _amount) external returns (bool)",
    "function allowanceUSDC() external view returns (uint256)",
    "function approveDAI(uint256 _amount) external returns (bool)",
    "function allowanceDAI() external view returns (uint256)",
    "function getBalance(address _tokenAddress) external view returns (uint256)",
    "function withdraw(address _tokenAddress) external",
    "function executeOperation(address[] calldata assets, uint256[] calldata amounts, uint256[] calldata premiums, address initiator, bytes calldata params) external override returns (bool)",
  ];

  // Creating contract instances
  const daiContract = new hre.ethers.Contract(
    daiContractAddress,
    erc20Abi,
    wallet
  );
  const usdcContract = new hre.ethers.Contract(
    usdcContractAddress,
    erc20Abi,
    wallet
  );
  const dexContract = new hre.ethers.Contract(
    dexContractAddress,
    dexAbi,
    wallet
  );
  const flashLoanContract = new hre.ethers.Contract(
    flashLoanContractAddress,
    flashLoanAbi,
    wallet
  );

  /*************************/
  /* Fund the Dex contract */
  /*************************/
  console.log("Approving DAI and USDC for the Dex contract");
  // Set approval for the Dex contract to spend DAI and USDC
  // We must approve the Dex contract to spend DAI and USDC from our wallet
  const approveAmountDAI = hre.ethers.utils.parseUnits("1000", 18);
  await daiContract.approve(dexContractAddress, approveAmountDAI);
  const approveAmountUSDC = hre.ethers.utils.parseUnits("1000", 6); // USDC has 6 decimals
  await usdcContract.approve(dexContractAddress, approveAmountUSDC);

  console.log("Deposit DAI and USDC to the Dex contract to add liquidity");
  // Deposit DAI and USDC to the Dex contract
  await dexContract.depositDAI(approveAmountDAI);
  await dexContract.depositUSDC(approveAmountUSDC);
  console.log("Deposited DAI and USDC to the Dex contract");

  /*************************/
  /* Preview the gain made from the swap */
  /* We will need to approve the flashloan contract */
  /* to spend the DAI and USDC from the Dex contract */
  /*************************/
  // Preview the Dex swap gain
  let daiReward = await dexContract.previewDAISwap(approveAmountUSDC);
  console.log("DAI reward from the swap:", daiReward.toString());

  // Approve the Flash Loan contract to spend DAI and USDC from the Dex contract
  await flashLoanContract.approveUSDC(approveAmountUSDC);
  // Need to approve the value you get from the arbritrage to sell back to the Dex contract
  await flashLoanContract.approveDAI(daiReward);
  console.log(
    "Approved Flash Loan contract to spend DAI and USDC from the Dex contract"
  );

  // Request a flash loan from the Flash Loan contract
  await flashLoanContract.requestFlashLoan(
    usdcContractAddress,
    approveAmountUSDC
  );
  console.log("Requested a flash loan");

  // Withdraw USDC Profit
  await flashLoanContract.withdraw(usdcContractAddress);
  console.log("Withdrawn USDC profit");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
