import { loadJsonContent } from './jsonSource';
import { loadDbContent } from './dbSource';
import { loadCmsContent } from './cmsSource';

const CONTENT_SOURCE = import.meta.env.VITE_EXPERIENCE_SOURCE || 'json';

const SOURCE_LOADERS = {
  json: loadJsonContent,
  db: loadDbContent,
  cms: loadCmsContent,
};

export function loadExperienceRecords() {
  const loader = SOURCE_LOADERS[CONTENT_SOURCE] || SOURCE_LOADERS.json;
  return loader();
}

export { CONTENT_SOURCE };
