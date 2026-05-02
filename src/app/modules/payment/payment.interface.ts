export interface PaymentIntent {
  amount: number;
  currency: string;
  orderId: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data?: {
    clientSecret?: string;
    paymentIntentId?: string;
    sessionId?: string;
    paymentUrl?: string;
    refundId?: string;
    orderId?: string;
    status?: string;
    paymentMethods?: PaymentMethod[];
    defaultMethod?: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  popular?: boolean;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

export interface OrderPaymentInfo {
  orderId: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "paid"
    | "refunded";
  paymentIntentId?: string;
  stripePaymentId?: string;
  paidAt?: Date;
}
