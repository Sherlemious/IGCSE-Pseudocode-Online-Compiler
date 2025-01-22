/**
 * Loads the Pyodide script if not already loaded.
 * @returns {Promise<void>}
 */
const loadPyodideScript = async (): Promise<void> => {
  if (!(window as any).loadPyodide) {
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
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
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
    if (!(window as any).pyodide) {
      // Load Pyodide with indexURL
      (window as any).pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
      });
    } else if ((window as any).pyodideLoading) {
      // Wait for the existing loading process to complete
      await (window as any).pyodideLoading;
    } else {
      // Mark Pyodide as loading
      (window as any).pyodideLoading = (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
      });
      (window as any).pyodide = await (window as any).pyodideLoading;
      delete (window as any).pyodideLoading;
    }

    // Run the Python code in the browser
    const output = (window as any).pyodide.runPython(pythonCode);

    return output;
  } catch (error) {
    console.error('Error running Python code:', error);
    throw new Error('Failed to execute Python code in the browser');
  }
};
