import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = () => {
  const { tasks, setTasks } = useContext(StudyContext);

  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), status: task.status || 'Pending' };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getTasksByTab = (tab = 'All') => {
    switch(tab) {
      case 'Pending':
        return tasks.filter(t => t.status === 'Pending');
      case 'Completed':
        return tasks.filter(t => t.status === 'Completed');
      case 'Overdue': {
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(t => t.status !== 'Completed' && t.deadline && t.deadline < today);
      }
      case 'Revision':
        return tasks.filter(t => t.status === 'Revision');
      default:
        return tasks;
    }
  };

  return { tasks, addTask, updateTask, deleteTask, getTasksByTab };
};
