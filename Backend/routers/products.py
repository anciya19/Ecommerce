from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from database import get_db

from dependencies import (
    get_current_user,
    require_admin
)

import crud
import schemas


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# =========================================================
# GET PRODUCTS
# =========================================================

@router.get(
    "",
    response_model=list[
        schemas.ProductResponse
    ]
)
def get_all_products(

    category: Optional[str] = Query(
        default=None
    ),

    subcategory: Optional[str] = Query(
        default=None
    ),

    deals: bool = Query(
        default=False
    ),

    db: Session = Depends(
        get_db
    ),

    current_user=Depends(
        get_current_user
    )
):

    return crud.get_products(

        db=db,

        category=category,

        subcategory=subcategory,

        deals_only=deals
    )


# =========================================================
# GET ONE PRODUCT
# =========================================================

@router.get(
    "/{product_id}",
    response_model=schemas.ProductResponse
)
def product_detail(

    product_id: int,

    db: Session = Depends(
        get_db
    ),

    current_user=Depends(
        get_current_user
    )
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

    return product


# =========================================================
# ADMIN CREATE
# =========================================================

@router.post(
    "",
    response_model=schemas.ProductResponse,
    status_code=201
)
def admin_add_product(

    product: schemas.ProductCreate,

    db: Session = Depends(
        get_db
    ),

    admin=Depends(
        require_admin
    )
):

    return crud.create_product(
        db,
        product
    )


# =========================================================
# ADMIN UPDATE
# =========================================================

@router.put(
    "/{product_id}",
    response_model=schemas.ProductResponse
)
def admin_update_product(

    product_id: int,

    product: schemas.ProductUpdate,

    db: Session = Depends(
        get_db
    ),

    admin=Depends(
        require_admin
    )
):

    updated_product = crud.update_product(
        db,
        product_id,
        product
    )

    if not updated_product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return updated_product


# =========================================================
# ADMIN DELETE
# =========================================================

@router.delete(
    "/{product_id}"
)
def admin_delete_product(

    product_id: int,

    db: Session = Depends(
        get_db
    ),

    admin=Depends(
        require_admin
    )
):

    deleted_product = crud.delete_product(
        db,
        product_id
    )

    if not deleted_product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return {
        "message":
            "Product deleted successfully"
    }