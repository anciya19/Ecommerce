from typing import Optional

from pydantic import (
    BaseModel,
    EmailStr,
    ConfigDict,
    Field
)


# =========================================================
# USER REGISTER
# =========================================================

class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str = Field(
        min_length=8
    )


# =========================================================
# LOGIN
# =========================================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str


# =========================================================
# USER RESPONSE
# =========================================================

class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# SELLER
# =========================================================

class SellerRegister(BaseModel):

    seller_name: str = Field(
        min_length=2,
        max_length=100
    )

    shop_name: str = Field(
        min_length=2,
        max_length=255
    )

    phone_number: str = Field(
        min_length=5,
        max_length=30
    )


# =========================================================
# PRODUCT CREATE
# =========================================================

class ProductCreate(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=255
    )

    description: str = ""

    price: float = Field(
        gt=0
    )

    stock: int = Field(
        ge=0
    )

    category: str = Field(
        min_length=1
    )

    subcategory: Optional[str] = None

    image_url: str = ""

    is_deal: bool = False


# =========================================================
# PRODUCT UPDATE
# =========================================================

class ProductUpdate(BaseModel):

    name: Optional[str] = None

    description: Optional[str] = None

    price: Optional[float] = Field(
        default=None,
        gt=0
    )

    stock: Optional[int] = Field(
        default=None,
        ge=0
    )

    category: Optional[str] = None

    subcategory: Optional[str] = None

    image_url: Optional[str] = None

    is_deal: Optional[bool] = None


# =========================================================
# PRODUCT RESPONSE
# =========================================================

class ProductResponse(BaseModel):

    id: int

    name: str

    description: str

    price: float

    stock: int

    category: str

    subcategory: Optional[str] = None

    image_url: str

    seller_id: Optional[int] = None

    is_deal: bool

    model_config = ConfigDict(
        from_attributes=True
    )