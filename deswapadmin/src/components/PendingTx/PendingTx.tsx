import { useContext, useEffect, useState } from "react";
import { SafeContext } from "../../asset/hooks/safe";
import Title from "../Title/Title";
import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { cropAddress } from "../../asset/utils/cropAddress";
import StackedNotifications from "../Notifications/Notifications";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const PendingTx = () => {
    const { address } = useWeb3ModalAccount();
    const { getPendingTransactions, signPendingTransaction } = useContext(SafeContext);
    const [transactions, setTransactions] = useState<SafeMultisigTransactionResponse[]>([]);

    const [notification, setNotification] = useState<boolean>(false);

    useEffect(() => {
        async function fetchDatas() {
            const pendingTransactions = await getPendingTransactions();
            console.log(pendingTransactions);

            if (pendingTransactions) {
                setTransactions(pendingTransactions);
            }
        }

        fetchDatas();
    }, []);

    async function signTx(txHash: string) {
        try{
        const response = await signPendingTransaction(txHash);
        console.log(response);
        setNotification(true);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <section className="mx-auto max-w-7xl px-4 py-8 text-colors-black1">
            <Title Text="Pending transactions" />
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <h2 className="text-lg font-semibold text-gray-800 ml-4">Add owner</h2>
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
                                            Proposer
                                        </th>

                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-gray-500 text-center">
                                            User address
                                        </th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                                            Confirmations
                                        </th>

                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-gray-500 text-center">
                                            Submission date
                                        </th>

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions && transactions.map((tx, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                <div>
                                                    <h2 className="font-medium text-gray-800">1</h2>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">{cropAddress(tx.proposer)}</h4>
                                            </td>
                                            <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">
                                                    {cropAddress((tx.dataDecoded as any).parameters[0].value)}
                                                </h4>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">{tx.confirmations?.length} / {tx.confirmationsRequired}</h4>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                                                <h4 className="text-gray-700">{new Date(tx.submissionDate).toLocaleString()}</h4>
                                            </td>

                                            <td className="px-4 py-4 space-x-2 text-sm text-right whitespace-nowrap">
                                                {tx.confirmations?.find((c) => c.owner === address) ? (
                                                    <button disabled className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-gray-400 focus:outline-none">
                                                        Signed
                                                    </button>
                                                ) : (
                                                    <button onClick={() => signTx(tx.safeTxHash)} className="px-2 py-1 text-white transition-colors duration-200 rounded-lg bg-blue-400 hover:bg-blue-500 focus:outline-none">
                                                        Sign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {notification && <StackedNotifications text={`Transaction signed successfully !`} id={1} setShow={setNotification} />}
        </section>
    );
}

export default PendingTx;