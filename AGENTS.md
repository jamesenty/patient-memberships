# AGENTS.md

## Overview
`patient-memberships` is a frontend-only Next.js prototype for exploring a medspa membership management experience.

The project exists to move quickly on product direction, interaction design, and responsive admin workflows before any backend or data model is finalized.

## What Belongs Here
- App Router UI in `app/`
- Membership dashboard views
- Membership create/edit flows
- Responsive interaction patterns for desktop and mobile
- Prototype-only sample data and local state

## What Does Not Belong Here
- Real persistence or API integrations
- Authentication, billing, or production business logic
- Database schema decisions presented as final architecture
- Heavy abstraction for code paths that are still changing rapidly

## Current Product Surface
- `/`
  Dashboard for memberships and members
- `/memberships/new`
  Create membership flow
- `/memberships/[id]`
  Edit membership flow seeded from sample data

Primary implementation areas:
- `app/components/dashboard/*`
- `app/components/membership-form/*`
- `app/components/ui/*`
- `app/design-system/*`

## Purpose And Constraints
- This is a rapid prototyping surface, not a production system.
- State is intentionally local and sample-data driven.
- Design fidelity matters more than architectural generality right now.
- Changes should preserve momentum: prefer clear, direct code over speculative indirection.

## Prototype Status
- The current UI is not finalized. Treat existing layouts, CSS, components, and token usage as working prototype material rather than settled product decisions.
- Future agents are allowed to replace or substantially revise current structure when it improves clarity, workflow, or design quality.
- Do not feel bound to preserve current component boundaries, class names, or visual treatments if they are getting in the way of a better prototype iteration.
- Preserve momentum, but do not preserve weak patterns out of caution.

## Key Functionality
- View memberships and members from dashboard sample data
- Pause/resume memberships with confirmation UX
- Create or edit a membership offer
- Add, edit, and remove service, discount, and perk inclusions
- Responsive mobile layouts:
  - dashboard tables become cards on small screens
  - inclusion picker becomes a full-screen takeover on mobile

## Data Model Assumptions
- Dashboard data currently comes from `app/components/dashboard/sample-data.ts`.
- Membership edit pages are seeded in `app/memberships/[id]/page.tsx`.
- Membership form state is client-side only in `CreateMembershipFlow.tsx`.

If real data is introduced later, update these prototype assumptions first instead of layering network calls directly into scattered components.

## Design System Guidance
- Use the token contract files in `app/design-system/`.
- Prefer existing shared UI primitives before adding new one-off controls, unless overriding them is the clearer path for the next prototype iteration.
- Keep desktop and mobile as distinct experiences where needed; do not force desktop table layouts into mobile.
- Avoid generic placeholder UI. This project is design-led.

## Safe Change Guide
- Dashboard table or card changes:
  Start in `app/components/dashboard/`.
- Membership form behavior changes:
  Start in `app/components/membership-form/CreateMembershipFlow.tsx`.
- Visual or responsive adjustments for the form:
  Start in `app/components/membership-form/create-membership.module.css`.
- Shared control styling:
  Start in `app/components/ui/` and `app/globals.css`.

## Common Gotchas
- Mobile and desktop intentionally diverge in several places; check both before finishing UI work.
- The membership form has separate create/edit modes but shared rendering.
- Fly deploys rely on `fly.toml` matching the container port (`3000`).
- Because this is frontend-only, it is easy to accidentally imply real system behavior. Keep copy honest.

## Verification
- Run `npm run lint`
- Run `npm run build`
- Check:
  - desktop dashboard
  - mobile dashboard
  - create membership
  - edit membership
  - mobile full-screen inclusion flow
