import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../Title/Title";
import TransactionsList from "./TransactionsList";
import CustomLineChart from "./LineChart";
import '../../../src/index.css';
import axios from 'axios';
import { formatEther } from 'ethers'; // Importer les utils spécifiques

interface Transaction {
    hash: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
    isError: string;
}

const Dashboard: React.FC = () => {
    const address = "0x351024A4EC50612C8D1CF70cd508F77f37Da53F8";
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [chartData, setChartData] = useState<{ name: string, value: number }[]>([]);

    const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
    const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(apiUrl);
                if (response.data.status === '1') {
                    const fetchedTransactions = response.data.result.reverse();
                    setTransactionData(fetchedTransactions);
                    const formattedData = fetchedTransactions.map((tx: Transaction, index: number) => ({
                        name: `Tx ${index + 1}`,
                        value: parseFloat(formatEther(tx.value))
                    }));
                    setChartData(formattedData);
                } else {
                    console.error('Error fetching transactions:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [apiUrl]);

    const handleFilter = (filteredData: { name: string, value: number }[]) => {
        setChartData(filteredData);
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 text-gray-900">
            <Title Text="Overview" />
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BounceCard>
                    <Link to="/Users">
                        <CardTitle>Users</CardTitle>
                    </Link>
                </BounceCard>
                <BounceCard>
                    <Link to="/Tokens">
                        <CardTitle>Tokens</CardTitle>
                    </Link>
                </BounceCard>
                <BounceCard>
                        <CardTitle>Fees</CardTitle>
                </BounceCard>
                <BounceCard>
                    <Link to="/Admins">
                        <CardTitle>Admins</CardTitle>
                    </Link>
                </BounceCard>
            </div>
            <div className="mb-8">
                <TransactionsList address={address} onFilter={handleFilter} />
            </div>
            <div className="mb-8">
                <CustomLineChart data={chartData} />
            </div>
        </section>
    );
};

const BounceCard = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative min-h-[30px] cursor-pointer overflow-hidden rounded-2xl bg-white p-8 shadow-lg"
        >
            {children}
        </motion.div>
    );
};

const CardTitle = ({ children }: { children: ReactNode }) => {
    return (
        <h3 className="text-center text-2xl font-semibold">{children}</h3>
    );
};

export default Dashboard;
