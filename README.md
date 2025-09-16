# Running the App

## 1. Using Docker

To run both frontend and backend with Docker:

```bash
docker-compose up --build
```

Once the containers are up, access the frontend at:

[http://localhost:3000](http://localhost:3000)

---

## 2. Running Locally (Separate Processes)

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on **port 3000** (or as configured in your app).

To change default port change PORT variable in src/index.ts

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **port 5173** (default Vite dev server port) or as configured.

To change default port add this code in vite.config.ts inside defineConfig

```bash
server: {
    port: {your desired port},
}
```