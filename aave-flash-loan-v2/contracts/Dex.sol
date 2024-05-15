// contracts/FlashLoan.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import {IERC20} from "@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract Dex {
    address payable public owner;

    // Aave ERC20 Token addresses on Goerli network
    address private daiAddress =
        0x51BC2DfB9D12d9dB50C855A5330fBA0faF761D15;  // DAI on Ava Fuji Aave V2
    address private usdtAddress =
        0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e;  // usdt on Ava Fuji Aave V2

    IERC20 private dai;
    IERC20 private usdt;

    // exchange rate indexes
    uint256 dexARate = 90;
    uint256 dexBRate = 100;

    // keeps track of individuals' dai balances
    mapping(address => uint256) public daiBalances;

    // keeps track of individuals' usdt balances
    mapping(address => uint256) public usdtBalances;

    constructor() public {
        owner = payable(msg.sender);
        dai = IERC20(daiAddress);
        usdt = IERC20(usdtAddress);
    }

    function depositUSDT(uint256 _amount) external {
        usdtBalances[msg.sender] += _amount;
        uint256 allowance = usdt.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        usdt.transferFrom(msg.sender, address(this), _amount);
    }

    function depositDAI(uint256 _amount) external {
        daiBalances[msg.sender] += _amount;
        uint256 allowance = dai.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        dai.transferFrom(msg.sender, address(this), _amount);
    }

    function buyDAI() external {
        uint256 daiToReceive = ((usdtBalances[msg.sender] / dexARate) * 100) *
            (10**12);
        dai.transfer(msg.sender, daiToReceive);
    }

    function sellDAI() external {
        uint256 usdtToReceive = ((daiBalances[msg.sender] * dexBRate) / 100) /
            (10**12);
        usdt.transfer(msg.sender, usdtToReceive);
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
