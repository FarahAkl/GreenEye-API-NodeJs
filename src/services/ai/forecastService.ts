import { axiosInstance } from "../../config/axios.js";
import {
  forecastingInputSchema,
  forecastResSchema,
  historyDataResSchema,
  type locationReqT,
} from "../../schemas/ai.schema.js";
import { AppError } from "../../utils/appError.js";

export const forecastService = async (data: locationReqT) => {
  const historyDataApi = process.env.HISTORY_DATA_API;
  if (!historyDataApi) {
    throw new AppError("History data API is not configured", 500);
  }
  const historyRes = await axiosInstance.post(historyDataApi, data);

  const validHistoryRes = historyDataResSchema.safeParse(historyRes.data);
  if (!validHistoryRes.success)
    throw new AppError("Invalid response from history data API", 502);

  const historyData = validHistoryRes.data;
  if (!historyData.success || historyData.features.length === 0) {
    throw new AppError(
      "Unable to retrieve historical data for the specified location",
      404,
    );
  }

  const forecastingInput = {
    data: historyData.features.map((feature) => ({
      metadata: {
        location_name:
          historyData.location_name ?? `${data.latitude},${data.longitude}`,
      },
      features: {
        year: feature.year,
        month: feature.month,
        ndvi: feature.ndvi,
        t2m_c: feature.t2m_c,
        td2m_c: feature.td2m_c,
        rh_pct: feature.rh_pct,
        tp_m: feature.tp_m,
        ssrd_jm2: feature.ssrd_jm2,
        sand: feature.sand,
        silt: feature.silt,
        clay: feature.clay,
        soc: feature.soc,
        ph: feature.ph,
        bdod: feature.bdod,
        cec: feature.cec,
        nitrogen: feature.nitrogen,
        phosphorus: feature.phosphorus,
        potassium: feature.potassium,
        lc_type1: feature.lc_type1,
      },
    })),
  };

  const validForecastingInput =
    forecastingInputSchema.safeParse(forecastingInput);

  if (!validForecastingInput.success) {
    throw new AppError("Invalid forecasting input", 500);
  }

  const forecastApi = process.env.FORECASTING_MODEL_API;
  if (!forecastApi) {
    throw new AppError("Forecast API is not configured", 500);
  }

  const forecastRes = await axiosInstance.post(
    forecastApi,
    validForecastingInput.data,
  );

  const validForecastRes = forecastResSchema.safeParse(forecastRes.data);
  if (!validForecastRes.success)
    throw new AppError("Invalid response from forecast API", 502);

  return {
    message: "Desertification forecast completed successfully",
    data: {
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        name: historyData.location_name,
      },
      forecast: validForecastRes.data.forecast,
    },
  };
};
