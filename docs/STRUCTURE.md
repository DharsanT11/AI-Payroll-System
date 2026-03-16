# Project Structure Guide

> This document explains the folder structure so that any new team member can quickly understand and contribute to the project.

## Root Directory

```
d:\Ai Payroll\
├── client/          → React frontend application
├── server/          → Node.js backend API
├── docs/            → Project documentation
└── README.md        → Quick start guide
```

## Frontend — `client/`

```
client/src/
├── main.jsx                → App entry point (renders <App />)
├── App.jsx                 → Root component, sets up routing
├── index.css               → Global styles, CSS variables (design tokens)
│
├── assets/                 → Static files (images, SVGs, fonts)
│
├── components/             → Reusable UI building blocks
│   ├── layout/             → Page structure components
│   │   ├── Sidebar.jsx     → Left navigation panel (dark themed)
│   │   ├── Topbar.jsx      → Top header bar (search, notifications, user)
│   │   └── MainLayout.jsx  → Combines Sidebar + Topbar + content area
│   ├── common/             → Generic, reusable components
│   │   ├── StatCard.jsx    → Metric display card (icon, value, label)
│   │   ├── DataTable.jsx   → Sortable data table with pagination
│   │   ├── Modal.jsx       → Dialog/popup overlay
│   │   ├── Badge.jsx       → Status indicator badge
│   │   └── Button.jsx      → Styled button variants
│   └── charts/             → Data visualization wrappers
│       └── PayrollChart.jsx → Recharts bar/pie chart components
│
├── pages/                  → One folder per route/module
│   ├── Dashboard/          → Main overview page
│   ├── Employees/          → Employee management (list + add + view)
│   ├── PayRuns/            → Payroll processing
│   ├── LeaveAttendance/    → Leave tracking
│   ├── Approvals/          → Pending approvals
│   ├── TaxesForms/         → Statutory tax management
│   ├── Loans/              → Loan management
│   ├── Reports/            → Generated reports
│   ├── Settings/           → Org & salary config
│   └── Auth/               → Login page
│
├── hooks/                  → Custom React hooks (useAuth, useFetch)
├── context/                → React Context for global state (AuthContext)
├── services/               → API calls via axios (api.js, employeeService.js)
└── utils/                  → Pure helper functions (formatCurrency, etc.)
```

### Key Conventions
- **Pages** contain route-level logic and compose **Components**.
- **Components** are reusable and do not make API calls directly.
- **Services** handle all HTTP communication with the backend.
- **Context** manages global state (auth, theme) across the app.

---

## Backend — `server/`

```
server/src/
├── index.js                → Server entry point (starts Express)
├── app.js                  → Express config (middleware, routes, error handler)
│
├── config/                 → Configuration
│   ├── db.js               → In-memory data store initialization
│   └── constants.js        → Enums, tax slabs, deduction rules
│
├── middleware/              → Express middleware
│   ├── auth.js             → JWT token verification
│   └── errorHandler.js     → Centralized error response handler
│
├── models/                 → Data model helpers (CRUD on in-memory store)
│   ├── Employee.js
│   ├── PayRun.js
│   ├── Leave.js
│   └── Loan.js
│
├── routes/                 → Express Router files (one per module)
│   ├── auth.js
│   ├── employees.js
│   ├── payRuns.js
│   ├── leaves.js
│   ├── taxes.js
│   ├── loans.js
│   ├── reports.js
│   └── settings.js
│
├── controllers/            → Request handlers (business logic)
│   ├── authController.js
│   ├── employeeController.js
│   ├── payRunController.js
│   └── ...
│
├── services/               → Core business logic (tax calculations, etc.)
│
├── utils/                  → Helper functions
│
└── data/                   → Seed JSON data for demo
    ├── employees.json
    ├── payRuns.json
    └── leaves.json
```

### Key Conventions
- **Routes** define URL paths and map them to **Controllers**.
- **Controllers** handle request/response and call **Services** for logic.
- **Models** provide data access methods on the in-memory store.
- **Data** folder contains JSON seed files loaded at server start.
