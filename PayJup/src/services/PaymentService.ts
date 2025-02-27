import { Connection, PublicKey } from '@solana/web3.js';
import { JupiterService } from './JupiterService';
import { SOLANA_RPC_ENDPOINT, SUPPORTED_INPUT_TOKENS } from '../config/constants';
import JSBI from 'jsbi';

export interface PaymentRequest {
  amount: number;
  tokenSymbol: string;
  merchantWallet: string;
}

export interface PaymentQuote {
  inputAmount: number;
  outputAmount: number;
  route: any;
  priceImpact: number;
}

export class PaymentService {
  private connection: Connection;
  private jupiterService: JupiterService;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_ENDPOINT);
    this.jupiterService = new JupiterService();
  }

  async createPaymentQuote(request: PaymentRequest): Promise<PaymentQuote> {
    const { amount, tokenSymbol } = request;
    
    const inputToken = SUPPORTED_INPUT_TOKENS.find(token => token.symbol === tokenSymbol);
    if (!inputToken) {
      throw new Error(`Unsupported token: ${tokenSymbol}`);
    }

    const amountInSmallestUnit = JSBI.BigInt(Math.floor(amount * Math.pow(10, inputToken.decimals)));
    const route = await this.jupiterService.getQuote(
      inputToken.mint,
      Number(amountInSmallestUnit)
    );

    return {
      inputAmount: amount,
      outputAmount: Number(route.outAmount) / Math.pow(10, 6), // USDC has 6 decimals
      route,
      priceImpact: route.priceImpactPct,
    };
  }

  async processPayment(
    quote: PaymentQuote,
    payerWallet: PublicKey,
    signTransaction: any
  ) {
    try {
      const swapResult = await this.jupiterService.executeSwap(
        quote.route,
        payerWallet,
        signTransaction
      );

      return {
        success: true,
        swapResult,
        settledAmount: quote.outputAmount,
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('Payment processing failed');
    }
  }

  async validateMerchantWallet(walletAddress: string): Promise<boolean> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const account = await this.connection.getAccountInfo(publicKey);
      return account !== null;
    } catch {
      return false;
    }
  }
} 