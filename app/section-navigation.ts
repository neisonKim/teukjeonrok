export const sectionIds=['start','history','klo','forces','records','method'] as const;
export type SectionId=typeof sectionIds[number];
export type SectionNavigation={section:SectionId|null;anchor:string};
export function resolveSectionNavigation(hash:string):SectionNavigation|null{
 let id:string;try{id=decodeURIComponent(hash.replace(/^#/,''))}catch{return null}
 if(id==='top'||id==='')return {section:null,anchor:'#top'};
 if(id==='intelligence')return {section:'forces',anchor:'#intelligence'};
 return sectionIds.includes(id as SectionId)?{section:id as SectionId,anchor:`#${id}`} : null;
}
export function sectionScrollTop(targetTop:number,currentScroll:number,headerHeight:number){
 return Math.max(0,targetTop+currentScroll-headerHeight);
}
