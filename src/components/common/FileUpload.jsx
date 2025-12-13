import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileVideo, Image as ImageIcon, FileCode } from 'lucide-react';
import { validateFile, validateImageDimensions } from '../../utils/validation';
import { FILE_LIMITS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';
import { getImageURLFromPath } from '../../services/fileService';

export const FileUpload = ({
  type = 'image',
  onFileSelect,
  currentFile,
  maxSize,
  accept,
  label,
  required = false,
  error,
  className = ''
}) => {
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [resolvedImageUrl, setResolvedImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const fileLimits = type === 'image' 
    ? FILE_LIMITS.image 
    : type === 'video' 
    ? FILE_LIMITS.video 
    : type === 'html'
    ? FILE_LIMITS.html
    : FILE_LIMITS.image;
  const maxFileSize = maxSize || fileLimits.maxSize / (1024 * 1024);
  
  // Convert MIME types array to react-dropzone v14+ format (object)
  // react-dropzone expects: { 'image/png': [], 'image/jpeg': [] }
  // For HTML files, also accept .html and .htm extensions
  const acceptedTypes = accept || (type === 'html' 
    ? { 'text/html': ['.html', '.htm'], 'text/plain': ['.html', '.htm'] }
    : fileLimits.types.reduce((acc, mimeType) => {
        acc[mimeType] = [];
        return acc;
      }, {}));

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setUploadError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setUploadError(`File size must be less than ${maxFileSize}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        const typeMessages = {
          image: 'PNG or JPG',
          video: 'MP4',
          html: 'HTML (.html or .htm)'
        };
        setUploadError(`File must be ${typeMessages[type] || 'a valid file'}`);
      } else {
        setUploadError('Invalid file. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    const validation = validateFile(file, type);
    
    if (Object.keys(validation).length > 0) {
      setUploadError(validation.file);
      return;
    }

    // Validate image dimensions for image files
    if (type === 'image') {
      const dimensionValidation = await validateImageDimensions(file);
      if (Object.keys(dimensionValidation).length > 0) {
        setUploadError(dimensionValidation.file);
        return;
      }
    }

    // Create preview
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (type === 'html') {
      // For HTML files, store the file object itself for preview
      setPreview(file);
    } else {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    onFileSelect(file);
  }, [type, maxFileSize, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize: fileLimits.maxSize,
    multiple: false,
  });

  const removeFile = (e) => {
    e?.stopPropagation(); // Prevent event from bubbling up to modal
    setPreview(null);
    setUploadError('');
    setResolvedImageUrl(null);
    setImageError(false);
    onFileSelect(null);
    if (preview && type === 'video') {
      URL.revokeObjectURL(preview);
    }
  };

  // Determine the image source to display
  const imageSource = preview || resolvedImageUrl;
  // Show image section if we have a preview (new file) or currentFile exists (editing mode)
  // For HTML files, preview is the file object itself
  const hasImage = (type === 'html' ? preview : preview || resolvedImageUrl) || currentFile;
  
  // Try to resolve image/video URL when currentFile changes
  useEffect(() => {
    setImageError(false);
    
    // Clear resolved URL if currentFile is empty or if there's a preview
    if (!currentFile || preview) {
      setResolvedImageUrl(null);
      return;
    }
    
    // If it's already a valid URL, use it directly
    if (currentFile.startsWith('http://') || 
        currentFile.startsWith('https://') || 
        currentFile.startsWith('data:')) {
      setResolvedImageUrl(currentFile);
      return;
    }
    
    // For images, try to find the file in Firebase Storage
    if (type === 'image') {
      setLoadingImage(true);
      getImageURLFromPath(currentFile)
        .then((url) => {
          if (url) {
            setResolvedImageUrl(url);
          }
          setLoadingImage(false);
        })
        .catch(() => {
          setLoadingImage(false);
        });
    } else {
      // For videos, if it's not a URL, it might be a filename
      // In that case, we can't resolve it without the full path
      // But if it's stored as a URL in the database, it should already be a URL
      // So we'll just use currentFile as-is if it's not a URL
      setResolvedImageUrl(null);
    }
  }, [currentFile, preview, type]);

  const displayError = error || uploadError;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}
      
      {hasImage ? (
        <div className="relative">
          {type === 'image' ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
              {loadingImage ? (
                <div className="w-full h-full flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                      Loading image...
                    </p>
                  </div>
                </div>
              ) : imageSource && !imageError ? (
                <img
                  src={imageSource}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-light-textSecondary dark:text-dark-textSecondary" />
                    <p className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Image not found
                    </p>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mb-3 break-all">
                      {currentFile}
                    </p>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                      Please re-upload the image to store it in Firebase Storage
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 bg-red text-white rounded-full hover:bg-[#c2185b] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : type === 'html' ? (
            <div className="relative w-full rounded-lg overflow-hidden border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
              <div className="w-full p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileCode className="w-10 h-10 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      {preview ? preview.name : currentFile || 'HTML File'}
                    </p>
                    {preview && (
                      <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                        {formatFileSize(preview.size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 bg-red text-white rounded-full hover:bg-[#c2185b] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
              {(imageSource || currentFile) ? (
                <video
                  src={imageSource || currentFile}
                  controls
                  className="w-full max-h-96"
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                  <div className="text-center p-4">
                    <FileVideo className="w-12 h-12 mx-auto mb-2 text-light-textSecondary dark:text-dark-textSecondary" />
                    <p className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Video not available
                    </p>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                      Please upload a video file
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 bg-red text-white rounded-full hover:bg-[#c2185b] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary bg-opacity-10' 
              : 'border-light-border dark:border-dark-border hover:border-primary'
            }
            ${displayError ? 'border-red' : ''}
          `}
        >
          <input {...getInputProps()} />
          {type === 'image' ? (
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-light-textSecondary dark:text-dark-textSecondary" />
          ) : type === 'video' ? (
            <FileVideo className="w-12 h-12 mx-auto mb-4 text-light-textSecondary dark:text-dark-textSecondary" />
          ) : (
            <FileCode className="w-12 h-12 mx-auto mb-4 text-light-textSecondary dark:text-dark-textSecondary" />
          )}
          <p className="text-sm text-light-text dark:text-dark-text mb-2">
            {isDragActive ? (
              'Drop the file here...'
            ) : (
              <>
                Drag & drop {type === 'image' ? 'an image' : type === 'video' ? 'a video' : 'an HTML file'} here, or click to select
              </>
            )}
          </p>
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
            {type === 'image' 
              ? `PNG, JPG up to ${maxFileSize}MB. Dimensions must be exactly ${FILE_LIMITS.image.dimensions.width}px × ${FILE_LIMITS.image.dimensions.height}px`
              : type === 'video' 
              ? `MP4 up to ${maxFileSize}MB`
              : `HTML up to ${maxFileSize}MB`
            }
          </p>
        </div>
      )}
      
      {displayError && (
        <p className="mt-2 text-sm text-red">{displayError}</p>
      )}
    </div>
  );
};

