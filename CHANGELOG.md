# Changelog

All notable changes to the **CHANNEL GHOST / GHOST THINGS** project are documented in this file.

---

## [0.3.9-devil-stamp] - 2026-10-21

### Completed Iterations (Audio Rework & Little Devil Stamp Interaction)
- **100% Preserved Typing Sound (`playKeyClick`)**:
  - Kept existing retro mechanical key-switch synthesis, pitch variance, volume, and debounce guard completely untouched.
- **Reworked Receipt / Fax Printing Sound (`playReceiptFeedSound`)**:
  - Completely replaced the low-frequency thud with authentic vintage mechanical fax and dot-matrix stepper gear sounds.
  - Synthesized a 10-tooth stepper gear-teeth micro-click train (900Hz–1100Hz) with 12ms rapid decays.
  - Added mid-frequency mechanical roller hum (~460Hz) and filtered paper friction slide (~2100Hz) with zero low-frequency flatulence or boomy bass.
  - Strictly played once on genuine receipt feed; completely silent on empty or rejected inputs.
- **Little Devil Stamp Interaction ("小恶魔盖章")**:
  - Replaced the plain bell chime with `playStampSound()`, combining a weighted physical rubber slap transient (190Hz -> 48Hz pitch-drop), high-frequency paper snap (1250Hz), and a playful imp trill (587Hz -> 740Hz).
  - Designed interactive stamping sequence on `FINISH` click:
    1. Receipt remains in place; physical wooden-handled Little Devil Stamp tool drops from above (`y: -90 -> 15`).
    2. At 220ms, impact slap plays, receipt paper squashes (`scale: [1, 0.95, 1.02, 1]`), and an oxblood red rubber stamp imprint appears on the receipt (`DevilStampSeal`).
    3. Stamp lifts away, and at 760ms smoothly transitions into the 3:4 archival poster modal.
  - Embedded matching vintage Little Devil Rubber Stamp Seal (`★ GHOSTED & VOID ★ OFFICIAL DEVIL SEAL`) into the poster bottom section between Ghosty's signature and the xerox illustration, included in high-res PNG export.

---

## [0.3.8-sound-effects] - 2026-10-21

### Completed Features (Targeted Web Audio Sound Effects)
- **Dedicated Web Audio Synthesis Engine (`src/utils/audio.ts`)**:
  - Implemented zero-dependency Web Audio API oscillator synthesis using a shared singleton `AudioContext`.
  - Fully resilient with automatic resume on user gesture and graceful fail-silent error handling.
- **Typing Sound (`playKeyClick`)**:
  - Synthesized subtle retro computer keyboard micro-click (~20ms) blending a pitch-drop transient triangle wave with bandpass-filtered noise.
  - Triggered strictly on genuine text input changes (`onChange`).
  - Completely silent during programmatic resets on `SEND` or component re-renders, with a 35ms debounce guard against key bounce.
- **Receipt / Fax Feed Sound (`playReceiptFeedSound`)**:
  - Synthesized soft mechanical stepper-motor rhythm (~380ms) and bandpass paper-friction slide.
  - Triggered strictly upon valid `handleInputSubmit` alongside the visual downward feed animation (`justPrinted`).
  - Silent on empty or rejected inputs and attempts past the 10-entry cap.
- **FINISH Chime (`playFinishChime`)**:
  - Synthesized bright, magical bell confirmation "ding" (~850ms) blending high bell fundamental (C6 1046.5Hz) with sparkling overtones (G6, E7).
  - Triggered exclusively when `handleFinish` succeeds with at least 1 entry, preceding the smooth transition to the full archival poster.

---

## [0.3.7-poster-layout-refinement] - 2026-10-21

### Completed Refinements (Poster Typography, Center-Focused List & Relocated Illustration)
- **Central Dominant List Focus**:
  - Re-anchored the user's ghosted phrases as the primary visual subject across the center of the poster.
  - Substantially increased the typography and numbering size, establishing clear hierarchy with fine horizontal paper divider rules between entries.
  - Dynamically adjusted vertical spacing and font sizing based on entry count (from spacious 1–3 items to neatly scaled 10 items) without crowding or overflow.
- **Retro Printed Terminal Typography (VT323)**:
  - Integrated `VT323` monospaced teletype/terminal font for list entry text, providing the exact vintage computer printout texture referenced in the brief while maintaining legibility at 3:4 export size.
  - Used large oxblood red (`#8c1822`) numbers (`01.`, `02.`, `03.`) in bold typewriter styling.
- **Relocated Illustration & Balanced Lower Region**:
  - Moved the monochrome xerox computer illustration (`ghost_machine_xerox.png`) into the lower-right corner.
  - Placed the `"CERTIFIED BY GHOSTY"` label and oxblood red handwritten doodle/signature (`~ Ghosty ~`) in the lower-left corner.
  - Balanced footer metadata with `GHOSTED: XX` on the left and `FIG. 01 · PERSONAL ARCHIVE` on the right.

---

## [0.3.6-finish-button-live-feed] - 2026-10-21

### Completed Refinements (FINISH Button & Live Receipt Downward Feed)
- **Separate Visible FINISH Button**:
  - Implemented distinct `SEND` and `FINISH` buttons side-by-side in the terminal form.
  - Removed all `POSTER ↗` buttons and avoided replacing `SEND` with `POSTER`.
  - `FINISH` is clickable after any number of entries (including 1 or 2 entries) to expand the poster.
  - At 10 entries, text input and `SEND` are disabled, while `FINISH` remains active and clickable.
- **Physical Output Slot Alignment & Fixed-Width Downward Growth**:
  - Aligned receipt directly to computer's output slot slit (`top: 62.65%`, `left: 44.27%`, `width: 29.95%`).
  - Added physical dark slot lip anchor to create authentic depth of paper emerging from the machine opening.
  - Strictly fixed paper width (`width: 100%` of output slot) with zero horizontal scaling.
  - Paper feeds and extends downwards as entries accumulate, preserving all previously printed entries in order.
- **Live Legible Printout**:
  - All entries remain visible and comfortable to read as the list grows, with automatic word wrapping.
  - Added subtle downward feed vibration and entry fade-in on each successful `SEND`.
- **Seamless Transition to Poster**:
  - Clicking `FINISH` or tapping the cumulative receipt expands it into the full 3:4 vintage archival poster.

---

## [0.3.5-collectible-poster] - 2026-10-20

### Completed Features (Archival Collectible Poster & Floppy Slot Continuous Receipt)
- **Continuous Thermal Receipt Printing**:
  - Engineered realistic paper receipt slip feeding down directly from the computer's 3.5" floppy drive slot slit (`top: 62.7%`, `left: 46.6%`).
  - Styled with cream thermal paper (`#fbf8f0`), jagged perforated tear bottom (`receipt-tear-bottom`), and drop shadow.
  - Features real-time mechanical paper feeding animation on submission (`scaleY` + `y` bump) and displays the latest ghosted phrases.
  - Interactive: Clicking the receipt slip directly opens the full printable collectible poster modal.
- **Terminal Header Counter & Poster Trigger**:
  - Displays dynamic item count: `[X/10 GHOSTED]` in the terminal window.
  - Integrated dedicated `POSTER ↗` trigger button in deep oxblood red (`#9e1a24`).
  - Supports up to 10 total phrases with clean capped input state (`All 10 slots full!`) and switches the send button to `POSTER`.
- **Printable 3:4 Archival Collectible Poster Modal**:
  - Vintage archival document aesthetic inspired by analog horror zines and strange archives.
  - Typeset with vintage typewriter fonts (`'Special Elite'`, `'Courier Prime'`) and handwritten oxblood red annotations (`'Caveat'`).
  - Features the ghost's authentic signature & doodle: `"Certified by Ghosty ~ save for autograph ~"`.
  - Numbered list of user's ghosted phrases alongside a monochrome xerox photocopy illustration (`FIG. 01 — THE GHOST MACHINE`).
  - Built-in 2.5x high-resolution PNG export via `html-to-image` for pristine download and printing.

---

## [0.3.4-targeted-bug-fix] - 2026-10-20

### Completed Targeted Fixes
- **Exact Dialogue Text Restoration**:
  - Restored exact second line string: `Type them down`.
  - Maintained exact first line string: `What do you want to ghost?`.
  - Kept existing typing speed (50ms/48ms) and ~1150ms reading pause between lines.
- **Pre-Click Keyboard Cue**:
  - Synchronously triggers when `Type them down` begins appearing.
  - Gently nudges keyboard up and down (`y: [0, -2, 2, -1, 1, 0, -2, 2, 0]`) and pulses soft screen-blend lavender glow for 2 rounds (~2.2s).
  - Pauses for ~2.4s, and repeats gently if user hasn't clicked yet.
  - Immediately halts the cue upon keyboard click, transitioning to input mode.
  - Preserved existing physical keypress animation (`isKeyboardPressed`) on actual click.
- **Separated Input Terminal Layout**:
  - Maintained short prompt label: `> Type them down`.
  - Placed responsive text input box on a separate row with `flex-1 min-w-0 shrink`.
  - Dedicated `SEND` button on the right with `shrink-0`, completely eliminating text overlap or clipping.
  - Removed long instructional placeholder from inside the input field.

---

## [0.3.3-rhythm-and-keyboard-fix] - 2026-10-20

### Completed Fixes (Dialogue Rhythm Calibration & Keyboard White Box Elimination)
- **Dialogue Rhythm Recalibration**:
  - `What do you want to ghost?` now types at comfortable ~50ms/character (total ~1300ms).
  - First sentence pauses for ~1150ms after completion (within requested 1000–1300ms range), allowing comfortable reading.
  - Automatically switches to `Type them out...` at ~48ms/character.
  - Synchronously triggers keyboard physical nudge and soft highlight right as line 2 begins displaying.
- **Root-Cause Elimination of Keyboard White Box**:
  - Diagnosed and removed the previous translucent white-bordered debug overlay (`border-2 border-white/60` and `bg-[#d8c8e8]/30`).
  - Extracted authentic keyboard cutout sprite (`keyboard_cutout.png`) perfectly aligned with the desk.
  - Implemented real physical key-bed displacement (`translateY(2px)`) on nudge/click without altering layout geometry.
  - Transformed highlight pulse into a borderless, soft lavender-pink screen-blend glow (`mixBlendMode: 'screen'`) with 2 repeats, illuminating the keys naturally without drawing artificial rectangular lines.

---

## [0.3.2-rhythm-and-title] - 2026-10-20

### Completed Features (Optimized Dialogue Rhythm, Title Upward Repositioning & Input Terminal)
- **Dialogue Rhythm Optimization**:
  - Accelerated typewriter cadence to crisp 24ms/char (Prompt 1 finishes in ~620ms).
  - Streamlined transition delay: Prompt 1 waits only ~380ms after completion before automatically typing Prompt 2 (`"Type them out..."`), eliminating idle waiting.
  - Safe timer management prevents race conditions on rapid re-clicks.
- **Synchronized Keyboard Guide Feedback**:
  - Prompt 2 trigger synchronously activates a single tactile down-nudge (`translateY: 1.5px`) on the physical keyboard area.
  - Followed by a soft, clear lavender-pink breathing pulse repeated 3 times.
  - Completely removed the `Click keyboard` hint text pill.
- **Immediate Input Terminal State**:
  - Clicking the keyboard instantly enters `input_active` state, halts all guidance pulsing/wobbling, and brings up the Retro Pixel Input Terminal in the starry sky band.
  - Input auto-focuses with command prompt chevron (`>`), pixel font input field, and retro `SENT` button.
- **GHOST THINGS Title Upward Repositioning**:
  - Elevated the title from original `y=176px` to `top: 6.2%` (`y=85px`) using an extracted crisp transparent title sprite (`ghost_things_title.png`) and starry sky inpaint layer (`title_sky_patch.png`).
  - Created a comfortable ~90px (~6.6% canvas height) starry vertical breathing gap between the dripping title bottom and the top of the dialogue box, eliminating visual crowding while preserving 100% of the original title art and composition.

---

## [0.3.1-dialogue-ui] - 2026-10-20

### Completed Features (Retro Pixel RPG & Terminal Dialogue Box)
- **Authentic Pixel RPG Stepped Box Styling**:
  - Replaced generic web rounded border with multi-layer stepped pixel cuts (`pixel-cut` polygon).
  - Dual-layer bezel: Outer deep midnight gothic plum (`#170a28`) + inner lavender-purple rim (`#d8c8e8`) + dark plum inset bevel (`#2a143f`).
  - Solid 3D tactile cast shadow (`#07030e`) offset by 4px down and 4px right with matching stepped cuts.
  - Light illumination highlight on top edge (`#f7f0ff/50`) and dark shade on bottom/right borders.
  - Fine CRT terminal scanline raster texture over `#160b24` dark purple background.
- **Stepped Pixel Pointer Tail**:
  - Constructed an authentic 4-tier pixel art arrow tail (`14px -> 10px -> 6px -> 2px`) pointing straight down to the CRT ghost's head, complete with offset solid shadow.
- **Pixel Typography & Typewriter Polish**:
  - Integrated Google Fonts `'Silkscreen'` with `'Press Start 2P'` fallback, rendered with non-antialiased crisp pixel edges (`font-smooth: never`).
  - Restrained typewriter effect revealing characters smoothly at 36ms cadence, maintaining 100% clarity once finished.
  - Pulsing terminal block cursor (`■`) in pastel blush pink (`#dfa9bf`) with terminal prompt chevron (`>`).
  - Preserved original copy: `"What do you want to ghost?"` and `"Type them out..."`.

---

## [0.3.0-animated-ghost] - 2026-10-20

### Completed Features (Living CRT Ghost Character & Screen Animation)
- **Living Pixel-Art Ghost Animation**:
  - Natural floating/bobbing motion (`translateY: [0, -5px, 0, 3px, 0]`) with subtle rotation tilt (`rotate: [-0.8deg, 0.8deg]`).
  - Periodic natural eye blinking cycle (~2.8s–5.2s interval, closed smiling pixel-eye arcs `^ ^` for 160ms).
  - Synchronized speaking mouth articulation (`ghost_talk.png`) during dialogue guidance steps (`"What do you want to ghost?"` and `"Type them out..."`).
- **Dynamic CRT Screen Stage**:
  - Precision overlay container (`left: 25.78%`, `top: 34.16%`, `width: 48.70%`, `height: 21.80%`) with `rounded-[14px]` and `overflow: hidden`, matching the CRT screen glass geometry.
  - Pixel-clean background plate (`crt_screen_clean_bg.png`) with authentic 8x8 checkerboard fence and starfield.
  - Subtle analog CRT scanline raster overlay.
- **Independent Floating Elements**:
  - Three pink pixel hearts drifting with desynchronized sine-wave floating paths, subtle scaling pulses, and tilts.
  - Two fluttering purple bats with independent drifting vectors and realistic periodic wing flaps.
- **Zero Asset Tampering**:
  - Untouched master background (`ghost_things_clean_base.png`) and user-confirmed potion bottle (`potion_bottle_isolated.png`).
  - Pure 100% retro pixel art with integer pixel scaling (`imageRendering: 'pixelated'`).

---

## [0.2.0-phase1] - 2026-10-19

### Completed Features (Phase 1 MVP)
- **Single Master Scene**: Replaced previous dual preview with unified 9:16 responsive stage container (`aspect-[9/16]`) with letterbox scaling.
- **Master Clean Background**: Mounted `src/assets/images/ghost_things_clean_base.png` (768×1376) at full fidelity with `imageRendering: pixelated`.
- **Potion Bottle Entrance Overlay**: Superimposed confirmed transparent sprite `src/assets/images/potion_bottle_isolated.png` at responsive percentage coordinates (`left: 81.8%`, `top: 62.2%`, `width: 13.2%`, `height: 16.2%`).
- **Restrained Idle Wobble Animation**: Subtle pixel-art keyframe wobble every 3.5s with pink glow pulse and hover scale.
- **Sequential Ghost Guidance Dialogue**:
  - Prompt 1: `"What do you want to ghost?"` (2.6s)
  - Prompt 2: `"Type them out..."` (2.2s)
  - Anchored at `top: 23.2%` in the starry sky band, with a pixel pointer tail aimed directly at the ghost's head.
- **Keyboard Area Highlight Feedback**: Rhythmic lavender-pink breathing highlight (`left: 16.1%`, `top: 71.9%`, `width: 67.8%`, `height: 10.6%`) with a floating `Click Keyboard` pill and tactile down-press feedback (`translateY(1.5px)`).
- **Clean Timer Management**: Safe cleanup of timeout refs prevents orphaned state on rapid re-clicks.

### Unimplemented (Scheduled for Phase 2+)
- Text input terminal and `SENT` button
- Floppy slot continuous paper printing
- Fullscreen poster unfolding and PNG download
- Sound effects

---

## [0.1.0-baseline] - 2026-10-19

### Status
- **Current Milestone**: Visual Assets & Foundation Baseline (v0.1)
- **Interactive State**: Game UI, state machine, and interactive logic are **NOT YET IMPLEMENTED**.
- **Preview State**: Static dual preview displaying the master clean base artwork and the confirmed isolated transparent potion bottle.

### Verified & Confirmed Assets
- **Master Clean Background**: `src/assets/images/ghost_things_clean_base.png` (768×1376, 9:16 portrait)
  - Potion bottle and previous smudge completely removed from the right side of the keyboard.
  - Keyboard right edge and computer casing restored with 100% orthographic symmetry.
  - Dark midnight purple halftone grunge stars background seamlessly inpainted.
  - CRT monitor screen, ghost holding pumpkin, bats, hearts, title, and casing preserved bit-for-bit.
- **Final Confirmed Isolated Potion Bottle**: `src/assets/images/potion_bottle_isolated.png` (384×608, 1,792 bytes)
  - Decoded 1:1 from user-confirmed Base64 source.
  - SHA-256 Checksum: `4e1f936213b55bec03d44e9a2b09d6ad57551c1549e9f2118ec60138af4151d8`.
  - Pure transparent Alpha channel, authentic pixel art, lilac/purple glass palette, zero stray machine pixels.

### Technical Baseline
- **Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion
- **Layout**: 9:16 Instagram Reel vertical ratio container with responsive letterboxing
- **Dependencies**: Pre-installed `motion@^12.23.24`, `lucide-react@^0.546.0`

### Pending Implementation (Phase 2 Roadmap)
- Potion intermittent shaking animation & entry trigger
- Ghost guidance dialogue bubble breaking through CRT monitor boundary
- Keyboard activation, terminal input interface, and IME composition defense
- Continuous thermal receipt/fax paper printing from the floppy slot
- FINISH list wrap-up, fullscreen poster unfolding, and PNG export
- 8-bit retro Web Audio sound effects & mute toggle
