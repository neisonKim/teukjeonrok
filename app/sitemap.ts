import type { MetadataRoute } from 'next';
import { archiveEntries,entryPath,siteUrl } from './archive-index';
import { siteUpdated } from './revision-data';
export default function sitemap():MetadataRoute.Sitemap{return [{url:siteUrl,lastModified:siteUpdated,changeFrequency:'weekly',priority:1},{url:siteUrl+'/privacy',lastModified:siteUpdated,priority:0.2},...archiveEntries.map(e=>({url:siteUrl+entryPath(e),lastModified:e.updated,changeFrequency:'monthly' as const,priority:e.kind==='source'?0.5:0.7}))]}
