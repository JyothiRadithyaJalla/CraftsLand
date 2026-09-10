import type { PaymentGateway } from './PaymentGateway';
import type { PaymentInitPayload, PaymentResult } from '../../types/payment';

export class MockPaymentProvider implements PaymentGateway {
  async initializePayment(payload: PaymentInitPayload): Promise<{ paymentIntentId: string; clientSecret?: string }> {
    return {
      paymentIntentId: `mock_pi_${Date.now()}_${payload.orderId}`,
      clientSecret: `mock_secret_${Math.random().toString(36).substring(7)}`,
    };
  }

  async verifyPayment(transactionId: string, paymentReference: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      paymentReference,
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
