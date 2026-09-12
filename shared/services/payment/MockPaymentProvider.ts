import type { PaymentGateway } from './PaymentGateway';
import type { PaymentInitPayload, PaymentResult } from '../../types/payment';
import { env } from '../../config/env';

export class MockPaymentProvider implements PaymentGateway {
  constructor() {
    if (env.isProduction || env.appEnv === 'production') {
      throw new Error('[Security Exception] MockPaymentProvider is strictly prohibited in production environments.');
    }
  }

  async initializePayment(payload: PaymentInitPayload): Promise<{ paymentIntentId: string; clientSecret?: string }> {
    if (env.isProduction || env.appEnv === 'production') {
      throw new Error('[Security Exception] MockPaymentProvider cannot initialize payments in production.');
    }
    return {
      paymentIntentId: `mock_pi_${Date.now()}_${payload.orderId}`,
      clientSecret: `mock_secret_${Math.random().toString(36).substring(7)}`,
    };
  }

  async verifyPayment(transactionId: string, paymentReference?: string): Promise<PaymentResult> {
    if (env.isProduction || env.appEnv === 'production') {
      throw new Error('[Security Exception] MockPaymentProvider cannot verify payments in production.');
    }
    return {
      success: true,
      transactionId,
      paymentReference: paymentReference || `mock_ref_${Date.now()}`,
    };
  }

  async refundPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      paymentReference: `ref_${Date.now()}`,
    };
  }
}
