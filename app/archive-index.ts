import { forces,forceVisuals,sources } from './archive-data';
import { historyEvents,reviewedOn } from './history-data';
import { siteUpdated } from './revision-data';
export { siteUrl } from '../lib/site-config';
export const kindLabels={event:'사건',organization:'조직·전문요원',person:'인물',collection:'심화 글',source:'자료·출처'} as const;
export type EntryKind=keyof typeof kindLabels;
export type SearchKind=EntryKind|'all';
export function parseSearchKind(value:string|null):SearchKind{return value&&Object.hasOwn(kindLabels,value)?value as EntryKind:'all'}
export type ArchiveEntry={id:string;kind:EntryKind;title:string;summary:string;sections:{title:string;body:string}[];sourceIds:string[];tags:string;date:string;image?:{src:string;alt:string;position:string};originalUrl?:string;updated:string};
const collections:ArchiveEntry[]=[
 {id:'klo-8240',kind:'collection',title:'KLO·TLO·8240, 이름과 조직의 차이',summary:'켈로의 정보 활동과 유격대 지휘·지원체계는 어떻게 연결되었을까요?',date:'1949–1954',updated:siteUpdated,tags:'켈로 캘로 KLO TLO 8240 8250 유격전 한국전쟁',sourceIds:['tlo','archive','guerrilla1','guerrilla2'],sections:[{title:'정보를 모으는 조직에서 출발',body:'KLO는 Korean Liaison Office의 약칭입니다. 미 육군 군사사는 1949년 극동군사령부 정보참모부가 만든 한국인 중심의 정보수집 조직으로 설명합니다. 전쟁 중 전선의 전술정보 활동을 다룰 때 TLO라는 이름도 나타납니다.'},{title:'유격대의 지휘·지원은 별도의 흐름',body:'미 제8군이 유격대를 지원하는 조직을 만들고 8086부대로 재편한 흐름은 KLO의 출발과 구분해야 합니다. 백령도 지원기지와 LEOPARD·BAKER·KIRKLAND 등 현장 조직은 서로 다른 환경과 임무를 가졌습니다.'},{title:'1951년의 두 날짜를 읽는 방법',body:'국가기록원은 7월 26일 극동군사령부 연락처·제8240부대 창설을, 미 육군 군사사는 12월 10일 8086 유격 지휘조직의 8240 체계 편입을 설명합니다. 서술하는 조직과 단계가 다르므로, 하나의 날짜로 합치기보다 무엇이 재편되었는지 확인해야 합니다.'},{title:'더 깊게 읽을 때',body:'8240 소속 기록만으로 모든 대원을 KLO 요원이라고 확정하지 않습니다. 상위 연락체계와 현장 조직, 정보 활동과 유격 활동을 나누어 읽고 당시 편성·명령 문서와 후대 연구를 대조해야 합니다.'}]},
 {id:'people-and-legacy',kind:'collection',title:'전쟁기 사람들의 경험과 정전 이후',summary:'정보요원·유격대원·지역 주민의 경험에서 전후의 인적 연결까지 읽습니다.',date:'한국전쟁·정전 이후',updated:siteUpdated,tags:'KLO 켈로 8240 김용복 Donkey 피난민 정전 유산 1958',sourceIds:['tlo','guerrillaLife','guerrilla2','swcHistory'],sections:[{title:'여러 사람이 만든 기록',body:'군사사는 한국인 정보요원의 참여와 여성·젊은 요원의 사례를 다룹니다. 정보 활동에는 체포·고문·죽음의 위험이 있었습니다. 유격대의 활동에는 현장 지휘자뿐 아니라 식량과 정보를 제공한 주민들의 경험도 포함됩니다.'},{title:'김용복의 사례를 읽는 법',body:'Donkey 3 지휘자 김용복의 인터뷰에는 황해도에서의 피신과 섬으로의 이동, 유격대 지휘 경험이 담겨 있습니다. 개인의 경험은 당시 상황을 이해하는 단서이지만, 전체 유격대의 구성이나 모든 전과를 대표하는 자료로 확대해서는 안 됩니다.'},{title:'정전 뒤에도 이어진 변화',body:'미 육군 군사사는 1953년 8월 8250 재편과 1954년 3월 지휘체계 정리를 설명합니다. 북한 지역 출신 대원들에게 정전은 귀향과 정착의 불확실성을 남겼습니다. 조직의 정리와 개인의 전후 삶은 각각 확인해야 합니다.'},{title:'육군 특수전으로의 인적 연결',body:'한국민족문화대백과사전은 8240 유격 첩보부대 장병들을 중심으로 1958년 제1전투단이 창설되었다고 설명합니다. 이는 육군 특수전 발전의 인적 연결이며, 해군·공군을 포함한 모든 전문 전력의 유일한 계보를 뜻하지 않습니다.'}]},
 {id:'missions-and-intelligence',kind:'collection',title:'특수작전·정보수집·구조의 목적 비교',summary:'활동 환경보다 무엇을 위해 활동하는지부터 비교해 보세요.',date:'공개 임무의 개념 비교',updated:siteUpdated,tags:'정보사 HUMINT 휴민트 UDT SSU CCT SART 특수정찰 육상 해상',sourceIds:['law','intelligenceLaw','specialOpsConcept','udt','ssu'],sections:[{title:'특수작전',body:'특정 군사적 목적을 위해 전문 전력이 임무를 수행합니다. 특전사·707·해군특수전전단은 각 공개된 역할을 바탕으로 이해해야 하며, 조직 규모와 지휘 관계가 같다는 뜻은 아닙니다.'},{title:'군사정보 수집',body:'국군정보사령부는 공개 법령에 규정된 군사정보의 수집·지원·연구와 대정보 업무를 수행하는 군 정보기관으로 소개합니다. 육상·해상 카드는 환경을 구분한 개념 설명이며 독립된 현행 부대 편제를 단정하는 명칭이 아닙니다.'},{title:'구조와 항공 지원',body:'SSU는 해난구조, 항공구조사는 조난 인명 구조, CCT는 항공기 지상 지원에 초점을 둡니다. 바다나 항공이라는 공통 환경이 있어도 임무의 중심은 다릅니다.'},{title:'완전히 나뉘지 않는 활동',body:'특수정찰처럼 정보 확보를 목적으로 하는 특수작전도 있습니다. 따라서 특수작전은 전투만, 정보수집은 비전투만이라는 구분은 부정확합니다. 목적·소속·공개 임무를 함께 읽어야 합니다.'}]}
];
export const archiveEntries:ArchiveEntry[]=[
 ...historyEvents.map(e=>({id:e.id,kind:'event' as const,title:e.title,summary:e.easy,sections:[{title:'무엇이 바뀌었나요?',body:e.body},{title:'쉽게 읽기',body:e.easy}],sourceIds:[e.source,...(e.otherSource?[e.otherSource]:[])],tags:`${e.year} ${e.label} ${e.era} 특전사 육군 역사 ${e.id.startsWith('klo')?'켈로 캘로 KLO':''}`,date:e.date,updated:siteUpdated})),
 ...forces.map(f=>({id:f.id,kind:'organization' as const,title:f.name,summary:f.role,sections:[{title:'무엇을 하나요?',body:f.explain},{title:'무엇과 다른가요?',body:f.difference}],sourceIds:[f.source],tags:`${f.alias} ${f.category} ${f.unit} ${f.id.startsWith('intel')?'정보사 HID UDU 군사정보':''}`,date:f.unit,updated:siteUpdated,image:forceVisuals[f.id]})),
 {id:'kim-yong-bok',kind:'person',title:'김용복 · Donkey 3의 기록',summary:'피난·이동·유격대 지휘 경험을 개인의 인터뷰로 읽습니다.',date:'한국전쟁기 · 인터뷰 사례',updated:siteUpdated,tags:'김용복 Donkey3 Donkey 3 8240 유격대 사람',sourceIds:['guerrillaLife'],sections:[{title:'한 사람의 경험',body:'미 육군 군사사에 실린 김용복의 인터뷰는 황해도에서의 피신, 섬으로의 이동과 Donkey 3 지휘 경험을 담습니다. 지역 주민의 식량·정보 지원도 등장합니다.'},{title:'읽을 때의 기준',body:'인터뷰는 개인과 지역사회의 경험을 이해하는 자료입니다. 기억의 서술과 당시 문서, 후대 연구는 구분해야 합니다. 한 사람의 사례를 모든 대원의 경험이나 전체 전과로 일반화하지 않습니다.'}]},
 ...collections,
 ...sources.map(s=>({id:s.id,kind:'source' as const,title:s.title,summary:s.explains,sections:[{title:'이 자료로 확인하는 내용',body:s.explains},{title:'이 자료만으로 단정하지 않는 내용',body:s.limits},{title:'원문 읽기',body:'아래 기관 원문 링크에서 문서·기사·학술 해설을 직접 확인하세요. 이 페이지는 원문을 통째로 복제한 것이 아니라, 기존 아카이브가 인용한 범위와 한계를 정리한 읽기 안내입니다.'}],sourceIds:[s.id],tags:`${s.org} ${s.type} ${s.id} ${['archive','tlo','guerrilla1','guerrilla2'].includes(s.id)?'KLO 켈로 캘로 8240 유격대':''} ${s.id==='intelligenceLaw'?'정보사 HUMINT 인간정보':''}`,date:s.date,updated:siteUpdated,originalUrl:s.url}))
];
export function entryPath(e:Pick<ArchiveEntry,'kind'|'id'>){return `/archive/${e.kind}/${e.id}`}
export function findEntry(kind:string,id:string){return archiveEntries.find(e=>e.kind===kind&&e.id===id)}
export function normalizeSearch(s:string){return s.normalize('NFKC').toLocaleLowerCase('ko').replace(/[^\p{L}\p{N}]/gu,'')}
export function searchEntries(query:string,kind='all'){
 const selectedKind=parseSearchKind(kind);
 const terms=query.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
 return archiveEntries.filter(e=>(selectedKind==='all'||e.kind===selectedKind)&&terms.every(term=>normalizeSearch(`${e.title} ${e.summary} ${e.tags} ${e.date} ${e.sections.map(s=>s.body).join(' ')}`).includes(term)));
}
export const lastSourceReview=reviewedOn;
