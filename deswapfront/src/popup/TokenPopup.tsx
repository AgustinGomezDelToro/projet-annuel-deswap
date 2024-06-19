import { useEffect, useState } from "react";
import { TokenInterface } from "../interfaces/Tokens";
import Token from "../services/Assets";

interface TokenPopupProps {
    setToken: (token: string) => void;
    close: () => void;
}

const TokenPopup = ({ setToken, close }: TokenPopupProps) => {
    const [tokens, setTokens] = useState<TokenInterface[]>([]);

    useEffect(() => {
        const fetchTokens = async () => {
            const data = await new Token().getAll();
            setTokens(data);
        };

        fetchTokens();
    }, []);

    return (
        <div className="fixed z-50 bg-black/30 h-screen w-full flex items-center justify-center">
            <div className="relative bg-white w-1/4 rounded-lg p-4">
                <div className="flex justify-between border-b border-colors-black2/40 -mx-4 px-4 pb-3 mb-4">
                    <p className="">Select a token</p>
                    <button onClick={close}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <p className="text-colors-black2 text-sm font-medium">Search token</p>
                <div className="relative w-full mb-4">
                    <input type="text" className="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-500 bg-colors-gray1 border border-colors-black2/40 rounded-lg focus:outline-none focus:ring-none" placeholder="Token name or symbol" />
                    <svg className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <p className="text-colors-black2 text-sm font-medium">All tokens</p>
                <div className="h-72 overflow-y-scroll overflow-x-hidden">
                    {tokens.map((token, index) => (
                        <div key={index} className={`group flex items-center justify-between border-colors-black2/40 -mx-4 px-4 py-3 ${index == tokens.length - 1 ? '' : 'border-b'}`}>
                            <div className="flex items-center">
                                <img src={`https://ipfs.io/ipfs/${token.logo}`} alt={token.name} className="w-8 h-8 rounded-full" />
                                <p className="ml-2">{token.name}</p>
                            </div>
                            <button onClick={() => setToken(token.symbole)} className="text-colors-green1/80 group-hover:text-colors-green1">Select</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TokenPopup;
