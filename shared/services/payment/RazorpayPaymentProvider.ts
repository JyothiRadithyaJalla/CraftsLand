import type { PaymentGateway } from './PaymentGateway';
import type { PaymentInitPayload, PaymentResult } from '../../types/payment';

export class RazorpayPaymentProvider implements PaymentGateway {
  async initializePayment(payload: PaymentInitPayload): Promise<{ paymentIntentId: string; clientSecret?: string }> {
    // Production implementation calls backend server endpoint for Razorpay order generation
    throw new Error(`Production Razorpay provider requires backend server initialization for order: ${payload.orderId}`);
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    throw new Error(`Production Razorpay provider requires backend server signature verification for tx: ${transactionId}`);
  }

  async refundPayment(transactionId: string): Promise<PaymentResult> {
    throw new Error(`Production Razorpay provider requires backend server refund processing for tx: ${transactionId}`);
  }
}
