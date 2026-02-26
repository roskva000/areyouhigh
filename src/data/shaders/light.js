// ============================================================
// LIGHT SHADERS — 4 sub-shaders
// ============================================================

export const light_rays = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_refraction;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);vec2 f = fract(p);f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;
    float a = atan(uv.y, uv.x);
    float r = length(uv);

    // Volumetric rays from center
    float rays = 0.0;
    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float ray_a = fi * 0.524 + sin(t * 0.5 + fi) * 0.1;
      float ray = 0.003 / (abs(a - ray_a) + 0.003 + r * 0.1);
      ray *= smoothstep(1.5, 0.0, r);
      float fog = noise(vec2(a * 3.0 + fi, r * 5.0 - t)) * 0.5 + 0.5;
      rays += ray * fog * u_refraction;
    }

    // Fog scattering
    float fog_density = noise(uv * 3.0 + t * 0.2) * noise(uv * 7.0 - t * 0.1);
    fog_density *= smoothstep(1.5, 0.3, r);

    // Central source
    float source = 0.03 / (r + 0.01);

    vec3 col = vec3(0.0);
    col += mix(u_color1, u_color2, sin(a * 2.0 + t) * 0.5 + 0.5) * rays * u_intensity;
    col += u_color1 * fog_density * 0.3;
    col += (u_color1 + u_color2) * 0.5 * source * 0.2;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const light_prism = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_refraction;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    // Chromatic aberration - split RGB channels
    float offset = 0.02 * u_refraction * u_intensity;
    vec2 uv_r = uv + vec2(offset * sin(t), offset * cos(t));
    vec2 uv_g = uv;
    vec2 uv_b = uv - vec2(offset * sin(t), offset * cos(t));

    // Prism geometry
    float prism = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float a = t * 0.2 + fi * 1.257;
      vec2 dir = vec2(cos(a), sin(a));
      prism += 0.005 / (abs(dot(uv, dir) - sin(t * 0.5 + fi)) + 0.005);
    }

    // Rainbow dispersion
    float r_ch = length(uv_r);
    float g_ch = length(uv_g);
    float b_ch = length(uv_b);

    float rainbow_r = sin(r_ch * 10.0 - t * 2.0) * 0.5 + 0.5;
    float rainbow_g = sin(g_ch * 10.0 - t * 2.0 + 2.09) * 0.5 + 0.5;
    float rainbow_b = sin(b_ch * 10.0 - t * 2.0 + 4.19) * 0.5 + 0.5;

    vec3 rainbow = vec3(rainbow_r, rainbow_g, rainbow_b);
    rainbow *= smoothstep(1.5, 0.0, length(uv));

    // Iridescence
    float angle = atan(uv.y, uv.x);
    float irid = sin(angle * 3.0 + length(uv) * 8.0 + t) * 0.5 + 0.5;

    vec3 col = vec3(0.0);
    col += rainbow * prism * 0.3;
    col += mix(u_color1, u_color2, irid) * prism * 0.2 * u_intensity;
    col += u_color2 * rainbow * 0.15;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const light_bloom = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_refraction;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * u_speed;

    vec3 col = vec3(0.0);

    // Multiple neon bloom sources
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float phase = fi * 0.785 + t * 0.3;
      vec2 pos = vec2(
        sin(phase) * (0.4 + 0.2 * sin(t * 0.5 + fi)),
        cos(phase * 0.7) * (0.4 + 0.2 * cos(t * 0.3 + fi))
      );

      float d = length(uv - pos);
      float bloom = 0.02 / (d + 0.01);
      float halo = exp(-d * 3.0) * 0.5;

      vec3 point_col = mix(u_color1, u_color2, fi / 8.0);

      // Strobe effect
      float strobe = sin(t * (3.0 + fi * 0.5) * u_refraction) * 0.5 + 0.5;
      strobe = pow(strobe, 2.0);

      col += point_col * (bloom + halo) * strobe * u_intensity * 0.4;
    }

    // Phosphorescent trails
    float trail_a = atan(uv.y, uv.x);
    float trail = sin(trail_a * 8.0 - t * 3.0) * 0.5 + 0.5;
    trail *= exp(-length(uv) * 2.0) * u_intensity;
    col += u_color2 * trail * 0.2;

    col = pow(col, vec3(0.8));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const light_mirror = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_refraction;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.2 * u_speed;

    // Kaleidoscope folding
    float sides = 4.0 + u_refraction * 6.0;
    float a = atan(uv.y, uv.x);
    float r = length(uv);

    a = mod(a, 6.28318 / sides) - 3.14159 / sides;
    a = abs(a);
    uv = vec2(cos(a), sin(a)) * r;

    // Aurora curtains
    vec3 col = vec3(0.0);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      uv = abs(uv) - 0.3;
      uv *= rot(t * 0.15 + fi * 0.3);

      float wave = sin(uv.x * 8.0 + t * (1.0 + fi * 0.2)) * 0.5 + 0.5;
      float curtain = 0.005 / (abs(uv.y - wave * 0.2) + 0.005);

      vec3 aurora_col = mix(u_color1, u_color2, fi / 6.0);
      aurora_col *= 0.5 + 0.5 * sin(vec3(fi * 0.8, fi * 1.2, fi * 1.6) + t);

      col += aurora_col * curtain * u_intensity * 0.15;
    }

    // Lens flare at intersections
    float flare = 0.01 / (length(uv) + 0.01);
    col += (u_color1 + u_color2) * 0.5 * flare * 0.1;

    col = pow(col, vec3(0.8));
    col *= 1.0 - 0.2 * r;
    gl_FragColor = vec4(col, 1.0);
  }
`;
