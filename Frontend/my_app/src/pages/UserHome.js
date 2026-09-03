import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

import API
  from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


function UserHome() {

  const {
    user,
  } = useAuth();


  const navigate =
    useNavigate();


  const [
    featuredProducts,
    setFeaturedProducts
  ] = useState([]);


  const [
    fashionProducts,
    setFashionProducts
  ] = useState([]);


  const [
    electronicsProducts,
    setElectronicsProducts
  ] = useState([]);


  const [
    dealProducts,
    setDealProducts
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);



  // =====================================================
  // LOAD HOME PAGE PRODUCTS
  // =====================================================

  useEffect(() => {

    const loadHomeProducts =
      async () => {

        try {

          const [
            allResponse,
            fashionResponse,
            electronicsResponse,
            dealsResponse,
          ] = await Promise.all([

            API.get(
              "/products"
            ),

            API.get(
              "/products",
              {
                params: {
                  category:
                    "Fashion",
                },
              }
            ),

            API.get(
              "/products",
              {
                params: {
                  category:
                    "Electronics",
                },
              }
            ),

            API.get(
              "/products",
              {
                params: {
                  deals:
                    true,
                },
              }
            ),

          ]);


          setFeaturedProducts(
            allResponse.data
              .slice(0, 8)
          );


          setFashionProducts(
            fashionResponse.data
              .slice(0, 4)
          );


          setElectronicsProducts(
            electronicsResponse.data
              .slice(0, 4)
          );


          setDealProducts(
            dealsResponse.data
              .slice(0, 4)
          );

        }

        catch (error) {

          console.error(
            "HOME PRODUCTS ERROR:",
            error.response?.data
          );

        }

        finally {

          setLoading(false);

        }

      };


    loadHomeProducts();

  }, []);



  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart =
    async (product) => {

      try {

        await API.post(
          "/cart",
          {
            product_id:
              product.id,

            quantity: 1,
          }
        );


        alert(
          `${product.name} added to cart`
        );

      }

      catch (error) {

        alert(
          error.response
            ?.data
            ?.detail

          ||

          "Unable to add product to cart"
        );

      }

    };



  // =====================================================
  // PRODUCT CARD
  // =====================================================

  const ProductCard =
    ({ product }) => (

      <div
        className=
          "home-product-card"
      >


        <div className=
          "home-product-image"
        >

          {
            product.image_url
              ? (

                <img
                  src={
                    product.image_url
                  }
                  alt={
                    product.name
                  }
                />

              )
              : (

                <div className=
                  "home-no-image"
                >

                  No Image

                </div>

              )
          }


          {
            product.is_deal
            &&
            (

              <span className=
                "home-deal-badge"
              >

                DEAL

              </span>

            )
          }

        </div>



        <div className=
          "home-product-content"
        >


          <div className=
            "home-product-category"
          >

            {
              product.category
            }

            {
              product.subcategory
              &&
              ` • ${product.subcategory}`
            }

          </div>


          <h3>

            {
              product.name
            }

          </h3>


          <p className=
            "home-product-description"
          >

            {
              product.description
            }

          </p>


          <div className=
            "home-product-price"
          >

            <span>
              AED
            </span>

            {" "}

            {
              Number(
                product.price
              )
              .toFixed(2)
            }

          </div>


          <div className=
            "home-stock"
          >

            {
              product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"
            }

          </div>


          <button
            type="button"
            disabled={
              product.stock <= 0
            }
            onClick={() =>
              addToCart(
                product
              )
            }
          >

            Add to Cart

          </button>


        </div>


      </div>

    );



  return (

    <div className=
      "ecommerce-home"
    >

      <Navbar />



      {/* =================================================
          HERO
      ================================================= */}

      <section className=
        "modern-hero"
      >


        <div className=
          "modern-hero-content"
        >


          <span className=
            "hero-small-title"
          >

            WELCOME,
            {" "}
            {
              user?.name
                ?.toUpperCase()
            }

          </span>


          <h1>

            Everything you need,
            all in one place.

          </h1>


          <p>

            Discover fashion,
            electronics,
            home essentials
            and exciting deals
            from trusted sellers.

          </p>


          <div className=
            "hero-buttons"
          >


            <button
              className=
                "hero-primary-button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >

              Shop Now

            </button>


            <button
              className=
                "hero-secondary-button"
              onClick={() =>
                navigate(
                  "/products/deals"
                )
              }
            >

              View Today's Deals

            </button>


          </div>


          <div className=
            "hero-features"
          >


            <span>
              ✓ Secure Checkout
            </span>


            <span>
              ✓ Multiple Sellers
            </span>


            <span>
              ✓ Easy Shopping
            </span>


          </div>


        </div>



        <div className=
          "modern-hero-visual"
        >


          <div className=
            "hero-main-card"
          >

            <div className=
              "hero-card-icon"
            >
              🛍
            </div>


            <h2>
              ShopNow
            </h2>


            <p>
              Discover your next
              favorite product
            </p>

          </div>


          <div className=
            "hero-mini-card hero-mini-one"
          >

            Fashion

          </div>


          <div className=
            "hero-mini-card hero-mini-two"
          >

            Electronics

          </div>


          <div className=
            "hero-mini-card hero-mini-three"
          >

            Deals

          </div>


        </div>


      </section>



      {/* =================================================
          CATEGORY SECTION
      ================================================= */}

      <section className=
        "home-section"
      >


        <div className=
          "section-heading"
        >


          <div>

            <span>
              SHOP BY CATEGORY
            </span>


            <h2>
              Explore our categories
            </h2>

          </div>


          <Link
            to="/products"
          >

            View all products →

          </Link>


        </div>



        <div className=
          "modern-category-grid"
        >


          <Link
            to=
              "/products/category/electronics"
            className=
              "modern-category-card"
          >


            <div className=
              "category-visual electronics-visual"
            >

              <span>
                💻
              </span>

              <span>
                📱
              </span>

              <span>
                🎧
              </span>

            </div>


            <div className=
              "category-card-info"
            >

              <h3>
                Electronics
              </h3>

              <p>
                Mobiles, laptops,
                headphones and more
              </p>

              <strong>
                Shop Electronics →
              </strong>

            </div>


          </Link>



          <Link
            to=
              "/products/category/fashion"
            className=
              "modern-category-card"
          >


            <div className=
              "category-visual fashion-visual"
            >

              <span>
                👗
              </span>

              <span>
                👟
              </span>

              <span>
                👜
              </span>

            </div>


            <div className=
              "category-card-info"
            >

              <h3>
                Fashion
              </h3>

              <p>
                Dresses, pants,
                shoes, bags and more
              </p>

              <strong>
                Explore Fashion →
              </strong>

            </div>


          </Link>



          <Link
            to=
              "/products/category/home-kitchen"
            className=
              "modern-category-card"
          >


            <div className=
              "category-visual home-visual"
            >

              <span>
                🛋
              </span>

              <span>
                🏠
              </span>

              <span>
                🍳
              </span>

            </div>


            <div className=
              "category-card-info"
            >

              <h3>
                Home & Kitchen
              </h3>

              <p>
                Furniture,
                kitchen and home
                essentials
              </p>

              <strong>
                Shop Home →
              </strong>

            </div>


          </Link>



          <Link
            to="/products/deals"
            className=
              "modern-category-card"
          >


            <div className=
              "category-visual deal-visual"
            >

              <span>
                %
              </span>

            </div>


            <div className=
              "category-card-info"
            >

              <h3>
                Today's Deals
              </h3>

              <p>
                Discover products
                with special offers
              </p>

              <strong>
                Explore Deals →
              </strong>

            </div>


          </Link>


        </div>


      </section>



      {/* =================================================
          FEATURED PRODUCTS
      ================================================= */}

      <section className=
        "home-section"
      >


        <div className=
          "section-heading"
        >


          <div>

            <span>
              TOP PRODUCTS
            </span>


            <h2>
              Featured Products
            </h2>

          </div>


          <Link
            to="/products"
          >

            See all →

          </Link>


        </div>


        {
          loading
          ? (

            <div className=
              "home-loading"
            >

              Loading products...

            </div>

          )
          : featuredProducts.length
            === 0
          ? (

            <div className=
              "home-empty-products"
            >

              No products available.

            </div>

          )
          : (

            <div className=
              "home-product-grid"
            >

              {
                featuredProducts
                  .map(
                    (product) => (

                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )
              }

            </div>

          )
        }


      </section>



      {/* =================================================
          PROMOTION
      ================================================= */}

      <section className=
        "home-promo-banner"
      >


        <div>

          <span>
            SPECIAL COLLECTION
          </span>


          <h2>

            Discover Fashion
            For Every Style

          </h2>


          <p>

            Browse dresses,
            pants, shirts,
            shoes and bags
            from our sellers.

          </p>


          <button
            onClick={() =>
              navigate(
                "/products/category/fashion"
              )
            }
          >

            Shop Fashion

          </button>

        </div>


        <div className=
          "promo-fashion-text"
        >

          STYLE

        </div>


      </section>



      {/* =================================================
          FASHION
      ================================================= */}

      {
        fashionProducts.length > 0
        &&
        (

          <section className=
            "home-section"
          >


            <div className=
              "section-heading"
            >


              <div>

                <span>
                  FASHION
                </span>


                <h2>
                  Fashion picks
                </h2>

              </div>


              <Link
                to=
                  "/products/category/fashion"
              >

                View Fashion →

              </Link>


            </div>


            <div className=
              "home-product-grid"
            >

              {
                fashionProducts
                  .map(
                    (product) => (

                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )
              }

            </div>


          </section>

        )
      }



      {/* =================================================
          ELECTRONICS
      ================================================= */}

      {
        electronicsProducts.length
        > 0
        &&
        (

          <section className=
            "home-section"
          >


            <div className=
              "section-heading"
            >


              <div>

                <span>
                  TECHNOLOGY
                </span>


                <h2>
                  Electronics for you
                </h2>

              </div>


              <Link
                to=
                  "/products/category/electronics"
              >

                View Electronics →

              </Link>


            </div>


            <div className=
              "home-product-grid"
            >

              {
                electronicsProducts
                  .map(
                    (product) => (

                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )
              }

            </div>


          </section>

        )
      }



      {/* =================================================
          DEALS
      ================================================= */}

      {
        dealProducts.length > 0
        &&
        (

          <section className=
            "home-section deal-section"
          >


            <div className=
              "section-heading"
            >


              <div>

                <span>
                  LIMITED OFFERS
                </span>


                <h2>
                  Today's Best Deals
                </h2>

              </div>


              <Link
                to=
                  "/products/deals"
              >

                View deals →

              </Link>


            </div>


            <div className=
              "home-product-grid"
            >

              {
                dealProducts
                  .map(
                    (product) => (

                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )
              }

            </div>


          </section>

        )
      }



      {/* =================================================
          BENEFITS
      ================================================= */}

      <section className=
        "shopping-benefits"
      >


        <div>

          <div className=
            "benefit-icon"
          >
            🔒
          </div>


          <h3>
            Secure Shopping
          </h3>


          <p>
            Protected login and
            secure checkout flow.
          </p>

        </div>



        <div>

          <div className=
            "benefit-icon"
          >
            📦
          </div>


          <h3>
            Easy Ordering
          </h3>


          <p>
            Add products,
            checkout and view
            your order history.
          </p>

        </div>



        <div>

          <div className=
            "benefit-icon"
          >
            🏪
          </div>


          <h3>
            Multiple Sellers
          </h3>


          <p>
            Browse products
            offered by different
            sellers.
          </p>

        </div>



        <div>

          <div className=
            "benefit-icon"
          >
            💬
          </div>


          <h3>
            AI Assistance
          </h3>


          <p>
            Ask the ShopNow
            chatbot for help
            while shopping.
          </p>

        </div>


      </section>



      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className=
        "shop-footer"
      >


        <div className=
          "footer-grid"
        >


          <div>

            <h2>
              ShopNow
            </h2>


            <p>
              Your full-stack
              e-commerce marketplace
              for fashion,
              electronics and home
              essentials.
            </p>

          </div>



          <div>

            <h3>
              Shop
            </h3>


            <Link
              to="/products"
            >
              All Products
            </Link>


            <Link
              to=
                "/products/category/electronics"
            >
              Electronics
            </Link>


            <Link
              to=
                "/products/category/fashion"
            >
              Fashion
            </Link>

          </div>



          <div>

            <h3>
              Account
            </h3>


            <Link
              to="/cart"
            >
              Cart
            </Link>


            <Link
              to="/orders"
            >
              Orders
            </Link>


            {
              user?.role === "user"
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

          </div>



          <div>

            <h3>
              Support
            </h3>


            <p>
              Use the ShopNow
              Assistant at the
              bottom-right corner
              for help.
            </p>

          </div>


        </div>


        <div className=
          "footer-bottom"
        >

          © 2026 ShopNow.
          E-Commerce Project.

        </div>


      </footer>


    </div>

  );

}


export default UserHome;