"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import TagInput from "./components/ui/TagInput";


interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

export default function HomePage() {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    branch: "",
    tags: "",
    subject: "",
    type: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [file, setFile] = useState<undefined | File>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => console.log(file), [file]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadComplete = (response: UploadedFile[]) => {
    setUploadedFiles(response);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("year", formData.year);
      data.append("branch", formData.branch);
      data.append("tags", JSON.stringify(tags));
      data.append("name", formData.name);
      data.append("file", file || "");
      data.append("subject", formData.subject);
      data.append("type", formData.type);

      await fetch("/api/uploadfile", {
        method: "POST",
        body: data,
      });
      setFormData({ year: "", branch: "", tags: "", name: "", subject: "", type: "" });
      setTags([]);
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error updating database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-[100svh] w-[100svw] p-8 flex-col items-center justify-center bg-[#191A1A] text-[#0c0c0c]">

      <div className="flex flex-col items-start   justify-start  w-full h-full">


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-full  px-2  py-8  rounded-lg "
        >
          {/* Left Column: Text Inputs */}
          <div className="flex flex-col h-full gap-10">
            <div>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter filename"
                className="w-[90%] border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none mt-8 "
              />
            </div>
            <div>

              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-[90%] border-b border-gray-300 bg-inherit text-2xl text-[#9CA3AF] outline-none mt-8"
              >
                <option value="" className="" disabled>
                  Choose year
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div>

              <div>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 136 101"
                  fill="#002B4D"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="0.5px"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M67.4193 2.48926L2.0293 40.2393L19.3493 50.2393L41.2793 62.8993L67.8293 78.2294L75.9393 73.5493L115.899 50.4794L133.219 40.4794L67.4193 2.48926ZM71.3893 63.5093L49.3893 50.7993L38.4893 44.5093L49.3893 38.2194L82.2893 57.2194L71.3893 63.5093Z"
                    stroke="#229EFF"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M82.2906 57.2192L71.3906 63.5092L49.3906 50.7992V38.2192L82.2906 57.2192Z"
                    stroke="#229EFF"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M49.3902 38.2192V50.7992L38.4902 44.5092L49.3902 38.2192Z"
                    stroke="#229EFF"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M133.22 40.4792V60.4792L67.8301 98.2292V78.2292L75.9401 73.5492L115.9 50.4792L133.22 40.4792Z"
                    stroke="#229EFF"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M67.8293 78.2294V98.2294L2.0293 60.2393V40.2393L19.3493 50.2393L41.2793 62.8993L67.8293 78.2294Z"
                    stroke="#229EFF"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>




              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="Enter branch"
                className="w-[90%] border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none mt-8"
              />
            </div>
            <div>

              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter subject"
                className="w-[90%] border-b border-gray-300 bg-inherit text-2xl text-[#0c0c0c] outline-none mt-8"
              />
            </div>
            <div>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-[90%] border-b border-gray-300 bg-inherit text-2xl text-[#9CA3AF] outline-none mt-8"
              >
                <option value="" disabled>
                  Choose type
                </option>
                <option value="Notes">Notes</option>
                <option value="Question Paper">questionPaper</option>
              </select>
            </div>
            <div>
              <TagInput tags={tags} setTags={setTags} />
            </div>
          </div>

          {/* Right Column: File Upload */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400">
                Upload File (only pdf)
              </label>
              <div
                className="flex flex-col items-center justify-center border border-dashed border-gray-600 bg-[#f7eee3] text-[#0c0c0c] p-8 rounded-lg mt-2 cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <span>{file ? file.name : "Click to select or drag & drop a file"}</span>
              </div>
              <input
                type="file"
                id="file-upload"
                // accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                className="hidden"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#f7eee3] text-black font-semibold py-3 rounded-lg flex items-center justify-center transition-all ${isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-[inset_0_-4px_8px_rgba(255,94,0,0.6),0_4px_6px_rgba(0,0,0,0.2)] focus:shadow-[inset_0_-4px_8px_rgba(255,94,0,0.6),0_4px_6px_rgba(0,0,0,0.2)]"
                } shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]`}
              aria-busy={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
              ) : (
                "Upload"
              )}
            </button>



          </div>
        </form>
      </div>

    </main>
  );
}