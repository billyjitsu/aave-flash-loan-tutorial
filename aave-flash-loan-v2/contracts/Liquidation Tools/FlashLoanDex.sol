// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import {FlashLoanReceiverBase} from "@aave/protocol-v2/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import {ILendingPool} from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import {ILendingPoolAddressesProvider} from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import {IERC20} from "@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

interface IGenericDex {
    function swap(address _fromToken, address _toToken, uint256 _amount) external;
    function getBalance(address _token) external view returns (uint256);
}

contract FlashLoanWithDex is FlashLoanReceiverBase {
    address payable public owner;
    IGenericDex public dex;

    constructor(address _addressProvider, address _dexAddress)
        public
        FlashLoanReceiverBase(ILendingPoolAddressesProvider(_addressProvider))
    {
        owner = payable(msg.sender);
        dex = IGenericDex(_dexAddress);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(assets.length == 1, "This contract expects one asset");
        
        // Decode the params to get the target token address
        address targetToken = abi.decode(params, (address));

        // Perform the swap on the DEX
        IERC20(assets[0]).approve(address(dex), amounts[0]);
        dex.swap(assets[0], targetToken, amounts[0]);

        // Swap back to repay the flash loan
        uint256 swappedAmount = IERC20(targetToken).balanceOf(address(this));
        IERC20(targetToken).approve(address(dex), swappedAmount);
        dex.swap(targetToken, assets[0], swappedAmount);

        // Approve the LendingPool contract allowance to pull the owed amount
        uint256 amountOwing = amounts[0].add(premiums[0]);
        IERC20(assets[0]).approve(address(LENDING_POOL), amountOwing);

        return true;
    }
                            // the token we want to pay back                    // the token we want to receive
    function requestFlashLoan(address _assetToFlashLoan, uint256 _amount, address _targetToken) external onlyOwner {
        address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = _assetToFlashLoan;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _amount;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = abi.encode(_targetToken);
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    receive() external payable {}
}