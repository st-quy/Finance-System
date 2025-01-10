import { useEffect, useState } from "react";
import RadialBarChart from "./Components/RadialBarChart";
import IncomeExpensesChart from "./Components/IncomeAndExpensesChart";
import { Col, Row, Table, Typography, Card, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

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
      const { data: projects, error } = await supabase.from("project").select("*");
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
    navigate(`/projectsDetail/${projectId}`);
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewProject(record.project_id)}
          />
        </Space>
      ),
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
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Row className="w-full" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={10} lg={10}>
          <RadialBarChart />
        </Col>
        <Col xs={24} sm={24} md={14} lg={14}>
          <IncomeExpensesChart />
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
            <Typography.Title level={3} style={{ textAlign: "left", margin: 0 }}>
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
