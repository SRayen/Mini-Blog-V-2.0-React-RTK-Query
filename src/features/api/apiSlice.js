import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://honored-spiffy-mum.glitch.me" }),
  tagTypes: ["Post",'User'],
  endpoints: (builder) => ({}),
});
