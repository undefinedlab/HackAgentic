import { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FilePlus, 
  Library,
  Store,
  Settings,
  LogOut,
  Search,
  Star,
  Copy,
  Filter,
  Grid,
  List
} from 'lucide-react';
import './dashboard.css';

import UserBoard from './areas/UserBoard';
import Wallets from './areas/Wallets';
import CreateStrategy from './areas/CreateStrategy';
import Collection from './areas/Collection';
import Marketplace from './areas/Marketplace';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('grid');

  const traders = [
    {
      id: 1,
      name: "Random Name",
      avatar: "/api/placeholder/40/40",
      gain: 48,
      commission: 250,
      investors: 25400,
      winRate: 38,
      profit: 2548,
      risk: 12,
      isFavorite: false
    },
  ];

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
    <div className="app-root">
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-text">🚀 CopyTrade.AI</span>
          </div>
          <div className="header-actions">
            <button className="btn-deposit">
              Fund Wallet
            </button>
            <button className="btn-connect-wallet">
              <span>Connect Wallet</span>
            </button>
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
              icon={Wallet} 
              label="My Wallets" 
              active={activeTab === 'wallets'}
              onClick={() => setActiveTab('wallets')}
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
          {activeTab === 'wallets' && <Wallets />}
          {activeTab === 'create' && <CreateStrategy />}
          {activeTab === 'collection' && <Collection />}
          {activeTab === 'marketplace' && (
            <Marketplace 
              traders={traders} 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;