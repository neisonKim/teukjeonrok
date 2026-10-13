'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { track } from './analytics-client';
export function MobileMenu({children,items,active}:{children:ReactNode;items:{id:string;label:string}[];active:string}) {
 const [open,setOpen]=useState(false);
 const [position,setPosition]=useState<{left:number;top:number}|null>(null);
 const toggle=useRef<HTMLButtonElement>(null),panel=useRef<HTMLElement>(null);
 // innerWidth includes the scrollbar. clientWidth/header bounds change when
 // overflow is locked; neither is an input to this persistent control's position.
 useLayoutEffect(()=>{
  function place(){const width=window.innerWidth;const small=width<=640;
   const next={left:Math.round(width-(small?24:48)-44),top:small?16:22};
   setPosition(current=>current?.left===next.left&&current.top===next.top?current:next);
  }
  place();window.addEventListener('resize',place);
  return()=>window.removeEventListener('resize',place);
 },[]);
 useEffect(()=>{const wide=window.matchMedia('(min-width:951px)');const close=()=>{if(wide.matches)setOpen(false)};wide.addEventListener('change',close);return()=>wide.removeEventListener('change',close)},[]);
 useEffect(()=>{
  if(!open)return;
  const bodyOverflow=document.body.style.overflow,rootOverflow=document.documentElement.style.overflow;
  const backgrounds=Array.from(document.querySelectorAll<HTMLElement>('main,footer,.tk-header-brand'));const previous=backgrounds.map(el=>el.inert);
  backgrounds.forEach(el=>{el.inert=true});document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';
  function onKey(e:KeyboardEvent){
   if(e.key==='Escape'){e.preventDefault();setOpen(false);toggle.current?.focus({preventScroll:true});return}
   if(e.key!=='Tab')return;
   const stops=[toggle.current,...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a')??[])].filter((el):el is HTMLButtonElement|HTMLAnchorElement=>!!el);
   const first=stops[0],last=stops[stops.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus({preventScroll:true})}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus({preventScroll:true})}
  }
  document.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=bodyOverflow;document.documentElement.style.overflow=rootOverflow;backgrounds.forEach((el,i)=>{el.inert=previous[i]});document.removeEventListener('keydown',onKey)};
 },[open]);
 const close=()=>{setOpen(false);toggle.current?.focus({preventScroll:true})};
 return <><div className="tk-header-spacer" aria-hidden="true"/><header className="tk-header" data-mobile-header><div className="tk-container tk-header-inner"><div className="tk-header-brand">{children}</div><nav aria-label="주요 메뉴" className="tk-nav">{items.map(s=><a key={s.id} href={`#${s.id}`} className={active===s.id?'active':''} aria-current={active===s.id?'location':undefined}>{s.label}</a>)}</nav><button ref={toggle} id="tk-menu-toggle" className="tk-menu" style={position??undefined} aria-label={open?'메뉴 닫기':'메뉴 열기'} aria-expanded={open} aria-controls="tk-mobile-navigation" data-open={open} onPointerDown={e=>{e.preventDefault();toggle.current?.focus({preventScroll:true})}} onClick={()=>{setOpen(v=>!v);track('menu',open?'close':'open')}}><span className="tk-menu-glyph" aria-hidden="true"><span/><span/><span/></span></button></div><div className="tk-mobile-layer" hidden={!open}><button className="tk-mobile-backdrop" aria-label="메뉴 닫기" tabIndex={-1} onClick={close}/><nav ref={panel} id="tk-mobile-navigation" className="tk-mobile-nav" aria-label="모바일 메뉴">{items.map((s,i)=><a href={`#${s.id}`} key={s.id} onClick={close}><span>0{i+1}</span>{s.label}</a>)}<a href="#method" onClick={close}>편집 원칙·업데이트</a><a href="#top" onClick={close}>처음으로</a><p>독립 디지털 역사 아카이브</p></nav></div></header></>;
}
