import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";


function Register() {

  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      confirmPassword: "",

    });


  const [error, setError] =
    useState("");


  const [submitting, setSubmitting] =
    useState(false);


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


      if (
        form.password !==
        form.confirmPassword
      ) {

        setError(
          "Passwords do not match"
        );

        return;

      }


      if (
        form.password.length <
        8
      ) {

        setError(
          "Password must contain at least 8 characters"
        );

        return;

      }


      setSubmitting(true);


      try {

        await API.post(
          "/auth/register",
          {

            name:
              form.name,

            email:
              form.email,

            password:
              form.password,

          }
        );


        alert(
          "Registration successful. Please login."
        );


        navigate(
          "/login"
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
            "Backend is unavailable."
          );

        }

      }

      finally {

        setSubmitting(false);

      }

    };


  return (

    <div className="auth-page">


      <form
        className="auth-card"
        onSubmit={
          handleSubmit
        }
      >


        <h1>
          ShopNow
        </h1>


        <h2>
          Create account
        </h2>


        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        <label>
          Your name
        </label>


        <input
          name="name"
          value={form.name}
          onChange={
            handleChange
          }
          required
        />


        <label>
          Email
        </label>


        <input
          name="email"
          type="email"
          value={form.email}
          onChange={
            handleChange
          }
          required
        />


        <label>
          Password
        </label>


        <input
          name="password"
          type="password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
          required
        />


        <label>
          Confirm password
        </label>


        <input
          name="confirmPassword"
          type="password"
          value={
            form.confirmPassword
          }
          onChange={
            handleChange
          }
          required
        />


        <button
          type="submit"
          disabled={submitting}
        >

          {
            submitting
              ? "Creating..."
              : "Create account"
          }

        </button>


        <p>

          Already have an account?{" "}

          <Link to="/login">

            Sign in

          </Link>

        </p>


      </form>


    </div>

  );

}


export default Register;