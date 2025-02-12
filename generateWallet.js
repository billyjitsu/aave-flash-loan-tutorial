const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Generate a random wallet
const generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    
    const walletDetails = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase
    };
    
    return walletDetails;
};

// Save wallet details to file
const saveWalletToFile = (walletDetails) => {
    try {
        const filePath = path.join(__dirname, 'generated-wallet.json');
        fs.writeFileSync(
            filePath,
            JSON.stringify(walletDetails, null, 2)
        );
        console.log('Wallet details saved to generated-wallet.json');
    } catch (error) {
        console.error('Error saving wallet details:', error);
    }
};

// Generate and display wallet information
const wallet = generateWallet();

console.log('New Ethereum Wallet Generated:');
console.log('=========================');
console.log(`Address: ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);
console.log(`Mnemonic Phrase: ${wallet.mnemonic}`);

// Save wallet details
saveWalletToFile(wallet);

// IMPORTANT: Save these details securely and never share your private key or mnemonic phrase