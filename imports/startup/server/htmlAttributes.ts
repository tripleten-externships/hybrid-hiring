import { WebApp } from 'meteor/webapp';

// `addHtmlAttributeHook` exists at runtime (webapp package) but is missing from
// the shipped @types/meteor definitions, so we declare it here.
declare module 'meteor/webapp' {
  namespace WebApp {
    function addHtmlAttributeHook(hook: () => Record<string, string> | null | undefined): void;
  }
}

/**
 * Set the document language on the server-rendered `<html>` tag.
 *
 * Required by WCAG 3.1.1 (Language of Page, Level A) so assistive technology
 * uses the correct pronunciation and voice.
 */
WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
