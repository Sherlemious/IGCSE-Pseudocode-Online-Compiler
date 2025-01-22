import axios from 'axios';
import API_PATHS from './apiConfig';

/**
 * Sends pseudocode to the backend and retrieves the Python code as a string (compilation only).
 * @param {string} pseudocode - The pseudocode input from the user.
 * @returns {Promise<string>} - Resolves with the compiled Python code.
 */
export const compilePseudocode = async (pseudocode: string): Promise<string> => {
  try {
    // Get the API URL for the compilation endpoint
    const apiUrl = API_PATHS.postCompileCode();

    // Call the backend to get the Python code
    const response = await axios.post(apiUrl, { code: pseudocode });

    // Return the compiled Python code from the backend response
    return response.data.pythonCode;
  } catch (error) {
    console.error('Error compiling pseudocode:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to compile pseudocode');
    } else {
      throw new Error('Failed to compile pseudocode');
    }
  }
};
