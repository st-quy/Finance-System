import PublicRoute from "@app/routes/PublicRoute";
import PrivateRoute from "@app/routes/PrivateRoute";
import NotFound from "@pages/NotFound/NotFound";
import { Outlet, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [...PublicRoute, ...PrivateRoute],
  },
]);

export default router;
