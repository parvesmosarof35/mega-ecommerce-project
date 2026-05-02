import { Model } from "mongoose";

export interface TContact {
  name: string;
  email: string;
  question: string;
  isDelete?: Boolean;
}

export interface ContactResponse {
  status: boolean;
  message: string;
}

export interface ContactModel extends Model<TContact> {
  // eslint-disable-next-line no-unused-vars
  isContactCustomId(id: string): Promise<TContact>;
}
