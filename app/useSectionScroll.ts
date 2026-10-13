'use client';
import {useLayoutEffect,useState} from 'react';
import {resolveSectionNavigation,sectionScrollTop,type SectionNavigation} from './section-navigation';

export function useSectionScroll(){
 const [navigation,setNavigation]=useState<SectionNavigation & {smooth?:boolean}>({section:null,anchor:''});
 useLayoutEffect(()=>{
  const sync=()=>{const next=resolveSectionNavigation(window.location.hash);if(next)setNavigation({...next,smooth:false})};
  if(window.location.hash)sync();
  function onClick(event:MouseEvent){
   if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;
   const a=event.target.closest<HTMLAnchorElement>('a[href]');
   if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
   const raw=a.getAttribute('href')??'';if(!raw.startsWith('#')&&!raw.startsWith('/#'))return;
   const url=new URL(a.href,window.location.href);
   if(url.origin!==window.location.origin||url.pathname!==window.location.pathname)return;
   const next=resolveSectionNavigation(url.hash);if(!next)return;
   event.preventDefault();
   if(window.location.href!==url.href)window.history.pushState(null,'',url);
   setNavigation({...next,smooth:true});
  }
  window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);
  document.addEventListener('click',onClick,true);
  return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);document.removeEventListener('click',onClick,true)};
 },[]);
 useLayoutEffect(()=>{
  if(!navigation.anchor)return;
  let frame=0;
  // Wait for the mobile panel's close handler and overflow cleanup before scrolling.
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
   const target=document.getElementById(navigation.anchor.slice(1));if(!target)return;
   const headerHeight=document.querySelector('.tk-header')?.getBoundingClientRect().height??0;
   const top=navigation.anchor==='#top'?0:sectionScrollTop(target.getBoundingClientRect().top,window.scrollY,headerHeight);
   const smooth=navigation.smooth&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const root=document.documentElement,previous=root.style.scrollBehavior;
   if(!smooth)root.style.scrollBehavior='auto';
   window.scrollTo({top,left:0,behavior:smooth?'smooth':'auto'});
   root.style.scrollBehavior=previous;
  })});
  return()=>cancelAnimationFrame(frame);
 },[navigation]);
 return navigation;
}
