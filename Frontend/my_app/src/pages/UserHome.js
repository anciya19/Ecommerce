import React from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

import {
  useAuth
} from "../context/AuthContext";


function UserHome() {

  const {
    user
  } = useAuth();


  const navigate =
    useNavigate();


  return (

    <>

      <Navbar />


      <main className=
        "home-page"
      >

        <section className=
          "home-hero"
        >

          <div className=
            "hero-text"
          >

            <p className=
              "hero-welcome"
            >
              WELCOME,{" "}
              {
                user?.name
                  ?.toUpperCase()
              }
            </p>


            <h1>
              Starting AED 29
            </h1>


            <h2>
              Deals on fashion,
              electronics and more
            </h2>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              Shop Now
            </button>

          </div>


          <div className=
            "hero-products-preview"
          >

            <div className=
              "hero-product-shape"
            >
              SHOP
            </div>

            <div className=
              "hero-product-shape"
            >
              STYLE
            </div>

            <div className=
              "hero-product-shape"
            >
              TECH
            </div>

          </div>

        </section>


        <section className=
          "home-category-grid"
        >


          <Link
            className=
              "home-category-card"
            to=
              "/products/category/electronics"
          >

            <h2>
              Electronics
            </h2>

            <div className=
              "category-image-placeholder electronics-image"
            >
              Electronics
            </div>

            <span>
              Shop now
            </span>

          </Link>


          <Link
            className=
              "home-category-card"
            to=
              "/products/category/fashion"
          >

            <h2>
              Fashion
            </h2>

            <div className=
              "category-image-placeholder fashion-image"
            >
              Fashion
            </div>

            <span>
              Shop now
            </span>

          </Link>


          <Link
            className=
              "home-category-card"
            to=
              "/products/category/home-kitchen"
          >

            <h2>
              Home Essentials
            </h2>

            <div className=
              "category-image-placeholder home-image"
            >
              Home & Kitchen
            </div>

            <span>
              Shop now
            </span>

          </Link>


          <Link
            className=
              "home-category-card"
            to="/products/deals"
          >

            <h2>
              Best Deals
            </h2>

            <div className=
              "category-image-placeholder deals-image"
            >
              Best Deals
            </div>

            <span>
              Explore deals
            </span>

          </Link>


        </section>

      </main>

    </>

  );

}


export default UserHome;