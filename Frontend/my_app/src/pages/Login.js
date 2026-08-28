import React, {
  useState,
} from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


function getHomeForRole(
  role
) {

  if (role === "admin") {

    return "/admin";

  }


  if (role === "seller") {

    return "/seller/dashboard";

  }


  return "/home";

}


function Login() {

  const navigate =
    useNavigate();


  const {
    login,
    user,
    loading,
  } = useAuth();


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


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


  if (user) {

    return (

      <Navigate
        to={
          getHomeForRole(
            user.role
          )
        }
        replace
      />

    );

  }


  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setError("");

      setSubmitting(true);


      try {

        const loggedInUser =
          await login(
            email,
            password
          );


        navigate(

          getHomeForRole(
            loggedInUser.role
          ),

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
            "Backend is unavailable. Please make sure FastAPI is running."
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
          Sign in
        </h2>


        {error && (

          <div className=
            "error-message"
          >

            {error}

          </div>

        )}


        <label>
          Email
        </label>


        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
        />


        <label>
          Password
        </label>


        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
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
              ? "Signing in..."
              : "Sign in"
          }

        </button>


        <p>

          New customer?
          {" "}

          <Link to="/register">

            Create account

          </Link>

        </p>


      </form>


    </div>

  );

}


export default Login;