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

<h2>

Collected Inputs

</h2>

<pre>

${JSON.stringify(
panicData,
null,
2
)}

</pre>

<button>

Analyze Threat

</button>

`;

console.log(panicData);

}
