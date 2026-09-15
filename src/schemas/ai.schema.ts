import z from "zod";

export const locationReqSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
});

export const desertificationFeaturesSchema = z.object({
  year: z.number().nullable(),
  month: z.number().nullable(),
  timestamp: z.string().optional(),
  location_name: z.string().optional(),
  sand: z.number().nullable(),
  silt: z.number().nullable(),
  clay: z.number().nullable(),
  soc: z.number().nullable(),
  ph: z.number().nullable(),
  bdod: z.number().nullable(),
  cec: z.number().nullable(),
  ndvi: z.number().nullable(),
  t2m_c: z.number().nullable(),
  td2m_c: z.number().nullable(),
  rh_pct: z.number().nullable(),
  tp_m: z.number().nullable(),
  ssrd_jm2: z.number().nullable(),
  lc_type1: z.number().nullable(),
  nitrogen: z.number().nullable(),
  phosphorus: z.number().nullable(),
  potassium: z.number().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  data_quality: z.number().optional(),
});

export const extractMLFeaturesResSchema = z.object({
  success: z.boolean(),
  features: desertificationFeaturesSchema,
  metadata: z.object({
    location_name: z.string(),
    query_timestamp: z.string(),
    data_quality: z.number(),
    soil_retrieval_method: z.string(),
    npk_confidence: z.string(),
    ndvi_source: z.string(),
    lc_source: z.string(),
  }),
});

export const classificationResSchema = z.object({
  prediction: z.object({
    desertification_level: z.string(),
    confidence: z.number(),
  }),
});

export const historyDataResSchema = z.object({
  success: z.boolean(),
  total_samples: z.number(),
  location_name: z.string(),
  features: z.array(desertificationFeaturesSchema),
  metadata: z.object({
    latitude: z.number(),
    longitude: z.number(),
    location_name: z.string(),
    timeframe: z.object({
      start_date: z.string(),
      end_date: z.string(),
      months_count: z.number(),
      note: z.string(),
      location: z.string(),
    }),
    soil_method: z.string(),
    weather_method: z.string(),
    npk_method: z.string(),
    bdod_included: z.boolean(),
    note: z.string(),
  }),
});

export const forecastingFeaturesSchema = z.object({
  year: z.number().nullable(),
  month: z.number().nullable(),
  ndvi: z.number().nullable(),
  t2m_c: z.number().nullable(),
  td2m_c: z.number().nullable(),
  rh_pct: z.number().nullable(),
  tp_m: z.number().nullable(),
  ssrd_jm2: z.number().nullable(),
  sand: z.number().nullable(),
  silt: z.number().nullable(),
  clay: z.number().nullable(),
  soc: z.number().nullable(),
  ph: z.number().nullable(),
  bdod: z.number().nullable(),
  cec: z.number().nullable(),
  nitrogen: z.number().nullable(),
  phosphorus: z.number().nullable(),
  potassium: z.number().nullable(),
  lc_type1: z.number().nullable(),
});

export const forecastingInputSchema = z.object({
  data: z.array(
    z.object({
      metadata: z.object({
        location_name: z.string(),
      }),
      features: forecastingFeaturesSchema,
    }),
  ),
});

export const forecastItemSchema = z.object({
  year: z.number(),
  month: z.number(),
  ndvi: z.number(),
  t2m_c: z.number(),
  td2m_c: z.number(),
  rh_pct: z.number(),
  tp_m: z.number(),
  ssrd_jm2: z.number(),
  risk_level: z.string(),
  risk_confidence: z.number(),
});

export const forecastResSchema = z.object({
  success: z.boolean(),
  forecast: z.array(forecastItemSchema),
});

export type locationReqT = z.infer<typeof locationReqSchema>;

export type DesertificationFeaturesT = z.infer<
  typeof desertificationFeaturesSchema
>;

export type ForecastingInputT = z.infer<typeof forecastingInputSchema>;

export type ForecastT = z.infer<typeof forecastResSchema>;
