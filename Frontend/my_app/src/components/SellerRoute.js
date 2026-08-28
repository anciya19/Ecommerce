import React from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


function SellerRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (

      <div className="loading-page">

        Checking authentication...

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
    user.role === "admin"
  ) {

    return (

      <Navigate
        to="/admin"
        replace
      />

    );

  }


  if (
    user.role !== "seller"
  ) {

    return (

      <Navigate
        to="/home"
        replace
      />

    );

  }


  return children;

}


export default SellerRoute;