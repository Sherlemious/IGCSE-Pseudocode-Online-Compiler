# IGCSE Pseudocode Online Compiler

This project provides an online compiler/converter for IGCSE-style pseudocode, converting it into Python. It uses a Django backend with a custom parser and optionally the Gemini API for conversion, and a Vite-based frontend.

## Project Structure

- `backend/`: Contains the Django backend application.
  - `apps/api/execution_engine/`: Handles pseudocode parsing and conversion logic.
  - `pseudocodeCompiler/`: Main Django project settings and configuration.
  - `requirements.txt`: Backend Python dependencies.
  - `manage.py`: Django management script.
- `frontend/`: Contains the Vite frontend application.
  - `src/`: Frontend source code.
  - `package.json`: Frontend dependencies and scripts (assuming standard Node.js setup).
- `README.md`: This file.
- `LICENSE`: Project license information.

## Prerequisites

- Python 3.x
- pip (Python package installer)
- Node.js and npm (or yarn)
- Git (for cloning the repository)

## Setup and Running

### 1. Clone the Repository

```bash
git clone <repository-url> # Replace <repository-url> with the actual URL
cd IGCSE-Pseudocode-Online-Compiler
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment (recommended):

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Set up environment variables:
Create a `.env` file in the `backend` directory and add your Gemini API key if you plan to use the Gemini conversion endpoint:

```env
# backend/.env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

_(Note: The Gemini conversion endpoint (`/execution/convert/gemini/`) requires this key. The local parser endpoint (`/execution/convert/`) does not.)_

Apply database migrations (though currently not strictly necessary as there are no models):

```bash
python manage.py migrate
```

Start the Django development server (usually runs on `http://127.0.0.1:8000/`):

```bash
python manage.py runserver
```

Keep this terminal running.

### 3. Frontend Setup

Open a _new_ terminal window/tab. Navigate to the frontend directory:

```bash
# Make sure you are in the root project directory first
# cd .. (if you are still in the backend directory)
cd frontend
```

Install Node.js dependencies:

```bash
npm install
# or if you use yarn:
# yarn install
```

**Important:** For local development, you might need to update the API URL the frontend uses. Check the `frontend/.env` file. It currently points to `https://igcse-pseudocode-online-compiler.onrender.com`. Change it to point to your local backend:

```properties
# frontend/.env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend development server (usually runs on `http://localhost:5173/` or similar):

```bash
npm run dev
# or if you use yarn:
# yarn dev
```

Keep this terminal running.

### 4. Access the Application

Open your web browser and navigate to the frontend development server URL provided in the terminal (e.g., `http://localhost:5173/`). The frontend will communicate with your local backend API running on `http://127.0.0.1:8000/`.

## Usage

- Enter IGCSE-style pseudocode into the editor on the web interface.
- Click the "Convert" or "Run" button.
- The application will send the pseudocode to the backend.
- The backend will use its parser (or Gemini, if configured and called) to convert the pseudocode to Python.
- The resulting Python code will be displayed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
