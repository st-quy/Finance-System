import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./main.css";
import router from "@app/providers/router";
import { Provider } from "react-redux";
import store from "@app/features/store";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </Provider>
);
