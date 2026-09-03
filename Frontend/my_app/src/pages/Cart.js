import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

import API
  from "../services/api";


function Cart() {

  const [
    cartItems,
    setCartItems
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    updatingId,
    setUpdatingId
  ] = useState(null);



  // =========================================
  // LOAD CART ITEMS
  // =========================================

  const loadCart =
    async () => {

      setLoading(true);

      setError("");


      try {

        const response =
          await API.get(
            "/cart"
          );


        console.log(
          "CART ITEMS:",
          response.data
        );


        setCartItems(
          response.data
        );

      }

      catch (error) {

        console.error(
          "LOAD CART ERROR:",
          error.response?.data
        );


        if (
          error.response
            ?.status === 401
        ) {

          setError(
            "Your login session expired. Please login again."
          );

        }

        else {

          setError(

            error.response
              ?.data
              ?.detail

            ||

            "Unable to load cart"

          );

        }

      }

      finally {

        setLoading(false);

      }

    };



  // =========================================
  // PAGE LOAD
  // =========================================

  useEffect(() => {

    loadCart();

  }, []);



  // =========================================
  // UPDATE QUANTITY
  // =========================================

  const updateQuantity =
    async (
      item,
      newQuantity
    ) => {

      if (
        newQuantity < 1
      ) {

        return;

      }


      if (
        newQuantity
        > item.product.stock
      ) {

        alert(
          `Only ${item.product.stock} items are available in stock`
        );

        return;

      }


      setUpdatingId(
        item.id
      );


      try {

        await API.put(

          `/cart/${item.id}`,

          {
            quantity:
              newQuantity,
          }

        );


        await loadCart();

      }

      catch (error) {

        console.error(
          "UPDATE CART ERROR:",
          error.response?.data
        );


        alert(

          error.response
            ?.data
            ?.detail

          ||

          "Unable to update quantity"

        );

      }

      finally {

        setUpdatingId(
          null
        );

      }

    };



  // =========================================
  // REMOVE PRODUCT
  // =========================================

  const removeProduct =
    async (
      cartItemId
    ) => {

      const confirmed =
        window.confirm(
          "Remove this product from cart?"
        );


      if (!confirmed) {

        return;

      }


      try {

        await API.delete(

          `/cart/${cartItemId}`

        );


        await loadCart();

      }

      catch (error) {

        console.error(
          "REMOVE CART ERROR:",
          error.response?.data
        );


        alert(

          error.response
            ?.data
            ?.detail

          ||

          "Unable to remove product"

        );

      }

    };



  // =========================================
  // TOTAL ITEM COUNT
  // =========================================

  const totalItems =
    cartItems.reduce(
      (
        total,
        item
      ) => {

        return (
          total
          +
          item.quantity
        );

      },
      0
    );



  // =========================================
  // TOTAL PRICE
  // =========================================

  const totalPrice =
    cartItems.reduce(
      (
        total,
        item
      ) => {

        return (
          total
          +
          Number(
            item.product.price
          )
          *
          item.quantity
        );

      },
      0
    );



  return (

    <>

      <Navbar />


      <main className=
        "cart-page"
      >


        {/* =================================
            CART HEADER
        ================================= */}

        <div className=
          "cart-page-header"
        >

          <div>

            <p className=
              "cart-eyebrow"
            >

              YOUR SHOPPING CART

            </p>


            <h1>

              Shopping Cart

            </h1>


            <p>

              {
                totalItems
              }

              {" "}

              {
                totalItems === 1
                  ? "item"
                  : "items"
              }

            </p>

          </div>


          <Link
            to="/products"
            className=
              "continue-shopping-link"
          >

            Continue Shopping

          </Link>

        </div>



        {/* =================================
            LOADING
        ================================= */}

        {
          loading
          &&
          (

            <div className=
              "cart-status"
            >

              Loading your cart...

            </div>

          )
        }



        {/* =================================
            ERROR
        ================================= */}

        {
          error
          &&
          (

            <div className=
              "error-message"
            >

              {error}

            </div>

          )
        }



        {/* =================================
            EMPTY CART
        ================================= */}

        {
          !loading
          &&
          !error
          &&
          cartItems.length === 0
          &&
          (

            <div className=
              "empty-cart"
            >


              <div className=
                "empty-cart-icon"
              >

                🛒

              </div>


              <h2>

                Your cart is empty

              </h2>


              <p>

                Add some products
                and they will appear
                here.

              </p>


              <Link
                to="/products"
                className=
                  "empty-cart-button"
              >

                Start Shopping

              </Link>


            </div>

          )
        }



        {/* =================================
            CART CONTENT
        ================================= */}

        {
          !loading
          &&
          cartItems.length > 0
          &&
          (

            <div className=
              "cart-layout"
            >


              {/* =============================
                  CART ITEMS
              ============================== */}

              <section className=
                "cart-items-section"
              >


                {
                  cartItems.map(
                    (item) => (

                      <article
                        className=
                          "cart-product-card"
                        key={
                          item.id
                        }
                      >


                        {/* IMAGE */}

                        <div className=
                          "cart-product-image"
                        >


                          {
                            item.product
                              .image_url
                              ? (

                                <img
                                  src={
                                    item.product
                                      .image_url
                                  }
                                  alt={
                                    item.product
                                      .name
                                  }
                                />

                              )
                              : (

                                <div className=
                                  "cart-no-image"
                                >

                                  No Image

                                </div>

                              )
                          }


                        </div>



                        {/* DETAILS */}

                        <div className=
                          "cart-product-details"
                        >


                          <div className=
                            "cart-category"
                          >

                            {
                              item.product
                                .category
                            }


                            {
                              item.product
                                .subcategory
                              &&
                              ` • ${item.product.subcategory}`
                            }

                          </div>


                          <h2>

                            {
                              item.product
                                .name
                            }

                          </h2>


                          <p className=
                            "cart-description"
                          >

                            {
                              item.product
                                .description
                            }

                          </p>


                          <div className=
                            "cart-stock"
                          >

                            {
                              item.product
                                .stock > 0
                                ? `In Stock (${item.product.stock} available)`
                                : "Out of Stock"
                            }

                          </div>


                          <div className=
                            "cart-unit-price"
                          >

                            AED{" "}

                            {
                              Number(
                                item.product
                                  .price
                              )
                              .toFixed(2)
                            }

                            <span>
                              {" "}
                              each
                            </span>

                          </div>



                          {/* QUANTITY */}

                          <div className=
                            "cart-product-actions"
                          >


                            <div className=
                              "cart-quantity-control"
                            >


                              <button
                                type="button"
                                disabled={
                                  item.quantity <= 1
                                  ||
                                  updatingId === item.id
                                }
                                onClick={() =>
                                  updateQuantity(
                                    item,
                                    item.quantity - 1
                                  )
                                }
                              >

                                −

                              </button>


                              <span>

                                {
                                  updatingId === item.id
                                    ? "..."
                                    : item.quantity
                                }

                              </span>


                              <button
                                type="button"
                                disabled={
                                  item.quantity
                                  >= item.product.stock
                                  ||
                                  updatingId === item.id
                                }
                                onClick={() =>
                                  updateQuantity(
                                    item,
                                    item.quantity + 1
                                  )
                                }
                              >

                                +

                              </button>


                            </div>



                            <button
                              type="button"
                              className=
                                "cart-remove-button"
                              onClick={() =>
                                removeProduct(
                                  item.id
                                )
                              }
                            >

                              Remove

                            </button>


                          </div>


                        </div>



                        {/* ITEM TOTAL */}

                        <div className=
                          "cart-item-total"
                        >


                          <small>

                            Item Total

                          </small>


                          <strong>

                            AED{" "}

                            {
                              (
                                Number(
                                  item.product
                                    .price
                                )
                                *
                                item.quantity
                              )
                              .toFixed(2)
                            }

                          </strong>


                        </div>


                      </article>

                    )
                  )
                }


              </section>



              {/* =============================
                  ORDER SUMMARY
              ============================== */}

              <aside className=
                "cart-summary-card"
              >


                <h2>

                  Order Summary

                </h2>


                <div className=
                  "cart-summary-row"
                >

                  <span>

                    Items

                  </span>


                  <span>

                    {
                      totalItems
                    }

                  </span>

                </div>


                <div className=
                  "cart-summary-row"
                >

                  <span>

                    Subtotal

                  </span>


                  <span>

                    AED{" "}

                    {
                      totalPrice
                        .toFixed(2)
                    }

                  </span>

                </div>


                <div className=
                  "cart-summary-row"
                >

                  <span>

                    Delivery

                  </span>


                  <span>

                    Calculated at
                    checkout

                  </span>

                </div>


                <div className=
                  "cart-summary-divider"
                />


                <div className=
                  "cart-summary-total"
                >

                  <span>

                    Total

                  </span>


                  <strong>

                    AED{" "}

                    {
                      totalPrice
                        .toFixed(2)
                    }

                  </strong>

                </div>


                <Link
                  to="/checkout"
                  className=
                    "cart-checkout-button"
                >

                  Proceed to Checkout

                </Link>


                <Link
                  to="/products"
                  className=
                    "cart-continue-button"
                >

                  Continue Shopping

                </Link>


              </aside>


            </div>

          )
        }


      </main>

    </>

  );

}


export default Cart;