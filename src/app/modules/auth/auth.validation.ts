import { z } from "zod";
import { GENDER } from "../user/user.constant";

const LoginSchema = z.object({
  body: z.object({
    email: z.string({ error: "email is required" }).email(),
    password: z
      .string({ error: "password is required" })
      .min(6, { message: "min 6 character accepted" }),
  }),
  fcm: z.string({ error: "fcm is not required" }).optional(),
});

const requestTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ error: "Refresh Token is Required" }),
  }),
});

const forgetPasswordValidation = z.object({
  body: z.object({
    email: z.string({ error: "email is required" }).email(),
  }),
});

const resetVerification = z.object({
  body: z.object({
    verificationCode: z
      .number({ error: "varification code is required" })
      .min(6, { message: "min 6 character accepted" })
      .optional(),
    newpassword: z
      .string({ error: "new password is required" })
      .min(6, { message: "min 6 charcter accepted" })
      .optional(),
  }),
});

const changeMyProfileSchema = z.object({
  body: z
    .object({
      fullname: z
        .string({ message: "fullname is Required" })
        .min(1, { error: "min  1  character needed" })
        .max(100, { error: "max 100 character accepted" }),
      photo: z.string({ error: "photo is require" }).optional(),
      gender: z.enum([GENDER.male, GENDER.female, GENDER.others]).optional(),
      phoneNumber: z
        .string({ message: "Phone number is required" })
        .optional(),
      address: z.string({ message: "address is not required" }).optional(),
    })
    .optional(),
});

const changeUserAccountStatus = z.object({
  body: z.object({
    status: z.boolean(),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    email: z.string({ error: "email is required" }).email(),
    fullname: z.string({ error: "fullname is required" }).min(1),
    photo: z.string({ error: "photo is required" }).optional(),
    role: z.enum(["buyer", "seller"]).default("buyer"),
    isVerify: z.boolean().default(true),
    status: z.enum(["isProgress", "Blocked"]).default("isProgress"),
    isDelete: z.boolean().default(false),
  }),
});

const LoginValidationSchema = {
  LoginSchema,
  requestTokenValidationSchema,
  forgetPasswordValidation,
  resetVerification,
  changeMyProfileSchema,
  changeUserAccountStatus,
  googleLoginSchema,
};
export default LoginValidationSchema;
