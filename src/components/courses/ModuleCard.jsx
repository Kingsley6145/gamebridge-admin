import { Edit, Trash2, GripVertical } from 'lucide-react';

export const ModuleCard = ({ module, index, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
      <div className="cursor-move">
        <GripVertical className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
      </div>
      
      <div 
        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: module.iconColor || '#FF6B35' }}
      >
        {index + 1}
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-light-text dark:text-dark-text">
          {module.title}
        </h4>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
          {module.duration}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(module)}
          className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4 text-light-text dark:text-dark-text" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(module)}
          className="p-2 hover:bg-red hover:text-white rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

