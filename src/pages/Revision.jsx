import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTasks } from '../hooks/useTasks';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { format, isSameDay } from 'date-fns';

export const Revision = () => {
  const { tasks } = useTasks();
  const [value, onChange] = useState(new Date());

  const scheduledTasks = tasks.filter(t => t.deadline);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = scheduledTasks.filter(t => isSameDay(new Date(t.deadline), date));
      if (dayTasks.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className={`w-2 h-2 rounded-full ${dayTasks.some(t => t.status === 'Revision') ? 'bg-orange-500 shadow-sm' : 'bg-indigo-500 shadow-sm'}`} />
          </div>
        );
      }
    }
    return null;
  };

  const selectedDayTasks = scheduledTasks.filter(t => isSameDay(new Date(t.deadline), value));

  return (
    <div className="flex flex-col h-full p-8 w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Revision Planner</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule and review your upcoming study sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm dark:shadow-gray-900/20 flex align-center justify-center transition-colors duration-300">
          <Calendar 
            onChange={onChange} 
            value={value} 
            tileContent={tileContent}
            className="w-full border-0 !font-sans rounded-2xl"
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FiCalendar className="text-indigo-600 dark:text-indigo-400" />
            Schedule for {format(value, 'MMMM do, yyyy')}
          </h2>

          {selectedDayTasks.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-600 rounded-[2rem] p-16 text-center">
              <div className="bg-white dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-600">
                <FiClock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">No tasks or revisions scheduled for this day.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Select another day or add tasks to your planner.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayTasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:shadow-md transition-all">
                  <div>
                    <h3 className={`font-bold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest
                        ${task.status === 'Revision' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 
                          task.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        {task.status}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                        <FiClock className="w-4 h-4" />
                        Due {format(new Date(task.deadline), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
