// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/utils/ReentrancyGuard.sol";
import "./IFactory.sol";

contract DeSwapPools is ReentrancyGuard {
    ERC20 tokenA;
    ERC20 tokenB;
    uint public k; // Constant used to calculate the price (tokenA * tokenB = k)
    bool public closed;
    IDeSwapFactory factory;

    struct Provider {
        uint256 amountA;
        uint256 amountB;
        uint256 feesA;
        uint256 feesB;
    }
    mapping(address => Provider) public liquidityProvider;
    address[] public liquidityProviders;

    uint256 public totalFeesA;
    uint256 public totalFeesB;

    constructor(ERC20 _tokenA, ERC20 _tokenB, address _factory, uint256 _amountA, uint256 _amountB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        factory = IDeSwapFactory(_factory);
        k = _amountA * _amountB / 10 ** 18;
        liquidityProvider[tx.origin].amountA += _amountA;
        liquidityProvider[tx.origin].amountB += _amountB;
        liquidityProviders.push(tx.origin);
    }

    modifier isNotClosed(){
        require(!closed, "Pool is closed");
        _;
    }

    function addLiquidity(uint256 _amountA, uint256 _amountB) external nonReentrant isNotClosed {
        require(tokenA.allowance(msg.sender, address(this)) >= _amountA, "no allowance for tokenA");
        require(tokenB.allowance(msg.sender, address(this)) >= _amountB, "no allowance for tokenB");
        uint256 current_ratio = getSupplyA() / getSupplyB();
        uint256 new_ratio = _amountA / _amountB;
        require(current_ratio == new_ratio, "The ratio is bad");
        k += _amountA * _amountB / 10 ** 18;
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
        if(liquidityProvider[msg.sender].amountA == 0 && liquidityProvider[msg.sender].amountB == 0){
            liquidityProviders.push(msg.sender);
        }
        liquidityProvider[msg.sender].amountA += _amountA;
        liquidityProvider[msg.sender].amountB += _amountB;
    }

    function removeLiquidity(uint256 _amountA, uint256 _amountB) external nonReentrant {
        require(liquidityProvider[msg.sender].amountA >= _amountA, "Not enough liquidity for tokenA");
        require(liquidityProvider[msg.sender].amountB >= _amountB, "Not enough liquidity for tokenB");
        uint256 current_ratio = getSupplyA() / getSupplyB();
        uint256 new_ratio = (getSupplyA() - _amountA) / (getSupplyB() - _amountB);
        require(current_ratio == new_ratio, "The ratio is bad");
        k -= _amountA * _amountB / 10 ** 18;
        liquidityProvider[msg.sender].amountA -= _amountA;
        liquidityProvider[msg.sender].amountB -= _amountB;
        tokenA.transfer(msg.sender, _amountA);
        tokenB.transfer(msg.sender, _amountB);
    }

    function swap(uint256 _amountFrom, address _tokenFrom) external nonReentrant isNotClosed {
        ERC20 tokenFrom = ERC20(_tokenFrom);
        ERC20 tokenTo = tokenFrom == tokenA ? tokenB : tokenA;
        require(tokenFrom.allowance(msg.sender, address(this)) >= _amountFrom, "no allowance for token");
        require(tokenFrom.balanceOf(msg.sender) >= _amountFrom, "Not enough balance");
        uint256 _amountTo = getExactToken(_amountFrom, _tokenFrom);

        uint256 fees = factory.getFees();
        uint256 feeAmount = _amountTo * fees / 100;
        uint256 platformFee = feeAmount / 2;
        uint256 liquidityProvidersFee = feeAmount - platformFee;

        tokenFrom.transferFrom(msg.sender, address(this), _amountFrom); // On prend les tokens
        tokenTo.transfer(address(factory), platformFee); // On envoie les fees à la factory
        distributeFeesToLiquidityProviders(tokenTo, liquidityProvidersFee); // On distribue les fees aux liquidity providers
        tokenTo.transfer(msg.sender, _amountTo * (100 - fees) / 100); // On envoie 100% - fees%
    }

    function distributeFeesToLiquidityProviders(ERC20 token, uint256 liquidityProvidersFee) internal {
        uint256 totalLiquidityA = getSupplyA();
        uint256 totalLiquidityB = getSupplyB();
        uint256 size = liquidityProviders.length;
        for (uint256 i = 0; i < size; i++) {
            address user = liquidityProviders[i];
            uint256 userLiquidityA = liquidityProvider[user].amountA;
            uint256 userLiquidityB = liquidityProvider[user].amountB;

            uint256 userShare = ((userLiquidityA + userLiquidityB) * liquidityProvidersFee) / (totalLiquidityA + totalLiquidityB);

            if (userShare > 0) {
                if(token == tokenA){
                    liquidityProvider[user].feesA += userShare;
                    totalFeesA += userShare;
                } else {
                    liquidityProvider[user].feesB += userShare;
                    totalFeesB += userShare;
                }
            }
        }
    }

    function claim() external nonReentrant {
        uint256 feesA = liquidityProvider[msg.sender].feesA;
        uint256 feesB = liquidityProvider[msg.sender].feesB;
        require(feesA > 0 || feesB > 0, "No fees to claim");
        totalFeesA -= feesA;
        totalFeesB -= feesB;
        liquidityProvider[msg.sender].feesA = 0;
        liquidityProvider[msg.sender].feesB = 0;
        tokenA.transfer(msg.sender, feesA);
        tokenB.transfer(msg.sender, feesB);
    }

    function getExactToken(uint256 _amountFrom, address _tokenFrom) view public returns(uint256 _amountA) {
        if(_tokenFrom == address(tokenA)){
            return getSupplyB() * _amountFrom / getSupplyA();
        }
        if(_tokenFrom == address(tokenB)){
            return getSupplyA() * _amountFrom / getSupplyB();
        }
    }

    function getRateAforB() view external returns(uint256) { // Pour chaque A on a xB
        return getSupplyB() * 10 ** tokenA.decimals() / getSupplyA();
    }

    function getRateBforA() view external returns(uint256) { // Pour chaque B on a xA
        return getSupplyA() * 10 ** tokenB.decimals() / getSupplyB();
    }

    function getSupplyA() view public returns(uint256) {
        return tokenA.balanceOf(address(this)) - totalFeesA;
    }

    function getSupplyB() view public returns(uint256) {
        return tokenB.balanceOf(address(this)) - totalFeesB;
    }

    function getLiquidityProviders() view external returns(address[] memory) {
        return liquidityProviders;
    }

    function getStatus() view external returns(bool) {
        return closed;
    }

    function closePool() external {
        require(msg.sender == address(factory), "Only the factory can close the pool");
        closed = true;
    }
}
