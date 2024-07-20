// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Staking.sol";
import "./MockESGIDex.sol"; // Import the MockESGIDex contract

contract StakingTest is Test {
    Staking public stakingContract;
    MockESGIDex public esgiDex; // Mock ESGIDex contract
    address public user = address(1);

    function setUp() public {
        esgiDex = new MockESGIDex(); // Deploy the mock ESGIDex contract
        stakingContract = new Staking(1e16, address(this), payable(address(esgiDex))); // Initialize staking contract with mock ESGIDex
        vm.deal(user, 100 ether); // Assign 100 ether to user for tests
    }

    function testStake() public {
        vm.startPrank(user);
        uint256 amount = 10 ether;
        stakingContract.stake{value: amount}();
        assertEq(stakingContract.getAmountStaked(user), amount);
        assertEq(address(stakingContract).balance, amount);
        vm.stopPrank();
    }

    function testUnstake() public {
        vm.startPrank(user);
        uint256 amount = 10 ether;
        stakingContract.stake{value: amount}();

        console.log("Balance after staking:", stakingContract.getAmountStaked(user));
        console.log("Total supply after staking:", stakingContract.getAllEthStaked());

        vm.deal(address(stakingContract), amount);

        stakingContract.unstake(amount);

        console.log("Balance after unstaking:", stakingContract.getAmountStaked(user));
        console.log("Total supply after unstaking:", stakingContract.getAllEthStaked());

        assertEq(stakingContract.getAmountStaked(user), 0);
        assertEq(address(stakingContract).balance, 0);
        vm.stopPrank();
    }

    function testClaimRewards() public {
        vm.startPrank(user);
        uint256 amount = 10 ether;
        stakingContract.stake{value: amount}();
        uint256 initialBalance = user.balance;

        // Advance time to generate rewards
        vm.warp(block.timestamp + 1 days);

        uint256 reward = stakingContract.stakes(user).rewardDebt;
        console.log("Reward earned after 1 day:", reward);

        // Ensure the contract has enough funds to pay rewards
        vm.deal(address(stakingContract), reward);

        stakingContract.claimRewards();

        // Verify rewards are paid
        uint256 newBalance = user.balance;
        console.log("User balance after claiming reward:", newBalance);
        console.log("Contract balance after claiming reward:", address(stakingContract).balance);

        assertGt(newBalance, initialBalance); // Balance after claim should be greater
        vm.stopPrank();
    }

    function testSetRewardRate() public {
        vm.startPrank(address(esgiDex)); // Use mock ESGIDex address
        stakingContract.setRewardRate(2e16); // 2% per day
        assertEq(stakingContract.rewardRate(), 2e16);
        vm.stopPrank();
    }
}
