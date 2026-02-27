const fs = require('fs');
const path = require('path');

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const EXPERIENCES_PATH = path.join(__dirname, '../src/data/experiences.js');

async function run() {
    console.log('--- Starting Ultra-Light Prerender ---');

    if (!fs.existsSync(INDEX_PATH)) {
        console.error('Error: dist/index.html not found. Run "npm run build" first.');
        process.exit(1);
    }

    const template = fs.readFileSync(INDEX_PATH, 'utf8');
    const experiencesContent = fs.readFileSync(EXPERIENCES_PATH, 'utf8');

    // Simple parser for ID, Title, and Description
    const experiences = [];
    const expRegex = /id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*desc:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = expRegex.exec(experiencesContent)) !== null) {
        experiences.push({ id: match[1], title: match[2], desc: match[3] });
    }

    // Extract Master IDs for Gallery collections
    const masterIds = new Set();
    const masterRegex = /master:\s*['"]([^'"]+)['"]/g;
    while ((match = masterRegex.exec(experiencesContent)) !== null) {
        masterIds.add(match[1]);
    }

    console.log(`Prerendering ${experiences.length} experiences and ${masterIds.size} master collections.`);

    // 1. Prerender Experiences
    for (const exp of experiences) {
        savePage(`experience/${exp.id}`, {
            title: `${exp.title} — uHigh?`,
            description: exp.desc,
            url: `https://uhigh.xyz/experience/${exp.id}`
        });
    }

    // 2. Prerender Master Collections
    for (const masterId of masterIds) {
        const formattedId = masterId.charAt(0).toUpperCase() + masterId.slice(1);
        savePage(`gallery/${masterId}`, {
            title: `${formattedId} Collection — uHigh?`,
            description: `Explore the ${formattedId} collection of interactive visual experiences.`,
            url: `https://uhigh.xyz/gallery/${masterId}`
        });
    }

    // 3. Prerender Gallery
    savePage('gallery', {
        title: 'Gallery — uHigh?',
        description: 'The complete collection of visual portals and interactive shader experiences.',
        url: 'https://uhigh.xyz/gallery'
    });

    console.log('--- Ultra-Light Prerender Complete ---');

    function savePage(route, meta) {
        const dir = path.join(DIST_DIR, route);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const image = `https://uhigh.xyz/og-image.jpg`; // Fallback

        let html = template
            .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
            .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${meta.description}" />`)
            .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${meta.title}" />`)
            .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${meta.description}" />`)
            .replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${meta.url}" />`)
            .replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${image}" />`)
            .replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${meta.title}" />`)
            .replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${meta.description}" />`)
            .replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${image}" />`);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
}

run().catch(console.error);
