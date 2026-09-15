import { axiosInstance } from "../../config/axios.js";
import { cropRecommendation } from "../../models/cropRecommendation.model.js";
import {
  extractMLFeaturesResSchema,
  recommendationResSchema,
  type locationReqT,
} from "../../schemas/ai.schema.js";
import type { AuthPayload } from "../../types/auth.js";
import { AppError } from "../../utils/appError.js";

export const recommendationService = async ({
  data,
  user,
}: {
  data: locationReqT;
  user: AuthPayload;
}) => {
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

  const recommendationApi = process.env.CROP_RECOMMENDATION_API;
  if (!recommendationApi) {
    throw new AppError("Recommendation API is not configured", 500);
  }

  const recommendationRes = await axiosInstance.post(
    recommendationApi,
    features,
  );

  const validRecommendationRes = recommendationResSchema.safeParse(
    recommendationRes.data,
  );
  if (!validRecommendationRes.success)
    throw new AppError("Invalid response from recommendation API", 502);

  await cropRecommendation.create({
    ...data,
    userId: user.id,
    crops: validRecommendationRes.data,
    locationName: validFeatureRes.data.metadata.location_name,
  });

  return {
    message: "Recommendation completed successfully",
    data: {
      crops: validRecommendationRes.data,
    },
  };
};
