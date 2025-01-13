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
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const { Content, Sider, Header } = Layout;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyChF_XTD-wbh3VSQjGwqK7a9tLZWD7x7SA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Initialize Supabase client
const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
const supabase = createClient(supabaseUrl, supabaseKey);

// Database Schema for AI
const databaseSchema = `
-- ENUM Types
CREATE TYPE user_role AS ENUM ('Project Manager', 'Finance Staff', 'Management');
CREATE TYPE expense_category AS ENUM ('Personnel', 'Technology', 'Marketing', 'Operations');
CREATE TYPE alert_type AS ENUM ('Budget Overrun', 'Payment Reminder');

-- User Table
CREATE TABLE "User" (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role user_role NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Project Table
CREATE TABLE Project (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(200) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  project_value INT8 NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "User" (user_id) ON DELETE CASCADE
);

-- Budget Table
CREATE TABLE Budget (
  budget_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  total_budget DECIMAL(18, 2) NOT NULL,
  allocated_to_personnel DECIMAL(18, 2),
  allocated_to_technology DECIMAL(18, 2),
  allocated_to_operations DECIMAL(18, 2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE
);

-- Expense Table
CREATE TABLE Expense (
  expense_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  expense_date DATE NOT NULL,
  category expense_category NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  description TEXT,
  FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE
);

-- Report Table
CREATE TABLE Report (
  report_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  generated_date DATE NOT NULL,
  total_revenue DECIMAL(18, 2),
  total_expenses DECIMAL(18, 2),
  net_profit DECIMAL(18, 2),
  FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE
);

-- Alert Table
CREATE TABLE Alert (
  alert_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT,
  alert_type alert_type NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES "User" (user_id) ON DELETE SET NULL
);
`;


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

  const sendMessageToGoogleAI = async (message) => {
    setIsLoading(true); // Set loading state to true
    try {
      // Step 1: Google AI에게 질문을 SQL 쿼리로 변환 요청
      const aiPrompt = `
      Here is the database schema you need to reference:
      
      ${databaseSchema}
      
      User Query:
      ${message}
      
      Based on the schema above, generate a PostgreSQL query that answers the user's question. The query should return results in the following JSON format:

      Example for: "Please show me the name of the project you are managing and the total cost"
      SELECT json_agg(
          json_build_object(
              'project_name', aggregated.project_name,
              'total_expense', aggregated.total_expense
          )) AS result
      FROM (
          SELECT 
              p.project_name, 
              SUM(e.amount) AS total_expense
          FROM 
              Project p
          JOIN 
              Expense e ON p.project_id = e.project_id
          WHERE 
              p.user_id = (SELECT user_id FROM "User" WHERE email = 'user1@example.com')
          GROUP BY 
              p.project_name
      ) AS aggregated;

      Example for: "Which project has the highest total expenses?"
      SELECT json_agg(
          json_build_object(
              'project_name', p.project_name,
              'total_expense', total_expense
          )
      ) AS result
      FROM (
          SELECT 
              p.project_name, 
              SUM(e.amount) AS total_expense,
              RANK() OVER (ORDER BY SUM(e.amount) DESC) as expense_rank
          FROM 
              Project p
          JOIN 
              Expense e ON p.project_id = e.project_id
          GROUP BY 
              p.project_name
          ORDER BY expense_rank ASC
          LIMIT 1
      ) AS p;

      Note: The email 'user1@example.com' is fixed and should always be used for generating the query.
    `;

  
      const { response } = await model.generateContent(aiPrompt);
      let generatedSQL =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  
      // Step 1.1: SQL 쿼리에서 Markdown 코드 블록 제거
      generatedSQL = generatedSQL.replace(/```sql|```/g, "").trim();
  
      // Step 1.2: SQL 쿼리에서 "json " 또는 "JSON " 키워드 제거
      const jsonRegex = /^\s*json\s+/i; // "json" 키워드와 공백 허용
      if (jsonRegex.test(generatedSQL)) {
        generatedSQL = generatedSQL.replace(jsonRegex, "").trim();
      }
  
      console.log("Sanitized SQL Query:", generatedSQL);
  
      const botReplySQL = {
        sender: "bot",
        content: `Generated SQL: ${generatedSQL}`,
      };
    
  
      // Step 2: Supabase에서 SQL 쿼리 실행
      const queryResult = await executeSQLQuery(generatedSQL);
  
      // Step 3: Supabase 결과와 원래 질문을 Google AI에 다시 전달
      const refinedMessage = `${message}. Additionally, please remove any references to user email like 'user1@example.com' in the response. This is an example answer. Here is a summary of the project and its total cost:\nThe following projects have been identified with the relevant costs:\n Project 34: $9151.46 \n Project 47: $9583.62 \n Project 30: $11153.02 \n`;
      const naturalLanguageResult = await generateNaturalLanguageResponse(refinedMessage, queryResult);
  
      // Step 4: 결과를 사용자에게 표시 (프로젝트 관리자 정보 제거)
      const refinedResult = naturalLanguageResult.replace(/, managed by [^,]+, /, ', ');
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: refinedResult },
      ]);
    } catch (error) {
      console.error("Error processing query:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setIsLoading(false); // Set loading state to false after response
    }
  };
  
  const executeSQLQuery = async (query) => {
    try {
      // 세미콜론 제거
      const sanitizedQuery = query.replace(/;/g, '');
      console.log("Executing SQL Query:", sanitizedQuery);
  
      const { data, error } = await supabase.rpc("execute_query", { query: sanitizedQuery });
  
      if (error) {
        console.error("Supabase RPC Error:", error);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: `Error executing query: ${error.message}` },
        ]);
        return [{ error: `Supabase Error: ${error.message}` }];
      }
  
      if (!data || data.length === 0) {
        console.warn("Query executed but returned no results.");
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: "Query executed successfully but returned no results." },
        ]);
        return [{ error: "No results found." }];
      }
  
      console.log("Supabase Query Result:", data);
      return data;
    } catch (err) {
      console.error("Unexpected Error:", err);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: `Unexpected error occurred: ${err.message}` },
      ]);
      return [{ error: "Unexpected error occurred while executing query." }];
    }
  };
  
  const generateNaturalLanguageResponse = async (originalQuestion, queryResult) => {
    try {
      const context = `Question: ${originalQuestion}\n\nQuery Result: ${JSON.stringify(queryResult, null, 2)}\n\nGenerate a natural language response based on the question and query result.`;
      const { response } = await model.generateContent(context);
  
      const naturalLanguageText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  
      return naturalLanguageText;
    } catch (error) {
      console.error("Error generating natural language response:", error);
      return "Sorry, I couldn't generate a natural language response.";
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
          className={`m-4 p-6 overflow-auto  ${activeKey === "overview" ? "bg-none" : "bg-white rounded-xl shadow-xl"}`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
