import { ModuleCard } from './ModuleCard';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const ModuleList = ({ modules = [], onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
          Modules ({modules.length})
        </h3>
        <Button onClick={onAdd} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-light-border dark:border-dark-border rounded-lg">
          <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
            No modules yet. Add your first module!
          </p>
          <Button onClick={onAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

