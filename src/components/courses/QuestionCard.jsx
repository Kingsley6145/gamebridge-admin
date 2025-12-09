import { Edit, Trash2 } from 'lucide-react';

export const QuestionCard = ({ question, index, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">Question {index + 1}</span>
          </div>
          <p className="text-light-text dark:text-dark-text mb-3">
            {question.question}
          </p>
          <div className="space-y-2">
            {question.options?.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`
                  p-2 rounded text-sm
                  ${optIndex === question.correctAnswerIndex
                    ? 'bg-green bg-opacity-20 border border-green'
                    : 'bg-light-card dark:bg-dark-card'
                  }
                `}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                <span className={optIndex === question.correctAnswerIndex ? 'text-green font-semibold' : 'text-light-text dark:text-dark-text'}>
                  {option}
                </span>
                {optIndex === question.correctAnswerIndex && (
                  <span className="ml-2 text-xs text-green">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-light-text dark:text-dark-text" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(question)}
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

