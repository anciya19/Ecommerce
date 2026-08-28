import os

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# ==========================================
# LOAD .ENV FILE
# ==========================================

load_dotenv()


# ==========================================
# GET DATABASE URL
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL")


# ==========================================
# CHECK DATABASE URL
# ==========================================

if not DATABASE_URL:

    raise ValueError(
        "DATABASE_URL is missing from .env file"
    )


print(
    "Database configuration loaded successfully"
)


# ==========================================
# CREATE DATABASE ENGINE
# ==========================================

engine = create_engine(

    DATABASE_URL,

    pool_pre_ping=True,

    echo=False

)


# ==========================================
# CREATE SESSION
# ==========================================

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine

)


# ==========================================
# BASE CLASS
# ==========================================

Base = declarative_base()


# ==========================================
# DATABASE DEPENDENCY
# ==========================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()