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
  Form,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    projectType: null,
    startDate: null,
    endDate: null,
    inProcess: null,
  });
  const [inProcess, setInProcess] = useState(false);

  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (query = "", filters = {}) => {
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

    if (filters.projectType) {
      projects = projects.filter(
        (project) => project.project_type === filters.projectType
      );
    }

    if (filters.startDate && filters.endDate) {
      projects = projects.filter(
        (project) =>
          new Date(project.start_date) >= new Date(filters.startDate) &&
          new Date(project.end_date) <= new Date(filters.endDate)
      );
    }

    if (filters.inProcess !== null) {
      projects = projects.filter(
        (project) =>
          filters.inProcess
            ? !project.end_date // 진행 중인 경우 end_date가 없음을 필터링
            : project.end_date // 완료된 경우 end_date가 있는 항목 필터링
      );
    }

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(projects);
    }
  };

  const handleSearch = () => {
    fetchProjects(searchQuery, filters);
  };

  const handleFilterApply = (values) => {
    const { projectType, startDate, endDate } = values;

    fetchProjects(searchQuery, { projectType, startDate, endDate, inProcess });
    setIsFilterModalVisible(false);
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
            onClick={() => navigate(`/projects/detail/${record.project_id}`)}
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
      <Header
        style={{
          backgroundColor: "#1C2951",
          padding: "0 19px",
          width: "97%",
          margin: "0 auto",
        }}
      >
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
          <Space
            wrap
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Input
                placeholder="Search by project name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1,
                  border: "none",
                  // padding: "8px 12px",
                  minWidth: "10rem",
                  height: "40px",
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                  height: "40px",
                }}
              >
                Search
              </button>
            </div>

            <Space style={{ gap: "8px" }} wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/projects/create")}
                style={{
                  width: "160px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#1C2951",
                  color: "#fff",
                  border: "none",
                }}
              >
                Create Project
              </Button>
              <Button
                style={{
                  width: "160px",
                  height: "40px",
                  borderRadius: "8px",
                }}
                onClick={() => setIsFilterModalVisible(true)}
              >
                Filters
              </Button>
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
            scroll={{ x: true }}
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

      <Modal
        title="Filter Projects"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleFilterApply}>
          <Form.Item name="projectType" label="Project Type">
            <Select placeholder="Select a type">
              <Option value="Tech Upgrade">Tech Upgrade</Option>
              <Option value="Android">Android</Option>
              <Option value="IOS">IOS</Option>
              <Option value="AI">AI</Option>
            </Select>
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type={inProcess ? "primary" : "default"}
              onClick={() => setInProcess(!inProcess)}
              style={{
                marginBottom: "16px",
              }}
            >
              {inProcess ? "In Process Selected" : "In Process"}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProjectList;
