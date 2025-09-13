import React from 'react';
import { FaUser } from 'react-icons/fa';

function Avatar({ src, alt, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // If src is undefined or null, render a default avatar
  if (!src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200`}>
        <FaUser className="text-gray-600" style={{ width: '60%', height: '60%' }} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'User avatar'}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = ''; // Clear the src to prevent infinite error loop
        // Replace with a div containing the user icon
        const parent = e.target.parentNode;
        if (parent) {
          const div = document.createElement('div');
          div.className = `${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200`;
          div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="text-gray-600" style="width: 60%; height: 60%;"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
          parent.replaceChild(div, e.target);
        }
      }}
    />
  );
}

export default Avatar;