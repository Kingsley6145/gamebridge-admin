import axios from 'axios';
import { realtimeDB } from './realtimeDB';
import { fileService } from './fileService';

// API base URL - in production, this would be your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Use Firebase Realtime Database by default, fallback to API if URL is provided
const USE_FIREBASE_REALTIME = !import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Courses API
  courses: {
    getAll: async () => {
      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.getCourses();
      }
      const response = await axios.get(`${API_BASE_URL}/courses`);
      return response.data;
    },

    getById: async (id) => {
      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.getCourse(id);
      }
      const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
      return response.data;
    },

    create: async (courseData, imageFile) => {
      let coverImage = courseData.coverImage;
      
      if (imageFile) {
        coverImage = await fileService.uploadImage(imageFile);
      }

      const course = {
        ...courseData,
        coverImage,
      };

      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.createCourse(course);
      }
      const response = await axios.post(`${API_BASE_URL}/courses`, course);
      return response.data;
    },

    update: async (id, courseData, imageFile) => {
      let coverImage = courseData.coverImage;
      
      if (imageFile) {
        coverImage = await fileService.uploadImage(imageFile);
      }

      const course = {
        ...courseData,
        coverImage,
      };

      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.updateCourse(id, course);
      }
      const response = await axios.put(`${API_BASE_URL}/courses/${id}`, course);
      return response.data;
    },

    delete: async (id) => {
      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.deleteCourse(id);
      }
      const response = await axios.delete(`${API_BASE_URL}/courses/${id}`);
      return response.data;
    },

    duplicate: async (id) => {
      if (USE_FIREBASE_REALTIME) {
        return realtimeDB.duplicateCourse(id);
      }
      const response = await axios.post(`${API_BASE_URL}/courses/${id}/duplicate`);
      return response.data;
    },
  },

  // Modules API
  modules: {
    create: async (courseId, moduleData, videoFile) => {
      let videoUrl = moduleData.videoUrl;
      
      if (videoFile) {
        videoUrl = await fileService.uploadVideo(videoFile);
      }

      const module = {
        ...moduleData,
        videoUrl,
      };

      // In a real app, this would be a separate API call
      const course = await api.courses.getById(courseId);
      if (course) {
        course.modules = course.modules || [];
        course.modules.push(module);
        return api.courses.update(courseId, course);
      }
      return null;
    },

    update: async (courseId, moduleId, moduleData, videoFile) => {
      let videoUrl = moduleData.videoUrl;
      
      if (videoFile) {
        videoUrl = await fileService.uploadVideo(videoFile);
      }

      const module = {
        ...moduleData,
        videoUrl,
      };

      const course = await api.courses.getById(courseId);
      if (course) {
        course.modules = course.modules || [];
        const index = course.modules.findIndex(m => m.id === moduleId);
        if (index !== -1) {
          course.modules[index] = module;
          return api.courses.update(courseId, course);
        }
      }
      return null;
    },

    delete: async (courseId, moduleId) => {
      const course = await api.courses.getById(courseId);
      if (course) {
        course.modules = course.modules.filter(m => m.id !== moduleId);
        return api.courses.update(courseId, course);
      }
      return null;
    },
  },

  // Questions API
  questions: {
    create: async (courseId, questionData) => {
      const course = await api.courses.getById(courseId);
      if (course) {
        course.questions = course.questions || [];
        course.questions.push(questionData);
        return api.courses.update(courseId, course);
      }
      return null;
    },

    update: async (courseId, questionId, questionData) => {
      const course = await api.courses.getById(courseId);
      if (course) {
        course.questions = course.questions || [];
        const index = course.questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
          course.questions[index] = questionData;
          return api.courses.update(courseId, course);
        }
      }
      return null;
    },

    delete: async (courseId, questionId) => {
      const course = await api.courses.getById(courseId);
      if (course) {
        course.questions = course.questions.filter(q => q.id !== questionId);
        return api.courses.update(courseId, course);
      }
      return null;
    },
  },
};

