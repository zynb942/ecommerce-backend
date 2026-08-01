# E-Commerce Backend API
A production-ready, full-featured RESTful E-commerce backend built with Node.js, Express, and MongoDB. Developed as part of an intensive 4-week training program, this project implements real-world architecture, secure authentication, atomic transactions, and complex analytics pipelines.

## Tech Stack

## Tech Stack

* **Runtime:** [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
* **Framework:** [![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
* **Database & ODM:** [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
* **Authentication:** [![JWT](https://img.shields.io/badge/JWT-000000?logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/) [![bcryptjs](https://img.shields.io/badge/bcryptjs-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/bcryptjs)
* **File Management:** [![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=Cloudinary&logoColor=white)](https://cloudinary.com/) [![Multer](https://img.shields.io/badge/Multer-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/multer)
* **Payments & Emails:** [![Stripe](https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white)](https://stripe.com/) [![Nodemailer](https://img.shields.io/badge/Nodemailer-14C38E?logo=npm&logoColor=white)](https://nodemailer.com/)
* **Validation & Utilities:** [![Joi](https://img.shields.io/badge/Joi-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/joi) [![Slugify](https://img.shields.io/badge/Slugify-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/slugify) [![Morgan](https://img.shields.io/badge/Morgan-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/morgan)


## Project Architecture
The project follows the MVC (Model-View-Controller) pattern with a strict separation of concerns across layers:

```
ecommerce-api/
├── config/         → Cloudinary & environment setup
├── models/         → Mongoose schemas (User, Product, Order, Cart, Wishlist, OTP)
├── controllers/    → Core business logic for each resource
├── DB/             → Database connection handler
├── routes/         → Express routing definitions
├── middleware/     → Auth guards, role checks, file upload, and validation
├── utils/          → Reusable helpers (Nodemailer, Cloudinary streams)
├── validation/     → Joi validation schemas
├── index.js        → Application entry point
└── vercel.json     → Deployment configuration

```
<!-- ## Documentation
please, add postman or swagger documentation url. -->


## Key Technical Features

  Mongoose Transactions: Ensures atomicity during order placement and cancellation. If any step (such as stock deduction or order creation) fails, the entire transaction rolls back.  

  Real-Time Cart & Stock Management: Adding, updating, or removing items dynamically updates inventory levels. Cart totals, item counts, and discounts are calculated on-the-fly using Mongoose Virtuals.  

  Cloudinary Integration: Handles multi-image uploads, partial updates (deleting specific images while adding new ones), and clean deletion when a product is removed.  

  Automated Transactional Emails: Uses Nodemailer to send OTP verifications, order confirmations with itemized breakdowns, and status change alerts.  

  Advanced Admin Analytics: Utilizes parallel MongoDB Aggregation Pipelines to calculate revenue growth, order status breakdowns, top-selling products, and recent activity.

## Environment Variables
  Create a `.env` file in the root directory and configure the following variables (do not commit this file to version control):

```env
Server
  PORT=5000
  NODE_ENV=development

Database
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

JWT
  JWT_SECRET=your_super_secret_key_here
  JWT_EXPIRE=7d

Cloudinary
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret

Email (Nodemailer)
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_app_password


Stripe
  STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
  STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
  ```

## Getting Started
```bash
  Clone the repository:
  git clone https://github.com/zynb942/ecommerce-backend.git
  cd ecommerce-backendgit clone https://github.com/zynb942/ecommerce-backend.git
  cd ecommerce-backend
  ```

## Install dependencies:
```bash
npm install
```

## Configure environment variables:
```env
Create a .env file based on the template above.
```

## Run the application:

Development mode (with Nodemon):
```bash
  npm run dev
```

Production mode:
```bash
  npm start

```
## Database Models

The database is designed with MongoDB and Mongoose, featuring the following core models:      

  User: Manages customers and admins, supporting OTP email verification, multiple addresses, and password reset flows.  

  Product: Stores product details, inventory stock, Cloudinary images, and embedded reviews. It features full-text search indexing and auto-generated URL slugs.  
  
  Order: Tracks the full lifecycle of a purchase, including payment status (Stripe/Cash), shipping fees, and admin/customer notes.  
  
  Cart: Uses Mongoose Virtuals to dynamically calculate subtotals, discounts (via coupons), and total prices without storing them directly in the database.  
  
  Wishlist: Stores user's saved products with automatic population of product details upon querying.  
  
  OTP: Temporarily stores one-time passwords and registration data for secure user verification.

API Endpoints Reference
Here is a high-level overview of the available RESTful endpoints. All protected routes require a Bearer token in the `Authorization` header.

Authentication (`/auth`)
POST `/auth/register/send-otp` - Register a new user and send verification `OTP`.  
POST `/auth/verify-otp` - Verify the OTP and activate the account.  
POST `/auth/login` - Authenticate user and return a signed `JWT`.  
POST `/auth/forgot-password/send-otp` - Request a password reset token. 

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /auth/register/send-otp | Public |
| POST | /auth/verify-otp | Public |
| POST | /auth/login | Public |
| POST | /auth/forgot-password/send-otp | Public |

Products (`/products`)
GET `/products` - Get all active products (supports pagination, filtering by category/price, and sorting).  
GET `/products/search` - Advanced full-text search across products.  
POST `/products` - Create a new product with Cloudinary image uploads (Admin only).  
POST `/products/:id/reviews` - Add a customer review and automatically recalculate the average rating. 

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /products | Public |
| GET | /products/search | Public |
| POST | /products | Admin only |
| POST | /products/:id/reviews | User |

Cart & Coupons (`/carts`)
GET `/carts` - Retrieve the current user's cart (creates one if it doesn't exist).  
POST `/carts/items` - Add an item to the cart, dynamically deducting from available stock.  
POST `/carts/coupon` - Apply a discount coupon (Percentage or Fixed amount). 

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /carts | User |
| POST | /carts/items | User |
| POST | /carts/coupon | User |

Orders & Payments (`/orders`)
POST `/orders` - Create an order (Cash or Stripe) using atomic Mongoose Transactions.  
GET `/orders/my` - Retrieve the authenticated user's order history.  
PATCH `/admin/:id/status` - Update order status, automatically triggering a Nodemailer status email (Admin only). 

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /orders | User |
| GET | /orders/my | User |
| PATCH | /admin/:id/status | Admin only |

Admin Dashboard (`/admin`)
GET `/admin/dashboard` - Get comprehensive statistics (total revenue, daily charts, top 5 products) generated via MongoDB Aggregation Pipelines.  
GET `/admin/carts` - View all active customer carts and item details. 
GET `/admin/wishlists/stats` - Discover the top 10 most wishlisted products.

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /admin/dashboard | Admin only |
| GET | /admin/carts | Admin only |
| GET | /admin/wishlists/stats | Admin only |

## License
`MIT`
This project is confidential and intended for internal use/training.
