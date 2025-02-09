import React from 'react';
import './land.css';
import { useScrollAnimation } from './useScrollAnimation';
// Import the banner image from the same folder
import bannerImage from './copytrade.png';

interface LandingProps {
  onNavigate: () => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  useScrollAnimation();

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onNavigate();
  };

  // Update icons for each section
  const sectionIcons = {
    strategyEngine: '🧠',
    autonomousTrading: '🤖',
    marketplace: '🏪',
    community: '👥',
    crossChain: '🔗',
    analytics: '📊',
    cta: '🚀'
  };

  return (
    <div className='fluid'>
      <div className="landing-container">
        <header className="header">
          <h1 className="header-logo">🚀Copytrade.AI</h1>
          <div className="headermenu">
            <a href="#about" className="headermenu-link">About</a>
            <a href="#" className="headermenu-link" onClick={handleCTAClick}>
              Enter Dapp
            </a>
          </div>
        </header>

  
        <section className="hero">
          <h2 className="hero-title">
            Create, share, and execute AI-powered trading strategies.
          </h2>
          <p className="hero-subtitle">
            Join the future of decentralized trading.
          </p>

          
              {/* Fullwidth banner image below the header */}
              <img
          src={bannerImage}
          alt="Copytrade Banner"
          style={{ width: '100%', display: 'block', marginTop: '100px', }}
        />

        </section>


        <section className="content-block strategy-engine">
          <div className="content-wrapper">
            <div className="icon-container">
              <div className="icon">{sectionIcons.strategyEngine}</div>
              <div className="content-text">
                <p className="tagline">Turn ideas into execution</p>
                <h2>AI Strategy Engine</h2>
                <p>
                  Describe strategies in plain English, watch AI craft the code.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-block autonomous-trading">
          <div className="content-wrapper">
            <div className="icon-container">
              <div className="icon">{sectionIcons.autonomousTrading}</div>
              <div className="content-text">
                <p className="tagline">Set it and forget it</p>
                <h2>Autonomous Trading</h2>
                <p>
                  Deploy agent contracts that trade 24/7 with precision.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-block marketplace">
          <div className="content-wrapper">
            <div className="icon-container">
              <div className="icon">🏪</div>
              <div className="content-text">
                <p className="tagline">Learn from the best</p>
                <h2>Strategy Marketplace</h2>
                <p>
                  Discover, replicate, and monitor top-performing AI strategies.
                  Our ranking system and transparent analytics help you make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-block cta">
          <div className="content-wrapper">
            <p className="tagline">Agentic Trading is Here</p>
            <button className="cta-button" onClick={handleCTAClick}>
              Enter Dapp
            </button>
          </div>
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Copytrade.AI. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;