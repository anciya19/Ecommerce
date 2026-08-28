import React, {
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

import API
  from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


function SellerRegister() {

  const navigate =
    useNavigate();


  const {
    user,
    loading,
    refreshUser,
  } = useAuth();


  const [form, setForm] =
    useState({

      seller_name:
        user?.name || "",

      shop_name: "",

      phone_number: "",

    });


  const [error, setError] =
    useState("");


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  if (loading) {

    return (

      <div className="loading-page">

        Loading...

      </div>

    );

  }


  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );

  }


  if (
    user.role === "seller"
  ) {

    return (

      <Navigate
        to="/seller/dashboard"
        replace
      />

    );

  }


  if (
    user.role === "admin"
  ) {

    return (

      <Navigate
        to="/admin"
        replace
      />

    );

  }


  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setError("");

      setSubmitting(true);


      try {

        await API.post(
          "/seller/register",
          form
        );


        await refreshUser();


        alert(
          "Seller account created successfully!"
        );


        navigate(
          "/seller/dashboard",
          {
            replace: true,
          }
        );

      }

      catch (error) {

        if (
          error.response
            ?.data
            ?.detail
        ) {

          setError(
            error.response
              .data
              .detail
          );

        }

        else {

          setError(
            "Unable to connect to the backend."
          );

        }

      }

      finally {

        setSubmitting(false);

      }

    };


  return (

    <div>

      <Navbar />


      <div className=
        "seller-register-page"
      >


        <form
          className=
            "seller-register-card"
          onSubmit={
            handleSubmit
          }
        >


          <h1>
            Become a Seller
          </h1>


          <p className=
            "seller-register-description"
          >

            Start selling your
            products on ShopNow.

          </p>


          {error && (

            <div className=
              "error-message"
            >

              {error}

            </div>

          )}


          <label>
            Seller Name
          </label>


          <input
            name="seller_name"
            value={
              form.seller_name
            }
            onChange={
              handleChange
            }
            required
          />


          <label>
            Email
          </label>


          <input
            value={
              user.email
            }
            disabled
          />


          <small>

            Your existing login
            email will be used for
            your seller account.

          </small>


          <label>
            Shop Name
          </label>


          <input
            name="shop_name"
            placeholder=
              "Enter shop name"
            value={
              form.shop_name
            }
            onChange={
              handleChange
            }
            required
          />


          <label>
            Phone Number
          </label>


          <input
            name="phone_number"
            type="tel"
            placeholder=
              "Enter phone number"
            value={
              form.phone_number
            }
            onChange={
              handleChange
            }
            required
          />


          <button
            type="submit"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Creating Seller Account..."
                : "Create Seller Account"
            }

          </button>


        </form>


      </div>


    </div>

  );

}


export default SellerRegister;