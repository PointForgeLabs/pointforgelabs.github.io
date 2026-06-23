# Machine-Applied Plotter Painting — Research & Buildable Techniques

Scope: an AxiDraw/iDraw-class XY plotter that does **all** the painting itself, with a
brush / dip pen / paint marker in the holder. Media: **watercolor & water-soluble ink
washes** and **acrylic / gouache**. Goal: maximize **color and texture variability** from
a machine that nominally draws single-weight lines, and turn that into concrete features
for the generative SVG tool.

> **Evidence note.** Highest-confidence facts come from source code/docs fetched verbatim
> (Licia He's `painting_with_plotters` repo, vpype cookbook `.rst`, AxiDraw `axidraw_conf.py`,
> the EBB command set). Several art blogs (Amy Goodchild, eyesofpanda, Dirt Alley, penplotterartwork)
> 403-blocked direct fetch, so those claims are from search extracts — flagged where it matters.
> Independent agents converged on the same core model, which is the main cross-verification.

---

## 0. The one mental model

**Deposited opacity ≈ (paint currently loaded) ÷ (distance traveled since the last dip).**

Everything else is a corollary:
- The **first centimeter after a dip is the darkest**; a 3 cm continuous line is much darker
  than the third of three separate 1 cm lines. (Goodchild; Lars Wander)
- Tone is controlled primarily by **how far the brush travels between dips** ("refill distance"),
  *not* by pressure. Short refill distance → saturated/wet. Long → the charge depletes into a
  dry-brush fade. (Licia He, Lars Wander, eyesofpanda — corroborated 3×)
- "Pressure"/width on a height-only servo comes from **how low you drop the brush** (bristle splay),
  **how fast you move** (slow = more paint), and **mount angle** (flat brush = calligraphic).

If the generator models the paint reservoir as a depleting quantity and treats refill placement
as a first-class scheduling problem, almost every documented technique falls out of it.

---

## 1. What the research validates in the current tool

The tool already exports per-color layers, a paint-blob placement guide, brush-loading swirls,
and outward heavy-to-dry strokes. The literature confirms three of these and reframes one:

- **Brush-loading swirl** ✅ matches Licia He's `Inkwell.produce_ink_path` (serpentine through the
  well) + `alt_paths` stir pattern, and Goodchild's "draw an `o` in the well" stir.
- **Heavy-to-dry outward strokes** ✅ matches the depletion-gradient technique (let one charge fade).
- **Per-color layers** ✅ matches standard practice; needs the AxiDraw `!`/`+D`/`+S` layer-control
  encoding to actually trigger machine pauses and drying delays (see §5).
- **Paint-blob placement guide** ⚠️ This is the *acrylic* model (deposit a blob, drag it out).
  The dominant *watercolor/ink* model is different: a **fixed palette of wells at the edge of the
  bed**, and the brush **returns to a well** to recharge on a distance schedule. Both are valid —
  they're two different media workflows. The tool currently only implements the first.

---

## 2. Replenishment engine (the highest-impact thing to build)

This is the core of every documented watercolor/ink pipeline.

**2.1 Refill-distance chunking.** Split every path into chunks shorter than `refill_distance`;
insert a "go to well → stir/dip → return" action on each chunk seam. Flatten curves to ~3–5 px
segments before measuring length. Real parameters from source:
- Licia He `RefillGenerator`: `refill_dist = 200`, `path_unit_size = 5` (paths split into ~5-unit
  segments; broken mid-stroke when cumulative distance hits the quota; remainder re-queued).
- vpype paint recipe: `splitdist 1m` (coarse `splitdist 50cm`) inserts the dip pattern at a fixed
  cumulative distance; default dipping-script prompt is **15 cm max stroke length**.
- One documented project refilled **every 1 inch (2.54 cm)** → 15–24 hr plots.
- **Chunks must overlap slightly** or you get visible seams (Lars Wander).

**2.2 Wells & stations are fixed bed coordinates.** A palette registered to the bed: e.g. 5 cups in
a wooden template at the plot-area edge; vpype default = 7 color cells 15 mm × 20 mm + a water cup at
(150 mm, 20 mm), r = 5 mm. "Return to where you left off" = save pen pos → move to well → run the
stir sub-path → move back → resume at the next (overlapping) chunk start. Dips fall on chunk seams,
never mid-stroke.

**2.3 Two independent counters.**
- cumulative **distance** → triggers a **paint dip**.
- **stroke count** → triggers a **water rinse** (one real impl: rinse every 10 strokes, doing 3 dips
  in the water cup), and a **blot-on-towel** dab afterward to control dilution.
- **color/tool change** → forces a **cleaning-station pass** and resets the distance counter
  (Licia `get_cleaning_paths()`).

**2.4 Stir geometry is per-medium.** Settling media (watercolor, concentrated mixes, gouache) need an
active stir at the well (circle/rectangle/serpentine). Non-settling media (fountain ink, liquid
watercolor) need only a single dip dot — no stir. Make the refill sub-path a per-well template.

**2.5 Acrylic blob-and-drag analog (continuous offset fill).** The published all-machine acrylic
technique fills a region as **nested polygons stepped inward by < brush width, connected into one
continuous pen-down run** (no pen-up inside the fill). This avoids the touchdown blob and direction-change
artifacts — it's the structured version of "deposit and drag outward." (penplotterartwork)

---

## 3. Color & tonal variability

- **Refill distance = master tonal knob** (§2.1). Map target value per region → chunk length:
  short for saturated, long for dry fade.
- **Glazing / layers.** A "layer" = one continuous run; pause between layers to **dry**, clean brush,
  change color. Translucent washes build value and mixed color. A layer **must be dry** before the
  next or the brush smears it. Heavily glazed works run 10–300 hr.
- **Value via wells (pre-mix).** Multiple wells each at a different water:pigment ratio = a value
  ramp; toolpath picks the well per region (a "pen" = a well). Build the ramp dark→light; **mix
  darker than target** because watercolor dries back lighter.
- **On-paper mixing (wet ordering).** Schedule overlapping wet strokes of different wells inside one
  wet window to blend on paper; or pre-mix for predictable flats. Both are used deliberately.
- **Water-first blooms (Goodchild's signature).** Plot a shape in **clear water first**, then drop
  pigment into it so color spreads — a controlled bloom. Generate two layers: water paths slightly
  larger/ahead, pigment paths into the still-wet area, timing gap tuned (water glistening, not pooled).
- **Randomized stroke order** (opposite of travel optimization). Randomizing path order + refill
  distance "produced lovely texture with strokes of varying opacity," and spacing out neighbors gives
  wet regions drying time (prevents uncontrolled bleed). A scheduling constraint, not just a shuffle.
- **Hatching/cross-hatching density → value** (the ink route). Closer spacing = darker; add 45°/90°
  passes to deepen. ~4 hatch levels/angles already reads as continuous tone.
- **Region-level fade.** Remove the refill near the end of a plot so late regions come out lighter
  (depletion across a whole region, not one stroke).

Watercolor specifics: **300 gsm paper, stretched** (soak 10–20 min, staple/tape wet to a board, dry
before plotting) or washes buckle and ruin the Z reference. Masking fluid reserves whites (manual
pre-step). Granulating pigments speckle and bleed less; fine pigments flow — pigment choice tunes how
far a bloom spreads.

---

## 4. Texture

- **Break strokes to vary opacity** — every pen-up deposits extra paint; varying refill distance and
  stroke length self-textures. On **toothy (cold-press/rough) paper**, fast light strokes self-texture
  (dry-brush skipping); on **smooth (hot-press) paper** you must *insert pen-up gaps* to fake it.
- **Speed as texture.** Fast = thin/broken; slow = more deposition/pooling. AxiDraw `--const_speed`
  holds pen-down velocity constant to avoid end-of-line pooling; leaving acceleration **on** gives you
  **dark pooled accents at stroke ends/corners** on purpose.
- **Stippling/dabbing.** Each dot = pen-down → dwell `N` ms → pen-up; the **pen-down delay** sets dot
  size/darkness. Generate the point field from a luminance/density map (weighted Voronoi à la
  StippleGen), then TSP/spiral/greedy order to minimize travel; jitter to avoid regularity.
- **Bristle prep & mount angle** (hardware, but bounds the model): chop bristles short / use small firm
  flat shaders for a predictable mark; a flat brush mounted diagonally draws thin in `/`, thick in `\`
  — so stroke width becomes a function of heading.

---

## 5. Z-axis / width, layers, registration, failure modes

**Z reality.** The pen lift is **one RC servo with a full analog range**, not binary. AxiDraw exposes
`pen_pos_up` / `pen_pos_down` as **0–100 %** of travel (defaults differ between docs `40` and the
shipped `axidraw_conf.py` `30` — trust the conf file). Raw servo span `servo_min 9855` → `servo_max
27831` (83.3 ns units); 1 % ≈ 180 units. You can **change pen-down height mid-plot** (`ad.options.
pen_pos_down = N; ad.update()`); within-stroke width needs splitting the stroke into short segments
each with its own height + `update()`. Practical resolution of an SG90 ≈ **10–20 distinct positions**.
Smooth synchronized XY+Z tapers are **not** in the high-level API — they need low-level EBB timed moves.

**Width = f(height, speed, mount angle).** A height change of **a few mm markedly changes width/
darkness**. **No published height→width curve exists — it must be calibrated** per brush/paint/paper
and is strongly nonlinear. This is the single biggest unknown.

**Software width emulation (single fixed tool).** Convert a variable-width centerline into a **closed
offset ribbon** (offset ± width/2 along the path), then **hatch-fill the ribbon** at the pen's line
width; width variation → hatch density / number of parallel passes. (This reuses the tool's existing
multi-pass machinery.) vpype optimizes (`linemerge`/`linesort`/`reloop`) but has **no variable-width
primitive** — do the ribbon/offset upstream. Mapping SVG `stroke-width → Z` is a known DIY step
(GRBL-Plotter issue #127), not a standard.

**Layer control (compatibility win).** AxiDraw + NextDraw + vpype share one scheme:
- numeric prefix = plot **order** (low → high);
- layer name starting with **`!`** = **hardware pause** for pen/brush/color change (pen lifts, carriage
  stays put — does not re-home);
- **`+D<ms>`** = per-layer **delay** (drying / timelapse); **`+S<speed>`** = per-layer pen-down speed.
Emit these and the machine natively pauses to dip/swap/dry. (The tool already prefixes color layers
with `!` — extend with `+D`/`+S`.)

**Registration.** Dominant method: **don't move the paper** (tape 1/4–1/2″ artist tape or magnets);
per pen swap, plot a separate **registration-marks file** off to the side and re-seat the pen until it
lines up; **walk** commands offset a mis-centered tip. Stick to **one pen brand** so barrels match and
the paper never moves. AxiDraw home repeatability is "almost no variation" (no published mm spec).
Licia's pipeline bakes in `--register` (marks) and `--resume <index>` (restart after a dry/crash).

**Failure modes → design-arounds.**
- Dry mid-stroke → distance-limited refill + chunk splitting (§2).
- Marker skipping/clogging (Posca) → prime before every plot, re-prime on long runs, keep paths
  flowing, fix skips with a second pass of just those paths; recommended for short (<~1 hr) plots.
- Paper cockling → 300 gsm + stretch + immovable taped datum.
- Registration drift → never move paper, per-pen reg marks, consistent pen-down height, walk offsets.
- Servo burnout from frequent lifts (tiny brush) → expect to replace SG90-class servos under heavy use;
  brushless upgrade lifts faster/longer (narrower, faster band) but not higher resolution.

---

## 6. Tool / medium decision

| Tool | Dipping? | Width var | Texture | Toolpath implication |
|---|---|---|---|---|
| Round/flat watercolor brush | **Yes** (wells + stir) | height/speed/angle | **max** (dry-brush, splay) | full refill engine; calibrate height; tolerate inaccuracy |
| Dip / ruling pen | Yes (small reservoir) | nib | line work | dense refill nodes; flow tapers as nib empties |
| **Posca / Molotow marker** | **No** (valve, self-feed) | low | low–med | **drop all dip logic**; prime dab at pen-down; avoid long idle pen-up |
| Fude / refillable brush pen | No (self-feed) | some (flex, muted on plotter) | med | middle ground; width via angle/speed, no refills |
| Fineliner / gel pen | No | none | hatch only | per-color layers; one pen family for registration |
| Syringe (Axipaint) / high-flow | No (extrude) | bead width | impasto | extrude a bead then drag; no brush model |

For **acrylic/gouache specifically**, markers (Molotow ONE4ALL 2 mm) remove the replenishment problem
but lose the wet blob-and-drag look; a dipped brush keeps the look but needs the full §2 engine. The
continuous-offset fill (§2.5) is the best documented all-machine acrylic body-paint method.

---

## 7. Prioritized, difficulty-tagged backlog for the generator

Ordered by impact ÷ effort. Difficulty: 🟢 Easy · 🟡 Medium · 🔴 Hard.

**Tier 1 — core engine (do these first)**
1. 🟡 **Refill-distance chunking.** Split paths into ≤ `refill_distance` overlapping chunks; insert
   well→stir→return on each seam. Expose `refill_distance` as the master saturation control. *This is
   the foundational change; most of the rest depends on it.*
2. 🟡 **Edge palette + stations as bed coordinates.** Named wells + water + blot + clean stations;
   per-well stir template (circle/rect vs dot by medium). "Save pos → station → return" splicing.
3. 🟢→🟡 **Dual counters.** distance→paint dip, stroke-count→water rinse, color/tool-change→clean pass
   + counter reset.
4. 🟢 **AxiDraw layer encoding `+D`/`+S`.** Add drying delay + per-layer speed to the existing `!`
   color layers so the machine pauses to dip/swap and waits for drying. *Tiny change, big real-world payoff.*

**Tier 2 — variability & realism**
5. 🟡 **Per-region refill-distance modulation = tone.** Drive chunk length from a value/darkness field
   (short=dark/saturated, long=dry fade). Turns tone into a toolpath property.
6. 🟢→🟡 **Randomized / drying-aware stroke order** (toggle vs travel-optimized). Adds opacity texture
   and spaces neighbors so wet regions dry.
7. 🟡 **Water-first bloom layer.** Generate clear-water shapes slightly larger than pigment regions,
   ordered before pigment with a timing gap.
8. 🟡 **Acrylic continuous offset-spiral fill.** Replace back-and-forth hatch fill for body paint with
   one continuous inward-offset run.
9. 🟡 **Paint-reservoir preview.** Simulate deposition decay along stroke length in the on-screen
   preview so what you see ≈ what plots (and you can tune refill distance visually).

**Tier 3 — width, texture, robustness**
10. 🔴 **Variable-width via offset ribbon + hatch fill.** Centerline → ribbon polygon → hatch at pen
    width; width → density. High payoff, reuses multi-pass; hardest because robust polygon offset.
11. 🟡 **Z-height + speed transfer functions.** Map a "weight" param → `pen_pos_down` (quantize ~10–20
    steps) + per-stroke speed; deep-Z at wells; emit as metadata/`+S`. Needs a calibration LUT (ship a
    calibration-swatch generator to build it).
12. 🟢 **const_speed / pooling toggle.** Uniform (const_speed) vs deliberate dark pooled accents
    (acceleration on + sharp corners).
13. 🟡 **Stipple/dab mode.** Luminance→Voronoi point field, dwell = darkness, TSP/spiral ordering.
14. 🟢 **Paper-tooth flag.** Smooth → inject pen-up gaps to fake dry-brush; toothy → let speed self-texture.
15. 🟢→🟡 **Registration-marks layer + resume-by-index** for multi-pass alignment and dry-brush recovery.
16. 🟢 **Marker mode.** medium=marker → disable dip/well logic, add priming dab at pen-down, avoid long
    idle pen-ups.

---

## 8. Key gaps / things to verify on the bench
- **No published brush height→width curve.** Build a calibration swatch (sweep `pen_pos_down` × speed)
  and measure. Biggest unknown.
- **No numeric mileage table** by paint/dilution/brush. Only concrete numbers: 15 cm default, 2.54 cm
  example, "dip-draw-till-dry-measure." Calibrate per setup.
- **No numeric home-repeatability spec** for AxiDraw (only "almost no variation").
- **Light-to-dark vs dark-to-light layer order** is implied (translucent CMYK + drying delays) but not
  explicitly prescribed in a retrieved quote — verify.
- **u/4rvis "Lineage" and Sasha Trubetskoy**: no method writeup found; acrylic mechanics corroborated
  via penplotterartwork's offset-fill and Florian Markus's loaded-brush acrylic work instead.

---

## 9. Sources

**Source code / docs (verbatim, highest confidence)**
- Licia He, *Painting With Plotters* (refill algorithm, inkwells, cleaning, registration, resume):
  https://github.com/LiciaHe/painting_with_plotters — `PWP/Generator/RefillGenerator.py`,
  `PWP/Refiller/Refiller.py`, `PWP/Static/axidraw_template.py`
- vpype cookbook "plotting with paint" (`splitdist` dipping), layer/pen config:
  https://vpype.readthedocs.io/en/stable/cookbook.html · https://github.com/abey79/vpype ·
  https://github.com/plottertools/vpype-gcode
- AxiDraw servo config (`servo_min/max`, `pen_pos_down`, brushless band):
  https://github.com/evil-mad/axidraw/blob/master/inkscape%20driver/axidraw_conf.py
- AxiDraw CLI/Python API (const_speed, interactive update, pen heights): https://axidraw.com/doc/cli_api/
- EBB command set (servo `S2`, `SP`, `SC`): https://www.schmalzhaus.com/EBB/EBBCommands.html ·
  https://evil-mad.github.io/EggBot/ebb.html
- AxiDraw / NextDraw layer control (`!` pause, `+D`, `+S`, numeric order):
  https://wiki.evilmadscientist.com/AxiDraw_Layer_Control ·
  https://support.bantamtools.com/hc/en-us/articles/29473928061971-NextDraw-Layer-Control
- saxi (color-layer split, travel optimization): https://github.com/nornagon/saxi
- Stroke-width→Z feature request: https://github.com/svenhb/GRBL-Plotter/issues/127
- 3-D AxiDraw Z hack: https://lurkertech.com/3daxi/
- Axipaint (syringe dispensing): https://hackaday.io/project/19861-axidraw-becomes-axipaint
- openBrushograph (purpose-built brush rig): https://github.com/openBrushograph/openBrushograph_hardware
- Curated list: https://github.com/beardicus/awesome-plotters

**Practitioner writeups (search-extracted; art hosts 403-blocked direct fetch)**
- Licia He — "300 Days with Plotters": https://liciahe.medium.com/300-days-with-plotters-14159ab64034 ·
  Q&A: https://www.eyesofpanda.com/project/plotter_painting_q_a/ · course:
  https://www.eyesofpanda.com/project/painting_with_plotters/
- Amy Goodchild — "Chaos in the medium: watercolour plotting" (water-first blooms, refill-removal
  fades, stir circle, mount-angle width): https://www.amygoodchild.com/blog/watercolour-plots
- Lars Wander — watercolor plots (chunk overlap, randomized order → opacity, penalize draw distance):
  https://larswander.com/writing/watercolor-plots/
- eyesofpanda — refill-distance measurement, layers/pools, stations:
  https://www.eyesofpanda.com/project/painting_with_plotters/module_1/
- Michelle Chandra / Dirt Alley — CMYK process, acrylic inks, registration how-to:
  https://www.dirtalleydesign.com/blogs/news/favorite-pens-for-axidraw-plus-registering-multiple-layers-a-how-to ·
  https://www.dirtalleydesign.com/blogs/news/cmyk-experimenting-with-process-color-and-my-axidraw ·
  https://www.dirtalleydesign.com/blogs/news/how-to-watercolor-painting-with-a-robotic-drawing-machine-an-interview-with-licia-he
- penplotterartwork — acrylic continuous-offset fill, Posca, Gelly Roll, line-width:
  https://penplotterartwork.com/blog/2021/11/06/beyond-the-pen-plotter-art-made-with-paint-sand-more/ ·
  https://penplotterartwork.com/blog/2021/09/09/using-posca-paint-pens-with-an-axidraw/ ·
  https://penplotterartwork.com/blog/2021/10/28/multiple-line-widths-example-pen-plot-art/
- EMS wikis — Pens for AxiDraw, Hatch fill, Multicolor tips, Brushless servo:
  https://wiki.evilmadscientist.com/Pens_for_AxiDraw · https://wiki.evilmadscientist.com/Hatch_fill ·
  https://wiki.evilmadscientist.com/Multicolor_Plot_Tips · https://wiki.evilmadscientist.com/Brushless_Servo
- EMS pen-pooling forum (const_speed): https://www.evilmadscientist.com/forums/topic/pen-pooling/
- Generative Hut — best pens (fude/brush pens): https://www.generativehut.com/post/best-pens-for-plotting
- Dan Catt / revdancatt: https://revdancatt.com/penplotter/ · LIA "Mechanical Interventions":
  https://www.liaworks.com/theprojects/mechanical-interventions-an-investigation-into-generative-plotter-painting/
- Watercolor technique grounding (paper, dry-brush, wet-on-wet, granulation): Jackson's Art, Louise
  De Masi, Watercolor Affair, Canson, Just Paint.
