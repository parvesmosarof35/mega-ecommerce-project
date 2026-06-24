import Newsletter from "./newsletter.model";
import { TNewsletter } from "./newsletter.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createNewsletterIntoDb = async (payload: TNewsletter) => {
  const existing = await Newsletter.isEmailExists(payload.email);
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already subscribed!");
  }
  const result = await Newsletter.create(payload);
  return result;
};

const allNewsletterIntoDb = async () => {
  const result = await Newsletter.find().sort({ createdAt: -1 });
  return result;
};

const deleteNewsletterIntoDb = async (id: string) => {
  const result = await Newsletter.findByIdAndDelete(id);
  return result;
};

export const newsletterServices = {
  createNewsletterIntoDb,
  allNewsletterIntoDb,
  deleteNewsletterIntoDb,
};
