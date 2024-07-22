import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers } from "ethers";
import StakingContract from "../utils/abi/StakingContract.json";
import { createContext } from "react";

interface BlockchainContextType {
    getSwapTxs: () => Promise<any>,
    getClaimed: () => Promise<any>,
    getStaked: () => Promise<any>,
    getStakers: () => Promise<any>,
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

function BlockchainProvider({ children }: { children: React.ReactNode }) {
    const { walletProvider } = useWeb3ModalProvider();

    async function getSwapTxs() {
    }

    async function getClaimed() {
        const provider = new BrowserProvider(walletProvider as any);
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!,StakingContract , provider);
        try {
            const claimed = await stakingContract.totalClaimed();
            return ethers.formatEther(claimed);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getStaked() {
        const provider = new BrowserProvider(walletProvider as any);
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, StakingContract, provider);
        try {
            const staked = await stakingContract.totalSupply();
            return ethers.formatEther(staked);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getStakers() {
        const provider = new BrowserProvider(walletProvider as any);
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, StakingContract, provider);
        try {
            const stakers = await stakingContract.getAllStakers();
            return stakers;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return (
        <BlockchainContext.Provider value={{ getSwapTxs, getClaimed, getStaked, getStakers }}>
            {children}
        </BlockchainContext.Provider>
    );
}

export { BlockchainContext, BlockchainProvider };