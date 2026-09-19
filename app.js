/*
 * Orbit robot login demo.
 * Change DEMO_ACCOUNT to customize the accepted local credentials.
 * For production, replace the local comparison with a secure API request.
 */
const DEMO_ACCOUNT=Object.freeze({
  email:"admin@robot.dev",
  password:"robot123",
  displayName:"Explorer"
});

const ui={
  body:document.body,
  card:document.querySelector("#loginCard"),
  form:document.querySelector("#loginForm"),
  email:document.querySelector("#email"),
  password:document.querySelector("#password"),
  emailField:document.querySelector("#emailField"),
  passwordField:document.querySelector("#passwordField"),
  emailError:document.querySelector("#emailError"),
  passwordError:document.querySelector("#passwordError"),
  passwordToggle:document.querySelector("#passwordToggle"),
  submit:document.querySelector("#submitButton"),
  submitLabel:document.querySelector(".button-label"),
  cardKicker:document.querySelector("#cardKicker"),
  title:document.querySelector("#login-title"),
  subtitle:document.querySelector("#loginSubtitle"),
  robotMessage:document.querySelector("#robotMessage"),
  demoFill:document.querySelector("#demoFill"),
  toast:document.querySelector("#toast"),
  toastText:document.querySelector("#toastText"),
  confetti:document.querySelector("#confettiLayer"),
  stars:document.querySelector("#stars")
};

let currentState="idle";
let toastTimer;
const copy={
  idle:{kicker:"SECURE ACCESS",title:"Welcome back",subtitle:"Enter your details and let’s get you back to orbit.",robot:"Hi! I’ll keep an eye on things.",button:"Sign in to Orbit"},
  loading:{kicker:"VERIFYING SIGNAL",title:"One tiny moment…",subtitle:"Byte is checking your access credentials securely.",robot:"Scanning… beep boop!",button:"Checking credentials"},
  success:{kicker:"ACCESS GRANTED",title:"You’re in!",subtitle:`Welcome back, ${DEMO_ACCOUNT.displayName}. Your space is ready for you.`,robot:"Yaaay! I knew it was you! ♥",button:"Welcome aboard ✓"},
  failure:{kicker:"ACCESS PAUSED",title:"Oh no, not quite",subtitle:"Those details didn’t match. Byte believes in your next try.",robot:"Aw… let’s try that together again.",button:"Try again"}
};

function createStars(){
  const fragment=document.createDocumentFragment();
  for(let i=0;i<32;i+=1){
    const star=document.createElement("span");
    star.style.left=`${Math.random()*100}%`;
    star.style.top=`${Math.random()*100}%`;
    star.style.setProperty("--duration",`${3+Math.random()*5}s`);
    star.style.animationDelay=`${Math.random()*-6}s`;
    fragment.appendChild(star);
  }
  ui.stars.appendChild(fragment);
}

function setState(state){
  currentState=state;
  const words=copy[state];
  ui.body.classList.toggle("is-success",state==="success");
  ui.body.classList.toggle("is-failure",state==="failure");
  ui.card.classList.toggle("is-loading",state==="loading");
  ui.card.classList.toggle("is-success",state==="success");
  ui.card.classList.toggle("is-failure",state==="failure");
  ui.cardKicker.textContent=words.kicker;
  ui.title.textContent=words.title;
  ui.subtitle.textContent=words.subtitle;
  ui.robotMessage.textContent=words.robot;
  ui.submitLabel.textContent=words.button;
  ui.submit.disabled=state==="loading"||state==="success";
  ui.form.setAttribute("aria-busy",state==="loading"?"true":"false");
}

function isValidEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function setFieldState(field,error,message="",valid=false){
  field.classList.toggle("is-error",Boolean(message));
  field.classList.toggle("is-valid",valid&&!message);
  error.textContent=message;
}

function validateForm(){
  const email=ui.email.value.trim();
  const password=ui.password.value;
  let firstInvalid=null;
  if(!email){setFieldState(ui.emailField,ui.emailError,"Please enter your email address.");firstInvalid=ui.email}
  else if(!isValidEmail(email)){setFieldState(ui.emailField,ui.emailError,"That email format doesn’t look right.");firstInvalid=ui.email}
  else setFieldState(ui.emailField,ui.emailError,"",true);
  if(!password){setFieldState(ui.passwordField,ui.passwordError,"Please enter your password.");firstInvalid??=ui.password}
  else if(password.length<6){setFieldState(ui.passwordField,ui.passwordError,"Use at least 6 characters.");firstInvalid??=ui.password}
  else setFieldState(ui.passwordField,ui.passwordError,"",true);
  firstInvalid?.focus();
  return !firstInvalid;
}

function launchConfetti(){
  const colors=["#65e7ff","#65f0b3","#ae73ff","#ff8066","#fff2a4","#ff769c"];
  const fragment=document.createDocumentFragment();
  ui.confetti.replaceChildren();
  for(let i=0;i<72;i+=1){
    const piece=document.createElement("i");
    piece.className="confetti-piece";
    piece.style.left=`${Math.random()*100}%`;
    piece.style.background=colors[i%colors.length];
    piece.style.setProperty("--drift",`${-120+Math.random()*240}px`);
    piece.style.setProperty("--rotation",`${360+Math.random()*900}deg`);
    piece.style.setProperty("--fall-duration",`${2.5+Math.random()*2}s`);
    piece.style.animationDelay=`${Math.random()*.75}s`;
    fragment.appendChild(piece);
  }
  ui.confetti.appendChild(fragment);
  window.setTimeout(()=>ui.confetti.replaceChildren(),5200);
}

function showToast(message){
  window.clearTimeout(toastTimer);
  ui.toastText.textContent=message;
  ui.toast.classList.add("visible");
  toastTimer=window.setTimeout(()=>ui.toast.classList.remove("visible"),3200);
}
function resetResultOnEdit(){if(currentState==="success"||currentState==="failure")setState("idle")}

ui.form.addEventListener("submit",event=>{
  event.preventDefault();
  if(!validateForm()){setState("failure");return}
  setState("loading");
  window.setTimeout(()=>{
    const authenticated=ui.email.value.trim().toLowerCase()===DEMO_ACCOUNT.email&&ui.password.value===DEMO_ACCOUNT.password;
    if(authenticated){
      setFieldState(ui.emailField,ui.emailError,"",true);
      setFieldState(ui.passwordField,ui.passwordError,"",true);
      setState("success");
      launchConfetti();
    }else{
      setFieldState(ui.emailField,ui.emailError,"Email or password is incorrect.");
      setFieldState(ui.passwordField,ui.passwordError,"Check the demo details and try again.");
      setState("failure");
      ui.password.select();
    }
  },1050);
});

ui.email.addEventListener("input",()=>{resetResultOnEdit();setFieldState(ui.emailField,ui.emailError,"",isValidEmail(ui.email.value.trim()))});
ui.password.addEventListener("input",()=>{resetResultOnEdit();setFieldState(ui.passwordField,ui.passwordError,"",ui.password.value.length>=6)});
ui.passwordToggle.addEventListener("click",()=>{
  const willShow=ui.password.type==="password";
  ui.password.type=willShow?"text":"password";
  ui.passwordToggle.setAttribute("aria-pressed",String(willShow));
  ui.passwordToggle.setAttribute("aria-label",willShow?"Hide password":"Show password");
  ui.password.focus();
});
ui.demoFill.addEventListener("click",()=>{
  ui.email.value=DEMO_ACCOUNT.email;ui.password.value=DEMO_ACCOUNT.password;
  setFieldState(ui.emailField,ui.emailError,"",true);setFieldState(ui.passwordField,ui.passwordError,"",true);
  setState("idle");ui.submit.focus();showToast("Demo credentials added — Byte is ready!");
});
document.querySelectorAll("[data-toast]").forEach(button=>button.addEventListener("click",()=>showToast(button.dataset.toast)));
document.querySelectorAll("[data-provider]").forEach(button=>button.addEventListener("click",()=>showToast(`${button.dataset.provider} sign-in is ready to connect to your OAuth provider.`)));
document.querySelectorAll('.site-nav a[href^="#"],.brand').forEach(link=>link.addEventListener("click",event=>{const target=link.getAttribute("href");if(target==="#"||!document.querySelector(target))event.preventDefault()}));
document.querySelector("#year").textContent=new Date().getFullYear();
createStars();
setState("idle");
