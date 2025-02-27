import { NextResponse } from 'next/server';
import { PaymentService, PaymentRequest } from '@/services/PaymentService';
import { SUPPORTED_INPUT_TOKENS } from '@/config/constants';

const paymentService = new PaymentService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentRequest: PaymentRequest = {
      amount: body.amount,
      tokenSymbol: body.tokenSymbol,
      merchantWallet: body.merchantWallet,
    };

    // Validate merchant wallet
    const isValidWallet = await paymentService.validateMerchantWallet(paymentRequest.merchantWallet);
    if (!isValidWallet) {
      return NextResponse.json(
        { error: 'Invalid merchant wallet address' },
        { status: 400 }
      );
    }

    // Create payment quote
    const quote = await paymentService.createPaymentQuote(paymentRequest);

    return NextResponse.json({
      quote,
      merchantWallet: paymentRequest.merchantWallet,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process payment request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      supportedTokens: SUPPORTED_INPUT_TOKENS.map(token => ({
        symbol: token.symbol,
        decimals: token.decimals,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch supported tokens' },
      { status: 500 }
    );
  }
} 