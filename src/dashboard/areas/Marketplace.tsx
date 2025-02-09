import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { 
  Star, Filter, Search, List, Grid, 
  SlidersHorizontal, Clock, TrendingUp, DollarSign 
} from 'lucide-react';
import styles from './marketplace.module.css';

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
  listed?: boolean; // Optional property for additional agents
}

interface MarketplaceProps {
  traders: Strategy[];
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const Marketplace = ({ traders: initialTraders, viewMode, setViewMode }: MarketplaceProps) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<string[]>([]);
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState<'roi' | 'commission' | 'aum'>('roi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // State for tracking which traders have been added
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const frequencies = ['high', 'medium', 'low'];
  
  // On component mount, initialize addedIds from localStorage to ensure persistence
  useEffect(() => {
    const agentsJSON = localStorage.getItem('agents');
    if (agentsJSON) {
      try {
        const agents = JSON.parse(agentsJSON);
        if (Array.isArray(agents)) {
          setAddedIds(agents.map((agent: Strategy) => agent.id));
        } else {
          setAddedIds([]);
        }
      } catch (error) {
        console.error('Error parsing agents from localStorage', error);
        // Reset the agents to an empty array if malformed
        localStorage.setItem('agents', '[]');
        setAddedIds([]);
      }
    }
  }, []);

  // Update displayed traders so that:
  // 1. Agents that are NOT marked as listed are shown only if they match the filters (search, frequency, commission, ROI).
  // 2. Agents with listed:true are always included. Also, if any required data is missing, we default to null (or safe fallback values).
  const displayedTraders = useMemo(() => {
    // Only apply filters on non-listed agents.
    const nonListed = initialTraders.filter(trader => !trader.listed).filter(trader => {
      const matchesSearch = trader.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFrequency = selectedFrequency.length === 0 || selectedFrequency.includes(trader.frequency);
      const matchesCommission = trader.commission >= commissionRange[0] && trader.commission <= commissionRange[1];
      const matchesRoi = trader.stats?.roi7 >= roiRange[0] && trader.stats?.roi7 <= roiRange[1];
      return matchesSearch && matchesFrequency && matchesCommission && matchesRoi;
    });

    // Include all listed agents regardless of filters.
    const listedAgents = initialTraders.filter(trader => trader.listed === true);

    // Combine both arrays
    let union = [...nonListed, ...listedAgents];

    // For each trader, fill in missing fields with null (or safe fallback values).
    union = union.map(agent => ({
      ...agent,
      name: agent.name || null,
      avatar: agent.avatar || null,
      capacity: agent.capacity || null,
      stats: {
        roi7: agent.stats?.roi7 ?? null,
        roi180: agent.stats?.roi180 ?? null,
        winRate: agent.stats?.winRate ?? null,
        pnl: agent.stats?.pnl ?? null,
        copies: agent.stats?.copies ?? null,
      },
      performance: agent.performance || [],
      isFeatured: agent.isFeatured ?? false,
      status: agent.status || null,
      frequency: agent.frequency || null,
      commission: agent.commission ?? null,
      description: agent.description || null,
      listed: agent.listed ?? false,
    }));

    // Apply sorting for the entire union.
    union.sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'roi') {
        return ((a.stats?.roi7 ?? 0) - (b.stats?.roi7 ?? 0)) * modifier;
      }
      if (sortBy === 'commission') {
        return ((a.commission ?? 0) - (b.commission ?? 0)) * modifier;
      }
      // Fallback for AUM (assuming AUM might be stored in stats and default to 0 if missing)
      return (((a.stats as any)?.aum ?? 0) - ((b.stats as any)?.aum ?? 0)) * modifier;
    });

    return union;
  }, [initialTraders, searchQuery, selectedFrequency, commissionRange, roiRange, sortBy, sortOrder]);

  // Helper function to handle running an agent.
  const handleRun = (trader: Strategy) => {
    // Prevent duplicate saving.
    if (addedIds.includes(trader.id)) return;
    
    const agentsJSON = localStorage.getItem('agents');
    const existingAgents = agentsJSON ? JSON.parse(agentsJSON) : [];
    existingAgents.push(trader);
    localStorage.setItem('agents', JSON.stringify(existingAgents));
    
    setAddedIds(prev => [...prev, trader.id]);
  };

  return (
    <div className={styles.container}>
      {/* Main Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarContent}>
          <div className={styles.filterControls}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filterButton}
            >
              <Filter size={20} />
              Filters
            </button>
            
            <div className={styles.frequencyTags}>
              {frequencies.map(freq => (
                <button
                  key={freq}
                  onClick={() => {
                    setSelectedFrequency(prev => 
                      prev.includes(freq)
                        ? prev.filter(f => f !== freq)
                        : [...prev, freq]
                    );
                  }}
                  className={`${styles.frequencyTag} ${
                    selectedFrequency.includes(freq)
                      ? styles.frequencyTagActive
                      : styles.frequencyTagInactive
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)} Freq
                </button>
              ))}
            </div>
          </div>

          <div className={styles.searchSortControls}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search strategy"
                className={styles.searchInput}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'roi' | 'commission' | 'aum')}
              className={styles.sortSelect}
            >
              <option value="roi">Sort by ROI</option>
              <option value="commission">Sort by Commission</option>
              <option value="aum">Sort by AUM</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className={styles.sortOrderButton}
            >
              <TrendingUp 
                size={20} 
                className={`${styles.sortOrderIcon} ${
                  sortOrder === 'desc' ? styles.sortDesc : ''
                }`}
              />
            </button>

            <div className={styles.viewModeButtons}>
              <button 
                onClick={() => setViewMode('list')}
                className={`${styles.viewModeButton} ${
                  viewMode === 'list' ? styles.viewModeActive : ''
                }`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`${styles.viewModeButton} ${
                  viewMode === 'grid' ? styles.viewModeActive : ''
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className={styles.advancedFilters}>
            <div>
              <label className={styles.filterLabel}>
                Commission Range (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={commissionRange[1]}
                onChange={(e) => setCommissionRange([commissionRange[0], Number(e.target.value)])}
                className={styles.rangeInput}
              />
              <div className={styles.rangeValues}>
                <span>{commissionRange[0]}%</span>
                <span>{commissionRange[1]}%</span>
              </div>
            </div>

            <div>
              <label className={styles.filterLabel}>
                ROI Range (%)
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={roiRange[1]}
                onChange={(e) => setRoiRange([roiRange[0], Number(e.target.value)])}
                className={styles.rangeInput}
              />
              <div className={styles.rangeValues}>
                <span>{roiRange[0]}%</span>
                <span>{roiRange[1]}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className={styles.resultsSummary}>
        <div>Showing {displayedTraders.length} strategies</div>
        <div className={styles.lastUpdated}>
          <Clock size={16} />
          Last updated: Just now
        </div>
      </div>

      {/* Traders Grid */}
      <div className={styles.tradersFlex}>
        {displayedTraders.map(trader => (
          <div key={trader.id} className={styles.traderCard}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <div className={styles.traderInfo}>
                <img src={trader.avatar || undefined} alt="" className={styles.avatar} />
                <div className={styles.traderDetails}>
                  <h3 className={styles.traderName}>{trader.name}</h3>
                  <div className={styles.traderCapacity}>{trader.capacity}</div>
                </div>
              </div>
              {trader.isFeatured && <Star className={styles.featuredIcon} size={16} />}
            </div>

            {/* Fullwidth Performance Chart */}
            <div className={styles.performanceChart}>
              <ResponsiveContainer width="100%" height={48}>
                <LineChart data={trader.performance}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={(trader.stats?.roi7 ?? 0) >= 0 ? '#10B981' : '#EF4444'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Stats - 6 Data Points */}
            <div className={styles.detailedStats}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>ROI 7D</div>
                <div className={`${styles.statValue} ${(trader.stats?.roi7 ?? 0) >= 0 ? styles.positive : styles.negative}`}>
                  {(trader.stats?.roi7 ?? null) !== null ? `${(trader.stats?.roi7 ?? 0) >= 0 ? '+' : ''}${trader.stats?.roi7}%` : null}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>ROI 180D</div>
                <div className={`${styles.statValue} ${(trader.stats?.roi180 ?? 0) >= 0 ? styles.positive : styles.negative}`}>
                  {(trader.stats?.roi180 ?? null) !== null ? `${(trader.stats?.roi180 ?? 0) >= 0 ? '+' : ''}${trader.stats?.roi180}%` : null}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>PnL</div>
                <div className={styles.statValue}>
                  {(trader.stats?.pnl ?? null) !== null ? `$${(trader.stats?.pnl ?? 0).toLocaleString()}` : null}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Frequency</div>
                <div className={styles.statValue}>{trader.frequency}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Win Rate</div>
                <div className={styles.statValue}>{(trader.stats?.winRate ?? null) !== null ? `${trader.stats?.winRate}%` : null}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Copies</div>
                <div className={styles.statValue}>{trader.stats?.copies ?? null}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.saveButton}>Save</button>
              <button 
                onClick={() => handleRun(trader)}
                disabled={addedIds.includes(trader.id)}
                className={`${styles.runButton} ${addedIds.includes(trader.id) ? styles.runButtonAdded : ''}`}
              >
                {addedIds.includes(trader.id) ? "Added" : "Run"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
