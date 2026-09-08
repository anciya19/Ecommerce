from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from sqlalchemy.orm import relationship

from database import Base


# =========================================================
# USER
# =========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String(500),
        nullable=False
    )

    role = Column(
        String(20),
        default="user",
        nullable=False
    )

    seller_profile = relationship(
        "SellerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    products = relationship(
        "Product",
        back_populates="seller"
    )

    cart_items = relationship(
        "CartItem",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    orders = relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# =========================================================
# SELLER PROFILE
# =========================================================

class SellerProfile(Base):

    __tablename__ = "seller_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        unique=True,
        nullable=False
    )

    shop_name = Column(
        String(255),
        nullable=False
    )

    phone_number = Column(
        String(30),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="seller_profile"
    )


# =========================================================
# PRODUCT
# =========================================================

class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(255),
        nullable=False
    )

    description = Column(
        String(1000),
        default="",
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )

    stock = Column(
        Integer,
        default=0,
        nullable=False
    )

    category = Column(
        String(100),
        nullable=False
    )

    subcategory = Column(
        String(100),
        nullable=True
    )

    image_url = Column(
        String(2000),
        default="",
        nullable=False
    )

    seller_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    is_deal = Column(
        Boolean,
        default=False,
        nullable=False
    )

    seller = relationship(
        "User",
        back_populates="products"
    )

    cart_items = relationship(
        "CartItem",
        back_populates="product"
    )


# =========================================================
# CART ITEM
# =========================================================

class CartItem(Base):

    __tablename__ = "cart_items"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "product_id",
            name="uq_cart_user_product"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    product_id = Column(
        Integer,
        ForeignKey(
            "products.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    quantity = Column(
        Integer,
        default=1,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="cart_items"
    )

    product = relationship(
        "Product",
        back_populates="cart_items"
    )


# =========================================================
# ORDER
# =========================================================

class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    payment_method = Column(
        String(50),
        nullable=False
    )

    payment_status = Column(
        String(50),
        default="pending",
        nullable=False
    )

    order_status = Column(
        String(50),
        default="placed",
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="orders"
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )


# =========================================================
# ORDER ITEM
# =========================================================

class OrderItem(Base):

    __tablename__ = "order_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey(
            "orders.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    product_id = Column(
        Integer,
        nullable=False
    )

    seller_id = Column(
        Integer,
        nullable=True
    )

    product_name = Column(
        String(255),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    unit_price = Column(
        Float,
        nullable=False
    )

    subtotal = Column(
        Float,
        nullable=False
    )

    order = relationship(
        "Order",
        back_populates="items"
    )