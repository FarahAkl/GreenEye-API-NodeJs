import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    productionDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const product = mongoose.model("Product", productSchema);
