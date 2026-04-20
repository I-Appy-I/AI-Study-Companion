import { NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiCheckSquare, FiCalendar, FiCpu } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Subjects', path: '/subjects', icon: <FiBook className="w-5 h-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <FiCheckSquare className="w-5 h-5" /> },
  { name: 'Revision', path: '/revision', icon: <FiCalendar className="w-5 h-5" /> },
  { name: 'AI Tools', path: '/ai-tools', icon: <FiCpu className="w-5 h-5" /> }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/40 h-full flex flex-col pt-6 z-10 transition-colors duration-300 border-r border-transparent dark:border-gray-700/50">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <FiBook className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Study<span className="text-indigo-600 dark:text-indigo-400">Sync</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm font-semibold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center">AI Study Companion v1.0</div>
      </div>
    </aside>
  );
};
