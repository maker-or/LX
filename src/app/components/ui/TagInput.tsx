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
      <div className='flex mb-2 mt-6 gap-2'>
        {tags.map((tag, index) => (
          <div
            className='bg-blue-600 text-white rounded-md p-4'
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
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press space..."
        className='p-5 mb-4 rounded-md'
      />
    </div>
  );
};

export default TagInput;
