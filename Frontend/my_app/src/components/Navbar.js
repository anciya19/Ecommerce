import React from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Navbar() {

  const {
    user,
    logout
  } = useAuth();


  const navigate =
    useNavigate();


  const handleLogout =
    async () => {

      await logout();

      navigate(
        "/login"
      );

    };


  return (

    <>

      <nav className=
        "main-navbar"
      >

        <div className=
          "navbar-brand"
        >
          ShopNow
        </div>


        <div className=
          "navbar-main-links"
        >

          <Link to="/home">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>


          <div className=
            "nav-dropdown"
          >

            <Link
              to=
                "/products/category/electronics"
            >
              Electronics
            </Link>

            <div className=
              "nav-dropdown-menu"
            >

              <Link to=
                "/products/category/electronics/mobiles"
              >
                Mobiles
              </Link>

              <Link to=
                "/products/category/electronics/laptops"
              >
                Laptops
              </Link>

              <Link to=
                "/products/category/electronics/headphones"
              >
                Headphones
              </Link>

              <Link to=
                "/products/category/electronics/cameras"
              >
                Cameras
              </Link>

              <Link to=
                "/products/category/electronics/accessories"
              >
                Accessories
              </Link>

            </div>

          </div>


          <div className=
            "nav-dropdown"
          >

            <Link
              to=
                "/products/category/fashion"
            >
              Fashion
            </Link>

            <div className=
              "nav-dropdown-menu"
            >

              <Link to=
                "/products/category/fashion/dresses"
              >
                Dresses
              </Link>

              <Link to=
                "/products/category/fashion/pants"
              >
                Pants
              </Link>

              <Link to=
                "/products/category/fashion/shirts"
              >
                Shirts
              </Link>

              <Link to=
                "/products/category/fashion/shoes"
              >
                Shoes
              </Link>

              <Link to=
                "/products/category/fashion/bags"
              >
                Bags
              </Link>

            </div>

          </div>


          <Link
            to=
              "/products/category/home-kitchen"
          >
            Home & Kitchen
          </Link>


          <Link
            to="/products/deals"
          >
            Today's Deals
          </Link>

        </div>


        {user && (

          <div className=
            "navbar-account-links"
          >

            <Link to="/cart">
              Cart
            </Link>


            {
              user.role === "user"
              &&
              (

                <Link
                  to=
                    "/seller/register"
                >
                  Become a Seller
                </Link>

              )
            }


            {
              user.role === "seller"
              &&
              (

                <Link
                  to=
                    "/seller/dashboard"
                >
                  Seller Dashboard
                </Link>

              )
            }


            {
              user.role === "admin"
              &&
              (

                <Link
                  to="/admin"
                >
                  Admin Dashboard
                </Link>

              )
            }


            <button
              type="button"
              onClick={
                handleLogout
              }
              className=
                "navbar-logout"
            >
              Logout
            </button>

          </div>

        )}

      </nav>

    </>

  );

}


export default Navbar;