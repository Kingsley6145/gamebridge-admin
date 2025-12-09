import { Edit, Trash2, Copy, Star, Users, Clock } from 'lucide-react';
import { formatRating, formatStudents } from '../../utils/formatters';

export const CourseCard = ({ course, onEdit, onDelete, onDuplicate }) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-card p-6 border border-light-border dark:border-dark-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              {course.title}
            </h3>
            {course.isPremium && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow text-white rounded">
                Premium
              </span>
            )}
            {course.isTrendy && (
              <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded">
                Trendy
              </span>
            )}
          </div>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow text-yellow" />
              <span>{formatRating(course.rating)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{formatStudents(course.students)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
        
        {course.coverImage ? (
          <img 
            src={course.coverImage}
            alt={course.title}
            className="w-16 h-16 rounded-lg flex-shrink-0 object-cover"
          />
        ) : (
          <div 
            className="w-16 h-16 rounded-lg flex-shrink-0 bg-primary"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-light-border dark:border-dark-border">
        <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
          {course.modules?.length || 0} modules • {course.questions?.length || 0} questions
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-light-text dark:text-dark-text" />
          </button>
          <button
            onClick={() => onDuplicate(course)}
            className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-light-text dark:text-dark-text" />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="p-2 hover:bg-red hover:text-white rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

