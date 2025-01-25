// 'use client';

// import { Globe } from 'lucide-react';
// import { useState } from "react";
// import { useChat } from 'ai/react';

// interface WebButtonProps {
//   content: string;
// }

// const Webbutton = ({ content }: WebButtonProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { append } = useChat({
//     api: '/api/search', // Ensure this matches your route handler

//   });

//   const handleSearchWeb = async () => {
//     if (!content || typeof content !== 'string') {
//       console.error('Invalid content:', content);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Removed the append call
//       // await append({
//       //   role: 'user',
//       //   content: content.trim(),
//       // });
//     } catch (error) {
//       console.error('Web search error:', error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='flex items-center justify-center bg-[#4544449d] text-white px-2 rounded-full hover:bg-blue-500'>
//       <button
//         onClick={handleSearchWeb}
//         className="flex-col px-4 py-2 text-white rounded-lg"
//         disabled={isLoading || !content.trim()} // Disable if content is empty
//       >
//         Web
//       </button>
//       <Globe />
//     </div>
//   );
// };

// export default Webbutton;