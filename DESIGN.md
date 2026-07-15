---
version: "2.0"
name: Neobi Size Translator
description: Editorial-tech, measurement-first system for Neobi. Warm off-white canvas with strong black typography; signal lime is reserved for selection states, fit confidence, and key highlights. Based on the team style spec (references/nubi-style-spec/SPEC.md, 2026-07-15).
colors:
  primary: "#141414"
  on-primary: "#FFFFFF"
  secondary: "#353532"
  tertiary: "#C8FF3D"
  neutral: "#F6F6F0"
  surface: "#FFFFFF"
  on-surface: "#141414"
  muted: "#EFEFE8"
  on-muted: "#52524C"
  border: "#DEDED6"
  success: "#18845B"
  warning: "#8F5510"
  danger: "#C83F34"
  match-high: "#B7EF36"
  match-mid: "#FFD76A"
  match-low: "#E4E4DC"
typography:
  display:
    fontFamily: Pretendard Variable
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.04em
  heading:
    fontFamily: Pretendard Variable
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Pretendard Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  md: 0.5rem
  lg: 0.75rem
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  section: 5rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 0.75rem 1.25rem
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 1.5rem
  callout:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    rounded: "{rounded.md}"
    padding: 1rem
  app-shell:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  signal-highlight:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
  alert-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
  alert-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    rounded: "{rounded.md}"
  alert-warning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
    rounded: "{rounded.md}"
  status-success:
    backgroundColor: "{colors.match-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
  status-warning:
    backgroundColor: "{colors.match-mid}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
  status-danger:
    backgroundColor: "{colors.match-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
---

## Overview

Neobi (너비) translates clothing sizes across brands. The visual system is editorial-tech and measurement-first: warm off-white canvas, strong black typography, precise numbers, and one clear recommendation per screen. Rationale (2026-07-15 team decision, spec at references/nubi-style-spec/SPEC.md): the earlier monochrome placeholder tokens were replaced with the team's single-category spec — off-white keeps fashion imagery and black type calm, while signal lime marks only what the engine measured or the user selected. The tool should read as a precision instrument with one expressive signal color, not a marketplace.

## Colors

Use near-black (#141414) for primary actions, headlines, the brand marquee band, and the footer. Signal lime (#C8FF3D) is reserved for selection states, the current progress step, fit-confidence highlights, and single-word emphasis behind headline keywords — never as a general background. Fit confidence uses the match scale: lime for very similar, yellow for similar, neutral gray for different. Low fit is never painted red: a looser fit can be a preference, not an error. Red (#C83F34) is reserved for genuine system errors.

## Typography

Use Pretendard Variable for all Korean product copy and Space Grotesk for numerals, size labels, and micro-labels such as HYPOTHESIS, MEASURE, DATA, and LEARN. Headlines are heavy (750-800) with tight line-height (1.08-1.15); body text stays comfortable for group review.

## Layout & Spacing

Keep content within a readable centered column. Use generous section separation and compact spacing within decision records. On mobile, stack all decision and metric cards into one column, and keep the results grid at two columns.

## Elevation & Depth

Prefer 1px hairline borders (#DEDED6) and subtle surface contrast over shadows. Shadows appear only on overlays: dropdowns, dialogs, and bottom sheets.

## Shapes

Use small, tool-like radii: 4px chips, 8px buttons and inputs, 12px form shells. Pills are reserved for progress tracks and short status labels; containers and buttons should not become capsules.

## Components

Primary buttons advance an explicit workflow step. Cards contain one concept such as a hypothesis, metric, or learning. Callouts explain blockers, failed assumptions, or the next decision. The fit grid orders brands by measured similarity, with a percent and a plain-language label together.

## Do's and Don'ts

Do show the hypothesis, evidence, and next action in the first viewport. Do preserve accessible contrast (ink on lime only) and visible focus states. Do keep lime scoped to signals.

Do not use gradients, glass effects, excessive pills, or decorative dashboards. Do not judge measurement deltas with color. Do not present mock data as measured evidence.
