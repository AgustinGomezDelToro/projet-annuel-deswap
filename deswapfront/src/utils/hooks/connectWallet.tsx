import { BrowserProvider, ethers } from 'ethers';
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import "../../styles/index.scss";
import logo1 from "../../utils/asset/images/logo1.png";
import { useEffect } from 'react';
import axios from 'axios';

export default function ConnectButton() {
    const { open } = useWeb3Modal();
    const { address, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        async function signedMessage() {
            if (!address) return;
            try {
                const response = await axios.get(`http://localhost:3001/users/${address}`);
                const user = response.data;
                
                if (user.is_banned) {
                    alert("Your account is banned. Please contact support.");
                    disconnect();
                    return;
                }
                
                if (user) return;
            } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                    try {
                        const provider = new BrowserProvider(walletProvider as any);
                        const randomBytes = ethers.hexlify(ethers.randomBytes(16));
                        const now = new Date();
                        const message = `By signing this message, I allow the DeSwap App to save your public key.\n\nNonce: ${randomBytes} - ${now.toISOString()}`;
                        const signer = await provider.getSigner();
                        const signature = await signer?.signMessage(message);
                        if (signature) {
                            try {
                                const response = await axios.post('http://localhost:3001/users/add', {
                                    public_key: address,
                                    role: "user",
                                    status: "active",
                                    signature: signature,
                                    email: "",
                                    password: "",
                                    first_name: "",
                                    last_name: "",
                                    birthdate: new Date().toISOString(),
                                    is_banned: false,
                                    is_admin: false,
                                    number_of_transactions: 0
                                });
                                if (response.data !== "User added successfully") {
                                    disconnect();
                                }
                            } catch (error) {
                                disconnect();
                                console.log("Error creating user:", error);
                            }
                        }
                    } catch (error) {
                        disconnect();
                        console.log("Error signing message:", error);
                    }
                } else {
                    console.log("Error fetching user:", error);
                }
            }
        }
        if (isConnected) {
            signedMessage();
        }
    }, [isConnected, address]);

    return (
        <button className='text-white' onClick={() => open()}>
            {
                isConnected ?
                    <span className='flex items-center gap-1 py-1.5 px-4'>
                        <img className='h-8' src={logo1} alt='logo' />
                        {address?.slice(0, 5)}...{address?.slice(address.length - 5)}
                    </span>
                    :
                    <span className='flex items-center gap-1 py-3 px-6'>Connect wallet</span>
            }
        </button>
    );
}
