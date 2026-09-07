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
| `POST` | `/api/Authentication/register` | Register a new account |
| `POST` | `/api/Authentication/verify-otp` | Verify an OTP |
| `POST` | `/api/Authentication/login` | Login |
| `POST` | `/api/Authentication/resend-otp` | Resend OTP |
| `POST` | `/api/Authentication/forget-password` | Request password reset |
| `POST` | `/api/Authentication/reset-password` | Reset password |
| `POST` | `/api/Authentication/refresh-token` | Refresh authentication token |
| `POST` | `/api/Authentication/revoke-token` | Revoke authentication token |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/Cart` | Get current cart |
| `POST` | `/api/marketplace/Cart/add-items` | Add items to cart |
| `PUT` | `/api/marketplace/Cart/items/{cartItemId}` | Update a cart item |
| `DELETE` | `/api/marketplace/Cart/items/{cartItemId}` | Remove a cart item |
| `DELETE` | `/api/marketplace/Cart/clear` | Clear cart |

### Category

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplace/Category` | Get all categories |
| `POST` | `/api/marketplace/Category` | Create a category |
| `GET` | `/api/marketplace/Category/{id}` | Get a category by ID |
| `PUT` | `/api/marketplace/Category/{id}` | Update a category |
| `DELETE` | `/api/marketplace/Category/{id}` | Delete a category |

### Classification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Classification` | Get classification information/results |

### Comment

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Comment/add` | Add a comment |
| `GET` | `/api/Comment/post/{postId}` | Get comments for a post |
| `PUT` | `/api/Comment` | Update a comment |
| `DELETE` | `/api/Comment/{commentId}` | Delete a comment |

### Crop Disease

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/CropDisease` | Create/submit a crop disease detection |
| `GET` | `/api/CropDisease/history` | Get crop disease detection history |
| `DELETE` | `/api/CropDisease/delete-history/{id}` | Delete a disease history record |

### Crop Growth Simulation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/CropGrowthSimulation/simulate` | Run crop growth simulation |

### Crop Recommendation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/CropRecommendation/recommend` | Get crop recommendation |
| `GET` | `/api/CropRecommendation/history` | Get crop recommendation history |

### Forecasting

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Forecasting/forecast` | Get forecast |
| `GET` | `/api/Forecasting/my-forecasts` | Get user's forecasts |

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
| `POST` | `/api/marketplace/Order/create` | Create an order |
| `GET` | `/api/marketplace/Order/user/{userId}/orders` | Get orders for a specific user |
| `GET` | `/api/marketplace/Order/user/orders` | Get current user's orders |
| `GET` | `/api/marketplace/Order/{id}` | Get an order by ID |
| `POST` | `/api/marketplace/Order/{id}/cancel` | Cancel an order |
| `POST` | `/api/marketplace/Order/{id}/refund-order` | Refund an order |
| `POST` | `/api/marketplace/Order/stripe-webhook` | Handle Stripe webhook |

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
| `GET` | `/api/marketplace/Product/all-products` | Get all products |
| `GET` | `/api/marketplace/Product/product/{id}` | Get a product by ID |
| `GET` | `/api/marketplace/Product/category/{categoryId}` | Get products by category |
| `GET` | `/api/marketplace/Product/search` | Search products |
| `GET` | `/api/marketplace/Product/pricing-order` | Get products ordered by price |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Profile/{userId}` | Get a user profile |
| `PUT` | `/api/Profile/update` | Update current user's profile |
| `GET` | `/api/Profile/coins` | Get user's coins |
| `DELETE` | `/api/Profile/delete-account` | Delete current user's account |

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
- Zod
- JWT
- Multer
- CORS
- dotenv
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
npm start
```

## Project Goal

This repository is being built independently from the existing .NET implementation. Swagger is used as the functional API specification, while the Node.js architecture, database models, validation, middleware, services, and controllers are implemented from scratch.

## Swagger

The original GreenEye API documentation is available through the project's Swagger/OpenAPI specification.