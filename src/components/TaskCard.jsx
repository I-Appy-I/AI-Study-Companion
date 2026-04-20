import React from 'react';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

export const TaskCard = ({ task, subject, topic, onUpdateStatus, onDelete }) => {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date(new Date().setHours(0,0,0,0)) && task.status !== 'Completed';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 border p-5 flex flex-col hover:shadow-md transition-all relative group
      ${isOverdue ? 'border-red-200 dark:border-red-800/50 bg-red-50/30 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-700'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col pr-4">
          <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">
            {subject?.name || 'No Subject'} {topic ? `› ${topic.name}` : ''}
          </span>
          <h3 className={`text-lg font-bold leading-tight ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center shrink-0">
          {task.priority === 'High' && <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase">High</span>}
          {task.priority === 'Medium' && <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase">Med</span>}
          {task.priority === 'Low' && <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase">Low</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5 mt-auto">
        {task.deadline && (
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'font-medium'}`}>
            <FiCalendar className="w-4 h-4" />
            {format(new Date(task.deadline), 'MMM dd, yyyy')}
            {isOverdue && <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Overdue</span>}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <select 
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value)}
          className={`text-sm rounded-lg px-2.5 py-1.5 font-semibold border-0 cursor-pointer outline-none ring-1 ring-inset transition-colors
            ${task.status === 'Completed' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-200 dark:ring-green-800 hover:bg-green-100 dark:hover:bg-green-900/50' : 
              task.status === 'Revision' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-orange-200 dark:ring-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50' : 
              'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-gray-200 dark:ring-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Revision">Revision</option>
        </select>
        
        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
          title="Delete Task"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
