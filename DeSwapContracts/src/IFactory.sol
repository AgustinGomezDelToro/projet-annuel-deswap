pragma solidity 0.8.24;

interface IDeSwapFactory {

    function getFees() view external returns(uint256);

    function owner() external view returns (address);

}