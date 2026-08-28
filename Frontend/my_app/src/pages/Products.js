import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useParams,
  Link
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

import API
  from "../services/api";

import {
  categories
} from "../data/categories";


function Products() {

  const {
    category,
    subcategory
  } = useParams();


  const location =
    useLocation();


  const [
    products,
    setProducts
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
    search,
    setSearch
  ] = useState("");


  // =========================================
  // CHECK DEALS PAGE
  // =========================================

  const isDealsPage =
    location.pathname
    === "/products/deals";


  // =========================================
  // GET CATEGORY DETAILS
  // =========================================

  const categoryData =
    category
      ? categories[category]
      : null;


  const categoryLabel =
    categoryData
      ? categoryData.label
      : "";


  // =========================================
  // FORMAT SUBCATEGORY LABEL
  // =========================================

  const subcategoryLabel =
    subcategory
      ? subcategory
          .replaceAll("-", " ")
          .replace(
            /\b\w/g,
            (letter) =>
              letter.toUpperCase()
          )
      : "";


  // =========================================
  // LOAD PRODUCTS
  // =========================================

  useEffect(() => {

    const loadProducts =
      async () => {

        setLoading(true);

        setError("");


        try {

          const params = {};


          // CATEGORY

          if (categoryLabel) {

            params.category =
              categoryLabel;

          }


          // SUBCATEGORY

          if (subcategory) {

            params.subcategory =
              subcategory.replaceAll(
                "-",
                " "
              );

          }


          // DEALS

          if (isDealsPage) {

            params.deals = true;

          }


          console.log(
            "Sending filter:",
            params
          );


          const response =
            await API.get(
              "/products",
              {
                params: params
              }
            );


          console.log(
            "Products received:",
            response.data
          );


          setProducts(
            response.data
          );

        }

        catch (error) {

          console.error(
            "PRODUCT ERROR:",
            error
          );


          setError(

            error.response
              ?.data
              ?.detail

            ||

            "Unable to load products"

          );

        }

        finally {

          setLoading(false);

        }

      };


    loadProducts();


  }, [
    categoryLabel,
    subcategory,
    isDealsPage
  ]);


  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredProducts =
    products.filter(
      (product) => {

        const searchText =
          search.toLowerCase();


        const productName =
          product.name
            ?.toLowerCase()
          || "";


        const description =
          product.description
            ?.toLowerCase()
          || "";


        const productCategory =
          product.category
            ?.toLowerCase()
          || "";


        const productSubcategory =
          product.subcategory
            ?.toLowerCase()
          || "";


        return (

          productName.includes(
            searchText
          )

          ||

          description.includes(
            searchText
          )

          ||

          productCategory.includes(
            searchText
          )

          ||

          productSubcategory.includes(
            searchText
          )

        );

      }
    );


  // =========================================
  // PAGE TITLE
  // =========================================

  const getTitle = () => {

    if (isDealsPage) {

      return "Today's Deals";

    }


    if (
      categoryLabel
      &&
      subcategoryLabel
    ) {

      return (
        `${categoryLabel} > ${subcategoryLabel}`
      );

    }


    if (categoryLabel) {

      return categoryLabel;

    }


    return "All Products";

  };


  return (

    <>

      <Navbar />


      <main className=
        "products-page"
      >


        {/* =================================
            HEADER
        ================================= */}

        <div className=
          "products-page-header"
        >


          <div>

            <p className=
              "products-eyebrow"
            >

              SHOP NOW

            </p>


            <h1>

              {getTitle()}

            </h1>

          </div>


          <input
            type="text"
            placeholder=
              "Search products..."
            value={search}
            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


        {/* =================================
            SUBCATEGORY LINKS
        ================================= */}

        {
          categoryData
          &&
          (

            <div className=
              "subcategory-links"
            >


              <Link
                to={
                  `/products/category/${category}`
                }
              >

                All {categoryLabel}

              </Link>


              {
                categoryData
                  .subcategories
                  .map(
                    (item) => {

                      const slug =
                        item
                          .toLowerCase()
                          .replaceAll(
                            " ",
                            "-"
                          );


                      return (

                        <Link
                          key={item}
                          to={
                            `/products/category/${category}/${slug}`
                          }
                        >

                          {item}

                        </Link>

                      );

                    }
                  )
              }


            </div>

          )
        }


        {/* =================================
            LOADING
        ================================= */}

        {
          loading
          &&
          (

            <div className=
              "products-status"
            >

              Loading products...

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
            EMPTY
        ================================= */}

        {
          !loading
          &&
          !error
          &&
          filteredProducts.length
          === 0
          &&
          (

            <div className=
              "empty-products"
            >


              <h2>

                No products found

              </h2>


              <p>

                No products found
                in this category.

              </p>


            </div>

          )
        }


        {/* =================================
            PRODUCTS GRID
        ================================= */}

        <div className=
          "products-grid"
        >


          {
            filteredProducts.map(
              (product) => (

                <article
                  className=
                    "product-card"
                  key={
                    product.id
                  }
                >


                  {/* PRODUCT IMAGE */}

                  <div className=
                    "product-image-box"
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
                          "no-product-image"
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
                          "deal-badge"
                        >

                          DEAL

                        </span>

                      )
                    }


                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className=
                    "product-info"
                  >


                    <span className=
                      "product-category"
                    >

                      {
                        product.category
                      }


                      {
                        product.subcategory
                        &&
                        ` • ${product.subcategory}`
                      }

                    </span>


                    <h3>

                      {product.name}

                    </h3>


                    <p>

                      {
                        product.description
                      }

                    </p>


                    <div className=
                      "product-price"
                    >

                      AED{" "}

                      {
                        Number(
                          product.price
                        ).toFixed(2)
                      }

                    </div>


                    <div className=
                      "product-stock"
                    >

                      {
                        product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"
                      }

                    </div>


                    <button
                      disabled={
                        product.stock <= 0
                      }
                    >

                      Add to Cart

                    </button>


                  </div>


                </article>

              )
            )
          }


        </div>


      </main>

    </>

  );

}


export default Products;