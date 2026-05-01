# Face Camera Attendance System

A full-stack application for managing employee attendance using facial recognition cameras.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Features**: Attendance tracking, camera management, employee management

## Development Setup

### Prerequisites

- Python 3.14+
- Node.js 18+
- PostgreSQL (or use Docker)

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd face_camera
   ```

2. **Backend setup**:
   ```bash
   cd backend
   uv sync  # Install dependencies
   # Configure your .env file (copy from .env.example)
   ```

3. **Frontend setup**:
   ```bash
   cd ../frontend
   npm install
   # .env file is already configured
   ```

4. **Run both servers**:
   ```bash
   cd ..
   ./dev.sh
   ```

   This will start:
   - Backend API on http://localhost:8000
   - Frontend on http://localhost:5173

### Manual Start

**Backend** (Terminal 1):
```bash
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/attendance/list` - Get attendance records
- `POST /api/camera/add` - Add camera
- `GET /api/camera/list` - Get cameras
- `POST /api/employee/add` - Add employee
- `GET /api/employee/{id}` - Get employee details

## Environment Variables

### Backend (.env)
```
POSTGRES_USER=face_camera_user
POSTGRES_PASSWORD=face_camera_password
POSTGRES_DB=face_camera_db
APP_CONFIG__DATABASE__URL=postgresql+asyncpg://...
APP_CONFIG__SERVER__HOST=0.0.0.0
APP_CONFIG__SERVER__PORT=8000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

## Development Notes

- Frontend proxies `/api/*` requests to backend automatically
- CORS is configured to allow requests from `http://localhost:5173`
- Hot reload enabled for both frontend and backend
- Database migrations handled by Alembic