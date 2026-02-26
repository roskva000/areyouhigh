export const EXPERIENCES = [
    // --- 1. FRACTAL & MATHEMATICAL ABYSS ---
    {
        id: 'abyss',
        title: 'The Abyss',
        desc: 'Ever-deepening Mandelbrot set. Crystal complexity of mathematical beauty.',
        bg: '#050505', accent: '#00f2fe', category: 'Fractal', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'fractal_mandelbrot', params: { detail: 1.0, scale: 0.5, flow: 0.1 }
    },
    {
        id: 'mandelbulb',
        title: '3D Mandelbulb',
        desc: 'Eternal geometry with spikes and dark depths. A recursive cosmic object.',
        bg: '#0a0a0a', accent: '#7b61ff', category: 'Fractal', thumbId: 'photo-1635776062127-d379bfcba9f8',
        master: 'fractal_mandelbrot', params: { detail: 1.5, scale: 1.2, flow: 0.2 }
    },
    {
        id: 'julia-set',
        title: 'Julia Set',
        desc: 'Asymmetric shapes that melt and morph as you orbit around them.',
        bg: '#050005', accent: '#ff00ff', category: 'Fractal', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'fractal_julia', params: { detail: 0.8, scale: 2.0, flow: 0.3 }
    },
    {
        id: 'menger-sponge',
        title: 'Menger Sponge',
        desc: 'Claustrophobic infinite cube structure made of hollow squares.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Fractal', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'fractal_sierpinski', params: { detail: 2.0, scale: 1.0, flow: 0.05 }
    },
    {
        id: 'sierpinski',
        title: 'Sierpinski Sea',
        desc: 'Continuously fracturing neon triangles floating in the void.',
        bg: '#00050a', accent: '#00ccff', category: 'Fractal', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'fractal_sierpinski', params: { detail: 1.2, scale: 0.8, flow: 0.15 }
    },
    {
        id: 'apollonian',
        title: 'Apollonian Gasket',
        desc: 'Infinite descent into ever-shrinking nested circles.',
        bg: '#000000', accent: '#ffcc00', category: 'Fractal', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'fractal_julia', params: { detail: 1.8, scale: 3.0, flow: 0.1 }
    },
    {
        id: 'warped-torus',
        title: 'Warped Torus',
        desc: 'Spirals that spin and swell as if they were breathing.',
        bg: '#080508', accent: '#ff0066', category: 'Fractal', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'fractal_julia', params: { detail: 1.0, scale: 1.5, flow: 0.4 }
    },
    {
        id: 'hyperbolic',
        title: 'Hyperbolic Honeycomb',
        desc: 'Geometric hexagons that stretch and elongate in warped space.',
        bg: '#050a05', accent: '#00ffaa', category: 'Fractal', thumbId: 'photo-1509228468518-180dd4864904',
        master: 'fractal_sierpinski', params: { detail: 1.4, scale: 1.1, flow: 0.08 }
    },
    {
        id: 'wireframe-grid',
        title: 'Contracting Wireframes',
        desc: 'Metallic grids that respond to movement with rhythmic contractions.',
        bg: '#000000', accent: '#666666', category: 'Fractal', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'fractal_ifs', params: { detail: 0.5, scale: 1.0, flow: 0.5 }
    },
    {
        id: 'fractal-flames',
        title: 'Fractal Flames',
        desc: 'Abstract, hazy waterfalls of mathematical light dancing in darkness.',
        bg: '#050505', accent: '#f5576c', category: 'Fractal', thumbId: 'photo-1534796636912-3b95b3ab5986',
        master: 'fractal_ifs', params: { detail: 2.5, scale: 0.4, flow: 0.25 }
    },
    {
        id: 'tesseract',
        title: '4D Tesseract',
        desc: 'Cubes constantly folding outward from within themselves.',
        bg: '#0a0a14', accent: '#4facfe', category: 'Fractal', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'fractal_ifs', params: { detail: 1.1, scale: 1.3, flow: 0.12 }
    },
    {
        id: 'menger-tunnel',
        title: 'Menger Tunnel',
        desc: 'An infinite gateway of cubic fractals in a dark corridor.',
        bg: '#050505', accent: '#999999', category: 'Fractal', thumbId: 'photo-1478760329108-5c3ed9d495a0',
        master: 'fractal_mandelbrot', params: { detail: 2.2, scale: 0.9, flow: 0.07 }
    },
    {
        id: 'burning-ship',
        title: 'Burning Ship',
        desc: 'Chaotic and sharp-edged fractal coastlines with intense depth.',
        bg: '#100500', accent: '#ff9900', category: 'Fractal', thumbId: 'photo-1538370965046-79c0d6907d47',
        master: 'fractal_mandelbrot', params: { detail: 1.6, scale: 1.8, flow: 0.18 }
    },

    // --- 2. ORGANIC & BIOMECHANICAL TEXTURES ---
    {
        id: 'giger-pipes',
        title: 'Giger Pipes',
        desc: 'Metallic, pulsing, alien ship-like veins that throb with life.',
        bg: '#0a0a0a', accent: '#555555', category: 'Organic', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'organic_fbm', params: { density: 1.2, warp: 0.5, pulse: 0.3 }
    },
    {
        id: 'liquid-chrome',
        title: 'Liquid Chrome',
        desc: 'Pulsing mercury pool, terminator-style, constantly smoothing itself out.',
        bg: '#050505', accent: '#cccccc', category: 'Organic', thumbId: 'photo-1614850523296-e8110991352e',
        master: 'organic_chrome', params: { density: 0.5, warp: 2.0, pulse: 0.1 }
    },
    {
        id: 'reaction-diffusion',
        title: 'Reaction-Diffusion',
        desc: 'Zebra-like or brain-fold textures that consume themselves over time.',
        bg: '#101010', accent: '#ffffff', category: 'Organic', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'organic_reaction', params: { density: 2.0, warp: 0.8, pulse: 0.05 }
    },
    {
        id: 'voronoi-cells',
        title: 'Voronoi Cells',
        desc: 'Neon bubbles constantly dividing and merging under the digital skin.',
        bg: '#050805', accent: '#00ff00', category: 'Organic', thumbId: 'photo-1614850523296-e8110991352e',
        master: 'organic_voronoi', params: { density: 1.5, warp: 0.3, pulse: 0.4 }
    },
    {
        id: 'flesh-surfaces',
        title: 'Flesh Surfaces',
        desc: 'Abstract dark red and purple tones, swelling like a digital heartbeat.',
        bg: '#150505', accent: '#ff0033', category: 'Organic', thumbId: 'photo-1530982011887-3cc11bb8c273',
        master: 'organic_fbm', params: { density: 0.8, warp: 1.2, pulse: 0.6 }
    },
    {
        id: 'neon-infestation',
        title: 'Neon Infestation',
        desc: 'Luminous glowing arms growing from the edges towards the center.',
        bg: '#050005', accent: '#cc00ff', category: 'Organic', thumbId: 'photo-1518133910546-b6c2fb7d79e3',
        master: 'organic_reaction', params: { density: 1.8, warp: 0.6, pulse: 0.35 }
    },
    {
        id: 'neural-synapse',
        title: 'Neural Synapse',
        desc: 'Chained electrical currents glowing in the dark cosmic void.',
        bg: '#000000', accent: '#00ffff', category: 'Organic', thumbId: 'photo-1451187580459-43490279c0fa',
        master: 'organic_reaction', params: { density: 3.0, warp: 0.1, pulse: 0.7 }
    },
    {
        id: 'lava-lamp',
        title: 'Lava Lamp',
        desc: 'Massive black drops merging and splitting in zero gravity.',
        bg: '#050000', accent: '#ff3300', category: 'Organic', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'organic_chrome', params: { density: 0.4, warp: 3.0, pulse: 0.2 }
    },
    {
        id: 'under-skin',
        title: 'Under Skin',
        desc: 'Movements sliding under the surface, reflecting only light outward.',
        bg: '#0a0505', accent: '#ff6666', category: 'Organic', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'organic_fbm', params: { density: 0.7, warp: 0.9, pulse: 0.15 }
    },
    {
        id: 'micro-forest',
        title: 'Micro Forest',
        desc: 'Fractal mushroom structures growing in hyper-lapse motion.',
        bg: '#050a05', accent: '#33ff33', category: 'Organic', thumbId: 'photo-1544333346-64e4fe182b60',
        master: 'organic_fbm', params: { density: 2.5, warp: 0.4, pulse: 0.05 }
    },
    {
        id: 'crystal-growth',
        title: 'Crystal Growth',
        desc: 'Procedurally growing salt and mineral formations across the screen.',
        bg: '#050a0a', accent: '#00ffcc', category: 'Organic', thumbId: 'photo-1512168221867-04a545abbbc7',
        master: 'organic_voronoi', params: { density: 1.4, warp: 1.5, pulse: 0.1 }
    },
    {
        id: 'bio-luminescence',
        title: 'Bio-Luminescence',
        desc: 'Glowing fungal networks and the energy of a dark digital forest.',
        bg: '#051005', accent: '#00ffaa', category: 'Organic', thumbId: 'photo-1544333346-64e4fe182b60',
        master: 'organic_voronoi', params: { density: 1.6, warp: 0.2, pulse: 0.45 }
    },
    {
        id: 'metabolic-flow',
        title: 'Metabolic Flow',
        desc: 'Visualization of biological energy flow and cellular rhythm.',
        bg: '#0a050a', accent: '#ff00ff', category: 'Organic', thumbId: 'photo-1550684847-75bdda21cc95',
        master: 'organic_chrome', params: { density: 1.1, warp: 1.8, pulse: 0.3 }
    },

    // --- 3. SPACE-TIME WARPS & PHYSICS ---
    {
        id: 'black-hole',
        title: 'Event Horizon',
        desc: 'Gravitational center where light and color bend like spaghetti. Pure intensity.',
        bg: '#000000', accent: '#ff6600', category: 'Physics', thumbId: 'photo-1506318137071-a8e063b4bcc0',
        master: 'physics_blackhole', params: { gravity: 2.0, speed: 0.5, bending: 1.5 }
    },
    {
        id: 'wormhole',
        title: 'Wormhole Path',
        desc: 'A high-speed jump where pixels transform into long streaks of light.',
        bg: '#000005', accent: '#0066ff', category: 'Physics', thumbId: 'photo-1534796636912-3b95b3ab5986',
        master: 'physics_wormhole', params: { gravity: 1.0, speed: 2.5, bending: 0.8 }
    },
    {
        id: 'grav-lens',
        title: 'Grav Lens',
        desc: 'Reality bending around an invisible sphere at the center of the void.',
        bg: '#050505', accent: '#ffffff', category: 'Physics', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'physics_spacetime', params: { gravity: 3.0, speed: 0.2, bending: 2.0 }
    },
    {
        id: 'time-slices',
        title: 'Time Slices',
        desc: 'Pixels flowing at different speeds in various strips across the screen.',
        bg: '#0a0a0a', accent: '#ffcc00', category: 'Physics', thumbId: 'photo-1478760329108-5c3ed9d495a0',
        master: 'physics_temporal', params: { gravity: 0.5, speed: 1.2, bending: 0.1 }
    },
    {
        id: 'droste',
        title: 'Droste Effect',
        desc: 'Frame within frame, constantly folding into itself in an infinite loop.',
        bg: '#050505', accent: '#ff00ff', category: 'Physics', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'physics_temporal', params: { gravity: 1.2, speed: 0.4, bending: 3.0 }
    },
    {
        id: 'stretch-grid',
        title: 'Stretching Void',
        desc: 'A dark space grid that stretches and collapses as you move through it.',
        bg: '#000000', accent: '#33ccff', category: 'Physics', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'physics_spacetime', params: { gravity: 0.8, speed: 0.6, bending: 1.2 }
    },
    {
        id: 'quantum-foam',
        title: 'Quantum Foam',
        desc: 'Energy bubbles constantly appearing and disappearing in micro-dimensions.',
        bg: '#0a0a0a', accent: '#ffcc00', category: 'Physics', thumbId: 'photo-1518133910546-b6c2fb7d79e3',
        master: 'physics_spacetime', params: { gravity: 1.5, speed: 1.8, bending: 0.5 }
    },
    {
        id: 'dim-tear',
        title: 'Dimension Tear',
        desc: 'A rift opening in the center, showing fractal glimpses from another world.',
        bg: '#000000', accent: '#ff0000', category: 'Physics', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'physics_spacetime', params: { gravity: 2.5, speed: 0.1, bending: 2.5 }
    },
    {
        id: 'shatter-time',
        title: 'Shatter Time',
        desc: 'Simulation of glass shards constantly exploding and reforming.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Physics', thumbId: 'photo-1550537339-12f13df891c6',
        master: 'physics_temporal', params: { gravity: 0.1, speed: 1.5, bending: 1.5 }
    },
    {
        id: 'doppler',
        title: 'Doppler Shift',
        desc: 'Colors shifting to blue and red based on the perceived speed of flow.',
        bg: '#050505', accent: '#ff0000', category: 'Physics', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'physics_wormhole', params: { gravity: 1.0, speed: 1.0, bending: 0.6 }
    },
    {
        id: 'relativity',
        title: 'Relativity',
        desc: 'The field of view bending as you approach the speed of digital light.',
        bg: '#000000', accent: '#ffffff', category: 'Physics', thumbId: 'photo-1541701494587-cb58502866ab',
        master: 'physics_wormhole', params: { gravity: 1.8, speed: 2.0, bending: 1.4 }
    },
    {
        id: 'gravity-wave',
        title: 'Gravity Wave',
        desc: 'Periodic ripples in the fabric of digital space-time.',
        bg: '#050505', accent: '#00ffcc', category: 'Physics', thumbId: 'photo-1446776811953-b23d57bd21aa',
        master: 'physics_blackhole', params: { gravity: 2.2, speed: 0.3, bending: 1.0 }
    },
    {
        id: 'singularity',
        title: 'Singularity',
        desc: 'Infinite density and chaos concentrated in a single point of light.',
        bg: '#000000', accent: '#ff00ff', category: 'Physics', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'physics_blackhole', params: { gravity: 5.0, speed: 0.1, bending: 4.0 }
    },

    // --- 4. NOISE & FLUID DYNAMICS ---
    {
        id: 'simplex-mount',
        title: 'Simplex Peaks',
        desc: 'Liquid noise mountains that rise and melt continuously.',
        bg: '#050a0a', accent: '#00ccff', category: 'Fluid', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'fluid_plasma', params: { viscosity: 1.0, turbulence: 1.5, swirl: 0.2 }
    },
    {
        id: 'curl-noise',
        title: 'Curl Smoke',
        desc: 'Dense and organic smoke rings that entwine with each other.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Fluid', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'fluid_curl', params: { viscosity: 0.5, turbulence: 2.5, swirl: 0.8 }
    },
    {
        id: 'ferrofluid',
        title: 'Ferrofluid',
        desc: 'Black, spiky liquid movements responding to magnetic fields.',
        bg: '#000000', accent: '#555555', category: 'Fluid', thumbId: 'photo-1618005198113-568f81ea19c1',
        master: 'fluid_ferro', params: { viscosity: 2.0, turbulence: 0.8, swirl: 0.1 }
    },
    {
        id: 'oil-swirl',
        title: 'Oil Swirl',
        desc: 'Thick and smooth liquid pixels that flow in a rotating pattern.',
        bg: '#0a050a', accent: '#cc66ff', category: 'Fluid', thumbId: 'photo-1541701494587-cb58502866ab',
        master: 'fluid_vortex', params: { viscosity: 1.2, turbulence: 0.6, swirl: 1.5 }
    },
    {
        id: 'stokes-flow',
        title: 'Stokes Flow',
        desc: 'Realistic currents that disperse according to your movements.',
        bg: '#000510', accent: '#0066ff', category: 'Fluid', thumbId: 'photo-1518837695005-2083093ee35b',
        master: 'fluid_plasma', params: { viscosity: 1.8, turbulence: 0.3, swirl: 0.5 }
    },
    {
        id: 'boiling-tar',
        title: 'Boiling Tar',
        desc: 'Dull matte bubbles bursting from within a dark dense liquid.',
        bg: '#050505', accent: '#333333', category: 'Fluid', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'fluid_ferro', params: { viscosity: 3.0, turbulence: 1.2, swirl: 0.05 }
    },
    {
        id: 'kinetic-storm',
        title: 'Kinetic Storm',
        desc: 'Millions of points caught in a wind that constantly changes direction.',
        bg: '#12121e', accent: '#f5576c', category: 'Fluid', thumbId: 'photo-1563089145-599997674d42',
        master: 'fluid_plasma', params: { viscosity: 0.1, turbulence: 4.0, swirl: 1.2 }
    },
    {
        id: 'ink-drops',
        title: 'Ink Drops',
        desc: 'Pigments slowly dispersing after being dropped into black water.',
        bg: '#000000', accent: '#00ffaa', category: 'Fluid', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'fluid_curl', params: { viscosity: 0.7, turbulence: 0.5, swirl: 0.3 }
    },
    {
        id: 'vortex-gal',
        title: 'Vortex Galaxy',
        desc: 'Pixels pulled into the center in a dynamic and swirling spiral.',
        bg: '#05000a', accent: '#ff00ff', category: 'Fluid', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'fluid_vortex', params: { viscosity: 1.0, turbulence: 1.0, swirl: 3.0 }
    },
    {
        id: 'mag-lines',
        title: 'Mag Lines',
        desc: 'Invisible glowing strings waving between two magnetic poles.',
        bg: '#000000', accent: '#00f2fe', category: 'Fluid', thumbId: 'photo-1509228468518-180dd4864904',
        master: 'fluid_ferro', params: { viscosity: 0.8, turbulence: 0.4, swirl: 0.6 }
    },
    {
        id: 'plasma-glow',
        title: 'Liquid Plasma',
        desc: 'Neon plasma created using GPU-accelerated fluid dynamics.',
        bg: '#0a0a14', accent: '#7b61ff', category: 'Fluid', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'fluid_plasma', params: { viscosity: 1.4, turbulence: 1.8, swirl: 1.0 }
    },
    {
        id: 'nebula-flow',
        title: 'Nebula Flow',
        desc: 'Fluid simulation of cosmic gases flowing through the void.',
        bg: '#050505', accent: '#ff0080', category: 'Fluid', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'fluid_curl', params: { viscosity: 0.6, turbulence: 2.2, swirl: 0.8 }
    },
    {
        id: 'turbulent-void',
        title: 'Turbulent Void',
        desc: 'Unpredictable currents swirling in the chaotic digital void.',
        bg: '#000000', accent: '#ffffff', category: 'Fluid', thumbId: 'photo-1516239482977-b550ba7253f2',
        master: 'fluid_vortex', params: { viscosity: 1.1, turbulence: 3.0, swirl: 1.4 }
    },

    // --- 5. LIGHT & OPTICAL ILLUSIONS ---
    {
        id: 'light-tunnel',
        title: 'Light Tunnel',
        desc: 'Shattered light particles creating an infinite corridor of glow.',
        bg: '#000000', accent: '#7b61ff', category: 'Light', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'light_prism', params: { intensity: 1.5, refraction: 0.5, speed: 1.2 }
    },
    {
        id: 'prism-refract',
        title: 'Prism Refraction',
        desc: 'Rainbow-colored light breaking through digital glass edges.',
        bg: '#050505', accent: '#ffffff', category: 'Light', thumbId: 'photo-1557683316-973673baf926',
        master: 'light_prism', params: { intensity: 1.0, refraction: 2.0, speed: 0.8 }
    },
    {
        id: 'kaleido-stars',
        title: 'Kaleido Stars',
        desc: 'Constantly reflecting and mirroring star patterns in the void.',
        bg: '#00000a', accent: '#ffcc00', category: 'Light', thumbId: 'photo-1534796636912-3b95b3ab5986',
        master: 'light_mirror', params: { intensity: 0.8, refraction: 1.2, speed: 1.5 }
    },
    {
        id: 'aurora-borealis',
        title: 'Digital Aurora',
        desc: 'Curving curtains of green and purple light waving in the sky.',
        bg: '#050a10', accent: '#00ffaa', category: 'Light', thumbId: 'photo-1531604901849-d6667923fe53',
        master: 'light_mirror', params: { intensity: 1.2, refraction: 0.3, speed: 0.5 }
    },
    {
        id: 'neon-bloom',
        title: 'Neon Bloom',
        desc: 'Intense glowing halos that expand from bright signal points.',
        bg: '#000000', accent: '#ff00ff', category: 'Light', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'light_bloom', params: { intensity: 2.5, refraction: 0.1, speed: 1.0 }
    },
    {
        id: 'god-rays',
        title: 'Vortex Rays',
        desc: 'Beams of light breaking through the darkness from a central source.',
        bg: '#050505', accent: '#00f2fe', category: 'Light', thumbId: 'photo-1506318137071-a8e063b4bcc0',
        master: 'light_rays', params: { intensity: 1.8, refraction: 0.8, speed: 0.4 }
    },
    {
        id: 'lens-flare-sys',
        title: 'Flare System',
        desc: 'Dynamic circles of light reflecting across the digital lens.',
        bg: '#000000', accent: '#ffffff', category: 'Light', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'light_mirror', params: { intensity: 1.0, refraction: 3.0, speed: 0.6 }
    },
    {
        id: 'iridescent',
        title: 'Iridescent Skin',
        desc: 'Surfaces that change color based on the angle of digital light.',
        bg: '#0a0a0a', accent: '#00ffcc', category: 'Light', thumbId: 'photo-1614850523296-e8110991352e',
        master: 'light_prism', params: { intensity: 0.6, refraction: 1.5, speed: 0.2 }
    },
    {
        id: 'volumetric-fog',
        title: 'Volumetric Fog',
        desc: 'Light catching on particles in the dense digital atmosphere.',
        bg: '#050505', accent: '#4facfe', category: 'Light', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'light_rays', params: { intensity: 0.4, refraction: 0.2, speed: 0.3 }
    },
    {
        id: 'strobe-pulse',
        title: 'Strobe Pulse',
        desc: 'High-frequency flashes that reveal the hidden structure of code.',
        bg: '#000000', accent: '#ffffff', category: 'Light', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'light_bloom', params: { intensity: 4.0, refraction: 0.0, speed: 3.0 }
    },
    {
        id: 'glow-trails',
        title: 'Glow Trails',
        desc: 'Long exposures of moving lights leaving permanent marks.',
        bg: '#050005', accent: '#ff0066', category: 'Light', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'light_bloom', params: { intensity: 1.4, refraction: 0.4, speed: 2.0 }
    },
    {
        id: 'mirror-dim',
        title: 'Mirror Dimension',
        desc: 'Perfect reflections creating a deceptive sense of symmetrical depth.',
        bg: '#000000', accent: '#999999', category: 'Light', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'light_mirror', params: { intensity: 0.7, refraction: 1.0, speed: 0.1 }
    },
    {
        id: 'photon-beam',
        title: 'Photon Beam',
        desc: 'A single concentrated ray of information cutting through the void.',
        bg: '#050505', accent: '#00ffaa', category: 'Light', thumbId: 'photo-1551033406-611cf9a28f67',
        master: 'light_rays', params: { intensity: 3.0, refraction: 0.6, speed: 1.8 }
    },
    // --- 6. INDUSTRIAL & BRUTALIST ALGORITHMS ---
    {
        id: 'concrete-vessels',
        title: 'Concrete Vessels',
        desc: 'Heavy, grey, brutalist forms moving in a giant industrial hall.',
        bg: '#1a1a1a', accent: '#e63b2e', category: 'Industrial', thumbId: 'photo-1544333346-64e4fe182b60',
        master: 'industrial_corridor', params: { complexity: 1.2, aging: 0.5, speed: 0.3 }
    },
    {
        id: 'rust-generator',
        title: 'Rust Generator',
        desc: 'Procedural metallic corrosion eating away at the edges of the screen.',
        bg: '#100500', accent: '#cc5833', category: 'Industrial', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'industrial_rust', params: { complexity: 1.5, aging: 2.0, speed: 0.1 }
    },
    {
        id: 'piston-sync',
        title: 'Piston Sync',
        desc: 'Mechanical parts moving in a rhythmic, clashing sequence.',
        bg: '#050505', accent: '#7b61ff', category: 'Industrial', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'industrial_machine', params: { complexity: 2.0, aging: 0.3, speed: 1.5 }
    },
    {
        id: 'wire-harness',
        title: 'Wire Harness',
        desc: 'Complex tangles of cables pulsing with raw data and electricity.',
        bg: '#0a0a0a', accent: '#00ccff', category: 'Industrial', thumbId: 'photo-1563089145-599997674d42',
        master: 'industrial_wire', params: { complexity: 3.0, aging: 0.8, speed: 0.6 }
    },
    {
        id: 'signal-tower',
        title: 'Signal Tower',
        desc: 'A massive structure emitting rhythmic radio waves into the void.',
        bg: '#000000', accent: '#ff0000', category: 'Industrial', thumbId: 'photo-1518133910546-b6c2fb7d79e3',
        master: 'industrial_rust', params: { complexity: 1.0, aging: 0.2, speed: 1.2 }
    },
    {
        id: 'grid-lock',
        title: 'Grid Lock',
        desc: 'Overlapping industrial blueprints being drawn and redrawn.',
        bg: '#050505', accent: '#ffffff', category: 'Industrial', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'industrial_wire', params: { complexity: 2.5, aging: 0.4, speed: 0.8 }
    },
    {
        id: 'mechanical-dna',
        title: 'Mech-DNA',
        desc: 'A rotating mechanical helix of gears and micro-parts.',
        bg: '#0a0a0a', accent: '#555555', category: 'Industrial', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'industrial_machine', params: { complexity: 1.8, aging: 0.6, speed: 0.4 }
    },
    {
        id: 'factory-breath',
        title: 'Factory Breath',
        desc: 'Visual pulses of an automated system operating in the dark.',
        bg: '#050505', accent: '#ffcc00', category: 'Industrial', thumbId: 'photo-1538370965046-79c0d6907d47',
        master: 'industrial_machine', params: { complexity: 0.8, aging: 0.1, speed: 0.5 }
    },
    {
        id: 'cog-matrix',
        title: 'Cog Matrix',
        desc: 'Endless arrays of interlocking gears spinning in perfect sync.',
        bg: '#000000', accent: '#ff6600', category: 'Industrial', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'industrial_machine', params: { complexity: 4.0, aging: 0.3, speed: 1.0 }
    },
    {
        id: 'raw-material',
        title: 'Raw Material',
        desc: 'Macro views of concrete and metal surfaces shifting in the light.',
        bg: '#0a0a0a', accent: '#999999', category: 'Industrial', thumbId: 'photo-1544333346-64e4fe182b60',
        master: 'industrial_corridor', params: { complexity: 0.5, aging: 1.2, speed: 0.2 }
    },
    {
        id: 'data-pipe',
        title: 'Data Pipe',
        desc: 'Transparent tubes carrying glowing packets of information.',
        bg: '#05050a', accent: '#00ffcc', category: 'Industrial', thumbId: 'photo-1451187580459-43490279c0fa',
        master: 'industrial_wire', params: { complexity: 1.4, aging: 0.0, speed: 2.5 }
    },
    {
        id: 'brutalist-sky',
        title: 'Brutalist Sky',
        desc: 'Monolithic slabs floating in a heavy, clouded atmosphere.',
        bg: '#050505', accent: '#e63b2e', category: 'Industrial', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'industrial_corridor', params: { complexity: 1.1, aging: 0.7, speed: 0.2 }
    },
    {
        id: 'circuit-load',
        title: 'Circuit Load',
        desc: 'A motherboard being overstimulated by high-voltage currents.',
        bg: '#000000', accent: '#00ff00', category: 'Industrial', thumbId: 'photo-1518837695005-2083093ee35b',
        master: 'industrial_wire', params: { complexity: 2.2, aging: 0.5, speed: 3.0 }
    },

    // --- 7. ABSTRACT OVERDOSE ---
    {
        id: 'melting-surf',
        title: 'Melting View',
        desc: 'Every object suddenly liquefying and dripping downwards.',
        bg: '#050505', accent: '#ff0033', category: 'Abstract', thumbId: 'photo-1550537339-12f13df891c6',
        master: 'abstract', params: { chaos: 1.0, drift: 0.8, resolution: 0.2 }
    },
    {
        id: 'eye-wall',
        title: 'Eye Wall',
        desc: 'An invasion of flickering abstract and shadowy circles.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1541701494587-cb58502866ab',
        master: 'abstract', params: { chaos: 2.0, drift: 0.5, resolution: 1.0 }
    },
    {
        id: 'kaleido-burst',
        title: 'Kaleido Burst',
        desc: 'A sequence of symmetrically opening shapes.',
        bg: '#050005', accent: '#ff00ff', category: 'Abstract', thumbId: 'photo-1618005198113-568f81ea19c1',
        master: 'abstract', params: { chaos: 1.5, drift: 1.0, resolution: 0.5 }
    },
    {
        id: 'visual-echo',
        title: 'Visual Echo',
        desc: 'Motion trails left by transparent copies.',
        bg: '#000000', accent: '#00ffff', category: 'Abstract', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'abstract', params: { chaos: 0.7, drift: 1.5, resolution: 0.8 }
    },
    {
        id: 'breath-env',
        title: 'Breathing Air',
        desc: 'The sensation of a giant lung expanding and contracting.',
        bg: '#0a0505', accent: '#ff6666', category: 'Abstract', thumbId: 'photo-1523438433331-9f949c2934ec',
        master: 'abstract', params: { chaos: 0.5, drift: 0.3, resolution: 1.2 }
    },
    {
        id: 'geom-diss',
        title: 'Geometric Diss',
        desc: 'Objects breaking apart and scattering into thousands of pyramids.',
        bg: '#050505', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'abstract', params: { chaos: 2.5, drift: 0.7, resolution: 0.4 }
    },
    {
        id: 'perc-noise',
        title: 'Perc Noise',
        desc: 'An extremely fine-detailed television static state.',
        bg: '#0a0a0a', accent: '#666666', category: 'Abstract', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'abstract', params: { chaos: 3.0, drift: 0.1, resolution: 2.0 }
    },
    {
        id: 'imp-obj',
        title: 'Impossible Obj',
        desc: 'Paradoxical structures where beginning and end connect.',
        bg: '#000000', accent: '#ffcc00', category: 'Abstract', thumbId: 'photo-1563089145-599997674d42',
        master: 'abstract', params: { chaos: 1.8, drift: 0.6, resolution: 0.9 }
    },
    {
        id: 'mirror-room',
        title: 'Mirror Room',
        desc: 'Bent surfaces showing reflections of reflections.',
        bg: '#050505', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1511367461989-f85a21fda167',
        master: 'abstract', params: { chaos: 0.9, drift: 0.4, resolution: 1.5 }
    },
    {
        id: 'synesth-flow',
        title: 'Synesth Flow',
        desc: 'An area reacting to sound frequencies with sharp waves.',
        bg: '#000000', accent: '#ff0080', category: 'Abstract', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'abstract', params: { chaos: 1.2, drift: 2.0, resolution: 0.6 }
    },
    {
        id: 'dream-void',
        title: 'Dream Login',
        desc: 'Geometries shifting on a surreal plane.',
        bg: '#0a0a0a', accent: '#00ffff', category: 'Abstract', thumbId: 'photo-1614850523459-c2f4c699c52e',
        master: 'abstract', params: { chaos: 1.7, drift: 1.3, resolution: 0.7 }
    },
    {
        id: 'entropy-field',
        title: 'Entropy Field',
        desc: 'The destruction of digital signals and information.',
        bg: '#050505', accent: '#ff0000', category: 'Abstract', thumbId: 'photo-1605001011156-cbf0b0f67a51',
        master: 'abstract', params: { chaos: 3.5, drift: 0.9, resolution: 0.3 }
    },
    {
        id: 'static-medit',
        title: 'Static Static',
        desc: 'Digital noise and texture meditation.',
        bg: '#0a0a0a', accent: '#666666', category: 'Abstract', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'abstract', params: { chaos: 2.2, drift: 0.2, resolution: 1.8 }
    },
    {
        id: 'color-void',
        title: 'Color Void',
        desc: 'A pure infusion of spectrum colors with no boundaries or shapes.',
        bg: '#000000', accent: '#ff00ff', category: 'Abstract', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'abstract', params: { chaos: 1.5, drift: 0.5, resolution: 0.1 }
    },
    {
        id: 'geometric-chaos',
        title: 'Geometric Chaos',
        desc: 'Triangles and circles colliding in a non-linear digital space.',
        bg: '#050505', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1557683316-973673baf926',
        master: 'abstract', params: { chaos: 2.5, drift: 1.2, resolution: 0.5 }
    },
    {
        id: 'ink-blot-test',
        title: 'Rorschach Digital',
        desc: 'Symmetrical abstract forms that reveal your inner thoughts.',
        bg: '#0a0a0a', accent: '#333333', category: 'Abstract', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'abstract', params: { chaos: 0.8, drift: 0.2, resolution: 2.0 }
    },
    {
        id: 'pixel-rain',
        title: 'Pixel Rain',
        desc: 'Vertical streams of colored information falling into the void.',
        bg: '#000000', accent: '#00ffaa', category: 'Abstract', thumbId: 'photo-1451187580459-43490279c0fa',
        master: 'abstract', params: { chaos: 1.2, drift: 3.0, resolution: 0.8 }
    },
    {
        id: 'abstract-flow',
        title: 'Infinite Flow',
        desc: 'A continuous stream of abstract shapes emerging from the center.',
        bg: '#050a10', accent: '#7b61ff', category: 'Abstract', thumbId: 'photo-1518133910546-b6c2fb7d79e3',
        master: 'abstract', params: { chaos: 1.8, drift: 0.6, resolution: 1.5 }
    },
    {
        id: 'monochrome-trip',
        title: 'Mono Trip',
        desc: 'High contrast black and white patterns that vibrate on the screen.',
        bg: '#000000', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'abstract', params: { chaos: 3.0, drift: 0.1, resolution: 1.0 }
    },
    {
        id: 'vector-field',
        title: 'Vector Field',
        desc: 'Visualization of invisible forces guiding the movement of light.',
        bg: '#050505', accent: '#00ccff', category: 'Abstract', thumbId: 'photo-1509228468518-180dd4864904',
        master: 'abstract', params: { chaos: 0.5, drift: 1.5, resolution: 1.2 }
    },
    {
        id: 'nebula-abstract',
        title: 'Nebula Dream',
        desc: 'Soft gaseous forms drifting in a deep violet digital sky.',
        bg: '#0a0514', accent: '#cc00ff', category: 'Abstract', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'abstract', params: { chaos: 1.0, drift: 0.4, resolution: 0.3 }
    },
    {
        id: 'point-cloud',
        title: 'Point Cloud',
        desc: 'Millions of discrete markers forming temporary structures.',
        bg: '#000000', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'abstract', params: { chaos: 2.2, drift: 0.8, resolution: 4.0 }
    },
    {
        id: 'holographic-noise',
        title: 'Holo Noise',
        desc: 'Rainbow-colored noise static dancing across the surface.',
        bg: '#050505', accent: '#ff00ff', category: 'Abstract', thumbId: 'photo-1614850523296-e8110991352e',
        master: 'abstract', params: { chaos: 4.0, drift: 2.0, resolution: 0.1 }
    },
    {
        id: 'minimalist-pulse',
        title: 'Minimal Pulse',
        desc: 'A single point of light expanding and contracting in the void.',
        bg: '#000000', accent: '#ffffff', category: 'Abstract', thumbId: 'photo-1506318137071-a8e063b4bcc0',
        master: 'abstract', params: { chaos: 0.1, drift: 0.3, resolution: 1.0 }
    },
    {
        id: 'curved-space',
        title: 'Curved Space',
        desc: 'Abstract lines following the curvature of a hidden digital mass.',
        bg: '#0a0a0a', accent: '#00ffcc', category: 'Abstract', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'abstract', params: { chaos: 1.4, drift: 1.1, resolution: 0.6 }
    },
    {
        id: 'digital-sand',
        title: 'Digital Sand',
        desc: 'Granular particles shifting and settling in complex layers.',
        bg: '#050505', accent: '#ffcc00', category: 'Abstract', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'abstract', params: { chaos: 1.6, drift: 0.7, resolution: 1.8 }
    },
    // --- 8. GLITCH & DIGITAL NIGHTMARES ---
    {
        id: 'databend',
        title: 'Databend Flow',
        desc: 'Pixels sliding down in large blocks.',
        bg: '#050505', accent: '#00ff33', category: 'Glitch', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'glitch', params: { corruption: 1.0, jitter: 0.5, shift: 2.0 }
    },
    {
        id: 'vhs-tear',
        title: 'VHS Tear',
        desc: 'Tape shift and horizontal flickering of colors.',
        bg: '#0a0a0a', accent: '#ff00ff', category: 'Glitch', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'glitch', params: { corruption: 1.5, jitter: 1.0, shift: 1.5 }
    },
    {
        id: 'pixel-sort',
        title: 'Pixel Sorting',
        desc: 'Bright colors flowing down like a waterfall.',
        bg: '#000000', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'glitch', params: { corruption: 0.8, jitter: 0.2, shift: 3.0 }
    },
    {
        id: 'ascii-art',
        title: 'ASCII Art',
        desc: 'Transformation of the image into moving letters and symbols.',
        bg: '#000500', accent: '#00ff00', category: 'Glitch', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'glitch', params: { corruption: 0.5, jitter: 0.8, shift: 1.0 }
    },
    {
        id: 'comp-artifact',
        title: 'Artifacts',
        desc: 'Macro blocks exploding into pixelated squares.',
        bg: '#0a0a0a', accent: '#333333', category: 'Glitch', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'glitch', params: { corruption: 2.0, jitter: 1.5, shift: 0.5 }
    },
    {
        id: 'ram-corruption',
        title: 'RAM Corrupt',
        desc: 'Random symbols chaotically flashing.',
        bg: '#050505', accent: '#ff0000', category: 'Glitch', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'glitch', params: { corruption: 3.0, jitter: 2.0, shift: 0.2 }
    },
    {
        id: 'z-fight',
        title: 'Z-Fighting',
        desc: 'A jarring geometric battle of 3D surfaces.',
        bg: '#000000', accent: '#cccccc', category: 'Glitch', thumbId: 'photo-1635776062127-d379bfcba9f8',
        master: 'glitch', params: { corruption: 1.2, jitter: 0.7, shift: 2.5 }
    },
    {
        id: 'matrix-rain',
        title: 'Matrix Rain',
        desc: 'Digital rain of falling characters that deform.',
        bg: '#000000', accent: '#00ff00', category: 'Glitch', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'glitch', params: { corruption: 0.7, jitter: 0.3, shift: 1.8 }
    },
    {
        id: 'screen-tear',
        title: 'Screen Tear',
        desc: 'The illusion of a screen splitting at different frame rates.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1541701494587-cb58502866ab',
        master: 'glitch', params: { corruption: 1.8, jitter: 1.2, shift: 1.0 }
    },
    {
        id: 'bsod-illusion',
        title: 'BSOD Void',
        desc: 'A 3D space emerging from within the blue screen.',
        bg: '#0000ff', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'glitch', params: { corruption: 2.5, jitter: 0.9, shift: 0.8 }
    },
    {
        id: 'buffer-over',
        title: 'Buffer Over',
        desc: 'The moment visual memory overflows.',
        bg: '#050505', accent: '#ff5500', category: 'Glitch', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'glitch', params: { corruption: 3.5, jitter: 1.8, shift: 0.4 }
    },
    {
        id: 'noise-shred',
        title: 'Noise Shred',
        desc: 'Reality torn apart by static noise.',
        bg: '#000000', accent: '#666666', category: 'Glitch', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'glitch', params: { corruption: 4.0, jitter: 2.5, shift: 0.1 }
    },
    {
        id: 'signal-loss',
        title: 'Signal Loss',
        desc: 'A completely out-of-control digital decay.',
        bg: '#0a0a0a', accent: '#ff0000', category: 'Glitch', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'glitch', params: { corruption: 5.0, jitter: 3.0, shift: 0.0 }
    },
    {
        id: 'screen-tear',
        title: 'Screen Tear',
        desc: 'Violent horizontal shifts in the image structure.',
        bg: '#000000', accent: '#ff0000', category: 'Glitch', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'glitch', params: { corruption: 2.0, jitter: 1.5, shift: 3.0 }
    },
    {
        id: 'rgb-split',
        title: 'RGB Split',
        desc: 'Total separation of red, green, and blue information channels.',
        bg: '#050505', accent: '#ff3333', category: 'Glitch', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'glitch', params: { corruption: 1.5, jitter: 0.8, shift: 2.0 }
    },
    {
        id: 'data-mosquito',
        title: 'Data Mosquito',
        desc: 'Pixel clusters that swarm and bite at the clean image structure.',
        bg: '#0a0a0a', accent: '#00ff00', category: 'Glitch', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'glitch', params: { corruption: 3.0, jitter: 4.0, shift: 0.5 }
    },
    {
        id: 'vhs-distress',
        title: 'VHS Distress',
        desc: 'Analog degradation artifacts appearing on top of the digital signal.',
        bg: '#000000', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'glitch', params: { corruption: 1.2, jitter: 2.5, shift: 1.0 }
    },
    {
        id: 'kernel-panic',
        title: 'Kernel Panic',
        desc: 'Simulated system failure with layers of raw code text and red alerts.',
        bg: '#050000', accent: '#ff0000', category: 'Glitch', thumbId: 'photo-1509228468518-180dd4864904',
        master: 'glitch', params: { corruption: 5.0, jitter: 3.0, shift: 0.2 }
    },
    {
        id: 'static-void',
        title: 'Static Void',
        desc: 'White noise patterns that contain hidden fractal shapes.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1541701494587-cb58502866ab',
        master: 'glitch', params: { corruption: 2.5, jitter: 5.0, shift: 0.1 }
    },
    {
        id: 'interlace-error',
        title: 'Interlace Error',
        desc: 'Scanning lines that clash and overlap in an infinite sequence.',
        bg: '#05050a', accent: '#00ccff', category: 'Glitch', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'glitch', params: { corruption: 1.8, jitter: 1.2, shift: 1.5 }
    },
    {
        id: 'pixel-ghost',
        title: 'Pixel Ghost',
        desc: 'Trailing echoes of previous frames lingering in the void.',
        bg: '#000000', accent: '#cccccc', category: 'Glitch', thumbId: 'photo-1534796636912-3b95b3ab5986',
        master: 'glitch', params: { corruption: 0.8, jitter: 0.5, shift: 0.4 }
    },
    {
        id: 'buffer-overrun',
        title: 'Buffer Overrun',
        desc: 'Leaking memory buffers creating random colored blocks.',
        bg: '#0a050a', accent: '#ff00ff', category: 'Glitch', thumbId: 'photo-1563089145-599997674d42',
        master: 'glitch', params: { corruption: 3.5, jitter: 2.0, shift: 5.0 }
    },
    {
        id: 'sync-loss',
        title: 'Sync Loss',
        desc: 'The image rolling vertically as the signal loses its timing.',
        bg: '#050505', accent: '#ffcc00', category: 'Glitch', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'glitch', params: { corruption: 2.2, jitter: 0.3, shift: 10.0 }
    },
    {
        id: 'corrupt-texture',
        title: 'Corrupt Texture',
        desc: 'Surface materials breaking down into raw binary information.',
        bg: '#000000', accent: '#999999', category: 'Glitch', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'glitch', params: { corruption: 4.0, jitter: 1.1, shift: 0.8 }
    },
    {
        id: 'mosaic-shatter',
        title: 'Mosaic Shatter',
        desc: 'The image breaking apart into large cubic pixels that drift away.',
        bg: '#0a0a0a', accent: '#ffffff', category: 'Glitch', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'glitch', params: { corruption: 1.6, jitter: 2.2, shift: 4.0 }
    },
    {
        id: 'glitch-helix',
        title: 'Glitch Helix',
        desc: 'A spiraling sequence of digital corruption and noise.',
        bg: '#050005', accent: '#cc00ff', category: 'Glitch', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'glitch', params: { corruption: 2.8, jitter: 1.8, shift: 1.2 }
    },

    // --- 9. MYSTERIOUS & GEOMETRIC SYMBOLISM ---
    {
        id: 'sacred-geometry',
        title: 'Sacred Symbols',
        desc: 'Flower of life and other ancient patterns emerging from the pixel dust.',
        bg: '#000000', accent: '#ffcc00', category: 'Geometry', thumbId: 'photo-1511367461989-f85a21fda167',
        master: 'geometry', params: { symmetry: 6.0, complexity: 1.5, pulse: 0.2 }
    },
    {
        id: 'monolith-grid',
        title: 'Monolith Grid',
        desc: 'Silent, towering blocks arranged in a perfect non-human sequence.',
        bg: '#050505', accent: '#ffffff', category: 'Geometry', thumbId: 'photo-1478760329108-5c3ed9d495a0',
        master: 'geometry', params: { symmetry: 4.0, complexity: 0.8, pulse: 0.1 }
    },
    {
        id: 'vector-temple',
        title: 'Vector Temple',
        desc: 'Wireframe structures that feel like an architect\'s dream of a digital god.',
        bg: '#0a0a14', accent: '#00ccff', category: 'Geometry', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'geometry', params: { symmetry: 8.0, complexity: 2.0, pulse: 0.3 }
    },
    {
        id: 'orbital-icons',
        title: 'Orbital Icons',
        desc: 'Floating symbols rotating around a central source of digital energy.',
        bg: '#000000', accent: '#7b61ff', category: 'Geometry', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'geometry', params: { symmetry: 10.0, complexity: 1.2, pulse: 0.5 }
    },
    {
        id: 'zen-lines',
        title: 'Zen Lines',
        desc: 'Perfectly straight lines dancing into complex but peaceful arrangements.',
        bg: '#050505', accent: '#ffffff', category: 'Geometry', thumbId: 'photo-1544333346-64e4fe182b60',
        master: 'geometry', params: { symmetry: 2.0, complexity: 0.5, pulse: 0.1 }
    },
    {
        id: 'recursive-sigils',
        title: 'Recursive Sigils',
        desc: 'Ancient marks that contain smaller versions of themselves infinitely.',
        bg: '#000000', accent: '#ff0000', category: 'Geometry', thumbId: 'photo-1558591710-4b4a1ae0f04d',
        master: 'geometry', params: { symmetry: 5.0, complexity: 3.0, pulse: 0.4 }
    },
    {
        id: 'crystal-lattice',
        title: 'Crystal Lattice',
        desc: 'The microscopic structure of a digital diamond shifting in the light.',
        bg: '#0a140a', accent: '#00ffcc', category: 'Geometry', thumbId: 'photo-1512168221867-04a545abbbc7',
        master: 'geometry', params: { symmetry: 7.0, complexity: 1.8, pulse: 0.2 }
    },
    {
        id: 'golden-ratio',
        title: 'Aurea Spiral',
        desc: 'The perfect logarithmic spiral of nature translated into glowing code.',
        bg: '#100500', accent: '#ffcc00', category: 'Geometry', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'geometry', params: { symmetry: 1.618, complexity: 1.0, pulse: 0.3 }
    },
    {
        id: 'poly-pulse',
        title: 'Poly Pulse',
        desc: 'Geometric primitive shapes expanding and contracting at safe frequencies.',
        bg: '#050505', accent: '#ff00ff', category: 'Geometry', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'geometry', params: { symmetry: 3.0, complexity: 0.6, pulse: 0.8 }
    },
    {
        id: 'cipher-grid',
        title: 'Cipher Grid',
        desc: 'A wall of rotating symbols that almost looks like a readable message.',
        bg: '#000000', accent: '#ffffff', category: 'Geometry', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'geometry', params: { symmetry: 12.0, complexity: 2.5, pulse: 0.1 }
    },
    {
        id: 'mystic-node',
        title: 'Mystic Node',
        desc: 'The central point of a complex network connecting all digital souls.',
        bg: '#050005', accent: '#cc00ff', category: 'Geometry', thumbId: 'photo-1518133910546-b6c2fb7d79e3',
        master: 'geometry', params: { symmetry: 9.0, complexity: 1.4, pulse: 0.6 }
    },
    {
        id: 'geometric-echo',
        title: 'Geom Echo',
        desc: 'Shapes that leave vibrating geometric trails as they move.',
        bg: '#000000', accent: '#00ffff', category: 'Geometry', thumbId: 'photo-1550684848-fac1c5b4e853',
        master: 'geometry', params: { symmetry: 4.0, complexity: 1.0, pulse: 0.3 }
    },
    {
        id: 'origin-point',
        title: 'Origin Point',
        desc: 'The single source from which all geometric complexity is born.',
        bg: '#050505', accent: '#ffffff', category: 'Geometry', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'geometry', params: { symmetry: 1.0, complexity: 0.2, pulse: 0.1 }
    },
    // --- 10. MICRO & MACRO COSMOS ---
    {
        id: 'stellar-nursery',
        title: 'Star Nursery',
        desc: 'Birth of stars in a dense cloud of glowing space dust.',
        bg: '#050505', accent: '#4facfe', category: 'Cosmic', thumbId: 'photo-1462331940025-496dfbfc7564',
        master: 'cosmic', params: { zoom: 0.5, density: 2.0, glow: 1.5 }
    },
    {
        id: 'supernova-sys',
        title: 'Supernova',
        desc: 'The final, beautiful explosion of a digital star across the void.',
        bg: '#000000', accent: '#ff9900', category: 'Cosmic', thumbId: 'photo-1634128221889-82ed6efebfc3',
        master: 'cosmic', params: { zoom: 1.2, density: 3.0, glow: 4.0 }
    },
    {
        id: 'event-horizon-macro',
        title: 'Macro Horizon',
        desc: 'Extreme close-up of light bending around a black hole.',
        bg: '#100500', accent: '#ff6600', category: 'Cosmic', thumbId: 'photo-1506318137071-a8e063b4bcc0',
        master: 'cosmic', params: { zoom: 3.0, density: 0.8, glow: 2.0 }
    },
    {
        id: 'galactic-center',
        title: 'Galaxy Core',
        desc: 'Millions of stars rotating around a supermassive source of light.',
        bg: '#000000', accent: '#7b61ff', category: 'Cosmic', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'cosmic', params: { zoom: 0.1, density: 5.0, glow: 1.2 }
    },
    {
        id: 'atomic-void',
        title: 'Atomic Void',
        desc: 'The microscopic dance of pixels functioning as quantum particles.',
        bg: '#050505', accent: '#ffffff', category: 'Cosmic', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'cosmic', params: { zoom: 10.0, density: 1.5, glow: 0.5 }
    },
    {
        id: 'quasar-beam',
        title: 'Quasar Beam',
        desc: 'Immense energy jets shooting out from the center of a galaxy.',
        bg: '#000000', accent: '#00ccff', category: 'Cosmic', thumbId: 'photo-1534796636912-3b95b3ab5986',
        master: 'cosmic', params: { zoom: 0.8, density: 1.2, glow: 3.0 }
    },
    {
        id: 'nebula-gas',
        title: 'Nebula Gas',
        desc: 'Vast curtains of hydrogen and helium glowing in the dark.',
        bg: '#0a0a0a', accent: '#ff00ff', category: 'Cosmic', thumbId: 'photo-1618005182384-a83a8bd57fbe',
        master: 'cosmic', params: { zoom: 0.3, density: 0.5, glow: 0.8 }
    },
    {
        id: 'solar-flare',
        title: 'Solar Flare',
        desc: 'Massive loops of fire and light emerging from a digital sun.',
        bg: '#100000', accent: '#ff3300', category: 'Cosmic', thumbId: 'photo-1502134249126-9f3755a50d78',
        master: 'cosmic', params: { zoom: 5.0, density: 2.5, glow: 1.8 }
    },
    {
        id: 'dark-matter-flow',
        title: 'Matter Flow',
        desc: 'The invisible web that connects all structures in the universe.',
        bg: '#000000', accent: '#333333', category: 'Cosmic', thumbId: 'photo-1550745165-9bc0b252728f',
        master: 'cosmic', params: { zoom: 0.2, density: 4.0, glow: 0.1 }
    },
    {
        id: 'pulsar-rhythm',
        title: 'Pulsar Rhythm',
        desc: 'The high-frequency beating of a neutron star caught on camera.',
        bg: '#05050a', accent: '#ffffff', category: 'Cosmic', thumbId: 'photo-1550537687-c91072c4792d',
        master: 'cosmic', params: { zoom: 1.5, density: 1.0, glow: 2.5 }
    },
    {
        id: 'comet-tail',
        title: 'Comet Tail',
        desc: 'A frozen ice block leaving a glowing trail of dust and gas.',
        bg: '#000000', accent: '#00f2fe', category: 'Cosmic', thumbId: 'photo-1551033406-611cf9a28f67',
        master: 'cosmic', params: { zoom: 2.0, density: 0.4, glow: 1.2 }
    },
    {
        id: 'binary-stars',
        title: 'Binary Dance',
        desc: 'Two stars locked in a gravity-defying digital embrace.',
        bg: '#050505', accent: '#ffcc00', category: 'Cosmic', thumbId: 'photo-1464802686167-b939a67a0621',
        master: 'cosmic', params: { zoom: 0.7, density: 2.0, glow: 0.9 }
    },
    {
        id: 'void-horizon',
        title: 'Final Horizon',
        desc: 'The very edge of the observable digital universe.',
        bg: '#000000', accent: '#ffffff', category: 'Cosmic', thumbId: 'photo-1510511459019-5deeee712163',
        master: 'cosmic', params: { zoom: 0.1, density: 0.1, glow: 0.1 }
    },
];
