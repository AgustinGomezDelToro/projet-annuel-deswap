import { useContext, useEffect, useState } from "react";
import Title from "../Title/Title";
import { IUser } from "../../interfaces/Users";
import User from "../../services/User";
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
            const admins: IUser[] = await new User().getAll();
            setAdmins(admins.filter((user) => user.role === "admin"));
        } catch (e) {
            console.error(e);
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
        await new User().update({ ...userSelected, role: "user" });
        setNotification(true);
        fetchDatas();
    }

    useEffect(() => {
        if (notification === true) {
            setUserSelected(null);
            setActionActive(false);
        }
    }, [notification]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 text-colors-black1">
            <Title Text="Admins" />
            <div className="w-full flex justify-between items-center px-8">
                {/*<p>Safe address : {cropAddress(accountAddress!)}</p>
                <div className="relative w-full max-w-xs">
                    <input type="text" placeholder="Search" className="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none" />
                    <svg className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>*/}
            </div>
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 md:rounded-lg">

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-gray-500">
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>#ID</span>
                                            </button>
                                        </th>

                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-gray-500 text-center">
                                            Public key
                                        </th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                                            Signature
                                        </th>

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {admins && admins.map((user, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                <div>
                                                    <h2 className="font-medium text-gray-800">{user.ID}</h2>
                                                </div>
                                            </td>
                                            <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">{cropAddress(user.public_key)} {user.public_key == address && "(me)"}</h4>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <div>
                                                    <h4 className="text-gray-700">{cropAddress(user.signature)}</h4>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 space-x-2 text-sm text-right whitespace-nowrap">
                                                <button disabled={user.public_key == address} onClick={() => action(user)} className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-blue-400 hover:bg-blue-500 focus:outline-none">
                                                    Downgrade to User
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {actionActive &&
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8" role="alert">
                    <p className="font-medium sm:text-lg">Are you sure you want to downgrade this admin ?</p>

                    <p className="mt-4 text-gray-500">
                        Admin's public key : {userSelected?.public_key}
                    </p>

                    <div className="mt-6 sm:flex sm:gap-4">
                        <button
                            className="inline-block w-full rounded-lg bg-colors-black1 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                            onClick={submit}
                        >
                            Validate
                        </button>

                        <button
                            className="mt-2 inline-block w-full rounded-lg bg-gray-100 px-5 py-3 text-center text-sm font-semibold text-gray-600 sm:mt-0 sm:w-auto"
                            onClick={() => setActionActive(false)}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            }
            {notification && <StackedNotifications text={`Admin ${cropAddress(userSelected?.public_key)} downgrade to user`} id={1} setShow={setNotification} />}
        </section>
    );
}

export default Admins;