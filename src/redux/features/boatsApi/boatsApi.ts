import { baseApi } from '@/redux/api/baseApi';

export interface BoatEngine {
  Make: string | null;
  Model: string | null;
  Fuel: string | null;
  EnginePower: string | null;
  Type: string | null;
  Year: string | null;
  Hours: number | null;
}

export interface Boat {
  DocumentID: string;
  MakeString: string;
  ModelYear: number;
  Model: string;
  Price: string;
  NominalLength: string;
  LengthOverall: string;
  BeamMeasure: string;
  TotalEnginePowerQuantity: string;
  BoatLocation: {
    BoatCityName: string;
    BoatCountryID: string;
    BoatStateCode: string;
  };
  Engines: BoatEngine[];
  Images: { Uri: string; Caption: string | null } | null;
  LastModificationDate: string;
  FuelTankCapacityMeasure?: string | null;
  GeneralBoatDescription?: string[];
  ItemReceivedDate?: string | null;
}

export interface BoatsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface BoatsResponse {
  success: boolean;
  data: Boat[];
  metadata: BoatsMeta;
}

const boatsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBoatsComBoats: build.query<
      BoatsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: '/boats-com/ai',
        params: { page, limit },
      }),
    }),

    getYachtBrokerBoats: build.query<
      BoatsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: '/yachtbroker/ai',
        params: { page, limit },
      }),
    }),
  }),
});

export const { useGetBoatsComBoatsQuery, useGetYachtBrokerBoatsQuery } =
  boatsApi;
