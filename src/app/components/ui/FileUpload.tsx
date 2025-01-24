import React from "react";

const FileUpload = () => {
  return (
    <div className="flex h-screen gap-4 bg-[#f7eee3] p-4">
      <div className="m-3 flex flex-col gap-6">
        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">File name</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">Branch</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">year</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>
        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">Tags</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>

        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">Subjects</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>


        <div className="">
          <h1 className="text-[2rem] text-[#0c0c0c]/80">Tags</h1>
          <input
            className="w-full border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none"
            placeholder=""
            type="text"
          />
        </div>
      </div>
      <div className="flex h-screen w-full"></div>
    </div>
  );
};

export default FileUpload;
