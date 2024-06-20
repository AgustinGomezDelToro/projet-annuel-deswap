import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../Title/Title";
import TransactionsList from "./TransactionsList";
import CustomLineChart from "./LineChart";
import '../../../src/index.css';

const Dashboard: React.FC = () => {
    const address = "0x351024A4EC50612C8D1CF70cd508F77f37Da53F8";

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
                    <Link to="/Fees">
                        <CardTitle>Fees</CardTitle>
                    </Link>
                </BounceCard>
                <BounceCard>
                    <Link to="/Admins">
                        <CardTitle>Admins</CardTitle>
                    </Link>
                </BounceCard>
            </div>
            <div className="mb-8">
                <TransactionsList address={address} />

            </div>
            <div className="mb-8">
                <CustomLineChart />
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
