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

const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
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
const { project_name, project_type, start_date, end_date, project_value } = values;

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
<div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
    <h2>Edit Project</h2>
    <Form
    layout="vertical"
    initialValues={{
        project_name: project.project_name,
        project_type: project.project_type,
        start_date: dayjs(project.start_date, "YYYY-MM-DD"),
        end_date: project.end_date ? dayjs(project.end_date, "YYYY-MM-DD") : null,
        project_value: project.project_value,
    }}
    onFinish={handleSubmit}
    style={{ maxWidth: "600px", margin: "auto" }}
    >
    <Form.Item
        label="Project Name"
        name="project_name"
        rules={[{ required: true, message: "Please input the project name!" }]}
    >
        <Input />
    </Form.Item>

    <Form.Item
        label="Project Type"
        name="project_type"
        rules={[{ required: true, message: "Please select the project type!" }]}
    >
        <Select>
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
        
        <DatePicker style={{ width: "100%" }} 
    />
    </Form.Item>

    <Form.Item label="End Date" name="end_date">
        <DatePicker style={{ width: "100%" }}
        />
    </Form.Item>

    <Form.Item
        label="Value"
        name="project_value"
        rules={[{ required: true, message: "Please input the project value!" }]}
    >
        <Input type="number" />
    </Form.Item>

    <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
        Update Project
        </Button>
    </Form.Item>
    </Form>
</div>
);
};

export default ProjectEdit;
