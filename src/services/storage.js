// Local storage service for managing courses data
// In production, this would connect to a backend API

export const storageService = {
  getCourses: () => {
    const courses = localStorage.getItem('courses');
    return courses ? JSON.parse(courses) : [];
  },

  saveCourses: (courses) => {
    localStorage.setItem('courses', JSON.stringify(courses));
  },

  getCourse: (id) => {
    const courses = storageService.getCourses();
    return courses.find(course => course.id === id);
  },

  createCourse: (course) => {
    const courses = storageService.getCourses();
    courses.push(course);
    storageService.saveCourses(courses);
    return course;
  },

  updateCourse: (id, updatedCourse) => {
    const courses = storageService.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updatedCourse };
      storageService.saveCourses(courses);
      return courses[index];
    }
    return null;
  },

  deleteCourse: (id) => {
    const courses = storageService.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    storageService.saveCourses(filtered);
    return true;
  },

  duplicateCourse: (id) => {
    const course = storageService.getCourse(id);
    if (course) {
      const duplicated = {
        ...course,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: `${course.title} (Copy)`,
      };
      return storageService.createCourse(duplicated);
    }
    return null;
  },
};

