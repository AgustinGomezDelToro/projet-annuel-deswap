import React, { useState, useContext } from 'react';
import { ethers, parseEther } from 'ethers';
import { SafeContext } from '../../asset/hooks/safe';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

const Smartcontract: React.FC = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { accountAddress } = useContext(SafeContext);
    const [amount, setAmount] = useState<string>('');
    const [balance, setBalance] = useState<string>('');
    const factoryAddress = "VOTRE_ADRESSE_DE_CONTRAT_FACTORY"; // Remplacez par l'adresse de votre contrat

    const depositETH = async () => {
        if (!walletProvider || !accountAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            const tx = await signer.sendTransaction({
                to: factoryAddress,
                value: parseEther(amount)
            });

            await tx.wait();
            alert('Deposit successful!');
        } catch (error) {
            console.error('Error depositing ETH:', error);
        }
    };

    const withdrawETH = async () => {
        if (!walletProvider || !accountAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(factoryAddress, [
                "function withdraw(uint256 _amount) external",
                "function getBalance() external view returns (uint256)"
            ], signer);

            const balance = await contract.getBalance();
            if (parseEther(amount) > balance) {
                alert('Insufficient balance in the contract');
                return;
            }

            const tx = await contract.withdraw(parseEther(amount));
            await tx.wait();
            alert('Withdrawal successful!');
        } catch (error) {
            console.error('Error withdrawing ETH:', error);
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
            const contract = new ethers.Contract(factoryAddress, [
                "function getBalance() external view returns (uint256)"
            ], signer);

            const balance = await contract.getBalance();
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('Error getting balance:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Smart Contract</h1>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={depositETH}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Deposit ETH
                    </button>
                    <button
                        onClick={withdrawETH}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                        Withdraw ETH
                    </button>
                    <button
                        onClick={checkBalance}
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Check Balance
                    </button>
                    {balance && (
                        <div className="mt-4 text-center text-lg">
                            <p>Contract Balance: {balance} ETH</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Smartcontract;
