import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Toggle } from '../common/Toggle';
import { FileUpload } from '../common/FileUpload';
import { ModuleList } from './ModuleList';
import { QuestionList } from './QuestionList';
import { Modal } from '../common/Modal';
import { ModuleForm } from './ModuleForm';
import { QuestionForm } from './QuestionForm';
import { Button } from '../common/Button';
import { validateCourse } from '../../utils/validation';
import { generateId } from '../../utils/formatters';
import { fileService } from '../../services/fileService';
import toast from 'react-hot-toast';

export const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    rating: '',
    students: '',
    isTrendy: false,
    isPremium: false,
    coverImage: '',
    modules: [],
    questions: [],
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [uploadingModule, setUploadingModule] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        duration: course.duration || '',
        rating: course.rating?.toString() || '',
        students: course.students?.toString() || '',
        isTrendy: course.isTrendy || false,
        isPremium: course.isPremium || false,
        coverImage: course.coverImage || '',
        modules: course.modules || [],
        questions: course.questions || [],
      });
    }
  }, [course]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    if (file) {
      // In a real app, you'd upload the file and get the URL
      handleChange('coverImage', file.name);
    } else {
      handleChange('coverImage', '');
    }
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setModuleModalOpen(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setModuleModalOpen(true);
  };

  const handleDeleteModule = (module) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== module.id),
    }));
  };

  const handleModuleSubmit = async (moduleData, videoFile) => {
    if (uploadingModule) return; // Prevent double submission
    
    try {
      setUploadingModule(true);
      setUploadProgress(0);
      let videoUrl = moduleData.videoUrl;
      
      // Upload video if a new file is provided
      if (videoFile) {
        videoUrl = await fileService.uploadVideo(videoFile, (progress) => {
          setUploadProgress(progress);
        });
      } else if (editingModule) {
        // When editing, preserve existing videoUrl if no new file is selected
        // Check if moduleData.videoUrl is a valid URL (starts with http/https)
        // If not, use the existing videoUrl from editingModule
        if (!videoUrl || (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://'))) {
          videoUrl = editingModule.videoUrl || '';
        }
      }

      const finalModuleData = {
        ...moduleData,
        videoUrl,
      };

      if (editingModule) {
        setFormData(prev => ({
          ...prev,
          modules: prev.modules.map(m => m.id === editingModule.id ? finalModuleData : m),
        }));
        toast.success('Module updated successfully');
      } else {
        setFormData(prev => ({
          ...prev,
          modules: [...prev.modules, finalModuleData],
        }));
        toast.success('Module added successfully');
      }
      
      setModuleModalOpen(false);
      setEditingModule(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Failed to upload video:', error);
      toast.error(error.message || 'Failed to save module. Please try again.');
      // Don't close the modal on error so user can fix the issue
    } finally {
      setUploadingModule(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (question) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== question.id),
    }));
  };

  const handleQuestionSubmit = (questionData) => {
    if (editingQuestion) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.map(q => q.id === editingQuestion.id ? questionData : q),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, questionData],
      }));
    }
    setQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      rating: parseFloat(formData.rating),
      students: parseInt(formData.students),
    };

    const validationErrors = validateCourse(courseData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalData = {
      ...courseData,
      id: course?.id || generateId(),
    };

    onSubmit(finalData, imageFile);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border pb-2">
            Basic Information
          </h2>
          
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., UI/UX Design Fundamentals"
            error={errors.title}
            required
          />

          <Input
            label="Duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., 2h 46min"
            error={errors.duration}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => handleChange('rating', e.target.value)}
              placeholder="e.g., 4.8"
              error={errors.rating}
              required
            />

            <Input
              label="Students"
              type="number"
              min="0"
              value={formData.students}
              onChange={(e) => handleChange('students', e.target.value)}
              placeholder="e.g., 1250"
              error={errors.students}
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <Toggle
              label="Trendy"
              checked={formData.isTrendy}
              onChange={(e) => handleChange('isTrendy', e.target.checked)}
            />
            <Toggle
              label="Premium"
              checked={formData.isPremium}
              onChange={(e) => handleChange('isPremium', e.target.checked)}
            />
          </div>
        </div>

        {/* Visual Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border pb-2">
            Visual Settings
          </h2>
          
          <FileUpload
            type="image"
            label="Cover Image"
            onFileSelect={handleImageSelect}
            currentFile={formData.coverImage}
            error={errors.coverImage}
            required
          />
        </div>

        {/* Modules */}
        <div>
          <ModuleList
            modules={formData.modules}
            onAdd={handleAddModule}
            onEdit={handleEditModule}
            onDelete={handleDeleteModule}
          />
        </div>

        {/* Questions */}
        <div>
          <QuestionList
            questions={formData.questions}
            onAdd={handleAddQuestion}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-light-border dark:border-dark-border">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>

      {/* Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => {
          setModuleModalOpen(false);
          setEditingModule(null);
        }}
        title={editingModule ? 'Edit Module' : 'Add Module'}
        size="lg"
      >
        <ModuleForm
          module={editingModule}
          onSubmit={handleModuleSubmit}
          onCancel={() => {
            if (!uploadingModule) {
              setModuleModalOpen(false);
              setEditingModule(null);
            }
          }}
          loading={uploadingModule}
          uploadProgress={uploadProgress}
        />
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={questionModalOpen}
        onClose={() => {
          setQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="md"
      >
        <QuestionForm
          question={editingQuestion}
          onSubmit={handleQuestionSubmit}
          onCancel={() => {
            setQuestionModalOpen(false);
            setEditingQuestion(null);
          }}
        />
      </Modal>
    </>
  );
};

