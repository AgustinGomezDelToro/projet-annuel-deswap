import React, { useState } from 'react';
import axios from 'axios';

const PoolForm: React.FC = () => {
    const [tokenA, setTokenA] = useState<string>('');
    const [tokenB, setTokenB] = useState<string>('');
    const [supplyA, setSupplyA] = useState<string>('');
    const [supplyB, setSupplyB] = useState<string>('');
    const [poolAddress, setPoolAddress] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPool = {
            tokenA,
            tokenB,
            supplyA: parseFloat(supplyA),
            supplyB: parseFloat(supplyB),
            poolAddress
        };

        try {
            await axios.post('http://localhost:3001/pools/add', newPool);
            alert('Pool added successfully!');
        } catch (error) {
            console.error('Error adding pool:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Add Pool</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Token A Address"
                        value={tokenA}
                        onChange={(e) => setTokenA(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Token B Address"
                        value={tokenB}
                        onChange={(e) => setTokenB(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Supply A"
                        value={supplyA}
                        onChange={(e) => setSupplyA(e.target.value)}
                        className="w-full px-4 py-2 text-lg text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Supply B"
                        value={supplyB}
                        onChange={(e) => setSupplyB(e.target.value)}
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
                        type="submit"
                        className="w-full py-2 text-lg text-white transition-colors duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Add Pool
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PoolForm;
