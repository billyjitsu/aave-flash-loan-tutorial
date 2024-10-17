const ethers = require('ethers');
require('dotenv').config();

// Contract addresses
const flashLoanContractAddress = "0x2696a81Ea2085a6575B071F3f5083DC00e0BF5f0";
const usdcAddress = "0xf54942A576A938FD63Bf9125Ad741DacC555CB6A";
const api3Address = "0xc9948c82b422f78f6F02C151409fCAd7659269C7";
// const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // forked mainnet
// const api3Address = "0x0b38210ea11411557c13457d4da7dc6ea731b88a"; // forked mainnet

// ABI for the FlashLoanLiquidationSwap contract
const flashLoanABI = [
    "function requestFlashLoan(address _flashAsset, uint256 _amount, address _tokenReceivedFromLiquidation) external",
    "function getBalance(address _tokenAddress) external view returns (uint256)",
    "function withdraw(address _tokenAddress) external"
];

// ABI for ERC20 tokens
const erc20ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address recipient, uint256 amount) returns (bool)"
];

async function main() {
    // Connect to the network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
    const mnemonic = process.env.MNEMONIC;
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const wallet = new ethers.Wallet(hdNode.derivePath("m/44'/60'/0'/0/0")).connect(provider);

    // Create contract instances
    const flashLoanContract = new ethers.Contract(flashLoanContractAddress, flashLoanABI, wallet);
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, wallet);
    const api3Contract = new ethers.Contract(api3Address, erc20ABI, wallet);

    // Get token decimals
    const usdcDecimals = await usdcContract.decimals();
    const api3Decimals = await api3Contract.decimals();
    console.log(`USDC decimals: ${usdcDecimals}, API3 decimals: ${api3Decimals}`);

    // Amount to borrow (e.g., 1000 USDC)
    const borrowAmount = ethers.utils.parseUnits("1", usdcDecimals);

    // Amount of API3 to supply (should be equivalent to borrowed USDC plus some extra for fees)
    const api3Amount = ethers.utils.parseUnits("11", api3Decimals); // Adjust this amount as needed

    try {
        // Supply API3 tokens to the flash loan contract
        console.log("Supplying API3 tokens to the flash loan contract...");
        await api3Contract.approve(flashLoanContractAddress, api3Amount);
        await api3Contract.transfer(flashLoanContractAddress, api3Amount);
        console.log("API3 tokens supplied");

        // Check balances before flash loan
        let usdcBalance = await usdcContract.balanceOf(flashLoanContractAddress);
        let api3Balance = await api3Contract.balanceOf(flashLoanContractAddress);
        console.log(`Before flash loan - USDC balance: ${ethers.utils.formatUnits(usdcBalance, usdcDecimals)}, API3 balance: ${ethers.utils.formatUnits(api3Balance, api3Decimals)}`);

        console.log(`Borrowing ${borrowAmount} USDC...`);
        // Request flash loan
        console.log("Requesting flash loan...");
        let tx = await flashLoanContract.requestFlashLoan(usdcAddress, borrowAmount, api3Address);
        await tx.wait();
        console.log("Flash loan executed");

        // Check balances after flash loan
        usdcBalance = await usdcContract.balanceOf(flashLoanContractAddress);
        api3Balance = await api3Contract.balanceOf(flashLoanContractAddress);
        console.log(`After flash loan - USDC balance: ${ethers.utils.formatUnits(usdcBalance, usdcDecimals)}, API3 balance: ${ethers.utils.formatUnits(api3Balance, api3Decimals)}`);

        // Withdraw any remaining tokens
        console.log("Withdrawing remaining tokens...");
        await flashLoanContract.withdraw(usdcAddress);
        await flashLoanContract.withdraw(api3Address);
        console.log("Tokens withdrawn");

        // Final balance check
        usdcBalance = await usdcContract.balanceOf(wallet.address);
        api3Balance = await api3Contract.balanceOf(wallet.address);
        console.log(`Final balances - USDC: ${ethers.utils.formatUnits(usdcBalance, usdcDecimals)}, API3: ${ethers.utils.formatUnits(api3Balance, api3Decimals)}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();