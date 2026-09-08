from datetime import datetime
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)


# =========================================================
# USER REGISTER
# =========================================================

class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str = Field(
        min_length=6
    )


# =========================================================
# USER LOGIN
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
# SELLER REGISTER
# =========================================================

class SellerRegister(BaseModel):

    shop_name: str

    phone_number: str


# =========================================================
# SELLER PROFILE RESPONSE
# =========================================================

class SellerProfileResponse(BaseModel):

    id: int

    user_id: int

    shop_name: str

    phone_number: str


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PRODUCT CREATE
# =========================================================

class ProductCreate(BaseModel):

    name: str

    description: str = ""

    price: float = Field(
        gt=0
    )

    stock: int = Field(
        ge=0
    )

    category: str

    subcategory: Optional[str] = None

    image_url: str = ""

    is_deal: bool = False


# =========================================================
# PRODUCT UPDATE
# =========================================================

class ProductUpdate(BaseModel):

    name: Optional[str] = None

    description: Optional[str] = None

    price: Optional[float] = None

    stock: Optional[int] = None

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

    is_deal: bool = False


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# CART - ADD PRODUCT
# =========================================================

class CartAdd(BaseModel):

    product_id: int

    quantity: int = Field(
        default=1,
        ge=1
    )


# =========================================================
# CART - UPDATE QUANTITY
# =========================================================

class CartUpdate(BaseModel):

    quantity: int = Field(
        ge=1
    )


# =========================================================
# CART ITEM RESPONSE
# =========================================================

class CartItemResponse(BaseModel):

    id: int

    product_id: int

    quantity: int

    product: ProductResponse


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# CART COUNT RESPONSE
# =========================================================

class CartCountResponse(BaseModel):

    count: int


# =========================================================
# PLACE ORDER REQUEST
# =========================================================

class PlaceOrderRequest(BaseModel):

    payment_method: str


# =========================================================
# ORDER ITEM RESPONSE
# =========================================================

class OrderItemResponse(BaseModel):

    id: int

    product_id: int

    seller_id: Optional[int] = None

    product_name: str

    quantity: int

    unit_price: float

    subtotal: float


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# ORDER RESPONSE
# =========================================================

class OrderResponse(BaseModel):

    id: int

    user_id: int

    total_amount: float

    payment_method: str

    payment_status: str

    order_status: str

    created_at: datetime

    items: list[
        OrderItemResponse
    ]


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# ADMIN - UPDATE ORDER STATUS
# =========================================================

class OrderStatusUpdate(BaseModel):

    order_status: str


# =========================================================
# ADMIN - UPDATE PAYMENT STATUS
# =========================================================

class PaymentStatusUpdate(BaseModel):

    payment_status: str