// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

import "./Pools.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/utils/ReentrancyGuard.sol";
import "./ERC20.sol";

contract DeSwapFactory is Ownable, ReentrancyGuard {
    struct InfosPool {
        ERC20 tokenA;
        ERC20 tokenB;
    }

    mapping (address => InfosPool) public pools;
    address[] public pairsAddresses;
    ERC20[] public tokens;

    uint256 private fee; // 1% = 100

    event NewPoolCreated(address poolAddress);
    event NewTokenCreated(address tokenAddress, string name, string symbol, uint256 initialSupply);

    constructor(address initialOwner) Ownable(initialOwner) {
        fee = 10; // 0.1%
    }

    function createTokenAndPool(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant {
        MyToken tokenA = new MyToken(name, symbol, initialSupply);
        MyToken tokenB = new MyToken(name, symbol, initialSupply); // o usa otra dirección de token

        emit NewTokenCreated(address(tokenA), name, symbol, initialSupply);

        tokenA.approve(address(this), amountA);
        tokenB.approve(address(this), amountB);

        createPool(address(tokenA), address(tokenB), amountA, amountB);
    }

    function createPool(address _addressA, address _addressB, uint256 _amountA, uint256 _amountB) public nonReentrant {
        ERC20 _tokenA = ERC20(_addressA);
        ERC20 _tokenB = ERC20(_addressB);

        require(!existPair(address(_tokenA), address(_tokenB)), "Pool already exists");
        require(_tokenA.allowance(msg.sender, address(this)) >= _amountA, "No allowance for tokenA");
        require(_tokenB.allowance(msg.sender, address(this)) >= _amountB, "No allowance for tokenB");

        if(!existToken(_tokenA)){
            tokens.push(_tokenA);
        }
        if(!existToken(_tokenB)){
            tokens.push(_tokenB);
        }

        DeSwapPools newPool = new DeSwapPools(_tokenA, _tokenB, address(this), _amountA, _amountB);
        _tokenA.transferFrom(msg.sender, address(newPool), _amountA);
        _tokenB.transferFrom(msg.sender, address(newPool), _amountB);

        pools[address(newPool)] = InfosPool(_tokenA, _tokenB);
        pairsAddresses.push(address(newPool));
        emit NewPoolCreated(address(newPool));
    }

    function existPair(address _tokenA, address _tokenB) view internal returns(bool) {
        uint pairsLength = pairsAddresses.length;
        ERC20 tokenA = ERC20(_tokenA);
        ERC20 tokenB = ERC20(_tokenB);
        for (uint i = 0; i < pairsLength; i++){
            address pairsAddress = pairsAddresses[i];
            if((pools[pairsAddress].tokenA == tokenA && pools[pairsAddress].tokenB == tokenB) ||
                (pools[pairsAddress].tokenA == tokenB && pools[pairsAddress].tokenB == tokenA)){
                return true;
            }
        }
        return false;
    }

    function existToken(ERC20 _token) view internal returns(bool) {
        uint tokensLength = tokens.length;
        for (uint i = 0; i < tokensLength; i++){
            if(tokens[i] == _token){
                return true;
            }
        }
        return false;
    }

    function getPairsAddresses() view public returns(address[] memory, InfosPool[] memory){
        uint pairsLength = pairsAddresses.length;
        address[] memory pairsAddressesArray = new address[](pairsLength);
        InfosPool[] memory pairsInfos = new InfosPool[](pairsLength);
        for (uint i = 0; i < pairsLength; i++){
            pairsAddressesArray[i] = pairsAddresses[i];
            pairsInfos[i] = pools[pairsAddresses[i]];
        }
        return (pairsAddressesArray, pairsInfos);
    }

    function getPairAddress(address token1, address token2) view public returns(address){
        uint pairsLength = pairsAddresses.length;
        ERC20 tokenA = ERC20(token1);
        ERC20 tokenB = ERC20(token2);
        for (uint i = 0; i < pairsLength; i++){
            address pairsAddress = pairsAddresses[i];
            if((pools[pairsAddress].tokenA == tokenA && pools[pairsAddress].tokenB == tokenB) ||
                (pools[pairsAddress].tokenA == tokenB && pools[pairsAddress].tokenB == tokenA)){
                return pairsAddress;
            }
        }
        return address(0);
    }

    function getFees() view external returns(uint256){
        return fee;
    }

    function setFees(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function getTokensAmountToClaim() view external returns(uint256[] memory, ERC20[] memory){
        uint tokensLength = tokens.length;
        uint[] memory tokensAmountToClaim = new uint[](tokensLength);
        for (uint i = 0; i < tokensLength; i++){
            tokensAmountToClaim[i] = tokens[i].balanceOf(address(this));
        }
        return (tokensAmountToClaim, tokens);
    }

    function claimTokens(ERC20 _token) external onlyOwner {
        require(existToken(_token), "Token does not exist");
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }

    function claimAll() external onlyOwner {
        uint tokensLength = tokens.length;
        for (uint i = 0; i < tokensLength; i++){
            tokens[i].transfer(msg.sender, tokens[i].balanceOf(address(this)));
        }
    }

    function closePool(address _pairAddress) external onlyOwner {
        require(pools[_pairAddress].tokenA != ERC20(address(0)), "Pool does not exist");
        DeSwapPools pool = DeSwapPools(_pairAddress);
        pool.closePool();
        uint pairsLength = pairsAddresses.length;
        for (uint i = 0; i < pairsLength; i++){
            if(pairsAddresses[i] == _pairAddress){
                pairsAddresses[i] = pairsAddresses[pairsLength - 1];
                pairsAddresses.pop();
                break;
            }
        }
    }

    function claimAllFees() external onlyOwner {
        for (uint i = 0; i < pairsAddresses.length; i++) {
            DeSwapPools pool = DeSwapPools(pairsAddresses[i]);
            pool.claim();
        }
    }
}
