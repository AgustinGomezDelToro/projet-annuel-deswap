import { useEffect, useState } from "react";
import { PoolInterface } from "../../../interfaces/Pools";
import PoolService from "../../../services/Pools";
import { Link } from "react-router-dom";

const Pool = () => {
    const [pool, setPool] = useState<PoolInterface | null>(null);

    useEffect(() => {
        const fetchPool = async () => {
            const poolId = window.location.pathname.split("/")[2];
            const pool = await PoolService.getById(parseInt(poolId));
            setPool(pool);
        }

        fetchPool();
    }, []);

    return (
        <div className="max-w-7xl mx-auto pt-24">
            {!pool ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="grid grid-cols-3 w-full gap-y-8">
                        <div className="col-span-2">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-colors-black1">{pool.TokenA} / {pool.TokenB}</h1>
                            </div>
                            <div className="flex items-center mt-4">
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg">
                                    1 {pool.TokenA} = {pool.supplyA} {pool.TokenB}
                                </label>
                                <label className="text-colors-black1 flex items-center bg-colors-gray2 px-3 py-2 rounded-lg ml-2">
                                    1 {pool.TokenB} = {pool.supplyB} {pool.TokenA}
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <button className="bg-colors-gray2 text-colors-green1 font-medium px-4 py-2 rounded-lg flex items-center gap-1">
                                Add Liquidity
                            </button>
                            <Link to={`/swap?token1=${pool.TokenA}&token2=${pool.TokenB}`} className="bg-colors-green1 text-colors-white1 font-medium px-4 py-2 rounded-lg ml-2">Swap</Link>
                        </div>
                        <div className="bg-colors-white2 rounded-lg p-4">
                            <div className="bg-colors-gray2 rounded-lg p-3">
                                <h1 className="text-colors-green1 font-medium mb-3 text-lg">Total Tokens Locked</h1>
                                <table className="w-full">
                                    <tr>
                                        <td className="flex items-center gap-2">
                                            {pool.TokenA}
                                        </td>
                                        <td className="text-right">
                                            {pool.supplyA.toLocaleString("en-US", {})}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="flex items-center gap-2">
                                            {pool.TokenB}
                                        </td>
                                        <td className="text-right">
                                            {pool.supplyB.toLocaleString("en-US", {})}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pool;
