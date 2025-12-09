import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseList } from '../components/courses/CourseList';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { useCourses } from '../hooks/useCourses';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const Courses = () => {
  const navigate = useNavigate();
  const { courses, loading, deleteCourse, duplicateCourse } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumFilter, setPremiumFilter] = useState('');
  const [trendyFilter, setTrendyFilter] = useState('');

  const handleEdit = (course) => {
    navigate(`/courses/${course.id}/edit`);
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      await deleteCourse(course.id);
    }
  };

  const handleDuplicate = async (course) => {
    await duplicateCourse(course.id);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPremium = !premiumFilter || 
      (premiumFilter === 'premium' && course.isPremium) ||
      (premiumFilter === 'free' && !course.isPremium);
    const matchesTrendy = !trendyFilter ||
      (trendyFilter === 'trendy' && course.isTrendy) ||
      (trendyFilter === 'not-trendy' && !course.isTrendy);

    return matchesSearch && matchesPremium && matchesTrendy;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Courses
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Manage your courses, modules, and content
          </p>
        </div>
        <Button onClick={() => navigate('/courses/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card rounded-card p-4 border border-light-border dark:border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Select
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'premium', label: 'Premium' },
              { value: 'free', label: 'Free' },
            ]}
            placeholder="Type"
          />

          <Select
            value={trendyFilter}
            onChange={(e) => setTrendyFilter(e.target.value)}
            options={[
              { value: '', label: 'All' },
              { value: 'trendy', label: 'Trendy' },
              { value: 'not-trendy', label: 'Not Trendy' },
            ]}
            placeholder="Status"
          />
        </div>
      </div>

      {/* Course List */}
      <div>
        <div className="mb-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
        <CourseList
          courses={filteredCourses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </div>
    </div>
  );
};

