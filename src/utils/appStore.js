import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";

// 1. Import Redux Persist modules
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage

// 2. Define the configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Optional: Define which slices to persist (e.g., maybe you don't want to save errors)
  // whitelist: ["user", "feed"],
};

// 3. Combine your reducers into one root reducer
const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  connection: connectionReducer,
  request: requestReducer,
});

// 4. Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer here
  // 5. Middleware fix: Ignore redux-persist actions to prevent "non-serializable" errors
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// 6. Export the persistor
export const persistor = persistStore(store);
export default store;
