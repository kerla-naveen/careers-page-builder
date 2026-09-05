# Careers Website Editor — Development Plan

## Status Summary
- **Current Phase**: Phase 1 — Editor Shell & Layout Structure
- **Completed Phases**: None (Initializing implementation)
- **Next Phase**: Phase 2 — Modular Section Architecture & Registry

---

## Phase Roadmap

- [ ] **Phase 1 — Editor Shell**: Modular layout (TopBar, LeftSidebar, CanvasArea, RightInspector) + basic editor state framework.
- [ ] **Phase 2 — Section Registry**: Extensible section registry system + canvas section overlays.
- [ ] **Phase 3 — Section CRUD**: Add Section picker, duplicate, hide/show, delete with confirmation.
- [ ] **Phase 4 — Drag & Drop**: Section drag handles & HTML5 reordering with order index persistence.
- [ ] **Phase 5 — Content Editing**: Dynamic property inspectors per section type + array field editors.
- [ ] **Phase 6 — Design System**: Token-based design system (colors, typography, spacing, radius, buttons).
- [ ] **Phase 7 — Themes**: Theme presets (Modern Tech, Corporate, Startup, Minimal, Creative) with instant switching.
- [ ] **Phase 8 — Branding & Media**: Logo/Banner uploader & fallback handlers + 50+ icon picker.
- [ ] **Phase 9 — Responsive Preview**: Viewport mode switcher (Desktop, Tablet, Mobile canvas).
- [ ] **Phase 10 — Persistence & Undo/Redo**: Immutable history stack (Undo/Redo) + debounced autosave + unsaved warning.
- [ ] **Phase 11 — Public Website Integration**: Decouple candidate public view from draft recruiter editor view.
- [ ] **Phase 12 — Draft / Publish**: Draft vs Published state management & one-click publish workflow.
- [ ] **Phase 13 — Production Hardening**: Keyboard shortcuts, accessibility polish, edge-case coverage, full verification.

---

## Architecture & Design Decisions
1. **No monolithic files**: Decompose `[slug].js` into dedicated components in `components/editor/`.
2. **Backward Compatibility**: Preserve existing company endpoints while introducing `draftSections`, `publishedSections`, `draftTheme`, `publishedTheme`.
3. **Section Extensibility**: All section types register through a central `SectionRegistry` with renderer, inspector, schema, and defaults.

---

## Testing & Verification Log
- Pending initial Phase 1 build.
