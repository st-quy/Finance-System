import { useEffect } from "react";
import { Row, Col, Typography } from "antd";
import BaseButton from "@app/components/BaseButton/BaseButton";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@app/configs/firebase";
import { ACCESS_TOKEN } from "@app/constants/auth";
import { setStorageData } from "@app/configs/storage";
import { Toast } from "@app/components/Notification/Notification";
import { login } from "@app/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem(ACCESS_TOKEN);
  const dispatchAuth = useDispatch();

  useEffect(() => {
    if (isAuth) {
      navigate("/overview");
    }
  }, [isAuth, navigate]);

  const signInwithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;
      setStorageData(ACCESS_TOKEN, user.accessToken);
      navigate("/overview");
      Toast("success", "Logged in successfully");
      dispatchAuth(login());
    });
  };

  return (
    <div className="h-screen">
      <Row gutter={0} className="h-screen">
        <Col
          xs={0}
          sm={0}
          md={12}
          lg={16}
          xl={16}
          className="h-full text-center items-center content-center pl-6 !bg-[#F4F5FA] "
        >
          <img
            className="max-w-full object-contain"
            src="https://demos.themeselection.com/materio-html-django-admin-template/demo-1/static/img/illustrations/auth-cover-login-illustration-light.png"
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={8}
          className="flex flex-col justify-center !px-20"
        >
          <Typography.Title level={2} className="!mb-4 text-center">
            Welcome Back 🎉
          </Typography.Title>
          <div className="space-y-4">
            <BaseButton
              className="flex items-center justify-center hover:!text-black hover:!border-gray-800"
              onClick={signInwithGoogle}
            >
              <img
                className="w-5 h-5"
                src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                alt="gg-icon"
              />
              Sign in with Google
            </BaseButton>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
