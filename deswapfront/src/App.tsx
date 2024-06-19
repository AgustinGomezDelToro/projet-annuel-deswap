import './styles/app.scss';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import NotFound from './components/404/404';
import Home from './components/Home/Home';
import Swap from './components/Swap/Swap';
import Tokens from './components/Tokens/Tokens';
import Pools from './components/Pools/Pools';
import Pool from './components/Pools/Pool/Pool';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import NewPool from './components/Pools/Create/NewPool';

function App() {

  // 1. Get projectId at https://cloud.walletconnect.com
  const projectId = 'e20faa0911a9c960827e06ea6f656510' // METTRE DANS LE .ENV

  // 2. Set chains
  const chains = [{
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: process.env.REACT_APP_RPC_URL!
  }]

  // 3. Create modal
  const metadata = {
    name: 'DeSwap',
    description: 'DeSwap dapp',
    url: '', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/']
  }

  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeVariables: {
      '--w3m-accent': "#EEEEEE",
    },
    themeMode: 'dark'
  })

  return (
    <div className='min-h-screen bg'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/pools/:id" element={<Pool />} />
        <Route path="/create" element={<NewPool />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
