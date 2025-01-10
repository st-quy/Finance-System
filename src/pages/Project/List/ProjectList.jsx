import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Table, Typography, Card, Button, Space, Modal, message, Input } from "antd";
import { EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
      .select("project_id, project_name, project_value, project_type, start_date, end_date")
      .order("project_id", { ascending: true });

    if (query) {
      // 검색어가 있을 경우 필터링
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
    fetchProjects(searchQuery); // 검색어로 프로젝트 가져오기
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
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Project Type",
      dataIndex: "project_type",
      key: "project_type",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => (text ? text : "In Progress"),
    },
    {
      title: "Value",
      dataIndex: "project_value",
      key: "project_value",
      render: (value) => (value ? `$${value.toLocaleString()}` : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/projects/view/${record.project_id}`)} icon={<EyeOutlined />}></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.project_id)}
          />
          <Button onClick={() => navigate(`/projects/edit/${record.project_id}`)}>Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Recent Projects
        </Typography.Title>
        <Space style={{ marginTop: "10px", width: "100%", justifyContent: "center" }}>
          <Input.Group compact style={{ display: "flex", width: "420px" }}>
            <Input
              placeholder="Search by project name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Search
            </Button>
          </Input.Group>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/projects/create")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "150px",
              backgroundColor: "white",
              color: "black",
              border: "1px solid #d9d9d9",
            }}
          >
            Create Project
          </Button>
          <Button style={{ float: "right" }}>Filters</Button>
        </Space>
      </div>

      <Card
        bordered
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="project_id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;