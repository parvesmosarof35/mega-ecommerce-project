import { Model } from 'mongoose';

export interface TAboutUs {
  aboutUs: string;
  isDelete: boolean;
}

export interface TPrivacyPolicy {
  PrivacyPolicy: string;
  isDelete: boolean;
}

export interface TTermsConditions {
  TermsConditions: string;
  isDelete: boolean;
}

export interface AboutModel extends Model<TAboutUs> {
  // eslint-disable-next-line no-unused-vars
  isAboutCustomId(id: string): Promise<TAboutUs>;
}

export interface PrivacyPolicyModel extends Model<TPrivacyPolicy> {
  // eslint-disable-next-line no-unused-vars
  isPrivacyPolicyCustomId(id: string): Promise<TPrivacyPolicy>;
}

export interface TermsConditionsModel extends Model<TTermsConditions> {
  // eslint-disable-next-line no-unused-vars
  isTermsConditionsCustomId(id: string): Promise<TTermsConditions>;
}

export interface TSocialMediaLinksAddressPhoneEmailTexts {
  // navbar links
  navbarlinks: {
    title: string;
    url: string;
    isActive: boolean;
  }[];
  // social media links
  instagram: {
    url: string;
    isActive: boolean;
  };
  facebook: {
    url: string;
    isActive: boolean;
  };
  tiktok: {
    url: string;
    isActive: boolean;
  };
  twitterx: {
    url: string;
    isActive: boolean;
  };
  whatsapp: {
    url: string;
    isActive: boolean;
  };
  address: {
    url: string;
    isActive: boolean;
  };
  phone: {
    url: string;
    isActive: boolean;
  };
  email: {
    url: string;
    isActive: boolean;
  };
  homepagesection2: {
    title: string;
    subtitle: string;
    imageone?: string;
    imagetwo?: string;
    imagethree?: string;
  };
  homepageCollections: {
    title: string;
    subtitle: string;
  };
  homepagesection3: {
    title: string;
    subtitle: string;
    buttontext: string;
  };
  footertext: {
    logobelowtext: string;
    footerbottomtext: string;
  };
  productpage: {
    title: string;
    subtitle: string;
  };
  productdetails: {
    Gotodetailstext: string;
    relatedproducttext: string;
  };
  isDelete: boolean;
}

export interface SocialMediaLinksAddressPhoneEmailTextsModel
  extends Model<TSocialMediaLinksAddressPhoneEmailTexts> {
  // eslint-disable-next-line no-unused-vars
  isSocialMediaLinksAddressPhoneEmailTextsCustomId(
    id: string,
  ): Promise<TSocialMediaLinksAddressPhoneEmailTexts>;
}
