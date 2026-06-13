import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai  
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the new Client
client = genai.Client()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriageData(BaseModel):
    incident_category: str
    is_attacker_active: bool
    has_financial_info: bool
    time_since_breach: str
    user_panic_level: int

@app.post("/triage")
def process_triage(data: TriageData):
    
    threat_score = 50
    if data.is_attacker_active:
        threat_score += 30
    if data.has_financial_info:
        threat_score += 20

    calculated_threat = "CRITICAL" if threat_score >= 80 else "HIGH"

    calm_message = "Your account is likely recoverable. Follow these steps first." if data.user_panic_level > 7 else "Let's secure your ecosystem."

    ai_prompt = f"""
    The user is experiencing a cyber emergency: {data.incident_category}. 
    The attacker active status is: {data.is_attacker_active}.
    Financial info at risk: {data.has_financial_info}.
    Give me EXACTLY 3 short, urgent, distinct action steps they must take right now to secure themselves.
    Do not use asterisks or formatting. Just put each step on a new line.
    """
    
    # Generate content using the Gemini API
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=ai_prompt
    )
    
    generated_steps = response.text.strip().split('\n')
    clean_steps = [step.strip() for step in generated_steps if step.strip()]

    return {
        "status": "success",
        "threat_level": calculated_threat,
        "ai_calm_message": calm_message,
        "action_steps": clean_steps
    }


# AUTOMATED PLAYBOOK GENERATION 

class PlaybookRequest(BaseModel):
    incident_category: str
    os_type: str 

@app.post("/playbook")
def generate_playbook(data: PlaybookRequest):
    
    # The Prompt Engineering for the Playbook Generation
    ai_prompt = f"""
    You are an elite level 3 Incident Response engineer.
    The user is currently experiencing a '{data.incident_category}' cyber attack.
    Their affected system is running: {data.os_type}.
    
    Write a highly secure, executable mitigation script to isolate the machine and stop the attack.
    If Windows, write PowerShell. If Linux, write Bash.
    
    CRITICAL INSTRUCTION: Return ONLY the raw script code. Do NOT use markdown code blocks (```). Do not include any explanations, warnings, or human text. Just the raw, executable text.
    """
    
    # Deploying the Heavy Model
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=ai_prompt
    )
    
    # Clean the response to ensure it's pure code
    raw_script = response.text.strip()

    return {
        "status": "success",
        "action": f"Generated {data.os_type} mitigation script",
        "script_content": raw_script
    }