import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateQuestion } from '../../utils/validation';
import { generateId } from '../../utils/formatters';

export const QuestionForm = ({ question, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || '',
        options: question.options || ['', '', '', ''],
        correctAnswerIndex: question.correctAnswerIndex?.toString() || '',
      });
    }
  }, [question]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    handleChange('options', newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const questionData = {
      ...formData,
      correctAnswerIndex: parseInt(formData.correctAnswerIndex),
    };

    const validationErrors = validateQuestion(questionData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalData = {
      ...questionData,
      id: question?.id || generateId(),
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Question"
        value={formData.question}
        onChange={(e) => handleChange('question', e.target.value)}
        placeholder="Enter your question..."
        error={errors.question}
        required
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Options <span className="text-red">*</span>
        </label>
        {formData.options.map((option, index) => (
          <div key={index}>
            <Input
              label={`Option ${String.fromCharCode(65 + index)}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
              error={errors[`option${index}`]}
              required
            />
          </div>
        ))}
      </div>

      <Select
        label="Correct Answer"
        value={formData.correctAnswerIndex}
        onChange={(e) => handleChange('correctAnswerIndex', e.target.value)}
        options={formData.options.map((option, index) => ({
          value: index.toString(),
          label: `${String.fromCharCode(65 + index)}. ${option || `Option ${String.fromCharCode(65 + index)}`}`,
        }))}
        placeholder="Select the correct answer"
        error={errors.correctAnswerIndex}
        required
      />

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-light-border dark:border-dark-border">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {question ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </form>
  );
};

