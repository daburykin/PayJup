'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

export const WalletButton = dynamic(
  () => Promise.resolve(WalletMultiButton),
  { ssr: false }
); 