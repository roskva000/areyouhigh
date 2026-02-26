// ============================================================
// INDUSTRIAL SHADERS — 4 sub-shaders
// ============================================================

export const industrial_corridor = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_complexity;
  uniform float u_aging;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }

  float map(vec3 p) {
    p.z += u_time * u_speed * 2.0;
    p.xy *= rot(p.z * 0.02 * u_complexity);

    vec3 rep = vec3(4.0, 4.0, 4.0);
    p = mod(p + rep * 0.5, rep) - rep * 0.5;

    float corridor = -sdBox(p, vec3(1.8, 1.8, 50.0));
    float pillars = sdBox(vec3(abs(p.x) - 1.5, p.y, mod(p.z + 1.0, 2.0) - 1.0), vec3(0.15, 2.0, 0.15));
    float beams = sdBox(vec3(p.x, abs(p.y) - 1.5, mod(p.z + 0.5, 1.0) - 0.5), vec3(2.0, 0.08, 0.08));

    return min(max(corridor, -pillars), beams);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec3 ro = vec3(0.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(uv, 1.5));
    float t = 0.0;

    for (int i = 0; i < 80; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);
      if (d < 0.001 || t > 30.0) break;
      t += d * 0.8;
    }

    vec3 col = vec3(0.0);
    if (t < 30.0) {
      float fog = 1.0 - exp(-t * 0.08);
      float depth_col = t * 0.05;
      col = mix(u_color1, u_color2, sin(depth_col + u_time * 0.2) * 0.5 + 0.5);
      col *= (1.0 - fog) * u_intensity;
      col += u_color1 * u_aging * 0.05 * fog;
    }

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.3 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const industrial_machine = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_complexity;
  uniform float u_aging;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  float gear(vec2 p, float radius, float teeth, float tooth_size, float time) {
    p *= rot(time);
    float r = length(p);
    float a = atan(p.y, p.x);
    float ring = abs(r - radius) - 0.02;
    float tooth = r - radius - tooth_size * max(0.0, sin(a * teeth));
    return max(-tooth, ring);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * u_speed;

    float d = 1e10;
    vec3 col = vec3(0.0);

    // Multiple interlocking gears
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float angle = fi * 0.898 + t * 0.1;
      float radius = 0.25 + fi * 0.05;
      vec2 center = vec2(cos(angle), sin(angle)) * (0.4 + fi * 0.1);
      float teeth = 8.0 + fi * u_complexity * 2.0;
      float dir = mod(fi, 2.0) < 1.0 ? 1.0 : -1.0;
      float g = gear(uv - center, radius, teeth, 0.05, t * dir * (0.5 + fi * 0.1));
      float edge = 0.003 / (abs(g) + 0.003);
      vec3 gear_col = mix(u_color1, u_color2, fi / 7.0);
      col += gear_col * edge * u_intensity * 0.2;

      // Rust/aging spots
      float rust = sin(uv.x * 30.0 + fi) * sin(uv.y * 30.0 + fi * 2.0) * u_aging;
      col += u_color1 * 0.02 * max(0.0, rust);
    }

    // Piston animation
    float piston_y = sin(t * 3.0) * 0.3;
    float piston = smoothstep(0.03, 0.0, abs(uv.x)) * smoothstep(0.03, 0.0, abs(uv.y - piston_y));
    col += u_color2 * piston * u_intensity;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const industrial_wire = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_complexity;
  uniform float u_aging;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    vec2 grid = uv * (10.0 + u_complexity * 10.0);
    vec2 gid = floor(grid);
    vec2 gf = fract(grid);

    float circuit = 0.0;

    // Horizontal and vertical traces
    float h_trace = hash(gid) > 0.5 ? 1.0 : 0.0;
    float v_trace = hash(gid + 100.0) > 0.5 ? 1.0 : 0.0;

    circuit += h_trace * smoothstep(0.03, 0.0, abs(gf.y - 0.5));
    circuit += v_trace * smoothstep(0.03, 0.0, abs(gf.x - 0.5));

    // Connection nodes at intersections
    float node = smoothstep(0.08, 0.0, length(gf - 0.5));
    circuit += node * (h_trace + v_trace) * 0.5;

    // Data flow animation - pulses traveling along traces
    float flow_h = smoothstep(0.1, 0.0, abs(gf.x - fract(t * 0.5 + hash(gid) * 5.0)));
    float flow_v = smoothstep(0.1, 0.0, abs(gf.y - fract(t * 0.3 + hash(gid + 50.0) * 5.0)));
    float data_flow = flow_h * h_trace + flow_v * v_trace;

    vec3 col = vec3(0.0);
    col += u_color1 * circuit * 0.3;
    col += u_color2 * data_flow * u_intensity;
    col += u_color2 * node * 0.2 * sin(t * 2.0 + hash(gid) * 6.28) * 0.5 + 0.5;
    col += u_color1 * u_aging * 0.02; // Ambient PCB color

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const industrial_rust = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_complexity;
  uniform float u_aging;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.1 * u_speed;

    // Multi-scale rust texture
    float n1 = noise(uv * 5.0 * u_complexity + t);
    float n2 = noise(uv * 15.0 * u_complexity - t * 0.5);
    float n3 = noise(uv * 40.0 * u_complexity + t * 0.3);

    float rust = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    float corrosion = smoothstep(0.3, 0.7, rust + u_aging * 0.3);

    // Radar sweep
    vec2 centered = uv - 0.5;
    float angle = atan(centered.y, centered.x);
    float sweep = smoothstep(0.0, 0.5, mod(angle + t * 2.0, 6.28) / 6.28);
    float radar = sweep * smoothstep(0.5, 0.0, length(centered));

    // Signal emission rings
    float rings = sin(length(centered) * 30.0 - t * 5.0) * 0.5 + 0.5;
    rings *= smoothstep(0.5, 0.1, length(centered));
    rings *= u_intensity;

    vec3 col = vec3(0.0);
    vec3 metal = u_color1 * (1.0 - corrosion * 0.5);
    vec3 rust_col = u_color2 * corrosion;
    col = mix(metal, rust_col, corrosion) * 0.5;
    col += u_color2 * radar * 0.3;
    col += u_color1 * rings * 0.2;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;
