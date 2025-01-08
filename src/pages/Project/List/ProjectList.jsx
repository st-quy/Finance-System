import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Table, Typography, Card, Button, Space, Tag } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const ProjectList = () => {
  const [projects, setProjects] = useState([]); 
  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    async function fetchProjects() {
      let { data: projects, error } = await supabase.from("project").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(projects);
      }
    }

    fetchProjects();
  }, []);

  const columns = [
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
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* 상단 컨트롤 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Recent Projects
        </Typography.Title>
        <Space>
          <Button>Select Date</Button>
          <Button>Filters</Button>
          <Button>Edit</Button>
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
