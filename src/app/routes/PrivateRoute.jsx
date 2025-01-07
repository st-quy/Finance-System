// import { lazy } from 'react';
import ProjectList from "@pages/Project/List/ProjectList.jsx";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute.jsx";
import Overview from "@pages/Overview/Overview.jsx";
const PrivateRoute = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "projects",
        element: <ProjectList />,
      },
    ],
  },
];

export default PrivateRoute;
