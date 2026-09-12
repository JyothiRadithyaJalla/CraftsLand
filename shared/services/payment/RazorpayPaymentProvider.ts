import type { PaymentGateway } from './PaymentGateway';
import type { PaymentInitPayload, PaymentResult, RazorpayVerifyPayload } from '../../types/payment';
import { supabase } from '../supabaseClient';
import { loadRazorpayScript } from '../../utils/razorpayLoader';

export class RazorpayPaymentProvider implements PaymentGateway {
  async initializePayment(payload: PaymentInitPayload): Promise<{
    paymentIntentId: string;
    razorpayOrderId: string;
    keyId: string;
    amount: number;
    currency: string;
  }> {
    const headers: Record<string, string> = {};
    if (payload.trackingToken) {
      headers['x-order-token'] = payload.trackingToken;
    }

    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        orderId: payload.orderId,
        trackingToken: payload.trackingToken,
      },
      headers,
    });

    if (error || !data?.razorpayOrderId) {
      const errorMessage = error?.message || data?.error || 'Failed to generate Razorpay payment order.';
      throw new Error(errorMessage);
    }

    return {
      paymentIntentId: data.razorpayOrderId,
      razorpayOrderId: data.razorpayOrderId,
      keyId: data.keyId,
      amount: data.amount,
      currency: data.currency || 'INR',
    };
  }

  async openCheckoutModal(params: {
    keyId: string;
    razorpayOrderId: string;
    amountPaise: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    orderNumber?: string;
    onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
    onDismiss?: () => void;
    onError?: (error: any) => void;
  }): Promise<void> {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !(window as any).Razorpay) {
      throw new Error('Could not load Razorpay payment SDK. Please check your network connection.');
    }

    const options = {
      key: params.keyId,
      amount: params.amountPaise,
      currency: params.currency || 'INR',
      name: 'Craftsland Culinary Sanctuary',
      description: params.orderNumber ? `Order ${params.orderNumber}` : 'Fine Dining Experience',
      order_id: params.razorpayOrderId,
      prefill: {
        name: params.customerName || '',
        email: params.customerEmail || '',
        contact: params.customerPhone || '',
      },
      theme: {
        color: '#B84A32',
      },
      modal: {
        ondismiss: () => {
          if (params.onDismiss) params.onDismiss();
        },
      },
      handler: (response: any) => {
        params.onSuccess(response);
      },
    };

    const rzp = new (window as any).Razorpay(options);
    if (params.onError) {
      rzp.on('payment.failed', (resp: any) => {
        params.onError?.(resp.error);
      });
    }
    rzp.open();
  }

  async verifyPayment(payloadOrTxId: string | RazorpayVerifyPayload, paymentReference?: string): Promise<PaymentResult> {
    let verifyPayload: RazorpayVerifyPayload;

    if (typeof payloadOrTxId === 'string') {
      verifyPayload = {
        orderId: payloadOrTxId,
        razorpayOrderId: payloadOrTxId,
        razorpayPaymentId: paymentReference || '',
        razorpaySignature: '',
      };
    } else {
      verifyPayload = payloadOrTxId;
    }

    const headers: Record<string, string> = {};
    if (verifyPayload.trackingToken) {
      headers['x-order-token'] = verifyPayload.trackingToken;
    }

    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: verifyPayload,
      headers,
    });

    if (error || !data?.success) {
      return {
        success: false,
        errorMessage: error?.message || data?.error || 'Payment signature verification failed.',
      };
    }

    return {
      success: true,
      transactionId: verifyPayload.razorpayPaymentId,
      paymentReference: verifyPayload.razorpayPaymentId,
      idempotent: data.idempotent,
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
