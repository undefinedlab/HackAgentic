import React from 'react';
import { LineChart, Line } from 'recharts';
import { Star, Zap, TrendingUp, ChevronDown, Filter, Search, List, Grid } from 'lucide-react';
import TraderCard from '../elements/TraderCard';

interface Trader {
  id: number;
  name: string;
  avatar: string;
  gain: number;
  commission: number;
  investors: number;
  winRate: number;
  profit: number;
  risk: number;
  isFavorite: boolean;
}

interface MarketplaceProps {
  traders: Trader[];
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const Marketplace = ({ traders, viewMode, setViewMode }: MarketplaceProps) => {
  const performanceData = Array(20).fill().map((_, i) => ({
    value: Math.random() * 100 + 50
  }));

  const strategies = [
    {
      id: 1,
      name: "Alpha Predictor Pro",
      avatar: "/api/placeholder/48/48",
      capacity: "490/500",
      stats: {
        roi: 87.65,
        pnl: 456789.23,
        mdd: 12.34,
        aum: 2543789.45,
        sharpe: 4.89
      },
      performance: performanceData,
      isFeatured: true,
      status: "available"
    },
    {
      id: 2,
      name: "Quantum Edge AI",
      avatar: "/api/placeholder/48/48",
      capacity: "980/1000",
      stats: {
        roi: 65.43,
        pnl: 234567.89,
        mdd: 8.76,
        aum: 1987654.32,
        sharpe: 3.45
      },
      performance: performanceData,
      isFeatured: true,
      status: "available"
    },
    {
      id: 3,
      name: "Neural Net Trader",
      avatar: "/api/placeholder/48/48",
      capacity: "295/300",
      stats: {
        roi: 54.32,
        pnl: 123456.78,
        mdd: 15.67,
        aum: 876543.21,
        sharpe: 2.98
      },
      performance: performanceData,
      isFeatured: true,
      status: "full"
    },
    // Add more strategies...
  ];

  const StrategyCard = ({ strategy }) => (
    <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <img src={strategy.avatar} alt={strategy.name} className="rounded-full" />
          <div>
            <div className="font-semibold text-white">{strategy.name}</div>
            <div className="text-sm text-gray-400">{strategy.capacity}</div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <Star size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-400">7D ROI</div>
          <div className="text-green-400 font-semibold">+{strategy.stats.roi}%</div>
        </div>
        <div className="h-16">
          <LineChart width={200} height={60} data={strategy.performance}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#22c55e" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-400">7D PNL</div>
          <div className="text-green-400">+{strategy.stats.pnl.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">7D MDD</div>
          <div className="text-white">{strategy.stats.mdd}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">AUM</div>
          <div className="text-white">${strategy.stats.aum.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Sharpe Ratio</div>
          <div className="text-white">{strategy.stats.sharpe}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
          Mock Copy
        </button>
        <button className={`py-2 rounded-lg transition-colors ${
          strategy.status === 'available' 
            ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
            : 'bg-red-900 text-red-300'
        }`}>
          {strategy.status === 'available' ? 'Copy' : 'Full'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="filter-bar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              My copies
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Platform
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Commission
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search strategy"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="trader-grid">
        {traders.map(trader => (
          <TraderCard key={trader.id} trader={trader} />
        ))}
      </div>
    </>
  );
};

export default Marketplace;