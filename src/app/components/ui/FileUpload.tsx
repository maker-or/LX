import React from "react";

const FileUpload = () => {
  return (
    <div className="flex h-screen gap-4 bg-[#0c0c0c] p-4">
      <div className="m-3 flex flex-col gap-4">
        <div className="">
          <h1 className="text-[3rem] text-[#f7eee3]">File name</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#f7eee3] outline-none"
            placeholder="Firstname,Lastname"
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[3rem] text-[#f7eee3]">Branch</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#f7eee3] outline-none"
            placeholder="Firstname,Lastname"
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[3rem] text-[#f7eee3]">year</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#f7eee3] outline-none"
            placeholder="Firstname,Lastname"
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[3rem] text-[#f7eee3]">Tags</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#f7eee3] outline-none"
            placeholder="Firstname,Lastname"
            type="text"
          />
        </div>
      </div>
      <div className="flex h-screen w-full"></div>
    </div>
  );
};

export default FileUpload;
