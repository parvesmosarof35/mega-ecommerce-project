import config from "../../config";

//'admin' | 'user' | 'faculty'
export const USER_ROLE = {
  buyer: "buyer",
  seller: "seller",
  admin: "admin",
  superAdmin: "superAdmin",
  guest: "guest"
} as const;

export const USER_ACCESSIBILITY = {
  isProgress: "isProgress",
  blocked: "blocked",
} as const;

//   male: "Male" | "Female" | "Others";

export const GENDER = {
  male: "Male",
  female: "Female",
  others: "Others",
} as const;

export interface UserResponse {
  status: boolean;
  message: string;
}


export const superAdminCredentials = {

  fullname: "Super Admin",
  email: `${config.SUPER_ADMIN_EMAIL}`,
  password: "$2a$12$NjfyNKCKWgTotxcyGXCcwOwvmf91bHSxgYzGQK83pVDsi51mDA.OO",  // hashed 123456
  phoneNumber:"01722305054",
  isVerify: true,
}
