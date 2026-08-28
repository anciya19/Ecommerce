from sqlalchemy.orm import Session

import models
import schemas

from auth import hash_password


# =========================================================
# USERS
# =========================================================

def get_user_by_email(db: Session, email: str):

    return (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )


def get_user_by_id(db: Session, user_id: int):

    return (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    user: schemas.UserCreate
):

    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================================================
# SELLER PROFILE
# =========================================================

def get_seller_profile(
    db: Session,
    user_id: int
):

    return (
        db.query(models.SellerProfile)
        .filter(
            models.SellerProfile.user_id == user_id
        )
        .first()
    )

# comment 
def upgrade_user_to_seller(
    db: Session,
    user: models.User,
    seller_data: schemas.SellerRegister
):

    try:

        user.name = seller_data.seller_name
        user.role = "seller"

        seller_profile = models.SellerProfile(
            user_id=user.id,
            shop_name=seller_data.shop_name,
            phone_number=seller_data.phone_number
        )

        db.add(seller_profile)

        db.commit()

        db.refresh(user)
        db.refresh(seller_profile)

        return seller_profile

    except Exception:

        db.rollback()
        raise


# =========================================================
# PRODUCT FILTERING
# =========================================================

def get_products(
    db: Session,
    category=None,
    subcategory=None,
    deals_only=False
):

    query = db.query(models.Product)

    if category:

        category = category.replace(
            "-",
            " "
        ).strip()

        query = query.filter(
            models.Product.category.ilike(category)
        )

    if subcategory:

        subcategory = subcategory.replace(
            "-",
            " "
        ).strip()

        query = query.filter(
            models.Product.subcategory.ilike(
                subcategory
            )
        )

    if deals_only:

        query = query.filter(
            models.Product.is_deal.is_(True)
        )

    return (
        query
        .order_by(models.Product.id.desc())
        .all()
    )


def get_product(
    db: Session,
    product_id: int
):

    return (
        db.query(models.Product)
        .filter(
            models.Product.id == product_id
        )
        .first()
    )


# =========================================================
# ADMIN CREATE
# =========================================================

def create_product(
    db: Session,
    product: schemas.ProductCreate
):

    new_product = models.Product(

        name=product.name,

        description=product.description,

        price=product.price,

        stock=product.stock,

        category=product.category,

        subcategory=product.subcategory,

        image_url=product.image_url,

        seller_id=None,

        is_deal=product.is_deal
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product


# =========================================================
# ADMIN UPDATE
# =========================================================

def update_product(
    db: Session,
    product_id: int,
    product_data: schemas.ProductUpdate
):

    product = get_product(
        db,
        product_id
    )

    if not product:

        return None

    data = product_data.model_dump(
        exclude_unset=True
    )

    for key, value in data.items():

        setattr(
            product,
            key,
            value
        )

    db.commit()

    db.refresh(product)

    return product


# =========================================================
# ADMIN DELETE
# =========================================================

def delete_product(
    db: Session,
    product_id: int
):

    product = get_product(
        db,
        product_id
    )

    if not product:

        return None

    db.delete(product)

    db.commit()

    return product


# =========================================================
# SELLER PRODUCTS
# =========================================================

def get_seller_products(
    db: Session,
    seller_id: int
):

    return (
        db.query(models.Product)
        .filter(
            models.Product.seller_id == seller_id
        )
        .order_by(
            models.Product.id.desc()
        )
        .all()
    )


# =========================================================
# SELLER CREATE
# =========================================================

def create_seller_product(
    db: Session,
    product: schemas.ProductCreate,
    seller_id: int
):

    try:

        new_product = models.Product(

    name=product.name,

    description=product.description,

    price=product.price,

    stock=product.stock,

    category=product.category,

    subcategory=product.subcategory,

    image_url=product.image_url,

    seller_id=seller_id

)
        db.add(new_product)

        db.commit()

        db.refresh(new_product)

        return new_product

    except Exception:

        db.rollback()
        raise


# =========================================================
# SELLER UPDATE
# =========================================================

def update_seller_product(
    db: Session,
    product: models.Product,
    product_data: schemas.ProductUpdate
):

    try:

        data = product_data.model_dump(
            exclude_unset=True
        )

        for key, value in data.items():

            setattr(
                product,
                key,
                value
            )

        db.commit()

        db.refresh(product)

        return product

    except Exception:

        db.rollback()
        raise


# =========================================================
# SELLER DELETE
# =========================================================

def delete_seller_product(
    db: Session,
    product: models.Product
):

    try:

        db.delete(product)

        db.commit()

        return True

    except Exception:

        db.rollback()
        raise