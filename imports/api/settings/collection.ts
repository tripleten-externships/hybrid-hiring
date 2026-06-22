import { Mongo } from 'meteor/mongo';

export const SETTINGS_DOC_ID = 'global';

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  instagram: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
}

export interface AppSettings {
  _id?: string;
  showSocials: boolean;
  socialLinks: SocialLinks;
  contact: ContactInfo;
  testimonial: Testimonial;
  updatedAt?: Date;
}

/**
 * Default settings, seeded on the server and used as a client-side fallback
 * before the live document arrives. Values mirror the original hardcoded
 * content so nothing changes visually until an admin edits them.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  _id: SETTINGS_DOC_ID,
  showSocials: true,
  socialLinks: {
    facebook: '',
    linkedin: '',
    instagram: '',
  },
  contact: {
    phone: '+1 (570) 930-2566',
    email: 'hybridhiringsolutions@gmail.com',
  },
  testimonial: {
    quote:
      "Finding the right jobs for my skills has always been difficult, but with Hybrid Hiring Solutions it didn't take long for me to find the right path.",
    authorName: 'John Smith',
    authorTitle: 'Gas plant operator',
  },
};

export const SettingsCollection = new Mongo.Collection<AppSettings>('settings');
