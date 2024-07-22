import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./Pools.scss";
import { PoolInterface } from "../../interfaces/Pools";
import { Link } from "react-router-dom";
import PoolService from "../../services/Pools";
import MouseLightEffect from "../Home/MouseLightEffect";

const Pools = () => {
    const [pools, setPools] = useState<PoolInterface[]>([]);

    useEffect(() => {
        const fetchPools = async () => {
            try {
                const fetchedPools = await PoolService.getAll();
                console.log("Fetched Pools: ", fetchedPools);
                setPools(fetchedPools);
            } catch (error) {
                console.error("Error fetching pools:", error);
            }
        };

        fetchPools();
    }, []);

    return (
        <div className="w-full min-h-screen pt-24 bg-dark-background text-white">
            <MouseLightEffect />
            <div className="w-full max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold p-4 text-gradient">All pools</h1>
                    <Link to={"/Create"} className="bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium text-sm px-3 py-2 mr-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        + New position
                    </Link>
                </div>
                <table className="w-full bg-dark-table shadow-lg rounded-lg">
                    <thead>
                        <tr className="border-b-[1px] border-colors-gray1 text-gray-400 text-sm uppercase">
                            <th className="pl-4 w-8">#</th>
                            <th className="text-start p-4 font-medium">Pair</th>
                            <th className="text-start p-4 font-medium">Address</th>
                            <th className="text-start p-4 font-medium">Supply_A</th>
                            <th className="text-start p-4 font-medium">Supply_B</th>
                            <th className="text-start p-4 font-medium"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {pools.map((pool, index) => (
                            <TableRows
                                key={index}
                                pool={pool}
                                index={index + 1}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface TableRowsProps {
    pool: PoolInterface;
    index: number;
}

const TableRows = ({ pool, index }: TableRowsProps) => {
    if (!pool.tokenA || !pool.tokenB) {
        console.error("Missing token data for pool: ", pool);
        return null;
    }

    return (
        <motion.tr
            layoutId={`row-${pool.poolAddress}`}
            className="text-sm border-b border-dark-border hover:bg-dark-hover transition-all duration-200"
        >
            <td className="pl-4 w-8 text-gray-400">
                {index}
            </td>

            <td className="p-4 flex items-center gap-3">
                <div className="grid grid-cols-2">
                    {pool.tokenA.logo && (
                        <img
                            src={`https://ipfs.io/ipfs/${pool.tokenA.logo}`}
                            alt="tokenA logo"
                            className="w-6 h-6 rounded-full object-cover object-top shrink-0 -mb-2"
                        />
                    )}
                    <div />
                    <div />
                    {pool.tokenB.logo && (
                        <img
                            src={`https://ipfs.io/ipfs/${pool.tokenB.logo}`}
                            alt="tokenB logo"
                            className="w-6 h-6 rounded-full object-cover object-top shrink-0 -ml-2"
                        />
                    )}
                </div>
                <div>
                    <p className="mb-1 font-medium text-white">
                        {pool.tokenA.symbole} / {pool.tokenB.symbole}
                    </p>
                </div>
            </td>

            <td className="p-4 text-gray-400">
                <span>
                    {pool.poolAddress ? (
                        <>
                            {pool.poolAddress.slice(0, 5)}...{pool.poolAddress.slice(-5)}
                        </>
                    ) : (
                        "N/A"
                    )}
                </span>
            </td>

            <td className="p-4 text-white">
                <span>
                    {pool.supplyA}
                </span>
            </td>

            <td className="p-4 text-white">
                <span>
                    {pool.supplyB}
                </span>
            </td>

            <td className="text-center">
                <Link to={`/Create?tokenA=${pool.TokenA}&tokenB=${pool.TokenB}`}
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium text-sm px-3 py-2 mr-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    Add liq
                </Link>
            </td>
        </motion.tr>
    );
};

export default Pools;
