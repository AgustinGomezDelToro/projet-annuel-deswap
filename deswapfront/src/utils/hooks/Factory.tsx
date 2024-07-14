import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers, Interface, constants } from "ethers";
import { createContext, ReactNode } from "react";
import DeSwapFactory from "../asset/abi/DeSwapFactory.json";
import DeSwapPools from "../asset/abi/DeSwapPools.json";
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

interface FactoryContextType {
    swapFrom: (params: { pairAddress: string, amount: bigint, tokenAddress: string }) => Promise<ethers.TransactionResponse | null>,
    createPool: (params: { token1: string, token2: string, amount1: bigint, amount2: bigint }) => Promise<ethers.TransactionResponse | null>,
    addLiquidity: (params: { poolAddress: string, amount1: bigint, amount2: bigint }) => Promise<ethers.TransactionResponse | null>,
    getAllPools: () => Promise<string[][]>,
    getSupplyA: (poolAddress: string) => Promise<number>,
    getSupplyB: (poolAddress: string) => Promise<number>,
    getExactToken: (poolAddress: string, amount: bigint, tokenAddress: string) => Promise<number>,
    getPairAddress: (token1: string, token2: string) => Promise<string | null>,
    bToDeposite: (amountA: number, poolAddress: string) => Promise<number>
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

function FactoryProvider({ children }: { children: ReactNode }) {
    const { walletProvider } = useWeb3ModalProvider();

    async function swapFrom({ pairAddress, amount, tokenAddress }: { pairAddress: string, amount: bigint, tokenAddress: string }): Promise<ethers.TransactionResponse | null> {
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const poolContract = new ethers.Contract(pairAddress, DeSwapPools as unknown as Interface, signer);
        try {
            const tx = await poolContract.swap(amount, tokenAddress);
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function createPool({ token1, token2, amount1, amount2 }: { token1: string, token2: string, amount1: bigint, amount2: bigint }): Promise<ethers.TransactionResponse | null> {
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const factoryContract = new ethers.Contract(process.env.REACT_APP_FACTORY_ADDRESS!, DeSwapFactory as unknown as Interface, signer);
        try {
            const tx = await factoryContract.createPool(token1, token2, amount1, amount2);
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function addLiquidity({ poolAddress, amount1, amount2 }: { poolAddress: string, amount1: bigint, amount2: bigint }): Promise<ethers.TransactionResponse | null> {
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const poolContract = new ethers.Contract(poolAddress, DeSwapPools as unknown as Interface, signer);
        try {
            const tx = await poolContract.addLiquidity(amount1, amount2);
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getAllPools(): Promise<string[][]> {
        const provider = new BrowserProvider(walletProvider as any);
        const factoryContract = new ethers.Contract(process.env.REACT_APP_FACTORY_ADDRESS!, DeSwapFactory as unknown as Interface, provider);
        try {
            const pools = await factoryContract.getPairsAddresses();
            return pools;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async function getPairAddress(token1: string, token2: string): Promise<string | null> {
        const provider = new BrowserProvider(walletProvider as any);
        const factoryContract = new ethers.Contract(process.env.REACT_APP_FACTORY_ADDRESS!, DeSwapFactory as unknown as Interface, provider);
        try {
            const result = await factoryContract.getPairAddress(token1, token2);
            if (result === constants.AddressZero) return null;
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getSupplyA(poolAddress: string): Promise<number> {
        const provider = new BrowserProvider(walletProvider as any);
        const poolContract = new ethers.Contract(poolAddress, DeSwapPools as unknown as Interface, provider);
        try {
            const supplyA = ethers.utils.formatEther(await poolContract.getSupplyA());
            return parseFloat(supplyA);
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async function getSupplyB(poolAddress: string): Promise<number> {
        const provider = new BrowserProvider(walletProvider as any);
        const poolContract = new ethers.Contract(poolAddress, DeSwapPools as unknown as Interface, provider);
        try {
            const supplyB = ethers.utils.formatEther(await poolContract.getSupplyB());
            return parseFloat(supplyB);
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async function getExactToken(poolAddress: string, amount: bigint, tokenAddress: string): Promise<number> {
        const provider = new BrowserProvider(walletProvider as any);
        const poolContract = new ethers.Contract(poolAddress, DeSwapPools as unknown as Interface, provider);
        try {
            const exactToken = ethers.utils.formatEther(await poolContract.getExactToken(amount, tokenAddress));
            return parseFloat(exactToken);
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async function bToDeposite(amountA: number, poolAddress: string): Promise<number> {
        const provider = new BrowserProvider(walletProvider as any);
        const poolContract = new ethers.Contract(poolAddress, DeSwapPools as unknown as Interface, provider);
        try {
            const supplyA = ethers.utils.formatEther(await poolContract.getSupplyA());
            const supplyB = ethers.utils.formatEther(await poolContract.getSupplyB());
            const b = (amountA * parseFloat(supplyB)) / parseFloat(supplyA);
            return b;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    return (
        <FactoryContext.Provider value={{ swapFrom, createPool, addLiquidity, getAllPools, getSupplyA, getSupplyB, getExactToken, getPairAddress, bToDeposite }}>
            {children}
        </FactoryContext.Provider>
    );
}

export { FactoryContext, FactoryProvider };

export {}; // Asegura que este archivo se considere un módulo
