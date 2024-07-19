import { BrowserProvider, ethers } from "ethers";
import { SimpleERC20ABI, SimpleERC20Bytecode } from "./SimpleERC20";

interface DeployProps {
    name: string;
    symbol: string;
    setMessage: (message: string) => void;
    setNotification: (notification: boolean) => void;
    walletProvider: any;
}

export const deploy = async ({ name, symbol, setMessage, setNotification, walletProvider }: DeployProps) => {
    const provider = new BrowserProvider(walletProvider as any);
    const signer = await provider.getSigner();
    const factory = new ethers.ContractFactory(SimpleERC20ABI, SimpleERC20Bytecode.bytecode, signer);

    try {
        setMessage("Deploying token...");
        setNotification(true);
        const contract = await factory.deploy(name, symbol);
        await contract.waitForDeployment();
        return await contract.getAddress();
    } catch (e) {
        console.error(e);
        setMessage("Error while deploying token");
        setNotification(true);
        return null;
    }
};
