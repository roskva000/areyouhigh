import { CONTENT_SOURCE, loadExperienceRecords } from './content/sources';

export const EXPERIENCE_RECORDS = loadExperienceRecords();

export const EXPERIENCES = EXPERIENCE_RECORDS.map((entry) => ({
  id: entry.metadata.id,
  title: entry.metadata.title,
  desc: entry.metadata.description,
  category: entry.metadata.category,
  bg: entry.visuals.background,
  accent: entry.visuals.accent,
  thumbId: entry.visuals.thumbnail.assetId,
  master: entry.tuningParams.masterGroup,
  params: entry.tuningParams.params,
  ...(entry.visuals.mode ? { mode: entry.visuals.mode } : {}),
}));

export { CONTENT_SOURCE };
