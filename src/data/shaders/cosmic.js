// ============================================================
// COSMIC SHADERS — 4 sub-shaders
// ============================================================

export const cosmic_stellar = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_density;
  uniform float u_glow;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv *= u_zoom;
    float t = u_time * 0.1 * u_speed;

    vec3 col = vec3(0.0);

    // Nebula gas clouds
    float nebula = 0.0;
    vec2 np = uv * 2.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      nebula += noise(np + t * (0.1 + fi * 0.02)) / (1.0 + fi);
      np *= 2.1;
    }
    nebula = pow(nebula * 0.3, 2.0);
    col += mix(u_color1, u_color2, nebula) * nebula * u_glow * 0.5;

    // Star field - multiple layers for depth
    for (int layer = 0; layer < 3; layer++) {
      float fl = float(layer);
      float scale = 20.0 + fl * 30.0;
      vec2 star_grid = floor(uv * scale * u_density + t * fl * 0.5);
      float star_rand = hash(star_grid);

      if (star_rand > 0.97) {
        vec2 star_pos = (star_grid + 0.5 + (hash(star_grid + 100.0) - 0.5) * 0.8) / (scale * u_density);
        float d = length(uv - star_pos + t * fl * 0.5 / (scale * u_density));
        float star_size = (1.0 - fl * 0.25) * 0.003;
        float star = star_size / (d + star_size * 0.5);

        // Twinkle
        float twinkle = sin(t * 10.0 * star_rand + star_rand * 100.0) * 0.3 + 0.7;
        vec3 star_col = mix(u_color2, vec3(1.0), star_rand);
        col += star_col * star * twinkle * u_intensity * 0.3;
      }
    }

    // Binary star dance
    vec2 s1 = vec2(sin(t * 0.5), cos(t * 0.5)) * 0.1;
    vec2 s2 = -s1;
    float glow1 = 0.01 / (length(uv - s1) + 0.005);
    float glow2 = 0.008 / (length(uv - s2) + 0.005);
    col += u_color1 * glow1 * u_glow * 0.3;
    col += u_color2 * glow2 * u_glow * 0.3;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const cosmic_explosion = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_density;
  uniform float u_glow;

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
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Supernova explosion - expanding shell
    float cycle = mod(t, 5.0);
    float expand = cycle * 0.3 * u_zoom;
    float shell = smoothstep(0.02, 0.0, abs(r - expand)) * smoothstep(5.0, 0.0, cycle);

    // Ejecta rays
    float rays = 0.0;
    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float ray_a = fi * 0.524 + hash(vec2(fi, 0.0)) * 0.3;
      float ray_w = 0.02 + hash(vec2(fi, 1.0)) * 0.03;
      float ray = smoothstep(ray_w, 0.0, abs(a - ray_a));
      ray += smoothstep(ray_w, 0.0, abs(a - ray_a + 6.28));
      ray *= smoothstep(1.5, 0.0, r) * smoothstep(0.0, 0.1, r);
      rays += ray * (0.5 + hash(vec2(fi, 2.0)));
    }

    // Solar flare loops
    float flare = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float flare_a = fi * 1.571 + t * 0.2;
      float flare_r = 0.15 + sin(a * 2.0 + t + fi) * 0.05;
      float d = abs(r - flare_r);
      float arc = smoothstep(0.3, 0.0, abs(a - flare_a));
      flare += 0.005 / (d + 0.005) * arc * u_density;
    }

    // Core glow
    float core = 0.03 / (r + 0.01) * u_glow;
    float corona = exp(-r * 3.0) * noise(vec2(a * 5.0, r * 10.0 - t * 3.0));

    vec3 col = vec3(0.0);
    col += u_color2 * core * 0.5;
    col += mix(u_color2, u_color1, r * 2.0) * rays * u_intensity * 0.4;
    col += u_color2 * shell * 2.0;
    col += u_color1 * flare * 0.3;
    col += mix(u_color1, u_color2, 0.5) * corona * u_intensity;

    col = pow(col, vec3(0.8));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const cosmic_void = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_density;
  uniform float u_glow;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv *= u_zoom;
    float t = u_time * 0.1 * u_speed;

    // Dark matter web - cosmic filaments
    vec3 col = vec3(0.0);

    float web = 0.0;
    vec2 p = uv * (2.0 + u_density);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      vec2 cell = floor(p);
      vec2 frac_p = fract(p) - 0.5;

      // Find nearest filament
      float min_d = 1.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = hash(cell + neighbor + fi * 10.0) * 0.8 - 0.4;
          point += vec2(sin(t + hash(cell + neighbor) * 6.28), cos(t * 0.7 + hash(cell + neighbor + 50.0) * 6.28)) * 0.1;
          float d = length(frac_p - neighbor - point);
          min_d = min(min_d, d);
        }
      }

      web += (1.0 - min_d) * 0.15 / (1.0 + fi * 0.5);
      p *= 2.0;
    }

    web = pow(web, 2.0);

    // Void regions (dark halos)
    float void_region = noise(uv * 3.0 + t * 0.2);
    void_region = smoothstep(0.6, 0.4, void_region);

    // Sparse dim galaxies
    float galaxies = pow(hash(floor(uv * 20.0 * u_density)), 30.0) * u_glow;

    col += u_color1 * web * u_intensity * 0.8;
    col += u_color2 * web * void_region * 0.3;
    col += u_color2 * galaxies;
    col *= 1.0 + void_region * 0.2;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const cosmic_pulse = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_density;
  uniform float u_glow;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * u_speed;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Pulsar beam - rotating lighthouse
    float beam_angle = t * 2.0;
    float beam1 = smoothstep(0.08, 0.0, abs(a - beam_angle));
    float beam2 = smoothstep(0.08, 0.0, abs(a - beam_angle + 3.14159));
    float beam = (beam1 + beam2) * smoothstep(0.0, 0.05, r) * u_glow;

    // Pulsar core - rapid flashing
    float pulse_freq = 10.0 + u_density * 20.0;
    float core_pulse = pow(sin(t * pulse_freq) * 0.5 + 0.5, 8.0);
    float core = 0.02 / (r + 0.005) * (0.3 + core_pulse * 0.7);

    // Expanding pulse rings
    float rings = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float ring_r = mod(t * 0.5 + fi * 0.4, 2.0) * u_zoom;
      float ring_alpha = smoothstep(2.0, 0.0, ring_r);
      float ring = 0.003 / (abs(r - ring_r) + 0.003) * ring_alpha;
      rings += ring;
    }

    // Comet tail trailing the beam
    float trail_width = 0.15;
    float trail = smoothstep(trail_width, 0.0, abs(a - beam_angle + 0.3)) * smoothstep(0.0, 0.3, r);
    trail *= exp(-r * 2.0);

    // Accretion disk
    float disk = smoothstep(0.02, 0.0, abs(uv.y * (2.0 + sin(a * 3.0 + t) * 0.3)));
    disk *= smoothstep(0.05, 0.15, r) * smoothstep(0.8, 0.3, r);

    vec3 col = vec3(0.0);
    col += u_color2 * core * u_intensity * 0.5;
    col += u_color1 * beam * 0.4 * u_intensity;
    col += mix(u_color1, u_color2, 0.5) * rings * 0.3 * u_intensity;
    col += u_color2 * trail * 0.3;
    col += mix(u_color1, u_color2, r * 3.0) * disk * 0.3 * u_density;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;
