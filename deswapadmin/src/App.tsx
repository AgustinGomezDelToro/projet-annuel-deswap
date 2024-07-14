import './App.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Users from './components/Users/Users';
import Admins from './components/Admins/Admins';
import Fee from './components/Fee/Fee';
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount } from '@web3modal/ethers/react';
import ConnectButton from './asset/hooks/connectWallet';
import { useContext } from 'react';
import { AdminContext } from './asset/hooks/isAdmin';
import PendingTx from './components/PendingTx/PendingTx';
import Tokens from './components/Tokens/Tokens';

const projectId = 'e20faa0911a9c960827e06ea6f656510';
const chains = [{
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: process.env.REACT_APP_RPC_URL!
}];
const metadata = {
  name: 'DeSwap Admin',
  description: 'DeSwap dashboard',
  url: '',
  icons: ['https://avatars.mywebsite.com/']
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 11155111,
});

createWeb3Modal({
  ethersConfig,
  chains: chains,
  projectId,
  enableAnalytics: true
});

function App() {
  const { isConnected } = useWeb3ModalAccount();
  const { isAdmin, setIsAdmin } = useContext(AdminContext);

  return (
    !isAdmin && !isConnected ?
        <div className='bg-colors-gray1 h-screen flex items-center justify-center'>
          <ConnectButton />
        </div>
        :
    <div className="bg-colors-green1 w-full h-screen flex">
          <Navbar />
          <div className='w-5/6 h-screen overflow-y-scroll overflow-x-hidden'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/fees" element={<Fee />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/pending" element={<PendingTx />} />
            </Routes>
          </div>
        </div>
);
}

export default App;
