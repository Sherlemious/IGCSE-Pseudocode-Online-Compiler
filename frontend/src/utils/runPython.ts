declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
    pyodide: any;
    pyodideLoading: Promise<any> | null;
  }
}

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

/**
 * Runs the compiled Python code in the browser using Pyodide.
 * @param {string} pythonCode - The Python code to execute.
 * @returns {Promise<string>} - Resolves with the result of the Python execution.
 */
export const runPythonCode = async (pythonCode: string): Promise<string> => {
  try {
    // Load Pyodide script if not already loaded
    await loadPyodideScript();

    // Check if Pyodide is already loaded or loading
    if (!window.pyodide) {
      if (!window.pyodideLoading) {
        // Load Pyodide with indexURL
        window.pyodideLoading = window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
        });
        window.pyodide = await window.pyodideLoading;
        window.pyodideLoading = null;
      } else {
        // Wait for the existing loading process to complete
        await window.pyodideLoading;
      }
    }

    // Run the Python code in the browser
    const output = window.pyodide.runPython(pythonCode);

    return output;
  } catch (error) {
    console.error('Error running Python code:', error);
    throw new Error('Failed to execute Python code in the browser');
  }
};
