import { motion } from "framer-motion";
import ConnectButton from "../../asset/hooks/connectWallet";

const Title = ({ Text }: { Text: string }) => {
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-8">
            <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
                {Text}
            </h2>
            <ConnectButton />
        </div>
    );
}

export default Title;