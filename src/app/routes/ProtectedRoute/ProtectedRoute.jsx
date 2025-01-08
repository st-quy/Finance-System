import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ClusterOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import logo from "@assets/Images/stunited.png";
import { logout } from "@app/features/auth/authSlice";

const { Content, Sider, Header } = Layout;
export const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("access_token");
  const dataUser = useSelector((state) => state.auth.user);
  const dispatchAuth = useDispatch();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveKey = (path) => {
    const segments = path.split("/")[1];
    return segments;
  };

  const [activeKey, setActiveKey] = useState(getActiveKey(pathname));

  const changeTab = (key) => {
    setActiveKey(key);
    navigate(`/${key}`);
  };

  useEffect(() => {
    setActiveKey(getActiveKey(pathname));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    dispatchAuth(logout());
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth]);

  return (
    <Layout id="layout-container" className="h-screen">
      <Sider
        className="!bg-[#FFFFFF] z-10 p-4 font-medium [&_.ant-layout-sider-trigger]:!bg-[#b3b3b3] [&_.ant-layout-sider-trigger]:!left-0 [&_.ant-layout-sider-trigger]:!bottom-0  [&_.ant-layout-sider-trigger]:!text-white"
        collapsedWidth={100}
        breakpoint="lg"
      >
        <div className="flex justify-center items-center m-4 gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 cursor-pointer" />
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[activeKey]}
          className="!bg-transparent border-none [&_.ant-menu-item-selected]:!bg-[#F5F7F9] [&_.ant-menu-item]:!text-[#121212]"
          onClick={({ key }) => changeTab(key)}
          items={[
            {
              key: "overview",
              icon: <HomeOutlined className="!text-lg pr-2" />,
              label: "Overview",
            },
            {
              key: "projects",
              icon: <ClusterOutlined className="!text-lg pr-2" />,
              label: "Project",
            },
            // {
            //   key: "prediction",
            //   icon: <CodeSandboxOutlined className="!text-lg pr-2" />,
            //   label: "Predictions",
            // },
            // {
            //   key: "finance",
            //   icon: <AppstoreOutlined className="!text-lg pr-2" />,
            //   label: "Finance",
            // },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center p-4 shadow-md">
          {dataUser && <div>Welcome back, {dataUser.name || ""} </div>}
          <LogoutOutlined
            className="h-full cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          />
        </Header>
        <Content
          className={`m-4 p-6 overflow-auto !bg-none`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
