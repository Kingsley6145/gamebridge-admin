import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { formatStudents, formatRating } from '../utils/formatters';

export const Dashboard = () => {
  const { courses, loading } = useCourses();

  const stats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.students || 0), 0),
    averageRating: courses.length > 0
      ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length
      : 0,
    trendyCourses: courses.filter(course => course.isTrendy).length,
  };

  const statCards = [
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'primary',
    },
    {
      label: 'Total Students',
      value: formatStudents(stats.totalStudents),
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Average Rating',
      value: formatRating(stats.averageRating),
      icon: Star,
      color: 'yellow',
    },
    {
      label: 'Trendy Courses',
      value: stats.trendyCourses,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Dashboard
        </h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          Welcome to Gamebridge Admin Panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-light-card dark:bg-dark-card rounded-card p-6 border border-light-border dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color === 'primary' ? '#BA1E4D' : stat.color === 'blue' ? '#4A90E2' : stat.color === 'yellow' ? '#FFC107' : '#FF6B35'}20` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: stat.color === 'primary' ? '#BA1E4D' : stat.color === 'blue' ? '#4A90E2' : stat.color === 'yellow' ? '#FFC107' : '#FF6B35' }}
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-light-card dark:bg-dark-card rounded-card p-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          Recent Courses
        </h2>
        {courses.length === 0 ? (
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            No courses yet. Create your first course to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-bg rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {course.coverImage ? (
                    <img 
                      src={course.coverImage}
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary" />
                  )}
                  <div>
                    <h3 className="font-medium text-light-text dark:text-dark-text">
                      {course.title}
                    </h3>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      {course.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    {formatRating(course.rating)} ⭐
                  </span>
                  <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    {formatStudents(course.students)} students
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

