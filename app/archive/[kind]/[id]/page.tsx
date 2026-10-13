import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findEntry,archiveEntries,entryPath,kindLabels,siteUrl,lastSourceReview } from '../../../archive-index';
import { sources } from '../../../archive-data';
import { ShareLink } from '../../../ShareLink';
import { BookOpen,ExternalLink,ArrowLeft } from 'lucide-react';
export const dynamicParams = false;
export function generateStaticParams(){return archiveEntries.map(e=>({kind:e.kind,id:e.id}))}
type Props={params:Promise<{kind:string;id:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {kind,id}=await params;const e=findEntry(kind,id);if(!e)return {title:'항목을 찾을 수 없습니다',robots:{index:false}};return {title:`${e.title} | 특전록`,description:e.summary,alternates:{canonical:entryPath(e)},openGraph:{title:e.title,description:e.summary,url:entryPath(e),type:'article',images:[{url:'/assets/share-preview.jpg',width:1200,height:630,alt:'특전록 · 기록으로 만나는 대한민국 특수작전의 역사'}]},twitter:{card:'summary_large_image',title:e.title,description:e.summary,images:['/assets/share-preview.jpg']}}}
export default async function EntryPage({params}:Props){
 const {kind,id}=await params;const e=findEntry(kind,id);if(!e)notFound();
 const cited=sources.filter(s=>e.sourceIds.includes(s.id));
 const related=archiveEntries.filter(x=>entryPath(x)!==entryPath(e)&&x.sourceIds.some(s=>e.sourceIds.includes(s))).slice(0,4);
 const schema={'@context':'https://schema.org','@type':'Article',headline:e.title,description:e.summary,url:siteUrl+entryPath(e),inLanguage:'ko',dateModified:e.updated,author:{'@type':'Organization',name:'특전록'},citation:cited.map(s=>s.url)};
 return <div className="tk-site tk-reading-page"><a className="tk-skip" href="#article">본문으로 바로 가기</a><header className="tk-reading-header tk-container"><a href="/" aria-label="특전록 홈"><img src="/assets/teukjeonrok-logo.svg" width={250} height={70} alt="특전록"/></a><a href="/#records"><BookOpen size={17}/>전체 검색</a></header><main id="article" className="tk-container"><a className="tk-back" href={e.kind==='event'?'/#history':e.kind==='organization'?'/#forces':'/#records'}><ArrowLeft size={16}/>아카이브로 돌아가기</a><div className="tk-reading-intro"><span className="tk-caption">{kindLabels[e.kind]} · {e.date}</span><h1>{e.title}</h1><p>{e.summary}</p><div className="tk-reading-dates">자료 검토 {lastSourceReview} · 읽기 페이지 구성 {e.updated.replaceAll('-','.')}</div><ShareLink path={entryPath(e)} title={e.title}/></div>
 {e.image&&<figure className="tk-reading-image"><img src={e.image.src} alt={`${e.image.alt} · AI 재현`} width={1586} height={992} style={{objectPosition:e.image.position}}/><figcaption>AI 재현 이미지 · 실제 대원·기록사진이 아닌 역할 이해를 위한 가상 장면</figcaption></figure>}
 <div className="tk-reading-body">{e.sections.map(s=><section key={s.title}><h2>{s.title}</h2><p>{s.body}</p></section>)}</div>
 <section className="tk-reading-sources"><h2>근거와 원문 읽기</h2><p>원문·기관 해설·보도의 종류와 확인 범위를 함께 살펴보세요.</p>{cited.map(s=><article key={s.id}><span>{s.type} · {s.org}</span><h3>{s.title}</h3><p>{s.explains}</p><details><summary>확인 범위와 검토 기록</summary><p>{s.limits}</p><small>{s.date}</small></details><div><a href={s.url} target="_blank" rel="noreferrer">기관 원문 열기<ExternalLink size={16}/></a>{e.kind!=='source'&&<a href={`/archive/source/${s.id}`}>자료 읽기 안내</a>}</div></article>)}</section>
 {related.length>0&&<section className="tk-related"><h2>연결해서 읽기</h2><div>{related.map(r=><a href={entryPath(r)} key={entryPath(r)}><span>{kindLabels[r.kind]}</span><h3>{r.title}</h3><p>{r.summary}</p></a>)}</div></section>}
 </main><footer className="tk-container tk-reading-footer"><p>특전록 · 독립 디지털 역사 아카이브</p><a href="/#method">편집 원칙·업데이트</a><a href="/privacy">집계 안내</a></footer><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></div>;
}
