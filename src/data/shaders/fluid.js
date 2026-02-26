// ============================================================
// FLUID SHADERS — 4 sub-shaders
// ============================================================

export const fluid_curl = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_viscosity;
  uniform float u_turbulence;
  uniform float u_swirl;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  vec2 curl(vec2 p, float t) {
    float e = 0.01;
    float n = noise(p + vec2(0.0, e) + t);
    float s = noise(p - vec2(0.0, e) + t);
    float east = noise(p + vec2(e, 0.0) + t);
    float west = noise(p - vec2(e, 0.0) + t);
    return vec2(n - s, -(east - west)) / (2.0 * e);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.2 * u_speed;
    vec2 p = uv * (3.0 + u_turbulence * 3.0);

    // Advect through curl noise
    for (int i = 0; i < 8; i++) {
      vec2 c = curl(p * (0.5 + float(i) * 0.2), t * (0.5 + float(i) * 0.1));
      p += c * 0.05 * u_swirl * u_viscosity;
    }

    float n1 = noise(p * 2.0 + t * 0.3);
    float n2 = noise(p * 4.0 - t * 0.2);
    float n3 = noise(p * 8.0 + t * 0.5);

    float density = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    density = smoothstep(0.2, 0.8, density);

    vec3 col = mix(u_color1 * 0.1, u_color2, density * u_intensity);
    col += u_color1 * pow(n3, 3.0) * 2.0 * u_intensity;
    col *= 1.0 + 0.3 * sin(p.x * 5.0 + p.y * 3.0 + t);

    col = pow(col, vec3(0.85));
    col *= 1.0 - 0.2 * length(uv - 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fluid_ferro = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_viscosity;
  uniform float u_turbulence;
  uniform float u_swirl;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.5 * u_speed;

    // Magnetic field from two poles
    vec2 pole1 = vec2(sin(t * 0.3) * 0.3, cos(t * 0.2) * 0.3) * u_swirl;
    vec2 pole2 = -pole1;

    vec2 field = normalize(uv - pole1) / (length(uv - pole1) + 0.1)
               - normalize(uv - pole2) / (length(uv - pole2) + 0.1);
    float field_str = length(field);

    // Ferrofluid spikes along field lines
    float spike_angle = atan(field.y, field.x);
    float spikes = pow(abs(sin(spike_angle * (5.0 + u_turbulence * 10.0))), 4.0 / u_viscosity);
    spikes *= smoothstep(0.0, 0.5, field_str) * smoothstep(3.0, 0.5, field_str);

    // Surface detail
    float detail = noise(uv * 10.0 + field * 2.0 + t) * 0.3;

    // Dark liquid base
    float base = smoothstep(1.5, 0.0, length(uv)) * 0.15;

    vec3 col = vec3(0.0);
    col += u_color1 * spikes * u_intensity;
    col += u_color2 * detail * spikes * 0.5;
    col += u_color1 * base;
    col += u_color2 * 0.01 / (abs(spikes - 0.5) + 0.01) * 0.1; // Edge sheen

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fluid_vortex = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_viscosity;
  uniform float u_turbulence;
  uniform float u_swirl;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Spiral vortex
    float spiral = a + r * u_swirl * 5.0 - t * 2.0;
    float arms = sin(spiral * (2.0 + u_turbulence)) * 0.5 + 0.5;

    // Oil paint thickness
    float thickness = noise(vec2(spiral * 2.0, r * 5.0) + t * 0.5);
    float thick2 = noise(vec2(spiral * 4.0, r * 10.0) - t * 0.3);

    float flow = arms * (0.5 + thickness * 0.5);
    flow *= smoothstep(1.5, 0.0, r);

    // Vortex pull distortion
    float pull = exp(-r * (1.0 + u_viscosity)) * u_intensity;

    vec3 col = vec3(0.0);
    col += mix(u_color1, u_color2, flow) * (flow * 1.2 + pull * 0.5);
    col += u_color2 * thick2 * 0.3 * flow;
    col += u_color1 * pull * 0.3;

    // Central bright core
    col += mix(u_color1, u_color2, 0.5) * 0.05 / (r + 0.02);

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fluid_plasma = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_viscosity;
  uniform float u_turbulence;
  uniform float u_swirl;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.4 * u_speed;
    vec2 p = uv * (5.0 + u_turbulence * 5.0);

    float v = 0.0;
    for (int i = 1; i < 8; i++) {
      float fi = float(i);
      float speed_mod = 1.0 + fi * 0.2 * u_viscosity;
      p.x += u_swirl * 0.5 / fi * sin(fi * p.y + t * speed_mod + 0.3 * fi);
      p.y += u_swirl * 0.5 / fi * cos(fi * p.x + t * speed_mod * 0.8 + 0.3 * fi);
    }

    float plasma1 = sin(p.x + p.y + t) * 0.5 + 0.5;
    float plasma2 = sin(length(p) * 2.0 - t * 1.5) * 0.5 + 0.5;
    float plasma3 = sin(p.x * sin(t * 0.3) + p.y * cos(t * 0.2)) * 0.5 + 0.5;

    float combined = (plasma1 + plasma2 + plasma3) / 3.0;

    vec3 col = vec3(0.0);
    col += u_color1 * (1.0 - combined) * u_intensity;
    col += u_color2 * combined * u_intensity;
    col += mix(u_color1, u_color2, plasma3) * 0.3;

    // Hot spots
    float hotspot = pow(combined, 4.0) * 2.0;
    col += (u_color1 + u_color2) * hotspot * 0.3;

    col = pow(col, vec3(0.85));
    col *= 1.0 - 0.15 * length(uv - 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;
