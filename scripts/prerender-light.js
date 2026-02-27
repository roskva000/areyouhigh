const fs = require('fs');
const path = require('path');

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const EXPERIENCES_PATH = path.join(__dirname, '../src/data/experiences.js');

async function run() {
    console.log('--- Starting Light Prerender ---');

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

    console.log(`Found ${experiences.length} experiences to prerender.`);

    for (const exp of experiences) {
        const route = `experience/${exp.id}`;
        const dir = path.join(DIST_DIR, route);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const title = `${exp.title} — uHigh?`;
        const description = exp.desc;
        const url = `https://uhigh.xyz/experience/${exp.id}`;
        const image = `https://uhigh.xyz/og-image.jpg`; // Fallback image

        // Replace basic meta tags in the template
        let html = template
            .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
            .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
            // OpenGraph
            .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
            .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
            .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
            .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`)
            // Twitter
            .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
            .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    }

    console.log('--- Light Prerender Complete ---');
}

run().catch(console.error);
