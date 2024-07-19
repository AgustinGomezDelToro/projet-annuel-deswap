// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract DeSwapStaking is Ownable, ReentrancyGuard {

    uint256 public dailyRewardRate = 0.0001 * 10 ** 18; // 0.01% per day

    struct Stake {
        uint256 amount;
        uint256 reward;
        uint256 lastUpdateTime;
    }

    uint256 public totalSupply;
    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor() Ownable(msg.sender) { }

    modifier updateReward(address account) {
        stakes[account].reward = earned(account);
        stakes[account].lastUpdateTime = block.timestamp;
        _;
    }

    function stake() external updateReward(msg.sender) payable {
        require(msg.value > 0, "Cannot stake 0");
        stakes[msg.sender].amount += msg.value;
        totalSupply += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external updateReward(msg.sender) nonReentrant {
        require(amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient balance");
        stakes[msg.sender].amount -= amount;
        totalSupply -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claim() external updateReward(msg.sender) nonReentrant {
        uint256 reward = stakes[msg.sender].reward;
        require(reward > 0, "No reward");
        stakes[msg.sender].reward = 0;
        payable(msg.sender).transfer(reward);
        emit RewardPaid(msg.sender, reward);
    }

    function setDailyRewardRate(uint256 _dailyRewardRate) external onlyOwner {
        dailyRewardRate = _dailyRewardRate;
    }

    function balanceOf(address account) external view returns (uint256) {
        return stakes[account].amount;
    }

    function earned(address account) public view returns (uint256) {
        uint256 stakedTime = block.timestamp - stakes[account].lastUpdateTime;
        uint256 dailyRate = dailyRewardRate;
        uint256 reward = stakes[account].reward;
        return ((stakes[account].amount * stakedTime * dailyRate / 1e18) / 86400) + reward;
    }
}