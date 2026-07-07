import { Meteor } from 'meteor/meteor';

const LOGO_DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i;

/** ~150 KB of base64 — logos are resized client-side before upload. */
export const MAX_COMPANY_LOGO_CHARS = 200_000;

export function validateCompanyLogo(logo: string | undefined | null): string | undefined {
  if (!logo) return undefined;

  if (!LOGO_DATA_URL_RE.test(logo)) {
    throw new Meteor.Error(
      'invalid-image',
      'Please upload a valid image file for the company logo.'
    );
  }
  if (logo.length > MAX_COMPANY_LOGO_CHARS) {
    throw new Meteor.Error(
      'image-too-large',
      'Company logo is too large. Please choose a smaller image.'
    );
  }

  return logo;
}
