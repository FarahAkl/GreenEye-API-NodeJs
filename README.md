# GreenEye API — Node.js

Backend API reimplementation of the GreenEye agricultural platform using Node.js, Express, TypeScript, MongoDB, Mongoose, and Zod.

> **API Reference:** The endpoint list below is based on the GreenEye OpenAPI/Swagger specification. Exact request bodies, query parameters, response schemas, and authorization requirements should be checked against the Swagger specification.

## Endpoints (101)

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Admin/all-pending-users` | Get all pending users |
| `PUT` | `/api/Admin/user/{userId}/approve` | Approve a pending user |
| `PUT` | `/api/Admin/user/{userId}/reject` | Reject a pending user |
| `GET` | `/api/Admin/all-pending-withdrawal-request` | Get all pending withdrawal requests |
| `PUT` | `/api/Admin/withdrawal-request/{withdrawalRequestId}/approve` | Approve a withdrawal request |
| `PUT` | `/api/Admin/withdrawal-request/{withdrawalRequestId}/reject` | Reject a withdrawal request |
| `GET` | `/api/Admin/all-pending-products` | Get all pending products |
| `PUT` | `/api/Admin/product/{productId}/approve` | Approve a product |
| `PUT` | `/api/Admin/product/{productId}/reject` | Reject a product |
| `GET` | `/api/Admin/all-users` | Get all users |
| `GET` | `/api/Admin/products-count` | Get products count |
| `GET` | `/api/Admin/orders-count` | Get orders count |
| `POST` | `/api/Admin/change-role` | Change a user's role |
| `POST` | `/api/Admin/freeze-user` | Freeze a user |
| `POST` | `/api/Admin/unfreeze-user` | Unfreeze a user |
| `GET` | `/api/Admin/product-updates/pending` | Get pending product update requests |
| `GET` | `/api/Admin/product/{requestId}/update-details` | Get product update request details |
| `PUT` | `/api/Admin/product-updates/{requestId}/approve` | Approve a product update request |
| `PUT` | `/api/Admin/product-updates/{requestId}/reject` | Reject a product update request |

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
| `PUT` | `/api/marketplace/cart/items/{cartItemId}` | Update a cart item |
| `DELETE` | `/api/marketplace/cart/items/{cartItemId}` | Remove a cart item |
| `DELETE` | `/api/marketplace/cart` | Clear cart |

### Category

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/category` | Get all categories |
| `POST` | `/api/marketplace/category` | Create a category |
| `GET` | `/api/marketplace/category/:categoryId` | Get a category by ID |
| `PUT` | `/api/marketplace/category/:categoryId` | Update a category |
| `DELETE` | `/api/marketplace/category/:categoryId` | Delete a category |

### Comment

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Comment/add` | Add a comment |
| `GET` | `/api/Comment/post/{postId}` | Get comments for a post |
| `PUT` | `/api/Comment` | Update a comment |
| `DELETE` | `/api/Comment/{commentId}` | Delete a comment |Description |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Notifications` | Get notifications |
| `GET` | `/api/Notifications/unread-count` | Get unread notification count |
| `POST` | `/api/Notifications/mark-as-read/{id}` | Mark a notification as read |
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
| `GET` | `/api/Post/{id}` | Get a post by ID |
| `DELETE` | `/api/Post` | Delete a post |
| `POST` | `/api/Post/{id}/like` | Like/unlike a post |
| `POST` | `/api/Post/{id}/favorite` | Add/remove a post from favorites |
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
| `GET` | `/api/marketplace/product/{id}` | Get a product by ID |

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
| `GET` | `/api/marketplace/Review/product/{productId}` | Get reviews for a product |

### Shipping

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Shipping/shipping-rate` | Get shipping rates |
| `POST` | `/api/Shipping/shippo-webhook` | Handle Shippo webhook |
| `GET` | `/api/Shipping/order/{orderId}/shipment-info` | Get shipment information for an order |

### Supplier

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Supplier/supplier/{supplierId}/products` | Get supplier products |
| `POST` | `/api/Supplier/add-products` | Add supplier products |
| `PUT` | `/api/Supplier/product/{productId}/update` | Update a supplier product |
| `DELETE` | `/api/Supplier/product/{productId}` | Delete a supplier product |
| `GET` | `/api/Supplier/{supplierId}/products-in-orders` | Get supplier products included in orders |
| `GET` | `/api/Supplier/products-in-orders` | Get current supplier's products included in orders |
| `GET` | `/api/Supplier/profits/{supplierId}` | Get supplier profits |

### User Activity

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/UserActivity/timeline` | Get user activity timeline |
| `GET` | `/api/UserActivity/{id}` | Get an activity by ID |
| `DELETE` | `/api/UserActivity/{id}` | Delete an activity |
| `DELETE` | `/api/UserActivity/all` | Delete all user activities |

### Wallet

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Wallet/all-wallets` | Get all wallets |
| `GET` | `/api/Wallet/supplier/{supplierId}` | Get supplier wallet |
| `GET` | `/api/Wallet/supplier/wallet` | Get current supplier wallet |
| `GET` | `/api/Wallet/{walletId}/transactions` | Get wallet transactions |
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