import React, { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { SubjectCard } from '../components/SubjectCard';
import { Modal } from '../components/Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiPlus, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

const subjectSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  color: yup.string().default('#4f46e5')
});

const topicSchema = yup.object().shape({
  name: yup.string().required('Topic name is required'),
  difficulty: yup.string().oneOf(['Easy', 'Medium', 'Hard']).default('Medium'),
  status: yup.string().oneOf(['Not Started', 'In Progress', 'Completed', 'Needs Revision']).default('Not Started'),
  notes: yup.string()
});

export const Subjects = () => {
  const { subjects, addSubject, deleteSubject, topics, addTopic, deleteTopic, getTopicsBySubject } = useSubjects();
  
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjectForm = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: { color: '#4f46e5' }
  });

  const topicForm = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: { difficulty: 'Medium', status: 'Not Started' }
  });

  const onSubjectSubmit = (data) => {
    addSubject(data);
    setIsSubjectModalOpen(false);
    subjectForm.reset();
  };

  const onTopicSubmit = (data) => {
    if (selectedSubject) {
      addTopic({ ...data, subjectId: selectedSubject.id });
      setIsTopicModalOpen(false);
      topicForm.reset();
    }
  };

  const handleDeleteSubject = (id) => {
    if(window.confirm('Are you sure you want to delete this subject and all its topics/tasks?')) {
      deleteSubject(id);
      if(selectedSubject?.id === id) setSelectedSubject(null);
    }
  };

  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  if (selectedSubject) {
    let subjectTopics = getTopicsBySubject(selectedSubject.id);
    if (topicSearchQuery) {
      const q = topicSearchQuery.toLowerCase();
      subjectTopics = subjectTopics.filter(t => 
        t.name.toLowerCase().includes(q) || 
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    return (
      <div className="flex flex-col h-full p-8 w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 text-gray-800 dark:text-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setSelectedSubject(null); setTopicSearchQuery(''); }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold">{selectedSubject.name} <span className="text-xl text-gray-400 dark:text-gray-500 font-medium ml-2">Topics</span></h1>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative w-64">
              <input 
                type="text"
                placeholder="Search topics or notes..."
                value={topicSearchQuery}
                onChange={(e) => setTopicSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm pl-10 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => setIsTopicModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              Add Topic
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors">
          {subjectTopics.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="mb-4 text-lg">No topics added yet.</p>
              <button 
                onClick={() => setIsTopicModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Create your first topic &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectTopics.map(topic => (
                <div key={topic.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-900/30 group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{topic.name}</h3>
                    <button 
                      onClick={() => deleteTopic(topic.id)} 
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm tracking-wider
                      ${topic.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                        topic.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                      {topic.difficulty}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm tracking-wider
                      ${topic.status === 'Completed' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 
                        topic.status === 'Needs Revision' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      {topic.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{topic.notes || 'No notes available.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title="Add New Topic">
          <form onSubmit={topicForm.handleSubmit(onTopicSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Topic Name</label>
              <input 
                {...topicForm.register('name')} 
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                placeholder="e.g. Binary Trees"
              />
              {topicForm.formState.errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{topicForm.formState.errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                <select 
                  {...topicForm.register('difficulty')}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select 
                  {...topicForm.register('status')}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
              <textarea 
                {...topicForm.register('notes')} 
                rows="4"
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                placeholder="Initial thoughts or summary"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2">
              Save Topic
            </button>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Your Subjects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize your study materials.</p>
        </div>
        <button 
          onClick={() => setIsSubjectModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
        >
          <FiPlus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm border-dashed p-12 transition-colors">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FiPlus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">No subjects yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-center leading-relaxed">Let's create your first subject to organize your study plan and attach relevant topics.</p>
          <button 
            onClick={() => setIsSubjectModalOpen(true)}
            className="text-white bg-gray-900 hover:bg-gray-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
          >
            Create Subject Configuration &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map(subject => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              topicsCount={getTopicsBySubject(subject.id).length}
              onManage={(sub) => setSelectedSubject(sub)}
              onDelete={handleDeleteSubject}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Add New Subject">
        <form onSubmit={subjectForm.handleSubmit(onSubjectSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject Name</label>
            <input 
              {...subjectForm.register('name')} 
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              placeholder="e.g. Database Systems"
            />
            {subjectForm.formState.errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{subjectForm.formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea 
              {...subjectForm.register('description')} 
              rows="3"
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              placeholder="Brief summary of the subject"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Color Label</label>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 border border-gray-200 dark:border-gray-600">
              <input 
                type="color" 
                {...subjectForm.register('color')}
                className="h-10 w-12 border-0 rounded-lg cursor-pointer bg-transparent p-0"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Choose a color for better tracking</span>
            </div>
          </div>
          <div className="pt-2 mt-2">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5">
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
