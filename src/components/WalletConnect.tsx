declare global {
  interface Window {
    ethereum?: any;
  }
}

import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('');

  // Use ethers to request connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const accountAddress = accounts[0];
        setAccount(accountAddress);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceBigNumber = await provider.getBalance(accountAddress);
        setBalance(ethers.formatEther(balanceBigNumber));
      } catch (error: any) {
        console.error('Failed to connect wallet', error);
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask.');
    }
  };

  const projectId = import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID as string;

  const onrampBuyUrl =
    account && projectId
      ? getOnrampBuyUrl({
          projectId,
          addresses: { [account]: ['base'] },
          assets: ['USDC'],
          presetFiatAmount: 20,
          fiatCurrency: 'USD',
        })
      : '';

  return (
    <div>
      {!account ? (
        <div>
          <p>Please connect your Coinbase Wallet:</p>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Wallet Address:</strong> {account}
          </p>
          <p>
            <strong>Balance:</strong> {balance} ETH
          </p>
          {onrampBuyUrl && <FundButton fundingUrl={onrampBuyUrl} />}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 