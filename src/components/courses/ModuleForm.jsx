import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { ColorPicker } from '../common/ColorPicker';
import { FileUpload } from '../common/FileUpload';
import { MarkdownEditor } from '../common/MarkdownEditor';
import { Button } from '../common/Button';
import { validateModule } from '../../utils/validation';
import { iconColors } from '../../utils/colors';
import { generateId } from '../../utils/formatters';

export const ModuleForm = ({ module, onSubmit, onCancel, loading = false, uploadProgress = 0 }) => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    iconColor: '',
    videoUrl: '',
    markdownDescription: '',
    htmlContent: '',
  });
  const [errors, setErrors] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        duration: module.duration || '',
        iconColor: module.iconColor || '',
        videoUrl: module.videoUrl || '',
        markdownDescription: module.markdownDescription || '',
        htmlContent: module.htmlContent || '',
      });
      setVideoFile(null); // Reset video file when editing existing module
      setHtmlFile(null); // Reset HTML file when editing existing module
    } else {
      // Reset form when adding new module
      setFormData({
        title: '',
        duration: '',
        iconColor: '',
        videoUrl: '',
        markdownDescription: '',
        htmlContent: '',
      });
      setVideoFile(null);
      setHtmlFile(null);
    }
  }, [module]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleVideoSelect = (file) => {
    setVideoFile(file);
    // If file is cleared (user clicked remove), clear the videoUrl
    if (!file) {
      handleChange('videoUrl', '');
    } else {
      // Clear videoUrl error when a new file is selected
      if (errors.videoUrl) {
        setErrors(prev => ({ ...prev, videoUrl: null }));
      }
    }
    // Don't update videoUrl when a new file is selected - it will be set after upload in handleModuleSubmit
  };

  const handleHtmlSelect = (file) => {
    setHtmlFile(file);
    // If file is cleared (user clicked remove), clear the htmlContent
    if (!file) {
      handleChange('htmlContent', '');
    } else {
      // Clear htmlContent error when a new file is selected
      if (errors.htmlContent) {
        setErrors(prev => ({ ...prev, htmlContent: null }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to parent form
    
    // Check if videoFile exists (new upload) or videoUrl exists (existing video)
    const hasVideo = videoFile || formData.videoUrl;
    
    const validationErrors = validateModule(formData);
    
    // Override videoUrl error if a video file is selected
    if (hasVideo && validationErrors.videoUrl) {
      delete validationErrors.videoUrl;
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const moduleData = {
      ...formData,
      id: module?.id || generateId(),
    };

    onSubmit(moduleData, videoFile, htmlFile);
  };

  return (
    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="e.g., Introduction to UI/UX"
        error={errors.title}
        required
      />

      <Input
        label="Duration"
        value={formData.duration}
        onChange={(e) => handleChange('duration', e.target.value)}
        placeholder="e.g., 4:28 mins"
        error={errors.duration}
        required
      />

      <ColorPicker
        label="Icon Color"
        value={formData.iconColor}
        onChange={(value) => handleChange('iconColor', value)}
        colors={iconColors}
        error={errors.iconColor}
        required
      />

      <FileUpload
        type="video"
        label="Video File"
        onFileSelect={handleVideoSelect}
        currentFile={formData.videoUrl}
        error={errors.videoUrl}
        required
      />

      {/* Upload Progress Bar */}
      {loading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-light-text dark:text-dark-text font-medium">
              Uploading video...
            </span>
            <span className="text-light-textSecondary dark:text-dark-textSecondary">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <MarkdownEditor
        label="Description"
        value={formData.markdownDescription}
        onChange={(value) => handleChange('markdownDescription', value)}
        placeholder="Write the module description in markdown..."
        error={errors.markdownDescription}
        required
      />

      <FileUpload
        type="html"
        label="Upload HTML File"
        onFileSelect={handleHtmlSelect}
        currentFile={formData.htmlContent ? (htmlFile ? htmlFile.name : 'HTML content saved') : ''}
        error={errors.htmlContent}
      />

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-light-border dark:border-dark-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {module ? 'Update Module' : 'Add Module'}
        </Button>
      </div>
    </form>
  );
};

