import mongoose from "mongoose";

const cropRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    crops: {
      type: Object,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const cropRecommendation = mongoose.model(
  "cropRecommendation",
  cropRecommendationSchema,
);
