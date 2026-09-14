import z from "zod";

export const locationReqSchema = z.object({
  longitude: z.string(),
  latitude: z.string(),
});

export const desertificationFeaturesSchema = z.object({
  year: z.number().nullable(),
  month: z.number().nullable(),
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

export type locationReqT = z.infer<typeof locationReqSchema>;

export type DesertificationFeaturesT = z.infer<
  typeof desertificationFeaturesSchema
>;
