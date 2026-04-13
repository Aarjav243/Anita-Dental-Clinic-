# Graph Report - C:/Users/aarja/OneDrive/Desktop/Dentist Demo  (2026-04-14)

## Corpus Check
- Corpus is ~3,889 words - fits in a single context window. You may not need a graph.

## Summary
- 34 nodes · 23 edges · 13 communities detected
- Extraction: 61% EXTRACTED · 39% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.82)
- Token cost: 4,200 input · 1,100 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `WCAG 2.1 AA Compliance` - 8 edges
2. `Design Token References` - 3 edges
3. `CTA Pattern (verb-first)` - 3 edges
4. `Contrast Ratio 4.5:1` - 2 edges
5. `Usability Standards` - 2 edges
6. `Color Design Tokens` - 2 edges
7. `Component Variants and States` - 2 edges
8. `UI Patterns (Forms, Nav, Data)` - 2 edges
9. `User Segments` - 2 edges
10. `Touch Target 44x44px` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Usability Standards` --conceptually_related_to--> `WCAG 2.1 AA Compliance`  [INFERRED]
  design_critique.md → accessibility_review.md
- `Design Consistency` --semantically_similar_to--> `Consistency Over Creativity Principle`  [INFERRED] [semantically similar]
  design_critique.md → design_system.md
- `Component States (all)` --semantically_similar_to--> `Component Variants and States`  [INFERRED] [semantically similar]
  design_handoff.md → design_system.md
- `Contrast Ratio 4.5:1` --rationale_for--> `Color Design Tokens`  [INFERRED]
  accessibility_review.md → design_system.md
- `CTA Pattern (verb-first)` --rationale_for--> `Usability Standards`  [INFERRED]
  ux_copy.md → design_critique.md

## Hyperedges (group relationships)
- **Accessible Design System Foundation** — accessibility_review_wcag_aa, design_system_color_tokens, design_handoff_design_tokens, design_critique_consistency [INFERRED 0.85]
- **User Research to UX Copy Pipeline** — user_research_interviews, research_synthesis_user_segments, ux_copy_voice_tone, ux_copy_cta_pattern [INFERRED 0.78]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (7): Alt Text for Images, ARIA Landmarks and Roles, Visible Focus Indicator, Form Labels Required, Keyboard Navigation, Touch Target 44x44px, WCAG 2.1 AA Compliance

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (5): Contrast Ratio 4.5:1, Design Token References, Color Design Tokens, Spacing Scale Tokens, Typography Scale Tokens

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (4): Component States (all), Responsive Breakpoints, Component Variants and States, UI Patterns (Forms, Nav, Data)

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (4): Usability Standards, Jobs To Be Done Framework, CTA Pattern (verb-first), Voice and Tone Guidelines

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (3): User Segments, User Interviews Method, Journey Mapping Framework

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (2): Visual Hierarchy, Effective Whitespace

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): Design Consistency, Consistency Over Creativity Principle

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): Insights to Opportunities, Key Research Themes

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (1): First Impression (2 seconds)

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (1): Interaction Specifications

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (1): Usability Testing Method

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (1): Clear Copy Principle

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (1): Error Message Structure

## Knowledge Gaps
- **25 isolated node(s):** `Touch Target 44x44px`, `Keyboard Navigation`, `Visible Focus Indicator`, `Alt Text for Images`, `ARIA Landmarks and Roles` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 5`** (2 nodes): `Visual Hierarchy`, `Effective Whitespace`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `Design Consistency`, `Consistency Over Creativity Principle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `Insights to Opportunities`, `Key Research Themes`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `First Impression (2 seconds)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `Interaction Specifications`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `Usability Testing Method`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `Clear Copy Principle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `Error Message Structure`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WCAG 2.1 AA Compliance` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `Contrast Ratio 4.5:1` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Usability Standards` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `CTA Pattern (verb-first)` (e.g. with `Usability Standards` and `Jobs To Be Done Framework`) actually correct?**
  _`CTA Pattern (verb-first)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Usability Standards` (e.g. with `WCAG 2.1 AA Compliance` and `CTA Pattern (verb-first)`) actually correct?**
  _`Usability Standards` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Touch Target 44x44px`, `Keyboard Navigation`, `Visible Focus Indicator` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._