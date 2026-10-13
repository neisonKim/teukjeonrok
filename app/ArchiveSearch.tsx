'use client';
import { useEffect,useState } from 'react';
import { Search,X,ArrowRight } from 'lucide-react';
import { searchEntries,kindLabels,entryPath,parseSearchKind,type SearchKind } from './archive-index';
import { track } from './analytics-client';
export function ArchiveSearch(){
 const [query,setQuery]=useState(''),[kind,setKind]=useState<SearchKind>('all'),[limit,setLimit]=useState(8);
 const results=searchEntries(query,kind);
 useEffect(()=>{const initial=new URL(window.location.href);setQuery(initial.searchParams.get('q')?.slice(0,100)??'');setKind(parseSearchKind(initial.searchParams.get('kind')))},[]);
 useEffect(()=>{setLimit(8)},[query,kind]);
 useEffect(()=>{if(!query.trim())return;const t=window.setTimeout(()=>track('search',kind),900);return()=>window.clearTimeout(t)},[query,kind]);
 function shareSearch(){const url=new URL(window.location.href);url.searchParams.delete('q');url.searchParams.delete('kind');if(query.trim())url.searchParams.set('q',query.trim());if(kind!=='all')url.searchParams.set('kind',kind);url.hash='records';window.history.replaceState(null,'',url);}
 return <div className="tk-archive-search"><form className="tk-record-controls" onSubmit={e=>{e.preventDefault();shareSearch()}}><label className="tk-search"><Search size={20}/><input value={query} maxLength={100} onChange={e=>setQuery(e.target.value)} placeholder="사건, 부대, 인물, KLO·8240 검색" aria-label="아카이브 전체 검색"/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="검색 지우기"><X size={18}/></button>}</label><label className="tk-kind-select"><span className="sr-only">검색 대상</span><select value={kind} onChange={e=>setKind(parseSearchKind(e.target.value))}><option value="all">전체 항목</option>{Object.entries(kindLabels).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label><button className="tk-button outline" type="submit">검색</button></form><div className="tk-search-summary" role="status"><span>{query?`“${query}” 검색 결과`:'전체 아카이브'} · {results.length}건</span><span>사건 · 조직 · 인물 · 심화 글 · 자료</span></div><div className="tk-search-results">{results.slice(0,limit).map(e=><a href={entryPath(e)} key={`${e.kind}/${e.id}`} className="tk-search-result"><span className="tk-result-kind">{kindLabels[e.kind]}</span><h3>{e.title}</h3><p>{e.summary}</p><div><small>{e.date}</small><span>읽기<ArrowRight size={16}/></span></div></a>)}</div>{results.length>limit&&<button className="tk-button outline tk-load-more" onClick={()=>setLimit(v=>v+8)}>8개 더 보기 · {results.length-limit}건 남음</button>}{!results.length&&<div className="tk-empty"><Search size={28}/><h3>일치하는 항목이 없습니다.</h3><p>다른 용어를 입력하거나 검색 대상을 전체로 바꿔보세요.</p><button className="tk-button outline" onClick={()=>{setQuery('');setKind('all')}}>검색 초기화</button></div>}</div>;
}
