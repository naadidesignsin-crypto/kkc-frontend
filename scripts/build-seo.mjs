import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {facts,renderer,seoPages,seoCss} from './seo-pages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'dist');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const token=process.env.GOOGLE_SITE_VERIFICATION?.trim();
const verification=token?'<meta name="google-site-verification" content="'+escape(token)+'">':'';
await mkdir(resolve(out,'seo-assets'),{recursive:true});
const copies=[['src/assets/kkc-logo.png','kkc-logo.png'],['src/assets/events/karthika-masam-main-2026.png','karthika-main.png'],...facts.programmes.map(p=>['src/assets/events/'+p.image,p.image])];
for(const [source,destination]of copies)await copyFile(resolve(root,source),resolve(out,'seo-assets',destination));
for(const [path,html]of seoPages){
 const target=resolve(out,'.'+path,'index.html');await mkdir(dirname(target),{recursive:true});
 await writeFile(target,html.replace('</head>',verification+'</head>'),'utf8');
}
const indexPath=resolve(out,'index.html');
let index=await readFile(indexPath,'utf8');
if(!index.includes('<div id="root"></div>'))throw new Error('SEO prerender expected an empty React root in Vite index.html.');
index=index.replace('<div id="root"></div>','<div id="root">'+renderer.homeFallback+'</div>');
index=index.replace('</head>','<style id="kkc-initial-content">'+seoCss+'</style>'+renderer.homeSchema+verification+'</head>');
await writeFile(indexPath,index,'utf8');
const urls=['/',...seoPages.keys()].map(path=>'<url><loc>'+escape(facts.origin+path)+'</loc></url>').join('\n');
await writeFile(resolve(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n','utf8');
await writeFile(resolve(out,'robots.txt'),'User-agent: *\nAllow: /\nDisallow: /registration-preview\nSitemap: '+facts.origin+'/sitemap.xml\n','utf8');
await writeFile(resolve(out,'404.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | KKC</title><h1>Page not found</h1><p><a href="/">KKC homepage</a> · <a href="'+facts.overview.path+'">Karthika Masam programme</a></p></html>','utf8');
console.log('SEO: generated '+seoPages.size+' readable event pages, homepage fallback, sitemap and robots.txt.');
