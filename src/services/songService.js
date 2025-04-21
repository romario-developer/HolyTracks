// Song service for handling song-related API calls and operations

// You might want to import axios or fetch for API calls
// import axios from 'axios';

// Example API base URL - replace with your actual API endpoint
const API_URL = '/api/songs';

// Get all songs - adding alias for getAllSongs to match the import in SongContext.js
export const getSongs = async () => {
  try {
    // Example implementation using fetch
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

// Keeping the original function for compatibility
export const getAllSongs = getSongs;

// Get a single song by ID
export const getSongById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch song');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching song with ID ${id}:`, error);
    throw error;
  }
};

// Add a new song - adding alias for addSong to match the import in SongContext.js
export const createSong = async (songData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });
    if (!response.ok) {
      throw new Error('Failed to add song');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding song:', error);
    throw error;
  }
};

// Keeping the original function for compatibility
export const addSong = createSong;

// Update an existing song
export const updateSong = async (id, songData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });
    if (!response.ok) {
      throw new Error('Failed to update song');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating song with ID ${id}:`, error);
    throw error;
  }
};

// Delete a song
export const deleteSong = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete song');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting song with ID ${id}:`, error);
    throw error;
  }
};

// Add a marker to a song
export const addMarker = async (songId, markerData) => {
  try {
    const response = await fetch(`${API_URL}/${songId}/markers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(markerData),
    });
    if (!response.ok) {
      throw new Error('Failed to add marker');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding marker to song with ID ${songId}:`, error);
    throw error;
  }
};

// Remove a marker from a song
export const removeMarker = async (songId, markerId) => {
  try {
    const response = await fetch(`${API_URL}/${songId}/markers/${markerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove marker');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error removing marker with ID ${markerId} from song with ID ${songId}:`, error);
    throw error;
  }
};