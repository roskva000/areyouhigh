// ============================================================
// ORGANIC SHADERS — 4 sub-shaders
// ============================================================

export const organic_voronoi = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_density;
  uniform float u_warp;
  uniform float u_pulse;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.3 * u_speed;
    uv *= 3.0 + u_density * 4.0;

    vec2 ip = floor(uv);
    vec2 fp = fract(uv);

    float d1 = 1e10;
    float d2 = 1e10;
    vec2 closest_id = vec2(0.0);

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = hash2(ip + neighbor);
        point = 0.5 + 0.5 * sin(t + 6.28 * point + u_warp * sin(t * 0.5 + point.x * 3.0));
        float d = length(neighbor + point - fp);
        if (d < d1) { d2 = d1; d1 = d; closest_id = point; }
        else if (d < d2) { d2 = d; }
      }
    }

    float edge = d2 - d1;
    float glow = 0.01 / (edge + 0.01);
    float cell = d1;

    float pulse_val = sin(t * u_pulse * 3.0 + closest_id.x * 6.28) * 0.5 + 0.5;

    vec3 col = vec3(0.0);
    vec3 cellColor = mix(u_color1, u_color2, closest_id.x + closest_id.y * 0.5);
    col += cellColor * (0.1 + pulse_val * 0.3) * u_intensity;
    col += mix(u_color2, u_color1, edge * 2.0) * glow * 0.15;
    col += u_color2 * smoothstep(0.05, 0.0, edge) * 0.8;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const organic_fbm = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_density;
  uniform float u_warp;
  uniform float u_pulse;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 7; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.15 * u_speed;

    vec2 p = uv * (2.0 + u_density * 3.0);

    // Domain warping - the key technique
    vec2 q = vec2(fbm(p + t * 0.1), fbm(p + vec2(5.2, 1.3) + t * 0.12));
    vec2 r = vec2(
      fbm(p + u_warp * 4.0 * q + vec2(1.7, 9.2) + t * 0.08),
      fbm(p + u_warp * 4.0 * q + vec2(8.3, 2.8) + t * 0.1)
    );

    float f = fbm(p + u_warp * 4.0 * r);
    float pulse_v = sin(t * u_pulse * 2.0) * 0.5 + 0.5;

    vec3 col = vec3(0.0);
    col = mix(u_color1 * 0.2, u_color1, clamp(f * f * 4.0, 0.0, 1.0));
    col = mix(col, u_color2, clamp(length(q) * 0.5, 0.0, 1.0));
    col = mix(col, u_color1 * 1.5, clamp(length(r.x) * 0.5, 0.0, 1.0));

    col *= (1.0 + pulse_v * 0.3 * u_intensity);
    col *= 1.0 + f * f * f * 3.0 * u_intensity;

    col = pow(col, vec3(0.8));
    col *= 1.0 - 0.2 * length(uv - 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const organic_chrome = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_density;
  uniform float u_warp;
  uniform float u_pulse;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.4 * u_speed;

    float d = 1e10;
    int count = 3 + int(u_density * 4.0);

    for (int i = 0; i < 10; i++) {
      if (i >= count) break;
      float fi = float(i);
      vec2 center = vec2(
        sin(t * 0.5 + fi * 2.1) * (0.6 + u_warp * 0.3),
        cos(t * 0.4 + fi * 1.7) * (0.6 + u_warp * 0.3)
      );
      float radius = 0.2 + 0.1 * sin(t * u_pulse + fi * 1.5);
      float blob = length(uv - center) - radius;
      d = smin(d, blob, 0.4 + u_warp * 0.3);
    }

    vec3 col = vec3(0.0);
    float grad = clamp(-d * 3.0, 0.0, 1.0);

    // Chrome reflection simulation
    vec2 n = normalize(vec2(
      length(uv + vec2(0.001, 0.0)) - length(uv - vec2(0.001, 0.0)),
      length(uv + vec2(0.0, 0.001)) - length(uv - vec2(0.0, 0.001))
    ));
    float fresnel = pow(1.0 - abs(dot(normalize(uv), n)), 3.0);

    vec3 chrome = mix(u_color1 * 0.3, u_color2 * 2.0, fresnel);
    chrome += u_color1 * 0.5 * sin(d * 20.0 + t) * u_intensity;

    col = chrome * grad;
    col += u_color2 * 0.02 / (abs(d) + 0.01); // Edge glow

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const organic_reaction = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_density;
  uniform float u_warp;
  uniform float u_pulse;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.2 * u_speed;
    vec2 p = uv * (5.0 + u_density * 10.0);

    // Simulate reaction-diffusion via layered noise
    float n1 = noise(p + t * 0.5);
    float n2 = noise(p * 2.0 - t * 0.3 + n1 * u_warp * 2.0);
    float n3 = noise(p * 4.0 + t * 0.2 + n2 * u_warp);
    float n4 = noise(p * 8.0 - t * 0.15 + n3 * u_warp * 0.5);

    float pattern = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + n4 * 0.1;
    float turing = smoothstep(0.35, 0.5, pattern) - smoothstep(0.5, 0.65, pattern);

    float pulse_v = sin(t * u_pulse * 3.0) * 0.5 + 0.5;
    float sparks = pow(noise(p * 3.0 + t * 2.0), 8.0) * u_intensity * 3.0;

    vec3 col = vec3(0.0);
    col += u_color1 * turing * 1.5;
    col += u_color2 * (1.0 - turing) * pattern * 0.4;
    col += u_color2 * sparks * (0.5 + pulse_v * 0.5);
    col += u_color1 * 0.05 * (n3 + n4);

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.15 * length(uv - 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;
