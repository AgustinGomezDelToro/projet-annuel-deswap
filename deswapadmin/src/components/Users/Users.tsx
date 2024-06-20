import { useContext, useEffect, useState } from "react";
import Title from "../Title/Title";
import { IUser } from "../../interfaces/Users";
import User from "../../services/User";
import { cropAddress } from "../../asset/utils/cropAddress";
import StackedNotifications from "../Notifications/Notifications";
import { SafeContext } from "../../asset/hooks/safe";
import { Link } from "react-router-dom";

enum ActionType {
    ban = "ban",
    unban = "unban",
    upgrade = "upgrade"
}

const Users = () => {
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [userSelected, setUserSelected] = useState<IUser | null>(null);
    const [actionActive, setActionActive] = useState<ActionType | null>(null);
    const [notification, setNotification] = useState<boolean>(false);
    const { addAdmin } = useContext(SafeContext);

    async function fetchDatas() {
        try {
            const users: IUser[] = await new User().getAll();
            setUsers(users.filter((user) => user.role !== "admin"));
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchDatas();
    }, []);

    async function action(user: IUser, actionType: ActionType) {
        setUserSelected(user);
        setActionActive(actionType);
    }

    async function submit() {
        if (!actionActive || !userSelected) {
            return;
        }

        switch (actionActive) {
            case ActionType.ban:
                await new User().update({ ...userSelected, status: "ban" });
                setNotification(true);
                break;
            case ActionType.upgrade:
                await addAdmin({ ownerAddress: userSelected?.public_key });
                await new User().update({ ...userSelected, role: "pending" });
                setNotification(true);
                break;
            case ActionType.unban:
                await new User().update({ ...userSelected, status: "active" });
                setNotification(true);
                break;
        }
        fetchDatas();
    }

    useEffect(() => {
        if (notification === true) {
            setUserSelected(null);
            setActionActive(null);
        }
    }, [notification]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 text-colors-black1">
            <Title Text="Users" />
            <div className="w-full flex justify-end px-8">
                <div className="relative w-full max-w-xs">
                    <input type="text" placeholder="Search" className="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none" />
                    <svg className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
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

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">Status</th>

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users && users.map((user, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                <div>
                                                    <h2 className="font-medium text-gray-800">{user.ID}</h2>
                                                </div>
                                            </td>
                                            <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">{cropAddress(user.public_key)}</h4>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <div>
                                                    <h4 className="text-gray-700">{cropAddress(user.signature)}</h4>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                {user.status === "active" ?
                                                    <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
                                                        Active
                                                    </div>
                                                    :
                                                    <div className="inline px-3 py-1 text-sm font-normal rounded-full text-red-500 gap-x-2 bg-red-100/60">
                                                        Ban
                                                    </div>
                                                }
                                            </td>

                                            <td className="px-4 py-4 space-x-2 text-sm text-right whitespace-nowrap">
                                                {user.status === "active" ?
                                                    <>
                                                        <button disabled={user.role === "pending"} onClick={() => action(user, ActionType.ban)} className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-red-400 hover:bg-red-500 focus:outline-none">
                                                            Ban
                                                        </button>
                                                        {user.role === "pending" ?
                                                            <Link to={"/Pending"} className="px-2 py-1.5 text-white transition-colors duration-200 rounded-lg bg-blue-400 hover:bg-blue-500 focus:outline-none">
                                                                Upgrade requested
                                                            </Link>
                                                            :
                                                            <button onClick={() => action(user, ActionType.upgrade)} className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-blue-400 hover:bg-blue-500 focus:outline-none">
                                                                Upgrade to Admin
                                                            </button>
                                                        }
                                                    </>
                                                    :
                                                    <button onClick={() => action(user, ActionType.unban)} className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-emerald-400 hover:bg-emerald-500 focus:outline-none">
                                                        Unban
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {actionActive !== null &&
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8" role="alert">
                    <p className="font-medium sm:text-lg">Are you sure you want to {actionActive} this user ?</p>

                    <p className="mt-4 text-gray-500">
                        User's public key : {userSelected?.public_key}
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
                            onClick={() => setActionActive(null)}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            }
            {notification && <StackedNotifications text={`User ${cropAddress(userSelected?.public_key)} ${actionActive}`} id={1} setShow={setNotification} />}
        </section>
    );
}

export default Users;