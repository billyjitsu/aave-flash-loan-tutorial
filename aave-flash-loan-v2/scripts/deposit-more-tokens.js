const ethers = require('ethers');
require('dotenv').config();

// Contract addresses (replace with actual addresses)
const dexAddress = "0xfa79f9606Ffac328CfA0Db7Ac8b07193d31d4915";
const tokenAAddress = "0xc9948c82b422f78f6F02C151409fCAd7659269C7"; //API3 token
const tokenBAddress = "0xf54942A576A938FD63Bf9125Ad741DacC555CB6A"; //USDC token

// Amount to deposit (adjust as needed)
const amountOfTokenA = "100000";
const amountOfTokenB = "100000";

// ABI for the GenericDex contract
const dexABI = [
  "function deposit(address _token, uint256 _amount)",
  "function getBalance(address _token) view returns (uint256)"
];

// ABI for ERC20 tokens
const erc20ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
  const mnemonic = process.env.MNEMONIC;
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  const wallet = new ethers.Wallet(hdNode.derivePath("m/44'/60'/0'/0/0")).connect(provider);
  const signer = wallet;

  // Create contract instances
  const dexContract = new ethers.Contract(dexAddress, dexABI, signer);
  const tokenAContract = new ethers.Contract(tokenAAddress, erc20ABI, signer);
  const tokenBContract = new ethers.Contract(tokenBAddress, erc20ABI, signer);

  // Get token decimals
  const decimalsA = await tokenAContract.decimals();
  const decimalsB = await tokenBContract.decimals();
  console.log(`Token A decimals: ${decimalsA}, Token B decimals: ${decimalsB}`);

  // Amounts to deposit (in wei)
  const amountA = ethers.utils.parseUnits(amountOfTokenA, decimalsA);
  const amountB = ethers.utils.parseUnits(amountOfTokenB, decimalsB);

  try {
    // Check initial balances
    let balanceA = await dexContract.getBalance(tokenAAddress);
    let balanceB = await dexContract.getBalance(tokenBAddress);
    console.log(`Initial DEX balance of Token A: ${ethers.utils.formatUnits(balanceA, decimalsA)}`);
    console.log(`Initial DEX balance of Token B: ${ethers.utils.formatUnits(balanceB, decimalsB)}`);

    // Approve tokenA
    console.log('Approving Token A...');
    let tx = await tokenAContract.approve(dexAddress, amountA);
    await tx.wait();
    console.log('Token A approved');

    // Approve tokenB
    console.log('Approving Token B...');
    tx = await tokenBContract.approve(dexAddress, amountB);
    await tx.wait();
    console.log('Token B approved');

    // Deposit additional tokens
    console.log('Depositing additional Token A...');
    tx = await dexContract.deposit(tokenAAddress, amountA);
    await tx.wait();
    console.log('Additional Token A deposited');

    console.log('Depositing additional Token B...');
    tx = await dexContract.deposit(tokenBAddress, amountB);
    await tx.wait();
    console.log('Additional Token B deposited');

    // Check final balances
    balanceA = await dexContract.getBalance(tokenAAddress);
    balanceB = await dexContract.getBalance(tokenBAddress);
    console.log(`Final DEX balance of Token A: ${ethers.utils.formatUnits(balanceA, decimalsA)}`);
    console.log(`Final DEX balance of Token B: ${ethers.utils.formatUnits(balanceB, decimalsB)}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();