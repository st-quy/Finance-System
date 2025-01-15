// import { lazy } from 'react';
import ProjectList from "@pages/Project/List/ProjectList.jsx";
import ProjectCreate from "@pages/Project/Create/ProjectCreate.jsx";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute.jsx";
import Overview from "@pages/Overview/Overview.jsx";
import ProjectEdit from "@pages/Project/Edit/ProjectEdit.jsx";
import ProjectDetail from "@pages/ProjectDetail/ProjectDetail.jsx";
import Report from "@pages/ProjectDetail/ReportGenerator/report.jsx";

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
          {
            path: "detail/:projectId",
            element: <ProjectDetail />,
          },
          {
            path: "report/:projectId",
            element: <Report />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
