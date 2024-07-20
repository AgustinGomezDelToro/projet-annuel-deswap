import { BrowserProvider, ethers } from 'ethers';
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { AdminContext } from './isAdmin';

export default function ConnectButton() {
    const { open } = useWeb3Modal();
    const { address, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { disconnect } = useDisconnect();
    const { isAdmin, setIsAdmin } = useContext(AdminContext);

    useEffect(() => {
        async function signedMessage() {
            if (!address) return;
            try {
                const provider = new BrowserProvider(walletProvider as any);
                const randomBytes = ethers.hexlify(ethers.randomBytes(16));
                const now = new Date();
                const message = `By signing this message, I allow the DeSwap App to save your public key.\n\nNonce: ${randomBytes} - ${now.toISOString()}`;
                const signer = await provider.getSigner();
                const signature = await signer.signMessage(message);
                if (signature) {
                    try {
                        const response = await axios.get(`http://localhost:3001/isAdmin/${address}`);
                        if (response.data.message === "User is an admin") {
                            setIsAdmin(true);
                        } else {
                            alert("You are not an admin. Access denied.");
                            disconnect();
                        }
                    } catch (error) {
                        disconnect();
                        console.log("Error checking admin status:", error);
                    }
                }
            } catch (error) {
                disconnect();
                console.log("Error signing message:", error);
            }
        }

        if (isConnected && !isAdmin) {
            signedMessage();
        }
    }, [isConnected, address]);

    return (
        <div className='text-white' onClick={() => open()}>
            {
                isConnected ?
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-colors-black1 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-colors-green1"
                    >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>
                        {address?.slice(0, 5)}...{address?.slice(address.length - 5)}
                    </motion.button>
                    :
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-colors-black1 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-colors-green1"
                    >
                        Connect Wallet
                    </motion.button>
            }
        </div>
    );
}
