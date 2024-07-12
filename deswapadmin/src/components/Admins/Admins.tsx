import { useContext, useEffect, useState } from "react";
import Title from "../Title/Title";
import { IUser } from "../../interfaces/Users";
import axios from "axios";
import { cropAddress } from "../../asset/utils/cropAddress";
import StackedNotifications from "../Notifications/Notifications";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { SafeContext } from "../../asset/hooks/safe";

const Admins = () => {
    const [admins, setAdmins] = useState<IUser[] | null>(null);
    const [userSelected, setUserSelected] = useState<IUser | null>(null);
    const [actionActive, setActionActive] = useState<boolean>(false);
    const [notification, setNotification] = useState<boolean>(false);
    const { accountAddress } = useContext(SafeContext);
    const { address } = useWeb3ModalAccount();

    async function fetchDatas() {
        try {
            const response = await axios.get("http://localhost:3001/users");
            const users: IUser[] = response.data;
            setAdmins(users.filter((user) => user.is_admin));
        } catch (e) {
            console.error("Failed to fetch data:", e);
        }
    }

    useEffect(() => {
        fetchDatas();
    }, []);

    async function action(user: IUser) {
        setUserSelected(user);
        setActionActive(true);
    }

    async function submit() {
        if (!actionActive || !userSelected) {
            return;
        }
        try {
            await axios.put(`http://localhost:3001/users/update`, {
                ...userSelected,
                is_admin: false
            });
            setNotification(true);
            fetchDatas();
        } catch (e) {
            console.error("Failed to update user:", e);
        }
    }

    useEffect(() => {
        if (notification) {
            setUserSelected(null);
            setActionActive(false);
        }
    }, [notification]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 text-colors-black1">
            <Title Text="Admins" />
            <div className="w-full flex justify-between items-center px-8">
                <p>Safe address : {cropAddress(accountAddress!)}</p>
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
                    />
                    <svg
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
            </div>
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-4 text-sm font-normal text-gray-500"
                                        >
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>#ID</span>
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-gray-500 text-center"
                                        >
                                            Public key
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center"
                                        >
                                            Signature
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative py-3.5 px-4"
                                        >
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {admins && admins.map((user, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                <div>
                                                    <h2 className="font-medium text-gray-800">
                                                        {user.ID}
                                                    </h2>
                                                </div>
                                            </td>
                                            <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">
                                                    {cropAddress(user.public_key)}{" "}
                                                    {user.public_key === address && "(me)"}
                                                </h4>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <div>
                                                    <h4 className="text-gray-700">
                                                        {cropAddress(user.signature)}
                                                    </h4>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 space-x-2 text-sm text-right whitespace-nowrap">
                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Admins;
