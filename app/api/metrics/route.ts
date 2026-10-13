import { recordMetric } from '../../../lib/metrics-store';
export const runtime = 'nodejs';
import { archiveEntries,entryPath } from '../../archive-index';
import { sources,forces } from '../../archive-data';
import { historyEvents } from '../../history-data';
const entryPaths=archiveEntries.map(entryPath);
const allowedTargets:Record<string,Set<string>>={
 page_view:new Set(['/', '/privacy',...entryPaths]),
 event_open:new Set(historyEvents.map(e=>e.id)),role_open:new Set(forces.map(f=>f.id)),source_open:new Set(sources.map(s=>s.id)),
 menu:new Set(['open','close']),filter:new Set(['전체','특수작전','정보수집','구조','항공 지원']),
 search:new Set(['all','event','organization','person','collection','source']),share:new Set(entryPaths)
};
function validMetric(value:unknown):value is {event:string;target:string}{if(!value||typeof value!=='object')return false;const v=value as {event?:unknown;target?:unknown};return typeof v.event==='string'&&typeof v.target==='string'&&Object.hasOwn(allowedTargets,v.event)&&allowedTargets[v.event].has(v.target)}
export async function POST(request:Request){
 const url=new URL(request.url);
 // Next.js can use an internal localhost URL. Host and forwarded protocol
 // reflect the address the browser actually requested, including on Vercel.
 const host=request.headers.get('host')??url.host;
 const protocol=request.headers.get('x-forwarded-proto')??url.protocol.slice(0,-1);
 if(request.headers.get('origin')!==`${protocol}://${host}`)return new Response(null,{status:403});
 if(Number(request.headers.get('content-length')??0)>512)return new Response(null,{status:413});
 if(request.headers.get('DNT')==='1'||request.headers.get('Sec-GPC')==='1')return new Response(null,{status:204});
 let data:unknown;
 try{const body=await request.text();if(new TextEncoder().encode(body).byteLength>512)return new Response(null,{status:413});data=JSON.parse(body)}catch{return new Response(null,{status:400})}
 if(!validMetric(data))return new Response(null,{status:400});
 if(process.env.NEXT_PUBLIC_ENABLE_METRICS!=='true')return new Response(null,{status:204});
 try{await recordMetric(data.event,data.target);return new Response(null,{status:204})}
 catch{return new Response(null,{status:503})}
}
