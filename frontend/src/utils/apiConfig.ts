// Access the base URL from the environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to return the correct URL for each endpoint
const API_PATHS = {
  postCompileCode() {
    return `${BASE_URL}/execution/convert/`;
  },
};

export default API_PATHS;
