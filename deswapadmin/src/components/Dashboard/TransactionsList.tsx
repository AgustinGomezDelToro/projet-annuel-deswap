import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatEther } from 'ethers';
import { format, getWeek } from 'date-fns'; // Importer les fonctions de date-fns

interface Transaction {
    hash: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
    isError: string;
}

interface TransactionsListProps {
    address: string;
    onFilter: (filteredData: { name: string, value: number }[]) => void; // Ajouter une prop pour passer les données filtrées
}

const TransactionsList: React.FC<TransactionsListProps> = ({ address, onFilter }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const transactionsPerPage = 10;
    const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
    const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(apiUrl);
                if (response.data.status === '1') {
                    const fetchedTransactions = response.data.result;
                    setTransactions(fetchedTransactions);
                    setFilteredTransactions(fetchedTransactions);
                } else {
                    console.error('Error fetching transactions:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [address, apiUrl]);

    useEffect(() => {
        filterTransactions();
    }, [transactions, filterQuery, startDate, endDate]);

    const filterTransactions = () => {
        let filtered = transactions;

        if (filterQuery) {
            filtered = filtered.filter(tx => tx.from.toLowerCase().includes(filterQuery));
        }

        if (startDate) {
            const startTimestamp = new Date(startDate).getTime() / 1000;
            filtered = filtered.filter(tx => parseInt(tx.timeStamp) >= startTimestamp);
        }

        if (endDate) {
            const endTimestamp = new Date(endDate).getTime() / 1000;
            filtered = filtered.filter(tx => parseInt(tx.timeStamp) <= endTimestamp);
        }

        setFilteredTransactions(filtered);

        // Regrouper les transactions par semaine et les trier par date
        const groupedData: { [key: string]: number } = {};
        filtered.forEach(tx => {
            const date = new Date(parseInt(tx.timeStamp) * 1000);
            const week = `Week ${getWeek(date)} of ${date.getFullYear()}`;
            if (!groupedData[week]) {
                groupedData[week] = 0;
            }
            groupedData[week] += parseFloat(formatEther(tx.value));
        });

        const sortedGroupedData = Object.keys(groupedData)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map(week => ({
                name: week,
                value: groupedData[week],
            }));

        onFilter(sortedGroupedData);
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const abbreviateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const abbreviateHash = (hash: string) => {
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard: ' + text);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterQuery(event.target.value.toLowerCase());
        setCurrentPage(1);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Transactions List</h2>
            <div className="w-full flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Filter by 'From' address"
                    value={filterQuery}
                    onChange={handleFilterChange}
                    className="w-full max-w-xs px-3 py-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
                />
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 text-center text-lg">Transaction ID</th>
                        <th className="py-2 px-4 text-center text-lg">Date</th>
                        <th className="py-2 px-4 text-center text-lg">From</th>
                        <th className="py-2 px-4 text-center text-lg">To</th>
                        <th className="py-2 px-4 text-center text-lg">Amount</th>
                        <th className="py-2 px-4 text-center text-lg">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTransactions.map(tx => (
                        <tr key={tx.hash} className="text-center text-base">
                            <td className="py-2 px-4">
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer"
                                    title="Click to view on Etherscan"
                                >
                                    {abbreviateHash(tx.hash)}
                                </a>
                            </td>
                            <td className="py-2 px-4">{new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}</td>
                            <td className="py-2 px-4">
                                <span
                                    title={`Click to copy: ${tx.from}`}
                                    onClick={() => copyToClipboard(tx.from)}
                                    className="cursor-pointer"
                                >
                                    {abbreviateAddress(tx.from)}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <span
                                    title={`Click to copy: ${tx.to}`}
                                    onClick={() => copyToClipboard(tx.to)}
                                    className="cursor-pointer"
                                >
                                    {abbreviateAddress(tx.to)}
                                </span>
                            </td>
                            <td className="py-2 px-4">{formatEther(tx.value)} ETH</td>
                            <td className="py-2 px-4">{tx.isError === '0' ? 'Success' : 'Failed'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                transactionsPerPage={transactionsPerPage}
                totalTransactions={filteredTransactions.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
};

const Pagination: React.FC<{
    transactionsPerPage: number;
    totalTransactions: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}> = ({ transactionsPerPage, totalTransactions, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight border border-gray-300 ${currentPage === number ? 'bg-gray-300' : 'bg-white'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TransactionsList;
