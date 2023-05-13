import { configureStore,  } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

  },

  //the use of RTK Query with the store require a middleware:
  //getDefaultMiddleware : default with redux
  //apiSlice.middleware: manages cache lifetimes and expirations and it is required to use it
  // when we're using RTK Query and Api Slice
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
