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
    chatbot,
    cart,
    orders,
    admin
)


# =========================================
# CREATE MISSING TABLES
# =========================================

Base.metadata.create_all(
    bind=engine
)


# =========================================
# CREATE FASTAPI APP
# =========================================

app = FastAPI(

    title="ShopNow E-commerce API",

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
# AUTH ROUTER
# =========================================

app.include_router(
    auth.router
)


# =========================================
# CHATBOT ROUTER
# =========================================

app.include_router(
    chatbot.router
)


# =========================================
# PRODUCTS ROUTER
# =========================================

app.include_router(
    products.router
)


# =========================================
# SELLERS ROUTER
# =========================================

app.include_router(
    sellers.router
)


# =========================================
# CART ROUTER
# =========================================

app.include_router(
    cart.router
)


# =========================================
# ORDERS ROUTER
# =========================================

app.include_router(
    orders.router
)


# =========================================
# ADMIN ROUTER
# =========================================

app.include_router(
    admin.router
)


# =========================================
# HOME
# =========================================

@app.get("/")
def home():

    return {

        "message":
            "E-commerce API running"

    }


# =========================================
# HEALTH CHECK
# =========================================

@app.get("/health")
def health_check():

    return {

        "status": "ok",

        "message":
            "ShopNow backend is running"

    }