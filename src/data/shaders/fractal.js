// ============================================================
// FRACTAL SHADERS — 4 sub-shaders
// ============================================================

export const fractal_mandelbrot = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_detail;
  uniform float u_scale;
  uniform float u_flow;

  vec3 pal(float t, vec3 a, vec3 b) {
    return a + b * cos(6.28318 * (t * vec3(1.0, 0.8, 0.6) + vec3(0.0, 0.1, 0.2)));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float t = u_time * 0.05 * u_flow * u_speed;
    float zoom = 1.0 / (u_scale * (1.0 + t * 0.5));
    vec2 center = vec2(-0.745, 0.186) + vec2(sin(t * 0.3), cos(t * 0.2)) * 0.01;

    vec2 c = uv * zoom + center;
    vec2 z = c;

    float iter = 0.0;
    float maxIter = 40.0 + u_detail * 60.0;
    float trap = 1e10;
    float trap2 = 1e10;

    for (int i = 0; i < 200; i++) {
      if (float(i) >= maxIter) break;
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      float d = dot(z, z);
      trap = min(trap, abs(z.x - z.y));
      trap2 = min(trap2, abs(z.x + z.y));
      if (d > 256.0) break;
      iter += 1.0;
    }

    float smooth_i = iter - log2(log2(dot(z, z))) + 4.0;
    float f = smooth_i / maxIter;

    vec3 col = vec3(0.0);
    if (iter < maxIter) {
      vec3 c1 = pal(f * 2.0 + u_time * 0.02, u_color1, u_color2);
      float orbit = 1.0 - clamp(trap * 4.0, 0.0, 1.0);
      float orbit2 = 1.0 - clamp(trap2 * 4.0, 0.0, 1.0);
      col = c1 + orbit * u_color2 * 0.5 * u_intensity + orbit2 * u_color1 * 0.3;
      col *= smoothstep(maxIter, 0.0, iter) * 1.5;
    }

    col = pow(col, vec3(0.85));
    col *= 1.0 - 0.3 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fractal_julia = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_detail;
  uniform float u_scale;
  uniform float u_flow;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv *= 1.5 / u_scale;

    float t = u_time * 0.15 * u_flow * u_speed;
    vec2 c = vec2(
      0.38 * cos(t * 0.7) - 0.2 * sin(t * 0.3),
      0.28 * sin(t * 0.5) + 0.15 * cos(t * 0.9)
    );

    vec2 z = uv;
    float iter = 0.0;
    float maxIter = 30.0 + u_detail * 50.0;
    float orbit_trap = 1e10;

    for (int i = 0; i < 150; i++) {
      if (float(i) >= maxIter) break;
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      orbit_trap = min(orbit_trap, length(z - vec2(0.0, 0.0)));
      if (dot(z, z) > 256.0) break;
      iter += 1.0;
    }

    float smooth_i = iter - log2(log2(dot(z, z))) + 4.0;
    float f = smooth_i / maxIter;

    vec3 col = vec3(0.0);
    if (iter < maxIter) {
      float h = f * 3.0 + u_time * 0.05;
      col = 0.5 + 0.5 * cos(6.28 * (h + vec3(0.0, 0.33, 0.67)));
      col *= mix(u_color1, u_color2, f);
      float trap_col = 1.0 - clamp(orbit_trap * 2.0, 0.0, 1.0);
      col += trap_col * u_color2 * u_intensity * 0.6;
      col *= 1.5;
    }

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.25 * length(uv * 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fractal_sierpinski = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_detail;
  uniform float u_scale;
  uniform float u_flow;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  float sierpinski(vec2 p, float time) {
    float scale = 1.0;
    float d = 0.0;
    p *= u_scale;

    for (int i = 0; i < 12; i++) {
      if (float(i) >= 4.0 + u_detail * 8.0) break;
      p *= 2.0;
      scale *= 2.0;
      p = abs(p) - 1.0;
      if (p.x < p.y) p = p.yx;
      p -= 0.5;
      p *= rot(time * 0.1 * u_flow + float(i) * 0.2);
      d = min(d, -(length(p) - 0.5) / scale);
    }
    return d;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    uv *= rot(t * 0.05);

    float d = sierpinski(uv, t);

    vec3 col = vec3(0.0);
    float edge = 0.003 / abs(d + 0.01);
    float glow = 0.01 / abs(d + 0.005);

    vec3 edgeCol = mix(u_color1, u_color2, sin(d * 50.0 + t) * 0.5 + 0.5);
    col += edgeCol * edge * 0.5;
    col += u_color2 * glow * 0.2 * u_intensity;

    if (d < 0.0) {
      float interior = abs(d) * 20.0;
      col += mix(u_color1, u_color2, sin(interior + t) * 0.5 + 0.5) * 0.3;
    }

    col = pow(col, vec3(0.8));
    col *= 1.0 - 0.3 * length(uv);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fractal_ifs = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_detail;
  uniform float u_scale;
  uniform float u_flow;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  vec3 pal(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.15 * u_speed * u_flow;

    uv *= 0.5 + 0.2 * sin(t * 0.3);
    uv *= u_scale;

    vec3 col = vec3(0.0);
    float d = length(uv);

    for (int i = 0; i < 12; i++) {
      if (float(i) >= 4.0 + u_detail * 6.0) break;
      uv = abs(uv) - 0.5;
      uv *= rot(t * 0.2 + float(i) * 0.618 * u_intensity);
      uv *= 1.15 + 0.05 * sin(t + float(i));

      float thickness = 0.002 / abs(length(uv) - 0.2);
      float thickness2 = 0.001 / abs(uv.x);
      float thickness3 = 0.001 / abs(uv.y);

      vec3 c = pal(float(i) * 0.08 + d * 0.5 + t * 0.1) * mix(u_color1, u_color2, float(i) / 10.0);
      col += c * thickness;
      col += c * (thickness2 + thickness3) * 0.3;
    }

    col *= smoothstep(1.8, 0.3, length(uv));
    col = pow(col, vec3(0.75));
    gl_FragColor = vec4(col, 1.0);
  }
`;
