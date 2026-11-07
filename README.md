# Doctor Tracker Backend API

Production-ready NestJS REST API for **Doctor Tracker** — Clinical Administration Dashboard. Built with **NestJS 12**, **Neon Serverless PostgreSQL (TypeORM)**, **JWT Authentication**, and **Swagger OpenAPI 3.0 Documentation**.

---

## 🚀 Live Endpoints & Swagger Documentation

- **Swagger API Docs (Interactive UI)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Alternative Swagger Path**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Service Health Check**: [http://localhost:3000/](http://localhost:3000/)

---

## 🔐 Default Demo Credentials (Auto-Seeded)

The system automatically initializes and seeds these accounts in Neon DB upon startup:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Clinical Administrator** | `admin@doctortracker.com` | `password123` | Full access (`ADMIN` role): Manage doctors, patients, user roles |
| **Chief Physician** | `sarah.jenkins@mayoclinic.org` | `doctorPass2026!` | Clinical staff access (`DOCTOR` role): Manage assigned patients, caseloads |

---

## 📋 API Highlights & Endpoints

### 1. Authentication (`/auth`)
- `POST /auth/login` — Sign in with email & password, returns JWT `accessToken` and user profile.
- `POST /auth/register` — Register a new clinical user.
- `GET /auth/profile` *(Bearer Token required)* — Retrieve authenticated user profile.
- `GET /auth/me` *(Bearer Token required)* — Alias for `/profile`.
- `POST /auth/logout` — Invalidate session.

### 2. User Administration (`/user`)
- `GET /user` *(Admin / Doctor)* — List all registered users.
- `PATCH /user/update/:id` *(Admin)* — Update user profile or role (`ADMIN`, `DOCTOR`, `USER`).
- `DELETE /user/delete/:id` *(Admin)* — Remove user account.

### 3. Doctors Management (`/doctors`)
- `GET /doctors` — List all doctors with query filters (`search`, `specialization`, `status`).
- `GET /doctors/:id` — Get doctor details by ID.
- `POST /doctors` *(Admin)* — Register a new doctor.
- `PUT /doctors/:id` *(Admin / Doctor)* — Update doctor profile.
- `DELETE /doctors/:id` *(Admin)* — Delete doctor record.

### 4. Patients Management (`/patients`)
- `GET /patients` — List patients with query filters (`search`, `condition`, `doctorId`, `status`).
- `GET /patients/:id` — Get patient clinical details.
- `POST /patients` *(Admin / Doctor)* — Admit / register patient.
- `PUT /patients/:id` *(Admin / Doctor)* — Update patient record.
- `DELETE /patients/:id` *(Admin)* — Remove patient record.

### 5. Hospital Analytics & Dashboard (`/dashboard`)
- `GET /dashboard/stats` — Real-time hospital metrics (total doctors, caseloads, growth rates).
- `GET /dashboard/trends` — Monthly admission and registration trend telemetry.

---

## ⚙️ Environment Configuration

Configuration in `.env` (refer to `.env.example`):

```env
PORT=3000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xu7sm0d.mongodb.net/doctorTracker?retryWrites=true&w=majority
JWT_SECRET=superSecretKeyForDoctorTracker2026!
JWT_EXPIRES_IN=7d
```

---

## 🛠️ Run the Application

```bash
# Install dependencies
$ npm install

# Build application
$ npm run build

# Start production server
$ npm run start:prod

# Start development mode with hot reload
$ npm run start:dev
```
