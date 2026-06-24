import { Model } from "mongoose";

export type TNewsletter = {
  email: string;
  isDelete?: boolean;
};

export interface NewsletterModel extends Model<TNewsletter> {
  isEmailExists(email: string): Promise<TNewsletter | null>;
}
