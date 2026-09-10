import type { PaymentInitPayload, PaymentResult } from '../../types/payment';

export interface PaymentGateway {
  initializePayment(payload: PaymentInitPayload): Promise<{ paymentIntentId: string; clientSecret?: string }>;
  verifyPayment(transactionId: string, paymentReference: string): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>;
}
