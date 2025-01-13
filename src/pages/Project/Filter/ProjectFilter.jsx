import React, { useState } from "react";
import { Checkbox, Button, Space } from "antd";

const categories1 = ["Tech Upgrade", "Android", "IOS", "AI"];
const categories2 = ["End", "In progress"];

const ProjectFilter = ({ onFilter }) => {
const [selectedCategories1, setSelectedCategories1] = useState([]);
const [selectedCategories2, setSelectedCategories2] = useState([]);

const handleCategory1Change = (checkedValues) => {
setSelectedCategories1(checkedValues);
};

const handleCategory2Change = (checkedValues) => {
setSelectedCategories2(checkedValues);
};

const applyFilters = () => {
onFilter({
    categories1: selectedCategories1,
    categories2: selectedCategories2,
});
};

return (
<div style={{ padding: "20px" }}>
    <h3>Categories</h3>
    <Space direction="vertical" style={{ marginBottom: "20px" }}>
    <h4>Type</h4>
    <Checkbox.Group
        options={categories1}
        value={selectedCategories1}
        onChange={handleCategory1Change}
    />
    <h4>Status</h4>
    <Checkbox.Group
        options={categories2}
        value={selectedCategories2}
        onChange={handleCategory2Change}
    />
    </Space>
    <Button type="primary" onClick={applyFilters}>
    Apply Filters
    </Button>
</div>
);
};

export default ProjectFilter;
