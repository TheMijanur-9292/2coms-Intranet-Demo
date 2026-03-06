# 2coms Intranet Platform

Corporate Intranet Platform — Next.js 14 frontend on **Netlify** + Express/Node.js backend on **Render**.

---

## Project Structure

```
2coms-Intranet-demo/
├── backend/          ← Express + TypeScript API (deploy to Render)
├── frontend/         ← Next.js 14 App Router (deploy to Netlify)
├── render.yaml       ← Render deployment config
└── README.md
```

---

## Deploy: Backend → Render

### 1. Push to GitHub
Push this entire repo to a GitHub repository.

### 2. Create a new Web Service on Render
- Go to [render.com](https://render.com) → **New** → **Web Service**
- Connect your GitHub repo
- Render will auto-detect `render.yaml` — click **Apply**

### 3. Set Environment Variables on Render
In your Render service → **Environment**, set these secret values:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random 32+ char string |
| `JWT_REFRESH_SECRET` | Another random 32+ char string |
| `FRONTEND_URL` | Your Netlify URL (e.g. `https://your-app.netlify.app`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

### 4. Deploy
Click **Deploy** — Render runs `npm install && npm run build` then `npm start`.  
Your backend URL will be: `https://2coms-intranet-backend.onrender.com`

---

## Deploy: Frontend → Netlify

### 1. Create a new site on Netlify
- Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
- Connect your GitHub repo
- Netlify auto-reads `frontend/netlify.toml`:
  - **Base directory:** `frontend`
  - **Build command:** `npm run build`
  - **Publish directory:** `.next`

### 2. Set Environment Variables on Netlify
In your site → **Site configuration** → **Environment variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-render-service.onrender.com/api/v1` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.netlify.app` |

### 3. Install Netlify Next.js Plugin
Netlify will auto-install `@netlify/plugin-nextjs` from `netlify.toml`.  
If prompted, confirm the plugin installation.

### 4. Deploy
Click **Deploy site** — done!

---

## Local Development

### Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in values
cp .env.example .env
npm run dev        # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# Copy .env.local.example to .env.local and fill in values
cp .env.local.example .env.local
npm run dev        # runs on http://localhost:3001
```

### Seed Database (first time only)
```bash
cd backend
npm run seed
```

Default credentials after seeding:
| Role | Email | Password |
|---|---|---|
| Admin | admin@2coms.com | Admin123! |
| HR | hr@2coms.com | HrAdmin123! |
| Employee | employee@2coms.com | Employee123! |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zustand, Axios |
| Backend | Express.js, TypeScript, Mongoose, JWT, Helmet, Winston |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |
| Backend Host | Render |
| Frontend Host | Netlify |
