import BaseButton from "@app/components/BaseButton/BaseButton";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl mt-4">Page Not Found</h2>
        <p className="mt-2 text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>
        <BaseButton
          type="primary"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Back To Home
        </BaseButton>
      </div>
    </div>
  );
};

export default NotFound;
