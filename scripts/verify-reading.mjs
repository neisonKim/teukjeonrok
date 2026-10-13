import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const require=createRequire(join(process.cwd(),'package.json'));
const {build}=require('esbuild');
const previousUrl=process.env.NEXT_PUBLIC_SITE_URL;process.env.NEXT_PUBLIC_SITE_URL='https://teukjeonrok.example.test';
const d=await mkdtemp(join(tmpdir(),'reading-check-'));
try{
 await build({entryPoints:['app/archive/[kind]/[id]/page.tsx','app/archive-index.ts','app/sitemap.ts','app/robots.ts'],outdir:d,outbase:'app',platform:'node',bundle:true,format:'esm',packages:'external',plugins:[{name:'next-test',setup(b){b.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:'export function usePathname(){return "/"};export function notFound(){throw new Error("not_found")}',loader:'js'}))}}]});
 await symlink(join(process.cwd(),'node_modules'),join(d,'node_modules'),process.platform==='win32'?'junction':'dir');
 const {archiveEntries,entryPath}=await import(pathToFileURL(join(d,'archive-index.js')));
 const {default:Page,generateMetadata,generateStaticParams}=await import(pathToFileURL(join(d,'archive/[kind]/[id]/page.js')));
 assert.equal(generateStaticParams().length,44);assert.equal(new Set(generateStaticParams().map(p=>p.kind+'/'+p.id)).size,44);
 const {renderToStaticMarkup}=require('react-dom/server');
 for(const e of archiveEntries){const props={params:Promise.resolve({kind:e.kind,id:e.id})};const markup=renderToStaticMarkup(await Page(props));assert(markup.includes('기관 원문 열기'));assert(markup.includes('application/ld+json'));assert.equal((await generateMetadata(props)).alternates.canonical,entryPath(e));}
 await assert.rejects(Page({params:Promise.resolve({kind:'event',id:'missing'})}),/not_found/);
 const {default:sitemap}=await import(pathToFileURL(join(d,'sitemap.js')));assert.equal(sitemap().length,archiveEntries.length+2);assert(sitemap().every(e=>e.url.startsWith('https://teukjeonrok.example.test')));
 const {default:robots}=await import(pathToFileURL(join(d,'robots.js')));assert.equal(robots().sitemap,'https://teukjeonrok.example.test/sitemap.xml');
 console.log('PASS: all 44 reading pages render with source links and metadata; invalid entry handling; sitemap and robots generation.');
}finally{if(previousUrl===undefined)delete process.env.NEXT_PUBLIC_SITE_URL;else process.env.NEXT_PUBLIC_SITE_URL=previousUrl;await rm(d,{recursive:true,force:true})}
