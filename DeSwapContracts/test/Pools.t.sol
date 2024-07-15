// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DeSwapPools} from "../src/Pools.sol";
import {DeSwapFactory} from "../src/Factory.sol";

contract TokenA is ERC20 {
    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, 3000 ether);
    }
}

contract TokenB is ERC20 {
    constructor() ERC20("TokenB", "TKB") {
        _mint(msg.sender, 5000 ether);
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
        factory = new DeSwapFactory(address(this));

        deSwapPools = new DeSwapPools(tokenA, tokenB, address(factory), 1000 ether, 2000 ether);
        tokenA.transfer(address(deSwapPools), 1000 ether);
        tokenB.transfer(address(deSwapPools), 2000 ether);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 1000 ether);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 2000 ether);
        assertEq(deSwapPools.k(), 2000000 ether);
    }

    function test_AddLiquidity() public {
        tokenA.approve(address(deSwapPools), 1000 ether);
        tokenB.approve(address(deSwapPools), 2000 ether);
        deSwapPools.addLiquidity(1000 ether, 2000 ether);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 2000 ether);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 4000 ether);
    }

    function test_GetRateAforB() public {
        assertEq(deSwapPools.getRateAforB(), 2 * 10 ** tokenA.decimals());
    }

    function test_GetRateBforA() public {
        assertEq(deSwapPools.getRateBforA(), (5 * 10 ** tokenB.decimals()) / 10);
    }

    function test_SwapAforB() public {
        uint256 initialTokenA = tokenA.balanceOf(address(deSwapPools));

        tokenA.approve(address(deSwapPools), 1000);
        deSwapPools.swap(50, address(tokenA));
        assertEq(tokenA.balanceOf(address(deSwapPools)), initialTokenA + 50);
    }

    function test_SwapBforA() public {
        uint256 initialTokenB = tokenB.balanceOf(address(deSwapPools));

        tokenB.approve(address(deSwapPools), 1000);
        deSwapPools.swap(50, address(tokenB));
        assertEq(tokenB.balanceOf(address(deSwapPools)), initialTokenB + 50);
    }

    function test_RemoveLiquidity() public {
        tokenA.approve(address(deSwapPools), 1000 ether);
        tokenB.approve(address(deSwapPools), 2000 ether);
        deSwapPools.addLiquidity(1000 ether, 2000 ether);

        deSwapPools.removeLiquidity(500 ether, 1000 ether);
        assertEq(tokenA.balanceOf(address(this)), 500 ether + 1000 ether);
        assertEq(tokenB.balanceOf(address(this)), 1000 ether + 1000 ether);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 1500 ether);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 3000 ether);

        deSwapPools.removeLiquidity(500 ether, 1000 ether);
        assertEq(tokenA.balanceOf(address(this)), 500 ether + 1500 ether);
        assertEq(tokenB.balanceOf(address(this)), 1000 ether + 2000 ether);
        assertEq(tokenA.balanceOf(address(deSwapPools)), 1000 ether);
        assertEq(tokenB.balanceOf(address(deSwapPools)), 2000 ether);
    }

    function test_DistributeFeesToLiquidityProviders() public {
        tokenA.approve(address(deSwapPools), 1000 ether);
        tokenB.approve(address(deSwapPools), 2000 ether);
        deSwapPools.addLiquidity(1000 ether, 2000 ether);

        tokenA.approve(address(deSwapPools), 100 ether);
        deSwapPools.swap(100 ether, address(tokenA));

        uint256 totalFeesBefore = deSwapPools.totalFeesB();
        assert(totalFeesBefore > 0);
    }

    function test_ClaimFees() public {
        tokenA.approve(address(deSwapPools), 1000 ether);
        tokenB.approve(address(deSwapPools), 2000 ether);
        deSwapPools.addLiquidity(1000 ether, 2000 ether);

        tokenA.approve(address(deSwapPools), 100 ether);
        deSwapPools.swap(100 ether, address(tokenA));

        uint256 initialBalanceB = tokenB.balanceOf(address(this));
        deSwapPools.claim();

        uint256 finalBalanceB = tokenB.balanceOf(address(this));
        assert(finalBalanceB > initialBalanceB);
    }

    function test_ClosePool() public {
        // Only factory can close the pool
        vm.prank(address(factory));
        deSwapPools.closePool();
        assert(deSwapPools.getStatus());

        // Ensure no one can add liquidity to a closed pool
        tokenA.approve(address(deSwapPools), 1000 ether);
        tokenB.approve(address(deSwapPools), 2000 ether);
        vm.expectRevert("Pool is closed");
        deSwapPools.addLiquidity(1000 ether, 2000 ether);
    }

    function test_GetExactToken() public {
        uint256 amountFrom = 100 ether;
        uint256 expectedAmountB = deSwapPools.getExactToken(amountFrom, address(tokenA));
        assertEq(expectedAmountB, (2000 ether * amountFrom) / 1000 ether, "Expected amount of tokenB");

        uint256 expectedAmountA = deSwapPools.getExactToken(amountFrom, address(tokenB));
        assertEq(expectedAmountA, (1000 ether * amountFrom) / 2000 ether, "Expected amount of tokenA");
    }
}
