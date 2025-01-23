/**
 * Loads the Pyodide script if not already loaded.
 * @returns {Promise<void>}
 */
const loadPyodideScript = async (): Promise<void> => {
  if (!window.loadPyodide) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
    script.onload = () => {
      console.log('Pyodide script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Pyodide script');
    };
    document.head.appendChild(script);

    // Wait for the script to load
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    });
  }
};

export default loadPyodideScript;
