import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,symlink,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url),{build}=require('esbuild');
const dir=await mkdtemp(join(tmpdir(),'section-scroll-'));
try{
 await build({entryPoints:['app/Archive.tsx'],outfile:join(dir,'Archive.mjs'),bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},plugins:[{name:'scroll-render-fixture',setup(b){
  b.onResolve({filter:/useSectionScroll$/},()=>({path:'view',namespace:'fixture'}));
  b.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path==='view'?'export function useSectionScroll(){return {section:globalThis.__qaSectionTarget??null,anchor:""}}':'export function usePathname(){return "/"}',loader:'js'}));
 }}]});
 await symlink(join(process.cwd(),'node_modules'),join(dir,'node_modules'),process.platform==='win32'?'junction':'dir');
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');const {default:Archive}=await import(pathToFileURL(join(dir,'Archive.mjs')));
 for(const view of [null,'start','history','klo','forces','records','method']){
  globalThis.__qaSectionTarget=view;const html=renderToStaticMarkup(React.createElement(Archive));
  const sections=[...html.matchAll(/<section\b([^>]*)>/g)].map(m=>({id:m[1].match(/\bid="([^"]+)"/)?.[1]??'home',hidden:/\bhidden=""/.test(m[1])}));
  assert.equal(sections.length,7);const visible=sections.filter(s=>!s.hidden);
  assert.equal(visible.length,7);assert(!html.includes('data-section-view'));assert(!html.includes('tk-section-return'));assert.equal((html.match(/<h1\b/g)??[]).length,1);
  assert.equal((html.match(/id="tk-menu-toggle"/g)??[]).length,1);assert(html.includes('href="#top"'));assert(html.includes('tk-header-spacer'));
 }
 const css=await readFile('app/reading.css','utf8');assert(!css.includes('main>section[hidden]'));assert(css.includes('min-height:calc(100dvh - var(--tk-header-height) - 1px)'));assert(!css.includes('scroll-snap-type'));const base=await readFile('app/archive.css','utf8');assert(base.includes('scroll-padding-top:calc(var(--tk-header-height,88px) + 1px)'));
 console.log('PASS: all seven sections stay visible for every navigation target; one h1, shared header, viewport sizing and header offset preserved.');
}finally{delete globalThis.__qaSectionTarget;await rm(dir,{recursive:true,force:true})}
