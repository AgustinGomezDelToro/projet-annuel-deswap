// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract DeployDeSwapFactory is Script {
    function run() external {
        uint256 maxPriorityFeePerGas = 2 gwei;
        uint256 maxFeePerGas = 3 gwei;

        vm.startBroadcast();

        // Desplegar el contrato DeSwapFactory con la dirección del propietario
        DeSwapFactory factory = new DeSwapFactory(msg.sender);

        vm.stopBroadcast();
    }
}
