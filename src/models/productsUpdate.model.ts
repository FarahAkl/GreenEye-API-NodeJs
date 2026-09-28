import mongoose from "mongoose";

const productUpdatesSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    categoryId: {
      type: String,
    },
    images: {
      type: [String],
    },
    productionDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const productUpdates = mongoose.model(
  "ProductUpdates",
  productUpdatesSchema,
);
