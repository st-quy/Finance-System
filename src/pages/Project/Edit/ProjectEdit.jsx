import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = "https://vsmbidgenzscyzgxgede.supabase.co";
  const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbWJpZGdlbnpzY3l6Z3hnZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDY3OTAsImV4cCI6MjA1MTM4Mjc5MH0.mJqtmjFDArnBy3dUFDS2hjyt8aXEf2WAMjOBbmVVAAo";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    let { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (error) {
      message.error("Failed to fetch project data.");
      console.error(error);
    } else {
      setProject(data);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const { project_name, project_type, start_date, end_date, project_value } =
      values;

    const { error } = await supabase
      .from("project")
      .update({
        project_name,
        project_type,
        start_date: start_date.format("YYYY-MM-DD"),
        end_date: end_date ? end_date.format("YYYY-MM-DD") : null,
        project_value,
      })
      .eq("project_id", projectId);

    setLoading(false);

    if (error) {
      message.error("Failed to update project.");
      console.error(error);
    } else {
      message.success("Project updated successfully.");
      navigate("/projects"); // 수정 후 프로젝트 목록 페이지로 돌아갑니다.
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <h2>Edit Project</h2>
      <Form
        layout="vertical"
        initialValues={{
          project_name: project.project_name,
          project_type: project.project_type,
          start_date: dayjs(project.start_date, "YYYY-MM-DD"),
          end_date: project.end_date
            ? dayjs(project.end_date, "YYYY-MM-DD")
            : null,
          project_value: project.project_value,
        }}
        onFinish={handleSubmit}
        className="w-full p-6 !px-12"
        variant={"filled"}
      >
        <Form.Item
          label="Name"
          name="project_name"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input className="h-12" />
        </Form.Item>

        <Form.Item
          label="Project Type"
          name="project_type"
          rules={[
            { required: true, message: "Please select the project type!" },
          ]}
        >
          <Select className="h-12">
            <Option value="Tech Upgrade">Tech Upgrade</Option>
            <Option value="Android">Android</Option>
            <Option value="IOS">IOS</Option>
            <Option value="AI">AI</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="start_date"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker style={{ width: "100%" }} className="h-12" />
        </Form.Item>

        <Form.Item label="End Date" name="end_date">
          <DatePicker style={{ width: "100%" }} className="h-12" />
        </Form.Item>

        <Form.Item
          label="Value"
          name="project_value"
          rules={[
            { required: true, message: "Please input the project value!" },
          ]}
        >
          <Input type="number" className="h-12" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectEdit;
