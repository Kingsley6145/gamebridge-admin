import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { realtimeDB } from '../services/realtimeDB';
import toast from 'react-hot-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.courses.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use real-time listener for Firebase Realtime Database
    const USE_FIREBASE_REALTIME = !import.meta.env.VITE_API_BASE_URL;
    
    if (USE_FIREBASE_REALTIME) {
      // Set initial loading state
      setLoading(true);
      
      // Subscribe to real-time updates
      const unsubscribe = realtimeDB.subscribeToCourses((updatedCourses) => {
        setCourses(updatedCourses);
        setLoading(false);
        setError(null);
      });

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    } else {
      // Fallback to regular fetch for API mode
      fetchCourses();
    }
  }, []);

  const createCourse = async (courseData, imageFile) => {
    try {
      const course = await api.courses.create(courseData, imageFile);
      setCourses(prev => [...prev, course]);
      toast.success('Course created successfully');
      return course;
    } catch (err) {
      toast.error('Failed to create course');
      throw err;
    }
  };

  const updateCourse = async (id, courseData, imageFile) => {
    try {
      const course = await api.courses.update(id, courseData, imageFile);
      setCourses(prev => prev.map(c => c.id === id ? course : c));
      toast.success('Course updated successfully');
      return course;
    } catch (err) {
      toast.error('Failed to update course');
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await api.courses.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Course deleted successfully');
    } catch (err) {
      toast.error('Failed to delete course');
      throw err;
    }
  };

  const duplicateCourse = async (id) => {
    try {
      const course = await api.courses.duplicate(id);
      setCourses(prev => [...prev, course]);
      toast.success('Course duplicated successfully');
      return course;
    } catch (err) {
      toast.error('Failed to duplicate course');
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    duplicateCourse,
    refetch: fetchCourses,
  };
};

