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
    require_admin,
)

import models
import schemas


router = APIRouter(
    prefix="/admin",
    tags=["Admin Orders"]
)


ALLOWED_ORDER_STATUSES = [
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
]


ALLOWED_PAYMENT_STATUSES = [
    "pending",
    "paid",
    "failed",
    "refunded",
]


# =========================================================
# GET ALL ORDERS
# =========================================================

@router.get(
    "/orders"
)
def get_all_orders(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    orders = (
        db.query(models.Order)

        .options(
            joinedload(
                models.Order.user
            ),

            joinedload(
                models.Order.items
            )
        )

        .order_by(
            models.Order.created_at.desc()
        )

        .all()
    )


    result = []


    for order in orders:

        item_data = []


        for item in order.items:

            seller = None


            if item.seller_id:

                seller = (
                    db.query(models.User)

                    .filter(
                        models.User.id
                        == item.seller_id
                    )

                    .first()
                )


            item_data.append({
                "id":
                    item.id,

                "product_id":
                    item.product_id,

                "product_name":
                    item.product_name,

                "seller_id":
                    item.seller_id,

                "seller_name":
                    seller.name
                    if seller
                    else None,

                "quantity":
                    item.quantity,

                "unit_price":
                    item.unit_price,

                "subtotal":
                    item.subtotal,
            })


        result.append({

            "id":
                order.id,

            "customer": {
                "id":
                    order.user.id,

                "name":
                    order.user.name,

                "email":
                    order.user.email,
            },

            "total_amount":
                order.total_amount,

            "payment_method":
                order.payment_method,

            "payment_status":
                order.payment_status,

            "order_status":
                order.order_status,

            "created_at":
                order.created_at,

            "items":
                item_data,
        })


    return result


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

@router.put(
    "/orders/{order_id}/status"
)
def update_order_status(
    order_id: int,
    data:
        schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    if (
        data.order_status
        not in
        ALLOWED_ORDER_STATUSES
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid order status"
        )


    order = (
        db.query(models.Order)

        .filter(
            models.Order.id
            == order_id
        )

        .first()
    )


    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )


    order.order_status = (
        data.order_status
    )


    db.commit()

    db.refresh(order)


    return {
        "message":
            "Order status updated",

        "order_status":
            order.order_status,
    }


# =========================================================
# UPDATE PAYMENT STATUS
# =========================================================

@router.put(
    "/orders/{order_id}/payment-status"
)
def update_payment_status(
    order_id: int,
    data:
        schemas.PaymentStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    if (
        data.payment_status
        not in
        ALLOWED_PAYMENT_STATUSES
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid payment status"
        )


    order = (
        db.query(models.Order)

        .filter(
            models.Order.id
            == order_id
        )

        .first()
    )


    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )


    order.payment_status = (
        data.payment_status
    )


    db.commit()

    db.refresh(order)


    return {
        "message":
            "Payment status updated",

        "payment_status":
            order.payment_status,
    }