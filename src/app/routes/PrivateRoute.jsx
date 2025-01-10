// import { lazy } from 'react';
import ProjectList from "@pages/Project/List/ProjectList.jsx";
import ProjectCreate from "@pages/Project/Create/ProjectCreate.jsx";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute.jsx";
import Overview from "@pages/Overview/Overview.jsx";
import ProjectEdit from "@pages/Project/Edit/ProjectEdit.jsx";

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
        children: [
          {
            path: "",
            element: <ProjectList />,
          },
          {
            path: "create",
            element: <ProjectCreate />,
          },
          {
            path: "edit/:projectId",
            element: <ProjectEdit />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
