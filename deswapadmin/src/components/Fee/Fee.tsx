import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Fee {
  id: number;
  amount: number;
  token_id: number;
  from_wallet: string;
  to_wallet: string;
  created_at: string;
}

const FeeComponent: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees', error);
    }
  };

  const handleFilterFees = async () => {
    try {
      let url = 'http://localhost:3001/fees';
      if (filter === 'user') {
        url += `/user/${filterValue}`;
      } else if (filter === 'token') {
        url += `/token/${filterValue}`;
      } else if (filter === 'wallet') {
        url += `/wallet/${filterValue}`;
      }
      const response = await axios.get(url);
      setFees(response.data);
    } catch (error) {
      console.error('Error filtering fees', error);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 text-colors-black1">
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Filter Fees</h2>
          <div className="space-y-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
            >
              <option value="">Select Filter</option>
              <option value="user">By User</option>
              <option value="token">By Token</option>
              <option value="wallet">By Wallet</option>
            </select>
            <input
              type="text"
              placeholder="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-none"
            />
            <button 
              onClick={handleFilterFees} 
              className="w-full py-2 text-white transition-colors duration-200 rounded-lg bg-blue-400 hover:bg-blue-500 focus:outline-none"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-gray-500 text-center">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                      Token ID
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                      From Wallet
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                      To Wallet
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-gray-500 text-center">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees && fees.map((fee, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                        <div>
                          <h4 className="text-gray-700">{fee.amount}</h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                        <div>
                          <h4 className="text-gray-700">{fee.token_id}</h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                        <div>
                          <h4 className="text-gray-700">{fee.from_wallet}</h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                        <div>
                          <h4 className="text-gray-700">{fee.to_wallet}</h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                        <div>
                          <h4 className="text-gray-700">{new Date(fee.created_at).toLocaleString()}</h4>
                        </div>
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

export default FeeComponent;
