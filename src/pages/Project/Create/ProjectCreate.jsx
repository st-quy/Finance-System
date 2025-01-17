import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Form, Input, Button, DatePicker, Select, message } from "antd";

const { Option } = Select;

const ProjectCreate = () => {
  const [loading, setLoading] = useState(false);

  // Supabase 초기화
  const supabaseUrl = "https://vsmbidgenzscyzgxgede.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbWJpZGdlbnpzY3l6Z3hnZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDY3OTAsImV4cCI6MjA1MTM4Mjc5MH0.mJqtmjFDArnBy3dUFDS2hjyt8aXEf2WAMjOBbmVVAAo";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const onFinish = async (values) => {
    setLoading(true);

    const { project_name, project_type, start_date, end_date, user_id, value } =
      values;

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
    <div className="p-6 bg-white rounded-xl">
      <h2>Create New Project</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
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
          <Input placeholder="Enter project name" className="h-12" />
        </Form.Item>

        <Form.Item
          label="Project Type"
          name="project_type"
          rules={[
            { required: true, message: "Please select the project type!" },
          ]}
        >
          <Select placeholder="Select project type" className="h-12">
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
        {/* 
        <Form.Item
          label="User ID"
          name="user_id"
          rules={[{ required: true, message: "Please input the user ID!" }]}
        >
          <Input type="number" placeholder="Enter user ID" className="h-12" />
        </Form.Item> */}

        <Form.Item
          label="Project Value"
          name="value"
          rules={[
            { required: true, message: "Please input the project value!" },
          ]}
        >
          <Input
            type="number"
            placeholder="Enter project value"
            className="h-12"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            CREATE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectCreate;
