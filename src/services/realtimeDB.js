import { 
  ref, 
  get, 
  set, 
  push, 
  update, 
  remove, 
  onValue, 
  off 
} from 'firebase/database';
import { database } from './firebase';

// Base path for all Gamebridge data
const BASE_PATH = 'Gamebridge_';

// Helper function to get the courses reference
const getCoursesRef = () => ref(database, `${BASE_PATH}courses`);

// Helper function to get a specific course reference
const getCourseRef = (id) => ref(database, `${BASE_PATH}courses/${id}`);

export const realtimeDB = {
  // Get all courses
  getCourses: async () => {
    try {
      const snapshot = await get(getCoursesRef());
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        // Convert object to array, ensuring Firebase key is used as id
        return Object.keys(coursesData).map(key => ({
          ...coursesData[key],
          id: key // Ensure Firebase key is always the id
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get a single course by ID
  getCourse: async (id) => {
    try {
      const snapshot = await get(getCourseRef(id));
      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Create a new course
  createCourse: async (course) => {
    try {
      const coursesRef = getCoursesRef();
      const newCourseRef = push(coursesRef);
      const courseId = newCourseRef.key;
      
      const courseWithId = {
        ...course,
        id: courseId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newCourseRef, courseWithId);
      return courseWithId;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update an existing course
  updateCourse: async (id, updatedCourse) => {
    try {
      const courseRef = getCourseRef(id);
      const snapshot = await get(courseRef);
      
      if (snapshot.exists()) {
        const updates = {
          ...updatedCourse,
          id,
          updatedAt: Date.now()
        };
        
        await update(courseRef, updates);
        return updates;
      }
      throw new Error('Course not found');
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const courseRef = getCourseRef(id);
      await remove(courseRef);
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Duplicate a course
  duplicateCourse: async (id) => {
    try {
      const originalCourse = await realtimeDB.getCourse(id);
      if (!originalCourse) {
        throw new Error('Course not found');
      }

      // Remove the id and create a new one
      const { id: originalId, ...courseData } = originalCourse;
      const duplicatedCourse = {
        ...courseData,
        title: `${courseData.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      return await realtimeDB.createCourse(duplicatedCourse);
    } catch (error) {
      console.error('Error duplicating course:', error);
      throw error;
    }
  },

  // Listen to courses changes (real-time updates)
  subscribeToCourses: (callback) => {
    const coursesRef = getCoursesRef();
    
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        const courses = Object.keys(coursesData).map(key => ({
          ...coursesData[key],
          id: key // Ensure Firebase key is always the id
        }));
        callback(courses);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error('Error listening to courses:', error);
      callback([]);
    });

    // Return unsubscribe function
    return () => {
      off(coursesRef);
    };
  },

  // Listen to a single course changes
  subscribeToCourse: (id, callback) => {
    const courseRef = getCourseRef(id);
    
    const unsubscribe = onValue(courseRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({
          id,
          ...snapshot.val()
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to course:', error);
      callback(null);
    });

    return () => {
      off(courseRef);
    };
  },
};

