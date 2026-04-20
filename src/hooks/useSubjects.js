import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import { v4 as uuidv4 } from 'uuid';

export const useSubjects = () => {
  const { subjects, setSubjects, topics, setTopics, tasks, setTasks } = useContext(StudyContext);

  const addSubject = (subject) => {
    const newSubject = { ...subject, id: uuidv4() };
    setSubjects([...subjects, newSubject]);
    return newSubject;
  };

  const updateSubject = (id, updatedFields) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    // Also delete associated topics and tasks
    setTopics(topics.filter(t => t.subjectId !== id));
    setTasks(tasks.filter(t => t.subjectId !== id));
  };

  const addTopic = (topic) => {
    const newTopic = { ...topic, id: uuidv4() };
    setTopics([...topics, newTopic]);
    return newTopic;
  };

  const updateTopic = (id, updatedFields) => {
    setTopics(topics.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id));
    setTasks(tasks.filter(t => t.topicId !== id));
  };

  const getTopicsBySubject = (subjectId) => {
    return topics.filter(t => t.subjectId === subjectId);
  };

  return {
    subjects,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    getTopicsBySubject
  };
};
