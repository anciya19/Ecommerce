# 🛒 Full-Stack E-Commerce Website

A full-stack E-Commerce web application built using **React, FastAPI, MySQL, SQLAlchemy, JWT Authentication, and AI Chatbot integration**.

This project provides separate functionality for **Customers, Sellers, and Admins**. Customers can browse products, add items to their cart, place orders, and view order history. Sellers can manage their own products and orders, while Admins can manage products across the website.

---

## 🚀 Technologies Used

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Axios
- React Router
- React Context API

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- MySQL
- PyMySQL

### Authentication

- JWT Authentication
- HTTP-only Cookies
- bcrypt Password Hashing
- Role-Based Authorization

### AI Chatbot

- Groq API
- Sentence Transformers
- FAISS
- RAG (Retrieval-Augmented Generation)

---

## ✨ Features

The application supports three types of accounts:

```text
Admin
User / Customer
Seller
```

### 👤 Customer Features

Customers can:

- Register an account
- Login securely
- Stay logged in after refreshing the browser
- View available products
- Search products
- Browse products by category
- Browse products by subcategory
- Add products to cart
- View selected cart items
- Choose payment options
- Place orders
- View order history
- Use the AI support chatbot
- Become a seller
- Logout securely

---

## 🏪 Seller Features

A normal customer can click:

```text
Become a Seller
```

and create a seller profile.

After becoming a seller, the seller can:

- Access Seller Dashboard
- Add new products
- Add product name
- Add product description
- Add product price
- Add stock quantity
- Select product category
- Select product subcategory
- Add product image URL
- View their own products
- Edit their own products
- Delete their own products
- View order details related to their products

Each product is connected to the seller who created it.

A seller can manage only their own products.

---

## 👨‍💼 Admin Features

Admin users have additional permissions.

Admin can:

- Login to Admin Dashboard
- View products
- Add products
- Update products
- Delete products
- Manage products across the website

Normal users and sellers cannot access Admin-only functionality.

---

## 🔐 Authentication

The project uses **JWT Authentication with HTTP-only cookies**.

Passwords are never stored directly in the database.

During registration:

```text
User enters password
        ↓
Password is hashed
        ↓
Hashed password is stored in MySQL
```

During login:

```text
Email + Password
        ↓
FastAPI verifies credentials
        ↓
JWT is created
        ↓
JWT is stored in HTTP-only cookie
        ↓
React receives authenticated user information
        ↓
Role is checked
```

Users are redirected according to their role:

```text
Admin
   ↓
Admin Dashboard

Seller
   ↓
Seller Dashboard

User
   ↓
User Homepage
```

---

## 🔄 Persistent Login

The user does not need to enter login details again every time the page is refreshed.

Authentication works like this:

```text
First Login
     ↓
FastAPI creates JWT
     ↓
JWT stored in HTTP-only cookie
     ↓
User refreshes browser
     ↓
React checks authentication
     ↓
Browser sends cookie automatically
     ↓
FastAPI validates JWT
     ↓
User information restored
     ↓
User remains logged in
```

The user needs to login again when:

- The user logs out
- The authentication token expires
- The authentication information becomes invalid

---

## 🛍️ Product Categories

Products are organized using categories and subcategories.

Example:

```text
Electronics
├── Mobiles
├── Laptops
└── Accessories

Fashion
├── Dresses
├── Pants
└── Other Fashion Items

Home & Kitchen
├── Kitchen
├── Furniture
└── Home Essentials
```

When a customer selects a category, only products belonging to that category are displayed.

For example:

```text
Click Electronics
        ↓
Show Electronics Products

Click Fashion
        ↓
Show Fashion Products

Click Dresses
        ↓
Show Dress Products
```

---

## 🛒 Shopping Cart

Customers can add products to their shopping cart.

Shopping flow:

```text
Browse Products
      ↓
Select Product
      ↓
Add to Cart
      ↓
View Cart
      ↓
Select Payment Option
      ↓
Place Order
      ↓
Order Saved
      ↓
View Order History
```

---

## 📦 Orders

After placing an order:

- Order information is stored in the database
- Customer can view order history
- Seller can view orders related to their products

This connects the customer ordering process with the Seller Dashboard.

---

## 🤖 AI Support Chatbot

The application also contains an AI-powered support chatbot.

The chatbot uses a **RAG (Retrieval-Augmented Generation)** approach.

The basic chatbot flow is:

```text
User Question
      ↓
Sentence Transformer
      ↓
Create Query Embedding
      ↓
FAISS Similarity Search
      ↓
Find Relevant E-Commerce Information
      ↓
Send Context to Groq LLM
      ↓
Generate Answer
      ↓
Display Answer in React Chatbot
```

The chatbot is designed to answer questions using the information provided about the e-commerce website.

---

## 🗄️ Database

The application uses **MySQL**.

The main database entities include:

```text
Users
Products
Seller Profiles
Cart
Orders
Order Items
```

### User Roles

The `users` table supports:

```text
admin
user
seller
```

### Seller Relationship

Seller information is connected to the user account.

```text
users
  │
  │
  ▼
seller_profiles
```

### Product Relationship

Products are connected to sellers.

```text
Seller
  │
  │
  ├── Product 1
  ├── Product 2
  └── Product 3
```

This allows each seller to manage only the products that belong to them.

---

## 📁 Project Structure

```text
Ecommerce/
│
├── Backend/
│   │
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── auth.py
│   ├── dependencies.py
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   │
│   └── my_app/
│       │
│       ├── public/
│       │
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── data/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── App.js
│       │   └── App.css
│       │
│       ├── package.json
│       └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/anciya19/Ecommerce.git
```

Move into the project:

```bash
cd Ecommerce
```

---

# 🐍 Backend Setup

Move into the backend folder:

```bash
cd Backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install all required Python packages:

```bash
pip install -r requirements.txt
```

---

# 🗄️ MySQL Setup

Make sure MySQL is installed and running.

Create the database:

```sql
CREATE DATABASE ecommerce;
```

Create a `.env` file inside the Backend folder.

Example:

```env
DATABASE_URL=mysql+pymysql://YOUR_USERNAME:YOUR_PASSWORD@localhost/ecommerce
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Replace:

```text
YOUR_USERNAME
YOUR_PASSWORD
YOUR_GROQ_API_KEY
```

# ▶️ Start FastAPI Backend

From the Backend folder run:

```bash
python -m uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a **second terminal**.

Go to the React application:

```bash
cd Ecommerce
cd Frontend
cd my_app
```

Install React packages:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will normally open at:

```text
http://localhost:3000
```

---

# 🔗 Frontend and Backend Connection

The application works like this:

```text
React Frontend
http://localhost:3000
        │
        │ Axios API Requests
        ▼
FastAPI Backend
http://127.0.0.1:8000
        │
        │ SQLAlchemy ORM
        ▼
MySQL Database
```

React handles the user interface.

Axios sends requests from React to FastAPI.

FastAPI handles authentication and business logic.

SQLAlchemy communicates between FastAPI and MySQL.

MySQL stores application data.

---

# 🔒 Security

The project follows important security practices:

- Passwords are hashed before storing
- Plain-text passwords are not stored
- JWT authentication is used
- JWT is stored using an HTTP-only cookie
- Authentication persists after browser refresh
- Backend APIs verify authentication
- Admin APIs verify the Admin role
- Seller APIs verify the Seller role
- Sellers can manage only their own products
- Environment variables are used for sensitive information

---

# ⚠️ Files Not to Upload to GitHub

Do not upload sensitive or unnecessary files such as:

```text
.env
venv/
node_modules/
__pycache__/
```

Example `.gitignore`:

```gitignore
# Environment variables
.env

# Python
venv/
__pycache__/
*.pyc

# React
node_modules/
build/

# IDE
.vscode/

# Operating System
.DS_Store
```

---

# 🖥️ Running with Two Terminals

## Terminal 1 — Backend

```bash
cd Ecommerce
cd Backend

venv\Scripts\activate

python -m uvicorn main:app --reload
```

## Terminal 2 — Frontend

```bash
cd Ecommerce
cd Frontend
cd my_app

npm start
```

Then open:

```text
http://localhost:3000
```

---

# 🔄 Complete Application Flow

```text
                     E-COMMERCE WEBSITE
                             │
                             ▼
                    Register / Login
                             │
                             ▼
                    JWT Authentication
                             │
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
                  USER     SELLER    ADMIN
                    │        │        │
                    │        │        └── Manage Products
                    │        │
                    │        ├── Add Products
                    │        ├── Edit Products
                    │        ├── Delete Products
                    │        └── View Orders
                    │
                    ├── Browse Products
                    ├── Search Products
                    ├── Filter Categories
                    ├── Add to Cart
                    ├── Choose Payment
                    ├── Place Order
                    ├── View Order History
                    └── AI Chatbot
```

---

# 🎯 Project Purpose

This project was developed to practice and understand **full-stack web development**.

The project demonstrates how to integrate:

```text
React
   ↓
Axios
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
MySQL
```

It also demonstrates:

- User authentication
- JWT
- HTTP-only cookies
- Role-based authorization
- Admin functionality
- Seller functionality
- Product management
- Category filtering
- Shopping cart
- Order management
- AI chatbot integration
- RAG
- REST API development

---

# 👩‍💻 Developer

**Anciya R**

Full-Stack Python Developer

GitHub: **anciya19**

---

# 📌 Repository

**Ecommerce**

GitHub Repository:

`anciya19/Ecommerce`

---

# 📄 License

This project was developed for learning and educational purposes.
