// ============================================================
// GLITCH SHADERS — 4 sub-shaders
// ============================================================

export const glitch_vhs = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_corruption;
  uniform float u_jitter;
  uniform float u_shift;

  float hash(float p) { return fract(sin(p * 127.1) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    // VHS tape tracking distortion
    float tracking = sin(uv.y * 50.0 + t * 10.0) * 0.001 * u_jitter;
    float big_warp = sin(uv.y * 3.0 + t * 0.5) * 0.02 * u_corruption;

    // Random horizontal glitch bands
    float band = floor(uv.y * 30.0);
    float band_hash = hash(band + floor(t * 5.0));
    float glitch_band = band_hash > (1.0 - u_corruption * 0.1) ? 1.0 : 0.0;
    float band_shift = (hash(band + floor(t * 8.0) + 100.0) - 0.5) * u_shift * 0.1 * glitch_band;

    vec2 distorted_uv = uv;
    distorted_uv.x += tracking + big_warp + band_shift;

    // Chromatic aberration (VHS color bleed)
    float aberr = 0.005 * u_jitter;
    float r = hash2(floor(distorted_uv * vec2(100.0, 50.0)) + floor(t * 3.0));
    float g = hash2(floor((distorted_uv + vec2(aberr, 0.0)) * vec2(100.0, 50.0)) + floor(t * 3.0));
    float b = hash2(floor((distorted_uv - vec2(aberr, 0.0)) * vec2(100.0, 50.0)) + floor(t * 3.0));

    // Scanlines
    float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.15 + 0.85;

    // Noise static
    float static_noise = hash2(uv * u_resolution.xy + t * 100.0) * 0.15 * u_corruption;

    vec3 col = vec3(0.0);
    col.r = mix(u_color1.r, u_color2.r, r) + static_noise;
    col.g = mix(u_color1.g, u_color2.g, g) + static_noise * 0.5;
    col.b = mix(u_color1.b, u_color2.b, b) + static_noise;
    col *= scanline;
    col *= u_intensity;

    // Color bleed
    col.r += glitch_band * 0.3 * u_color2.r;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const glitch_data = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_corruption;
  uniform float u_jitter;
  uniform float u_shift;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    // Pixel sorting effect - brightest pixels fall
    float block_size = 4.0 + u_corruption * 20.0;
    vec2 block = floor(uv * block_size);
    float block_hash = hash(block);

    // Determine if this column is "sorting"
    float sort_active = step(1.0 - u_corruption * 0.15, hash(vec2(block.x, floor(t * 2.0))));
    float sort_offset = sort_active * fract(t * u_shift * 0.5 + block_hash) * 0.5;

    vec2 sorted_uv = uv;
    sorted_uv.y = mod(sorted_uv.y - sort_offset, 1.0);

    // Databend blocks
    float macro_block = 8.0 + u_jitter * 16.0;
    vec2 mb = floor(sorted_uv * macro_block);
    float mb_hash = hash(mb + floor(t * 3.0));

    float databend = step(1.0 - u_jitter * 0.05, mb_hash);
    vec2 bent_uv = sorted_uv;
    if (databend > 0.5) {
      bent_uv.x = fract(bent_uv.x + hash(mb + 50.0) * 0.3);
    }

    // Ghost trails of previous frame
    float ghost = hash(floor(bent_uv * 100.0) + floor(t * 0.5)) * 0.3;
    float ghost_alpha = hash(floor(bent_uv * 100.0) + floor(t * 0.5) - 1.0) * 0.15;

    // Color output
    float brightness = hash(floor(bent_uv * block_size * 2.0) + floor(t));
    vec3 col = mix(u_color1, u_color2, brightness) * u_intensity;
    col += vec3(ghost_alpha) * u_color2;

    // Mosaic shatter
    float shatter = hash(floor(uv * (5.0 + u_shift * 10.0)) + floor(t * 0.3));
    col = mix(col, u_color2 * shatter, databend * 0.5);

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const glitch_matrix = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_corruption;
  uniform float u_jitter;
  uniform float u_shift;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float character(vec2 uv, float char_id) {
    // Approximate character rendering via hash-based pixel pattern
    vec2 grid = floor(uv * vec2(3.0, 5.0));
    if (grid.x < 0.0 || grid.x > 2.0 || grid.y < 0.0 || grid.y > 4.0) return 0.0;
    float pixel = step(0.5, hash(grid + char_id * 17.0));
    // Make it look more like characters
    float border = step(0.0, grid.x) * step(grid.x, 2.0) * step(0.0, grid.y) * step(grid.y, 4.0);
    return pixel * border;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    float cols = 30.0 + u_corruption * 30.0;
    float rows = cols * 2.0;

    vec2 grid_uv = uv * vec2(cols, rows);
    vec2 cell = floor(grid_uv);
    vec2 cell_uv = fract(grid_uv);

    // Column speed variation
    float col_speed = hash(vec2(cell.x, 0.0)) * 3.0 + 0.5;
    float col_offset = hash(vec2(cell.x, 1.0)) * 100.0;

    // Falling character position
    float fall = fract(t * col_speed * u_shift + col_offset);
    float row_pos = cell.y / rows;

    // Character changes over time
    float char_id = hash(cell + floor(t * u_jitter * 5.0));

    // Brightness based on distance from falling head
    float head_pos = fract(fall);
    float dist_from_head = mod(head_pos - row_pos + 1.0, 1.0);
    float trail = smoothstep(0.0, 0.4, dist_from_head) * smoothstep(0.8, 0.3, dist_from_head);
    float head = smoothstep(0.02, 0.0, dist_from_head);

    float char_vis = character(cell_uv, char_id);

    vec3 col = vec3(0.0);
    col += u_color1 * char_vis * trail * u_intensity * 0.8;
    col += u_color2 * char_vis * head * 2.0;
    col += u_color1 * 0.02 * char_vis; // Dim background chars

    // RAM corruption flashes
    float corrupt = step(1.0 - u_corruption * 0.03, hash(cell + floor(t * 20.0)));
    col += (u_color1 + u_color2) * corrupt * char_vis;

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const glitch_corrupt = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_corruption;
  uniform float u_jitter;
  uniform float u_shift;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed;

    // Screen tear - horizontal displacement
    float tear_pos = fract(t * 0.3 + 0.5);
    float tear_width = 0.05 * u_corruption;
    float in_tear = smoothstep(tear_pos - tear_width, tear_pos, uv.y)
                  * smoothstep(tear_pos + tear_width, tear_pos, uv.y);
    uv.x += in_tear * u_shift * 0.2 * sin(t * 10.0);

    // RGB channel split
    float split = u_jitter * 0.015;
    float r = noise((uv + vec2(split * sin(t), 0.0)) * 20.0 + t);
    float g = noise(uv * 20.0 + t * 1.1);
    float b = noise((uv - vec2(split * cos(t), 0.0)) * 20.0 + t * 0.9);

    // Block corruption
    float block_scale = 5.0 + u_corruption * 15.0;
    vec2 block = floor(uv * block_scale);
    float block_corrupt = step(1.0 - u_corruption * 0.08, hash(block + floor(t * 3.0)));

    // BSOD flash
    float bsod_flash = step(0.995, hash(vec2(floor(t * 2.0), 0.0))) * u_corruption;

    // Z-fighting geometric flicker
    float z_fight = sin(uv.x * 100.0 + t * 50.0) * sin(uv.y * 100.0 - t * 30.0);
    z_fight = step(0.99, abs(z_fight)) * u_jitter * 0.3;

    vec3 col = vec3(0.0);
    col.r = mix(u_color1.r, u_color2.r, r) * u_intensity;
    col.g = mix(u_color1.g, u_color2.g, g) * u_intensity;
    col.b = mix(u_color1.b, u_color2.b, b) * u_intensity;

    // Apply corruption
    col = mix(col, u_color2 * hash(block + 500.0), block_corrupt * 0.7);
    col += vec3(z_fight);
    col = mix(col, vec3(0.0, 0.0, 0.8), bsod_flash * 0.8); // BSOD blue flash

    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;
