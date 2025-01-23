// // src/FileUpload.tsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const Fiie = () => {
//     const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/convert',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       setPdfUrl(response.data.pdfUrl);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div>
//          <div>
//       <h1>Upload Word or PowerPoint File</h1>
//       <input type="file" accept=".docx,.pptx" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? 'Converting...' : 'Convert to PDF'}
//       </button>
//       {pdfUrl && (
//         <div>
//           <h2>Download PDF</h2>
//           <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
//             Download PDF
//           </a>
//         </div>
//       )}
//     </div>
//     </div>
//   )
// }

// export default File
