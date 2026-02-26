// ============================================================
// SPECIAL EXPERIENCES SHADERS — Extracted from standalone files
// ============================================================

// --- 1. THE ABYSS (Mandelbulb) ---
export const special_abyss = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  #define MAX_STEPS 80
  #define MAX_DIST 15.0
  #define SURF_DIST 0.002

  // Palette
  vec3 palette(float t) {
      t = fract(t + u_time * 0.05 * u_speed);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  // Mandelbulb Distance Estimator
  vec2 opMandelbulb(vec3 p) {
      vec3 z = p;
      float dr = 1.0;
      float r = 0.0;
      float iters = 0.0;
      // Complexity controls the power of the bulb
      float power = 3.0 + u_complexity * 2.0 + sin(u_time * 0.1 * u_speed) * 1.5;

      for (int i = 0; i < 12; i++) {
          r = length(z);
          if (r > 2.0) break;

          float theta = acos(z.z/r);
          float phi = atan(z.y, z.x);
          dr = pow(r, power-1.0)*power*dr + 1.0;

          float zr = pow(r, power);
          theta = theta*power;
          phi = phi*power;

          z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
          z += p;
          iters++;
      }
      return vec2(0.5*log(r)*r/dr, iters);
  }

  float GetDist(vec3 p) {
      return opMandelbulb(p).x;
  }

  vec3 GetNormal(vec3 p) {
      float d = GetDist(p);
      vec2 e = vec2(0.005, 0);
      vec3 n = d - vec3(
          GetDist(p-e.xyy),
          GetDist(p-e.yxy),
          GetDist(p-e.yyx)
      );
      return normalize(n);
  }

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
  float rand(float n){return fract(sin(n) * 43758.5453123);}

  void main() {
      // Glitch Screen Space Distortion
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (rand(uv.y * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Setup
      vec3 ro, rd;
      float t = u_time * u_speed * 0.5;

      if (u_camera_mode < 0.5) {
          // Cinematic Pan
          ro = vec3(1.8 * sin(t*0.5), 1.2 * cos(t*0.3), -2.5 + sin(t*0.2));
          vec3 lookat = vec3(0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * 1.5);
      } else if (u_camera_mode < 1.5) {
          // Free Fall (slowed down)
          ro = vec3(0.0, 0.0, 3.0 - t * 0.5);
          ro.z = mod(ro.z + 6.0, 12.0) - 6.0;
          rd = normalize(vec3(uv, -1.5));
          float angle = t * 0.2;
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          rd.xy *= rot;
          ro.xy *= rot;
      } else {
          // Chaotic Orbit
          ro = vec3(sin(t*1.5)*2.0, cos(t*1.7)*2.0, sin(t*0.9)*2.5);
          vec3 lookat = vec3(sin(t*2.0)*0.5, cos(t*1.2)*0.5, 0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * mix(0.8, 1.8, sin(t*3.0)*0.5+0.5));
      }

      // Raymarching Loop
      float dO = 0.0;
      float iters = 0.0;
      vec3 p;
      for(int i=0; i<MAX_STEPS; i++) {
          p = ro + rd * dO;
          vec2 dS = opMandelbulb(p);
          dO += dS.x;
          iters = dS.y;
          if(dO > MAX_DIST || dS.x < SURF_DIST) break;
      }

      vec3 col = vec3(0.0);

      if(dO < MAX_DIST) {
          vec3 n = GetNormal(p);
          vec3 l = normalize(vec3(1.0, 1.0, -1.0));

          float dif = clamp(dot(n, l), 0.0, 1.0);
          float ao = clamp(1.0 - iters/20.0, 0.0, 1.0);

          vec3 baseColor = palette(length(p) * 0.4 + iters*0.08);

          if (u_blend_mode < 0.5) {
              // Neon Additive
              col = baseColor * dif * ao * u_intensity * 1.5;
              col += baseColor * pow(iters/12.0, 2.0) * u_intensity * 1.2; // Glowing crevices
          } else {
              // Dark Subtractive
              col = baseColor * dif * ao * u_intensity * 0.8;
              col = mix(col, vec3(0.0), iters/15.0); // Shadowed depths
          }
      } else {
          col = u_blend_mode < 0.5 ? vec3(0.02) : vec3(0.05); // Background
      }

      // Stardust Overlay
      if (u_stardust > 0.0) {
          vec3 sp = ro + rd * (dO < MAX_DIST ? dO * 0.5 : 5.0);
          float dust = fract(sin(dot(floor(sp*10.0), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          if (dust > 0.99 - (u_stardust * 0.05)) {
              float starIntensity = sin(u_time * 10.0 * u_speed + dust * 100.0) * 0.5 + 0.5;
              col += vec3(starIntensity) * u_stardust * palette(dust);
          }
      }

      // RGB Glitch / Chromatic Aberration
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += rand(uv.y * 10.0) * u_glitch * 2.0;
          col.b += rand(uv.y * 12.0) * u_glitch * 2.0;
      }

      // Fog & Depth
      col = mix(col, vec3(0.0), 1.0 - exp(-0.05 * dO * dO));

      // Tone mapping & Gamma
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
  }
`;

// --- 2. LIQUID CHROME (FluidExperience) ---
export const special_fluid = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  // Simplex noise (2D)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p) {
      float f = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      float iters = 4.0 + floor(u_complexity); // Scales with lobby complexity
      for(float i=0.0; i<12.0; i++) {
          if(i>=iters) break;
          f += amp * snoise(p * freq);
          p *= rot(1.1);
          freq *= 2.0;
          amp *= 0.5;
      }
      return f;
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      float t = u_time * u_speed * 0.5;

      // Glitch distortion
      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (hash(uv.yy * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Modes
      if (u_camera_mode > 0.5 && u_camera_mode < 1.5) {
          // Free fall - gentle zoom pulse
          uv *= 1.0 / (1.0 + mod(t*0.15, 2.0));
      } else if (u_camera_mode > 1.5) {
          // Chaotic - swirling
          uv *= rot(sin(t)*0.5);
          uv *= 1.0 + sin(t*2.0)*0.2;
      } else {
          // Cinematic - simple rotation
          uv *= rot(t * 0.1);
          uv *= 1.2;
      }

      // Domain Warping for Liquid Chrome
      vec2 q = vec2(fbm(uv + vec2(0.0, t*0.2)), fbm(uv + vec2(5.2, 1.3 - t*0.2)));
      vec2 r = vec2(fbm(uv + 4.0*q + vec2(1.7, 9.2) + t*0.5),
                    fbm(uv + 4.0*q + vec2(8.3, 2.8) - t*1.2));

      // Calculate normal from height map for fake 3D lighting
      float h = fbm(uv + r * u_intensity * 2.0);
      float e = 0.005;
      float hx = fbm(uv + vec2(e,0) + r * u_intensity * 2.0);
      float hy = fbm(uv + vec2(0,e) + r * u_intensity * 2.0);
      vec3 n = normalize(vec3(hx-h, hy-h, e*8.0));

      // Lighting
      vec3 lightVec = normalize(vec3(1.0, 1.0, 2.0));
      float dif = clamp(dot(n, lightVec), 0.0, 1.0);
      float spec = pow(clamp(dot(reflect(-lightVec, n), vec3(0,0,1)), 0.0, 1.0), 32.0);

      vec3 baseCol = palette(h + t*0.2 + length(q));

      vec3 col = vec3(0.0);

      if (u_blend_mode < 0.5) {
          // Additive Neon Mode
          col = baseCol * dif * 1.5 + vec3(spec)*u_intensity;
          col += baseCol * h * u_intensity * 1.5; // Emissive liquid core
      } else {
          // Subtractive Dark Chrome Mode
          col = baseCol * dif * 0.8 + vec3(spec)*u_intensity;
          float shadow = smoothstep(0.0, 0.5, h);
          col *= mix(0.1, 1.0, shadow);
      }

      // Stardust Overlay
      if (u_stardust > 0.0) {
          float dust = hash(uv * 100.0 + t);
          if (dust > 0.99 - u_stardust * 0.01) {
              col += vec3(sin(t * 20.0 + dust*100.0)*0.5+0.5) * u_stardust * 2.0 * palette(dust);
          }
      }

      // RGB Separation
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += hash(uv.yx * 15.0) * u_glitch;
          col.b += hash(uv.xy * 17.0) * u_glitch;
      }

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
  }
`;

// --- 3. SACRED GEOMETRY (FractalExperience) ---
export const special_fractal = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  #define MAX_STEPS 90
  #define MAX_DIST 20.0
  #define SURF_DIST 0.002

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t + u_time * 0.05 * u_speed);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  // 3D KIFS (Kaleidoscopic Iterated Function System)
  vec2 opKIFS(vec3 p) {
      // scale iteration depth with complexity
      float iters = 3.0 + floor(u_complexity);
      float s = 2.0;

      // Dynamic twisting based on time
      float t = u_time * u_speed * 0.2;
      p.xy *= rot(t);
      p.yz *= rot(t*0.5);

      for(float i = 0.0; i < 15.0; i++) {
          if (i >= iters) break;
          // Fold
          p = abs(p) - vec3(1.2, 1.2, 1.2) * (1.0 + sin(t*0.5)*0.2 * u_intensity);
          // Rotate
          p.xy *= rot(0.5);
          p.xz *= rot(0.3 + t*0.1);
          p.yz *= rot(0.2);
          // Scale
          p *= s;
      }
      float d = length(p) * pow(s, -iters) - 0.02;
      return vec2(d, pow(s, -iters)); // x = distance, y = weight
  }

  float GetDist(vec3 p) {
      return opKIFS(p).x;
  }

  vec3 GetNormal(vec3 p) {
      float d = GetDist(p);
      vec2 e = vec2(0.002, 0);
      vec3 n = d - vec3(
          GetDist(p-e.xyy),
          GetDist(p-e.yxy),
          GetDist(p-e.yyx)
      );
      return normalize(n);
  }

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float rand(float n){return fract(sin(n) * 43758.5);}

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (rand(uv.y * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      vec3 ro, rd;
      float t = u_time * u_speed * 0.5;

      if (u_camera_mode < 0.5) {
          ro = vec3(3.0 * sin(t*0.5), 1.0, 3.0 * cos(t*0.5));
          vec3 lookat = vec3(0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * 1.5);
      } else if (u_camera_mode < 1.5) {
          ro = vec3(0.0, 0.0, 6.0 - t * 0.8);
          ro.z = mod(ro.z + 8.0, 16.0) - 8.0;
          rd = normalize(vec3(uv, -1.5));
          rd.xy *= rot(t*0.2);
      } else {
          ro = vec3(sin(t*1.5)*3.5, cos(t*1.1)*2.5, sin(t*0.7)*3.5);
          vec3 lookat = vec3(sin(t*2.0), 0.0, 0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * mix(0.8, 1.8, sin(t*2.0)*0.5+0.5));
      }

      float dO = 0.0;
      vec3 p;
      float min_dist = 1000.0;
      for(int i=0; i<MAX_STEPS; i++) {
          p = ro + rd * dO;
          vec2 dS = opKIFS(p);
          dO += dS.x;
          min_dist = min(min_dist, dS.x);
          if(dO > MAX_DIST || dS.x < SURF_DIST) break;
      }

      vec3 col = vec3(0.0);

      if(dO < MAX_DIST) {
          vec3 n = GetNormal(p);
          vec3 l = normalize(vec3(1.0, 1.0, -1.0));
          float dif = clamp(dot(n, l), 0.0, 1.0);
          float ao = clamp(1.0 - dO/MAX_DIST, 0.0, 1.0);

          vec3 baseColor = palette(length(p) * 0.2 + t*0.1);

          if (u_blend_mode < 0.5) {
              col = baseColor * dif * ao * u_intensity * 1.5;
              col += baseColor * pow(dif, 4.0) * u_intensity; // Highlights
          } else {
              col = baseColor * dif * ao * u_intensity;
              col = mix(col, vec3(0.0), length(p)*0.15); // Subtractive dark edges
          }
      } else {
          // Glow around edges (ray passing close to surface)
          float glow = clamp(1.0 - min_dist * 4.0, 0.0, 1.0);
          col += palette(length(uv)*0.5) * glow * u_intensity * 0.6;
          col += u_blend_mode < 0.5 ? vec3(0.02) : vec3(0.0);
      }

      if (u_stardust > 0.0) {
          vec3 sp = ro + rd * (dO < MAX_DIST ? dO * 0.8 : 8.0);
          float dust = fract(sin(dot(floor(sp*15.0), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          if (dust > 0.99 - (u_stardust * 0.05)) {
              float starIntensity = sin(u_time * 15.0 * u_speed + dust * 100.0) * 0.5 + 0.5;
              col += vec3(starIntensity) * u_stardust * palette(dust);
          }
      }

      if (u_glitch > 0.0 && hash(uv + u_time) > 0.92) {
          col.r += rand(uv.y * 15.0) * u_glitch * 1.5;
          col.b += rand(uv.y * 17.0) * u_glitch * 1.5;
      }

      col = mix(col, vec3(0.0), 1.0 - exp(-0.06 * dO * dO));
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
  }
`;

// --- 4. INFINITE KALEIDOSCOPE (MandalaExperience) ---
export const special_mandala = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      vec2 uv0 = uv; // Original UV for distance fading

      float t = u_time * u_speed * 0.2;

      // Glitch Screen Distortion
      if (u_glitch > 0.0) {
          if (hash(uv * t) < u_glitch * 0.05) {
              uv.x += (hash(uv.yy * 20.0 + t) - 0.5) * u_glitch * 0.1;
          }
      }

      // Camera Handling
      if (u_camera_mode < 0.5) {
          // Cinematic pan & zoom
          uv *= 1.5 + sin(t)*0.2;
          uv *= rot(t*0.5);
      } else if (u_camera_mode < 1.5) {
          // Freefall / smooth infinite zoom
          uv *= mix(0.5, 1.5, fract(t * 0.15));
          uv *= rot(t*0.3);
      } else {
          // Chaotic
          uv *= rot(sin(t*2.0));
          uv.x += sin(t)*0.2;
          uv.y += cos(t*1.3)*0.2;
      }

      vec3 finalColor = vec3(0.0);
      float iters = 2.0 + floor(u_complexity); // 2 to 6 iterations

      // Kaleidoscopic Fractal loop
      for (float i = 0.0; i < 6.0; i++) {
          if (i >= iters) break;

          uv = fract(uv * 1.5) - 0.5;

          // Kaleidoscopic folding
          float angle = atan(uv.y, uv.x);
          float r = length(uv);

          // Segments based on complexity
          float segments = 6.0 + floor(u_complexity) * 2.0;
          angle = mod(angle, 6.28318 / segments);
          angle = abs(angle - 3.14159 / segments);

          uv = r * vec2(cos(angle), sin(angle));

          float d = length(uv) * exp(-length(uv0));
          vec3 col = palette(length(uv0) + i * 0.4 + t * 2.0);

          d = sin(d * 8.0 + t * 5.0) / 8.0;
          d = abs(d);
          d = pow(0.01 / max(d, 0.001), 1.2) * u_intensity;

          if (u_blend_mode < 0.5) {
              // Additive glowing contours
              finalColor += col * d;
          } else {
              // Subtractive / Dark Geometry
              finalColor += col * d * 0.5;
              finalColor = mix(finalColor, vec3(0.0), smoothstep(0.0, 0.5, length(uv)));
          }
      }

      // Stardust Overlay (Floating particles)
      if (u_stardust > 0.0) {
          float dust = hash(uv0 * 100.0 + t);
          if (dust > 0.98 - u_stardust * 0.02) {
              finalColor += vec3(1.0) * u_stardust * 2.0 * palette(dust);
          }
      }

      // RGB Separation Glitch
      if (u_glitch > 0.0 && hash(uv0 + u_time) > 0.95) {
          finalColor.r += u_glitch * 0.5;
          finalColor.b -= u_glitch * 0.5;
      }

      // Vignette
      finalColor *= smoothstep(1.5, 0.1, length(uv0));

      // Tone mapping
      finalColor = finalColor / (1.0 + finalColor);
      finalColor = pow(finalColor, vec3(0.4545));

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// --- 5. QUANTUM FIELD (ParticlesExperience) ---
// Note: This requires a VERTEX shader setup for GL_POINTS
export const special_particles_vertex = `
  attribute float a_id;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  varying float v_opacity;
  varying float v_depth;
  varying float v_id;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  float hash(float n) { return fract(sin(n) * 1e4); }

  void main() {
    float t = u_time * 0.5 * u_speed;
    float id_seed = a_id * 0.1337;
    v_id = id_seed;

    // Scale complexity mapped to particle field radius and density
    float comp = 1.0 + (u_complexity - 1.0) * 0.5;

    // Base chaotic orbit
    float r = 15.0 + sin(id_seed * 0.5) * 10.0 * comp;
    float angle = id_seed + t * (0.2 + hash(id_seed) * 0.8);

    vec3 p;
    // 3D Spherical Coordinate mapping + Chaos
    p.x = cos(angle) * sin(id_seed * 43.0) * r;
    p.y = sin(angle * 0.7) * cos(id_seed * 17.0) * r * 0.5;
    p.z = sin(angle) * sin(id_seed * 7.0) * r;

    // Add high-frequency noise based on intensity
    p.x += sin(t * 2.0 + id_seed * 12.1) * 3.0 * u_intensity;
    p.y += cos(t * 1.3 + id_seed * 8.7) * 3.0 * u_intensity;
    p.z += sin(t * 1.8 + id_seed * 3.1) * 3.0 * u_intensity;

    // Glitch explosion effect
    if (u_glitch > 0.0) {
        if (hash(id_seed + floor(t*5.0)) > 0.95 - u_glitch * 0.05) {
            p += (vec3(hash(id_seed), hash(id_seed*2.0), hash(id_seed*3.0)) - 0.5) * 40.0 * u_glitch;
        }
    }

    // Camera handling
    if (u_camera_mode < 0.5) {
        // Cinematic pan
        p.xy *= rot(sin(t*0.5)*0.5);
        p.xz *= rot(t*0.2);
    } else if (u_camera_mode < 1.5) {
        // Free fall / tunnel effect
        p.z -= mod(t * 40.0, 80.0) - 40.0;
        p.xy *= rot(t);
    } else {
        // Chaotic orbit
        p.xy *= rot(sin(t)*2.0);
        p.yz *= rot(cos(t*1.5)*1.5);
    }

    // Add Stardust field (independent particles scattered far)
    if (u_stardust > 0.0) {
        if (hash(id_seed*5.0) < u_stardust * 0.1) {
             p *= mix(1.0, 3.5, hash(id_seed*7.0)); // spread them wide
        }
    }

    // Project 3D to 2D
    float scale = 0.03 * (1.0 + u_intensity * 0.2);
    vec2 pos = p.xy * scale;
    pos.x *= u_resolution.y / u_resolution.x;

    // Perspective Depth
    float depth = p.z * 0.05 + 2.0;

    gl_Position = vec4(pos, 0.0, depth);

    // Point size depends on depth
    gl_PointSize = max(1.0, (10.0 / max(0.1, depth)) * (0.5 + u_intensity * 0.5) * comp);

    v_depth = depth;
    v_opacity = smoothstep(4.0, 0.0, depth);
  }
`;

export const special_particles_fragment = `
  precision highp float;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_time;
  uniform float u_blend_mode;
  uniform float u_stardust;
  uniform float u_glitch;

  varying float v_opacity;
  varying float v_depth;
  varying float v_id;

  vec3 palette(float t) {
    t = fract(t + u_time * 0.1);
    if (t < 0.33) return mix(u_color1, u_color2, t * 3.0);
    if (t < 0.66) return mix(u_color2, u_color3, (t - 0.33) * 3.0);
    return mix(u_color3, u_color1, (t - 0.66) * 3.0);
  }

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;

    vec3 col = palette(v_depth * 0.5 + v_id * 0.1);
    float alpha = smoothstep(0.5, 0.0, r) * v_opacity;

    if (u_blend_mode > 0.5) {
        // Subtractive / Dark Mode - make particles dark centers with bright edges
        float edge = smoothstep(0.2, 0.5, r);
        col = mix(vec3(0.0), col, edge);
        alpha *= 0.6; // reduce opacity for dark mode
    } else {
        // Additive Neon - bright glowing core
        col *= mix(2.5, 0.5, r * 2.0); // Boost brightness at center
    }

    if (u_glitch > 0.0) {
        if (fract(sin(v_id * 100.0 + u_time)) > 0.95) {
            col.r += u_glitch;
            col.g -= u_glitch * 0.5;
        }
    }

    if (u_blend_mode < 0.5) {
        // Premultiplied Alpha for additive blending
        gl_FragColor = vec4(col * alpha, alpha);
    } else {
        // Standard alpha for subtractive
        gl_FragColor = vec4(col, alpha);
    }
  }
`;

// --- 6. NEURAL PLEXUS (PlexusExperience) ---
export const special_plexus = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  vec2 hash22(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return fract(sin(p)*43758.5453);
  }

  // 2D Cellular noise for Plexus web / Neural Network
  vec2 voronoi(vec2 x, float t) {
      vec2 n = floor(x);
      vec2 f = fract(x);
      vec2 mg, mr;

      float md = 8.0;
      for (int j=-1; j<=1; j++) {
          for (int i=-1; i<=1; i++) {
              vec2 g = vec2(float(i),float(j));
              vec2 o = hash22(n + g);
              o = 0.5 + 0.5*sin(t + 6.2831*o); // animate nodes
              vec2 r = g + o - f;
              float d = dot(r,r);
              if (d < md) {
                  md = d;
                  mr = r;
                  mg = g;
              }
          }
      }

      // Edge distance calculation (Creates the lines!)
      md = 8.0;
      for (int j=-2; j<=2; j++) {
          for (int i=-2; i<=2; i++) {
              vec2 g = mg + vec2(float(i),float(j));
              vec2 o = hash22(n + g);
              o = 0.5 + 0.5*sin(t + 6.2831*o);
              vec2 r = g + o - f;
              if (dot(mr-r,mr-r)>0.00001) {
                  md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
              }
          }
      }
      return vec2(md, length(mr)); // x = edge distance, y = node distance
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      float t = u_time * u_speed * 0.5;

      // Glitch Distortion
      if (u_glitch > 0.0) {
          if (fract(sin(dot(uv, vec2(12.9898, 78.233)) + t)*43758.5453) < u_glitch * 0.05) {
              uv.y += (fract(sin(uv.x*20.0+t)) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Handling
      float zoom = 1.0;
      vec2 pan = vec2(0.0);

      if (u_camera_mode < 0.5) {
          // Cinematic pan and slow zoom
          uv *= rot(t*0.1);
          zoom = 1.0 + sin(t*0.3)*0.2;
          pan = vec2(sin(t*0.2), cos(t*0.15)) * 0.5;
      } else if (u_camera_mode < 1.5) {
          // Free fall - gentle depth zoom
          uv *= rot(t*0.2);
          zoom = 0.5 + fract(t*0.08)*2.5;
      } else {
          // Chaotic
          uv *= rot(sin(t)*1.5);
          zoom = 1.0 + sin(t*2.0)*0.5;
          pan = vec2(hash22(vec2(floor(t))), hash22(vec2(floor(t*1.2)))) * 0.2;
      }

      uv *= zoom;
      uv += pan;

      // Layered Voronoi for Plexus with Depth
      vec3 col = vec3(0.0);
      float layers = 2.0 + floor(u_complexity); // Scales from 2 to 6 layers

      for(float i=1.0; i<=6.0; i++) {
          if (i > layers) break;

          float scale = i * 2.5;

          // Parallax effect per layer
          vec2 layerPan = pan * (i * 0.5);
          vec2 v = voronoi((uv + layerPan) * scale, t * (1.0 + i*0.2));

          float edgeDist = v.x;
          float nodeDist = v.y;

          // Lines (Edges)
          float lineT = 0.012 / max(edgeDist, 0.001) * u_intensity;
          lineT = smoothstep(0.0, 1.0, lineT);

          // Nodes (Points)
          float nodeT = 0.02 / max(nodeDist, 0.001) * u_intensity;
          nodeT = pow(nodeT, 2.0); // Make glowing core intense

          vec3 layerCol = palette(i * 0.15 + t * 0.1);

          float depthFade = 1.0 / (i * 0.8); // far layers are dimmer and blurrier

          if (u_blend_mode < 0.5) {
              // Additive Neon System - Glowing web
              col += layerCol * lineT * depthFade;
              col += layerCol * nodeT * depthFade * 1.5;

              // Light connections
              col += layerCol * pow(1.0 - edgeDist, 8.0) * 0.2 * depthFade;
          } else {
              // Subtractive / Neural Dark Mode - dark lines over inverted colors
              vec3 darkBlood = layerCol * 0.4;
              col += darkBlood * lineT * depthFade;
              col = mix(col, vec3(0.0), nodeT * depthFade * 0.5); // Nodes carve out black spots
          }
      }

      // Stardust Overlay (Floating data packets)
      if (u_stardust > 0.0) {
          float dust = fract(sin(dot(uv*200.0, vec2(12.9, 78.2)))*43758.5);
          if (dust > 0.99 - u_stardust * 0.01) {
              col += palette(dust*10.0) * mix(0.5, 2.0, u_stardust) * (sin(t*10.0+dust*100.0)*0.5+0.5);
          }
      }

      // RGB Separation Glitch
      if (u_glitch > 0.0 && fract(sin(uv.y*10.0+t)*43758.5) > 0.95) {
          col.b += u_glitch * 0.5;
          col.r -= u_glitch * 0.2;
      }

      // Vignette
      col *= smoothstep(1.8, 0.1, length(uv/zoom - pan));

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
  }
`;

// --- 7. HYPER-SPACE TUNNEL (TunnelExperience) ---
export const special_tunnel = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  #define MAX_STEPS 80
  #define MAX_DIST 40.0
  #define SURF_DIST 0.005

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }

  // 3D Cyberpunk Tunnel
  vec2 map(vec3 p) {
      vec3 q = p;
      float t = u_time * u_speed;

      // Twist
      q.xy *= rot(q.z * 0.05 * u_intensity + t * 0.2);

      // Repetition along Z for tunnel panels
      q.z = mod(q.z, 2.0) - 1.0;

      // Base Octagon Tunnel
      float tunnel = length(max(abs(q.xy) - vec2(2.5), 0.0)) - 0.5;
      tunnel = max(tunnel, -length(q.xy) + 2.0); // inner carve

      float iters = floor(u_complexity);

      // Fractal sci-fi panelling (driven by complexity)
      float d = tunnel;
      if (u_complexity > 1.0) {
          vec3 p2 = q;
          for (float i = 0.0; i < 4.0; i++) {
              if (i >= iters) break;
              p2.xy = abs(p2.xy) - 0.5;
              p2.xy *= rot(0.785398); // 45 degrees
              float panel = sdBox(p2, vec3(0.2, 0.2, 1.5));
              d = max(d, -panel);
          }
      }

      // Neon Rings
      vec3 pRings = p;
      pRings.z = mod(pRings.z, 4.0) - 2.0;
      float rings = length(vec2(length(pRings.xy) - 2.2, pRings.z)) - 0.05;

      float matID = d < rings ? 1.0 : 2.0; // 1: walls, 2: neon rings
      float minDist = min(d, rings);

      return vec2(minDist, matID);
  }

  float GetDist(vec3 p) { return map(p).x; }

  vec3 GetNormal(vec3 p) {
      float d = GetDist(p);
      vec2 e = vec2(0.005, 0);
      vec3 n = d - vec3(
          GetDist(p-e.xyy),
          GetDist(p-e.yxy),
          GetDist(p-e.yyx)
      );
      return normalize(n);
  }

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float rand(float n){return fract(sin(n) * 43758.5);}

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      float t = u_time * u_speed * 0.5;

      // Glitch Screen Distortion
      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (rand(uv.y * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      vec3 ro, rd;

      if (u_camera_mode < 0.5) {
          // Cinematic Pan
          ro = vec3(sin(t)*0.5, cos(t*0.7)*0.5, t * 5.0);
          rd = normalize(vec3(uv, 1.5));
          rd.xy *= rot(sin(t*0.5)*0.2);
      } else if (u_camera_mode < 1.5) {
          // Fast flying / Free flow (slowed down)
          ro = vec3(0.0, 0.0, t * 4.0);
          rd = normalize(vec3(uv, 1.2));
          rd.xy *= rot(t*0.3);
      } else {
          // Chaotic Orbit/Bouncy (calmer)
          ro = vec3(sin(t*1.5)*1.0, cos(t*1.0)*1.0, t * 5.0);
          rd = normalize(vec3(uv, 1.2));
          rd.xy *= rot(sin(t*2.0)*0.3);
      }

      float dO = 0.0;
      vec2 dS;
      vec3 p;
      float min_ring_dist = 1000.0;

      // Raymarching Loop
      for(int i=0; i<MAX_STEPS; i++) {
          p = ro + rd * dO;
          dS = map(p);
          if (dS.y == 2.0) min_ring_dist = min(min_ring_dist, dS.x);
          dO += dS.x;
          if(dO > MAX_DIST || abs(dS.x) < SURF_DIST) break;
      }

      vec3 col = vec3(0.0);

      if(dO < MAX_DIST) {
          vec3 n = GetNormal(p);
          vec3 l = normalize(vec3(0.0, 0.0, 1.0)); // Light points down the tunnel

          float dif = clamp(dot(n, l), 0.0, 1.0);
          float ao = clamp(1.0 - dO/MAX_DIST, 0.0, 1.0);

          vec3 texCol = palette(p.z * 0.2 + t);

          if (dS.y == 2.0) {
              // Neon Rings
              col = texCol * u_intensity * 3.0; // Emissive
          } else {
              // Structural Walls
              if (u_blend_mode < 0.5) {
                  // Additive Neon System
                  col = texCol * dif * ao * u_intensity;
                  col += vec3(0.1) * max(0.0, dot(n, normalize(ro - p))); // Rim light
              } else {
                  // Subtractive Dark Metallic
                  col = texCol * dif * ao * u_intensity * 0.3;
                  col = mix(col, vec3(0.0), 1.0 - dif);
              }
          }
      }

      // Add volumetric glow for neon rings (Fake Subsurface / Scatter)
      float ringGlow = clamp(1.0 - min_ring_dist * 1.5, 0.0, 1.0);
      col += palette(dO * 0.1) * pow(ringGlow, 3.0) * u_intensity;

      // Depth Fog / Doppler Light Shift
      float fog = 1.0 - exp(-dO * 0.06);
      vec3 fogColor = palette(t * 2.0); // Colors shift fast indicating high speed
      col = mix(col, fogColor * (u_blend_mode < 0.5 ? 0.3 : 0.05), fog);

      // Cyber Stardust Overlay (Data particles rushing by)
      if (u_stardust > 0.0) {
          vec3 sp = ro + rd * (dO < MAX_DIST ? dO * 0.5 : MAX_DIST);
          float dust = hash(sp.xy * 10.0 + sp.z * 2.0);
          if (dust > 0.98 - u_stardust * 0.02) {
              col += palette(dust * 10.0) * vec3(1.0) * u_stardust * 2.5;
          }
      }

      // RGB Separation Glitch
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += rand(uv.y * 10.0) * u_glitch * 1.5;
          col.b += rand(uv.x * 12.0) * u_glitch * 1.5;
      }

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
  }
`;
