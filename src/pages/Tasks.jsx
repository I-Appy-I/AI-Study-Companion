import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiPlus, FiFilter } from 'react-icons/fi';

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subjectId: yup.string().required('Subject is required'),
  topicId: yup.string(),
  deadline: yup.string().required('Deadline is required'),
  priority: yup.string().oneOf(['Low', 'Medium', 'High']).default('Medium'),
});

const TABS = ['All', 'Pending', 'Completed', 'Overdue', 'Revision'];

export const Tasks = () => {
  const { getTasksByTab, addTask, updateTask, deleteTask } = useTasks();
  const { subjects, getTopicsBySubject } = useSubjects();
  
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  
  // Search, Filter, Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDeadline, setFilterDeadline] = useState('');

  const form = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { priority: 'Medium' }
  });

  const onSubmit = (data) => {
    addTask(data);
    setIsModalOpen(false);
    form.reset();
    setSelectedSubjectId('');
  };

  let tasks = getTasksByTab(activeTab);
  
  // Apply Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q));
  }

  // Apply Filters
  if (filterSubject) tasks = tasks.filter(t => t.subjectId === filterSubject);
  if (filterPriority) tasks = tasks.filter(t => t.priority === filterPriority);
  if (filterDeadline) {
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    const today = todayDate.getTime();
    
    tasks = tasks.filter(t => {
      if (!t.deadline && filterDeadline !== 'any') return false;
      const tDate = new Date(t.deadline).getTime();
      const diffDays = Math.ceil((tDate - today) / (1000 * 60 * 60 * 24));
      
      if (filterDeadline === 'overdue') return diffDays < 0 && t.status !== 'Completed';
      if (filterDeadline === 'next_2') return diffDays >= 0 && diffDays <= 2;
      if (filterDeadline === 'next_5') return diffDays >= 0 && diffDays <= 5;
      if (filterDeadline === 'this_week') return diffDays >= 0 && diffDays <= 7;
      return true;
    });
  }

  // Apply Sort
  tasks.sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'priority') {
      const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return p[b.priority] - p[a.priority];
    }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const subjectTopics = selectedSubjectId ? getTopicsBySubject(selectedSubjectId) : [];

  return (
    <div className="flex flex-col h-full p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Study Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage what you need to study and review.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all w-full md:w-auto shrink-0"
        >
          <FiPlus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 bg-gray-100/50 dark:bg-gray-800 p-1.5 rounded-2xl w-full lg:w-fit border border-gray-200/50 dark:border-gray-700 transition-colors">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex-1 lg:flex-none ${
                activeTab === tab 
                  ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-72">
          <input 
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm pl-10 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-2 mr-2 flex items-center gap-1.5">
          <FiFilter className="w-4 h-4" /> Filters
        </div>
        
        <select 
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select 
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select 
          value={filterDeadline}
          onChange={(e) => setFilterDeadline(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="">Any Deadline</option>
          <option value="overdue">Overdue</option>
          <option value="next_2">Next 2 days</option>
          <option value="next_5">Next 5 days</option>
          <option value="this_week">This week</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Sort:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="deadline">Date</option>
            <option value="priority">Priority</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm border-dashed p-12 mt-4 text-center transition-colors">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No {activeTab.toLowerCase()} tasks</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">You're all caught up! Create a new task or check your other tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
          {tasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const topic = subject ? getTopicsBySubject(subject.id).find(t => t.id === task.topicId) : null;
            return (
              <TaskCard 
                key={task.id} 
                task={task} 
                subject={subject}
                topic={topic}
                onUpdateStatus={(id, status) => updateTask(id, { status })}
                onDelete={deleteTask}
              />
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Study Task">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Task Title</label>
            <input 
              {...form.register('title')} 
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              placeholder="e.g. Solve 10 Binary Tree problems"
            />
            {form.formState.errors.title && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{form.formState.errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
              <select 
                {...form.register('subjectId')}
                onChange={(e) => {
                  form.setValue('subjectId', e.target.value);
                  setSelectedSubjectId(e.target.value);
                }}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none flex tracking-wide transition-all"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {form.formState.errors.subjectId && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{form.formState.errors.subjectId.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Topic</label>
              <select 
                {...form.register('topicId')}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                disabled={!selectedSubjectId || subjectTopics.length === 0}
              >
                <option value="">Select Topic</option>
                {subjectTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Deadline</label>
              <input 
                type="date"
                {...form.register('deadline')}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              {form.formState.errors.deadline && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{form.formState.errors.deadline.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
              <select 
                {...form.register('priority')}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 mt-2">
            Create Task
          </button>
        </form>
      </Modal>
    </div>
  );
};

// Extracted placeholder icon to avoid import issues
const FiCheckCircle = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
