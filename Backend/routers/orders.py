from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

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
    prefix="/orders",
    tags=["Orders"]
)


ALLOWED_PAYMENT_METHODS = [
    "cod",
    "card"
]


# =========================================================
# PLACE ORDER
# =========================================================

@router.post(
    "",
    response_model=
        schemas.OrderResponse,
    status_code=201
)
def place_order(
    data:
        schemas.PlaceOrderRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    if (
        data.payment_method
        not in
        ALLOWED_PAYMENT_METHODS
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid payment method"
        )


    cart_items = (
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

        .all()
    )


    if not cart_items:

        raise HTTPException(
            status_code=400,
            detail="Your cart is empty"
        )


    try:

        total_amount = 0.0


        # -------------------------------------
        # VALIDATE EVERYTHING FIRST
        # -------------------------------------

        for cart_item in cart_items:

            product = (
                cart_item.product
            )


            if not product:

                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )


            if (
                cart_item.quantity
                >
                product.stock
            ):

                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Not enough stock "
                        f"for {product.name}"
                    )
                )


            total_amount += (
                float(product.price)
                *
                cart_item.quantity
            )


        # -------------------------------------
        # CREATE ORDER
        # -------------------------------------

        order = models.Order(
            user_id=current_user.id,
            total_amount=total_amount,
            payment_method=
                data.payment_method,
            payment_status="pending",
            order_status="placed"
        )


        db.add(order)

        db.flush()


        # -------------------------------------
        # CREATE ORDER ITEMS
        # -------------------------------------

        for cart_item in cart_items:

            product = (
                cart_item.product
            )


            subtotal = (
                float(product.price)
                *
                cart_item.quantity
            )


            order_item = (
                models.OrderItem(
                    order_id=order.id,
                    product_id=
                        product.id,
                    seller_id=
                        product.seller_id,
                    product_name=
                        product.name,
                    quantity=
                        cart_item.quantity,
                    unit_price=
                        product.price,
                    subtotal=
                        subtotal
                )
            )


            db.add(order_item)


            # Reduce stock
            product.stock -= (
                cart_item.quantity
            )


            # Remove cart item
            db.delete(cart_item)


        db.commit()

        db.refresh(order)


        # Reload items relationship
        order = (
            db.query(models.Order)

            .options(
                joinedload(
                    models.Order.items
                )
            )

            .filter(
                models.Order.id
                == order.id
            )

            .first()
        )


        return order


    except HTTPException:

        db.rollback()

        raise


    except Exception as error:

        db.rollback()

        print(
            "PLACE ORDER ERROR:",
            repr(error)
        )


        raise HTTPException(
            status_code=500,
            detail="Unable to place order"
        )


# =========================================================
# CUSTOMER ORDER HISTORY
# =========================================================

@router.get(
    "",
    response_model=list[
        schemas.OrderResponse
    ]
)
def get_order_history(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return (
        db.query(models.Order)

        .options(
            joinedload(
                models.Order.items
            )
        )

        .filter(
            models.Order.user_id
            == current_user.id
        )

        .order_by(
            models.Order.created_at.desc()
        )

        .all()
    )