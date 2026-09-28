# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Add CORS middleware to allow the frontend to call the backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # In production, replace with specific origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class SymptomRequest(BaseModel):
#     symptoms: str

# @app.get("/")
# def home():
#     return {"message": "MAVERICK Backend is running"}


from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# from bots import medical_bot
# from memory.user_memory import add_history, get_history
from memory.user_memory import add_history, get_history

app = FastAPI()

# Add CORS middleware to allow the frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str
    user_id: str

@app.get("/")
def home():
    return {"message": "MAVERICK Backend is running"}

@app.post("/analyze/{bot}")
def analyze(bot: str, query: Query):
    from bots import medical_bot
    history = get_history(query.user_id)
    full_input = " ".join(history[-3:]) + " " + query.text

    if bot == "medical":
        response = medical_bot.handle(full_input)
    else:
        return {"error": "Invalid bot"}

    add_history(query.user_id, query.text)

    return {"response": response}


# @app.post("/api/analyze-symptoms")
# def analyze_symptoms(request: SymptomRequest):
#     try:
#         response = medical_rag.analyze_symptoms(request.symptoms)
#         return {"analysis": response}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-symptoms")
def analyze_symptoms(request: dict):
    from bots import medical_bot

    symptoms = request.get("symptoms", "")
    user_id = request.get("user_id", "default_user")

    # Get history
    history = get_history(user_id)
    full_input = " ".join(history[-3:]) + " " + symptoms

    # Call your AI
   # response = medical_bot.handle(full_input)
    response =  { "title": "Test Symptom",
  "insight": "Test",
  "loading": False,
  "hint": "Test hint",
  "analysis":"fever",
  "detail" : "Patient may have fever"
    }
    # Save history
    add_history(user_id, symptoms)

    return response

