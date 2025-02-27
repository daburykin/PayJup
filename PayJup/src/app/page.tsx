'use client';

import React from 'react';
import PaymentForm from '@/components/PaymentForm';

export default function Home() {
  // Demo merchant wallet and amount
  const demoMerchantWallet = 'DemoMerchantWalletAddressHere';
  const demoAmount = 100; // 100 USDC

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">PayJup Demo</h1>
          <p className="text-xl text-gray-600">
            Accept any token, receive USDC via Jupiter
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <PaymentForm
            merchantWallet={demoMerchantWallet}
            amount={demoAmount}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Accept Any Token</h3>
            <p className="text-gray-600">
              Let your customers pay with their preferred token
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Instant USDC Settlement</h3>
            <p className="text-gray-600">
              Receive USDC automatically via Jupiter swaps
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
            <p className="text-gray-600">
              Get the best swap rates through Jupiter's aggregation
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 