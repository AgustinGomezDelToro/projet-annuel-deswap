// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ERC20.sol";

contract MyERC20Test is Test {
    MyToken private myToken;

    function setUp() public {
        myToken = new MyToken("Test Token", "TST", 1000000 * 10 ** 18); // Asegúrate de incluir el suministro inicial
    }

    function testInitialMint() public {
        uint256 expectedSupply = 1000000 * 10 ** myToken.decimals();
        assertEq(myToken.totalSupply(), expectedSupply, "Initial supply should be minted to the creator.");
    }
}
