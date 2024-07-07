// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingContract {
    IERC20 public stakingToken;
    address public feeCollector;
    uint256 public rewardRate = 100; // Simplified fixed reward rate for example
    uint256 public feeRate = 1; // Fee rate as a percentage

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public lastUpdateBlock;
    mapping(address => uint256) public rewards;

    constructor(address _stakingToken, address _feeCollector) {
        stakingToken = IERC20(_stakingToken);
        feeCollector = _feeCollector;
    }

    function setFeeRate(uint256 _feeRate) external {
        require(msg.sender == feeCollector, "Only fee collector can set fee rate");
        feeRate = _feeRate;
    }

    function stake(uint256 _amount) external {
        updateReward(msg.sender);
        uint256 fee = (_amount * feeRate) / 100;
        uint256 amountAfterFee = _amount - fee;
        stakingToken.transferFrom(msg.sender, feeCollector, fee);
        stakingToken.transferFrom(msg.sender, address(this), amountAfterFee);
        stakingBalance[msg.sender] += amountAfterFee;
        lastUpdateBlock[msg.sender] = block.number;
    }

    // Rename function to getRewardRate
    function getRewardRate() public view returns (uint256) {
        return rewardRate;
    }

    function withdraw(uint256 _amount) external {
        require(stakingBalance[msg.sender] >= _amount, "Insufficient balance");
        updateReward(msg.sender);
        uint256 fee = (_amount * feeRate) / 100;
        uint256 amountAfterFee = _amount - fee;
        stakingBalance[msg.sender] -= _amount;
        stakingToken.transfer(feeCollector, fee);
        stakingToken.transfer(msg.sender, amountAfterFee);
    }

    function getReward() external {
        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        stakingToken.transfer(msg.sender, reward);
    }

    function updateReward(address _user) internal {
        rewards[_user] += earned(_user);
        lastUpdateBlock[_user] = block.number;
    }

    function earned(address _user) public view returns (uint256) {
        uint256 blockDiff = block.number - lastUpdateBlock[_user];
        return stakingBalance[_user] * blockDiff * rewardRate;
    }
}
