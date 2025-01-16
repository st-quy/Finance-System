import React from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const ProjectSearch = ({ searchQuery, setSearchQuery, onSearch }) => {
return (
<Space style={{ marginTop: "10px", width: "100%", justifyContent: "center" }}>
    <Input.Group compact style={{ display: "flex", width: "420px" }}>
    <Input
        placeholder="Search by project name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ flex: 1 }}
    />
    <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={onSearch}
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        }}
    >
        Search
    </Button>
    </Input.Group>
</Space>
);
};

export default ProjectSearch;
