import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterThreadsByCategory } from '../features/threadsSlice';

function CategoryFilter() {
  const dispatch = useDispatch();
  const { threads, activeCategory } = useSelector((state) => state.threads);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Extract unique categories from threads
    if (threads.length > 0) {
      const uniqueCategories = [...new Set(threads
        .filter((thread) => thread.category)
        .map((thread) => thread.category))];
      setCategories(uniqueCategories);
    }
  }, [threads]);

  const handleCategoryChange = (category) => {
    dispatch(filterThreadsByCategory(category));
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold mb-3 text-gray-800 flex items-center">
        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Filter Kategori
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === 'all' || !activeCategory 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            #{category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;