import { z } from "zod";

const createCartCheckoutSessionSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      street: z.string({ message: "Street is required" }),
      city: z.string({ message: "City is required" }),
      state: z.string({ message: "State is required" }),
      postalCode: z.string({ message: "Postal code is required" }),
      country: z.string({ message: "Country is required" }),
      phone: z.string({ message: "Phone is required" }),
      email: z.string({ message: "Email is required" }),
    }),
    billingAddress: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
        phone: z.string(),
        email: z.string(),
      })
      .optional(),
    currency: z.string().default("usd"),
    notes: z.string().optional(),
  }),
});

const createDirectPaymentSchema = z.object({
  body: z.object({
    currency: z.string().default("usd"),
    paymentMethodId: z.string({ message: "Payment method ID is required" }),
    shippingAddress: z.object({
      street: z.string({ message: "Street is required" }),
      city: z.string({ message: "City is required" }),
      state: z.string({ message: "State is required" }),
      postalCode: z.string({ message: "Postal code is required" }),
      country: z.string({ message: "Country is required" }),
      phone: z.string({ message: "Phone is required" }),
      email: z.string({ message: "Email is required" }),
    }),
    billingAddress: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
        phone: z.string(),
        email: z.string(),
      })
      .optional(),
    notes: z.string().optional(),
  }),
});

const CartPaymentValidationSchemas = {
  createCartCheckoutSessionSchema,
  createDirectPaymentSchema,
};

export default CartPaymentValidationSchemas;
