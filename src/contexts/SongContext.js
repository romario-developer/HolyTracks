// ... existing code ...

const loadUserSongs = async () => {
  setLoading(true);
  try {
    const songsData = await getSongs();
    setSongs(songsData);
  } catch (error) {
    console.error('Erro ao carregar músicas:', error);
    // Set a user-friendly error message
    setError(error.message || 'Failed to load songs');
    // If you want to show an empty array when there's an error
    setSongs([]);
  } finally {
    setLoading(false);
  }
};

// ... existing code ...