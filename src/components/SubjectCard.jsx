import React from 'react';
import { FiBookOpen, FiTrash2, FiPlus } from 'react-icons/fi';

export const SubjectCard = ({ subject, topicsCount = 0, onManage, onDelete }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 p-6 overflow-hidden hover:shadow-md transition-all relative group"
      style={{ borderLeft: `6px solid ${subject.color || '#4f46e5'}` }}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
            <FiBookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">{subject.name}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium shadow-inner whitespace-nowrap">
            {topicsCount} {topicsCount === 1 ? 'Topic' : 'Topics'}
          </span>
          <button 
            onClick={() => onDelete(subject.id)}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="Delete Subject"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {subject.description || 'No description provided.'}
      </p>
      <div className="flex justify-between items-center border-t border-gray-50 dark:border-gray-700 pt-4">
        <button 
          onClick={() => onManage(subject)}
          className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          Manage Topics &rarr;
        </button>
      </div>
    </div>
  );
};
