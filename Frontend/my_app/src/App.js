import React from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";


import ProtectedRoute
  from "./components/ProtectedRoute";

import AdminRoute
  from "./components/AdminRoute";

import SellerRoute
  from "./components/SellerRoute";

import Chatbot
  from "./components/Chatbot";


import Login
  from "./pages/Login";

import Register
  from "./pages/Register";

import UserHome
  from "./pages/UserHome";

import AdminDashboard
  from "./pages/AdminDashboard";

import SellerRegister
  from "./pages/SellerRegister";

import SellerDashboard
  from "./pages/SellerDashboard";

import Products
  from "./pages/Products";

import Cart
  from "./pages/Cart";

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <AuthProvider>


        <Routes>


          {/* LOGIN */}

          <Route
            path="/login"
            element={
              <Login />
            }
          />


          {/* REGISTER */}

          <Route
            path="/register"
            element={
              <Register />
            }
          />


          {/* HOME */}

          <Route
            path="/home"
            element={

              <ProtectedRoute>

                <UserHome />

              </ProtectedRoute>

            }
          />


          {/* ALL PRODUCTS */}

          <Route
            path="/products"
            element={

              <ProtectedRoute>

                <Products />

              </ProtectedRoute>

            }
          />


          {/* CATEGORY */}

          <Route
            path="/products/category/:category"
            element={

              <ProtectedRoute>

                <Products />

              </ProtectedRoute>

            }
          />


          {/* CATEGORY + SUBCATEGORY */}

          <Route
            path="/products/category/:category/:subcategory"
            element={

              <ProtectedRoute>

                <Products />

              </ProtectedRoute>

            }
          />


          {/* DEALS */}

          <Route
            path="/products/deals"
            element={

              <ProtectedRoute>

                <Products />

              </ProtectedRoute>

            }
          />


          {/* CART */}

          <Route
            path="/cart"
            element={

              <ProtectedRoute>

                <Cart />

              </ProtectedRoute>

            }
          />



          {/* ADMIN */}

          <Route
            path="/admin"
            element={

              <AdminRoute>

                <AdminDashboard />

              </AdminRoute>

            }
          />


          {/* BECOME SELLER */}

          <Route
            path="/seller/register"
            element={

              <ProtectedRoute>

                <SellerRegister />

              </ProtectedRoute>

            }
          />


          {/* SELLER DASHBOARD */}

          <Route
            path="/seller/dashboard"
            element={

              <SellerRoute>

                <SellerDashboard />

              </SellerRoute>

            }
          />


          {/* DEFAULT */}

          <Route
            path="/"
            element={

              <Navigate
                to="/login"
                replace
              />

            }
          />


          {/* UNKNOWN */}

          <Route
            path="*"
            element={

              <Navigate
                to="/login"
                replace
              />

            }
          />


        </Routes>



        {/* =================================
            GLOBAL CHATBOT
        ================================= */}

        <Chatbot />


      </AuthProvider>

    </BrowserRouter>

  );

}


export default App;