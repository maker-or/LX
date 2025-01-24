// components/TagInput.tsx
import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault(); // Prevent space from being added to input
      if (inputValue.trim()) {
        setTags((prevTags) => [...prevTags, inputValue.trim()]);
        setInputValue(''); // Clear input after adding tag
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDelete = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press space..."
        className='w-full border-b border-gray-300 bg-inherit text-2xl  text-[#0c0c0c] outline-none mt-8'
      />

<div className='flex mb-2 mt-6 justify-start gap-4'>
        {tags.map((tag, index) => (
          <div
            className='bg-blue-600 text-white rounded-md px-6 py-2'
            key={index}
          >
            {tag}
            <button
              className='ml-[5px] text-white cursor-pointer'
              onClick={() => handleDelete(tag)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
