import experiences from '../src/data/content/experiences.schema.json' with { type: 'json' };

const MASTER_GROUP_PREFIXES = new Set(['special', 'fractal', 'organic', 'geometry', 'physics', 'cosmic', 'fluid', 'light', 'industrial', 'abstract', 'glitch']);
const idSet = new Set();
const errors = [];

function pushError(index, message) {
  errors.push(`[#${index}] ${message}`);
}

experiences.forEach((entry, index) => {
  if (!entry?.metadata || !entry?.visuals || !entry?.tuningParams) {
    pushError(index, 'missing required schema sections (metadata, visuals, tuningParams)');
    return;
  }

  const { metadata, visuals, tuningParams } = entry;
  const id = metadata.id;

  if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    pushError(index, `invalid id "${id}"`);
  }

  if (idSet.has(id)) {
    pushError(index, `duplicate id "${id}"`);
  }
  idSet.add(id);

  const master = tuningParams.masterGroup;
  if (!master || !master.includes('_')) {
    pushError(index, `invalid master group "${master}"`);
  } else {
    const prefix = master.split('_')[0];
    if (!MASTER_GROUP_PREFIXES.has(prefix)) {
      pushError(index, `unknown master group prefix "${prefix}" in "${master}"`);
    }
  }

  const thumbnailId = visuals?.thumbnail?.assetId;
  if (!thumbnailId || !/^photo-[a-zA-Z0-9-]+$/.test(thumbnailId)) {
    pushError(index, `invalid thumbnail asset id "${thumbnailId}"`);
  }

  const params = tuningParams.params;
  if (!params || typeof params !== 'object' || Array.isArray(params) || Object.keys(params).length === 0) {
    pushError(index, 'params must be a non-empty object');
  } else {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
        pushError(index, `param "${key}" must be a finite number`);
      }
    });
  }
});

if (errors.length > 0) {
  console.error('❌ Experience schema validation failed:');
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

console.log(`✅ Experience schema validation passed (${experiences.length} entries).`);
