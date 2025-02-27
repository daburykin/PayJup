import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { QuoteResponse, SwapResponse } from '@jup-ag/api';
import { SOLANA_RPC_ENDPOINT, USDC_MINT, DEFAULT_SLIPPAGE_BPS } from '../config/constants';
import JSBI from 'jsbi';

export class JupiterService {
  private connection: Connection;
  private baseUrl = 'https://quote-api.jup.ag/v6';

  constructor() {
    this.connection = new Connection(SOLANA_RPC_ENDPOINT);
  }

  async getQuote(
    inputMint: string,
    amount: number,
    slippageBps: number = DEFAULT_SLIPPAGE_BPS
  ): Promise<QuoteResponse> {
    const response = await fetch(
      `${this.baseUrl}/quote?inputMint=${inputMint}&outputMint=${USDC_MINT.toString()}&amount=${amount}&slippageBps=${slippageBps}`
    );

    if (!response.ok) {
      throw new Error('Failed to get quote');
    }

    return response.json();
  }

  async executeSwap(
    quoteResponse: QuoteResponse,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
  ) {
    // Get serialized transactions for the swap
    const swapResponse = await fetch(`${this.baseUrl}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: walletPublicKey.toString(),
      }),
    });

    if (!swapResponse.ok) {
      throw new Error('Failed to get swap transactions');
    }

    const swapResult: SwapResponse = await swapResponse.json();
    
    // Sign and send the transaction
    const transaction = VersionedTransaction.deserialize(
      Buffer.from(swapResult.swapTransaction, 'base64')
    );

    const signedTransaction = await signTransaction(transaction);
    const rawTransaction = (signedTransaction as VersionedTransaction).serialize();
    
    // Send the transaction
    const signature = await this.connection.sendRawTransaction(rawTransaction);
    await this.connection.confirmTransaction(signature);

    return {
      signature,
      inputAmount: quoteResponse.inputAmount,
      outputAmount: quoteResponse.outputAmount,
    };
  }
} 