import { VALIDATION_RULES, FILE_LIMITS } from './constants';

export const validateCourse = (course) => {
  const errors = {};

  // Title validation
  if (!course.title || course.title.trim().length < VALIDATION_RULES.course.title.min) {
    errors.title = `Title must be at least ${VALIDATION_RULES.course.title.min} characters`;
  }
  if (course.title && course.title.length > VALIDATION_RULES.course.title.max) {
    errors.title = `Title must be less than ${VALIDATION_RULES.course.title.max} characters`;
  }

  // Duration validation
  if (!course.duration || !/^\d+h\s\d+min$/.test(course.duration)) {
    errors.duration = 'Duration must be in format "Xh Ymin" (e.g., "2h 46min")';
  }

  // Rating validation
  const rating = parseFloat(course.rating);
  if (isNaN(rating) || rating < VALIDATION_RULES.course.rating.min || rating > VALIDATION_RULES.course.rating.max) {
    errors.rating = `Rating must be between ${VALIDATION_RULES.course.rating.min} and ${VALIDATION_RULES.course.rating.max}`;
  }

  // Students validation
  const students = parseInt(course.students);
  if (isNaN(students) || students < VALIDATION_RULES.course.students.min) {
    errors.students = `Students count must be at least ${VALIDATION_RULES.course.students.min}`;
  }

  // Cover image validation
  if (!course.coverImage) {
    errors.coverImage = 'Cover image is required';
  }

  return errors;
};

export const validateModule = (module) => {
  const errors = {};

  // Title validation
  if (!module.title || module.title.trim().length < VALIDATION_RULES.module.title.min) {
    errors.title = `Title must be at least ${VALIDATION_RULES.module.title.min} characters`;
  }

  // Duration validation
  if (!module.duration || !/^\d+:\d+\s+mins$/.test(module.duration)) {
    errors.duration = 'Duration must be in format "X:XX mins" (e.g., "4:28 mins")';
  }

  // Icon color validation
  if (!module.iconColor) {
    errors.iconColor = 'Icon color is required';
  }

  // Video validation
  if (!module.videoUrl) {
    errors.videoUrl = 'Video is required';
  }

  // Markdown validation
  if (!module.markdownDescription || module.markdownDescription.trim().length < VALIDATION_RULES.module.markdown) {
    errors.markdownDescription = `Description must be at least ${VALIDATION_RULES.module.markdown} characters`;
  }

  return errors;
};

export const validateQuestion = (question) => {
  const errors = {};

  // Question text validation
  if (!question.question || question.question.trim().length < VALIDATION_RULES.question.question.min) {
    errors.question = `Question must be at least ${VALIDATION_RULES.question.question.min} characters`;
  }

  // Options validation
  if (!question.options || question.options.length !== VALIDATION_RULES.question.options.count) {
    errors.options = `Exactly ${VALIDATION_RULES.question.options.count} options are required`;
  } else {
    question.options.forEach((option, index) => {
      if (!option || option.trim().length < VALIDATION_RULES.question.options.min) {
        errors[`option${index}`] = `Option ${index + 1} must be at least ${VALIDATION_RULES.question.options.min} characters`;
      }
    });
  }

  // Correct answer validation
  if (question.correctAnswerIndex === undefined || question.correctAnswerIndex === null) {
    errors.correctAnswerIndex = 'Please select the correct answer';
  }

  return errors;
};

export const validateFile = (file, type) => {
  const errors = {};
  const limits = type === 'image' 
    ? FILE_LIMITS.image 
    : type === 'video' 
    ? FILE_LIMITS.video 
    : type === 'html'
    ? FILE_LIMITS.html
    : FILE_LIMITS.image; // Default to image

  if (!file) {
    errors.file = 'File is required';
    return errors;
  }

  // File type validation - for HTML, also check file extension
  if (type === 'html') {
    const isHtmlFile = limits.types.includes(file.type) || 
                      file.name.toLowerCase().endsWith('.html') ||
                      file.name.toLowerCase().endsWith('.htm');
    if (!isHtmlFile) {
      errors.file = 'File must be an HTML file (.html or .htm)';
    }
  } else if (!limits.types.includes(file.type)) {
    errors.file = `File must be one of: ${limits.types.join(', ')}`;
  }

  // File size validation
  if (file.size > limits.maxSize) {
    const maxSizeMB = limits.maxSize / (1024 * 1024);
    errors.file = `File size must be less than ${maxSizeMB}MB`;
  }

  return errors;
};

