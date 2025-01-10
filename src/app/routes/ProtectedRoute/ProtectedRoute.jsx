import { Layout, Menu, Affix, Button, Input, Skeleton } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ClusterOutlined,
  LogoutOutlined,
  OpenAIOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import logo from "@assets/Images/stunited.png";
import { logout } from "@app/features/auth/authSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Content, Sider, Header } = Layout;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyChF_XTD-wbh3VSQjGwqK7a9tLZWD7x7SA");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("access_token");
  const dataUser = useSelector((state) => state.auth.user);
  const dispatchAuth = useDispatch();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveKey = (path) => path.split("/")[1];

  const [activeKey, setActiveKey] = useState(getActiveKey(pathname));
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

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

  const sendMessageToGoogleAI = async (message) => {
    setIsLoading(true); // Set loading state to true
    try {
      const { response } = await model.generateContent(message);

      const generatedText =
        response?.candidates?.[0].content.parts?.[0].text ||
        "No response received.";

      const botReply = {
        sender: "bot",
        content: generatedText,
      };

      setChatMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error communicating with Google Generative AI:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setIsLoading(false); // Set loading state to false after response
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", content: userInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    const userQuery = userInput; // Preserve the user query for history
    setUserInput("");

    await sendMessageToGoogleAI(userQuery);
  };

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
          onClick={({ key }) => changeTab(key)}
          className="!bg-transparent border-none [&_.ant-menu-item-selected]:!bg-[#F5F7F9] [&_.ant-menu-item]:!text-[#121212]"
          items={[
            { key: "overview", icon: <HomeOutlined />, label: "Overview" },
            { key: "projects", icon: <ClusterOutlined />, label: "Project" },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center p-4 shadow-md">
          {dataUser && <div>Welcome back, {dataUser.name || ""}</div>}
          <LogoutOutlined
            className="cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          />
        </Header>
        <Content
          className={`m-4 p-6 overflow-auto !bg-none`}
        >
          <Outlet />
        </Content>
        <Affix style={{ position: "fixed", bottom: 16, right: 16 }}>
          <Button
            type="primary"
            shape="circle"
            icon={<OpenAIOutlined />}
            size="large"
            onClick={() => setChatbotVisible(!chatbotVisible)}
          />
        </Affix>
        {chatbotVisible && (
          <div
            className="fixed bottom-20 right-16 bg-white shadow-lg rounded-lg p-4 flex flex-col"
            style={{ width: "300px", height: "400px" }}
          >
            <h3 className="text-center mb-4">Google AI Chatbot</h3>
            <div
              className="overflow-auto flex-1"
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              {/* Show skeleton loading if isLoading is true */}
              {isLoading && (
                <div className="text-left">
                  <Skeleton active title={false} paragraph={{ rows: 1 }} />
                </div>
              )}
            </div>
            <Input.Search
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onSearch={handleSendMessage}
              placeholder="Type a message..."
              enterButton="Send"
            />
          </div>
        )}
      </Layout>
    </Layout>
  );
};
