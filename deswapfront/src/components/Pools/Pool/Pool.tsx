import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PoolInterface } from "../../../interfaces/Pools";
import PoolService from "../../../services/Pools";
import { Link } from "react-router-dom";

const Pool = () => {

    const [pool, setPool] = useState<PoolInterface>();

    useEffect(() => {
        const fetchPool = async () => {
            const poolId = window.location.pathname.split("/")[2];
            const pool = await new PoolService().getById(parseInt(poolId));
            setPool(pool);
        }

        fetchPool();
    }, []);

    return (
        <div className="max-w-7xl mx-auto pt-24">
            {/* {!pool ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="grid grid-cols-3 w-full gap-y-8">
                        <div className="col-span-2">
                            <div className="flex items-center">
                                <img src={pool.logoURL1} alt={pool.token1} className="w-6 h-6" />
                                <img src={pool.logoURL2} alt={pool.token2} className="w-6 h-6" />
                                <h1 className="text-2xl font-bold text-colors-black1">{pool.token1} / {pool.token2}</h1>
                            </div>
                            <div className="flex items-center mt-4">
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg">
                                    <img src={pool.logoURL1} alt={pool.token1} className="w-6 h-6 mr-1" />
                                    1 {pool.token1} = {pool.price1} {pool.token2}
                                </label>
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg ml-2">
                                    <img src={pool.logoURL2} alt={pool.token2} className="w-6 h-6 mr-1" />
                                    1 {pool.token2} = {pool.price2} {pool.token1}
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <button className="bg-colors-gray2 text-colors-green1 font-medium px-4 py-2 rounded-lg flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" /></svg>
                                Add Liquidity
                            </button>
                            <Link to={`/swap?token1=${pool.token1}&token2=${pool.token2}`} className="bg-colors-green1 text-colors-white1 font-medium px-4 py-2 rounded-lg ml-2">Swap</Link>
                        </div>
                        <div className="bg-colors-white2 rounded-lg p-4">
                            <div className="bg-colors-gray2 rounded-lg p-3">
                                <h1 className="text-colors-green1 font-medium mb-3 text-lg">Total Tokens Locked</h1>
                                <table className="w-full">
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
                        <div className="bg-colors-white2 rounded-lg p-4 col-span-2 ml-5">
                            <h1 className="text-colors-green1 font-medium mb-3 text-xl">Transactions</h1>
                            <table className="w-full bg-colors-gray2 rounded-lg">
                                <thead>
                                    <tr className="border-b-[1px] border-colors-gray1 text-colors-black2 text-sm uppercase">
                                        <th className="pl-4 w-8">#</th>
                                        <th className="text-start p-4 font-medium">Value</th>
                                        <th className="text-start p-4 font-medium">Amount receive</th>
                                        <th className="text-start p-4 font-medium">Amount sent</th>
                                        <th className="text-start p-4 font-medium">From</th>
                                        <th className="text-start p-4 font-medium">Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pool.transactions.map((tx, i) => {
                                        return (
                                            <motion.tr
                                                layoutId={`row-${tx.id}`}
                                                className={`text-sm border-colors-gray1 hover:bg-colors-gray1 transition-all ease-in-out duration-100 ${i === pool.transactions.length - 1 ? "" : "border-b"}`}
                                            >
                                                <td className="pl-4 w-8 text-colors-black2">
                                                    <a href={`https://sepolia.etherscan.io/tx/`} target="_blank" rel="noreferrer" className="block mb-1 font-medium hover:underline">{tx.id}</a>
                                                </td>

                                                <td className="p-4">
                                                    ${tx.value.toLocaleString("en-US", {})}
                                                </td>

                                                <td className="p-4">
                                                    {tx.tokenAmountOut.toLocaleString("en-US", {})} {tx.tokenOut}
                                                </td>

                                                <td className="p-4">
                                                    {tx.tokenAmountIn.toLocaleString("en-US", {})} {tx.tokenIn}
                                                </td>

                                                <td className="p-4">
                                                    <a href={`https://sepolia.etherscan.io/address/${tx.from}`} target="_blank" rel="noreferrer" className="block mb-1 font-medium hover:underline">{tx.from}</a>
                                                </td>

                                                <td className="p-4">
                                                    {tx.timestamp}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Pool;