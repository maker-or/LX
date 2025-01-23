"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import TagInput from "./components/ui/TagInput";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export default function HomePage() {
  const { userId } = useAuth(); 
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    branch: "",
    tags: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [file, setFile] = useState<undefined | File>(undefined);
  const [tags, setTags] = useState<string[]>([]); // State for tags

  useEffect(() => console.log(file), [file]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadComplete = (response: UploadedFile[]) => {
    // Store uploaded files in state
    setUploadedFiles(response);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("year", formData.year);
      data.append("branch", formData.branch);
      data.append("tags", JSON.stringify(tags)); // Send tags as a JSON string
      data.append("name", formData.name);
      data.append("file", file || "");

      await fetch("/api/uploadfile", {
        method: "POST",
        body: data,
      });

      // Reset form data
      setFormData({
        year: "",
        branch: "",
        tags: "",
        name: "",
      });
      setTags([]); // Clear tags after submission
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#262627] to-[#434344] text-black">
      <form onSubmit={handleSubmit} className="m-2 flex-col gap-5">
        <input
          type="text"
          placeholder="Filename"
          className="rounded-md p-3"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <div className="my-2 flex gap-2">
          <select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="rounded-md p-3"
          >
            <option value="" disabled>
              Select Year
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            placeholder="Branch"
            className="rounded-md p-3"
          />
        </div>

        {/* Pass tags and setTags to TagInput */}
        <TagInput tags={tags} setTags={setTags} />

        <div className="h-500px w-500px bg-red-600">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || undefined)}
            className="p-3"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
        >
          Submit Form
        </button>
      </form>
    </main>
  );
}
