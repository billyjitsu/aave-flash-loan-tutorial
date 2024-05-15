# Flash Loan Tutorial
Create an Aave Flash Loan arbitrage smart contract demonstrating both v2 and v3 versions.  

# Aave v2 Flash Loan Information:
https://docs.aave.com/developers/v/2.0/guides/flash-loans
https://docs.aave.com/developers/v/2.0/deployed-contracts/avalanche-market

### DAI Testnet ERC20 
#### (Must Mint from Contract - Avalanche Fuji Testnet):
- 0x51BC2DfB9D12d9dB50C855A5330fBA0faF761D15

### USDT Testnet ERC20 
#### (Must Mint from Contract- Avalanche Fuji Testnet):
- 0x02823f9B469960Bb3b1de0B3746D4b95B7E35543

### AAVE PoolAddressProvider 
#### (Avalanche Fuji Testnet):
- 0x7fdC1FdF79BE3309bf82f4abdAD9f111A6590C0f

### Sample Dex.sol deployed 
#### (Avalanche Fuji Testnet): 
- 0xD6e8c479B6B62d8Ce985C0f686D39e96af9424df

### Suggested liquidity to add to Dex.sol:
- USDC 1500
- DAI  1500

### Approve:
- USDC 1000000000
- DAI  1200000000000000000000

## Request Loan - USDC (6 decimal):
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000000 // 1,000 USDC
0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43,1000000   // 1 USDC

## FlashLoan test Only Steps

## Steps

- Step 1. Deploy your dex
- Step 2. Make sure to add liquidity to your dex
- Step 3. Deploy your flashloan contract
- Step 3. Make sure approvals are set on Flashloan contract
- Step 4. Request a loan for 1,000,000 USDT (hardcoded)
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