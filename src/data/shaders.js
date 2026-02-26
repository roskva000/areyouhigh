// Shader Aggregator — imports all 38 sub-shaders and re-exports as MASTER_SHADERS
import { fractal_mandelbrot, fractal_julia, fractal_sierpinski, fractal_ifs } from './shaders/fractal';
import { organic_voronoi, organic_fbm, organic_chrome, organic_reaction } from './shaders/organic';
import { physics_blackhole, physics_wormhole, physics_spacetime, physics_temporal } from './shaders/physics';
import { fluid_curl, fluid_ferro, fluid_vortex, fluid_plasma } from './shaders/fluid';
import { light_rays, light_prism, light_bloom, light_mirror } from './shaders/light';
import { industrial_corridor, industrial_machine, industrial_wire, industrial_rust } from './shaders/industrial';
import { abstract_kaleido, abstract_noise, abstract_flow, abstract_dissolve } from './shaders/abstract';
import { glitch_vhs, glitch_data, glitch_matrix, glitch_corrupt } from './shaders/glitch';
import { geometry_sacred, geometry_mandala, geometry_grid, geometry_orbital } from './shaders/geometry';
import { cosmic_stellar, cosmic_explosion, cosmic_void, cosmic_pulse } from './shaders/cosmic';
// Import extracted special shaders
import { special_abyss, special_fluid, special_fractal, special_mandala, special_particles_vertex, special_particles_fragment, special_plexus, special_tunnel } from './shaders/special';

export const MASTER_SHADERS = {
    // Fractal
    fractal_mandelbrot,
    fractal_julia,
    fractal_sierpinski,
    fractal_ifs,
    // Organic
    organic_voronoi,
    organic_fbm,
    organic_chrome,
    organic_reaction,
    // Physics
    physics_blackhole,
    physics_wormhole,
    physics_spacetime,
    physics_temporal,
    // Fluid
    fluid_curl,
    fluid_ferro,
    fluid_vortex,
    fluid_plasma,
    // Light
    light_rays,
    light_prism,
    light_bloom,
    light_mirror,
    // Industrial
    industrial_corridor,
    industrial_machine,
    industrial_wire,
    industrial_rust,
    // Abstract
    abstract_kaleido,
    abstract_noise,
    abstract_flow,
    abstract_dissolve,
    // Glitch
    glitch_vhs,
    glitch_data,
    glitch_matrix,
    glitch_corrupt,
    // Geometry
    geometry_sacred,
    geometry_mandala,
    geometry_grid,
    geometry_orbital,
    // Cosmic
    cosmic_stellar,
    cosmic_explosion,
    cosmic_void,
    cosmic_pulse,
    // Special (Extracted High-Quality Shaders)
    special_abyss,
    special_fluid,
    special_fractal,
    special_mandala,
    special_plexus,
    special_tunnel,
    // Special Particles (Needs special handling in the component)
    special_particles_vertex,
    special_particles_fragment
};

export const getShader = (master) => MASTER_SHADERS[master] || MASTER_SHADERS.abstract_kaleido;
