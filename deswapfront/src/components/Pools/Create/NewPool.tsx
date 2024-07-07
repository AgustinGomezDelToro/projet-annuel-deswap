import { tokens } from "../../../utils/asset/tokens";
import React, { useEffect, useState } from "react";
import TokenPopup from "../../../popup/TokenPopup";

const NewPool = () => {
    const [size, setSize] = useState({ columns: 0, rows: 0 });

    const [token1, setToken1] = useState<string>("ETH");
    const [token2, setToken2] = useState<string>("DSW");
    const [shows, setShows] = useState<boolean[]>([false, false]);

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
        <div className="bg-colors-gray1">
            {shows[0] && <TokenPopup setToken={setToken1} close={() => setShows([false, false])} />}
            {shows[1] && <TokenPopup setToken={setToken2} close={() => setShows([false, false])} />}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="pointer-events-auto w-full md:w-1/3 bg-white border border-gray-300 p-4 rounded-lg relative z-20 box-shadow-blur">
                    <h1 className="text-green-500 text-xl font-bold mb-4">Create a new pool</h1>
                    <div className='flex relative flex-col'>
                        <div className='mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24'>
                            <div className='flex flex-col items-start w-3/4'>
                                <label className="text-black text-sm font-medium">Token 1</label>
                                <button className="w-full p-2 mt-2 rounded-lg border border-gray-300 bg-white text-left flex items-center justify-between" onClick={() => setShows([true, false])}>
                                    {token1}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className='mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24'>
                            <div className='flex flex-col items-start w-3/4'>
                                <label className="text-black text-sm font-medium">Token 2</label>
                                <button className="w-full p-2 mt-2 rounded-lg border border-gray-300 bg-white text-left flex items-center justify-between" onClick={() => setShows([false, true])}>
                                    {token2}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className='mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24'>
                            <div className='flex flex-col items-start w-3/4'>
                                <label className="text-black text-sm font-medium">Deposit amount</label>
                                <input type="number" placeholder="0" className='bg-transparent w-full focus:outline-none focus:ring-0 text-black text-4xl appearance-none mt-2' />
                                {/* {ethPrice &&
                                    <p className="text-white text-xs whitespace-nowrap">${ethToSwap * ethPrice}</p>
                                } */}
                            </div>
                            <div className='flex flex-col items-end'>
                                <div className='flex items-center bg-green-500 text-white rounded-full pl-1 pr-2 py-0.5'>
                                    <img src={tokens[4]} alt="" className="w-8 h-8 rounded-full" />
                                    <p className="font-semibold text-lg">ETH</p>
                                </div>
                                <div className='flex items-center gap-1 mt-2'>
                                    {/* {signer && */}
                                    <p className="text-black text-xs whitespace-nowrap">Balance: {1} ETH</p>
                                    {/* } */}
                                    <button className='font-bold text-orange-500 text-xs whitespace-nowrap'>Max</button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 bg-gray-200 rounded-lg flex items-start justify-between p-4 w-full h-24'>
                            <div className='flex flex-col items-start w-3/4'>
                                <input type="number" placeholder="0" className='bg-transparent w-full focus:outline-none focus:ring-0 text-black text-4xl appearance-none' />
                                {/* {ethPrice &&
                                    <p className="text-white text-xs whitespace-nowrap">${ethToSwap * ethPrice}</p>
                                } */}
                            </div>
                            <div className='flex flex-col items-end'>
                                <div className='flex items-center bg-green-500 text-white rounded-full pl-1 pr-2 py-0.5'>
                                    <img src={tokens[7]} alt="" className="w-8 h-8 rounded-full" />
                                    <p className="font-semibold text-lg">DSW</p>
                                </div>
                                <div className='flex items-center gap-1 mt-2'>
                                    {/* {signer && */}
                                    <p className="text-black text-xs whitespace-nowrap">Balance: {77} DSW</p>
                                    {/* } */}
                                    <button className='font-bold text-orange-500 text-xs whitespace-nowrap'>Max</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="bg-green-500 rounded-lg w-full h-12 mt-4 text-white font-semibold">
                        Create Pool
                    </button>
                </div>
            </div>
        </div >
    );
}

export default NewPool;