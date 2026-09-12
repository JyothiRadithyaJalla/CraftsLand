export interface PaymentInitPayload {
  orderId: string;
  orderNumber?: string;
  trackingToken?: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  amountPaise: number;
  currency: string;
  keyId: string;
}

export interface RazorpayVerifyPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  trackingToken?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentReference?: string;
  errorMessage?: string;
  idempotent?: boolean;
}

export interface PaymentGateway {
  initializePayment(payload: PaymentInitPayload): Promise<{
    paymentIntentId: string;
    clientSecret?: string;
    razorpayOrderId?: string;
    keyId?: string;
    amount?: number;
    currency?: string;
  }>;
  verifyPayment(transactionIdOrPayload: string | RazorpayVerifyPayload, paymentReference?: string): Promise<PaymentResult>;
  refundPayment?(transactionId: string, amount?: number): Promise<PaymentResult>;
}
