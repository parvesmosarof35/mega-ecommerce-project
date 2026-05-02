import { z } from "zod";
import { USER_ACCESSIBILITY, USER_ROLE } from "./user.constant";

const createUserZodSchema = z.object({
  body: z.object({
    fullname: z
      .string({ message: "fullname is Required" })
      .min(1, { error: "min  1  character needed" })
      .max(100, { error: "max 100 character accepted" }),

    password: z.string({ message: "Password is Required" }),

    email: z
      .string({ message: "Email is Required" })
      .email("Invalid email format")
      .refine(
        (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        {
          message: "Invalid email format",
        }
      ),
    phoneNumber: z
      .string({ message: "Phone number is required" })
      
     
      
      .optional(),

    role: z
      .nativeEnum(USER_ROLE, {
        message: "Invalid role value",
      })
      .default(USER_ROLE.buyer),

    status: z
      .nativeEnum(USER_ACCESSIBILITY, {
        message: "Invalid status value",
      })
      .default(USER_ACCESSIBILITY.isProgress),

    photo: z.string({ message: "photo is not required" }).optional(),
    address: z.string({ message: "address is not required" }).optional(),
  }),
});

const UserVerification = z.object({
  body: z.object({
    verificationCode: z
      .number({ message: "verification code is required" })
      .min(6, { message: "min 6 digits accepted" }),
  }),
});

const ChnagePasswordSchema = z.object({
  body: z.object({
    newpassword: z
      .string({ message: "new password is required" })
      .min(6, { message: "min 6 characters accepted" }),
    oldpassword: z
      .string({ message: "old password is required" })
      .min(6, { message: "min 6 characters accepted" }),
  }),
});

const UpdateUserProfileSchema = z.object({
  body: z.object({
    username: z
      .string({ message: "user name is required" })
      .min(3, { message: "min 3 characters accepted" })
      .max(15, { message: "max 15 characters accepted" })
      .optional(),

    phoneNumber: z.string({ message: "phone number is optional" }).optional(),
    address: z.string({ message: "address is not required" }).optional(),
    photo: z.string({ message: "optional photo" }).url().optional(),
  }),
});

const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is Required" })
      .email("Invalid email format")
      .refine(
        (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        {
          message: "Invalid email format",
        }
      ),
  }),
});

const verificationCodeSchema = z.object({
  body: z.object({
    verificationCode: z
      .number({ message: "verificationCode is required" })
      .min(100000, { message: "must be at least 6 digits" })
      .max(999999, { message: "must be at most 6 digits" }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    userId: z.string({ message: "userId is required" }),
    password: z.string({ message: "password is required" }),
  }),
});

const createGuestUserSchema = z.object({
  body: z.object({
    sessionId: z.string({ message: "sessionId is required" }),
  }),
});

const UserValidationSchema = {
  createUserZodSchema,
  UserVerification,
  ChnagePasswordSchema,
  UpdateUserProfileSchema,
  ForgotPasswordSchema,
  verificationCodeSchema,
  resetPasswordSchema,
  createGuestUserSchema,
};

export default UserValidationSchema;
