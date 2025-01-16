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
  Checkbox,
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
  const [selectedProjects, setSelectedProjects] = useState([]);

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
      projects = projects.filter((project) =>
        filters.inProcess
          ? !project.end_date 
          : project.end_date 
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

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the selected projects.",
      okText: "Yes, delete them",
      cancelText: "Cancel",
      onOk: async () => {
        const { error } = await supabase
          .from("project")
          .delete()
          .in("project_id", selectedProjects);

        if (error) {
          message.error("Failed to delete the selected projects.");
          console.error("Error deleting projects:", error);
        } else {
          message.success("Selected projects deleted successfully.");
          setSelectedProjects([]);
          fetchProjects();
        }
      },
    });
  };

  const handleCheckboxChange = (projectId, isChecked) => {
    setSelectedProjects((prevSelected) =>
      isChecked
        ? [...prevSelected, projectId]
        : prevSelected.filter((id) => id !== projectId)
    );
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            const isChecked = e.target.checked;
            setSelectedProjects(
              isChecked ? projects.map((project) => project.project_id) : []
            );
          }}
          checked={
            selectedProjects.length > 0 &&
            selectedProjects.length === projects.length
          }
          indeterminate={
            selectedProjects.length > 0 &&
            selectedProjects.length < projects.length
          }
        />
      ),
      dataIndex: "select",
      key: "select",
      align: "center",
      render: (_, record) => (
        <Checkbox
          onChange={(e) =>
            handleCheckboxChange(record.project_id, e.target.checked)
          }
          checked={selectedProjects.includes(record.project_id)}
        />
      ),
    },
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
          borderRadius: "10px",
          padding: "20px 30px",
          height: "200px",
          width: "97%",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          display: "flex", // 플렉스 레이아웃 추가
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at top left, #2A3E70, transparent)",
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: "1",
          }}
        >
          <Typography.Title
            level={3}
            style={{
              color: "#fff",
              margin: "0",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Project Management
          </Typography.Title>
          <Typography.Text
            style={{
              color: "#dcdcdc",
              marginTop: "10px",
              fontSize: "13px",
              display: "block",
            }}
          >
            Manage your projects efficiently
          </Typography.Text>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: "1",
            paddingLeft: "20px",
            color: "#dcdcdc",
          }}
        >
          <Typography.Title
            level={4}
            style={{
              color: "#fff",
              margin: "0 0 10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Description
          </Typography.Title>
          <Typography.Paragraph
            style={{
              margin: "0",
              fontSize: "12px",
              color: "#dcdcdc",
            }}
          >
            Project Management is a comprehensive solution designed to streamline workflows and enhance team collaboration. 
            It provides robust tools for project planning, task assignment, progress tracking, and real-time communication. 
            With its user-friendly interface and powerful features, it helps teams stay organized, meet deadlines, and achieve 
            their goals efficiently.
          </Typography.Paragraph>
        </div>
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
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "16px",
            }}
            wrap
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
                  padding: "8px 12px",
                  minWidth: "10rem",
                  height: "33px",
                }}
                prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
              />
              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: "#4C0C0C0",
                  color: "#000000",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                  height: "33px",
                }}
              >
                Search
              </button>
            </div>
            <Space style={{ gap: "16px" }} wrap>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsFilterModalVisible(true)}
              >
                Filter
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => navigate("/projects/create")}
                style={{
                  backgroundColor: "#ff8c00",
                  borderColor: "#ff8c00",    
                  color: "#fff",            
                }}
              >
                Add
              </Button>
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                disabled={selectedProjects.length === 0}
                style={{
                  backgroundColor: "#fff", 
                  borderColor: "#ff4d4f",
                  color: "#ff4d4f",
                }}
              >
              </Button>
            </Space>
          </Space>
        </Card>
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="project_id"
          pagination={{ pageSize: 10 }}
          scroll={{x: true}}
        />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Project Management ©2025 Created by Your Name
      </Footer>
      <Modal
        title="Filter Projects"
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleFilterApply}>
          <Form.Item label="Project Type" name="projectType">
            <Select allowClear>
              <Option value="type1">Type 1</Option>
              <Option value="type2">Type 2</Option>
              <Option value="type3">Type 3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date Range" name="dateRange">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={inProcess}
              onChange={(e) => setInProcess(e.target.checked)}
            >
              In Process
            </Checkbox>
          </Form.Item>
          <Form.Item>
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
