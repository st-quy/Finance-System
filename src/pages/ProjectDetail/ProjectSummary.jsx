import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';
import dayjs from "dayjs";

const InfoItem = ({ icon, label, value, valueClassName = "" }) => (
  <div className="flex gap-10 justify-between items-center w-full text-sm max-w-[429px] max-md:max-w-full">
    <div className="flex gap-2 items-center self-stretch my-auto font-medium text-gray-500">
      <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
      <div className="self-stretch my-auto">{label}</div>
    </div>
    <div className={`self-stretch my-auto ${valueClassName}`}>{value}</div>
  </div>
);

const Tag = ({ text, color }) => (
  <div className={`overflow-hidden gap-2.5 px-2.5 py-1 text-${color} bg-${color} bg-opacity-30 rounded-[33px]`}>
    {text}
  </div>
);

const ProjectSummary = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      let { data: projects, error } = await supabase.from("project").select("*").eq("project_id", 90);
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(projects[0]);
      }
    }
    fetchProjects();
  }, []);
  
  const projectInfo = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f2a99e3042e45d5496bd593d03a65f0e112c6f198e507ee72b75d399e36993e7?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13", label: "Created At", value: projects.start_date, valueClassName: "font-semibold text-stone-300" },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b428cfe96a2023809c0c9a249cce2678ce7a92be0d55713d1c834789df155e2a?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13", label: "Tags", value: (
        <div className="flex gap-1 items-start text-xs font-semibold">
          <Tag text={projects.project_type} color="emerald-500" />
        </div>
      )
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b1c3a12b02172235db66317f668e9769dc8e8bb7d0715b53511fc5910d8e077?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13", label: "People", value: (
        <div className="flex gap-1 items-start text-xs font-semibold text-indigo-500">
          <div className="overflow-hidden gap-2.5 px-2.5 py-1 bg-indigo-500 bg-opacity-20 rounded-[33px]">
            5 People
          </div>
        </div>
      )
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9258547c55b6a6dddb71110d48a9295065e00512d0f4016c254a277a3ea13fd?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13", label: "Value", value: (
        <div className="overflow-hidden gap-1.5 self-stretch px-2 py-2 my-auto bg-gray-200 rounded text-neutral-400">
          $ {projects.project_value}
        </div>
      )
    }
  ];

  return (
    <div className="rounded-lg flex flex-col p-6 w-full bg-white border-b border-slate-200 max-md:px-5 max-md:max-w-full">
      <div className="px-8 pt-32 pb-8 w-full rounded-2xl max-md:px-5 max-md:pt-24 max-md:max-w-full bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/Images/MessGradient/mess1.png')" }}
      >
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
            <div className="flex grow gap-2.5 max-md:mt-10">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8338c25ae7aeb68aff3b7cbd7b6facab9f1c9cdc3b980009743ac454d540d8c?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
                alt="Project avatar"
                className="object-contain shrink-0 rounded-full aspect-square w-[45px]"
              />
              <div className="flex flex-col my-auto">
                <div className="text-base font-bold text-white">
                  {projects.project_name}
                </div>
                <div className="self-start text-sm font-semibold text-white text-opacity-70">
                  This is the client's name
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[68%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-wrap gap-4 items-start text-sm max-md:mt-10">
              <div className="flex flex-col">
                <div className="font-semibold text-black text-opacity-40">
                  CREATED
                </div>
                <div className="mt-1 font-medium text-black">
                  {projects.start_date}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-black text-opacity-40">
                  DEADLINE
                </div>
                <div className="mt-1 font-medium text-black">
                  {projects.end_date || "Now"}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-black text-opacity-40">
                  TRACKED TIME
                </div>
                <div className="mt-1 font-medium text-black">
                  {dayjs().diff(projects.start_date, "day") } days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[46%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              {projectInfo.map((item, index) => (
                <div key={index} className={index > 0 ? "mt-3" : ""}>
                  <InfoItem {...item} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[54%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full text-sm max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-4 self-start font-semibold whitespace-nowrap text-neutral-600">
                <div>Description</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/8af5eaf28e11fe140384aa06cbb3f77ac6ffee473ec23c6d91d5c2c5266a1ded?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
                  alt=""
                  className="object-contain shrink-0 aspect-square w-[22px]"
                />
              </div>
              <div className="mt-1.5 font-medium leading-6 text-neutral-400 max-md:max-w-full">
                TaskFlow is an intuitive task management system designed to help
                teams collaborate and manage their projects with ease. It offers
                powerful features such as task tracking, project organization,
                scheduling, and communication tools to keep teams organized and
                on top of their projects.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSummary;