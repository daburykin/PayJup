import { PublicKey } from '@solana/web3.js';

export const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export const DEFAULT_SLIPPAGE_BPS = 100; // 1%

export const SUPPORTED_INPUT_TOKENS = [
  {
    symbol: 'SOL',
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
  },
  {
    symbol: 'BONK',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
  },
  // Add more supported tokens as needed
];

export const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6'; 