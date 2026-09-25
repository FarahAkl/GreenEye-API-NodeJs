# GreenEye API — Node.js

Backend API reimplementation of the GreenEye agricultural platform using Node.js, Express, TypeScript, MongoDB, Mongoose, and Zod.

> **API Reference:** The endpoint list below is based on the GreenEye OpenAPI/Swagger specification. Exact request bodies, query parameters, response schemas, and authorization requirements should be checked against the Swagger specification.

**Interactive Swagger documentation:** [https://green-eye-api-node-js.vercel.app/swagger](https://green-eye-api-node-js.vercel.app/swagger)

## Endpoints 

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Get all users |
| `PATCH` | `/api/admin/users/:userId/approve` | Approve a pending user |
| `PATCH` | `/api/admin/users/:userId/reject` | Reject a pending user |
| `PATCH` | `/api/admin/users/:userId/change-role` | Change a user's role |
| `PATCH` | `/api/admin/users/:userId/freeze` | Freeze a user |
| `PATCH` | `/api/admin/users/:userId/unfreeze` | Unfreeze a user |
| `GET` | `/api/admin/withdrawal-requests` | Get all withdrawal requests |
| `GET` | `/api/admin/withdrawal-requests/:withdrawalId` | Get withdrawal requests |
| `PATCH` | `/api/admin/withdrawal-requests/:withdrawalId/approve` | Approve a withdrawal request |
| `PATCH` | `/api/admin/withdrawal-requests/:withdrawalId/reject` | Reject a withdrawal request |
| `GET` | `/api/admin/products` | Get all products |
| `PATCH` | `/api/admin/products/:productId/approve` | Approve a product |
| `PUT` | `/api/admin/products/:productId/reject` | Reject a product |
| `GET` | `/api/admin/products-count` | Get products count |
| `GET` | `/api/admin/orders-count` | Get orders count |
| `GET` | `/api/admin/product-updates` | Get pending product update requests |
| `GET` | `/api/admin/product-updates/:productId` | Get product update request details |
| `PATCH` | `/api/admin/product-updates/:productId/approve` | Approve a product update request |
| `PATCH` | `/api/admin/product-updates/:productId/reject` | Reject a product update request |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new account |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/verify-otp` | Verify an OTP |
| `POST` | `/api/auth/resend-otp` | Resend OTP |
| `POST` | `/api/auth/forget-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `POST` | `/api/auth/change-password` | Change password |
| `POST` | `/api/auth/refresh-token` | Refresh authentication token |
| `POST` | `/api/auth/logout` | Revoke authentication token |

### AI Models

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/classification` | Get classification information/results |
| `POST` | `/api/ai/forecast` | Get forecast |
| `POST` | `/api/ai/plant-disease` | Create/submit a crop disease detection |
| `GET` | `/api/ai/plant-disease/history` | Get crop disease detection history |
| `GET` | `/api/ai/plant-disease/history/:id` | Get a disease history record |
| `DELETE` | `/api/ai/plant-disease/history/:id` | Delete a disease history record |
| `POST` | `/api/ai/crop-growth-simulation` | Run crop growth simulation |
| `POST` | `/api/ai/crop-recommendation` | Get crop recommendation |
| `GET` | `/api/ai/crop-recommendation/history` | Get crop recommendation history |
| `DELETE` | `/api/ai/crop-recommendation/history/:id` | Delete a recommendation history record |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/cart` | Get current cart |
| `POST` | `/api/marketplace/cart/add-items` | Add items to cart |
| `PUT` | `/api/marketplace/cart/items/:itemId` | Update a cart item |
| `DELETE` | `/api/marketplace/cart/items/:itemId` | Remove a cart item |
| `DELETE` | `/api/marketplace/cart` | Clear cart |

### Category

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/category` | Get all categories |
| `POST` | `/api/marketplace/category` | Create a category |
| `GET` | `/api/marketplace/category/:categoryId` | Get a category by ID |
| `PATCH` | `/api/marketplace/category/:categoryId` | Update a category |
| `DELETE` | `/api/marketplace/category/:categoryId` | Delete a category |

### Comment

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Comment/add` | Add a comment |
| `GET` | `/api/Comment/post/:postId` | Get comments for a post |
| `PUT` | `/api/Comment` | Update a comment |
| `DELETE` | `/api/Comment/:commentId` | Delete a comment |Description |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Notifications` | Get notifications |
| `GET` | `/api/Notifications/unread-count` | Get unread notification count |
| `POST` | `/api/Notifications/mark-as-read/:id` | Mark a notification as read |
| `POST` | `/api/Notifications/mark-all-as-read` | Mark all notifications as read |

### Order

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/marketplace/order/create` | Create an order |
| `GET` | `/api/marketplace/order/user/orders` | Get current user's orders |
| `GET` | `/api/marketplace/order/:orderId` | Get an order by ID |
| `POST` | `/api/marketplace/order/:orderId/cancel` | Cancel an order |
| `POST` | `/api/marketplace/order/:orderId/refund-order` | Refund an order |
| `POST` | `/api/marketplace/order/stripe-webhook` | Handle Stripe webhook |

### Post

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Post/create` | Create a post |
| `GET` | `/api/Post/all` | Get all posts |
| `GET` | `/api/Post/:postId` | Get a post by ID |
| `DELETE` | `/api/Post` | Delete a post |
| `POST` | `/api/Post/:postId/like` | Like/unlike a post |
| `POST` | `/api/Post/:postId/favorite` | Add/remove a post from favorites |
| `GET` | `/api/Post/my-favorites` | Get current user's favorite posts |

### Post Category

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/PostCategory/add` | Add a post category |
| `GET` | `/api/PostCategory/all` | Get all post categories |

### Product

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/product` | Get all products |
| `GET` | `/api/marketplace/product/:id` | Get a product by ID |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get a user profile |
| `PATCH` | `/api/profile` | Update current user's profile |
| `DELETE` | `/api/profile` | Delete current user's account |

### Review

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/marketplace/Review` | Create a product review |
| `GET` | `/api/marketplace/Review/product/:productId` | Get reviews for a product |

### Shipping

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Shipping/shipping-rate` | Get shipping rates |
| `POST` | `/api/Shipping/shippo-webhook` | Handle Shippo webhook |
| `GET` | `/api/Shipping/order/:orderId/shipment-info` | Get shipment information for an order |

### Supplier

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/supplier/products` | Get supplier products |
| `POST` | `/api/supplier/products` | Add supplier products |
| `DELETE` | `/api/supplier/products/:productId` | Delete a supplier product |
| `POST` | `/api/supplier/product-updates/:productId` | Update a supplier product |
| `GET` | `/api/supplier/products-in-orders` | Get supplier products included in orders |
| `GET` | `/api/supplier/profits` | Get supplier profits |

### User Activity

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/UserActivity/timeline` | Get user activity timeline |
| `GET` | `/api/UserActivity/:id` | Get an activity by ID |
| `DELETE` | `/api/UserActivity/:id` | Delete an activity |
| `DELETE` | `/api/UserActivity/all` | Delete all user activities |

### Wallet

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Wallet/all-wallets` | Get all wallets |
| `GET` | `/api/Wallet/supplier/:supplierId` | Get supplier wallet |
| `GET` | `/api/Wallet/supplier/wallet` | Get current supplier wallet |
| `GET` | `/api/Wallet/:walletId/transactions` | Get wallet transactions |
| `GET` | `/api/Wallet/transactions` | Get current wallet transactions |
| `POST` | `/api/Wallet/create-withdrawal` | Create a withdrawal request |

## Query Parameters

Some endpoints accept query parameters. Examples from the API include:

- `pageNumber` — page number for paginated results
- `pageSize` — number of results per page
- `query` — search query
- `categoryId` — filter products by category
- `orderByDirection` — sorting direction
- `role` — filter users by role
- `userId` — identify a user where required

Refer to Swagger for the complete parameter list and their exact types/defaults for each endpoint.

## Authentication

Protected endpoints require authentication according to the API's authorization configuration. The authentication flow includes login, OTP verification, token refresh, and token revocation.

```text
Register → Verify OTP → Login → Access protected endpoints
                         ↓
                    Refresh Token
                         ↓
                    Revoke Token
```

## Planned Node.js Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Bcryptjs
- Nodemailer
- Zod
- JWT
- Multer
- Cloudinary
- CORS
- dotenv
- Axios
- Stripe
- Shippo

## Development

```bash
npm install
npm run dev
```

Build the project:

```bash
npm run build
```

Run the production build:

```bash
npm run prod
```

## Project Goal

This repository is being built independently from the existing .NET implementation. Swagger is used as the functional API specification, while the Node.js architecture, database models, validation, middleware, services, and controllers are implemented from scratch.

## Swagger

The original GreenEye API documentation is available through the project's Swagger/OpenAPI specification.
