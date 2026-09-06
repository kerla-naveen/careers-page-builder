# Careers Page Builder & Recruiter Studio 🚀

A full-stack, enterprise-grade **Careers Page Builder & Recruiter Studio** built with **Next.js 14**, **Tailwind CSS v4**, **Node.js / Express**, and **MongoDB**. 

This application enables **Recruiters** to dynamically build, customize, brand, and publish interactive careers pages (with real-time live previews, section reordering, theme customization, and job management), while providing **Candidates** with a candidate experience to search, filter, and apply for open positions.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (Pages Router), React, Tailwind CSS v4, PostCSS, Google Fonts integration
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM), JWT (JSON Web Tokens), bcryptjs
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Design & Styling**: Custom Tailwind v4 theme design system (`@theme`), glassmorphism, responsive viewports

---

## 🔑 Test Companies & Recruiter Credentials

The database comes pre-seeded with **3 test companies** and **150 real job entries**. You can use the following test recruiter accounts to log into the Studio:

| Company Name | Company Slug | Recruiter Email | Password | Live Candidate Page | Recruiter Studio Dashboard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Workable** | `workable` | `recruiter@workable.com` | `password123` | [View Live Page](http://localhost:3000/companies/workable) | [Open Studio](http://localhost:3000/dashboard/workable) |
| **Ashby** | `ashby` | `recruiter@ashby.com` | `password123` | [View Live Page](http://localhost:3000/companies/ashby) | [Open Studio](http://localhost:3000/dashboard/ashby) |
| **Whitecarrot** | `whitecarrot` | `recruiter@whitecarrot.com` | `password123` | [View Live Page](http://localhost:3000/companies/whitecarrot) | [Open Studio](http://localhost:3000/dashboard/whitecarrot) |

> 💡 **Tip**: You can also register a brand new recruiter account at `http://localhost:3000/register`. Registering automatically generates a new company slug and initializes a default section layout!

---

## 💻 How to Run the Application Locally

### Prerequisites
Make sure you have the following installed on your machine:
1. **Node.js** (v18.0.0 or higher) & `npm`
2. **MongoDB** running locally at `mongodb://127.0.0.1:27017/careers_page_builder` (or a MongoDB Atlas connection URI)

---

### Step 1: Clone & Navigate to Repository
```bash
git clone <repository-url>
cd careers-page-builder
```

---

### Step 2: Backend Setup & Data Seeding

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   Create a `.env` file in the `backend/` directory (or use default fallbacks):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/careers_page_builder
   JWT_SECRET=super_secret_jwt_key_2026
   ```

4. **Seed Database with Sample Data**:
   Populates MongoDB with demo companies (`workable`, `ashby`, `whitecarrot`), test recruiter accounts, and **150 job postings**:
   ```bash
   npm run seed
   ```

5. **Start Backend Server**:
   ```bash
   npm run dev
   ```
   The backend API will start running on **`http://localhost:5000`**.

---

### Step 3: Frontend Setup & Development Server

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will start on **`http://localhost:3000`**.

4. **Production Build Verification (Optional)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📡 Backend API Endpoints & Their Purpose

All backend endpoints are prefixed with `/api`. Here is the complete endpoint reference categorized by module:

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new recruiter account, creates a company record with a unique slug, and builds default careers page section templates (`HERO`, `ABOUT`, `CULTURE`, `PERKS`, `JOBS`). |
| `POST` | `/api/auth/login` | Public | Authenticates recruiter credentials (email & password) and returns a signed JWT access token. |
| `GET` | `/api/auth/me` | Private (JWT) | Returns current logged-in recruiter user details and their linked company profile. |

---

### 2. Company & Page Builder Endpoints (`/api/companies`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | Public | Retrieves a list of all registered companies in the database. |
| `GET` | `/api/companies/:slug` | Public | Fetches company details, brand styles (primary, accent, bg, text, font, radius), logo/banner URLs, social links, and ordered page sections. |
| `POST` | `/api/companies` | Public | Creates a new company portal dynamically with initial default section templates. |
| `PUT` | `/api/companies/:slug` | Public / Recruiter | Updates company branding, Google Fonts, theme colors, social links, and section content/order/visibility from the Recruiter Studio. |
| `POST` | `/api/companies/:slug/publish` | Private (JWT) | Publishes draft page section changes to the public candidate site. |
| `DELETE` | `/api/companies/:slug` | Public | Deletes a company portal and its associated data by slug. |

---

### 3. Job Management Endpoints (`/api/companies/.../jobs`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies/:slug/jobs` | Public | Fetches published jobs for candidate view. Supports query parameter filtering (`search`, `department`, `work_policy`, `employment_type`, `experience_level`, `location`) and returns filter counts. |
| `GET` | `/api/companies/:slug/jobs/recruiter` | Public / Recruiter | Fetches all job postings (both published and draft) for the recruiter management dashboard. |
| `GET` | `/api/companies/:slug/jobs/:job_slug` | Public | Fetches single job posting details by job slug (used on dedicated job detail pages and structured Schema.org JSON-LD generation). |
| `POST` | `/api/companies/:slug/jobs` | Public / Recruiter | Creates a new job posting for a company. |
| `PUT` | `/api/companies/jobs/:id` | Public / Recruiter | Updates job fields (title, department, location, work policy, salary range, description, requirements) by job ID. |
| `PUT` | `/api/companies/:slug/jobs/:jobId/status` | Public / Recruiter | Toggles job status between `Published` and `Draft`. |
| `POST` | `/api/companies/:slug/jobs/:jobId/duplicate` | Public / Recruiter | Clones an existing job posting. |
| `DELETE` | `/api/companies/jobs/:id` | Public / Recruiter | Deletes a job posting by ID. |
| `PUT` | `/api/companies/:slug/jobs/bulk-status` | Public / Recruiter | Bulk updates status (publish / unpublish) for an array of selected job IDs. |
| `POST` | `/api/companies/:slug/jobs/bulk-delete` | Public / Recruiter | Bulk deletes an array of selected job IDs. |

---

## 🎨 Key Features & Architecture

1. **Recruiter CMS & Live Studio (`/dashboard/[slug]`)**:
   - Real-time side-by-side split screen view with live rendering.
   - Dynamic section management: reorder sections up/down, toggle visibility, add new sections (`HERO`, `ABOUT`, `CULTURE`, `PERKS`, `TEAM`, `TESTIMONIALS`, `FAQ`, `CTA`, `GALLERY`).
   - Deep content editors for arrays (Stats, Culture Values, Perks & Benefits).
   - Theme color picker (Primary, Accent, Background, Text) and Google Fonts family switcher.

2. **Candidate Portal (`/companies/[slug]`)**:
   - Fully responsive, branded public landing page.
   - Real-time job search with debounced backend API queries.
   - Multi-facet multi-select filtering by Department, Workplace Policy, Employment Type, and Location.
   - Interactive job description modal and dedicated job detail pages with Schema.org JSON-LD structured data for Google Jobs indexing.

3. **Visual Careers Page Builder (`/editor/[slug]`)**:
   - Device viewport mode switcher (Desktop `1280px`, Tablet `768px`, Mobile `375px`).
   - Immutable Undo / Redo history stack.
   - Drag/reorder section canvas overlays.

---

## 📄 License

MIT License. Built for modern recruiting teams and SaaS applications.
