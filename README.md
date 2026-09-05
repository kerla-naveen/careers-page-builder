# Careers Page Builder 🚀

A scalable full-stack application that enables **Recruiters** to build branded, customizable Careers pages and allows **Candidates** to explore open roles.

---

## 📁 Repository Structure

```text
careers-page-builder/
├── backend/                  # Node.js & Express REST API backend
│   ├── package.json          # Backend dependencies & scripts
│   ├── .env.example          # Environment variables template
│   └── src/
│       ├── config/
│       │   └── db.js         # MongoDB connection config
│       ├── models/
│       │   ├── Company.js    # Mongoose Company & Page Section model
│       │   └── Job.js        # Mongoose Job model
│       ├── routes/
│       │   └── companyRoutes.js # REST API endpoints
│       ├── scripts/
│       │   ├── seed.js       # Seed script populating MongoDB
│       │   └── jobs-data.json # 150 job entries from assignment sheet
│       └── server.js         # Express server entrypoint
│
├── frontend/                 # Frontend application workspace
│   ├── components/
│   ├── lib/
│   ├── pages/
│   └── styles/
│
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start - Backend

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/careers_page_builder`)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Database
Loads demo companies (`workable`, `ashby`, `whitecarrot`) and all **150 jobs** from the sample dataset into MongoDB.
```bash
npm run seed
```

### 3. Start Backend API Server
```bash
npm run dev  # Starts server with nodemon on http://localhost:5000
# or
npm start    # Starts server with node
```

---

## 📌 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/companies/:slug` | Get company profile, brand colors, and page section layout |
| **GET** | `/companies/:slug/jobs` | Get open jobs for company with search & multi-facet filtering |

### Sample Requests:
- `GET http://localhost:5000/companies/workable`
- `GET http://localhost:5000/companies/workable/jobs`
- `GET http://localhost:5000/companies/workable/jobs?search=Engineer&work_policy=Remote`
