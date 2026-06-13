from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create the server
app = FastAPI()

# Open the gates for cross-origin requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The API Contract 
class TriageData(BaseModel):
    incident_category: str
    is_attacker_active: bool
    has_financial_info: bool
    time_since_breach: str
    user_panic_level: int

# A simple test route just to see if the server is awake 
@app.get("/")
def read_root():
    return {"message": "CodeRed AI Engine is Online."}

# Catching the frontend data
@app.post("/triage")
def process_triage(data: TriageData):
    
    # Calculate a basic threat score based on their answers
    threat_score = 50
    if data.is_attacker_active:
        threat_score += 30
    if data.has_financial_info:
        threat_score += 20

    calculated_threat = "CRITICAL" if threat_score >= 80 else "HIGH"

    # Decide what message to send based on their panic slider
    if data.user_panic_level > 7:
        calm_message = "Your account is likely recoverable. Follow these red steps first."
    else:
        calm_message = "Let's secure your ecosystem."

    # Send the final package back to frontend 
    return {
        "status": "success",
        "threat_level": calculated_threat,
        "ai_calm_message": calm_message,
        "action_steps": [
            f"Immediately lock your {data.incident_category.replace('_', ' ')}.",
            "Force sign out of all active hardware sessions.",
            "Change your primary recovery email password."
        ]
    }