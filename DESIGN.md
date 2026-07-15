---
version: "1.0"
name: Neobi Size Translator
description: Monochrome, measurement-first system for Neobi. Near-black primary follows Korean fashion commerce convention (Musinsa-style) so the tool reads as part of the shopping flow; status colors are reserved for prediction confidence.
colors:
  primary: "#18181B"
  on-primary: "#FFFFFF"
  secondary: "#52525B"
  tertiary: "#2563EB"
  neutral: "#FAFAFA"
  surface: "#FFFFFF"
  on-surface: "#18181B"
  muted: "#F4F4F5"
  on-muted: "#52525B"
  border: "#D4D4D8"
  success: "#15803D"
  warning: "#B45309"
  danger: "#B91C1C"
typography:
  display:
    fontFamily: Geist Sans
    fontSize: 3rem
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: -0.04em
  heading:
    fontFamily: Geist Sans
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: Geist Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Geist Mono
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  sm: 0.375rem
  md: 0.625rem
  lg: 1rem
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
    padding: 0.75rem 1rem
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
  status-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  status-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  status-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
---

## Overview

Neobi (너비) translates clothing sizes across brands. The visual system stays monochrome and measurement-first: numbers, tables, and one clear recommendation per screen. Rationale for keeping the near-black palette (2026-07-15 team decision): Korean fashion e-commerce that our persona already trusts (Musinsa) is black-and-white minimal, and a size tool must look like an instrument, not a fashion statement. Trend-styled palettes were rejected because a wrong-but-pretty answer damages trust faster than a plain one.

## Colors

Use near-black for primary actions and blue only for evidence highlights and selected states. Status colors are reserved for prediction confidence: success = high confidence, warning = medium, danger = low or a measurement gap of 2cm or more. Never use confidence colors decoratively.

## Typography

Use Geist Sans for readable product copy and Geist Mono for labels such as HYPOTHESIS, MEASURE, DATA, and LEARN. Headings are compact; body text stays comfortable for group review.

## Layout & Spacing

Keep content within a readable centered column. Use generous section separation and compact spacing within decision records. On mobile, stack all decision and metric cards into one column.

## Elevation & Depth

Prefer borders and subtle surface contrast over large shadows. A decision should look important because of hierarchy and evidence, not visual effects.

## Shapes

Use moderate radii. Pills are reserved for short status labels; containers and buttons should not become capsules by default.

## Components

Primary buttons advance an explicit workflow step. Cards contain one concept such as a hypothesis, metric, or learning. Callouts explain blockers, failed assumptions, or the next decision.

## Do's and Don'ts

Do show the hypothesis, evidence, and next action in the first viewport. Do preserve accessible contrast and visible focus states. Do replace these tokens after the team selects a product direction.

Do not imitate one brand before the team decides why it fits. Do not use gradients, glass effects, excessive pills, or decorative dashboards. Do not present mock data as measured evidence.
