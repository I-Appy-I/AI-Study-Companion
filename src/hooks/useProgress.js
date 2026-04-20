import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';

export const useProgress = () => {
  const { tasks, subjects } = useContext(StudyContext);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const revisionTasks = tasks.filter(t => t.status === 'Revision').length;
  
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const subjectProgress = subjects.map(sub => {
    const subTasks = tasks.filter(t => t.subjectId === sub.id);
    const subCompleted = subTasks.filter(t => t.status === 'Completed').length;
    return {
      name: sub.name,
      total: subTasks.length,
      completed: subCompleted,
      percentage: subTasks.length === 0 ? 0 : Math.round((subCompleted / subTasks.length) * 100)
    };
  });

  // Weekly Productivity Data
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0,0,0,0);
    return d;
  });

  const weeklyData = last7Days.map(date => {
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTime = date.getTime();
    
    let completed = 0;
    let pending = 0;
    
    tasks.forEach(t => {
      if (!t.deadline) return;
      const tTime = new Date(t.deadline).getTime();
      if (tTime === dayTime) {
        if (t.status === 'Completed') completed++;
        else pending++;
      }
    });

    return {
      day: dayStr,
      completed,
      pending
    };
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    revisionTasks,
    completionPercentage,
    subjectProgress,
    weeklyData
  };
};
