let panicData = {
  incident_category: "",
  is_attacker_active: false,
  has_financial_info: false,
  time_since_breach: "",
  user_panic_level: 0
};

// START
document.getElementById("panicBtn").onclick = start;

function start() {
  document.getElementById("app").innerHTML = `
    <h1>Select Incident</h1>
    <button onclick="incident('otp_shared')">OTP Shared</button><br><br>
    <button onclick="incident('account_hacked')">Account Hacked</button><br><br>
    <button onclick="incident('suspicious_link')">Suspicious Link</button>
  `;
}

// INCIDENT
function incident(type){
  panicData.incident_category = type;
  document.getElementById("app").innerHTML = `
    <h1>Attacker still active?</h1>
    <button onclick="saveActive(true)">YES</button>
    <button onclick="saveActive(false)">NO</button>
  `;
}

// ACTIVE
function saveActive(value){
  panicData.is_attacker_active = value;
  document.getElementById("app").innerHTML = `
    <h1>Financial info exposed?</h1>
    <button onclick="saveFinancial(true)">YES</button>
    <button onclick="saveFinancial(false)">NO</button>
  `;
}

// FINANCIAL
function saveFinancial(value){
  panicData.has_financial_info = value;
  document.getElementById("app").innerHTML = `
    <h1>When did breach happen?</h1>
    <button onclick="saveTime('less_than_10m')">< 10 min</button><br><br>
    <button onclick="saveTime('less_than_1h')">< 1 hour</button><br><br>
    <button onclick="saveTime('today')">Today</button><br><br>
    <button onclick="saveTime('more_than_1d')">> 1 day</button>
  `;
}

// TIME
function saveTime(value){
  panicData.time_since_breach = value;
  document.getElementById("app").innerHTML = `
    <h1>Panic Level</h1>
    <button onclick="savePanic(3)">LOW</button><br><br>
    <button onclick="savePanic(6)">MEDIUM</button><br><br>
    <button onclick="savePanic(9)">HIGH</button>
  `;
}

// SEND TRIAGE
function savePanic(value){
  panicData.user_panic_level = value;
  
  // Dynamic Loading Screen
  document.getElementById("app").innerHTML = `
    <div style="text-align: center;">
      <h1 style="animation: pulse 1.5s infinite; color: red;">Analyzing Threat...</h1>
      <p style="color: yellow;">Consulting AI defense models. Please wait.</p>
    </div>
    <style>
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
    </style>
  `;

  fetch("http://127.0.0.1:8000/triage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(panicData)
  })
  .then(async response => {
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error ${response.status}: ${errText}`);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("app").innerHTML = `
      <h1>Threat Level: ${data.threat_level}</h1>
      <h2>${data.ai_calm_message}</h2>
      <h2>Recovery Steps</h2>
      <div>
        ${[...new Set(data.action_steps)].map(step => `<div class="step">✓ ${step}</div>`).join("")}
      </div>
      <br><br>
      <button onclick="generatePlaybook()">Generate Recovery Playbook</button>
    `;
  })
  .catch(error => {
    document.getElementById("app").innerHTML = `
      <h1>System Error</h1>
      <p style="color: yellow; max-width: 800px; margin: 0 auto; line-height: 1.5;">${error.message}</p>
      <br>
      <button onclick="location.reload()">Start Over</button>
    `;
    console.error("Fetch Error:", error);
  });
}

// PLAYBOOK
function generatePlaybook(){
  document.getElementById("app").innerHTML = `
    <h1>Select Operating System</h1>
    <button onclick="requestPlaybook('Windows')">Windows</button><br><br>
    <button onclick="requestPlaybook('Linux')">Linux</button>
  `;
}

// REQUEST PLAYBOOK
function requestPlaybook(os){
  document.getElementById("app").innerHTML = `
    <div style="text-align: center;">
      <h1 style="animation: pulse 1.5s infinite; color: red;">Generating Playbook...</h1>
      <p style="color: yellow;">Writing custom ${os} mitigation script. Please wait.</p>
    </div>
  `;

  fetch("http://127.0.0.1:8000/playbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      incident_category: panicData.incident_category,
      os_type: os
    })
  })
  .then(async response => {
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error ${response.status}: ${errText}`);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("app").innerHTML = `
      <h1>Recovery Playbook</h1>
      <pre>${data.script_content}</pre>
      <button onclick="location.reload()">Done</button>
    `;
  })
  .catch(error => {
    document.getElementById("app").innerHTML = `
      <h1>Playbook Generation Failed</h1>
      <p style="color: yellow; max-width: 800px; margin: 0 auto; line-height: 1.5;">${error.message}</p>
      <br>
      <button onclick="location.reload()">Start Over</button>
    `;
    console.error("Playbook Error:", error);
  });
}