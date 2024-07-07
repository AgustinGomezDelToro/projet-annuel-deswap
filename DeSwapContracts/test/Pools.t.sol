// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DeSwapPools} from "../src/Pools.sol";
import {DeSwapFactory} from "../src/Factory.sol";

contract TokenA is ERC20 {
    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, 3000);
    }
}

contract TokenB is ERC20 {
    constructor() ERC20("TokenB", "TKB") {
        _mint(msg.sender, 5000);
    }
}

contract DeSwapPoolsTest is Test {
    DeSwapPools public deSwapPools;
    ERC20 public tokenA;
    ERC20 public tokenB;
    DeSwapFactory public factory;

    function setUp() public {
        tokenA = new TokenA();
        tokenB = new TokenB();
        factory = new DeSwapFactory();

        deSwapPools = new DeSwapPools(tokenA, tokenB, address(factory));
        tokenA.approve(address(deSwapPools), 1000);
        tokenB.approve(address(deSwapPools), 2000);
        deSwapPools.initPool(1000, 2000);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 1000);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 2000);
        assertEq(deSwapPools.k(), 2000000);
    }

    function test_AddLiquidity() public {
        tokenA.approve(address(deSwapPools), 1000);
        tokenB.approve(address(deSwapPools), 2000);
        deSwapPools.addLiquidity(1000, 2000);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 2000);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 4000);
    }

    function test_GetRateAforB() public {
        uint256 expectedRate = 2 * 10 ** tokenA.decimals();
        assertEq(deSwapPools.getRateAforB(), expectedRate);
    }

    function test_GetRateBforA() public {
        uint256 expectedRate = (5 * 10 ** tokenB.decimals()) / 10;
        assertEq(deSwapPools.getRateBforA(), expectedRate);
    }

    function test_SwapAforB() public {
    uint256 initialTokenA = tokenA.balanceOf(address(deSwapPools));
    uint256 initialTokenB = tokenB.balanceOf(address(deSwapPools));

    uint256 amountB = deSwapPools.getExactTokenB(50);
    console2.log("Amount of B to receive for 50 A:", amountB);
    tokenA.approve(address(deSwapPools), 1000);
    deSwapPools.swapAforB(50);

    uint256 expectedTokenA = initialTokenA + 50;
    uint256 expectedTokenB = initialTokenB - (amountB * (100 - factory.getFees()) / 100);

    uint256 actualTokenA = tokenA.balanceOf(address(deSwapPools));
    uint256 actualTokenB = tokenB.balanceOf(address(deSwapPools));

    console2.log("Initial TokenA balance:", initialTokenA);
    console2.log("Initial TokenB balance:", initialTokenB);
    console2.log("Expected TokenA balance:", expectedTokenA);
    console2.log("Actual TokenA balance:", actualTokenA);
    console2.log("Expected TokenB balance:", expectedTokenB);
    console2.log("Actual TokenB balance:", actualTokenB);

    assertApproxEq(actualTokenA, expectedTokenA, 10);
    assertApproxEq(actualTokenB, expectedTokenB, 10);
}

function test_SwapBforA() public {
    uint256 initialTokenA = tokenA.balanceOf(address(deSwapPools));
    uint256 initialTokenB = tokenB.balanceOf(address(deSwapPools));

    uint256 amountA = deSwapPools.getExactTokenA(50);
    console2.log("Amount of A to receive for 50 B:", amountA);
    tokenB.approve(address(deSwapPools), 1000);
    deSwapPools.swapBforA(50);

    uint256 expectedTokenB = initialTokenB + 50;
    uint256 expectedTokenA = initialTokenA - (amountA * (100 - factory.getFees()) / 100);

    uint256 actualTokenA = tokenA.balanceOf(address(deSwapPools));
    uint256 actualTokenB = tokenB.balanceOf(address(deSwapPools));

    console2.log("Initial TokenA balance:", initialTokenA);
    console2.log("Initial TokenB balance:", initialTokenB);
    console2.log("Expected TokenA balance:", expectedTokenA);
    console2.log("Actual TokenA balance:", actualTokenA);
    console2.log("Expected TokenB balance:", expectedTokenB);
    console2.log("Actual TokenB balance:", actualTokenB);

    assertApproxEq(actualTokenA, expectedTokenA, 10);
    assertApproxEq(actualTokenB, expectedTokenB, 10);
}

function assertApproxEq(uint256 a, uint256 b, uint256 tolerance) internal view {
    uint256 diff = a > b ? a - b : b - a;
    console2.log("Difference:", diff);
    console2.log("Tolerance:", tolerance);
    require(diff <= tolerance, "Values are not within tolerance");
}

}
