// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LendingBorrowingContract {
    IERC20 public borrowToken; // LINK token as the borrowable token

    AggregatorV3Interface internal avaxFeed; // Chainlink Price Feed for AVAX/USD
    AggregatorV3Interface internal linkFeed; // Chainlink Price Feed for LINK/USD

    uint256 public collateralRate; // Percentage of collateral required to borrow
    uint256 public interestRate; // Interest rate per period

    struct BorrowerInfo {
        uint256 collateralDeposited; // In terms of AVAX
        uint256 tokensBorrowed; // In terms of LINK
        uint256 interestOwed; // In terms of LINK
    }

    mapping(address => BorrowerInfo) public borrowers;

    event DepositCollateral(address indexed borrower, uint256 amount);
    event WithdrawCollateral(address indexed borrower, uint256 amount);
    event BorrowTokens(address indexed borrower, uint256 amount);
    event RepayLoan(address indexed borrower, uint256 amount);

    // collateralRate is currently hard coded at 150% and interestRate is hardcoded to 2% 
    // These values should be optimized in the future through a proper asset specifc risk analysis 
    constructor() {
        borrowToken = IERC20(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
        collateralRate = 150;
        interestRate = 20000000000000000000;
        linkFeed = AggregatorV3Interface(0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470);
        avaxFeed = AggregatorV3Interface(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD);
    }

    // Function to get the latest price of Avax/USD from Chainlink
    function getLatestAvaxPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = avaxFeed.latestRoundData();
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    // Function to get the latest price of LINK/USD from Chainlink
    function getLatestLinkPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = linkFeed.latestRoundData();
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    // Function to receive AVAX as collateral
    function depositCollateral() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        borrowers[msg.sender].collateralDeposited += msg.value;
        emit DepositCollateral(msg.sender, msg.value);
    }

    function withdrawCollateral(uint256 amount) external {
        require(amount <= borrowers[msg.sender].collateralDeposited, "Not enough collateral deposited");
        uint256 maxWithdraw = getMaxWithdrawal(msg.sender);
        require(amount <= maxWithdraw, "Withdrawal request exceeds maximum allowed");

        borrowers[msg.sender].collateralDeposited -= amount;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send AVAX");
        emit WithdrawCollateral(msg.sender, amount);
    }

    function borrowTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        uint256 maxBorrow = getMaxBorrowable(msg.sender);
        require(amount <= maxBorrow, "Borrow amount exceeds limit");

        borrowers[msg.sender].tokensBorrowed += amount;
        borrowers[msg.sender].interestOwed += (amount * interestRate) / 100;
        require(borrowToken.transfer(msg.sender, amount), "Transfer failed");
        emit BorrowTokens(msg.sender, amount);
    }

    function repayLoan(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        BorrowerInfo storage borrower = borrowers[msg.sender];
        uint256 owed = borrower.tokensBorrowed + borrower.interestOwed;
        require(amount <= owed, "Repay amount exceeds loan owed");

        if (amount >= borrower.interestOwed) {
            amount -= borrower.interestOwed;
            borrower.interestOwed = 0;
            borrower.tokensBorrowed -= amount;
        } else {
            borrower.interestOwed -= amount;
        }

        require(borrowToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit RepayLoan(msg.sender, amount);
    }

    function getMaxWithdrawal(address borrower) public view returns (uint256) {
        BorrowerInfo memory info = borrowers[borrower];
        uint256 maxBorrowableUSD = getMaxBorrowable(borrower);
        uint256 collateralValueUSD = info.collateralDeposited * uint256(getLatestAvaxPrice()) / 1e8;
        uint256 borrowedAmountUSD = info.tokensBorrowed * uint256(getLatestLinkPrice()) / 1e8;

        if (borrowedAmountUSD >= maxBorrowableUSD) {
            return 0;
        }
        // Calculating the remaining collateral in USD
        uint256 remainingCollateralUSD = collateralValueUSD - borrowedAmountUSD;
        // Convert remainingCollateralUSD back to AVAX using the inverse of the current AVAX/USD price
        uint256 collateralPriceUSD = uint256(getLatestAvaxPrice());
        require(collateralPriceUSD > 0, "Invalid collateral price");
        uint256 remainingCollateral = (remainingCollateralUSD * 1e8) / collateralPriceUSD;
        // Assuming that the collateral is in AVAX and we need to withdraw in AVAX
        return remainingCollateral;
    }

    function getMaxBorrowable(address borrower) public view returns (uint256) {
        uint256 collateralValueUSD = borrowers[borrower].collateralDeposited * uint256(getLatestAvaxPrice()) / 1e8;
        return (collateralValueUSD * collateralRate) / 100;
    }

    // Function to get the current balance of LINK tokens held by the contract for a user
    function getBorrowerBalance(address borrower) public view returns (uint256) {
        return borrowers[borrower].tokensBorrowed;
    }
}
