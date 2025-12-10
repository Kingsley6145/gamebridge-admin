import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';
import { auth } from './firebase';

// Base path for all Gamebridge files in Firebase Storage
const STORAGE_BASE_PATH = 'Gamebridge_';

// Helper function to try to find and get URL for an image by filename
export const getImageURLFromPath = async (pathString) => {
  try {
    // If it's already a Firebase Storage URL, return it
    if (pathString && (pathString.startsWith('http://') || pathString.startsWith('https://'))) {
      return pathString;
    }

    // Extract filename from path
    const fileName = pathString.split('/').pop();
    if (!fileName) return null;

    // Try to find the file in Firebase Storage
    const imagesRef = ref(storage, `${STORAGE_BASE_PATH}images`);
    const files = await listAll(imagesRef);
    
    // Look for a file that matches the filename
    for (const itemRef of files.items) {
      if (itemRef.name.includes(fileName) || fileName.includes(itemRef.name)) {
        const url = await getDownloadURL(itemRef);
        return url;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding image:', error);
    return null;
  }
};

export const fileService = {
  uploadImage: async (file) => {
    try {
      // Verify user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to upload images. Please sign in and try again.');
      }

      // Create a unique filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const fileName = `${STORAGE_BASE_PATH}images/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        throw new Error('Permission denied. Please make sure:\n1. You are logged in\n2. Firebase Storage rules are published\n3. The rules allow authenticated users to upload');
      }
      
      throw new Error('Failed to upload image: ' + error.message);
    }
  },

  uploadVideo: async (file, onProgress) => {
    try {
      // Verify user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to upload videos. Please sign in and try again.');
      }

      // Create a unique filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const fileName = `${STORAGE_BASE_PATH}videos/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Use uploadBytesResumable for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Return a promise that resolves with the download URL
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate upload progress percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            console.error('Error uploading video:', error);
            
            // Provide more helpful error messages
            if (error.message.includes('unauthorized') || error.message.includes('permission')) {
              reject(new Error('Permission denied. Please make sure:\n1. You are logged in\n2. Firebase Storage rules are published\n3. The rules allow authenticated users to upload'));
            } else {
              reject(new Error('Failed to upload video: ' + error.message));
            }
          },
          async () => {
            // Upload completed successfully, get the download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(new Error('Failed to get download URL: ' + error.message));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  deleteFile: async (url) => {
    try {
      // Extract the file path from the URL
      // Firebase Storage URLs look like: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile
      if (!url || !url.includes('firebasestorage.googleapis.com')) {
        // If it's not a Firebase Storage URL, just return success
        return true;
      }

      // Extract the path from the URL
      const urlParts = url.split('/o/');
      if (urlParts.length < 2) {
        return true;
      }

      const encodedPath = urlParts[1].split('?')[0];
      const filePath = decodeURIComponent(encodedPath);
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it - file might already be deleted
      return true;
    }
  },
};

