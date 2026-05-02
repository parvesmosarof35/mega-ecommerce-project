import { Schema, model } from 'mongoose';
import {
  AboutModel,
  PrivacyPolicyModel,
  TAboutUs,
  TermsConditionsModel,
  TPrivacyPolicy,
  TTermsConditions,
  TSocialMediaLinksAddressPhoneEmailTexts,
  SocialMediaLinksAddressPhoneEmailTextsModel,
} from './settings.interface';


const AboutUsSchema = new Schema<TAboutUs, AboutModel>(
  {
    aboutUs: {
      type: String,
      required: [true, 'About Us content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const PrivacyPolicySchema = new Schema<TPrivacyPolicy, PrivacyPolicyModel>(
  {
    PrivacyPolicy: {
      type: String,
      required: [true, 'PrivacyPolicy content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TermsConditionSchema = new Schema<TTermsConditions, TermsConditionsModel>(
  {
    TermsConditions: {
      type: String,
      required: [true, 'TermsConditionsy content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const SocialMediaLinksAddressPhoneEmailTextsSchema = new Schema<
  TSocialMediaLinksAddressPhoneEmailTexts,
  SocialMediaLinksAddressPhoneEmailTextsModel
>(
  {
    navbarlinks: [
      {
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      },
    ],
    instagram: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    facebook: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    tiktok: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: false },
    },
    twitterx: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    whatsapp: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    address: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    phone: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    email: {
      url: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    homepagesection2: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      imageone: { type: String, default: '' },
      imagetwo: { type: String, default: '' },
      imagethree: { type: String, default: '' },
    },
    homepageCollections: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
    },
    homepagesection3: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      buttontext: { type: String, default: '' },
    },
    footertext: {
      logobelowtext: { type: String, default: '' },
      footerbottomtext: { type: String, default: '' },
    },
    productpage: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
    },
    productdetails: {
      Gotodetailstext: { type: String, default: '' },
      relatedproducttext: { type: String, default: '' },
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

AboutUsSchema.statics.isAboutCustomId = async function (id: string) {

  return this.findById(id);
};
PrivacyPolicySchema.statics.isPrivacyPolicyCustomId = async function (
  id: string,
) {
  return this.findById(id);
};

TermsConditionSchema.statics.isTermsConditionsCustomId = async function (
  id: string,
) {
  return this.findById(id);
};

SocialMediaLinksAddressPhoneEmailTextsSchema.statics.isSocialMediaLinksAddressPhoneEmailTextsCustomId =
  async function (id: string) {
    return this.findById(id);
  };


AboutUsSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
AboutUsSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
AboutUsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

PrivacyPolicySchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
PrivacyPolicySchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
PrivacyPolicySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TermsConditionSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
TermsConditionSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
TermsConditionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

SocialMediaLinksAddressPhoneEmailTextsSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
SocialMediaLinksAddressPhoneEmailTextsSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
SocialMediaLinksAddressPhoneEmailTextsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});


export const aboutus = model<TAboutUs, AboutModel>('aboutus', AboutUsSchema);
export const privacypolicys = model<TPrivacyPolicy, PrivacyPolicyModel>(
  'privacypolicys',
  PrivacyPolicySchema,
);

export const termsConditions = model<TTermsConditions, TermsConditionsModel>(
  ' termsConditions',
  TermsConditionSchema,
);

export const socialMediaLinksAddressPhoneEmailTexts = model<
  TSocialMediaLinksAddressPhoneEmailTexts,
  SocialMediaLinksAddressPhoneEmailTextsModel
>(
  'socialMediaLinksAddressPhoneEmailTexts',
  SocialMediaLinksAddressPhoneEmailTextsSchema,
);
