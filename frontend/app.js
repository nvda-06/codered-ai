document
.getElementById("panicBtn")
.onclick=()=>{

document.body.innerHTML=`

<h1>Select Incident</h1>

<button class="incident">
OTP Shared
</button>

<button class="incident">
Account Hacked
</button>

<button class="incident">
Suspicious Link
</button>

`;

};



document.addEventListener("click",(e)=>{

if(
e.target.classList.contains("incident")
){

document.body.innerHTML=`

<h1>Threat Level: HIGH</h1>

<h2>Recovery Steps</h2>

<button>
Lock Account
</button>

<button>
Change Password
</button>

<button>
Enable MFA
</button>

`;

}

});