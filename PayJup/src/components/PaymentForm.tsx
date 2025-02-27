'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from './WalletButton';
import '@solana/wallet-adapter-react-ui/styles.css';

interface PaymentFormProps {
  merchantWallet: string;
  amount: number;
}

interface SupportedToken {
  symbol: string;
  decimals: number;
}

export default function PaymentForm({ merchantWallet, amount }: PaymentFormProps) {
  const { publicKey, signTransaction } = useWallet();
  const [supportedTokens, setSupportedTokens] = useState<SupportedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupportedTokens();
  }, []);

  const fetchSupportedTokens = async () => {
    try {
      const response = await fetch('/api/payment');
      const data = await response.json();
      setSupportedTokens(data.supportedTokens);
      setSelectedToken(data.supportedTokens[0]?.symbol || '');
    } catch (error) {
      setError('Failed to fetch supported tokens');
    }
  };

  const getQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          tokenSymbol: selectedToken,
          merchantWallet,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get quote');
      }

      setQuote(data.quote);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!publicKey || !quote) return;

    try {
      setLoading(true);
      setError(null);

      // Process payment using PaymentService
      // This would be implemented in a real application
      // with proper wallet integration

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Amount: {amount} USDC</p>
        <p className="text-gray-600">Merchant: {merchantWallet}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Payment Token
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {supportedTokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      {!publicKey ? (
        <WalletButton />
      ) : (
        <button
          onClick={quote ? handlePayment : getQuote}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : quote ? 'Pay Now' : 'Get Quote'}
        </button>
      )}

      {quote && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold">Quote Details</h3>
          <p>Input Amount: {quote.inputAmount} {selectedToken}</p>
          <p>Output Amount: {quote.outputAmount} USDC</p>
          <p>Price Impact: {quote.priceImpact.toFixed(2)}%</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
} 