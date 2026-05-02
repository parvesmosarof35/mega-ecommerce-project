import { Model } from "mongoose";

export interface TFaq {
  question: string;
  answer: string;
  question_type: "general" | "selling" | "buying" | "valuation";
  isDelete?: boolean;
}

export interface FaqResponse {
  status: boolean;
  message: string;
}

export interface FaqModel extends Model<TFaq> {
  // eslint-disable-next-line no-unused-vars
  isFaqCustomId(id: string): Promise<TFaq>;
}
