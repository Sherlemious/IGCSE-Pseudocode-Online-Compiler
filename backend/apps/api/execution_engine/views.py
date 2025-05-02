from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .parser import PseudocodeConverter  # Correct import path
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file

# Configure the Gemini API key
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables.")  # Or raise an error


@csrf_exempt
def execute_code(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            pseudocode = data.get('pseudocode', '')
            if not pseudocode:
                return JsonResponse({'error': 'No pseudocode provided'}, status=400)

            converter = PseudocodeConverter()
            pseudocode_lines = pseudocode.split('\n')
            python_code = converter.convert(pseudocode_lines)
            python_code_str = '\n'.join(python_code)

            return JsonResponse({'python_code': python_code_str}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def execute_code_with_gemini(request):
    if request.method == 'POST':
        try:
            # Check if API key was configured
            if not api_key:
                return JsonResponse({'error': 'Gemini API key not configured.'}, status=500)
            
            data = json.loads(request.body)
            pseudocode = data.get('pseudocode', '')
            if not pseudocode:
                return JsonResponse({'error': 'No pseudocode provided'}, status=400)

            # Initialize Gemini model with a potentially newer name
            model = genai.GenerativeModel('gemini-1.5-pro-latest')
            
            # Create prompt for the model
            prompt = f"""Convert the following IGCSE pseudocode to Python code. 
            Follow these rules:
            1. Use 1-indexed arrays
            2. Handle string operations (LCASE, UCASE, SUBSTRING) correctly
            3. Convert pseudocode operators to Python operators (MOD -> %, DIV -> //, etc.)
            4. Maintain proper indentation
            5. Add necessary imports
            
            Pseudocode:
            {pseudocode}
            
            Return only the Python code without any explanations."""

            # Generate response
            response = model.generate_content(prompt)
            python_code = response.text

            return JsonResponse({'python_code': python_code}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
