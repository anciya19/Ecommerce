import jwt

from fastapi import (
    Depends,
    HTTPException,
    Request,
    status
)

from sqlalchemy.orm import Session

from database import get_db

from auth import (
    decode_access_token
)

import crud


# =========================================
# CURRENT USER
# =========================================

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):

    token = request.cookies.get(
        "access_token"
    )


    if not token:

        raise HTTPException(
            status_code=
                status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )


    try:

        payload = (
            decode_access_token(
                token
            )
        )


        user_id = payload.get(
            "sub"
        )


        if user_id is None:

            raise HTTPException(
                status_code=401,
                detail=
                    "Invalid authentication token"
            )


        user = crud.get_user_by_id(
            db,
            int(user_id)
        )


        if not user:

            raise HTTPException(
                status_code=401,
                detail=
                    "User no longer exists"
            )


        return user


    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=401,
            detail=
                "Authentication session expired"
        )


    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=401,
            detail=
                "Invalid authentication token"
        )


# =========================================
# ADMIN ONLY
# =========================================

def require_admin(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user.role
        != "admin"
    ):

        raise HTTPException(
            status_code=
                status.HTTP_403_FORBIDDEN,
            detail=
                "Admin access required"
        )


    return current_user


# =========================================
# SELLER ONLY
# =========================================

def require_seller(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user.role
        != "seller"
    ):

        raise HTTPException(
            status_code=
                status.HTTP_403_FORBIDDEN,
            detail=
                "Seller access required"
        )


    return current_user