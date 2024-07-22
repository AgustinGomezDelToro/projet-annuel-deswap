// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Staking.sol";

contract DeployStaking is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the MockESGIDex contract first
        MockESGIDex esgiDex = new MockESGIDex();

        // Deploy the Staking contract with the reward rate, owner, and ESGIDex address
        Staking stakingContract = new Staking(1e16, msg.sender, payable(address(esgiDex)));

        // Send initial funding to the staking contract
        payable(address(stakingContract)).transfer(100 ether);

        console.log("Staking contract deployed at:", address(stakingContract));

        vm.stopBroadcast();
    }
}
