import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://leeward-free-bandana.glitch.me" }),
  tagTypes: ["Post",'User'],
  endpoints: (builder) => ({}),
});
