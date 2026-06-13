let panicData={

incident_category:"",

is_attacker_active:false,

has_financial_info:false,

time_since_breach:"",

user_panic_level:0

};

document
.getElementById("panicBtn")
.onclick=start;

function start(){

document.getElementById("app").innerHTML=`

<h1>Select Incident</h1>

<button onclick="incident('otp_shared')">

OTP Shared

</button>

<button onclick="incident('account_hacked')">

Account Hacked

</button>

<button onclick="incident('suspicious_link')">

Suspicious Link

</button>

`;

}

function incident(value){

panicData.incident_category=value;

document.getElementById("app").innerHTML=`

<h1>Is attacker still active?</h1>

<button onclick="saveActive(true)">

YES

</button>

<button onclick="saveActive(false)">

NO

</button>

`;

}

function saveActive(value){

panicData.is_attacker_active=value;

document.getElementById("app").innerHTML=`

<h1>Financial Info Exposed?</h1>

<button onclick="saveFinancial(true)">

YES

</button>

<button onclick="saveFinancial(false)">

NO

</button>

`;

}

function saveFinancial(value){

panicData.has_financial_info=value;

document.getElementById("app").innerHTML=`

<h1>When did breach happen?</h1>

<button onclick="saveTime('less_than_10m')">

< 10 min

</button>

<button onclick="saveTime('less_than_1h')">

< 1 hr

</button>

<button onclick="saveTime('today')">

Today

</button>

<button onclick="saveTime('more_than_1d')">

> 1 day

</button>

`;

}

function saveTime(value){

panicData.time_since_breach=value;

document.getElementById("app").innerHTML=`

<h1>Panic Level</h1>

<button onclick="savePanic(3)">

LOW

</button>

<button onclick="savePanic(6)">

MEDIUM

</button>

<button onclick="savePanic(9)">

HIGH

</button>

`;

}

function savePanic(value){

panicData.user_panic_level=value;

document.getElementById("app").innerHTML=`

<h1>Ready For Analysis</h1>

<h2>Collected Inputs</h2>

<pre>${JSON.stringify(panicData, null, 2)}</pre>

<button onclick="analyzeThreat()">

Analyze Threat

</button>

`;

console.log(panicData);

}

async function analyzeThreat(){

document.getElementById("app").innerHTML=`<h1>Analyzing... Please wait</h1>`;

try {

const response = await fetch("http://localhost:8000/triage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(panicData)
});

const result = await response.json();

document.getElementById("app").innerHTML=`

<h1>Threat Level: ${result.threat_level}</h1>

<p>${result.ai_calm_message}</p>

<h2>Action Steps</h2>

<ol>
  ${result.action_steps.map(step => `<li>${step}</li>`).join("")}
</ol>

<button onclick="location.reload()">Start Over</button>

`;

} catch(err) {

document.getElementById("app").innerHTML=`

<h1>Error</h1>

<p>Could not connect to backend. Make sure the server is running.</p>

<button onclick="location.reload()">Try Again</button>

`;

console.error(err);

}

}