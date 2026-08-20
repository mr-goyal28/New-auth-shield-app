import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

try:
    from config import settings
except ImportError:
    from backend.config import settings

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("mysql"):
            # Test MySQL connection with a short timeout (3 seconds)
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 3}
            )
            with engine.connect() as conn:
                pass
            print(f"[DATABASE] Connected successfully to MySQL: {db_url}")
            return engine
    except Exception as e:
        print(f"[DATABASE NOTICE] MySQL service not active on localhost ({e}). Defaulting to SQLite database: sqlite:///./auth.db")
        db_url = "sqlite:///./auth.db"

    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
        print(f"[DATABASE] Using SQLite database: {db_url}")
        return engine

    return create_engine(db_url)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
