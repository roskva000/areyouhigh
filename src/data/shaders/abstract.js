// ============================================================
// ABSTRACT SHADERS — 4 sub-shaders
// ============================================================

export const abstract_kaleido = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_chaos;
  uniform float u_drift;
  uniform float u_resolution_param;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  vec3 pal(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.2 * u_speed;

    // Kaleidoscope folding
    float sides = 3.0 + u_chaos * 5.0;
    float a = atan(uv.y, uv.x);
    float r = length(uv);
    a = mod(a, 6.28318 / sides) - 3.14159 / sides;
    a = abs(a);
    uv = vec2(cos(a), sin(a)) * r;

    vec3 col = vec3(0.0);
    float d = length(uv);

    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      uv = abs(uv) - 0.35 - u_drift * 0.1;
      uv *= rot(t * 0.15 + fi * 0.5);
      uv *= 1.1 + 0.05 * sin(t * 0.5 + fi);

      float line_d = min(abs(uv.x), abs(uv.y));
      float ring_d = abs(length(uv) - 0.15);
      float shape = min(line_d, ring_d);

      float glow = 0.002 / (shape + 0.002);
      vec3 c = pal(fi * 0.08 + d * 0.3 + t * 0.05) * mix(u_color1, u_color2, fi / 10.0);
      col += c * glow * u_intensity * 0.3;

      // Echo trails
      float echo = 0.001 / (shape + 0.005);
      col += c * echo * u_drift * 0.1;
    }

    col = pow(col, vec3(0.75));
    col *= 1.0 - 0.3 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const abstract_noise = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_chaos;
  uniform float u_drift;
  uniform float u_resolution_param;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    float scale = 50.0 + u_chaos * 200.0;
    vec2 grid = floor(uv * scale);

    // Animated noise
    float n = hash(grid + floor(t * 10.0));
    float n2 = hash(grid * 1.7 + floor(t * 7.0) + 100.0);
    float n3 = hash(grid * 0.5 + floor(t * 15.0) + 200.0);

    // Holographic color separation
    float r_ch = hash(grid + vec2(sin(t), 0.0));
    float g_ch = hash(grid + vec2(0.0, cos(t * 0.7)));
    float b_ch = hash(grid + vec2(sin(t * 1.3), cos(t * 0.5)));

    vec3 holo = vec3(r_ch, g_ch, b_ch);

    // Horizontal scan lines
    float scanline = sin(uv.y * u_resolution.y * 0.5 + t * u_drift) * 0.3 + 0.7;

    vec3 col = vec3(0.0);
    col += mix(u_color1, u_color2, n) * n * 0.5;
    col += holo * u_intensity * 0.3 * n2;
    col *= scanline;
    col += u_color2 * n3 * 0.1;

    // Monochrome contrast boost
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 1.0 + u_chaos * 0.5);

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const abstract_flow = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_chaos;
  uniform float u_drift;
  uniform float u_resolution_param;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.2 * u_speed;

    // Vector field flow
    vec2 p = uv * (2.0 + u_chaos * 3.0);
    vec3 col = vec3(0.0);

    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      // Flow field advection
      vec2 flow = vec2(
        noise(p + vec2(0.0, t + fi * 0.5)) - 0.5,
        noise(p + vec2(t * 0.7 + fi * 0.3, 0.0)) - 0.5
      ) * u_drift;

      p += flow * 0.3;

      float d = noise(p * (1.0 + fi * 0.5) + t * 0.2);
      float streak = pow(d, 3.0) * 3.0;

      vec3 c = mix(u_color1, u_color2, fi / 8.0 + d * 0.3);
      col += c * streak * u_intensity * 0.15;
    }

    // Nebula-like soft glow
    float glow = noise(uv * 2.0 + t * 0.1) * noise(uv * 4.0 - t * 0.15);
    col += mix(u_color1, u_color2, glow) * glow * 0.2;

    col = pow(col, vec3(0.8));
    col *= 1.0 - 0.2 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const abstract_dissolve = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_chaos;
  uniform float u_drift;
  uniform float u_resolution_param;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.3 * u_speed;

    // Melting effect - UV distortion increases over time
    float melt_phase = sin(t * 0.5) * 0.5 + 0.5;
    vec2 melted = uv;
    melted.y += noise(vec2(uv.x * 5.0, t)) * u_chaos * 0.15 * melt_phase;
    melted.x += noise(vec2(t * 0.7, uv.y * 5.0)) * u_drift * 0.1;

    // Geometric dissolution
    float grid_scale = 3.0 + u_chaos * 10.0;
    vec2 grid = melted * grid_scale;
    vec2 gid = floor(grid);
    vec2 gf = fract(grid) - 0.5;

    float cell_rand = hash(gid);
    float dissolve = smoothstep(cell_rand - 0.1, cell_rand + 0.1, sin(t * 0.5) * 0.5 + 0.5);

    // Break into triangles
    float tri = max(abs(gf.x) + abs(gf.y) - 0.4, 0.0);
    float triangle = smoothstep(0.02, 0.0, tri);
    float edge = smoothstep(0.05, 0.0, tri) - triangle;

    // Breathing pulse
    float breath = sin(t * 1.5) * 0.5 + 0.5;
    float pulse = 1.0 + breath * u_drift * 0.2;

    vec3 col = vec3(0.0);
    col += mix(u_color1, u_color2, cell_rand) * triangle * dissolve * u_intensity * pulse;
    col += u_color2 * edge * 0.5;
    col += u_color1 * (1.0 - dissolve) * 0.05;
    col += u_color2 * pow(noise(melted * 10.0 + t), 4.0) * u_intensity * 0.5;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;
