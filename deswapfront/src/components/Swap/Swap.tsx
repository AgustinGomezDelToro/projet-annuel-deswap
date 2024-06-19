import "./Swap.scss";
import React, { useEffect, useState } from "react";
import { tokens } from "../../utils/asset/tokens";

const Swap = () => {
    const [size, setSize] = useState({ columns: 0, rows: 0 });

    useEffect(() => {
        generateGridCount();
        window.addEventListener("resize", generateGridCount);

        return () => window.removeEventListener("resize", generateGridCount);
    }, []);

    const generateGridCount = () => {
        const columns = Math.floor(document.body.clientWidth / 75);
        const rows = Math.floor(document.body.clientHeight / 75);

        setSize({
            columns,
            rows,
        });
    };

    return (
        <div className="bg-customLight min-h-screen flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="pointer-events-auto w-full md:w-1/3 bg-white border border-gray-300 p-4 rounded-lg relative z-20 box-shadow-blur">
                    <h1 className="text-green-500 text-xl font-bold">Swap</h1>
                    <div className="flex relative flex-col">
                        <button className="mt-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-lg border-4 border-white w-8 h-8 flex items-center justify-center">
                            <svg className="w-4 h-4 rotate-90 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 2.1l4 4-4 4" />
                                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
                                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                            </svg>
                        </button>
                        <div className="mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24">
                            <div className="flex flex-col items-start w-3/4">
                                <input type="number" placeholder="0" className="bg-transparent w-full focus:outline-none focus:ring-0 text-black text-4xl appearance-none" />
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center bg-green-500 text-white rounded-full pl-1 pr-2 py-0.5">
                                    <img src={tokens[0]} alt="Token cap" className="w-5 h-5 rounded-full" />
                                    <p className="pl-1 pr-2 font-semibold">ETH</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                                <div className="flex mt-1">
                                    <button className="font-bold text-orange-500 text-xs whitespace-nowrap">Max</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24">
                            <div className="flex flex-col items-start w-3/4">
                                <input type="number" placeholder="0" className="bg-transparent w-full focus:outline-none focus:ring-0 text-black text-4xl appearance-none" />
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center bg-green-500 text-white rounded-full pl-1 pr-2 py-0.5">
                                    <img src={tokens[1]} alt="Token dsw" className="w-5 h-5 rounded-full" />
                                    <p className="text-white pl-1 font-semibold">DSW</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                                <div className="flex mt-1">
                                    <button className="font-bold text-orange-500 text-xs whitespace-nowrap">Max</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="bg-green-500 rounded-lg w-full h-12 mt-4 text-white font-semibold">
                        Swap
                    </button>
                    {/* <p className="w-full text-center text-black underline hover:no-underline">
                        <a target="_blank" rel="noreferrer" href={`https://sepolia.etherscan.io/tx/`}> Check your transaction on-Chain </a>
                    </p> */}
                </div>
            </div>
        </div>
    );
}

export default Swap;
