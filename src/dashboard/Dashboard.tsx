import { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FilePlus, 
  Library,
  Store,
  LogOut,
} from 'lucide-react';
import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
import './dashboard.css';

import { ConnectWallet, WalletDefault, WalletDropdownDisconnect, WalletDropdown, WalletDropdownFundLink } from '@coinbase/onchainkit/wallet';

import UserBoard from './areas/UserBoard';
import CreateStrategy from './areas/CreateStrategy';
import Collection from './areas/Collection';
import Marketplace from './areas/Marketplace';
import { strategies } from './areas/data';
import { Avatar, Name, Address, Identity } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'CopyTrade.AI',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Function to check and connect wallet using window.ethereum
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        // Fetch balance after connecting
        const balance = await window.ethereum.request({ 
          method: 'eth_getBalance', 
          params: [accounts[0], 'latest'] 
        });
        setBalance((parseInt(balance) / 1e18).toFixed(4)); // Convert wei to ETH
      } catch (error) {
        console.error('Failed to connect wallet', error);
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask.');
    }
  };

  const NavLink = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`nav-link ${active ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <div className="app-root">
        <header className="app-header">
          <div className="header-content">
            <div className="header-logo">
              <span className="logo-text">🚀 CopyTrade.AI</span>
            </div>
            <div className="header-actions">
  <div className="flex justify-end">
    <ConnectWallet onConnect={connectWallet}>
      <Avatar className="h-6 w-6" />
      <Name />
    </ConnectWallet>
    <WalletDropdown>
      <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
        <Avatar />
        <Name />
        <Address className={color.foregroundMuted} />
      </Identity>
      <WalletDropdownFundLink getOnrampUrl={getOnrampBuyUrl} />
      <WalletDropdownDisconnect />
    </WalletDropdown>
  </div>
</div>
          </div>
        </header>

        <div className="app-container">
          <aside className="app-sidebar">
            <nav className="nav-menu">
              <NavLink 
                icon={LayoutDashboard} 
                label="Dashboard" 
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              <NavLink 
                icon={FilePlus} 
                label="Create Agent" 
                active={activeTab === 'create'}
                onClick={() => setActiveTab('create')}
              />
              <NavLink 
                icon={Library} 
                label="Collection" 
                active={activeTab === 'collection'}
                onClick={() => setActiveTab('collection')}
              />
              <NavLink 
                icon={Store} 
                label="Marketplace" 
                active={activeTab === 'marketplace'}
                onClick={() => setActiveTab('marketplace')}
              />
            </nav>

            <div className="nav-footer">
              <NavLink 
                icon={LogOut} 
                label="Log out" 
                active={false}
                onClick={() => {}}
              />
            </div>
          </aside>

          <main className="app-main">
            {activeTab === 'dashboard' && <UserBoard />}
            {activeTab === 'create' && <CreateStrategy />}
            {activeTab === 'collection' && <Collection />}
            {activeTab === 'marketplace' && (
              <Marketplace 
                traders={strategies}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}
          </main>
        </div>
      </div>
    </WagmiProvider>
  );
};

export default Dashboard;