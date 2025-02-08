import React from 'react';

interface DashboardProps {
  onNavigate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Coming soon...</p>
      <button onClick={onNavigate} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default Dashboard; 