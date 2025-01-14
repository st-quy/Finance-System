import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Card,
  Button,
  Space,
  Modal,
  message,
  Col,
  Row,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import IncomeExpensesChart from "./Components/BarChart/IncomeAndExpensesChart";
import OverviewCard from "./Components/OverViewCards/OverviewCard";
import { PredictionCard } from "./Components/Prediction/PredictionCard";


const Overview = () => {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    let { data: projects, error } = await supabase
      .from("project")
      .select(
        "project_id, project_name, project_value, project_type, start_date, end_date"
      )
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
  useEffect(() => {
    const fetchData = async () => {
      const { data: User, error } = await supabase.from("User").select("name");
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setData(User);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projects, error } = await supabase
        .from("project")
        .select("*");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        const sortedProjects = projects
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
          .slice(0, 7);
        setProjects(sortedProjects);
      }
    };
    fetchProjects();
  }, []);

  const handleViewProject = (projectId) => {
    navigate(`/projects/detail/${projectId}`);
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewProject(record.project_id)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.project_id)}
          />
          <Button
            onClick={() => navigate(`/projects/edit/${record.project_id}`)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Row className="w-full mb-4" gutter={[16, 16]}>
        <OverviewCard/>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ height: '100%' }}>
            <IncomeExpensesChart />
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ height: '100%' }}>
            <PredictionCard />
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: "20px" }}>
        <Card
          bordered
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography.Title
              level={3}
              style={{ textAlign: "left", margin: 0 }}
            >
              Recent Projects
            </Typography.Title>
            <Space>
              <Button>Select Date</Button>
              <Button>Filters</Button>
              <Button>Edit</Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={projects}
            rowKey="project_id"
            bordered
            pagination={{
              pageSize: 7,
              hideOnSinglePage: true,
              showSizeChanger: false,
              showQuickJumper: false,
              showPrevNextJumpers: false,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Overview;
