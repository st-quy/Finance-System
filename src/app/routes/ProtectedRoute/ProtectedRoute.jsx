import {
  Layout,
  Menu,
  Affix,
  Button,
  Input,
  Skeleton,
  Drawer,
  Divider,
} from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ClusterOutlined,
  LogoutOutlined,
  OpenAIOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import logo from "@assets/Images/logo.png";
import { logout } from "@app/features/auth/authSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

import { createClient } from "@supabase/supabase-js";

const { Content, Sider, Header } = Layout;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyAkT139KfdEYt7_vB55ecSDUlVlNS6Tyxo");
const sqlModel = genAI.getGenerativeModel({
  model: "tunedModels/chatbotprompt-lt2p15q1s20p",
});
const nlpModel = genAI.getGenerativeModel({
  model: "tunedModels/naturallanguageprompt-12kpz8gmrbb0",
});

// Initialize Supabase client
const supabaseUrl = "https://vsmbidgenzscyzgxgede.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbWJpZGdlbnpzY3l6Z3hnZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDY3OTAsImV4cCI6MjA1MTM4Mjc5MH0.mJqtmjFDArnBy3dUFDS2hjyt8aXEf2WAMjOBbmVVAAo";
const supabase = createClient(supabaseUrl, supabaseKey);

// Database Schema for AI
const databaseSchema = `
1. ENUM Types:
user_role: Represents the role of a user.
Values: 'Project Manager', 'Finance Staff', 'Management'.
expense_category: Categorizes expenses.
Values: 'Personnel', 'Technology', 'Marketing', 'Operations'.
alert_type: Defines types of alerts.
Values: 'Budget Overrun', 'Payment Reminder'.
2. Tables:
a. User:
Primary Key: user_id (auto-incremented).
Fields:
name: User's full name.
role: User role (user_role ENUM).
email: Unique email for login/notifications.
b. Project:
Primary Key: project_id (auto-incremented).
Fields:
project_name: Name of the project.
project_value: Monetary value of the project, or revenue from the project.
project_type: Category of the project (Construction, Research, Marketing, Education, Software).
start_date: Project start date.
end_date: (Optional) Project end date.
user_id: References the managing user (User table).
Foreign Key:
user_id: Cascades on delete.
c. Budget:
Primary Key: budget_id (auto-incremented).
Fields:
project_id: References the associated project.
total_budget: Total allocated budget.
Allocations: allocated_to_personnel, allocated_to_technology, allocated_to_operations.
updated_at: Last updated timestamp.
Foreign Key:
project_id: Cascades on delete.
d. Expense:
Primary Key: expense_id (auto-incremented).
Fields:
project_id: References the associated project.
expense_date: Date of the expense.
category: Expense category (expense_category ENUM).
amount: Expense amount.
description: (Optional) Expense details.
Foreign Key:
project_id: Cascades on delete.
e. Report:
Primary Key: report_id (auto-incremented).
Fields:
project_id: References the associated project.
generated_date: Report generation date.
Financial data: total_revenue, total_expenses, net_profit.
Foreign Key:
project_id: Cascades on delete.
f. Alert:
Primary Key: alert_id (auto-incremented).
Fields:
project_id: References the associated project.
user_id: (Optional) References the alert recipient (User table).
alert_type: Type of alert (alert_type ENUM).
message: Content of the alert.
created_at: Alert creation timestamp.
Foreign Keys:
project_id: Cascades on delete.
user_id: Sets to NULL on delete.
Relationships:
User ↔ Project: A user manages multiple projects.
Project ↔ Budget: Each project has a budget.
Project ↔ Expense: Projects have multiple expenses.
Project ↔ Report: Financial reports are tied to projects.
Project, User ↔ Alert: Alerts are linked to projects and optionally to users.
`;

export const ProtectedRoute = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when chatMessages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const isAuth = localStorage.getItem("access_token");
  const dataUser = useSelector((state) => state.auth.user);
  const dispatchAuth = useDispatch();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveKey = (path) => path.split("/")[1];

  const [activeKey, setActiveKey] = useState(getActiveKey(pathname));
  const [chatbotVisible, setChatbotVisible] = useState(false);
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
      // Step 1: Google AI에게 질문을 SQL 쿼리로 변환 요청
      const aiPrompt = `
      Here is the database schema you need to reference:
      
      ${databaseSchema}
      
      User Query:
      ${message}
      
      Based on the schema above, generate a PostgreSQL query that answers the user's question. The query should return results in the following JSON format:

      Example for question: "What is the profit for the current month?"
      SELECT json_build_object(
      'total_project_value', COALESCE(total_project_value, 0),
      'total_expense', COALESCE(total_expense, 0),
      'profit', COALESCE(total_project_value, 0) - COALESCE(total_expense, 0)
      ) AS result
      FROM (
      SELECT 
        SUM(CASE 
                WHEN EXTRACT(MONTH FROM p.start_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
                AND EXTRACT(YEAR FROM p.start_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                THEN p.project_value 
                ELSE 0 
            END) AS total_project_value,
        SUM(CASE 
                WHEN EXTRACT(MONTH FROM e.expense_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
                AND EXTRACT(YEAR FROM e.expense_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
                THEN e.amount 
                ELSE 0 
            END) AS total_expense
    FROM 
        project p
    LEFT JOIN 
        expense e ON p.project_id = e.project_id
) AS summary;

      Example for question: "Which project has the highest total expenses?"
      Expected result:
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
              project p
          JOIN 
              expense e ON p.project_id = e.project_id
          GROUP BY 
              p.project_name
          ORDER BY expense_rank ASC
          LIMIT 1
      ) AS p;

      Rules:
      Remember that your output will be posted directly to the database API so don't add any more characters rather than SQL queries.
      If the user asks about something unrelated to the database, use your knowledge and NLP to answer the question!

      Note: The email 'user1@example.com' is fixed and you only need to give us information related to this user.
    `;


      const { response } = await sqlModel.generateContent({
        contents: [
          ...chatMessages.map((msg) => {
            return {
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            };
          }),
          { role: "user", parts: [{ text: aiPrompt }] },
        ],
      });


      let generatedSQL =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";

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

      if (queryResult.isDirectAnswer) {
        // If it's a direct answer, just display it
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: queryResult.result },
        ]);
      } else {
        // If it's a SQL result, process it through natural language generation
        const refinedMessage = `${message}. Additionally, please remove any references to user email like 'user1@example.com' in the response. This is an example answer. Here is a summary of the project and its total cost: The following projects have been identified with the relevant costs: Project 34: $9151.46, Project 47: $9583.62, Project 30: $11153.02.`;
        const naturalLanguageResult = await generateNaturalLanguageResponse(
          refinedMessage,
          queryResult.result
        );
        const refinedResult = naturalLanguageResult.replace(
          /, managed by [^,]+, /,
          ", "
        );
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: refinedResult },
        ]);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false); // Set loading state to false after response
    }
  };

  const executeSQLQuery = async (query) => {
    try {
      const sanitizedQuery = query.replace(/;/g, "");
      console.log("Executing SQL Query:", sanitizedQuery);

      const { data, error } = await supabase.rpc("execute_query", {
        query: sanitizedQuery,
      });

      if (error) {
        console.error("Supabase RPC Error:", error);
        // If SQL query fails, try to get a direct answer from nlpModel

        const { response } = await nlpModel.generateContent({
          contents: [
            ...chatMessages.map((msg) => {
              return {
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
              };
            }),
            { role: "user", parts: [{ text: userInput }] },
          ],
        });

        const naturalAnswer =
          response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't understand your question.";
        return { isDirectAnswer: true, result: naturalAnswer };
      }

      if (!data || data.length === 0) {
        console.warn("Query executed but returned no results.");
        // If no results found, try to get a direct answer from nlpModel

        const { response } = await nlpModel.generateContent({
          contents: [
            ...chatMessages.map((msg) => {
              return {
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
              };
            }),
            { role: "user", parts: [{ text: userInput }] },
          ],
        });

        const naturalAnswer =
          response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't find any relevant information.";
        return { isDirectAnswer: true, result: naturalAnswer };
      }

      console.log("Supabase Query Result:", data);
      return { isDirectAnswer: false, result: data };
    } catch (err) {
      console.error("Unexpected Error:", err);
      // For any other errors, try to get a direct answer from nlpModel

      const { response } = await nlpModel.generateContent({
        contents: [
          ...chatMessages.map((msg) => {
            return {
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            };
          }),
          { role: "user", parts: [{ text: userInput }] },
        ],
      });

      const naturalAnswer =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I encountered an error.";
      return { isDirectAnswer: true, result: naturalAnswer };
    }
  };

  const generateNaturalLanguageResponse = async (
    originalQuestion,
    queryResult
  ) => {
    try {
      const context = `Question: ${originalQuestion}\n\nQuery Result: ${JSON.stringify(queryResult, null, 2)}\n\nGenerate a natural language response based on the question and query result.`;
      const { response } = await nlpModel.generateContent({
        contents: [
          ...chatMessages.map((msg) => {
            return {
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            };
          }),
          { role: "user", parts: [{ text: context }] },
        ],
      });

      const naturalLanguageText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";

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
          <img src={logo} alt="logo" className="w-20 h-20 cursor-pointer" />
        </div>
        <div className="pl-4 text-sm font-semibold">MAIN MENU</div>
        <Divider className="m-2" />
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
        <Content className={`m-4 p-6 overflow-auto !bg-none`}>
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

          <Drawer
            open={chatbotVisible}
            onClose={() => setChatbotVisible(false)}
            title="FIN. Assistant"
            width="500"

          >
            <div
              ref={chatContainerRef} // Attach the ref here
              className="overflow-auto flex-1 "
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                height: "calc(100vh - 200px)",
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${msg.sender === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {msg.sender === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown className="markdown-content"
                        components={{
                          // Override default elements with custom styling
                          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          code: ({ node, ...props }) => (
                            <code className="bg-gray-100 px-1 rounded" {...props} />
                          ),
                        }}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </span>
                </div>
              ))}
              {/* Show skeleton loading if isLoading is true */}
              {isLoading && (
                <div className="text-left">
                  <Skeleton active title={false} paragraph={{ rows: 2 }} />
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
          </Drawer>
        )}
      </Layout>
    </Layout>
  );
};
