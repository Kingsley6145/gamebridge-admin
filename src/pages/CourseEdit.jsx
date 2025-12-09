import { useNavigate, useParams } from 'react-router-dom';
import { CourseForm } from '../components/courses/CourseForm';
import { useCourses } from '../hooks/useCourses';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export const CourseEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateCourse } = useCourses();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.courses.getById(id);
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleSubmit = async (courseData, imageFile) => {
    try {
      await updateCourse(id, courseData, imageFile);
      navigate('/courses');
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          Course not found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Edit Course
        </h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          Update course details and content
        </p>
      </div>

      <div className="bg-light-card dark:bg-dark-card rounded-card p-6 border border-light-border dark:border-dark-border">
        <CourseForm
          course={course}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

