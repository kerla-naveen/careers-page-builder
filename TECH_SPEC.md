# 📐 Technical Specification (TECH_SPEC.md)

## 📌 Project Overview
**Careers Page Builder & Recruiter Studio** is a full-stack web application that empowers recruiters to build, brand, customize, and publish candidate-facing careers pages without writing code.

---

## 1. 💡 Core Product Assumptions & Constraints

### 1.1 Recruiter Registration & Automatic Onboarding
- **Instant Acceptance**: When a new recruiter registers (`POST /api/auth/register`), the registration is immediately accepted, creating both the `User` account and a new `Company` document.
- **Default Template Initialization**: Upon registration, the system automatically initializes a complete default careers page populated with standard pre-configured section templates (`HERO`, `ABOUT`, `CULTURE`, `PERKS`, `JOBS`).
- **Immediate Customization**: Upon logging in, recruiters are redirected to their company's Studio (`/dashboard/[slug]`) where they can customize their branding, theme colors, section order, text content, and open jobs.

### 1.2 Fixed Component Section Library (No Arbitrary Custom HTML Layouts)
- **Controlled Section Architecture**: Recruiters **do not** have an open-ended raw HTML/CSS layout builder. They cannot inject arbitrary unconstrained DOM trees.
- **Predefined Section Registry**: Customization is strictly constrained to a library of battle-tested, responsive section components:
  - `HERO` (Headline, tagline, background cover, badge, stats)
  - `ABOUT` (Company story, milestones, embedded video)
  - `CULTURE` (Core values grid with icons and descriptions)
  - `PERKS` (Employee benefits and perk cards)
  - `TEAM` (Leadership bios and avatars)
  - `TESTIMONIALS` (Employee quote cards)
  - `FAQ` (Accordion candidate question & answer list)
  - `CTA` (Call-to-action bottom banner)
  - `GALLERY` (Company life photo gallery grid)
- **Allowed Manipulations**: Recruiters can **reorder**, **add from registry**, **duplicate**, **hide/show (toggle visibility)**, **delete**, and **configure section properties, typography, and theme colors**.

### 1.3 Pre-Seeded Demo Test Accounts
- The system assumes **3 pre-seeded test companies** exist in the database out-of-the-box for evaluation:
  1. **Workable** (`slug: workable`, Recruiter: `recruiter@workable.com` / `password123`)
  2. **Ashby** (`slug: ashby`, Recruiter: `recruiter@ashby.com` / `password123`)
  3. **Whitecarrot** (`slug: whitecarrot`, Recruiter: `recruiter@whitecarrot.com` / `password123`)

---

## 2. 🏗️ High-Level System Architecture

The application follows a **Monolithic Single-Repo Full-Stack Architecture** comprised of a **Next.js 14 Frontend Client**, a **Node.js/Express REST API Backend**, and a **MongoDB Database**.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND CLIENT                               │
│  Next.js 14 (Pages Router) + React + Tailwind CSS v4 + PostCSS          │
│                                                                         │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌─────────────────┐ │
│  │ Recruiter Studio      │ │ Candidate Portal     │ │ Auth Context    │ │
│  │ (/dashboard/[slug])   │ │ (/companies/[slug])  │ │ (JWT Session)   │ │
│  └───────────────────────┘ └──────────────────────┘ └─────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST API (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND REST API                              │
│  Node.js + Express.js + Mongoose ORM                                    │
│                                                                         │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌─────────────────┐ │
│  │ Auth Middleware       │ │ Company Routes       │ │ Auth Routes     │ │
│  │ (JWT Verification)    │ │ (/api/companies)     │ │ (/api/auth)     │ │
│  └───────────────────────┘ └──────────────────────┘ └─────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Mongoose Drivers
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           MONGODB DATABASE                              │
│  Collections: users | companies | jobs                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Concepts:
- **Client-Side Live Synchronization**: The Recruiter Studio maintains an active state. Selecting a section on the canvas or sidebar smooth-scrolls the live preview to that section and opens its property inspector panel. Typing in the property inspector triggers live rendering on the preview canvas via React state.
- **Draft vs. Published Isolation**: `Company.sections` maintains the current working draft. Clicking **Publish** copies the draft state to `Company.publishedSections`, isolating live candidate site traffic from active editing sessions.

---

## 2.1 🎨 Editor Page Architecture & Data Flow (Core Engine)

### 📊 Visualizing the Round-Trip Data Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │                  MONGODB DATABASE                      │
               │  Document: Company { slug, theme, sections: [...] }    │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                  1. GET /api/companies/:slug (Initial Load)
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │           SINGLE SOURCE OF TRUTH (React State)         │
               │         useEditorState Hook (company, history)         │
               └───────────────┬────────────────────────┬───────────────┘
                               │                        │
         2. Binds Form Values  │                        │ 3. Passes Props
                               ▼                        ▼
┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐
│         RECRUITER INPUT PANELS           │  │            LIVE CANVAS PREVIEW           │
│                                          │  │                                          │
│ • Left Sidebar: Global Theme (Colors,    │  │ • Simulated Viewport (Desktop/Tablet/   │
│   Fonts, Radius) & Section Re-ordering   │  │   Mobile 390px)                          │
│ • Right Inspector: Active Section Fields │  │ • Dynamically maps section.type to       │
│   (Title, Subtitle, Items, Media, Cards) │  │   React Component (Hero, Perks, Jobs...) │
└──────────────────────┬───────────────────┘  └──────────────────────────────────────────┘
                       │
              4. Recruiter Types/Edits
                       │
                       ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ updateCompany((prev) => ({ ...prev, sections: newSections }))                          │
│ ➔ Updates React State instantly (0ms UI lag)                                           │
│ ➔ Pushes copy into History Stack for Undo/Redo (Cmd+Z)                                 │
└──────────────────────────────┬─────────────────────────────────────────────────────────┘
                               │
                      5. Save & Publish
                               │
       ┌───────────────────────┴───────────────────────┐
       │                                               │
       ▼ (PUT /api/companies/:slug)                    ▼ (POST /api/companies/:slug/publish)
┌──────────────────────────────┐              ┌──────────────────────────────────────────┐
│   SAVED DRAFT IN DATABASE    │              │    PUBLISHED TO LIVE CANDIDATE SITE      │
│   Company.sections [...]     │              │    Company.publishedSections [...]       │
└──────────────────────────────┘              └────────────────────┬─────────────────────┘
                                                                   │
                                                          6. Candidates Visit
                                                                   │
                                                                   ▼
                                              ┌──────────────────────────────────────────┐
                                              │       PUBLIC CANDIDATE PAGE              │
                                              │    (/companies/[slug]/jobs)              │
                                              │ Renders visible sections dynamically!   │
                                              └──────────────────────────────────────────┘
```

---

### 🗣️ Simple & Conversational Explanation: How it Works Under the Hood

Think of the Careers Page Builder like a **Lego Block Engine**:

1. **The Page is Just a JSON Recipe**:
   Instead of writing HTML or CSS files, the entire careers page is saved as a single simple recipe (a JSON document). The recipe lists global styles (like brand colors and fonts) and an ordered list of content blocks (like a Hero header, an About story, Perk cards, and Job listings).

2. **Fetching & Hydrating the Editor**:
   When a recruiter opens the editor page (`/editor/[slug]`), the app asks the server: *"Give me the latest recipe for this company."* The server responds with the JSON document, and the frontend loads it into a central React state (`useEditorState`).

3. **How Recruiter Inputs are Collected (Form ➔ JSON)**:
   - **Left Sidebar**: Controls global recipe settings (colors, typography, section order, section visibility).
   - **Right Panel (Inspector)**: Controls the currently selected section's specific contents. When a recruiter selects the "Perks" section, the right panel automatically generates text inputs, icon pickers, and card adders specifically for Perks.
   - **Real-Time Data Capture**: Every keystroke or button click triggers an `updateCompany()` function. This updates the in-memory JSON state instantly. Because React automatically re-renders when state changes, the canvas preview updates with **0 millisecond delay**—no manual refresh needed!
   - **Safety Net (Undo/Redo)**: Every single state update saves a snapshot into an internal history array (up to 50 edits). If a recruiter makes a mistake, pressing `Cmd+Z` rolls the JSON back to the previous snapshot.

4. **Putting JSON Back onto the Page (JSON ➔ Live Render)**:
   - **In the Canvas**: The editor loops through the JSON `sections` array and renders matching React template components (`HeroSection`, `PerksSection`, `JobsSection`, etc.), passing the section's JSON data directly into the component as props.
   - **Saving Drafts**: Clicking **"Save Draft"** sends the updated JSON recipe back to MongoDB via a `PUT` request.
   - **Publishing Live**: Clicking **"Publish Page"** copies the draft recipe into `publishedSections`.
   - **For Candidates**: When candidates visit `/companies/[slug]`, the site reads `publishedSections` from the database and constructs the live page using the exact same section components and theme tokens!

---

### 📋 Concrete Sample JSON Document (How Careers Page Data is Collected & Stored)

Below is an exact example of the JSON object stored in MongoDB (`Company` collection) and sent back and forth between the frontend editor and backend API:

```json
{
  "_id": "66d98f7e2a4b1c001f98e101",
  "name": "Workable",
  "slug": "workable",
  "owner": "66d98f7e2a4b1c001f98e100",

  "primaryColor": "#059669",
  "accentColor": "#10b981",
  "backgroundColor": "#f0fdf4",
  "textColor": "#064e3b",
  "fontFamily": "Outfit",
  "borderRadius": "16px",

  "logoUrl": "💼",
  "bannerUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
  "description": "The all-in-one recruiting software helping companies hire globally.",
  "website": "https://workable.com",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  "socialLinks": {
    "linkedin": "https://linkedin.com/company/workable",
    "twitter": "https://twitter.com/workable",
    "github": "https://github.com/workable",
    "glassdoor": "https://glassdoor.com/Overview/Workable-EI_IE789.htm"
  },

  "sections": [
    {
      "_id": "sec_hero_001",
      "type": "HERO",
      "title": "Shape the Future of Hiring Worldwide",
      "subtitle": "Join a global team empowering 27,000+ businesses.",
      "content": {
        "headline": "Build Your Career at Workable",
        "tagline": "Remote-first culture, global scale, and commitment to quality.",
        "ctaText": "Explore Open Positions",
        "badgeText": "🚀 We are actively hiring worldwide",
        "stats": [
          { "value": "27,000+", "label": "Companies" },
          { "value": "100+", "label": "Countries" },
          { "value": "1M+", "label": "Hires Made" }
        ]
      },
      "orderIndex": 0,
      "isVisible": true
    },
    {
      "_id": "sec_perks_002",
      "type": "PERKS",
      "title": "Benefits & Perks",
      "subtitle": "We take care of our people so they can do their best work.",
      "content": {
        "perks": [
          {
            "icon": "🏠",
            "title": "Remote-First",
            "description": "Work from anywhere in the world with home office stipends."
          },
          {
            "icon": "📚",
            "title": "Learning Budget",
            "description": "$2,000 annual learning budget for courses & conferences."
          },
          {
            "icon": "🏥",
            "title": "Health Coverage",
            "description": "Comprehensive medical, dental, and wellness stipends."
          }
        ]
      },
      "orderIndex": 1,
      "isVisible": true
    },
    {
      "_id": "sec_jobs_003",
      "type": "JOBS",
      "title": "Open Opportunities",
      "subtitle": "Find your next role with us.",
      "content": {
        "showSearch": true,
        "showFilters": true,
        "layoutStyle": "cards"
      },
      "orderIndex": 2,
      "isVisible": true
    }
  ],

  "publishedSections": [
    /* Snapshot of sections when recruiter hits 'Publish Page' */
  ],

  "isPublished": true,
  "lastPublishedAt": "2026-09-06T12:00:00.000Z",
  "createdAt": "2026-09-06T10:00:00.000Z",
  "updatedAt": "2026-09-06T16:45:00.000Z"
}
```

---

## 2.2 ⚡ Real-Time Responsive Live Preview Architecture ("Response Change Preview")

### 💬 Why We Designed It This Way

When designing a modern Page Builder, the traditional web CMS workflow (**Edit field ➔ Click Save ➔ Wait 3 seconds for database response ➔ Refresh preview tab**) feels sluggish and frustrating. It breaks a recruiter's creative momentum.

We wanted the Studio experience to feel like **Figma or Canva**—where every keystroke, color tweak, or layout re-ordering reflects **instantly (60 FPS)** in the center of the screen, while giving recruiters full confidence in how their page looks across desktop, tablet, and mobile devices before publishing.

#### Core Design Decisions & Goals:
1. **Zero Input Latency (0ms UI Lag)**: Editing text or dragging a slider should update the DOM immediately in browser memory without waiting for backend network roundtrips.
2. **Multi-Device Responsive Previewing**: Recruiters should be able to toggle between Desktop (`100%`), Tablet (`768px`), and Mobile (`390px` iPhone frame) with a single click to catch layout overflow or readability issues before candidates do.
3. **Decoupled Database I/O**: Network requests are completely isolated from editing. You can make 100 visual tweaks in memory safely, and only write to MongoDB when you click **"Save Draft"** or **"Publish Page"**.

---

### ⚙️ How It Works Under the Hood

#### 1. The React Unidirectional Data Flow
The entire Studio Editor state is lifted up into a single custom hook (`useEditorState.js`). 

```text
┌─────────────────────────────────┐
│     Control Panel (Right)       │
│  - Text Inputs / Section Form   │
│  - Color Pickers & Font Selector│
└────────────────┬────────────────┘
                 │ 1. Triggers onChange event
                 ▼
┌─────────────────────────────────┐
│   useEditorState (Custom Hook)  │
│  - Holds top-level `company`    │
│  - Manages Undo/Redo history    │
└────────────────┬────────────────┘
                 │ 2. Updates state immutably & re-renders
                 ▼
┌─────────────────────────────────┐
│   Middle Preview Canvas         │
│  - Applies CSS Variables        │
│  - Resizes Viewport (390/768px) │
│  - Smooth auto-scrolls to target│
└─────────────────────────────────┘
```

- When a recruiter types a character in the right-side inspector (`EditorRightPanel.js`), an `onChange` event calls `updateCompany()`.
- `updateCompany()` mutates the top-level `company` React state object immutably and saves a snapshot in the internal history stack (enabling `Cmd+Z` Undo / `Cmd+Y` Redo).

#### 2. Dynamic CSS Variables Engine
Instead of re-mounting heavy React components whenever theme colors change, `EditorCanvas.js` injects CSS custom properties directly onto the wrapper container:

```javascript
const brandStyles = useMemo(() => ({
  '--brand-primary': company.primaryColor,
  '--brand-accent': company.accentColor,
  '--brand-bg': company.backgroundColor,
  '--brand-text': company.textColor,
  '--brand-radius': company.borderRadius,
  fontFamily: `'${company.fontFamily}', sans-serif`,
}), [company]);
```
All child section components (`HeroSection`, `PerksSection`, `JobsSection`) use these CSS variables. Changing a color picker instantly recalculates styles across the entire page without DOM teardowns.

#### 3. Simulated Device Viewport Sandbox
The preview canvas container dynamically swaps layout constraint classes based on `viewportMode`:
- **Desktop Mode**: `w-full` (`100%` width)
- **Tablet Mode**: `w-[768px]` (centers a 768px iPad breakpoint frame with drop shadows)
- **Mobile Mode**: `w-[390px]` (centers a 390px iPhone frame with rounded bezels and mobile scrollbars)

#### 4. Smooth Auto-Focus & Auto-Scroll
To prevent recruiters from losing track of what section they are editing:
- Whenever a section is clicked in the left tree or right inspector, `selectedSectionId` changes.
- An internal `useEffect` triggers `scrollIntoView({ behavior: 'smooth', block: 'center' })`, instantly centering the middle canvas on the exact section being modified.



---

## 2.3 🔍 How We Designed Job Pages for Search Engine Optimization (SEO)

### 💬 Why We Built It This Way

Most candidates start looking for jobs on Google. If a careers builder opens jobs inside popups or relies purely on client-side JavaScript, Google won't index those jobs. Companies miss out on candidates simply because Google can't "see" the positions!

We wanted every job posted on our platform to show up directly on **Google Search, Google Jobs, and social media feeds (LinkedIn, Twitter, WhatsApp)** without any extra effort from recruiters.

---

### 💡 Simple Breakdown: How It Works & What We Did

1. **Server-Side Rendering (Pre-made Web Pages for Google)**
   - **Why**: Google's web crawler prefers complete web pages over empty scripts.
   - **How**: We use Next.js `getServerSideProps`. When Google visits a job link, our server fetches the job details from MongoDB and hands Google a fully built HTML page right away.

2. **Google Jobs Integration (Built-in Job Ticket)**
   - **Why**: To get our job postings listed directly inside Google's blue "Jobs" box on search results.
   - **How**: We automatically attach a small JSON snippet (`JobPosting` schema via [`utils/seoHelper.js`](file:///home/naveen-kerla/Pictures/careers-page-builder/frontend/utils/seoHelper.js)) to every job page. It tells Google the exact title, location, salary range, workplace policy (e.g. Remote), and company name.

3. **Unique Web Address (URL) for Every Job**
   - **Why**: Modal popups can't be bookmarked, indexed, or shared.
   - **How**: Every position gets its own clean, shareable web link (e.g., `/companies/workable/jobs/senior-react-developer`).

4. **Rich Social Media Preview Cards (OpenGraph)**
   - **Why**: When someone pastes a job link on LinkedIn or WhatsApp, it should look professional with a preview image, title, and description instead of a plain link.
   - **How**: We dynamically inject OpenGraph meta tags (`og:title`, `og:image`, `og:description`) into the top of every page.

5. **Clean HTML Structure (Easy for Search Engines to Read)**
   - **Why**: Search engines give better rankings to clear, well-structured pages.
   - **How**: We use standard HTML tags like single `<h1>` headers, breadcrumb links, and semantic `<article>` tags.

---

## 3. 🗄️ Database Schemas (Mongoose / MongoDB)

### 3.1 User Schema (`users` collection)
Stores recruiter accounts linked to their owned company document.

```javascript
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Hidden by default in queries
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    role: {
      type: String,
      enum: ['recruiter', 'admin'],
      default: 'recruiter',
    },
  },
  { timestamps: true }
);
```

---

### 3.2 Company Schema (`companies` collection)
Stores company profiles, theme tokens, social links, and an embedded array of modular sections.

```javascript
const SectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['HERO', 'ABOUT', 'CULTURE', 'PERKS', 'JOBS', 'TEAM', 'TESTIMONIALS', 'FAQ', 'CTA', 'GALLERY'],
    required: true,
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  orderIndex: { type: Number, required: true, default: 0 },
  isVisible: { type: Boolean, default: true },
});

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Theme Styling Tokens
    primaryColor: { type: String, default: '#2563eb' },
    accentColor: { type: String, default: '#3b82f6' },
    backgroundColor: { type: String, default: '#0f172a' },
    textColor: { type: String, default: '#f8fafc' },
    fontFamily: { type: String, default: 'Outfit' },
    borderRadius: { type: String, default: '16px' },

    // Company Assets & Media
    logoUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    videoUrl: { type: String, default: '' },

    // Social Links
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      glassdoor: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },

    // Draft & Published Section Layout Arrays
    sections: [SectionSchema],
    publishedSections: [SectionSchema],
    isPublished: { type: Boolean, default: true },
    lastPublishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
```

---

### 3.3 Job Schema (`jobs` collection)
Stores individual job postings linked to a company.

```javascript
const JobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    companySlug: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    job_slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    
    department: { type: String, required: true, default: 'Engineering' },
    location: { type: String, required: true, default: 'Remote' },
    work_policy: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
    employment_type: { type: String, enum: ['Full time', 'Part time', 'Contract', 'Internship'], default: 'Full time' },
    experience_level: { type: String, enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead / Director'], default: 'Mid-level' },
    job_type: { type: String, default: 'Permanent' },
    salary_range: { type: String, default: 'Competitive' },
    posted_days_ago: { type: Number, default: 0 },
    
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);
```

---

## 4. 🧪 Comprehensive Test Plan

### 4.1 Backend Endpoint Testing Strategy
- **Authentication**:
  - Test registration creates User, Company, default `sections`, and returns valid JWT token.
  - Test login with valid vs invalid password returns `200 OK` or `401 Unauthorized`.
  - Test `/api/auth/me` with valid vs expired token.
- **Company CRUD**:
  - Test `GET /api/companies/:slug` returns valid company structure.
  - Test `PUT /api/companies/:slug` updates theme colors, font families, and sections.
  - Test `POST /api/companies/:slug/publish` copies `sections` to `publishedSections`.
- **Job Search & Filtering**:
  - Test `GET /api/companies/:slug/jobs` with search term (e.g. `search=Engineer`).
  - Test multi-facet query parameter combinations (`department=Engineering&work_policy=Remote`).

---

### 4.2 Frontend Unit & Integration Testing
- **Theme & Font Switcher**: Verify changing Google Fonts updates CSS font variables dynamically.
- **Section Operations**: Verify adding, reordering, duplicating, hiding, and deleting sections updates component state correctly without crashing.
- **Fallback Verification**: Verify missing logo URL renders text fallback logo; verify missing video URL expands story column cleanly.

---

### 4.3 Automated Production Build Verification
- Execute `npm run build` inside `frontend/` to verify zero type errors, zero broken imports, and successful static page generation across all 9 routes (`/`, `/companies/[slug]`, `/companies/[slug]/jobs`, `/dashboard/[slug]`, `/editor/[slug]`, `/login`, `/register`, etc.).

---

## 5. 🚀 Scalability & Future Extensibility

### 💬 Is This Application Ready to Scale?

**Yes, absolutely.** The core architecture of the Careers Page Builder & Recruiter Studio is built from the ground up to scale seamlessly across **three key dimensions**:
1. **Multi-Tenant Scale** (handling thousands of recruiters & companies independently).
2. **Editor & Component Extensibility** (adding new tools, section templates, and widgets effortlessly).
3. **Infrastructure & Network Scaling** (independent scaling of frontend and backend).

---

### 💡 The 4 Pillars of Our Scalable Design

#### 1. Multi-Tenant Isolation & Recruiter Scaling
- **Independent Company Portals**: Every recruiter account is linked to a unique company `slug`. Database queries are indexed by `companySlug` and `email` for \(O(1)\) lookup times.
- **Tenant Data Security**: JWT authentication scopes recruiter editing permissions strictly to their owned company document, preventing cross-tenant data leaks.
- **High Concurrency Readiness**: Stateless JWT sessions mean backend servers don't store session state in memory, allowing backend API nodes to scale horizontally behind a load balancer without sticky sessions.

#### 2. Plug-and-Play Section Registry (Editor Extensibility)
- **Extensible Section Architecture**: Adding a new section type (e.g. `LOCATIONS_MAP`, `AWARDS`, `EMPLOYEE_BENEFITS_CALCULATOR`, or `PODCAST_SHOWCASE`) requires **zero changes to database schemas or core editor mechanics**.
- **How It Scales**: 
  1. Add a template JSON default to [`utils/sectionTemplates.js`](file:///home/naveen-kerla/Pictures/careers-page-builder/frontend/utils/sectionTemplates.js).
  2. Register the component in [`EditorCanvas.js`](file:///home/naveen-kerla/Pictures/careers-page-builder/frontend/components/editor/EditorCanvas.js).
  3. Register the form fields in [`EditorRightPanel.js`](file:///home/naveen-kerla/Pictures/careers-page-builder/frontend/components/editor/EditorRightPanel.js).
  The editor handles reordering, visibility toggling, duplication, and live rendering automatically!

#### 3. Standardized JSON Schema Contract
- **Loose Coupling**: The frontend components and database persistence layer communicate via a clean, standardized JSON contract (`sections: [{ type, title, subtitle, content, isVisible, orderIndex }]`).
- **Backward & Forward Compatibility**: Adding new optional fields to section `content` objects never breaks existing stored company pages. Missing fields gracefully fall back to defaults.

#### 4. Decoupled Edge & Server Infrastructure
- **Frontend CDN Distribution**: Next.js candidate pages can be cached at the Edge (via Vercel, Cloudflare, or AWS CloudFront CDN) for instant global load speeds under heavy candidate traffic spikes.
- **Database & Microservices Readiness**: MongoDB Atlas handles automatic sharding and horizontal scaling. If job search traffic grows massively, the job filtering endpoints (`/api/companies/:slug/jobs`) can easily be split into an isolated microservice without modifying the recruiter studio frontend.

