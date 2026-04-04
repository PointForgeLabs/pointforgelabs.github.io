# Plotter Studio Handoff

## What this is
A complete pen plotter generative art studio built as a standalone HTML app with React (CDN, no build system). All code exists in this repo under `plotter/`.

## File structure
```
plotter/
  index.html    - HTML shell, loads React CDN + 4 JS files
  core.js       - PRNG, HSL color, palettes, 12 math fields, image processing (Sobel edge detection), 9 shapes, 4 strange attractors
  features.js   - 3D surfaces, density masks, particle physics, field operators, spatial blending, shape morphing
  trace.js      - Particle tracing engine, Sl/Lbl UI components
  app.js        - Main PlotterStudio React component (state, rendering, SVG export, 5-tab UI)
  combined.html - Single-file version with everything inlined (use this if you want one file)
```

## To run locally
```
npx serve plotter
```
Then open http://localhost:3000

## Features implemented

### Original (preserved)
- Seeded PRNG, HSL-to-hex, palette generation (5 harmony modes)
- 8 preset palettes (Ocean, Sunset, Forest, Coral, Night, Earth, Neon, Mono)
- 12 math vector fields: spiral, noise, vortex, radial, wave, dipole, saddle, curl, attractor, gridwarp, mesh, topo
- Image upload with Sobel edge detection, Gaussian blur, luminance extraction
- 6 image field modes: edge follow, gradient, brightness, contour, stipple, hybrid
- Image+math blend mode
- 9 shape types: rect, circle, ellipse, tri, hex, diamond, line, dot, star
- Particle tracing with configurable count, step, max steps, spacing, size variation, jitter, margin
- 4 seeding modes: grid, random, halton, radial
- Fill modes: fill, stroke, both
- 11 paper sizes, portrait/landscape, dark/light preview
- SVG export (color and plotter-optimized)

### New features added
1. **Strange Attractors** - Lorenz, Rössler, Clifford, De Jong with 3D projection, per-attractor parameter sliders, iteration/dt/scale/rotation controls
2. **3D Surface Simulation** - 6 heightmap types (sine, terrain, saddle, fabric, peaks, ripple) with perspective projection
3. **Density Masking** - 9 mask types (circle, ring, noise, gradients, radial, diamond, stripes, checker) with threshold and invert
4. **Shape Morphing** - Shapes transform along flow by magnitude, distance, or angle
5. **Particle Physics** - Repulsion between particles + gravity wells with spatial hashing for performance
6. **Field Math Operators** - 7 operations (add, multiply, modulate, max, screen, warp, curl_add) to combine two fields
7. **Multi-field Spatial Blending** - 6 mask types (uniform, H/V gradient, radial in/out, noise) for math+image mixing

## Architecture notes
- No JSX - uses `React.createElement` throughout (aliased as `h`)
- `useState` aliased as `us`, `useEffect` as `ue`, `useRef` as `ur`, `useCallback` as `uc`
- All state in one PlotterStudio function component (~50 state variables)
- Canvas rendering via useEffect, shapes stored as SVG path strings
- The `doTrace` function is the core engine - traces particles through flow fields, places shapes
- Attractors bypass doTrace entirely - `renderAttractor` iterates equations and projects 3D→2D
- `buildField` composes the active field from source type + field operators + spatial blending

## UI structure
5 tabs in left sidebar (258px): Field | Shape | Mask | Color | Export
Canvas preview on right with paper size scaling.

## PowerShell setup script
To recreate plotter/index.html from scratch on a machine that doesn't have the files, save and run this as setup.ps1:

```powershell
New-Item -ItemType Directory -Force -Path plotter | Out-Null
# Then have Claude Code create the files from the descriptions above
# Or copy combined.html from this repo as plotter/index.html
```

## Git status
- Branch: claude/add-rng-color-utils-og1av
- 3 local commits, never pushed (GitHub App integration lacks write permission)
- To fix: install Claude/Anthropic GitHub App on the repo with write access, or push manually
