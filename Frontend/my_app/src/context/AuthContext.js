import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API
  from "../services/api";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          "shopping_cart"
        );


      if (savedCart) {

        try {

          return JSON.parse(
            savedCart
          );

        }

        catch {

          return [];

        }

      }


      return [];

    });


  // =====================================
  // CART STORAGE
  // =====================================

  useEffect(() => {

    localStorage.setItem(

      "shopping_cart",

      JSON.stringify(cart)

    );

  }, [cart]);


  // =====================================
  // CHECK LOGIN
  // =====================================

  const checkAuth =
    async () => {

      try {

        const response =
          await API.get(
            "/auth/me"
          );


        setUser(
          response.data
        );


        return response.data;

      }

      catch {

        setUser(null);

        return null;

      }

      finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    checkAuth();

  }, []);


  // =====================================
  // REFRESH USER
  // =====================================

  const refreshUser =
    async () => {

      try {

        const response =
          await API.get(
            "/auth/me"
          );


        setUser(
          response.data
        );


        return response.data;

      }

      catch {

        setUser(null);

        return null;

      }

    };


  // =====================================
  // LOGIN
  // =====================================

  const login =
    async (
      email,
      password
    ) => {

      const response =
        await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );


      setUser(
        response.data.user
      );


      return (
        response.data.user
      );

    };


  // =====================================
  // LOGOUT
  // =====================================

  const logout =
    async () => {

      try {

        await API.post(
          "/auth/logout"
        );

      }

      finally {

        setUser(null);

      }

    };


  // =====================================
  // CART
  // =====================================

  const addToCart =
    (product) => {

      setCart(
        (currentCart) => {

          const existing =
            currentCart.find(
              (item) =>
                item.id ===
                product.id
            );


          if (existing) {

            return (
              currentCart.map(
                (item) =>

                  item.id ===
                  product.id

                    ? {
                        ...item,

                        quantity:
                          item.quantity
                          + 1,
                      }

                    : item

              )
            );

          }


          return [

            ...currentCart,

            {
              ...product,
              quantity: 1,
            },

          ];

        }
      );

    };


  const removeFromCart =
    (productId) => {

      setCart(
        (currentCart) =>

          currentCart.filter(
            (item) =>
              item.id !==
              productId
          )

      );

    };


  const isAuthenticated =
    user !== null;


  const role =
    user?.role || null;


  return (

    <AuthContext.Provider

      value={{

        user,

        role,

        isAuthenticated,

        loading,

        login,

        logout,

        checkAuth,

        refreshUser,

        cart,

        addToCart,

        removeFromCart,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(
    AuthContext
  );

}