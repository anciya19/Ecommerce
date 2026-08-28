export const categoryOptions = {
  Electronics: [
    "Mobiles",
    "Laptops",
    "Headphones",
    "Cameras",
    "Accessories",
  ],

  Fashion: [
    "Dresses",
    "Pants",
    "Shirts",
    "Shoes",
    "Bags",
  ],

  "Home & Kitchen": [
    "Kitchen",
    "Furniture",
    "Appliances",
    "Home Decor",
  ],
};


export const categories = {
  electronics: {
    label: "Electronics",
    subcategories: categoryOptions.Electronics,
  },

  fashion: {
    label: "Fashion",
    subcategories: categoryOptions.Fashion,
  },

  "home-kitchen": {
    label: "Home & Kitchen",
    subcategories:
      categoryOptions["Home & Kitchen"],
  },
};