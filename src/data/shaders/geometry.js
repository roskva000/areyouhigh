// ============================================================
// GEOMETRY SHADERS — 4 sub-shaders
// ============================================================

export const geometry_sacred = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_symmetry;
  uniform float u_complexity;
  uniform float u_pulse;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.2 * u_speed;

    vec3 col = vec3(0.0);

    // Flower of Life - overlapping circles
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float angle = fi * 1.047 + t * 0.1;
      float radius = 0.5 * u_complexity;
      vec2 center = i == 0 ? vec2(0.0) : vec2(cos(angle), sin(angle)) * radius;

      float d = abs(length(uv - center) - radius);
      float circle = 0.003 / (d + 0.003);

      float pulse_v = sin(t * u_pulse * 2.0 + fi) * 0.5 + 0.5;
      vec3 c = mix(u_color1, u_color2, fi / 7.0 + pulse_v * 0.3);
      col += c * circle * u_intensity * 0.15;
    }

    // Golden ratio spiral
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float golden = 1.618;
    float spiral = abs(r - exp(a / (2.0 * 3.14159) * log(golden)) * 0.1);
    spiral = min(spiral, abs(r - exp((a + 6.28) / (2.0 * 3.14159) * log(golden)) * 0.1));
    float spiral_glow = 0.005 / (spiral + 0.005);
    col += u_color2 * spiral_glow * 0.3 * sin(t * 0.5) * 0.5 + 0.5;

    // Concentric sacred rings
    for (int i = 1; i < 6; i++) {
      float fi = float(i);
      float ring_r = fi * 0.2 * u_complexity;
      float ring = 0.002 / (abs(r - ring_r) + 0.002);
      float rotate = sin(a * u_symmetry + t * fi * 0.2) * 0.5 + 0.5;
      col += mix(u_color1, u_color2, rotate) * ring * 0.1 * u_intensity;
    }

    col = pow(col, vec3(0.8));
    col *= 1.0 - 0.2 * r;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const geometry_mandala = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_symmetry;
  uniform float u_complexity;
  uniform float u_pulse;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Multi-fold symmetry
    float sides = max(3.0, u_symmetry);
    float ma = mod(a, 6.28318 / sides) - 3.14159 / sides;
    ma = abs(ma);
    uv = vec2(cos(ma), sin(ma)) * r;

    vec3 col = vec3(0.0);

    // Recursive mandala layers
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      if (fi >= u_complexity * 3.0) break;

      uv = abs(uv) - 0.3 - fi * 0.05;
      uv *= rot(t * 0.15 + fi * 0.4);
      uv *= 1.15 + 0.05 * sin(t * u_pulse + fi);

      float d = length(uv);
      float ring = 0.003 / abs(d - 0.2);
      float cross_d = min(abs(uv.x), abs(uv.y));
      float cross = 0.002 / (cross_d + 0.002);
      float petal = 0.003 / abs(d - 0.15 * (1.0 + sin(atan(uv.y, uv.x) * 4.0 + t) * 0.3));

      vec3 layer_col = mix(u_color1, u_color2, fi / 8.0);
      float pulse_v = sin(t * u_pulse * 2.0 + fi * 0.8) * 0.5 + 0.5;

      col += layer_col * (ring + cross * 0.3 + petal * 0.2) * u_intensity * 0.12;
      col += layer_col * pulse_v * 0.02 * smoothstep(0.3, 0.0, d);
    }

    col *= smoothstep(2.0, 0.3, r);
    col = pow(col, vec3(0.75));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const geometry_grid = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_symmetry;
  uniform float u_complexity;
  uniform float u_pulse;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.2 * u_speed;

    // Slow rotation
    uv *= rot(t * 0.05);

    float scale = 3.0 + u_complexity * 5.0;
    vec2 grid = uv * scale;
    vec2 gid = floor(grid);
    vec2 gf = fract(grid) - 0.5;

    // Monolithic blocks with depth illusion
    float cell_h = hash(gid);
    float height = sin(t * u_pulse + cell_h * 6.28) * 0.5 + 0.5;

    // Grid lines
    float line = smoothstep(0.02, 0.0, min(abs(gf.x), abs(gf.y)));

    // Block face
    float face = smoothstep(0.5, 0.45, max(abs(gf.x), abs(gf.y)));

    // Cipher symbols inside blocks
    vec2 sym_uv = gf * 3.0;
    float sym = 0.0;
    float sym_id = hash(gid + 200.0);
    if (sym_id > 0.7) {
      sym = smoothstep(0.05, 0.0, abs(length(gf) - 0.2)); // circle
    } else if (sym_id > 0.4) {
      sym = smoothstep(0.05, 0.0, min(abs(gf.x), abs(gf.y))); // cross
    } else {
      sym = smoothstep(0.05, 0.0, abs(gf.x + gf.y)); // diagonal
    }

    // Rotation animation per cell
    float cell_rot = sin(t * 0.5 + cell_h * 6.28) * u_symmetry;

    vec3 col = vec3(0.0);
    col += u_color1 * line * 0.3;
    col += mix(u_color1, u_color2, height) * face * height * u_intensity * 0.3;
    col += u_color2 * sym * 0.4 * face * u_intensity;

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.25 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const geometry_orbital = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_symmetry;
  uniform float u_complexity;
  uniform float u_pulse;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    vec3 col = vec3(0.0);
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Orbital rings at different inclinations
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      if (fi >= u_complexity * 4.0) break;

      float orbit_r = 0.2 + fi * 0.12;
      float tilt = fi * 0.3 + t * 0.1;
      float speed_mod = 1.0 + fi * 0.3;

      // Elliptical orbit with tilt
      vec2 orbit_uv = uv;
      orbit_uv.y *= 1.0 + sin(tilt) * 0.5;
      float orbit_d = abs(length(orbit_uv) - orbit_r);
      float orbit_line = 0.002 / (orbit_d + 0.002);

      // Object on orbit
      float obj_angle = t * speed_mod + fi * 1.571;
      vec2 obj_pos = vec2(cos(obj_angle), sin(obj_angle) * (1.0 + sin(tilt) * 0.5)) * orbit_r;
      float obj = 0.01 / (length(uv - obj_pos) + 0.01);

      // Echo trail
      float echo = 0.0;
      for (int j = 1; j < 5; j++) {
        float fj = float(j);
        float echo_angle = obj_angle - fj * 0.15;
        vec2 echo_pos = vec2(cos(echo_angle), sin(echo_angle) * (1.0 + sin(tilt) * 0.5)) * orbit_r;
        echo += 0.003 / (length(uv - echo_pos) + 0.005) / fj;
      }

      float pulse_v = sin(t * u_pulse + fi * 1.0) * 0.5 + 0.5;
      vec3 orbit_col = mix(u_color1, u_color2, fi / 8.0);

      col += orbit_col * orbit_line * 0.15 * u_intensity;
      col += orbit_col * obj * u_intensity * 0.3 * (0.7 + pulse_v * 0.3);
      col += orbit_col * echo * 0.2 * u_symmetry;
    }

    // Central bright source
    float center = 0.02 / (r + 0.01);
    col += (u_color1 + u_color2) * 0.5 * center * 0.2;

    col = pow(col, vec3(0.8));
    gl_FragColor = vec4(col, 1.0);
  }
`;
