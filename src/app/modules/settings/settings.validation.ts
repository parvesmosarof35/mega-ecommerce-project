import { z } from 'zod';

const AboutValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ message: 'about us is required' }),
  }),
});

const PrivacyPolicysValidationSchema = z.object({
  body: z.object({
    PrivacyPolicy: z.string({ message: '  PrivacyPolicy us is required' }),
  }),
});

//   TermsConditions:

const TermsConditionsValidationSchema = z.object({
  body: z.object({
    TermsConditions: z.string({ message: '  TermsConditions us is required' }),
  }),
});

const SocalMediaLinksAddressPhoneEmailTextsValidationSchema = z.object({
  body: z.object({
    navbarlinks: z
      .array(
        z.object({
          title: z.string().optional(),
          url: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .optional(),
    instagram: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    facebook: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    tiktok: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    twitterx: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    whatsapp: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    address: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    phone: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    email: z
      .object({
        url: z.string().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),
    homepagesection2: z
      .object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        imageone: z.string().optional(),
        imagetwo: z.string().optional(),
        imagethree: z.string().optional(),
      })
      .optional(),
    homepageCollections: z
      .object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
      })
      .optional(),
    homepagesection3: z
      .object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        buttontext: z.string().optional(),
      })
      .optional(),
    footertext: z
      .object({
        logobelowtext: z.string().optional(),
        footerbottomtext: z.string().optional(),
      })
      .optional(),
    productpage: z
      .object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
      })
      .optional(),
    productdetails: z
      .object({
        Gotodetailstext: z.string().optional(),
        relatedproducttext: z.string().optional(),
      })
      .optional(),
  }),
});

const settingValidationSchema = {
  AboutValidationSchema,
  PrivacyPolicysValidationSchema,
  TermsConditionsValidationSchema,
  SocalMediaLinksAddressPhoneEmailTextsValidationSchema,
};


export default settingValidationSchema;