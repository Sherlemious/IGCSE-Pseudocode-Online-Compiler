/**
 * Runs the compiled Python code in the browser using Pyodide.
 * @param {string} pythonCode - The Python code to execute.
 * @returns {Promise<string>} - Resolves with the result of the Python execution.
 */
export const runPythonCode = async (pythonCode: string): Promise<string> => {
  try {
    // Load Pyodide (if not already loaded)
    const pyodide = await (window as any).loadPyodide();

    // Run the Python code in the browser
    const output = pyodide.runPython(pythonCode);

    return output;
  } catch (error) {
    console.error('Error running Python code:', error);
    throw new Error('Failed to execute Python code in the browser');
  }
};
