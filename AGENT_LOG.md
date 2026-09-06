# AGENT_LOG.md

I used two AI tools during development: **ChatGPT** and **Google Antigravity**.

I mainly used ChatGPT for brainstorming, research, product decisions, architecture discussions, and turning ideas into clear feature specifications.

I mainly used Antigravity as the coding agent to implement those specifications inside the project.

---

## How I Used AI

My usual workflow for a feature was:

**Research → Design → Define specs → Implement → Test → Review → Commit**

For example, for the Careers Page Editor, I first discussed the feature with ChatGPT.

I used prompts like:

> I need to build a Careers Page Editor where recruiters can customize their company careers website. Help me research how modern website builders work and what features would make sense for this product.

We then discussed different approaches, UI ideas, user flows, and technical considerations.

After several iterations, we reached a point where the feature could be described as a set of concrete specifications/phases.

---

## Giving the Work to Antigravity

Once the feature was sufficiently designed, I gave the specifications to Antigravity rather than asking it to build everything at once.

One of my preferred prompts was roughly:

> Here is the plan/specification for this feature. Implement it phase by phase.  
> After every phase, run and test the application. Then ask me for review.  
> Do not move to the next phase until the current phase is tested and reviewed.  
> Once I approve the phase and the application is working correctly, commit the changes with a clean commit message and then move to the next specification.

This worked particularly well because it kept the AI agent focused on a small piece of work at a time.

---

## Feature-wise Prompts

I followed the same approach for the major features.

### Careers Page Editor

ChatGPT was used to research and design:

- Branding customization
- Page sections
- Adding/removing sections
- Section reordering
- Live preview
- Theme/design controls
- Draft and publish workflow

After defining the specifications, Antigravity was given the implementation plan phase by phase.

### Job Management

ChatGPT was used to discuss the recruiter workflow and what information and actions were required for managing jobs.

Then Antigravity was given focused specifications for implementing the feature.

---

## Refinement Prompts

I also used AI after seeing the actual application.

For example, after looking at the Careers Page Editor, I noticed that the UI felt too much like an admin dashboard.

I then gave feedback such as:

> The editor is functional, but I don't like the UI. It feels more like an admin dashboard than a professional website editor. Help me improve the layout and visual hierarchy.

I also used screenshots to give more specific feedback, such as:

> The editor theme is too dark and the section names are being truncated. The recruiter should be able to see the complete section names. Improve this without changing the existing functionality.

This made the development process iterative rather than relying on the first generated implementation.

---

## Why This Workflow Worked

The combination of ChatGPT and Antigravity made the development significantly faster.

ChatGPT was useful for **thinking and designing the problem**, while Antigravity was useful for **implementing the defined work directly in the codebase**.

The most effective pattern I found was:

> **Use ChatGPT to understand and design the feature → turn it into specifications → give those specifications to Antigravity → implement one phase → test → review → commit → continue.**

Having Antigravity stop after each phase was especially useful because I could catch UI or implementation issues early instead of discovering them after a large feature had already been built.

This workflow significantly reduced the time required to move from an idea to a tested implementation.

## My AI Development Workflow

For each major feature, I followed a phase-gated workflow:

**Research → Design → Specifications → Implement Phase → Test → Review → Accept → Commit → Next Phase**

The important rule was that Antigravity should not continue to the next phase automatically.

After implementing a phase, I asked it to:

1. Run and test the application.
2. Stop and ask me for a review.
3. Fix any issues identified during the review.
4. Wait until I accepted the result.
5. Commit the completed phase with a clean commit message.
6. Only then move to the next specification/phase.

This made the development process much more controlled and significantly faster, because problems were caught at the end of each small phase instead of after completing a large feature.

For example:

```text
ChatGPT
   ↓
Research & Design
   ↓
Feature Specifications
   ↓
Antigravity
   ↓
Implement Phase 1
   ↓
Test
   ↓
Review
   ↓
Accepted?
   ├── No → Fix → Test → Review
   │
   └── Yes
        ↓
      Commit
        ↓
   Implement Phase 2
        ↓
      ...
```
