import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers } from "ethers";
import { createContext } from "react";
import tokenContractABI from "../asset/abi/SimpleTokenABI.json";

const SimpleTokensContext = createContext({
    getBalance: async (tokenAddress: string, account: string) => Promise<string>,
    approve: async (tokenAddress: string, amount: bigint, to: string) => Promise<ethers.TransactionResponse | null>
});

function SimpleTokenProvider({ children }: { children: React.ReactNode }) {
    const { walletProvider } = useWeb3ModalProvider();

    async function getBalance(tokenAddress: string, account: string) {
        const provider = new BrowserProvider(walletProvider as any);
        const tokenContract = new ethers.Contract(tokenAddress, tokenContractABI, provider);
        try {
            const balance = await tokenContract.balanceOf(account);
            return balance;
        } catch (error) {
            console.log(error);
            return "0";
        }
    }

    async function approve(tokenAddress: string, amount: bigint, to: string) {
        const provider = new BrowserProvider(walletProvider as any);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, tokenContractABI, signer);
        try {
            const tx = await tokenContract.approve(to, amount);
            await tx.wait();
            return tx;
        } catch (error) {
            console.log(error);
            return null;
        }
    
    }

    return (
        <SimpleTokensContext.Provider value={{ getBalance, approve }}>
            {children}
        </SimpleTokensContext.Provider>
    );
}

export { SimpleTokensContext, SimpleTokenProvider };