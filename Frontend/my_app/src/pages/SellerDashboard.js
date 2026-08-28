import React, {
  useEffect,
  useState,
} from "react";

import Navbar
  from "../components/Navbar";

import API
  from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

import {
  categoryOptions,
} from "../data/categories";


const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  subcategory: "",
  image_url: "",
};


function SellerDashboard() {

  const {
    user,
  } = useAuth();


  const [
    profile,
    setProfile
  ] = useState(null);


  const [
    products,
    setProducts
  ] = useState([]);


  const [
    form,
    setForm
  ] = useState(
    emptyForm
  );


  const [
    editingId,
    setEditingId
  ] = useState(null);


  const [
    error,
    setError
  ] = useState("");


  const [
    success,
    setSuccess
  ] = useState("");


  const [
    saving,
    setSaving
  ] = useState(false);


  // =========================================
  // LOAD PROFILE
  // =========================================

  const loadProfile =
    async () => {

      try {

        const response =
          await API.get(
            "/seller/profile"
          );


        setProfile(
          response.data
        );

      }

      catch (error) {

        console.error(
          "PROFILE ERROR:",
          error.response?.data
        );

      }

    };


  // =========================================
  // LOAD SELLER PRODUCTS
  // =========================================

  const loadProducts =
    async () => {

      try {

        const response =
          await API.get(
            "/seller/products"
          );


        setProducts(
          response.data
        );


        setError("");

      }

      catch (error) {

        console.error(
          "PRODUCT LOAD ERROR:",
          error.response?.data
        );


        setError(
          error.response
            ?.data
            ?.detail

          ||

          "Unable to load products"
        );

      }

    };


  // =========================================
  // PAGE LOAD
  // =========================================

  useEffect(() => {

    loadProfile();

    loadProducts();

  }, []);


  // =========================================
  // NORMAL INPUT CHANGE
  // =========================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (previousForm) => ({

          ...previousForm,

          [name]:
            value,

        })
      );

    };


  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategoryChange =
    (event) => {

      const selectedCategory =
        event.target.value;


      setForm(
        (previousForm) => ({

          ...previousForm,

          category:
            selectedCategory,

          // When category changes,
          // old subcategory must be cleared
          subcategory: "",

        })
      );

    };


  // =========================================
  // SUBCATEGORY OPTIONS
  // =========================================

  const availableSubcategories =
    form.category
      ? categoryOptions[
          form.category
        ] || []
      : [];


  // =========================================
  // SAVE PRODUCT
  // =========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError("");

      setSuccess("");


      // -----------------------------
      // VALIDATION
      // -----------------------------

      if (
        form.name.trim()
        === ""
      ) {

        setError(
          "Please enter product name"
        );

        return;

      }


      if (
        form.price === ""
        ||
        Number(form.price) <= 0
      ) {

        setError(
          "Please enter a valid price"
        );

        return;

      }


      if (
        form.stock === ""
        ||
        Number(form.stock) < 0
      ) {

        setError(
          "Please enter valid stock"
        );

        return;

      }


      if (
        form.category === ""
      ) {

        setError(
          "Please select category"
        );

        return;

      }


      if (
        form.subcategory === ""
      ) {

        setError(
          "Please select subcategory"
        );

        return;

      }


      // -----------------------------
      // DATA TO FASTAPI
      // -----------------------------

      const productData = {

        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price),

        stock:
          Number(form.stock),

        category:
          form.category,

        subcategory:
          form.subcategory,

        image_url:
          form.image_url.trim(),

      };


      console.log(
        "Sending product:",
        productData
      );


      setSaving(true);


      try {

        // =====================================
        // UPDATE
        // =====================================

        if (
          editingId !== null
        ) {

          const response =
            await API.put(

              `/seller/products/${editingId}`,

              productData

            );


          console.log(
            "Updated product:",
            response.data
          );


          setSuccess(
            "Product updated successfully"
          );

        }


        // =====================================
        // CREATE
        // =====================================

        else {

          const response =
            await API.post(

              "/seller/products",

              productData

            );


          console.log(
            "Created product:",
            response.data
          );


          setSuccess(
            "Product added successfully"
          );

        }


        // RESET FORM

        setForm(
          emptyForm
        );


        setEditingId(
          null
        );


        await loadProducts();

      }

      catch (error) {

        console.error(
          "SAVE PRODUCT ERROR:",
          error
        );


        console.error(
          "BACKEND RESPONSE:",
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

        else if (
          error.response
            ?.status === 403
        ) {

          setError(
            error.response
              ?.data
              ?.detail

            ||

            "Seller access required"
          );

        }

        else if (
          error.response
            ?.status === 422
        ) {

          const details =
            error.response
              ?.data
              ?.detail;


          if (
            Array.isArray(details)
          ) {

            const message =
              details
                .map(
                  (item) =>
                    item.msg
                )
                .join(", ");


            setError(
              message
            );

          }

          else {

            setError(
              "Invalid product information"
            );

          }

        }

        else {

          setError(
            error.response
              ?.data
              ?.detail

            ||

            "Unable to save product"
          );

        }

      }

      finally {

        setSaving(false);

      }

    };


  // =========================================
  // EDIT PRODUCT
  // =========================================

  const editProduct =
    (product) => {

      setError("");

      setSuccess("");


      setEditingId(
        product.id
      );


      setForm({

        name:
          product.name || "",

        description:
          product.description || "",

        price:
          product.price ?? "",

        stock:
          product.stock ?? "",

        category:
          product.category || "",

        subcategory:
          product.subcategory || "",

        image_url:
          product.image_url || "",

      });


      window.scrollTo({

        top: 0,

        behavior: "smooth",

      });

    };


  // =========================================
  // DELETE PRODUCT
  // =========================================

  const deleteProduct =
    async (
      productId
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );


      if (!confirmed) {

        return;

      }


      setError("");

      setSuccess("");


      try {

        await API.delete(

          `/seller/products/${productId}`

        );


        setSuccess(
          "Product deleted successfully"
        );


        await loadProducts();

      }

      catch (error) {

        console.error(
          "DELETE PRODUCT ERROR:",
          error.response?.data
        );


        setError(
          error.response
            ?.data
            ?.detail

          ||

          "Unable to delete product"
        );

      }

    };


  // =========================================
  // CANCEL EDIT
  // =========================================

  const cancelEdit =
    () => {

      setEditingId(
        null
      );


      setForm(
        emptyForm
      );


      setError("");

      setSuccess("");

    };


  return (

    <>

      <Navbar />


      <main className=
        "seller-dashboard"
      >


        {/* =================================
            SELLER HEADER
        ================================= */}

        <section className=
          "seller-welcome"
        >


          <div>


            <p>

              SELLER CENTER

            </p>


            <h1>

              Welcome,{" "}

              {user?.name}

            </h1>


            {profile && (

              <h3>

                🏪{" "}

                {
                  profile.shop_name
                }

              </h3>

            )}


          </div>


          <div className=
            "seller-stats"
          >


            <div>

              <strong>

                {
                  products.length
                }

              </strong>


              <span>

                Products

              </span>

            </div>


          </div>


        </section>



        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div className=
            "error-message"
          >

            {error}

          </div>

        )}



        {/* =================================
            SUCCESS
        ================================= */}

        {success && (

          <div className=
            "success-message"
          >

            {success}

          </div>

        )}



        {/* =================================
            ADD / EDIT PRODUCT FORM
        ================================= */}

        <form
          className=
            "seller-product-form"
          onSubmit={
            handleSubmit
          }
        >


          <h2>

            {
              editingId
                ? "Edit Product"
                : "Add New Product"
            }

          </h2>



          {/* NAME */}

          <div className=
            "seller-form-group"
          >

            <label>

              Product Name

            </label>


            <input
              type="text"
              name="name"
              placeholder=
                "Enter product name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>



          {/* DESCRIPTION */}

          <div className=
            "seller-form-group"
          >

            <label>

              Description

            </label>


            <input
              type="text"
              name="description"
              placeholder=
                "Product description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />

          </div>



          {/* PRICE */}

          <div className=
            "seller-form-group"
          >

            <label>

              Price

            </label>


            <input
              type="number"
              name="price"
              min="0.01"
              step="0.01"
              placeholder=
                "Enter price"
              value={
                form.price
              }
              onChange={
                handleChange
              }
              required
            />

          </div>



          {/* STOCK */}

          <div className=
            "seller-form-group"
          >

            <label>

              Stock

            </label>


            <input
              type="number"
              name="stock"
              min="0"
              placeholder=
                "Enter stock"
              value={
                form.stock
              }
              onChange={
                handleChange
              }
              required
            />

          </div>



          {/* =================================
              CATEGORY
          ================================= */}

          <div className=
            "seller-form-group"
          >

            <label>

              Category

            </label>


            <select
              name="category"
              value={
                form.category
              }
              onChange={
                handleCategoryChange
              }
              required
            >


              <option value="">

                Select Category

              </option>


              {
                Object.keys(
                  categoryOptions
                ).map(
                  (categoryName) => (

                    <option
                      key={
                        categoryName
                      }
                      value={
                        categoryName
                      }
                    >

                      {
                        categoryName
                      }

                    </option>

                  )
                )
              }


            </select>

          </div>



          {/* =================================
              SUBCATEGORY
          ================================= */}

          <div className=
            "seller-form-group"
          >

            <label>

              Subcategory

            </label>


            <select
              name="subcategory"
              value={
                form.subcategory
              }
              onChange={
                handleChange
              }
              disabled={
                form.category === ""
              }
              required
            >


              <option value="">

                {
                  form.category
                    ? "Select Subcategory"
                    : "Select Category First"
                }

              </option>


              {
                availableSubcategories
                  .map(
                    (
                      subcategoryName
                    ) => (

                      <option
                        key={
                          subcategoryName
                        }
                        value={
                          subcategoryName
                        }
                      >

                        {
                          subcategoryName
                        }

                      </option>

                    )
                  )
              }


            </select>

          </div>



          {/* IMAGE URL */}

          <div className=
            "seller-form-group"
          >

            <label>

              Product Image URL

            </label>


            <input
              type="text"
              name="image_url"
              placeholder=
                "https://..."
              value={
                form.image_url
              }
              onChange={
                handleChange
              }
            />

          </div>



          {/* SAVE */}

          <button
            type="submit"
            disabled={
              saving
            }
          >

            {
              saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"
            }

          </button>



          {/* CANCEL EDIT */}

          {editingId && (

            <button
              type="button"
              className=
                "cancel-button"
              onClick={
                cancelEdit
              }
            >

              Cancel Edit

            </button>

          )}


        </form>



        {/* =================================
            PRODUCTS TITLE
        ================================= */}

        <div className=
          "seller-products-heading"
        >


          <h2>

            My Products

          </h2>


          <span>

            {products.length}
            {" "}
            products

          </span>


        </div>



        {/* =================================
            EMPTY PRODUCTS
        ================================= */}

        {
          products.length === 0
          ? (

            <div className=
              "seller-empty-products"
            >


              <h2>

                No products yet

              </h2>


              <p>

                Add your first
                product using the
                form above.

              </p>


            </div>

          )
          : (

            /* =================================
               PRODUCT GRID
            ================================= */

            <div className=
              "seller-products-grid"
            >


              {
                products.map(
                  (product) => (

                    <div
                      className=
                        "seller-product-card"
                      key={
                        product.id
                      }
                    >


                      {/* IMAGE */}

                      <div className=
                        "seller-product-image"
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
                              "seller-no-image"
                            >

                              No Image

                            </div>

                          )
                        }


                      </div>



                      {/* DETAILS */}

                      <div className=
                        "seller-product-details"
                      >


                        <div className=
                          "seller-product-category"
                        >

                          {
                            product.category
                          }

                          {
                            product.subcategory
                            &&
                            ` > ${product.subcategory}`
                          }

                        </div>


                        <h3>

                          {
                            product.name
                          }

                        </h3>


                        <p>

                          {
                            product.description
                          }

                        </p>


                        <h2>

                          AED{" "}

                          {
                            Number(
                              product.price
                            )
                            .toFixed(2)
                          }

                        </h2>


                        <p>

                          Stock:
                          {" "}
                          {
                            product.stock
                          }

                        </p>



                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <div className=
                          "seller-product-actions"
                        >


                          <button
                            type="button"
                            className=
                              "edit-button"
                            onClick={() =>
                              editProduct(
                                product
                              )
                            }
                          >

                            Edit

                          </button>


                          <button
                            type="button"
                            className=
                              "delete-button"
                            onClick={() =>
                              deleteProduct(
                                product.id
                              )
                            }
                          >

                            Delete

                          </button>


                        </div>


                      </div>


                    </div>

                  )
                )
              }


            </div>

          )
        }


      </main>

    </>

  );

}


export default SellerDashboard;