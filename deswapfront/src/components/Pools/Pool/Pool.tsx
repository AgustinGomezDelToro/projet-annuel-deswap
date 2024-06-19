import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PoolInterface } from "../../../interfaces/Pools";
import { GetPoolById } from "../../../services/Pools";
import { Link } from "react-router-dom";

const Pool = () => {
    const [pool, setPool] = useState<PoolInterface>();

    useEffect(() => {
        const fetchPool = async () => {
            const poolId = window.location.pathname.split("/")[2];
            const pool = await GetPoolById(parseInt(poolId));
            setPool(pool);
        }

        fetchPool();
    }, []);

    return (
        <div className="bg-customLight min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">
                {!pool ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-2 bg-white rounded-lg p-6">
                            <div className="flex items-center space-x-2">
                                <img src={pool.logoURL1} alt={pool.token1} className="w-8 h-8" />
                                <img src={pool.logoURL2} alt={pool.token2} className="w-8 h-8" />
                                <h1 className="text-3xl font-bold text-colors-black1">{pool.token1} / {pool.token2}</h1>
                            </div>
                            <div className="flex items-center mt-4 space-x-2">
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg">
                                    <img src={pool.logoURL1} alt={pool.token1} className="w-6 h-6 mr-1" />
                                    1 {pool.token1} = {pool.price1} {pool.token2}
                                </label>
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg">
                                    <img src={pool.logoURL2} alt={pool.token2} className="w-6 h-6 mr-1" />
                                    1 {pool.token2} = {pool.price2} {pool.token1}
                                </label>
                            </div>
                            <div className="flex items-center justify-start mt-4 space-x-2">
                                <button className="bg-colors-gray2 text-colors-green1 font-medium px-4 py-2 rounded-lg flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" /></svg>
                                    Liquidity
                                </button>
                                <Link to={`/swap?token1=${pool.token1}&token2=${pool.token2}`} className="bg-colors-green1 text-colors-white1 font-medium px-4 py-2 rounded-lg">Swap</Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6">
                            <div className="bg-colors-gray2 rounded-lg p-4">
                                <h1 className="text-colors-green1 font-medium mb-3 text-lg">Total Tokens Locked</h1>
                                <table className="w-full">
                                    <tbody>
                                    <tr>
                                        <td className="flex items-center gap-2">
                                            <img src={pool.logoURL1} alt={pool.token1} className="w-6 h-6" />
                                            {pool.token1}
                                        </td>
                                        <td className="text-right">
                                            {pool.token1Balance.toLocaleString("en-US", {})}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="flex items-center gap-2">
                                            <img src={pool.logoURL2} alt={pool.token2} className="w-6 h-6" />
                                            {pool.token2}
                                        </td>
                                        <td className="text-right">
                                            {pool.token2Balance.toLocaleString("en-US", {})}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3">
                                <h1 className="text-colors-green1 font-medium">Total Value Locked (TVL)</h1>
                                <p className="text-lg font-medium text-colors-black1">${pool.tvl.toLocaleString("en-US", {})} </p>
                            </div>
                            <div className="mt-3">
                                <h1 className="text-colors-green1 font-medium">24h Volume</h1>
                                <p className="text-lg font-medium text-colors-black1">${pool.volume24h.toLocaleString("en-US", {})} </p>
                            </div>
                            <div className="mt-3">
                                <h1 className="text-colors-green1 font-medium">24h Fees</h1>
                                <p className="text-lg font-medium text-colors-black1">${pool.fees24h.toLocaleString("en-US", {})} </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 md:col-span-3">
                            <h1 className="text-colors-green1 font-medium mb-3 text-xl">Transactions</h1>
                            <table className="w-full bg-colors-gray2 rounded-lg">
                                <thead>
                                <tr className="border-b-[1px] border-colors-gray1 text-colors-black2 text-sm uppercase">
                                    <th className="pl-3 w-8">#</th>
                                    <th className="text-start p-3 font-medium">Value</th>
                                    <th className="text-start p-3 font-medium">Amount receive</th>
                                    <th className="text-start p-3 font-medium">Amount sent</th>
                                    <th className="text-start p-3 font-medium">From</th>
                                    <th className="text-start p-3 font-medium">Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pool.transactions.map((tx, i) => (
                                    <motion.tr
                                        key={tx.id}
                                        layoutId={`row-${tx.id}`}
                                        className={`text-sm border-colors-gray1 hover:bg-colors-gray1 transition-all ease-in-out duration-100 ${i === pool.transactions.length - 1 ? "" : "border-b"}`}
                                    >
                                        <td className="pl-3 w-8 text-colors-black2">
                                            <a href={`https://sepolia.etherscan.io/tx/${tx.id}`} target="_blank"
                                               rel="noreferrer"
                                               className="block mb-1 font-medium hover:underline">{tx.id}</a>
                                        </td>
                                        <td className="p-3">
                                            ${tx.value.toLocaleString("en-US", {})}
                                        </td>
                                        <td className="p-3">
                                            {tx.tokenAmountOut.toLocaleString("en-US", {})} {tx.tokenOut}
                                        </td>
                                        <td className="p-3">
                                            {tx.tokenAmountIn.toLocaleString("en-US", {})} {tx.tokenIn}
                                        </td>
                                        <td className="p-3">
                                            <a href={`https://sepolia.etherscan.io/address/${tx.from}`} target="_blank"
                                               rel="noreferrer"
                                               className="block mb-1 font-medium hover:underline">{tx.from}</a>
                                        </td>
                                        <td className="p-3">
                                            {tx.timestamp}
                                        </td>
                                    </motion.tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pool;
