from rag.pipeline import load_data, generate_response
from core.model_manager import model_manager

embedder = model_manager.get_embedder()

# db = load_data("data/medical.txt", embedder)

SYSTEM_PROMPT = """
You are a medical assistant.

Rules:
- Answer in max 4 lines
- Mention severity (Low/Medium/High)
- Suggest doctor if needed
"""

db = None

def handle(input_text):
    global db
    if db is None:
        db = load_data("data/medical.txt", embedder)
    return generate_response(input_text, db, SYSTEM_PROMPT)