from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .compiler import PseudocodeCompiler
from .errors import CompilerError
import json

@csrf_exempt
def execute_code(request):
    """
    API endpoint to compile IGCSE pseudocode to Python

    POST /execution/convert/
    Body: {"pseudocode": "..."}

    Returns:
        Success: {"python_code": "...", "success": true}
        Error: {"error": "...", "suggestions": [...], "line": ..., "success": false}
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            pseudocode = data.get('pseudocode', '')

            if not pseudocode:
                return JsonResponse({
                    'error': 'No pseudocode provided',
                    'success': False
                }, status=400)

            # Use the new compiler with permissive mode for better compatibility
            compiler = PseudocodeCompiler(permissive=True)
            result = compiler.compile_with_errors(pseudocode)

            if result['success']:
                return JsonResponse({
                    'python_code': result['python_code'],
                    'success': True
                }, status=200)
            else:
                # Return detailed error information
                return JsonResponse({
                    'error': result['error'],
                    'suggestions': result.get('suggestions', []),
                    'line': result.get('line'),
                    'column': result.get('column'),
                    'success': False
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON in request body',
                'success': False
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'error': f'Unexpected server error: {str(e)}',
                'success': False
            }, status=500)

    return JsonResponse({
        'error': 'Invalid request method. Use POST.',
        'success': False
    }, status=405)