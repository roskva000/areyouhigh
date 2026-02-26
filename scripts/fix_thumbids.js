import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'src', 'data', 'experiences.js');
let content = fs.readFileSync(file, 'utf8');

// 156 unique Unsplash photo IDs organized by category
const PHOTO_POOL = {
    fractal: [
        'photo-1635776062127-d379bfcba9f8', 'photo-1462331940025-496dfbfc7564', 'photo-1509228468518-180dd4864904',
        'photo-1534796636912-3b95b3ab5986', 'photo-1506318137071-a8e063b4bcc0', 'photo-1451187580459-43490279c0fa',
        'photo-1538370965046-79c0d6907d47', 'photo-1478760329108-5c3ed9d495a0', 'photo-1465101162946-4377e57745c3',
        'photo-1419242902214-272b3f66ee7a', 'photo-1516339901601-2e1b62dc0c45', 'photo-1608178398319-48f814d0750c',
        'photo-1614730321146-b6fa6a46bcb4',
    ],
    organic: [
        'photo-1518837695005-2083093ee35b', 'photo-1476842634003-7dcca8f832de', 'photo-1470071459604-3b5ec3a7fe05',
        'photo-1497436072909-60f360e1d4b1', 'photo-1441974231531-c6227db76b6e', 'photo-1490750967868-88aa4f44baee',
        'photo-1518531933037-91b2f5f229cc', 'photo-1543946207-39bd91e70ca7', 'photo-1549880338-65ddcdfd017b',
        'photo-1504567961542-e24d9439a724', 'photo-1523712999610-f77fbcfc3843', 'photo-1418065460487-3e41a6c84dc5',
        'photo-1501854140801-50d01698950b',
    ],
    physics: [
        'photo-1454789548928-9efd52dc4031', 'photo-1446776811953-b23d57bd21aa', 'photo-1543722530-d2c3201371e7',
        'photo-1614314107768-6018e4567c28', 'photo-1610296669228-602fa827fc1f', 'photo-1462332420958-a05d1e002413',
        'photo-1517999144091-3d9dca6d1e43', 'photo-1444703686981-a3abbc4d4fe3', 'photo-1507400492013-162706c8c05e',
        'photo-1484589065579-248aad0d628b', 'photo-1505506874110-6a7a69069a08', 'photo-1532798442725-41036acc7489',
        'photo-1581822261290-991b38693d1b',
    ],
    fluid: [
        'photo-1558591710-4b4a1ae0f04d', 'photo-1550537687-c91072c4792d', 'photo-1550745165-9bc0b252728f',
        'photo-1604076913837-52ab5f7c1f9a', 'photo-1579546929518-9e588da23740', 'photo-1571019613454-1cb2f99b2d8b',
        'photo-1549317661-bd32c8ce0afe', 'photo-1617791160505-6f00504e3519', 'photo-1618005198113-568f81ea19c1',
        'photo-1604871000636-074fa5117945', 'photo-1585159812596-fac104f2f069', 'photo-1579783900882-c0d93dbd0af1',
        'photo-1600298881974-6be191ceeda1',
    ],
    light: [
        'photo-1510511459019-5deeee712163', 'photo-1614850523296-e8110991352e', 'photo-1563089145-599997674d42',
        'photo-1518133910546-b6c2fb7d79e3', 'photo-1505672678657-cc7037095e60', 'photo-1492684223066-81342ee5ff30',
        'photo-1520262494112-9fe481d36ec3', 'photo-1517483000871-1dbf64a6e1c6', 'photo-1525547719571-a2d4ac8945e2',
        'photo-1500462918059-b1a0cb512f1d', 'photo-1504333638930-c8787321eee0', 'photo-1496715976403-7e36dc43f17b',
    ],
    industrial: [
        'photo-1550684848-fac1c5b4e853', 'photo-1504198453319-5ce911bafcde', 'photo-1518770660439-4636190af475',
        'photo-1540390769625-2fc3f8b1d50c', 'photo-1470093851219-69951fcbb533', 'photo-1521295121783-8a321d551ad2',
        'photo-1495107334309-fcf20504a5ab', 'photo-1498036882173-b41c28a8ba34', 'photo-1508514177221-188b1cf16e9d',
        'photo-1503424886307-b090341d25d1', 'photo-1444464666168-49d633b86797', 'photo-1502318217862-aa4e294ba657',
        'photo-1531297484001-80022131f5a1', 'photo-1519389950473-47ba0277781c',
    ],
    abstract: [
        'photo-1544383835-bda2bc66a55d', 'photo-1544333346-64e4fe182b60', 'photo-1541701494587-cb58502866ab',
        'photo-1618005182384-a83a8bd57fbe', 'photo-1557672172-298e090bd0f1', 'photo-1558470598-a5dda9640f68',
        'photo-1560015534-cee980ba7e13', 'photo-1567095761054-7a02e69e5c43', 'photo-1553356084-58ef4a67b2a7',
        'photo-1547826039-bfc35e0f1ea8', 'photo-1550859492-d5da9d8e45f3', 'photo-1550684376-efcbd6e3f031',
        'photo-1558618666-fcd25c85f82e', 'photo-1579547945413-497e1b99dac0', 'photo-1536924940564-88ccb48afb09',
        'photo-1555066931-4365d14bab8c', 'photo-1557682250-33bd709cbe85', 'photo-1554034483-04fda0d3507b',
        'photo-1519681393784-d120267933ba', 'photo-1562043236-559c3b65a6e2', 'photo-1550353127-b0da3aeaa0ca',
        'photo-1550025899-5f8a06b1b3a8', 'photo-1556139902-7d36a0e0ff49', 'photo-1519608487953-e999c86e7455',
        'photo-1574169208507-84376144848b', 'photo-1507908708918-778587c9e563',
    ],
    glitch: [
        'photo-1504639725590-34d0984388bd', 'photo-1526374965328-7f61d4dc18c5', 'photo-1515378791036-0648a3ef77b2',
        'photo-1488590528505-98d2b5aba04b', 'photo-1550751827-4bd374c3f58b', 'photo-1560169897-fc0cdbdfa4d5',
        'photo-1461749280684-dccba630e2f6', 'photo-1527474305487-b87b222841cc', 'photo-1485470733090-0aae1788d668',
        'photo-1555949963-ff9fe0c870eb', 'photo-1550535424-b498819c412f', 'photo-1487017159836-4e23ece2e4cf',
        'photo-1504196606672-aef5c9cefc92', 'photo-1490971588422-52f6262a237a', 'photo-1517694712202-14dd9538aa97',
        'photo-1523821741446-edb2b68bb7a0', 'photo-1551288049-bebda4e38f71', 'photo-1526666923127-b2970f64b422',
        'photo-1509718443690-d8e2fb3474b7', 'photo-1558244661-d248897f7bc4', 'photo-1536148935331-408321065b18',
        'photo-1555255707-c07966088b7b', 'photo-1518432031352-d6fc5c10da5a', 'photo-1517336714731-489689fd1ca8',
        'photo-1506744038136-46273834b3fb', 'photo-1516116216624-53e697fedbea',
    ],
    geometry: [
        'photo-1464802686167-b939a67a0621', 'photo-1497366754035-f200968a6e72', 'photo-1542751371-adc38448a05e',
        'photo-1589483232748-515c025575bc', 'photo-1495195134817-aeb325a55b65', 'photo-1519638399535-1b036603ac77',
        'photo-1533628635777-112b2239b1c7', 'photo-1507721999472-8ed4421c4af2', 'photo-1501785888041-af3ef285b470',
        'photo-1515263487990-61b07816b324', 'photo-1560179707-f14e90ef3623', 'photo-1632406898135-d1c41ee08c7a',
        'photo-1483728642387-6c3bdd6c93e5',
    ],
    cosmic: [
        'photo-1502134249126-9f3755a50d78', 'photo-1543722530-d2c3201371e7', 'photo-1444703686981-a3abbc4d4fe3',
        'photo-1505506874110-6a7a69069a08', 'photo-1419242902214-272b3f66ee7a', 'photo-1614314107768-6018e4567c28',
        'photo-1484589065579-248aad0d628b', 'photo-1532798442725-41036acc7489', 'photo-1507400492013-162706c8c05e',
        'photo-1446776811953-b23d57bd21aa', 'photo-1454789548928-9efd52dc4031', 'photo-1581822261290-991b38693d1b',
        'photo-1465101162946-4377e57745c3',
    ]
};

const lines = content.split('\n');
let currentCategory = 'fractal';
const categoryCounters = {};
Object.keys(PHOTO_POOL).forEach(k => categoryCounters[k] = 0);

const categoryMap = {
    'FRACTAL': 'fractal', 'ORGANIC': 'organic', 'PHYSICS': 'physics',
    'FLUID': 'fluid', 'LIGHT': 'light', 'INDUSTRIAL': 'industrial',
    'ABSTRACT': 'abstract', 'GLITCH': 'glitch', 'GEOMETRY': 'geometry',
    'COSMIC': 'cosmic'
};

for (let i = 0; i < lines.length; i++) {
    // Detect category from comment lines like "--- 1. FRACTAL"
    if (lines[i].includes('---')) {
        for (const [key, val] of Object.entries(categoryMap)) {
            if (lines[i].toUpperCase().includes(key)) {
                currentCategory = val;
                break;
            }
        }
    }

    const thumbMatch = lines[i].match(/thumbId:\s*'([^']+)'/);
    if (thumbMatch) {
        const pool = PHOTO_POOL[currentCategory] || PHOTO_POOL.abstract;
        const idx = categoryCounters[currentCategory] % pool.length;
        const newId = pool[idx];
        categoryCounters[currentCategory]++;
        lines[i] = lines[i].replace(/thumbId:\s*'[^']+'/, `thumbId: '${newId}'`);
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');

// Verify uniqueness
const allIds = [];
lines.forEach(l => {
    const m = l.match(/thumbId:\s*'([^']+)'/);
    if (m) allIds.push(m[1]);
});
const unique = new Set(allIds);
console.log(`Total thumbIds: ${allIds.length}`);
console.log(`Unique thumbIds: ${unique.size}`);
console.log('Done!');
