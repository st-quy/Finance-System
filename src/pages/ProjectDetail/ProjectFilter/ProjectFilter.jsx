import * as React from "react";
import { supabase } from '../../../supabaseClient';


const ProjectFilter = () => {
    
    const [activeTab, setActiveTab] = React.useState("All Date");

    const tabs = [
        { id: 1, label: "All Date" },
        { id: 2, label: "12 Months" },
        { id: 3, label: "30 Days" },
        { id: 4, label: "7 Days" },
        { id: 5, label: "24 Hour" }
    ];

    return (
        <div className="flex justify-between items-center w-full">
            {/* Left side - Tabs */}
            <div className="flex overflow-hidden items-center h-10 p-1 text-sm font-medium bg-white rounded-xl border border-solid border-zinc-200 text-slate-500">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.label)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setActiveTab(tab.label);
                            }
                        }}
                        role="tab"
                        tabIndex={0}
                        aria-selected={activeTab === tab.label}
                        className={`flex items-center justify-center h-8 overflow-hidden px-3 rounded-lg cursor-pointer transition-colors ${activeTab === tab.label ? "font-semibold text-indigo-800 bg-indigo-50" : ""
                            }`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center space-x-2">
                <button
                    className="flex gap-2 justify-center items-center h-10 px-3 bg-white rounded-xl border border-solid border-zinc-200"
                    aria-label="Select dates"
                >
                    <div className="flex justify-center items-center w-5 h-5">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd2ed8a66728ca09c3e3c075a63154d42c09b27ef6954387c5f559d3b1dc3b84?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
                            alt=""
                            className="w-4 h-4 object-contain"
                        />
                    </div>
                    <span className="text-sm tracking-normal leading-none text-slate-500">
                        Select Dates
                    </span>
                </button>

                <button
                    className="flex gap-2 justify-center items-center h-10 px-3 bg-white rounded-xl border border-solid border-zinc-200"
                    aria-label="Filter options"
                >
                    <div className="flex justify-center items-center w-5 h-5">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9288acd9b7c89d855840deea9f706790cd68946344199d194ee0ee43a762c5b?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
                            alt=""
                            className="w-4 h-4 object-contain"
                        />
                    </div>
                    <span className="text-sm font-medium tracking-normal leading-none text-slate-500">
                        Filters
                    </span>
                </button>

                <button
                    className="flex justify-center items-center w-10 h-10 bg-rose-50 rounded-xl"
                    aria-label="Additional options"
                >
                    <div className="flex justify-center items-center w-5 h-5">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9cd5eda46dd0e69d5e06987c72c6f74fe9dc7bcd1b2082395f522d2eaec6bfa8?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
                            alt=""
                            className="w-4 h-4 object-contain"
                        />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ProjectFilter;