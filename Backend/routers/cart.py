from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy import func

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from database import get_db

from dependencies import (
    get_current_user,
)

import models
import schemas


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


# =========================================================
# GET CART
# =========================================================

@router.get(
    "",
    response_model=list[
        schemas.CartItemResponse
    ]
)
def get_cart(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return (
        db.query(models.CartItem)

        .options(
            joinedload(
                models.CartItem.product
            )
        )

        .filter(
            models.CartItem.user_id
            == current_user.id
        )

        .order_by(
            models.CartItem.id.desc()
        )

        .all()
    )


# =========================================================
# CART COUNT
# =========================================================

@router.get(
    "/count",
    response_model=
        schemas.CartCountResponse
)
def get_cart_count(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    count = (
        db.query(
            func.coalesce(
                func.sum(
                    models.CartItem.quantity
                ),
                0
            )
        )

        .filter(
            models.CartItem.user_id
            == current_user.id
        )

        .scalar()
    )


    return {
        "count": int(count)
    }


# =========================================================
# ADD PRODUCT
# =========================================================

@router.post("")
def add_to_cart(
    data: schemas.CartAdd,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    product = (
        db.query(models.Product)

        .filter(
            models.Product.id
            == data.product_id
        )

        .first()
    )


    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    if product.stock <= 0:

        raise HTTPException(
            status_code=400,
            detail="Product is out of stock"
        )


    existing = (
        db.query(models.CartItem)

        .filter(
            models.CartItem.user_id
            == current_user.id,

            models.CartItem.product_id
            == product.id
        )

        .first()
    )


    if existing:

        new_quantity = (
            existing.quantity
            +
            data.quantity
        )


        if new_quantity > product.stock:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Requested quantity "
                    "exceeds available stock"
                )
            )


        existing.quantity = (
            new_quantity
        )

        db.commit()

        db.refresh(existing)


        return {
            "message":
                "Cart quantity updated"
        }


    if data.quantity > product.stock:

        raise HTTPException(
            status_code=400,
            detail=(
                "Requested quantity "
                "exceeds available stock"
            )
        )


    cart_item = models.CartItem(
        user_id=current_user.id,
        product_id=product.id,
        quantity=data.quantity
    )


    db.add(cart_item)

    db.commit()

    db.refresh(cart_item)


    return {
        "message":
            "Product added to cart"
    }


# =========================================================
# UPDATE QUANTITY
# =========================================================

@router.put(
    "/{cart_item_id}"
)
def update_cart(
    cart_item_id: int,
    data: schemas.CartUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    item = (
        db.query(models.CartItem)

        .filter(
            models.CartItem.id
            == cart_item_id,

            models.CartItem.user_id
            == current_user.id
        )

        .first()
    )


    if not item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )


    product = (
        db.query(models.Product)

        .filter(
            models.Product.id
            == item.product_id
        )

        .first()
    )


    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    if data.quantity > product.stock:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {product.stock} "
                "items are available"
            )
        )


    item.quantity = data.quantity

    db.commit()

    db.refresh(item)


    return {
        "message":
            "Cart updated successfully"
    }


# =========================================================
# REMOVE ITEM
# =========================================================

@router.delete(
    "/{cart_item_id}"
)
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    item = (
        db.query(models.CartItem)

        .filter(
            models.CartItem.id
            == cart_item_id,

            models.CartItem.user_id
            == current_user.id
        )

        .first()
    )


    if not item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )


    db.delete(item)

    db.commit()


    return {
        "message":
            "Product removed from cart"
    }