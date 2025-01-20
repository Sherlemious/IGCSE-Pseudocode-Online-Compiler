from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .parser import PseudocodeConverter  # Correct import path
import json

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