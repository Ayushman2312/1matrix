from django.shortcuts import render
import google.generativeai as genai
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

# Configure API key
genai.configure(api_key="AIzaSyCuNUPDMtFwkHMS-FuDTr9bCctQGewYPcc")
model = genai.GenerativeModel("gemini-2.0-flash")

# Context cache file path
context_file = "listing_creater/context_cache.json"

# Load cached context from file (if exists)
if os.path.exists(context_file):
    with open(context_file, "r") as file:
        conversation_history = json.load(file)
else:
    conversation_history = []

# Start chat session
chat = model.start_chat(history=conversation_history)

@csrf_exempt
def ai_chat_view(request):
    if request.method == "POST":
        try:
            # Decode and parse JSON data
            data = json.loads(request.body.decode('utf-8'))
            platform_type = data.get("platform_type")
            urls = [url for url in data.get("urls", []) if url.strip()]  # Filter out empty URLs
            description = data.get("description")

            if not platform_type or len(urls) < 2 or not description:
                return JsonResponse({
                    "error": "Invalid input. Provide platform_type, at least 2 URLs, and description."
                }, status=400)

            if len(urls) > 4:
                return JsonResponse({
                    "error": "Maximum 4 URLs are allowed."
                }, status=400)

            # Create prompt
            user_input = (
                f"Platform Type: {platform_type}\n"
                f"URLs: {', '.join(urls)}\n"
                f"Description: {description}\n"
                f"Generate an insightful response based on this information."
            )

            prompt = (f"Create an {platform_type} product listing with only a compelling title and detailed product description for {description}. "
                     "The title should include main keywords and be under 200 characters. The product description should highlight key features, "
                     "benefits, and specifications in engaging language. No bullet points, A+ content, or other elements should be included - "
                     "strictly title and product description only. Product details:\n"
                     "- Product name: [specific product name]\n"
                     "- Main features: [list 3-5 key features]\n" 
                     "- Primary benefits: [list 2-3 main benefits]\n"
                     "- Technical specifications: [relevant specs like dimensions, materials, etc.]\n"
                     "- Target audience: [describe ideal customer]\n"
                     f"- Main keywords: [list 5-7 important keywords]\nThe following are the urls: {', '.join(urls)} analyze the content of the urls and use it to create a listing")

            # Send message and get AI response
            try:
                response = chat.send_message(prompt + user_input)
                
                # Update conversation history
                conversation_history.append({"role": "user", "parts": [user_input]})
                conversation_history.append({"role": "model", "parts": [response.text]})

                # Save updated context to file
                with open(context_file, "w") as file:
                    json.dump(conversation_history, file)

                print(response.text)
                return JsonResponse({"response": response.text})
                
            except Exception as e:
                return JsonResponse({
                    "error": f"AI service error: {str(e)}"
                }, status=500)

        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Invalid JSON data in request"
            }, status=400)
        except Exception as e:
            return JsonResponse({
                "error": f"Server error: {str(e)}"
            }, status=500)

    return render(request, "listing_creater/listingcreater.html")
