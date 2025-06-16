import { useState } from "react";
import {
  Link,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import { AuthProvider } from "./auth-context";
import ProtectedRoute from "./components/ProtectedRoute";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import InfoPage from "./components/InfoPage";
import Box from "@mui/material/Box";

export function HydrateFallback() {
  return <p>Loading...</p>;
}
function AppLayout() {
  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ mt: 2 }}>
        {/* This is where nested routes will render */}
        <Outlet />
      </Box>
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />, // AppBar and menu always visible
      children: [
        {
          index: true,
          element: <InfoPage />,
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <InfoPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "caller",
          element: (
            <ProtectedRoute>
              <InfoPage />
            </ProtectedRoute>
          ),
          loader: async () => {
            return { data: await getData() };
          },
          hydrateFallbackElement: <HydrateFallback />,
        },
        {
          path: "about",
          element: <InfoPage />,
        },
        {
          path: "login",
          element: <Auth />,
        },
      ],
    },
  ]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
