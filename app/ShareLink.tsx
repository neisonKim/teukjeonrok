'use client';
import { useState } from 'react';
import { Copy,Share2 } from 'lucide-react';
import { track } from './analytics-client';
export function ShareLink({path,title}:{path:string;title:string}) {
 const [status,setStatus]=useState(''),[fallback,setFallback]=useState('');
 async function share(){const url=new URL(path,window.location.origin).href;try{if(navigator.share){await navigator.share({title,url});setStatus('공유했습니다.')}else{await navigator.clipboard.writeText(url);setStatus('링크를 복사했습니다.')}track('share',path)}catch(e){if(e instanceof DOMException&&e.name==='AbortError')return;setFallback(url);setStatus('아래 주소를 선택해 복사하세요.')}}
 return <div className="tk-share"><button type="button" onClick={share}><Share2 size={16}/>이 내용 공유하기<Copy size={14}/></button><span role="status">{status}</span>{fallback&&<input aria-label="공유 주소" readOnly value={fallback} onFocus={e=>e.target.select()}/>}</div>;
}
