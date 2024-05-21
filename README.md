# Flash Loan Tutorial
Create an Aave Flash Loan arbitrage smart contract demonstrating both v2 and v3 versions.  

# Aave v2 Flash Loan Information:
https://docs.aave.com/developers/v/2.0/guides/flash-loans
https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts

### DAI Forked Mainnet ERC20 
#### (Fund Account for Forked Tenderly Interface):
- 0x6B175474E89094C44Da98b954EedeAC495271d0F

### USDC Testnet ERC20 
#### (Fund Account for Forked Tenderly Interface):
- 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

### AAVE PoolAddressProvider 
#### (Forked Mainnet):
- 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5

The Dex will alway have a profit in the swap when you swap USDC to DAI (10%) so when you do the flashloan the trade will always be beneficial and will have extra USDC to pay the Aave flashloan fee when the transation is completed.

### Suggested liquidity to add to Dex.sol:
- USDC 10000
- DAI  10000

### Approve:
- USDC 1000000000
- DAI  1000000000000000000000

### Note!:
- When swapping USDC, your contract will try to sell the profited DAI which will be a higher amount.  You must check how much the profit will be to know how much to approve to swap the DAI back to the USDC. There is a function `previewDAISwap` that will let you preview the swap amount so you know the amount to approve for the flashloan contract for the dex.

## Request Loan - USDC (6 decimal):
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000000 // 1,000 USDC
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000   // 1 USDC

## FlashLoan test Only Steps

## Testing just flashloan.sol contract
- Step 1. Deploy your flashloan contract
- Step 2. Fund you flashloan contract with some USDC (need to pay back the Flashloan fee)
- Step 3. Request a loan for any amount of USDC (start with a 1 dollar to make sure it works)

## Steps to perform Arbitrage

- Step 1. Deploy your dex
- Step 2. Make sure to add liquidity to your dex (DAI and USDC)
- Step 3. Deploy your flashloan contract
- Step 3. Make sure approvals are set on Flashloan contract
- Step 4. Request a loan for any amount of USDC (not more than your liquidity)
- Step 5. See the results



# Aave v3 Flash Loan Information:
https://docs.aave.com/developers/guides/flash-loans
https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses

## DAI Testnet ERC20 Must Mint from Contract (Avalanche Fuji Testnet):
0x51BC2DfB9D12d9dB50C855A5330fBA0faF761D15

## USDT Testnet ERC20 Must Mint from Contract (Avalanche Fuji Testnet):
0x02823f9B469960Bb3b1de0B3746D4b95B7E35543

## AAVE PoolAddressProvider (Avalanche Fuji Testnet):
0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f

## Sample Dex.sol deployed (Avalanche Fuji Testnet): 
0xD6e8c479B6B62d8Ce985C0f686D39e96af9424df

## Suggested liquidity to add to Dex.sol:
USDC 1500
DAI  1500

## Approve:
USDC 1000000000
DAI  1200000000000000000000

## Request Loan - USDC (6 decimal):
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000000 // 1,000 USDC
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000   // 1 USDC


#### Forked from the work of:
https://github.com/jspruance/aave-flash-loan-tutorial