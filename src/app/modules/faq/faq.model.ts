import { Schema, model } from "mongoose";
import { TFaq, FaqModel } from "./faq.interface";
import { question_type } from "./faq.constant";

const TFaqSchema = new Schema<TFaq, FaqModel>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    question_type: {
      type: String,
      enum: {
        values: [
          question_type.general,
          question_type.buying,
          question_type.selling,
          question_type.valuation,
        ],
        message: "{VALUE} is Not Required",
      },
      required: [false, "question type is Required"],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

TFaqSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

TFaqSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
TFaqSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TFaqSchema.statics.isFaqCustomId = async function (id: string) {
  const faq = await this.findById(id);
  return faq;
};

const faqs = model<TFaq, FaqModel>("faqs", TFaqSchema);

export default faqs;
