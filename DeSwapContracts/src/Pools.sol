// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IFactory.sol";

contract DeSwapPools {
    ERC20 tokenA;
    ERC20 tokenB;
    uint public k; // Constant used to calculate the price (tokenA * tokenB = k)
    IDeSwapFactory factory;

    constructor(ERC20 _tokenA, ERC20 _tokenB, address _factory){
        tokenA = _tokenA;
        tokenB = _tokenB;
        factory = IDeSwapFactory(_factory);
    }

    function initPool(uint256 _amountA, uint256 _amountB) external {
        require(k == 0, "Pool already initialized");
        k = _amountA * _amountB;
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
    }

    function addLiquidity(uint256 _amountA, uint256 _amountB) public {
        require(_amountA > 0 && _amountB > 0, "Amounts must be greater than zero");
        require(tokenA.allowance(msg.sender, address(this)) >= _amountA, "no allowance for tokenA");
        require(tokenB.allowance(msg.sender, address(this)) >= _amountB, "no allowance for tokenB");

        uint256 currentSupplyA = getSupplyA();
        uint256 currentSupplyB = getSupplyB();

        uint256 newSupplyA = currentSupplyA + _amountA;
        uint256 newSupplyB = currentSupplyB + _amountB;
        
        require(newSupplyA * newSupplyB >= k, "The ratio is bad"); // Check that the new product is at least k

        k = newSupplyA * newSupplyB; // Update k
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
    }

    function swapAforB(uint256 _amountA) external {
        require(tokenA.allowance(msg.sender, address(this)) >= _amountA, "no allowance for tokenA");
        uint256 _amountB = getExactTokenB(_amountA);
        uint256 fees = factory.getFees();
        uint256 amountAfterFees = _amountB * (100 - fees) / 100;

        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transfer(msg.sender, amountAfterFees); // Envoie B après frais
        tokenB.transfer(address(factory), _amountB * fees / 100); // Envoie les frais à la factory

        // Mise à jour des valeurs de k
        k = getSupplyA() * getSupplyB();
    }

    function swapBforA(uint256 _amountB) external {
        require(tokenB.allowance(msg.sender, address(this)) >= _amountB, "no allowance for tokenB");
        uint256 _amountA = getExactTokenA(_amountB);
        uint256 fees = factory.getFees();
        uint256 amountAfterFees = _amountA * (100 - fees) / 100;

        tokenB.transferFrom(msg.sender, address(this), _amountB);
        tokenA.transfer(msg.sender, amountAfterFees); // Envoie A après frais
        tokenA.transfer(address(factory), _amountA * fees / 100); // Envoie les frais à la factory

        // Mise à jour des valeurs de k
        k = getSupplyA() * getSupplyB();
    }

    function getExactTokenA(uint256 _amountB) view public returns(uint256 _amountA) {
        uint256 supplyB = getSupplyB();
        uint256 newSupplyA = k / (supplyB + _amountB);
        return getSupplyA() - newSupplyA;
    }

    function getExactTokenB(uint256 _amountA) view public returns(uint256 _amountB) {
        uint256 supplyA = getSupplyA();
        uint256 newSupplyB = k / (supplyA + _amountA);
        return getSupplyB() - newSupplyB;
    }


    function getRateAforB() view external returns(uint256) { // Pour chaque A on a xB
        return tokenB.balanceOf(address(this)) * 10 ** tokenA.decimals() / tokenA.balanceOf(address(this));
    }

    function getRateBforA() view external returns(uint256) { // Pour chaque B on a xA
        return tokenA.balanceOf(address(this)) * 10 ** tokenB.decimals() / tokenB.balanceOf(address(this));
    }

    function getSupplyA() view public returns(uint256) {
        return tokenA.balanceOf(address(this));
    }

    function getSupplyB() view public returns(uint256) {
        return tokenB.balanceOf(address(this));
    }
}
