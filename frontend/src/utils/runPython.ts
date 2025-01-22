import loadPyodideScript from './loadPyodideScript'; // Assuming you have a separate file for loading Pyodide

/**
 * Runs the compiled Python code in the browser using Pyodide.
 * @param {string} pythonCode - The Python code to execute.
 * @param {(message: string) => void} onOutput - Callback to handle output messages.
 * @returns {Promise<void>} - Resolves when the Python execution is complete.
 */
export const runPythonCode = async (pythonCode: string, onOutput: (message: string) => void): Promise<void> => {
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

    // Set up input handling using prompt
    window.pyodide.globals.set('input', () => prompt('Enter input:') || '');

    // Capture the output
    const originalConsoleLog = console.log;
    console.log = (message: any) => {
      onOutput(message);
      originalConsoleLog(message);
    };

    // Run the Python code in the browser
    window.pyodide.runPython(pythonCode);

    // Restore the original console.log
    console.log = originalConsoleLog;
  } catch (error) {
    console.error('Error running Python code:', error);
    throw new Error('Failed to execute Python code in the browser');
  }
};
