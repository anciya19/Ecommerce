from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from database import (
    engine,
    Base
)

from routers import (
    auth,
    products,
    sellers,
    chatbot
)


# =========================================
# CREATE MISSING TABLES
# =========================================

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(

    title=
        "ShopNow E-commerce API",

    version="2.0.0"

)


# =========================================
# CORS
# =========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:3000",

        "http://127.0.0.1:3000"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# =========================================
# ROUTERS
# =========================================

app.include_router(
    auth.router
)

app.include_router(
    chatbot.router
)

app.include_router(
    products.router
)

app.include_router(
    sellers.router
)


@app.get("/")
def home():

    return {

        "message":
            "E-commerce API running"

    }