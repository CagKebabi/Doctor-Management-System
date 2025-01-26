import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Page from "@/pages/page";
import NewUser from "@/pages/newUser";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import NotificationsPage from "@/pages/notifications";
import NewPatient from "./pages/newPatient";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Page />,
      },
      {
        path: "new-user",
        element: <NewUser />,
      },
      {
        path: "new-patient",
        element: <NewPatient />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
