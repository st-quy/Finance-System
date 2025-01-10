import React, { useState } from 'react';
import { PlusOutlined } from "@ant-design/icons";
import { DatePicker, Button, Segmented } from "antd";
import dayjs from 'dayjs';
import './ProjectFilter.css';

const ProjectFilter = ({ onFilterChange }) => {
    const [activeTab, setActiveTab] = useState("All Date");
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [rotate, setRotate] = useState(false);

    const handleMouseEnter = () => {
        setRotate(true);
    };

    const handleMouseLeave = () => {
        setRotate(false);
    };


    const tabs = [
        { id: 1, label: "All Date" },
        { id: 2, label: "12 Months" },
        { id: 3, label: "30 Days" },
        { id: 4, label: "7 Days" },
        { id: 5, label: "24 Hour" }
    ];

    const categories = [
        "Marketing",
        "Personnel",
        "Technology",
        "Operations",
    ];

    const handleTabClick = (label) => {
        setActiveTab(label);
        const now = dayjs();
        let startDate = null;
        let endDate = dayjs();


        switch (label) {
            case "12 Months":
                startDate = now.subtract(22, "month");
                break;
            case "30 Days":
                startDate = now.subtract(30, "day");
                break;
            case "7 Days":
                startDate = now.subtract(7, "day");
                break;
            case "24 Hour":
                startDate = now.subtract(24, "hour");
                break;
            default:
                startDate = null;
                endDate = dayjs();
        }

        setDateRange({ start: startDate, end: endDate });
        onFilterChange({
            dateRange: { start: startDate, end: endDate },
            categories: selectedCategories
        });
    };

    const handleCategoryToggle = (category) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(updatedCategories);
        onFilterChange({
            dateRange,
            categories: updatedCategories
        });

    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center w-full">
                {/* Left side - Tabs */}
                <Button className="flex overflow-hidden items-center h-10 p-1 text-sm font-medium bg-white rounded-xl border border-solid border-zinc-200 text-slate-500">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => handleTabClick(tab.label)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleTabClick(tab.label);
                                }
                            }}
                            role="tab"
                            tabIndex={0}
                            aria-selected={activeTab === tab.label}
                            className={`flex items-center justify-center h-8 overflow-hidden px-3 rounded-lg cursor-pointer transition-colors ${activeTab === tab.label ? "font-semibold text-indigo-800 bg-indigo-50" : ""}`}
                        >
                            {tab.label}
                        </div>
                    ))}
                </Button>

                {/* Right side - Buttons */}
                <div className="flex items-center space-x-2">
                    <Button type="primary" shape="circle" icon={<PlusOutlined
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />}
                    />


                    <DatePicker.RangePicker className="flex gap-2 justify-center items-center h-10 px-3 bg-white rounded-xl border border-solid border-zinc-200"
                        onChange={(date, datestring) => {
                            console.log(date, 'date');
                            setDateRange({ start: date[0], end: date[1] });
                            onFilterChange({
                                dateRange: { start: date[0], end: date[1] },
                                categories: selectedCategories
                            });

                        }} />

                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex gap-2 justify-center items-center h-10 px-3 bg-white rounded-xl border border-solid border-zinc-200"
                    >
                        <div className="flex justify-center items-center w-5 h-5">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9288acd9b7c89d855840deea9f706790cd68946344199d194ee0ee43a762c5b"
                                alt=""
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                        <span className="text-sm font-medium tracking-normal leading-none text-slate-500">
                            Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Filters Dropdown */}
            {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-zinc-200 shadow-lg z-50">
                    <div className="p-4">
                        <h3 className="text-sm font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label key={category} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                        className="w-4 h-4 rounded-md border-2 border-neutral-300"
                                    />
                                    <span className="text-sm text-slate-600">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectFilter;