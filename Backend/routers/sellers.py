from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response
)

from sqlalchemy.orm import (
    Session,
    joinedload
)

from database import get_db

from dependencies import (
    get_current_user,
    require_seller
)

from auth import (
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

import crud
import schemas
import models


router = APIRouter(
    prefix="/seller",
    tags=["Seller"]
)


# =========================================================
# BECOME SELLER
# =========================================================

@router.post("/register")
def register_seller(
    seller_data: schemas.SellerRegister,
    response: Response,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Only normal users can become sellers.

    if current_user.role == "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot become seller accounts"
        )


    if current_user.role == "seller":

        raise HTTPException(
            status_code=400,
            detail="You already have a seller account"
        )


    if current_user.role != "user":

        raise HTTPException(
            status_code=403,
            detail="Only normal user accounts can become sellers"
        )


    existing_profile = crud.get_seller_profile(
        db,
        current_user.id
    )


    if existing_profile:

        raise HTTPException(
            status_code=400,
            detail="Seller profile already exists"
        )


    seller_profile = crud.upgrade_user_to_seller(
        db,
        current_user,
        seller_data
    )


    # =====================================================
    # CREATE NEW JWT WITH SELLER ROLE
    # =====================================================

    token = create_access_token(
        user_id=current_user.id,
        role="seller"
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
            "Seller account created successfully",

        "user": {

            "id":
                current_user.id,

            "name":
                current_user.name,

            "email":
                current_user.email,

            "role":
                current_user.role

        },

        "seller_profile": {

            "id":
                seller_profile.id,

            "shop_name":
                seller_profile.shop_name,

            "phone_number":
                seller_profile.phone_number

        }

    }


# =========================================================
# SELLER PROFILE
# =========================================================

@router.get("/profile")
def seller_profile(
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    profile = crud.get_seller_profile(
        db,
        seller.id
    )


    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Seller profile not found"
        )


    return {

        "id":
            profile.id,

        "user_id":
            profile.user_id,

        "seller_name":
            seller.name,

        "email":
            seller.email,

        "shop_name":
            profile.shop_name,

        "phone_number":
            profile.phone_number

    }


# =========================================================
# SELLER PRODUCTS
# =========================================================

@router.get(
    "/products",
    response_model=list[
        schemas.ProductResponse
    ]
)
def seller_products(
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    return crud.get_seller_products(
        db,
        seller.id
    )


# =========================================================
# CREATE SELLER PRODUCT
# =========================================================

@router.post(
    "/products",
    response_model=schemas.ProductResponse,
    status_code=201
)
def create_product(
    product: schemas.ProductCreate,
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    return crud.create_seller_product(
        db,
        product,
        seller.id
    )


# =========================================================
# UPDATE SELLER PRODUCT
# =========================================================

@router.put(
    "/products/{product_id}",
    response_model=schemas.ProductResponse
)
def update_product(
    product_id: int,
    product_data: schemas.ProductUpdate,
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    product = crud.get_product(
        db,
        product_id
    )


    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    # Seller can update only their own product.

    if product.seller_id != seller.id:

        raise HTTPException(
            status_code=403,
            detail="You can only update your own products"
        )


    return crud.update_seller_product(
        db,
        product,
        product_data
    )


# =========================================================
# DELETE SELLER PRODUCT
# =========================================================

@router.delete(
    "/products/{product_id}"
)
def delete_product(
    product_id: int,
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    product = crud.get_product(
        db,
        product_id
    )


    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    # Seller can delete only their own product.

    if product.seller_id != seller.id:

        raise HTTPException(
            status_code=403,
            detail="You can only delete your own products"
        )


    crud.delete_seller_product(
        db,
        product
    )


    return {
        "message":
            "Product deleted successfully"
    }


# =========================================================
# SELLER ORDERS
# =========================================================

@router.get("/orders")
def seller_orders(
    seller=Depends(require_seller),
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # IMPORTANT
    #
    # seller.id comes from the authenticated JWT user.
    #
    # We DO NOT accept seller_id from React.
    #
    # This prevents one seller from requesting another
    # seller's order information.
    # -----------------------------------------------------

    order_items = (

        db.query(models.OrderItem)

        .join(
            models.Order,
            models.Order.id
            ==
            models.OrderItem.order_id
        )

        .options(
            joinedload(
                models.OrderItem.order
            ).joinedload(
                models.Order.user
            )
        )

        .filter(
            models.OrderItem.seller_id
            ==
            seller.id
        )

        .order_by(
            models.Order.created_at.desc()
        )

        .all()

    )


    result = []


    for item in order_items:

        order = item.order

        customer = order.user


        result.append({

            "order_item_id":
                item.id,

            "order_id":
                order.id,

            "order_date":
                order.created_at,

            "customer": {

                "id":
                    customer.id,

                "name":
                    customer.name,

                "email":
                    customer.email

            },

            "product": {

                "product_id":
                    item.product_id,

                "product_name":
                    item.product_name,

                "quantity":
                    item.quantity,

                "unit_price":
                    item.unit_price,

                "subtotal":
                    item.subtotal

            },

            "payment_method":
                order.payment_method,

            "payment_status":
                order.payment_status,

            "order_status":
                order.order_status

        })


    return result