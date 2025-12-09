import { QuestionCard } from './QuestionCard';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const QuestionList = ({ questions = [], onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
          Quiz Questions ({questions.length})
        </h3>
        <Button onClick={onAdd} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-light-border dark:border-dark-border rounded-lg">
          <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
            No questions yet. Add your first question!
          </p>
          <Button onClick={onAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
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

