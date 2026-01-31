Project Name: Satellite’s Diary — A Decade of Earth’s Transformation
Engine Codename: Antigravity
Primary Renderer: deck.gl
Minimum Guarantee: Interactive 3D Earth Globe

1. CORE PHILOSOPHY

Antigravity is not a UI framework and not a storytelling engine.
Antigravity is a visual physics engine for Earth, Time, and Change.

It exists to:

Render Earth

Render data layers

Animate transitions across time

Provide cinematic experiences

Maintain smooth GPU visuals

It does not:

Decide what text to show

Handle button logic

Fetch APIs

Control narrative pacing

Narrative and UI are separate.
Antigravity only renders the world.

2. STORY STRUCTURE (WHAT THE USER EXPERIENCES)

The story is linear in emotion but nonlinear in interaction.
Users can jump anywhere, but the emotional arc remains:

Awe → Discovery → Understanding → Reflection → Agency

Scene 1 — Void & Introduction

Black screen, star field, typewriter text.
No Antigravity rendering yet.

Scene 2 — Earth Reveal

Antigravity initializes globe.
Earth rotates slowly. No data layers.
Atmospheric glow active.

Purpose: Establish scale and wonder.

Scene 3 — First Spark

User toggles night lights.
Earth lights up. Year slider introduced.
User scrubs time.

Purpose: Discovery of change.

Scene 4 — City Dive

User selects a city. Camera flies to region.
Urban boundary + population heatmap unlocked.

Purpose: Focus and curiosity.

Scene 5 — Split Time

Split Earth view appears.
Past vs Present.

Purpose: Realization of transformation.

Scene 6 — Trade-Off Lens

Urban expansion overlays green cover or temperature.
No moral language — just correlation.

Purpose: Systems understanding.

Scene 7 — Future Echo

Predictive ghost overlays show possible future growth.
Semi-transparent and tinted.

Purpose: Responsibility and possibility.

Scene 8 — Cinematic Mask Playback

MaskExtension playback animation in regional mode.
Automated timeline.

Purpose: Documentary immersion.

Scene 9 — Reflection & Agency

Return to global view with faint overlays.
Static suggestions panel appears.

Purpose: Closure and agency.

3. FEATURE LIST (ENGINE-LEVEL RESPONSIBILITIES)
3.1 Bare Minimum Feature

Rotatable 3D Earth globe

Zoom in/out

Year slider affecting at least one data layer

If all advanced modules fail, this must still function.

3.2 Layer Rendering

Each data visualization is a deck.gl Layer.
Supported layer types:

Feature	Layer
Night Lights	BitmapLayer / TileLayer
Urban Boundaries	GeoJsonLayer
Population Density	HeatmapLayer
Green Cover	PolygonLayer
Temperature/Pollution	GridLayer
Predictive Ghost	GeoJsonLayer w/ opacity

Rules:

Max 3 active heavy layers at once

Each layer must support show/hide/update/destroy

3.3 Time Engine

Central React state controlling temporal progression.

Responsibilities:

Hold currentYear

Broadcast updates to layers

Support slider and animation playback

Interpolate values visually

Interpolation style:

Data → linear

Camera → ease-in-out

3.4 Camera Controller

Uses deck.gl ViewState.

Functions:

flyTo(lat, lng, zoom)

rotate(speed)

syncSplitViews()

clampZoom()

Rules:

Never snap instantly.

Maintain inertia feel.

3.5 Split View Renderer

Two deck.gl MapViews simultaneously.

Rules:

Same rotation

Independent year states

Shared zoom

Vertical divider UI

Purpose: Before vs After comparison.

3.6 Predictive Projection Engine

Simulated future growth visualization.

Input:

Growth percentage slider

Selected dataset

Output:

Ghost overlays

Dashed boundaries

Semi-transparent tinted layers

No AI or ML required.
Simple linear extrapolation acceptable.

3.7 Trade-Off Lens

Correlation overlay.

Example relationships:

Urban ↑ → Green ↓

Population ↑ → Heat ↑

Implementation:

Toggle triggers secondary overlay

Uses opacity blending, not separate charts

3.8 Mask Cinematic Engine

Deck.gl MaskExtension module.

Purpose:

Regional storytelling

Automated playback

Boundary reveal animations

Rules:

Runs as mode switch, not new renderer

Independent timeline loop

Only active in city zoom mode

3.9 Year Slider

Primary narrative engine.

Responsibilities:

Update Time Engine

Trigger layer interpolation

Animate visual transitions smoothly

4. LIBRARIES
Core Rendering

deck.gl

react-map-gl

Mapbox GL or MapLibre GL

Extensions

MaskExtension (deck.gl)

UI

React

TailwindCSS

Framer Motion

Data Handling

PapaParse

Turf.js

mapshaper (preprocessing)

5. TECH STACK

Frontend:

React + Vite or Next.js

deck.gl

Mapbox / MapLibre

TypeScript (optional but recommended)

Data:

Local JSON / GeoJSON

Pre-processed CSV

Deployment:

Vercel / Netlify / Static Hosting

6. DATA STRUCTURE
/data
  /lights
  /urban
  /population
  /vegetation
  /temperature


Each file <2MB.
Pre-simplified GeoJSON.
3–5 key years only.

7. VISUAL LANGUAGE
Color Rules

Night Lights → warm yellow/orange

Urban Boundaries → thin white lines

Population → red/orange gradients

Green Cover → translucent green

Temperature → orange/yellow tint

Predictive → purple/blue ghost

Mask Boundary → soft blue

Motion Rules

Always smooth interpolation

No flickering

No abrupt opacity jumps

Atmosphere

Subtle glow always active

Slight bloom effect

8. PERFORMANCE CONSTRAINTS

Max active layers: 3

Dataset size <2MB

Use TileLayers when possible

Destroy unused layers after 10 seconds

Cache last 3 years

Target FPS: 50–60

9. INTERACTION MAPPING
UI Action	Antigravity Call
Select City	setViewState()
Year Slider	setYear()
Toggle Layer	updateLayers()
Projection Slider	enableProjection()
Split View	enableMultiView()
Play Cinematic	startMaskPlayback()
10. DEVELOPMENT ORDER

Globe render

Camera controller

Year slider

Night lights

City zoom

Urban boundaries

Population heatmap

Split view

Mask cinematic

Predictive ghost

Trade-off overlays

Polish & optimization

11. FAILURE SAFETY

If data fails:

Earth remains visible

Toggle disabled gracefully

Renderer never crashes

12. MENTAL MODEL

Antigravity = Orchestra
UI = Narrator
Mask Engine = Cinematic Insert

Antigravity never speaks.
It only renders the passage of time across Earth.

13. ENDGOAL EXPERIENCE

User feels:

They are rotating the planet

They are bending time

They are witnessing civilization grow

They are seeing consequences

They are imagining futures

Not a map.
Not a dashboard.
A temporal Earth observatory powered by GPU visuals.