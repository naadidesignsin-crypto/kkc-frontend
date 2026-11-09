# Free SEO setup for kkcorg.com

No paid SEO service or new subscription is required. The existing Vercel build generates readable event HTML, canonical metadata, social preview tags, Event JSON-LD, sitemap.xml and robots.txt.

## What is generated

- /events/karthika-masam-2026/
- /events/maha-lingarchana-2026/ and four date detail pages
- /events/purusha-suktam-homams-2026/ and four date detail pages
- /events/rudra-homam-2026/
- Initial homepage content available before JavaScript runs

Each individual occurrence has its own URL and Event data. Group/overview pages use collection/list data. Programme-wide Dakshina options are not incorrectly marked as individual-event ticket prices. Both venues have their own address and directions.

The existing /telugu and /english routes use the homepage canonical because the surrounding site content is currently shared. No hreflang is claimed for pages that are not fully separate translations. Bilingual content uses lang=te on Telugu passages.

## Deploy and verify

1. Push the code to main and let Vercel complete npm run build.
2. Check https://kkcorg.com/sitemap.xml and https://kkcorg.com/robots.txt.
3. Open Google Search Console: https://search.google.com/search-console
4. Add a URL-prefix property for https://kkcorg.com/ using the Google account that should own the site.
5. Select the HTML-tag verification option. Copy only the content value from Google's verification tag.
6. In Vercel > Project > Settings > Environment Variables, add GOOGLE_SITE_VERIFICATION with that value for Production, then redeploy. This is a public verification token, not a password.
7. Return to Search Console and click Verify.
8. Under Sitemaps, submit sitemap.xml.
9. Use URL Inspection on the homepage and programme overview, then request indexing. Use Google's Rich Results Test on an individual date page to check live Event markup.

A Domain property verified by a DNS TXT record is another free option if the domain owner prefers it. No domain purchase is needed.

Google decides indexing, ranking and rich-result appearance; creating pages and a sitemap does not guarantee placement or a deadline.

## Maintaining content

src/data/seoEvents.json drives event schedules, SEO page copy, venues and the SEO Seva table. The website venue display imports that same venue data. When changing event schedules, update the existing poster schedule data as well, regenerate the posters, then rebuild.

npm run build generates the static pages after Vite. npm run test:seo validates the generated output. npm run dev serves the same event-page templates locally. Android packaging stays separate and does not generate the web SEO pages.

Registration links use register=karthika-2026 to open the existing form directly. Invitation QR links continue to use invite=karthika-2026 and open the main poster first. No registrant information, Sheet edit links or private registration records are placed in the sitemap or structured data.

## Sources

https://developers.google.com/search/docs/appearance/structured-data/event
https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
