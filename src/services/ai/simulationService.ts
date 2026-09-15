import { axiosInstance } from "../../config/axios.js";
import {
  extractMLFeaturesResSchema,
  simulationResSchema,
  type simulationReqT,
} from "../../schemas/ai.schema.js";
import { AppError } from "../../utils/appError.js";

export const simulationService = async (data: simulationReqT) => {
  const featureExtractionApi = process.env.FEATURE_EXTRACTION_API;
  if (!featureExtractionApi) {
    throw new AppError("Feature extraction API is not configured", 500);
  }
  const featuresRes = await axiosInstance.post(featureExtractionApi, {
    longitude: data.longitude,
    latitude: data.latitude,
  });

  const validFeatureRes = extractMLFeaturesResSchema.safeParse(
    featuresRes.data,
  );
  if (!validFeatureRes.success)
    throw new AppError("Invalid response from feature extraction API", 502);

  const features = validFeatureRes.data.features;
  const predictionFeatures = Object.fromEntries(
    Object.entries(features).map(([key, value]) => [key, value ?? 0]),
  );

  const simulationApi = process.env.SIMULATION_MODEL_API;
  if (!simulationApi) {
    throw new AppError("Crop growth simulation API is not configured", 500);
  }

  const simulationRes = await axiosInstance.post(simulationApi, {
    crop_name: data.cropName,
    features: predictionFeatures,
  });

  const validSimulationRes = simulationResSchema.safeParse(simulationRes.data);
  if (!validSimulationRes.success)
    throw new AppError("Invalid response from crop growth simulation API", 502);

  return {
    message: "Crop growth simulation completed successfully",
    data: validSimulationRes.data,
  };
};
