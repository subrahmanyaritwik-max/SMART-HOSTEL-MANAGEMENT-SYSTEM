const STORAGE_KEY = 'manivtha_travel_chat_history';

/**
 * Retrieves the full chat history from localStorage.
 * @returns {Array} List of chat history items.
 */
export const getChatHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading chat history from localStorage:', error);
    return [];
  }
};

/**
 * Saves a new question and response to the chat history.
 * @param {string} question - The user question.
 * @param {string} response - The AI response.
 * @returns {Object|null} The newly created chat item or null if failed.
 */
export const saveChatHistory = (question, response) => {
  if (!question || !response) return null;
  try {
    const history = getChatHistory();
    const newChat = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9),
      question,
      response,
      timestamp: new Date().toISOString()
    };
    history.push(newChat);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return newChat;
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
    return null;
  }
};

/**
 * Deletes a single chat record by its ID.
 * @param {string} id - The ID of the chat record to delete.
 * @returns {boolean} True if successfully deleted, false otherwise.
 */
export const deleteChatHistoryItem = (id) => {
  try {
    const history = getChatHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting single chat item from localStorage:', error);
    return false;
  }
};

/**
 * Clears the entire chat history from localStorage.
 * @returns {boolean} True if successfully cleared, false otherwise.
 */
export const deleteChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing chat history from localStorage:', error);
    return false;
  }
};
