import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Page from "@/pages/page";
import NewUser from "@/pages/newUser";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import NotificationsPage from "@/pages/notifications";
import NewPatient from "./pages/newPatient";
import AreaList from "./pages/areaList";
import NewNotification from "./pages/newNotification";
import NewArea from "./pages/newArea";
import UserList from "./pages/userList";
import PatientList from "./pages/patientList";
import NewBanner from "./pages/newBanner";
import TestComponent from "./pages/testComponent";
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
      },
      {
        path: "area-list",
        element: <AreaList />,
      },
      {
        path: "new-notification",
        element: <NewNotification />,
      },
      {
        path: "new-area",
        element: <NewArea />,
      },
      {
        path: "user-list",
        element: <UserList />,
      },
      {
        path: "patient-list",
        element: <PatientList />,
      },
      {
        path: "new-banner",
        element: <NewBanner />,
      },
      {
        path: "test-component",
        element: <TestComponent />,
      },
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
