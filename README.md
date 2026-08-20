# Full-Stack Authentication System (FastAPI + Vanilla Web)

A complete, production-grade **Login, Signup, and Logout Authentication System** with a Python **FastAPI** backend, **SQLAlchemy** database layer (supporting MySQL with automatic SQLite fallback), **JWT Authentication** stored in secure **HttpOnly Cookies**, and a clean **Vanilla HTML/CSS/JS** frontend with modern dark-mode glassmorphic styling.

---

## Key Features

- **Full Signup Flow**: Full Name, Phone Number, Email, Password, and Confirm Password fields with real-time client-side & server-side validation.
- **Secure Password Hashing**: Passwords hashed securely using `bcrypt` / `passlib` before storage.
- **JWT & HttpOnly Cookie Session**: JWT tokens stored in HttpOnly cookies to protect against XSS vulnerabilities.
- **Protected Dashboard**: Accessible only to authenticated users with persistent sessions across page reloads.
- **Graceful Logout**: Securely clears authentication cookies and terminates sessions.
- **MySQL & SQLite Support**: Built-in SQLAlchemy setup with MySQL driver (`pymysql`) support + automatic SQLite fallback for instant local testing.
- **Zero-Build Vanilla Frontend**: Simple HTML, CSS, and JS with zero npm installation or build tools required.
- **Swagger / OpenAPI Documentation**: Pre-configured interactive API documentation at `/docs` and `/redoc`.

---

## Project Structure

```text
LoginLogout/
├── backend/
│   ├── main.py              # FastAPI app initialization, CORS, static file mount
│   ├── database.py          # SQLAlchemy engine, MySQL connection & SQLite fallback
│   ├── models.py            # User database model
│   ├── schemas.py           # Pydantic validation schemas (Signup, Login, Response)
│   ├── auth.py              # Password hashing & JWT token handling
│   ├── config.py            # Environment configuration settings
│   ├── requirements.txt     # Backend Python dependencies
│   ├── .env                 # Local backend environment variables
│   └── routers/
│       └── auth.py          # API Endpoints (/signup, /login, /me, /logout)
├── frontend/
│   ├── index.html           # Automatic session checker & redirector
│   ├── signup.html          # Signup page
│   ├── login.html           # Login page
│   ├── dashboard.html       # Protected user dashboard
│   ├── css/
│   │   └── style.css        # Modern glassmorphism dark stylesheet
│   └── js/
│       ├── config.js        # API fetch helper with HttpOnly Cookie credentials
│       ├── signup.js        # Signup validation & request handler
│       ├── login.js         # Login request handler
│       └── dashboard.js     # Session validator, profile renderer & logout handler
├── .env.example             # Environment template
└── README.md                # Documentation
```

---

## Getting Started

### 1. Backend Setup & Execution

1. Open terminal in the `backend/` directory:
   ```bash
   cd d:\LoginLogout\backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI development server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

4. Interactive API Documentation:
   - **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 2. Accessing the Frontend

Once the backend is running, you can access the frontend directly from FastAPI:
- **Login Page**: [http://127.0.0.1:8000/static/login.html](http://127.0.0.1:8000/static/login.html)
- **Signup Page**: [http://127.0.0.1:8000/static/signup.html](http://127.0.0.1:8000/static/signup.html)
- **Dashboard**: [http://127.0.0.1:8000/static/dashboard.html](http://127.0.0.1:8000/static/dashboard.html)

Or open `login.html` with VS Code **Live Server** or any static HTTP server:
```bash
cd d:\LoginLogout\frontend
python -m http.server 5173
```
Then visit: [http://localhost:5173/login.html](http://localhost:5173/login.html)

---

## API Endpoints

| Method | Endpoint | Description | Status Code | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Create a new user account | `201 Created` | No |
| `POST` | `/api/auth/login` | Authenticate user & set HttpOnly cookie | `200 OK` | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | `200 OK` / `401` | Yes (Cookie) |
| `POST` | `/api/auth/logout` | Clear authentication cookie session | `200 OK` | Yes |
