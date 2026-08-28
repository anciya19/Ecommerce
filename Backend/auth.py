import os

from datetime import (
    datetime,
    timedelta,
    timezone
)

import jwt

from dotenv import load_dotenv

from pwdlib import PasswordHash


load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"


ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "10080"
    )
)


if not SECRET_KEY:

    raise ValueError(
        "SECRET_KEY is not configured in .env"
    )


password_hash = (
    PasswordHash.recommended()
)


# =========================================
# HASH PASSWORD
# =========================================

def hash_password(
    password: str
):

    return password_hash.hash(
        password
    )


# =========================================
# VERIFY PASSWORD
# =========================================

def verify_password(
    plain_password: str,
    hashed_password: str
):

    return password_hash.verify(
        plain_password,
        hashed_password
    )


# =========================================
# CREATE JWT
# =========================================

def create_access_token(
    user_id: int,
    role: str
):

    expire = (

        datetime.now(
            timezone.utc
        )

        + timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )

    )


    payload = {

        "sub": str(user_id),

        "role": role,

        "exp": expire

    }


    return jwt.encode(

        payload,

        SECRET_KEY,

        algorithm=ALGORITHM

    )


# =========================================
# DECODE JWT
# =========================================

def decode_access_token(
    token: str
):

    return jwt.decode(

        token,

        SECRET_KEY,

        algorithms=[
            ALGORITHM
        ]

    )