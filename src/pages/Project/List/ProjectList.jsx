import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import bg1 from "../../../assets/Images/MessGradient/mess1.png";
import bg2 from "../../../assets/Images/MessGradient/mess2.png";
import bg3 from "../../../assets/Images/MessGradient/mess3.png";
import bg4 from "../../../assets/Images/MessGradient/mess4.png";
import bg5 from "../../../assets/Images/MessGradient/mess5.png";
import bg6 from "../../../assets/Images/MessGradient/mess6.png";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];
const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

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
  DeleteFilled,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PROJECT_TYPES = [
  "IOS",
  "Android",
  "WebApp",
  "Tech Upgrade",
  "AI"
];

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

  const supabaseUrl = "https://vsmbidgenzscyzgxgede.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbWJpZGdlbnpzY3l6Z3hnZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDY3OTAsImV4cCI6MjA1MTM4Mjc5MH0.mJqtmjFDArnBy3dUFDS2hjyt8aXEf2WAMjOBbmVVAAo";
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
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            onChange={(e) =>
              handleCheckboxChange(record.project_id, e.target.checked)
            }
            checked={selectedProjects.includes(record.project_id)}
          />
        </div>
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
        <Space onClick={(e) => e.stopPropagation()}>
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
        <div className="border border-solid border-zinc-200"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: " #fff",
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: "1",
            backgroundImage: `url(${bg})`,
            backgroundSize: "100%",
            padding: "40px",
            borderRadius: "10px",
          }}
        >
          <Typography.Title
            level={3}
            style={{
              color: "#fff",
              margin: "0",
              fontSize: "28px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"  // Added text shadow
            }}
          >
            Project Management
          </Typography.Title>
          <Typography.Text
            style={{
              color: "#fff",
              marginTop: "10px",
              fontSize: "13px",
              display: "block",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"  // Added text shadow
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
              color: "rgb(70, 70, 70)",
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
              fonrWeight: "medium",
              color: "rgb(70, 70, 70)",
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
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: "16px",
            marginBottom: "16px",
          }}
          wrap
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              width: "400px",
            }}
          >
            <Search
              placeholder="Search projects by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={(e) => e.key === "Enter" && handleSearch()}
              allowClear
              enterButton="Search"
              style={{
                '.ant-input': {
                  height: '40px',
                },
                '.ant-input-search-button': {
                  height: '40px',
                },
                '.ant-input-group-addon': {
                  height: '40px',
                },
              }}
              size="large"
            />
          </div>
          <Space style={{ gap: "16px" }} wrap>
            <Button
              icon={<HiAdjustmentsHorizontal />}
              onClick={() => setIsFilterModalVisible(true)}
              className=" h-10 px-3 bg-white rounded-xl border border-solid border-zinc-200 text-sm font-medium text-slate-500"

            >
              Filter
            </Button>
            <Button
              color="primary"
              variant="solid"
              icon={<PlusOutlined />}
              onClick={() => navigate("/projects/create")}
              className=" h-10 px-3 rounded-xl text-sm font-medium"
            >
              Add
            </Button>
            {selectedProjects.length != 0 && (<Button
              color="danger"
              variant="filled"
              icon={<DeleteFilled />}
              onClick={handleBulkDelete}
              disabled={selectedProjects.length === 0}
            >{selectedProjects.length}</Button>)}
          </Space>
        </Space>
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="project_id"
          pagination={{
            position: ['bottomCenter'],
            pageSize: 10
          }}
          scroll={{ x: true }}
          onRow={(record) => ({
            onClick: (e) => {
              // Only navigate if not clicking on checkbox or action buttons
              if (!e.target.closest('.ant-checkbox') && !e.target.closest('.ant-btn')) {
                navigate(`/projects/detail/${record.project_id}`);
              }
            },
            style: {
              cursor: 'pointer',
            }
          })}
          className="w-full bg-white border border-solid border-zinc-200"
        />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Project Management ©2025 Created by Your Name
      </Footer>
      <Modal
        title="Filter Projects"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleFilterApply}>
          <Form.Item label="Project Type" name="projectType">
            <Select allowClear>
              {PROJECT_TYPES.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
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