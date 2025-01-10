import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Form, Input, Button, DatePicker, Select, message } from "antd";

const { Option } = Select;

const ProjectCreate = () => {
  const [loading, setLoading] = useState(false);

  // Supabase 초기화
  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const onFinish = async (values) => {
    setLoading(true);

    const { project_name, project_type, start_date, end_date, user_id, value } = values;

    // Supabase에 데이터 삽입
    const { error } = await supabase.from("project").insert([
      {
        project_name,
        project_type,
        start_date: start_date.format("YYYY-MM-DD"),
        end_date: end_date ? end_date.format("YYYY-MM-DD") : null,
        user_id, // user_id를 삽입
        project_value: value,
      },
    ]);

    setLoading(false);

    if (error) {
      message.error("Failed to create project: " + error.message);
    } else {
      message.success("Project created successfully!");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2>Create New Project</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <Form.Item
          label="Project Name"
          name="project_name"
          rules={[{ required: true, message: "Please input the project name!" }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          label="Project Type"
          name="project_type"
          rules={[{ required: true, message: "Please select the project type!" }]}
        >
          <Select placeholder="Select project type">
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
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="End Date" name="end_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="User ID"
          name="user_id"
          rules={[{ required: true, message: "Please input the user ID!" }]}
        >
          <Input type="number" placeholder="Enter user ID" />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "Please input the project value!" }]}
        >
          <Input type="number" placeholder="Enter project value" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectCreate;
