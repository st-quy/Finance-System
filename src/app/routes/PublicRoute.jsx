// Define public routes accessible to all users
import Login from "@pages/Login/Login";

const PublicRoute = [
  {
    path: "login",
    element: <Login />,
  },
];

export default PublicRoute;
