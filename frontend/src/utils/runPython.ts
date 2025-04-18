import loadPyodideScript from './loadPyodideScript'; // Assuming you have a separate file for loading Pyodide
import { Dispatch, SetStateAction } from 'react';

/**
 * Runs the compiled Python code in the browser using Pyodide.
 * @param {string} pythonCode - The Python code to execute.
 * @param {Dispatch<SetStateAction<string[]>>} setOutput - State setter to handle output messages.
 * @returns {Promise<void>} - Resolves when the Python execution is complete.
 */
async function runPythonCode(pythonCode: string, setOutput: Dispatch<SetStateAction<string[]>>): Promise<void> {
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

    // Set up print handling to capture output in real-time
    window.pyodide.globals.set('print', (message: any) => {
      setOutput((prevOutput) => [...prevOutput, message.toString()]);
    });

    // Run the Python code in the browser
    await window.pyodide.runPythonAsync(pythonCode);
  } catch (error) {
    console.error('Error running Python code:', error);
    throw new Error('Failed to execute Python code in the browser');
  }
}

export default runPythonCode;
