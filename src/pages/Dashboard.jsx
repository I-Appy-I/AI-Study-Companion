import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { useTheme } from '../context/ThemeContext';
import { FiCheckCircle, FiClock, FiCalendar, FiTarget } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

export const Dashboard = () => {
  const { totalTasks, completedTasks, pendingTasks, revisionTasks, completionPercentage, subjectProgress, weeklyData } = useProgress();
  const { isDark } = useTheme();

  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const tickColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : 'transparent';

  const statCards = [
    { title: 'Total Tasks', value: totalTasks, icon: <FiTarget className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />, bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { title: 'Completed', value: completedTasks, icon: <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />, bg: 'bg-green-50 dark:bg-green-900/30' },
    { title: 'Pending', value: pendingTasks, icon: <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />, bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { title: 'To Revise', value: revisionTasks, icon: <FiCalendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />, bg: 'bg-orange-50 dark:bg-orange-900/30' }
  ];

  return (
    <div className="flex flex-col h-full p-8 w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here is a summary of your study progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 relative">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Subject Progress (%)</h2>
          {subjectProgress.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
              No subject data available
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: isDark ? '#374151' : '#F3F4F6' }}
                    contentStyle={{ borderRadius: '16px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: isDark ? '#e5e7eb' : '#111827' }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 8, 8]} maxBarSize={45}>
                    {subjectProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isDark ? '#818cf8' : '#4f46e5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 relative">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Weekly Target</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: isDark ? '#e5e7eb' : '#111827' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#9ca3af' : undefined }} />
                <Line type="monotone" dataKey="completed" name="Done" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="pending" name="Due" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 w-full text-left">Overall Completion</h2>
          <div className="relative w-56 h-56 mt-6 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-gray-100 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-in-out"
                strokeDasharray={`${completionPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-900 dark:text-gray-50 tracking-tighter">{completionPercentage}%</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Completed</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-8 text-sm font-medium leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
            {completionPercentage >= 100 ? "Amazing! You've completed all tasks! Time to set new goals." : 
             completionPercentage > 50 ? "Great job! You're more than halfway there! Keep the momentum going." : 
             "You've got this! Keep chipping away at those tasks one by one."}
          </p>
        </div>
      </div>
    </div>
  );
};
