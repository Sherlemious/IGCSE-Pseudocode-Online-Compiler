# IGCSE-Pseudocode-Online-Compiler

A **Web-based Pseudocode Interpreter** that allows users to write pseudocode, which is then compiled into Python and executed in the browser. The project aims to bridge the gap between the IGCSE Computer Science Pseudocode syntax and actual programming languages.
## Tech Stack

- **Frontend:**
  - **React** with **TypeScript** for building the user interface.
  - **Tailwind CSS** for utility-first, responsive styling.
  - **Vite** for fast and modern development with React.
  - **Pyodide** for running Python code in the browser.

- **Backend:**
  - **Django**: A powerful Python framework used for handling the logic of compiling pseudocode to Python. It exposes a simple API for the frontend to interact with.
  - **Python**: Used for pseudocode-to-Python compilation and for executing Python code.

- **APIs:**
  - Custom API to compile pseudocode into Python code and return it.
  - Backend communication via **Fetch**/`Axios` for making HTTP requests from the frontend.

- **Deployment:**
  - Hosted on **Render** for the backend.

---

## Features

- **Real-time pseudocode-to-Python compilation**: Converts pseudocode to Python code and runs it in the browser.
- **Interactive editor**: A user-friendly interface to enter pseudocode and instantly see the output.
- **Output Display**: Once compiled, the output is displayed beside the editor for users to see the results.
- **Responsive Design**: The application is fully responsive, ensuring a smooth experience on desktops, tablets, and smartphones.

---

## How It Works

1. **User Input:**
   - The user enters pseudocode into the code editor on the frontend.
   
2. **Pseudocode Compilation:**
   - The frontend sends the pseudocode to the backend via a `POST` request to the `/execution/convert/` endpoint.
   - The backend compiles the pseudocode into Python code and returns the result.

3. **Python Code Execution:**
   - The frontend then sends the Python code to a Python interpreter running in the browser (**Pyodide**) for execution.
   - The output or errors from the execution are returned and displayed to the user in the output section.

---

## Features and Functionality

- **Code Input**:
  - Write pseudocode in a user-friendly, syntax-highlighted editor.
  - Clear the code with a single click.

- **Compilation**:
  - The pseudocode is compiled into Python code via a REST API.
  - View the Python code that was generated from the pseudocode.

- **Execution**:
  - Run the generated Python code directly in the browser using Pyodide.

- **Responsive Design**:
  - The app works on various devices, including desktops, tablets, and smartphones.

---

## Installation

To get started with the project locally, follow these steps:

### **Frontend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler
   cd IGCSE-Pseudocode-Online-Compiler
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:5173`.

### **Backend Setup**

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install the required dependencies (if using Django):
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your database (if applicable):
   ```bash
   python manage.py migrate
   ```

4. Run the Django server:
   ```bash
   python manage.py runserver
   ```

5. Open the backend in your browser at `http://localhost:8000`.

---

## API Endpoints

- **POST `/execution/convert/`**:
  - **Request Body**: Pseudocode string.
  - **Response**: Python code (string).
  
---

## Contributing

If you'd like to contribute to the project, feel free to submit a pull request with your changes! Please make sure to follow the below guidelines:

- Fork the repository.
- Create a new branch for each feature or bug fix.
- Write clear commit messages.
- Make sure tests pass before submitting a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any more changes or additions!
