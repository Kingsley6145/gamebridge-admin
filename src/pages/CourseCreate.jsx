import { useNavigate } from 'react-router-dom';
import { CourseForm } from '../components/courses/CourseForm';
import { useCourses } from '../hooks/useCourses';

export const CourseCreate = () => {
  const navigate = useNavigate();
  const { createCourse } = useCourses();

  const handleSubmit = async (courseData, imageFile) => {
    try {
      await createCourse(courseData, imageFile);
      navigate('/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Create New Course
        </h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          Fill in the details to create a new course
        </p>
      </div>

      <div className="bg-light-card dark:bg-dark-card rounded-card p-6 border border-light-border dark:border-dark-border">
        <CourseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

