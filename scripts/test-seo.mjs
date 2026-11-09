import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {facts,seoPages} from './seo-pages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'dist');
const sitemap=await readFile(resolve(out,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
assert.equal(urls.length,13);
assert.equal(new Set(urls).size,13);
assert.ok(urls.includes(facts.origin+'/'));
const titles=new Set(),events=new Set();
for(const [path]of seoPages){
 const html=await readFile(resolve(out,'.'+path,'index.html'),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert.ok(!titles.has(title),'Duplicate title: '+title);titles.add(title);
 assert.ok(html.includes('<link rel="canonical" href="'+facts.origin+path+'">'));
 assert.ok(html.includes('name="description"'));
 assert.ok(html.includes('lang="te"'));
 assert.ok(!html.includes('<div id="root"></div>'));
 assert.ok(!/<script[^>]+src=/.test(html),'Event pages must be readable without JavaScript');
 assert.ok(urls.includes(facts.origin+path));
 assert.ok(html.includes('/telugu?register=karthika-2026&amp;source=seo_event'));
 for(const match of html.matchAll(/<a[^>]+href="([^"]+)"/g)){
  const href=match[1].replaceAll('&amp;','&');
  if(href.startsWith('/events/'))assert.ok(seoPages.has(href),'Broken event link '+href);
  if(href.startsWith('/seo-assets/'))await access(resolve(out,'.'+href));
 }
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 for(const event of graph.filter(item=>item['@type']==='Event')){
  assert.ok(!events.has(event.url));events.add(event.url);
  assert.equal(event.url,facts.origin+path);
  assert.ok(event.name && event.location.name && event.location.address.streetAddress);
  assert.match(event.startDate,/\+05:30$/);
  assert.ok(Date.parse(event.endDate)>Date.parse(event.startDate));
  assert.equal('offers' in event,false,'Programme packages must not be represented as single-event ticket prices');
  const venue=path.includes('lingarchana')?facts.venues.lingarchana:facts.venues.homam;
  assert.equal(event.location.address.streetAddress,venue.streetAddress);
  assert.equal(event.location.hasMap,venue.mapUrl);
  for(const img of event.image)await access(resolve(out,'.'+new URL(img).pathname));
 }
}
assert.equal(events.size,9);
const home=await readFile(resolve(out,'index.html'),'utf8');
assert.match(home,/<link rel="canonical" href="https:\/\/kkcorg.com\/"/);
assert.match(home,/<h1>KKC/);
assert.ok(!home.includes('<div id="root"></div>'));
assert.ok(home.includes('Vijaya Lakshmi Villa')&&home.includes('Dasa Hanuman and Durga Devi Temple'));
assert.match(await readFile(resolve(out,'robots.txt'),'utf8'),/Sitemap: https:\/\/kkcorg.com\/sitemap.xml/);
const ctx=vm.createContext({});vm.runInContext(await readFile(resolve(root,'integrations/google-forms-setup.gs'),'utf8'),ctx);
assert.deepEqual(Array.from(ctx.kkcDakshinaOptions_(),s=>s.amount),facts.sevas.map(s=>s.amount));
console.log('PASS SEO: 13 canonical sitemap URLs, 12 no-JavaScript pages, 9 unique dated events, venue/timezone consistency, valid local links and assets, homepage prerender and matching Dakshinas.');
