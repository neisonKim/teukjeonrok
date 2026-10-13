import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import {join} from 'node:path';

const manifest=JSON.parse(await readFile('.next/prerender-manifest.json','utf8'));
const paths=Object.keys(manifest.routes).filter(p=>p.startsWith('/archive/'));
assert.equal(paths.length,44,'Build first: expected 44 generated reading pages.');
const socket=createServer();await new Promise(resolve=>socket.listen(0,'127.0.0.1',resolve));
const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
const child=spawn(process.execPath,[join(process.cwd(),'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{
 cwd:process.cwd(),env:{...process.env,NEXT_PUBLIC_ENABLE_METRICS:'false'},stdio:['ignore','pipe','pipe'],
});
let serverLog='';child.stdout.on('data',data=>serverLog+=data);child.stderr.on('data',data=>serverLog+=data);
const base=`http://127.0.0.1:${port}`;
const fetchLocal=(path,options={})=>fetch(new URL(path,base),{...options,signal:AbortSignal.timeout(10000)});
try{
 let ready=false;
 for(let attempt=0;attempt<80;attempt++){
  if(child.exitCode!==null)throw new Error('Production server exited before becoming ready.');
  try{if((await fetchLocal('/')).ok){ready=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 assert(ready,'Production server did not become ready.');
 const home=await(await fetchLocal('/')).text();
 const sections=[...home.matchAll(/<section\b([^>]*)>/g)];assert.equal(sections.length,7);assert(sections.every(s=>!s[1].includes('hidden')));
 assert.equal((home.match(/id="tk-menu-toggle"/g)??[]).length,1);assert(home.includes('tk-header-spacer'));
 assert(!home.includes('data-section-view'));assert(!home.includes('teukjeonrok-archive.neisonkim.chatgpt.site'));
 for(const path of paths){const response=await fetchLocal(path);assert.equal(response.status,200,path);const html=await response.text();assert(html.includes('기관 원문 열기'),path);assert(html.includes('application/ld+json'),path);}
 assert.equal((await fetchLocal('/archive/event/does-not-exist')).status,404);
 assert.equal((await fetchLocal('/does-not-exist')).status,404);
 const privacy=await fetchLocal('/privacy');assert.equal(privacy.status,200);assert((await privacy.text()).includes('집계를 사용하지 않습니다'));
 const sitemap=await(await fetchLocal('/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)??[]).length,46);
 assert((await(await fetchLocal('/robots.txt')).text()).includes('Disallow: /api/'));
 for(const path of ['/favicon.svg','/assets/teukjeonrok-logo.svg','/assets/hero-swc-dress-reference.webp','/assets/share-preview.jpg','/assets/archive-sans.woff'])assert.equal((await fetchLocal(path)).status,200,path);
 let css='';
 for(const tag of home.matchAll(/<link\b[^>]*>/g)){if(!tag[0].includes('rel="stylesheet"'))continue;const href=tag[0].match(/href="([^"]+)"/)?.[1];if(href)css+=await(await fetchLocal(href)).text()}
 assert(css.includes('100dvh'));assert(/\.tk-header\[data-mobile-header\]\{[^}]*position:fixed/.test(css));
 const metric=(data,origin=base)=>fetchLocal('/api/metrics',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 assert.equal((await metric({event:'page_view',target:'/'})).status,204);
 assert.equal((await metric({event:'unknown',target:'/'})).status,400);
 assert.equal((await metric({event:'page_view',target:'/'},'https://other.example.test')).status,403);
 console.log('PASS: native Next.js production HTTP server; home and 44 SSG pages, 404s, disabled metrics API, privacy, sitemap (46), robots, styles and assets. No browser/mobile interaction test.');
}catch(error){console.error(serverLog);throw error}
finally{if(child.exitCode===null){const stopped=once(child,'exit');child.kill('SIGTERM');await stopped}}
