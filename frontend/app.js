let panicData = {
  incident_category: "",
  is_attacker_active: false,
  has_financial_info: false,
  time_since_breach: "",
  user_panic_level: 0
};


// START
document
.getElementById("panicBtn")
.onclick = start;



function start() {

document.getElementById("app").innerHTML = `

<h1>Select Incident</h1>

<button onclick="incident('otp_shared')">
OTP Shared
</button>

<br><br>

<button onclick="incident('account_hacked')">
Account Hacked
</button>

<br><br>

<button onclick="incident('suspicious_link')">
Suspicious Link
</button>

`;

}



// INCIDENT
function incident(type){

panicData.incident_category = type;

document.getElementById("app").innerHTML = `

<h1>Attacker still active?</h1>

<button onclick="saveActive(true)">
YES
</button>

<button onclick="saveActive(false)">
NO
</button>

`;

}



// ACTIVE
function saveActive(value){

panicData.is_attacker_active = value;

document.getElementById("app").innerHTML = `

<h1>Financial info exposed?</h1>

<button onclick="saveFinancial(true)">
YES
</button>

<button onclick="saveFinancial(false)">
NO
</button>

`;

}



// FINANCIAL
function saveFinancial(value){

panicData.has_financial_info = value;

document.getElementById("app").innerHTML = `

<h1>When did breach happen?</h1>

<button onclick="saveTime('less_than_10m')">
< 10 min
</button>

<br><br>

<button onclick="saveTime('less_than_1h')">
< 1 hour
</button>

<br><br>

<button onclick="saveTime('today')">
Today
</button>

<br><br>

<button onclick="saveTime('more_than_1d')">
> 1 day
</button>

`;

}



// TIME
function saveTime(value){

panicData.time_since_breach = value;

document.getElementById("app").innerHTML = `

<h1>Panic Level</h1>

<button onclick="savePanic(3)">
LOW
</button>

<br><br>

<button onclick="savePanic(6)">
MEDIUM
</button>

<br><br>

<button onclick="savePanic(9)">
HIGH
</button>

`;

}



// SEND TRIAGE
function savePanic(value){

panicData.user_panic_level = value;

document.getElementById("app").innerHTML = `

<h1>Analyzing Threat...</h1>

`;



fetch(
"http://127.0.0.1:8000/triage",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(
panicData
)

}

)

.then(response=>response.json())

.then(data=>{

document.getElementById("app").innerHTML=`

<h1>
Threat Level: ${data.threat_level}
</h1>

<h2>
${data.ai_calm_message}
</h2>

<h2>
Recovery Steps
</h2>

<div>

${[...new Set(data.action_steps)]
.map(step=>`<div class="step">✓ ${step}</div>`)
.join("")}

</div>

<br><br>

<button onclick="generatePlaybook()">
Generate Recovery Playbook
</button>

`;

})

.catch(error=>{

document.getElementById("app").innerHTML=`

<h1>
Connection Failed
</h1>

`;

console.log(error);

});

}



// PLAYBOOK
function generatePlaybook(){

document.getElementById("app").innerHTML=`

<h1>Select Operating System</h1>

<button onclick="requestPlaybook('Windows')">
Windows
</button>

<br><br>

<button onclick="requestPlaybook('Linux')">
Linux
</button>

`;

}



// REQUEST PLAYBOOK
function requestPlaybook(os){

document.getElementById("app").innerHTML=`

<h1>Generating Playbook...</h1>

`;



fetch(
"http://127.0.0.1:8000/playbook",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

incident_category:
panicData.incident_category,

os_type:
os

})

}

)

.then(response=>response.json())

.then(data=>{

document.getElementById("app").innerHTML=`

<h1>
Recovery Playbook
</h1>

<pre>

${data.script_content}

</pre>

`;

})

.catch(()=>{

document.getElementById("app").innerHTML=`

<h1>
Playbook Failed
</h1>

`;

});

}