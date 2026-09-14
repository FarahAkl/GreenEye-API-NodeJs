import { axiosInstance } from "../../config/axios.js";
import {
  classificationResSchema,
  extractMLFeaturesResSchema,
  type locationReqT,
} from "../../schemas/ai.schema.js";
import { AppError } from "../../utils/appError.js";

export const classificationService = async (data: locationReqT) => {
  const featureExtractionApi = process.env.FEATURE_EXTRACTION_API;
  if (!featureExtractionApi) {
    throw new AppError("Feature extraction API is not configured", 500);
  }
  const featuresRes = await axiosInstance.post(featureExtractionApi, data);

  const validFeatureRes = extractMLFeaturesResSchema.safeParse(
    featuresRes.data,
  );
  if (!validFeatureRes.success)
    throw new AppError("Invalid response from feature extraction API", 502);

  const features = validFeatureRes.data.features;
  const predictionFeatures = Object.fromEntries(
    Object.entries(features).map(([key, value]) => [key, value ?? 0]),
  );

  const classificationApi = process.env.CLASSIFICATION_MODEL_API;
  if (!classificationApi) {
    throw new AppError("Classification API is not configured", 500);
  }

  const classificationRes = await axiosInstance.post(
    classificationApi,
    predictionFeatures,
  );

  const validClassificationRes = classificationResSchema.safeParse(
    classificationRes.data,
  );
  if (!validClassificationRes.success)
    throw new AppError("Invalid response from classification API", 502);

  return {
    message: "Desertification classification completed successfully",
    data: {
      ...validClassificationRes.data,
      land_features: { features },
      metadata: validFeatureRes.data.metadata,
    },
  };
};
