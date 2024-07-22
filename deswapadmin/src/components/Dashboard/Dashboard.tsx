import React, { ReactNode, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../Title/Title";
import { twMerge } from "tailwind-merge";
import TransactionsList from "./TransactionsList";
import CustomLineChart from "./LineChart";
import '../../../src/index.css';
import { IUser } from "../../interfaces/Users";
import User from "../../services/User";
import { BlockchainContext } from "../../asset/hooks/blockchain";


const Dashboard: React.FC = () => {
    const address = "0x351024A4EC50612C8D1CF70cd508F77f37Da53F8";
    const [chartData, setChartData] = useState<{ name: string, value: number }[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [banned, setBanned] = useState<IUser[]>([]);

    const context = useContext(BlockchainContext);
    const { getStakers } = context!;

    useEffect(() => {
        async function fetchData() {
            const userService = new User();
            const users = await userService.getAll();
            setUsers(users);
            const banned = users.filter((user: IUser) => user.status === "ban");
            setBanned(banned);
        }

        fetchData();
    }, [getStakers]);

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
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BounceCard>
                    <p className="text-xl">Total stakers</p>
                    <p className="text-5xl font-semibold">3</p>
                </BounceCard>
                <BounceCard>
                    <p className="text-xl">Total users</p>
                    <p className="text-5xl font-semibold">{users.length}</p>
                </BounceCard>
                <BounceCard>
                    <p className="text-xl">Users banned</p>
                    <p className="text-5xl font-semibold">{banned.length}</p>
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
