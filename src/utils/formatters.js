export const formatDuration = (duration) => {
  if (!duration) return '';
  return duration;
};

export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return '0.0';
  return parseFloat(rating).toFixed(1);
};

export const formatStudents = (students) => {
  if (!students) return '0';
  return parseInt(students).toLocaleString();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

