export interface PaymentInitPayload {
  orderId: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentReference?: string;
  errorMessage?: string;
}

export interface PaymentGateway {
  initializePayment(payload: PaymentInitPayload): Promise<{ paymentIntentId: string; clientSecret?: string }>;
  verifyPayment(transactionId: string, paymentReference: string): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>;
}
