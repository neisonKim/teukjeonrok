import { Shield, Anchor, Compass, Wind, Waves, BookOpen, Search } from 'lucide-react';
import { historySources } from './history-data';
export type Source = { id: string; type: string; title: string; org: string; date: string; url: string; explains: string; limits: string };
const baseSources: Source[] = [
 {id:'swcUniform',type:'사진 참고자료',title:'특전부사관 임관식 · 정복과 베레모 참고',org:'육군 제공 사진 · 파이낸셜뉴스',date:'2022.08.26 · 검토 2026.10.09',url:'https://www.fnnews.com/news/202208261501491742',explains:'기사에 육군 제공으로 표시된 특전부사관 임관식 사진에서 검은 베레모, 짙은 녹색 정복, 밝은 셔츠와 검은 넥타이의 형태를 확인했습니다. 메인 가상 인물 이미지의 시각적 참고자료로 사용했습니다.',limits:'공개 행사 사진을 참고한 AI 재현 이미지입니다. 실제 인물이나 기록사진이 아니며, 휘장의 세부 도안과 전체 복제 규정을 검증한 고증 자료는 아닙니다.'},
 {id:'archive',type:'정부 해설',title:'한국전쟁기 유격부대의 운용',org:'국가기록원',date:'주제 해설 · 열람 2026.10.07',url:'https://www.archives.go.kr/next/newsearch/listSubjectDescription.do?id=008597&pageFlag=&sitePage=1-2-2',explains:'1951년 제8240부대 창설과 유격대 통제체계의 역사적 맥락을 확인하는 자료입니다.',limits:'정부의 후대 해설입니다. 당시 명령서·편성표 원문과는 근거 수준이 다릅니다.'},
 {id:'mpva',type:'공식 발표',title:'2025년 2월의 6·25전쟁영웅 공적자료',org:'국가보훈부',date:'2025년 2월 · 열람 2026.10.07',url:'https://www.mpva.go.kr/mpva/selectBbsNttView.do?bbsNo=83&key=227&nttNo=262689',explains:'미군 제8240부대 유격대에 관한 정부의 공적 소개 자료입니다.',limits:'발표 내용과 원자료를 구분합니다. 전후 재편의 정확한 절차는 협약 원문 확인이 필요합니다.'},
 {id:'law',type:'법령 원문',title:'육군특수전사령부령 제정·개정문',org:'국가법령정보센터',date:'1970.05.15 제정 · 열람 2026.10.07',url:'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=24858&viewCls=lsRvsDocInfoR',explains:'육군에 특수전사령부를 두는 법적 근거와 임무의 문구를 확인할 수 있습니다.',limits:'법령 제정일은 부대의 실제 창설일과 같지 않습니다. 이 두 날짜를 혼동하지 않습니다.'},
 {id:'udt',type:'공식 보도',title:'해군특수전전단의 역사와 공개 임무',org:'국방일보',date:'2021.11.03 · 열람 2026.10.07',url:'https://kookbang.dema.mil.kr/newsWeb/20211103/16/BBSMSTR_000000010021/view.do',explains:'UDT에서 UDT/SEAL로 임무가 확대된 과정과 공개된 특수작전 역할을 설명합니다.',limits:'과거 시점의 공개 보도입니다. 현재 편제 전체를 보여주는 자료가 아닙니다.'},
 {id:'ssu',type:'공식 보도',title:'심해의 극한 넘어 · SSU 종합구조훈련',org:'국방일보',date:'2026.05.15 · 열람 2026.10.07',url:'https://kookbang.dema.mil.kr/newsWeb/20260515/2/ATCE_CTGR_0010040000/view.do',explains:'해난구조전대의 해상 재난 대응과 구조 역할을 확인할 수 있습니다.',limits:'보도된 공개 역할만 다룹니다. 현재 작전 위치나 세부 절차는 제공하지 않습니다.'},
 {id:'cct',type:'공식 보도',title:'비상활주로 이착륙 훈련',org:'국방일보',date:'2026.03.18 · 열람 2026.10.07',url:'https://kookbang.dema.mil.kr/newsWeb/20260318/4/ATCE_CTGR_0010050000/view.do',explains:'항공특수통제사(CCT)의 항공기 유도와 공수 지원 역할을 보여주는 공개 보도입니다.',limits:'CCT는 이 페이지에서 요원·역할 명칭으로 설명합니다. 최신 전체 편제는 별도 확인 대상입니다.'},
 {id:'sart',type:'공식 보도',title:'조난 조종사를 구하는 항공구조사의 탐색구조 훈련',org:'국방일보',date:'2025.05.16 · 열람 2026.10.07',url:'https://kookbang.dema.mil.kr/newsWeb/20250516/3/ATCE_CTGR_0010050000/view.do',explains:'조난 조종사 구조 등 항공구조사의 공개 임무를 소개합니다.',limits:'항공구조사라는 요원 역할을 설명하며, 독립 부대명으로 단정하지 않습니다.'},
 {id:'707',type:'정부 발표',title:'2025 국가 대테러 합동훈련 실시',org:'국무조정실',date:'2025.04.25 · 열람 2026.10.07',url:'https://www.opm.go.kr/opm/news/press-release.do?articleNo=158960&attachNo=147717&mode=download',explains:'707특수임무단과 해군특수전전단의 공개된 대테러 훈련 참여를 확인할 수 있습니다.',limits:'훈련 참여 사실은 모든 임무를 뜻하지 않습니다. 세부 작전 역량을 추정하지 않습니다.'},
];
export const sources:Source[] = [...baseSources.filter(s=>s.id!=='mpva').map(s=>({...s,date:s.date.replace('열람 2026.10.07','검토 2026.10.09')})),...historySources];

export type Force = {id:string;name:string;alias:string;category:string;unit:string;role:string;explain:string;difference:string;source:string;icon:typeof Shield};
export const forces: Force[] = [
 {id:'swc',name:'육군특수전사령부',alias:'특전사 · SWC',category:'특수작전',unit:'지휘 조직 · 육군',role:'육군의 특수작전을 지휘하는 조직',explain:'육군의 특수전을 수행하기 위해 설치된 사령부입니다. 여러 예하 전력의 임무를 지휘하는 틀로 이해하면 쉽습니다.',difference:'특전사는 상위 지휘 조직의 이름입니다. 707과 나란한 같은 크기의 부대라는 뜻이 아닙니다.',source:'law',icon:Shield},
 {id:'707',name:'제707특수임무단',alias:'707 · 특수임무',category:'특수작전',unit:'특수임무 조직 · 육군',role:'공개 자료에서 대테러 훈련을 수행하는 전력',explain:'정부 발표는 707특수임무단을 대테러 합동훈련 참여 조직으로 소개합니다. 여기서는 공개된 특수임무 역할만 설명합니다.',difference:'대테러는 공개된 역할 중 하나입니다. 그 한 가지로 모든 임무를 단정하지 않습니다.',source:'707',icon:Compass},
 {id:'udt',name:'해군특수전전단',alias:'UDT/SEAL',category:'특수작전',unit:'전단 · 해군',role:'바다를 중심으로 특수작전을 수행하는 전력',explain:'수중파괴대에서 출발해 해상 대테러 등을 포함하는 특수작전 역할로 확대된 역사를 공개 자료에서 확인할 수 있습니다.',difference:'UDT/SEAL은 특수작전 역할을 설명하는 익숙한 명칭입니다. SSU와 같은 구조 임무로만 묶지 않습니다.',source:'udt',icon:Anchor},
 {id:'ssu',name:'해난구조전대',alias:'SSU · 해난구조',category:'구조',unit:'전대 · 해군',role:'바다에서 사람을 구조하고 해난사고에 대응하는 전력',explain:'깊은 바다의 잠수 능력을 바탕으로 해난구조와 사고 대응을 수행합니다. 해군특수전전단 예하라는 공개 보도가 있습니다.',difference:'같은 바다에서 활동해도 UDT/SEAL과 임무의 중심이 다릅니다. 구조와 특수작전을 구분해 읽으세요.',source:'ssu',icon:Waves},
 {id:'cct',name:'항공특수통제사',alias:'CCT · 옛 명칭 공정통제사',category:'항공 지원',unit:'요원·역할 명칭 · 공군',role:'항공기가 지상에서 임무를 수행하도록 지원하는 전문요원',explain:'2026년 공개 보도는 CCT의 항공기 유도 역할을 소개합니다. 과거 공정통제사라는 이름으로도 알려져 있습니다.',difference:'조종사를 구조하는 역할과는 다릅니다. 요원 명칭을 사령부와 같은 조직 단계로 비교하지 않습니다.',source:'cct',icon:Wind},
 {id:'sart',name:'항공구조사',alias:'SART · 탐색구조',category:'구조',unit:'요원·역할 명칭 · 공군',role:'조난한 조종사 등의 탐색과 구조를 맡는 전문요원',explain:'공개된 탐색구조 훈련 보도에서 항공구조사의 역할을 확인할 수 있습니다. 위험한 환경의 인명 구조에 초점을 둡니다.',difference:'항공구조사는 이 사이트에서 요원 역할로 소개합니다. CCT의 항공 지원 역할과 구분합니다.',source:'sart',icon:BookOpen},
 {id:'intel-land',name:'정보사 · 육상',alias:'국군정보사령부 · 육상 환경',category:'정보수집',unit:'군 정보기관 · 환경별 소개',role:'사람·지리공간 등 군사정보를 확보해 판단을 돕는 역할',explain:'국군정보사령부는 군사정보의 수집·지원·연구와 대정보 업무를 수행하는 군 정보기관입니다. 이 카드는 그 역할을 육상 환경의 맥락으로 소개합니다. 사복을 입은 인물은 첩보원의 분위기를 표현한 가상 이미지이며, 실제 요원의 복장이나 수집 방법을 재현한 자료가 아닙니다.',difference:'육상·해상은 독자가 이해하기 위한 환경별 구분입니다. 현행 편제상의 독립 부대명이나 공식 임무 구분을 뜻하지 않습니다. 특전사와 같은 지휘 조직으로 묶지 않고 정보수집이라는 목적을 먼저 읽으세요.',source:'intelligenceLaw',icon:Search},
 {id:'intel-sea',name:'정보사 · 해상',alias:'국군정보사령부 · 해상 환경',category:'정보수집',unit:'군 정보기관 · 환경별 소개',role:'해상 환경을 이해하는 군사정보로 판단을 돕는 역할',explain:'공개 법령의 정보사령부 임무를 해상 환경의 맥락에서 이해하는 카드입니다. 국군정보사령부의 형성에는 각 군 정보부대의 통합이라는 역사가 있습니다. 항구의 사복 인물은 역할의 분위기를 전달하는 가상 장면이며, 실제 해상 정보요원이나 임무 현장을 보여주는 기록사진은 아닙니다.',difference:'바다라는 같은 환경을 배경으로 하더라도, UDT/SEAL의 특수작전이나 SSU의 해난구조와 정보수집의 목적은 구분해 읽습니다. 이 카드가 별도 해군 부대의 공식 명칭이나 현재 편제를 뜻하는 것은 아닙니다.',source:'intelligenceHistory',icon:Anchor},
];
export type ForceVisual = {src:string;alt:string;caption:string;position:string;width?:number;height?:number;reference?:boolean};
export const forceVisuals:Record<string,ForceVisual>={
 swc:{src:'/assets/forces/swc-reference-reconstruction.webp',alt:'제공된 첫 번째 사진의 위장복과 검은 헬멧을 참고해 도시 훈련시설 계단에 배치한 가상의 대원 두 명',caption:'도시 훈련 · 사진 참고',position:'50% top',width:1586,height:992,reference:true},
 '707':{src:'/assets/forces/707-reconstruction.webp',alt:'콘크리트 훈련시설에서 보호 장비를 착용한 가상의 특수임무 대원들',caption:'도시형 특수임무 훈련',position:'50% 40%'},
 udt:{src:'/assets/forces/udt-reference-reconstruction.webp',alt:'제공된 두 번째 사진의 위장복과 헬멧을 참고해 선박 갑판과 바다를 배경으로 배치한 가상의 해상 전문요원',caption:'선박 갑판 · 사진 참고',position:'50% top',width:1586,height:992,reference:true},
 ssu:{src:'/assets/forces/ssu-reconstruction.webp',alt:'항만에서 잠수 장비를 준비하는 가상의 해난구조 대원들',caption:'잠수·해난구조',position:'50% 45%'},
 cct:{src:'/assets/forces/cct-reconstruction.webp',alt:'수송기와 활주로 주변에서 항공 지원 훈련 중인 가상의 지상 전문요원',caption:'항공기 지상 지원',position:'50% 45%'},
 sart:{src:'/assets/forces/sart-reconstruction.webp',alt:'구조 헬기 옆에서 들것을 다루는 가상의 항공구조 요원들',caption:'헬기 탐색구조',position:'50% 45%'},
 'intel-land':{src:'/assets/forces/intelligence-land-concept.webp',alt:'비 내리는 도시에서 사복 차림으로 서 있는 가상의 한국인 첩보원',caption:'육상 정보수집 · 가상 장면',position:'50% 42%'},
 'intel-sea':{src:'/assets/forces/intelligence-sea-concept.webp',alt:'항구와 선박을 배경으로 사복 차림으로 서 있는 가상의 한국인 첩보원',caption:'해상 정보수집 · 가상 장면',position:'50% 42%'},
};
