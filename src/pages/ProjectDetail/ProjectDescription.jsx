import * as React from "react";

const ProjectDescription = () => {
  return (
    <div className="flex flex-col ml-5 w-[54%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col w-full text-sm max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-4 self-start font-semibold whitespace-nowrap text-neutral-600">
          <div>Describtion</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8af5eaf28e11fe140384aa06cbb3f77ac6ffee473ec23c6d91d5c2c5266a1ded?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
            alt=""
            className="object-contain shrink-0 aspect-square w-[22px]"
          />
        </div>
        <div className="mt-1.5 font-medium leading-6 text-neutral-400 max-md:max-w-full">
          TaskFlow is an intuitive task management system designed to help teams collaborate and manage their projects with ease. It offers powerful features such as task tracking, project organization, scheduling, and communication tools to keep teams organized and on top of their projects.
        </div>
      </div>
    </div>
  );
}

export default ProjectDescription;