// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/StakingContract.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract StakingContractTest is Test {
    MockToken public stakingToken;
    StakingContract public stakingContract;
    address public user = address(1);
    address public feeCollector = address(2);

    function setUp() public {
        stakingToken = new MockToken();
        stakingContract = new StakingContract(address(stakingToken), feeCollector);
        stakingToken.transfer(user, 1000 * 10 ** 18);
    }

    function testStake() public {
        vm.startPrank(user);
        stakingToken.approve(address(stakingContract), 500 * 10 ** 18);
        stakingContract.stake(500 * 10 ** 18);
        uint256 fee = (500 * 10 ** 18) / 100;
        uint256 stakedAmount = 500 * 10 ** 18 - fee;
        assertEq(stakingToken.balanceOf(user), 1000 * 10 ** 18 - 500 * 10 ** 18);
        assertEq(stakingContract.stakingBalance(user), stakedAmount);
        assertEq(stakingToken.balanceOf(feeCollector), fee);
        vm.stopPrank();
    }

    function testWithdraw() public {
        vm.startPrank(user);
        stakingToken.approve(address(stakingContract), 500 * 10 ** 18);
        stakingContract.stake(500 * 10 ** 18);
        uint256 stakeFee = (500 * 10 ** 18) / 100;
        uint256 stakedAmount = 500 * 10 ** 18 - stakeFee;
        stakingContract.withdraw(200 * 10 ** 18);
        uint256 withdrawFee = (200 * 10 ** 18) / 100;
        uint256 withdrawnAmount = 200 * 10 ** 18 - withdrawFee;
        uint256 remainingStake = stakedAmount - 200 * 10 ** 18;
        assertEq(stakingToken.balanceOf(user), 1000 * 10 ** 18 - 500 * 10 ** 18 + withdrawnAmount);
        assertEq(stakingContract.stakingBalance(user), remainingStake);
        assertEq(stakingToken.balanceOf(feeCollector), stakeFee + withdrawFee);
        vm.stopPrank();
    }

    function testGetReward() public {
        vm.startPrank(user);
        stakingToken.approve(address(stakingContract), 500 * 10 ** 18);
        stakingContract.stake(500 * 10 ** 18);

        // Calculate fee on stake
        uint256 stakeFee = (500 * 10 ** 18) / 100;
        uint256 stakedAmount = 500 * 10 ** 18 - stakeFee;

        // Advance 10 blocks
        vm.roll(block.number + 10);

        // Access the rewardRate from the stakingContract instance
        uint256 rewardRate = stakingContract.getRewardRate();  // Using the method to get the current reward rate

        // Calculate the expected reward
        uint256 reward = stakedAmount * 10 * rewardRate;  // Correct usage of the reward rate

        // Ensure the contract has enough tokens to pay the reward
        stakingToken.mint(address(stakingContract), reward);

        stakingContract.getReward();

        // Verify the user's balance is updated correctly after receiving the reward
        assertEq(stakingToken.balanceOf(user), 1000 * 10 ** 18 - 500 * 10 ** 18 + reward);
        assertEq(stakingContract.rewards(user), 0);  // Ensure the rewards are reset after claiming
        vm.stopPrank();
    }



    function testFeeCollection() public {
        vm.startPrank(user);
        stakingToken.approve(address(stakingContract), 500 * 10 ** 18);
        stakingContract.stake(500 * 10 ** 18);
        uint256 stakeFee = (500 * 10 ** 18) / 100;
        assertEq(stakingToken.balanceOf(feeCollector), stakeFee);
        stakingContract.withdraw(200 * 10 ** 18);
        uint256 withdrawFee = (200 * 10 ** 18) / 100;
        assertEq(stakingToken.balanceOf(feeCollector), stakeFee + withdrawFee);
        vm.stopPrank();
    }
}
