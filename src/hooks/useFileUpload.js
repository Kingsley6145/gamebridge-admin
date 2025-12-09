import { useState } from 'react';
import { fileService } from '../services/fileService';
import toast from 'react-hot-toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const url = await fileService.uploadImage(file);
      setProgress(100);
      clearInterval(interval);
      return url;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadVideo = async (file) => {
    try {
      setUploading(true);
      setProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 200);

      const url = await fileService.uploadVideo(file);
      setProgress(100);
      clearInterval(interval);
      return url;
    } catch (error) {
      toast.error('Failed to upload video');
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploading,
    progress,
    uploadImage,
    uploadVideo,
  };
};

