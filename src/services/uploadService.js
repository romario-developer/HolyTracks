// Upload service for handling file uploads

// You might want to import axios for API calls
// import axios from 'axios';

// Example API base URL - replace with your actual API endpoint
const UPLOAD_API_URL = '/api/upload';

// Upload a song file
export const uploadSongFile = async (file, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add any metadata as needed
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header when using FormData
      // It will be set automatically including the boundary
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get upload progress (if your backend supports it)
export const getUploadProgress = (uploadId) => {
  return fetch(`${UPLOAD_API_URL}/progress/${uploadId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to get upload progress');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error getting upload progress:', error);
      throw error;
    });
};

// Cancel an ongoing upload (if your backend supports it)
export const cancelUpload = async (uploadId) => {
  try {
    const response = await fetch(`${UPLOAD_API_URL}/cancel/${uploadId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel upload');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error canceling upload:', error);
    throw error;
  }
};

// Upload a single track
export const uploadTrack = async (songId, file, trackInfo = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('songId', songId);
    
    // Add track info as needed
    Object.keys(trackInfo).forEach(key => {
      formData.append(key, trackInfo[key]);
    });

    const response = await fetch(`${UPLOAD_API_URL}/track`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload track');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading track:', error);
    throw error;
  }
};

// Upload multiple tracks at once
export const uploadMultipleTracks = async (songId, files, tracksInfo = []) => {
  try {
    const formData = new FormData();
    formData.append('songId', songId);
    
    // Append each file
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    // Append track info if available
    if (tracksInfo.length > 0) {
      formData.append('tracksInfo', JSON.stringify(tracksInfo));
    }

    const response = await fetch(`${UPLOAD_API_URL}/tracks/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload multiple tracks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading multiple tracks:', error);
    throw error;
  }
};

// Delete a track
export const deleteTrack = async (songId, trackId) => {
  try {
    const response = await fetch(`${UPLOAD_API_URL}/track/${songId}/${trackId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete track');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting track:', error);
    throw error;
  }
};

// Get download URL for a track
export const getDownloadUrl = async (songId, trackId) => {
  try {
    const response = await fetch(`${UPLOAD_API_URL}/download/${songId}/${trackId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get download URL');
    }
    
    const data = await response.json();
    return data.downloadUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};