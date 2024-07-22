import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers } from "ethers";
import { createContext } from "react";
import stakingContractABI from "../asset/abi/StakingContractABI.json";

interface FactoryContextType {
    stake: (params: { value: bigint }) => Promise<ethers.TransactionResponse | null>,
    unstake: (params: { value: bigint }) => Promise<ethers.TransactionResponse | null>,
    claim: () => Promise<ethers.TransactionResponse | null>,
    earned: () => Promise<string | null>,
    balanceOf: () => Promise<string | null>,
    totalSupply: () => Promise<string | null>,
    dailyRewardRate: () => Promise<string | null>,
}

const StakingContext = createContext<FactoryContextType | undefined>(undefined)

export default function StakingProvider({ children }: { children: React.ReactNode }) {
    const { walletProvider } = useWeb3ModalProvider();

    async function stake({ value }: { value: bigint }) {
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, signer);
        try {
            const tx = await stakingContract.stake({ value });
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function unstake({ value }: { value: bigint }) {
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, signer);
        try {
            const tx = await stakingContract.unstake(value);
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function claim() {
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, signer);
        try {
            const tx = await stakingContract.claim();
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function earned(){
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const publicKey = signer.address;
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, provider);
        try {
            const value = await stakingContract.earned(publicKey);
            return ethers.formatEther(value);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function balanceOf(){
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const publicKey = signer.address;
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, provider);
        try {
            const value = await stakingContract.balanceOf(publicKey);
            return ethers.formatEther(value);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function totalSupply(){
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, provider);
        try {
            const value = await stakingContract.totalSupply();
            return ethers.formatEther(value);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function dailyRewardRate(){
        if (!walletProvider) return null;
        const provider = new BrowserProvider(walletProvider as any);
        const stakingContract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS!, stakingContractABI, provider);
        try {
            const value = await stakingContract.dailyRewardRate();
            return ethers.formatEther(value);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return (
        <StakingContext.Provider value={{ stake, unstake, claim, earned, balanceOf, totalSupply, dailyRewardRate }}>
            {children}
        </StakingContext.Provider>
    );
}

export { StakingContext, StakingProvider };