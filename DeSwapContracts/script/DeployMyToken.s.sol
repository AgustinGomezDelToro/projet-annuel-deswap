// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ERC20.sol";

contract DeployMyToken is Script {
    function run() external {
        vm.startBroadcast();

        MyToken myToken = new MyToken("RMCF", "Real Madrid", 2500000 * 10 ** 18);

        console.log("Contract Address:", address(myToken));
        console.log("Token name:", myToken.name());
        console.log("Token symbol:", myToken.symbol());
        console.log("Token total supply:", myToken.totalSupply());

        vm.stopBroadcast();
    }
}
