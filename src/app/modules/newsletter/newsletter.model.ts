import { Schema, model } from "mongoose";
import { NewsletterModel, TNewsletter } from "./newsletter.interface";

const newsletterSchema = new Schema<TNewsletter, NewsletterModel>(
  {
    email: { type: String, required: [true, "email is required"], unique: true },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

newsletterSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

newsletterSchema.statics.isEmailExists = async function (
  email: string
): Promise<TNewsletter | null> {
  return this.findOne({ email });
};

const Newsletter = model<TNewsletter, NewsletterModel>("Newsletter", newsletterSchema);
export default Newsletter;
