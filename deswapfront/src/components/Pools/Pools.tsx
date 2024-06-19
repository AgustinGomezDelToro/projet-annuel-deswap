import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./Pools.scss";
import { PoolInterface } from "../../interfaces/Pools";
import { Link } from "react-router-dom";
import { GetAllPools } from "../../services/Pools";
import money from "../../utils/asset/images/money.png";

const Pools = () => {
    const [pools, setPools] = useState<PoolInterface[]>([]);

    useEffect(() => {
        const fetchPools = async () => {
            const pools = await GetAllPools();
            setPools(pools);
        };

        fetchPools();
    }, []);

    return (
        <div className="w-full min-h-screen pt-24 bg-customLight">
            <div className="w-full max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold p-4 text-colors-green1">All pools</h1>
                    <Link to={"/Create"} className="bg-amber-200 text-white font-medium text-sm px-3 py-2 mr-4 rounded-lg">+ NEW POOL</Link>
                </div>
                <table className="w-full bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="border-b-[1px] border-colors-gray1 text-colors-black2 text-sm uppercase">
                            <th className="pl-4 w-8">#</th>
                            <th className="text-start p-4 font-medium">Pool</th>
                            <th className="text-start p-4 font-medium">TVL</th>
                            <th className="text-start p-4 font-medium">Volume 24H</th>
                            <th className="text-start p-4 font-medium">Volume 7D</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pools.map((pool) => {
                            return (
                                <TableRows
                                    key={pool.id}
                                    pool={pool}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* <div className="absolute w-44 rotate-12 top-28 right-44 drop-shadow-lg">
                <img src={money} alt="money.png" />
            </div> */}
        </div>
    );
};

interface TableRowsProps {
    pool: PoolInterface;
}

const TableRows = ({ pool }: TableRowsProps) => {

    return (
        <motion.tr
            layoutId={`row-${pool.id}`}
            className="text-sm border-b border-colors-white2 hover:bg-colors-white2"
        >
            <td className="pl-4 w-8 text-colors-black2">
                {pool.id}
            </td>

            <td className="p-4 flex items-center gap-3">
                <div className="grid grid-cols-2">
                    <img
                        src={pool.logoURL1}
                        alt="pool logo"
                        className="w-6 h-6 rounded-full object-cover object-top shrink-0 -mb-2"
                    />
                    <div />
                    <div />
                    <img
                        src={pool.logoURL2}
                        alt="pool logo"
                        className="w-6 h-6 rounded-full object-cover object-top shrink-0 -ml-2"
                    />
                </div>
                <div>
                    <Link to={`/Pools/${pool.id}`} className="block mb-1 font-medium hover:underline">{pool.token1} / {pool.token2}</Link>
                </div>
            </td>

            <td className="p-4">
                <span>
                    ${pool.tvl.toLocaleString("en-US", {})}
                </span>
            </td>

            <td className="p-4">
                <span>
                    ${pool.volume24h.toLocaleString("en-US", {})}
                </span>
            </td>

            <td className="p-4">
                <span>
                    ${pool.volume7d.toLocaleString("en-US", {})}
                </span>
            </td>
        </motion.tr>
    );
};

export default Pools;