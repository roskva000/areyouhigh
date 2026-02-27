const fs = require('fs');
const path = require('path');

try {
    const experiencesPath = path.join(process.cwd(), 'src/data/experiences.js');
    console.log(`Reading from: ${experiencesPath}`);
    const content = fs.readFileSync(experiencesPath, 'utf8');

    const experienceIds = [];
    const masterIds = new Set();

    // Simpler regex for ID
    const idRegex = /id:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        experienceIds.push(match[1]);
    }

    // Simpler regex for master
    const masterRegex = /master:\s*['"]([^'"]+)['"]/g;
    while ((match = masterRegex.exec(content)) !== null) {
        masterIds.add(match[1]);
    }

    const routes = [
        '/',
        '/gallery',
        ...Array.from(masterIds).map(id => `/gallery/${id}`),
        ...experienceIds.map(id => `/experience/${id}`)
    ];

    const outputPath = path.join(process.cwd(), 'scripts/routes.json');
    fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
    console.log(`Successfully generated ${routes.length} routes at ${outputPath}`);
} catch (err) {
    console.error('Error generating routes:', err);
    process.exit(1);
}
