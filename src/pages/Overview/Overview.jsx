import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Table, Typography, Card, Button, Space, Modal, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    let { data: projects, error } = await supabase
      .from("project")
      .select("project_id, project_name, project_value, project_type, start_date, end_date")
      .order("project_id", { ascending: true }); // project_id 기준 오름차순 정렬
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(projects);
    }
  };  

  const handleDelete = async (projectId) => {
    // 삭제 확인 모달 표시
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the project.",
      okText: "Yes, delete it",
      cancelText: "Cancel",
      onOk: async () => {
        // Supabase에서 프로젝트 삭제
        const { error } = await supabase
          .from("project")
          .delete()
          .eq("project_id", projectId);

        if (error) {
          message.error("Failed to delete the project.");
          console.error("Error deleting project:", error);
        } else {
          message.success("Project deleted successfully.");
          // 삭제 후 테이블 데이터 업데이트
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
      render: (value) => (value ? `$${value.toLocaleString()}` : "N/A"), // 가격을 포맷
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} />
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
      {/* 상단 컨트롤 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Recent Projects
        </Typography.Title>
        <Space>
          <Button onClick={() => navigate("/projects/create")}>Create</Button>
          <Button>Select Date</Button>
          <Button>Filters</Button>
        </Space>
      </div>

      {/* 프로젝트 테이블 */}
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
