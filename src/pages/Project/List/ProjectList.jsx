import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Typography,
  Card,
  Button,
  Space,
  Modal,
  message,
  Input,
  Menu,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (query = "") => {
    let { data: projects, error } = await supabase
      .from("project")
      .select(
        "project_id, project_name, project_value, project_type, start_date, end_date"
      )
      .order("project_id", { ascending: true });

    if (query) {
      projects = projects.filter((project) =>
        project.project_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(projects);
    }
  };

  const handleSearch = () => {
    fetchProjects(searchQuery);
  };

  const handleDelete = async (projectId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the project.",
      okText: "Yes, delete it",
      cancelText: "Cancel",
      onOk: async () => {
        const { error } = await supabase
          .from("project")
          .delete()
          .eq("project_id", projectId);

        if (error) {
          message.error("Failed to delete the project.");
          console.error("Error deleting project:", error);
        } else {
          message.success("Project deleted successfully.");
          fetchProjects();
        }
      },
    });
  };

  const columns = [
    {
      title: "Project ID",
      dataIndex: "project_id",
      key: "project_id",
      align: "center",
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
      align: "center",
    },
    {
      title: "Project Type",
      dataIndex: "project_type",
      key: "project_type",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
      render: (text) => (text ? text : "In Progress"),
    },
    {
      title: "Value",
      dataIndex: "project_value",
      key: "project_value",
      align: "center",
      render: (value) => (value ? `$${value.toLocaleString()}` : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/projects/view/${record.project_id}`)}
            icon={<EyeOutlined />}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.project_id)}
          />
          <Button
            onClick={() => navigate(`/projects/edit/${record.project_id}`)}
            icon={<EditOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#1C2951", padding: "0 19px", width: "97%", margin: "0 auto" }}>
        <Typography.Title
          level={3}
          style={{ color: "#fff", margin: "0", lineHeight: "64px" }}
        >
          Project Management
        </Typography.Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Card
          bordered={false}
          style={{
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Input
              placeholder="Search by project name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "300px" }}
              prefix={<SearchOutlined />}
            />
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/projects/create")}
              >
                Create Project
              </Button>
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Space>
          </Space>
        </Card>
        <Card
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="project_id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
          />
        </Card>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Project Management ©2025 Created by YourName
      </Footer>
    </Layout>
  );
};

export default ProjectList;
