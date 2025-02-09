import React, { useEffect, useState } from 'react';
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
  listed?: boolean;
}

const Collection = () => {
  const [collectionAgents, setCollectionAgents] = useState<Strategy[]>([]);

  // Load agents from local storage on component mount
  useEffect(() => {
    const agentsJSON = localStorage.getItem('agents');
    if (agentsJSON) {
      try {
        const agents = JSON.parse(agentsJSON) as Strategy[];
        if (Array.isArray(agents)) {
          setCollectionAgents(agents);
        }
      } catch (error) {
        console.error('Error parsing agents from localStorage', error);
        localStorage.setItem('agents', '[]');
        setCollectionAgents([]);
      }
    }
  }, []);

  // Delete an agent from the collection and update localStorage
  const deleteAgent = (agentId: number) => {
    const updatedAgents = collectionAgents.filter(agent => agent.id !== agentId);
    setCollectionAgents(updatedAgents);
    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  };

  // Toggle listing status for an agent and update localStorage
  const toggleListing = (agentId: number) => {
    const updatedAgents = collectionAgents.map(agent => {
      if (agent.id === agentId) {
        // Toggle the "listed" property.
        return { ...agent, listed: !agent.listed };
      }
      return agent;
    });
    setCollectionAgents(updatedAgents);
    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  };

  return (
    <div className={styles["marketplace-container"]}>
      <div className={styles["marketplace-grid"]}>
        {collectionAgents.map(agent => (
          <div key={agent.id} className={styles["marketplace-card"]}>
            {/* Card Header with Agent Info */}
            <div className={styles["marketplace-card-header"]}>
              <div className={styles["marketplace-card-info"]}>
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className={styles["marketplace-avatar"]}
                />
                <div>
                  <div className={styles["marketplace-trader-name"]}>
                    {agent.name}
                  </div>
                  <div className={styles["marketplace-trader-capacity"]}>
                    {agent.capacity}
                  </div>
                </div>
              </div>
            </div>

            {/* Display Total PNL */}
            <div className={styles["marketplace-info-grid"]}>
              <div className={styles["marketplace-info-label"]}>
                Total PNL
              </div>
              <div className={styles["marketplace-info-value"]}>
                ${agent.stats.pnl.toLocaleString()}
              </div>
            </div>

            {/* For agents with id > 100, show extra buttons */}
            {agent.id > 100 && (
              <div className={styles["marketplace-card-buttons"]}>
                <button
                  className={`${styles["marketplace-mock-copy-btn"]} collection-delete-btn`}
                  onClick={() => deleteAgent(agent.id)}
                >
                  Delete
                </button>
                <button
                  className={`${styles["marketplace-mock-copy-btn"]} collection-list-btn`}
                  onClick={() => toggleListing(agent.id)}
                >
                  {agent.listed ? "delist" : "List Agent"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection; 