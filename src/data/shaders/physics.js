// ============================================================
// PHYSICS SHADERS — 4 sub-shaders
// ============================================================

export const physics_blackhole = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_gravity;
  uniform float u_bending;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Gravitational lensing
    float bend_strength = u_gravity * 0.3 / (r * r + 0.1);
    angle += bend_strength * u_bending;
    vec2 bent = vec2(cos(angle), sin(angle)) * r;

    // Accretion disk
    float disk_r = length(bent);
    float disk_angle = atan(bent.y, bent.x) + t * 0.5;
    float disk = 0.0;

    if (disk_r > 0.15 && disk_r < 1.2) {
      float ring = smoothstep(0.15, 0.3, disk_r) * smoothstep(1.2, 0.6, disk_r);
      float spiral = sin(disk_angle * 3.0 - log(disk_r) * 8.0 + t * 2.0) * 0.5 + 0.5;
      float detail = sin(disk_angle * 12.0 + disk_r * 20.0 - t * 5.0) * 0.3 + 0.7;
      disk = ring * (spiral * 0.6 + 0.4) * detail;
    }

    // Event horizon
    float shadow = smoothstep(0.15, 0.12, r);

    // Photon ring
    float photon_ring = 0.008 / (abs(r - 0.18) + 0.002);

    // Lensed background stars
    float stars = pow(hash(floor(bent * 50.0)), 20.0) * smoothstep(0.3, 0.5, r);

    vec3 col = vec3(0.0);
    vec3 disk_col = mix(u_color2 * 2.0, u_color1, disk_r * 1.5) * disk * u_intensity;
    col += disk_col;
    col += u_color2 * photon_ring * 0.5;
    col += vec3(stars) * 0.5;
    col *= (1.0 - shadow);

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const physics_wormhole = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_gravity;
  uniform float u_bending;

  mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * u_speed;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Warp into tunnel coordinates
    float tunnel_depth = 1.0 / (r + 0.05) + t * u_gravity;
    float tunnel_angle = a + tunnel_depth * 0.1 * u_bending;

    // Speed lines
    float lines = 0.0;
    for (int i = 0; i < 6; i++) {
      float la = a + float(i) * 1.047;
      float line = 0.002 / (abs(sin(la * 8.0 + tunnel_depth * 2.0)) + 0.01);
      lines += line * smoothstep(0.8, 0.0, r);
    }

    // Tunnel rings
    float rings = sin(tunnel_depth * 4.0) * 0.5 + 0.5;
    rings *= smoothstep(0.0, 0.2, r) * smoothstep(1.5, 0.3, r);

    // Doppler shift
    float doppler = sin(a * 2.0 + t) * 0.5 + 0.5;
    vec3 shift_col = mix(u_color1 * vec3(1.5, 0.5, 0.3), u_color2 * vec3(0.3, 0.5, 1.5), doppler);

    // Central glow
    float center_glow = 0.05 / (r + 0.02);

    vec3 col = vec3(0.0);
    col += shift_col * rings * u_intensity;
    col += u_color2 * lines * 0.3;
    col += mix(u_color1, u_color2, 0.5) * center_glow * 0.3;

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const physics_spacetime = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_gravity;
  uniform float u_bending;

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.3 * u_speed;

    // Lens distortion
    float r = length(uv);
    float distortion = u_gravity * 0.15 / (r * r + 0.2);
    vec2 distorted = uv * (1.0 + distortion * u_bending);

    // Space grid
    vec2 grid = distorted * 8.0;
    vec2 grid_id = floor(grid);
    vec2 grid_f = fract(grid) - 0.5;

    float line_x = smoothstep(0.02, 0.0, abs(grid_f.x));
    float line_y = smoothstep(0.02, 0.0, abs(grid_f.y));
    float grid_pattern = max(line_x, line_y);

    // Quantum foam bubbles
    float foam = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 pos = vec2(sin(t + fi * 2.1) * 0.5, cos(t * 0.8 + fi * 1.7) * 0.5);
      float bubble = 0.01 / (length(distorted - pos) + 0.01);
      foam += bubble * sin(t * 3.0 + fi * 1.5) * 0.5 + 0.5;
    }

    // Ripples
    float ripple = sin(r * 15.0 * u_gravity - t * 3.0) * exp(-r * 2.0);

    vec3 col = vec3(0.0);
    col += u_color1 * grid_pattern * 0.4 * (1.0 + ripple * u_intensity);
    col += u_color2 * foam * 0.1 * u_intensity;
    col += mix(u_color1, u_color2, distortion * 5.0) * distortion * 0.5;

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.3 * r;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const physics_temporal = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_gravity;
  uniform float u_bending;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    float t = u_time * u_speed;

    // Time slicing - different strips at different speeds
    float strip = floor(uv.x * (5.0 + u_gravity * 5.0));
    float strip_speed = 0.5 + hash(vec2(strip, 0.0)) * 2.0;
    float strip_phase = hash(vec2(strip, 1.0)) * 6.28;
    float local_time = t * strip_speed + strip_phase;

    // Droste-like recursion
    float r = length(centered);
    float a = atan(centered.y, centered.x);
    float droste = log(r) / (6.28 / u_bending) + local_time * 0.1;
    float droste_a = a / (6.28) + droste;

    vec2 recursive_uv = vec2(fract(droste_a), fract(droste));

    // Glass shatter effect
    float shatter = hash(floor(recursive_uv * (3.0 + u_gravity * 5.0)));
    float crack = smoothstep(0.02, 0.0, abs(fract(recursive_uv.x * 5.0) - 0.5));
    crack += smoothstep(0.02, 0.0, abs(fract(recursive_uv.y * 5.0) - 0.5));

    // Strip boundary glow
    float strip_edge = smoothstep(0.02, 0.0, abs(fract(uv.x * (5.0 + u_gravity * 5.0)) - 0.5));

    vec3 col = vec3(0.0);
    col += mix(u_color1, u_color2, shatter) * 0.4;
    col += u_color2 * crack * 0.3 * u_intensity;
    col += u_color1 * strip_edge * 0.5;
    col += mix(u_color1, u_color2, sin(local_time + r * 5.0) * 0.5 + 0.5) * 0.3;

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.2 * length(centered);
    gl_FragColor = vec4(col, 1.0);
  }
`;
