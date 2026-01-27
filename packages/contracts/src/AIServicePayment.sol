// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AIServicePayment is Ownable, ReentrancyGuard {
    uint256 public constant AI_RATE_PER_SECOND = 0.00001 ether;
    uint256 public constant MIN_BALANCE = 0.0001 ether;

    struct StreamPayment {
        address user;
        uint256 startTime;
        uint256 ratePerSecond;
        uint256 balance;
        bool active;
    }

    mapping(address => StreamPayment) public streams;

    event ConsultationStarted(address indexed user, uint256 timestamp, uint256 balance);
    event ConsultationEnded(address indexed user, uint256 duration, uint256 cost, uint256 refund);
    event BalanceAdded(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function startAIConsultation() external payable nonReentrant {
        require(msg.value >= MIN_BALANCE, "Insufficient balance");
        require(!streams[msg.sender].active, "Consultation already active");

        streams[msg.sender] = StreamPayment({
            user: msg.sender,
            startTime: block.timestamp,
            ratePerSecond: AI_RATE_PER_SECOND,
            balance: msg.value,
            active: true
        });

        emit ConsultationStarted(msg.sender, block.timestamp, msg.value);
    }

    function stopAIConsultation() external nonReentrant {
        StreamPayment storage stream = streams[msg.sender];
        require(stream.active, "No active consultation");

        uint256 duration = block.timestamp - stream.startTime;
        uint256 cost = duration * stream.ratePerSecond;

        // Ensure cost doesn't exceed balance
        if (cost > stream.balance) {
            cost = stream.balance;
        }

        uint256 refund = stream.balance - cost;

        stream.active = false;
        stream.balance = 0;

        // Transfer refund if any
        if (refund > 0) {
            (bool success, ) = payable(msg.sender).call{value: refund}("");
            require(success, "Refund transfer failed");
        }

        emit ConsultationEnded(msg.sender, duration, cost, refund);
    }

    function addBalance() external payable nonReentrant {
        require(streams[msg.sender].active, "No active consultation");
        require(msg.value > 0, "Must send ETH");

        streams[msg.sender].balance += msg.value;

        emit BalanceAdded(msg.sender, msg.value);
    }

    function getStreamInfo(address user)
        external
        view
        returns (
            address userAddress,
            uint256 startTime,
            uint256 ratePerSecond,
            uint256 balance,
            bool active
        )
    {
        StreamPayment memory stream = streams[user];
        return (
            stream.user,
            stream.startTime,
            stream.ratePerSecond,
            stream.balance,
            stream.active
        );
    }

    function getCurrentCost(address user) external view returns (uint256) {
        StreamPayment memory stream = streams[user];
        if (!stream.active) {
            return 0;
        }

        uint256 duration = block.timestamp - stream.startTime;
        uint256 cost = duration * stream.ratePerSecond;

        return cost > stream.balance ? stream.balance : cost;
    }

    function getRemainingBalance(address user) external view returns (uint256) {
        StreamPayment memory stream = streams[user];
        if (!stream.active) {
            return 0;
        }

        uint256 duration = block.timestamp - stream.startTime;
        uint256 cost = duration * stream.ratePerSecond;

        if (cost >= stream.balance) {
            return 0;
        }

        return stream.balance - cost;
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    receive() external payable {}
}
