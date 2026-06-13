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

// INCIDENT
function incident(type){

panicData.incident_category=type;

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

// ACTIVE
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

// FINANCIAL
function saveFinancial(value){

panicData.has_financial_info=value;

document.getElementById("app").innerHTML=`

<h1>When did breach happen?</h1>

<button onclick="saveTime('less_than_10m')">

< 10 min

</button>

<button onclick="saveTime('less_than_1h')">

< 1 hour

</button>

<button onclick="saveTime('today')">

Today

</button>

<button onclick="saveTime('more_than_1d')">

> 1 day

</button>

`;

}

// TIME
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

// TRIAGE
function savePanic(value){

panicData.user_panic_level=value;

document.getElementById("app").innerHTML=`

<div class="loading">

<div class="spinner"></div>

<div class="loading-text">

Analyzing Threat...

</div>

<div class="loading-sub">

Consulting AI defense engine

</div>

</div>

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

Threat Level:
${data.threat_level}

</h1>

<h2>

${data.ai_calm_message}

</h2>

<h2>

Recovery Steps

</h2>

<div>

${[...new Set(data.action_steps)]

.map(
step=>

`<div class="step">

✓ ${step}

</div>`

)

.join("")}

</div>

<br>

<button onclick="generatePlaybook()">

Generate Recovery Playbook

</button>

`;

})

.catch(()=>{

document.getElementById("app").innerHTML=`

<h1>

Connection Failed

</h1>

`;

});

}

// PLAYBOOK
function generatePlaybook(){

document.getElementById("app").innerHTML=`

<h1>

Select Operating System

</h1>

<button onclick="requestPlaybook('Windows')">

Windows

</button>

<button onclick="requestPlaybook('Linux')">

Linux

</button>

`;

}

// PLAYBOOK REQUEST
function requestPlaybook(os){

document.getElementById("app").innerHTML=`

<div class="loading">

<div class="spinner"></div>

<div class="loading-text">

Generating Playbook...

</div>

<div class="loading-sub">

Building ${os} mitigation script

</div>

</div>

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
