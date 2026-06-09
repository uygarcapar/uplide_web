import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import { productsApi } from "./slices/productsApi";
import { customersApi } from "./slices/customersApi";

export function makeStore() {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      [productsApi.reducerPath]: productsApi.reducer,
      [customersApi.reducerPath]: customersApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(productsApi.middleware, customersApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
