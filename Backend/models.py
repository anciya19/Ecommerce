from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey
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
        uselist=False
    )

    products = relationship(
        "Product",
        back_populates="seller"
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