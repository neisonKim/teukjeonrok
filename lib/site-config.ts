const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  || 'http://localhost:3000';
const parsed = new URL(configuredUrl);
if (!['http:', 'https:'].includes(parsed.protocol)) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be an http or https URL.');
}
export const siteUrl = parsed.origin;
