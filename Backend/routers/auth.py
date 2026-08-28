from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response
)

from sqlalchemy.orm import Session

from database import get_db

import schemas
import crud

from auth import (
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

from dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================
# REGISTER NORMAL USER
# =========================================

@router.post(
    "/register",
    response_model=
        schemas.UserResponse,
    status_code=201
)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(
        get_db
    )
):

    existing_user = (
        crud.get_user_by_email(
            db,
            user.email
        )
    )


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail=
                "Email already registered"
        )


    return crud.create_user(
        db,
        user
    )


# =========================================
# LOGIN ALL ROLES
# =========================================

@router.post("/login")
def login(
    login_data:
        schemas.LoginRequest,
    response: Response,
    db: Session = Depends(
        get_db
    )
):

    user = (
        crud.get_user_by_email(
            db,
            login_data.email
        )
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail=
                "Email is not registered"
        )


    password_correct = (
        verify_password(

            login_data.password,

            user.hashed_password

        )
    )


    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail=
                "Incorrect password"
        )


    token = create_access_token(

        user_id=user.id,

        role=user.role

    )


    max_age = (
        ACCESS_TOKEN_EXPIRE_MINUTES
        * 60
    )


    response.set_cookie(

        key="access_token",

        value=token,

        httponly=True,

        secure=False,

        samesite="lax",

        max_age=max_age,

        path="/"

    )


    return {

        "message":
            "Login successful",

        "user": {

            "id":
                user.id,

            "name":
                user.name,

            "email":
                user.email,

            "role":
                user.role

        }

    }


# =========================================
# CURRENT USER
# =========================================

@router.get(
    "/me",
    response_model=
        schemas.UserResponse
)
def get_me(
    current_user=Depends(
        get_current_user
    )
):

    return current_user


# =========================================
# LOGOUT
# =========================================

@router.post("/logout")
def logout(
    response: Response
):

    response.delete_cookie(

        key="access_token",

        path="/"

    )


    return {

        "message":
            "Logged out successfully"

    }