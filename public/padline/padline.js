/*! Padline: a toy launch site that runs itself. https://me.raffi.website/padline
 * Built on the simulator kit by Nyxera0x and whaleyxbt (MIT): https://github.com/Nyxera0x/simulator
 * Source: simulator/ in the blog's repository. three.js is MIT licensed; its notice is at the end. */
var pg=`
html,body{margin:0;height:100%;overflow:hidden;background:var(--page,#dfe6fa);transition:background .6s}
.stage{position:fixed;inset:0;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
#app{position:absolute;left:0;top:0;width:1600px;height:900px;transform-origin:0 0;overflow:hidden;contain:strict}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
#poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:20;transition:opacity .5s}
#app.hide-ui .wt>*:not(.tags){opacity:0!important;transition:opacity .3s}
.pl{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:30;display:flex;align-items:center;gap:6px;
  background:rgba(15,23,48,.86);color:#fff;border-radius:14px;padding:6px 10px;box-shadow:0 8px 28px rgba(15,23,48,.28);
  font-size:13px;font-weight:600;font-feature-settings:"tnum";width:min(720px,calc(100vw - 24px));backdrop-filter:blur(8px);
  transition:opacity .4s}
.pl.idle{opacity:.0}
.pl button{all:unset;cursor:pointer;width:34px;height:34px;border-radius:9px;display:grid;place-items:center;flex:none}
.pl button:hover{background:rgba(255,255,255,.12)}
.pl button:focus-visible{outline:2px solid #b4f000;outline-offset:1px}
.pl button[aria-pressed="true"]{background:rgba(255,255,255,.16)}
.pl .tm{min-width:84px;text-align:center;opacity:.85;flex:none}
.pl .sc{position:relative;flex:1;height:34px;display:flex;align-items:center}
.pl input{all:unset;width:100%;height:34px;cursor:pointer}
.pl input::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:linear-gradient(90deg,#8fb0f7 var(--p,0%),rgba(255,255,255,.22) var(--p,0%))}
.pl input::-moz-range-track{height:4px;border-radius:2px;background:linear-gradient(90deg,#8fb0f7 var(--p,0%),rgba(255,255,255,.22) var(--p,0%))}
.pl input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;margin-top:-5px;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.pl input::-moz-range-thumb{width:14px;height:14px;border:0;border-radius:50%;background:#fff}
.pl input:focus-visible{outline:2px solid #b4f000;outline-offset:2px;border-radius:4px}
.pl .tick{position:absolute;top:50%;width:2px;height:8px;margin:-4px 0 0 -1px;border-radius:1px;background:rgba(255,255,255,.55);pointer-events:none}
.pl .lab{display:none}
.pl-link{color:#fff;text-decoration:none;font-size:12.5px;font-weight:700;padding:0 8px;height:34px;display:grid;place-items:center;border-radius:9px;white-space:nowrap;flex:none}
body>.pl-link{position:fixed;left:-999px}
.pl-link:hover{background:rgba(255,255,255,.12)}
.pl-link:focus-visible{outline:2px solid #b4f000;outline-offset:1px}
@media (max-width:560px){.pl .tm{min-width:64px;font-size:12px}.pl{gap:2px;padding:4px 6px}.pl-link{display:none}}
.rot{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:30;background:rgba(15,23,48,.86);color:#fff;font-size:12.5px;
  font-weight:600;padding:7px 12px;border-radius:10px;display:none;white-space:nowrap}
@media (orientation:portrait) and (max-width:700px){.rot{display:block}}
`,Co=n=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`,wr={play:Co('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),pause:Co('<path d="M8 5v14M16 5v14"/>'),restart:Co('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/>'),panels:Co('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M14 9v11"/>'),full:Co('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>')},cu=n=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`;async function Nf(n,t){let e={...n,...window.__SIM_CONFIG??{}},i=new URLSearchParams(location.search),s=!!window.__CAPTURE||i.has("capture"),r=document.createElement("style");r.textContent=pg,document.head.appendChild(r);let o=document.getElementById("app");if(!s){let xt=document.createElement("div");xt.className="stage",o.before(xt),xt.appendChild(o)}let a=document.createElement("canvas");a.id="gl",o.prepend(a);let l=document.getElementById("poster");await document.fonts.load('800 20px "Inter"').catch(()=>{});let c=1,h=1,u=()=>s?devicePixelRatio||1:Math.min(1.75,Math.max(.5,(devicePixelRatio||1)*c*h)),d=()=>{if(s)return;c=Math.min(innerWidth/1600,innerHeight/900);let xt=(innerWidth-1600*c)/2,K=(innerHeight-900*c)/2;o.style.transform=`translate(${xt}px,${K}px) scale(${c})`};d();let f=await t({cfg:e,canvas:a,capture:s,pixelRatio:u}),p=e.duration,v=Number(i.get("t"))||0,g="",m=xt=>{let K=f.render(xt)||{};K.bg&&K.bg!==g&&(g=K.bg,document.documentElement.style.setProperty("--page",K.bg))};if(window.SIM={cfg:e,duration:p,fps:e.fps,ready:!0,render:xt=>{v=xt,m(xt)}},s){m(v);return}let b=!matchMedia("(prefers-reduced-motion: reduce)").matches,y=document.createElement("div");y.className="pl",y.setAttribute("role","group"),y.setAttribute("aria-label","Film controls"),y.innerHTML=`
    <button data-k="play" aria-label="Pause">${wr.pause}</button>
    <button data-k="restart" aria-label="Restart">${wr.restart}</button>
    <span class="tm" data-k="tm">0:00 / ${cu(p)}</span>
    <label class="sc"><span class="lab">Scrub through the film</span><input data-k="scrub" type="range" min="0" max="${p}" step="0.01" value="0" aria-label="Position in the film">${(e.marks??[]).map(xt=>`<i class="tick" style="left:${(100*xt/p).toFixed(2)}%"></i>`).join("")}</label>
    <button data-k="panels" aria-label="Hide the panels" aria-pressed="false">${wr.panels}</button>
    <button data-k="full" aria-label="Full screen">${wr.full}</button>`,document.body.appendChild(y);let M=document.querySelector(".pl-link");M&&y.appendChild(M);let w=document.createElement("div");w.className="rot",w.textContent="Turn your phone sideways for a bigger view",document.body.appendChild(w);let T=xt=>y.querySelector(`[data-k="${xt}"]`),x=T("play"),E=T("scrub"),C=T("tm"),D=xt=>{b=xt,x.innerHTML=xt?wr.pause:wr.play,x.setAttribute("aria-label",xt?"Pause":"Play")};D(b);let N=!0,F=xt=>{v=(xt%p+p)%p,N=!0},P=()=>{let xt=o.classList.toggle("hide-ui");T("panels").setAttribute("aria-pressed",String(xt)),T("panels").setAttribute("aria-label",xt?"Show the panels":"Hide the panels")},z=()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{})};x.onclick=()=>D(!b),T("restart").onclick=()=>{F(0),D(!0)},T("panels").onclick=P,T("full").onclick=z,document.documentElement.requestFullscreen||(T("full").style.display="none");let G=!1;E.addEventListener("pointerdown",()=>{G=b,D(!1)}),E.addEventListener("input",()=>F(Number(E.value))),E.addEventListener("change",()=>G&&D(!0)),addEventListener("keydown",xt=>{if(!(xt.target===E&&(xt.key==="ArrowLeft"||xt.key==="ArrowRight"))){if(xt.key===" "&&xt.target.tagName!=="BUTTON")D(!b);else if(xt.key==="r"||xt.key==="R")F(0);else if(xt.key==="ArrowRight")F(v+2);else if(xt.key==="ArrowLeft")F(v-2);else if(xt.key==="h"||xt.key==="H")P();else if(xt.key==="f"||xt.key==="F")z();else return;xt.preventDefault()}});let $,et=()=>{y.classList.remove("idle"),clearTimeout($),$=setTimeout(()=>b&&!y.matches(":hover, :focus-within")&&y.classList.add("idle"),2600)};["pointermove","pointerdown","keydown"].forEach(xt=>addEventListener(xt,et,{passive:!0})),et();for(let xt of e.warm??[])m(xt);let X=()=>{d(),f.resize?.(),N=!0};addEventListener("resize",X),X();let tt=performance.now(),nt=!1,St=-1,yt=0,jt=0,$t=xt=>{let K=(xt-tt)/1e3,R=Math.min(.1,K);tt=xt,b&&document.visibilityState==="visible"&&++yt>60&&(jt+=K,yt%60===0&&(jt/60>1/36&&h>.55&&(h*=.85,f.resize?.()),jt=0)),b&&(v=(v+R)%p),(b||N)&&(N=!1,m(v)),Math.abs(v-St)>.05&&(St=v,E.value=v.toFixed(2),E.style.setProperty("--p",`${(100*v/p).toFixed(2)}%`),C.textContent=`${cu(v)} / ${cu(p)}`),nt||(nt=!0,l&&(l.style.opacity="0",setTimeout(()=>l.remove(),600))),requestAnimationFrame($t)};requestAnimationFrame($t)}var yc="186";var pp=0,qu=1,mp=2;var rr=1,gp=2,no=3,Fs=0,Te=1,xi=2,nn=0,io=1,ya=2,Yu=3,Zu=4,_c=5;var vi=100,xp=101,vp=102,yp=103,_p=104,or=200,bp=201,Mp=202,Sp=203,Ju=204,ju=205,_a=206,wp=207,ba=208,Ep=209,Tp=210,Ap=211,Rp=212,Cp=213,Ip=214,zl=0,kl=1,Hl=2,Gr=3,Gl=4,Vl=5,Wl=6,Xl=7,bc=0,Pp=1,Lp=2,Fi=0,Ma=1,Sa=2,wa=3,ar=4,Ea=5,Ta=6,ms=7;var Ku=300,Os=301,lr=302,Mc=303,Sc=304,Aa=306,fi=1e3,Vi=1001,$l=1002,je=1003,Dp=1004;var Ra=1005;var An=1006,wc=1007;var Bs=1008;var On=1009,Qu=1010,td=1011,so=1012,Ec=1013,Oi=1014,yi=1015,bn=1016,Tc=1017,Ac=1018,zs=1020,ed=35902,nd=35899,id=1021,sd=1022,jn=1023,Xi=1026,Zi=1027,Rc=1028,Cc=1029,ks=1030,Ic=1031;var Pc=1033,Ca=33776,Ia=33777,Pa=33778,La=33779,Lc=35840,Dc=35841,Uc=35842,Nc=35843,Fc=36196,Oc=37492,Bc=37496,zc=37488,kc=37489,Da=37490,Hc=37491,Gc=37808,Vc=37809,Wc=37810,Xc=37811,$c=37812,qc=37813,Yc=37814,Zc=37815,Jc=37816,jc=37817,Kc=37818,Qc=37819,th=37820,eh=37821,nh=36492,ih=36494,sh=36495,rh=36283,oh=36284,Ua=36285,ah=36286;var Ho=2300,ql=2301,Ol=2302,Nu=2303,Fu=2400,Ou=2401,Bu=2402;var Up=3200;var ro=0,Np=1,gs="",Fe="srgb",Go="srgb-linear",Vo="linear",xe="srgb";var Bl=7680;var Fp=519,Op=512,Bp=513,zp=514,lh=515,kp=516,Hp=517,ch=518,Gp=519,rd=35044,od=35048;var ad="300 es",Di=2e3,Vr=2001;function mg(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function gg(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Wo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Vp(){let n=Wo("canvas");return n.style.display="block",n}var Ff={},Wr=null;function Xo(...n){let t="THREE."+n.shift();Wr?Wr("log",t,...n):console.log(t,...n)}function Wp(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Kt(...n){n=Wp(n);let t="THREE."+n.shift();if(Wr)Wr("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function te(...n){n=Wp(n);let t="THREE."+n.shift();if(Wr)Wr("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function tr(...n){let t=n.join(" ");t in Ff||(Ff[t]=!0,Kt(...n))}function Xp(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var $p={[zl]:kl,[Hl]:Wl,[Gl]:Xl,[Gr]:Vl,[kl]:zl,[Wl]:Hl,[Xl]:Gl,[Vl]:Gr},$i=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Of=1234567,Oo=Math.PI/180,Xr=180/Math.PI;function Wi(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Nn[n&255]+Nn[n>>8&255]+Nn[n>>16&255]+Nn[n>>24&255]+"-"+Nn[t&255]+Nn[t>>8&255]+"-"+Nn[t>>16&15|64]+Nn[t>>24&255]+"-"+Nn[e&63|128]+Nn[e>>8&255]+"-"+Nn[e>>16&255]+Nn[e>>24&255]+Nn[i&255]+Nn[i>>8&255]+Nn[i>>16&255]+Nn[i>>24&255]).toLowerCase()}function ie(n,t,e){return Math.max(t,Math.min(e,n))}function ld(n,t){return(n%t+t)%t}function xg(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function vg(n,t,e){return n!==t?(e-n)/(t-n):0}function Bo(n,t,e){return(1-e)*n+e*t}function yg(n,t,e,i){return Bo(n,t,1-Math.exp(-e*i))}function _g(n,t=1){return t-Math.abs(ld(n,t*2)-t)}function bg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Mg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Sg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function wg(n,t){return n+Math.random()*(t-n)}function Eg(n){return n*(.5-Math.random())}function Tg(n){n!==void 0&&(Of=n);let t=Of+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ag(n){return n*Oo}function Rg(n){return n*Xr}function Cg(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Ig(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Pg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Lg(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),h=o((t+i)/2),u=r((t-i)/2),d=o((t-i)/2),f=r((i-t)/2),p=o((i-t)/2);switch(s){case"XYX":n.set(a*h,l*u,l*d,a*c);break;case"YZY":n.set(l*d,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*d,a*h,a*c);break;case"XZX":n.set(a*h,l*p,l*f,a*c);break;case"YXY":n.set(l*f,a*h,l*p,a*c);break;case"ZYZ":n.set(l*p,l*f,a*h,a*c);break;default:Kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Li(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function we(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var cd={DEG2RAD:Oo,RAD2DEG:Xr,generateUUID:Wi,clamp:ie,euclideanModulo:ld,mapLinear:xg,inverseLerp:vg,lerp:Bo,damp:yg,pingpong:_g,smoothstep:bg,smootherstep:Mg,randInt:Sg,randFloat:wg,randFloatSpread:Eg,seededRandom:Tg,degToRad:Ag,radToDeg:Rg,isPowerOfTwo:Cg,ceilPowerOfTwo:Ig,floorPowerOfTwo:Pg,setQuaternionFromProperEuler:Lg,normalize:we,denormalize:Li},ct=class n{static{n.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ie(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ve=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[o+0],f=r[o+1],p=r[o+2],v=r[o+3];if(u!==v||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*v;g<0&&(d=-d,f=-f,p=-p,v=-v,g=-g);let m=1-a;if(g<.9995){let _=Math.acos(g),b=Math.sin(_);m=Math.sin(m*_)/b,a=Math.sin(a*_)/b,l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+v*a}else{l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+v*a;let _=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=_,c*=_,h*=_,u*=_}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+l*f-c*d,t[e+1]=l*p+h*d+c*u-a*f,t[e+2]=c*p+h*f+a*d-l*u,t[e+3]=h*p-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),d=l(i/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Kt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>u){let f=2*Math.sqrt(1+i-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-i-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ie(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class n{static{n.prototype.isVector3=!0}constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Bf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Bf.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return hu.copy(this).projectOnVector(t),this.sub(hu)}reflect(t){return this.sub(hu.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ie(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},hu=new U,Bf=new ve,se=class n{static{n.prototype.isMatrix3=!0}constructor(t,e,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],p=i[8],v=s[0],g=s[3],m=s[6],_=s[1],b=s[4],y=s[7],M=s[2],w=s[5],T=s[8];return r[0]=o*v+a*_+l*M,r[3]=o*g+a*b+l*w,r[6]=o*m+a*y+l*T,r[1]=c*v+h*_+u*M,r[4]=c*g+h*b+u*w,r[7]=c*m+h*y+u*T,r[2]=d*v+f*_+p*M,r[5]=d*g+f*b+p*w,r[8]=d*m+f*y+p*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,p=e*u+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/p;return t[0]=u*v,t[1]=(s*c-h*i)*v,t[2]=(a*i-s*o)*v,t[3]=d*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(i*l-c*e)*v,t[8]=(o*e-i*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return tr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(uu.makeScale(t,e)),this}rotate(t){return tr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(uu.makeRotation(-t)),this}translate(t,e){return tr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(uu.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},uu=new se,zf=new se().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kf=new se().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dg(){let n={enabled:!0,workingColorSpace:Go,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xe&&(s.r=ds(s.r),s.g=ds(s.g),s.b=ds(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xe&&(s.r=Hr(s.r),s.g=Hr(s.g),s.b=Hr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gs?Vo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return tr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return tr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Go]:{primaries:t,whitePoint:i,transfer:Vo,toXYZ:zf,fromXYZ:kf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Fe},outputColorSpaceConfig:{drawingBufferColorSpace:Fe}},[Fe]:{primaries:t,whitePoint:i,transfer:xe,toXYZ:zf,fromXYZ:kf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Fe}}}),n}var ue=Dg();function ds(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Er,Yl=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Er===void 0&&(Er=Wo("canvas")),Er.width=t.width,Er.height=t.height;let s=Er.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Er}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Wo("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ds(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ds(e[i]/255)*255):e[i]=ds(e[i]);return{data:e,width:t.width,height:t.height}}else return Kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ug=0,$r=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=Wi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(du(s[o].image)):r.push(du(s[o]))}else r=du(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function du(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Yl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Kt("Texture: Unable to serialize Texture."),{})}var Ng=0,fu=new U,Wn=class n extends $i{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Vi,s=Vi,r=An,o=Bs,a=jn,l=On,c=n.DEFAULT_ANISOTROPY,h=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=Wi(),this.name="",this.source=new $r(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ct(0,0),this.repeat=new ct(1,1),this.center=new ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(fu).x}get height(){return this.source.getSize(fu).y}get depth(){return this.source.getSize(fu).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Kt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ku)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case fi:t.x=t.x-Math.floor(t.x);break;case Vi:t.x=t.x<0?0:1;break;case $l:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case fi:t.y=t.y-Math.floor(t.y);break;case Vi:t.y=t.y<0?0:1;break;case $l:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Wn.DEFAULT_IMAGE=null;Wn.DEFAULT_MAPPING=Ku;Wn.DEFAULT_ANISOTROPY=1;var Se=class n{static{n.prototype.isVector4=!0}constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(c+1)/2,y=(f+1)/2,M=(m+1)/2,w=(h+d)/4,T=(u+v)/4,x=(p+g)/4;return b>y&&b>M?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=w/i,r=T/i):y>M?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=w/s,r=x/s):M<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),i=T/r,s=x/r),this.set(i,s,r,e),this}let _=Math.sqrt((g-p)*(g-p)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this.w=ie(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this.w=ie(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Zl=class extends $i{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new Wn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:An,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new $r(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ke=class extends Zl{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},$o=class extends Wn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Jl=class extends Wn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Dt=class n{static{n.prototype.isMatrix4=!0}constructor(t,e,i,s,r,o,a,l,c,h,u,d,f,p,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,u,d,f,p,v,g)}set(t,e,i,s,r,o,a,l,c,h,u,d,f,p,v,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Tr.setFromMatrixColumn(t,0).length(),r=1/Tr.setFromMatrixColumn(t,1).length(),o=1/Tr.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+p*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d+v*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=p*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+p,e[10]=d-v*u}else if(t.order==="XZY"){let d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fg,t,Og)}lookAt(t,e,i){let s=this.elements;return ei.subVectors(t,e),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),Es.crossVectors(i,ei),Es.lengthSq()===0&&(Math.abs(i.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),Es.crossVectors(i,ei)),Es.normalize(),pl.crossVectors(ei,Es),s[0]=Es.x,s[4]=pl.x,s[8]=ei.x,s[1]=Es.y,s[5]=pl.y,s[9]=ei.y,s[2]=Es.z,s[6]=pl.z,s[10]=ei.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],p=i[2],v=i[6],g=i[10],m=i[14],_=i[3],b=i[7],y=i[11],M=i[15],w=s[0],T=s[4],x=s[8],E=s[12],C=s[1],D=s[5],N=s[9],F=s[13],P=s[2],z=s[6],G=s[10],$=s[14],et=s[3],X=s[7],tt=s[11],nt=s[15];return r[0]=o*w+a*C+l*P+c*et,r[4]=o*T+a*D+l*z+c*X,r[8]=o*x+a*N+l*G+c*tt,r[12]=o*E+a*F+l*$+c*nt,r[1]=h*w+u*C+d*P+f*et,r[5]=h*T+u*D+d*z+f*X,r[9]=h*x+u*N+d*G+f*tt,r[13]=h*E+u*F+d*$+f*nt,r[2]=p*w+v*C+g*P+m*et,r[6]=p*T+v*D+g*z+m*X,r[10]=p*x+v*N+g*G+m*tt,r[14]=p*E+v*F+g*$+m*nt,r[3]=_*w+b*C+y*P+M*et,r[7]=_*T+b*D+y*z+M*X,r[11]=_*x+b*N+y*G+M*tt,r[15]=_*E+b*F+y*$+M*nt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],v=t[7],g=t[11],m=t[15],_=l*f-c*d,b=a*f-c*u,y=a*d-l*u,M=o*f-c*h,w=o*d-l*h,T=o*u-a*h;return e*(v*_-g*b+m*y)-i*(p*_-g*M+m*w)+s*(p*b-v*M+m*T)-r*(p*y-v*w+g*T)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-i*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],v=t[13],g=t[14],m=t[15],_=e*a-i*o,b=e*l-s*o,y=e*c-r*o,M=i*l-s*a,w=i*c-r*a,T=s*c-r*l,x=h*v-u*p,E=h*g-d*p,C=h*m-f*p,D=u*g-d*v,N=u*m-f*v,F=d*m-f*g,P=_*F-b*N+y*D+M*C-w*E+T*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/P;return t[0]=(a*F-l*N+c*D)*z,t[1]=(s*N-i*F-r*D)*z,t[2]=(v*T-g*w+m*M)*z,t[3]=(d*w-u*T-f*M)*z,t[4]=(l*C-o*F-c*E)*z,t[5]=(e*F-s*C+r*E)*z,t[6]=(g*y-p*T-m*b)*z,t[7]=(h*T-d*y+f*b)*z,t[8]=(o*N-a*C+c*x)*z,t[9]=(i*C-e*N-r*x)*z,t[10]=(p*w-v*y+m*_)*z,t[11]=(u*y-h*w-f*_)*z,t[12]=(a*E-o*D-l*x)*z,t[13]=(e*D-i*E+s*x)*z,t[14]=(v*b-p*M-g*_)*z,t[15]=(h*M-u*b+d*_)*z,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,p=r*u,v=o*h,g=o*u,m=a*u,_=l*c,b=l*h,y=l*u,M=i.x,w=i.y,T=i.z;return s[0]=(1-(v+m))*M,s[1]=(f+y)*M,s[2]=(p-b)*M,s[3]=0,s[4]=(f-y)*w,s[5]=(1-(d+m))*w,s[6]=(g+_)*w,s[7]=0,s[8]=(p+b)*T,s[9]=(g-_)*T,s[10]=(1-(d+v))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=Tr.set(s[0],s[1],s[2]).length(),a=Tr.set(s[4],s[5],s[6]).length(),l=Tr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Ri.copy(this);let c=1/o,h=1/a,u=1/l;return Ri.elements[0]*=c,Ri.elements[1]*=c,Ri.elements[2]*=c,Ri.elements[4]*=h,Ri.elements[5]*=h,Ri.elements[6]*=h,Ri.elements[8]*=u,Ri.elements[9]*=u,Ri.elements[10]*=u,e.setFromRotationMatrix(Ri),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,s,r,o,a=Di,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(i-s),d=(e+t)/(e-t),f=(i+s)/(i-s),p,v;if(l)p=r/(o-r),v=o*r/(o-r);else if(a===Di)p=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Vr)p=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=Di,l=!1){let c=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s),p,v;if(l)p=1/(o-r),v=o/(o-r);else if(a===Di)p=-2/(o-r),v=-(o+r)/(o-r);else if(a===Vr)p=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Tr=new U,Ri=new Dt,Fg=new U(0,0,0),Og=new U(1,1,1),Es=new U,pl=new U,ei=new U,Hf=new Dt,Gf=new ve,hn=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ie(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Hf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gf.setFromEuler(this),this.setFromQuaternion(Gf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hn.DEFAULT_ORDER="XYZ";var qo=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Bg=0,Vf=new U,Ar=new ve,as=new Dt,ml=new U,Io=new U,zg=new U,kg=new ve,Wf=new U(1,0,0),Xf=new U(0,1,0),$f=new U(0,0,1),qf={type:"added"},Hg={type:"removed"},Rr={type:"childadded",child:null},pu={type:"childremoved",child:null},Qe=class n extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bg++}),this.uuid=Wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new U,e=new hn,i=new ve,s=new U(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Dt},normalMatrix:{value:new se}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ar.setFromAxisAngle(t,e),this.quaternion.multiply(Ar),this}rotateOnWorldAxis(t,e){return Ar.setFromAxisAngle(t,e),this.quaternion.premultiply(Ar),this}rotateX(t){return this.rotateOnAxis(Wf,t)}rotateY(t){return this.rotateOnAxis(Xf,t)}rotateZ(t){return this.rotateOnAxis($f,t)}translateOnAxis(t,e){return Vf.copy(t).applyQuaternion(this.quaternion),this.position.add(Vf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wf,t)}translateY(t){return this.translateOnAxis(Xf,t)}translateZ(t){return this.translateOnAxis($f,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(as.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ml.copy(t):ml.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?as.lookAt(Io,ml,this.up):as.lookAt(ml,Io,this.up),this.quaternion.setFromRotationMatrix(as),s&&(as.extractRotation(s.matrixWorld),Ar.setFromRotationMatrix(as),this.quaternion.premultiply(Ar.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(te("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(qf),Rr.child=t,this.dispatchEvent(Rr),Rr.child=null):te("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Hg),pu.child=t,this.dispatchEvent(pu),pu.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),as.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),as.multiply(t.parent.matrixWorld)),t.applyMatrix4(as),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(qf),Rr.child=t,this.dispatchEvent(Rr),Rr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Io,t,zg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Io,kg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Qe.DEFAULT_UP=new U(0,1,0);Qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ht=class extends Qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gg={type:"move"},qr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let g=e.getJointPose(v,i),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Ht;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},qp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ts={h:0,s:0,l:0},gl={h:0,s:0,l:0};function mu(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Ot=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ue.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ue.workingColorSpace){return this.r=t,this.g=e,this.b=i,ue.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ue.workingColorSpace){if(t=ld(t,1),e=ie(e,0,1),i=ie(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=mu(o,r,t+1/3),this.g=mu(o,r,t),this.b=mu(o,r,t-1/3)}return ue.colorSpaceToWorking(this,s),this}setStyle(t,e=Fe){function i(r){r!==void 0&&parseFloat(r)<1&&Kt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Kt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fe){let i=qp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ds(t.r),this.g=ds(t.g),this.b=ds(t.b),this}copyLinearToSRGB(t){return this.r=Hr(t.r),this.g=Hr(t.g),this.b=Hr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fe){return ue.workingToColorSpace(Fn.copy(this),t),Math.round(ie(Fn.r*255,0,255))*65536+Math.round(ie(Fn.g*255,0,255))*256+Math.round(ie(Fn.b*255,0,255))}getHexString(t=Fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ue.workingColorSpace){ue.workingToColorSpace(Fn.copy(this),e);let i=Fn.r,s=Fn.g,r=Fn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ue.workingColorSpace){return ue.workingToColorSpace(Fn.copy(this),e),t.r=Fn.r,t.g=Fn.g,t.b=Fn.b,t}getStyle(t=Fe){ue.workingToColorSpace(Fn.copy(this),t);let e=Fn.r,i=Fn.g,s=Fn.b;return t!==Fe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Ts),this.setHSL(Ts.h+t,Ts.s+e,Ts.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ts),t.getHSL(gl);let i=Bo(Ts.h,gl.h,e),s=Bo(Ts.s,gl.s,e),r=Bo(Ts.l,gl.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new Ot;Ot.NAMES=qp;var Yo=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ot(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},fs=class extends Qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Ci=new U,ls=new U,gu=new U,cs=new U,Cr=new U,Ir=new U,Yf=new U,xu=new U,vu=new U,yu=new U,_u=new Se,bu=new Se,Mu=new Se,Is=class n{constructor(t=new U,e=new U,i=new U){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Ci.subVectors(t,e),s.cross(Ci);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Ci.subVectors(s,e),ls.subVectors(i,e),gu.subVectors(t,e);let o=Ci.dot(Ci),a=Ci.dot(ls),l=Ci.dot(gu),c=ls.dot(ls),h=ls.dot(gu),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,cs)===null?!1:cs.x>=0&&cs.y>=0&&cs.x+cs.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,cs)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,cs.x),l.addScaledVector(o,cs.y),l.addScaledVector(a,cs.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return _u.setScalar(0),bu.setScalar(0),Mu.setScalar(0),_u.fromBufferAttribute(t,e),bu.fromBufferAttribute(t,i),Mu.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(_u,r.x),o.addScaledVector(bu,r.y),o.addScaledVector(Mu,r.z),o}static isFrontFacing(t,e,i,s){return Ci.subVectors(i,e),ls.subVectors(t,e),Ci.cross(ls).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ci.subVectors(this.c,this.b),ls.subVectors(this.a,this.b),Ci.cross(ls).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;Cr.subVectors(s,i),Ir.subVectors(r,i),xu.subVectors(t,i);let l=Cr.dot(xu),c=Ir.dot(xu);if(l<=0&&c<=0)return e.copy(i);vu.subVectors(t,s);let h=Cr.dot(vu),u=Ir.dot(vu);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Cr,o);yu.subVectors(t,r);let f=Cr.dot(yu),p=Ir.dot(yu);if(p>=0&&f<=p)return e.copy(r);let v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(i).addScaledVector(Ir,a);let g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Yf.subVectors(r,s),a=(u-h)/(u-h+(f-p)),e.copy(s).addScaledVector(Yf,a);let m=1/(g+v+d);return o=v*m,a=d*m,e.copy(i).addScaledVector(Cr,o).addScaledVector(Ir,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},tn=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Ii):Ii.fromBufferAttribute(r,o),Ii.applyMatrix4(t.matrixWorld),this.expandByPoint(Ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xl.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),xl.copy(i.boundingBox)),xl.applyMatrix4(t.matrixWorld),this.union(xl)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ii),Ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Po),vl.subVectors(this.max,Po),Pr.subVectors(t.a,Po),Lr.subVectors(t.b,Po),Dr.subVectors(t.c,Po),As.subVectors(Lr,Pr),Rs.subVectors(Dr,Lr),Zs.subVectors(Pr,Dr);let e=[0,-As.z,As.y,0,-Rs.z,Rs.y,0,-Zs.z,Zs.y,As.z,0,-As.x,Rs.z,0,-Rs.x,Zs.z,0,-Zs.x,-As.y,As.x,0,-Rs.y,Rs.x,0,-Zs.y,Zs.x,0];return!Su(e,Pr,Lr,Dr,vl)||(e=[1,0,0,0,1,0,0,0,1],!Su(e,Pr,Lr,Dr,vl))?!1:(yl.crossVectors(As,Rs),e=[yl.x,yl.y,yl.z],Su(e,Pr,Lr,Dr,vl))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hs[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hs[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hs[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hs[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hs[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hs[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hs[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hs[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hs),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},hs=[new U,new U,new U,new U,new U,new U,new U,new U],Ii=new U,xl=new tn,Pr=new U,Lr=new U,Dr=new U,As=new U,Rs=new U,Zs=new U,Po=new U,vl=new U,yl=new U,Js=new U;function Su(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Js.fromArray(n,r);let a=s.x*Math.abs(Js.x)+s.y*Math.abs(Js.y)+s.z*Math.abs(Js.z),l=t.dot(Js),c=e.dot(Js),h=i.dot(Js);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var cn=new U,_l=new ct,Vg=0,Ee=class extends $i{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vg++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=rd,this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)_l.fromBufferAttribute(this,e),_l.applyMatrix3(t),this.setXY(e,_l.x,_l.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix3(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix4(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyNormalMatrix(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.transformDirection(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Li(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Li(e,this.array)),e}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Li(e,this.array)),e}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Li(e,this.array)),e}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Li(e,this.array)),e}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array),r=we(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Zo=class extends Ee{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Jo=class extends Ee{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Qt=class extends Ee{constructor(t,e,i){super(new Float32Array(t),e,i)}},Wg=new tn,Lo=new U,wu=new U,pi=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Wg.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Lo.subVectors(t,this.center);let e=Lo.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Lo,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(wu.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Lo.copy(t.center).add(wu)),this.expandByPoint(Lo.copy(t.center).sub(wu))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Xg=0,di=new Dt,Eu=new Qe,Ur=new U,ni=new tn,Do=new tn,yn=new U,ge=class n extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=Wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mg(t)?Jo:Zo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new se().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return di.makeRotationFromQuaternion(t),this.applyMatrix4(di),this}rotateX(t){return di.makeRotationX(t),this.applyMatrix4(di),this}rotateY(t){return di.makeRotationY(t),this.applyMatrix4(di),this}rotateZ(t){return di.makeRotationZ(t),this.applyMatrix4(di),this}translate(t,e,i){return di.makeTranslation(t,e,i),this.applyMatrix4(di),this}scale(t,e,i){return di.makeScale(t,e,i),this.applyMatrix4(di),this}lookAt(t){return Eu.lookAt(t),Eu.updateMatrix(),this.applyMatrix4(Eu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ur).negate(),this.translate(Ur.x,Ur.y,Ur.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Qt(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];ni.setFromBufferAttribute(r),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,ni.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,ni.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(ni.min),this.boundingBox.expandByPoint(ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&te('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let i=this.boundingSphere.center;if(ni.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Do.setFromBufferAttribute(a),this.morphTargetsRelative?(yn.addVectors(ni.min,Do.min),ni.expandByPoint(yn),yn.addVectors(ni.max,Do.max),ni.expandByPoint(yn)):(ni.expandByPoint(Do.min),ni.expandByPoint(Do.max))}ni.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)yn.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(yn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)yn.fromBufferAttribute(a,c),l&&(Ur.fromBufferAttribute(t,c),yn.add(Ur)),s=Math.max(s,i.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&te('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ee(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<i.count;x++)a[x]=new U,l[x]=new U;let c=new U,h=new U,u=new U,d=new ct,f=new ct,p=new ct,v=new U,g=new U;function m(x,E,C){c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,E),u.fromBufferAttribute(i,C),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,C),h.sub(c),u.sub(c),f.sub(d),p.sub(d);let D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(D),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),a[x].add(v),a[E].add(v),a[C].add(v),l[x].add(g),l[E].add(g),l[C].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let x=0,E=_.length;x<E;++x){let C=_[x],D=C.start,N=C.count;for(let F=D,P=D+N;F<P;F+=3)m(t.getX(F+0),t.getX(F+1),t.getX(F+2))}let b=new U,y=new U,M=new U,w=new U;function T(x){M.fromBufferAttribute(s,x),w.copy(M);let E=a[x];b.copy(E),b.sub(M.multiplyScalar(M.dot(E))).normalize(),y.crossVectors(w,E);let D=y.dot(l[x])<0?-1:1;o.setXYZW(x,b.x,b.y,b.z,D)}for(let x=0,E=_.length;x<E;++x){let C=_[x],D=C.start,N=C.count;for(let F=D,P=D+N;F<P;F+=3)T(t.getX(F+0)),T(t.getX(F+1)),T(t.getX(F+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Ee(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new U,r=new U,o=new U,a=new U,l=new U,c=new U,h=new U,u=new U;if(t)for(let d=0,f=t.count;d<f;d+=3){let p=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),a.add(h),l.add(h),c.add(h),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)yn.fromBufferAttribute(t,e),yn.normalize(),t.setXYZ(e,yn.x,yn.y,yn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,p=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new Ee(d,h,u)}if(this.index===null)return Kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},jo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=rd,this.updateRanges=[],this.version=0,this.uuid=Wi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},Vn=new U,mi=class n{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Vn.fromBufferAttribute(this,e),Vn.applyMatrix4(t),this.setXYZ(e,Vn.x,Vn.y,Vn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Vn.fromBufferAttribute(this,e),Vn.applyNormalMatrix(t),this.setXYZ(e,Vn.x,Vn.y,Vn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Vn.fromBufferAttribute(this,e),Vn.transformDirection(t),this.setXYZ(e,Vn.x,Vn.y,Vn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Li(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=we(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=we(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Li(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Li(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Li(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Li(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=we(e,this.array),i=we(i,this.array),s=we(s,this.array),r=we(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Xo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ee(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new n(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Xo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Tu=new U,$g=new U,qg=new se,Pi=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Tu.subVectors(i,e).cross($g.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(Tu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||qg.getNormalMatrix(t),s=this.coplanarPoint(Tu).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Yg=0,qi=class extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=Wi(),this.name="",this.type="Material",this.blending=io,this.side=Fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ju,this.blendDst=ju,this.blendEquation=vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bl,this.stencilZFail=Bl,this.stencilZPass=Bl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Kt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ot().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Pi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ct().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ct().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var us=new U,Au=new U,bl=new U,Ml=new U,jl=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,us)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=us.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(us.copy(this.origin).addScaledVector(this.direction,e),us.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Au.copy(t).add(e).multiplyScalar(.5),bl.copy(e).sub(t).normalize(),Ml.copy(this.origin).sub(Au);let r=t.distanceTo(e)*.5,o=-this.direction.dot(bl),a=Ml.dot(this.direction),l=-Ml.dot(bl),c=Ml.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=r*h,u>=0)if(d>=-p)if(d<=p){let v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Au).addScaledVector(bl,d),f}intersectSphere(t,e){if(t.radius<0)return null;us.subVectors(t.center,this.origin);let i=us.dot(this.direction),s=us.dot(us)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,us)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=t.x-o.x,d=t.y-o.y,f=t.z-o.z,p=e.x-o.x,v=e.y-o.y,g=e.z-o.z,m=i.x-o.x,_=i.y-o.y,b=i.z-o.z,y=Math.abs(l),M=Math.abs(c),w=Math.abs(h),T,x,E,C,D,N,F,P,z,G,$,et;if(y>=M&&y>=w?(E=l,N=u,z=p,et=m,l>=0?(T=c,x=h,C=d,D=f,F=v,P=g,G=_,$=b):(T=h,x=c,C=f,D=d,F=g,P=v,G=b,$=_)):M>=w?(E=c,N=d,z=v,et=_,c>=0?(T=h,x=l,C=f,D=u,F=g,P=p,G=b,$=m):(T=l,x=h,C=u,D=f,F=p,P=g,G=m,$=b)):(E=h,N=f,z=g,et=b,h>=0?(T=l,x=c,C=u,D=d,F=p,P=v,G=m,$=_):(T=c,x=l,C=d,D=u,F=v,P=p,G=_,$=m)),E===0)return null;let X=T/E,tt=x/E,nt=1/E,St=C-X*N,yt=D-tt*N,jt=F-X*z,$t=P-tt*z,xt=G-X*et,K=$-tt*et,R=xt*$t-K*jt,Y=St*K-yt*xt,lt=jt*yt-$t*St;if(s){if(R<0||Y<0||lt<0)return null}else if((R<0||Y<0||lt<0)&&(R>0||Y>0||lt>0))return null;let ht=R+Y+lt;if(ht===0)return null;let _t=nt*(R*N+Y*z+lt*et);return(ht>0?_t<0:_t>0)?null:this.at(_t/ht,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ii=class extends qi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Zf=new Dt,js=new jl,Sl=new pi,Jf=new U,wl=new U,El=new U,Tl=new U,Ru=new U,Al=new U,jf=new U,Rl=new U,zt=class extends Qe{constructor(t=new ge,e=new ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Al.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Ru.fromBufferAttribute(u,t),o?Al.addScaledVector(Ru,h):Al.addScaledVector(Ru.sub(e),h))}e.add(Al)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Sl.copy(i.boundingSphere),Sl.applyMatrix4(r),js.copy(t.ray).recast(t.near),!(Sl.containsPoint(js.origin)===!1&&(js.intersectSphere(Sl,Jf)===null||js.origin.distanceToSquared(Jf)>(t.far-t.near)**2))&&(Zf.copy(r).invert(),js.copy(t.ray).applyMatrix4(Zf),!(i.boundingBox!==null&&js.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,js)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){let g=d[p],m=o[g.materialIndex],_=Math.max(g.start,f.start),b=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,M=b;y<M;y+=3){let w=a.getX(y),T=a.getX(y+1),x=a.getX(y+2);s=Cl(this,m,t,i,c,h,u,w,T,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){let _=a.getX(g),b=a.getX(g+1),y=a.getX(g+2);s=Cl(this,o,t,i,c,h,u,_,b,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){let g=d[p],m=o[g.materialIndex],_=Math.max(g.start,f.start),b=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,M=b;y<M;y+=3){let w=y,T=y+1,x=y+2;s=Cl(this,m,t,i,c,h,u,w,T,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){let _=g,b=g+1,y=g+2;s=Cl(this,o,t,i,c,h,u,_,b,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Zg(n,t,e,i,s,r,o,a){let l;if(t.side===Te?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===Fs,a),l===null)return null;Rl.copy(a),Rl.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Rl);return c<e.near||c>e.far?null:{distance:c,point:Rl.clone(),object:n}}function Cl(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,wl),n.getVertexPosition(l,El),n.getVertexPosition(c,Tl);let h=Zg(n,t,e,i,wl,El,Tl,jf);if(h){let u=new U;Is.getBarycoord(jf,wl,El,Tl,u),s&&(h.uv=Is.getInterpolatedAttribute(s,a,l,c,u,new ct)),r&&(h.uv1=Is.getInterpolatedAttribute(r,a,l,c,u,new ct)),o&&(h.normal=Is.getInterpolatedAttribute(o,a,l,c,u,new U),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new U,materialIndex:0};Is.getNormal(wl,El,Tl,d.normal),h.face=d,h.barycoord=u}return h}var ps=class extends Wn{constructor(t=null,e=1,i=1,s,r,o,a,l,c=je,h=je,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Yr=class extends Ee{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Nr=new Dt,Kf=new Dt,Il=[],Qf=new tn,Jg=new Dt,Uo=new zt,No=new pi,_n=class extends zt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Yr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Jg)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Nr),Qf.copy(t.boundingBox).applyMatrix4(Nr),this.boundingBox.union(Qf)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new pi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Nr),No.copy(t.boundingSphere).applyMatrix4(Nr),this.boundingSphere.union(No)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=t*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(t,e){let i=this.matrixWorld,s=this.count;if(Uo.geometry=this.geometry,Uo.material=this.material,Uo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),No.copy(this.boundingSphere),No.applyMatrix4(i),t.ray.intersectsSphere(No)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Nr),Kf.multiplyMatrices(i,Nr),Uo.matrixWorld=Kf,Uo.raycast(t,Il);for(let o=0,a=Il.length;o<a;o++){let l=Il[o];l.instanceId=r,l.object=this,e.push(l)}Il.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Yr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new ps(new Float32Array(s*this.count),s,this.count,Rc,yi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ks=new pi,jg=new ct(.5,.5),Pl=new U,Zr=class{constructor(t=new Pi,e=new Pi,i=new Pi,s=new Pi,r=new Pi,o=new Pi){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Di,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],v=r[9],g=r[10],m=r[11],_=r[12],b=r[13],y=r[14],M=r[15];if(s[0].setComponents(c-o,f-h,m-p,M-_).normalize(),s[1].setComponents(c+o,f+h,m+p,M+_).normalize(),s[2].setComponents(c+a,f+u,m+v,M+b).normalize(),s[3].setComponents(c-a,f-u,m-v,M-b).normalize(),i)s[4].setComponents(l,d,g,y).normalize(),s[5].setComponents(c-l,f-d,m-g,M-y).normalize();else if(s[4].setComponents(c-l,f-d,m-g,M-y).normalize(),e===Di)s[5].setComponents(c+l,f+d,m+g,M+y).normalize();else if(e===Vr)s[5].setComponents(l,d,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ks.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ks.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ks)}intersectsSprite(t){Ks.center.set(0,0,0);let e=jg.distanceTo(t.center);return Ks.radius=.7071067811865476+e,Ks.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ks)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(Pl.x=s.normal.x>0?t.max.x:t.min.x,Pl.y=s.normal.y>0?t.max.y:t.min.y,Pl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Pl)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ko=class extends Wn{constructor(t=[],e=Os,i,s,r,o,a,l,c,h){super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ui=class extends Wn{constructor(t,e,i,s,r,o,a,l,c){super(t,e,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Yi=class extends Wn{constructor(t,e,i=Oi,s,r,o,a=je,l=je,c,h=Xi,u=1){if(h!==Xi&&h!==Zi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new $r(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Kl=class extends Yi{constructor(t,e=Oi,i=Os,s,r,o=je,a=je,l,c=Xi){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,i,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Qo=class extends Wn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Ye=class n extends ge{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,i,e,t,o,r,0),p("z","y","x",1,-1,i,e,-t,o,r,1),p("x","z","y",1,1,t,i,e,s,o,2),p("x","z","y",1,-1,t,i,-e,s,o,3),p("x","y","z",1,-1,t,e,i,s,r,4),p("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(u,2));function p(v,g,m,_,b,y,M,w,T,x,E){let C=y/T,D=M/x,N=y/2,F=M/2,P=w/2,z=T+1,G=x+1,$=0,et=0,X=new U;for(let tt=0;tt<G;tt++){let nt=tt*D-F;for(let St=0;St<z;St++){let yt=St*C-N;X[v]=yt*_,X[g]=nt*b,X[m]=P,c.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[m]=w>0?1:-1,h.push(X.x,X.y,X.z),u.push(St/T),u.push(1-tt/x),$+=1}}for(let tt=0;tt<x;tt++)for(let nt=0;nt<T;nt++){let St=d+nt+z*tt,yt=d+nt+z*(tt+1),jt=d+(nt+1)+z*(tt+1),$t=d+(nt+1)+z*tt;l.push(St,yt,$t),l.push(yt,jt,$t),et+=6}a.addGroup(f,et,E),f+=et,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var gi=class n extends ge{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new U,h=new ct;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=i+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(a,3)),this.setAttribute("uv",new Qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ve=class n extends ge{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,v=[],g=i/2,m=0;_(),o===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Qt(u,3)),this.setAttribute("normal",new Qt(d,3)),this.setAttribute("uv",new Qt(f,2));function _(){let y=new U,M=new U,w=0,T=(e-t)/i;for(let x=0;x<=r;x++){let E=[],C=x/r,D=C*(e-t)+t;for(let N=0;N<=s;N++){let F=N/s,P=F*l+a,z=Math.sin(P),G=Math.cos(P);M.x=D*z,M.y=-C*i+g,M.z=D*G,u.push(M.x,M.y,M.z),y.set(z,T,G).normalize(),d.push(y.x,y.y,y.z),f.push(F,1-C),E.push(p++)}v.push(E)}for(let x=0;x<s;x++)for(let E=0;E<r;E++){let C=v[E][x],D=v[E+1][x],N=v[E+1][x+1],F=v[E][x+1];(t>0||E!==0)&&(h.push(C,D,F),w+=3),(e>0||E!==r-1)&&(h.push(D,N,F),w+=3)}c.addGroup(m,w,0),m+=w}function b(y){let M=p,w=new ct,T=new U,x=0,E=y===!0?t:e,C=y===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,g*C,0),d.push(0,C,0),f.push(.5,.5),p++;let D=p;for(let N=0;N<=s;N++){let P=N/s*l+a,z=Math.cos(P),G=Math.sin(P);T.x=E*G,T.y=g*C,T.z=E*z,u.push(T.x,T.y,T.z),d.push(0,C,0),w.x=z*.5+.5,w.y=G*.5*C+.5,f.push(w.x,w.y),p++}for(let N=0;N<s;N++){let F=M+N,P=D+N;y===!0?h.push(P,P+1,F):h.push(P+1,P,F),x+=3}c.addGroup(m,x,y===!0?1:2),m+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ta=class n extends Ve{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ql=class n extends ge{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new Qt(r,3)),this.setAttribute("normal",new Qt(r.slice(),3)),this.setAttribute("uv",new Qt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){let b=new U,y=new U,M=new U;for(let w=0;w<e.length;w+=3)f(e[w+0],b),f(e[w+1],y),f(e[w+2],M),l(b,y,M,_)}function l(_,b,y,M){let w=M+1,T=[];for(let x=0;x<=w;x++){T[x]=[];let E=_.clone().lerp(y,x/w),C=b.clone().lerp(y,x/w),D=w-x;for(let N=0;N<=D;N++)N===0&&x===w?T[x][N]=E:T[x][N]=E.clone().lerp(C,N/D)}for(let x=0;x<w;x++)for(let E=0;E<2*(w-x)-1;E++){let C=Math.floor(E/2);E%2===0?(d(T[x][C+1]),d(T[x+1][C]),d(T[x][C])):(d(T[x][C+1]),d(T[x+1][C+1]),d(T[x+1][C]))}}function c(_){let b=new U;for(let y=0;y<r.length;y+=3)b.x=r[y+0],b.y=r[y+1],b.z=r[y+2],b.normalize().multiplyScalar(_),r[y+0]=b.x,r[y+1]=b.y,r[y+2]=b.z}function h(){let _=new U;for(let b=0;b<r.length;b+=3){_.x=r[b+0],_.y=r[b+1],_.z=r[b+2];let y=g(_)/2/Math.PI+.5,M=m(_)/Math.PI+.5;o.push(y,1-M)}p(),u()}function u(){for(let _=0;_<o.length;_+=6){let b=o[_+0],y=o[_+2],M=o[_+4],w=Math.max(b,y,M),T=Math.min(b,y,M);w>.9&&T<.1&&(b<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),M<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,b){let y=_*3;b.x=t[y+0],b.y=t[y+1],b.z=t[y+2]}function p(){let _=new U,b=new U,y=new U,M=new U,w=new ct,T=new ct,x=new ct;for(let E=0,C=0;E<r.length;E+=9,C+=6){_.set(r[E+0],r[E+1],r[E+2]),b.set(r[E+3],r[E+4],r[E+5]),y.set(r[E+6],r[E+7],r[E+8]),w.set(o[C+0],o[C+1]),T.set(o[C+2],o[C+3]),x.set(o[C+4],o[C+5]),M.copy(_).add(b).add(y).divideScalar(3);let D=g(M);v(w,C+0,_,D),v(T,C+2,b,D),v(x,C+4,y,D)}}function v(_,b,y,M){M<0&&_.x===1&&(o[b]=_.x-1),y.x===0&&y.z===0&&(o[b]=M/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.detail)}};var si=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let i=this.getLengths(),s=0,r=i.length,o;e?o=e:o=t*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let h=i[s],d=i[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ct:new U);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){let i=new U,s=[],r=[],o=[],a=new U,l=new Dt;for(let f=0;f<=t;f++){let p=f/t;s[f]=this.getTangentAt(p,new U)}r[0]=new U,o[0]=new U;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(ie(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ie(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Jr=class extends si{constructor(t=0,e=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ct){let i=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},tc=class extends Jr{constructor(t,e,i,s,r,o){super(t,e,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function hd(){let n=0,t=0,e=0,i=0;function s(r,o,a,l){n=r,t=a,e=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return n+t*r+e*o+i*a}}}var tp=new U,ep=new U,Cu=new hd,Iu=new hd,Pu=new hd,er=class extends si{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new U){let i=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(ep.subVectors(s[0],s[1]).add(s[0]),c=ep);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(tp.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=tp),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),Cu.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,v,g),Iu.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,v,g),Pu.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(Cu.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Iu.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Pu.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(Cu.calc(l),Iu.calc(l),Pu.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function np(n,t,e,i,s){let r=(i-t)*.5,o=(s-e)*.5,a=n*n,l=n*a;return(2*e-2*i+r+o)*l+(-3*e+3*i-2*r-o)*a+r*n+e}function Kg(n,t){let e=1-n;return e*e*t}function Qg(n,t){return 2*(1-n)*n*t}function tx(n,t){return n*n*t}function zo(n,t,e,i){return Kg(n,t)+Qg(n,e)+tx(n,i)}function ex(n,t){let e=1-n;return e*e*e*t}function nx(n,t){let e=1-n;return 3*e*e*n*t}function ix(n,t){return 3*(1-n)*n*n*t}function sx(n,t){return n*n*n*t}function ko(n,t,e,i,s){return ex(n,t)+nx(n,e)+ix(n,i)+sx(n,s)}var ea=class extends si{constructor(t=new ct,e=new ct,i=new ct,s=new ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ct){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(ko(t,s.x,r.x,o.x,a.x),ko(t,s.y,r.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ec=class extends si{constructor(t=new U,e=new U,i=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new U){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(ko(t,s.x,r.x,o.x,a.x),ko(t,s.y,r.y,o.y,a.y),ko(t,s.z,r.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},na=class extends si{constructor(t=new ct,e=new ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ct){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},nc=class extends si{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ia=class extends si{constructor(t=new ct,e=new ct,i=new ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ct){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(zo(t,s.x,r.x,o.x),zo(t,s.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ic=class extends si{constructor(t=new U,e=new U,i=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new U){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(zo(t,s.x,r.x,o.x),zo(t,s.y,r.y,o.y),zo(t,s.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sa=class extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ct){let i=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(np(a,l.x,c.x,h.x,u.x),np(a,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new ct().fromArray(s))}return this}},zu=Object.freeze({__proto__:null,ArcCurve:tc,CatmullRomCurve3:er,CubicBezierCurve:ea,CubicBezierCurve3:ec,EllipseCurve:Jr,LineCurve:na,LineCurve3:nc,QuadraticBezierCurve:ia,QuadraticBezierCurve3:ic,SplineCurve:sa}),sc=class extends si{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new zu[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(new zu[s.type]().fromJSON(s))}return this}},Ni=class extends sc{constructor(t){super(),this.type="Path",this.currentPoint=new ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new na(this.currentPoint.clone(),new ct(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){let r=new ia(this.currentPoint.clone(),new ct(t,e),new ct(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,o){let a=new ea(this.currentPoint.clone(),new ct(t,e),new ct(i,s),new ct(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new sa(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,i,s,r,o),this}absarc(t,e,i,s,r,o){return this.absellipse(t,e,i,i,s,r,o),this}ellipse(t,e,i,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,r,o,a,l),this}absellipse(t,e,i,s,r,o,a,l){let c=new Jr(t,e,i,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},un=class extends Ni{constructor(t){super(t),this.uuid=Wi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(new Ni().fromJSON(s))}return this}};function rx(n,t,e=2){let i=t&&t.length,s=i?t[0]*e:n.length,r=Yp(n,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(i&&(r=hx(n,t,r,e)),n.length>80*e){a=n[0],l=n[1];let h=a,u=l;for(let d=e;d<s;d+=e){let f=n[d],p=n[d+1];f<a&&(a=f),p<l&&(l=p),f>h&&(h=f),p>u&&(u=p)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return ra(r,o,e,a,l,c,0),o}function Yp(n,t,e,i,s){let r;if(s===bx(n,t,e,i)>0)for(let o=t;o<e;o+=i)r=ip(o/i|0,n[o],n[o+1],r);else for(let o=e-i;o>=t;o-=i)r=ip(o/i|0,n[o],n[o+1],r);return r&&jr(r,r.next)&&(aa(r),r=r.next),r}function nr(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(jr(e,e.next)||Ge(e.prev,e,e.next)===0)){if(aa(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ra(n,t,e,i,s,r,o){if(!n)return;!o&&r&&mx(n,i,s,r);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(r?ax(n,i,s,r):ox(n)){t.push(l.i,n.i,c.i),aa(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=lx(nr(n),t),ra(n,t,e,i,s,r,2)):o===2&&cx(n,t,e,i,s,r):ra(nr(n),t,e,i,s,r,1);break}}}function ox(n){let t=n.prev,e=n,i=n.next;if(Ge(t,e,i)>=0)return!1;let s=t.x,r=e.x,o=i.x,a=t.y,l=e.y,c=i.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Fo(s,a,r,l,o,c,p.x,p.y)&&Ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function ax(n,t,e,i){let s=n.prev,r=n,o=n.next;if(Ge(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,l,c),p=Math.min(h,u,d),v=Math.max(a,l,c),g=Math.max(h,u,d),m=ku(f,p,t,e,i),_=ku(v,g,t,e,i),b=n.prevZ,y=n.nextZ;for(;b&&b.z>=m&&y&&y.z<=_;){if(b.x>=f&&b.x<=v&&b.y>=p&&b.y<=g&&b!==s&&b!==o&&Fo(a,h,l,u,c,d,b.x,b.y)&&Ge(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&Fo(a,h,l,u,c,d,y.x,y.y)&&Ge(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=m;){if(b.x>=f&&b.x<=v&&b.y>=p&&b.y<=g&&b!==s&&b!==o&&Fo(a,h,l,u,c,d,b.x,b.y)&&Ge(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&Fo(a,h,l,u,c,d,y.x,y.y)&&Ge(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function lx(n,t){let e=n;do{let i=e.prev,s=e.next.next;!jr(i,s)&&Jp(i,e,e.next,s)&&oa(i,s)&&oa(s,i)&&(t.push(i.i,e.i,s.i),aa(e),aa(e.next),e=n=s),e=e.next}while(e!==n);return nr(e)}function cx(n,t,e,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&vx(o,a)){let l=jp(o,a);o=nr(o,o.next),l=nr(l,l.next),ra(o,t,e,i,s,r,0),ra(l,t,e,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function hx(n,t,e,i){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*i,l=r<o-1?t[r+1]*i:n.length,c=Yp(n,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(xx(c))}s.sort(ux);for(let r=0;r<s.length;r++)e=dx(s[r],e);return e}function ux(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function dx(n,t){let e=fx(n,t);if(!e)return t;let i=jp(e,n);return nr(i,i.next),nr(e,e.next)}function fx(n,t){let e=t,i=n.x,s=n.y,r=-1/0,o;if(jr(n,e))return e;do{if(jr(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===i))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(i>=e.x&&e.x>=l&&i!==e.x&&Zp(s<c?i:r,s,l,c,s<c?r:i,s,e.x,e.y)){let u=Math.abs(s-e.y)/(i-e.x);oa(e,n)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&px(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function px(n,t){return Ge(n.prev,n,t.prev)<0&&Ge(t.next,n,n.next)<0}function mx(n,t,e,i){let s=n;do s.z===0&&(s.z=ku(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,gx(s)}function gx(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let o=i,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,e*=2}while(t>1);return n}function ku(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function xx(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Zp(n,t,e,i,s,r,o,a){return(s-o)*(t-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(i-a)}function Fo(n,t,e,i,s,r,o,a){return!(n===o&&t===a)&&Zp(n,t,e,i,s,r,o,a)}function vx(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!yx(n,t)&&(oa(n,t)&&oa(t,n)&&_x(n,t)&&(Ge(n.prev,n,t.prev)||Ge(n,t.prev,t))||jr(n,t)&&Ge(n.prev,n,n.next)>0&&Ge(t.prev,t,t.next)>0)}function Ge(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function jr(n,t){return n.x===t.x&&n.y===t.y}function Jp(n,t,e,i){let s=Dl(Ge(n,t,e)),r=Dl(Ge(n,t,i)),o=Dl(Ge(e,i,n)),a=Dl(Ge(e,i,t));return!!(s!==r&&o!==a||s===0&&Ll(n,e,t)||r===0&&Ll(n,i,t)||o===0&&Ll(e,n,i)||a===0&&Ll(e,t,i))}function Ll(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Dl(n){return n>0?1:n<0?-1:0}function yx(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Jp(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function oa(n,t){return Ge(n.prev,n,n.next)<0?Ge(n,t,n.next)>=0&&Ge(n,n.prev,t)>=0:Ge(n,t,n.prev)<0||Ge(n,n.next,t)<0}function _x(n,t){let e=n,i=!1,s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function jp(n,t){let e=Hu(n.i,n.x,n.y),i=Hu(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function ip(n,t,e,i){let s=Hu(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function aa(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Hu(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function bx(n,t,e,i){let s=0;for(let r=t,o=e-i;r<e;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Gu=class{static triangulate(t,e,i=2){return rx(t,e,i)}},Qs=class n{static area(t){let e=t.length,i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return n.area(t)<0}static triangulateShape(t,e){let i=[],s=[],r=[];sp(t),rp(i,t);let o=t.length;e.forEach(sp);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,rp(i,e[l]);let a=Gu.triangulate(i,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function sp(n){let t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function rp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}var dn=class n extends ge{constructor(t=new un([new ct(.5,.5),new ct(-.5,.5),new ct(-.5,-.5),new ct(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let i=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Qt(s,3)),this.setAttribute("uv",new Qt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:Mx,b,y=!1,M,w,T,x;if(m){b=m.getSpacedPoints(h),y=!0,d=!1;let L=m.isCatmullRomCurve3?m.closed:!1;M=m.computeFrenetFrames(h,L),w=new U,T=new U,x=new U}d||(g=0,f=0,p=0,v=0);let E=a.extractPoints(c),C=E.shape,D=E.holes;if(!Qs.isClockWise(C)){C=C.reverse();for(let L=0,q=D.length;L<q;L++){let st=D[L];Qs.isClockWise(st)&&(D[L]=st.reverse())}}function F(L){let st=10000000000000001e-36,V=L[0];for(let rt=1;rt<=L.length;rt++){let ft=rt%L.length,ot=L[ft],bt=ot.x-V.x,Mt=ot.y-V.y,B=bt*bt+Mt*Mt,ae=Math.max(Math.abs(ot.x),Math.abs(ot.y),Math.abs(V.x),Math.abs(V.y)),ee=st*ae*ae;if(B<=ee){L.splice(ft,1),rt--;continue}V=ot}}F(C),D.forEach(F);let P=D.length,z=C;for(let L=0;L<P;L++){let q=D[L];C=C.concat(q)}function G(L,q,st){return q||te("ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(q,st)}let $=C.length;function et(L,q,st){let V,rt,ft,ot=L.x-q.x,bt=L.y-q.y,Mt=st.x-L.x,B=st.y-L.y,ae=ot*ot+bt*bt,ee=ot*B-bt*Mt;if(Math.abs(ee)>Number.EPSILON){let I=Math.sqrt(ae),S=Math.sqrt(Mt*Mt+B*B),W=q.x-bt/I,Z=q.y+ot/I,it=st.x-B/S,vt=st.y+Mt/S,wt=((it-W)*B-(vt-Z)*Mt)/(ot*B-bt*Mt);V=W+ot*wt-L.x,rt=Z+bt*wt-L.y;let at=V*V+rt*rt;if(at<=2)return new ct(V,rt);ft=Math.sqrt(at/2)}else{let I=!1;ot>Number.EPSILON?Mt>Number.EPSILON&&(I=!0):ot<-Number.EPSILON?Mt<-Number.EPSILON&&(I=!0):Math.sign(bt)===Math.sign(B)&&(I=!0),I?(V=-bt,rt=ot,ft=Math.sqrt(ae)):(V=ot,rt=bt,ft=Math.sqrt(ae/2))}return new ct(V/ft,rt/ft)}let X=[];for(let L=0,q=z.length,st=q-1,V=L+1;L<q;L++,st++,V++)st===q&&(st=0),V===q&&(V=0),X[L]=et(z[L],z[st],z[V]);let tt=[],nt,St=X.concat();for(let L=0,q=P;L<q;L++){let st=D[L];nt=[];for(let V=0,rt=st.length,ft=rt-1,ot=V+1;V<rt;V++,ft++,ot++)ft===rt&&(ft=0),ot===rt&&(ot=0),nt[V]=et(st[V],st[ft],st[ot]);tt.push(nt),St=St.concat(nt)}let yt;if(g===0)yt=Qs.triangulateShape(z,D);else{let L=[],q=[];for(let st=0;st<g;st++){let V=st/g,rt=f*Math.cos(V*Math.PI/2),ft=p*Math.sin(V*Math.PI/2)+v;for(let ot=0,bt=z.length;ot<bt;ot++){let Mt=G(z[ot],X[ot],ft);Y(Mt.x,Mt.y,-rt),V===0&&L.push(Mt)}for(let ot=0,bt=P;ot<bt;ot++){let Mt=D[ot];nt=tt[ot];let B=[];for(let ae=0,ee=Mt.length;ae<ee;ae++){let I=G(Mt[ae],nt[ae],ft);Y(I.x,I.y,-rt),V===0&&B.push(I)}V===0&&q.push(B)}}yt=Qs.triangulateShape(L,q)}let jt=yt.length,$t=p+v;for(let L=0;L<$;L++){let q=d?G(C[L],St[L],$t):C[L];y?(T.copy(M.normals[0]).multiplyScalar(q.x),w.copy(M.binormals[0]).multiplyScalar(q.y),x.copy(b[0]).add(T).add(w),Y(x.x,x.y,x.z)):Y(q.x,q.y,0)}for(let L=1;L<=h;L++)for(let q=0;q<$;q++){let st=d?G(C[q],St[q],$t):C[q];y?(T.copy(M.normals[L]).multiplyScalar(st.x),w.copy(M.binormals[L]).multiplyScalar(st.y),x.copy(b[L]).add(T).add(w),Y(x.x,x.y,x.z)):Y(st.x,st.y,u/h*L)}for(let L=g-1;L>=0;L--){let q=L/g,st=f*Math.cos(q*Math.PI/2),V=p*Math.sin(q*Math.PI/2)+v;for(let rt=0,ft=z.length;rt<ft;rt++){let ot=G(z[rt],X[rt],V);Y(ot.x,ot.y,u+st)}for(let rt=0,ft=D.length;rt<ft;rt++){let ot=D[rt];nt=tt[rt];for(let bt=0,Mt=ot.length;bt<Mt;bt++){let B=G(ot[bt],nt[bt],V);y?Y(B.x,B.y+b[h-1].y,b[h-1].x+st):Y(B.x,B.y,u+st)}}}xt(),K();function xt(){let L=s.length/3;if(d){let q=0,st=$*q;for(let V=0;V<jt;V++){let rt=yt[V];lt(rt[2]+st,rt[1]+st,rt[0]+st)}q=h+g*2,st=$*q;for(let V=0;V<jt;V++){let rt=yt[V];lt(rt[0]+st,rt[1]+st,rt[2]+st)}}else{for(let q=0;q<jt;q++){let st=yt[q];lt(st[2],st[1],st[0])}for(let q=0;q<jt;q++){let st=yt[q];lt(st[0]+$*h,st[1]+$*h,st[2]+$*h)}}i.addGroup(L,s.length/3-L,0)}function K(){let L=s.length/3,q=0;R(z,q),q+=z.length;for(let st=0,V=D.length;st<V;st++){let rt=D[st];R(rt,q),q+=rt.length}i.addGroup(L,s.length/3-L,1)}function R(L,q){let st=L.length;for(;--st>=0;){let V=st,rt=st-1;rt<0&&(rt=L.length-1);for(let ft=0,ot=h+g*2;ft<ot;ft++){let bt=$*ft,Mt=$*(ft+1),B=q+V+bt,ae=q+rt+bt,ee=q+rt+Mt,I=q+V+Mt;ht(B,ae,ee,I)}}}function Y(L,q,st){l.push(L),l.push(q),l.push(st)}function lt(L,q,st){_t(L),_t(q),_t(st);let V=s.length/3,rt=_.generateTopUV(i,s,V-3,V-2,V-1);Pt(rt[0]),Pt(rt[1]),Pt(rt[2])}function ht(L,q,st,V){_t(L),_t(q),_t(V),_t(q),_t(st),_t(V);let rt=s.length/3,ft=_.generateSideWallUV(i,s,rt-6,rt-3,rt-2,rt-1);Pt(ft[0]),Pt(ft[1]),Pt(ft[3]),Pt(ft[1]),Pt(ft[2]),Pt(ft[3])}function _t(L){s.push(l[L*3+0]),s.push(l[L*3+1]),s.push(l[L*3+2])}function Pt(L){r.push(L.x),r.push(L.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Sx(e,i,t)}static fromJSON(t,e){let i=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];i.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new zu[s.type]().fromJSON(s)),new n(i,t.options)}},Mx={generateTopUV:function(n,t,e,i,s){let r=t[e*3],o=t[e*3+1],a=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new ct(r,o),new ct(a,l),new ct(c,h)]},generateSideWallUV:function(n,t,e,i,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],f=t[s*3+1],p=t[s*3+2],v=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ct(o,1-l),new ct(c,1-u),new ct(d,1-p),new ct(v,1-m)]:[new ct(a,1-l),new ct(h,1-u),new ct(f,1-p),new ct(g,1-m)]}};function Sx(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var la=class n extends Ql{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}},fn=class n extends ge{constructor(t=[new ct(0,-.5),new ct(.5,0),new ct(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=ie(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new U,d=new ct,f=new U,p=new U,v=new U,g=0,m=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(p)}for(let _=0;_<=e;_++){let b=i+_*h*s,y=Math.sin(b),M=Math.cos(b);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*y,u.y=t[w].y,u.z=t[w].x*M,o.push(u.x,u.y,u.z),d.x=_/e,d.y=w/(t.length-1),a.push(d.x,d.y);let T=l[3*w+0]*y,x=l[3*w+1],E=l[3*w+0]*M;c.push(T,x,E)}}for(let _=0;_<e;_++)for(let b=0;b<t.length-1;b++){let y=b+_*t.length,M=y,w=y+t.length,T=y+t.length+1,x=y+1;r.push(M,w,x),r.push(T,x,w)}this.setIndex(r),this.setAttribute("position",new Qt(o,3)),this.setAttribute("uv",new Qt(a,2)),this.setAttribute("normal",new Qt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.points,t.segments,t.phiStart,t.phiLength)}};var Xn=class n extends ge{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],p=[],v=[],g=[];for(let m=0;m<h;m++){let _=m*d-o;for(let b=0;b<c;b++){let y=b*u-r;p.push(y,-_,0),v.push(0,0,1),g.push(b/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let _=0;_<a;_++){let b=_+c*m,y=_+c*(m+1),M=_+1+c*(m+1),w=_+1+c*m;f.push(b,y,w),f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Qt(p,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Kr=class n extends ge{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=t,d=(e-t)/s,f=new U,p=new ct;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){let m=r+g/i*o;f.x=u*Math.cos(m),f.y=u*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}u+=d}for(let v=0;v<s;v++){let g=v*(i+1);for(let m=0;m<i;m++){let _=m+g,b=_,y=_+i+1,M=_+i+2,w=_+1;a.push(b,y,w),a.push(y,M,w)}}this.setIndex(a),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var en=class n extends ge{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new U,d=new U,f=[],p=[],v=[],g=[];for(let m=0;m<=i;m++){let _=[],b=m/i,y=o+b*a,M=t*Math.cos(y),w=Math.sqrt(t*t-M*M),T=0;m===0&&o===0?T=.5/e:m===i&&l===Math.PI&&(T=-.5/e);for(let x=0;x<=e;x++){let E=x/e,C=s+E*r;u.x=-w*Math.cos(C),u.y=M,u.z=w*Math.sin(C),p.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(E+T,1-b),_.push(c++)}h.push(_)}for(let m=0;m<i;m++)for(let _=0;_<e;_++){let b=h[m][_+1],y=h[m][_],M=h[m+1][_],w=h[m+1][_+1];(m!==0||o>0)&&f.push(b,y,w),(m!==i-1||l<Math.PI)&&f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Qt(p,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ri=class n extends ge{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new U,f=new U,p=new U;for(let v=0;v<=i;v++){let g=o+v/i*a;for(let m=0;m<=s;m++){let _=m/s*r;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),c.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(m/s),u.push(v/i)}}for(let v=1;v<=i;v++)for(let g=1;g<=s;g++){let m=(s+1)*v+g-1,_=(s+1)*(v-1)+g-1,b=(s+1)*(v-1)+g,y=(s+1)*v+g;l.push(m,_,y),l.push(_,b,y)}this.setIndex(l),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var ca=class extends ge{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],i=new Set,s=new U,r=new U;if(t.index!==null){let o=t.attributes.position,a=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start,f=u.count;for(let p=d,v=d+f;p<v;p+=3)for(let g=0;g<3;g++){let m=a.getX(p+g),_=a.getX(p+(g+1)%3);s.fromBufferAttribute(o,m),r.fromBufferAttribute(o,_),op(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,u=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,u),op(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Qt(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function op(n,t,e){let i=`${n.x},${n.y},${n.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${n.x},${n.y},${n.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0)}function cr(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(ap(s))s.isRenderTargetTexture?(Kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(ap(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function Bn(n){let t={};for(let e=0;e<n.length;e++){let i=cr(n[e]);for(let s in i)t[s]=i[s]}return t}function ap(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function wx(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function ud(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ue.workingColorSpace}var $n={clone:cr,merge:Bn},Ex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,De=class extends qi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ex,this.fragmentShader=Tx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=cr(t.uniforms),this.uniformsGroups=wx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new Ot().setHex(s.value);break;case"v2":this.uniforms[i].value=new ct().fromArray(s.value);break;case"v3":this.uniforms[i].value=new U().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Se().fromArray(s.value);break;case"m3":this.uniforms[i].value=new se().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Dt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Qr=class extends De{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Oe=class extends qi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ro,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},to=class extends Oe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ie(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ot(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ot(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ot(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ha=class extends qi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ro,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},ua=class extends qi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ro,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=bc,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},rc=class extends qi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},oc=class extends qi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Fr(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Lu(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var Ps=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ac=class extends Ps{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fu,endingEnd:Fu}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ou:r=t,a=2*e-i;break;case Bu:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Ou:o=t,l=2*i-e;break;case Bu:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(i-e)/(s-e),v=p*p,g=v*p,m=-d*g+2*d*v-d*p,_=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*p+1,b=(-1-f)*g+(1.5+f)*v+.5*p,y=f*g-f*v;for(let M=0;M!==a;++M)r[M]=m*o[h+M]+_*o[c+M]+b*o[l+M]+y*o[u+M];return r}},lc=class extends Ps{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},cc=class extends Ps{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},hc=class extends Ps{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(i-e)/(s-e),v=1-p;for(let g=0;g!==a;++g)r[g]=o[c+g]*v+o[l+g]*p;return r}let d=a*2,f=t-1;for(let p=0;p!==a;++p){let v=o[c+p],g=o[l+p],m=f*d+p*2,_=u[m],b=u[m+1],y=t*d+p*2,M=h[y],w=h[y+1],T=Rx(i,e,_,M,s);r[p]=Kp(T,v,b,w,g)}return r}};function Kp(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Ax(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function Rx(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=Kp(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let l=Ax(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var oi=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Fr(e,this.TimeBufferType),this.values=Fr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Fr(t.times,Array),values:Fr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),Lu(t.settings)&&(i.settings={inTangents:Fr(t.settings.inTangents,Array),outTangents:Fr(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new cc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new lc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ac(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new hc(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Ho:e=this.InterpolantFactoryMethodDiscrete;break;case ql:e=this.InterpolantFactoryMethodLinear;break;case Ol:e=this.InterpolantFactoryMethodSmooth;break;case Nu:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Kt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ho;case this.InterpolantFactoryMethodLinear:return ql;case this.InterpolantFactoryMethodSmooth:return Ol;case this.InterpolantFactoryMethodBezier:return Nu}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;Lu(this.settings)&&(lp(this.settings.inTangents,t),lp(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(te("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(te("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){te("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){te("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&gg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){te("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ol,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*i,d=u-i,f=u+i;for(let p=0;p!==i;++p){let v=e[u+p];if(v!==e[d+p]||v!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*i,d=o*i;for(let f=0;f!==i;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,Lu(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function lp(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}oi.prototype.ValueTypeName="";oi.prototype.TimeBufferType=Float32Array;oi.prototype.ValueBufferType=Float32Array;oi.prototype.DefaultInterpolation=ql;var Ls=class extends oi{constructor(t,e,i){super(t,e,i)}};Ls.prototype.ValueTypeName="bool";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=Ho;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;var uc=class extends oi{constructor(t,e,i,s){super(t,e,i,s)}};uc.prototype.ValueTypeName="color";var dc=class extends oi{constructor(t,e,i,s){super(t,e,i,s)}};dc.prototype.ValueTypeName="number";var fc=class extends Ps{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)ve.slerpFlat(r,0,o,c-a,o,c,l);return r}},da=class extends oi{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new fc(this.times,this.values,this.getValueSize(),t)}};da.prototype.ValueTypeName="quaternion";da.prototype.InterpolantFactoryMethodSmooth=void 0;var Ds=class extends oi{constructor(t,e,i){super(t,e,i)}};Ds.prototype.ValueTypeName="string";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=Ho;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;var pc=class extends oi{constructor(t,e,i,s){super(t,e,i,s)}};pc.prototype.ValueTypeName="vector";var mc=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Qp=new mc,gc=class{constructor(t){this.manager=t!==void 0?t:Qp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};gc.DEFAULT_MATERIAL_NAME="__DEFAULT";var eo=class extends Qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},ir=class extends eo{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Du=new Dt,cp=new U,hp=new U,fa=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ct(512,512),this.mapType=On,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zr,this._frameExtents=new ct(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;cp.setFromMatrixPosition(t.matrixWorld),e.position.copy(cp),hp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hp),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){Du.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(Du,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Vr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Du)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ul=new U,Nl=new ve,Gi=new U,pa=class extends Qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ul,Nl,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ul,Nl,Gi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ul,Nl,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ul,Nl,Gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Cs=new U,up=new ct,dp=new ct,mn=class extends pa{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Xr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Oo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Xr*2*Math.atan(Math.tan(Oo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Cs.x,Cs.y).multiplyScalar(-t/Cs.z),Cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Cs.x,Cs.y).multiplyScalar(-t/Cs.z)}getViewSize(t,e){return this.getViewBounds(t,up,dp),e.subVectors(dp,up)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Oo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Vu=class extends fa{constructor(){super(new mn(90,1,.5,500)),this.isPointLightShadow=!0}},ma=class extends eo{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Vu}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Us=class extends pa{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Wu=class extends fa{constructor(){super(new Us(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},sr=class extends eo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.target=new Qe,this.shadow=new Wu}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var ga=class extends ge{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Or=-90,Br=1,xc=class extends Qe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new mn(Or,Br,t,e);s.layers=this.layers,this.add(s);let r=new mn(Or,Br,t,e);r.layers=this.layers,this.add(r);let o=new mn(Or,Br,t,e);o.layers=this.layers,this.add(o);let a=new mn(Or,Br,t,e);a.layers=this.layers,this.add(a);let l=new mn(Or,Br,t,e);l.layers=this.layers,this.add(l);let c=new mn(Or,Br,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Di)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Vr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}},vc=class extends mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},xa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Cx.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Cx(){this._document.hidden===!1&&this.reset()}var dd="\\[\\]\\.:\\/",Ix=new RegExp("["+dd+"]","g"),fd="[^"+dd+"]",Px="[^"+dd.replace("\\.","")+"]",Lx=/((?:WC+[\/:])*)/.source.replace("WC",fd),Dx=/(WCOD+)?/.source.replace("WCOD",Px),Ux=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fd),Nx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fd),Fx=new RegExp("^"+Lx+Dx+Ux+Nx+"$"),Ox=["material","materials","bones","map"],Xu=class{constructor(t,e,i){let s=i||Ne.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Ne=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Ix,"")}static parseTrackName(t){let e=Fx.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Ox.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Kt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){te("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){te("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){te("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){te("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){te("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;te("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ne.Composite=Xu;Ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ne.prototype.GetterByBindingType=[Ne.prototype._getValue_direct,Ne.prototype._getValue_array,Ne.prototype._getValue_arrayElement,Ne.prototype._getValue_toArray];Ne.prototype.SetterByBindingTypeAndVersioning=[[Ne.prototype._setValue_direct,Ne.prototype._setValue_direct_setNeedsUpdate,Ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_array,Ne.prototype._setValue_array_setNeedsUpdate,Ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_arrayElement,Ne.prototype._setValue_arrayElement_setNeedsUpdate,Ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_fromArray,Ne.prototype._setValue_fromArray_setNeedsUpdate,Ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var UM=new Float32Array(1);var Ns=class extends jo{constructor(t,e,i=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var $u=class n{static{n.prototype.isMatrix2=!0}constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};var fp=new U,Fl=new U,zr=new U,kr=new U,Uu=new U,Bx=new U,zx=new U,va=class{constructor(t=new U,e=new U){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){fp.subVectors(t,this.start),Fl.subVectors(this.end,this.start);let i=Fl.dot(Fl);if(i===0)return 0;let r=Fl.dot(fp)/i;return e&&(r=ie(r,0,1)),r}closestPointToPoint(t,e,i){let s=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=Bx,i=zx){let s=10000000000000001e-32,r,o,a=this.start,l=t.start,c=this.end,h=t.end;zr.subVectors(c,a),kr.subVectors(h,l),Uu.subVectors(a,l);let u=zr.dot(zr),d=kr.dot(kr),f=kr.dot(Uu);if(u<=s&&d<=s)return e.copy(a),i.copy(l),e.sub(i),e.dot(e);if(u<=s)r=0,o=f/d,o=ie(o,0,1);else{let p=zr.dot(Uu);if(d<=s)o=0,r=ie(-p/u,0,1);else{let v=zr.dot(kr),g=u*d-v*v;g!==0?r=ie((v*f-p*d)/g,0,1):r=0,o=(v*r+f)/d,o<0?(o=0,r=ie(-p/u,0,1)):o>1&&(o=1,r=ie((v-p)/u,0,1))}}return e.copy(a).addScaledVector(zr,r),i.copy(l).addScaledVector(kr,o),e.distanceToSquared(i)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function pd(n,t,e,i){let s=kx(i);switch(e){case id:return n*t;case Rc:return n*t/s.components*s.byteLength;case Cc:return n*t/s.components*s.byteLength;case ks:return n*t*2/s.components*s.byteLength;case Ic:return n*t*2/s.components*s.byteLength;case sd:return n*t*3/s.components*s.byteLength;case jn:return n*t*4/s.components*s.byteLength;case Pc:return n*t*4/s.components*s.byteLength;case Ca:case Ia:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Pa:case La:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Dc:case Nc:return Math.max(n,16)*Math.max(t,8)/4;case Lc:case Uc:return Math.max(n,8)*Math.max(t,8)/2;case Fc:case Oc:case zc:case kc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Bc:case Da:case Hc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Gc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Vc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Wc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Xc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case $c:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case qc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Yc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Zc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Jc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case jc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Kc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case th:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case eh:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case nh:case ih:case sh:return Math.ceil(n/4)*Math.ceil(t/4)*16;case rh:case oh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Ua:case ah:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function kx(n){switch(n){case On:case Qu:return{byteLength:1,components:1};case so:case td:case bn:return{byteLength:2,components:1};case Tc:case Ac:return{byteLength:2,components:4};case Oi:case Ec:case yi:return{byteLength:4,components:1};case ed:case nd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yc}}));typeof window<"u"&&(window.__THREE__?Kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yc);function b0(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Wx(n){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],v=u[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let v=u[f];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Xx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$x=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,t1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,e1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,n1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,i1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,s1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,r1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,o1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,a1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,l1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,c1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,h1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,u1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,d1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,f1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,p1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,m1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,g1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,x1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,v1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,y1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,b1="gl_FragColor = linearToOutputTexel( gl_FragColor );",M1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,S1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,w1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,E1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,T1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,A1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,R1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,C1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,I1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,P1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,L1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,D1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,U1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,N1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,F1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,O1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,B1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,z1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,k1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,H1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,G1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,V1=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,W1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,X1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,q1=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Y1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Z1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,J1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,j1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,K1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Q1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ev=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,iv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ov=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,av=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,pv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_v=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ev=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Av=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Iv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Pv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ov=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Xv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$v=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ty=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ey=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ny=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ry=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,oy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ay=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ly=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,py=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_y=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,by=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,My=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ce={alphahash_fragment:Xx,alphahash_pars_fragment:$x,alphamap_fragment:qx,alphamap_pars_fragment:Yx,alphatest_fragment:Zx,alphatest_pars_fragment:Jx,aomap_fragment:jx,aomap_pars_fragment:Kx,batching_pars_vertex:Qx,batching_vertex:t1,begin_vertex:e1,beginnormal_vertex:n1,bsdfs:i1,iridescence_fragment:s1,bumpmap_pars_fragment:r1,clipping_planes_fragment:o1,clipping_planes_pars_fragment:a1,clipping_planes_pars_vertex:l1,clipping_planes_vertex:c1,color_fragment:h1,color_pars_fragment:u1,color_pars_vertex:d1,color_vertex:f1,common:p1,cube_uv_reflection_fragment:m1,defaultnormal_vertex:g1,displacementmap_pars_vertex:x1,displacementmap_vertex:v1,emissivemap_fragment:y1,emissivemap_pars_fragment:_1,colorspace_fragment:b1,colorspace_pars_fragment:M1,envmap_fragment:S1,envmap_common_pars_fragment:w1,envmap_pars_fragment:E1,envmap_pars_vertex:T1,envmap_physical_pars_fragment:O1,envmap_vertex:A1,fog_vertex:R1,fog_pars_vertex:C1,fog_fragment:I1,fog_pars_fragment:P1,gradientmap_pars_fragment:L1,lightmap_pars_fragment:D1,lights_lambert_fragment:U1,lights_lambert_pars_fragment:N1,lights_pars_begin:F1,lights_toon_fragment:B1,lights_toon_pars_fragment:z1,lights_phong_fragment:k1,lights_phong_pars_fragment:H1,lights_physical_fragment:G1,lights_physical_pars_fragment:V1,lights_fragment_begin:W1,lights_fragment_maps:X1,lights_fragment_end:$1,lightprobes_pars_fragment:q1,logdepthbuf_fragment:Y1,logdepthbuf_pars_fragment:Z1,logdepthbuf_pars_vertex:J1,logdepthbuf_vertex:j1,map_fragment:K1,map_pars_fragment:Q1,map_particle_fragment:tv,map_particle_pars_fragment:ev,metalnessmap_fragment:nv,metalnessmap_pars_fragment:iv,morphinstance_vertex:sv,morphcolor_vertex:rv,morphnormal_vertex:ov,morphtarget_pars_vertex:av,morphtarget_vertex:lv,normal_fragment_begin:cv,normal_fragment_maps:hv,normal_pars_fragment:uv,normal_pars_vertex:dv,normal_vertex:fv,normalmap_pars_fragment:pv,clearcoat_normal_fragment_begin:mv,clearcoat_normal_fragment_maps:gv,clearcoat_pars_fragment:xv,iridescence_pars_fragment:vv,opaque_fragment:yv,packing:_v,premultiplied_alpha_fragment:bv,project_vertex:Mv,dithering_fragment:Sv,dithering_pars_fragment:wv,roughnessmap_fragment:Ev,roughnessmap_pars_fragment:Tv,shadowmap_pars_fragment:Av,shadowmap_pars_vertex:Rv,shadowmap_vertex:Cv,shadowmask_pars_fragment:Iv,skinbase_vertex:Pv,skinning_pars_vertex:Lv,skinning_vertex:Dv,skinnormal_vertex:Uv,specularmap_fragment:Nv,specularmap_pars_fragment:Fv,tonemapping_fragment:Ov,tonemapping_pars_fragment:Bv,transmission_fragment:zv,transmission_pars_fragment:kv,uv_pars_fragment:Hv,uv_pars_vertex:Gv,uv_vertex:Vv,worldpos_vertex:Wv,background_vert:Xv,background_frag:$v,backgroundCube_vert:qv,backgroundCube_frag:Yv,cube_vert:Zv,cube_frag:Jv,depth_vert:jv,depth_frag:Kv,distance_vert:Qv,distance_frag:ty,equirect_vert:ey,equirect_frag:ny,linedashed_vert:iy,linedashed_frag:sy,meshbasic_vert:ry,meshbasic_frag:oy,meshlambert_vert:ay,meshlambert_frag:ly,meshmatcap_vert:cy,meshmatcap_frag:hy,meshnormal_vert:uy,meshnormal_frag:dy,meshphong_vert:fy,meshphong_frag:py,meshphysical_vert:my,meshphysical_frag:gy,meshtoon_vert:xy,meshtoon_frag:vy,points_vert:yy,points_frag:_y,shadow_vert:by,shadow_frag:My,sprite_vert:Sy,sprite_frag:wy},At={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new se}},envmap:{envMap:{value:null},envMapRotation:{value:new se},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new se},normalScale:{value:new ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0},uvTransform:{value:new se}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}}},qn={basic:{uniforms:Bn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:ce.meshbasic_vert,fragmentShader:ce.meshbasic_frag},lambert:{uniforms:Bn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Ot(0)},envMapIntensity:{value:1}}]),vertexShader:ce.meshlambert_vert,fragmentShader:ce.meshlambert_frag},phong:{uniforms:Bn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ce.meshphong_vert,fragmentShader:ce.meshphong_frag},standard:{uniforms:Bn([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag},toon:{uniforms:Bn([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new Ot(0)}}]),vertexShader:ce.meshtoon_vert,fragmentShader:ce.meshtoon_frag},matcap:{uniforms:Bn([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:ce.meshmatcap_vert,fragmentShader:ce.meshmatcap_frag},points:{uniforms:Bn([At.points,At.fog]),vertexShader:ce.points_vert,fragmentShader:ce.points_frag},dashed:{uniforms:Bn([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ce.linedashed_vert,fragmentShader:ce.linedashed_frag},depth:{uniforms:Bn([At.common,At.displacementmap]),vertexShader:ce.depth_vert,fragmentShader:ce.depth_frag},normal:{uniforms:Bn([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:ce.meshnormal_vert,fragmentShader:ce.meshnormal_frag},sprite:{uniforms:Bn([At.sprite,At.fog]),vertexShader:ce.sprite_vert,fragmentShader:ce.sprite_frag},background:{uniforms:{uvTransform:{value:new se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ce.background_vert,fragmentShader:ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new se}},vertexShader:ce.backgroundCube_vert,fragmentShader:ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ce.cube_vert,fragmentShader:ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ce.equirect_vert,fragmentShader:ce.equirect_frag},distance:{uniforms:Bn([At.common,At.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ce.distance_vert,fragmentShader:ce.distance_frag},shadow:{uniforms:Bn([At.lights,At.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:ce.shadow_vert,fragmentShader:ce.shadow_frag}};qn.physical={uniforms:Bn([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new se},clearcoatNormalScale:{value:new ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new se},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new se},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new se},transmissionSamplerSize:{value:new ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new se},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new se},anisotropyVector:{value:new ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new se}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag};var hh={r:0,b:0,g:0},Ey=new Dt,M0=new se;M0.set(-1,0,0,0,1,0,0,0,1);function Ty(n,t,e,i,s,r){let o=new Ot(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function f(_){let b=_.isScene===!0?_.background:null;if(b&&b.isTexture){let y=_.backgroundBlurriness>0;b=t.get(b,y)}return b}function p(_){let b=!1,y=f(_);y===null?g(o,a):y&&y.isColor&&(g(y,1),b=!0);let M=n.xr.getEnvironmentBlendMode();M==="additive"?e.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||b)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(_,b){let y=f(b);y&&(y.isCubeTexture||y.mapping===Aa)?(c===void 0&&(c=new zt(new Ye(1,1,1),new De({name:"BackgroundCubeMaterial",uniforms:cr(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:Te,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Ey.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(M0),c.material.toneMapped=ue.getTransfer(y.colorSpace)!==xe,(h!==y||u!==y.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new zt(new Xn(2,2),new De({name:"BackgroundMaterial",uniforms:cr(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:Fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ue.getTransfer(y.colorSpace)!==xe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,b){_.getRGB(hh,ud(n)),e.buffers.color.setClear(hh.r,hh.g,hh.b,b,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,b=1){o.set(_),a=b,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,g(o,a)},render:p,addToRenderList:v,dispose:m}}function Ay(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(D,N,F,P,z){let G=!1,$=u(D,P,F,N);r!==$&&(r=$,c(r.object)),G=f(D,P,F,z),G&&p(D,P,F,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,y(D,N,F,P),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function h(D){return n.deleteVertexArray(D)}function u(D,N,F,P){let z=P.wireframe===!0,G=i[N.id];G===void 0&&(G={},i[N.id]=G);let $=D.isInstancedMesh===!0?D.id:0,et=G[$];et===void 0&&(et={},G[$]=et);let X=et[F.id];X===void 0&&(X={},et[F.id]=X);let tt=X[z];return tt===void 0&&(tt=d(l()),X[z]=tt),tt}function d(D){let N=[],F=[],P=[];for(let z=0;z<e;z++)N[z]=0,F[z]=0,P[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:F,attributeDivisors:P,object:D,attributes:{},index:null}}function f(D,N,F,P){let z=r.attributes,G=N.attributes,$=0,et=F.getAttributes();for(let X in et)if(et[X].location>=0){let nt=z[X],St=G[X];if(St===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(St=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(St=D.instanceColor)),nt===void 0||nt.attribute!==St||St&&nt.data!==St.data)return!0;$++}return r.attributesNum!==$||r.index!==P}function p(D,N,F,P){let z={},G=N.attributes,$=0,et=F.getAttributes();for(let X in et)if(et[X].location>=0){let nt=G[X];nt===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(nt=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(nt=D.instanceColor));let St={};St.attribute=nt,nt&&nt.data&&(St.data=nt.data),z[X]=St,$++}r.attributes=z,r.attributesNum=$,r.index=P}function v(){let D=r.newAttributes;for(let N=0,F=D.length;N<F;N++)D[N]=0}function g(D){m(D,0)}function m(D,N){let F=r.newAttributes,P=r.enabledAttributes,z=r.attributeDivisors;F[D]=1,P[D]===0&&(n.enableVertexAttribArray(D),P[D]=1),z[D]!==N&&(n.vertexAttribDivisor(D,N),z[D]=N)}function _(){let D=r.newAttributes,N=r.enabledAttributes;for(let F=0,P=N.length;F<P;F++)N[F]!==D[F]&&(n.disableVertexAttribArray(F),N[F]=0)}function b(D,N,F,P,z,G,$){$===!0?n.vertexAttribIPointer(D,N,F,z,G):n.vertexAttribPointer(D,N,F,P,z,G)}function y(D,N,F,P){v();let z=P.attributes,G=F.getAttributes(),$=N.defaultAttributeValues;for(let et in G){let X=G[et];if(X.location>=0){let tt=z[et];if(tt===void 0&&(et==="instanceMatrix"&&D.instanceMatrix&&(tt=D.instanceMatrix),et==="instanceColor"&&D.instanceColor&&(tt=D.instanceColor)),tt!==void 0){let nt=tt.normalized,St=tt.itemSize,yt=t.get(tt);if(yt===void 0)continue;let jt=yt.buffer,$t=yt.type,xt=yt.bytesPerElement,K=$t===n.INT||$t===n.UNSIGNED_INT||tt.gpuType===Ec;if(tt.isInterleavedBufferAttribute){let R=tt.data,Y=R.stride,lt=tt.offset;if(R.isInstancedInterleavedBuffer){for(let ht=0;ht<X.locationSize;ht++)m(X.location+ht,R.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=R.meshPerAttribute*R.count)}else for(let ht=0;ht<X.locationSize;ht++)g(X.location+ht);n.bindBuffer(n.ARRAY_BUFFER,jt);for(let ht=0;ht<X.locationSize;ht++)b(X.location+ht,St/X.locationSize,$t,nt,Y*xt,(lt+St/X.locationSize*ht)*xt,K)}else{if(tt.isInstancedBufferAttribute){for(let R=0;R<X.locationSize;R++)m(X.location+R,tt.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let R=0;R<X.locationSize;R++)g(X.location+R);n.bindBuffer(n.ARRAY_BUFFER,jt);for(let R=0;R<X.locationSize;R++)b(X.location+R,St/X.locationSize,$t,nt,St*xt,St/X.locationSize*R*xt,K)}}else if($!==void 0){let nt=$[et];if(nt!==void 0)switch(nt.length){case 2:n.vertexAttrib2fv(X.location,nt);break;case 3:n.vertexAttrib3fv(X.location,nt);break;case 4:n.vertexAttrib4fv(X.location,nt);break;default:n.vertexAttrib1fv(X.location,nt)}}}}_()}function M(){E();for(let D in i){let N=i[D];for(let F in N){let P=N[F];for(let z in P){let G=P[z];for(let $ in G)h(G[$].object),delete G[$];delete P[z]}}delete i[D]}}function w(D){if(i[D.id]===void 0)return;let N=i[D.id];for(let F in N){let P=N[F];for(let z in P){let G=P[z];for(let $ in G)h(G[$].object),delete G[$];delete P[z]}}delete i[D.id]}function T(D){for(let N in i){let F=i[N];for(let P in F){let z=F[P];if(z[D.id]===void 0)continue;let G=z[D.id];for(let $ in G)h(G[$].object),delete G[$];delete z[D.id]}}}function x(D){for(let N in i){let F=i[N],P=D.isInstancedMesh===!0?D.id:0,z=F[P];if(z!==void 0){for(let G in z){let $=z[G];for(let et in $)h($[et].object),delete $[et];delete z[G]}delete F[P],Object.keys(F).length===0&&delete i[N]}}}function E(){C(),o=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:C,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function Ry(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Cy(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==jn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let x=T===bn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==On&&T!==yi&&!x&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Kt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:_,maxVaryings:b,maxFragmentUniforms:y,maxSamples:M,samples:w}}function Iy(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Pi,a=new se,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,m=n.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let _=r?0:i,b=_*4,y=m.clippingState||null;l.value=y,y=h(p,d,b,f);for(let M=0;M!==b;++M)y[M]=e[M];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,p){let v=u!==null?u.length:0,g=null;if(v!==0){if(g=l.value,p!==!0||g===null){let m=f+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<m)&&(g=new Float32Array(m));for(let b=0,y=f;b!==v;++b,y+=4)o.copy(u[b]).applyMatrix4(_,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}var ao=4,Py=6,Ly=20,Dy=256,Na=new Us,t0=new Ot,md=null,gd=0,xd=0,vd=!1,Uy=new U,hr=new U,co=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=Uy}=r;md=this._renderer.getRenderTarget(),gd=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),vd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=i0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=n0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(md,gd,xd),this._renderer.xr.enabled=vd,t.scissorTest=!1,oo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Os||t.mapping===lr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),md=this._renderer.getRenderTarget(),gd=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),vd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:An,minFilter:An,generateMipmaps:!1,type:bn,format:jn,colorSpace:Go,depthBuffer:!1},s=e0(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=e0(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Ny(r)),this._blurMaterial=Oy(r,t,e),this._ggxMaterial=Fy(r,t,e)}return s}_compileMaterial(t){let e=new zt(new ge,t);this._renderer.compile(e,Na)}_sceneToCubeUV(t,e,i,s,r){let l=new mn(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(t0),u.toneMapping=Fi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new Ye,new ii({name:"PMREM.Background",side:Te,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,g=v.material,m=!1,_=t.background;_?_.isColor&&(g.color.copy(_),t.background=null,m=!0):(g.color.copy(t0),m=!0);for(let b=0;b<6;b++){let y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));let M=this._cubeSize;oo(s,y*M,b>2?M:0,M,M),u.setRenderTarget(s),m&&u.render(v,l),u.render(t,l)}u.toneMapping=f,u.autoClear=d,t.background=_}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Os||t.mapping===lr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=i0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=n0());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;oo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Na)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:p}=this,v=this._sizeLods[i],g=3*v*(i>p-ao?i-p+ao:0),m=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,oo(r,g,m,3*v,2*v),s.setRenderTarget(r),s.render(a,Na),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-i,oo(t,g,m,3*v,2*v),s.setRenderTarget(t),s.render(a,Na)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[s],u=3*h*(s>this._lodMax-ao?s-this._lodMax+ao:0),d=4*(this._cubeSize-h);oo(e,u,d,3*h,2*h),o.setRenderTarget(e),o.render(l,Na)}};function Ny(n){let t=[],e=[],i=n,s=n-ao+1+Py;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,p=new Float32Array(f*d*u),v=new Float32Array(f*d*u);for(let m=0;m<u;m++){let _=m%3*2/3-1,b=m>2?0:-1,y=[_,b,0,_+2/3,b,0,_+2/3,b+1,0,_,b,0,_+2/3,b+1,0,_,b+1,0];p.set(y,f*d*m);for(let M=0;M<d;M++){let w=h[M*2]*2-1,T=h[M*2+1]*2-1;m===0?hr.set(1,T,w):m===1?hr.set(-w,1,-T):m===2?hr.set(-w,T,1):m===3?hr.set(-1,T,-w):m===4?hr.set(-w,-1,T):hr.set(w,T,-1),hr.toArray(v,(m*d+M)*f)}}let g=new ge;g.setAttribute("position",new Ee(p,f)),g.setAttribute("outputDirection",new Ee(v,f)),e.push(new zt(g,null)),i>ao&&i--}return{lodMeshes:e,sizeLods:t}}function e0(n,t,e){let i=new Ke(n,t,e);return i.texture.mapping=Aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function oo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Fy(n,t,e){return new De({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Dy,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:nn,depthTest:!1,depthWrite:!1})}function Oy(n,t,e){return new De({name:"SphericalGaussianBlur",defines:{SAMPLES:Ly,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:fh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:nn,depthTest:!1,depthWrite:!1})}function n0(){return new De({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:nn,depthTest:!1,depthWrite:!1})}function i0(){return new De({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nn,depthTest:!1,depthWrite:!1})}function fh(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var dh=class extends Ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ko(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ye(5,5,5),r=new De({name:"CubemapFromEquirect",uniforms:cr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Te,blending:nn});r.uniforms.tEquirect.value=e;let o=new zt(s,r),a=e.minFilter;return e.minFilter===Bs&&(e.minFilter=An),new xc(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function By(n){let t=new WeakMap,e=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===Mc||f===Sc)if(t.has(d)){let p=t.get(d).texture;return a(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let v=new dh(p.height);return v.fromEquirectangularTexture(n,d),t.set(d,v),d.addEventListener("dispose",c),a(v.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,p=f===Mc||f===Sc,v=f===Os||f===lr;if(p||v){let g=e.get(d),m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new co(n)),g=p?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),g.texture;if(g!==void 0)return g.texture;{let _=d.image;return p&&_&&_.height>0||v&&_&&l(_)?(i===null&&(i=new co(n)),g=p?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function a(d,f){return f===Mc?d.mapping=Os:f===Sc&&(d.mapping=lr),d}function l(d){let f=0,p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){let f=d.target;f.removeEventListener("dispose",c);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function zy(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&tr("WebGLRenderer: "+i+" extension not supported."),s}}}function ky(n,t,e,i){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)t.update(d[f],n.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,p=u.attributes.position,v=0;if(p===void 0)return;if(f!==null){let _=f.array;v=f.version;for(let b=0,y=_.length;b<y;b+=3){let M=_[b+0],w=_[b+1],T=_[b+2];d.push(M,w,w,T,T,M)}}else{let _=p.array;v=p.version;for(let b=0,y=_.length/3-1;b<y;b+=3){let M=b+0,w=b+1,T=b+2;d.push(M,w,w,T,T,M)}}let g=new(p.count>=65535?Jo:Zo)(d,1);g.version=v;let m=r.get(u);m&&t.remove(m),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Hy(n,t,e){let i;function s(u){i=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){n.drawElements(i,d,r,u*o),e.update(d,i,1)}function c(u,d,f){f!==0&&(n.drawElementsInstanced(i,d,r,u*o,f),e.update(d,i,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,f);let v=0;for(let g=0;g<f;g++)v+=d[g];e.update(v,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Gy(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:te("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Vy(n,t,e){let i=new WeakMap,s=new Se;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(a);if(d===void 0||d.count!==u){let E=function(){T.dispose(),i.delete(a),a.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],b=0;f===!0&&(b=1),p===!0&&(b=2),v===!0&&(b=3);let y=a.attributes.position.count*b,M=1;y>t.maxTextureSize&&(M=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let w=new Float32Array(y*M*4*u),T=new $o(w,y,M,u);T.type=yi,T.needsUpdate=!0;let x=b*4;for(let C=0;C<u;C++){let D=g[C],N=m[C],F=_[C],P=y*M*4*C;for(let z=0;z<D.count;z++){let G=z*x;f===!0&&(s.fromBufferAttribute(D,z),w[P+G+0]=s.x,w[P+G+1]=s.y,w[P+G+2]=s.z,w[P+G+3]=0),p===!0&&(s.fromBufferAttribute(N,z),w[P+G+4]=s.x,w[P+G+5]=s.y,w[P+G+6]=s.z,w[P+G+7]=0),v===!0&&(s.fromBufferAttribute(F,z),w[P+G+8]=s.x,w[P+G+9]=s.y,w[P+G+10]=s.z,w[P+G+11]=F.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new ct(y,M)},i.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Wy(n,t,e,i,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=t.get(c,u);if(r.get(d)!==h&&(t.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var Xy={[Ma]:"LINEAR_TONE_MAPPING",[Sa]:"REINHARD_TONE_MAPPING",[wa]:"CINEON_TONE_MAPPING",[ar]:"ACES_FILMIC_TONE_MAPPING",[Ta]:"AGX_TONE_MAPPING",[ms]:"NEUTRAL_TONE_MAPPING",[Ea]:"CUSTOM_TONE_MAPPING"};function $y(n,t,e,i,s,r){let o=new Ke(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new ge;c.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Qt([0,2,0,0,2,0],2));let h=new Qr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new zt(c,h),d=new Us(-1,1,1,-1,0,1),f=null,p=null,v=!1,g,m=null,_=[],b=!1;this.setSize=function(y,M){o.setSize(y,M),a!==null&&a.setSize(y,M),l!==null&&l.setSize(y,M);for(let w=0;w<_.length;w++){let T=_[w];T.setSize&&T.setSize(y,M)}},this.setEffects=function(y){_=y,b=_.length>0&&_[0].isRenderPass===!0;let M=o.width,w=o.height;_.length>0&&a===null&&(a=new Ke(M,w,{type:bn,depthBuffer:!1,stencilBuffer:!1}),l=new Ke(M,w,{type:bn,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<_.length;T++){let x=_[T];x.setSize&&x.setSize(M,w)}},this.begin=function(y,M){if(v||y.toneMapping===Fi&&_.length===0)return!1;if(m=M,M!==null){let w=M.width,T=M.height;(o.width!==w||o.height!==T)&&this.setSize(w,T)}return b===!1&&y.setRenderTarget(o),g=y.toneMapping,y.toneMapping=Fi,!0},this.hasRenderPass=function(){return b},this.end=function(y,M){y.toneMapping=g,v=!0;let w=o,T=a;for(let x=0;x<_.length;x++){let E=_[x];E.enabled!==!1&&(E.render(y,T,w,M),E.needsSwap!==!1&&(w=T,T=T===a?l:a))}if(f!==y.outputColorSpace||p!==y.toneMapping){f=y.outputColorSpace,p=y.toneMapping,h.defines={},ue.getTransfer(f)===xe&&(h.defines.SRGB_TRANSFER="");let x=Xy[p];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(m),y.render(u,d),m=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var S0=new Wn,bd=new Yi(1,1),w0=new $o,E0=new Jl,T0=new Ko,s0=[],r0=[],o0=new Float32Array(16),a0=new Float32Array(9),l0=new Float32Array(4);function uo(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=s0[s];if(r===void 0&&(r=new Float32Array(s),s0[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function gn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function xn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ph(n,t){let e=r0[t];e===void 0&&(e=new Int32Array(t),r0[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function qy(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Yy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2fv(this.addr,t),xn(e,t)}}function Zy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(gn(e,t))return;n.uniform3fv(this.addr,t),xn(e,t)}}function Jy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4fv(this.addr,t),xn(e,t)}}function jy(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;l0.set(i),n.uniformMatrix2fv(this.addr,!1,l0),xn(e,i)}}function Ky(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;a0.set(i),n.uniformMatrix3fv(this.addr,!1,a0),xn(e,i)}}function Qy(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;o0.set(i),n.uniformMatrix4fv(this.addr,!1,o0),xn(e,i)}}function t_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function e_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2iv(this.addr,t),xn(e,t)}}function n_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3iv(this.addr,t),xn(e,t)}}function i_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4iv(this.addr,t),xn(e,t)}}function s_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function r_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2uiv(this.addr,t),xn(e,t)}}function o_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3uiv(this.addr,t),xn(e,t)}}function a_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4uiv(this.addr,t),xn(e,t)}}function l_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(bd.compareFunction=e.isReversedDepthBuffer()?ch:lh,r=bd):r=S0,e.setTexture2D(t||r,s)}function c_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||E0,s)}function h_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||T0,s)}function u_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||w0,s)}function d_(n){switch(n){case 5126:return qy;case 35664:return Yy;case 35665:return Zy;case 35666:return Jy;case 35674:return jy;case 35675:return Ky;case 35676:return Qy;case 5124:case 35670:return t_;case 35667:case 35671:return e_;case 35668:case 35672:return n_;case 35669:case 35673:return i_;case 5125:return s_;case 36294:return r_;case 36295:return o_;case 36296:return a_;case 35678:case 36198:case 36298:case 36306:case 35682:return l_;case 35679:case 36299:case 36307:return c_;case 35680:case 36300:case 36308:case 36293:return h_;case 36289:case 36303:case 36311:case 36292:return u_}}function f_(n,t){n.uniform1fv(this.addr,t)}function p_(n,t){let e=uo(t,this.size,2);n.uniform2fv(this.addr,e)}function m_(n,t){let e=uo(t,this.size,3);n.uniform3fv(this.addr,e)}function g_(n,t){let e=uo(t,this.size,4);n.uniform4fv(this.addr,e)}function x_(n,t){let e=uo(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function v_(n,t){let e=uo(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function y_(n,t){let e=uo(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function __(n,t){n.uniform1iv(this.addr,t)}function b_(n,t){n.uniform2iv(this.addr,t)}function M_(n,t){n.uniform3iv(this.addr,t)}function S_(n,t){n.uniform4iv(this.addr,t)}function w_(n,t){n.uniform1uiv(this.addr,t)}function E_(n,t){n.uniform2uiv(this.addr,t)}function T_(n,t){n.uniform3uiv(this.addr,t)}function A_(n,t){n.uniform4uiv(this.addr,t)}function R_(n,t,e){let i=this.cache,s=t.length,r=ph(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=bd:o=S0;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function C_(n,t,e){let i=this.cache,s=t.length,r=ph(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||E0,r[o])}function I_(n,t,e){let i=this.cache,s=t.length,r=ph(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||T0,r[o])}function P_(n,t,e){let i=this.cache,s=t.length,r=ph(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||w0,r[o])}function L_(n){switch(n){case 5126:return f_;case 35664:return p_;case 35665:return m_;case 35666:return g_;case 35674:return x_;case 35675:return v_;case 35676:return y_;case 5124:case 35670:return __;case 35667:case 35671:return b_;case 35668:case 35672:return M_;case 35669:case 35673:return S_;case 5125:return w_;case 36294:return E_;case 36295:return T_;case 36296:return A_;case 35678:case 36198:case 36298:case 36306:case 35682:return R_;case 35679:case 36299:case 36307:return C_;case 35680:case 36300:case 36308:case 36293:return I_;case 36289:case 36303:case 36311:case 36292:return P_}}var Md=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=d_(e.type)}},Sd=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=L_(e.type)}},wd=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},yd=/(\w+)(\])?(\[|\.)?/g;function c0(n,t){n.seq.push(t),n.map[t.id]=t}function D_(n,t,e){let i=n.name,s=i.length;for(yd.lastIndex=0;;){let r=yd.exec(i),o=yd.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){c0(e,c===void 0?new Md(a,n,t):new Sd(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new wd(a),c0(e,u)),e=u}}}var lo=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);D_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function h0(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var U_=37297,N_=0;function F_(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var u0=new se;function O_(n){ue._getMatrix(u0,ue.workingColorSpace,n);let t=`mat3( ${u0.elements.map(e=>e.toFixed(4))} )`;switch(ue.getTransfer(n)){case Vo:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return Kt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function d0(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+F_(n.getShaderSource(t),a)}else return r}function B_(n,t){let e=O_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var z_={[Ma]:"Linear",[Sa]:"Reinhard",[wa]:"Cineon",[ar]:"ACESFilmic",[Ta]:"AgX",[ms]:"Neutral",[Ea]:"Custom"};function k_(n,t){let e=z_[t];return e===void 0?(Kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var uh=new U;function H_(){ue.getLuminanceCoefficients(uh);let n=uh.x.toFixed(4),t=uh.y.toFixed(4),e=uh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function G_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Oa).join(`
`)}function V_(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function W_(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Oa(n){return n!==""}function f0(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function p0(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var X_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ed(n){return n.replace(X_,q_)}var $_=new Map;function q_(n,t){let e=ce[t];if(e===void 0){let i=$_.get(t);if(i!==void 0)e=ce[i],Kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Ed(e)}var Y_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function m0(n){return n.replace(Y_,Z_)}function Z_(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function g0(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var J_={[rr]:"SHADOWMAP_TYPE_PCF",[no]:"SHADOWMAP_TYPE_VSM"};function j_(n){return J_[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var K_={[Os]:"ENVMAP_TYPE_CUBE",[lr]:"ENVMAP_TYPE_CUBE",[Aa]:"ENVMAP_TYPE_CUBE_UV"};function Q_(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":K_[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var t2={[lr]:"ENVMAP_MODE_REFRACTION"};function e2(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":t2[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var n2={[bc]:"ENVMAP_BLENDING_MULTIPLY",[Pp]:"ENVMAP_BLENDING_MIX",[Lp]:"ENVMAP_BLENDING_ADD"};function i2(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":n2[n.combine]||"ENVMAP_BLENDING_NONE"}function s2(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function r2(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=j_(e),c=Q_(e),h=e2(e),u=i2(e),d=s2(e),f=G_(e),p=V_(r),v=s.createProgram(),g,m,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Oa).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Oa).join(`
`),m.length>0&&(m+=`
`)):(g=[g0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oa).join(`
`),m=[g0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Fi?"#define TONE_MAPPING":"",e.toneMapping!==Fi?ce.tonemapping_pars_fragment:"",e.toneMapping!==Fi?k_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ce.colorspace_pars_fragment,B_("linearToOutputTexel",e.outputColorSpace),H_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Oa).join(`
`)),o=Ed(o),o=f0(o,e),o=p0(o,e),a=Ed(a),a=f0(a,e),a=p0(a,e),o=m0(o),a=m0(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===ad?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ad?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let b=_+g+o,y=_+m+a,M=h0(s,s.VERTEX_SHADER,b),w=h0(s,s.FRAGMENT_SHADER,y);s.attachShader(v,M),s.attachShader(v,w),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(D){if(n.debug.checkShaderErrors){let N=s.getProgramInfoLog(v)||"",F=s.getShaderInfoLog(M)||"",P=s.getShaderInfoLog(w)||"",z=N.trim(),G=F.trim(),$=P.trim(),et=!0,X=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(et=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,M,w);else{let tt=d0(s,M,"vertex"),nt=d0(s,w,"fragment");te("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+z+`
`+tt+`
`+nt)}else z!==""?Kt("WebGLProgram: Program Info Log:",z):(G===""||$==="")&&(X=!1);X&&(D.diagnostics={runnable:et,programLog:z,vertexShader:{log:G,prefix:g},fragmentShader:{log:$,prefix:m}})}s.deleteShader(M),s.deleteShader(w),x=new lo(s,v),E=W_(s,v)}let x;this.getUniforms=function(){return x===void 0&&T(this),x};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(v,U_)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=N_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=w,this}var o2=0,Td=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Ad(t),e.set(t,i)),i}},Ad=class{constructor(t){this.id=o2++,this.code=t,this.usedTimes=0}};function a2(n){return n===ks||n===Da||n===Ua}function l2(n,t,e,i,s,r){let o=new qo,a=new Td,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,d=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,E,C,D,N,F){let P=D.fog,z=N.geometry,G=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,et=t.get(x.envMap||G,$),X=et&&et.mapping===Aa?et.image.height:null,tt=f[x.type];x.precision!==null&&(d=i.getMaxPrecision(x.precision),d!==x.precision&&Kt("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));let nt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,St=nt!==void 0?nt.length:0,yt=0;z.morphAttributes.position!==void 0&&(yt=1),z.morphAttributes.normal!==void 0&&(yt=2),z.morphAttributes.color!==void 0&&(yt=3);let jt,$t,xt,K;if(tt){let Pe=qn[tt];jt=Pe.vertexShader,$t=Pe.fragmentShader}else{jt=x.vertexShader,$t=x.fragmentShader;let Pe=a.getVertexShaderStage(x),be=a.getFragmentShaderStage(x);a.update(x,Pe,be),xt=Pe.id,K=be.id}let R=n.getRenderTarget(),Y=n.state.buffers.depth.getReversed(),lt=N.isInstancedMesh===!0,ht=N.isBatchedMesh===!0,_t=!!x.map,Pt=!!x.matcap,L=!!et,q=!!x.aoMap,st=!!x.lightMap,V=!!x.bumpMap&&x.wireframe===!1,rt=!!x.normalMap,ft=!!x.displacementMap,ot=!!x.emissiveMap,bt=!!x.metalnessMap,Mt=!!x.roughnessMap,B=x.anisotropy>0,ae=x.clearcoat>0,ee=x.dispersion>0,I=x.retroreflectivity>0,S=x.iridescence>0,W=x.sheen>0,Z=x.transmission>0,it=B&&!!x.anisotropyMap,vt=ae&&!!x.clearcoatMap,wt=ae&&!!x.clearcoatNormalMap,at=ae&&!!x.clearcoatRoughnessMap,dt=S&&!!x.iridescenceMap,Rt=S&&!!x.iridescenceThicknessMap,qt=W&&!!x.sheenColorMap,Tt=W&&!!x.sheenRoughnessMap,Et=!!x.specularMap,Gt=!!x.specularColorMap,Zt=!!x.specularIntensityMap,ne=Z&&!!x.transmissionMap,H=Z&&!!x.thicknessMap,Ct=!!x.gradientMap,ut=!!x.alphaMap,It=x.alphaTest>0,Ft=!!x.alphaHash,mt=!!x.extensions,Jt=Fi;x.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Jt=n.toneMapping);let Xt={shaderID:tt,shaderType:x.type,shaderName:x.name,vertexShader:jt,fragmentShader:$t,defines:x.defines,customVertexShaderID:xt,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:ht,batchingColor:ht&&N._colorsTexture!==null,instancing:lt,instancingColor:lt&&N.instanceColor!==null,instancingMorph:lt&&N.morphTexture!==null,outputColorSpace:R===null?n.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ue.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:_t,matcap:Pt,envMap:L,envMapMode:L&&et.mapping,envMapCubeUVHeight:X,aoMap:q,lightMap:st,bumpMap:V,normalMap:rt,displacementMap:ft,emissiveMap:ot,normalMapObjectSpace:rt&&x.normalMapType===Np,normalMapTangentSpace:rt&&x.normalMapType===ro,packedNormalMap:rt&&x.normalMapType===ro&&a2(x.normalMap.format),metalnessMap:bt,roughnessMap:Mt,anisotropy:B,anisotropyMap:it,clearcoat:ae,clearcoatMap:vt,clearcoatNormalMap:wt,clearcoatRoughnessMap:at,dispersion:ee,retroreflection:I,iridescence:S,iridescenceMap:dt,iridescenceThicknessMap:Rt,sheen:W,sheenColorMap:qt,sheenRoughnessMap:Tt,specularMap:Et,specularColorMap:Gt,specularIntensityMap:Zt,transmission:Z,transmissionMap:ne,thicknessMap:H,gradientMap:Ct,opaque:x.transparent===!1&&x.blending===io&&x.alphaToCoverage===!1,alphaMap:ut,alphaTest:It,alphaHash:Ft,combine:x.combine,mapUv:_t&&p(x.map.channel),aoMapUv:q&&p(x.aoMap.channel),lightMapUv:st&&p(x.lightMap.channel),bumpMapUv:V&&p(x.bumpMap.channel),normalMapUv:rt&&p(x.normalMap.channel),displacementMapUv:ft&&p(x.displacementMap.channel),emissiveMapUv:ot&&p(x.emissiveMap.channel),metalnessMapUv:bt&&p(x.metalnessMap.channel),roughnessMapUv:Mt&&p(x.roughnessMap.channel),anisotropyMapUv:it&&p(x.anisotropyMap.channel),clearcoatMapUv:vt&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:wt&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:dt&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:Rt&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&p(x.sheenRoughnessMap.channel),specularMapUv:Et&&p(x.specularMap.channel),specularColorMapUv:Gt&&p(x.specularColorMap.channel),specularIntensityMapUv:Zt&&p(x.specularIntensityMap.channel),transmissionMapUv:ne&&p(x.transmissionMap.channel),thicknessMapUv:H&&p(x.thicknessMap.channel),alphaMapUv:ut&&p(x.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(rt||B),vertexNormals:!!z.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!z.attributes.uv&&(_t||ut),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||z.attributes.normal===void 0&&rt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Y,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:yt,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Jt,decodeVideoTexture:_t&&x.map.isVideoTexture===!0&&ue.getTransfer(x.map.colorSpace)===xe,decodeVideoTextureEmissive:ot&&x.emissiveMap.isVideoTexture===!0&&ue.getTransfer(x.emissiveMap.colorSpace)===xe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===xi,flipSided:x.side===Te,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:mt&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&x.extensions.multiDraw===!0||ht)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Xt.vertexUv1s=l.has(1),Xt.vertexUv2s=l.has(2),Xt.vertexUv3s=l.has(3),l.clear(),Xt}function g(x){let E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(let C in x.defines)E.push(C),E.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(m(E,x),_(E,x),E.push(n.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function m(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function _(x,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function b(x){let E=f[x.type],C;if(E){let D=qn[E];C=$n.clone(D.uniforms)}else C=x.uniforms;return C}function y(x,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new r2(n,E,x,s),c.push(C),h.set(E,C)),C}function M(x){if(--x.usedTimes===0){let E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function w(x){a.remove(x)}function T(){a.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:b,acquireProgram:y,releaseProgram:M,releaseShaderCache:w,programs:c,dispose:T}}function c2(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function h2(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function x0(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function v0(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,v,g,m){let _=n[t];return _===void 0?(_={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:v,renderOrder:d.renderOrder,z:g,group:m},n[t]=_):(_.id=d.id,_.object=d,_.geometry=f,_.material=p,_.materialVariant=o(d),_.groupOrder=v,_.renderOrder=d.renderOrder,_.z=g,_.group=m),t++,_}function l(d,f,p,v,g,m,_){_.reversedDepth===!0&&(g=-g);let b=a(d,f,p,v,g,m);p.transmission>0?i.push(b):p.transparent===!0?s.push(b):e.push(b)}function c(d,f,p,v,g,m){let _=a(d,f,p,v,g,m);p.transmission>0?i.unshift(_):p.transparent===!0?s.unshift(_):e.unshift(_)}function h(d,f){e.length>1&&e.sort(d||h2),i.length>1&&i.sort(f||x0),s.length>1&&s.sort(f||x0)}function u(){for(let d=t,f=n.length;d<f;d++){let p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function u2(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new v0,n.set(i,[o])):s>=r.length?(o=new v0,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function d2(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new U,color:new Ot};break;case"SpotLight":e={position:new U,direction:new U,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new U,halfWidth:new U,halfHeight:new U};break}return n[t.id]=e,e}}}function f2(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var p2=0;function m2(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function g2(n){let t=new d2,e=f2(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new U);let s=new U,r=new Dt,o=new Dt;function a(c){let h=0,u=0,d=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let f=0,p=0,v=0,g=0,m=0,_=0,b=0,y=0,M=0,w=0,T=0,x=0,E=0,C=0;c.sort(m2);for(let N=0,F=c.length;N<F;N++){let P=c[N],z=P.color,G=P.intensity,$=P.distance,et=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ks?et=P.shadow.map.texture:et=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=z.r*G,u+=z.g*G,d+=z.b*G;else if(P.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(P.sh.coefficients[X],G);C++}else if(P.isSunLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let tt=P.shadow,nt=e.get(P);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),i.sunShadow[p]=nt,i.sunShadowMap[p]=et;let St=tt.getViewportCount();for(let yt=0;yt<St;yt++)i.sunShadowMatrix[v+yt]=tt.getMatrix(yt),i.sunShadowCascade[v+yt]=tt._cascadeData[yt];v+=St,p++}i.sun[f]=X,f++}else if(P.isDirectionalLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let tt=P.shadow,nt=e.get(P);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,i.directionalShadow[g]=nt,i.directionalShadowMap[g]=et,i.directionalShadowMatrix[g]=P.shadow.matrix,M++}i.directional[g]=X,g++}else if(P.isSpotLight){let X=t.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(z).multiplyScalar(G),X.distance=$,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,i.spot[_]=X;let tt=P.shadow;if(P.map&&(i.spotLightMap[x]=P.map,x++,tt.updateMatrices(P),P.castShadow&&E++),i.spotLightMatrix[_]=tt.matrix,P.castShadow){let nt=e.get(P);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,i.spotShadow[_]=nt,i.spotShadowMap[_]=et,T++}_++}else if(P.isRectAreaLight){let X=t.get(P);X.color.copy(z).multiplyScalar(G),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),i.rectArea[b]=X,b++}else if(P.isPointLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){let tt=P.shadow,nt=e.get(P);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,nt.shadowCameraNear=tt.camera.near,nt.shadowCameraFar=tt.camera.far,i.pointShadow[m]=nt,i.pointShadowMap[m]=et,i.pointShadowMatrix[m]=P.shadow.matrix,w++}i.point[m]=X,m++}else if(P.isHemisphereLight){let X=t.get(P);X.skyColor.copy(P.color).multiplyScalar(G),X.groundColor.copy(P.groundColor).multiplyScalar(G),i.hemi[y]=X,y++}}b>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=At.LTC_FLOAT_1,i.rectAreaLTC2=At.LTC_FLOAT_2):(i.rectAreaLTC1=At.LTC_HALF_1,i.rectAreaLTC2=At.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let D=i.hash;(D.sunLength!==f||D.directionalLength!==g||D.pointLength!==m||D.spotLength!==_||D.rectAreaLength!==b||D.hemiLength!==y||D.numSunShadows!==p||D.numDirectionalShadows!==M||D.numPointShadows!==w||D.numSpotShadows!==T||D.numSpotMaps!==x||D.numLightProbes!==C)&&(i.sun.length=f,i.directional.length=g,i.spot.length=_,i.rectArea.length=b,i.point.length=m,i.hemi.length=y,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.directionalShadowMatrix.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=T,i.spotShadowMap.length=T,i.spotLightMatrix.length=T+x-E,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=C,D.sunLength=f,D.directionalLength=g,D.pointLength=m,D.spotLength=_,D.rectAreaLength=b,D.hemiLength=y,D.numSunShadows=p,D.numDirectionalShadows=M,D.numPointShadows=w,D.numSpotShadows=T,D.numSpotMaps=x,D.numLightProbes=C,i.version=p2++)}function l(c,h){let u=0,d=0,f=0,p=0,v=0,g=0,m=h.matrixWorldInverse;for(let _=0,b=c.length;_<b;_++){let y=c[_];if(y.isSunLight){let M=i.sun[u];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),u++}else if(y.isDirectionalLight){let M=i.directional[d];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(y.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(y.isRectAreaLight){let M=i.rectArea[v];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){let M=i.point[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let M=i.hemi[g];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:i}}function y0(n){let t=new g2(n),e=[],i=[],s=[];function r(d){u.camera=d,e.length=0,i.length=0,s.length=0}function o(d){e.push(d)}function a(d){i.push(d)}function l(d){s.push(d)}function c(){t.setup(e)}function h(d){t.setupView(e,d)}let u={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function x2(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new y0(n),t.set(s,[a])):r>=o.length?(a=new y0(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var v2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,y2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_2=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],b2=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],_0=new Dt,Fa=new U,_d=new U;function M2(n,t,e){let i=new Zr,s=new ct,r=new ct,o=new Se,a=new rc,l=new oc,c={},h=e.maxTextureSize,u={[Fs]:Te,[Te]:Fs,[xi]:xi},d=new De({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ct},radius:{value:4}},vertexShader:v2,fragmentShader:y2}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new ge;p.setAttribute("position",new Ee(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new zt(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rr;let m=this.type;this.render=function(w,T,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;this.type===gp&&(Kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=rr);let E=n.getRenderTarget(),C=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),N=n.state;N.setBlending(nn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let F=m!==this.type;F&&T.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(z=>z.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,z=w.length;P<z;P++){let G=w[P],$=G.shadow;if($===void 0){Kt("WebGLShadowMap:",G,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let et=$.getFrameExtents();s.multiply(et),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/et.x),s.x=r.x*et.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/et.y),s.y=r.y*et.y,$.mapSize.y=r.y));let X=n.state.buffers.depth.getReversed();if($.camera._reversedDepth=X,$.map===null||F===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===no){if(G.isPointLight){Kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Ke(s.x,s.y,{format:ks,type:bn,minFilter:An,magFilter:An,generateMipmaps:!1}),$.map.texture.name=G.name+".shadowMap",$.map.depthTexture=new Yi(s.x,s.y,yi),$.map.depthTexture.name=G.name+".shadowMapDepth",$.map.depthTexture.format=Xi,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=je,$.map.depthTexture.magFilter=je}else G.isPointLight?($.map=new dh(s.x),$.map.depthTexture=new Kl(s.x,Oi)):($.map=new Ke(s.x,s.y),$.map.depthTexture=new Yi(s.x,s.y,Oi)),$.map.depthTexture.name=G.name+".shadowMap",$.map.depthTexture.format=Xi,this.type===rr?($.map.depthTexture.compareFunction=X?ch:lh,$.map.depthTexture.minFilter=An,$.map.depthTexture.magFilter=An):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=je,$.map.depthTexture.magFilter=je);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let tt=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();G.isPointLight!==!0&&$.updateMatrices(G,x);for(let nt=0;nt<tt;nt++){let St=$.getCamera(nt);if(G.isPointLight){let yt=$.camera,jt=$.matrix,$t=G.distance||yt.far;$t!==yt.far&&(yt.far=$t,yt.updateProjectionMatrix()),Fa.setFromMatrixPosition(G.matrixWorld),yt.position.copy(Fa),_d.copy(yt.position),_d.add(_2[nt]),yt.up.copy(b2[nt]),yt.lookAt(_d),yt.updateMatrixWorld(),jt.makeTranslation(-Fa.x,-Fa.y,-Fa.z),_0.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),$._frustum.setFromProjectionMatrix(_0,yt.coordinateSystem,yt.reversedDepth)}if($.map.isWebGLCubeRenderTarget)n.setRenderTarget($.map,nt),n.clear();else{nt===0&&(n.setRenderTarget($.map),n.clear());let yt=$.getViewport(nt);o.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),N.viewport(o)}i=$.getFrustum(nt),y(T,x,St,G,this.type)}$.isPointLightShadow!==!0&&this.type===no&&_($,x),$.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(E,C,D)};function _(w,T){let x=t.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Ke(s.x,s.y,{format:ks,type:bn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(T,null,x,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(T,null,x,f,v,null)}function b(w,T,x,E){let C=null,D=x.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)C=D;else if(C=x.isPointLight===!0?l:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let N=C.uuid,F=T.uuid,P=c[N];P===void 0&&(P={},c[N]=P);let z=P[F];z===void 0&&(z=C.clone(),P[F]=z,T.addEventListener("dispose",M)),C=z}if(C.visible=T.visible,C.wireframe=T.wireframe,E===no?C.side=T.shadowSide!==null?T.shadowSide:T.side:C.side=T.shadowSide!==null?T.shadowSide:u[T.side],C.alphaMap=T.alphaMap,C.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,C.map=T.map,C.clipShadows=T.clipShadows,C.clippingPlanes=T.clippingPlanes,C.clipIntersection=T.clipIntersection,C.displacementMap=T.displacementMap,C.displacementScale=T.displacementScale,C.displacementBias=T.displacementBias,C.wireframeLinewidth=T.wireframeLinewidth,C.linewidth=T.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let N=n.properties.get(C);N.light=x}return C}function y(w,T,x,E,C){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&C===no)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,w.matrixWorld);let F=t.update(w),P=w.material;if(Array.isArray(P)){let z=F.groups;for(let G=0,$=z.length;G<$;G++){let et=z[G],X=P[et.materialIndex];if(X&&X.visible){let tt=b(w,X,E,C);w.onBeforeShadow(n,w,T,x,F,tt,et),n.renderBufferDirect(x,null,F,tt,w,et),w.onAfterShadow(n,w,T,x,F,tt,et)}}}else if(P.visible){let z=b(w,P,E,C);w.onBeforeShadow(n,w,T,x,F,z,null),n.renderBufferDirect(x,null,F,z,w,null),w.onAfterShadow(n,w,T,x,F,z,null)}}let N=w.children;for(let F=0,P=N.length;F<P;F++)y(N[F],T,x,E,C)}function M(w){w.target.removeEventListener("dispose",M);for(let x in c){let E=c[x],C=w.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function S2(n,t){function e(){let H=!1,Ct=new Se,ut=null,It=new Se(0,0,0,0);return{setMask:function(Ft){ut!==Ft&&!H&&(n.colorMask(Ft,Ft,Ft,Ft),ut=Ft)},setLocked:function(Ft){H=Ft},setClear:function(Ft,mt,Jt,Xt,Pe){Pe===!0&&(Ft*=Xt,mt*=Xt,Jt*=Xt),Ct.set(Ft,mt,Jt,Xt),It.equals(Ct)===!1&&(n.clearColor(Ft,mt,Jt,Xt),It.copy(Ct))},reset:function(){H=!1,ut=null,It.set(-1,0,0,0)}}}function i(){let H=!1,Ct=!1,ut=null,It=null,Ft=null;return{setReversed:function(mt){if(Ct!==mt){let Jt=t.get("EXT_clip_control");mt?Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.ZERO_TO_ONE_EXT):Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.NEGATIVE_ONE_TO_ONE_EXT),Ct=mt;let Xt=Ft;Ft=null,this.setClear(Xt)}},getReversed:function(){return Ct},setTest:function(mt){mt?R(n.DEPTH_TEST):Y(n.DEPTH_TEST)},setMask:function(mt){ut!==mt&&!H&&(n.depthMask(mt),ut=mt)},setFunc:function(mt){if(Ct&&(mt=$p[mt]),It!==mt){switch(mt){case zl:n.depthFunc(n.NEVER);break;case kl:n.depthFunc(n.ALWAYS);break;case Hl:n.depthFunc(n.LESS);break;case Gr:n.depthFunc(n.LEQUAL);break;case Gl:n.depthFunc(n.EQUAL);break;case Vl:n.depthFunc(n.GEQUAL);break;case Wl:n.depthFunc(n.GREATER);break;case Xl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}It=mt}},setLocked:function(mt){H=mt},setClear:function(mt){Ft!==mt&&(Ft=mt,Ct&&(mt=1-mt),n.clearDepth(mt))},reset:function(){H=!1,ut=null,It=null,Ft=null,Ct=!1}}}function s(){let H=!1,Ct=null,ut=null,It=null,Ft=null,mt=null,Jt=null,Xt=null,Pe=null;return{setTest:function(be){H||(be?R(n.STENCIL_TEST):Y(n.STENCIL_TEST))},setMask:function(be){Ct!==be&&!H&&(n.stencilMask(be),Ct=be)},setFunc:function(be,Ai,ki){(ut!==be||It!==Ai||Ft!==ki)&&(n.stencilFunc(be,Ai,ki),ut=be,It=Ai,Ft=ki)},setOp:function(be,Ai,ki){(mt!==be||Jt!==Ai||Xt!==ki)&&(n.stencilOp(be,Ai,ki),mt=be,Jt=Ai,Xt=ki)},setLocked:function(be){H=be},setClear:function(be){Pe!==be&&(n.clearStencil(be),Pe=be)},reset:function(){H=!1,Ct=null,ut=null,It=null,Ft=null,mt=null,Jt=null,Xt=null,Pe=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],v=null,g=!1,m=null,_=null,b=null,y=null,M=null,w=null,T=null,x=new Ot(0,0,0),E=0,C=!1,D=null,N=null,F=null,P=null,z=null,G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,et=0,X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(X)[1]),$=et>=1):X.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),$=et>=2);let tt=null,nt={},St=n.getParameter(n.SCISSOR_BOX),yt=n.getParameter(n.VIEWPORT),jt=new Se().fromArray(St),$t=new Se().fromArray(yt);function xt(H,Ct,ut,It){let Ft=new Uint8Array(4),mt=n.createTexture();n.bindTexture(H,mt),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Jt=0;Jt<ut;Jt++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ct,0,n.RGBA,1,1,It,0,n.RGBA,n.UNSIGNED_BYTE,Ft):n.texImage2D(Ct+Jt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ft);return mt}let K={};K[n.TEXTURE_2D]=xt(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=xt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=xt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=xt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),R(n.DEPTH_TEST),o.setFunc(Gr),V(!1),rt(qu),R(n.CULL_FACE),q(nn);function R(H){h[H]!==!0&&(n.enable(H),h[H]=!0)}function Y(H){h[H]!==!1&&(n.disable(H),h[H]=!1)}function lt(H,Ct){return d[H]!==Ct?(n.bindFramebuffer(H,Ct),d[H]=Ct,H===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=Ct),H===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=Ct),!0):!1}function ht(H,Ct){let ut=p,It=!1;if(H){ut=f.get(Ct),ut===void 0&&(ut=[],f.set(Ct,ut));let Ft=H.textures;if(ut.length!==Ft.length||ut[0]!==n.COLOR_ATTACHMENT0){for(let mt=0,Jt=Ft.length;mt<Jt;mt++)ut[mt]=n.COLOR_ATTACHMENT0+mt;ut.length=Ft.length,It=!0}}else ut[0]!==n.BACK&&(ut[0]=n.BACK,It=!0);It&&n.drawBuffers(ut)}function _t(H){return v!==H?(n.useProgram(H),v=H,!0):!1}let Pt={[vi]:n.FUNC_ADD,[xp]:n.FUNC_SUBTRACT,[vp]:n.FUNC_REVERSE_SUBTRACT};Pt[yp]=n.MIN,Pt[_p]=n.MAX;let L={[or]:n.ZERO,[bp]:n.ONE,[Mp]:n.SRC_COLOR,[Ju]:n.SRC_ALPHA,[Tp]:n.SRC_ALPHA_SATURATE,[ba]:n.DST_COLOR,[_a]:n.DST_ALPHA,[Sp]:n.ONE_MINUS_SRC_COLOR,[ju]:n.ONE_MINUS_SRC_ALPHA,[Ep]:n.ONE_MINUS_DST_COLOR,[wp]:n.ONE_MINUS_DST_ALPHA,[Ap]:n.CONSTANT_COLOR,[Rp]:n.ONE_MINUS_CONSTANT_COLOR,[Cp]:n.CONSTANT_ALPHA,[Ip]:n.ONE_MINUS_CONSTANT_ALPHA};function q(H,Ct,ut,It,Ft,mt,Jt,Xt,Pe,be){if(H===nn){g===!0&&(Y(n.BLEND),g=!1);return}if(g===!1&&(R(n.BLEND),g=!0),H!==_c){if(H!==m||be!==C){if((_!==vi||M!==vi)&&(n.blendEquation(n.FUNC_ADD),_=vi,M=vi),be)switch(H){case io:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ya:n.blendFunc(n.ONE,n.ONE);break;case Yu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:te("WebGLState: Invalid blending: ",H);break}else switch(H){case io:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ya:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Yu:te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zu:te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:te("WebGLState: Invalid blending: ",H);break}b=null,y=null,w=null,T=null,x.set(0,0,0),E=0,m=H,C=be}return}Ft=Ft||Ct,mt=mt||ut,Jt=Jt||It,(Ct!==_||Ft!==M)&&(n.blendEquationSeparate(Pt[Ct],Pt[Ft]),_=Ct,M=Ft),(ut!==b||It!==y||mt!==w||Jt!==T)&&(n.blendFuncSeparate(L[ut],L[It],L[mt],L[Jt]),b=ut,y=It,w=mt,T=Jt),(Xt.equals(x)===!1||Pe!==E)&&(n.blendColor(Xt.r,Xt.g,Xt.b,Pe),x.copy(Xt),E=Pe),m=H,C=!1}function st(H,Ct){H.side===xi?Y(n.CULL_FACE):R(n.CULL_FACE);let ut=H.side===Te;Ct&&(ut=!ut),V(ut),H.blending===io&&H.transparent===!1?q(nn):q(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),o.setFunc(H.depthFunc),o.setTest(H.depthTest),o.setMask(H.depthWrite),r.setMask(H.colorWrite);let It=H.stencilWrite;a.setTest(It),It&&(a.setMask(H.stencilWriteMask),a.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),a.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),ot(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?R(n.SAMPLE_ALPHA_TO_COVERAGE):Y(n.SAMPLE_ALPHA_TO_COVERAGE)}function V(H){D!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),D=H)}function rt(H){H!==pp?(R(n.CULL_FACE),H!==N&&(H===qu?n.cullFace(n.BACK):H===mp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Y(n.CULL_FACE),N=H}function ft(H){H!==F&&($&&n.lineWidth(H),F=H)}function ot(H,Ct,ut){H?(R(n.POLYGON_OFFSET_FILL),(P!==Ct||z!==ut)&&(P=Ct,z=ut,o.getReversed()&&(Ct=-Ct),n.polygonOffset(Ct,ut))):Y(n.POLYGON_OFFSET_FILL)}function bt(H){H?R(n.SCISSOR_TEST):Y(n.SCISSOR_TEST)}function Mt(H){H===void 0&&(H=n.TEXTURE0+G-1),tt!==H&&(n.activeTexture(H),tt=H)}function B(H,Ct,ut){ut===void 0&&(tt===null?ut=n.TEXTURE0+G-1:ut=tt);let It=nt[ut];It===void 0&&(It={type:void 0,texture:void 0},nt[ut]=It),(It.type!==H||It.texture!==Ct)&&(tt!==ut&&(n.activeTexture(ut),tt=ut),n.bindTexture(H,Ct||K[H]),It.type=H,It.texture=Ct)}function ae(){let H=nt[tt];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function ee(){try{n.compressedTexImage2D(...arguments)}catch(H){te("WebGLState:",H)}}function I(){try{n.compressedTexImage3D(...arguments)}catch(H){te("WebGLState:",H)}}function S(){try{n.texSubImage2D(...arguments)}catch(H){te("WebGLState:",H)}}function W(){try{n.texSubImage3D(...arguments)}catch(H){te("WebGLState:",H)}}function Z(){try{n.compressedTexSubImage2D(...arguments)}catch(H){te("WebGLState:",H)}}function it(){try{n.compressedTexSubImage3D(...arguments)}catch(H){te("WebGLState:",H)}}function vt(){try{n.texStorage2D(...arguments)}catch(H){te("WebGLState:",H)}}function wt(){try{n.texStorage3D(...arguments)}catch(H){te("WebGLState:",H)}}function at(){try{n.texImage2D(...arguments)}catch(H){te("WebGLState:",H)}}function dt(){try{n.texImage3D(...arguments)}catch(H){te("WebGLState:",H)}}function Rt(H){return u[H]!==void 0?u[H]:n.getParameter(H)}function qt(H,Ct){u[H]!==Ct&&(n.pixelStorei(H,Ct),u[H]=Ct)}function Tt(H){jt.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),jt.copy(H))}function Et(H){$t.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),$t.copy(H))}function Gt(H,Ct){let ut=c.get(Ct);ut===void 0&&(ut=new WeakMap,c.set(Ct,ut));let It=ut.get(H);It===void 0&&(It=n.getUniformBlockIndex(Ct,H.name),ut.set(H,It))}function Zt(H,Ct){let It=c.get(Ct).get(H);l.get(Ct)!==It&&(n.uniformBlockBinding(Ct,It,H.__bindingPointIndex),l.set(Ct,It))}function ne(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},tt=null,nt={},d={},f=new WeakMap,p=[],v=null,g=!1,m=null,_=null,b=null,y=null,M=null,w=null,T=null,x=new Ot(0,0,0),E=0,C=!1,D=null,N=null,F=null,P=null,z=null,jt.set(0,0,n.canvas.width,n.canvas.height),$t.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:R,disable:Y,bindFramebuffer:lt,drawBuffers:ht,useProgram:_t,setBlending:q,setMaterial:st,setFlipSided:V,setCullFace:rt,setLineWidth:ft,setPolygonOffset:ot,setScissorTest:bt,activeTexture:Mt,bindTexture:B,unbindTexture:ae,compressedTexImage2D:ee,compressedTexImage3D:I,texImage2D:at,texImage3D:dt,pixelStorei:qt,getParameter:Rt,updateUBOMapping:Gt,uniformBlockBinding:Zt,texStorage2D:vt,texStorage3D:wt,texSubImage2D:S,texSubImage3D:W,compressedTexSubImage2D:Z,compressedTexSubImage3D:it,scissor:Tt,viewport:Et,reset:ne}}function w2(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ct,h=new WeakMap,u=new Set,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(I,S){return p?new OffscreenCanvas(I,S):Wo("canvas")}function g(I,S,W){let Z=1,it=ee(I);if((it.width>W||it.height>W)&&(Z=W/Math.max(it.width,it.height)),Z<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let vt=Math.floor(Z*it.width),wt=Math.floor(Z*it.height);d===void 0&&(d=v(vt,wt));let at=S?v(vt,wt):d;return at.width=vt,at.height=wt,at.getContext("2d").drawImage(I,0,0,vt,wt),Kt("WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+vt+"x"+wt+")."),at}else return"data"in I&&Kt("WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),I;return I}function m(I){return I.generateMipmaps}function _(I){n.generateMipmap(I)}function b(I){return I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?n.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(I,S,W,Z,it,vt=!1){if(I!==null){if(n[I]!==void 0)return n[I];Kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let wt;Z&&(wt=t.get("EXT_texture_norm16"),wt||Kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let at=S;if(S===n.RED&&(W===n.FLOAT&&(at=n.R32F),W===n.HALF_FLOAT&&(at=n.R16F),W===n.UNSIGNED_BYTE&&(at=n.R8),W===n.UNSIGNED_SHORT&&wt&&(at=wt.R16_EXT),W===n.SHORT&&wt&&(at=wt.R16_SNORM_EXT)),S===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.R8UI),W===n.UNSIGNED_SHORT&&(at=n.R16UI),W===n.UNSIGNED_INT&&(at=n.R32UI),W===n.BYTE&&(at=n.R8I),W===n.SHORT&&(at=n.R16I),W===n.INT&&(at=n.R32I)),S===n.RG&&(W===n.FLOAT&&(at=n.RG32F),W===n.HALF_FLOAT&&(at=n.RG16F),W===n.UNSIGNED_BYTE&&(at=n.RG8),W===n.UNSIGNED_SHORT&&wt&&(at=wt.RG16_EXT),W===n.SHORT&&wt&&(at=wt.RG16_SNORM_EXT)),S===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RG8UI),W===n.UNSIGNED_SHORT&&(at=n.RG16UI),W===n.UNSIGNED_INT&&(at=n.RG32UI),W===n.BYTE&&(at=n.RG8I),W===n.SHORT&&(at=n.RG16I),W===n.INT&&(at=n.RG32I)),S===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGB8UI),W===n.UNSIGNED_SHORT&&(at=n.RGB16UI),W===n.UNSIGNED_INT&&(at=n.RGB32UI),W===n.BYTE&&(at=n.RGB8I),W===n.SHORT&&(at=n.RGB16I),W===n.INT&&(at=n.RGB32I)),S===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),W===n.UNSIGNED_INT&&(at=n.RGBA32UI),W===n.BYTE&&(at=n.RGBA8I),W===n.SHORT&&(at=n.RGBA16I),W===n.INT&&(at=n.RGBA32I)),S===n.RGB&&(W===n.UNSIGNED_SHORT&&wt&&(at=wt.RGB16_EXT),W===n.SHORT&&wt&&(at=wt.RGB16_SNORM_EXT),W===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(at=n.R11F_G11F_B10F)),S===n.RGBA){let dt=vt?Vo:ue.getTransfer(it);W===n.FLOAT&&(at=n.RGBA32F),W===n.HALF_FLOAT&&(at=n.RGBA16F),W===n.UNSIGNED_BYTE&&(at=dt===xe?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT&&wt&&(at=wt.RGBA16_EXT),W===n.SHORT&&wt&&(at=wt.RGBA16_SNORM_EXT),W===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function M(I,S){let W;return I?S===null||S===Oi||S===zs?W=n.DEPTH24_STENCIL8:S===yi?W=n.DEPTH32F_STENCIL8:S===so&&(W=n.DEPTH24_STENCIL8,Kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Oi||S===zs?W=n.DEPTH_COMPONENT24:S===yi?W=n.DEPTH_COMPONENT32F:S===so&&(W=n.DEPTH_COMPONENT16),W}function w(I,S){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==je&&I.minFilter!==An?Math.log2(Math.max(S.width,S.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?S.mipmaps.length:1}function T(I){let S=I.target;S.removeEventListener("dispose",T),E(S),S.isVideoTexture&&h.delete(S),S.isHTMLTexture&&u.delete(S)}function x(I){let S=I.target;S.removeEventListener("dispose",x),D(S)}function E(I){let S=i.get(I);if(S.__webglInit===void 0)return;let W=I.source,Z=f.get(W);if(Z){let it=Z[S.__cacheKey];it.usedTimes--,it.usedTimes===0&&C(I),Object.keys(Z).length===0&&f.delete(W)}i.remove(I)}function C(I){let S=i.get(I);n.deleteTexture(S.__webglTexture);let W=I.source,Z=f.get(W);delete Z[S.__cacheKey],o.memory.textures--}function D(I){let S=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let it=0;it<S.__webglFramebuffer[Z].length;it++)n.deleteFramebuffer(S.__webglFramebuffer[Z][it]);else n.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)n.deleteFramebuffer(S.__webglFramebuffer[Z]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let W=I.textures;for(let Z=0,it=W.length;Z<it;Z++){let vt=i.get(W[Z]);vt.__webglTexture&&(n.deleteTexture(vt.__webglTexture),o.memory.textures--),i.remove(W[Z])}i.remove(I)}let N=0;function F(){N=0}function P(){return N}function z(I){N=I}function G(){let I=N;return I>=s.maxTextures&&Kt("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,I}function $(I){let S=[];return S.push(I.wrapS),S.push(I.wrapT),S.push(I.wrapR||0),S.push(I.magFilter),S.push(I.minFilter),S.push(I.anisotropy),S.push(I.internalFormat),S.push(I.format),S.push(I.type),S.push(I.generateMipmaps),S.push(I.premultiplyAlpha),S.push(I.flipY),S.push(I.unpackAlignment),S.push(I.colorSpace),S.join()}function et(I,S){let W=i.get(I);if(I.isVideoTexture&&B(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&W.__version!==I.version){let Z=I.image;if(Z===null)Kt("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Kt("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(W,I,S);return}}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+S)}function X(I,S){let W=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Y(W,I,S);return}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+S)}function tt(I,S){let W=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Y(W,I,S);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+S)}function nt(I,S){let W=i.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&W.__version!==I.version){lt(W,I,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+S)}let St={[fi]:n.REPEAT,[Vi]:n.CLAMP_TO_EDGE,[$l]:n.MIRRORED_REPEAT},yt={[je]:n.NEAREST,[Dp]:n.NEAREST_MIPMAP_NEAREST,[Ra]:n.NEAREST_MIPMAP_LINEAR,[An]:n.LINEAR,[wc]:n.LINEAR_MIPMAP_NEAREST,[Bs]:n.LINEAR_MIPMAP_LINEAR},jt={[Op]:n.NEVER,[Gp]:n.ALWAYS,[Bp]:n.LESS,[lh]:n.LEQUAL,[zp]:n.EQUAL,[ch]:n.GEQUAL,[kp]:n.GREATER,[Hp]:n.NOTEQUAL};function $t(I,S){if(S.type===yi&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===An||S.magFilter===wc||S.magFilter===Ra||S.magFilter===Bs||S.minFilter===An||S.minFilter===wc||S.minFilter===Ra||S.minFilter===Bs)&&Kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,St[S.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,St[S.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,St[S.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,yt[S.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,yt[S.minFilter]),S.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,jt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===je||S.minFilter!==Ra&&S.minFilter!==Bs||S.type===yi&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function xt(I,S){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,S.addEventListener("dispose",T));let Z=S.source,it=f.get(Z);it===void 0&&(it={},f.set(Z,it));let vt=$(S);if(vt!==I.__cacheKey){it[vt]===void 0&&(it[vt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,W=!0),it[vt].usedTimes++;let wt=it[I.__cacheKey];wt!==void 0&&(it[I.__cacheKey].usedTimes--,wt.usedTimes===0&&C(S)),I.__cacheKey=vt,I.__webglTexture=it[vt].texture}return W}function K(I,S,W){return Math.floor(Math.floor(I/W)/S)}function R(I,S,W,Z){let vt=I.updateRanges;if(vt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,S.width,S.height,W,Z,S.data);else{vt.sort((qt,Tt)=>qt.start-Tt.start);let wt=0;for(let qt=1;qt<vt.length;qt++){let Tt=vt[wt],Et=vt[qt],Gt=Tt.start+Tt.count,Zt=K(Et.start,S.width,4),ne=K(Tt.start,S.width,4);Et.start<=Gt+1&&Zt===ne&&K(Et.start+Et.count-1,S.width,4)===Zt?Tt.count=Math.max(Tt.count,Et.start+Et.count-Tt.start):(++wt,vt[wt]=Et)}vt.length=wt+1;let at=e.getParameter(n.UNPACK_ROW_LENGTH),dt=e.getParameter(n.UNPACK_SKIP_PIXELS),Rt=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,S.width);for(let qt=0,Tt=vt.length;qt<Tt;qt++){let Et=vt[qt],Gt=Math.floor(Et.start/4),Zt=Math.ceil(Et.count/4),ne=Gt%S.width,H=Math.floor(Gt/S.width),Ct=Zt,ut=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,ne),e.pixelStorei(n.UNPACK_SKIP_ROWS,H),e.texSubImage2D(n.TEXTURE_2D,0,ne,H,Ct,ut,W,Z,S.data)}I.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,at),e.pixelStorei(n.UNPACK_SKIP_PIXELS,dt),e.pixelStorei(n.UNPACK_SKIP_ROWS,Rt)}}function Y(I,S,W){let Z=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=n.TEXTURE_3D);let it=xt(I,S),vt=S.source;e.bindTexture(Z,I.__webglTexture,n.TEXTURE0+W);let wt=i.get(vt);if(vt.version!==wt.__version||it===!0){if(e.activeTexture(n.TEXTURE0+W),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let ut=ue.getPrimaries(ue.workingColorSpace),It=S.colorSpace===gs?null:ue.getPrimaries(S.colorSpace),Ft=S.colorSpace===gs||ut===It?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft)}e.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment);let dt=g(S.image,!1,s.maxTextureSize);dt=ae(S,dt);let Rt=r.convert(S.format,S.colorSpace),qt=r.convert(S.type),Tt=y(S.internalFormat,Rt,qt,S.normalized,S.colorSpace,S.isVideoTexture);$t(Z,S);let Et,Gt=S.mipmaps,Zt=S.isVideoTexture!==!0,ne=wt.__version===void 0||it===!0,H=vt.dataReady,Ct=w(S,dt);if(S.isDepthTexture)Tt=M(S.format===Zi,S.type),ne&&(Zt?e.texStorage2D(n.TEXTURE_2D,1,Tt,dt.width,dt.height):e.texImage2D(n.TEXTURE_2D,0,Tt,dt.width,dt.height,0,Rt,qt,null));else if(S.isDataTexture)if(Gt.length>0){Zt&&ne&&e.texStorage2D(n.TEXTURE_2D,Ct,Tt,Gt[0].width,Gt[0].height);for(let ut=0,It=Gt.length;ut<It;ut++)Et=Gt[ut],Zt?H&&e.texSubImage2D(n.TEXTURE_2D,ut,0,0,Et.width,Et.height,Rt,qt,Et.data):e.texImage2D(n.TEXTURE_2D,ut,Tt,Et.width,Et.height,0,Rt,qt,Et.data);S.generateMipmaps=!1}else Zt?(ne&&e.texStorage2D(n.TEXTURE_2D,Ct,Tt,dt.width,dt.height),H&&R(S,dt,Rt,qt)):e.texImage2D(n.TEXTURE_2D,0,Tt,dt.width,dt.height,0,Rt,qt,dt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Zt&&ne&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ct,Tt,Gt[0].width,Gt[0].height,dt.depth);for(let ut=0,It=Gt.length;ut<It;ut++)if(Et=Gt[ut],S.format!==jn)if(Rt!==null)if(Zt){if(H)if(S.layerUpdates.size>0){let Ft=pd(Et.width,Et.height,S.format,S.type);for(let mt of S.layerUpdates){let Jt=Et.data.subarray(mt*Ft/Et.data.BYTES_PER_ELEMENT,(mt+1)*Ft/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ut,0,0,mt,Et.width,Et.height,1,Rt,Jt)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ut,0,0,0,Et.width,Et.height,dt.depth,Rt,Et.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ut,Tt,Et.width,Et.height,dt.depth,0,Et.data,0,0);else Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Zt?H&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,ut,0,0,0,Et.width,Et.height,dt.depth,Rt,qt,Et.data):e.texImage3D(n.TEXTURE_2D_ARRAY,ut,Tt,Et.width,Et.height,dt.depth,0,Rt,qt,Et.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{Zt&&ne&&e.texStorage2D(n.TEXTURE_2D,Ct,Tt,Gt[0].width,Gt[0].height);for(let ut=0,It=Gt.length;ut<It;ut++)Et=Gt[ut],S.format!==jn?Rt!==null?Zt?H&&e.compressedTexSubImage2D(n.TEXTURE_2D,ut,0,0,Et.width,Et.height,Rt,Et.data):e.compressedTexImage2D(n.TEXTURE_2D,ut,Tt,Et.width,Et.height,0,Et.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?H&&e.texSubImage2D(n.TEXTURE_2D,ut,0,0,Et.width,Et.height,Rt,qt,Et.data):e.texImage2D(n.TEXTURE_2D,ut,Tt,Et.width,Et.height,0,Rt,qt,Et.data)}else if(S.isDataArrayTexture)if(Zt){if(ne&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ct,Tt,dt.width,dt.height,dt.depth),H)if(S.layerUpdates.size>0){let ut=pd(dt.width,dt.height,S.format,S.type);for(let It of S.layerUpdates){let Ft=dt.data.subarray(It*ut/dt.data.BYTES_PER_ELEMENT,(It+1)*ut/dt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,It,dt.width,dt.height,1,Rt,qt,Ft)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,dt.width,dt.height,dt.depth,Rt,qt,dt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Tt,dt.width,dt.height,dt.depth,0,Rt,qt,dt.data);else if(S.isData3DTexture)Zt?(ne&&e.texStorage3D(n.TEXTURE_3D,Ct,Tt,dt.width,dt.height,dt.depth),H&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,dt.width,dt.height,dt.depth,Rt,qt,dt.data)):e.texImage3D(n.TEXTURE_3D,0,Tt,dt.width,dt.height,dt.depth,0,Rt,qt,dt.data);else if(S.isFramebufferTexture){if(ne)if(Zt)e.texStorage2D(n.TEXTURE_2D,Ct,Tt,dt.width,dt.height);else{let ut=dt.width,It=dt.height;for(let Ft=0;Ft<Ct;Ft++)e.texImage2D(n.TEXTURE_2D,Ft,Tt,ut,It,0,Rt,qt,null),ut>>=1,It>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in n){let ut=n.canvas;if(ut.hasAttribute("layoutsubtree")||ut.setAttribute("layoutsubtree","true"),dt.parentNode!==ut){ut.appendChild(dt),u.add(S),ut.onpaint=It=>{let Ft=It.changedElements;for(let mt of u)Ft.includes(mt.image)&&(mt.needsUpdate=!0)},ut.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,dt);else{let Ft=n.RGBA,mt=n.RGBA,Jt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Ft,mt,Jt,dt)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Gt.length>0){if(Zt&&ne){let ut=ee(Gt[0]);e.texStorage2D(n.TEXTURE_2D,Ct,Tt,ut.width,ut.height)}for(let ut=0,It=Gt.length;ut<It;ut++)Et=Gt[ut],Zt?H&&e.texSubImage2D(n.TEXTURE_2D,ut,0,0,Rt,qt,Et):e.texImage2D(n.TEXTURE_2D,ut,Tt,Rt,qt,Et);S.generateMipmaps=!1}else if(Zt){if(ne){let ut=ee(dt);e.texStorage2D(n.TEXTURE_2D,Ct,Tt,ut.width,ut.height)}H&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Rt,qt,dt)}else e.texImage2D(n.TEXTURE_2D,0,Tt,Rt,qt,dt);m(S)&&_(Z),wt.__version=vt.version,S.onUpdate&&S.onUpdate(S)}I.__version=S.version}function lt(I,S,W){if(S.image.length!==6)return;let Z=xt(I,S),it=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+W);let vt=i.get(it);if(it.version!==vt.__version||Z===!0){e.activeTexture(n.TEXTURE0+W);let wt=ue.getPrimaries(ue.workingColorSpace),at=S.colorSpace===gs?null:ue.getPrimaries(S.colorSpace),dt=S.colorSpace===gs||wt===at?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let Rt=S.isCompressedTexture||S.image[0].isCompressedTexture,qt=S.image[0]&&S.image[0].isDataTexture,Tt=[];for(let mt=0;mt<6;mt++)!Rt&&!qt?Tt[mt]=g(S.image[mt],!0,s.maxCubemapSize):Tt[mt]=qt?S.image[mt].image:S.image[mt],Tt[mt]=ae(S,Tt[mt]);let Et=Tt[0],Gt=r.convert(S.format,S.colorSpace),Zt=r.convert(S.type),ne=y(S.internalFormat,Gt,Zt,S.normalized,S.colorSpace),H=S.isVideoTexture!==!0,Ct=vt.__version===void 0||Z===!0,ut=it.dataReady,It=w(S,Et);$t(n.TEXTURE_CUBE_MAP,S);let Ft;if(Rt){H&&Ct&&e.texStorage2D(n.TEXTURE_CUBE_MAP,It,ne,Et.width,Et.height);for(let mt=0;mt<6;mt++){Ft=Tt[mt].mipmaps;for(let Jt=0;Jt<Ft.length;Jt++){let Xt=Ft[Jt];S.format!==jn?Gt!==null?H?ut&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt,0,0,Xt.width,Xt.height,Gt,Xt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt,ne,Xt.width,Xt.height,0,Xt.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ut&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt,0,0,Xt.width,Xt.height,Gt,Zt,Xt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt,ne,Xt.width,Xt.height,0,Gt,Zt,Xt.data)}}}else{if(Ft=S.mipmaps,H&&Ct){Ft.length>0&&It++;let mt=ee(Tt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,It,ne,mt.width,mt.height)}for(let mt=0;mt<6;mt++)if(qt){H?ut&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,Tt[mt].width,Tt[mt].height,Gt,Zt,Tt[mt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ne,Tt[mt].width,Tt[mt].height,0,Gt,Zt,Tt[mt].data);for(let Jt=0;Jt<Ft.length;Jt++){let Pe=Ft[Jt].image[mt].image;H?ut&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt+1,0,0,Pe.width,Pe.height,Gt,Zt,Pe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt+1,ne,Pe.width,Pe.height,0,Gt,Zt,Pe.data)}}else{H?ut&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,Gt,Zt,Tt[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ne,Gt,Zt,Tt[mt]);for(let Jt=0;Jt<Ft.length;Jt++){let Xt=Ft[Jt];H?ut&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt+1,0,0,Gt,Zt,Xt.image[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Jt+1,ne,Gt,Zt,Xt.image[mt])}}}m(S)&&_(n.TEXTURE_CUBE_MAP),vt.__version=it.version,S.onUpdate&&S.onUpdate(S)}I.__version=S.version}function ht(I,S,W,Z,it,vt){let wt=r.convert(W.format,W.colorSpace),at=r.convert(W.type),dt=y(W.internalFormat,wt,at,W.normalized,W.colorSpace),Rt=i.get(S),qt=i.get(W);if(qt.__renderTarget=S,!Rt.__hasExternalTextures){let Tt=Math.max(1,S.width>>vt),Et=Math.max(1,S.height>>vt);it===n.TEXTURE_3D||it===n.TEXTURE_2D_ARRAY?e.texImage3D(it,vt,dt,Tt,Et,S.depth,0,wt,at,null):e.texImage2D(it,vt,dt,Tt,Et,0,wt,at,null)}e.bindFramebuffer(n.FRAMEBUFFER,I),Mt(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,it,qt.__webglTexture,0,bt(S)):(it===n.TEXTURE_2D||it>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,it,qt.__webglTexture,vt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(I,S,W){if(n.bindRenderbuffer(n.RENDERBUFFER,I),S.depthBuffer){let Z=S.depthTexture,it=Z&&Z.isDepthTexture?Z.type:null,vt=M(S.stencilBuffer,it),wt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Mt(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,bt(S),vt,S.width,S.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,bt(S),vt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,vt,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,wt,n.RENDERBUFFER,I)}else{let Z=S.textures;for(let it=0;it<Z.length;it++){let vt=Z[it],wt=r.convert(vt.format,vt.colorSpace),at=r.convert(vt.type),dt=y(vt.internalFormat,wt,at,vt.normalized,vt.colorSpace);Mt(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,bt(S),dt,S.width,S.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,bt(S),dt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,dt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Pt(I,S,W){let Z=S.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,I),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let it=i.get(S.depthTexture);if(it.__renderTarget=S,(!it.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Z){if(it.__webglInit===void 0&&(it.__webglInit=!0,S.depthTexture.addEventListener("dispose",T)),it.__webglTexture===void 0){it.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,it.__webglTexture),$t(n.TEXTURE_CUBE_MAP,S.depthTexture);let Rt=r.convert(S.depthTexture.format),qt=r.convert(S.depthTexture.type),Tt;S.depthTexture.format===Xi?Tt=n.DEPTH_COMPONENT24:S.depthTexture.format===Zi&&(Tt=n.DEPTH24_STENCIL8);for(let Et=0;Et<6;Et++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Tt,S.width,S.height,0,Rt,qt,null)}}else et(S.depthTexture,0);let vt=it.__webglTexture,wt=bt(S),at=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+W:n.TEXTURE_2D,dt=S.depthTexture.format===Zi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(S.depthTexture.format===Xi)Mt(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,at,vt,0,wt):n.framebufferTexture2D(n.FRAMEBUFFER,dt,at,vt,0);else if(S.depthTexture.format===Zi)Mt(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,at,vt,0,wt):n.framebufferTexture2D(n.FRAMEBUFFER,dt,at,vt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function L(I){let S=i.get(I),W=I.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==I.depthTexture){let Z=I.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){let it=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",it)};Z.addEventListener("dispose",it),S.__depthDisposeCallback=it}S.__boundDepthTexture=Z}if(I.depthTexture&&!S.__autoAllocateDepthBuffer)if(W)for(let Z=0;Z<6;Z++)Pt(S.__webglFramebuffer[Z],I,Z);else{let Z=I.texture.mipmaps;Z&&Z.length>0?Pt(S.__webglFramebuffer[0],I,0):Pt(S.__webglFramebuffer,I,0)}else if(W){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=n.createRenderbuffer(),_t(S.__webglDepthbuffer[Z],I,!1);else{let it=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,vt=S.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,vt),n.framebufferRenderbuffer(n.FRAMEBUFFER,it,n.RENDERBUFFER,vt)}}else{let Z=I.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),_t(S.__webglDepthbuffer,I,!1);else{let it=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,vt=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,vt),n.framebufferRenderbuffer(n.FRAMEBUFFER,it,n.RENDERBUFFER,vt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function q(I,S,W){let Z=i.get(I);S!==void 0&&ht(Z.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&L(I)}function st(I){let S=I.texture,W=i.get(I),Z=i.get(S);I.addEventListener("dispose",x);let it=I.textures,vt=I.isWebGLCubeRenderTarget===!0,wt=it.length>1;if(wt||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=S.version,o.memory.textures++),vt){W.__webglFramebuffer=[];for(let at=0;at<6;at++)if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer[at]=[];for(let dt=0;dt<S.mipmaps.length;dt++)W.__webglFramebuffer[at][dt]=n.createFramebuffer()}else W.__webglFramebuffer[at]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer=[];for(let at=0;at<S.mipmaps.length;at++)W.__webglFramebuffer[at]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(wt)for(let at=0,dt=it.length;at<dt;at++){let Rt=i.get(it[at]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=n.createTexture(),o.memory.textures++)}if(I.samples>0&&Mt(I)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let at=0;at<it.length;at++){let dt=it[at];W.__webglColorRenderbuffer[at]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[at]);let Rt=r.convert(dt.format,dt.colorSpace),qt=r.convert(dt.type),Tt=y(dt.internalFormat,Rt,qt,dt.normalized,dt.colorSpace,I.isXRRenderTarget===!0),Et=bt(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,Et,Tt,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,W.__webglColorRenderbuffer[at])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),_t(W.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(vt){e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),$t(n.TEXTURE_CUBE_MAP,S);for(let at=0;at<6;at++)if(S.mipmaps&&S.mipmaps.length>0)for(let dt=0;dt<S.mipmaps.length;dt++)ht(W.__webglFramebuffer[at][dt],I,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+at,dt);else ht(W.__webglFramebuffer[at],I,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(S)&&_(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let at=0,dt=it.length;at<dt;at++){let Rt=it[at],qt=i.get(Rt),Tt=n.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Tt=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Tt,qt.__webglTexture),$t(Tt,Rt),ht(W.__webglFramebuffer,I,Rt,n.COLOR_ATTACHMENT0+at,Tt,0),m(Rt)&&_(Tt)}e.unbindTexture()}else{let at=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(at=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(at,Z.__webglTexture),$t(at,S),S.mipmaps&&S.mipmaps.length>0)for(let dt=0;dt<S.mipmaps.length;dt++)ht(W.__webglFramebuffer[dt],I,S,n.COLOR_ATTACHMENT0,at,dt);else ht(W.__webglFramebuffer,I,S,n.COLOR_ATTACHMENT0,at,0);m(S)&&_(at),e.unbindTexture()}I.depthBuffer&&L(I)}function V(I){let S=I.textures;for(let W=0,Z=S.length;W<Z;W++){let it=S[W];if(m(it)){let vt=b(I),wt=i.get(it).__webglTexture;e.bindTexture(vt,wt),_(vt),e.unbindTexture()}}}let rt=[],ft=[];function ot(I){if(I.samples>0){if(Mt(I)===!1){let S=I.textures,W=I.width,Z=I.height,it=n.COLOR_BUFFER_BIT,vt=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,wt=i.get(I),at=S.length>1;if(at)for(let Rt=0;Rt<S.length;Rt++)e.bindFramebuffer(n.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,wt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);let dt=I.texture.mipmaps;dt&&dt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Rt=0;Rt<S.length;Rt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(it|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(it|=n.STENCIL_BUFFER_BIT)),at){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,wt.__webglColorRenderbuffer[Rt]);let qt=i.get(S[Rt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,qt,0)}n.blitFramebuffer(0,0,W,Z,0,0,W,Z,it,n.NEAREST),l===!0&&(rt.length=0,ft.length=0,rt.push(n.COLOR_ATTACHMENT0+Rt),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(rt.push(vt),ft.push(vt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ft)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,rt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),at)for(let Rt=0;Rt<S.length;Rt++){e.bindFramebuffer(n.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.RENDERBUFFER,wt.__webglColorRenderbuffer[Rt]);let qt=i.get(S[Rt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,wt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.TEXTURE_2D,qt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let S=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function bt(I){return Math.min(s.maxSamples,I.samples)}function Mt(I){let S=i.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function B(I){let S=o.render.frame;h.get(I)!==S&&(h.set(I,S),I.update())}function ae(I,S){let W=I.colorSpace,Z=I.format,it=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==Go&&W!==gs&&(ue.getTransfer(W)===xe?(Z!==jn||it!==On)&&Kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):te("WebGLTextures: Unsupported texture color space:",W)),S}function ee(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=F,this.getTextureUnits=P,this.setTextureUnits=z,this.setTexture2D=et,this.setTexture2DArray=X,this.setTexture3D=tt,this.setTextureCube=nt,this.rebindTextures=q,this.setupRenderTarget=st,this.updateRenderTargetMipmap=V,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=L,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=Mt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function E2(n,t){function e(i,s=gs){let r,o=ue.getTransfer(s);if(i===On)return n.UNSIGNED_BYTE;if(i===Tc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ac)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ed)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===nd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Qu)return n.BYTE;if(i===td)return n.SHORT;if(i===so)return n.UNSIGNED_SHORT;if(i===Ec)return n.INT;if(i===Oi)return n.UNSIGNED_INT;if(i===yi)return n.FLOAT;if(i===bn)return n.HALF_FLOAT;if(i===id)return n.ALPHA;if(i===sd)return n.RGB;if(i===jn)return n.RGBA;if(i===Xi)return n.DEPTH_COMPONENT;if(i===Zi)return n.DEPTH_STENCIL;if(i===Rc)return n.RED;if(i===Cc)return n.RED_INTEGER;if(i===ks)return n.RG;if(i===Ic)return n.RG_INTEGER;if(i===Pc)return n.RGBA_INTEGER;if(i===Ca||i===Ia||i===Pa||i===La)if(o===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===La)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===La)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Lc||i===Dc||i===Uc||i===Nc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Lc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Dc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Uc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Nc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fc||i===Oc||i===Bc||i===zc||i===kc||i===Da||i===Hc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Fc||i===Oc)return o===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Bc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===zc)return r.COMPRESSED_R11_EAC;if(i===kc)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Da)return r.COMPRESSED_RG11_EAC;if(i===Hc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Gc||i===Vc||i===Wc||i===Xc||i===$c||i===qc||i===Yc||i===Zc||i===Jc||i===jc||i===Kc||i===Qc||i===th||i===eh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Gc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Vc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Wc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$c)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===qc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Zc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Kc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Qc)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===th)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===eh)return o===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nh||i===ih||i===sh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===nh)return o===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ih)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===sh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===rh||i===oh||i===Ua||i===ah)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===rh)return r.COMPRESSED_RED_RGTC1_EXT;if(i===oh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ua)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ah)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var T2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,A2=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Rd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Qo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new De({vertexShader:T2,fragmentShader:A2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new zt(new Xn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Cd=class extends $i{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null,v=typeof XRWebGLBinding<"u",g=new Rd,m={},_=e.getContextAttributes(),b=null,y=null,M=[],w=[],T=new ct,x=null,E=null,C=new mn;C.viewport=new Se;let D=new mn;D.viewport=new Se;let N=[C,D],F=new vc,P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let R=M[K];return R===void 0&&(R=new qr,M[K]=R),R.getTargetRaySpace()},this.getControllerGrip=function(K){let R=M[K];return R===void 0&&(R=new qr,M[K]=R),R.getGripSpace()},this.getHand=function(K){let R=M[K];return R===void 0&&(R=new qr,M[K]=R),R.getHandSpace()};function G(K){let R=w.indexOf(K.inputSource);if(R===-1)return;let Y=M[R];Y!==void 0&&(Y.update(K.inputSource,K.frame,c||o),Y.dispatchEvent({type:K.type,data:K.inputSource}))}function $(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",et);for(let K=0;K<M.length;K++){let R=w[K];R!==null&&(w[K]=null,M[K].disconnect(R))}P=null,z=null,g.reset();for(let K in m)delete m[K];if(t.setRenderTarget(b),f=null,d=null,u=null,s=null,y=null,xt.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(T.width,T.height,!1),E!==null){let K=E.camera;K.fov=E.fov,K.zoom=E.zoom,K.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&Kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&Kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",$),s.addEventListener("inputsourceschange",et),_.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Y=null,lt=null,ht=null;_.depth&&(ht=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=_.stencil?Zi:Xi,lt=_.stencil?zs:Oi);let _t={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(_t),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ke(d.textureWidth,d.textureHeight,{format:jn,type:On,depthTexture:new Yi(d.textureWidth,d.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let Y={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ke(f.framebufferWidth,f.framebufferHeight,{format:jn,type:On,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),xt.setContext(s),xt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(K){for(let R=0;R<K.removed.length;R++){let Y=K.removed[R],lt=w.indexOf(Y);lt>=0&&(w[lt]=null,M[lt].disconnect(Y))}for(let R=0;R<K.added.length;R++){let Y=K.added[R],lt=w.indexOf(Y);if(lt===-1){for(let _t=0;_t<M.length;_t++)if(_t>=w.length){w.push(Y),lt=_t;break}else if(w[_t]===null){w[_t]=Y,lt=_t;break}if(lt===-1)break}let ht=M[lt];ht&&ht.connect(Y)}}let X=new U,tt=new U;function nt(K,R,Y){X.setFromMatrixPosition(R.matrixWorld),tt.setFromMatrixPosition(Y.matrixWorld);let lt=X.distanceTo(tt),ht=R.projectionMatrix.elements,_t=Y.projectionMatrix.elements,Pt=ht[14]/(ht[10]-1),L=ht[14]/(ht[10]+1),q=(ht[9]+1)/ht[5],st=(ht[9]-1)/ht[5],V=(ht[8]-1)/ht[0],rt=(_t[8]+1)/_t[0],ft=Pt*V,ot=Pt*rt,bt=lt/(-V+rt),Mt=bt*-V;if(R.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Mt),K.translateZ(bt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ht[10]===-1)K.projectionMatrix.copy(R.projectionMatrix),K.projectionMatrixInverse.copy(R.projectionMatrixInverse);else{let B=Pt+bt,ae=L+bt,ee=ft-Mt,I=ot+(lt-Mt),S=q*L/ae*B,W=st*L/ae*B;K.projectionMatrix.makePerspective(ee,I,S,W,B,ae),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function St(K,R){R===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(R.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let R=K.near,Y=K.far;g.texture!==null&&(g.depthNear>0&&(R=g.depthNear),g.depthFar>0&&(Y=g.depthFar)),F.near=D.near=C.near=R,F.far=D.far=C.far=Y,(P!==F.near||z!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),P=F.near,z=F.far),F.layers.mask=K.layers.mask|6,C.layers.mask=F.layers.mask&-5,D.layers.mask=F.layers.mask&-3;let lt=K.parent,ht=F.cameras;St(F,lt);for(let _t=0;_t<ht.length;_t++)St(ht[_t],lt);ht.length===2?nt(F,C,D):F.projectionMatrix.copy(C.projectionMatrix),E===null&&K.isPerspectiveCamera&&(E={camera:K,fov:K.fov,zoom:K.zoom}),yt(K,F,lt)};function yt(K,R,Y){Y===null?K.matrix.copy(R.matrixWorld):(K.matrix.copy(Y.matrixWorld),K.matrix.invert(),K.matrix.multiply(R.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(R.projectionMatrix),K.projectionMatrixInverse.copy(R.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Xr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function(K){return m[K]};let jt=null;function $t(K,R){if(h=R.getViewerPose(c||o),p=R,h!==null){let Y=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let lt=!1;Y.length!==F.cameras.length&&(F.cameras.length=0,lt=!0);for(let L=0;L<Y.length;L++){let q=Y[L],st=null;if(f!==null)st=f.getViewport(q);else{let rt=u.getViewSubImage(d,q);st=rt.viewport,L===0&&(t.setRenderTargetTextures(y,rt.colorTexture,rt.depthStencilTexture),t.setRenderTarget(y))}let V=N[L];V===void 0&&(V=new mn,V.layers.enable(L),V.viewport=new Se,N[L]=V),V.matrix.fromArray(q.transform.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale),V.projectionMatrix.fromArray(q.projectionMatrix),V.projectionMatrixInverse.copy(V.projectionMatrix).invert(),V.viewport.set(st.x,st.y,st.width,st.height),L===0&&(F.matrix.copy(V.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),lt===!0&&F.cameras.push(V)}let ht=s.enabledFeatures;if(ht&&ht.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();let L=u.getDepthInformation(Y[0]);L&&L.isValid&&L.texture&&g.init(L,s.renderState)}if(ht&&ht.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let L=0;L<Y.length;L++){let q=Y[L].camera;if(q){let st=m[q];st||(st=new Qo,m[q]=st);let V=u.getCameraImage(q);st.sourceTexture=V}}}}for(let Y=0;Y<M.length;Y++){let lt=w[Y],ht=M[Y];lt!==null&&ht!==void 0&&ht.update(lt,R,c||o)}jt&&jt(K,R),R.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:R}),p=null}let xt=new b0;xt.setAnimationLoop($t),this.setAnimationLoop=function(K){jt=K},this.dispose=function(){}}},R2=new Dt,A0=new se;A0.set(-1,0,0,0,1,0,0,0,1);function C2(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,ud(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,_,b,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,y)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,_,b):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Te&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Te&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let _=t.get(m),b=_.envMap,y=_.envMapRotation;b&&(g.envMap.value=b,g.envMapRotation.value.setFromMatrix4(R2.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(A0),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,_,b){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*_,g.scale.value=b*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,_){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Te&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){let _=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function I2(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){let w=M.program;i.uniformBlockBinding(y,w)}function c(y,M){let w=s[y.id];w===void 0&&(g(y),w=h(y),s[y.id]=w,y.addEventListener("dispose",_));let T=M.program;i.updateUBOMapping(y,T);let x=t.render.frame;r[y.id]!==x&&(d(y),r[y.id]=x)}function h(y){let M=u();y.__bindingPointIndex=M;let w=n.createBuffer(),T=y.__size,x=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,T,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,w),w}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let M=s[y.id],w=y.uniforms,T=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let x=0,E=w.length;x<E;x++){let C=w[x];if(Array.isArray(C))for(let D=0,N=C.length;D<N;D++)f(C[D],x,D,T);else f(C,x,0,T)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,M,w,T){if(v(y,M,w,T)===!0){let x=y.__offset,E=y.value;if(Array.isArray(E)){let C=0;for(let D=0;D<E.length;D++){let N=E[D],F=m(N);p(N,y.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=F.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,y.__data)}}function p(y,M,w){typeof y=="number"||typeof y=="boolean"?M[0]=y:y.isMatrix3?(M[0]=y.elements[0],M[1]=y.elements[1],M[2]=y.elements[2],M[3]=0,M[4]=y.elements[3],M[5]=y.elements[4],M[6]=y.elements[5],M[7]=0,M[8]=y.elements[6],M[9]=y.elements[7],M[10]=y.elements[8],M[11]=0):ArrayBuffer.isView(y)?M.set(new y.constructor(y.buffer,y.byteOffset,M.length)):y.toArray(M,w)}function v(y,M,w,T){let x=y.value,E=M+"_"+w;if(T[E]===void 0)return typeof x=="number"||typeof x=="boolean"?T[E]=x:ArrayBuffer.isView(x)?T[E]=x.slice():T[E]=x.clone(),!0;{let C=T[E];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return T[E]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function g(y){let M=y.uniforms,w=0,T=16;for(let E=0,C=M.length;E<C;E++){let D=Array.isArray(M[E])?M[E]:[M[E]];for(let N=0,F=D.length;N<F;N++){let P=D[N],z=Array.isArray(P.value)?P.value:[P.value];for(let G=0,$=z.length;G<$;G++){let et=z[G],X=m(et),tt=w%T,nt=tt%X.boundary,St=tt+nt;w+=nt,St!==0&&T-St<X.storage&&(w+=T-St),P.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=w,w+=X.storage}}}let x=w%T;return x>0&&(w+=T-x),y.__size=w,y.__cache={},this}function m(y){let M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?Kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(M.boundary=16,M.storage=y.byteLength):Kt("WebGLRenderer: Unsupported uniform value type.",y),M}function _(y){let M=y.target;M.removeEventListener("dispose",_);let w=o.indexOf(M.__bindingPointIndex);o.splice(w,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function b(){for(let y in s)n.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:b}}var P2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ji=null;function L2(){return Ji===null&&(Ji=new ps(P2,16,16,ks,bn),Ji.name="DFG_LUT",Ji.minFilter=An,Ji.magFilter=An,Ji.wrapS=Vi,Ji.wrapT=Vi,Ji.generateMipmaps=!1,Ji.needsUpdate=!0),Ji}var ho=class{constructor(t={}){let{canvas:e=Vp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=On}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let v=f,g=new Set([Pc,Ic,Cc]),m=new Set([On,Oi,so,zs,Tc,Ac]),_=new Uint32Array(4),b=new Int32Array(4),y=new U,M=null,w=null,T=[],x=[],E=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,D=!1,N=null,F=null,P=null,z=null;this._outputColorSpace=Fe;let G=0,$=0,et=null,X=-1,tt=null,nt=new Se,St=new Se,yt=null,jt=new Ot(0),$t=0,xt=e.width,K=e.height,R=1,Y=null,lt=null,ht=new Se(0,0,xt,K),_t=new Se(0,0,xt,K),Pt=!1,L=new Zr,q=!1,st=!1,V=new Dt,rt=new U,ft=new Se,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},bt=!1;function Mt(){return et===null?R:1}let B=i;function ae(A,k){return e.getContext(A,k)}let ee,I,S,W,Z,it,vt,wt,at,dt,Rt,qt,Tt,Et,Gt,Zt,ne,H,Ct,ut,It,Ft,mt;try{let A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${yc}`),e.addEventListener("webglcontextlost",Pe,!1),e.addEventListener("webglcontextrestored",be,!1),e.addEventListener("webglcontextcreationerror",Ai,!1),B===null){let k="webgl2";if(B=ae(k,A),B===null)throw ae(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Jt()}catch(A){throw e.removeEventListener("webglcontextlost",Pe,!1),e.removeEventListener("webglcontextrestored",be,!1),e.removeEventListener("webglcontextcreationerror",Ai,!1),te("WebGLRenderer: "+A.message),A}function Jt(){ee=new zy(B),ee.init(),It=new E2(B,ee),I=new Cy(B,ee,t,It),S=new S2(B,ee),I.reversedDepthBuffer&&d&&S.buffers.depth.setReversed(!0),F=B.createFramebuffer(),P=B.createFramebuffer(),z=B.createFramebuffer(),W=new Gy(B),Z=new c2,it=new w2(B,ee,S,Z,I,It,W),vt=new By(C),wt=new Wx(B),Ft=new Ay(B,wt),at=new ky(B,wt,W,Ft),dt=new Wy(B,at,wt,Ft,W),H=new Vy(B,I,it),Gt=new Iy(Z),Rt=new l2(C,vt,ee,I,Ft,Gt),qt=new C2(C,Z),Tt=new u2,Et=new x2(ee),ne=new Ty(C,vt,S,dt,p,l),Zt=new M2(C,dt,I),mt=new I2(B,W,I,S),Ct=new Ry(B,ee,W),ut=new Hy(B,ee,W),W.programs=Rt.programs,C.capabilities=I,C.extensions=ee,C.properties=Z,C.renderLists=Tt,C.shadowMap=Zt,C.state=S,C.info=W}v!==On&&(E=new $y(v,e.width,e.height,a,s,r));let Xt=new Cd(C,B);this.xr=Xt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let A=ee.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=ee.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return R},this.setPixelRatio=function(A){A!==void 0&&(R=A,this.setSize(xt,K,!1))},this.getSize=function(A){return A.set(xt,K)},this.setSize=function(A,k,Q=!0){if(Xt.isPresenting){Kt("WebGLRenderer: Can't change size while VR device is presenting.");return}xt=A,K=k,e.width=Math.floor(A*R),e.height=Math.floor(k*R),Q===!0&&(e.style.width=A+"px",e.style.height=k+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(xt*R,K*R).floor()},this.setDrawingBufferSize=function(A,k,Q){xt=A,K=k,R=Q,e.width=Math.floor(A*Q),e.height=Math.floor(k*Q),this.setViewport(0,0,A,k)},this.setEffects=function(A){if(v===On){te("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let k=0;k<A.length;k++)if(A[k].isOutputPass===!0){Kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(nt)},this.getViewport=function(A){return A.copy(ht)},this.setViewport=function(A,k,Q,J){A.isVector4?ht.set(A.x,A.y,A.z,A.w):ht.set(A,k,Q,J),S.viewport(nt.copy(ht).multiplyScalar(R).round())},this.getScissor=function(A){return A.copy(_t)},this.setScissor=function(A,k,Q,J){A.isVector4?_t.set(A.x,A.y,A.z,A.w):_t.set(A,k,Q,J),S.scissor(St.copy(_t).multiplyScalar(R).round())},this.getScissorTest=function(){return Pt},this.setScissorTest=function(A){S.setScissorTest(Pt=A)},this.setOpaqueSort=function(A){Y=A},this.setTransparentSort=function(A){lt=A},this.getClearColor=function(A){return A.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor(...arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha(...arguments)},this.clear=function(A=!0,k=!0,Q=!0){let J=0;if(A){let j=!1;if(et!==null){let Nt=et.texture.format;j=g.has(Nt)}if(j){let Nt=et.texture.type,kt=m.has(Nt),Ut=ne.getClearColor(),Vt=ne.getClearAlpha(),Yt=Ut.r,le=Ut.g,fe=Ut.b;kt?(_[0]=Yt,_[1]=le,_[2]=fe,_[3]=Vt,B.clearBufferuiv(B.COLOR,0,_)):(b[0]=Yt,b[1]=le,b[2]=fe,b[3]=Vt,B.clearBufferiv(B.COLOR,0,b))}else J|=B.COLOR_BUFFER_BIT}k&&(J|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&(J|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),J!==0&&B.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),N=A},this.dispose=function(){e.removeEventListener("webglcontextlost",Pe,!1),e.removeEventListener("webglcontextrestored",be,!1),e.removeEventListener("webglcontextcreationerror",Ai,!1),ne.dispose(),Tt.dispose(),Et.dispose(),Z.dispose(),vt.dispose(),dt.dispose(),Ft.dispose(),mt.dispose(),Rt.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",Tf),Xt.removeEventListener("sessionend",Af),Ys.stop()};function Pe(A){A.preventDefault(),Xo("WebGLRenderer: Context Lost."),D=!0}function be(){Xo("WebGLRenderer: Context Restored."),D=!1;let A=W.autoReset,k=Zt.enabled,Q=Zt.autoUpdate,J=Zt.needsUpdate,j=Zt.type;Jt(),W.autoReset=A,Zt.enabled=k,Zt.autoUpdate=Q,Zt.needsUpdate=J,Zt.type=j}function Ai(A){te("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ki(A){let k=A.target;k.removeEventListener("dispose",ki),ag(k)}function ag(A){lg(A),Z.remove(A)}function lg(A){let k=Z.get(A).programs;k!==void 0&&(k.forEach(function(Q){Rt.releaseProgram(Q)}),A.isShaderMaterial&&Rt.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,Q,J,j,Nt){k===null&&(k=ot);let kt=j.isMesh&&j.matrixWorld.determinantAffine()<0,Ut=ug(A,k,Q,J,j);S.setMaterial(J,kt);let Vt=Q.index,Yt=1;if(J.wireframe===!0){if(Vt=at.getWireframeAttribute(Q),Vt===void 0)return;Yt=2}let le=Q.drawRange,fe=Q.attributes.position,Wt=le.start*Yt,Me=(le.start+le.count)*Yt;Nt!==null&&(Wt=Math.max(Wt,Nt.start*Yt),Me=Math.min(Me,(Nt.start+Nt.count)*Yt)),Vt!==null?(Wt=Math.max(Wt,0),Me=Math.min(Me,Vt.count)):fe!=null&&(Wt=Math.max(Wt,0),Me=Math.min(Me,fe.count));let ln=Me-Wt;if(ln<0||ln===1/0)return;Ft.setup(j,J,Ut,Q,Vt);let Ue,Ie=Ct;if(Vt!==null&&(Ue=wt.get(Vt),Ie=ut,Ie.setIndex(Ue)),j.isMesh)J.wireframe===!0?(S.setLineWidth(J.wireframeLinewidth*Mt()),Ie.setMode(B.LINES)):Ie.setMode(B.TRIANGLES);else if(j.isLine){let Un=J.linewidth;Un===void 0&&(Un=1),S.setLineWidth(Un*Mt()),j.isLineSegments?Ie.setMode(B.LINES):j.isLineLoop?Ie.setMode(B.LINE_LOOP):Ie.setMode(B.LINE_STRIP)}else j.isPoints?Ie.setMode(B.POINTS):j.isSprite&&Ie.setMode(B.TRIANGLES);if(j.isBatchedMesh)if(ee.get("WEBGL_multi_draw"))Ie.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{let Un=j._multiDrawStarts,Bt=j._multiDrawCounts,Gn=j._multiDrawCount,me=Vt?wt.get(Vt).bytesPerElement:1,ui=Z.get(J).currentProgram.getUniforms();for(let Hi=0;Hi<Gn;Hi++)ui.setValue(B,"_gl_DrawID",Hi),Ie.render(Un[Hi]/me,Bt[Hi])}else if(j.isInstancedMesh)Ie.renderInstances(Wt,ln,j.count);else if(Q.isInstancedBufferGeometry){let Un=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Bt=Math.min(Q.instanceCount,Un);Ie.renderInstances(Wt,ln,Bt)}else Ie.render(Wt,ln)};function Ef(A,k,Q,J){N!==null&&A.isNodeMaterial&&N.setObject(J,A),q===!0&&Gt.setState(A,Q,!1),A.transparent===!0&&A.side===xi&&A.forceSinglePass===!1?(A.side=Te,A.needsUpdate=!0,fl(A,k,J),A.side=Fs,A.needsUpdate=!0,fl(A,k,J),A.side=xi):fl(A,k,J)}this.compile=function(A,k,Q=null){Q===null&&(Q=A),N!==null&&N.renderStart(A,k,Q),w=Et.get(Q),w.init(k),x.push(w),Q.traverseVisible(function(j){j.isLight&&j.layers.test(k.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),A!==Q&&A.traverseVisible(function(j){j.isLight&&j.layers.test(k.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),w.setupLights(),N!==null&&N.updateLights(w.state.lightsArray),st=this.localClippingEnabled,q=Gt.init(this.clippingPlanes,st),q===!0&&Gt.setGlobalState(this.clippingPlanes,k),N!==null&&Zt.render(w.state.shadowsArray,Q,k);let J=new Set;return A.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;let Nt=j.material;if(Nt)if(Array.isArray(Nt))for(let kt=0;kt<Nt.length;kt++){let Ut=Nt[kt];Ef(Ut,Q,k,j),J.add(Ut)}else Ef(Nt,Q,k,j),J.add(Nt)}),w=x.pop(),N!==null&&N.renderEnd(),J},this.compileAsync=function(A,k,Q=null){let J=this.compile(A,k,Q);return new Promise(j=>{function Nt(){if(J.forEach(function(kt){let Vt=Z.get(kt).currentProgram;(Vt===void 0||Vt.isReady())&&J.delete(kt)}),J.size===0){j(A);return}setTimeout(Nt,10)}ee.get("KHR_parallel_shader_compile")!==null?Nt():setTimeout(Nt,10)})};let au=null;function cg(A){au&&au(A)}function Tf(){Ys.stop()}function Af(){Ys.start()}let Ys=new b0;Ys.setAnimationLoop(cg),typeof self<"u"&&Ys.setContext(self),this.setAnimationLoop=function(A){au=A,Xt.setAnimationLoop(A),A===null?Ys.stop():Ys.start()},Xt.addEventListener("sessionstart",Tf),Xt.addEventListener("sessionend",Af),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(A,k);let Q=Xt.enabled===!0&&Xt.isPresenting===!0,J=E!==null&&(et===null||Q)&&E.begin(C,et);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(k),k=Xt.getCamera()),A.isScene===!0&&A.onBeforeRender(C,A,k,et),w=Et.get(A,x.length),w.init(k),w.state.textureUnits=it.getTextureUnits(),x.push(w),V.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),L.setFromProjectionMatrix(V,Di,k.reversedDepth),st=this.localClippingEnabled,q=Gt.init(this.clippingPlanes,st),M=Tt.get(A,T.length),M.init(),T.push(M),Xt.enabled===!0&&Xt.isPresenting===!0){let kt=C.xr.getDepthSensingMesh();kt!==null&&lu(kt,k,-1/0,C.sortObjects)}lu(A,k,0,C.sortObjects),M.finish(),N!==null&&N.updateLights(w.state.lightsArray),C.sortObjects===!0&&M.sort(Y,lt),bt=Xt.enabled===!1||Xt.isPresenting===!1||Xt.hasDepthSensing()===!1,bt&&ne.addToRenderList(M,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),q===!0&&Gt.beginShadows();let j=w.state.shadowsArray;if(Zt.render(j,A,k),q===!0&&Gt.endShadows(),(J&&E.hasRenderPass())===!1){let kt=M.opaque,Ut=M.transmissive;if(w.setupLights(),k.isArrayCamera){let Vt=k.cameras;if(Ut.length>0)for(let Yt=0,le=Vt.length;Yt<le;Yt++){let fe=Vt[Yt];Cf(kt,Ut,A,fe)}bt&&ne.render(A);for(let Yt=0,le=Vt.length;Yt<le;Yt++){let fe=Vt[Yt];Rf(M,A,fe,fe.viewport)}}else Ut.length>0&&Cf(kt,Ut,A,k),bt&&ne.render(A),Rf(M,A,k)}et!==null&&$===0&&(it.updateMultisampleRenderTarget(et),it.updateRenderTargetMipmap(et)),J&&E.end(C),A.isScene===!0&&A.onAfterRender(C,A,k),Ft.resetDefaultState(),X=-1,tt=null,x.pop(),x.length>0?(w=x[x.length-1],it.setTextureUnits(w.state.textureUnits),q===!0&&Gt.setGlobalState(C.clippingPlanes,w.state.camera)):w=null,T.pop(),T.length>0?M=T[T.length-1]:M=null,N!==null&&N.renderEnd()};function lu(A,k,Q,J){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)Q=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLightProbeGrid)w.pushLightProbeGrid(A);else if(A.isLight)w.pushLight(A),A.castShadow&&w.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(L)){J&&ft.setFromMatrixPosition(A.matrixWorld).applyMatrix4(V);let kt=dt.update(A),Ut=A.material;Ut.visible&&M.push(A,kt,Ut,Q,ft.z,null,k)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(L))){let kt=dt.update(A),Ut=A.material;if(J&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ft.copy(A.boundingSphere.center)):(kt.boundingSphere===null&&kt.computeBoundingSphere(),ft.copy(kt.boundingSphere.center)),ft.applyMatrix4(A.matrixWorld).applyMatrix4(V)),Array.isArray(Ut)){let Vt=kt.groups;for(let Yt=0,le=Vt.length;Yt<le;Yt++){let fe=Vt[Yt],Wt=Ut[fe.materialIndex];Wt&&Wt.visible&&M.push(A,kt,Wt,Q,ft.z,fe,k)}}else Ut.visible&&M.push(A,kt,Ut,Q,ft.z,null,k)}}let Nt=A.children;for(let kt=0,Ut=Nt.length;kt<Ut;kt++)lu(Nt[kt],k,Q,J)}function Rf(A,k,Q,J){let{opaque:j,transmissive:Nt,transparent:kt}=A;w.setupLightsView(Q),q===!0&&Gt.setGlobalState(C.clippingPlanes,Q),J&&S.viewport(nt.copy(J)),j.length>0&&dl(j,k,Q),Nt.length>0&&dl(Nt,k,Q),kt.length>0&&dl(kt,k,Q),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function Cf(A,k,Q,J){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[J.id]===void 0){let Wt=ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[J.id]=new Ke(1,1,{generateMipmaps:!0,type:Wt?bn:On,minFilter:Bs,samples:Math.max(4,I.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ue.workingColorSpace})}let Nt=w.state.transmissionRenderTarget[J.id],kt=J.viewport||nt;Nt.setSize(kt.z*C.transmissionResolutionScale,kt.w*C.transmissionResolutionScale);let Ut=C.getRenderTarget(),Vt=C.getActiveCubeFace(),Yt=C.getActiveMipmapLevel();C.setRenderTarget(Nt),C.getClearColor(jt),$t=C.getClearAlpha(),$t<1&&C.setClearColor(16777215,.5),C.clear(),bt&&ne.render(Q);let le=C.toneMapping;C.toneMapping=Fi;let fe=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),w.setupLightsView(J),q===!0&&Gt.setGlobalState(C.clippingPlanes,J),dl(A,Q,J),it.updateMultisampleRenderTarget(Nt),it.updateRenderTargetMipmap(Nt),ee.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let Me=0,ln=k.length;Me<ln;Me++){let Ue=k[Me],{object:Ie,geometry:Un,material:Bt,group:Gn}=Ue;if(Bt.side===xi&&Ie.layers.test(J.layers)){let me=Bt.side;Bt.side=Te,Bt.needsUpdate=!0,If(Ie,Q,J,Un,Bt,Gn),Bt.side=me,Bt.needsUpdate=!0,Wt=!0}}Wt===!0&&(it.updateMultisampleRenderTarget(Nt),it.updateRenderTargetMipmap(Nt))}C.setRenderTarget(Ut,Vt,Yt),C.setClearColor(jt,$t),fe!==void 0&&(J.viewport=fe),C.toneMapping=le}function dl(A,k,Q){let J=k.isScene===!0?k.overrideMaterial:null;for(let j=0,Nt=A.length;j<Nt;j++){let kt=A[j],{object:Ut,geometry:Vt,group:Yt}=kt,le=kt.material;le.allowOverride===!0&&J!==null&&(le=J),Ut.layers.test(Q.layers)&&If(Ut,k,Q,Vt,le,Yt)}}function If(A,k,Q,J,j,Nt){N!==null&&j.isNodeMaterial&&N.setObject(A,j),A.onBeforeRender(C,k,Q,J,j,Nt),A.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),j.onBeforeRender(C,k,Q,J,A,Nt),j.transparent===!0&&j.side===xi&&j.forceSinglePass===!1?(j.side=Te,j.needsUpdate=!0,C.renderBufferDirect(Q,k,J,j,A,Nt),j.side=Fs,j.needsUpdate=!0,C.renderBufferDirect(Q,k,J,j,A,Nt),j.side=xi):C.renderBufferDirect(Q,k,J,j,A,Nt),A.onAfterRender(C,k,Q,J,j,Nt)}function fl(A,k,Q){k.isScene!==!0&&(k=ot);let J=Z.get(A),j=w.state.lights,Nt=w.state.shadowsArray,kt=j.state.version,Ut=Rt.getParameters(A,j.state,Nt,k,Q,w.state.lightProbeGridArray),Vt=Rt.getProgramCacheKey(Ut),Yt=J.programs;J.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?k.environment:null,J.fog=k.fog;let le=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;J.envMap=vt.get(A.envMap||J.environment,le),J.envMapRotation=J.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,Yt===void 0&&(A.addEventListener("dispose",ki),Yt=new Map,J.programs=Yt);let fe=Yt.get(Vt);if(fe!==void 0){if(J.currentProgram===fe&&J.lightsStateVersion===kt)return Lf(A,Ut),fe}else Ut.uniforms=Rt.getUniforms(A),N!==null&&A.isNodeMaterial&&N.build(A,Q,Ut),A.onBeforeCompile(Ut,C),fe=Rt.acquireProgram(Ut,Vt),Yt.set(Vt,fe),J.uniforms=Ut.uniforms;let Wt=J.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Wt.clippingPlanes=Gt.uniform),Lf(A,Ut),J.needsLights=fg(A),J.lightsStateVersion=kt,J.needsLights&&(Wt.ambientLightColor.value=j.state.ambient,Wt.lightProbe.value=j.state.probe,Wt.sunLights.value=j.state.sun,Wt.sunLightShadows.value=j.state.sunShadow,Wt.directionalLights.value=j.state.directional,Wt.directionalLightShadows.value=j.state.directionalShadow,Wt.spotLights.value=j.state.spot,Wt.spotLightShadows.value=j.state.spotShadow,Wt.rectAreaLights.value=j.state.rectArea,Wt.ltc_1.value=j.state.rectAreaLTC1,Wt.ltc_2.value=j.state.rectAreaLTC2,Wt.pointLights.value=j.state.point,Wt.pointLightShadows.value=j.state.pointShadow,Wt.hemisphereLights.value=j.state.hemi,Wt.sunShadowMatrix.value=j.state.sunShadowMatrix,Wt.sunShadowCascade.value=j.state.sunShadowCascade,Wt.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Wt.spotLightMatrix.value=j.state.spotLightMatrix,Wt.spotLightMap.value=j.state.spotLightMap,Wt.pointShadowMatrix.value=j.state.pointShadowMatrix),J.lightProbeGrid=w.state.lightProbeGridArray.length>0,J.currentProgram=fe,J.uniformsList=null,fe}function Pf(A){if(A.uniformsList===null){let k=A.currentProgram.getUniforms();A.uniformsList=lo.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function Lf(A,k){let Q=Z.get(A);Q.outputColorSpace=k.outputColorSpace,Q.batching=k.batching,Q.batchingColor=k.batchingColor,Q.instancing=k.instancing,Q.instancingColor=k.instancingColor,Q.instancingMorph=k.instancingMorph,Q.skinning=k.skinning,Q.morphTargets=k.morphTargets,Q.morphNormals=k.morphNormals,Q.morphColors=k.morphColors,Q.morphTargetsCount=k.morphTargetsCount,Q.numClippingPlanes=k.numClippingPlanes,Q.numIntersection=k.numClipIntersection,Q.vertexAlphas=k.vertexAlphas,Q.vertexTangents=k.vertexTangents,Q.toneMapping=k.toneMapping}function hg(A,k){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;y.setFromMatrixPosition(k.matrixWorld);for(let Q=0,J=A.length;Q<J;Q++){let j=A[Q];if(j.texture!==null&&j.boundingBox.containsPoint(y))return j}return null}function ug(A,k,Q,J,j){k.isScene!==!0&&(k=ot),it.resetTextureUnits();let Nt=k.fog,kt=J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial?k.environment:null,Ut=et===null?C.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ue.workingColorSpace,Vt=J.isMeshStandardMaterial||J.isMeshLambertMaterial&&!J.envMap||J.isMeshPhongMaterial&&!J.envMap,Yt=vt.get(J.envMap||kt,Vt),le=J.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,fe=!!Q.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Wt=!!Q.morphAttributes.position,Me=!!Q.morphAttributes.normal,ln=!!Q.morphAttributes.color,Ue=Fi;J.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ue=C.toneMapping);let Ie=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Un=Ie!==void 0?Ie.length:0,Bt=Z.get(J),Gn=w.state.lights;if(q===!0&&(st===!0||A!==tt)){let Le=A===tt&&J.id===X;Gt.setState(J,A,Le)}let me=!1;J.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Gn.state.version||Bt.outputColorSpace!==Ut||j.isBatchedMesh&&Bt.batching===!1||!j.isBatchedMesh&&Bt.batching===!0||j.isBatchedMesh&&Bt.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&Bt.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&Bt.instancing===!1||!j.isInstancedMesh&&Bt.instancing===!0||j.isSkinnedMesh&&Bt.skinning===!1||!j.isSkinnedMesh&&Bt.skinning===!0||j.isInstancedMesh&&Bt.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Bt.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Bt.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Bt.instancingMorph===!1&&j.morphTexture!==null||Bt.envMap!==Yt||J.fog===!0&&Bt.fog!==Nt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==Gt.numPlanes||Bt.numIntersection!==Gt.numIntersection)||Bt.vertexAlphas!==le||Bt.vertexTangents!==fe||Bt.morphTargets!==Wt||Bt.morphNormals!==Me||Bt.morphColors!==ln||Bt.toneMapping!==Ue||Bt.morphTargetsCount!==Un||!!Bt.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(me=!0):(me=!0,Bt.__version=J.version);let ui=Bt.currentProgram;me===!0&&(ui=fl(J,k,j),N&&J.isNodeMaterial&&N.onUpdateProgram(J,ui,Bt));let Hi=!1,Ms=!1,Mr=!1,Ae=ui.getUniforms(),Je=Bt.uniforms;if(S.useProgram(ui.program)&&(Hi=!0,Ms=!0,Mr=!0),J.id!==X&&(X=J.id,Ms=!0),Bt.needsLights){let Le=hg(w.state.lightProbeGridArray,j);Bt.lightProbeGrid!==Le&&(Bt.lightProbeGrid=Le,Ms=!0)}if(Hi||tt!==A){S.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Ae.setValue(B,"projectionMatrix",A.projectionMatrix),Ae.setValue(B,"viewMatrix",A.matrixWorldInverse);let ws=Ae.map.cameraPosition;ws!==void 0&&ws.setValue(B,rt.setFromMatrixPosition(A.matrixWorld)),I.logarithmicDepthBuffer&&Ae.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&Ae.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),tt!==A&&(tt=A,Ms=!0,Mr=!0)}if(Bt.needsLights&&(Gn.state.sunShadowMap.length>0&&Ae.setValue(B,"sunShadowMap",Gn.state.sunShadowMap,it),Gn.state.directionalShadowMap.length>0&&Ae.setValue(B,"directionalShadowMap",Gn.state.directionalShadowMap,it),Gn.state.spotShadowMap.length>0&&Ae.setValue(B,"spotShadowMap",Gn.state.spotShadowMap,it),Gn.state.pointShadowMap.length>0&&Ae.setValue(B,"pointShadowMap",Gn.state.pointShadowMap,it)),j.isSkinnedMesh){Ae.setOptional(B,j,"bindMatrix"),Ae.setOptional(B,j,"bindMatrixInverse");let Le=j.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),Ae.setValue(B,"boneTexture",Le.boneTexture,it))}j.isBatchedMesh&&(Ae.setOptional(B,j,"batchingTexture"),Ae.setValue(B,"batchingTexture",j._matricesTexture,it),Ae.setOptional(B,j,"batchingIdTexture"),Ae.setValue(B,"batchingIdTexture",j._indirectTexture,it),Ae.setOptional(B,j,"batchingColorTexture"),j._colorsTexture!==null&&Ae.setValue(B,"batchingColorTexture",j._colorsTexture,it));let Ss=Q.morphAttributes;if((Ss.position!==void 0||Ss.normal!==void 0||Ss.color!==void 0)&&H.update(j,Q,ui),(Ms||Bt.receiveShadow!==j.receiveShadow)&&(Bt.receiveShadow=j.receiveShadow,Ae.setValue(B,"receiveShadow",j.receiveShadow)),(J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial)&&J.envMap===null&&k.environment!==null&&(Je.envMapIntensity.value=k.environmentIntensity),Je.dfgLUT!==void 0&&(Je.dfgLUT.value=L2()),Ms){if(Ae.setValue(B,"toneMappingExposure",C.toneMappingExposure),Bt.needsLights&&dg(Je,Mr),Nt&&J.fog===!0&&qt.refreshFogUniforms(Je,Nt),qt.refreshMaterialUniforms(Je,J,R,K,w.state.transmissionRenderTarget[A.id]),Bt.needsLights&&Bt.lightProbeGrid){let Le=Bt.lightProbeGrid;Je.probesSH.value=Le.texture,Je.probesMin.value.copy(Le.boundingBox.min),Je.probesMax.value.copy(Le.boundingBox.max),Je.probesResolution.value.copy(Le.resolution)}lo.upload(B,Pf(Bt),Je,it)}if(J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(lo.upload(B,Pf(Bt),Je,it),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&Ae.setValue(B,"center",j.center),Ae.setValue(B,"modelViewMatrix",j.modelViewMatrix),Ae.setValue(B,"normalMatrix",j.normalMatrix),Ae.setValue(B,"modelMatrix",j.matrixWorld),J.uniformsGroups!==void 0){let Le=J.uniformsGroups;for(let ws=0,Sr=Le.length;ws<Sr;ws++){let Uf=Le[ws];mt.update(Uf,ui),mt.bind(Uf,ui)}}return ui}function dg(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.sunLights.needsUpdate=k,A.sunLightShadows.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function fg(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(A,k,Q){let J=Z.get(A);J.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),Z.get(A.texture).__webglTexture=k,Z.get(A.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:Q,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,k){let Q=Z.get(A);Q.__webglFramebuffer=k,Q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,Q=0){et=A,G=k,$=Q;let J=null,j=!1,Nt=!1;if(A){let Ut=Z.get(A);if(Ut.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(B.FRAMEBUFFER,Ut.__webglFramebuffer),nt.copy(A.viewport),St.copy(A.scissor),yt=A.scissorTest,S.viewport(nt),S.scissor(St),S.setScissorTest(yt),X=-1;return}else if(Ut.__webglFramebuffer===void 0)it.setupRenderTarget(A);else if(Ut.__hasExternalTextures)it.rebindTextures(A,Z.get(A.texture).__webglTexture,Z.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let le=A.depthTexture;if(Ut.__boundDepthTexture!==le){if(le!==null&&Z.has(le)&&(A.width!==le.image.width||A.height!==le.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");it.setupDepthRenderbuffer(A)}}let Vt=A.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(Nt=!0);let Yt=Z.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Yt[k])?J=Yt[k][Q]:J=Yt[k],j=!0):A.samples>0&&it.useMultisampledRTT(A)===!1?J=Z.get(A).__webglMultisampledFramebuffer:Array.isArray(Yt)?J=Yt[Q]:J=Yt,nt.copy(A.viewport),St.copy(A.scissor),yt=A.scissorTest}else nt.copy(ht).multiplyScalar(R).floor(),St.copy(_t).multiplyScalar(R).floor(),yt=Pt;if(Q!==0&&(J=F),S.bindFramebuffer(B.FRAMEBUFFER,J)&&S.drawBuffers(A,J),S.viewport(nt),S.scissor(St),S.setScissorTest(yt),j){let Ut=Z.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ut.__webglTexture,Q)}else if(Nt){let Ut=k;for(let Vt=0;Vt<A.textures.length;Vt++){let Yt=Z.get(A.textures[Vt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Vt,Yt.__webglTexture,Q,Ut)}}else if(A!==null&&Q!==0){let Ut=Z.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ut.__webglTexture,Q)}X=-1};function Df(A){let k=Z.get(A);return(k.__readFormat!==A.format||k.__readType!==A.type)&&(k.__readFormat=A.format,k.__readType=A.type,k.__formatReadable=I.textureFormatReadable(A.format),k.__typeReadable=I.textureTypeReadable(A.type)),k}this.readRenderTargetPixels=function(A,k,Q,J,j,Nt,kt,Ut=0){if(!(A&&A.isWebGLRenderTarget)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Vt=Z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&kt!==void 0&&(Vt=Vt[kt]),Vt){S.bindFramebuffer(B.FRAMEBUFFER,Vt);try{let Yt=A.textures[Ut],le=Yt.format,fe=Yt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Ut);let Wt=Df(Yt);if(Wt.__formatReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Wt.__typeReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-J&&Q>=0&&Q<=A.height-j&&B.readPixels(k,Q,J,j,It.convert(le),It.convert(fe),Nt)}finally{let Yt=et!==null?Z.get(et).__webglFramebuffer:null;S.bindFramebuffer(B.FRAMEBUFFER,Yt)}}},this.readRenderTargetPixelsAsync=async function(A,k,Q,J,j,Nt,kt,Ut=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Vt=Z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&kt!==void 0&&(Vt=Vt[kt]),Vt)if(k>=0&&k<=A.width-J&&Q>=0&&Q<=A.height-j){S.bindFramebuffer(B.FRAMEBUFFER,Vt);let Yt=A.textures[Ut],le=Yt.format,fe=Yt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Ut);let Wt=Df(Yt);if(Wt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Wt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Me=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Me),B.bufferData(B.PIXEL_PACK_BUFFER,Nt.byteLength,B.STREAM_READ),B.readPixels(k,Q,J,j,It.convert(le),It.convert(fe),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let ln=et!==null?Z.get(et).__webglFramebuffer:null;S.bindFramebuffer(B.FRAMEBUFFER,ln);let Ue=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Xp(B,Ue,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Me),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Nt),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(Me),B.deleteSync(Ue),Nt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,k=null,Q=0){let J=Math.pow(2,-Q),j=Math.floor(A.image.width*J),Nt=Math.floor(A.image.height*J),kt=k!==null?k.x:0,Ut=k!==null?k.y:0;it.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,Q,0,0,kt,Ut,j,Nt),S.unbindTexture()},this.copyTextureToTexture=function(A,k,Q=null,J=null,j=0,Nt=0){let kt,Ut,Vt,Yt,le,fe,Wt,Me,ln,Ue=A.isCompressedTexture?A.mipmaps[Nt]:A.image;if(Q!==null)kt=Q.max.x-Q.min.x,Ut=Q.max.y-Q.min.y,Vt=Q.isBox3?Q.max.z-Q.min.z:1,Yt=Q.min.x,le=Q.min.y,fe=Q.isBox3?Q.min.z:0;else{let Je=Math.pow(2,-j);kt=Math.floor(Ue.width*Je),Ut=Math.floor(Ue.height*Je),A.isDataArrayTexture?Vt=Ue.depth:A.isData3DTexture?Vt=Math.floor(Ue.depth*Je):Vt=1,Yt=0,le=0,fe=0}J!==null?(Wt=J.x,Me=J.y,ln=J.z):(Wt=0,Me=0,ln=0);let Ie=It.convert(k.format),Un=It.convert(k.type),Bt;k.isData3DTexture?(it.setTexture3D(k,0),Bt=B.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(it.setTexture2DArray(k,0),Bt=B.TEXTURE_2D_ARRAY):(it.setTexture2D(k,0),Bt=B.TEXTURE_2D),S.activeTexture(B.TEXTURE0),S.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,k.flipY),S.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),S.pixelStorei(B.UNPACK_ALIGNMENT,k.unpackAlignment);let Gn=S.getParameter(B.UNPACK_ROW_LENGTH),me=S.getParameter(B.UNPACK_IMAGE_HEIGHT),ui=S.getParameter(B.UNPACK_SKIP_PIXELS),Hi=S.getParameter(B.UNPACK_SKIP_ROWS),Ms=S.getParameter(B.UNPACK_SKIP_IMAGES);S.pixelStorei(B.UNPACK_ROW_LENGTH,Ue.width),S.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ue.height),S.pixelStorei(B.UNPACK_SKIP_PIXELS,Yt),S.pixelStorei(B.UNPACK_SKIP_ROWS,le),S.pixelStorei(B.UNPACK_SKIP_IMAGES,fe);let Mr=A.isDataArrayTexture||A.isData3DTexture,Ae=k.isDataArrayTexture||k.isData3DTexture;if(A.isDepthTexture){let Je=Z.get(A),Ss=Z.get(k),Le=Z.get(Je.__renderTarget),ws=Z.get(Ss.__renderTarget);S.bindFramebuffer(B.READ_FRAMEBUFFER,Le.__webglFramebuffer),S.bindFramebuffer(B.DRAW_FRAMEBUFFER,ws.__webglFramebuffer);for(let Sr=0;Sr<Vt;Sr++)Mr&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Z.get(A).__webglTexture,j,fe+Sr),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Z.get(k).__webglTexture,Nt,ln+Sr)),B.blitFramebuffer(Yt,le,kt,Ut,Wt,Me,kt,Ut,B.DEPTH_BUFFER_BIT,B.NEAREST);S.bindFramebuffer(B.READ_FRAMEBUFFER,null),S.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(j!==0||A.isRenderTargetTexture||Z.has(A)){let Je=Z.get(A),Ss=Z.get(k);S.bindFramebuffer(B.READ_FRAMEBUFFER,P),S.bindFramebuffer(B.DRAW_FRAMEBUFFER,z);for(let Le=0;Le<Vt;Le++)Mr?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Je.__webglTexture,j,fe+Le):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Je.__webglTexture,j),Ae?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ss.__webglTexture,Nt,ln+Le):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ss.__webglTexture,Nt),j!==0?B.blitFramebuffer(Yt,le,kt,Ut,Wt,Me,kt,Ut,B.COLOR_BUFFER_BIT,B.NEAREST):Ae?B.copyTexSubImage3D(Bt,Nt,Wt,Me,ln+Le,Yt,le,kt,Ut):B.copyTexSubImage2D(Bt,Nt,Wt,Me,Yt,le,kt,Ut);S.bindFramebuffer(B.READ_FRAMEBUFFER,null),S.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Ae?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(Bt,Nt,Wt,Me,ln,kt,Ut,Vt,Ie,Un,Ue.data):k.isCompressedArrayTexture?B.compressedTexSubImage3D(Bt,Nt,Wt,Me,ln,kt,Ut,Vt,Ie,Ue.data):B.texSubImage3D(Bt,Nt,Wt,Me,ln,kt,Ut,Vt,Ie,Un,Ue):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,Nt,Wt,Me,kt,Ut,Ie,Un,Ue.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,Nt,Wt,Me,Ue.width,Ue.height,Ie,Ue.data):B.texSubImage2D(B.TEXTURE_2D,Nt,Wt,Me,kt,Ut,Ie,Un,Ue);S.pixelStorei(B.UNPACK_ROW_LENGTH,Gn),S.pixelStorei(B.UNPACK_IMAGE_HEIGHT,me),S.pixelStorei(B.UNPACK_SKIP_PIXELS,ui),S.pixelStorei(B.UNPACK_SKIP_ROWS,Hi),S.pixelStorei(B.UNPACK_SKIP_IMAGES,Ms),Nt===0&&k.generateMipmaps&&B.generateMipmap(Bt),S.unbindTexture()},this.initRenderTarget=function(A){Z.get(A).__webglFramebuffer===void 0&&it.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?it.setTextureCube(A,0):A.isData3DTexture?it.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?it.setTexture2DArray(A,0):it.setTexture2D(A,0),S.unbindTexture()},this.resetState=function(){G=0,$=0,et=null,S.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ue._getDrawingBufferColorSpace(t),e.unpackColorSpace=ue._getUnpackColorSpace()}};var Ba=new U;function bi(n,t,e,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Ba.copy(t),Ba[i]=0,Ba.normalize();let c=.5*o/(o+a),h=1-Ba.angleTo(n)/l;return Math.sign(Ba[e])===1?h*c:a/(o+a)+c+c*(1-h)}var mh=class n extends Ye{constructor(t=1,e=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new U,c=new U,h=new U(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,v=new U,g=.5/o;for(let m=0,_=0;m<u.length;m+=3,_+=2)switch(l.fromArray(u,m),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),u[m+0]=h.x*Math.sign(l.x)+c.x*r,u[m+1]=h.y*Math.sign(l.y)+c.y*r,u[m+2]=h.z*Math.sign(l.z)+c.z*r,d[m+0]=c.x,d[m+1]=c.y,d[m+2]=c.z,Math.floor(m/p)){case 0:v.set(1,0,0),f[_+0]=bi(v,c,"z","y",r,i),f[_+1]=1-bi(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[_+0]=1-bi(v,c,"z","y",r,i),f[_+1]=1-bi(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[_+0]=1-bi(v,c,"x","z",r,t),f[_+1]=bi(v,c,"z","x",r,i);break;case 3:v.set(0,-1,0),f[_+0]=1-bi(v,c,"x","z",r,t),f[_+1]=1-bi(v,c,"z","x",r,i);break;case 4:v.set(0,0,1),f[_+0]=1-bi(v,c,"x","y",r,t),f[_+1]=1-bi(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[_+0]=bi(v,c,"x","y",r,t),f[_+1]=1-bi(v,c,"y","x",r,e);break}}static fromJSON(t){return new n(t.width,t.height,t.depth,t.segments,t.radius)}};var fo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var ai=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},D2=new Us(-1,1,1,-1,0,1),Id=class extends ge{constructor(){super(),this.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qt([0,2,0,0,2,0],2))}},U2=new Id,Hs=class{constructor(t){this._mesh=new zt(U2,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,D2)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var gh=class extends ai{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof De?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=$n.clone(t.uniforms),this.material=new De({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Hs(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var za=class extends ai{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},xh=class extends ai{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var vh=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let i=t.getSize(new ct);this._width=i.width,this._height=i.height,e=new Ke(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:bn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new gh(fo),this.copyPass.material.blending=nn,this.timer=new xa}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),o.needsSwap){if(i){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}za!==void 0&&(o instanceof za?i=!0:o instanceof xh&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ka={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ct},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Dt},cameraProjectionMatrixInverse:{value:new Dt},cameraWorldMatrix:{value:new Dt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new U(-1,-1,-1)},sceneBoxMax:{value:new U(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Ha={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},yh={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function R0(n=5){let t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=N2(t),i=e.length,s=new Uint8Array(i*4);for(let o=0;o<i;++o){let a=e[o],l=2*Math.PI*a/i,c=new U(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new ps(s,t,t);return r.wrapS=fi,r.wrapT=fi,r.needsUpdate=!0,r}function N2(n){let t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=t*t,i=Array(e).fill(0),s=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(s===-1&&r===t?(r=t-2,s=0):(r===t&&(r=0),s<0&&(s=t-1)),i[s*t+r]!==0){r-=2,s++;continue}else i[s*t+r]=o++;r++,s--}return i}var Ga={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Pd(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ct},cameraProjectionMatrixInverse:{value:new Dt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Pd(n,t,e){let i=F2(n,t,e),s="vec3[SAMPLES](";for(let r=0;r<n;r++){let o=i[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<n-1?",":")"}`}return s}function F2(n,t,e){let i=[];for(let s=0;s<n;s++){let r=2*Math.PI*t*s/n,o=Math.pow(s/(n-1),e);i.push(new U(Math.cos(r),Math.sin(r),o))}return i}var _h=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,p=t-d,v=e-f,g,m;p>v?(g=1,m=0):(g=0,m=1);let _=p-g+h,b=v-m+h,y=p-1+2*h,M=v-1+2*h,w=l&255,T=c&255,x=this.perm[w+this.perm[T]]%12,E=this.perm[w+g+this.perm[T+m]]%12,C=this.perm[w+1+this.perm[T+1]]%12,D=.5-p*p-v*v;D<0?i=0:(D*=D,i=D*D*this._dot(this.grad3[x],p,v));let N=.5-_*_-b*b;N<0?s=0:(N*=N,s=N*N*this._dot(this.grad3[E],_,b));let F=.5-y*y-M*M;return F<0?r=0:(F*=F,r=F*F*this._dot(this.grad3[C],y,M)),70*(i+s+r)}noise3d(t,e,i){let s,r,o,a,c=(t+e+i)*.3333333333333333,h=Math.floor(t+c),u=Math.floor(e+c),d=Math.floor(i+c),f=1/6,p=(h+u+d)*f,v=h-p,g=u-p,m=d-p,_=t-v,b=e-g,y=i-m,M,w,T,x,E,C;_>=b?b>=y?(M=1,w=0,T=0,x=1,E=1,C=0):_>=y?(M=1,w=0,T=0,x=1,E=0,C=1):(M=0,w=0,T=1,x=1,E=0,C=1):b<y?(M=0,w=0,T=1,x=0,E=1,C=1):_<y?(M=0,w=1,T=0,x=0,E=1,C=1):(M=0,w=1,T=0,x=1,E=1,C=0);let D=_-M+f,N=b-w+f,F=y-T+f,P=_-x+2*f,z=b-E+2*f,G=y-C+2*f,$=_-1+3*f,et=b-1+3*f,X=y-1+3*f,tt=h&255,nt=u&255,St=d&255,yt=this.perm[tt+this.perm[nt+this.perm[St]]]%12,jt=this.perm[tt+M+this.perm[nt+w+this.perm[St+T]]]%12,$t=this.perm[tt+x+this.perm[nt+E+this.perm[St+C]]]%12,xt=this.perm[tt+1+this.perm[nt+1+this.perm[St+1]]]%12,K=.6-_*_-b*b-y*y;K<0?s=0:(K*=K,s=K*K*this._dot3(this.grad3[yt],_,b,y));let R=.6-D*D-N*N-F*F;R<0?r=0:(R*=R,r=R*R*this._dot3(this.grad3[jt],D,N,F));let Y=.6-P*P-z*z-G*G;Y<0?o=0:(Y*=Y,o=Y*Y*this._dot3(this.grad3[$t],P,z,G));let lt=.6-$*$-et*et-X*X;return lt<0?a=0:(lt*=lt,a=lt*lt*this._dot3(this.grad3[xt],$,et,X)),32*(s+r+o+a)}noise4d(t,e,i,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,d,f,p,v=(t+e+i+s)*l,g=Math.floor(t+v),m=Math.floor(e+v),_=Math.floor(i+v),b=Math.floor(s+v),y=(g+m+_+b)*c,M=g-y,w=m-y,T=_-y,x=b-y,E=t-M,C=e-w,D=i-T,N=s-x,F=E>C?32:0,P=E>D?16:0,z=C>D?8:0,G=E>N?4:0,$=C>N?2:0,et=D>N?1:0,X=F+P+z+G+$+et,tt=o[X][0]>=3?1:0,nt=o[X][1]>=3?1:0,St=o[X][2]>=3?1:0,yt=o[X][3]>=3?1:0,jt=o[X][0]>=2?1:0,$t=o[X][1]>=2?1:0,xt=o[X][2]>=2?1:0,K=o[X][3]>=2?1:0,R=o[X][0]>=1?1:0,Y=o[X][1]>=1?1:0,lt=o[X][2]>=1?1:0,ht=o[X][3]>=1?1:0,_t=E-tt+c,Pt=C-nt+c,L=D-St+c,q=N-yt+c,st=E-jt+2*c,V=C-$t+2*c,rt=D-xt+2*c,ft=N-K+2*c,ot=E-R+3*c,bt=C-Y+3*c,Mt=D-lt+3*c,B=N-ht+3*c,ae=E-1+4*c,ee=C-1+4*c,I=D-1+4*c,S=N-1+4*c,W=g&255,Z=m&255,it=_&255,vt=b&255,wt=a[W+a[Z+a[it+a[vt]]]]%32,at=a[W+tt+a[Z+nt+a[it+St+a[vt+yt]]]]%32,dt=a[W+jt+a[Z+$t+a[it+xt+a[vt+K]]]]%32,Rt=a[W+R+a[Z+Y+a[it+lt+a[vt+ht]]]]%32,qt=a[W+1+a[Z+1+a[it+1+a[vt+1]]]]%32,Tt=.6-E*E-C*C-D*D-N*N;Tt<0?h=0:(Tt*=Tt,h=Tt*Tt*this._dot4(r[wt],E,C,D,N));let Et=.6-_t*_t-Pt*Pt-L*L-q*q;Et<0?u=0:(Et*=Et,u=Et*Et*this._dot4(r[at],_t,Pt,L,q));let Gt=.6-st*st-V*V-rt*rt-ft*ft;Gt<0?d=0:(Gt*=Gt,d=Gt*Gt*this._dot4(r[dt],st,V,rt,ft));let Zt=.6-ot*ot-bt*bt-Mt*Mt-B*B;Zt<0?f=0:(Zt*=Zt,f=Zt*Zt*this._dot4(r[Rt],ot,bt,Mt,B));let ne=.6-ae*ae-ee*ee-I*I-S*S;return ne<0?p=0:(ne*=ne,p=ne*ne*this._dot4(r[qt],ae,ee,I,S)),27*(h+u+d+f+p)}_dot(t,e,i){return t[0]*e+t[1]*i}_dot3(t,e,i,s){return t[0]*e+t[1]*i+t[2]*s}_dot4(t,e,i,s,r){return t[0]*e+t[1]*i+t[2]*s+t[3]*r}};var Va=class n extends ai{constructor(t,e,i=512,s=512,r,o,a){super(),this.width=i,this.height=s,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=R0(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Ke(this.width,this.height,{type:bn,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new De({defines:Object.assign({},ka.defines),uniforms:$n.clone(ka.uniforms),vertexShader:ka.vertexShader,fragmentShader:ka.fragmentShader,blending:nn,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ha,this.normalMaterial.blending=nn,this.pdMaterial=new De({defines:Object.assign({},Ga.defines),uniforms:$n.clone(Ga.uniforms),vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new De({defines:Object.assign({},Ha.defines),uniforms:$n.clone(Ha.uniforms),vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader,blending:nn}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new De({uniforms:$n.clone(fo.uniforms),vertexShader:fo.vertexShader,fragmentShader:fo.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:ba,blendDst:or,blendEquation:vi,blendSrcAlpha:_a,blendDstAlpha:or,blendEquationAlpha:vi}),this.blendMaterial=new De({uniforms:$n.clone(yh.uniforms),vertexShader:yh.vertexShader,fragmentShader:yh.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:_c,blendSrc:ba,blendDst:or,blendEquation:vi,blendSrcAlpha:_a,blendDstAlpha:or,blendEquationAlpha:vi}),this._fsQuad=new Hs(null),this._originalClearColor=new Ot,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new Yi,this.depthTexture.format=Zi,this.depthTexture.type=zs,this.normalRenderTarget=new Ke(this.width,this.height,{minFilter:je,magFilter:je,type:bn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let i=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Pd(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case n.OUTPUT.Off:break;case n.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=nn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=nn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=nn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=nn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=nn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,i,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,i,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,e.push(i))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new _h,i=t*t*4,s=new Uint8Array(i);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let l=o,c=a;s[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,s[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,s[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,s[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}let r=new ps(s,t,t,jn,On);return r.wrapS=fi,r.wrapT=fi,r.needsUpdate=!0,r}};Va.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Wa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var bh=class extends ai{constructor(){super(),this.isOutputPass=!0,this.uniforms=$n.clone(Wa.uniforms),this.material=new Qr({name:Wa.name,uniforms:this.uniforms,vertexShader:Wa.vertexShader,fragmentShader:Wa.fragmentShader}),this._fsQuad=new Hs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ue.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ma?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Sa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ar?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ta?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ms?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ea&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Mh=class extends ai{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ot}render(t,e,i){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var Sh=class extends fs{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new Ye;t.deleteAttribute("uv");let e=new Oe({side:Te}),i=new Oe,s=new ma(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new zt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new _n(t,i,6),a=new Qe;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new zt(t,po(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new zt(t,po(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new zt(t,po(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new zt(t,po(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new zt(t,po(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new zt(t,po(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function po(n){return new ua({color:0,emissive:16777215,emissiveIntensity:n})}function C0(n,{bg:t="#e6eaf4",fov:e=22}={}){let i=new ho({canvas:n,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});i.outputColorSpace=Fe,i.toneMapping=ar,i.toneMappingExposure=1.02,i.shadowMap.enabled=!0,i.shadowMap.type=rr;let s=new fs;s.background=new Ot(t),s.fog=new Yo(t,520,900);let r=new co(i);s.environment=r.fromScene(new Sh,.03).texture,s.environmentIntensity=.38;let o=new mn(e,16/9,5,2e3);s.add(new ir("#eef2ff","#b9c0cf",.7));let a=new sr("#fff4e6",3.6);a.castShadow=!0,a.shadow.mapSize.set(4096,4096),a.shadow.bias=-4e-4,a.shadow.normalBias=.6,a.shadow.radius=4;let l=a.shadow.camera;l.left=-230,l.right=230,l.top=230,l.bottom=-230,l.near=10,l.far=900,l.updateProjectionMatrix(),s.add(a,a.target);let c=new U(-.78,1,-.36).normalize(),h=new vh(i,new Ke(1,1,{type:bn,samples:4}));h.addPass(new Mh(s,o));let u=new Va(s,o,1,1);u.updateGtaoMaterial({radius:6,distanceExponent:1.4,thickness:3,scale:1.1,samples:16}),u.blendIntensity=.85,h.addPass(u),h.addPass(new bh);let d={w:1600,h:900,pr:1},f=(m,_,b)=>{Object.assign(d,{w:m,h:_,pr:b}),i.setPixelRatio(b),i.setSize(m,_,!1),h.setPixelRatio(b),h.setSize(m,_),o.aspect=m/_,o.updateProjectionMatrix()},p=m=>{let{tx:_,ty:b,tz:y,az:M,el:w,d:T}=m;o.position.set(_+T*Math.cos(w)*Math.sin(M),b+T*Math.sin(w),y+T*Math.cos(w)*Math.cos(M)),o.lookAt(_,b,y),m.fov&&m.fov!==o.fov&&(o.fov=m.fov,o.updateProjectionMatrix()),o.setViewOffset(d.w,d.h,-(m.sx??0),-(m.sy??0),d.w,d.h),o.updateMatrixWorld(),a.target.position.set(_,0,y),a.position.copy(a.target.position).addScaledVector(c,420),a.target.updateMatrixWorld(),h.render()},v=new U;return{renderer:i,scene:s,camera:o,composer:h,gtao:u,sun:a,resize:f,frame:p,project:m=>(v.copy(m).project(o),v.z>1?null:[(v.x*.5+.5)*d.w,(-v.y*.5+.5)*d.h]),size:d}}var pt={bg:"#dfe6fa",ground:"#d5def7",groundDeep:"#c3cff3",road:"#e6eaf8",lane:"#ffffff",bay:"#f2b33a",blue:"#3166ea",roof:"#4a85f0",blueDeep:"#2448c8",blueLight:"#8fb0f7",wall:"#7fa6f2",white:"#f6f8fd",panel:"#e9edf8",shade:"#c9d1ea",navy:"#1a2440",glass:"#22304f",yellow:"#f2b33a",teal:"#21b3a3",orange:"#ff8a3d",green:"#7fdaa0",greenDeep:"#4fbf7d",trunk:"#b08a6a",red:"#e5484d",cardboard:"#e3b07a"},Ld=new Map;function gt(n,{rough:t=.55,metal:e=0,paint:i=!1,emissive:s=null,opacity:r=1}={}){let o=[n,t,e,i,s,r].join("|");if(Ld.has(o))return Ld.get(o);let a=i?new to({color:n,roughness:t,metalness:e,clearcoat:.35,clearcoatRoughness:.35}):new Oe({color:n,roughness:t,metalness:e});return s&&(a.emissive=new Ot(s),a.emissiveIntensity=1),r<1&&(a.transparent=!0,a.opacity=r,a.depthWrite=!1),Ld.set(o,a),a}var Dd=new Map;function Be(n,t,e,i=Math.min(n,t,e)*.12,s=3){let r=[n,t,e,i,s].map(o=>+o.toFixed(3)).join("|");return Dd.has(r)||Dd.set(r,new mh(n,t,e,s,Math.min(i,Math.min(n,t,e)/2-.001))),Dd.get(r)}function I0(n,{fov:t=28}={}){let e=C0(n,{bg:pt.bg,fov:t});return e.scene.fog.near=700,e.scene.fog.far=1400,e.renderer.toneMapping=ms,e.renderer.toneMappingExposure=.93,e.scene.traverse(i=>{i.isHemisphereLight&&(i.color.set("#f3f6ff"),i.groundColor.set("#c7d0ee"),i.intensity=1)}),e.sun.intensity=2.2,e.sun.color.set("#ffffff"),e.sun.shadow.radius=6,e.gtao.blendIntensity=.75,e}var P0="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/><text x="44" y="56" font-family="Inter,system-ui,sans-serif" font-size="32" font-weight="800" fill="#fff" text-anchor="middle">OP</text></svg>');var li="#3166ea",O2=`
.wt{position:absolute;inset:0;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#0f1730;font-feature-settings:"tnum"}
.wt *{box-sizing:border-box}
.wt .bar{position:absolute;left:0;right:0;top:0;height:74px;background:rgba(255,255,255,.94);border-bottom:1px solid #e4e8f3;display:flex;align-items:center;padding:0 28px;gap:16px}
.wt .logo{display:flex;align-items:center;gap:12px;font-weight:800;font-size:21px;letter-spacing:-.02em;width:260px}
.wt .search{width:450px;height:44px;border:1px solid #dfe4ef;border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 14px;color:#7b849b;font-size:14.5px;background:#fff}
.wt .search .k{margin-left:auto;border:1px solid #d9deea;border-radius:6px;font-size:11px;padding:1px 6px;color:#8b93a6}
.wt .sw{margin-left:auto;display:flex;align-items:stretch;height:48px;border:1px solid #dfe4ef;border-radius:12px;background:#fff;overflow:hidden}
.wt .sw .main{display:flex;align-items:center;gap:10px;padding:0 12px 0 7px;font-size:14px;font-weight:700;width:262px}
.wt .sw .main small{display:block;font-size:12px;font-weight:500;color:#6f7891;margin-top:1px}
.wt .sw .chip{min-width:42px;padding:0 6px;white-space:nowrap;height:34px;border-radius:8px;background:${li};color:#fff;font-size:12px;font-weight:800;display:grid;place-items:center;box-shadow:inset 0 -2px 0 rgba(0,0,0,.12)}
.wt .sw .gt{margin-left:auto;color:#9aa2b6;font-size:15px}
.wt .sw .dd{width:40px;border-left:1px solid #e6eaf3;display:grid;place-items:center}
.wt .sw .dd.on{background:#eef3ff}
.wt .live{display:flex;align-items:center;gap:8px;background:#e8f7ee;color:#18884d;font-weight:700;font-size:14px;border-radius:10px;padding:8px 12px}
.wt .live i{width:9px;height:9px;border-radius:50%;background:#21b35f}
.wt .bell{position:relative;width:40px;display:grid;place-items:center}
.wt .bell i{position:absolute;top:2px;right:8px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid #fff}
.wt .user{display:flex;align-items:center;gap:11px;font-size:14.5px;font-weight:700;padding-left:10px;border-left:1px solid #e6eaf3;height:44px}
.wt .user small{display:block;font-size:12.5px;color:#6f7891;font-weight:500}
.wt .ava{width:44px;height:44px;border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 2px #fff,0 2px 6px rgba(20,30,60,.18)}
.wt .card{position:absolute;background:rgba(255,255,255,.97);border:1px solid #e7ebf4;border-radius:16px;box-shadow:0 10px 30px rgba(32,48,110,.10)}
.wt .kpis{position:absolute;left:34px;top:94px;display:flex;gap:12px}
.wt .kpi{position:relative;width:236px;height:78px;display:flex;align-items:center;gap:14px;padding:0 16px}
.wt .kpi .ic{width:46px;height:46px;border-radius:12px;background:#edf2ff;display:grid;place-items:center;flex:none}
.wt .kpi .k{font-size:12.5px;color:#2b3550;font-weight:600}
.wt .kpi .v{font-size:24px;font-weight:800;letter-spacing:-.02em;display:flex;align-items:center;gap:8px;line-height:1.15}
.wt .kpi .d{font-size:12.5px;color:#18884d;font-weight:700;display:flex;align-items:center;gap:3px}
.wt .kpi .s{font-size:11.5px;color:#7b849b}
.wt .tools{position:absolute;right:420px;top:94px;width:42px;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:2px}
.wt .tools b{width:34px;height:34px;border-radius:9px;display:grid;place-items:center}
.wt .tools b.on{background:#eef3ff}
.wt .tools hr{width:22px;border:0;border-top:1px solid #e8ecf4;margin:3px 0}
.wt .det{right:30px;top:94px;width:374px;padding:16px 18px 10px}
.wt .det .hd{display:flex;gap:12px;align-items:center}
.wt .det .th{width:54px;height:54px;border-radius:12px;background:#eef2fb;display:grid;place-items:center;overflow:hidden;flex:none;background-size:cover;background-position:center}
.wt .det .org{font-size:10.5px;font-weight:800;letter-spacing:.08em;color:${li}}
.wt .det .ti{font-size:17px;font-weight:800;letter-spacing:-.01em;margin-top:1px}
.wt .det .su{font-size:12px;color:#6f7891;margin-top:1px}
.wt .det .btns{margin-left:auto;display:flex;gap:6px;align-self:flex-start}
.wt .det .btns b{width:30px;height:30px;border:1px solid #e1e6f0;border-radius:8px;display:grid;place-items:center}
.wt .det .stat{display:flex;align-items:center;gap:10px;margin-top:14px;font-size:12px;color:#4b5570}
.wt .pillg{display:inline-block;font-size:12.5px;font-weight:700;border-radius:8px;padding:5px 11px}
.wt .go{background:#e6f6ec;color:#18884d}.wt .in{background:#e9efff;color:#2448c8}.wt .wait{background:#fff1e0;color:#c2690a}
.wt .pgr{display:flex;align-items:center;gap:12px;margin-top:12px;font-size:12px;color:#4b5570}
.wt .pgr .pb{flex:1;height:7px;border-radius:5px;background:#e9edf5;overflow:hidden}
.wt .pgr .pb i{display:block;height:100%;border-radius:5px;background:#22b35f}
.wt .det .rows{margin-top:10px;border-top:1px solid #eef1f6}
.wt .det .rw{display:flex;justify-content:space-between;font-size:13px;padding:7px 0;border-bottom:1px solid #eef1f6}
.wt .det .rw:last-child{border:0}
.wt .det .rw span:first-child{color:#4b5570}.wt .det .rw span:last-child{font-weight:600}
.wt .det .rw .ln{color:${li}}
.wt .det .sg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.wt .det .sb{background:#f4f6fb;border-radius:10px;padding:8px 10px}
.wt .det .sb small{display:block;font-size:11px;color:#4b5570}
.wt .det .sb b{display:block;font-size:15px;font-weight:800;margin:1px 0 4px}
.wt .det .sb b em{font-style:normal;font-size:12px;color:#6f7891;font-weight:600}
.wt .det .sb .pb{height:4px;border-radius:3px;background:#e2e7f2;overflow:hidden}.wt .det .sb .pb i{display:block;height:100%;background:${li}}
.wt .det .sb .pb.g i{background:#22b35f}
.wt .det .ih{display:flex;justify-content:space-between;font-size:11.5px;font-weight:800;color:#0f1730;margin-top:12px}.wt .det .ih span{color:#6f7891;font-weight:600}
.wt .det .iv{display:grid;grid-template-columns:26px 1fr 54px 76px;align-items:center;gap:8px;font-size:12.5px;padding:6px 0;border-bottom:1px solid #eef1f6}
.wt .det .iv:last-child{border:0}
.wt .det .iv i{width:24px;height:24px;border-radius:7px;display:grid;place-items:center}
.wt .det .iv b{font-weight:700;text-align:right}
.wt .det .iv .tg{font-size:11.5px;font-weight:700;border-radius:7px;padding:3px 8px;text-align:center}
.wt .det .fl{margin-top:10px;border-top:1px solid #eef1f6;padding-top:8px}
.wt .det .fl .fh{display:flex;justify-content:space-between;font-size:11.5px;font-weight:800}.wt .det .fl .fh span{color:#6f7891;font-weight:600}
.wt .det .fl .fr{display:grid;grid-template-columns:48px 1fr 60px 30px;gap:8px;align-items:center;font-size:12px;margin-top:6px}
.wt .det .fl .fr b{font-weight:800}.wt .det .fl .fr .pb{height:5px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .det .fl .fr .pb i{display:block;height:100%;background:#22b35f}
.wt .trk{left:34px;bottom:30px;width:958px;height:136px;padding:16px 20px;display:flex;gap:18px}
.wt .trk .l{flex:1}
.wt .trk .hd{display:flex;align-items:center;gap:10px;font-size:15.5px;font-weight:800}
.wt .trk .hd span{margin-left:auto;font-size:12px;color:#4b5570;font-weight:600}
.wt .stp{display:flex;justify-content:space-between;position:relative;margin-top:14px}
.wt .stp:before{content:"";position:absolute;left:30px;right:30px;top:16px;height:3px;background:#e6eaf3}
.wt .stp .fl{position:absolute;left:30px;top:16px;height:3px;background:${li}}
.wt .st{position:relative;width:110px;text-align:center;font-size:12.5px;font-weight:700}
.wt .st b{width:34px;height:34px;margin:0 auto 6px;border-radius:50%;display:grid;place-items:center;background:#eef1f7;border:2px solid #fff}
.wt .st.done b{background:${li}}
.wt .st.on b{background:${li};box-shadow:0 0 0 4px rgba(49,102,234,.18)}
.wt .st small{display:block;font-size:11px;color:#6f7891;font-weight:500;margin-top:1px}
.wt .st.fut{color:#8b93a6}
.wt .shp{width:300px;background:#f4f6fb;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:center}
.wt .shp .th{width:62px;height:62px;border-radius:10px;background:#fff;display:grid;place-items:center;flex:none;background-size:cover;background-position:center}
.wt .shp b{font-size:14px;font-weight:800}
.wt .shp .to{font-size:12px;color:#4b5570;margin:2px 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:180px}
.wt .shp .m{font-size:11.5px;color:#6f7891;margin-top:5px}
.wt .tbl{right:30px;bottom:30px;width:480px;padding:14px 18px 8px}
.wt .tbl .hd{display:flex;align-items:center;gap:10px}
.wt .seg{display:flex;background:#f0f3f9;border-radius:10px;padding:3px;font-size:13px;font-weight:700;color:#4b5570}
.wt .seg span{padding:5px 11px;border-radius:8px}.wt .seg span.a{background:#fff;color:#0f1730;box-shadow:0 1px 4px rgba(20,30,60,.12)}
.wt .seg em{font-style:normal;color:${li};margin-left:4px}
.wt .tbl .site{margin-left:auto;font-size:12px;color:#4b5570;font-weight:600}
.wt .tr{display:grid;grid-template-columns:96px 1fr 104px 66px 12px;align-items:center;font-size:13px;padding:7px 0;border-bottom:1px solid #f0f2f7}
.wt .tr:last-child{border:0}
.wt .tr b{font-weight:800;display:block}.wt .tr small{display:block;font-size:11px;color:#6f7891}
.wt .tr .wh{display:flex;align-items:center;gap:7px;color:#2b3550}.wt .tr .wh i{width:8px;height:8px;border-radius:50%}
.wt .tr .pp{font-size:12px;color:#4b5570}.wt .tr .pp .pb{height:5px;width:44px;border-radius:3px;background:#e9edf5;overflow:hidden;margin-bottom:3px}.wt .tr .pp .pb i{display:block;height:100%;background:#22b35f}
.wt .tags{position:absolute;inset:0}
.wt .pin{position:absolute;transform:translate(-50%,-100%)}
.wt .pin .h{width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${li};display:grid;place-items:center;box-shadow:0 6px 14px rgba(32,60,160,.35)}
.wt .pin .h i{width:13px;height:13px;border-radius:50%;background:#fff}
.wt .sel{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center}
.wt .sel .p{display:flex;align-items:center;gap:8px;background:#2547c9;color:#fff;font-size:13px;font-weight:800;border-radius:9px;padding:6px 11px;white-space:nowrap;box-shadow:0 8px 18px rgba(32,60,160,.35)}
.wt .sel .p small{font-weight:600;color:#c4d3ff;font-size:12px}
.wt .sel .t{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #2547c9}
.wt .drop{right:412px;top:80px;width:360px;padding:10px;transform-origin:top right}
.wt .drop .h{font-size:11px;font-weight:800;letter-spacing:.08em;color:#6f7891;padding:4px 8px 8px}
.wt .drop .it{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;font-size:13.5px;font-weight:700}
.wt .drop .it.on{background:#eef3ff}
.wt .drop .it .chip{width:38px;height:28px;border-radius:7px;background:${li};color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.wt .drop .it small{display:block;font-size:11.5px;color:#6f7891;font-weight:500}
.wt .drop .it .mb{margin-left:auto;width:64px;height:5px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .drop .it .mb i{display:block;height:100%;background:${li}}
.wt .cur{position:absolute;width:26px;height:26px;margin:-3px 0 0 -3px;z-index:9}
.wt .ring{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid ${li};opacity:0;z-index:8}
`,zn=(n,t=18,e="#5b6680",i=2)=>`<svg viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="${e}" stroke-width="${i}" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`,D0=(n=34)=>`<svg viewBox="0 0 40 40" width="${n}" height="${n}"><path d="M20 3l15 8.5v17L20 37 5 28.5v-17z" fill="#2448c8"/><path d="M20 3l15 8.5L20 20 5 11.5z" fill="#6f98f7"/><path d="M20 20l15-8.5v17L20 37z" fill="#3166ea"/><path d="M20 20v17L5 28.5v-17z" fill="#2448c8"/></svg>`,Xa={cube:D0(26),plane:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 22l14-3 8-13h4l-4 13 7 1 3-3h3l-2 6 2 6h-3l-3-3-7 1 4 13h-4l-8-13-14-3z" fill="#3166ea"/><path d="M18 19l8-13h4l-4 13z" fill="#6f98f7"/></svg>',bag:'<svg viewBox="0 0 40 40" width="26" height="26"><rect x="7" y="12" width="26" height="22" rx="5" fill="#3166ea"/><rect x="7" y="12" width="26" height="7" rx="3" fill="#6f98f7"/><path d="M15 12V7h10v5" stroke="#2448c8" stroke-width="3" fill="none"/></svg>',clock:'<svg viewBox="0 0 40 40" width="26" height="26"><circle cx="20" cy="20" r="15" fill="#3166ea"/><circle cx="20" cy="20" r="11" fill="#6f98f7"/><path d="M20 12v9l6 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',truck:'<svg viewBox="0 0 40 40" width="26" height="26"><rect x="3" y="10" width="21" height="17" rx="3" fill="#6f98f7"/><path d="M24 15h7l6 6v6H24z" fill="#3166ea"/><circle cx="11" cy="29" r="4" fill="#1a2440"/><circle cx="30" cy="29" r="4" fill="#1a2440"/></svg>'},Ud={doc:zn('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',16,"#fff"),box:zn('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',16,"#fff"),load:zn('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M10 14h4"/>',16,"#fff"),truck:zn('<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',16,"#fff"),check:zn('<path d="M5 12l5 5 9-10"/>',16,"#fff",2.6),plane:zn('<path d="M3 13l7-1 4-7h2l-1 7 5 1 1-2h2l-1 3 1 3h-2l-1-2-5 1 1 7h-2l-4-7-7-1z"/>',16,"#fff",1.8)},B2=n=>Ud[n].replace(/stroke="#fff"/,'stroke="#9aa2b6"'),z2={box:"#fbefdc",bin:"#e6eeff",helmet:"#fff1d6",tape:"#fbefdc",frozen:"#e9f6ff",water:"#e6eeff",gloves:"#e6eeff",pallet:"#fbefdc"},k2={box:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="#d9a35f"/><path d="M4 7.5l8 4.5 8-4.5L12 3z" fill="#ecc28a"/><path d="M12 12v9" stroke="#b9853f" stroke-width="1.2"/></svg>',bin:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 8h16l-1.6 11H5.6z" fill="#3166ea"/><rect x="3" y="5" width="18" height="4" rx="1.5" fill="#6f98f7"/></svg>',helmet:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16a8 8 0 0116 0z" fill="#f2b33a"/><rect x="2.5" y="15.5" width="19" height="3" rx="1.5" fill="#d9952a"/></svg>',tape:'<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="8" fill="#d9a35f"/><circle cx="12" cy="12" r="3.4" fill="#fbefdc"/></svg>',frozen:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" stroke="#3b8fe0" stroke-width="2.2" stroke-linecap="round"/></svg>',water:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" fill="#3166ea"/></svg>',gloves:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 21V9a1.5 1.5 0 013 0V5a1.5 1.5 0 013 0v4a1.5 1.5 0 013 0v2a1.5 1.5 0 013 0v5a5 5 0 01-5 5z" fill="#3166ea"/></svg>',pallet:'<svg viewBox="0 0 24 24" width="16" height="16"><rect x="4" y="5" width="16" height="11" rx="1.5" fill="#d9a35f"/><rect x="3" y="17" width="18" height="3" rx="1" fill="#b9853f"/></svg>'},L0='<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2.5l14.5 8.6-6.6 1.8-3 6.6z" fill="#0f1730" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',H2='<svg viewBox="0 0 24 24" width="26" height="26"><path d="M9 11V4.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v5c0 3.5-2.5 6-6 6h-1c-2.6 0-4-1.3-5.3-3.2L4.6 14.4a1.6 1.6 0 012.6-1.8L9 14.5" fill="#fff" stroke="#0f1730" stroke-width="1.6" stroke-linejoin="round"/></svg>';function U0(n,t,{paint:e=i=>i}={}){let i=document.createElement("style");i.textContent=e(O2),document.head.appendChild(i);let s=document.createElement("div");s.className="wt";let r=h=>`<div class="card kpi"><div class="ic">${Xa[h.ic]??""}</div><div><div class="k">${h.k}</div><div class="v"><span data-k="kv_${h.key}">${h.v}</span><span class="d">${zn('<path d="M12 19V5M6 11l6-6 6 6"/>',13,"#18884d",2.6)}<span data-k="kd_${h.key}">${h.d}</span></span></div><div class="s" data-k="ks_${h.key}">${h.s}</div></div></div>`;s.innerHTML=`
  <div class="bar">
    <div class="logo">${D0(34)}${t.brand}</div>
    <div class="search">${zn('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',19,"#0f1730")}<span data-k="search">${t.search}</span><span class="k">/</span></div>
    <div class="sw"><div class="main"><div class="chip" data-k="swChip"></div><div><span data-k="swName"></span><small data-k="swSub"></small></div><span class="gt">\u203A</span></div><div class="dd" data-k="dd">${zn('<path d="M6 9l6 6 6-6"/>',16,"#0f1730")}</div></div>
    <div class="live"><i></i><span data-k="clock">Live 09:46</span></div>
    <div class="bell">${zn('<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',22,"#0f1730")}<i></i></div>
    <div class="user"><div class="ava" style="background-image:url(${t.avatar??P0})"></div><div>${t.user[0]}<small>${t.user[1]}</small></div>${zn('<path d="M6 9l6 6 6-6"/>',16,"#0f1730")}</div>
  </div>
  <div class="kpis">${t.kpis.map(r).join("")}</div>
  <div class="card tools" data-k="tools">${['<path d="M12 5v14M5 12h14"/>','<path d="M5 12h14"/>',"hr",'<path d="M4 12a8 8 0 108-8H8"/><path d="M8 1v6h6" transform="translate(-4 0)"/>','<path d="M20 12a8 8 0 11-8-8h4"/><path d="M16 1v6h-6" transform="translate(4 0)"/>',"hr",'<path d="M4 11l8-7 8 7v9H4z"/>'].map((h,u)=>h==="hr"?"<hr>":`<b data-k="tool${u}">${zn(h,18,"#0f1730")}</b>`).join("")}</div>
  <div class="card det" data-k="det">
    <div class="hd"><div class="th" data-k="dThumb"></div><div><div class="org" data-k="dOrg"></div><div class="ti" data-k="dTitle"></div><div class="su" data-k="dSub"></div></div>
      <div class="btns"><b>${zn('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',15,"#0f1730")}</b><b>${zn('<path d="M7 17L17 7M9 7h8v8"/>',15,"#0f1730")}</b><b>${zn('<path d="M6 6l12 12M18 6L6 18"/>',15,"#0f1730")}</b></div></div>
    <div class="stat"><span class="pillg" data-k="dStat"></span><span data-k="dStatText"></span></div>
    <div class="pgr"><div class="pb"><i data-k="dBar"></i></div><span data-k="dProg"></span></div>
    <div class="rows" data-k="dRows"></div>
    <div data-k="dExtra"></div>
  </div>
  <div class="card trk">
    <div class="l"><div class="hd">${Xa.truck}<span style="margin:0;font-size:15.5px;color:#0f1730;font-weight:800" data-k="tTitle"></span><span data-k="tMeta"></span></div>
      <div class="stp" data-k="steps"></div></div>
    <div class="shp"><div class="th" data-k="sThumb"></div><div><b data-k="sId"></b><div class="to" data-k="sTo"></div><span class="pillg" data-k="sStat" style="font-size:11.5px;padding:3px 9px"></span><div class="m" data-k="sMeta"></div></div><span style="margin-left:auto;color:#0f1730;font-size:18px">\u203A</span></div>
  </div>
  <div class="card tbl"><div class="hd"><div style="width:28px;height:28px;border-radius:8px;background:#edf2ff;display:grid;place-items:center">${zn('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',15,li)}</div><div class="seg" data-k="seg"></div><span class="site" data-k="tSite"></span></div><div data-k="rows"></div></div>
  <div class="card drop" data-k="drop"><div class="h">NETWORK OVERVIEW</div><div data-k="dropList"></div></div>
  <div class="tags" data-k="tags"></div>
  <div class="ring" data-k="ring"></div>
  <div class="cur" data-k="cur">${L0}</div>`,s.innerHTML=e(s.innerHTML),n.appendChild(s);let o=h=>s.querySelector(`[data-k="${h}"]`),a=(h,u)=>{let d=o(h);d&&d.textContent!==String(u)&&(d.textContent=u)},l=(h,u)=>{let d=o(h);d&&d.dataset.v!==u&&(d.innerHTML=u,d.dataset.v=u)},c=(h,u)=>{let d=o(h),f=u?`url(${u})`:"";d.style.backgroundImage!==f&&(d.style.backgroundImage=f)};return{el:s,update(h){a("clock",`Live ${h.clock}`),a("swChip",h.site[0]),a("swName",h.site[1]),a("swSub",h.site[2]);for(let[T,x]of Object.entries(h.kpi??{}))a(`kv_${T}`,x[0]),a(`kd_${T}`,x[1]),x[2]&&a(`ks_${T}`,x[2]);let u=h.card;c("dThumb",u.thumb),a("dOrg",u.org),a("dTitle",u.title),a("dSub",u.sub);let d=o("dStat");d.className=`pillg ${u.statCls}`,a("dStat",u.stat),a("dStatText",u.statText),o("dBar").style.width=`${(100*u.prog).toFixed(1)}%`,a("dProg",u.progText),l("dRows",(u.rows??[]).map(([T,x,E])=>`<div class="rw"><span>${T}</span><span${E?' class="ln"':""}>${x}</span></div>`).join("")),o("dBar").parentElement.parentElement.style.display=u.stats?"none":"";let f="";u.stats&&(f+=`<div class="sg">${u.stats.map(([T,x,E,C,D])=>`<div class="sb"><small>${T}</small><b>${x}${E?` <em>${E}</em>`:""}</b>${C==null?"":`<div class="pb${D?" g":""}"><i style="width:${(100*C).toFixed(1)}%"></i></div>`}</div>`).join("")}</div>`),u.inv&&(f+='<div class="ih">Inventory<span>units</span></div>'+u.inv.map(([T,x,E,C,D])=>`<div class="iv"><i style="background:${z2[T]??"#eef2fb"}">${k2[T]??""}</i><span>${x}</span><b>${E}</b><span class="tg ${D}">${C}</span></div>`).join("")),u.fleet&&(f+=`<div class="fl"><div class="fh">${u.fleet.title}<span>${u.fleet.meta}</span></div>${u.fleet.rows.map(([T,x,E])=>`<div class="fr"><b>${T}</b><span>${x}</span><div class="pb"><i style="width:${(100*E).toFixed(0)}%"></i></div><span>${Math.round(100*E)}%</span></div>`).join("")}</div>`),l("dExtra",e(f)),o("det").style.transform=`translateY(${((1-u.pop)*10).toFixed(1)}px)`,o("det").style.opacity=(.25+.75*u.pop).toFixed(3);let p=h.track;a("tTitle",p.title),a("tMeta",p.meta),l("steps",e(`<div class="fl" style="width:calc((100% - 60px) * ${p.fill.toFixed(3)})"></div>`+p.steps.map(([T,x,E,C])=>`<div class="st ${C||"fut"}"><b>${C==="on"?Ud.check:C==="done"?Ud[E]:B2(E)}</b>${T}<small>${x}</small></div>`).join(""))),c("sThumb",p.ship.thumb),a("sId",p.ship.id),a("sTo",p.ship.to),o("sStat").className=`pillg ${p.ship.statCls}`,a("sStat",p.ship.stat),a("sMeta",p.ship.meta);let v=h.table;l("seg",v.tabs.map(([T,x],E)=>`<span${E===v.active?' class="a"':""}>${T}<em>${x}</em></span>`).join("")),a("tSite",v.site),l("rows",e(v.rows.map(T=>`<div class="tr"><div><b>${T.id}</b><small>${T.org}</small></div><div class="wh"><i style="background:${T.dot}"></i>${T.where}</div><div><span class="pillg ${T.cls}" style="font-size:12px;padding:4px 10px">${T.stat}</span></div><div class="pp">${T.p==null?T.pt:`<div class="pb"><i style="width:${T.p}%"></i></div>${T.pt}`}</div><span style="color:#0f1730">\u203A</span></div>`).join("")));let g=h.drop??{open:0,sites:[]},m=o("drop");m.style.opacity=g.open.toFixed(3),m.style.transform=`translateY(${((1-g.open)*-8).toFixed(1)}px) scale(${(.97+.03*g.open).toFixed(3)})`,o("dd").className=g.open>.05?"dd on":"dd",l("dropList",g.sites.map(([T,x,E,C],D)=>`<div class="it${D===g.on?" on":""}"><div class="chip">${T}</div><div>${x}<small>${E}</small></div><div class="mb"><i style="width:${C}%"></i></div></div>`).join(""));for(let T=0;T<7;T++){let x=o(`tool${T}`);x&&(x.className=h.tool===T?"on":"")}let _=o("tags"),b=h.tags??[];for(;_.children.length<b.length;)_.appendChild(document.createElement("div"));[..._.children].forEach((T,x)=>{let E=b[x];if(!E){T.style.display="none";return}T.style.display="";let C=E.kind==="pin"?"pin":"sel",D=E.kind==="pin"?'<div class="h"><i></i></div>':`<div class="p">${E.text}<small>${E.sub??""}</small></div><div class="t"></div>`;T.dataset.v!==C+D&&(T.className=C,T.innerHTML=D,T.dataset.v=C+D),T.style.left=`${E.x.toFixed(1)}px`,T.style.top=`${E.y.toFixed(1)}px`,T.style.opacity=(E.a??1).toFixed(3)});let y=o("cur"),M=h.hand?H2:L0;y.dataset.v!==M&&(y.innerHTML=M,y.dataset.v=M),y.style.left=`${h.cursor[0]}px`,y.style.top=`${h.cursor[1]}px`;let w=o("ring");w.style.left=`${h.cursor[0]}px`,w.style.top=`${h.cursor[1]}px`,w.style.opacity=((h.click??0)*.9).toFixed(3),w.style.transform=`scale(${(.4+(1-(h.click??0))*1.2).toFixed(3)})`}}}At.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ct},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};qn.line={uniforms:$n.merge([At.common,At.fog,At.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var mo=class extends De{constructor(t){super({type:"LineMaterial",uniforms:$n.clone(qn.line.uniforms),vertexShader:qn.line.vertexShader,fragmentShader:qn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0!==this.worldUnits&&(this.needsUpdate=!0),t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}};var N0=new tn,wh=new U,ur=class extends ga{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new Qt(t,3)),this.setAttribute("uv",new Qt(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,i=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),i.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let i=new Ns(e,6,1);return this.setAttribute("instanceStart",new mi(i,3,0)),this.setAttribute("instanceEnd",new mi(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let i=new Ns(e,6,1);return this.setAttribute("instanceColorStart",new mi(i,3,0)),this.setAttribute("instanceColorEnd",new mi(i,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new ca(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),N0.setFromBufferAttribute(e),this.boundingBox.union(N0))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)wh.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(wh)),wh.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wh));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}};var Nd=new Se,F0=new U,O0=new U,Rn=new Se,Cn=new Se,ji=new Se,Fd=new U,Od=new Dt,In=new va,B0=new U,Eh=new tn,Th=new pi,Ki=new Se,Qi,dr;function z0(n,t,e){return Ki.set(0,0,-t,1).applyMatrix4(n.projectionMatrix),Ki.multiplyScalar(1/Ki.w),Ki.x=dr/e.width,Ki.y=dr/e.height,Ki.applyMatrix4(n.projectionMatrixInverse),Ki.multiplyScalar(1/Ki.w),Math.abs(Math.max(Ki.x,Ki.y))}function G2(n,t){let e=n.matrixWorld,i=n.geometry,s=i.attributes.instanceStart,r=i.attributes.instanceEnd,o=Math.min(i.instanceCount,s.count);for(let a=0,l=o;a<l;a++){In.start.fromBufferAttribute(s,a),In.end.fromBufferAttribute(r,a),In.applyMatrix4(e);let c=new U,h=new U;Qi.distanceSqToSegment(In.start,In.end,h,c),h.distanceTo(c)<dr*.5&&t.push({point:h,pointOnLine:c,distance:Qi.origin.distanceTo(h),object:n,face:null,faceIndex:a,uv:null,uv1:null})}}function V2(n,t,e){let i=t.projectionMatrix,r=n.material.resolution,o=n.matrixWorld,a=n.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),u=-t.near;Qi.at(1,ji),ji.w=1,ji.applyMatrix4(t.matrixWorldInverse),ji.applyMatrix4(i),ji.multiplyScalar(1/ji.w),ji.x*=r.x/2,ji.y*=r.y/2,ji.z=0,Fd.copy(ji),Od.multiplyMatrices(t.matrixWorldInverse,o);for(let d=0,f=h;d<f;d++){if(Rn.fromBufferAttribute(l,d),Cn.fromBufferAttribute(c,d),Rn.w=1,Cn.w=1,Rn.applyMatrix4(Od),Cn.applyMatrix4(Od),Rn.z>u&&Cn.z>u)continue;if(Rn.z>u){let b=Rn.z-Cn.z,y=(Rn.z-u)/b;Rn.lerp(Cn,y)}else if(Cn.z>u){let b=Cn.z-Rn.z,y=(Cn.z-u)/b;Cn.lerp(Rn,y)}Rn.applyMatrix4(i),Cn.applyMatrix4(i),Rn.multiplyScalar(1/Rn.w),Cn.multiplyScalar(1/Cn.w),Rn.x*=r.x/2,Rn.y*=r.y/2,Cn.x*=r.x/2,Cn.y*=r.y/2,In.start.copy(Rn),In.start.z=0,In.end.copy(Cn),In.end.z=0;let v=In.closestPointToPointParameter(Fd,!0);In.at(v,B0);let g=cd.lerp(Rn.z,Cn.z,v),m=g>=-1&&g<=1,_=Fd.distanceTo(B0)<dr*.5;if(m&&_){In.start.fromBufferAttribute(l,d),In.end.fromBufferAttribute(c,d),In.start.applyMatrix4(o),In.end.applyMatrix4(o);let b=new U,y=new U;Qi.distanceSqToSegment(In.start,In.end,y,b),e.push({point:y,pointOnLine:b,distance:Qi.origin.distanceTo(y),object:n,face:null,faceIndex:d,uv:null,uv1:null})}}}var Ah=class extends zt{constructor(t=new ur,e=new mo({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,i=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)F0.fromBufferAttribute(e,o),O0.fromBufferAttribute(i,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+F0.distanceTo(O0);let r=new Ns(s,2,1);return t.setAttribute("instanceDistanceStart",new mi(r,1,0)),t.setAttribute("instanceDistanceEnd",new mi(r,1,1)),this}raycast(t,e){let i=this.material.worldUnits,s=t.camera;if(s===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),i===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;Qi=t.ray;let o=this.matrixWorld,a=this.geometry,l=this.material;dr=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),Th.copy(a.boundingSphere).applyMatrix4(o);let c;if(i)c=dr*.5;else{let u=Math.max(s.near,Th.distanceToPoint(Qi.origin));c=z0(s,u,l.resolution)}if(Th.radius+=c,Qi.intersectsSphere(Th)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Eh.copy(a.boundingBox).applyMatrix4(o);let h;if(i)h=dr*.5;else{let u=Math.max(s.near,Eh.distanceToPoint(Qi.origin));h=z0(s,u,l.resolution)}Eh.expandByScalar(h),Qi.intersectsBox(Eh)!==!1&&(i?G2(this,e):V2(this,s,e))}onBeforeRender(t){let e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Nd),this.material.uniforms.resolution.value.set(Nd.z,Nd.w))}};var k0="#3f6ff0";function W2(){let n=document.createElement("canvas");n.width=n.height=256;let t=n.getContext("2d"),e=t.createRadialGradient(128,128,10,128,128,128);e.addColorStop(0,"rgba(72,118,245,0.55)"),e.addColorStop(.55,"rgba(72,118,245,0.22)"),e.addColorStop(1,"rgba(72,118,245,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let i=new Ui(n);return i.colorSpace=Fe,i}function H0(n,t){let e=new mo({color:k0,linewidth:1.6,transparent:!0,opacity:.95,depthTest:!0}),i=new Ah(new ur,e);i.renderOrder=5,i.visible=!1,n.add(i);let s=new zt(new Xn(1,1).rotateX(-Math.PI/2),new ii({map:W2(),transparent:!0,depthWrite:!1}));s.renderOrder=1,s.visible=!1,n.add(s);let r=new zt(new ge,new ii({color:k0,transparent:!0,depthWrite:!1})),o=new zt(new ge,new ii({color:"#7da0f6",transparent:!0,opacity:.35,depthWrite:!1}));r.renderOrder=o.renderOrder=2,r.visible=o.visible=!1,n.add(o,r);let a=new tn,l=null,c="",h=d=>{let{min:f,max:p}=d,v=[[f.x,f.y,f.z],[p.x,f.y,f.z],[p.x,f.y,p.z],[f.x,f.y,p.z],[f.x,p.y,f.z],[p.x,p.y,f.z],[p.x,p.y,p.z],[f.x,p.y,p.z]],g=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],m=[];for(let[_,b]of g)m.push(...v[_],...v[b]);return m},u=(d,f,p)=>{let v=[0];for(let M=1;M<d.length;M++)v.push(v[M-1]+d[M].distanceTo(d[M-1]));let g=v[v.length-1]*p,m=[];for(let M=0;M<d.length;M++)if(v[M]<=g)m.push(d[M]);else{let w=(g-v[M-1])/(v[M]-v[M-1]||1);m.push(d[M-1].clone().lerp(d[M],w));break}if(m.length<2)return null;let _=[],b=[];for(let M=0;M<m.length;M++){let w=m[Math.max(0,M-1)],T=m[Math.min(m.length-1,M+1)],x=new U().subVectors(T,w).setY(0).normalize(),E=new U(-x.z,0,x.x).multiplyScalar(f/2);_.push(m[M].x+E.x,.06,m[M].z+E.z,m[M].x-E.x,.06,m[M].z-E.z),M&&b.push(2*M-2,2*M-1,2*M,2*M-1,2*M+1,2*M)}let y=new ge;return y.setAttribute("position",new Qt(_,3)),y.setIndex(b),y};return{box(d,f=1){if(l=d&&f>.001?d:null,i.visible=s.visible=!!l,!l)return;e.opacity=.95*f,s.material.opacity=f;let p=l.uuid;if(p!==c){c=p,l.updateMatrixWorld(!0);let v=new Dt().copy(l.matrixWorld).invert();a.makeEmpty(),l.traverse(g=>{!g.isMesh||!g.geometry||(g.geometry.boundingBox||g.geometry.computeBoundingBox(),a.union(g.geometry.boundingBox.clone().applyMatrix4(new Dt().multiplyMatrices(v,g.matrixWorld))))}),a.expandByScalar(.25),i.geometry.dispose(),i.geometry=new ur().setPositions(h(a)),i.userData.size=a.getSize(new U),i.userData.center=a.getCenter(new U)}},route(d,f=1,p=1){if(r.visible=o.visible=!!d&&f>.001&&p>.001,!r.visible)return;let v=u(d,.9,f),g=u(d,3.2,f);if(!v){r.visible=o.visible=!1;return}r.geometry.dispose(),o.geometry.dispose(),r.geometry=v,o.geometry=g,r.material.opacity=.9*p,o.material.opacity=.32*p},update(){if(e.resolution.set(t.size.w,t.size.h),l){l.updateMatrixWorld(!0),i.matrixAutoUpdate=!1,i.matrix.copy(l.matrixWorld),i.matrixWorldNeedsUpdate=!0;let d=i.userData.size,f=i.userData.center.clone().applyMatrix4(l.matrixWorld);s.position.set(f.x,.05,f.z),s.scale.set(Math.max(d.x,d.z)*1.9,1,Math.max(d.x,d.z)*1.9)}}}}var Bd=null;function ts(n,{size:t=160,az:e=38,el:i=26,pad:s=1.18}={}){if(!Bd){let g=document.createElement("canvas"),m=new ho({canvas:g,antialias:!0,alpha:!0,preserveDrawingBuffer:!0});m.outputColorSpace=Fe,m.toneMapping=ms,m.toneMappingExposure=.95;let _=new fs;_.add(new ir("#f3f6ff","#c7d0ee",1.3));let b=new sr("#ffffff",2.2);b.position.set(-4,8,5),_.add(b),Bd={renderer:m,scene:_,camera:new mn(24,1,.1,2e3)}}let{renderer:r,scene:o,camera:a}=Bd;r.setSize(t,t,!1),r.setClearColor(0,0);let l=new Ht;l.add(n),o.add(l),n.updateMatrixWorld(!0);let c=new tn().setFromObject(n),h=c.getCenter(new U),d=c.getSize(new U).length()/2*s/Math.sin(a.fov*Math.PI/360),f=e*Math.PI/180,p=i*Math.PI/180;a.position.set(h.x+d*Math.cos(p)*Math.sin(f),h.y+d*Math.sin(p),h.z+d*Math.cos(p)*Math.cos(f)),a.lookAt(h),r.render(o,a);let v=r.domElement.toDataURL("image/png");return o.remove(l),v}function Mn(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new ge,c=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=G0(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);let p=G0(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function G0(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ee(o,e,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,f=h.count;d<f;d++)for(let p=0;p<e;p++){let v=h.getComponent(d,p);a.setComponent(d+u,p,v)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var ye=Math.PI,Zn=(n=0,t=0,e=0)=>new U(n,t,e),Ch=(n,t,e)=>Math.min(e,Math.max(t,n)),V0=(n,t,e)=>n+(t-n)*e,Gs={upper:30.5,capsule:38.2,top:44.65,R:2.3},X2={ink:"#232a40",engine:"#3a4361",engineRim:"#8a94b0",fin:"#aab4cf",cells:"#2a3fa6",shield:"#3b4156",steel:"#c3cbe3"},fr=X2,$2=Zn(),q2=new ve,Y2=new hn,Z2=Zn(1,1,1),We=(n=0,t=0,e=0,i=0,s=0,r=0)=>new Dt().compose($2.set(n,t,e),q2.setFromEuler(Y2.set(i,s,r)),Z2.set(1,1,1));function W0(n){let t=n.index?n.toNonIndexed():n.clone();for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ee(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}var zd=new Map,$a=(n,t)=>(zd.has(n)||zd.set(n,t()),zd.get(n));function Sn(n,t,e,i=.12,s=40){return $a(`rcyl|${n}|${t}|${e}|${i}|${s}`,()=>{let r=Math.min(i,e/2-.001,Math.min(n,t)-.001),o=[new ct(1e-4,-e/2)],a=(l,c,h,u)=>{for(let d=0;d<=4;d++){let f=V0(h,u,d/4);o.push(new ct(l+r*Math.cos(f),c+r*Math.sin(f)))}};return a(n-r,-e/2+r,-ye/2,0),a(t-r,e/2-r,0,ye/2),o.push(new ct(1e-4,e/2)),new fn(o,s)})}var xs=(n,t=40)=>new fn(n.map(([e,i])=>new ct(e,i)),t),vs=class{constructor(){this.parts=new Map}add(t,e,i){let s=W0(e);return i&&s.applyMatrix4(i),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(s),this}box(t,e,i,s,r,o,a,l=null,c=0,h=0,u=0){return this.add(t,Be(e,i,s,l??Math.min(e,i,s)*.2),We(r,o,a,c,h,u))}onSurface(t,e,i,s,r,o,a,l=0,c=null){let h=new Dt().makeTranslation(r*Math.sin(a),o,r*Math.cos(a));return h.multiply(new Dt().makeRotationY(a)).multiply(new Dt().makeRotationX(-l)),this.add(t,Be(e,i,s,c??Math.min(e,i,s)*.3),h)}cyl(t,e,i,s,r,o,a,l="y",c=.12,h=32){let u=l==="x"?We(r,o,a,0,0,-ye/2):l==="z"?We(r,o,a,ye/2,0,0):We(r,o,a);return this.add(t,Sn(e,i,s,c,h),u)}bar(t,e,i,s,r=.08){let o=Zn().subVectors(i,e),a=o.length(),l=new ve().setFromUnitVectors(Zn(0,1,0),o.multiplyScalar(1/a));return this.add(t,Be(s,a,s,Math.min(r,s*.3),1),new Dt().compose(e.clone().add(i).multiplyScalar(.5),l,Zn(1,1,1)))}build(t=new Ht){for(let[e,i]of this.parts){let s=new zt(Mn(i,!1),e);s.castShadow=!e.transparent,s.receiveShadow=!0,t.add(s)}return t}},Rh=null;function Ih(){return Rh||(Rh={white:gt(pt.white,{paint:!0,rough:.46}),panel:gt(pt.panel,{rough:.55}),ink:gt(fr.ink,{rough:.62}),engine:gt(fr.engine,{rough:.42,metal:.25}),rim:gt(fr.engineRim,{rough:.4,metal:.2}),fin:gt(fr.fin,{rough:.4,metal:.15}),cells:gt(fr.cells,{rough:.3}),shield:gt(fr.shield,{rough:.7}),glass:gt(pt.glass,{rough:.16}),blue:gt(pt.blue,{paint:!0,rough:.5}),blueDeep:gt(pt.blueDeep,{paint:!0,rough:.5}),steel:gt(fr.steel,{rough:.45}),yellow:gt(pt.yellow,{paint:!0,rough:.5}),tyre:gt(pt.navy,{rough:.82}),hub:gt("#c9cfdf",{rough:.42}),inside:new Oe({color:"#1b2034",roughness:.9,side:Te})},Rh)}var Yn={hingeR:2.5,hingeY:1.7,len:8.6,deploy:112*ye/180};function qa(){let n=Ih(),t=new Ht;t.name="booster";let e=new vs,i=Gs.R;e.add(n.white,Sn(i,i,25.6,.22,48),We(0,1.4+12.8,0)),e.add(n.blue,Sn(i+.03,i+.03,.34,.06,48),We(0,26.2,0)),e.add(n.ink,Sn(i+.06,i-.1,.62,.16,48),We(0,1.32,0)),e.add(n.ink,Sn(i-.25,i-.25,.4,.08,40),We(0,.98,0));let s=$a("bell",()=>xs([[.53,0],[.5,.12],[.41,.5],[.31,.95],[.28,1.2],[.32,1.32]],24)),r=$a("bellRim",()=>new ri(.52,.045,6,24).rotateX(ye/2)),o=[[0,0],...Array.from({length:8},(T,x)=>[1.45*Math.cos(x*ye/4+ye/8),1.45*Math.sin(x*ye/4+ye/8)])];for(let[T,x]of o)e.add(n.engine,s,We(T,0,x)),e.add(n.rim,r,We(T,.03,x));for(let T=0;T<4;T++)e.box(n.ink,.12,.7,.1,-.9+T*.32,4.2,i+.01,.04);e.add(n.ink,xs([[i,27],[i,30.2],[i-.08,30.45],[i-.2,30.5]],48)),e.add(n.inside,xs([[i-.18,27.2],[i-.18,30.5]],48)),e.add(n.ink,new Kr(i-.2,i,48).rotateX(-ye/2),We(0,30.49,0)),e.add(n.ink,new gi(i-.16,32).rotateX(-ye/2),We(0,27.25,0));let a=[0,1,2,3].map(T=>T*ye/2);for(let T of a)e.box(n.fin,.5,.34,.5,(i+.08)*Math.cos(T),27.85,(i+.08)*Math.sin(T),.08);for(let T of a)e.box(n.ink,.9,.5,.7,(i+.1)*Math.cos(T),Yn.hingeY,(i+.1)*Math.sin(T),.12,0,-T,0);e.build(t);let l=new vs,c=1.9,h=1.7,u=.32;l.box(n.fin,u,.16,c,0,.08,0,.05),l.box(n.fin,u,.16,c,0,h-.08,0,.05),l.box(n.fin,u,h,.16,0,h/2,-c/2+.08,.05),l.box(n.fin,u,h,.16,0,h/2,c/2-.08,.05);for(let T=1;T<5;T++)l.box(n.fin,u*.8,.07,c-.2,0,T*h/5,0,.02),l.box(n.fin,u*.8,h-.2,.07,0,h/2,-c/2+T*c/5,.02);let d=l.build(),f=a.map(T=>{let x=new Ht;x.position.set((i+.28)*Math.cos(T),27.9,(i+.28)*Math.sin(T)),x.rotation.y=-T;let E=new Ht;return E.add(d.clone()),x.add(E),t.add(x),E}),p=new vs,v=(()=>{let T=W0(Be(.72,Yn.len,1.6,.26,2)),x=T.attributes.position;for(let E=0;E<x.count;E++){let C=x.getY(E)+Yn.len/2,D=V0(1,.5,C/Yn.len);x.setZ(E,x.getZ(E)*D),x.setY(E,C)}return T.computeVertexNormals(),T})();p.add(n.ink,v),p.box(n.white,.1,1.4,.6,.37,5.6,0,.04);let g=p.build(),m=Sn(.8,.62,.3,.12,24),_=Sn(.22,.22,1,.06,12),b=a.map(T=>{let x=new Ht;x.position.set(Yn.hingeR*Math.cos(T),Yn.hingeY,Yn.hingeR*Math.sin(T)),x.rotation.y=-T;let E=new Ht;E.add(g.clone());let C=new zt(m,n.ink);C.castShadow=C.receiveShadow=!0,C.position.y=Yn.len,E.add(C),x.add(E);let D=new zt(_,n.steel);return D.castShadow=!0,x.add(D),t.add(x),{arm:E,foot:C,strut:D}}),y=Zn(),M=Zn(),w=Zn(0,1,0);return{group:t,setLegs(T){let x=Yn.deploy*Ch(T,0,1);for(let E of b)if(E.arm.rotation.z=-x,E.foot.rotation.z=x,E.strut.visible=x>.08,E.strut.visible){y.set(-.12,6.3,0),M.set(4.2*Math.sin(x),4.2*Math.cos(x),0);let C=M.clone().sub(y);E.strut.scale.set(1,C.length(),1),E.strut.position.copy(y).add(M).multiplyScalar(.5),E.strut.quaternion.setFromUnitVectors(w,C.normalize())}},setFins(T){for(let x of f)x.rotation.z=-ye/2*Ch(T,0,1)},dims:{R:i,height:30.5,legSpan:2*(Yn.hingeR+Yn.len*Math.sin(Yn.deploy)),footY:Yn.hingeY+Yn.len*Math.cos(Yn.deploy)}}}function Ya(){let n=Ih(),t=new Ht;t.name="capsule";let e=new vs;e.add(n.white,Sn(2.12,2.12,2.8,.16,48),We(0,1.4,0)),e.add(n.cells,new Ve(2.16,2.16,2,32,1,!0,-ye/2,ye),We(0,1.4,0));for(let o=0;o<9;o++){let a=-ye/2+o*ye/8;e.box(n.steel,.05,2,.05,2.17*Math.sin(a),1.4,2.17*Math.cos(a),.01)}e.add(n.shield,Sn(2.14,2.1,.34,.1,48),We(0,2.95,0)),e.add(n.white,xs([[2.08,3.1],[2.02,3.3],[1.6,4.6],[1.24,5.55],[1.12,5.72],[.6,5.74]],48));let i=Math.atan2(2.02-1.24,5.55-3.3);for(let o of[.42,-.42])e.onSurface(n.glass,.52,.44,.14,1.75,4.25,o,i,.12);for(let o=0;o<4;o++)e.onSurface(n.ink,.46,.32,.16,1.36,5.1,ye/4+o*ye/2,i,.06);e.add(n.steel,Sn(1.02,1,.32,.08,32),We(0,5.86,0)),e.add(n.ink,new gi(.72,24).rotateX(-ye/2),We(0,6.025,0)),e.build(t);let s=new Ht;s.position.set(1.12,5.74,0);let r=new zt($a("noseCap",()=>xs([[1.2,0],[1.18,.18],[1,.48],[.62,.68],[.01,.76]],40)),n.white);return r.position.set(-1.12,0,0),r.castShadow=r.receiveShadow=!0,s.add(r),t.add(s),{group:t,setNose(o){s.rotation.z=-115*ye*Ch(o,0,1)/180},ringY:6.03,dims:{R:2.14,height:6.45}}}function Ph(){let n=Ih(),t=new Ht;t.name="upper";let e=new vs,i=Gs.R;e.add(n.white,Sn(i,i,7.5,.2,48),We(0,3.75,0)),e.add(n.ink,Sn(i+.02,i+.02,.22,.05,48),We(0,.2,0)),e.add(n.panel,xs([[i-.02,7.45],[i-.08,7.6],[2.14,7.72]],48)),e.add(n.engine,xs([[1.52,-3.1],[1.4,-2.6],[1,-1.55],[.62,-.7],[.48,-.2],[.55,0]],40)),e.add(n.rim,new ri(1.5,.06,6,40).rotateX(ye/2),We(0,-3.08,0)),e.add(n.ink,Sn(.9,.7,.5,.1,24),We(0,-.05,0)),e.build(t);let s=Ya();return s.group.position.y=7.7,t.add(s.group),{group:t,capsule:s,dims:{R:i,height:7.7+6.45,bellY:-3.1}}}var de={len:51,hingeY:.9,spine:[-.2,2.2],halfW:1.15,rocketBase:-5.1,rocketAxis:7.5,cradles:[-17.5,-27.5,-37.5,-45.5],ramBase:[-21,.95],ramTop:[-10,1],ramZ:1.95,bogies:[-2.2,-10.5,-19,-28,-37,-46.5]};function Lh(){let n=Ih(),t=new Ht;t.name="erector";let e=Gs.R,i=new vs,s=.62;for(let F of[-2.6,2.6])i.box(n.blue,de.len,.55,.6,-de.len/2,s,F,.14);for(let F=-1;F>-de.len;F-=4.25)i.box(n.blue,.5,.4,4.8,F,s,0,.1);i.box(n.blue,3.2,.5,5.8,-1.6,s+.05,0,.16);for(let F of[-1.8,1.8])i.cyl(n.steel,.45,.45,.8,0,de.hingeY,F,"z",.08,20);for(let F of[-1.8,1.8])i.box(n.blue,1.4,.9,.5,0,.6,F*1.18,.1);for(let F of[-de.ramZ,de.ramZ])i.box(n.yellow,1.2,.6,.5,de.ramBase[0],de.ramBase[1]-.05,F,.12);for(let F of de.bogies)for(let P of[-3,3])i.box(n.ink,2.6,.5,.7,F,.98,P,.14);i.build(t);let r=Sn(.34,.34,.3,.06,20),o=Sn(.16,.16,.34,.04,12),a=[];for(let F of de.bogies)for(let P of[-3,3])for(let z of[-.75,.75]){let G=new Ht;G.position.set(F+z,.86,P),G.rotation.x=ye/2;let $=new zt(r,n.tyre),et=new zt(o,n.hub);$.castShadow=!0,G.add($,et),t.add(G),a.push(G)}let l=new Ht;l.position.set(0,de.hingeY,0),t.add(l);let c=new vs,[h,u]=de.spine,d=de.halfW,f=.36;for(let F of[h+f/2,u-f/2])for(let P of[-d+f/2,d-f/2])c.box(n.white,de.len-1,f,f,-de.len/2-.5,F,P,.1);let p=4.25;for(let F=-2;F>-de.len+.5;F-=p){for(let P of[-d+f/2,d-f/2])c.box(n.white,.28,u-h-f,.28,F,(h+u)/2,P,.08);for(let P of[h+f/2,u-f/2])c.box(n.white,.28,.28,2*d-f,F,P,0,.08);if(F-p>-de.len+.5)for(let P of[-d+f/2,d-f/2])c.bar(n.panel,Zn(F,h+f,P),Zn(F-p,u-f,P),.22,.06)}c.box(n.white,3.2,u-h,2*d,-1.6,(h+u)/2,0,.3);for(let F of[-1.8,1.8])c.box(n.white,1.3,1.2,.45,0,.1,F,.14);for(let F of[-1,1])c.box(n.yellow,1,.8,de.ramZ-d+.5,de.ramTop[0],de.ramTop[1],F*(d+de.ramZ+.5)/2,.12);let v=de.rocketAxis;for(let F of de.cradles)c.box(n.blue,1.1,v-e-u+.35,2.6,F,(u+v-e)/2+.1,0,.18),c.add(n.blue,new ri(e+.32,.3,10,28,ye),We(F,v,0,0,ye/2,ye));c.box(n.blue,6,.1,2*d-.3,-de.len+5,u+.02,0,.04),c.build(l);let g=de.cradles.map(F=>{let P=new Ht;P.position.set(F,v,e+.32);let z=new zt($a("claw",()=>new ri(e+.32,.26,10,28,ye).rotateY(ye/2)),n.blue);return z.position.set(0,0,-(e+.32)),z.castShadow=z.receiveShadow=!0,P.add(z),l.add(P),P}),m=Sn(.42,.42,1,.08,20),_=Sn(.32,.32,1,.06,18),b=Sn(.22,.22,1,.05,16),y=(F,P)=>{let z=new zt(F,P);return z.castShadow=z.receiveShadow=!0,t.add(z),z},M=[-de.ramZ,de.ramZ].map(F=>({z:F,tube:y(m,n.yellow),mid:y(_,n.steel),rod:y(b,n.hub)})),w=Zn(0,1,0),T=(F,P,z,G,$)=>{F.position.copy(P).addScaledVector(z,(G+$)/2),F.scale.set(1,$-G,1),F.quaternion.setFromUnitVectors(w,z)},x=Zn(),E=Zn(),C=Zn(),D={angle:0},N={group:t,pivot:l,HINGE:Zn(0,de.hingeY,0),setAngle(F){D.angle=F,l.rotation.z=-F;let P=Math.cos(F),z=Math.sin(F),[G,$]=de.ramTop;for(let et of M){x.set(de.ramBase[0],de.ramBase[1],et.z),E.set(G*P+$*z,de.hingeY-G*z+$*P,et.z),C.subVectors(E,x);let X=C.length();C.multiplyScalar(1/X),T(et.tube,x,C,-.4,9),T(et.rod,x,C,X-8.6,X+.3);let tt=(9+X-8.6)/2;T(et.mid,x,C,Math.max(.5,tt-4.3),Math.max(1,tt+4.3))}},setClaws(F){for(let P of g)P.rotation.x=(1-Ch(F,0,1))*100*ye/180},roll(F){for(let P of a)P.rotation.y=-F/.34},rocketMatrix(F=new Dt){return l.updateMatrix(),F.copy(l.matrix).multiply(We(de.rocketBase,de.rocketAxis,0,0,0,ye/2))},dims:{len:de.len,hingeY:de.hingeY,rocketBase:de.rocketBase,rocketAxis:de.rocketAxis}};return N.setAngle(0),N.setClaws(1),N}var rn=Math.PI,ja=rn*2,J0=(n,t,e)=>Math.min(e,Math.max(t,n)),j0=(n,t,e)=>n+(t-n)*e,Xd=n=>J0(n,0,1),J2=n=>{let t=Xd(n);return t*t*(3-2*t)},Za=(n=0,t=0,e=0)=>new U(n,t,e),j2=new U,K2=new ve,Q2=new hn,tb=new U,Ze=(n=0,t=0,e=0,i=0,s=0,r=0,o=1,a=1,l=1)=>new Dt().compose(j2.set(n,t,e),K2.setFromEuler(Q2.set(i,s,r)),tb.set(o,a,l)),sn={wall:"#e8ecf7",interior:"#d3d9ee",interiorDeep:"#bcc5e3",wing:"#dce2f3",hub:"#e8ecf6",post:"#98a3c6",pane:"#eef1fb",window:"#9cb2ef",slat:"#dfe4f2",pallet:"#c99a62",tealLight:"#8fdcd2",tealDeep:"#178f83",steel:"#c3cbe3"},WT={aurora:{name:"AURORA",main:pt.blue,light:pt.blueLight,deep:pt.blueDeep,reg:"AU-NBA",mark:"aurora"},kestrel:{name:"KESTREL",main:pt.teal,light:sn.tealLight,deep:sn.tealDeep,reg:"KS-TRL",mark:"kestrel"}},Dh=null;function ci(){return Dh||(Dh={white:gt(pt.white),paintWhite:gt(pt.white,{paint:!0,rough:.5}),panel:gt(pt.panel),wall:gt(sn.wall,{rough:.72}),roof:gt(pt.roof,{rough:.62}),blue:gt(pt.blue,{rough:.5}),blueDeep:gt(pt.blueDeep,{rough:.5}),blueLight:gt(pt.blueLight,{rough:.5}),navy:gt(pt.navy,{rough:.7}),glass:gt(pt.glass,{rough:.16}),shade:gt(pt.shade,{rough:.6}),wing:gt(sn.wing,{paint:!0,rough:.5}),hub:gt(sn.hub,{rough:.42}),steel:gt(sn.steel,{rough:.45}),tyre:gt(pt.navy,{rough:.82}),green:gt(pt.green,{rough:.72}),greenDeep:gt(pt.greenDeep,{rough:.72}),trunk:gt(pt.trunk,{rough:.8}),post:gt(sn.post,{rough:.45}),pane:gt(sn.pane,{opacity:.55,rough:.3}),window:gt(sn.window,{rough:.4}),cardboard:gt(pt.cardboard,{rough:.82}),pallet:gt(sn.pallet,{rough:.85}),slat:gt(sn.slat,{rough:.6}),fan:gt("#2c3a5e",{rough:.5}),room:Oh(sn.interior,Te,.9),roomDeep:Oh(sn.interiorDeep,Te,.9),hold:Oh("#9ba7cc",xi,.85)},Dh)}var kd=new Map;function Oh(n,t,e){let i=`${n}|${t}|${e}`;return kd.has(i)||kd.set(i,new Oe({color:n,roughness:e,side:t})),kd.get(i)}function pr(n){let t=n.index?n.toNonIndexed():n.clone();for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ee(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}var Hd=new Map,gr=(n,t)=>(Hd.has(n)||Hd.set(n,t()),Hd.get(n));function Bh(n,t,e,i=.12,s=32){return gr(`rcyl|${n}|${t}|${e}|${i}|${s}`,()=>{let r=Math.min(i,e/2-.001,Math.min(n,t)-.001),o=[new ct(1e-4,-e/2)],a=(l,c,h,u)=>{for(let d=0;d<=4;d++){let f=j0(h,u,d/4);o.push(new ct(l+r*Math.cos(f),c+r*Math.sin(f)))}};return a(n-r,-e/2+r,-rn/2,0),a(t-r,e/2-r,0,rn/2),o.push(new ct(1e-4,e/2)),new fn(o,s)})}var $d=(n,t=40)=>new fn(n.map(([e,i])=>new ct(e,i)),t),Kn=class{constructor(){this.parts=new Map}add(t,e,i){let s=pr(e);return i&&s.applyMatrix4(i),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(s),this}box(t,e,i,s,r,o,a,l=null,c=0,h=0,u=0){return this.add(t,Be(e,i,s,l??Math.min(e,i,s)*.2),Ze(r,o,a,c,h,u))}flat(t,e,i,s,r,o,a,l=0,c=0,h=0){return this.add(t,gr(`box|${e}|${i}|${s}`,()=>new Ye(e,i,s)),Ze(r,o,a,l,c,h))}cyl(t,e,i,s,r,o,a,l="y",c=.12,h=32){let u=l==="x"?Ze(r,o,a,0,0,-rn/2):l==="z"?Ze(r,o,a,rn/2,0,0):Ze(r,o,a);return this.add(t,Bh(e,i,s,c,h),u)}freeze(){return[...this.parts].map(([t,e])=>({mat:t,geo:Mn(e,!1)}))}build(){return K0(this.freeze())}};function K0(n,t=new Ht){for(let{geo:e,mat:i}of n){let s=new zt(e,i);s.castShadow=!i.transparent&&i.side!==Te,s.receiveShadow=!i.userData.noShadow&&i.side!==Te,t.add(s)}return t}function eb(n,t,e,i,s,r=.06){let o=new U().subVectors(i,e),a=o.length(),l=new ve().setFromUnitVectors(Za(0,1,0),o.multiplyScalar(1/a));n.add(t,Be(s,a,s,r,1),new Dt().compose(e.clone().add(i).multiplyScalar(.5),l,Za(1,1,1)))}var Bi=n=>{let t=null;return()=>t??=n()};var mr={R:3.5,Yc:6,nose:23,tail:-23,noseLen:6.5,tailLen:12.5,capLen:.9,rEnd:.72,droop:1.15,up:.6},X0=3.2,$0=5,nb=2.4,ib=2.4;function go(n){let{R:t,Yc:e,nose:i,tail:s,noseLen:r,tailLen:o,capLen:a,rEnd:l,droop:c,up:h}=mr,u=i-r,d=s+o,f=s+a;if(n>=u){let v=Xd((n-u)/r);return{r:t*Math.pow(Math.max(0,1-Math.pow(v,2.3)),1/2.3),yc:e-c*Math.pow(v,1.6)}}if(n>=d)return{r:t,yc:e};if(n>=f){let v=J2((d-n)/(d-f)),g=t-(t-l)*v;return{r:g,yc:e+t-h*v-g}}let p=Xd((f-n)/a);return{r:l*Math.sqrt(Math.max(0,1-p*p)),yc:e+t-h-l}}function sb(n){let e=go(n-.004),i=go(n+.004);return{dr:(i.r-e.r)/(2*.004),dy:(i.yc-e.yc)/(2*.004)}}var Uh=n=>Math.acos(J0((n-mr.Yc)/mr.R,-1,1)),zh={cargoTop:Uh(X0+nb),cargoSill:Uh(X0),paxSill:Uh($0),paxTop:Uh($0+ib)},rb=[{x0:9.25,x1:12},{x0:-10.25,x1:-7.5}];var Ka=Bi(()=>{let{nose:n,tail:t,noseLen:e,tailLen:i,capLen:s}=mr,r=t+s,o=t+i,a=n-e,l=[],c=12;for(let _=0;_<c;_++)l.push(r-s*Math.cos(_/c*rn/2));let h=Math.ceil((o-r)/.25);for(let _=0;_<h;_++)l.push(r+(o-r)*_/h);let u=Math.round((a-o)/.25);for(let _=0;_<u;_++)l.push(o+.25*_);let d=36;for(let _=0;_<=d;_++)l.push(a+e*Math.sin(_/d*rn/2));let f=[],p=128;for(let _=0;_<=p;_++)f.push(_/p*ja);for(let _ of[zh.cargoTop,zh.cargoSill]){let b=0;for(let y=1;y<f.length;y++)Math.abs(f[y]-_)<Math.abs(f[b]-_)&&(b=y);Math.abs(f[b]-_)<.012?f[b]=_:f.push(_)}f.sort((_,b)=>_-b);let v=[0];for(let _=1;_<l.length;_++)v.push(v[_-1]+Math.hypot(l[_]-l[_-1],go(l[_]).r-go(l[_-1]).r));let g=v[v.length-1];return{xs:l,ths:f,S:v,Stot:g,uOf:_=>{if(_<=l[0])return 0;for(let b=1;b<l.length;b++)if(_<=l[b])return j0(v[b-1],v[b],(_-l[b-1])/(l[b]-l[b-1]))/g;return 1}}});function Nh(n,t,e,i,{dr:s=0,flip:r=!1,skip:o=null}={}){let{xs:a,ths:l,S:c,Stot:h}=Ka(),u=t-n+1,d=i-e+1,f=new Float32Array(u*d*3),p=new Float32Array(u*d*3),v=new Float32Array(u*d*2);for(let _=0;_<u;_++){let b=a[n+_],{r:y,yc:M}=go(b),{dr:w,dy:T}=sb(b),x=Math.max(0,y+s);for(let E=0;E<d;E++){let C=l[e+E],D=Math.cos(C),N=Math.sin(C),F=_*d+E;f.set([b,M+x*D,x*N],F*3);let P=-w-D*T,z=Math.hypot(P,D,N),G=r?-1:1;p.set([G*P/z,G*D/z,G*N/z],F*3),v.set([c[n+_]/h,C/ja],F*2)}}let g=[];for(let _=0;_<u-1;_++)for(let b=0;b<d-1;b++){if(o&&o(n+_,e+b))continue;let y=_*d+b,M=(_+1)*d+b;r?g.push(y,M,M+1,y,M+1,y+1):g.push(y,M+1,M,y,y+1,M+1)}let m=new ge;return m.setAttribute("position",new Ee(f,3)),m.setAttribute("normal",new Ee(p,3)),m.setAttribute("uv",new Ee(v,2)),m.setIndex(g),m}var q0=n=>Ka().xs.findIndex(t=>Math.abs(t-n)<1e-6),Y0=n=>Ka().ths.findIndex(t=>Math.abs(t-n)<1e-9);function Z0(n,t){let e=[];for(let s=0;s<n.length-1;s++)e.push(...n[s],...t[s],...t[s+1],...n[s],...t[s+1],...n[s+1]);let i=new ge;return i.setAttribute("position",new Qt(e,3)),i.computeVertexNormals(),i}var Fh=(n,t,e)=>{let{r:i,yc:s}=go(n);return[n,s+(i+e)*Math.cos(t),(i+e)*Math.sin(t)]};function Gd(n,t,e,i,s){let{xs:r,ths:o}=Ka(),a=[],l=[],c=[],h=[];for(let u=n;u<=t;u++)a.push(Fh(r[u],o[e],s)),l.push(Fh(r[u],o[i],s));for(let u=e;u<=i;u++)h.push(Fh(r[n],o[u],s)),c.push(Fh(r[t],o[u],s));return{top:a,sill:l,fwd:c,aft:h}}var XT=Bi(()=>{let{xs:n,ths:t}=Ka(),e=rb.map(({x0:a,x1:l})=>({i0:q0(a),i1:q0(l),j0:Y0(zh.cargoTop),j1:Y0(zh.cargoSill)})),i=(a,l)=>e.some(c=>a>=c.i0&&a<c.i1&&l>=c.j0&&l<c.j1),s=Nh(0,n.length-1,0,t.length-1,{skip:i}),r=[],o=e.map(a=>{let l=Gd(a.i0,a.i1,a.j0,a.j1,0),c=Gd(a.i0,a.i1,a.j0,a.j1,-1.1);for(let m of["top","sill","fwd","aft"])r.push(pr(Z0(l[m],c[m])));r.push(pr(Nh(a.i0,a.i1,a.j0,a.j1,{dr:-1.1})));let h=Nh(a.i0,a.i1,a.j0,a.j1),u=Gd(a.i0,a.i1,a.j0,a.j1,-.12),d=[pr(Nh(a.i0,a.i1,a.j0,a.j1,{dr:-.12,flip:!0}))];for(let m of["top","sill","fwd","aft"])d.push(pr(Z0(l[m],u[m])));let f=t[a.j0],p=Za(0,mr.Yc+mr.R*Math.cos(f),mr.R*Math.sin(f)),v=new Dt().makeTranslation(-p.x,-p.y,-p.z);h.applyMatrix4(v);let g=Mn(d,!1);return g.applyMatrix4(v),{outer:h,lining:g,hinge:p}});return{fuselage:s,hold:Mn(r,!1),panels:o}});var Q0={main:{x:-1,y:3.62,z:3.95,axle:.82},nose:{x:18.2,y:2.6,axle:.55}},ob=(n,t)=>gr(`tyre|${n}|${t}`,()=>{let e=n*.56,i=t*.32,s=[[e,-t/2]];for(let r=0;r<=5;r++){let o=-rn/2+r/5*(rn/2);s.push([n-i+i*Math.cos(o),-t/2+i+i*Math.sin(o)])}for(let r=0;r<=5;r++){let o=r/5*(rn/2);s.push([n-i+i*Math.cos(o),t/2-i+i*Math.sin(o)])}return s.push([e,t/2]),$d(s,36).applyMatrix4(Ze(0,0,0,rn/2,0,0))});function Ja(n,t,e,i,s,r){n.add(ci().tyre,ob(t,e),Ze(i,s,r)),n.add(ci().hub,Bh(t*.58,t*.58,e*.82,.06,28),Ze(i,s,r,rn/2,0,0)),n.add(ci().steel,Bh(t*.22,t*.22,e*.92,.04,20),Ze(i,s,r,rn/2,0,0))}var $T=Bi(()=>{let n=ci(),t=new Kn,{y:e,axle:i}=Q0.main,s=e-i;return t.cyl(n.steel,.24,.24,s+.2,0,-s/2,0,"y",.08,20),t.box(n.steel,.42,.34,1,0,-s,0,.12),t.box(n.steel,.16,1.2,.16,.34,-s*.55,0,.06,0,0,.5),Ja(t,.82,.62,0,-s,-.46),Ja(t,.82,.62,0,-s,.46),t.freeze()}),qT=Bi(()=>{let n=ci(),t=new Kn,{y:e,axle:i}=Q0.nose,s=e-i;return t.cyl(n.steel,.18,.18,s+.2,0,-s/2,0,"y",.06,18),t.box(n.steel,.3,.26,.7,0,-s,0,.1),Ja(t,.55,.42,0,-s,-.34),Ja(t,.55,.42,0,-s,.34),t.freeze()}),YT=Bi(()=>{let n=new Kn;n.add(ci().paintWhite,$d([[.56,-.66],[.53,-.44],[.41,-.22],[.22,-.08],[.01,-.02]]),Ze(0,0,0,0,0,-rn/2));for(let t=0;t<16;t++){let e=t/16*ja,i=Ze(0,0,0,e,0,0).multiply(Ze(-.58,.98,0,0,.55,0));n.add(ci().fan,gr("blade",()=>new Ye(.1,.88,.3)),i)}return n.freeze()});function Vd(n,t,e,i,s,r,{pitch:o=.78,w:a=.17,d:l=.07,gaps:c=[],y0:h=0}={}){let u=Math.floor((s-i)/o),d=(s-i-u*o)/2;for(let f=0;f<=u;f++){let p=i+d+f*o;if(p<i+.25||p>s-.25)continue;let v=h;for(let[m,_,b]of c)p>m&&p<_&&(v=Math.max(v,b));let g=r(p)-.05;g-v<.15||n.add(t,gr(`rib|${a}|${l}`,()=>new Ye(a,1,l)),e.clone().multiply(Ze(p,(v+g)/2,l/2,0,0,0,1,g-v,1)))}}function Wd(n,t=[],e=.4){let i=new un(n.map(([r,o])=>new ct(r,o)));for(let[r,o,a,l]of t)i.holes.push(new Ni([new ct(r,o),new ct(a,o),new ct(a,l),new ct(r,l)]));let s=new dn(i,{depth:e,bevelEnabled:!1,curveSegments:4});return s.translate(0,0,-e),s}var ab=(n,t)=>gr(`shutter|${n}|${t}`,()=>{let e=[pr(new Ye(n,t,.08))];for(let i=.3;i<t-.1;i+=.42)e.push(pr(new Ye(n,.07,.12)).translate(0,i-t/2,0));return Mn(e,!1)}),ZT=Bi(()=>{let n=t=>{let e=new Oe({color:t,roughness:.82});return e.userData.noShadow=!0,e};return{cardboard:n(pt.cardboard),pallet:n(sn.pallet)}});var wn={floor:5,rotR:2.5,pivotX:2.3,LA:10.5,LB:10,gap:.4,ov:1.4,cj:.4,front:3.45,hRange:[3,7.4],wA:2.9,hA:3.05,wB:3.3,hB:3.4},JT=Bi(()=>{let n=ci(),t=new Kn;t.box(n.panel,2.6,.4,2.6,0,.2,0,.14),t.cyl(n.panel,.78,.7,wn.floor-.5,0,(wn.floor-.5)/2+.3,0,"y",.12),t.cyl(n.white,wn.rotR,wn.rotR,3.5,0,wn.floor-.4+1.75,0,"y",.3,40),t.cyl(n.blue,wn.rotR+.08,wn.rotR+.08,.55,0,wn.floor-.12,0,"y",.2,40),t.cyl(n.blue,wn.rotR+.16,wn.rotR+.1,.5,0,wn.floor+3.25,0,"y",.2,40);let e=(o,a,l,c)=>{let h=new Kn,u=-.25-(l-wn.hA)/2;return h.box(c,o,l,a,o/2,u+l/2,0,.32),h.box(n.blue,o+.02,.55,a+.06,o/2,u+.3,0,.2),h.box(n.glass,o-1.2,.56,a+.05,o/2,u+l*.62,0,.16),h.freeze()},i=new Kn;i.box(n.blue,3,3.6,3.9,1.15,-.3+1.8,0,.36),i.box(n.glass,1.3,1.1,3.94,2,2.05,0,.18);for(let o=0;o<3;o++)i.box(n.navy,.26,3.5-o*.12,3.75-o*.12,2.75+o*.24,-.3+1.8,0,.12);i.box(n.navy,.18,.5,3,3.36,-.12,0,.08);let s=new Kn;s.box(n.blue,.8,.55,3.1,0,1.05,0,.18);for(let o of[-1.05,1.05])Ja(s,.6,.48,0,.6,o);let r=new Kn;for(let o of[-.85,.85])r.box(n.blue,.42,1,.42,0,.5,o,.08);return{rot:t.freeze(),A:e(wn.LA,wn.wA,wn.hA,n.white),B:e(wn.LB,wn.wB,wn.hB,n.panel),cab:i.freeze(),col:s.freeze(),post:r.freeze()}});var jT=Bi(()=>{let n=ci(),t=new Kn;t.box(n.white,10,4.6,10,0,2.3,0,.5),t.box(n.blue,10.3,.6,10.3,0,4.5,0,.24),t.box(n.glass,3.2,2.6,.3,0,1.3,5.02,.12),t.box(n.blue,3.8,.4,.5,0,2.75,5.05,.14),t.cyl(n.white,2.35,2.2,21,0,4.8+10.5,0,"y",.3,40);for(let i of[10,16,22])t.cyl(n.blue,2.42,2.42,.45,0,i,0,"y",.16,40);for(let i=7;i<24;i+=3)t.box(n.glass,.7,1.1,.3,0,i+1.2,2.25,.12);t.add(n.white,$d([[2.2,25.6],[2.6,26.3],[3.6,27.1],[4.4,27.6]],40)),t.cyl(n.blue,4.9,4.9,.72,0,27.95,0,"y",.26,40);let e=10;t.add(n.glass,new Ve(4.85,4.35,3.3,e,1,!0),Ze(0,28.3+1.65,0));for(let i=0;i<e;i++){let s=i/e*ja;eb(t,n.white,Za(Math.sin(s)*4.38,28.25,Math.cos(s)*4.38),Za(Math.sin(s)*4.9,31.65,Math.cos(s)*4.9),.24)}return t.cyl(n.blue,5.3,5.3,.75,0,31.9,0,"y",.3,40),t.cyl(n.white,2.4,2.1,1.4,0,33,0,"y",.25,32),t.cyl(n.panel,.16,.12,3,.8,35,.6,"y",.05,12),t.box(n.white,3,.3,.7,-.6,34.1,-.2,.12),t.box(n.blue,.5,.5,.5,-.6,33.85,-.2,.12),t.freeze()});var lb={W:64,D:52,eave:11,top:24,doorW:50,doorH:15.5},KT=Bi(()=>{let n=ci(),t=new Kn,{W:e,D:i,eave:s,top:r,doorW:o,doorH:a}=lb,l=r-s,c=(Math.pow(e/2,2)+l*l)/(2*l),h=r-c,u=M=>h+Math.sqrt(Math.max(0,c*c-M*M)),d=Math.asin(e/2/c),f=[[-e/2,0],[e/2,0],[e/2,s]];for(let M=1;M<40;M++){let w=e/2-e*M/40;f.push([w,u(w)])}f.push([-e/2,s]),t.add(n.wall,Wd(f,[[-o/2,0,o/2,a]],.5)),Vd(t,n.wall,new Dt,-e/2,e/2,u,{gaps:[[-o/2-.9,o/2+.9,a+.9]],pitch:.82});let p=Ze(0,0,-i,0,rn,0);t.add(n.wall,Wd(f.map(([M,w])=>[M,w]),[],.5),p),Vd(t,n.wall,p,-e/2,e/2,u,{pitch:.82});for(let M of[-1,1]){let w=Ze(M*e/2,0,-i/2,0,M*rn/2,0);t.add(n.wall,Wd([[-i/2,0],[i/2,0],[i/2,s],[-i/2,s]],[],.5),w),Vd(t,n.wall,w,-i/2,i/2,()=>s,{pitch:.82});for(let T=-i+5;T<-3;T+=4.4)t.box(n.window,.3,1.5,3,M*e/2+M*.08,s-2.4,T,.12)}let v=(M,w,T)=>{let x=new un;return x.absarc(0,h,w,rn/2-T,rn/2+T,!1),x.absarc(0,h,M,rn/2+T,rn/2-T,!0),x},g=new dn(v(c-.1,c+.25,d+.012),{depth:i+1.2,bevelEnabled:!1,curveSegments:72});g.translate(0,0,-i-.6),t.add(n.roof,g);let m=new dn(v(c+.2,c+.36,d+.01),{depth:.24,bevelEnabled:!1,curveSegments:72});for(let M=-i-.2;M<.3;M+=1)t.add(n.roof,m,Ze(0,0,M));let _=new dn(v(c-.35,c+.55,d+.03),{depth:.6,bevelEnabled:!1,curveSegments:72});t.add(n.blueDeep,_,Ze(0,0,.2)),t.add(n.blueDeep,_,Ze(0,0,-i-.8));for(let[M,w]of[[-e/2,0],[e/2,0],[-e/2,-i],[e/2,-i]])t.box(n.blue,.8,s+.3,.8,M,s/2,w,.24);let b=.9;for(let M of[-1,1])t.box(n.blue,b,a+b,.7,M*(o/2+b/2-.05),(a+b)/2,.25,.28);t.box(n.blue,o+2*b,b,.7,0,a+b/2,.25,.28);for(let M of[-1,1]){let w=M*(o/2+3.4);t.add(n.shade,ab(6,a-.3),Ze(w,(a-.3)/2+.05,.62)),t.box(n.blue,6.3,.4,.36,w,a-.1,.66,.12),t.box(n.blue,6.3,.34,.36,w,.2,.66,.12);for(let T of[-1,1])t.box(n.blue,.3,a-.2,.36,w+T*3,a/2,.66,.1)}let y=new dn(new un(f.map(([M,w])=>new ct(M*.97,w*.97+.01))),{depth:i-1.2,bevelEnabled:!1,curveSegments:4});return t.add(Oh("#a8b2d6",Te,.9),y,Ze(0,0,-i+.6)),t.freeze()});var QT=Bi(()=>{let n=ci(),t=new Kn;return t.box(n.panel,1.9,.7,1.9,0,.35,0,.22),t.cyl(n.white,.58,.4,22.6,0,.7+11.3,0,"y",.14,24),t.cyl(n.blue,.5,.5,.5,0,6,0,"y",.16,24),t.cyl(n.panel,1.5,1.5,.24,0,22.4,0,"y",.1,28),t.box(n.blue,4.4,2,.9,0,23.7,.35,.3,.32,0,0),t.box(n.blue,.4,1.2,.4,0,22.9,0,.12),t.freeze()});var Vs={trunkH:2.7,trunkR:.2,crown:[2,2.55,2],bush:[1.8,1.15,1.8]},cb=Bi(()=>({trunk:Bh(Vs.trunkR,Vs.trunkR*.75,Vs.trunkH+.6,.05,12).clone().translate(0,(Vs.trunkH+.6)/2,0),crown:new en(1,32,22).scale(...Vs.crown).translate(0,Vs.trunkH+Vs.crown[1]*.92,0),bush:new en(1,28,14,0,ja,0,rn/2).scale(...Vs.bush)}));function tm(n){let t=ci(),e=cb(),i=new Ht;i.name="trees";let s=n.filter(a=>(a.kind??"tree")==="tree"),r=n.filter(a=>a.kind==="bush"),o=(a,l,c)=>{if(!c.length)return;let h=new _n(a,l,c.length);c.forEach((u,d)=>h.setMatrixAt(d,Ze(u.x,0,u.z,0,u.rot??0,0,u.size??1,u.size??1,u.size??1))),h.castShadow=h.receiveShadow=!0,h.computeBoundingSphere(),i.add(h)};return o(e.trunk,t.trunk,s),o(e.crown,t.green,s),o(e.bush,t.greenDeep,r),i}function em({length:n=30}={}){let t=ci(),e=Math.max(1,Math.round(n/3)),i=n/e,s=gr(`fence|${e}|${i.toFixed(3)}`,()=>{let o=new Kn,a=2.4;for(let l=0;l<=e;l++)o.box(t.post,.2,a+.1,.2,-n/2+l*i,(a+.1)/2,0,.07);o.box(t.post,n+.1,.12,.12,0,a,0,.05),o.box(t.post,n+.1,.12,.12,0,.18,0,.05);for(let l=0;l<e;l++)o.box(t.pane,i-.2,a-.32,.05,-n/2+(l+.5)*i,a/2+.09,0,.02);return o.freeze()}),r=K0(s);return r.name="fence",r}var Re=Math.PI,om=(n,t,e)=>Math.min(e,Math.max(t,n));var xo=(n,t)=>new ct(n,t),kn=(n,t,e)=>new U(n,t,e),Qd={ink:"#1d2231",tyre:"#1f2433",hub:"#c9cfdf",hubCap:"#8a94b0",chassis:"#2b3248",bumper:"#e8ecf6",lamp:"#fbf1d4",steel:"#a9b3cf",tealLight:"#8fe0d4",text:"#1d2748",tagline:"#6b78a3"},Mi=Qd,nm={aurora:{accent:pt.blue,deep:pt.blueDeep,light:pt.blueLight,cab:pt.blue,mark:"aurora",name:"Aurora",frame:!0},kestrel:{accent:pt.teal,deep:"#178f83",light:Mi.tealLight,cab:pt.white,mark:"kestrel",name:"Kestrel",frame:!1,stripe:pt.teal},plain:{accent:pt.blue,deep:pt.blueDeep,light:pt.blueLight,cab:pt.blue,mark:null,name:null,frame:!0}},am=n=>nm[n]??nm.aurora,Si=(n,t=.5)=>gt(n,{paint:!0,rough:t}),kh=null;function bo(){if(kh)return kh;let n=(t,e,i,s=.35)=>new Oe({color:t,roughness:s,emissive:e,emissiveIntensity:i});return kh={white:Si(pt.white),panel:Si(pt.panel),blue:Si(pt.blue,.48),yellow:Si(pt.yellow,.5),ink:gt(Mi.ink,{rough:.62}),chassis:gt(Mi.chassis,{rough:.66}),tyre:gt(Mi.tyre,{rough:.82}),hub:gt(Mi.hub,{rough:.42}),hubCap:gt(Mi.hubCap,{rough:.45,metal:.1}),glass:gt(pt.glass,{paint:!0,rough:.12}),bumper:Si(Mi.bumper),steel:gt(Mi.steel,{rough:.42,metal:.25}),rubber:gt("#2a2f40",{rough:.85}),lamp:n(Mi.lamp,"#fff1c8",.22,.3),tail:n("#f0656a",pt.red,.35,.3),beacon:n("#ffb072","#ff7a1f",.9,.3),cone:Si(pt.orange,.52)},kh}var Qa=new Map;function el(n,t,e,i,{repeat:s=!1}={}){if(Qa.has(n))return Qa.get(n);let r=document.createElement("canvas");r.width=t,r.height=e,i(r.getContext("2d"),t,e);let o=new Ui(r);return o.colorSpace=Fe,o.anisotropy=8,s&&(o.wrapS=o.wrapT=fi),Qa.set(n,o),o}var qd=new Map;function nl(n,{rough:t=.5,opaque:e=!1}={}){let i=n.uuid+t+e;if(qd.has(i))return qd.get(i);let s=new Oe({map:n,roughness:t,transparent:!e,depthWrite:e,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4});return s.userData.noCast=!0,qd.set(i,s),s}var yo='Inter, "Segoe UI", system-ui, sans-serif';function hb(n,t,e,i,s,r){if(n.save(),t==="aurora")n.fillStyle=r.accent,n.beginPath(),n.roundRect(e,i,s,s,s*.26),n.fill(),n.fillStyle="rgba(255,255,255,0.28)",n.beginPath(),n.roundRect(e+s*.5,i,s*.5,s,[0,s*.26,s*.26,0]),n.fill(),n.strokeStyle="#ffffff",n.lineCap="round",n.lineWidth=s*.1,n.beginPath(),n.arc(e+s*.5,i+s*.7,s*.27,Re*1.08,Re*1.92),n.stroke(),n.beginPath(),n.moveTo(e+s*.2,i+s*.72),n.lineTo(e+s*.8,i+s*.72),n.stroke(),n.fillStyle="#ffffff",n.beginPath(),n.arc(e+s*.5,i+s*.7,s*.1,Re,0),n.fill();else if(t==="kestrel"){let o=(a,l)=>{n.fillStyle=l,n.beginPath(),n.moveTo(e+a,i+s*.78),n.lineTo(e+a+s*.32,i+s*.22),n.lineTo(e+a+s*.5,i+s*.5),n.lineTo(e+a+s*.68,i+s*.22),n.lineTo(e+a+s*1,i+s*.78),n.lineTo(e+a+s*.82,i+s*.78),n.lineTo(e+a+s*.68,i+s*.52),n.lineTo(e+a+s*.5,i+s*.82),n.lineTo(e+a+s*.32,i+s*.52),n.lineTo(e+a+s*.18,i+s*.78),n.closePath(),n.fill()};o(0,r.accent),o(s*.24,r.deep)}else if(t==="cube"){let o=e+s/2,a=s*.46;n.fillStyle=r.light,n.beginPath(),n.moveTo(o,i+s*.04),n.lineTo(o+a,i+s*.27),n.lineTo(o,i+s*.5),n.lineTo(o-a,i+s*.27),n.closePath(),n.fill(),n.fillStyle=r.accent,n.beginPath(),n.moveTo(o-a,i+s*.27),n.lineTo(o,i+s*.5),n.lineTo(o,i+s*.98),n.lineTo(o-a,i+s*.74),n.closePath(),n.fill(),n.fillStyle=r.deep,n.beginPath(),n.moveTo(o+a,i+s*.27),n.lineTo(o,i+s*.5),n.lineTo(o,i+s*.98),n.lineTo(o+a,i+s*.74),n.closePath(),n.fill()}n.restore()}function ub(n,{fg:t=Mi.text,bg:e=null,weight:i=800,px:s=96,pad:r=26}={}){let o=`txt|${n}|${t}|${e}|${i}|${s}`;if(Qa.has(o))return Qa.get(o);let a=document.createElement("canvas").getContext("2d");a.font=`${i} ${s}px ${yo}`;let l=Math.ceil(a.measureText(n).width+r*2),c=Math.ceil(s*1.3+r);return el(o,l,c,h=>{e&&(h.fillStyle=e,h.beginPath(),h.roundRect(0,0,l,c,c*.22),h.fill()),h.fillStyle=t,h.font=`${i} ${s}px ${yo}`,h.textAlign="center",h.textBaseline="middle",h.fillText(n,l/2,c/2+s*.04)})}var im=new Map,ys=(n,t)=>{let e=im.get(n);return e||im.set(n,e=t()),e};function jd(n,t,e,i){return i=i??Math.min(n,t,e)*.2,i=Math.min(i,Math.min(n,t,e)/2-.001),i<.006?ys(`b|${n}|${t}|${e}`,()=>new Ye(n,t,e)):Be(n,t,e,i,3)}var Kd=(n,t,e,i=20)=>ys(`cy|${n}|${t}|${e}|${i}`,()=>new Ve(n,t,e,i));var db=n=>ys(`dome|${n}`,()=>new en(n,18,8,0,Re*2,0,Re/2)),fb=(n,t)=>ys(`pl|${n.toFixed(3)}|${t.toFixed(3)}`,()=>new Xn(n,t));function tf(n,t,e,i,{arches:s=[],rc:r=[.15,.15,.15,.15]}={},o=0){n+=o,t-=o,e+=o,i-=o;let[a,l,c,h]=r.map(d=>Math.max(.02,d-o)),u=new un;u.moveTo(n+a,e);for(let[d,f,p]of[...s].sort((v,g)=>v[0]-g[0])){let v=p+o,g=Math.asin(om((e-f)/v,-1,1));u.lineTo(d-v*Math.cos(g),e),u.absarc(d,f,v,Re-g,g,!0)}return u.lineTo(t-l,e),u.absarc(t-l,e+l,l,-Re/2,0,!1),u.lineTo(t,i-c),u.absarc(t-c,i-c,c,0,Re/2,!1),u.lineTo(n+h,i),u.absarc(n+h,i-h,h,Re/2,Re,!1),u.lineTo(n,e+a),u.absarc(n+a,e+a,a,Re,Re*1.5,!1),u}function ef(n,t,e,i=.12){return ys(`ex|${n}|${e}|${i}`,()=>{let s=new dn(t(),{depth:Math.max(.002,e-2*i),bevelEnabled:i>0,bevelThickness:i,bevelSize:i,bevelSegments:4,curveSegments:20});return s.translate(0,0,-(e-2*i)/2),s})}var Yd=new Dt,vo=new ve,sm=new hn,pb=new U,Zd=new U,mb=["position","normal","uv"];function gb(n){let t=n.index?n.toNonIndexed():n.clone();for(let e of Object.keys(t.attributes))mb.includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ee(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}var il=class{constructor(){this.map=new Map}put(t,e,i){let s=gb(e);return s.applyMatrix4(i),this.map.has(t)||this.map.set(t,[]),this.map.get(t).push(s),this}add(t,e,i=0,s=0,r=0,o=0,a=0,l=0,c=1,h=1,u=1){return sm.set(o,a,l),vo.setFromEuler(sm),this.put(t,e,Yd.compose(pb.set(i,s,r),vo,Zd.set(c,h,u)))}ext(t,e,i,s,r,o,a,l){return this.add(t,jd(i-e,r-s,a-o,l),(e+i)/2,(s+r)/2,(o+a)/2)}pair(t,e,i,s,r,o,a,l){return this.ext(t,e,i,s,r,o,a,l),this.ext(t,e,i,s,r,-a,-o,l)}cyl(t,e,i,s,r,o,a,l="y",c=20){let h=Kd(e,i,s,c);return l==="x"?this.add(t,h,r,o,a,0,0,-Re/2):l==="z"?this.add(t,h,r,o,a,Re/2,0,0):this.add(t,h,r,o,a)}rod(t,e,i,s=.05,r=10){let o=kn(...e),a=kn(...i).sub(o),l=a.length();return vo.setFromUnitVectors(kn(0,1,0),a.clone().normalize()),this.put(t,Kd(s,s,l,r),Yd.compose(o.addScaledVector(a,.5),vo,Zd.set(1,1,1)))}bar(t,e,i,s=.12){let r=kn(...e),o=kn(...i).sub(r),a=o.length();return vo.setFromUnitVectors(kn(0,1,0),o.clone().normalize()),this.put(t,jd(s,a+s,s,s*.4),Yd.compose(r.addScaledVector(o,.5),vo,Zd.set(1,1,1)))}print(t,e,i,s,r,o,a=0,l=0){return this.add(t,fb(e,i),s,r,o,l,a,0)}text(t,e,i,s,r,o,a=0){let l=ub(t,e),c=l.image.width/l.image.height;return this.print(nl(l),i*c,i,s,r,o,a)}beacon(t,e,i,s=.14){let r=bo();return this.cyl(r.ink,s*1.05,s*1.15,s*.5,t,e+s*.25,i,"y",18),this.add(r.beacon,db(s),t,e+s*.5,i)}merged(){return[...this.map].map(([t,e])=>[t,Mn(e,!1)])}},rm=new Map;function nf(n,t,e=new Ht){let i=rm.get(n);if(!i){let s=new il;t(s),i=s.merged(),rm.set(n,i)}for(let[s,r]of i){let o=new zt(r,s);o.castShadow=!s.userData.noCast,o.receiveShadow=!0,e.add(o)}return e}var tl=(n,t,e)=>{let i=new zt(n,t);return i.castShadow=i.receiveShadow=!0,e&&e.add(i),i};function xb(n,t){return ys(`tyre|${n}|${t}`,()=>{let e=n*.54,i=t/2,s=Math.min(i*.78,(n-e)*.62),r=[xo(e,-i*.84),xo((e+n-s)/2,-i*1)];for(let a=0;a<=7;a++){let l=-Re/2+Re/2*(a/7);r.push(xo(n-s+s*Math.cos(l),-i+s+s*Math.sin(l)))}for(let a=0;a<=7;a++){let l=Re/2*(a/7);r.push(xo(n-s+s*Math.cos(l),i-s+s*Math.sin(l)))}r.push(xo((e+n-s)/2,i*1),xo(e,i*.84));let o=new fn(r,44);return o.rotateX(Re/2),o})}function vb(n,t){return ys(`hub|${n}|${t}`,()=>{let e=new il,i=n*.54;return e.cyl(null,i+.004,i+.004,t*.76,0,0,0,"z",36),e.cyl(null,i*.8,i*.86,t*.84,0,0,0,"z",32),Mn(e.map.get(null),!1)})}function yb(n,t){return ys(`cap|${n}|${t}`,()=>{let e=new il,i=n*.54;e.cyl(null,i*.3,i*.3,t*.9,0,0,0,"z",24);for(let s=0;s<5;s++){let r=s/5*Re*2;e.cyl(null,i*.075,i*.075,t*.88,Math.cos(r)*i*.55,Math.sin(r)*i*.55,0,"z",8)}return Mn(e.map.get(null),!1)})}function _b(n,t){let e=bo(),i=new Ht;return tl(xb(n,t),e.tyre,i),tl(vb(n,t),e.hub,i),tl(yb(n,t),e.hubCap,i),i.userData.r=n,i}function _o(n,t,e,i,s,r,o=null){for(let a of[-1,1]){let l=_b(e,i);if(o){let c=new Ht;c.position.set(s,e,a*r),c.add(l),n.add(c),o.push(c)}else l.position.set(s,e,a*r),n.add(l);t.push(l)}}var sf=n=>t=>{for(let e of n)e.rotation.z=-t/e.userData.r},rf=n=>t=>{for(let e of n)e.rotation.y=t},Jd=new U;function bb(n,{x0:t,x1:e,y0:i=.62,top:s,W:r,color:o,wheelX:a,wheelR:l,stripe:c=null,seam:h}){let u=bo(),d=.17,f=[t,e,i,s,r,a,l].join("|");n.add(Si(o,.46),ef(`cab|${f}`,()=>tf(t,e,i,s,{arches:[[a,l,l+.15]],rc:[.14,.34,.44,.34]},d),r,d));let p=r/2,v=s-i,g=Math.min(s-.12*v,s-.46),m=s-.5*v;n.ext(u.glass,e-.08,e+.035,m,g,-p+.27,p-.27,.05);for(let M of[-1,1])n.ext(u.glass,e-Math.min(1.62,(e-t)*.56),e-.34,m,g,M>0?p-.06:-p-.035,M>0?p+.035:-p+.06,.05),n.ext(Si(h),e-Math.min(1.8,(e-t)*.62),e-Math.min(1.76,(e-t)*.62)+.04,i+.85,s-.3,M>0?p-.02:-p-.012,M>0?p+.012:-p+.02,.008),n.ext(u.ink,e-1.45,e-1.15,m-.3,m-.22,M>0?p-.02:-p-.04,M>0?p+.04:-p+.02,.02),n.bar(u.ink,[e-.2,g-.25,M*(p-.05)],[e-.05,g-.25,M*(p+.36)],.07),n.ext(u.ink,e-.12,e+.02,g-.95,g-.12,M*(p+.32)-.1,M*(p+.32)+.1,.05),c&&n.ext(Si(c,.46),t+.22,e-.3,m-.55,m-.33,M>0?p-.02:-p-.02,M>0?p+.02:-p+.02,.01);let _=i+.18*v,b=m-.07*v;n.ext(u.ink,e-.06,e+.04,_,b,-.92,.92,.06);let y=5;for(let M=0;M<y;M++)n.ext(u.bumper,e+.01,e+.065,_+(b-_)*(M+.55)/(y+.1)-.03,_+(b-_)*(M+.55)/(y+.1)+.03,-.8,.8,.02);for(let M of[-1,1])n.ext(u.lamp,e-.05,e+.045,_,_+.1*v,M>0?p-.62:-p+.2,M>0?p-.2:-p+.62,.06);n.ext(u.bumper,e-.3,e+.28,i-.06,i+.56,-p-.08,p+.08,.2)}function lm({livery:n="aurora"}={}){let t=am(n),e=bo(),i=new Ht,s=3.4,r=.66,o=-4.85,a=2.75,l=1.45,c=4.2,h=3.4,u=kn(-5.2,3,0);nf(`fuel|${n}`,N=>{bb(N,{x0:3.1,x1:5.6,top:3.95,W:s,color:t.cab,wheelX:4.2,wheelR:r,stripe:t.stripe,seam:t.cab===pt.white?pt.shade:pt.blueDeep}),N.ext(e.chassis,-5.5,3.2,.85,1.48,-1,1,.08),N.ext(e.white,o,a,l,c,-h/2,h/2,.8);let F=a-o-1.7;for(let P of[-1,1]){let z=el(`fuel-side|${n}|${P}`,2048,320,(G,$,et)=>{G.fillStyle=t.accent,G.fillRect(0,et*.58,$,et*.42),G.fillStyle=t.light,G.fillRect(0,et*.44,$,et*.08);let X=P<0,tt=et*.4;G.font=`800 ${et*.3}px ${yo}`;let nt="JET A-1",St=G.measureText(nt).width,yt=X?$*.06:$*.94-St-tt-30;t.mark&&hb(G,t.mark,yt,et*.02,tt,t),G.fillStyle=Mi.text,G.textBaseline="middle",G.fillText(nt,yt+tt+30,et*.22),G.fillStyle="#ffffff",G.font=`800 ${et*.2}px ${yo}`;let jt=`${(t.name??"Aurora").toUpperCase()} FUEL`,$t=G.measureText(jt).width;G.fillText(jt,X?$*.94-$t:$*.06,et*.79)});N.print(nl(z),F,F*320/2048,(o+a)/2,2.82,P*(h/2+.004),P>0?0:Re)}for(let P of[-1,1]){for(let z=-3.9;z<=1.9;z+=1.45)N.rod(e.steel,[z,c-.02,P*1.05],[z,c+.55,P*1.05],.04);N.rod(e.steel,[-3.9,c+.55,P*1.05],[1.9,c+.55,P*1.05],.045)}for(let P of[-2.6,-.4,1.6])N.cyl(e.panel,.42,.46,.18,P,c+.05,0,"y",24);N.ext(Si(t.accent,.46),-5.55,-4.8,.9,2.55,-1.62,1.62,.16),N.ext(e.glass,-5.58,-5.5,1.2,2.3,-1.3,1.3,.04),N.cyl(e.ink,.52,.52,1.5,u.x,u.y,0,"z",28);for(let P of[-1,1])N.cyl(e.hub,.62,.62,.06,u.x,u.y,P*.78,"z",28);for(let P of[-1,1])N.ext(e.steel,u.x-.08,u.x+.08,2.5,u.y,P*.86-.05,P*.86+.05,.03);N.text("3",{fg:pt.white,bg:pt.red,px:90,pad:30},.36,-5.59,3.7,0,-Re/2);for(let P of[-1,1])N.ext(e.tail,-5.6,-5.55,.95,1.15,P*1.35-.15,P*1.35+.15,.03)},i);let d=30,f=new _n(ys("hose-seg",()=>new Ve(.11,.11,1,12)),e.ink,d);f.castShadow=f.receiveShadow=!0,i.add(f);let p=new Ht;tl(jd(.3,.3,.3,.08),e.ink,p),tl(Kd(.13,.13,.18,16),e.steel,p).position.y=.2,i.add(p);let v=kn(-3.4,3,4.2),g=kn(u.x+.1,u.y-.62,.9),m=kn(u.x,u.y+.52,.5),_=new Dt,b=new ve,y=kn(),M=kn(),w=kn(),T=kn(),x=(N,F)=>{let P=1-N;return F.set(0,0,0).addScaledVector(m,P*P).addScaledVector(w,2*P*N).addScaledVector(T,N*N)},E=(N,F=v)=>{N=om(N,0,1),T.lerpVectors(g,F,N),f.visible=N>.01,w.lerpVectors(m,T,.5),w.y=Math.max(m.y,T.y)+.6-1.4*N;for(let P=0;P<d;P++){x(P/d,y),x((P+1)/d,M),Jd.subVectors(M,y);let z=Jd.length();b.setFromUnitVectors(kn(0,1,0),Jd.normalize()),_.compose(y.clone().add(M).multiplyScalar(.5),b,kn(1,z+.02,1)),f.setMatrixAt(P,_)}f.instanceMatrix.needsUpdate=!0,p.position.copy(T),p.position.y-=.15};E(0);let C=[],D=[];_o(i,C,r,.62,4.2,1.38,D);for(let N of[-2.4,-3.85])_o(i,C,r,.62,N,1.42);return{group:i,roll:sf(C),setSteer:rf(D),setHose:E,wingPoint:v,length:11.2}}function cm({livery:n="aurora"}={}){let t=am(n),e=bo(),i=new Ht,s=4.2,r=.62,o=s/2,a=[-2.6,2.6];nf(`bus|${n}`,h=>{h.add(e.white,ef("bus-body",()=>tf(-7,7,.42,4.3,{arches:[[5,r,r+.16],[-5,r,r+.16]],rc:[.32,.32,.45,.45]},.26),s,.26));for(let u of[-1,1]){let d=el(`bus-side|${n}|${u}`,2048,560,(f,p,v)=>{let g=p/13.4,m=b=>u>0?(b+6.7)*g:(6.7-b)*g,_=b=>(4-b)*(v/3.5);f.fillStyle=t.accent,f.fillRect(0,_(1.32),p,_(.5)-_(1.32)),f.fillStyle=t.light,f.fillRect(0,_(1.46),p,_(1.36)-_(1.46)),f.globalCompositeOperation="destination-out";for(let b of[-5,5])f.beginPath(),f.arc(m(b),_(r),(r+.2)*g,0,Re*2),f.fill();for(let b of a)f.fillRect(m(b)-1*g,_(4),2*g,v);f.globalCompositeOperation="source-over",f.fillStyle="#ffffff",f.font=`800 ${v*.13}px ${yo}`,f.textAlign="center",f.textBaseline="middle",f.fillText((t.name??"Aurora").toUpperCase(),m(0),_(.9))});h.print(nl(d),13.4,3.5,0,2.25,u*(o+.004),u>0?0:Re)}for(let u of[-1,1]){let d=u>0?o-.05:-o-.035,f=u>0?o+.035:-o+.05;h.ext(e.glass,-6.45,6.35,1.78,3.8,d,f,.08);for(let p of a)h.ext(e.glass,p-.92,p+.92,.55,3.8,d,f,.08),h.ext(e.white,p-.03,p+.03,.6,3.75,d+u*.03,f+u*.03,.01),h.ext(Si(t.accent,.46),p-.98,p-.92,.55,3.82,d+u*.01,f+u*.01,.01),h.ext(Si(t.accent,.46),p+.92,p+.98,.55,3.82,d+u*.01,f+u*.01,.01);for(let p of[-5.3,-4.15,-.6,.6,4.15,5.3])h.ext(e.white,p-.06,p+.06,1.8,3.78,d+u*.03,f+u*.03,.02)}h.ext(e.glass,6.94,7.03,1.25,3.72,-o+.35,o-.35,.1),h.ext(e.ink,6.95,7.04,3.8,4.06,-1.2,1.2,.05),h.text("GATE B 12",{fg:"#ffd27a",px:90},.2,7.05,3.93,0,Re/2);for(let u of[-1,1])h.ext(e.lamp,6.96,7.04,.72,.98,u*1.6-.3,u*1.6+.3,.06);h.ext(e.glass,-7.03,-6.94,2.1,3.7,-o+.45,o-.45,.1);for(let u of[-1,1])h.ext(e.tail,-7.04,-6.96,.72,.98,u*1.6-.3,u*1.6+.3,.06);h.ext(e.panel,-3.6,2.6,4.18,4.62,-1.35,1.35,.2)},i);let l=[],c=[];return _o(i,l,r,.6,5,1.72,c),_o(i,l,r,.6,-5,1.72),{group:i,roll:sf(l),setSteer:rf(c),doors:a,length:14}}function of(){let n=bo(),t=new Ht,e=2.8,i=.56;nf("followme",o=>{o.add(n.white,ef("fm-body",()=>tf(-3.1,3.1,.36,1.62,{arches:[[1.95,i,i+.12],[-1.95,i,i+.12]],rc:[.25,.3,.5,.4]},.2),e,.2)),o.ext(n.glass,-2.55,.95,1.52,2.42,-1.24,1.24,.2);for(let h of[-2.5,-.85,.9])for(let u of[-1,1])o.ext(n.white,h-.09,h+.09,1.55,2.42,u*1.24-.06,u*1.24+.06,.03);o.ext(n.white,-2.68,1.02,2.36,2.62,-1.32,1.32,.22);let a=el("fm-check",1024,64,(h,u,d)=>{for(let f=0;f<32;f++)for(let p of[0,1])h.fillStyle=(f+p)%2?pt.blue:"#ffffff",h.fillRect(f*32,p*32,32,32)});for(let h of[-1,1])o.print(nl(a,{opaque:!0}),2.4,.19,-.35,1.25,h*(e/2+.004),h>0?0:Re);o.ext(n.yellow,-1.75,.15,2.66,3.22,-1.05,1.05,.1);let l=el("fm-sign",1024,256,(h,u,d)=>{h.fillStyle=pt.yellow,h.fillRect(0,0,u,d),h.fillStyle=Mi.text,h.font=`900 ${d*.5}px ${yo}`,h.textAlign="center",h.textBaseline="middle",h.fillText("FOLLOW ME",u/2,d/2+6)}),c=nl(l,{opaque:!0});o.print(c,1.9,.46,.155,2.94,0,Re/2),o.print(c,1.9,.46,-1.755,2.94,0,-Re/2);for(let h of[-1,1])o.print(c,1.75,.42,-.8,2.94,h*1.055,h>0?0:Re);for(let h of[-1,1])o.beacon(-.8,3.22,h*.7,.13);for(let h of[-1,1])o.ext(n.lamp,3.04,3.1,1.1,1.3,h*.95-.22,h*.95+.22,.04);for(let h of[-1,1])o.ext(n.tail,-3.1,-3.04,1.1,1.3,h*.95-.2,h*.95+.2,.04)},t);let s=[],r=[];return _o(t,s,i,.5,1.95,1.15,r),_o(t,s,i,.5,-1.95,1.15),{group:t,roll:sf(s),setSteer:rf(r),length:6.2}}var Lt=Math.PI,Ln=Lt*2,Mo=Lt/180,pm=(n,t,e)=>Math.min(e,Math.max(t,n)),zi=(n,t,e)=>n+(t-n)*e,ol=n=>pm(n,0,1),Hh=n=>{let t=ol(n);return t*t*(3-2*t)},wi=(n=0,t=0,e=0)=>new U(n,t,e),pn=(n,t)=>new ct(n,t),mm=new U,gm=new ve,xm=new hn,vm=new U,Xe=(n=0,t=0,e=0,i=0,s=0,r=0,o=1,a=1,l=1)=>new Dt().compose(mm.set(n,t,e),gm.setFromEuler(xm.set(i,s,r)),vm.set(o,a,l)),Ws=Qd,So=38*Mo,Xs={concrete:"#dde2f1",concreteDeep:"#c4cce6",scorch:"#a2abca",rail:"#8f99bb",sleeper:"#b5bdd9",lzPad:"#c3cce9",yellowDeep:"#e0a02e"},af=new Map;function Mb(n,t,e){let i=`${n}|${t}|${e}`;return af.has(i)||af.set(i,new Oe({color:n,roughness:e,side:t})),af.get(i)}var _s=(n,t=.5)=>gt(n,{paint:!0,rough:t}),Gh=(n,t,e,i=.35)=>new Oe({color:n,roughness:i,emissive:t,emissiveIntensity:e}),Vh=null;function $e(){return Vh||(Vh={white:gt(pt.white),tank:gt(pt.white,{rough:.42}),panel:gt(pt.panel),wall:gt(sn.wall,{rough:.72}),roof:gt(pt.roof,{rough:.62}),blue:gt(pt.blue,{rough:.5}),blueDeep:gt(pt.blueDeep,{rough:.5}),blueLight:gt(pt.blueLight,{rough:.5}),navy:gt(pt.navy,{rough:.7}),glass:gt(pt.glass,{rough:.16}),window:gt(sn.window,{rough:.4}),shade:gt(pt.shade,{rough:.6}),slat:gt(sn.slat,{rough:.6}),steel:gt(sn.steel,{rough:.45}),post:gt(sn.post,{rough:.45}),apron:gt(pt.road,{rough:.9}),concrete:gt(Xs.concrete,{rough:.85}),concreteDeep:gt(Xs.concreteDeep,{rough:.88}),scorch:gt(Xs.scorch,{rough:.7}),rail:gt(Xs.rail,{rough:.4,metal:.2}),sleeper:gt(Xs.sleeper,{rough:.85}),lz:gt(Xs.lzPad,{rough:.88}),room:Mb(sn.interior,Te,.9),red:Gh("#f0656a",pt.red,.9,.3),vWhite:_s(pt.white),vBlue:_s(pt.blue,.48),vBlueDeep:_s(pt.blueDeep,.48),vYellow:_s(pt.yellow,.5),vYellowDeep:_s(Xs.yellowDeep,.56),ink:gt(Ws.ink,{rough:.62}),chassis:gt(Ws.chassis,{rough:.66}),tyre:gt(Ws.tyre,{rough:.82}),hub:gt(Ws.hub,{rough:.42}),hubCap:gt(Ws.hubCap,{rough:.45,metal:.1}),vGlass:gt(pt.glass,{paint:!0,rough:.12}),bumper:_s(Ws.bumper),vSteel:gt(Ws.steel,{rough:.42,metal:.25}),lamp:Gh(Ws.lamp,"#fff1c8",.22,.3),tail:Gh("#f0656a",pt.red,.35,.3),beacon:Gh("#ffb072","#ff7a1f",.9,.3)},Vh)}var lf=new Map,he=(n,t)=>(lf.has(n)||lf.set(n,t()),lf.get(n)),hi=n=>{let t=null;return()=>t??=n()};function sl(n){let t=n.index?n.toNonIndexed():n.clone();for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ee(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}function Sb(n,t,e,i=.12,s=32){return he(`rcyl|${n}|${t}|${e}|${i}|${s}`,()=>{let r=Math.max(.002,Math.min(i,e/2-.001,Math.min(n,t)-.001)),o=[pn(1e-4,-e/2)],a=(l,c,h,u)=>{for(let d=0;d<=4;d++){let f=zi(h,u,d/4);o.push(pn(l+r*Math.cos(f),c+r*Math.sin(f)))}};return a(n-r,-e/2+r,-Lt/2,0),a(t-r,e/2-r,0,Lt/2),o.push(pn(1e-4,e/2)),new fn(o,s)})}var Wh=(n,t,e=48)=>he(`lathe|${n}|${e}`,()=>new fn(t.map(([i,s])=>pn(i,s)),e)),ke=class{constructor(){this.parts=new Map,this.frame=null}put(t,e,i){let s=sl(e);return i&&s.applyMatrix4(i),this.frame&&s.applyMatrix4(this.frame),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(s),this}at(t,e,i=0,s=0,r=0,o=0,a=0,l=0,c=1,h=1,u=1){return this.put(t,e,Xe(i,s,r,o,a,l,c,h,u))}box(t,e,i,s,r,o,a,l=null,c=0,h=0,u=0){return this.put(t,Be(e,i,s,l??Math.min(e,i,s)*.2),Xe(r,o,a,c,h,u))}ext(t,e,i,s,r,o,a,l=null){return this.box(t,i-e,r-s,a-o,(e+i)/2,(s+r)/2,(o+a)/2,l)}flat(t,e,i,s,r,o,a,l=0,c=0,h=0){return this.put(t,he(`box|${e}|${i}|${s}`,()=>new Ye(e,i,s)),Xe(r,o,a,l,c,h))}cyl(t,e,i,s,r,o,a,l="y",c=.12,h=32){let u=l==="x"?Xe(r,o,a,0,0,-Lt/2):l==="z"?Xe(r,o,a,Lt/2,0,0):Xe(r,o,a);return this.put(t,Sb(e,i,s,c,h),u)}tube(t,e,i,s,r=12){let o=Array.isArray(i)?wi(...i):i.clone(),a=Array.isArray(s)?wi(...s):s.clone(),l=a.clone().sub(o),c=l.length(),h=new ve().setFromUnitVectors(wi(0,1,0),l.multiplyScalar(1/c)),u=he(`tube|${e}|${r}`,()=>new Ve(e,e,1,r));return this.put(t,u,new Dt().compose(o.add(a).multiplyScalar(.5),h,wi(1,c,1)))}bar(t,e,i,s=.12){let r=Array.isArray(e)?wi(...e):e.clone(),o=Array.isArray(i)?wi(...i):i.clone(),a=o.clone().sub(r),l=a.length(),c=new ve().setFromUnitVectors(wi(0,1,0),a.multiplyScalar(1/l));return this.put(t,Be(s,l+s,s,s*.4),new Dt().compose(r.add(o).multiplyScalar(.5),c,wi(1,1,1)))}within(t,e){let i=this.frame;return this.frame=i?i.clone().multiply(t):t.clone(),e(),this.frame=i,this}freeze(){return[...this.parts].map(([t,e])=>({mat:t,geo:Mn(e,!1)}))}};function Ei(n,t=new Ht){for(let{geo:e,mat:i}of n){let s=new zt(e,i);s.castShadow=!i.transparent&&i.side!==Te&&!i.userData.noCast,s.receiveShadow=!i.userData.noShadow&&i.side!==Te,t.add(s)}return t}function $h(n,t){let e=new ke;return t(e,n),e.freeze()[0].geo}function Pn(n,t,e){let i=new zt(n,t);return i.castShadow=!t.transparent&&!t.userData.noCast,i.receiveShadow=!0,e&&e.add(i),i}function cf(n,t=[],e=.4){let i=new un(n.map(([r,o])=>pn(r,o)));for(let[r,o,a,l]of t)i.holes.push(new Ni([pn(r,o),pn(a,o),pn(a,l),pn(r,l)]));let s=new dn(i,{depth:e,bevelEnabled:!1,curveSegments:4});return s.translate(0,0,-e),s}function hf(n,t,e,i,s,r,{pitch:o=.82,w:a=.17,d:l=.07,gaps:c=[],y0:h=0}={}){let u=Math.floor((s-i)/o),d=(s-i-u*o)/2;for(let f=0;f<=u;f++){let p=i+d+f*o;if(p<i+.25||p>s-.25)continue;let v=h;for(let[m,_,b]of c)p>m&&p<_&&(v=Math.max(v,b));let g=r(p)-.05;g-v<.15||n.put(t,he(`rib|${a}|${l}`,()=>new Ye(a,1,l)),e.clone().multiply(Xe(p,(v+g)/2,l/2,0,0,0,1,g-v,1)))}}function uf(n,t,e,i,s=.08){return he(`slab|${n}|${e}|${i}|${s}`,()=>{let r=i-e,o=new dn(t(),{depth:Math.max(.002,r-2*s),bevelEnabled:s>0,bevelThickness:s,bevelSize:s,bevelSegments:3,curveSegments:48});return o.translate(0,0,s),o.rotateX(-Lt/2),o.translate(0,e,0),o})}function wb(n,t,e,i,s=!1){let r=-t/2,o=-e/2,a=[[r+i,o],[r+t-i,o],[r+t,o,r+t,o+i],[r+t,o+e-i],[r+t,o+e,r+t-i,o+e],[r+i,o+e],[r,o+e,r,o+e-i],[r,o+i],[r,o,r+i,o]];return s?(n.moveTo(r+i,o),n.quadraticCurveTo(r,o,r,o+i),n.lineTo(r,o+e-i),n.quadraticCurveTo(r,o+e,r+i,o+e),n.lineTo(r+t-i,o+e),n.quadraticCurveTo(r+t,o+e,r+t,o+e-i),n.lineTo(r+t,o+i),n.quadraticCurveTo(r+t,o,r+t-i,o),n.closePath(),n):(n.moveTo(...a[0]),n.lineTo(...a[1]),n.quadraticCurveTo(...a[2]),n.lineTo(...a[3]),n.quadraticCurveTo(...a[4]),n.lineTo(...a[5]),n.quadraticCurveTo(...a[6]),n.lineTo(...a[7]),n.quadraticCurveTo(...a[8]),n)}function ym(n,t,e,i,s,r,o,a=24,l=16){let c=[],h=[],u=[],d=[];for(let p=0;p<=l;p++){let v=zi(r,o,p/l),g=Math.cos(v),m=Math.sin(v);for(let _=0;_<=a;_++)c.push(zi(i,s,_/a),t+n*g,e+n*m),h.push(0,g,m),u.push(_/a,1-p/l)}for(let p=0;p<l;p++)for(let v=0;v<a;v++){let g=p*(a+1)+v,m=g+a+1;d.push(g,m,g+1,g+1,m,m+1)}let f=new ge;return f.setAttribute("position",new Qt(c,3)),f.setAttribute("normal",new Qt(h,3)),f.setAttribute("uv",new Qt(u,2)),f.setIndex(d),f}function _m(n,t,e,i,{arches:s=[],rc:r=[.15,.15,.15,.15]}={},o=0){n+=o,t-=o,e+=o,i-=o;let[a,l,c,h]=r.map(d=>Math.max(.02,d-o)),u=new un;u.moveTo(n+a,e);for(let[d,f,p]of[...s].sort((v,g)=>v[0]-g[0])){let v=p+o,g=Math.asin(pm((e-f)/v,-1,1));u.lineTo(d-v*Math.cos(g),e),u.absarc(d,f,v,Lt-g,g,!0)}return u.lineTo(t-l,e),u.absarc(t-l,e+l,l,-Lt/2,0,!1),u.lineTo(t,i-c),u.absarc(t-c,i-c,c,0,Lt/2,!1),u.lineTo(n+h,i),u.absarc(n+h,i-h,h,Lt/2,Lt,!1),u.lineTo(n,e+a),u.absarc(n+a,e+a,a,Lt,Lt*1.5,!1),u}function qh(n,t,e,i=.12){return he(`ex|${n}|${e}|${i}`,()=>{let s=new dn(t(),{depth:Math.max(.002,e-2*i),bevelEnabled:i>0,bevelThickness:i,bevelSize:i,bevelSegments:4,curveSegments:20});return s.translate(0,0,-(e-2*i)/2),s})}function bm(n,{x0:t,x1:e,y0:i=.62,top:s,W:r,color:o,arches:a=[],stripe:l=null,seam:c}){let h=$e(),u=.17,d=[t,e,i,s,r,JSON.stringify(a)].join("|");n.put(_s(o,.46),qh(`cab|${d}`,()=>_m(t,e,i,s,{arches:a,rc:[.14,.34,.44,.34]},u),r,u));let f=r/2,p=s-i,v=Math.min(s-.12*p,s-.46),g=s-.5*p;n.ext(h.vGlass,e-.08,e+.035,g,v,-f+.27,f-.27,.05);for(let y of[-1,1])n.ext(h.vGlass,e-Math.min(1.62,(e-t)*.56),e-.34,g,v,y>0?f-.06:-f-.035,y>0?f+.035:-f+.06,.05),n.ext(_s(c),e-Math.min(1.8,(e-t)*.62),e-Math.min(1.76,(e-t)*.62)+.04,i+Math.min(.85,p*.3),s-.3,y>0?f-.02:-f-.012,y>0?f+.012:-f+.02,.008),n.ext(h.ink,e-Math.min(1.45,(e-t)*.5),e-Math.min(1.15,(e-t)*.4),g-.3,g-.22,y>0?f-.02:-f-.04,y>0?f+.04:-f+.02,.02),n.bar(h.ink,[e-.2,v-.25,y*(f-.05)],[e-.05,v-.25,y*(f+.36)],.07),n.ext(h.ink,e-.12,e+.02,v-.95,v-.12,y*(f+.32)-.1,y*(f+.32)+.1,.05),l&&n.ext(_s(l,.46),t+.22,e-.3,g-.55,g-.33,y>0?f-.02:-f-.02,y>0?f+.02:-f+.02,.01);let m=i+.18*p,_=g-.07*p;n.ext(h.ink,e-.06,e+.04,m,_,-.92,.92,.06);let b=5;for(let y=0;y<b;y++){let M=m+(_-m)*(y+.55)/(b+.1);n.ext(h.bumper,e+.01,e+.065,M-.03,M+.03,-.8,.8,.02)}for(let y of[-1,1])n.ext(h.lamp,e-.05,e+.045,m,m+.1*p,y>0?f-.62:-f+.2,y>0?f-.2:-f+.62,.06);n.ext(h.bumper,e-.3,e+.28,i-.06,i+.56,-f-.08,f+.08,.2)}function rl(n,t,e,i,s=.16){let r=$e();n.cyl(r.ink,s*1.05,s*1.15,s*.5,t,e+s*.25,i,"y",.03,18),n.at(r.beacon,he(`dome|${s}`,()=>new en(s,18,8,0,Ln,0,Lt/2)),t,e+s*.5,i)}function Eb(n,t){return he(`tyre|${n}|${t}`,()=>{let e=n*.54,i=t/2,s=Math.min(i*.78,(n-e)*.62),r=[pn(e,-i*.84),pn((e+n-s)/2,-i*1)];for(let a=0;a<=7;a++){let l=-Lt/2+Lt/2*(a/7);r.push(pn(n-s+s*Math.cos(l),-i+s+s*Math.sin(l)))}for(let a=0;a<=7;a++){let l=Lt/2*(a/7);r.push(pn(n-s+s*Math.cos(l),i-s+s*Math.sin(l)))}r.push(pn((e+n-s)/2,i*1),pn(e,i*.84));let o=new fn(r,44);return o.rotateX(Lt/2),o})}function Tb(n,t){return he(`hub|${n}|${t}`,()=>{let e=n*.54,i=new Ve(e+.004,e+.004,t*.76,36).rotateX(Lt/2),s=new Ve(e*.8,e*.86,t*.84,32).rotateX(Lt/2);return Mn([sl(i),sl(s)],!1)})}function Ab(n,t){return he(`cap|${n}|${t}`,()=>{let e=n*.54,i=[sl(new Ve(e*.3,e*.3,t*.9,24).rotateX(Lt/2))];for(let s=0;s<5;s++){let r=s/5*Ln;i.push(sl(new Ve(e*.075,e*.075,t*.88,8).rotateX(Lt/2).translate(Math.cos(r)*e*.55,Math.sin(r)*e*.55,0)))}return Mn(i,!1)})}function pf(n,t,e,i){let s=$e(),r=[[Eb(t,e),s.tyre],[Tb(t,e),s.hub],[Ab(t,e),s.hubCap]].map(([l,c])=>{let h=new _n(l,c,i.length);return h.castShadow=h.receiveShadow=!0,n.add(h),h}),o=new Dt,a=l=>{let c=-l/t;i.forEach(([h,u],d)=>{o.compose(mm.set(h,t,u),gm.setFromEuler(xm.set(0,0,c)),vm.set(1,1,1));for(let f of r)f.setMatrixAt(d,o)});for(let h of r)h.instanceMatrix.needsUpdate=!0};a(0);for(let l of r)l.computeBoundingSphere();return a}var Xh=(n,t)=>n.flatMap(e=>[[e,-t],[e,t]]),Rb=Fe,ns=(n,t,e=!1)=>`${e?"italic ":""}${n} ${t}px Inter, "Segoe UI", system-ui, sans-serif`,bs=new Map;function vr(n,t,e,i){if(bs.has(n))return bs.get(n);let s=document.createElement("canvas");s.width=t,s.height=e,i(s.getContext("2d"),t,e);let r=new Ui(s);return r.colorSpace=Rb,r.anisotropy=8,bs.set(n,r),r}function gf(n,t,e,i,s,r){let o=Math.min(r,i/2,s/2);n.beginPath(),n.moveTo(t+o,e),n.arcTo(t+i,e,t+i,e+s,o),n.arcTo(t+i,e+s,t,e+s,o),n.arcTo(t,e+s,t,e,o),n.arcTo(t,e,t+i,e,o),n.closePath()}function al(n,t,e,i,s,r=null){n.save(),n.translate(t,e),n.fillStyle=s;let o=.27*i;n.beginPath(),n.moveTo(0,-.98*i),n.bezierCurveTo(o*.9,-.78*i,o,-.5*i,o,-.25*i),n.lineTo(o,.18*i),n.lineTo(.56*i,.46*i),n.lineTo(.56*i,.64*i),n.lineTo(o,.52*i),n.lineTo(-o,.52*i),n.lineTo(-.56*i,.64*i),n.lineTo(-.56*i,.46*i),n.lineTo(-o,.18*i),n.lineTo(-o,-.25*i),n.bezierCurveTo(-o,-.5*i,-o*.9,-.78*i,0,-.98*i),n.closePath(),n.fill(),gf(n,-.86*i,.76*i,1.72*i,.17*i,.085*i),n.fill(),r?(n.fillStyle=r,n.beginPath(),n.arc(0,-.3*i,.11*i,0,Ln),n.fill()):(n.globalCompositeOperation="destination-out",n.beginPath(),n.arc(0,-.3*i,.11*i,0,Ln),n.fill()),n.restore()}function ll(n,{bg:t=pt.blue,fg:e="#ffffff",px:i=92,h:s=150,padX:r=.42,radius:o=.26,weight:a=800,italic:l=!1,mark:c=!1}={}){let h=["plate",n,t,e,i,s,r,o,a,l,c].join("|");if(bs.has(h))return bs.get(h);let u=document.createElement("canvas").getContext("2d");u.font=ns(a,i,l);let d=c?s*.82:0,f=Math.ceil(u.measureText(n).width+2*s*r+d),v={tex:vr(h,f,s,g=>{t&&(gf(g,1,1,f-2,s-2,s*o),g.fillStyle=t,g.fill()),c&&al(g,s*r+d*.38,s/2,s*.34,e,t),g.font=ns(a,i,l),g.fillStyle=e,g.textAlign="center",g.textBaseline="middle",g.fillText(n,(f+d)/2,s/2+i*.04)}),aspect:f/s};return bs.set(h,v),v}function Mm(n,t){let e=["sign",n,t].join("|");if(bs.has(e))return bs.get(e);let i=document.createElement("canvas").getContext("2d");i.font=ns(800,92,!0);let s=i.measureText(n).width;i.font=ns(600,42);let r=i.measureText(t).width,o=Math.ceil(Math.max(s,r)+250),a=200,c={tex:vr(e,o,a,h=>{gf(h,2,2,o-4,a-4,30),h.fillStyle="#ffffff",h.fill(),al(h,98,a/2,66,pt.blue,"#ffffff"),h.fillStyle=pt.blue,h.font=ns(800,92,!0),h.textBaseline="middle",h.fillText(n,180,a/2-22),h.fillStyle=pt.blueLight,h.font=ns(600,42),h.fillText(t,184,a/2+50)}),aspect:o/a};return bs.set(e,c),c}function Sm(n,{bg:t=pt.blue,fg:e="#ffffff",w:i=4096,h:s=192,reps:r=3,px:o=112}={}){return vr(["band",n,t,e,i,s,r,o].join("|"),i,s,a=>{a.fillStyle=t,a.fillRect(0,0,i,s),a.fillStyle=e,a.font=ns(800,o,!0),a.textAlign="center",a.textBaseline="middle";for(let l=0;l<r;l++){let c=i*(l+.5)/r;a.fillText(n,c+s*.4,s/2+o*.04),al(a,c-a.measureText(n).width/2-s*.18,s/2,s*.34,e,t)}})}var df=new Map;function cl(n){if(!df.has(n)){let t=new Oe({map:n,transparent:!0,roughness:.55,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});t.depthWrite=!1,t.userData.noCast=!0,df.set(n,t)}return df.get(n)}function xr(n,t,e){let i=new zt(he(`plane|${t.toFixed(4)}|${e}`,()=>new Xn(e*t,e)),cl(n));return i.receiveShadow=!0,i}function Cb(n,t,e){let i=new zt(he(`gplane|${t}|${e}`,()=>new Xn(t,e).rotateX(-Lt/2)),cl(n));return i.receiveShadow=!0,i}function wm(n,t,e,i=96){let s=he(`bandmat|${n.uuid}`,()=>new Oe({map:n,roughness:.5})),r=new zt(he(`band|${t}|${e}|${i}`,()=>new Ve(t,t,e,i,1,!0)),s);return r.castShadow=!1,r.receiveShadow=!0,r}var Qn={W:64,D:30,eave:12,top:15.6,doorW:15,doorH:13,leafW:2.8,leafY0:.56,leafY1:13.5},Em=hi(()=>{let{D:n,eave:t,top:e}=Qn,i=e-t,s=((n/2)**2+i*i)/(2*i),r=e-s;return{R:s,cy:r,y:o=>r+Math.sqrt(Math.max(0,s*s-o*o)),a0:Math.asin(n/2/s)}}),Tm=[{closed:1.4,x:Qn.W/2+1.41},{closed:4.05,x:Qn.W/2+1.12},{closed:6.7,x:Qn.W/2+.83}],Ib=9.1,Am=hi(()=>{let{leafW:n}=Qn,t=Qn.leafY1-Qn.leafY0,e=new ke;e.flat(null,n-.3,t-.3,.14,0,t/2,0);for(let s=.7;s<t-.4;s+=.62)e.flat(null,n-.32,.07,.2,0,s,0);let i=new ke;i.box(null,n,.34,.26,0,t-.17,0,.1),i.box(null,n,.34,.26,0,.17,0,.1),i.box(null,n,.26,.24,0,t*.42,0,.08);for(let s of[-1,1])i.box(null,.3,t,.26,s*(n/2-.15),t/2,0,.1);return{panel:e.freeze()[0].geo,frame:i.freeze()[0].geo}});function hm(n,t,e){let i=$e(),{doorW:s,doorH:r}=Qn;n.within(t,()=>{for(let o of[-1,1])n.box(i.blue,.9,r+.8,.7,o*(s/2+.45),(r+.8)/2,.25,.28);if(n.box(i.blue,s+1.8,.8,.7,0,r+.4,.25,.28),n.box(i.blueDeep,20.8,.36,.95,0,Qn.leafY1+.18,1.08,.14),n.box(i.shade,s+1.8,.08,1.6,0,.04,.8,.03),e){let o=Am();for(let a of[-1,1])for(let l of Tm){let c=Xe(a*l.closed,Qn.leafY0,l.x-Qn.W/2);n.put(i.slat,o.panel,c),n.put(i.blue,o.frame,c)}}})}var Pb=hi(()=>{let n=$e(),t=new ke,{W:e,D:i,eave:s,doorW:r,doorH:o}=Qn,a=Em(),l=[[-i/2,0],[i/2,0],[i/2,s]];for(let _=1;_<48;_++){let b=i/2-i*_/48;l.push([b,a.y(b)])}l.push([-i/2,s]);let c=Xe(e/2,0,0,0,Lt/2,0),h=Xe(-e/2,0,0,0,-Lt/2,0),u=[[-r/2-.95,r/2+.95,o+.8]];t.put(n.wall,cf(l,[[-r/2,0,r/2,o]],.5),c),hf(t,n.wall,c,-i/2,i/2,a.y,{gaps:u}),t.put(n.wall,cf(l,[],.5),h),hf(t,n.wall,h,-i/2,i/2,a.y,{gaps:u}),hm(t,c,!1),hm(t,h,!0);for(let _ of[-1,1]){let b=_>0?Xe(0,0,i/2):Xe(0,0,-i/2,0,Lt,0);t.put(n.wall,cf([[-e/2,0],[e/2,0],[e/2,s],[-e/2,s]],[],.5),b),hf(t,n.wall,b,-e/2,e/2,()=>s,{gaps:_>0?[[18.6,21.4,3.2]]:[]});for(let y=-e/2+4.2;y<e/2-3;y+=4.6)t.box(n.window,3.2,1.5,.3,y,s-2.3,_*(i/2+.06),.12)}t.box(n.blue,2.4,3.2,.3,20,1.6,i/2+.1,.12),t.box(n.glass,1.6,2.5,.3,20,1.3,i/2+.16,.08),t.box(n.blue,3.2,.3,1.4,20,3.35,i/2+.6,.1);let d=(_,b,y)=>{let M=new un;return M.absarc(0,a.cy,b,Lt/2-y,Lt/2+y,!1),M.absarc(0,a.cy,_,Lt/2+y,Lt/2-y,!0),M},f=Xe(0,0,0,0,Lt/2,0),p=new dn(d(a.R-.1,a.R+.25,a.a0+.012),{depth:e+1.2,bevelEnabled:!1,curveSegments:80});p.translate(0,0,-(e+1.2)/2),t.put(n.roof,p,f);let v=new dn(d(a.R+.2,a.R+.36,a.a0+.01),{depth:.24,bevelEnabled:!1,curveSegments:80});for(let _=-e/2-.25;_<e/2+.3;_+=1)t.put(n.roof,v,f.clone().multiply(Xe(0,0,_)));let g=new dn(d(a.R-.35,a.R+.55,a.a0+.03),{depth:.6,bevelEnabled:!1,curveSegments:80});t.put(n.blueDeep,g,f.clone().multiply(Xe(0,0,e/2-.1))),t.put(n.blueDeep,g,f.clone().multiply(Xe(0,0,-e/2-.5)));for(let _ of[-1,1])t.box(n.blueDeep,e+1.6,.5,.5,0,s+.05,_*(i/2+.35),.16);for(let[_,b]of[[-e/2,-i/2],[e/2,-i/2],[-e/2,i/2],[e/2,i/2]])t.box(n.blue,.8,s+.3,.8,_,s/2,b,.24);for(let _ of[-1,1])for(let b of[-e/6,e/6])t.box(n.blue,.32,s-.4,.32,b,(s-.4)/2,_*(i/2+.25),.12);let m=new dn(new un(l.map(([_,b])=>pn(_*.97,b*.97+.01))),{depth:e-1.2,bevelEnabled:!1,curveSegments:4});return m.translate(0,0,-(e-1.2)/2),t.put(n.room,m,f),t.freeze()});function Rm(){let n=$e(),{W:t,D:e,doorW:i,doorH:s}=Qn,r=Ei(Pb());r.name="integration-hangar";let o=Am(),a=[];for(let b of[-1,1])for(let y of Tm){let M=new Ht;M.position.set(y.x,Qn.leafY0,0),M.rotation.y=Lt/2,Pn(o.panel,n.slat,M),Pn(o.frame,n.blue,M),r.add(M),a.push({g:M,s:b,L:y})}let l=b=>{let y=ol(b);for(let{g:M,s:w,L:T}of a)M.position.z=-w*zi(T.closed,Ib,y)};l(0);let c=ll("PADLINE",{px:100,h:150,padX:.34,mark:!0}),h=new zt(Be(c.aspect*1.05+.2,1.25,.16,.08),n.blue);h.position.set(t/2+.1,s+1.55,0),h.rotation.y=Lt/2,h.castShadow=h.receiveShadow=!0,r.add(h);let u=xr(c.tex,c.aspect,1.05);u.position.set(t/2+.19,s+1.55,0),u.rotation.y=Lt/2,r.add(u);let d=Mm("PADLINE","Horizontal Integration"),f=3.2,p=new zt(Be(d.aspect*f+.1,f+.1,.2,.1),n.white);p.position.set(0,6.6,e/2+.16),p.castShadow=p.receiveShadow=!0,r.add(p);let v=xr(d.tex,d.aspect,f);v.position.set(0,6.6,e/2+.27),r.add(v);let g=Em(),m=vr("hif-roof",2048,512,(b,y,M)=>{b.fillStyle="#ffffff",b.font=ns(800,330,!0),b.textAlign="center",b.textBaseline="middle";let w=b.measureText("PADLINE").width;b.fillText("PADLINE",y/2+150,M/2+14),al(b,y/2-w/2-40,M/2,190,"#ffffff")}),_=new zt(he("hif-strip",()=>ym(g.R+.39,g.cy,0,-16,16,-.07,.17,32,12)),cl(m));return r.add(_),{group:r,setDoor:l,door:{x:t/2,width:i,height:s}}}var um=.52;function Cm({length:n=150}={}){let t=$e(),e=he(`rails|${n}`,()=>{let l=new ke;l.ext(t.concrete,0,n,0,.14,-3.4,3.4,.05);for(let c of[-1,1]){let h=c*3;l.ext(t.rail,0,n,.3,.37,h-.19,h+.19,.025),l.ext(t.rail,0,n,.34,.45,h-.05,h+.05,.02),l.ext(t.steel,0,n,.42,um,h-.11,h+.11,.035)}return l.freeze()}),i=Ei(e);i.name="rails";let s=1.5,r=Math.max(1,Math.floor((n-.4)/s)+1),o=new _n(Be(.56,.16,6.5,.05),t.sleeper,r),a=new Dt;for(let l=0;l<r;l++)o.setMatrixAt(l,a.makeTranslation(.4+l*s,.22,0));return o.castShadow=o.receiveShadow=!0,o.computeBoundingSphere(),i.add(o),i.userData.railTop=um,i}var es={deckY:6,half:5,hole:2.6,ring:3.4,clampR:3.95,trenchIn:3.5,trenchOut:4.1,trenchH:3,trenchEnd:34,back:-4.2,legX:4,legZ:4.55},Lb=hi(()=>{let n=$e(),t=new ke,{deckY:e,half:i,hole:s,ring:r,trenchIn:o,trenchOut:a,trenchH:l,trenchEnd:c,back:h,legX:u,legZ:d}=es;t.ext(n.apron,-26,36,-.04,.06,-30,30,.05),t.ext(n.concreteDeep,h+.6,c,0,.14,-o-.02,o+.02,.05);for(let x of[-1,1])t.ext(n.concrete,h,c,0,l,x>0?o:-a,x>0?a:-o,.2),t.ext(n.panel,h-.08,c+.08,l-.06,l+.16,x>0?o-.08:-a-.08,x>0?a+.08:-o+.08,.08),t.ext(n.scorch,h+.6,12,.14,l-.35,x>0?o-.05:-o,x>0?o:-o+.05,.02);t.ext(n.concrete,h,h+.6,0,l,-a,a,.2),t.ext(n.panel,h-.08,h+.68,l-.06,l+.16,-a-.08,a+.08,.08);let f=h+.6,p=4.2,v=6.5,g=.14,m=((v-f)**2+(p-g)**2)/(2*(p-g)),_=g+m,b=Math.atan2(p-_,f-v),y=new un;y.moveTo(f,g),y.lineTo(f,p);for(let x=1;x<=24;x++){let E=zi(b,-Lt/2,x/24);y.lineTo(v+m*Math.cos(E),_+m*Math.sin(E))}y.lineTo(f,g);let M=new dn(y,{depth:2*o-.3,bevelEnabled:!0,bevelThickness:.06,bevelSize:.06,bevelSegments:2,curveSegments:4});M.translate(0,0,-(2*o-.3)/2),t.put(n.scorch,M);for(let x of[-1,1])for(let E of[-1,1])t.ext(n.concrete,x*u-.7,x*u+.7,0,.45,E>0?a+.05:-d-.8,E>0?d+.8:-a-.05,.12),t.box(n.blueDeep,1,4.3-.3,.8,x*u,.3+(4.3-.3)/2,E*d,.16);for(let x of[-1,1])t.box(n.blueDeep,2*i-.2,.7,.8,0,4.62,x*d,.16);for(let x of[-1,1])t.box(n.blueDeep,1,.7,2*i-.2,x*u,4.62,0,.16);let w=x=>()=>{let E=wb(new un,2*(i-x),2*(i-x),1-x);return E.holes.push(new Ni().absarc(0,0,r,0,Ln,!0)),E};t.put(n.blueDeep,uf("deck-lo",w(.1),4.95,5.62,.1)),t.put(n.panel,uf("deck-hi",w(.06),5.6,e,.06));let T=()=>{let x=new un().absarc(0,0,r+.02,0,Ln,!1);return x.holes.push(new Ni().absarc(0,0,s,0,Ln,!0)),x};t.put(n.steel,uf("deck-ring",T,4.95,e,.05));for(let x=0;x<4;x++){let E=Lt/4+x*Lt/2,C=Math.cos(E)*es.clampR,D=Math.sin(E)*es.clampR;t.box(n.blueDeep,1.6,.42,1.4,C,e+.21,D,.14,0,-E,0),t.cyl(n.steel,.4,.4,1.4,C,e+.7,D,"y",.1,20)}for(let x of[-1,1])t.ext(n.concrete,-8.2,-6.8,0,.5,x>0?3.6:-4.8,x>0?4.8:-3.6,.12),t.ext(n.blueDeep,-7.95,-7.05,.45,.95,x>0?3.62:-4.45,x>0?4.45:-3.62,.08),t.cyl(n.blueDeep,.45,.45,.83,-7.5,.9,x*4.035,"z",.08,24),t.cyl(n.steel,.2,.2,.8,-7.5,.9,x*3.25,"z",.04,18),t.cyl(n.steel,.3,.3,.12,-7.5,.9,x*2.93,"z",.03,18);return t.freeze()}),dm=hi(()=>{let n=es.clampR-2.3;return{arm:$h(null,t=>{t.cyl(null,.58,.58,.75,0,1.55,0,"y",.14,24),t.ext(null,0,n-.3,1.32,1.92,-.34,.34,.16),t.ext(null,n-.62,n-.08,1.1,1.95,-.52,.52,.16)}),pad:$h(null,t=>t.ext(null,n-.14,n,1.16,1.86,-.44,.44,.05))}});function Db(){return vr("pad-apron",2048,2048,(n,t,e)=>{let i=t/62,s=e/60,r=a=>(a+26)*i,o=a=>(a+30)*s;n.strokeStyle="rgba(152, 164, 206, 0.55)",n.lineWidth=.13*i;for(let a=-24;a<36;a+=6)n.beginPath(),n.moveTo(r(a),0),n.lineTo(r(a),e),n.stroke();for(let a=-24;a<30;a+=6)n.beginPath(),n.moveTo(0,o(a)),n.lineTo(t,o(a)),n.stroke();n.strokeStyle=pt.blue,n.lineWidth=.45*i,n.setLineDash([2.2*i,1.4*i]),n.beginPath(),n.ellipse(r(0),o(0),13*i,13*s,0,0,Ln),n.stroke(),n.setLineDash([]),n.fillStyle=pt.blue;for(let a of[-1,1])n.fillRect(r(-7),o(a*3-.9),.5*i,1.8*s)})}function Im(){let n=$e(),t=Ei(Lb());t.name="launch-mount";let e=Cb(Db(),62,60);e.position.set(5,.062,0),t.add(e);let i=ll("PADLINE",{bg:null,fg:"#ffffff",px:110,h:150,padX:.1,mark:!0});for(let[o,a,l]of[[0,es.half+.015,0],[es.half+.015,0,Lt/2]]){let c=xr(i.tex,i.aspect,.46);c.position.set(o,5.28,a),c.rotation.y=l,t.add(c)}let s=[];for(let o=0;o<4;o++){let a=Lt/4+o*Lt/2,l=new Ht;l.position.set(Math.cos(a)*es.clampR,es.deckY,Math.sin(a)*es.clampR),l.rotation.y=Lt-a;let c=new Ht;l.add(c),Pn(dm().arm,n.blueDeep,c),Pn(dm().pad,n.navy,c),t.add(l),s.push(c)}let r=o=>{let a=(1-ol(o))*100*Mo;for(let l of s)l.rotation.y=a};return r(1),{group:t,deckY:es.deckY,hinge:wi(-7.5,.9,0),setClamps:r}}var vn={beamTop:2.3,pipes:[{oz:-.75,r:.36,mat:"white"},{oz:0,r:.27,mat:"steel"},{oz:.75,r:.22,mat:"blueLight"}]};function mf(n,{len:t,frame:e=new Dt,start:i=null,end:s=null,from:r=0,caps:o=!0}){let a=$e();n.within(e,()=>{let l=t-r-2,c=Math.max(1,Math.ceil(l/6)),h=Array.from({length:c+1},(u,d)=>r+1+l*d/c);for(let u of h){n.box(a.concrete,.9,.3,.9,u,.15,0,.08),n.box(a.blue,.34,1.75,.34,u,.3+.875,0,.1),n.box(a.blue,.4,.3,2.5,u,2.15,0,.1);for(let d of[-1,1])n.bar(a.blue,[u,1.45,d*.12],[u,2.02,d*.72],.12)}vn.pipes.forEach((u,d)=>{let f=i?i[d]:0,p=s?s[d]:t,v=vn.beamTop+u.r;n.cyl(a[u.mat],u.r,u.r,p-f,(f+p)/2,v,u.oz,"x",Math.min(.08,u.r*.3),20);for(let g=0;g<h.length-1;g++){let m=(h[g]+h[g+1])/2;m>f+.4&&m<p-.4&&n.cyl(a[u.mat],u.r+.07,u.r+.07,.18,m,v,u.oz,"x",.04,20)}if(o)for(let g of[f,p])n.cyl(a.steel,u.r+.05,u.r+.05,.12,g,v,u.oz,"x",.03,20)})})}function Pm({length:n=40}={}){let t=he(`rack|${n}`,()=>{let i=new ke;return mf(i,{len:n}),i.freeze()}),e=Ei(t);return e.name="pipe-rack",e}var Hn={W:56,D:28,lox:{x:-14,y:9.6,z:-2,R:7},rp1:{x:10,y:3.3,zs:[-8.3,-2.6],r:2.4,len:15.4},rackZ:6.4,rackX0:-6.5,rackX1:26},Ub=(n,t,e)=>he(`capsule|${n}|${t}|${e}`,()=>{let i=t/2-e,s=[];for(let r=0;r<=10;r++){let o=r/10*(Lt/2);s.push([n*Math.sin(o),-i-e*Math.cos(o)])}for(let r=0;r<=10;r++){let o=r/10*(Lt/2);s.push([n*Math.cos(o),i+e*Math.sin(o)])}return s[0][0]=1e-4,s[s.length-1][0]=1e-4,new fn(s.map(([r,o])=>pn(r,o)),48).rotateZ(-Lt/2)}),En={w:1.5,h:7,y0:1.3,barW:.86,barY0:1.65,barH:5.4};function fm(n,t,e){let i=$e(),s=Xe(t,0,e,0,So,0);n.within(s,()=>{n.box(i.concrete,1.4,.3,1,0,.15,0,.08),n.box(i.blue,.3,En.y0,.3,0,En.y0/2+.2,0,.1),n.box(i.white,En.w,En.h,.32,0,En.y0+En.h/2,0,.12),n.box(i.shade,En.barW+.16,En.barH+.16,.06,0,En.barY0+En.barH/2,.15,.03);for(let r=1;r<4;r++)n.box(i.post,.32,.05,.04,-En.barW/2-.12,En.barY0+En.barH*r/4,.18,.01)})}var Nb=hi(()=>{let n=$e(),t=new ke,{W:e,D:i,lox:s,rp1:r}=Hn;t.ext(n.apron,-e/2,e/2,-.04,.06,-i/2,i/2,.05);let o=Array.from({length:8},(b,y)=>Lt/8+y*Lt/4),a=(b,y)=>[s.x+Math.cos(b)*s.R,y,s.z+Math.sin(b)*s.R];for(let b of o){let[y,,M]=a(b,0);t.box(n.concrete,1.4,.5,1.4,y,.25,M,.12),t.cyl(n.blue,.44,.44,s.y+.4-.5,y,.5+(s.y+.4-.5)/2,M,"y",.1,20)}for(let b=0;b<8;b++){let y=o[b],M=o[(b+1)%8];t.tube(n.blue,.11,a(y,1.2),a(M,6.6),8),t.tube(n.blue,.11,a(M,1.2),a(y,6.6),8),t.tube(n.blue,.13,a(y,1),a(M,1),8)}t.at(n.tank,he("lox-sphere",()=>new en(s.R,64,40)),s.x,s.y,s.z);let l=s.y+s.R;t.cyl(n.steel,1.9,1.9,.22,s.x,l-.05,s.z,"y",.06,32),t.at(n.blue,he("lox-rail",()=>new ri(1.8,.06,6,40).rotateX(Lt/2)),s.x,l+.95,s.z);for(let b=0;b<8;b++){let y=b/8*Ln;t.tube(n.blue,.05,[s.x+Math.cos(y)*1.8,l,s.z+Math.sin(y)*1.8],[s.x+Math.cos(y)*1.8,l+.95,s.z+Math.sin(y)*1.8],6)}t.cyl(n.steel,.28,.28,1.7,s.x+.6,l+.85,s.z-.4,"y",.06,16),t.cyl(n.steel,.42,.42,.3,s.x+.6,l+1.7,s.z-.4,"y",.08,16);let c=vn.pipes[0],h=vn.beamTop+c.r,u=Hn.rackZ+c.oz;t.cyl(n.white,c.r,c.r,u-s.z,s.x,h,(u+s.z)/2,"z",.08,20),t.at(n.white,he("elbow-lox",()=>new en(c.r,20,12)),s.x,h,u),t.cyl(n.steel,.13,.13,1.7,-4,h+.36+.85,u,"y",.04,12),t.cyl(n.steel,.26,.26,.3,-4,h+.36+1.7,u,"y",.06,12);let d=Hn.rackX0,f=Hn.rackX1;mf(t,{len:f-d,frame:Xe(d,0,Hn.rackZ),start:vn.pipes.map((b,y)=>y===0?s.x-d:0),end:vn.pipes.map(b=>f-b.oz-d),from:-4.5,caps:!1});let p=i/2-Hn.rackZ;mf(t,{len:p,frame:Xe(f,0,Hn.rackZ,0,-Lt/2,0),start:vn.pipes.map(b=>b.oz),from:1.5,caps:!1});for(let b of vn.pipes)t.at(n[b.mat],he(`elbow|${b.r}`,()=>new en(b.r,20,12)),f-b.oz,vn.beamTop+b.r,Hn.rackZ+b.oz);for(let b of vn.pipes.slice(1))t.cyl(n.steel,b.r+.05,b.r+.05,.12,d,vn.beamTop+b.r,Hn.rackZ+b.oz,"x",.03,20);t.ext(n.concreteDeep,.6,19.4,0,.1,-11.8,.8,.04);for(let[b,y,M,w]of[[.6,19.4,-11.8,-11.4],[.6,19.4,.4,.8],[.6,1,-11.8,.8],[19,19.4,-11.8,.8]])t.ext(n.concrete,b,y,0,.9,M,w,.12);for(let b of r.zs){t.at(n.tank,Ub(r.r,r.len,1.2),r.x,r.y,b);for(let y of[-1,1])t.cyl(n.blue,r.r+.04,r.r+.04,.6,r.x+y*5.4,r.y,b,"x",.06,48),t.box(n.concrete,1,1.5,3.4,r.x+y*4.4,.75,b,.12);t.cyl(n.steel,.5,.5,.5,r.x-3,r.y+r.r+.1,b,"y",.08,20),t.cyl(n.steel,.12,.12,1.2,r.x+3,r.y+r.r+.5,b,"y",.03,12)}let v=vn.pipes[1];t.cyl(n.steel,v.r,v.r,Hn.rackZ+1,r.x+6,vn.beamTop+v.r,(Hn.rackZ-1)/2,"z",.06,20);let g=Array.from({length:8},(b,y)=>3.4+y*2.2);t.ext(n.concrete,2,20.2,0,.4,8.4,10.6,.1);let m=Wh("bottle",[[1e-4,0],[.7,.02],[.8,.15],[.8,6.5],[.74,6.9],[.55,7.25],[.3,7.45],[1e-4,7.5]],32);for(let b of g)t.at(n.blueLight,m,b,.4,9.5),t.cyl(n.white,.56,.4,.5,b,7.6,9.5,"y",.1,20),t.cyl(n.steel,.1,.1,.5,b,8.1,9.5,"y",.03,10);for(let b of[8.55,10.45])t.box(n.steel,18,.16,.16,11.1,5.8,b,.06);for(let b of[2.3,19.9])for(let y of[8.55,10.45])t.box(n.steel,.18,5.4,.18,b,.4+2.7,y,.06);let _=vn.pipes[2];t.cyl(n.blueLight,_.r,_.r,17.6,11.1,.95,7.9,"x",.05,16),t.cyl(n.blueLight,_.r,_.r,7.9-(Hn.rackZ+_.oz),19.9,.95,(7.9+Hn.rackZ+_.oz)/2,"z",.05,16),t.cyl(n.blueLight,_.r,_.r,vn.beamTop+_.r-.95,19.9,(vn.beamTop+_.r+.95)/2,Hn.rackZ+_.oz,"y",.05,16),t.box(n.white,7,5.2,5,-2,2.6,10.7,.3),t.box(n.roof,7.6,.5,5.6,-2,5.35,10.7,.18),t.box(n.blue,1.8,2.8,.2,-3.6,1.4,13.22,.08);for(let b=0;b<4;b++)t.box(n.navy,.2,.12,2.6,1.52,2.4+b*.42,10.7,.03);return t.box(n.window,1.8,1,.2,.2,3.2,13.22,.08),t.cyl(n.steel,.3,.3,2.2,.6,5.6+1.1,9.7,"y",.06,16),t.cyl(n.steel,.44,.44,.3,.6,7.8,9.7,"y",.08,16),fm(t,s.x,9),fm(t,22.8,-5),t.freeze()});function Zh(){let n=$e(),{lox:t,rp1:e}=Hn,i=Ei(Nb());i.name="tank-farm";let s=wm(Sm("LOX",{reps:8,px:120}),t.R+.06,1.8);s.position.set(t.x,t.y,t.z),s.rotation.y=Lt/8,i.add(s);let r=vr("rp1-label",1024,256,(h,u,d)=>{h.fillStyle=pt.blue,h.font=ns(800,170,!0),h.textAlign="center",h.textBaseline="middle",h.fillText("RP-1",u/2+70,d/2+8),al(h,u/2-250,d/2,90,pt.blue)}),o=new zt(he("rp1-strip",()=>ym(e.r+.02,e.y,e.zs[1],e.x-4,e.x+4,Lt/2-.42,Lt/2+.42,16,10)),cl(r));i.add(o);let a=[];for(let[h,u,d,f]of[[t.x,9,"LOX",n.blue],[22.8,-5,"RP-1",n.blueDeep]]){let p=new Ht;p.position.set(h,0,u),p.rotation.y=So,i.add(p);let v=ll(d,{px:96,h:150,padX:.24}),g=xr(v.tex,v.aspect,.6);g.position.set(0,En.y0+En.h-.55,.17),p.add(g);let m=Pn(he("gauge-bar",()=>new Ye(En.barW,1,.08).translate(0,.5,0)),f,p);m.position.set(0,En.barY0,.2),m.castShadow=!1,a.push(m)}let l=(h,u)=>{[h,u].forEach((d,f)=>{let p=ol(d);a[f].scale.y=Math.max(.001,p*En.barH),a[f].visible=p>.002})};l(1,1);let c=[wi(t.x+.6,t.y+t.R+1.9,t.z-.4),wi(-4,vn.beamTop+vn.pipes[0].r+.36+1.9,Hn.rackZ+vn.pipes[0].oz),wi(.6,8,9.7)];return{group:i,setFill:l,vents:c}}var Lm={legs:6,rb:7,rt:5.4,legTop:22.4,R:7,y0:22.6,y1:31.2},Fb=hi(()=>{let n=$e(),t=new ke,{legs:e,rb:i,rt:s,legTop:r,R:o,y0:a,y1:l}=Lm,c=Array.from({length:e},(p,v)=>Lt/6+v*Ln/e),h=(p,v)=>{let g=zi(i,s,(v-.6)/(r-.6));return[Math.cos(p)*g,v,Math.sin(p)*g]};for(let p of c){let[v,,g]=h(p,.6);t.box(n.concrete,1.5,.6,1.5,v,.3,g,.14),t.tube(n.white,.5,h(p,.6),h(p,r+.4),16),t.cyl(n.white,.62,.62,.5,v,.85,g,"y",.12,16)}let u=[.9,8,15.3,r-.4];for(let p=0;p<e;p++){let v=c[p],g=c[(p+1)%e];for(let m of u.slice(1))t.tube(n.blue,.17,h(v,m),h(g,m),8);for(let m=0;m<u.length-1;m++)t.tube(n.blue,.1,h(v,u[m]+.2),h(g,u[m+1]-.2),6),t.tube(n.blue,.1,h(g,u[m]+.2),h(v,u[m+1]-.2),6)}t.cyl(n.white,1.1,1.1,a-1,0,(a-1)/2,0,"y",.12,32),t.box(n.concrete,3,.5,3,0,.25,0,.14);let d=[];for(let p=0;p<=12;p++){let v=p/12*(Lt/2);d.push([o*Math.sin(v)+1e-4,a-2.4*Math.cos(v)])}t.put(n.tank,Wh("wt-bowl",d,64)),t.cyl(n.tank,o,o,l-a,0,(a+l)/2,0,"y",.2,64);let f=[[o+.12,l-.1],[o+.12,l+.15]];for(let p=0;p<=12;p++){let v=p/12*(Lt/2);f.push([(o+.1)*Math.cos(v)+1e-4,l+.15+3.2*Math.sin(v)])}t.put(n.roof,Wh("wt-roof",f,64)),t.put(n.steel,Wh("wt-deck",[[o-.2,a-.3],[o+1.2,a-.3],[o+1.2,a],[o-.2,a]],64)),t.at(n.blue,he("wt-rail",()=>new ri(o+1.1,.07,6,72).rotateX(Lt/2)),0,a+1.1,0);for(let p=0;p<24;p++){let v=p/24*Ln;t.tube(n.blue,.05,[Math.cos(v)*(o+1.1),a,Math.sin(v)*(o+1.1)],[Math.cos(v)*(o+1.1),a+1.1,Math.sin(v)*(o+1.1)],6)}for(let p of[-1,1])t.tube(n.steel,.05,[1.25,1,p*.3],[1.25,a-2.6,p*.3],6);for(let p=1.4;p<a-2.6;p+=.6)t.tube(n.steel,.035,[1.25,p,-.3],[1.25,p,.3],6);return t.cyl(n.steel,.3,.14,1.6,0,l+3.35+.8,0,"y",.05,16),t.at(n.red,he("beacon-ball",()=>new en(.32,16,10)),0,l+5.2,0),t.freeze()});function Dm(){let n=Ei(Fb());n.name="water-tower";let t=wm(Sm("PADLINE",{reps:3,px:120}),Lm.R+.04,2.4);return t.position.y=27.6,t.rotation.y=So-Lt/3,n.add(t),n}function Um({h:n=52}={}){let t=$e(),e=he(`lightning|${n}`,()=>{let s=new ke,r=.8,o=.34,a=n-5.4,l=c=>zi(r,o,(c-.6)/(a-.6));s.box(t.concrete,2.6,.6,2.6,0,.3,0,.2),s.cyl(t.white,r,o,a-.6,0,(a+.6)/2,0,"y",.08,20);for(let c=5;c<a-3;c+=8)s.cyl(t.blue,l(c)+.05,l(c+1.2)+.05,1.2,0,c+.6,0,"y",.04,20);return s.cyl(t.blue,.5,.42,.7,0,a+.25,0,"y",.1,20),s.put(t.steel,he(`spike|${n}`,()=>new ta(.16,n-a-.55,12).translate(0,(n+a+.55)/2,0))),s.at(t.red,he("beacon-lt",()=>new en(.26,14,10)),0,a+.8,0),s.freeze()}),i=Ei(e);return i.name="lightning-tower",i}function Ob(n,t){return vr(`lz|${n}|${t}`,2048,2048,(e,i)=>{let s=i/(2*n),r=i/2;e.fillStyle="#ffffff",e.strokeStyle="#ffffff",e.lineWidth=1.7*s,e.beginPath(),e.arc(r,r,.68*n*s,0,Ln),e.stroke(),e.lineWidth=.4*s,e.beginPath(),e.arc(r,r,.36*n*s,0,Ln),e.stroke();let o=.1*n*s,a=.56*n*s,l=.75*s;for(let[h,u]of[[1,0],[-1,0],[0,1],[0,-1]])h?e.fillRect(h>0?r+o:r-a,r-l,a-o,2*l):e.fillRect(r-l,u>0?r+o:r-a,2*l,a-o);e.lineWidth=.9*s;for(let h=0;h<4;h++){let u=Lt/4+h*Lt/2,d=.6*n*s,f=.76*n*s;e.beginPath(),e.moveTo(r+Math.cos(u)*d,r+Math.sin(u)*d),e.lineTo(r+Math.cos(u)*f,r+Math.sin(u)*f),e.stroke()}e.beginPath(),e.arc(r,r,.55*s,0,Ln),e.fill(),e.save();let c=.855*n;e.translate(r+Math.sin(So)*c*s,r+Math.cos(So)*c*s),e.rotate(-So),e.font=ns(900,.22*n*s),e.textAlign="center",e.textBaseline="middle",e.fillText(t,0,.012*n*s),e.restore()})}function Nm({r:n=18}={}){let t=$e(),e=he(`lz|${n}`,()=>{let r=new ke;r.cyl(t.apron,n+5,n+5,.12,0,.02,0,"y",.04,96),r.cyl(t.lz,n,n,.16,0,.06,0,"y",.05,96),r.ext(t.apron,-4,4,-.04,.07,n+3,n+30,.03);for(let a=n+6;a<n+29;a+=4)r.flat(t.white,.22,.02,2,0,.08,a+1);for(let a of[-1,1])r.flat(t.white,.16,.02,25.5,a*3.5,.08,n+16.75);let o=24;for(let a=0;a<o;a++){let l=a/o*Ln;r.cyl(t.blueLight,.3,.24,.1,Math.cos(l)*(n+1.6),.13,Math.sin(l)*(n+1.6),"y",.04,14)}return r.freeze()}),i=Ei(e);i.name="landing-zone";let s=new zt(he(`lz-disc|${n}`,()=>new gi(n-.06,96).rotateX(-Lt/2)),cl(Ob(n,"LZ-2")));return s.position.y=.141,s.receiveShadow=!0,i.add(s),i}var $s={slotX:-17.6,axisY:3.4,rb:2.3,gz0:2.55,gz1:2.95,gy0:1.35,gy1:2.45,saddles:[[-12.8,-11.6],[3.4,4.6]],cup:1.25},Bb=hi(()=>{let n=$e(),t=new ke,{gz0:e,gz1:i,gy0:s,gy1:r,axisY:o,rb:a,cup:l}=$s;bm(t,{x0:14.75,x1:17.7,top:4.1,W:3.5,color:pt.blue,arches:[[16.05,.75,.9]],seam:pt.blueDeep}),t.ext(n.chassis,10.3,17.4,.95,1.55,-1.05,1.05,.08);for(let u of[-1,1])t.ext(n.vBlue,13.45,14.6,.62,1.42,u>0?1.05:-1.72,u>0?1.72:-1.05,.16),t.ext(n.ink,10.3,13.5,1.6,1.7,u>0?1.05:-1.9,u>0?1.9:-1.05,.04);t.ext(n.ink,11.15,12.65,1.5,1.74,-1.1,1.1,.08),t.cyl(n.vSteel,.13,.13,3.2,14.5,3.15,-1.42,"y",.04,12),t.cyl(n.ink,.15,.15,.25,14.5,4.8,-1.42,"y",.04,12),rl(t,16.3,4.1,-1.15),rl(t,16.3,4.1,1.15),t.ext(n.vBlue,9.6,13.4,1.74,2.55,-1.45,1.45,.2),t.ext(n.vBlue,9.6,10.1,s,2.55,-i,i,.14);for(let u of[-1,1]){t.ext(n.vBlue,-17.9,10.1,s,r,u>0?e:-i,u>0?i:-e,.16),t.ext(n.vBlueDeep,-17.6,9.5,r-.02,r+.06,u>0?e+.06:-i+.06,u>0?i-.06:-e-.06,.02);for(let d of[-13.9,-15.3,-16.7])t.ext(n.ink,d-.5,d+.5,s-.12,s+.02,u>0?e:-i,u>0?i:-e,.04);t.ext(n.tail,-17.98,-17.88,1.7,2.05,u>0?2.6:-2.9,u>0?2.9:-2.6,.03);for(let d=-14;d<9;d+=6)t.ext(n.beacon,d-.12,d+.12,1.84,1.96,u>0?i-.01:-i-.03,u>0?i+.03:-i+.01,.02)}for(let u of[-13.9,-15.3,-16.7])t.cyl(n.ink,.11,.11,5.4,u,.6,0,"z",.03,12);for(let u of[-6.5,-1]){t.ext(n.chassis,u-.25,u+.25,.62,.9,-i+.05,i-.05,.06);for(let d of[-1,1])t.ext(n.chassis,u-.22,u+.22,.62,s+.05,d>0?e+.02:-i+.08,d>0?i-.08:-e-.02,.05)}t.ext(n.chassis,-18,-17.78,.45,.75,-i,i,.06);for(let u of[-1,1])t.ext(n.chassis,-17.95,-17.7,.6,s+.05,u>0?e+.02:-i+.08,u>0?i-.08:-e-.02,.05);let c=()=>{let u=new un;u.moveTo(-l-.15,.95),u.lineTo(l+.15,.95);let d=f=>o-Math.sqrt(a*a-f*f);u.lineTo(l+.15,d(l)+.05);for(let f=0;f<=20;f++){let p=zi(l,-l,f/20);u.lineTo(p,d(p)-.08)}return u.lineTo(-l-.15,d(l)+.05),u.closePath(),u},h=()=>{let u=new un,d=[];for(let f=0;f<=20;f++){let p=zi(-l,l,f/20);d.push([p,o-Math.sqrt(a*a-p*p)])}u.moveTo(d[0][0],d[0][1]-.09);for(let[f,p]of d)u.lineTo(f,p-.09);for(let f=d.length-1;f>=0;f--)u.lineTo(d[f][0],d[f][1]-.005);return u.closePath(),u};for(let[u,d]of $s.saddles){let f=d-u,p=Xe((u+d)/2,0,0,0,Lt/2,0);t.put(n.vBlueDeep,qh(`cradle|${f}`,c,f,.06),p),t.put(n.ink,qh(`liner|${f}`,h,f+.1,.005),p),t.ext(n.chassis,u-.05,d+.05,.6,.98,-i+.05,i-.05,.08);for(let v of[-1,1])t.ext(n.chassis,u+.1,d-.1,.6,s+.05,v>0?e+.02:-i+.08,v>0?i-.08:-e-.02,.06)}return t.freeze()});function Fm(){let n=new Ht;n.name="booster-trailer",Ei(Bb(),n);let t=ll("PADLINE",{bg:null,fg:"#ffffff",px:110,h:150,padX:.1,mark:!0});for(let o of[-1,1]){let a=xr(t.tex,t.aspect,.62);a.position.set(-4.2*o,($s.gy0+$s.gy1)/2+.02,o*($s.gz1+.012)),a.rotation.y=o>0?0:Lt,n.add(a)}let e=pf(n,.75,.64,[...Xh([16.05],1.4),...Xh([12.6,11.2],1.5)]),i=pf(n,.6,.5,Xh([-13.9,-15.3,-16.7],2.7)),s=new Qe;return s.name="booster-slot",s.position.set($s.slotX,$s.axisY,0),n.add(s),{group:n,roll:o=>{e(o),i(o)},slot:s,axisY:$s.axisY}}var ze={slewX:-3.15,pivot:[-1.4,4.3],boomY:.2,axles:[4.1,2.45,-2.35,-4],R:.7,outX:[5.2,-6.1],ramA:[.8,2.9],ramB:[6,-.55]},zb=hi(()=>{let n=$e(),t=new ke,e=3;t.ext(n.chassis,-6.9,6.2,.75,1.45,-.95,.95,.1),t.put(n.vYellow,qh("crane-deck",()=>_m(-7,5.62,1.45,2.1,{rc:[.32,.22,.22,.32]},.12),e,.12));for(let i of[-1,1])t.ext(n.vYellowDeep,-1.45,1.55,.78,1.5,i>0?.95:-1.48,i>0?1.48:-.95,.1),t.ext(n.ink,-1.3,1.4,1.05,1.12,i>0?1.46:-1.5,i>0?1.5:-1.46,.015);t.ext(n.vYellowDeep,-7,-4.95,.7,1.5,-1.48,1.48,.14),t.ext(n.vYellowDeep,-6.7,5.2,2.08,2.14,-1.35,1.35,.02),t.cyl(n.ink,1.45,1.45,.16,ze.slewX,2.12,0,"y",.04,40);for(let i of ze.outX)t.ext(n.vYellowDeep,i-.32,i+.32,.9,1.55,-1.5,1.5,.08);t.ext(n.ink,4.25,4.75,2.1,3.95,-.32,.32,.08),t.ext(n.ink,4.15,4.85,3.85,3.97,-.62,.62,.04),bm(t,{x0:5.6,x1:7,y0:.62,top:2.8,W:e,color:pt.yellow,seam:Xs.yellowDeep}),rl(t,6,2.8,-1,.14),rl(t,6,2.8,1,.14);for(let i of[-1,1])t.ext(n.tail,-7.06,-6.98,1.25,1.55,i*1.1-.18,i*1.1+.18,.03);return t.freeze()}),kb=hi(()=>{let n=$e(),t=new ke,[e,i]=ze.pivot;t.cyl(n.vYellowDeep,1.3,1.3,.3,0,2.35,0,"y",.06,40),t.ext(n.vYellow,-1.9,1.7,2.5,3.6,-1.25,1.25,.22);for(let s of[-1,1])t.ext(n.vYellow,e-.75,e+1.6,3.2,i+.55,s>0?.6:-.86,s>0?.86:-.6,.12);return t.ext(n.vBlue,-3.45,-1.75,2.45,3.95,-1.4,1.4,.3),t.ext(n.vBlueDeep,-3.5,-1.7,2.8,2.9,-1.45,1.45,.03),t.ext(n.vYellow,-1.9,-.6,3.55,4.05,-.5,.5,.15),t.ext(n.vYellow,-.6,1.95,2.5,4.5,.95,1.9,.24),t.ext(n.vGlass,1.9,1.99,3.05,4.25,1.05,1.8,.04),t.ext(n.vGlass,-.3,1.65,3.15,4.25,1.88,1.93,.03),t.ext(n.ink,-.65,2,4.45,4.58,.9,1.95,.04),rl(t,-2.6,3.95,-.9,.13),t.freeze()}),Hb=hi(()=>{let n=ze.boomY,t=new ke;t.ext(null,-.9,10.6,n-.525,n+.525,-.475,.475,.16),t.cyl(null,.45,.45,1.32,0,0,0,"z",.08,20),t.ext(null,ze.ramB[0]-.3,ze.ramB[0]+.3,ze.ramB[1]-.1,n-.4,-.32,.32,.08);let e=new ke;e.ext(null,0,11,n-.425,n+.425,-.39,.39,.12);let i=new ke;i.ext(null,0,11,n-.34,n+.34,-.31,.31,.1),i.ext(null,10.9,11.6,n-.5,n+.4,-.36,.36,.12);let s=new ke;s.cyl(null,.42,.42,.5,11.45,n-.12,0,"z",.06,20);let r=new ke;for(let o of[-1,1])r.ext(null,7.5,10.4,n-.12,n+.12,o>0?.46:-.49,o>0?.49:-.46,.02);return{base:t.freeze()[0].geo,s2:e.freeze()[0].geo,s3:i.freeze()[0].geo,head:s.freeze()[0].geo,stripe:r.freeze()[0].geo}}),Gb=hi(()=>{let n=new ke;n.ext(null,-.2,.2,-.2,.2,-2.6,0,.06),n.cyl(null,.24,.24,.9,0,.1,-.1,"y",.06,16);let t=new ke;return t.cyl(null,.13,.13,1,0,-.5,0,"y",.03,12),t.cyl(null,.42,.42,.12,0,-.94,0,"y",.04,20),{beam:n.freeze()[0].geo,jack:t.freeze()[0].geo}});function Jh(){let n=$e(),t=new Ht;t.name="mobile-crane",Ei(zb(),t);let e=pf(t,ze.R,.64,Xh(ze.axles,1.15)),i=Gb(),s=[];for(let w of ze.outX)for(let T of[-1,1]){let x=Pn(i.beam,n.vYellow,t),E=Pn(i.jack,n.ink,t);x.rotation.y=T>0?0:Lt,s.push({beam:x,jack:E,x:w,s:T})}let r=new Ht;r.position.x=ze.slewX,t.add(r),Ei(kb(),r);let o=Hb(),a=new Ht;a.position.set(ze.pivot[0],ze.pivot[1],0),r.add(a),Pn(o.base,n.vYellow,a),Pn(o.stripe,n.vBlue,a);let l=Pn(o.s2,n.vYellow,a),c=new Ht;a.add(c),Pn(o.s3,n.vYellow,c),Pn(o.head,n.ink,c);let h=3.2,u=Pn(he("crane-barrel",()=>new Ve(.21,.21,h,16).rotateZ(-Lt/2).translate(h/2,0,0)),n.ink,r),d=Pn(he("crane-rod",()=>new Ve(.12,.12,1,14).rotateZ(-Lt/2).translate(.5,0,0)),n.vSteel,r),f=Pn(he("crane-rope",()=>new Ve(.045,.045,1,6).translate(0,-.5,0)),n.ink,r);f.castShadow=!1;let p=new Ht;r.add(p),Pn(he("hook-block",()=>$h(null,w=>{w.ext(null,-.3,.3,-.8,0,-.26,.26,.12),w.ext(null,-.36,.36,-.55,-.35,-.3,.3,.06)})),n.vYellow,p),Pn(he("hook",()=>$h(null,w=>{w.cyl(null,.07,.07,.3,0,-.95,0,"y",.02,10),w.put(null,new ri(.2,.065,8,20,Lt*1.5).rotateZ(Lt*.75).translate(0,-1.3,0))})),n.ink,p);let v=new Qe;v.name="crane-hook",v.position.y=-1.52,p.add(v);let g=ze.boomY,m=new ct,_=new ct,b=new ct,y=w=>{let T=ol(w),x=60*Mo*Hh(T/.7),E=Hh((T-.35)/.65),C=Hh(T/.12),D=Hh((T-.06)/.12);a.rotation.z=x;let N=-.4+10*E,F=-.3+20*E;l.position.x=N,c.position.x=F;let P=Math.cos(x),z=Math.sin(x);_.set(ze.ramA[0],ze.ramA[1]),b.set(ze.pivot[0]+ze.ramB[0]*P-ze.ramB[1]*z,ze.pivot[1]+ze.ramB[0]*z+ze.ramB[1]*P);let G=b.x-_.x,$=b.y-_.y,et=Math.hypot(G,$),X=Math.atan2($,G);u.position.set(_.x,_.y,0),u.rotation.z=X,d.position.set(b.x,b.y,0),d.rotation.z=X+Lt,d.scale.x=Math.max(.1,et-h+.6);let tt=F+11.45+.42,nt=g-.12;m.set(ze.pivot[0]+tt*P-nt*z,ze.pivot[1]+tt*z+nt*P);let St=zi(.1,1.6,T);f.position.set(m.x,m.y,0),f.scale.y=St,p.position.set(m.x,m.y-St,0);for(let yt of s){let jt=1.86+2.1*C;yt.beam.position.set(yt.x,1.22,yt.s*jt);let $t=zi(.95,0,D);yt.jack.position.set(yt.x,$t+1,yt.s*(jt-.1))}},M=w=>{r.rotation.y=w};return y(0),M(0),{group:t,roll:e,setBoom:y,setSwing:M,hook:v}}var Yh={W:40,D:24,H:7.6},Vb=(n,t)=>he(`dish|${n}|${t}`,()=>{let e=a=>t*a*a/(n*n),i=[];for(let a=12;a>=0;a--){let l=n*a/12;i.push([l+1e-4,e(l)-.12])}i.reverse();let r=i.map(([a,l])=>pn(a,l)),o=[];for(let a=12;a>=0;a--){let l=n*a/12;o.push(pn(l+1e-4,e(l)))}return new fn([...r,pn(n+.05,t-.12*.5),...o],40)});function ff(n,{x:t,y:e,z:i,R:s,yaw:r,tilt:o}){let a=$e(),l=s*.32;n.cyl(a.blue,.55,.55,e-Yh.H-.1,t,(e+Yh.H+.1)/2,i,"y",.1,20),n.box(a.blueDeep,1.4,.6,1.4,t,e,i,.15);let c=Xe(t,e+.6,i,0,r,0).multiply(Xe(0,0,0,0,0,-o));n.within(c,()=>{n.put(a.white,Vb(s,l)),n.cyl(a.steel,.4,.4,.5,0,-.2,0,"y",.08,16);let h=s*.95;for(let u=0;u<3;u++){let d=u/3*Ln;n.tube(a.steel,.05,[Math.cos(d)*s*.92,l*.85,Math.sin(d)*s*.92],[0,h,0],6)}n.cyl(a.steel,.16,.2,.5,0,h,0,"y",.04,12)})}var Wb=hi(()=>{let n=$e(),t=new ke,{W:e,D:i,H:s}=Yh;t.box(n.white,e,s,i,0,s/2,0,.45),t.box(n.blue,e+.3,.9,.55,0,s+.25,i/2-.12,.2),t.box(n.blue,e+.3,.9,.55,0,s+.25,-i/2+.12,.2),t.box(n.blue,.55,.9,i+.3,e/2-.12,s+.25,0,.2),t.box(n.blue,.55,.9,i+.3,-e/2+.12,s+.25,0,.2),t.box(n.shade,e-.8,.12,i-.8,0,s+.04,0,.04);let r=[[e,i/2,0],[e,-i/2,Lt],[i,e/2,Lt/2],[i,-e/2,-Lt/2]];for(let[o,a,l]of r){let c=new Dt().makeRotationY(l).multiply(Xe(0,0,Math.abs(a)));t.within(c,()=>{for(let[h,u]of[[1.2,3],[4.3,6.3]]){let f=l===0&&h<2?[[-o/2+1.4,-13.5],[-6.5,o/2-1.4]]:[[-o/2+1.4,o/2-1.4]];for(let[p,v]of f){t.ext(n.window,p,v,h,u,-.1,.08,.06);for(let g=p+2.4;g<v-.5;g+=2.4)t.flat(n.white,.14,u-h,.06,g,(h+u)/2,.1)}}})}t.ext(n.glass,-13.2,-6.8,.05,3,i/2-.1,i/2+.1,.06),t.ext(n.blue,-14.5,-5.5,3.3,3.8,i/2-.2,i/2+3.6,.18);for(let o of[-14,-6])t.box(n.blue,.3,3.3,.3,o,1.65,i/2+3.3,.1);t.ext(n.panel,-15,-5,-.02,.1,i/2,i/2+4.2,.04),t.ext(n.blue,16,21,0,10.4,-3,3.5,.3),t.ext(n.blueDeep,15.9,21.1,10.2,10.55,-3.1,3.6,.12),t.box(n.window,1.4,7,.2,18.5,4.4,3.52,.06),t.cyl(n.white,1.6,1.6,.9,18.5,11,.25,"y",.12,32),t.at(n.white,he("radome",()=>new en(2.3,40,24,0,Ln,0,Lt*.62)),18.5,12.4,.25);for(let[o,a]of[[-15,-6],[-9.5,-6]]){t.box(n.panel,4.2,1.4,2.6,o,s+.8,a,.25);for(let l of[-1,1])t.cyl(n.navy,.75,.75,.1,o+l*1,s+1.52,a,"y",.03,24)}return ff(t,{x:-4,y:10,z:-4.5,R:3.6,yaw:-Lt/4,tilt:50*Mo}),ff(t,{x:4.5,y:9.3,z:5.5,R:2,yaw:-Lt/4,tilt:42*Mo}),ff(t,{x:-16,y:9.3,z:4.5,R:1.8,yaw:-Lt/4,tilt:58*Mo}),t.freeze()});function Om(){let n=Ei(Wb());n.name="control-center";let{W:t,D:e,H:i}=Yh,s=ll("PADLINE  \xB7  LAUNCH CONTROL",{bg:null,fg:"#ffffff",px:104,h:150,padX:.1,mark:!0}),r=xr(s.tex,s.aspect,.72);r.position.set(-2,i+.27,e/2+.165),n.add(r);let o=Mm("PADLINE","Launch Control"),a=1.45,l=new zt(Be(.2,a+.1,o.aspect*a+.1,.08),$e().white);l.position.set(21.12,5.6,.25),l.castShadow=l.receiveShadow=!0,n.add(l);let c=xr(o.tex,o.aspect,a);return c.position.set(21.23,5.6,.25),c.rotation.y=Lt/2,n.add(c),n}var qe=Math.PI,yr=qe*2,_r=qe/180,Bm=(n,t,e)=>Math.min(e,Math.max(t,n)),eu=(n,t,e)=>n+(t-n)*e,Xb=n=>{let t=Bm(n,0,1);return t*t*(3-2*t)},He=(n=0,t=0,e=0)=>new U(n,t,e),$b=He(),qb=new ve,Yb=new hn,Zb=He(1,1,1),ti=(n=0,t=0,e=0,i=0,s=0,r=0,o=1,a=1,l=1)=>new Dt().compose($b.set(n,t,e),qb.setFromEuler(Yb.set(i,s,r)),Zb.set(o,a,l)),Ti={truss:"#dfe4f2",inset:"#8e9ac2",cells:"#2442b4",backing:"#d3ddf8",port:"#b3bdd9",ocean:"#1f4bb8",shallow:"#4c80e4",sand:"#dccb9f",sage:"#97b890",cloud:"#ffffff",cloudShadow:"#0c1f6a",glow:"#8fbcff"},zm={bg:"#111a3a",fog:{color:"#8eb2f0",near:650,far:2400},sun:{color:"#ffffff",intensity:2.5},hemi:{sky:"#f3f6ff",ground:"#a7bdf2",intensity:1.05}},jh=null;function Jb(){return jh||(jh={white:gt(pt.white,{paint:!0,rough:.5}),old:gt(pt.panel,{paint:!0,rough:.55}),blue:gt(pt.blue,{paint:!0,rough:.45}),truss:gt(Ti.truss,{rough:.55}),inset:gt(Ti.inset,{rough:.7}),shade:gt(pt.shade,{rough:.6}),port:gt(Ti.port,{rough:.4}),cells:gt(Ti.cells,{rough:.3}),backing:gt(Ti.backing,{rough:.6}),glass:gt(pt.glass,{rough:.16}),navy:gt(pt.navy,{rough:.7})},jh)}function vf(n){let t=n.index?n.toNonIndexed():n.clone();for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ee(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}var xf=new Map,nu=(n,t)=>(xf.has(n)||xf.set(n,t()),xf.get(n));function jb(n,t,e,i=.12,s=32){return nu(`rcyl|${n}|${t}|${e}|${i}|${s}`,()=>{let r=Math.min(i,e/2-.001,Math.min(n,t)-.001),o=[new ct(1e-4,-e/2)],a=(l,c,h,u)=>{for(let d=0;d<=4;d++){let f=eu(h,u,d/4);o.push(new ct(l+r*Math.cos(f),c+r*Math.sin(f)))}};return a(n-r,-e/2+r,-qe/2,0),a(t-r,e/2-r,0,qe/2),o.push(new ct(1e-4,e/2)),new fn(o,s)})}function Kb(n,t,e,i=.08,s=48){return nu(`rring|${n}|${t}|${e}|${i}|${s}`,()=>{let r=[],o=(a,l,c,h)=>{for(let u=0;u<=4;u++){let d=eu(c,h,u/4);r.push(new ct(a+i*Math.cos(d),l+i*Math.sin(d)))}};return o(t-i,-e/2+i,-qe/2,0),o(t-i,e/2-i,0,qe/2),o(n+i,e/2-i,qe/2,qe),o(n+i,-e/2+i,qe,qe*1.5),r.push(r[0].clone()),new fn(r,s)})}var qs=class{constructor(){this.parts=new Map,this.stack=[new Dt]}at(t,e){return this.stack.push(this.stack[this.stack.length-1].clone().multiply(t)),e(),this.stack.pop(),this}add(t,e,i){let s=vf(e);return i&&s.applyMatrix4(i),this.stack.length>1&&s.applyMatrix4(this.stack[this.stack.length-1]),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(s),this}box(t,e,i,s,r,o,a,l=null,c=0,h=0,u=0){return this.add(t,Be(e,i,s,l??Math.min(e,i,s)*.2),ti(r,o,a,c,h,u))}cyl(t,e,i,s,r,o,a,l="y",c=.12,h=32){let u=l==="x"?ti(r,o,a,0,0,-qe/2):l==="z"?ti(r,o,a,qe/2,0,0):ti(r,o,a);return this.add(t,jb(e,i,s,c,h),u)}ring(t,e,i,s,r,o,a,l="z",c=.08){let h=l==="x"?ti(r,o,a,0,0,-qe/2):l==="z"?ti(r,o,a,qe/2,0,0):ti(r,o,a);return this.add(t,Kb(e,i,s,c),h)}build(t=new Ht){for(let[e,i]of this.parts){let s=new zt(Mn(i,!1),e);s.castShadow=s.receiveShadow=!0,t.add(s)}return t}};function yf(n,t,e,i,s,r=.08){let o=new U().subVectors(i,e),a=o.length(),l=new ve().setFromUnitVectors(He(0,1,0),o.multiplyScalar(1/a));n.add(t,Be(s,a,s,r,1),new Dt().compose(e.clone().add(i).multiplyScalar(.5),l,He(1,1,1)))}function tu(n,t,e){let i=new _n(n,t,e.length);return e.forEach((s,r)=>i.setMatrixAt(r,s)),i.instanceMatrix.needsUpdate=!0,i.castShadow=i.receiveShadow=!0,i.computeBoundingSphere(),i.computeBoundingBox(),i}var km=1.63,oe=-5.2,Qh=24.35,Qb=[27.6,38.2],Dn={w:9.3,root:3,cell0:4.45,cell1:31.75,tip:32.4},Tn={x:4.2,z:-.7,L1:10.5,L2:9.5,w:1.55,base:km+.45,shoulder:.95},tM=[0,0,qe,0],eM=[-88*_r,18*_r,-30*_r,-40*_r];function Hm(n,t,e,i){let s=i-e,r=(e+i)/2;n.box(t.inset,s,2.7,2.7,r,0,0,.25);for(let l of[-1,1])for(let c of[-1,1])n.box(t.truss,s,.62,.62,r,l*1.32,c*1.32,.22);let o=Math.max(1,Math.round(s/3.6)),a=s/o;for(let l=0;l<=o;l++)n.box(t.truss,.44,3.12,3.12,e+l*a,0,0,.2);for(let l=0;l<o;l++){let c=e+l*a+.2,h=e+(l+1)*a-.2,u=l%2?1:-1;for(let d of[-1,1])yf(n,t.truss,He(c,d*1.37,u*1.12),He(h,d*1.37,-u*1.12),.32),yf(n,t.truss,He(c,u*1.12,d*1.37),He(h,-u*1.12,d*1.37),.32)}}var wo=(n,t,e,i,s,r=.85)=>n.cyl(t,e,e,s-i,0,oe,(i+s)/2,"z",r,40),Jn=(n,t,e,i,s=0,r="z")=>r==="z"?n.cyl(t.blue,e+.08,e+.08,.5,s,oe,i,"z",.18,40):n.cyl(t.blue,e+.08,e+.08,.5,s,oe,i,"x",.18,40),Kh=(n,t,e,i=1.55)=>n.cyl(t.shade,i,i,.9,0,oe,e,"z",.25,32);function nM(n){let t=new qs;Hm(t,n,-21.2,21.2);for(let s of[-1,1])t.box(n.truss,.9,3.75,3.75,s*10.6,0,0,.35),t.cyl(n.truss,2.1,2.1,1.6,s*22,0,0,"x",.3,40),t.cyl(n.blue,2.22,2.22,.55,s*22,0,0,"x",.18,40);for(let s of[-1,1]){let r=s*14;t.cyl(n.shade,.55,.55,1.5,r,0,-2.25,"z",.15),t.at(ti(r,0,-2.95,.1,0,0),()=>{t.box(n.shade,11.2,.6,.8,0,0,-.2,.25);for(let o of[-3.6,0,3.6]){t.box(n.white,3.1,.34,12.2,o,0,-6.6,.15);for(let a=0;a<5;a++)t.box(n.shade,2.6,.1,.24,o,.19,-1.9-a*2.35,.04)}})}t.box(n.truss,3.6,2.5,5,0,-2.6,.9,.45),t.box(n.inset,3.75,1.2,3.6,0,-2.45,.9,.3),t.box(n.blue,2.4,.5,2.4,Tn.x,km+.2,Tn.z,.2),wo(t,n.white,2.35,15.1,21.7,.9),Jn(t,n,2.35,16.2),Jn(t,n,2.35,20.6),t.cyl(n.white,1.62,1.3,1.9,0,oe,22.65,"z",.3,40),t.cyl(n.blue,1.56,1.5,.4,0,oe,22.35,"z",.12,40),t.cyl(n.blue,1.34,1.34,.45,0,oe,23.72,"z",.12,40),t.ring(n.port,.78,1.1,.42,0,oe,Qh-.21,"z",.1),t.cyl(n.navy,.82,.82,.2,0,oe,Qh-.38,"z",.05,32);for(let s=0;s<4;s++){let r=qe/4+s*qe/2;t.box(n.port,.36,.36,.3,1.12*Math.cos(r),oe+1.12*Math.sin(r),Qh-.27,.1)}t.box(n.shade,.3,1.4,.3,0,oe+2,23.05,.1),t.cyl(n.white,.8,.8,.18,0,oe+2.7,23.2,"z",.07,32),t.box(n.navy,1.2,.2,.08,0,oe+2.7,23.31,.03),t.box(n.navy,.2,1.2,.08,0,oe+2.7,23.31,.03);let e=18.4;for(let s of[-1,1])t.cyl(n.shade,1.4,1.4,1.3,s*2.45,oe,e,"x",.25);t.cyl(n.white,2.2,2.2,7,6.5,oe,e,"x",.85,40),Jn(t,n,2.2,e,4,"x"),Jn(t,n,2.2,e,9,"x"),t.cyl(n.shade,.9,.9,.5,10.15,oe,e,"x",.15),t.cyl(n.white,2.3,2.3,10.4,-8.2,oe,e,"x",.85,40),Jn(t,n,2.3,e,-4,"x"),Jn(t,n,2.3,e,-12.4,"x"),t.cyl(n.white,1.65,1.65,3.6,-9,oe+2+1.6,e,"y",.6,32),t.cyl(n.blue,1.73,1.73,.4,-9,oe+4.4,e,"y",.14,32),t.cyl(n.shade,.95,.95,1,-13.8,oe,e,"x",.2),t.box(n.shade,4.6,.8,4.6,-16.5,oe-.9,e,.3),t.box(n.white,1.6,1.1,1.6,-15.6,oe+.05,e-1.1,.3),t.box(n.blue,1.4,.9,1.4,-17.4,oe-.05,e+1,.3),Kh(t,n,15.1),wo(t,n.white,2.3,4.4,15.1),Jn(t,n,2.3,5.5),Jn(t,n,2.3,14);for(let s of[7.9,11.4])t.cyl(n.old,2.34,2.34,.16,0,oe,s,"z",.05,40);Kh(t,n,4.4),wo(t,n.white,2.35,-2.6,4.4,.9),Jn(t,n,2.35,-1.5),Jn(t,n,2.35,3.3),t.cyl(n.shade,1.4,1.4,1.2,-2.6,oe,.9,"x",.25),t.cyl(n.navy,.9,.9,.2,-3.2,oe,.9,"x",.05);let i=He(Math.sin(50*_r),-Math.cos(50*_r),0);t.at(new Dt().compose(He(0,oe,.9).addScaledVector(i,2.05),new ve().setFromUnitVectors(He(0,1,0),i),He(1,1,1)),()=>{t.cyl(n.shade,1.3,1.3,.9,0,.25,0,"y",.2),t.cyl(n.white,1.72,1.72,.38,0,.82,0,"y",.14,40),t.add(n.glass,new Ve(1.08,1.5,.95,8),ti(0,1.45,0));for(let s=0;s<8;s++){let r=s*qe/4;yf(t,n.white,He(1.52*Math.sin(r),.98,1.52*Math.cos(r)),He(1.1*Math.sin(r),1.93,1.1*Math.cos(r)),.22,.06)}t.cyl(n.white,1.2,1.2,.3,0,2,0,"y",.12,40),t.cyl(n.glass,.8,.8,.14,0,2.16,0,"y",.05,32)}),Kh(t,n,-2.6,1.5),t.cyl(n.old,2.1,1.5,3,0,oe,-4.1,"z",.5,40),wo(t,n.old,2.1,-14.6,-5.6,.8),Jn(t,n,2.1,-6.2),Jn(t,n,2.1,-13.5),Kh(t,n,-14.6,1.35),t.add(n.old,nu("ball",()=>new en(1.55,32,20)),ti(0,oe,-15.8)),wo(t,n.old,1.9,-21.2,-16.6,.6),t.cyl(n.old,2.35,1.9,1.3,0,oe,-21.85,"z",.3,40),wo(t,n.old,2.35,-28.5,-22.5,.6),t.cyl(n.old,1.3,2.25,1,0,oe,-29,"z",.3,40),t.ring(n.port,.5,.95,.4,0,oe,-29.7,"z",.1),Jn(t,n,1.9,-17.4),Jn(t,n,2.35,-23),Jn(t,n,2.35,-28);for(let s of[-18.2,-19.6])t.cyl(n.glass,.32,.32,.3,1.82,oe+.5,s,"x",.08,20);for(let s of[-1,1])t.cyl(n.blue,.42,.42,1.6,s*3,oe,-25.5,"x",.12),t.box(n.white,.9,.6,3.6,s*4.1,oe,-25.5,.22),t.box(n.backing,9.6,.1,3.3,s*9.35,oe-.05,-25.5,.04),t.box(n.white,9.7,.32,.32,s*9.35,oe+.06,-25.5,.1),t.box(n.white,.5,.45,3.6,s*14.35,oe,-25.5,.15);return t}function iM(){let n=[];for(let t of[-1,1])for(let e=0;e<5;e++){let i=t*(5.51+e*1.92);for(let s of[-1,1])n.push(ti(i,oe+.02,-25.5+s*.9))}return n}function sM(n){let t=new qs,e=[];for(let s of[-1,1]){Hm(t,n,s>0?22.8:-42,s>0?42:-22.8),t.box(n.truss,.8,3.6,3.6,s*42.2,0,0,.4);for(let r of Qb){let o=s*r;t.box(n.truss,1.2,3.75,3.75,o,0,0,.35);for(let a of[-1,1]){t.cyl(n.blue,.8,.8,1.6,o,0,a*2.3,"z",.22),t.box(n.white,Dn.w,1,1.35,o,0,a*(Dn.root+.675),.35);let l=Dn.cell1-Dn.cell0+.3;t.box(n.backing,9,.1,l,o,-.06,a*(Dn.cell0+Dn.cell1)/2,.04),t.box(n.white,.5,.42,Dn.tip-Dn.root-1,o,.1,a*(Dn.root+Dn.tip)/2,.15),t.box(n.white,Dn.w,.5,.65,o,0,a*Dn.tip-a*.3,.2);let c=12,h=(Dn.cell1-Dn.cell0)/c;for(let u of[-1,1])for(let d=0;d<2;d++){let f=o+u*(1.44+d*1.97);for(let p=0;p<c;p++)e.push(ti(f,.03,a*(Dn.cell0+h*(p+.5))))}}}}let i=(Dn.cell1-Dn.cell0)/12;return{K:t,cells:e,cellGeo:Be(1.72,.14,i-.25,.05,1)}}function rM(n){let t=new Ht;t.position.set(Tn.x,Tn.base,Tn.z),new qs().cyl(n.white,.62,.62,.9,0,.45,0,"y",.15).cyl(n.blue,.74,.74,1.35,0,Tn.shoulder,0,"z",.2).build(t);let e=new Ht;e.position.set(0,Tn.shoulder,0),t.add(e),new qs().cyl(n.white,.42,.42,Tn.L1-1.3,Tn.L1/2,0,0,"x",.15,24).cyl(n.blue,.5,.5,.5,1,0,0,"x",.15,24).cyl(n.blue,.66,.66,Tn.w+1.15,Tn.L1,0,Tn.w/2,"z",.2).build(e);let i=new Ht;i.position.set(Tn.L1,0,Tn.w),e.add(i),new qs().cyl(n.white,.4,.4,Tn.L2-1.2,Tn.L2/2,0,0,"x",.15,24).cyl(n.blue,.48,.48,.5,Tn.L2-1,0,0,"x",.15,24).build(i);let s=new Ht;return s.position.set(Tn.L2,0,0),i.add(s),new qs().cyl(n.blue,.58,.58,1.1,0,0,0,"z",.2).cyl(n.white,.48,.48,1.25,1,0,0,"x",.15,24).cyl(n.navy,.36,.36,.14,1.65,0,0,"x",.05,24).build(s),{group:t,set:o=>{let a=Xb(o),l=tM.map((c,h)=>eu(c,eM[h],a));t.rotation.y=l[0],e.rotation.z=l[1],i.rotation.z=l[2],s.rotation.z=l[3]},tip:s}}function iu(){let n=Jb(),t=new Ht;t.name="toy-station",nM(n).build(t),t.add(tu(Be(1.7,.12,1.28,.04,1),n.cells,iM()));let e=new Ht;t.add(e);let i=sM(n);i.K.build(e),e.add(tu(i.cellGeo,n.cells,i.cells));let s=rM(n);t.add(s.group);let r=h=>{e.rotation.x=h},o=h=>s.set(Bm(h,0,1));r(0),o(0),t.updateMatrixWorld(!0);let l=new tn().setFromObject(t,!0).getSize(He()),c={span:+l.x.toFixed(2),length:+l.z.toFixed(2),height:+l.y.toFixed(2)};return{group:t,dockPort:{pos:He(0,oe,Qh),dir:He(0,0,1)},setArrays:r,setArm:o,dims:c}}var oM=`
vec3 e_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 e_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 e_permute(vec4 x) { return e_mod289(((x * 34.0) + 10.0) * x); }
vec4 e_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float e_snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = e_mod289(i);
  vec4 p = e_permute(e_permute(e_permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = e_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float e_fbm(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * e_snoise(p); p = p * 2.07 + vec3(17.3, -9.1, 4.7); a *= 0.47; }
  return s;
}
`;function aM(){let n=new Oe({color:16777215,roughness:.82,metalness:0}),t={uOcean:{value:new Ot(Ti.ocean)},uShallow:{value:new Ot(Ti.shallow)},uSand:{value:new Ot(Ti.sand)},uSage:{value:new Ot(Ti.sage)}};return n.onBeforeCompile=e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vEarthDir;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEarthDir = position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEarthDir;
uniform vec3 uOcean;
uniform vec3 uShallow;
uniform vec3 uSand;
uniform vec3 uSage;
${oM}`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          vec3 d = normalize(vEarthDir);
          // the continents: broad soft blobs with gently wavy coasts (> 0 is land)
          float c = e_fbm(d * 2.3 + vec3(3.1, 7.7, 1.3)) + 0.2 * e_snoise(d * 0.9 + vec3(-2.0, 5.0, 9.0)) - 0.1;
          float aa = fwidth(c) * 1.1 + 1e-5;
          float land = smoothstep(-aa, aa, c);
          float shallow = smoothstep(-0.11, -0.01, c);
          vec3 sea = mix(uOcean, uShallow, shallow * 0.6);
          float v = e_snoise(d * 4.2 + vec3(1.7, -3.3, 2.9)) + 1.4 * c - 0.12;
          float va = fwidth(v) * 1.1 + 1e-5;
          vec3 ground = mix(uSand, uSage, smoothstep(-va, va, v));
          diffuseColor.rgb = mix(sea, ground, land);
        }`)},n.customProgramCacheKey=()=>"toy-earth-1",n}function lM(n){return new De({uniforms:{uColor:{value:new Ot(Ti.glow)},uR:{value:n},uOut:{value:34},uIn:{value:70},uGain:{value:.95}},vertexShader:`
      varying vec3 vWorld;
      varying vec3 vCentre;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vCentre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform vec3 uColor;
      uniform float uR, uOut, uIn, uGain;
      varying vec3 vWorld;
      varying vec3 vCentre;
      void main() {
        vec3 dir = normalize(vWorld - cameraPosition);
        vec3 oc = vCentre - cameraPosition;
        float tc = dot(oc, dir);
        float h = length(oc - dir * tc) - uR;
        float g = h > 0.0 ? exp(-h / uOut) : exp(h / uIn);
        gl_FragColor = vec4(uColor * g * uGain, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ya,fog:!1})}function cM(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function hM(){return nu("cloud",()=>{let n=new en(1,12,3,0,yr,0,qe/2),t=[[0,0,0,1,.36,.64],[-.34,0,.05,.56,.62,.48],[.32,0,-.06,.5,.5,.44]].map(([e,i,s,r,o,a])=>vf(n).applyMatrix4(ti(e,i,s,0,0,0,r,o,a)));return t.push(vf(new gi(1,12)).applyMatrix4(ti(0,0,0,qe/2,0,0,1,1,.64))),Mn(t,!1)})}function Gm({radius:n=4e3}={}){let t=n,e=new Ht;e.name="toy-earth";let i=new Ht;i.position.y=-t,e.add(i);let s=new en(t,200,100);s.rotateZ(qe/2);let r=new zt(s,aM());r.castShadow=r.receiveShadow=!1,i.add(r);let o=new Ht;o.position.y=-t,e.add(o);let a=cM(20261121),l=12,c=Array.from({length:l},()=>[]),h=Array.from({length:l},()=>[]),u=He(1,0,0),d=He(),f=He(),p=He(),v=new Dt,g=new Dt;for(let x=0;x<330;x++){let E=eu(-.52,.22,a()),C=a()*yr,D=Math.sqrt(1-E*E),N=He(E,D*Math.cos(C),D*Math.sin(C)),F=1+Math.floor(a()*6),P=(50+a()*170)/t,z=.7+a()*.6;for(let G=0;G<F;G++){f.copy(u).addScaledVector(N,-N.x).normalize(),p.crossVectors(f,N);let $=a()*yr,et=P*Math.sqrt(a());d.copy(N).addScaledVector(f,Math.cos($)*et).addScaledVector(p,Math.sin($)*et).normalize(),f.copy(u).addScaledVector(d,-d.x).normalize(),p.crossVectors(f,d);let X=(9+a()*14)*z,tt=9+a()*7,nt=X*(.9+a()*.5),St=X*(.8+a()*.5),yt=X*(.75+a()*.35);v.makeBasis(f,d,p),g.makeRotationY(a()*yr);let jt=v.clone().multiply(g),$t=Math.floor((Math.atan2(d.z,d.y)+yr)%yr/(yr/l))%l;c[$t].push(jt.clone().scale(He(nt,yt,St)).setPosition(d.clone().multiplyScalar(t+tt)));let xt=tt+.25*yt,K=d.clone().multiplyScalar(t).addScaledVector(f,.78*xt).addScaledVector(p,.36*xt).normalize();f.copy(u).addScaledVector(K,-K.x).normalize(),p.crossVectors(f,K),v.makeBasis(f,K,p),h[$t].push(v.clone().multiply(g).scale(He(nt*.92,1,St*.92)).setPosition(K.multiplyScalar(t+1.4)))}}let m=new Oe({color:Ti.cloud,roughness:.95}),_=new ii({color:Ti.cloudShadow,transparent:!0,opacity:.14,depthWrite:!1}),b=new gi(1,20).rotateX(-qe/2).scale(1,1,.62),y=hM(),M=0;for(let x=0;x<l;x++){if(!c[x].length)continue;M+=c[x].length;let E=tu(y,m,c[x]);E.castShadow=E.receiveShadow=!1,o.add(E);let C=tu(b,_,h[x]);C.castShadow=C.receiveShadow=!1,C.renderOrder=1,o.add(C)}let w=new zt(new en(t+200,160,80).rotateZ(qe/2),lM(t));w.position.y=-t,w.renderOrder=2,w.castShadow=w.receiveShadow=!1,e.add(w);let T=.4*_r;return e.userData.cloudCount=M,{group:e,update(x){i.rotation.x=-T*x,o.rotation.x=-T*1.12*x}}}var uM=(n,t,e)=>Math.min(e,Math.max(t,n)),on=(n,t=0)=>{let e=Math.sin(n*127.1+t*311.7+74.7)*43758.5453;return e-Math.floor(e)},dM={booster:{outer:"#ffb347",mid:"#ffd77a",core:"#fff6dc"},vacuum:{outer:"#ffc76e",mid:"#ffe2a6",core:"#fffaf0"}};function su({r:n=2,len:t=16,color:e="booster"}={}){let i=dM[e],s=new Ht;s.name="flame";let r=(h,u)=>new ii({color:h,transparent:!0,opacity:u,depthWrite:!1,toneMapped:!1}),o=(h,u)=>xs([[.01,-u],[h*.35,-u*.82],[h*.78,-u*.5],[h,-u*.18],[h*.96,-.02],[h*.8,0]],32),a=new zt(o(n*1.18,t),r(i.outer,.72)),l=new zt(o(n*.95,t*.74),r(i.mid,.85)),c=new zt(o(n*.62,t*.42),r(i.core,.95));return a.renderOrder=3,l.renderOrder=4,c.renderOrder=5,s.add(a,l,c),s.visible=!1,{group:s,set(h,u=0){if(s.visible=h>.01,!s.visible)return;let d=Math.floor(u*30),f=1+.07*(on(d,3)-.5)+.04*Math.sin(u*41);a.scale.set(1+.04*(on(d,5)-.5),h*f,1+.04*(on(d,7)-.5)),l.scale.set(1,h*(2-f),1),c.scale.set(1,Math.min(1,h*1.4)*f,1)}}}function Vm(n,t=480){let e=new la(1,3),s=gt("#ffffff",{rough:.92}).clone();s.emissive=new Ot("#dfe6fb"),s.emissiveIntensity=.32;let r=new _n(e,s,t);r.castShadow=!0,r.receiveShadow=!1,r.frustumCulled=!1,r.instanceMatrix.setUsage(od);let o=new Ot("#ffffff"),a=new Ot("#c9cfe8"),l=new Ot;r.setColorAt(0,o),n.add(r);let c=new Dt,h=0;return{mesh:r,begin(){h=0},puff(u,d,f,p,v=0){h>=t||p<.02||(c.makeScale(p,p*.86,p).setPosition(u,d,f),r.setMatrixAt(h,c),r.setColorAt(h,l.copy(o).lerp(a,uM(v,0,1))),h++)},end(){r.count=h,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}}}var is=(n,t)=>{if(n<=0||n>=t)return 0;let e=1-Math.exp(-n/(.18*t)),i=n>.72*t?1-(n-.72*t)/(.28*t):1;return e*Math.sqrt(Math.max(0,i))};var rs=Math.PI,To=(n,t=0,e=1)=>Math.min(e,Math.max(t,n)),fM=n=>{let t=To(n);return t*t*(3-2*t)},Ce=(n,t,e)=>fM((e-n)/(t-n)),hl=(n,t,e)=>n+(t-n)*e,pe=(n=0,t=0,e=0)=>new U(n,t,e),pM=n=>Math.atan2(-n.z,n.x),jm=48.7,O={door:[-6.4,-3.6],roll:[-3.4,7],raise:[7.6,13.4],clamps:[13.3,14.1],fuel:[11,17],retract:[15,16.2],ignite:17.4,lift:18,sep:25.2,flip:[25.7,27.7],boostback:[27.6,29],fins:[28.4,29.3],upright:[29,31.2],entry:[31,32.1],landing:[34.3,36.4],legs:[34.9,35.9],touch:36.4,convoy:[36.5,40.4],orbit:40.9,approach:[40.9,45.8],hold:[43,43.7],capture:45.8},Wm={x:0,z:0},re={x:200,z:-118},Xm={x:-112,z:0},ss=40,_f=-162,bf=-7.5,$m=64,Mf=6,br=(()=>{let t=[pe(0,Mf,0)],e=[pe(0,1,0)];for(let i=.5;i<=4200;i+=.5){let s=28*rs/180*To((i-30)/520)**1.2,r=pe(0,Math.cos(s),-Math.sin(s));t.push(t[t.length-1].clone().addScaledVector(r,.5)),e.push(r)}return{ds:.5,pts:t,dirs:e}})(),Sf=n=>1.25*Math.max(0,n)**3,Eo=n=>{let t=To(Math.floor(n/br.ds),0,br.pts.length-2),e=To(n/br.ds-t);return{p:br.pts[t].clone().lerp(br.pts[t+1],e),d:br.dirs[t].clone().lerp(br.dirs[t+1],e).normalize()}},Km=O.sep-O.lift,wf=Sf(Km),mM=3*1.25*Km**2,gM=1.52,xM=pe(re.x,gM+.12,re.z),ru=(()=>{let n=Eo(wf).p,t=[n,n.clone().add(pe(6,36,-14)),n.clone().add(pe(46,30,-16)),pe(112,290,-112),pe(172,120,-120),pe(re.x,34,re.z),xM],e=new er(t,!1,"centripetal"),i=e.getLength(),s=400,r=[0];for(let l=1;l<=s;l++){let c=(l-.5)/s;r.push(r[l-1]+c**.7*(1-c)**1.35)}let o=r[s];return{curve:e,L:i,frac:l=>{let c=To(l)*s,h=Math.min(s-1,Math.floor(c));return hl(r[h],r[h+1],c-h)/o}}})(),qm=n=>ru.curve.getPointAt(ru.frac((n-O.sep)/(O.touch-O.sep))),Ao=n=>new ve().setFromUnitVectors(pe(0,1,0),n.clone().normalize()),Ym=Ao(Eo(wf).d),Zm=Ao(pe(.92,-.12,-.08)),Jm=Ao(pe(-.34,1,.04)),vM=Ao(pe(0,1,0)),yM=n=>{let t=new ve;return n<O.flip[0]?t.copy(Ym):n<O.boostback[1]?t.slerpQuaternions(Ym,Zm,Ce(...O.flip,n)):n<O.landing[0]?t.slerpQuaternions(Zm,Jm,Ce(O.boostback[1],O.upright[1]+1,n)):t.slerpQuaternions(Jm,vM,Ce(O.landing[0],O.touch-.25,n))};function Qm(){let n=new Ht,t=new Ht;n.add(t);let e=(L,q=0,st=0,V=0,rt=0,ft=t)=>(L.position.set(q,rt,st),L.rotation.y=V,ft.add(L),L),i=(L,q,st,V,rt,ft=.01)=>{let ot=new zt(new Xn(L,q).rotateX(-rs/2),gt(st,{rough:.95}));return ot.position.set(V,ft,rt),ot.receiveShadow=!0,t.add(ot),ot};i(3200,3200,pt.ground,0,0,0),i(3200,1600,"#aebff2",0,_f-800,.03),i(3200,7,"#e9edf8",0,_f+2.5,.035);let s=new _n(Be(7,.06,.5,.02),gt("#f4f6fd",{rough:.9}),220);{let L=new Dt;for(let q=0;q<220;q++)L.makeTranslation(-420+on(q,1)*900,.06,_f-10-on(q,2)*260),s.setMatrixAt(q,L);s.receiveShadow=!0,t.add(s)}let r="#ccd6f4";i(560,12,r,40,ss,.02);for(let L=-235;L<320;L+=9)i(4,.45,pt.lane,L,ss,.03);i(12,ss-re.z-18,r,re.x,(ss+re.z+18)/2,.021),i(12,ss-28,r,30,(ss+28)/2,.021);let o=Im();e(o.group,Wm.x,Wm.z),e(Cm({length:150+bf}),-150,0);let a=Rm();e(a.group,Xm.x,Xm.z);let l=Zh();e(l.group,-6,-52),e(Pm({length:24}),20,-38,-rs/2),e(Dm(),38,-56);for(let[L,q]of[[-24,-24],[24,-24],[-24,24],[24,24]])e(Um({h:52}),L,q);e(Om(),-48,70);let c=[0,1].map(L=>{let q=lm({livery:"plain"});return e(q.group,-36+L*15,-34.2,0),q}),h=Nm({r:18});e(h,re.x,re.z);let u=Jh();t.add(u.group);let d=Fm();t.add(d.group);let f=of();t.add(f.group);let p=L=>{let q=new er(L.map(([st,V])=>pe(st,0,V)),!1,"centripetal");return{c:q,L:q.getLength()}},v=p([[re.x+2.5,re.z+78],[re.x+2.5,re.z+50],[re.x+4,re.z+32],[re.x+15,re.z+25],[re.x+22,re.z+20]]),g=p([[re.x-2.5,re.z+98],[re.x-2.5,re.z+50],[re.x-4,re.z+32],[re.x-15,re.z+25],[re.x-23,re.z+17]]),m=p([[re.x,re.z+130],[re.x,re.z+76],[re.x,re.z+42]]),_=cm({livery:"aurora"});t.add(_.group);let b=of();t.add(b.group);for(let L=-230;L<300;L+=30)e(em({length:30}),L+15,ss+10);let y=[];for(let L=-230;L<300;L+=14)Math.abs(L-30)>10&&y.push({x:L+3*Math.sin(L),z:ss+15,size:.95+.15*Math.sin(L*1.7)});for(let[L,q,st]of[[-80,70,1.2],[-92,66,1],[-20,76,1.1],[60,62,1.2],[70,70,1],[130,70,1.1],[240,60,1.2],[250,-30,1.1],[238,-14,1],[120,-60,1.2],[132,-40,1],[-170,-40,1.1],[-160,50,1.2],[-60,-90,1],[80,-100,1.1],[150,-20,1],[160,10,1.1],[250,-150,1]])y.push({x:L,z:q,size:st});t.add(tm(y));let M=Lh();t.add(M.group);let w=qa();n.add(w.group);let T=Ph();n.add(T.group);let x=su({r:2,len:20});w.group.add(x.group);let E=su({r:.85,len:11});w.group.add(E.group);let C=su({r:1.3,len:14,color:"vacuum"});C.group.position.y=-3.1,T.group.add(C.group);let D=Vm(n,520),N=new Ht;N.visible=!1,n.add(N);let F=iu();N.add(F.group);let P=Gm({radius:4e3});P.group.position.y=-380,N.add(P.group);let z=Ya();z.setNose(1),N.add(z.group);let G=F.dockPort.pos.clone(),$=F.dockPort.dir.clone().normalize(),et=new ve,X=new Dt,tt=pe(),nt=L=>{w.group.matrixAutoUpdate=!1,w.group.matrix.copy(L),T.group.matrixAutoUpdate=!1,T.group.matrix.copy(L).multiply(new Dt().makeTranslation(0,Gs.upper,0)),w.group.matrixWorldNeedsUpdate=T.group.matrixWorldNeedsUpdate=!0},St=(L,q,st)=>{L.matrixAutoUpdate=!1,L.matrix.compose(q,st,pe(1,1,1)),L.matrixWorldNeedsUpdate=!0},yt=(L,q,st,V=0)=>{let rt=To(st),ft=q.c.getPointAt(rt),ot=q.c.getTangentAt(rt);L.group.position.set(ft.x,0,ft.z),L.group.rotation.y=pM(ot)+V,L.roll(q.L*rt)},jt=()=>(M.group.updateMatrix(),X.copy(M.group.matrix).multiply(M.rocketMatrix(new Dt))),$t={},xt=L=>{if(L<O.sep){let{p:q,d:st}=Eo(Sf(L-O.lift));return{p:q,q:Ao(st),d:st}}return{p:qm(L),q:yM(L)}},K=L=>{let q=L-O.sep,st=wf+mM*q+60*Math.max(0,q-.8)**2,{p:V,d:rt}=Eo(st);return{p:V.add(pe(0,0,-1.5*Math.min(q,1))).addScaledVector(rt,Gs.upper+1.2*q),q:Ao(rt)}},R=L=>{let q=L>=O.orbit;t.visible=!q,N.visible=q,w.group.visible=!q,T.group.visible=!q&&L<O.sep+6,a.setDoor(Ce(...O.door,L));let st=Ce(...O.roll,L);M.group.position.set(bf-$m*(1-st),0,0),M.roll($m*st);let V=3.2*rs/180*Ce(...O.retract,L);M.setAngle(rs/2*Ce(...O.raise,L)-V),M.setClaws(1-Ce(O.retract[0]+.3,O.retract[1],L)),o.setClamps(Ce(...O.clamps,L)*(1-Ce(O.lift-.15,O.lift+.15,L)));let rt=0,ft=0;if(L<O.retract[0]+.01)nt(jt());else if(L<O.lift)nt(X.makeTranslation(0,Mf,0));else if(L<O.sep){let Mt=xt(L);nt(X.compose(Mt.p,Mt.q,pe(1,1,1)))}else{let Mt=xt(L);St(w.group,Mt.p,Mt.q);let B=K(L);St(T.group,B.p,B.q)}L>=O.ignite&&L<O.sep&&(rt=Ce(O.ignite,O.ignite+.5,L)*(1-Ce(O.sep-.25,O.sep,L))),L>O.boostback[0]&&L<O.boostback[1]&&(rt=Math.max(rt,.7*Ce(O.boostback[0],O.boostback[0]+.3,L)*(1-Ce(O.boostback[1]-.3,O.boostback[1],L)))),L>O.entry[0]&&L<O.entry[1]&&(ft=Math.max(ft,Ce(O.entry[0],O.entry[0]+.25,L)*(1-Ce(O.entry[1]-.25,O.entry[1],L)))),L>O.landing[0]&&L<O.touch+.2&&(ft=Math.max(ft,Ce(O.landing[0],O.landing[0]+.3,L)*(1-Ce(O.touch-.1,O.touch+.2,L)))),x.set(rt*(L<O.lift?.55+.45*Ce(O.ignite,O.lift+.6,L):1),L),E.set(ft,L),C.set(L>O.sep+.8?Ce(O.sep+.8,O.sep+1.2,L):0,L),w.setFins(Ce(...O.fins,L)),w.setLegs(Ce(...O.legs,L));let ot=Ce(...O.fuel,L);l.setFill(1-.35*ot,1-.25*ot);let bt=Mt=>Ce(O.convoy[0]+Mt,O.convoy[1]+Mt*.3,L);yt(f,v,bt(0)),yt(u,g,bt(.35)),yt(d,m,bt(.7)),u.setBoom(0),u.setSwing(0);{let Mt=260-(L*11+40)%520;_.group.position.set(Mt,0,ss-3.2),_.group.rotation.y=rs,_.roll(L*11),_.group.visible=Mt>-230&&Mt<255;let B=-220+(L*13+120)%470;b.group.position.set(B,0,ss+3.2),b.group.rotation.y=0,b.roll(L*13),b.group.visible=B>-225&&B<245}if(q){P.update(L),F.setArrays(.22+.012*(L-O.orbit)),F.setArm(Ce(O.orbit,O.orbit+3.5,L));let Mt=L<O.hold[0]?hl(52,20,Ce(O.approach[0],O.hold[0],L)):L<O.hold[1]?20:hl(20,0,Ce(O.hold[1],O.capture,L));F.group.updateMatrixWorld(!0),tt.copy(G).addScaledVector($,z.ringY+Mt);let B=$.clone().applyQuaternion(F.group.quaternion);et.setFromUnitVectors(pe(0,1,0),B.negate()),St(z.group,F.group.localToWorld(tt.clone()),et),z.group.updateMatrixWorld(!0),$t.gap=Mt}return n.updateMatrixWorld(!0),D.begin(),Y(L,q),D.end(),$t.fuel=ot,$t.inOrbit=q,$t},Y=(L,q)=>{if(q){for(let[V,rt]of[[42.6,8],[45.2,8]])for(let ft=0;ft<rt;ft++){let ot=V+ft*.05,bt=L-ot,Mt=.9;if(bt<=0||bt>=Mt)continue;let B=ft*2*rs/4+rs/4,ae=pe(Math.cos(B),0,Math.sin(B)),ee=z.group.localToWorld(pe(1.4*Math.cos(B),5.1,1.4*Math.sin(B))),I=ae.applyQuaternion(z.group.quaternion);ee.addScaledVector(I,2.5*bt),D.puff(ee.x,ee.y,ee.z,.55*is(bt,Mt))}return}for(let V=0;V<120;V++){let rt=O.ignite+V*.045,ft=5.5+2.5*on(V,1),ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=(on(V,2)-.5)*1.3,Mt=30*(1-Math.exp(-ot/1.3))*(.6+.6*on(V,3)),B=34+Math.cos(bt)*Mt,ae=Math.sin(bt)*Mt*1.2,ee=2.5+2.2*ot+2*on(V,4);D.puff(B,ee,ae,(3.2+4.2*on(V,5))*is(ot,ft))}for(let V=0;V<40;V++){let rt=O.ignite+.2+V*.04,ft=3.8+1.4*on(V,11),ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=on(V,12)*2*rs,Mt=9+10*(1-Math.exp(-ot/.9));D.puff(Math.cos(bt)*Mt,3+1.6*ot,Math.sin(bt)*Mt,(2.4+2*on(V,13))*is(ot,ft))}for(let V=0;V<150;V++){let rt=O.lift+.5+V*.045;if(rt>O.sep)break;let ft=5.5,ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=Eo(Sf(rt-O.lift)).p,Mt=1+.5*(rt-O.lift);D.puff(bt.x+2*(on(V,21)-.5)+1.2*ot,bt.y-2+3*(on(V,22)-.5),bt.z+2*(on(V,23)-.5),(1.4+.9*Mt)*is(ot,ft))}let st=[pe(2.4,37.2,.6),pe(-.8,37,2.4),pe(2.3,25.8,-.9)];for(let V=0;V<60;V++){let rt=O.fuel[0]+1.2+V*.11;if(rt>O.lift-.3)break;let ft=2.6,ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=st[V%3],Mt=bt.x+1.6*ot+.6*on(V,31),B=bt.z+.4*ot,ae=Mf+bt.y-2.6*ot*ot*.5-.4*ot;D.puff(Mt,ae,B,1.25*is(ot,ft))}for(let V=0;V<24;V++){let rt=O.fuel[0]+V*.26,ft=3,ot=L-rt;if(ot<=0||ot>=ft||!l.vents?.length)continue;let bt=l.group.localToWorld(l.vents[V%l.vents.length].clone());D.puff(bt.x+1.2*ot,bt.y+1.8*ot,bt.z+.3*ot,1.3*is(ot,ft))}for(let V=0;V<18;V++){let rt=O.flip[0]+.15+V*.1,ft=.8,ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=V%2?1:-1;w.group.updateMatrixWorld();let Mt=pe(bt*(2.6+3*ot),29.4,0).applyMatrix4(w.group.matrixWorld);D.puff(Mt.x,Mt.y,Mt.z,.9*is(ot,ft))}for(let V=0;V<46;V++){let rt=O.touch-.6+V*.022,ft=2.6+1.2*on(V,41),ot=L-rt;if(ot<=0||ot>=ft)continue;let bt=on(V,42)*2*rs,Mt=3+20*(1-Math.exp(-ot/.7));D.puff(re.x+Math.cos(bt)*Mt,1.2+.7*ot,re.z+Math.sin(bt)*Mt,(1.8+1.6*on(V,43))*is(ot,ft),.35)}for(let V=0;V<16;V++){let rt=O.touch+.4+V*.3,ft=2.4,ot=L-rt;ot<=0||ot>=ft||D.puff(re.x+1.8+1.1*ot,27+1.2*ot,re.z-.4,.9*is(ot,ft))}};R(0);let lt=(L,q)=>L.getWorldPosition(pe()).add(pe(0,q,0)),ht={te:()=>lt(M.group,0).add(pe(-24,12,0)),stack:()=>w.group.localToWorld(pe(0,24,0)),booster:()=>w.group.localToWorld(pe(0,31,0)),farm:()=>lt(l.group,22),lz:()=>pe(re.x,3,re.z),crane:()=>lt(u.group,7),capsule:()=>z.group.localToWorld(pe(0,8.5,0)),station:()=>F.group.localToWorld(pe(0,12,0))},_t={te:L=>L<O.roll[1]?[pe(M.group.position.x-24,0,0),pe(bf-24,0,0)]:null,booster:L=>{if(L<O.sep||L>=O.touch)return null;let q=[],st=40,V=ru.frac((L-O.sep)/(O.touch-O.sep));for(let rt=0;rt<=st;rt++){let ft=ru.curve.getPointAt(hl(V,1,rt/st));q.push(pe(ft.x,0,ft.z))}return q},crane:L=>L<O.convoy[1]+.1?Array.from({length:33},(q,st)=>g.c.getPointAt(hl(Ce(O.convoy[0]+.35,O.convoy[1]+.1,L),1,st/32))):null},Pt=[{name:"chase",g:f.group},{name:"crane",g:u.group},{name:"trailer",g:d.group},{name:"bus",g:_.group},{name:"patrol",g:b.group},...c.map((L,q)=>({name:`tanker${q}`,g:L.group}))];return{root:n,pose:R,trees:y,anchors:ht,routes:_t,bodies:Pt,rocketAt:xt,objects:{te:M,booster:w,upper:T,mount:o,hangar:a,farm:l,lz:h,crane:u,trailer:d,chase:f,station:F,earth:P,cap2:z,puffs:D},SPACE:zm,ascAt:Eo,retAt:qm}}var tg=Math.PI/180,sg=(n,t=0,e=1)=>Math.min(e,Math.max(t,n)),rg=n=>{let t=sg(n);return t*t*t*(t*(t*6-15)+10)},_e=(n,t,e)=>rg((e-n)/(t-n)),an=(n,t,e)=>n+(t-n)*e,Ro=(n,t=0)=>Number(n).toLocaleString("en-US",{minimumFractionDigits:t,maximumFractionDigits:t}),os=n=>String(Math.floor(n)).padStart(2,"0"),eg='<svg viewBox="0 0 40 40" width="26" height="26"><path d="M20 3c5 4 7 10 7 17v9H13v-9c0-7 2-13 7-17z" fill="#3166ea"/><path d="M20 3c5 4 7 10 7 17v3H20z" fill="#6f98f7"/><path d="M13 22l-5 6v6l5-3zM27 22l5 6v6l-5-3z" fill="#2448c8"/><circle cx="20" cy="16" r="3" fill="#fff"/><path d="M16 31h8l-1 5h-6z" fill="#f2b33a"/></svg>',_M='<svg viewBox="0 0 40 40" width="26" height="26"><path d="M20 4c7 9 11 15 11 21a11 11 0 01-22 0c0-6 4-12 11-21z" fill="#3166ea"/><path d="M20 4c7 9 11 15 11 21a11 11 0 01-11 11z" fill="#6f98f7"/></svg>',bM='<svg viewBox="0 0 40 40" width="26" height="26"><path d="M11 30a7 7 0 01-1-14 10 10 0 0119-2 8 8 0 012 16z" fill="#3166ea"/><path d="M29 14a8 8 0 012 16H20z" fill="#6f98f7"/></svg>',MM='<svg viewBox="0 0 40 40" width="26" height="26"><path d="M5 28a15 15 0 0130 0z" fill="#3166ea"/><path d="M20 13a15 15 0 0115 15H20z" fill="#6f98f7"/><path d="M20 28l7-9" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';Object.assign(Xa,{rocket:eg,drop:_M,cloud:bM,gauge:MM,truck:eg});var SM="M3 13l7-1 4-7h2l-1 7 5 1 1-2h2l-1 3 1 3h-2l-1-2-5 1 1 7h-2l-4-7-7-1z",wM="M12 2c3 2.5 4 6 4 10v5H8v-5c0-4 1-7.5 4-10zM8 13l-3 4v3l3-2M16 13l3 4v3l-3-2M10 20h4l-1 2h-2z",EM=n=>n.split(SM).join(wM),TM="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/><circle cx="66" cy="20" r="30" fill="#4a85f0"/><text x="44" y="56" font-family="Inter,system-ui,sans-serif" font-size="32" font-weight="800" fill="#fff" text-anchor="middle">FD</text></svg>'),AM={brand:"Padline",search:"Search pads, vehicles, boosters, missions...",user:["Flight Director","Launch Control"],avatar:TM,kpis:[{ic:"clock",k:"Countdown",key:"a",v:"T\u221203:00",d:"GO",s:"SR-19 \xB7 Pad 7"},{ic:"drop",k:"Propellant",key:"b",v:"0%",d:"LOX",s:"RP-1 \xB7 LOX"},{ic:"cloud",k:"Weather",key:"c",v:"94%",d:"GO",s:"wind 9 kn \xB7 Pad 7"}]},ul=[{t:1.5,at:"te",card:"te"},{t:8.9,at:"stack",card:"stack"},{t:12.4,at:"farm",card:"farm"},{t:26.3,at:"booster",card:"booster"},{t:37.7,at:"crane",card:"crane"},{t:39.9,ui:[1167,37],drop:"open"},{t:40.9,ui:[930,274],card:"site"},{t:42.6,at:"capsule",card:"capsule"},{t:47.1,ui:[1159,275],tool:6,card:"site"}],RM=ul.map(n=>n.t),CM=38,IM=36,PM={PAD:["P7","Pad 7 \xB7 Seawall Point","Flight 12 \xB7 SR-19"],LZ:["LZ2","Landing Zone 2","B1107 returning"],ISS:["ISS","Space Station","SR-19 arriving \xB7 fwd port"]},LM=n=>[["P7","Pad 7 \xB7 Seawall Point","Launched \xB7 T+00:18:40",100],["LZ2","Landing Zone 2",n<O.touch?"B1107 inbound":"B1107 landed \xB7 safing",100],["ISS","Space Station","SR-19 \xB7 docking day 2",62],["P9","Pad 9 \xB7 North Spit","Stand-down \xB7 next flight",18]],ou=n=>n<O.lift?(n-O.lift)*10:(n-O.lift)*25,ng=n=>{let t=Math.abs(n);return`T${n<0?"\u2212":"+"}${os(t/60)}:${os(t%60)}`},ig=n=>{let t=Math.abs(n);return`T${n<0?"\u2212":"+"}${os(t/3600)}:${os(t/60%60)}:${os(t%60)}`};function og({runSim:n}){return n({duration:jm,fps:60,warm:[19.5,28.2,36.8,44.5],theme:"light",marks:RM,hud:{enabled:!1,title:"padline",subtitle:""},director:{enabled:!1},watermark:""},async({canvas:t,capture:e,pixelRatio:i,cfg:s})=>{let r=document.getElementById("app"),o=I0(t,{fov:28}),a=Qm();o.scene.add(a.root);let l=U0(r,AM,{paint:EM}),c=!!s?.clean;c&&(l.el.style.display="none");let h=H0(o.scene,o),u=[...l.el.querySelectorAll(".kpi .k")],d=[...l.el.querySelectorAll(".kpi .ic")],f=()=>o.resize(1600,900,i?i():e?devicePixelRatio||1:Math.min(devicePixelRatio||1,2));f();let p=o.scene.children.find(R=>R.isHemisphereLight),v={ground:{bg:o.scene.background.clone(),fog:o.scene.fog.color.clone(),near:o.scene.fog.near,far:o.scene.fog.far,sun:o.sun.color.clone(),sunI:o.sun.intensity,hs:p.color.clone(),hg:p.groundColor.clone(),hi:p.intensity},space:(()=>{let R=a.SPACE;return{bg:new Ot(R.bg),fog:new Ot(R.fog.color),near:R.fog.near,far:R.fog.far,sun:new Ot(R.sun.color),sunI:R.sun.intensity,hs:new Ot(R.hemi.sky),hg:new Ot(R.hemi.ground),hi:R.hemi.intensity}})()},g=R=>{let Y=v[R];o.scene.background.copy(Y.bg),o.scene.fog.color.copy(Y.fog),o.scene.fog.near=Y.near,o.scene.fog.far=Y.far,o.sun.color.copy(Y.sun),o.sun.intensity=Y.sunI,p.color.copy(Y.hs),p.groundColor.copy(Y.hg),p.intensity=Y.hi;let lt=R==="space"?3600:2e3;o.camera.far!==lt&&(o.camera.far=lt,o.camera.updateProjectionMatrix())},m=(()=>{let R=new Ht,Y=qa(),lt=Ph();lt.group.position.y=Gs.upper,R.add(Y.group,lt.group);let ht=qa();ht.setLegs(1),ht.setFins(1);let _t=Lh(),Pt=Ya();return Pt.setNose(1),{stack:ts(R,{pad:1,el:18}),booster:ts(ht.group,{pad:1,el:18}),te:ts(_t.group,{pad:1}),farm:ts(Zh().group,{pad:.9}),crane:ts(Jh().group,{pad:1.05}),capsule:ts(Pt.group,{pad:1.2}),station:ts(iu().group,{pad:.85,el:30}),pad:ts(a.objects.mount.group.clone(),{pad:.75}),lz:ts(a.objects.lz.clone(),{pad:.8,el:50})}})(),_=R=>R.getWorldPosition(new U),b=[{t:0,x:-50,y:5,z:4,d:128},{t:7,x:-24,y:6,z:3,d:120},{t:9.4,x:-10,y:13,z:0,d:138},{t:13.4,x:-6,y:19,z:-4,d:152},{t:15.8,x:-8,y:17,z:-14,d:170},{t:17.6,x:-2,y:18,z:-6,d:158}],y=R=>{let Y=0;for(;Y<b.length-2&&b[Y+1].t<=R;)Y++;let lt=b[Y],ht=b[Y+1],_t=_e(lt.t,ht.t,R);return{x:an(lt.x,ht.x,_t),y:an(lt.y,ht.y,_t),z:an(lt.z,ht.z,_t),d:an(lt.d,ht.d,_t)}},M=R=>{let Y=a.rocketAt(R),lt=new U(0,1,0).applyQuaternion(Y.q),ht=Y.p.clone().addScaledVector(lt,R<O.sep?22:15),_t=R<O.sep?an(158,300,_e(O.lift,O.sep,R)):R<O.boostback[1]?an(300,185,_e(O.sep+.8,O.flip[1],R)):an(185,150,_e(O.boostback[1],O.touch-.6,R));return{x:ht.x,y:ht.y,z:ht.z,d:_t}},w={x:re.x+8,y:5,z:re.z+30,d:176},T=R=>{if(R>=O.orbit){let L=a.objects.station.group,q=L.localToWorld(a.objects.station.dockPort.pos.clone()),st=_(a.objects.cap2.group),V=q.clone().lerp(st,.45),rt=_e(O.capture+.6,O.capture+2.6,R),ft=_(L);return{x:an(V.x,ft.x,rt),y:an(V.y,ft.y,rt),z:an(V.z,ft.z,rt),d:an(120,250,rt)}}if(R<O.lift)return y(R);let Y=M(R),lt=_e(O.lift,O.lift+1.6,R),ht=b[b.length-1],_t={x:an(ht.x,Y.x,lt),y:an(ht.y,Y.y,lt),z:an(ht.z,Y.z,lt),d:Y.d},Pt=_e(O.touch+.2,O.touch+2.4,R);return Pt>0&&(_t={x:an(_t.x,w.x,Pt),y:an(_t.y,w.y,Pt),z:an(_t.z,w.z,Pt),d:an(_t.d,w.d,Pt)}),_t},x={fuel:0},E=R=>R<O.orbit?R<O.sep+2.5?"PAD":"LZ":"ISS",C=R=>R<O.roll[1]?["Rolling out","go"]:R<O.raise[0]?["At the pad","wait"]:R<O.raise[1]?["Raising","in"]:R<O.retract[0]?["Vertical","go"]:["Leaned back","wait"],D=R=>R<O.flip[0]?["Coasting","in"]:R<O.boostback[0]?["Flipping","in"]:R<O.boostback[1]?["Boostback burn","go"]:R<O.entry[0]?["Falling \xB7 fins out","in"]:R<O.entry[1]?["Entry burn","go"]:R<O.landing[0]?["Gliding to LZ-2","in"]:R<O.touch?["Landing burn","go"]:["Landed","go"],N=R=>{if(R<O.lift)return{alt:0,v:0};let Y=a.rocketAt(R).p,lt=a.rocketAt(R+.05).p,ht=Y.distanceTo(lt)/.05;return{alt:Math.max(0,(Y.y-(R<O.sep?6:1.64))*.15),v:R>O.touch?0:ht*3.6*12}},F=(R,Y,lt)=>{let ht=_e(lt,lt+.35,R);if(Y==="te"){let[L,q]=C(R),st=64*_e(...O.roll,R),V=90*_e(...O.raise,R)-3.2*_e(...O.retract,R);return{pop:ht,thumb:m.te,org:"GROUND SYSTEMS \xB7 PAD 7",title:"TE-2",sub:"Transporter erector \xB7 strongback",stat:L,statCls:q,statText:R<O.raise[0]?`Hangar \u2192 Pad 7 \xB7 ${Math.round(st)}/64 m`:`Angle ${V.toFixed(1)}\xB0 \xB7 Pad 7`,prog:R<O.raise[0]?st/64:V/90,progText:R<O.raise[0]?`${Math.round(st)} m`:`${V.toFixed(0)}\xB0`,rows:[["Payload","B1107 + SR-19",1],["Angle",`${V.toFixed(1)}\xB0`],["Speed",R<O.roll[1]?`${(.4+1.1*Math.sin(Math.PI*_e(...O.roll,R))).toFixed(1)} km/h`:"0.0 km/h"],["Rams",`2 \xD7 ${Math.round(80+150*_e(...O.raise,R))} bar`],["Crew","Pad crew B"]]}}if(Y==="stack"){let L=Math.round(100*x.fuel),q=R<O.raise[1]?["Going vertical","in"]:R<O.fuel[1]?[`Fuelling ${L}%`,"go"]:R<O.lift?["Terminal count","wait"]:["Liftoff","go"];return{pop:ht,thumb:m.stack,org:"VEHICLE \xB7 FLIGHT 12",title:"B1107 \xB7 SR-19",sub:"Reusable two-stage rocket \xB7 70 m",stat:q[0],statCls:q[1],statText:R<O.lift?`Pad 7 \xB7 ${ig(ou(R))}`:"Climbing \xB7 downrange",prog:R<O.raise[1]?_e(...O.raise,R):x.fuel,progText:R<O.raise[1]?`${Math.round(90*_e(...O.raise,R))}\xB0`:`${L}%`,rows:[["Booster","B1107 \xB7 12th flight",1],["Upper stage","S2-214"],["Payload","SR-19 \xB7 2,900 kg cargo"],["Destination","Space station \xB7 fwd port"],["Recovery","LZ-2 \xB7 return to site"]]}}if(Y==="farm"){let L=Math.round(100*_e(O.fuel[0],O.fuel[1]-.4,R)),q=Math.round(100*_e(O.fuel[0]-.6,O.fuel[1]-1.2,R));return{pop:ht,thumb:m.farm,org:"PROPELLANT \xB7 PAD 7",title:"Tank farm",sub:"LOX \xB7 RP-1 \xB7 helium \xB7 nitrogen",stat:L<100?"Loading":"Topping",statCls:"go",statText:`B1107 \xB7 LOX ${L}% \xB7 RP-1 ${q}%`,prog:(L+q)/200,progText:`${Math.round((L+q)/2)}%`,rows:[["Liquid oxygen",`${L}% \xB7 \u2212207 \xB0C`],["RP-1 kerosene",`${q}% \xB7 \u22127 \xB0C`],["Helium","100% \xB7 340 bar"],["Flow",L<100?"1.8 t/s":"0.1 t/s"],["Holds","none"]]}}if(Y==="booster"){let[L,q]=D(R),st=N(R),V=sg((R-O.sep)/(O.touch-O.sep));return{pop:ht,thumb:m.booster,org:"BOOSTER \xB7 RETURN TO SITE",title:"B1107",sub:"First stage \xB7 12th flight",stat:L,statCls:q,statText:R<O.touch?`To LZ-2 \xB7 ${Ro(st.alt,1)} km up`:"LZ-2 \xB7 0.4 m from centre",prog:V,progText:R<O.touch?`${Math.max(0,Math.round(O.touch-R))} s`:"down",rows:[["Altitude",`${Ro(st.alt,1)} km`],["Speed",`${Ro(st.v)} km/h`],["Grid fins",R<O.fins[0]?"Stowed":"Out \xB7 steering"],["Legs",R<O.legs[0]?"Stowed":R<O.legs[1]?"Deploying":"Down and locked"],["Propellant",`${Math.round(an(9,2,V))}%`]]}}if(Y==="crane"){let L=_e(O.convoy[0]+.35,O.convoy[1]+.1,R);return{pop:ht,thumb:m.crane,org:"RECOVERY \xB7 LZ-2",title:"CR-1",sub:"Mobile crane \xB7 220 t",stat:L<1?"En route":"On station",statCls:L<1?"in":"go",statText:L<1?`To LZ-2 \xB7 ${Math.max(0,Math.round(95*(1-L)))} m`:"LZ-2 \xB7 west pad",prog:L,progText:L<1?`${Math.max(1,Math.round(9*(1-L)))} s`:"there",rows:[["Job","Lift B1107 onto TT-3",1],["Convoy","Chase-4 \xB7 CR-1 \xB7 TT-3"],["Booster","Safing \xB7 vents open"],["Wind","9 kn \xB7 under limit"]]}}if(Y==="capsule"){let L=x.gap??52,q=R<O.hold[0]?["Approach","in"]:R<O.hold[1]?["Hold \xB7 20 m","wait"]:R<O.capture?["Final approach","in"]:["Soft capture","go"];return{pop:ht,thumb:m.capsule,org:"CARGO CAPSULE \xB7 SR-19",title:"SR-19",sub:"Uncrewed cargo \xB7 2,900 kg up",stat:q[0],statCls:q[1],statText:`Forward port \xB7 range ${L.toFixed(1)} m`,prog:1-L/52,progText:`${L.toFixed(1)} m`,rows:[["Range",`${L.toFixed(1)} m`],["Closing rate",R<O.capture?`${R>O.hold[0]&&R<O.hold[1]?"0.00":"0.10"} m/s`:"0.00 m/s"],["Mode","Autonomous"],["Cargo","2,900 kg \xB7 41 bags"],["Port","Forward \xB7 node 2"]]}}let _t=E(R),Pt={PAD:{thumb:m.pad,org:"LAUNCH COMPLEX",title:"Pad 7 \xB7 Seawall Point",sub:"Flight 12 \xB7 SR-19 to the station",stat:R<O.lift?"Count running":"Launched",text:R<O.lift?`${ig(ou(R))} \xB7 weather 94% go`:"B1107 returning to LZ-2",stats:[["Propellant",`${Math.round(100*x.fuel)}%`,"loaded",x.fuel],["Holds","0","today"],["Flights","12","this booster"],["Turnaround","9.2","days"]]},LZ:{thumb:m.lz,org:"LANDING ZONE",title:"Landing Zone 2",sub:"Return-to-site pad \xB7 36 m",stat:R<O.touch?"Clear \xB7 expecting B1107":"B1107 safing",text:"Crew on standby at the gate",stats:[["Landings","41","here"],["Last miss","none",""],["Crew","3","vehicles"],["Wind","9","kn"]]},ISS:{thumb:m.station,org:"ORBIT \xB7 418 KM",title:"Space Station",sub:"Seven aboard \xB7 92 min an orbit",stat:R<O.capture?"Arrival \xB7 SR-19":"SR-19 docked",text:R<O.capture?"Forward port clear \xB7 arm ready":"Hooks closing \xB7 hatch in 2 h",stats:[["Visiting",R<O.capture?"2":"3","/ 4 ports",R<O.capture?.5:.75,1],["Crew","7","aboard"],["Altitude","418","km"],["Power","92","kW"]]}}[_t];return{pop:ht,thumb:Pt.thumb,org:Pt.org,title:Pt.title,sub:Pt.sub,stat:Pt.stat,statCls:"go",statText:Pt.text,prog:0,progText:"",stats:Pt.stats,rows:[]}},P=R=>{let Y={kind:"site",t0:-1};for(let lt of ul)lt.card&&R>=lt.t&&(Y={kind:lt.card,t0:lt.t});return Y},z=(R,Y)=>({te:a.objects.te.group,stack:Y<O.sep?a.objects.booster.group:null,farm:a.objects.farm.group,booster:a.objects.booster.group,crane:a.objects.crane.group,capsule:a.objects.cap2.group})[R]??null,G=(R,Y)=>({te:["TE-2",C(Y)[0]],stack:["B1107",Y<O.lift?"Pad 7":"Climbing"],farm:["Tank farm","Loading"],booster:["B1107",D(Y)[0]],crane:["CR-1",Y<O.convoy[1]?"En route":"On station"],capsule:["SR-19",`${(x.gap??52).toFixed(1)} m`]})[R],$=R=>o.project(R),et=R=>R.ui?R.ui:$(a.anchors[R.at]())??[800,450],X=1,tt=R=>{let Y=[1050,620],lt=!0;for(let ht of ul){if(R<ht.t-X)return{p:Y,hand:lt};let _t=et(ht);if(R<ht.t){let Pt=rg((R-(ht.t-X))/X);return{p:[an(Y[0],_t[0],Pt),an(Y[1],_t[1],Pt)-16*Math.sin(Math.PI*Pt)],hand:!ht.ui}}Y=_t,lt=!ht.ui}return{p:Y,hand:lt}},nt=R=>{let Y=0;for(let lt of ul)R>=lt.t&&R<lt.t+.7&&(Y=Math.max(Y,1-(R-lt.t)/.7));return Y},St=R=>_e(39.9,40.2,R)*(1-_e(40.95,41.2,R)),yt=R=>{let Y=E(R);if(Y==="PAD"&&R<O.lift)return{labels:["Countdown","Propellant","Weather"],ic:["clock","drop","cloud"],a:[ng(ou(R)),"GO",R<O.retract[0]?"SR-19 \xB7 Pad 7":"terminal count"],b:[`${Math.round(100*x.fuel)}%`,x.fuel<1?"LOX":"FULL","RP-1 \xB7 LOX"],c:["94%","GO","wind 9 kn \xB7 Pad 7"]};if(Y!=="ISS"){let _t=N(R);return{labels:["Mission clock","Altitude","Speed \xB7 km/h"],ic:["clock","rocket","gauge"],a:[ng(ou(R)),R<O.sep?"S1":R<O.touch?"RTLS":"DOWN","SR-19 \xB7 flight 12"],b:[`${Ro(_t.alt,1)} km`,R<O.sep?"S1":"B1107",R<O.sep?"stack \xB7 downrange":"booster \xB7 to LZ-2"],c:[Ro(_t.v),R<O.sep?"MAX":"BRAKE",R<O.touch?"relative to ground":"on the pad"]}}let lt=x.gap??52,ht=25*60+21+(R-O.orbit)*.4;return{labels:["Mission clock","Range to port","Closing rate"],ic:["clock","rocket","gauge"],a:[`T+${os(ht/60)}:${os(ht%60)}`,"H","day 2 \xB7 orbit 17"],b:[`${lt.toFixed(1)} m`,R<O.capture?"IN":"MATED","forward port \xB7 node 2"],c:[R<O.capture?R>O.hold[0]&&R<O.hold[1]?"0.00 m/s":"0.10 m/s":"0.00 m/s",R<O.capture?"OK":"HOOKS","limit 0.20 m/s"]}},jt=R=>{let Y=(ht,_t)=>R<ht?"":R<_t?"on":"done";if(R<O.orbit){let ht=[["Rollout","T\u22123:30:00","truck",Y(-9,O.roll[1])],["Vertical","T\u22122:10:00","load",Y(O.roll[1],O.raise[1])],["Fuelled","T\u22120:35:00","box",Y(O.raise[1],O.fuel[1])],["Liftoff","T\u22120","plane",Y(O.fuel[1],O.lift+.4)],[R<O.touch?"Landing":"Landed","T+0:07:50","check",Y(O.lift+.4,O.touch)]],_t=R<O.roll[1]?.1*_e(-1.6,O.roll[1],R):R<O.raise[1]?.1+.2*_e(...O.raise,R):R<O.fuel[1]?.3+.2*_e(O.raise[1],O.fuel[1],R):R<O.lift?.5+.25*_e(O.fuel[1],O.lift,R):.75+.25*_e(O.lift,O.touch,R),Pt=R<O.lift?["On the pad","wait","Pad 7 \xB7 cargo bay sealed"]:R<O.sep+.3?["Ascent","go","Stage 1 burning"]:["Second stage","go","Orbit insertion in 6 min"];return{title:"Mission Timeline",meta:"Flight 12 \xB7 SR-19 resupply",fill:_t,steps:ht,ship:{thumb:m.capsule,id:"#SR-19",to:"To: Space station \xB7 fwd port",stat:Pt[0],statCls:Pt[1],meta:Pt[2]}}}let lt=R>=O.capture;return{title:"Mission Timeline",meta:"SR-19 \xB7 orbit 17",fill:lt?1:.75+.2*_e(O.orbit,O.capture,R),steps:[["Liftoff","Day 1 \xB7 09:41","plane","done"],["Orbit","Day 1 \xB7 09:50","box","done"],["Phasing","17 burns","load","done"],["Approach","Day 2 \xB7 10:52","truck",lt?"done":"on"],["Docked","Day 2 \xB7 11:04","check",lt?"on":""]],ship:{thumb:m.capsule,id:"#SR-19",to:"To: Space station \xB7 fwd port",stat:lt?"Docked":"Approach",statCls:lt?"go":"in",meta:lt?"Hooks closing \xB7 12 of 12":`Range ${(x.gap??52).toFixed(1)} m \xB7 0.10 m/s`}}},$t=R=>{let Y=E(R);if(Y==="ISS")return{tabs:[["Ports",R<O.capture?"2/4":"3/4"],["Crew","7"],["Arm","1"]],active:0,site:"Space Station",rows:[{id:"SR-19",org:"Cargo",dot:pt.blue,where:"Forward port \xB7 node 2",stat:R<O.capture?"Approach":"Docked",cls:R<O.capture?"in":"go",p:R<O.capture?null:100,pt:R<O.capture?`${(x.gap??52).toFixed(0)} m`:"mated"},{id:"CR-31",org:"Crew",dot:pt.teal,where:"Zenith port \xB7 node 2",stat:"Docked",cls:"go",p:null,pt:"day 88"},{id:"AR-7",org:"Cargo",dot:pt.orange,where:"Aft port \xB7 service module",stat:"Docked",cls:"go",p:null,pt:"day 40"},{id:"ARM-2",org:"Robotics",dot:pt.blue,where:"Truss \xB7 mobile base",stat:R<O.orbit+3.5?"Moving":"Ready",cls:R<O.orbit+3.5?"in":"go",p:null,pt:"standby"}]};let lt=_e(O.convoy[0],O.convoy[1],R);return{tabs:[["Vehicles","6"],["Pads","2"],["Boosters","4"]],active:0,site:Y==="PAD"?"Pad 7":"Landing Zone 2",rows:[{id:"TE-2",org:"Erector",dot:pt.blue,where:"Pad 7",stat:C(R)[0],cls:C(R)[1],p:R<O.raise[1]?100*(R<O.roll[1]?_e(...O.roll,R):_e(...O.raise,R)):null,pt:R<O.raise[1]?R<O.roll[1]?"rollout":"raise":"done"},{id:"B1107",org:"Booster",dot:pt.blue,where:R<O.lift?"Pad 7":R<O.touch?"In flight":"LZ-2",stat:R<O.lift?"Pad":R<O.touch?D(R)[0].split(" \xB7")[0]:"Landed",cls:R<O.lift?"wait":"go",p:null,pt:R<O.lift?"":R<O.touch?`${Ro(N(R).alt,1)} km`:"safing"},{id:"CR-1",org:"Crane",dot:pt.yellow,where:lt<1?lt>0?"To LZ-2":"East gate":"LZ-2",stat:lt>0&&lt<1?"En route":lt>=1?"On station":"Standby",cls:lt>0?"go":"wait",p:lt>0&&lt<1?100*lt:null,pt:lt>0&&lt<1?"driving":""},{id:"TT-3",org:"Trailer",dot:pt.teal,where:lt<1?"East gate":"LZ-2",stat:lt>.2?"En route":"Standby",cls:lt>.2?"in":"wait",p:null,pt:""}]}},xt=([R,Y])=>R>1130&&Y<560||R>1080&&Y>620||R<1e3&&Y>720||R<780&&Y<185,K=R=>{let Y=[],lt=(ht,_t=1)=>{let Pt=$(ht);Pt&&Pt[0]>20&&Pt[0]<1580&&Pt[1]>80&&Pt[1]<880&&!xt(Pt)&&Y.push({kind:"pin",x:Pt[0],y:Pt[1],a:_t})};return R<8.6&&lt(new U(2,9,6)),R>11&&R<17&&lt(a.anchors.farm()),R>O.sep+1&&R<O.touch-2.5&&lt(a.anchors.lz()),Y};return window.PADLINE={st:o,W:a,camAt:T},{resize:f,render(R){x=a.pose(R),g(x.inOrbit?"space":"ground");let Y=P(R),lt=c?null:z(Y.kind,R),ht=_e(Y.t0,Y.t0+.3,R);h.box(lt,ht);let _t=c?null:a.routes[Y.kind];h.route(_t?_t(R):null,_e(Y.t0,Y.t0+.9,R),1),h.update();let Pt=T(R);x.inOrbit||(o.scene.fog.near=v.ground.near+1.6*Math.max(0,Pt.y),o.scene.fog.far=v.ground.far+3*Math.max(0,Pt.y)),o.frame({tx:Pt.x,ty:Pt.y,tz:Pt.z,az:CM*tg,el:IM*tg,d:Pt.d,fov:28,sx:c?0:-110,sy:c?0:26});let L=K(R);if(lt){let ft=$(a.anchors[Y.kind]()),[ot,bt]=G(Y.kind,R);ft&&!xt(ft)&&L.push({kind:"sel",x:ft[0],y:ft[1],text:ot,sub:bt,a:ht})}let q=tt(R),st=-1;for(let ft of ul)ft.tool!=null&&R>=ft.t&&R<ft.t+.6&&(st=ft.tool);let V=yt(R);V.labels.forEach((ft,ot)=>{u[ot].textContent!==ft&&(u[ot].textContent=ft);let bt=Xa[V.ic[ot]];d[ot].dataset.v!==V.ic[ot]&&(d[ot].innerHTML=bt,d[ot].dataset.v=V.ic[ot])});let rt=R<O.orbit?9*3600+38*60+12+R*10:11*3600+2*60+40+(R-O.orbit)*8;return l.update({clock:`${os(rt/3600)}:${os(rt/60%60)}:${os(rt%60)}`,site:PM[E(R)],kpi:{a:V.a,b:V.b,c:V.c},card:F(R,Y.kind,Y.t0),track:jt(R),table:$t(R),drop:{open:St(R),sites:LM(R),on:R>40.5?2:1},tool:st,tags:L,cursor:q.p,hand:q.hand,click:nt(R)}),{bg:x.inOrbit?a.SPACE.bg:pt.bg}}}})}og({runSim:Nf});
/*! Bundled license information:

three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
