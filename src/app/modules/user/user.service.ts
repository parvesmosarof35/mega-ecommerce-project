import httpStatus from "http-status";
import users from "./user.model";
import { USER_ACCESSIBILITY, USER_ROLE } from "./user.constant";
import { TUser } from "./user.interface";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import sendEmail from "../../utils/sendEmail";
import emailContext from "../../utils/emailcontext/sendvarificationData";
import { jwtHelpers } from "../../helper/jwtHelpers";
import config from "../../config";
import QueryBuilder from "../../builder/QueryBuilder";


const generateUniqueOTP = async (): Promise<number> => {
  const MAX_ATTEMPTS = 10;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digits

    const existingUser = await users.findOne({ verificationCode: otp });

    if (!existingUser) {
      return otp;
    }
  }

  throw new AppError(
    httpStatus.NOT_EXTENDED,
    "Failed to generate a unique OTP after multiple attempts",
    ""
  );
};

const createUserIntoDb = async (payload: TUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const isExistUser = await users.findOne(
      {
        email: payload.email,
        isDelete: false,
        isVerify: true,
        status: USER_ACCESSIBILITY.isProgress,
      },
      { _id: 1, email: 1, phoneNumber: 1, role: 1 }
    );

    if (isExistUser) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        httpStatus.FOUND,
        "This email already exists in our database",
        ""
      );
    }

    // 2. Generate OTP after existence check
    const otp = await generateUniqueOTP();
    payload.verificationCode = otp;

    // 3. Save user
    const authBuilder = new users(payload);
    const result = await authBuilder.save({ session });


    await session.commitTransaction();
    session.endSession();

    // 5. Send email after transaction
    if (payload.role !== USER_ROLE.admin) {
      await sendEmail(
        payload.email,
        emailContext.sendVerificationData(
          payload.email,
          otp,
          "User Verification Email"
        ),
        "Verification OTP Code"
      );
      return result && { status: true, message: "Check your email inbox" };
    }

    return result && { status: true, message: "Successfully created admin" };

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Server unavailable",
      error.message
    );
  }
};

const userVarificationIntoDb = async (verificationCode: number) => {
  try {
    if (!verificationCode) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Verification code is required"
      );
    }


    console.log(verificationCode)

    const updatedUser = await users.findOneAndUpdate(
      { verificationCode },
      {
        isVerify: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid verification code", "");
    }

    const jwtPayload = {
      id: updatedUser.id,
      role: updatedUser.role,
      email: updatedUser.email,
    };

    let accessToken: string | null = null;

    if (updatedUser.isVerify) {
      accessToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string
      );
    }

    return {
      message: "User verification successful",
      accessToken,
    };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Verification auth error",
      error
    );
  }
};

const chnagePasswordIntoDb = async (
  payload: {
    newpassword: string;
    oldpassword: string;
  },
  id: string
) => {
  try {
    const isUserExist = await users.findOne(
      {
        $and: [
          { _id: id },
          { isVerify: true },
          { status: USER_ACCESSIBILITY.isProgress },
          { isDelete: false },
        ],
      },
      { password: 1 }
    );

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    if (
      !(await users.isPasswordMatched(
        payload.oldpassword,
        isUserExist?.password
      ))
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Old password does not match",
        ""
      );
    }
    const newHashedPassword = await bcrypt.hash(
      payload.newpassword,
      Number(config.bcrypt_salt_rounds)
    );

    const updatedUser = await users.findByIdAndUpdate(
      id,
      { password: newHashedPassword },
      { new: true, upsert: true }
    );
    if (!updatedUser) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "password  change database error",
        ""
      );
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "current password is incorrect",
      error
    );
  }
};

// forgot password

const forgotPasswordIntoDb = async (payload: string | { email: string }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let emailString: string;

    if (typeof payload === "string") {
      emailString = payload;
    } else if (payload && typeof payload === "object" && "email" in payload) {
      emailString = payload.email;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid email format", "");
    }

    const isExistUser = await users.findOne(
      {
        $and: [
          { email: emailString },
          { isVerify: true },
          { status: USER_ACCESSIBILITY.isProgress },
          { isDelete: false },
        ],
      },
      { _id: 1, provider: 1 },
      { session }
    );

    if (!isExistUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    const otp = await generateUniqueOTP();


    const result = await users.findOneAndUpdate(
      { _id: isExistUser._id },
      { verificationCode: otp },
      {
        new: true,
        upsert: true,
        projection: { _id: 1, email: 1 },
        session,
      }
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "OTP forgot section issues", "");
    }

    try {
      await sendEmail(
        emailString,
        emailContext.sendVerificationData(
          emailString,
          otp,
          " Forgot Password Email"
        ),
        "Forgot Password Verification OTP Code"
      );
    } catch (emailError: any) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "Failed to send verification email",
        emailError
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { status: true, message: "Checked Your Email" };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Old Password change failed",
      error
    );
  }
};

const verificationForgotUserIntoDb = async (
  otp: number | { verificationCode: number }
): Promise<string> => {
  try {
    let code: number;

    if (typeof otp === "object" && typeof otp.verificationCode === "number") {
      code = otp.verificationCode;
    } else if (typeof otp === "number") {
      code = otp;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP format", "");
    }

    const isExistOtp: any = await users.findOne(
      {
        $and: [
          { verificationCode: code },
          { isVerify: true },
          { isDelete: false },
          { status: USER_ACCESSIBILITY.isProgress },
        ],
      },
      { _id: 1, updatedAt: 1, email: 1, role: 1 }
    );

    if (!isExistOtp) {
      throw new AppError(httpStatus.NOT_FOUND, "OTP not found", "");
    }

    const updatedAt =
      isExistOtp.updatedAt instanceof Date
        ? isExistOtp.updatedAt.getTime()
        : new Date(isExistOtp.updatedAt).getTime();

    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (now - updatedAt > FIVE_MINUTES) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "OTP has expired. Please request a new one.",
        ""
      );
    }

    const jwtPayload = {
      id: isExistOtp._id.toString(),
      role: isExistOtp.role,
      email: isExistOtp.email,
    };

    const accessToken = jwtHelpers.generateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.expires_in as string
    );

    await users.updateOne(
      { _id: isExistOtp._id },
      { $unset: { verificationCode: "" } }
    );

    return accessToken;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Password change failed",
      error
    );
  }
};

const resetPasswordIntoDb = async (payload: {
  userId: string;
  password: string;
}) => {
  try {
    const isExistUser = await users.findOne(
      {
        $and: [
          { _id: payload.userId },
          { isVerify: true },
          { isDelete: false },
          { status: USER_ACCESSIBILITY.isProgress },
        ],
      },
      { _id: 1 }
    );
    if (!isExistUser) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "some issues by the  reset password section",
        ""
      );
    }
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );

    const result = await users.findByIdAndUpdate(
      isExistUser._id,
      { password: payload.password },
      { new: true, upsert: true }
    );
    return result && { status: true, message: "successfylly reset password" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "server unvailable reste password into db function",
      error
    );
  }
};

// user Growth

const getUserGrowthIntoDb = async (query: { year?: string }) => {
  try {
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();

    const stats = await users.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { month: "$month", count: "$count" } },
        },
      },

      {
        $project: {
          months: {
            $map: {
              input: { $range: [1, 13] },
              as: "m",
              in: {
                year: year,
                month: "$$m",
                count: {
                  $let: {
                    vars: {
                      matched: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$data",
                              as: "d",
                              cond: { $eq: ["$$d.month", "$$m"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$matched.count", 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: "$months" },
      { $replaceRoot: { newRoot: "$months" } },
    ]);

    return { monthlyStats: stats };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch user creation stats",
      error
    );
  }
};


// Recently Joined Users

const recently_joined_user_IntoDb = async (query: Record<string, unknown> = {}) => {
  try {
    const finalQuery = {
      sort: query.sort || '-createdAt',
      limit: query.limit || '10',
      ...query,
    };

    const userQuery = new QueryBuilder(
      users.find().select('fullname photo phoneNumber email createdAt'),
      finalQuery,
    )
      .filter()
      .paginate()
      .fields();

    const [recentUser, meta] = await Promise.all([
      userQuery.modelQuery,
      userQuery.countTotal(),
    ]);

    return { meta, recentUser };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to fetch recent user status',
      '',
    );
  }
};



const deleteAllTypesOfUserIntoDb = async (id: string) => {

  try {
    const result = await users.findByIdAndDelete(id);
    return result && { status: true, message: "successfully delete" }
  }

  catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to fetch delete all types of user into db',
      '',
    );


  }
}






const createGuestUserIntoDb = async (payload: { sessionId: string }) => {
  try {
    // Generate a unique guest user email based on session ID and timestamp
    const timestamp = Date.now();
    const guestEmail = `guest_${payload.sessionId}_${timestamp}@guest.local`;
    
    // Generate a random password for guest user (won't be used for login)
    const guestPassword = Math.random().toString(36).substring(2, 15);
    
    // Create guest user data
    const guestUserData = {
      fullname: "Guest User",
      email: guestEmail,
      password: guestPassword,
      role: USER_ROLE.guest,
      status: USER_ACCESSIBILITY.isProgress,
      isVerify: true, // Auto-verify guest users
      phoneNumber: "",
      sessionId: payload.sessionId, // Store session ID for tracking
    };

    // Create the guest user
    const result = await users.create(guestUserData);

    // Generate JWT token for the guest user
    const jwtPayload = {
      id: result._id.toString(),
      email: result.email,
      role: result.role,
    };

    const accessToken = jwtHelpers.generateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.refresh_expires_in as string
    );

    return {
      status: true,
      message: "Guest user created successfully",
      data: {
        user: {
          _id: result._id,
          fullname: result.fullname,
          email: result.email,
          role: result.role,
          isVerify: result.isVerify,
        },
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create guest user",
      error instanceof Error ? error.message : String(error)
    );
  }
};

const UserServices = {
  createUserIntoDb,
  userVarificationIntoDb,
  chnagePasswordIntoDb,
  forgotPasswordIntoDb,
  verificationForgotUserIntoDb,
  resetPasswordIntoDb,
  getUserGrowthIntoDb,
  recently_joined_user_IntoDb,
  deleteAllTypesOfUserIntoDb,
  createGuestUserIntoDb
};
export default UserServices;
