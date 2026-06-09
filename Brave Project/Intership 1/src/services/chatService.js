import axios from 'axios';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

/**
 * Sends a question to the Make.com chatbot workflow.
 * Handles timeouts, network errors, and invalid response structures.
 * @param {string} question - The user's query.
 * @returns {Promise<Object>} An object containing the response string.
 */
export const sendMessage = async (question) => {
  if (!question || !question.trim()) {
    throw new Error('Question content cannot be empty.');
  }

  // Ensure webhook URL is present
  if (!WEBHOOK_URL || WEBHOOK_URL.trim() === '' || WEBHOOK_URL.includes('your-n8n-url')) {
    throw new Error('Network Error: Webhook URL is not configured. Please check your .env file.');
  }

  try {
    const res = await axios.post(
      WEBHOOK_URL,
      { question: question.trim() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20000 // 20 seconds timeout for AI generation
      }
    );

    let data = res.data;
    
    // Webhooks can return an array of objects
    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    if (data && typeof data === 'object') {
      if (data.response) {
        return { response: data.response };
      } else if (data.output) {
        return { response: data.output };
      } else if (data.text) {
        return { response: data.text };
      } else {
        // If it has other string values, return the first one
        const values = Object.values(data);
        const firstString = values.find(val => typeof val === 'string' && val.trim() !== '');
        if (firstString) {
          return { response: firstString };
        }
        throw new Error('Invalid Response: The server response object did not contain a valid "response" or string property.');
      }
    } else if (typeof data === 'string') {
      if (!data.trim()) {
        throw new Error('Invalid Response: The server returned an empty string.');
      }
      return { response: data };
    } else {
      throw new Error('Invalid Response: The server returned a format that is neither text nor a valid JSON object.');
    }
  } catch (error) {
    console.error('Error invoking Make.com workflow webhook:', error);

    // If it is our own thrown Invalid Response error, rethrow it
    if (error.message.startsWith('Invalid Response')) {
      throw error;
    }

    // Check for Axios timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Timeout Error: The travel chatbot server took too long to respond (timeout of 20s exceeded). Please check your Make.com workflow execution.');
    }

    // Check for network errors (no response received or offline)
    if (!error.response && error.request) {
      throw new Error('Network Error: Could not connect to the Make.com webhook. Please check your internet connection or verify if the endpoint is active.');
    }

    // Server responded with an error status code (e.g. 500, 404)
    if (error.response) {
      throw new Error(`API Error (${error.response.status}): The server returned an error: ${error.response.statusText || 'Unknown Error'}`);
    }

    // General fallback error
    throw new Error(`Connection Error: ${error.message}`);
  }
};
