'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function track(event:string,target:string){
 if(process.env.NEXT_PUBLIC_ENABLE_METRICS!=='true')return;
 if(typeof window==='undefined'||navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl)return;
 const body=JSON.stringify({event,target});void fetch('/api/metrics',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});
}
let lastPage='';
export function PageMetrics(){const path=usePathname();useEffect(()=>{if(lastPage===path)return;lastPage=path;track('page_view',path)},[path]);return null;}
