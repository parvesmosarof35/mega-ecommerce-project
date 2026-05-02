import { z } from "zod";

const confirmPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string({ message: "Payment Intent ID is required" }),
  }),
});


const refundPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string({ message: "Payment Intent ID is required" }),
    amount: z.number().optional(),
    reason: z.string().optional(),
  }),
});

const PaymentValidationSchemas = {
  confirmPaymentSchema,
  refundPaymentSchema,
};

export default PaymentValidationSchemas;
