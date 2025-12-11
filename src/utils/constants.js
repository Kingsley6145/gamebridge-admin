export const CATEGORIES = [
  'UI/UX',
  'Game Development',
  'AI',
  'Web Development',
  'Programming'
];

export const FILE_LIMITS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    types: ['image/png', 'image/jpeg', 'image/jpg']
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    types: ['video/mp4']
  },
  html: {
    maxSize: 10 * 1024 * 1024, // 10MB
    types: ['text/html', 'text/plain'] // Accept HTML files
  }
};

export const VALIDATION_RULES = {
  course: {
    title: { min: 3, max: 100 },
    description: { min: 20 },
    rating: { min: 0, max: 5 },
    students: { min: 0 }
  },
  module: {
    title: { min: 3, max: 100 },
    markdown: { min: 50 }
  },
  question: {
    question: { min: 10 },
    options: { min: 2, count: 4 }
  }
};

