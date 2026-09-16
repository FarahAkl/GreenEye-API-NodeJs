import mongoose from "mongoose";

const plantDiseaseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    plantImage: {
      type: String,
      required: true,
    },
    plantDisease: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    cause: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const plantDiseaseModel = mongoose.model("plantDisease", plantDiseaseSchema);
