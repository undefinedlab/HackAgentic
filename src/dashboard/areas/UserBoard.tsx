import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowUpRight,
  Users,
  Bell,
} from 'lucide-react';
import styles from './marketplace.module.css';

// Dummy data for line and pie charts
const performanceData = [
  { date: 'Mon', value: 2400, prediction: 2600 },
  { date: 'Tue', value: 3600, prediction: 3200 },
  { date: 'Wed', value: 3200, prediction: 3400 },
  { date: 'Thu', value: 4500, prediction: 4200 },
  { date: 'Fri', value: 4200, prediction: 4600 },
  { date: 'Sat', value: 5100, prediction: 4800 },
  { date: 'Sun', value: 5900, prediction: 5600 },
];

const breakdownData = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Real Estate', value: 300 },
  { name: 'Cash', value: 200 },
];

const COLORS = ['#3b82f6', '#10B981', '#F59E0B', '#EF4444'];

// Interfaces to type our agents data
interface TraderStats {
  roi7: number;
  roi180: number;
  winRate: number;
  pnl: number;
  copies: number;
}

interface Strategy {
  id: number;
  name: string;
  avatar: string;
  capacity: string;
  stats: TraderStats;
  performance: Array<{ value: number }>;
  isFeatured: boolean;
  status: 'available' | 'full';
  frequency: 'high' | 'medium' | 'low';
  commission: number;
  description: string;
  listed?: boolean;
}

// Helper functions to compute risk level and corresponding style
const getRiskLevel = (winRate: number): string => {
  if (winRate >= 80) return "Low";
  if (winRate >= 70) return "Medium";
  return "High";
};

const getRiskStyle = (winRate: number): string => {
  const risk = getRiskLevel(winRate);
  switch (risk) {
    case "Low":
      return "px-2 py-1 bg-green-50 text-green-600 rounded text-xs";
    case "Medium":
      return "px-2 py-1 bg-yellow-50 text-yellow-600 rounded text-xs";
    case "High":
      return "px-2 py-1 bg-red-50 text-red-600 rounded text-xs";
    default:
      return "px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs";
  }
};

const CopyTradingDashboard = () => {
  // State to hold agents data loaded from local storage or default values.
  const [agents, setAgents] = useState<Strategy[]>([]);

  useEffect(() => {
    const agentsJSON = localStorage.getItem('agents');
    if (agentsJSON) {
      try {
        const storedAgents = JSON.parse(agentsJSON) as Strategy[];
        if (Array.isArray(storedAgents)) {
          setAgents(storedAgents);
          return;
        }
      } catch (error) {
        console.error('Error parsing agents from localStorage', error);
      }
    }
    // Fallback default agents if localStorage is empty or corrupt.
    const defaultAgents: Strategy[] = [
      {
        id: 1,
        name: "Agent Alpha 1",
        avatar: "https://via.placeholder.com/150",
        capacity: "Deep Learning Strategy",
        stats: { roi7: 5.6, roi180: 15.2, winRate: 89.2, pnl: 1234.56, copies: 0 },
        performance: [{ value: 1200 }, { value: 1500 }],
        isFeatured: false,
        status: 'available',
        frequency: 'high',
        commission: 5,
        description: "Default agent 1",
      },
      {
        id: 2,
        name: "Agent Beta",
        avatar: "https://via.placeholder.com/150",
        capacity: "Momentum Strategy",
        stats: { roi7: 4.5, roi180: 12.8, winRate: 75.0, pnl: 2345.67, copies: 0 },
        performance: [{ value: 1300 }, { value: 1600 }],
        isFeatured: false,
        status: 'available',
        frequency: 'medium',
        commission: 5,
        description: "Default agent 2",
      },
      {
        id: 3,
        name: "Agent Gamma",
        avatar: "https://via.placeholder.com/150",
        capacity: "Value Investing",
        stats: { roi7: 3.2, roi180: 10.1, winRate: 65.0, pnl: 3456.78, copies: 0 },
        performance: [{ value: 1100 }, { value: 1400 }],
        isFeatured: false,
        status: 'available',
        frequency: 'low',
        commission: 5,
        description: "Default agent 3",
      },
      {
        id: 4,
        name: "Agent Delta",
        avatar: "https://via.placeholder.com/150",
        capacity: "Arbitrage Strategy",
        stats: { roi7: 6.1, roi180: 18.3, winRate: 95.0, pnl: 4567.89, copies: 0 },
        performance: [{ value: 1500 }, { value: 1800 }],
        isFeatured: false,
        status: 'available',
        frequency: 'high',
        commission: 5,
        description: "Default agent 4",
      },
    ];
    setAgents(defaultAgents);
    localStorage.setItem('agents', JSON.stringify(defaultAgents));
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.dashboardGrid} ${styles.mainContent}`}>
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          {/* USD Correlation Card */}
          <div className={styles["marketplace-card"]}>
            <div className={styles["marketplace-card-header"]}>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">USD Correlation</h2>
                <p className="text-sm text-gray-500">Boston KEY</p>
              </div>
              <div className={styles.buttonGroup}>
                <button className="px-3 py-1 text-sm border rounded-full">Hour</button>
                <button className="px-3 py-1 text-sm border rounded-full bg-blue-50 text-blue-600">
                  Day
                </button>
                <button className="px-3 py-1 text-sm border rounded-full">Week</button>
              </div>
            </div>
            <div className={styles["marketplace-chart-container"]} style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="prediction"
                    stroke="#e2e8f0"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trading Agents Grid using agents from localStorage */}
          <div className={styles.tradingAgentsGrid}>
            {agents.map((agent) => (
              <div key={agent.id} className={styles["marketplace-card"]}>
                <div className={styles["marketplace-card-header"]}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      {agent.avatar ? (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.capacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-sm text-gray-600">
                      {agent.status === 'available' ? 'Active' : 'Full'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Success Rate</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {agent.stats.winRate}%
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-green-500 ml-1" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Current Position</span>
                    <span className="text-sm font-medium text-gray-800">
                      ${agent.stats.pnl.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Risk Level</span>
                    <span className={getRiskStyle(agent.stats.winRate)}>
                      {getRiskLevel(agent.stats.winRate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          {/* Balance Card */}
          <div className={styles["marketplace-card"]}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Balance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-blue-600">180.72</span>
                <span className="text-sm text-green-500">+2.31%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Open Positions</span>
                  <span className="text-gray-800">232.21</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="text-gray-800">180.72</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Breakdown Card */}
          <div className={styles["marketplace-card"]}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Investment Breakdown</h2>
            <div className={styles["marketplace-chart-container"]} style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={breakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Notifications Card */}
          <div className={styles["marketplace-card"]}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((notification) => (
                <div
                  key={notification}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      New trading signal detected
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CopyTradingDashboard;