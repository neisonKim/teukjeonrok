import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url),{build}=require('esbuild');
const dir=await mkdtemp(join(tmpdir(),'scroll-events-'));
try{
 await build({entryPoints:['app/useSectionScroll.ts'],outfile:join(dir,'hook.mjs'),bundle:true,platform:'node',format:'esm',plugins:[{name:'effect-harness',setup(b){
  b.onResolve({filter:/^react$/},()=>({path:'react',namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export function useState(initial){const h=globalThis.__scrollHarness;h.state??=initial;return [h.state,next=>h.state=next]} export function useLayoutEffect(effect){globalThis.__scrollHarness.effects.push(effect)}',loader:'js'}));
 }}]});
 const h=globalThis.__scrollHarness={effects:[],state:null};
 const listeners=new Map(),frames=new Map(),calls=[];let nextFrame=0,reduced=false,headerHeight=89;
 globalThis.requestAnimationFrame=callback=>{frames.set(++nextFrame,callback);return nextFrame};
 globalThis.cancelAnimationFrame=id=>frames.delete(id);
 const tick=()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb())};
 class FakeElement{constructor(href){this.href=new URL(href,'https://archive.test/').href;this.target=''}closest(){return this}getAttribute(){return new URL(this.href).hash}hasAttribute(){return false}}
 globalThis.Element=FakeElement;
 const root={style:{scrollBehavior:'smooth'}};
 globalThis.window={location:new URL('https://archive.test/'),scrollY:900,history:{pushState(_,__,url){window.location=new URL(url)}},matchMedia:()=>({matches:reduced}),addEventListener:(key,cb)=>listeners.set(key,cb),removeEventListener:key=>listeners.delete(key),scrollTo:args=>{calls.push(args);window.scrollY=args.top}};
 globalThis.document={documentElement:root,getElementById:id=>id==='unknown'?null:{getBoundingClientRect:()=>({top:(id==='top'?0:2000)-window.scrollY})},querySelector:()=>({getBoundingClientRect:()=>({height:headerHeight})}),addEventListener:(key,cb)=>listeners.set(key,cb),removeEventListener:key=>listeners.delete(key)};
 const {useSectionScroll}=await import(pathToFileURL(join(dir,'hook.mjs')));
 useSectionScroll();const removeListeners=h.effects[0]();
 const renderScroll=()=>{h.effects=[];useSectionScroll();return h.effects[1]()};
 const click=(hash,extra={})=>{let prevented=false;listeners.get('click')({button:0,target:new FakeElement(hash),preventDefault(){prevented=true},...extra});return prevented};
 assert(click('#klo'));assert.equal(window.location.hash,'#klo');const cleanup=renderScroll();
 assert.equal(calls.length,0);tick();assert.equal(calls.length,0);tick();
 assert.deepEqual(calls.pop(),{top:1911,left:0,behavior:'smooth'});assert.equal(root.style.scrollBehavior,'smooth');cleanup();
 headerHeight=77;reduced=true;assert(click('#records'));renderScroll();tick();tick();
 assert.deepEqual(calls.pop(),{top:1923,left:0,behavior:'auto'});
 reduced=false;assert(click('#top'));renderScroll();tick();tick();assert.equal(calls.pop().top,0);
 assert(!click('#unknown'));assert(!click('#klo',{ctrlKey:true}));assert(!click('#klo',{defaultPrevented:true}));
 const previous=h.state;window.location=new URL('https://archive.test/#unknown');listeners.get('hashchange')();assert.equal(h.state,previous);
 window.location=new URL('https://archive.test/#history');listeners.get('popstate')();renderScroll();tick();tick();assert.deepEqual(calls.pop(),{top:1923,left:0,behavior:'auto'});
 assert(click('#forces'));const cancel=renderScroll();cancel();tick();tick();assert.equal(calls.length,0);
 removeListeners();assert.equal(listeners.size,0);
 console.log('PASS: delayed smooth scrolling, desktop/mobile header offsets, reduced motion, top return, history restoration, modified/unknown links and cancelled navigation. DOM harness only; browser layout not tested.');
}finally{for(const key of ['__scrollHarness','requestAnimationFrame','cancelAnimationFrame','Element','window','document'])delete globalThis[key];await rm(dir,{recursive:true,force:true})}
