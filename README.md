# Campus Payroll for Colleges & Universities

A full-stack payroll management system for colleges and universities, built with **React** (Vite) and **Node.js** (Express).

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router, Recharts, Lucide Icons |
| Backend   | Node.js, Express, JWT Auth        |
| Data      | In-memory store with seed data    |

## Quick Start

### 1. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

### 2. Start Development Servers
```bash
# Backend (port 5000)
cd server && npm run dev

# Frontend (port 5173)
cd client && npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

**Admin Demo:** `admin@tamilnaducollege.edu` / `admin123`
**Employee Demo:** `meera.krishnan@tamilnaducollege.edu` / `employee123`

## Project Structure

See [docs/STRUCTURE.md](docs/STRUCTURE.md) for a detailed folder-by-folder breakdown.

## Modules

- **Dashboard** — Payroll overview, metrics, charts, to-do list
- **Employees** — CRUD, onboarding wizard, profiles
- **Pay Runs** — Monthly payroll processing & approval
- **Leave & Attendance** — Leave requests, attendance tracking
- **Approvals** — Centralized pending approvals
- **Taxes & Forms** — PF, ESI, TDS management
- **Loans** — Employee loan tracking
- **Reports** — Payroll & statutory reports
- **Settings** — Organization & salary configuration
