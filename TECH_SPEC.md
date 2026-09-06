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
