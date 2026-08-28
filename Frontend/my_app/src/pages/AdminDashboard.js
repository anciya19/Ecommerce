import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import API from "../services/api";


const emptyForm = {

  name: "",

  description: "",

  price: "",

  stock: "",

  category: "",

  image_url: "",

};


function AdminDashboard() {

  const [products, setProducts] =
    useState([]);


  const [form, setForm] =
    useState(emptyForm);


  const [
    editingId,
    setEditingId
  ] = useState(null);


  const [error, setError] =
    useState("");


  // =====================================
  // LOAD PRODUCTS
  // =====================================

  const loadProducts =
    async () => {

      try {

        const response =
          await API.get(
            "/products"
          );


        setProducts(
          response.data
        );


        setError("");

      }

      catch (error) {

        setError(
          error.response
            ?.data
            ?.detail
          ||
          "Unable to load products"
        );

      }

    };


  useEffect(() => {

    loadProducts();

  }, []);


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };


  // =====================================
  // SAVE PRODUCT
  // =====================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setError("");


      const productData = {

        name:
          form.name,

        description:
          form.description,

        price:
          Number(
            form.price
          ),

        stock:
          Number(
            form.stock
          ),

        category:
          form.category,

        image_url:
          form.image_url,

      };


      try {

        if (editingId) {

          await API.put(

            `/products/${editingId}`,

            productData

          );

        }

        else {

          await API.post(

            "/products",

            productData

          );

        }


        setForm(
          emptyForm
        );


        setEditingId(
          null
        );


        await loadProducts();


        alert(

          editingId

            ? "Product updated successfully"

            : "Product added successfully"

        );

      }

      catch (error) {

        setError(
          error.response
            ?.data
            ?.detail
          ||
          "Unable to save product"
        );

      }

    };


  // =====================================
  // EDIT
  // =====================================

  const editProduct =
    (product) => {

      setEditingId(
        product.id
      );


      setForm({

        name:
          product.name,

        description:
          product.description,

        price:
          product.price,

        stock:
          product.stock,

        category:
          product.category,

        image_url:
          product.image_url,

      });


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };


  // =====================================
  // DELETE
  // =====================================

  const deleteProduct =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this product?"
        );


      if (!confirmed) {
        return;
      }


      try {

        await API.delete(
          `/products/${id}`
        );


        await loadProducts();

      }

      catch (error) {

        setError(
          error.response
            ?.data
            ?.detail
          ||
          "Unable to delete product"
        );

      }

    };


  const cancelEdit =
    () => {

      setEditingId(null);

      setForm(emptyForm);

    };


  return (

    <div>

      <Navbar />


      <div className="admin-page">


        <div className="admin-title">

          <h1>
            Admin Dashboard
          </h1>

          <p>

            Manage your
            e-commerce products.

          </p>

        </div>


        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        <form
          className="product-form"
          onSubmit={
            handleSubmit
          }
        >


          <h2>

            {
              editingId
                ? "Update Product"
                : "Add Product"
            }

          </h2>


          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={
              handleChange
            }
            required
          />


          <input
            name="description"
            placeholder="Description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
          />


          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={
              handleChange
            }
            required
          />


          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={
              handleChange
            }
            required
          />


          <input
            name="category"
            placeholder="Category"
            value={
              form.category
            }
            onChange={
              handleChange
            }
          />


          <input
            name="image_url"
            placeholder="Image URL"
            value={
              form.image_url
            }
            onChange={
              handleChange
            }
          />


          <button
            type="submit"
          >

            {
              editingId
                ? "Update Product"
                : "Add Product"
            }

          </button>


          {editingId && (

            <button
              type="button"
              className="cancel-button"
              onClick={
                cancelEdit
              }
            >

              Cancel Edit

            </button>

          )}


        </form>


        <h2 className="admin-products-title">

          All Products

        </h2>


        <div className="admin-product-list">


          {products.map(
            (product) => (

              <div
                className="admin-product-card"
                key={product.id}
              >


                {product.image_url ? (

                  <img

                    src={
                      product.image_url
                    }

                    alt={
                      product.name
                    }

                  />

                ) : (

                  <div className="admin-placeholder">

                    📦

                  </div>

                )}


                <div className="admin-product-info">


                  <h3>

                    {product.name}

                  </h3>


                  <p>

                    {
                      product.category
                    }

                  </p>


                  <strong>

                    AED{" "}

                    {
                      Number(
                        product.price
                      ).toFixed(2)
                    }

                  </strong>


                  <p>

                    Stock:
                    {" "}
                    {product.stock}

                  </p>


                </div>


                <div className="admin-actions">


                  <button

                    className="edit-button"

                    onClick={() =>
                      editProduct(
                        product
                      )
                    }

                  >

                    Edit

                  </button>


                  <button

                    className="delete-button"

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

            )
          )}


        </div>


      </div>


    </div>

  );

}


export default AdminDashboard;