import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Sidebar } from './components/Sidebar';
import { DarkModeToggle } from './components/DarkModeToggle';
import { useTheme } from './context/ThemeContext';

import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';
import { Tasks } from './pages/Tasks';
import { Revision } from './pages/Revision';
import { AITools } from './pages/AITools';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 flex-row overflow-hidden transition-colors duration-300">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/30 flex items-center justify-between px-6 transition-colors duration-300 border-b border-transparent dark:border-gray-700/50">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Welcome Back!</span>
          <DarkModeToggle />
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const { isDark } = useTheme();

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/ai-tools" element={<AITools />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ToastContainer position="bottom-right" theme={isDark ? 'dark' : 'light'} />
    </>
  );
}

export default App;
