import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './CreateStrategy.css';
import { Card, CardContent, CardHeader, CardTitle } from './CreateStrategy.module.css';

const CreateStrategy = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'ai' | 'demo'>('ai');
  const [awaitingFunds, setAwaitingFunds] = useState(false);
  const [awaitingAgentName, setAwaitingAgentName] = useState(false);
  const [strategyDraft, setStrategyDraft] = useState<any>(null);

  // Helper that checks if a message seems to be a strategy command.
  const isStrategyCommand = (msg: string): boolean => {
    const lower = msg.toLowerCase();
    return lower.includes("strategy") && (lower.includes("sell") || lower.includes("buy"));
  };

  // Helper to extract details from the message.
  const parseStrategy = (msg: string) => {
    const lower = msg.toLowerCase();
    const operation = lower.includes("sell") ? "sell" : lower.includes("buy") ? "buy" : "";
    // Check for common assets (example support for btc and eth)
    let asset = '';
    if (lower.includes("btc")) {
      asset = "BTC";
    } else if (lower.includes("eth")) {
      asset = "ETH";
    }
    // Extract a price, e.g.: "for 1 usd"
    const priceMatch = msg.match(/for\s+(\d+(\.\d+)?)\s*(usd|eur)/i);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    // Extract frequency, e.g.: "each 15 hours"
    const freqMatch = msg.match(/each\s+(\d+(\.\d+)?)\s*(hours|hrs|h)/i);
    const frequency = freqMatch ? `${freqMatch[1]} hours` : '';
    
    return { operation, asset, price, frequency };
  };

  // Handle sending a message.
  const handleSend = async () => {
    if (!input.trim()) return;

    // Process input if we are waiting for funds.
    if (awaitingFunds) {
      const allocatedFunds = parseFloat(input);
      // Add the user's funds input to the chat.
      setMessages(prev => [...prev, { role: 'user', content: input }]);

      if (isNaN(allocatedFunds)) {
        const errorMsg = { role: 'ai', content: "Invalid funds input. Please enter a valid number." };
        setMessages(prev => [...prev, errorMsg]);
      } else {
        // Save funds in our strategy draft and ask for the agent name.
        const newDraft = { ...strategyDraft, allocatedFunds };
        setStrategyDraft(newDraft);
        const agentNamePrompt = { role: 'ai', content: "Please enter the name for your strategy agent." };
        setMessages(prev => [...prev, agentNamePrompt]);
        setAwaitingFunds(false);
        setAwaitingAgentName(true);
      }
      setInput('');
      return;
    } else if (awaitingAgentName) {
      // Process the agent name input.
      const agentName = input.trim();
      setMessages(prev => [...prev, { role: 'user', content: input }]);

      const aiResponseDeploy = { role: 'ai', content: "Deploying strategy..." };
      setMessages(prev => [...prev, aiResponseDeploy]);

      // Simulate the deployment with a delay.
      setTimeout(() => {
        const agentCardData = {
          id: Date.now(),
          name: agentName,
          operation: strategyDraft?.operation || '',
          asset: strategyDraft?.asset || '',
          price: strategyDraft?.price || 0,
          frequency: strategyDraft?.frequency || '',
          allocatedFunds: strategyDraft?.allocatedFunds || 0,
          pnl: strategyDraft?.allocatedFunds || 0, // Using allocated funds as the PnL display.
          winRate: null,
          avatar: `https://robohash.org/${agentName}?size=48x48`,
          isFeatured: false,
          capacity: strategyDraft?.frequency || '',
          performance: [],
          stats: {
            roi7: 0,
            roi180: 0,
            pnl: strategyDraft?.allocatedFunds || 0,
            winRate: null,
            copies: 0,
          },
          listed: false // Added default "listed" key
        };


         // Save the agent data in local storage under key "agents"
        const agents = JSON.parse(localStorage.getItem('agents') || '[]');
        agents.push(agentCardData);
        localStorage.setItem('agents', JSON.stringify(agents));

        // Create the strategy card message including the card component.
        const cardMessage = {
          role: 'ai',
          card: <StrategyCard data={agentCardData} />
        };

        setMessages(prev => [...prev, cardMessage]);
      }, 2000);


      setAwaitingAgentName(false);
      setStrategyDraft(null);
      setInput('');
      return;
    }

    // Normal flow when not awaiting additional inputs.
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    if (mode === 'demo') {
      // If the message looks like a trading strategy command...
      if (isStrategyCommand(input)) {
        const draft = parseStrategy(input);
        setStrategyDraft(draft);
        setAwaitingFunds(true);
        // Ask for allocated funds first.
        const aiResponse = { role: 'ai', content: "Please enter the amount of allocated funds for this strategy." };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Otherwise run the existing demo simulation for ordinary messages.
        const aiResponse1 = { role: 'ai', content: "Sure, let's craft your strategy..." };
        setMessages(prev => [...prev, aiResponse1]);

        setTimeout(() => {
          const aiResponse2 = { role: 'ai', content: "Deploying strategy..." };
          setMessages(prev => [...prev, aiResponse2]);

          setTimeout(() => {
            const aiResponse3 = { role: 'ai', content: "Strategy successfully created and deployed!" };
            setMessages(prev => [...prev, aiResponse3]);
            // Save to local storage under key "strategies" as before.
            const strategies = JSON.parse(localStorage.getItem('strategies') || '[]');
            strategies.push({ name: `Strategy ${strategies.length + 1}`, content: input });
            localStorage.setItem('strategies', JSON.stringify(strategies));
          }, 2000);
        }, 2000);
      }
    } else {
      // If in AI mode, pass the message to the backend.
      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input })
        });

        const data = await response.json();
        const aiMessage = { role: 'ai', content: data.response };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setInput('');
  };

  // Toggle between AI and demo modes.
  const toggleMode = () => {
    setMode(prev => prev === 'ai' ? 'demo' : 'ai');
    setMessages([]);
    setInput('');
  };

  // Component to render the strategy card inside the chat.
  const StrategyCard = ({ data }: { data: any }) => {
    return (
      <div className="strategy-card">
        {/* Card Header */}
        <div className="card-header">
          <div className="strategy-info">
            <img src={data.avatar} alt="avatar" className="avatar" />
            <div className="strategy-details">
              <h3 className="strategy-name">{data.name}</h3>
              <div className="strategy-capacity">{data.capacity}</div>
            </div>
          </div>
          {data.isFeatured && <span className="featuredIcon">★</span>}
        </div>

        {/* Card Body with Strategy Details */}
        <div className="card-body">
          <p><strong>Operation:</strong> {data.operation}</p>
          <p><strong>Asset:</strong> {data.asset}</p>
          <p><strong>Price:</strong> ${data.price}</p>
          <p><strong>Frequency:</strong> {data.frequency}</p>
          <p><strong>Allocated Funds:</strong> ${data.allocatedFunds}</p>
          <p><strong>PnL:</strong> ${data.pnl}</p>
          <p><strong>Win Rate:</strong> {data.winRate !== null ? data.winRate + '%' : 'N/A'}</p>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button className="save-button">Save</button>
          <button className="run-button">Run</button>
        </div>
      </div>
    );
  };

  return (
    <div className="create-strategy">
      <div className="controls">
        <button onClick={toggleMode} className="mode-switcher">
          {mode === 'ai' ? 'Demo' : 'AI'} Mode
        </button>
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.card ? msg.card : msg.content}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your strategy..."
          />
          <button onClick={handleSend}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStrategy; 