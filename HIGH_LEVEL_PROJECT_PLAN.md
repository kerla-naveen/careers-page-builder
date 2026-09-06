# 🗺️ High-Level Project Plan & Product Architecture

This document defines the **initial high-level design approach and project plan** for the **Careers Page Builder & Recruiter Studio**. 

The core philosophy of this product is **Decoupled SaaS Architecture**: The company's Career Page acts as a customizable template, while Jobs are separate dynamic resources that inherit the company's brand theme and generate public candidate web pages automatically.

---

## 🎯 1. Core Architectural Philosophy

### 1.1 Decoupling Career Page Templates from Job Resources
- **The Career Page is a Customizable Template**: The recruiter edits visual layout sections (`Hero`, `About Company`, `Culture`, `Benefits`, `Open Positions`). Jobs are **NOT** hardcoded inside this template.
- **Jobs are Separate Dynamic Resources**: Jobs are stored as independent database records. The `Open Positions` section inside the Career Page acts as a dynamic viewer that fetches and displays published jobs in real-time.

```text
                        Recruiter Dashboard
                                │
       ┌────────────────────────┴────────────────────────┐
       ↓                                                 ↓
Career Page Editor                               Job Management
  ├── Hero                                         ├── Create Job
  ├── About Company                                ├── Edit Job
  ├── Culture                                      ├── Delete Job
  ├── Benefits                                     ├── Publish / Unpublish
  └── Jobs Section (Dynamic Viewer)                └── View Jobs
```

---

### 1.2 Automated Dynamic Job Page Generation
Recruiters do **NOT** need to manually design or build individual job pages:
1. Recruiter creates a job in **Job Management** (`POST /api/recruiter/jobs`).
2. The system saves the job record and assigns a unique `job_slug`.
3. A public dynamic job page is **automatically generated** at `/careers/:companySlug/:jobSlug`.

```text
Recruiter ──► Create Job ──► Database Record ──► Automatically Available ──► /careers/:companySlug/:jobSlug
```

---

### 1.3 Universal Brand & Theme Inheritance
Every individual job page automatically inherits its parent company's Career Page Theme & Branding settings:
- **Brand Colors**: Primary (`#6C5CE7`), Accent, Background, Text colors.
- **Header & Footer**: Company logo, brand name, and social media links.
- **Typography**: Selected Google Fonts family (e.g., *Inter*, *Outfit*).
- **Banner Asset**: Hero cover photo or header background.

```text
                               Company
                                  │
                   ┌──────────────┴──────────────┐
                   ↓                             ↓
             Career Page                      Job Pages
                   │                             │
             Theme/Branding ─────────────────────┤
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        ↓                        ↓                        ↓
                      Job 1                    Job 2                    Job 3
```

---

## 🌐 2. SaaS URL & Route Architecture

The platform uses an explicit SaaS namespace architecture where the company slug comes first:

| Route Path | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `/careers/:companySlug` | Public | Main Company Career Landing Page | `/careers/acme` |
| `/careers/:companySlug/:jobSlug` | Public | Dynamic Individual Job Posting Page | `/careers/acme/backend-developer-bangalore` |
| `/dashboard/:companySlug` | Private | Recruiter Studio (Editor & Job Management) | `/dashboard/acme` |

---

## 🗄️ 3. Structured Data Model Design

### 3.1 Job Schema (`Job` Model)
Instead of storing stale strings like `"21 days ago"`, the job model stores `published_at` as a timestamp (`ISODate`). The application dynamically calculates relative time (`Today - published_at` $\rightarrow$ `"21 days ago"`) on every render, ensuring dates never grow stale.

```json
{
  "title": "Backend Developer",
  "work_policy": "Hybrid",
  "location": "Bangalore, India",
  "department": "Product",
  "employment_type": "Part time",
  "experience_level": "Senior",
  "job_type": "Temporary",
  "salary_range": "USD 80K–120K / year",
  "job_slug": "backend-developer-bangalore",
  "description": "We are seeking a talented Backend Developer...",
  "requirements": "• 5+ years Node.js experience\n• MongoDB & Redis",
  "status": "PUBLISHED",
  "company_id": "company_123",
  "company_slug": "acme",
  "published_at": "2026-08-15T10:30:00Z",
  "created_at": "2026-08-15T10:30:00Z",
  "updated_at": "2026-09-06T12:00:00Z"
}
```

---

## 📡 4. Clean REST API Architecture

The API endpoints are organized under `/api/auth` (Authentication) and `/api/companies` (Career Page & Job Management):

### 4.1 Authentication API (`/api/auth`)
- `POST /api/auth/register` — Register a recruiter account + auto-create company & default template sections.
- `POST /api/auth/login` — Authenticate recruiter credentials and issue JWT token.
- `GET /api/auth/me` — Fetch current logged-in recruiter context.

---

### 4.2 Company & Career Page API (`/api/companies`)
- `GET /api/companies` — List all registered companies.
- `GET /api/companies/:slug` — Get company details, brand styles, and page section layout.
- `POST /api/companies` — Create a new company portal dynamically.
- `PUT /api/companies/:slug` — Update company branding, theme colors, Google Fonts, and section layouts.
- `POST /api/companies/:slug/publish` — Publish draft sections to the live candidate site.
- `DELETE /api/companies/:slug` — Delete a company portal.

---

### 4.3 Job Management API (`/api/companies/:slug/jobs`)
- **Public Candidate Jobs**:
  - `GET /api/companies/:slug/jobs` — Candidate search & multi-facet filtering.
  - `GET /api/companies/:slug/jobs/:job_slug` — Fetch individual job posting details + Schema.org JSON-LD data.
- **Recruiter Studio Jobs**:
  - `GET /api/companies/:slug/jobs/recruiter` — Fetch all jobs (published & draft) for recruiter dashboard table.
  - `POST /api/companies/:slug/jobs` — Create a new job posting.
  - `PUT /api/companies/:slug/jobs/:id` (or `/api/companies/jobs/:id`) — Update an existing job posting.
  - `PATCH /api/companies/:slug/jobs/:id/status` — Toggle job status between `published` and `draft`.
  - `POST /api/companies/:slug/jobs/:id/duplicate` — Duplicate a job posting.
  - `DELETE /api/companies/:slug/jobs/:id` (or `/api/companies/jobs/:id`) — Delete a job posting.
  - `POST /api/companies/:slug/jobs/bulk-status` — Bulk update status for multiple selected jobs.
  - `POST /api/companies/:slug/jobs/bulk-delete` — Bulk delete multiple selected jobs.

---

## 🖥️ 5. Recruiter Dashboard Interface Flow

The **Recruiter Dashboard** is organized into two primary tabs:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🎨 Career Page                                          💼 Jobs              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        CAREER PAGE EDITOR                                   │
│                                                                             │
│  [Hero Section]           - Title, Subtitle, CTA Button, Hero Image         │
│  [About Company]          - Mission Story, Milestones, Intro Video          │
│  [Culture & Values]       - Values Grid, Icons, Descriptions                │
│  [Perks & Benefits]       - Employee Perks Grid                             │
│  [Open Positions Viewer]  - Dynamic Viewer for Published Jobs               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

When switching to the **Jobs Tab**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🎨 Career Page                                          💼 Jobs  [+ Create] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Backend Developer         [ PUBLISHED ]               [ Edit ]  [ Delete ]  │
│ Bangalore, India | Hybrid | Product                                         │
│                                                                             │
│ Frontend Developer        [ DRAFT ]                   [ Edit ]  [ Delete ]  │
│ Hyderabad, India | Remote | Engineering                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 6. High-Level Implementation Roadmap

1. **Phase 1 — Decoupled Schemas & Dynamic SaaS Routes**:
   - Establish `Company` and `Job` MongoDB schemas with `published_at` timestamping.
   - Configure SaaS routes `/careers/:companySlug` and `/careers/:companySlug/:jobSlug`.
2. **Phase 2 — Recruiter Studio & Career Page Editor**:
   - Build section reordering, property inspectors, theme color pickers, and Google Fonts switcher.
3. **Phase 3 — Job Management & Automatic Job Page Generation**:
   - Build job CRUD form modal and automatic slug generator (`/careers/:companySlug/:jobSlug`).
4. **Phase 4 — Theme Inheritance & Candidate Multi-Facet Search**:
   - Pass brand styling tokens (`--brand-primary`, `--brand-bg`, `--brand-text`, font families) to all public job pages.
5. **Phase 5 — Google Jobs SEO & Production Polish**:
   - Inject Schema.org `JobPosting` JSON-LD data on every individual job page.
