import React, { useState, useContext } from 'react';
import { ethers, parseEther, formatEther } from 'ethers';
import { SafeContext } from '../../asset/hooks/safe';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

const Pool: React.FC = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { accountAddress } = useContext(SafeContext);
    const [amountA, setAmountA] = useState<string>('');
    const [amountB, setAmountB] = useState<string>('');
    const [poolAddress, setPoolAddress] = useState<string>(''); // Adresse du pool
    const [balanceA, setBalanceA] = useState<string>('');
    const [balanceB, setBalanceB] = useState<string>('');

    const addLiquidity = async () => {
        if (!walletProvider || !accountAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            const tokenA = new ethers.Contract(
                "ADDRESS_TOKEN_A",
                ["function approve(address spender, uint256 amount) public returns (bool)"],
                signer
            );

            const tokenB = new ethers.Contract(
                "ADDRESS_TOKEN_B",
                ["function approve(address spender, uint256 amount) public returns (bool)"],
                signer
            );

            await tokenA.approve(poolAddress, parseEther(amountA));
            await tokenB.approve(poolAddress, parseEther(amountB));

            const poolContract = new ethers.Contract(
                poolAddress,
                [
                    "function addLiquidity(uint256 _amountA, uint256 _amountB) external"
                ],
                signer
            );

            const tx = await poolContract.addLiquidity(parseEther(amountA), parseEther(amountB));
            await tx.wait();
            alert('Liquidity added successfully!');
        } catch (error) {
            console.error('Error adding liquidity:', error);
        }
    };

    const removeLiquidity = async () => {
        if (!walletProvider || !accountAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            const poolContract = new ethers.Contract(
                poolAddress,
                [
                    "function removeLiquidity(uint256 _amountA, uint256 _amountB) external"
                ],
                signer
            );

            const tx = await poolContract.removeLiquidity(parseEther(amountA), parseEther(amountB));
            await tx.wait();
            alert('Liquidity removed successfully!');
        } catch (error) {
            console.error('Error removing liquidity:', error);
        }
    };

    const checkBalance = async () => {
        if (!walletProvider || !accountAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const poolContract = new ethers.Contract(
                poolAddress,
                [
                    "function getSupplyA() view public returns (uint256)",
                    "function getSupplyB() view public returns (uint256)"
                ],
                signer
            );

            const balanceA = await poolContract.getSupplyA();
            const balanceB = await poolContract.getSupplyB();

            setBalanceA(formatEther(balanceA));
            setBalanceB(formatEther(balanceB));
        } catch (error) {
            console.error('Error getting balance:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Liquidity Pool</h1>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Amount Token A"
                        value={amountA}
                        onChange={(e) => setAmountA(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Amount Token B"
                        value={amountB}
                        onChange={(e) => setAmountB(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Pool Address"
                        value={poolAddress}
                        onChange={(e) => setPoolAddress(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addLiquidity}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Add Liquidity
                    </button>
                    <button
                        onClick={removeLiquidity}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                        Remove Liquidity
                    </button>
                    <button
                        onClick={checkBalance}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Check Balance
                    </button>
                    {balanceA && balanceB && (
                        <div className="mt-4 text-center text-lg">
                            <p>Contract Balance A: {balanceA} Token A</p>
                            <p>Contract Balance B: {balanceB} Token B</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pool;
