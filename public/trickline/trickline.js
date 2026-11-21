var Jl="186";var ff=0,uu=1,pf=2;var js=1,mf=2,Gr=3,ws=0,Fe=1,jn=2,$e=0,Wr=1,du=2,fu=3,pu=4,Kl=5;var Qn=100,gf=101,xf=102,_f=103,vf=104,Qs=200,yf=201,Mf=202,Sf=203,mu=204,gu=205,na=206,bf=207,ia=208,wf=209,Ef=210,Tf=211,Af=212,Rf=213,Cf=214,xl=0,_l=1,vl=2,Cr=3,yl=4,Ml=5,Sl=6,bl=7,jl=0,Pf=1,If=2,gi=0,sa=1,ra=2,oa=3,tr=4,aa=5,la=6,Ji=7;var xu=300,Es=301,er=302,Ql=303,tc=304,ca=306,Ii=1e3,Ci=1001,wl=1002,We=1003,Lf=1004;var ha=1005;var hn=1006,ec=1007;var Ts=1008;var vn=1009,_u=1010,vu=1011,Xr=1012,nc=1013,xi=1014,ti=1015,an=1016,ic=1017,sc=1018,As=1020,yu=35902,Mu=35899,Su=1021,bu=1022,Ln=1023,Li=1026,Fi=1027,rc=1028,oc=1029,Rs=1030,ac=1031;var lc=1033,ua=33776,da=33777,fa=33778,pa=33779,cc=35840,hc=35841,uc=35842,dc=35843,fc=36196,pc=37492,mc=37496,gc=37488,xc=37489,ma=37490,_c=37491,vc=37808,yc=37809,Mc=37810,Sc=37811,bc=37812,wc=37813,Ec=37814,Tc=37815,Ac=37816,Rc=37817,Cc=37818,Pc=37819,Ic=37820,Lc=37821,Dc=36492,Uc=36494,Nc=36495,Fc=36283,Oc=36284,ga=36285,Bc=36286;var To=2300,El=2301,ml=2302,Qh=2303,tu=2400,eu=2401,nu=2402;var Df=3200;var qr=0,Uf=1,Ki="",ze="srgb",Ao="srgb-linear",Ro="linear",fe="srgb";var gl=7680;var Nf=519,Ff=512,Of=513,Bf=514,zc=515,zf=516,kf=517,kc=518,Vf=519,wu=35044;var Eu="300 es",pi=2e3,Pr=2001;function zm(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function km(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Co(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Hf(){let i=Co("canvas");return i.style.display="block",i}var Ud={},Ir=null;function Po(...i){let t="THREE."+i.shift();Ir?Ir("log",t,...i):console.log(t,...i)}function Gf(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Zt(...i){i=Gf(i);let t="THREE."+i.shift();if(Ir)Ir("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Jt(...i){i=Gf(i);let t="THREE."+i.shift();if(Ir)Ir("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function qs(...i){let t=i.join(" ");t in Ud||(Ud[t]=!0,Zt(...i))}function Wf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Xf={[xl]:_l,[vl]:Sl,[yl]:bl,[Cr]:Ml,[_l]:xl,[Sl]:vl,[bl]:yl,[Ml]:Cr},Di=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Nd=1234567,So=Math.PI/180,Lr=180/Math.PI;function Pi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(gn[i&255]+gn[i>>8&255]+gn[i>>16&255]+gn[i>>24&255]+"-"+gn[t&255]+gn[t>>8&255]+"-"+gn[t>>16&15|64]+gn[t>>24&255]+"-"+gn[e&63|128]+gn[e>>8&255]+"-"+gn[e>>16&255]+gn[e>>24&255]+gn[n&255]+gn[n>>8&255]+gn[n>>16&255]+gn[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function Tu(i,t){return(i%t+t)%t}function Vm(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Hm(i,t,e){return i!==t?(e-i)/(t-i):0}function bo(i,t,e){return(1-e)*i+e*t}function Gm(i,t,e,n){return bo(i,t,1-Math.exp(-e*n))}function Wm(i,t=1){return t-Math.abs(Tu(i,t*2)-t)}function Xm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function qm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function $m(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ym(i,t){return i+Math.random()*(t-i)}function Zm(i){return i*(.5-Math.random())}function Jm(i){i!==void 0&&(Nd=i);let t=Nd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Km(i){return i*So}function jm(i){return i*Lr}function Qm(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function t0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function e0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function n0(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:Zt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Me(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Au={DEG2RAD:So,RAD2DEG:Lr,generateUUID:Pi,clamp:te,euclideanModulo:Tu,mapLinear:Vm,inverseLerp:Hm,lerp:bo,damp:Gm,pingpong:Wm,smoothstep:Xm,smootherstep:qm,randInt:$m,randFloat:Ym,randFloatSpread:Zm,seededRandom:Jm,degToRad:Km,radToDeg:jm,isPowerOfTwo:Qm,ceilPowerOfTwo:t0,floorPowerOfTwo:e0,setQuaternionFromProperEuler:n0,normalize:Me,denormalize:fi},ft=class i{static{i.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ve=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(d!==v||l!==u||c!==f||h!==m){let g=l*u+c*f+h*m+d*v;g<0&&(u=-u,f=-f,m=-m,v=-v,g=-g);let p=1-a;if(g<.9995){let _=Math.acos(g),T=Math.sin(_);p=Math.sin(p*_)/T,a=Math.sin(a*_)/T,l=l*p+u*a,c=c*p+f*a,h=h*p+m*a,d=d*p+v*a}else{l=l*p+u*a,c=c*p+f*a,h=h*p+m*a,d=d*p+v*a;let _=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=_,c*=_,h*=_,d*=_}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*d+l*f-c*u,t[e+1]=l*m+h*u+c*d-a*f,t[e+2]=c*m+h*f+a*u-l*d,t[e+3]=h*m-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"YZX":this._x=u*h*d+c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d-u*f*m;break;case"XZY":this._x=u*h*d-c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d+u*f*m;break;default:Zt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{static{i.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Fd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Fd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Rh.copy(this).projectOnVector(t),this.sub(Rh)}reflect(t){return this.sub(Rh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Rh=new P,Fd=new Ve,ee=class i{static{i.prototype.isMatrix3=!0}constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],_=s[1],T=s[4],y=s[7],S=s[2],E=s[5],w=s[8];return r[0]=o*v+a*_+l*S,r[3]=o*g+a*T+l*E,r[6]=o*p+a*y+l*w,r[1]=c*v+h*_+d*S,r[4]=c*g+h*T+d*E,r[7]=c*p+h*y+d*w,r[2]=u*v+f*_+m*S,r[5]=u*g+f*T+m*E,r[8]=u*p+f*y+m*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,m=e*d+n*u+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return qs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ch.makeScale(t,e)),this}rotate(t){return qs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ch.makeRotation(-t)),this}translate(t,e){return qs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ch.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ch=new ee,Od=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bd=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function i0(){let i={enabled:!0,workingColorSpace:Ao,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===fe&&(s.r=qi(s.r),s.g=qi(s.g),s.b=qi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===fe&&(s.r=Rr(s.r),s.g=Rr(s.g),s.b=Rr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ki?Ro:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return qs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return qs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ao]:{primaries:t,whitePoint:n,transfer:Ro,toXYZ:Od,fromXYZ:Bd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ze},outputColorSpaceConfig:{drawingBufferColorSpace:ze}},[ze]:{primaries:t,whitePoint:n,transfer:fe,toXYZ:Od,fromXYZ:Bd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ze}}}),i}var oe=i0();function qi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Rr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var dr,Tl=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{dr===void 0&&(dr=Co("canvas")),dr.width=t.width,dr.height=t.height;let s=dr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=dr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Co("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=qi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(qi(e[n]/255)*255):e[n]=qi(e[n]);return{data:e,width:t.width,height:t.height}}else return Zt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},s0=0,Dr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ph(s[o].image)):r.push(Ph(s[o]))}else r=Ph(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ph(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Tl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Zt("Texture: Unable to serialize Texture."),{})}var r0=0,Ih=new P,Tn=class i extends Di{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Ci,s=Ci,r=hn,o=Ts,a=Ln,l=vn,c=i.DEFAULT_ANISOTROPY,h=Ki){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:r0++}),this.uuid=Pi(),this.name="",this.source=new Dr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ih).x}get height(){return this.source.getSize(Ih).y}get depth(){return this.source.getSize(Ih).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Zt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Zt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==xu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ii:t.x=t.x-Math.floor(t.x);break;case Ci:t.x=t.x<0?0:1;break;case wl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ii:t.y=t.y-Math.floor(t.y);break;case Ci:t.y=t.y<0?0:1;break;case wl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Tn.DEFAULT_IMAGE=null;Tn.DEFAULT_MAPPING=xu;Tn.DEFAULT_ANISOTROPY=1;var xe=class i{static{i.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let T=(c+1)/2,y=(f+1)/2,S=(p+1)/2,E=(h+u)/4,w=(d+v)/4,x=(m+g)/4;return T>y&&T>S?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=E/n,r=w/n):y>S?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=E/s,r=x/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=w/r,s=x/r),this.set(n,s,r,e),this}let _=Math.sqrt((g-m)*(g-m)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(d-v)/_,this.z=(u-h)/_,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Al=class extends Di{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new xe(0,0,t,e),this.scissorTest=!1,this.viewport=new xe(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new Tn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:hn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Dr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xe=class extends Al{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Io=class extends Tn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Rl=class extends Tn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var jt=class i{static{i.prototype.isMatrix4=!0}constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,m,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,m,v,g)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,m,v,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/fr.setFromMatrixColumn(t,0).length(),r=1/fr.setFromMatrixColumn(t,1).length(),o=1/fr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,m=a*h,v=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+m*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u+v*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=v+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u-v*a,e[4]=-o*d,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,m=a*h,v=a*d;e[0]=l*h,e[4]=m*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=v-u*d,e[8]=m*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+m,e[10]=u-v*d}else if(t.order==="XZY"){let u=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=o*h,e[9]=f*d-m,e[2]=m*d-f,e[6]=a*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(o0,t,a0)}lookAt(t,e,n){let s=this.elements;return zn.subVectors(t,e),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),cs.crossVectors(n,zn),cs.lengthSq()===0&&(Math.abs(n.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),cs.crossVectors(n,zn)),cs.normalize(),qa.crossVectors(zn,cs),s[0]=cs.x,s[4]=qa.x,s[8]=zn.x,s[1]=cs.y,s[5]=qa.y,s[9]=zn.y,s[2]=cs.z,s[6]=qa.z,s[10]=zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],_=n[3],T=n[7],y=n[11],S=n[15],E=s[0],w=s[4],x=s[8],b=s[12],R=s[1],L=s[5],F=s[9],N=s[13],U=s[2],O=s[6],Y=s[10],X=s[14],ot=s[3],H=s[7],Q=s[11],tt=s[15];return r[0]=o*E+a*R+l*U+c*ot,r[4]=o*w+a*L+l*O+c*H,r[8]=o*x+a*F+l*Y+c*Q,r[12]=o*b+a*N+l*X+c*tt,r[1]=h*E+d*R+u*U+f*ot,r[5]=h*w+d*L+u*O+f*H,r[9]=h*x+d*F+u*Y+f*Q,r[13]=h*b+d*N+u*X+f*tt,r[2]=m*E+v*R+g*U+p*ot,r[6]=m*w+v*L+g*O+p*H,r[10]=m*x+v*F+g*Y+p*Q,r[14]=m*b+v*N+g*X+p*tt,r[3]=_*E+T*R+y*U+S*ot,r[7]=_*w+T*L+y*O+S*H,r[11]=_*x+T*F+y*Y+S*Q,r[15]=_*b+T*N+y*X+S*tt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15],_=l*f-c*u,T=a*f-c*d,y=a*u-l*d,S=o*f-c*h,E=o*u-l*h,w=o*d-a*h;return e*(v*_-g*T+p*y)-n*(m*_-g*S+p*E)+s*(m*T-v*S+p*w)-r*(m*y-v*E+g*w)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=e*a-n*o,T=e*l-s*o,y=e*c-r*o,S=n*l-s*a,E=n*c-r*a,w=s*c-r*l,x=h*v-d*m,b=h*g-u*m,R=h*p-f*m,L=d*g-u*v,F=d*p-f*v,N=u*p-f*g,U=_*N-T*F+y*L+S*R-E*b+w*x;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let O=1/U;return t[0]=(a*N-l*F+c*L)*O,t[1]=(s*F-n*N-r*L)*O,t[2]=(v*w-g*E+p*S)*O,t[3]=(u*E-d*w-f*S)*O,t[4]=(l*R-o*N-c*b)*O,t[5]=(e*N-s*R+r*b)*O,t[6]=(g*y-m*w-p*T)*O,t[7]=(h*w-u*y+f*T)*O,t[8]=(o*F-a*R+c*x)*O,t[9]=(n*R-e*F-r*x)*O,t[10]=(m*E-v*y+p*_)*O,t[11]=(d*y-h*E-f*_)*O,t[12]=(a*b-o*L-l*x)*O,t[13]=(e*L-n*b+s*x)*O,t[14]=(v*T-m*S-g*_)*O,t[15]=(h*S-d*T+u*_)*O,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,m=r*d,v=o*h,g=o*d,p=a*d,_=l*c,T=l*h,y=l*d,S=n.x,E=n.y,w=n.z;return s[0]=(1-(v+p))*S,s[1]=(f+y)*S,s[2]=(m-T)*S,s[3]=0,s[4]=(f-y)*E,s[5]=(1-(u+p))*E,s[6]=(g+_)*E,s[7]=0,s[8]=(m+T)*w,s[9]=(g-_)*w,s[10]=(1-(u+v))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=fr.set(s[0],s[1],s[2]).length(),a=fr.set(s[4],s[5],s[6]).length(),l=fr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),ci.copy(this);let c=1/o,h=1/a,d=1/l;return ci.elements[0]*=c,ci.elements[1]*=c,ci.elements[2]*=c,ci.elements[4]*=h,ci.elements[5]*=h,ci.elements[6]*=h,ci.elements[8]*=d,ci.elements[9]*=d,ci.elements[10]*=d,e.setFromRotationMatrix(ci),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=pi,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s),m,v;if(l)m=r/(o-r),v=o*r/(o-r);else if(a===pi)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Pr)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=pi,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s),m,v;if(l)m=1/(o-r),v=o/(o-r);else if(a===pi)m=-2/(o-r),v=-(o+r)/(o-r);else if(a===Pr)m=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},fr=new P,ci=new jt,o0=new P(0,0,0),a0=new P(1,1,1),cs=new P,qa=new P,zn=new P,zd=new jt,kd=new Ve,Zn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-te(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(te(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Zt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return zd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(zd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kd.setFromEuler(this),this.setFromQuaternion(kd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Zn.DEFAULT_ORDER="XYZ";var Lo=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},l0=0,Vd=new P,pr=new Ve,Vi=new jt,$a=new P,mo=new P,c0=new P,h0=new Ve,Hd=new P(1,0,0),Gd=new P(0,1,0),Wd=new P(0,0,1),Xd={type:"added"},u0={type:"removed"},mr={type:"childadded",child:null},Lh={type:"childremoved",child:null},rn=class i extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new P,e=new Zn,n=new Ve,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new jt},normalMatrix:{value:new ee}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pr.setFromAxisAngle(t,e),this.quaternion.multiply(pr),this}rotateOnWorldAxis(t,e){return pr.setFromAxisAngle(t,e),this.quaternion.premultiply(pr),this}rotateX(t){return this.rotateOnAxis(Hd,t)}rotateY(t){return this.rotateOnAxis(Gd,t)}rotateZ(t){return this.rotateOnAxis(Wd,t)}translateOnAxis(t,e){return Vd.copy(t).applyQuaternion(this.quaternion),this.position.add(Vd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Hd,t)}translateY(t){return this.translateOnAxis(Gd,t)}translateZ(t){return this.translateOnAxis(Wd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Vi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$a.copy(t):$a.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Vi.lookAt(mo,$a,this.up):Vi.lookAt($a,mo,this.up),this.quaternion.setFromRotationMatrix(Vi),s&&(Vi.extractRotation(s.matrixWorld),pr.setFromRotationMatrix(Vi),this.quaternion.premultiply(pr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Xd),mr.child=t,this.dispatchEvent(mr),mr.child=null):Jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(u0),Lh.child=t,this.dispatchEvent(Lh),Lh.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Vi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Vi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Vi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Xd),mr.child=t,this.dispatchEvent(mr),mr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,t,c0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,h0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};rn.DEFAULT_UP=new P(0,1,0);rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Se=class extends rn{constructor(){super(),this.isGroup=!0,this.type="Group"}},d0={type:"move"},Ur=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Se,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Se,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Se,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let g=e.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&u>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(d0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Se;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},qf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hs={h:0,s:0,l:0},Ya={h:0,s:0,l:0};function Dh(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Yt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=oe.workingColorSpace){if(t=Tu(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Dh(o,r,t+1/3),this.g=Dh(o,r,t),this.b=Dh(o,r,t-1/3)}return oe.colorSpaceToWorking(this,s),this}setStyle(t,e=ze){function n(r){r!==void 0&&parseFloat(r)<1&&Zt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Zt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Zt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ze){let n=qf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Zt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=qi(t.r),this.g=qi(t.g),this.b=qi(t.b),this}copyLinearToSRGB(t){return this.r=Rr(t.r),this.g=Rr(t.g),this.b=Rr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ze){return oe.workingToColorSpace(xn.copy(this),t),Math.round(te(xn.r*255,0,255))*65536+Math.round(te(xn.g*255,0,255))*256+Math.round(te(xn.b*255,0,255))}getHexString(t=ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(xn.copy(this),e);let n=xn.r,s=xn.g,r=xn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(xn.copy(this),e),t.r=xn.r,t.g=xn.g,t.b=xn.b,t}getStyle(t=ze){oe.workingToColorSpace(xn.copy(this),t);let e=xn.r,n=xn.g,s=xn.b;return t!==ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(hs),this.setHSL(hs.h+t,hs.s+e,hs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hs),t.getHSL(Ya);let n=bo(hs.h,Ya.h,e),s=bo(hs.s,Ya.s,e),r=bo(hs.l,Ya.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},xn=new Yt;Yt.NAMES=qf;var Do=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Yt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},$i=class extends rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zn,this.environmentIntensity=1,this.environmentRotation=new Zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},hi=new P,Hi=new P,Uh=new P,Gi=new P,gr=new P,xr=new P,qd=new P,Nh=new P,Fh=new P,Oh=new P,Bh=new xe,zh=new xe,kh=new xe,ps=class i{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),hi.subVectors(t,e),s.cross(hi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){hi.subVectors(s,e),Hi.subVectors(n,e),Uh.subVectors(t,e);let o=hi.dot(hi),a=hi.dot(Hi),l=hi.dot(Uh),c=Hi.dot(Hi),h=Hi.dot(Uh),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,m=(o*h-a*l)*u;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Gi)===null?!1:Gi.x>=0&&Gi.y>=0&&Gi.x+Gi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gi.x),l.addScaledVector(o,Gi.y),l.addScaledVector(a,Gi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Bh.setScalar(0),zh.setScalar(0),kh.setScalar(0),Bh.fromBufferAttribute(t,e),zh.fromBufferAttribute(t,n),kh.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Bh,r.x),o.addScaledVector(zh,r.y),o.addScaledVector(kh,r.z),o}static isFrontFacing(t,e,n,s){return hi.subVectors(n,e),Hi.subVectors(t,e),hi.cross(Hi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hi.subVectors(this.c,this.b),Hi.subVectors(this.a,this.b),hi.cross(Hi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;gr.subVectors(s,n),xr.subVectors(r,n),Nh.subVectors(t,n);let l=gr.dot(Nh),c=xr.dot(Nh);if(l<=0&&c<=0)return e.copy(n);Fh.subVectors(t,s);let h=gr.dot(Fh),d=xr.dot(Fh);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(gr,o);Oh.subVectors(t,r);let f=gr.dot(Oh),m=xr.dot(Oh);if(m>=0&&f<=m)return e.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(xr,a);let g=h*m-f*d;if(g<=0&&d-h>=0&&f-m>=0)return qd.subVectors(r,s),a=(d-h)/(d-h+(f-m)),e.copy(s).addScaledVector(qd,a);let p=1/(g+v+u);return o=v*p,a=u*p,e.copy(n).addScaledVector(gr,o).addScaledVector(xr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Qe=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ui.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ui.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ui.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ui):ui.fromBufferAttribute(r,o),ui.applyMatrix4(t.matrixWorld),this.expandByPoint(ui);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Za.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Za.copy(n.boundingBox)),Za.applyMatrix4(t.matrixWorld),this.union(Za)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ui),ui.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(go),Ja.subVectors(this.max,go),_r.subVectors(t.a,go),vr.subVectors(t.b,go),yr.subVectors(t.c,go),us.subVectors(vr,_r),ds.subVectors(yr,vr),Vs.subVectors(_r,yr);let e=[0,-us.z,us.y,0,-ds.z,ds.y,0,-Vs.z,Vs.y,us.z,0,-us.x,ds.z,0,-ds.x,Vs.z,0,-Vs.x,-us.y,us.x,0,-ds.y,ds.x,0,-Vs.y,Vs.x,0];return!Vh(e,_r,vr,yr,Ja)||(e=[1,0,0,0,1,0,0,0,1],!Vh(e,_r,vr,yr,Ja))?!1:(Ka.crossVectors(us,ds),e=[Ka.x,Ka.y,Ka.z],Vh(e,_r,vr,yr,Ja))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ui).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ui).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Wi=[new P,new P,new P,new P,new P,new P,new P,new P],ui=new P,Za=new Qe,_r=new P,vr=new P,yr=new P,us=new P,ds=new P,Vs=new P,go=new P,Ja=new P,Ka=new P,Hs=new P;function Vh(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Hs.fromArray(i,r);let a=s.x*Math.abs(Hs.x)+s.y*Math.abs(Hs.y)+s.z*Math.abs(Hs.z),l=t.dot(Hs),c=e.dot(Hs),h=n.dot(Hs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Je=new P,ja=new ft,f0=0,Ge=class extends Di{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:f0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=wu,this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ja.fromBufferAttribute(this,e),ja.applyMatrix3(t),this.setXY(e,ja.x,ja.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix3(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix4(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyNormalMatrix(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.transformDirection(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Uo=class extends Ge{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var No=class extends Ge{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ae=class extends Ge{constructor(t,e,n){super(new Float32Array(t),e,n)}},p0=new Qe,xo=new P,Hh=new P,Jn=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):p0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xo.subVectors(t,this.center);let e=xo.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(xo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Hh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xo.copy(t.center).add(Hh)),this.expandByPoint(xo.copy(t.center).sub(Hh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},m0=0,Yn=new jt,Gh=new rn,Mr=new P,kn=new Qe,_o=new Qe,sn=new P,we=class i extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:m0++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zm(t)?No:Uo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ee().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Yn.makeRotationFromQuaternion(t),this.applyMatrix4(Yn),this}rotateX(t){return Yn.makeRotationX(t),this.applyMatrix4(Yn),this}rotateY(t){return Yn.makeRotationY(t),this.applyMatrix4(Yn),this}rotateZ(t){return Yn.makeRotationZ(t),this.applyMatrix4(Yn),this}translate(t,e,n){return Yn.makeTranslation(t,e,n),this.applyMatrix4(Yn),this}scale(t,e,n){return Yn.makeScale(t,e,n),this.applyMatrix4(Yn),this}lookAt(t){return Gh.lookAt(t),Gh.updateMatrix(),this.applyMatrix4(Gh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mr).negate(),this.translate(Mr.x,Mr.y,Mr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ae(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Zt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qe);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];kn.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){let n=this.boundingSphere.center;if(kn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];_o.setFromBufferAttribute(a),this.morphTargetsRelative?(sn.addVectors(kn.min,_o.min),kn.expandByPoint(sn),sn.addVectors(kn.max,_o.max),kn.expandByPoint(sn)):(kn.expandByPoint(_o.min),kn.expandByPoint(_o.max))}kn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)sn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(sn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)sn.fromBufferAttribute(a,c),l&&(Mr.fromBufferAttribute(t,c),sn.add(Mr)),s=Math.max(s,n.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ge(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<n.count;x++)a[x]=new P,l[x]=new P;let c=new P,h=new P,d=new P,u=new ft,f=new ft,m=new ft,v=new P,g=new P;function p(x,b,R){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,R),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,b),m.fromBufferAttribute(r,R),h.sub(c),d.sub(c),f.sub(u),m.sub(u);let L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(L),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(L),a[x].add(v),a[b].add(v),a[R].add(v),l[x].add(g),l[b].add(g),l[R].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let x=0,b=_.length;x<b;++x){let R=_[x],L=R.start,F=R.count;for(let N=L,U=L+F;N<U;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let T=new P,y=new P,S=new P,E=new P;function w(x){S.fromBufferAttribute(s,x),E.copy(S);let b=a[x];T.copy(b),T.sub(S.multiplyScalar(S.dot(b))).normalize(),y.crossVectors(E,b);let L=y.dot(l[x])<0?-1:1;o.setXYZW(x,T.x,T.y,T.z,L)}for(let x=0,b=_.length;x<b;++x){let R=_[x],L=R.start,F=R.count;for(let N=L,U=L+F;N<U;N+=3)w(t.getX(N+0)),w(t.getX(N+1)),w(t.getX(N+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ge(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,d=new P;if(t)for(let u=0,f=t.count;u<f;u+=3){let m=t.getX(u+0),v=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)sn.fromBufferAttribute(t,e),sn.normalize(),t.setXYZ(e,sn.x,sn.y,sn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)u[m++]=c[f++]}return new Ge(u,h,d)}if(this.index===null)return Zt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=wu,this.updateRanges=[],this.version=0,this.uuid=Pi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},En=new P,Kn=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)En.fromBufferAttribute(this,e),En.applyMatrix4(t),this.setXYZ(e,En.x,En.y,En.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)En.fromBufferAttribute(this,e),En.applyNormalMatrix(t),this.setXYZ(e,En.x,En.y,En.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)En.fromBufferAttribute(this,e),En.transformDirection(t),this.setXYZ(e,En.x,En.y,En.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=fi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=fi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=fi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=fi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=fi(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Po("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ge(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Po("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Wh=new P,g0=new P,x0=new ee,di=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Wh.subVectors(n,e).cross(g0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Wh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||x0.getNormalMatrix(t),s=this.coplanarPoint(Wh).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},_0=0,Ui=class extends Di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_0++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=Wr,this.side=ws,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mu,this.blendDst=gu,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gl,this.stencilZFail=gl,this.stencilZPass=gl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Zt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Zt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Yt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new di().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ft().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ft().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Xi=new P,Xh=new P,Qa=new P,tl=new P,Cl=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Xi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xi.copy(this.origin).addScaledVector(this.direction,e),Xi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Xh.copy(t).add(e).multiplyScalar(.5),Qa.copy(e).sub(t).normalize(),tl.copy(this.origin).sub(Xh);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Qa),a=tl.dot(this.direction),l=-tl.dot(Qa),c=tl.lengthSq(),h=Math.abs(1-o*o),d,u,f,m;if(h>0)if(d=o*l-a,u=o*a-l,m=r*h,d>=0)if(u>=-m)if(u<=m){let v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Xh).addScaledVector(Qa,u),f}intersectSphere(t,e){if(t.radius<0)return null;Xi.subVectors(t.center,this.origin);let n=Xi.dot(this.direction),s=Xi.dot(Xi)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Xi)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,m=e.x-o.x,v=e.y-o.y,g=e.z-o.z,p=n.x-o.x,_=n.y-o.y,T=n.z-o.z,y=Math.abs(l),S=Math.abs(c),E=Math.abs(h),w,x,b,R,L,F,N,U,O,Y,X,ot;if(y>=S&&y>=E?(b=l,F=d,O=m,ot=p,l>=0?(w=c,x=h,R=u,L=f,N=v,U=g,Y=_,X=T):(w=h,x=c,R=f,L=u,N=g,U=v,Y=T,X=_)):S>=E?(b=c,F=u,O=v,ot=_,c>=0?(w=h,x=l,R=f,L=d,N=g,U=m,Y=T,X=p):(w=l,x=h,R=d,L=f,N=m,U=g,Y=p,X=T)):(b=h,F=f,O=g,ot=T,h>=0?(w=l,x=c,R=d,L=u,N=m,U=v,Y=p,X=_):(w=c,x=l,R=u,L=d,N=v,U=m,Y=_,X=p)),b===0)return null;let H=w/b,Q=x/b,tt=1/b,gt=R-H*F,xt=L-Q*F,$t=N-H*O,Gt=U-Q*O,G=Y-H*ot,I=X-Q*ot,D=G*Gt-I*$t,k=gt*I-xt*G,W=$t*xt-Gt*gt;if(s){if(D<0||k<0||W<0)return null}else if((D<0||k<0||W<0)&&(D>0||k>0||W>0))return null;let $=D+k+W;if($===0)return null;let ut=tt*(D*F+k*O+W*ot);return($>0?ut<0:ut>0)?null:this.at(ut/$,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},mi=class extends Ui{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=jl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},$d=new jt,Gs=new Cl,el=new Jn,Yd=new P,nl=new P,il=new P,sl=new P,qh=new P,rl=new P,Zd=new P,ol=new P,Qt=class extends rn{constructor(t=new we,e=new mi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){rl.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(qh.fromBufferAttribute(d,t),o?rl.addScaledVector(qh,h):rl.addScaledVector(qh.sub(e),h))}e.add(rl)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),el.copy(n.boundingSphere),el.applyMatrix4(r),Gs.copy(t.ray).recast(t.near),!(el.containsPoint(Gs.origin)===!1&&(Gs.intersectSphere(el,Yd)===null||Gs.origin.distanceToSquared(Yd)>(t.far-t.near)**2))&&($d.copy(r).invert(),Gs.copy(t.ray).applyMatrix4($d),!(n.boundingBox!==null&&Gs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Gs)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){let g=u[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),T=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=T;y<S;y+=3){let E=a.getX(y),w=a.getX(y+1),x=a.getX(y+2);s=al(this,p,t,n,c,h,d,E,w,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let _=a.getX(g),T=a.getX(g+1),y=a.getX(g+2);s=al(this,o,t,n,c,h,d,_,T,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){let g=u[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),T=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=T;y<S;y+=3){let E=y,w=y+1,x=y+2;s=al(this,p,t,n,c,h,d,E,w,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let _=g,T=g+1,y=g+2;s=al(this,o,t,n,c,h,d,_,T,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function v0(i,t,e,n,s,r,o,a){let l;if(t.side===Fe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ws,a),l===null)return null;ol.copy(a),ol.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ol);return c<e.near||c>e.far?null:{distance:c,point:ol.clone(),object:i}}function al(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,nl),i.getVertexPosition(l,il),i.getVertexPosition(c,sl);let h=v0(i,t,e,n,nl,il,sl,Zd);if(h){let d=new P;ps.getBarycoord(Zd,nl,il,sl,d),s&&(h.uv=ps.getInterpolatedAttribute(s,a,l,c,d,new ft)),r&&(h.uv1=ps.getInterpolatedAttribute(r,a,l,c,d,new ft)),o&&(h.normal=ps.getInterpolatedAttribute(o,a,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new P,materialIndex:0};ps.getNormal(nl,il,sl,u.normal),h.face=u,h.barycoord=d}return h}var Yi=class extends Tn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=We,h=We,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Nr=class extends Ge{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Sr=new jt,Jd=new jt,ll=[],Kd=new Qe,y0=new jt,vo=new Qt,yo=new Jn,ms=class extends Qt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Nr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,y0)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Qe),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Sr),Kd.copy(t.boundingBox).applyMatrix4(Sr),this.boundingBox.union(Kd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Sr),yo.copy(t.boundingSphere).applyMatrix4(Sr),this.boundingSphere.union(yo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(vo.geometry=this.geometry,vo.material=this.material,vo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(n),t.ray.intersectsSphere(yo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Sr),Jd.multiplyMatrices(n,Sr),vo.matrixWorld=Jd,vo.raycast(t,ll);for(let o=0,a=ll.length;o<a;o++){let l=ll[o];l.instanceId=r,l.object=this,e.push(l)}ll.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Nr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yi(new Float32Array(s*this.count),s,this.count,rc,ti));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ws=new Jn,M0=new ft(.5,.5),cl=new P,Fr=class{constructor(t=new di,e=new di,n=new di,s=new di,r=new di,o=new di){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=pi,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],v=r[9],g=r[10],p=r[11],_=r[12],T=r[13],y=r[14],S=r[15];if(s[0].setComponents(c-o,f-h,p-m,S-_).normalize(),s[1].setComponents(c+o,f+h,p+m,S+_).normalize(),s[2].setComponents(c+a,f+d,p+v,S+T).normalize(),s[3].setComponents(c-a,f-d,p-v,S-T).normalize(),n)s[4].setComponents(l,u,g,y).normalize(),s[5].setComponents(c-l,f-u,p-g,S-y).normalize();else if(s[4].setComponents(c-l,f-u,p-g,S-y).normalize(),e===pi)s[5].setComponents(c+l,f+u,p+g,S+y).normalize();else if(e===Pr)s[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ws.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ws.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ws)}intersectsSprite(t){Ws.center.set(0,0,0);let e=M0.distanceTo(t.center);return Ws.radius=.7071067811865476+e,Ws.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ws)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(cl.x=s.normal.x>0?t.max.x:t.min.x,cl.y=s.normal.y>0?t.max.y:t.min.y,cl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(cl)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Oo=class extends Tn{constructor(t=[],e=Es,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},gs=class extends Tn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ni=class extends Tn{constructor(t,e,n=xi,s,r,o,a=We,l=We,c,h=Li,d=1){if(h!==Li&&h!==Fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Dr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Pl=class extends Ni{constructor(t,e=xi,n=Es,s,r,o=We,a=We,l,c=Li){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Bo=class extends Tn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Ke=class i extends we{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ae(c,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(d,2));function m(v,g,p,_,T,y,S,E,w,x,b){let R=y/w,L=S/x,F=y/2,N=S/2,U=E/2,O=w+1,Y=x+1,X=0,ot=0,H=new P;for(let Q=0;Q<Y;Q++){let tt=Q*L-N;for(let gt=0;gt<O;gt++){let xt=gt*R-F;H[v]=xt*_,H[g]=tt*T,H[p]=U,c.push(H.x,H.y,H.z),H[v]=0,H[g]=0,H[p]=E>0?1:-1,h.push(H.x,H.y,H.z),d.push(gt/w),d.push(1-Q/x),X+=1}}for(let Q=0;Q<x;Q++)for(let tt=0;tt<w;tt++){let gt=u+tt+O*Q,xt=u+tt+O*(Q+1),$t=u+(tt+1)+O*(Q+1),Gt=u+(tt+1)+O*Q;l.push(gt,xt,Gt),l.push(xt,$t,Gt),ot+=6}a.addGroup(f,ot,b),f+=ot,u+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},$s=class i extends we{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,m=n*2+r,v=s+1,g=new P,p=new P;for(let _=0;_<=m;_++){let T=0,y=0,S=0,E=0;if(_<=n){let b=_/n,R=b*Math.PI/2;y=-h-t*Math.cos(R),S=t*Math.sin(R),E=-t*Math.cos(R),T=b*d}else if(_<=n+r){let b=(_-n)/r;y=-h+b*e,S=t,E=0,T=d+b*u}else{let b=(_-n-r)/n,R=b*Math.PI/2;y=h+t*Math.sin(R),S=t*Math.cos(R),E=t*Math.sin(R),T=d+u+b*d}let w=Math.max(0,Math.min(1,T/f)),x=0;_===0?x=.5/s:_===m&&(x=-.5/s);for(let b=0;b<=s;b++){let R=b/s,L=R*Math.PI*2,F=Math.sin(L),N=Math.cos(L);p.x=-S*N,p.y=y,p.z=S*F,a.push(p.x,p.y,p.z),g.set(-S*N,E,S*F),g.normalize(),l.push(g.x,g.y,g.z),c.push(R+x,w)}if(_>0){let b=(_-1)*v;for(let R=0;R<s;R++){let L=b+R,F=b+R+1,N=_*v+R,U=_*v+R+1;o.push(L,F,N),o.push(F,U,N)}}}this.setIndex(o),this.setAttribute("position",new ae(a,3)),this.setAttribute("normal",new ae(l,3)),this.setAttribute("uv",new ae(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var An=class i extends we{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],m=0,v=[],g=n/2,p=0;_(),o===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ae(d,3)),this.setAttribute("normal",new ae(u,3)),this.setAttribute("uv",new ae(f,2));function _(){let y=new P,S=new P,E=0,w=(e-t)/n;for(let x=0;x<=r;x++){let b=[],R=x/r,L=R*(e-t)+t;for(let F=0;F<=s;F++){let N=F/s,U=N*l+a,O=Math.sin(U),Y=Math.cos(U);S.x=L*O,S.y=-R*n+g,S.z=L*Y,d.push(S.x,S.y,S.z),y.set(O,w,Y).normalize(),u.push(y.x,y.y,y.z),f.push(N,1-R),b.push(m++)}v.push(b)}for(let x=0;x<s;x++)for(let b=0;b<r;b++){let R=v[b][x],L=v[b+1][x],F=v[b+1][x+1],N=v[b][x+1];(t>0||b!==0)&&(h.push(R,L,N),E+=3),(e>0||b!==r-1)&&(h.push(L,F,N),E+=3)}c.addGroup(p,E,0),p+=E}function T(y){let S=m,E=new ft,w=new P,x=0,b=y===!0?t:e,R=y===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,g*R,0),u.push(0,R,0),f.push(.5,.5),m++;let L=m;for(let F=0;F<=s;F++){let U=F/s*l+a,O=Math.cos(U),Y=Math.sin(U);w.x=b*Y,w.y=g*R,w.z=b*O,d.push(w.x,w.y,w.z),u.push(0,R,0),E.x=O*.5+.5,E.y=Y*.5*R+.5,f.push(E.x,E.y),m++}for(let F=0;F<s;F++){let N=S+F,U=L+F;y===!0?h.push(U,U+1,N):h.push(U+1,U,N),x+=3}c.addGroup(p,x,y===!0?1:2),p+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Zt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ft:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new P,s=[],r=[],o=[],a=new P,l=new jt;for(let f=0;f<=t;f++){let m=f/t;s[f]=this.getTangentAt(m,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(te(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(te(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Or=class extends Vn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ft){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Il=class extends Or{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ru(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var jd=new P,Qd=new P,$h=new Ru,Yh=new Ru,Zh=new Ru,Br=class extends Vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Qd.subVectors(s[0],s[1]).add(s[0]),c=Qd);let d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(jd.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=jd),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),$h.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,m,v,g),Yh.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,m,v,g),Zh.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&($h.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Yh.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Zh.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set($h.calc(l),Yh.calc(l),Zh.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function tf(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function S0(i,t){let e=1-i;return e*e*t}function b0(i,t){return 2*(1-i)*i*t}function w0(i,t){return i*i*t}function wo(i,t,e,n){return S0(i,t)+b0(i,e)+w0(i,n)}function E0(i,t){let e=1-i;return e*e*e*t}function T0(i,t){let e=1-i;return 3*e*e*i*t}function A0(i,t){return 3*(1-i)*i*i*t}function R0(i,t){return i*i*i*t}function Eo(i,t,e,n,s){return E0(i,t)+T0(i,e)+A0(i,n)+R0(i,s)}var zo=class extends Vn{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Eo(t,s.x,r.x,o.x,a.x),Eo(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ll=class extends Vn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Eo(t,s.x,r.x,o.x,a.x),Eo(t,s.y,r.y,o.y,a.y),Eo(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ko=class extends Vn{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Dl=class extends Vn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Vo=class extends Vn{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(wo(t,s.x,r.x,o.x),wo(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ul=class extends Vn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(wo(t,s.x,r.x,o.x),wo(t,s.y,r.y,o.y),wo(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ho=class extends Vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(tf(a,l.x,c.x,h.x,d.x),tf(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ft().fromArray(s))}return this}},iu=Object.freeze({__proto__:null,ArcCurve:Il,CatmullRomCurve3:Br,CubicBezierCurve:zo,CubicBezierCurve3:Ll,EllipseCurve:Or,LineCurve:ko,LineCurve3:Dl,QuadraticBezierCurve:Vo,QuadraticBezierCurve3:Ul,SplineCurve:Ho}),Nl=class extends Vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new iu[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new iu[s.type]().fromJSON(s))}return this}},Ys=class extends Nl{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new ko(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Vo(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new zo(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ho(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new Or(t,e,n,s,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},xs=class extends Ys{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Ys().fromJSON(s))}return this}};function C0(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=$f(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=U0(i,t,r,e)),i.length>80*e){a=i[0],l=i[1];let h=a,d=l;for(let u=e;u<s;u+=e){let f=i[u],m=i[u+1];f<a&&(a=f),m<l&&(l=m),f>h&&(h=f),m>d&&(d=m)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Go(r,o,e,a,l,c,0),o}function $f(i,t,e,n,s){let r;if(s===X0(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=ef(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=ef(o/n|0,i[o],i[o+1],r);return r&&zr(r,r.next)&&(Xo(r),r=r.next),r}function Zs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(zr(e,e.next)||Ne(e.prev,e,e.next)===0)){if(Xo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Go(i,t,e,n,s,r,o){if(!i)return;!o&&r&&z0(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?I0(i,n,s,r):P0(i)){t.push(l.i,i.i,c.i),Xo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=L0(Zs(i),t),Go(i,t,e,n,s,r,2)):o===2&&D0(i,t,e,n,s,r):Go(Zs(i),t,e,n,s,r,1);break}}}function P0(i){let t=i.prev,e=i,n=i.next;if(Ne(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),u=Math.max(s,r,o),f=Math.max(a,l,c),m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=f&&Mo(s,a,r,l,o,c,m.x,m.y)&&Ne(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function I0(i,t,e,n){let s=i.prev,r=i,o=i.next;if(Ne(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=Math.min(a,l,c),m=Math.min(h,d,u),v=Math.max(a,l,c),g=Math.max(h,d,u),p=su(f,m,t,e,n),_=su(v,g,t,e,n),T=i.prevZ,y=i.nextZ;for(;T&&T.z>=p&&y&&y.z<=_;){if(T.x>=f&&T.x<=v&&T.y>=m&&T.y<=g&&T!==s&&T!==o&&Mo(a,h,l,d,c,u,T.x,T.y)&&Ne(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Mo(a,h,l,d,c,u,y.x,y.y)&&Ne(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=p;){if(T.x>=f&&T.x<=v&&T.y>=m&&T.y<=g&&T!==s&&T!==o&&Mo(a,h,l,d,c,u,T.x,T.y)&&Ne(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Mo(a,h,l,d,c,u,y.x,y.y)&&Ne(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function L0(i,t){let e=i;do{let n=e.prev,s=e.next.next;!zr(n,s)&&Zf(n,e,e.next,s)&&Wo(n,s)&&Wo(s,n)&&(t.push(n.i,e.i,s.i),Xo(e),Xo(e.next),e=i=s),e=e.next}while(e!==i);return Zs(e)}function D0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&H0(o,a)){let l=Jf(o,a);o=Zs(o,o.next),l=Zs(l,l.next),Go(o,t,e,n,s,r,0),Go(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function U0(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=$f(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(V0(c))}s.sort(N0);for(let r=0;r<s.length;r++)e=F0(s[r],e);return e}function N0(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function F0(i,t){let e=O0(i,t);if(!e)return t;let n=Jf(e,i);return Zs(n,n.next),Zs(e,e.next)}function O0(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(zr(i,e))return e;do{if(zr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Yf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);Wo(e,i)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&B0(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function B0(i,t){return Ne(i.prev,i,t.prev)<0&&Ne(t.next,i,i.next)<0}function z0(i,t,e,n){let s=i;do s.z===0&&(s.z=su(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,k0(s)}function k0(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function su(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function V0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Yf(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Mo(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&Yf(i,t,e,n,s,r,o,a)}function H0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!G0(i,t)&&(Wo(i,t)&&Wo(t,i)&&W0(i,t)&&(Ne(i.prev,i,t.prev)||Ne(i,t.prev,t))||zr(i,t)&&Ne(i.prev,i,i.next)>0&&Ne(t.prev,t,t.next)>0)}function Ne(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function zr(i,t){return i.x===t.x&&i.y===t.y}function Zf(i,t,e,n){let s=ul(Ne(i,t,e)),r=ul(Ne(i,t,n)),o=ul(Ne(e,n,i)),a=ul(Ne(e,n,t));return!!(s!==r&&o!==a||s===0&&hl(i,e,t)||r===0&&hl(i,n,t)||o===0&&hl(e,i,n)||a===0&&hl(e,t,n))}function hl(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ul(i){return i>0?1:i<0?-1:0}function G0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Zf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Wo(i,t){return Ne(i.prev,i,i.next)<0?Ne(i,t,i.next)>=0&&Ne(i,i.prev,t)>=0:Ne(i,t,i.prev)<0||Ne(i,i.next,t)<0}function W0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Jf(i,t){let e=ru(i.i,i.x,i.y),n=ru(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ef(i,t,e,n){let s=ru(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ru(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function X0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var ou=class{static triangulate(t,e,n=2){return C0(t,e,n)}},Xs=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];nf(t),sf(n,t);let o=t.length;e.forEach(nf);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,sf(n,e[l]);let a=ou.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function nf(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function sf(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Zi=class i extends we{constructor(t=new xs([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new ae(s,3)),this.setAttribute("uv",new ae(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:q0,T,y=!1,S,E,w,x;if(p){T=p.getSpacedPoints(h),y=!0,u=!1;let Z=p.isCatmullRomCurve3?p.closed:!1;S=p.computeFrenetFrames(h,Z),E=new P,w=new P,x=new P}u||(g=0,f=0,m=0,v=0);let b=a.extractPoints(c),R=b.shape,L=b.holes;if(!Xs.isClockWise(R)){R=R.reverse();for(let Z=0,et=L.length;Z<et;Z++){let st=L[Z];Xs.isClockWise(st)&&(L[Z]=st.reverse())}}function N(Z){let st=10000000000000001e-36,ct=Z[0];for(let pt=1;pt<=Z.length;pt++){let Lt=pt%Z.length,It=Z[Lt],Wt=It.x-ct.x,Xt=It.y-ct.y,B=Wt*Wt+Xt*Xt,he=Math.max(Math.abs(It.x),Math.abs(It.y),Math.abs(ct.x),Math.abs(ct.y)),ne=st*he*he;if(B<=ne){Z.splice(Lt,1),pt--;continue}ct=It}}N(R),L.forEach(N);let U=L.length,O=R;for(let Z=0;Z<U;Z++){let et=L[Z];R=R.concat(et)}function Y(Z,et,st){return et||Jt("ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(et,st)}let X=R.length;function ot(Z,et,st){let ct,pt,Lt,It=Z.x-et.x,Wt=Z.y-et.y,Xt=st.x-Z.x,B=st.y-Z.y,he=It*It+Wt*Wt,ne=It*B-Wt*Xt;if(Math.abs(ne)>Number.EPSILON){let C=Math.sqrt(he),M=Math.sqrt(Xt*Xt+B*B),q=et.x-Wt/C,J=et.y+It/C,it=st.x-B/M,mt=st.y+Xt/M,_t=((it-q)*B-(mt-J)*Xt)/(It*B-Wt*Xt);ct=q+It*_t-Z.x,pt=J+Wt*_t-Z.y;let rt=ct*ct+pt*pt;if(rt<=2)return new ft(ct,pt);Lt=Math.sqrt(rt/2)}else{let C=!1;It>Number.EPSILON?Xt>Number.EPSILON&&(C=!0):It<-Number.EPSILON?Xt<-Number.EPSILON&&(C=!0):Math.sign(Wt)===Math.sign(B)&&(C=!0),C?(ct=-Wt,pt=It,Lt=Math.sqrt(he)):(ct=It,pt=Wt,Lt=Math.sqrt(he/2))}return new ft(ct/Lt,pt/Lt)}let H=[];for(let Z=0,et=O.length,st=et-1,ct=Z+1;Z<et;Z++,st++,ct++)st===et&&(st=0),ct===et&&(ct=0),H[Z]=ot(O[Z],O[st],O[ct]);let Q=[],tt,gt=H.concat();for(let Z=0,et=U;Z<et;Z++){let st=L[Z];tt=[];for(let ct=0,pt=st.length,Lt=pt-1,It=ct+1;ct<pt;ct++,Lt++,It++)Lt===pt&&(Lt=0),It===pt&&(It=0),tt[ct]=ot(st[ct],st[Lt],st[It]);Q.push(tt),gt=gt.concat(tt)}let xt;if(g===0)xt=Xs.triangulateShape(O,L);else{let Z=[],et=[];for(let st=0;st<g;st++){let ct=st/g,pt=f*Math.cos(ct*Math.PI/2),Lt=m*Math.sin(ct*Math.PI/2)+v;for(let It=0,Wt=O.length;It<Wt;It++){let Xt=Y(O[It],H[It],Lt);k(Xt.x,Xt.y,-pt),ct===0&&Z.push(Xt)}for(let It=0,Wt=U;It<Wt;It++){let Xt=L[It];tt=Q[It];let B=[];for(let he=0,ne=Xt.length;he<ne;he++){let C=Y(Xt[he],tt[he],Lt);k(C.x,C.y,-pt),ct===0&&B.push(C)}ct===0&&et.push(B)}}xt=Xs.triangulateShape(Z,et)}let $t=xt.length,Gt=m+v;for(let Z=0;Z<X;Z++){let et=u?Y(R[Z],gt[Z],Gt):R[Z];y?(w.copy(S.normals[0]).multiplyScalar(et.x),E.copy(S.binormals[0]).multiplyScalar(et.y),x.copy(T[0]).add(w).add(E),k(x.x,x.y,x.z)):k(et.x,et.y,0)}for(let Z=1;Z<=h;Z++)for(let et=0;et<X;et++){let st=u?Y(R[et],gt[et],Gt):R[et];y?(w.copy(S.normals[Z]).multiplyScalar(st.x),E.copy(S.binormals[Z]).multiplyScalar(st.y),x.copy(T[Z]).add(w).add(E),k(x.x,x.y,x.z)):k(st.x,st.y,d/h*Z)}for(let Z=g-1;Z>=0;Z--){let et=Z/g,st=f*Math.cos(et*Math.PI/2),ct=m*Math.sin(et*Math.PI/2)+v;for(let pt=0,Lt=O.length;pt<Lt;pt++){let It=Y(O[pt],H[pt],ct);k(It.x,It.y,d+st)}for(let pt=0,Lt=L.length;pt<Lt;pt++){let It=L[pt];tt=Q[pt];for(let Wt=0,Xt=It.length;Wt<Xt;Wt++){let B=Y(It[Wt],tt[Wt],ct);y?k(B.x,B.y+T[h-1].y,T[h-1].x+st):k(B.x,B.y,d+st)}}}G(),I();function G(){let Z=s.length/3;if(u){let et=0,st=X*et;for(let ct=0;ct<$t;ct++){let pt=xt[ct];W(pt[2]+st,pt[1]+st,pt[0]+st)}et=h+g*2,st=X*et;for(let ct=0;ct<$t;ct++){let pt=xt[ct];W(pt[0]+st,pt[1]+st,pt[2]+st)}}else{for(let et=0;et<$t;et++){let st=xt[et];W(st[2],st[1],st[0])}for(let et=0;et<$t;et++){let st=xt[et];W(st[0]+X*h,st[1]+X*h,st[2]+X*h)}}n.addGroup(Z,s.length/3-Z,0)}function I(){let Z=s.length/3,et=0;D(O,et),et+=O.length;for(let st=0,ct=L.length;st<ct;st++){let pt=L[st];D(pt,et),et+=pt.length}n.addGroup(Z,s.length/3-Z,1)}function D(Z,et){let st=Z.length;for(;--st>=0;){let ct=st,pt=st-1;pt<0&&(pt=Z.length-1);for(let Lt=0,It=h+g*2;Lt<It;Lt++){let Wt=X*Lt,Xt=X*(Lt+1),B=et+ct+Wt,he=et+pt+Wt,ne=et+pt+Xt,C=et+ct+Xt;$(B,he,ne,C)}}}function k(Z,et,st){l.push(Z),l.push(et),l.push(st)}function W(Z,et,st){ut(Z),ut(et),ut(st);let ct=s.length/3,pt=_.generateTopUV(n,s,ct-3,ct-2,ct-1);ht(pt[0]),ht(pt[1]),ht(pt[2])}function $(Z,et,st,ct){ut(Z),ut(et),ut(ct),ut(et),ut(st),ut(ct);let pt=s.length/3,Lt=_.generateSideWallUV(n,s,pt-6,pt-3,pt-2,pt-1);ht(Lt[0]),ht(Lt[1]),ht(Lt[3]),ht(Lt[1]),ht(Lt[2]),ht(Lt[3])}function ut(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function ht(Z){r.push(Z.x),r.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return $0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new iu[s.type]().fromJSON(s)),new i(n,t.options)}},q0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ft(r,o),new ft(a,l),new ft(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ft(o,1-l),new ft(c,1-d),new ft(u,1-m),new ft(v,1-p)]:[new ft(a,1-l),new ft(h,1-d),new ft(f,1-m),new ft(g,1-p)]}};function $0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var kr=class i extends we{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=te(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,d=new P,u=new ft,f=new P,m=new P,v=new P,g=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(m)}for(let _=0;_<=e;_++){let T=n+_*h*s,y=Math.sin(T),S=Math.cos(T);for(let E=0;E<=t.length-1;E++){d.x=t[E].x*y,d.y=t[E].y,d.z=t[E].x*S,o.push(d.x,d.y,d.z),u.x=_/e,u.y=E/(t.length-1),a.push(u.x,u.y);let w=l[3*E+0]*y,x=l[3*E+1],b=l[3*E+0]*S;c.push(w,x,b)}}for(let _=0;_<e;_++)for(let T=0;T<t.length-1;T++){let y=T+_*t.length,S=y,E=y+t.length,w=y+t.length+1,x=y+1;r.push(S,E,x),r.push(w,x,E)}this.setIndex(r),this.setAttribute("position",new ae(o,3)),this.setAttribute("uv",new ae(a,2)),this.setAttribute("normal",new ae(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var _n=class i extends we{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let _=p*u-o;for(let T=0;T<c;T++){let y=T*d-r;m.push(y,-_,0),v.push(0,0,1),g.push(T/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){let T=_+c*p,y=_+c*(p+1),S=_+1+c*(p+1),E=_+1+c*p;f.push(T,y,E),f.push(y,S,E)}this.setIndex(f),this.setAttribute("position",new ae(m,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var qe=class i extends we{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new P,u=new P,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let _=[],T=p/n,y=o+T*a,S=t*Math.cos(y),E=Math.sqrt(t*t-S*S),w=0;p===0&&o===0?w=.5/e:p===n&&l===Math.PI&&(w=-.5/e);for(let x=0;x<=e;x++){let b=x/e,R=s+b*r;d.x=-E*Math.cos(R),d.y=S,d.z=E*Math.sin(R),m.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),g.push(b+w,1-T),_.push(c++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){let T=h[p][_+1],y=h[p][_],S=h[p+1][_],E=h[p+1][_+1];(p!==0||o>0)&&f.push(T,y,E),(p!==n-1||l<Math.PI)&&f.push(y,S,E)}this.setIndex(f),this.setAttribute("position",new ae(m,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var qo=class extends we{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,s=new P,r=new P;if(t.index!==null){let o=t.attributes.position,a=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],u=d.start,f=d.count;for(let m=u,v=u+f;m<v;m+=3)for(let g=0;g<3;g++){let p=a.getX(m+g),_=a.getX(m+(g+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,_),rf(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),rf(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new ae(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function rf(i,t,e){let n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}function nr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(of(s))s.isRenderTargetTexture?(Zt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(of(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function yn(i){let t={};for(let e=0;e<i.length;e++){let n=nr(i[e]);for(let s in n)t[s]=n[s]}return t}function of(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Y0(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Cu(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}var Rn={clone:nr,merge:yn},Z0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,J0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,De=class extends Ui{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Z0,this.fragmentShader=J0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=nr(t.uniforms),this.uniformsGroups=Y0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Yt().setHex(s.value);break;case"v2":this.uniforms[n].value=new ft().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new xe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ee().fromArray(s.value);break;case"m4":this.uniforms[n].value=new jt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Vr=class extends De{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},on=class extends Ui{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},_s=class extends on{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ft(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return te(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Yt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Yt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Yt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var $o=class extends Ui{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},Yo=class extends Ui{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=jl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Fl=class extends Ui{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Df,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ol=class extends Ui{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function br(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Jh(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var vs=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Bl=class extends vs{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:tu,endingEnd:tu}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case eu:r=t,a=2*e-n;break;case nu:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case eu:o=t,l=2*n-e;break;case nu:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-e)/(s-e),v=m*m,g=v*m,p=-u*g+2*u*v-u*m,_=(1+u)*g+(-1.5-2*u)*v+(-.5+u)*m+1,T=(-1-f)*g+(1.5+f)*v+.5*m,y=f*g-f*v;for(let S=0;S!==a;++S)r[S]=p*o[h+S]+_*o[c+S]+T*o[l+S]+y*o[d+S];return r}},zl=class extends vs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},kl=class extends vs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Vl=class extends vs{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let m=(n-e)/(s-e),v=1-m;for(let g=0;g!==a;++g)r[g]=o[c+g]*v+o[l+g]*m;return r}let u=a*2,f=t-1;for(let m=0;m!==a;++m){let v=o[c+m],g=o[l+m],p=f*u+m*2,_=d[p],T=d[p+1],y=t*u+m*2,S=h[y],E=h[y+1],w=j0(n,e,_,S,s);r[m]=Kf(w,v,T,E,g)}return r}};function Kf(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function K0(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function j0(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=Kf(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=K0(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Hn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=br(e,this.TimeBufferType),this.values=br(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:br(t.times,Array),values:br(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Jh(t.settings)&&(n.settings={inTangents:br(t.settings.inTangents,Array),outTangents:br(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new kl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new zl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Bl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Vl(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case To:e=this.InterpolantFactoryMethodDiscrete;break;case El:e=this.InterpolantFactoryMethodLinear;break;case ml:e=this.InterpolantFactoryMethodSmooth;break;case Qh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Zt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return To;case this.InterpolantFactoryMethodLinear:return El;case this.InterpolantFactoryMethodSmooth:return ml;case this.InterpolantFactoryMethodBezier:return Qh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Jh(this.settings)&&(af(this.settings.inTangents,t),af(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Jt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Jt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Jt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Jt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&km(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Jt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ml,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){let v=e[d+m];if(v!==e[u+m]||v!==e[f+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Jh(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function af(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Hn.prototype.ValueTypeName="";Hn.prototype.TimeBufferType=Float32Array;Hn.prototype.ValueBufferType=Float32Array;Hn.prototype.DefaultInterpolation=El;var ys=class extends Hn{constructor(t,e,n){super(t,e,n)}};ys.prototype.ValueTypeName="bool";ys.prototype.ValueBufferType=Array;ys.prototype.DefaultInterpolation=To;ys.prototype.InterpolantFactoryMethodLinear=void 0;ys.prototype.InterpolantFactoryMethodSmooth=void 0;var Hl=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};Hl.prototype.ValueTypeName="color";var Gl=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};Gl.prototype.ValueTypeName="number";var Wl=class extends vs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Ve.slerpFlat(r,0,o,c-a,o,c,l);return r}},Zo=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Wl(this.times,this.values,this.getValueSize(),t)}};Zo.prototype.ValueTypeName="quaternion";Zo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ms=class extends Hn{constructor(t,e,n){super(t,e,n)}};Ms.prototype.ValueTypeName="string";Ms.prototype.ValueBufferType=Array;Ms.prototype.DefaultInterpolation=To;Ms.prototype.InterpolantFactoryMethodLinear=void 0;Ms.prototype.InterpolantFactoryMethodSmooth=void 0;var Xl=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};Xl.prototype.ValueTypeName="vector";var ql=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},jf=new ql,$l=class{constructor(t){this.manager=t!==void 0?t:jf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};$l.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hr=class extends rn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Js=class extends Hr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Kh=new jt,lf=new P,cf=new P,Jo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fr,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;lf.setFromMatrixPosition(t.matrixWorld),e.position.copy(lf),cf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(cf),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Kh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Kh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Pr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Kh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},dl=new P,fl=new Ve,Ri=new P,Ko=class extends rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(dl,fl,Ri),Ri.x===1&&Ri.y===1&&Ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dl,fl,Ri.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(dl,fl,Ri),Ri.x===1&&Ri.y===1&&Ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dl,fl,Ri.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},fs=new P,hf=new ft,uf=new ft,ke=class extends Ko{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(So*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Lr*2*Math.atan(Math.tan(So*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){fs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(fs.x,fs.y).multiplyScalar(-t/fs.z),fs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fs.x,fs.y).multiplyScalar(-t/fs.z)}getViewSize(t,e){return this.getViewBounds(t,hf,uf),e.subVectors(uf,hf)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(So*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var au=class extends Jo{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0}},jo=class extends Hr{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new au}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Ss=class extends Ko{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},lu=class extends Jo{constructor(){super(new Ss(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ks=class extends Hr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.target=new rn,this.shadow=new lu}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Qo=class extends we{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var wr=-90,Er=1,Yl=class extends rn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ke(wr,Er,t,e);s.layers=this.layers,this.add(s);let r=new ke(wr,Er,t,e);r.layers=this.layers,this.add(r);let o=new ke(wr,Er,t,e);o.layers=this.layers,this.add(o);let a=new ke(wr,Er,t,e);a.layers=this.layers,this.add(a);let l=new ke(wr,Er,t,e);l.layers=this.layers,this.add(l);let c=new ke(wr,Er,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===pi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Zl=class extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},ta=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Q0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Q0(){this._document.hidden===!1&&this.reset()}var Pu="\\[\\]\\.:\\/",tg=new RegExp("["+Pu+"]","g"),Iu="[^"+Pu+"]",eg="[^"+Pu.replace("\\.","")+"]",ng=/((?:WC+[\/:])*)/.source.replace("WC",Iu),ig=/(WCOD+)?/.source.replace("WCOD",eg),sg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Iu),rg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Iu),og=new RegExp("^"+ng+ig+sg+rg+"$"),ag=["material","materials","bones","map"],cu=class{constructor(t,e,n){let s=n||Ie.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ie=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(tg,"")}static parseTrackName(t){let e=og.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);ag.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Zt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Jt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Jt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Jt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Jt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Jt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Jt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ie.Composite=cu;Ie.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ie.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ie.prototype.GetterByBindingType=[Ie.prototype._getValue_direct,Ie.prototype._getValue_array,Ie.prototype._getValue_arrayElement,Ie.prototype._getValue_toArray];Ie.prototype.SetterByBindingTypeAndVersioning=[[Ie.prototype._setValue_direct,Ie.prototype._setValue_direct_setNeedsUpdate,Ie.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_array,Ie.prototype._setValue_array_setNeedsUpdate,Ie.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_arrayElement,Ie.prototype._setValue_arrayElement_setNeedsUpdate,Ie.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_fromArray,Ie.prototype._setValue_fromArray_setNeedsUpdate,Ie.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dM=new Float32Array(1);var bs=class extends Fo{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var hu=class i{static{i.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};var df=new P,pl=new P,Tr=new P,Ar=new P,jh=new P,lg=new P,cg=new P,ea=class{constructor(t=new P,e=new P){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){df.subVectors(t,this.start),pl.subVectors(this.end,this.start);let n=pl.dot(pl);if(n===0)return 0;let r=pl.dot(df)/n;return e&&(r=te(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=lg,n=cg){let s=10000000000000001e-32,r,o,a=this.start,l=t.start,c=this.end,h=t.end;Tr.subVectors(c,a),Ar.subVectors(h,l),jh.subVectors(a,l);let d=Tr.dot(Tr),u=Ar.dot(Ar),f=Ar.dot(jh);if(d<=s&&u<=s)return e.copy(a),n.copy(l),e.sub(n),e.dot(e);if(d<=s)r=0,o=f/u,o=te(o,0,1);else{let m=Tr.dot(jh);if(u<=s)o=0,r=te(-m/d,0,1);else{let v=Tr.dot(Ar),g=d*u-v*v;g!==0?r=te((v*f-m*u)/g,0,1):r=0,o=(v*r+f)/u,o<0?(o=0,r=te(-m/d,0,1)):o>1&&(o=1,r=te((v-m)/d,0,1))}}return e.copy(a).addScaledVector(Tr,r),n.copy(l).addScaledVector(Ar,o),e.distanceToSquared(n)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function Lu(i,t,e,n){let s=hg(n);switch(e){case Su:return i*t;case rc:return i*t/s.components*s.byteLength;case oc:return i*t/s.components*s.byteLength;case Rs:return i*t*2/s.components*s.byteLength;case ac:return i*t*2/s.components*s.byteLength;case bu:return i*t*3/s.components*s.byteLength;case Ln:return i*t*4/s.components*s.byteLength;case lc:return i*t*4/s.components*s.byteLength;case ua:case da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fa:case pa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case hc:case dc:return Math.max(i,16)*Math.max(t,8)/4;case cc:case uc:return Math.max(i,8)*Math.max(t,8)/2;case fc:case pc:case gc:case xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mc:case ma:case _c:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case yc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Mc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Sc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case bc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case wc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ec:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Tc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ac:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Rc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Cc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Pc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ic:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Lc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Dc:case Uc:case Nc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Fc:case Oc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ga:case Bc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function hg(i){switch(i){case vn:case _u:return{byteLength:1,components:1};case Xr:case vu:case an:return{byteLength:2,components:1};case ic:case sc:return{byteLength:2,components:4};case xi:case nc:case ti:return{byteLength:4,components:1};case yu:case Mu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jl}}));typeof window<"u"&&(window.__THREE__?Zt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jl);function yp(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function gg(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){let m=d[u],v=d[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){let v=d[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var xg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_g=`#ifdef USE_ALPHAHASH
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
#endif`,vg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bg=`#ifdef USE_AOMAP
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
#endif`,wg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Eg=`#ifdef USE_BATCHING
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
#endif`,Tg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ag=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pg=`#ifdef USE_IRIDESCENCE
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
#endif`,Ig=`#ifdef USE_BUMPMAP
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
#endif`,Lg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Dg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ug=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ng=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Bg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,kg=`#define PI 3.141592653589793
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
} // validated`,Vg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hg=`vec3 transformedNormal = objectNormal;
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
#endif`,Gg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$g="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zg=`#ifdef USE_ENVMAP
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
#endif`,Jg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Kg=`#ifdef USE_ENVMAP
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
#endif`,jg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qg=`#ifdef USE_ENVMAP
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
#endif`,tx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ex=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ix=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sx=`#ifdef USE_GRADIENTMAP
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
}`,rx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ox=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ax=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lx=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,cx=`#ifdef USE_ENVMAP
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
#endif`,hx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ux=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,px=`PhysicalMaterial material;
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
#endif`,mx=`uniform sampler2D dfgLUT;
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
}`,gx=`
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
#endif`,xx=`#if defined( RE_IndirectDiffuse )
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
#endif`,_x=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vx=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,yx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ex=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ax=`#if defined( USE_POINTS_UV )
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
#endif`,Rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Px=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ix=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dx=`#ifdef USE_MORPHTARGETS
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
#endif`,Ux=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Fx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ox=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,kx=`#ifdef USE_NORMALMAP
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
#endif`,Vx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$x=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,t_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,e_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,n_=`float getShadowMask() {
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
}`,i_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,s_=`#ifdef USE_SKINNING
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
#endif`,r_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,o_=`#ifdef USE_SKINNING
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
#endif`,a_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,l_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,c_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,h_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,u_=`#ifdef USE_TRANSMISSION
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
#endif`,d_=`#ifdef USE_TRANSMISSION
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
#endif`,f_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,p_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,x_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,__=`uniform sampler2D t2D;
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
}`,v_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,y_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,M_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b_=`#include <common>
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
}`,w_=`#if DEPTH_PACKING == 3200
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
}`,E_=`#define DISTANCE
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
}`,T_=`#define DISTANCE
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
}`,A_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,R_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C_=`uniform float scale;
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
}`,P_=`uniform vec3 diffuse;
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
}`,I_=`#include <common>
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
}`,L_=`uniform vec3 diffuse;
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
}`,D_=`#define LAMBERT
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
}`,U_=`#define LAMBERT
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
}`,N_=`#define MATCAP
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
}`,F_=`#define MATCAP
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
}`,O_=`#define NORMAL
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
}`,B_=`#define NORMAL
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
}`,z_=`#define PHONG
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
}`,k_=`#define PHONG
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
}`,V_=`#define STANDARD
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
}`,H_=`#define STANDARD
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
}`,G_=`#define TOON
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
}`,W_=`#define TOON
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
}`,X_=`uniform float size;
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
}`,q_=`uniform vec3 diffuse;
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
}`,$_=`#include <common>
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
}`,Y_=`uniform vec3 color;
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
}`,Z_=`uniform float rotation;
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
}`,J_=`uniform vec3 diffuse;
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
}`,se={alphahash_fragment:xg,alphahash_pars_fragment:_g,alphamap_fragment:vg,alphamap_pars_fragment:yg,alphatest_fragment:Mg,alphatest_pars_fragment:Sg,aomap_fragment:bg,aomap_pars_fragment:wg,batching_pars_vertex:Eg,batching_vertex:Tg,begin_vertex:Ag,beginnormal_vertex:Rg,bsdfs:Cg,iridescence_fragment:Pg,bumpmap_pars_fragment:Ig,clipping_planes_fragment:Lg,clipping_planes_pars_fragment:Dg,clipping_planes_pars_vertex:Ug,clipping_planes_vertex:Ng,color_fragment:Fg,color_pars_fragment:Og,color_pars_vertex:Bg,color_vertex:zg,common:kg,cube_uv_reflection_fragment:Vg,defaultnormal_vertex:Hg,displacementmap_pars_vertex:Gg,displacementmap_vertex:Wg,emissivemap_fragment:Xg,emissivemap_pars_fragment:qg,colorspace_fragment:$g,colorspace_pars_fragment:Yg,envmap_fragment:Zg,envmap_common_pars_fragment:Jg,envmap_pars_fragment:Kg,envmap_pars_vertex:jg,envmap_physical_pars_fragment:cx,envmap_vertex:Qg,fog_vertex:tx,fog_pars_vertex:ex,fog_fragment:nx,fog_pars_fragment:ix,gradientmap_pars_fragment:sx,lightmap_pars_fragment:rx,lights_lambert_fragment:ox,lights_lambert_pars_fragment:ax,lights_pars_begin:lx,lights_toon_fragment:hx,lights_toon_pars_fragment:ux,lights_phong_fragment:dx,lights_phong_pars_fragment:fx,lights_physical_fragment:px,lights_physical_pars_fragment:mx,lights_fragment_begin:gx,lights_fragment_maps:xx,lights_fragment_end:_x,lightprobes_pars_fragment:vx,logdepthbuf_fragment:yx,logdepthbuf_pars_fragment:Mx,logdepthbuf_pars_vertex:Sx,logdepthbuf_vertex:bx,map_fragment:wx,map_pars_fragment:Ex,map_particle_fragment:Tx,map_particle_pars_fragment:Ax,metalnessmap_fragment:Rx,metalnessmap_pars_fragment:Cx,morphinstance_vertex:Px,morphcolor_vertex:Ix,morphnormal_vertex:Lx,morphtarget_pars_vertex:Dx,morphtarget_vertex:Ux,normal_fragment_begin:Nx,normal_fragment_maps:Fx,normal_pars_fragment:Ox,normal_pars_vertex:Bx,normal_vertex:zx,normalmap_pars_fragment:kx,clearcoat_normal_fragment_begin:Vx,clearcoat_normal_fragment_maps:Hx,clearcoat_pars_fragment:Gx,iridescence_pars_fragment:Wx,opaque_fragment:Xx,packing:qx,premultiplied_alpha_fragment:$x,project_vertex:Yx,dithering_fragment:Zx,dithering_pars_fragment:Jx,roughnessmap_fragment:Kx,roughnessmap_pars_fragment:jx,shadowmap_pars_fragment:Qx,shadowmap_pars_vertex:t_,shadowmap_vertex:e_,shadowmask_pars_fragment:n_,skinbase_vertex:i_,skinning_pars_vertex:s_,skinning_vertex:r_,skinnormal_vertex:o_,specularmap_fragment:a_,specularmap_pars_fragment:l_,tonemapping_fragment:c_,tonemapping_pars_fragment:h_,transmission_fragment:u_,transmission_pars_fragment:d_,uv_pars_fragment:f_,uv_pars_vertex:p_,uv_vertex:m_,worldpos_vertex:g_,background_vert:x_,background_frag:__,backgroundCube_vert:v_,backgroundCube_frag:y_,cube_vert:M_,cube_frag:S_,depth_vert:b_,depth_frag:w_,distance_vert:E_,distance_frag:T_,equirect_vert:A_,equirect_frag:R_,linedashed_vert:C_,linedashed_frag:P_,meshbasic_vert:I_,meshbasic_frag:L_,meshlambert_vert:D_,meshlambert_frag:U_,meshmatcap_vert:N_,meshmatcap_frag:F_,meshnormal_vert:O_,meshnormal_frag:B_,meshphong_vert:z_,meshphong_frag:k_,meshphysical_vert:V_,meshphysical_frag:H_,meshtoon_vert:G_,meshtoon_frag:W_,points_vert:X_,points_frag:q_,shadow_vert:$_,shadow_frag:Y_,sprite_vert:Z_,sprite_frag:J_},St={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},Cn={basic:{uniforms:yn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:se.meshbasic_vert,fragmentShader:se.meshbasic_frag},lambert:{uniforms:yn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Yt(0)},envMapIntensity:{value:1}}]),vertexShader:se.meshlambert_vert,fragmentShader:se.meshlambert_frag},phong:{uniforms:yn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:se.meshphong_vert,fragmentShader:se.meshphong_frag},standard:{uniforms:yn([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag},toon:{uniforms:yn([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Yt(0)}}]),vertexShader:se.meshtoon_vert,fragmentShader:se.meshtoon_frag},matcap:{uniforms:yn([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:se.meshmatcap_vert,fragmentShader:se.meshmatcap_frag},points:{uniforms:yn([St.points,St.fog]),vertexShader:se.points_vert,fragmentShader:se.points_frag},dashed:{uniforms:yn([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:se.linedashed_vert,fragmentShader:se.linedashed_frag},depth:{uniforms:yn([St.common,St.displacementmap]),vertexShader:se.depth_vert,fragmentShader:se.depth_frag},normal:{uniforms:yn([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:se.meshnormal_vert,fragmentShader:se.meshnormal_frag},sprite:{uniforms:yn([St.sprite,St.fog]),vertexShader:se.sprite_vert,fragmentShader:se.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:se.background_vert,fragmentShader:se.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:se.backgroundCube_vert,fragmentShader:se.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:se.cube_vert,fragmentShader:se.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:se.equirect_vert,fragmentShader:se.equirect_frag},distance:{uniforms:yn([St.common,St.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:se.distance_vert,fragmentShader:se.distance_frag},shadow:{uniforms:yn([St.lights,St.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:se.shadow_vert,fragmentShader:se.shadow_frag}};Cn.physical={uniforms:yn([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag};var Vc={r:0,b:0,g:0},K_=new jt,Mp=new ee;Mp.set(-1,0,0,0,1,0,0,0,1);function j_(i,t,e,n,s,r){let o=new Yt(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function f(_){let T=_.isScene===!0?_.background:null;if(T&&T.isTexture){let y=_.backgroundBlurriness>0;T=t.get(T,y)}return T}function m(_){let T=!1,y=f(_);y===null?g(o,a):y&&y.isColor&&(g(y,1),T=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(_,T){let y=f(T);y&&(y.isCubeTexture||y.mapping===ca)?(c===void 0&&(c=new Qt(new Ke(1,1,1),new De({name:"BackgroundCubeMaterial",uniforms:nr(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,E,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(K_.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Mp),c.material.toneMapped=oe.getTransfer(y.colorSpace)!==fe,(h!==y||d!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Qt(new _n(2,2),new De({name:"BackgroundMaterial",uniforms:nr(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:ws,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=oe.getTransfer(y.colorSpace)!==fe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,T){_.getRGB(Vc,Cu(i)),e.buffers.color.setClear(Vc.r,Vc.g,Vc.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,T=1){o.set(_),a=T,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,g(o,a)},render:m,addToRenderList:v,dispose:p}}function Q_(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(L,F,N,U,O){let Y=!1,X=d(L,U,N,F);r!==X&&(r=X,c(r.object)),Y=f(L,U,N,O),Y&&m(L,U,N,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,y(L,F,N,U),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function h(L){return i.deleteVertexArray(L)}function d(L,F,N,U){let O=U.wireframe===!0,Y=n[F.id];Y===void 0&&(Y={},n[F.id]=Y);let X=L.isInstancedMesh===!0?L.id:0,ot=Y[X];ot===void 0&&(ot={},Y[X]=ot);let H=ot[N.id];H===void 0&&(H={},ot[N.id]=H);let Q=H[O];return Q===void 0&&(Q=u(l()),H[O]=Q),Q}function u(L){let F=[],N=[],U=[];for(let O=0;O<e;O++)F[O]=0,N[O]=0,U[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:N,attributeDivisors:U,object:L,attributes:{},index:null}}function f(L,F,N,U){let O=r.attributes,Y=F.attributes,X=0,ot=N.getAttributes();for(let H in ot)if(ot[H].location>=0){let tt=O[H],gt=Y[H];if(gt===void 0&&(H==="instanceMatrix"&&L.instanceMatrix&&(gt=L.instanceMatrix),H==="instanceColor"&&L.instanceColor&&(gt=L.instanceColor)),tt===void 0||tt.attribute!==gt||gt&&tt.data!==gt.data)return!0;X++}return r.attributesNum!==X||r.index!==U}function m(L,F,N,U){let O={},Y=F.attributes,X=0,ot=N.getAttributes();for(let H in ot)if(ot[H].location>=0){let tt=Y[H];tt===void 0&&(H==="instanceMatrix"&&L.instanceMatrix&&(tt=L.instanceMatrix),H==="instanceColor"&&L.instanceColor&&(tt=L.instanceColor));let gt={};gt.attribute=tt,tt&&tt.data&&(gt.data=tt.data),O[H]=gt,X++}r.attributes=O,r.attributesNum=X,r.index=U}function v(){let L=r.newAttributes;for(let F=0,N=L.length;F<N;F++)L[F]=0}function g(L){p(L,0)}function p(L,F){let N=r.newAttributes,U=r.enabledAttributes,O=r.attributeDivisors;N[L]=1,U[L]===0&&(i.enableVertexAttribArray(L),U[L]=1),O[L]!==F&&(i.vertexAttribDivisor(L,F),O[L]=F)}function _(){let L=r.newAttributes,F=r.enabledAttributes;for(let N=0,U=F.length;N<U;N++)F[N]!==L[N]&&(i.disableVertexAttribArray(N),F[N]=0)}function T(L,F,N,U,O,Y,X){X===!0?i.vertexAttribIPointer(L,F,N,O,Y):i.vertexAttribPointer(L,F,N,U,O,Y)}function y(L,F,N,U){v();let O=U.attributes,Y=N.getAttributes(),X=F.defaultAttributeValues;for(let ot in Y){let H=Y[ot];if(H.location>=0){let Q=O[ot];if(Q===void 0&&(ot==="instanceMatrix"&&L.instanceMatrix&&(Q=L.instanceMatrix),ot==="instanceColor"&&L.instanceColor&&(Q=L.instanceColor)),Q!==void 0){let tt=Q.normalized,gt=Q.itemSize,xt=t.get(Q);if(xt===void 0)continue;let $t=xt.buffer,Gt=xt.type,G=xt.bytesPerElement,I=Gt===i.INT||Gt===i.UNSIGNED_INT||Q.gpuType===nc;if(Q.isInterleavedBufferAttribute){let D=Q.data,k=D.stride,W=Q.offset;if(D.isInstancedInterleavedBuffer){for(let $=0;$<H.locationSize;$++)p(H.location+$,D.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=D.meshPerAttribute*D.count)}else for(let $=0;$<H.locationSize;$++)g(H.location+$);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let $=0;$<H.locationSize;$++)T(H.location+$,gt/H.locationSize,Gt,tt,k*G,(W+gt/H.locationSize*$)*G,I)}else{if(Q.isInstancedBufferAttribute){for(let D=0;D<H.locationSize;D++)p(H.location+D,Q.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let D=0;D<H.locationSize;D++)g(H.location+D);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let D=0;D<H.locationSize;D++)T(H.location+D,gt/H.locationSize,Gt,tt,gt*G,gt/H.locationSize*D*G,I)}}else if(X!==void 0){let tt=X[ot];if(tt!==void 0)switch(tt.length){case 2:i.vertexAttrib2fv(H.location,tt);break;case 3:i.vertexAttrib3fv(H.location,tt);break;case 4:i.vertexAttrib4fv(H.location,tt);break;default:i.vertexAttrib1fv(H.location,tt)}}}}_()}function S(){b();for(let L in n){let F=n[L];for(let N in F){let U=F[N];for(let O in U){let Y=U[O];for(let X in Y)h(Y[X].object),delete Y[X];delete U[O]}}delete n[L]}}function E(L){if(n[L.id]===void 0)return;let F=n[L.id];for(let N in F){let U=F[N];for(let O in U){let Y=U[O];for(let X in Y)h(Y[X].object),delete Y[X];delete U[O]}}delete n[L.id]}function w(L){for(let F in n){let N=n[F];for(let U in N){let O=N[U];if(O[L.id]===void 0)continue;let Y=O[L.id];for(let X in Y)h(Y[X].object),delete Y[X];delete O[L.id]}}}function x(L){for(let F in n){let N=n[F],U=L.isInstancedMesh===!0?L.id:0,O=N[U];if(O!==void 0){for(let Y in O){let X=O[Y];for(let ot in X)h(X[ot].object),delete X[ot];delete O[Y]}delete N[U],Object.keys(N).length===0&&delete n[F]}}}function b(){R(),o=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:b,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function tv(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function ev(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==Ln&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){let x=w===an&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==vn&&w!==ti&&!x&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Zt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Zt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:T,maxFragmentUniforms:y,maxSamples:S,samples:E}}function nv(i){let t=this,e=null,n=0,s=!1,r=!1,o=new di,a=new ee,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let m=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let _=r?0:n,T=_*4,y=p.clippingState||null;l.value=y,y=h(m,u,T,f);for(let S=0;S!==T;++S)y[S]=e[S];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,m){let v=d!==null?d.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let T=0,y=f;T!==v;++T,y+=4)o.copy(d[T]).applyMatrix4(_,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}var Yr=4,iv=6,sv=20,rv=256,xa=new Ss,Qf=new Yt,Du=null,Uu=0,Nu=0,Fu=!1,ov=new P,ir=new P,Jr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=ov}=r;Du=this._renderer.getRenderTarget(),Uu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=np(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ep(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Du,Uu,Nu),this._renderer.xr.enabled=Fu,t.scissorTest=!1,$r(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===er?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Du=this._renderer.getRenderTarget(),Uu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:hn,minFilter:hn,generateMipmaps:!1,type:an,format:Ln,colorSpace:Ao,depthBuffer:!1},s=tp(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tp(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=av(r)),this._blurMaterial=cv(r,t,e),this._ggxMaterial=lv(r,t,e)}return s}_compileMaterial(t){let e=new Qt(new we,t);this._renderer.compile(e,xa)}_sceneToCubeUV(t,e,n,s,r){let l=new ke(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Qf),d.toneMapping=gi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Qt(new Ke,new mi({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,g=v.material,p=!1,_=t.background;_?_.isColor&&(g.color.copy(_),t.background=null,p=!0):(g.color.copy(Qf),p=!0);for(let T=0;T<6;T++){let y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));let S=this._cubeSize;$r(s,y*S,T>2?S:0,S,S),d.setRenderTarget(s),p&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=_}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Es||t.mapping===er;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=np()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ep());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;$r(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,xa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:m}=this,v=this._sizeLods[n],g=3*v*(n>m-Yr?n-m+Yr:0),p=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=m-e,$r(r,g,p,3*v,2*v),s.setRenderTarget(r),s.render(a,xa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,$r(t,g,p,3*v,2*v),s.setRenderTarget(t),s.render(a,xa)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Yr?s-this._lodMax+Yr:0),u=4*(this._cubeSize-h);$r(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,xa)}};function av(i){let t=[],e=[],n=i,s=i-Yr+1+iv;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,m=new Float32Array(f*u*d),v=new Float32Array(f*u*d);for(let p=0;p<d;p++){let _=p%3*2/3-1,T=p>2?0:-1,y=[_,T,0,_+2/3,T,0,_+2/3,T+1,0,_,T,0,_+2/3,T+1,0,_,T+1,0];m.set(y,f*u*p);for(let S=0;S<u;S++){let E=h[S*2]*2-1,w=h[S*2+1]*2-1;p===0?ir.set(1,w,E):p===1?ir.set(-E,1,-w):p===2?ir.set(-E,w,1):p===3?ir.set(-1,w,-E):p===4?ir.set(-E,-1,w):ir.set(E,w,-1),ir.toArray(v,(p*u+S)*f)}}let g=new we;g.setAttribute("position",new Ge(m,f)),g.setAttribute("outputDirection",new Ge(v,f)),e.push(new Qt(g,null)),n>Yr&&n--}return{lodMeshes:e,sizeLods:t}}function tp(i,t,e){let n=new Xe(i,t,e);return n.texture.mapping=ca,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function lv(i,t,e){return new De({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:rv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wc(),fragmentShader:`

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
		`,blending:$e,depthTest:!1,depthWrite:!1})}function cv(i,t,e){return new De({name:"SphericalGaussianBlur",defines:{SAMPLES:sv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Wc(),fragmentShader:`

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
		`,blending:$e,depthTest:!1,depthWrite:!1})}function ep(){return new De({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wc(),fragmentShader:`

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
		`,blending:$e,depthTest:!1,depthWrite:!1})}function np(){return new De({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$e,depthTest:!1,depthWrite:!1})}function Wc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Gc=class extends Xe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Oo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ke(5,5,5),r=new De({name:"CubemapFromEquirect",uniforms:nr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:$e});r.uniforms.tEquirect.value=e;let o=new Qt(s,r),a=e.minFilter;return e.minFilter===Ts&&(e.minFilter=hn),new Yl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function hv(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Ql||f===tc)if(t.has(u)){let m=t.get(u).texture;return a(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let v=new Gc(m.height);return v.fromEquirectangularTexture(i,u),t.set(u,v),u.addEventListener("dispose",c),a(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,m=f===Ql||f===tc,v=f===Es||f===er;if(m||v){let g=e.get(u),p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Jr(i)),g=m?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let _=u.image;return m&&_&&_.height>0||v&&_&&l(_)?(n===null&&(n=new Jr(i)),g=m?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function a(u,f){return f===Ql?u.mapping=Es:f===tc&&(u.mapping=er),u}function l(u){let f=0,m=6;for(let v=0;v<m;v++)u[v]!==void 0&&f++;return f===m}function c(u){let f=u.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function uv(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&qs("WebGLRenderer: "+n+" extension not supported."),s}}}function dv(i,t,e,n){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,m=d.attributes.position,v=0;if(m===void 0)return;if(f!==null){let _=f.array;v=f.version;for(let T=0,y=_.length;T<y;T+=3){let S=_[T+0],E=_[T+1],w=_[T+2];u.push(S,E,E,w,w,S)}}else{let _=m.array;v=m.version;for(let T=0,y=_.length/3-1;T<y;T+=3){let S=T+0,E=T+1,w=T+2;u.push(S,E,E,w,w,S)}}let g=new(m.count>=65535?No:Uo)(u,1);g.version=v;let p=r.get(d);p&&t.remove(p),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function fv(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let g=0;g<f;g++)v+=u[g];e.update(v,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function pv(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:Jt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function mv(i,t,e){let n=new WeakMap,s=new xe;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let b=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],T=0;f===!0&&(T=1),m===!0&&(T=2),v===!0&&(T=3);let y=a.attributes.position.count*T,S=1;y>t.maxTextureSize&&(S=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let E=new Float32Array(y*S*4*d),w=new Io(E,y,S,d);w.type=ti,w.needsUpdate=!0;let x=T*4;for(let R=0;R<d;R++){let L=g[R],F=p[R],N=_[R],U=y*S*4*R;for(let O=0;O<L.count;O++){let Y=O*x;f===!0&&(s.fromBufferAttribute(L,O),E[U+Y+0]=s.x,E[U+Y+1]=s.y,E[U+Y+2]=s.z,E[U+Y+3]=0),m===!0&&(s.fromBufferAttribute(F,O),E[U+Y+4]=s.x,E[U+Y+5]=s.y,E[U+Y+6]=s.z,E[U+Y+7]=0),v===!0&&(s.fromBufferAttribute(N,O),E[U+Y+8]=s.x,E[U+Y+9]=s.y,E[U+Y+10]=s.z,E[U+Y+11]=N.itemSize===4?s.w:1)}}u={count:d,texture:w,size:new ft(y,S)},n.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function gv(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var xv={[sa]:"LINEAR_TONE_MAPPING",[ra]:"REINHARD_TONE_MAPPING",[oa]:"CINEON_TONE_MAPPING",[tr]:"ACES_FILMIC_TONE_MAPPING",[la]:"AGX_TONE_MAPPING",[Ji]:"NEUTRAL_TONE_MAPPING",[aa]:"CUSTOM_TONE_MAPPING"};function _v(i,t,e,n,s,r){let o=new Xe(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new we;c.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ae([0,2,0,0,2,0],2));let h=new Vr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Qt(c,h),u=new Ss(-1,1,1,-1,0,1),f=null,m=null,v=!1,g,p=null,_=[],T=!1;this.setSize=function(y,S){o.setSize(y,S),a!==null&&a.setSize(y,S),l!==null&&l.setSize(y,S);for(let E=0;E<_.length;E++){let w=_[E];w.setSize&&w.setSize(y,S)}},this.setEffects=function(y){_=y,T=_.length>0&&_[0].isRenderPass===!0;let S=o.width,E=o.height;_.length>0&&a===null&&(a=new Xe(S,E,{type:an,depthBuffer:!1,stencilBuffer:!1}),l=new Xe(S,E,{type:an,depthBuffer:!1,stencilBuffer:!1}));for(let w=0;w<_.length;w++){let x=_[w];x.setSize&&x.setSize(S,E)}},this.begin=function(y,S){if(v||y.toneMapping===gi&&_.length===0)return!1;if(p=S,S!==null){let E=S.width,w=S.height;(o.width!==E||o.height!==w)&&this.setSize(E,w)}return T===!1&&y.setRenderTarget(o),g=y.toneMapping,y.toneMapping=gi,!0},this.hasRenderPass=function(){return T},this.end=function(y,S){y.toneMapping=g,v=!0;let E=o,w=a;for(let x=0;x<_.length;x++){let b=_[x];b.enabled!==!1&&(b.render(y,w,E,S),b.needsSwap!==!1&&(E=w,w=w===a?l:a))}if(f!==y.outputColorSpace||m!==y.toneMapping){f=y.outputColorSpace,m=y.toneMapping,h.defines={},oe.getTransfer(f)===fe&&(h.defines.SRGB_TRANSFER="");let x=xv[m];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,y.setRenderTarget(p),y.render(d,u),p=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Sp=new Tn,zu=new Ni(1,1),bp=new Io,wp=new Rl,Ep=new Oo,ip=[],sp=[],rp=new Float32Array(16),op=new Float32Array(9),ap=new Float32Array(4);function jr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=ip[s];if(r===void 0&&(r=new Float32Array(s),ip[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function tn(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function en(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Xc(i,t){let e=sp[t];e===void 0&&(e=new Int32Array(t),sp[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function vv(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function yv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;i.uniform2fv(this.addr,t),en(e,t)}}function Mv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(tn(e,t))return;i.uniform3fv(this.addr,t),en(e,t)}}function Sv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;i.uniform4fv(this.addr,t),en(e,t)}}function bv(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(tn(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),en(e,t)}else{if(tn(e,n))return;ap.set(n),i.uniformMatrix2fv(this.addr,!1,ap),en(e,n)}}function wv(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(tn(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),en(e,t)}else{if(tn(e,n))return;op.set(n),i.uniformMatrix3fv(this.addr,!1,op),en(e,n)}}function Ev(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(tn(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),en(e,t)}else{if(tn(e,n))return;rp.set(n),i.uniformMatrix4fv(this.addr,!1,rp),en(e,n)}}function Tv(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Av(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;i.uniform2iv(this.addr,t),en(e,t)}}function Rv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;i.uniform3iv(this.addr,t),en(e,t)}}function Cv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;i.uniform4iv(this.addr,t),en(e,t)}}function Pv(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Iv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;i.uniform2uiv(this.addr,t),en(e,t)}}function Lv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;i.uniform3uiv(this.addr,t),en(e,t)}}function Dv(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;i.uniform4uiv(this.addr,t),en(e,t)}}function Uv(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(zu.compareFunction=e.isReversedDepthBuffer()?kc:zc,r=zu):r=Sp,e.setTexture2D(t||r,s)}function Nv(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||wp,s)}function Fv(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ep,s)}function Ov(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||bp,s)}function Bv(i){switch(i){case 5126:return vv;case 35664:return yv;case 35665:return Mv;case 35666:return Sv;case 35674:return bv;case 35675:return wv;case 35676:return Ev;case 5124:case 35670:return Tv;case 35667:case 35671:return Av;case 35668:case 35672:return Rv;case 35669:case 35673:return Cv;case 5125:return Pv;case 36294:return Iv;case 36295:return Lv;case 36296:return Dv;case 35678:case 36198:case 36298:case 36306:case 35682:return Uv;case 35679:case 36299:case 36307:return Nv;case 35680:case 36300:case 36308:case 36293:return Fv;case 36289:case 36303:case 36311:case 36292:return Ov}}function zv(i,t){i.uniform1fv(this.addr,t)}function kv(i,t){let e=jr(t,this.size,2);i.uniform2fv(this.addr,e)}function Vv(i,t){let e=jr(t,this.size,3);i.uniform3fv(this.addr,e)}function Hv(i,t){let e=jr(t,this.size,4);i.uniform4fv(this.addr,e)}function Gv(i,t){let e=jr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Wv(i,t){let e=jr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Xv(i,t){let e=jr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function qv(i,t){i.uniform1iv(this.addr,t)}function $v(i,t){i.uniform2iv(this.addr,t)}function Yv(i,t){i.uniform3iv(this.addr,t)}function Zv(i,t){i.uniform4iv(this.addr,t)}function Jv(i,t){i.uniform1uiv(this.addr,t)}function Kv(i,t){i.uniform2uiv(this.addr,t)}function jv(i,t){i.uniform3uiv(this.addr,t)}function Qv(i,t){i.uniform4uiv(this.addr,t)}function ty(i,t,e){let n=this.cache,s=t.length,r=Xc(e,s);tn(n,r)||(i.uniform1iv(this.addr,r),en(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=zu:o=Sp;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function ey(i,t,e){let n=this.cache,s=t.length,r=Xc(e,s);tn(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||wp,r[o])}function ny(i,t,e){let n=this.cache,s=t.length,r=Xc(e,s);tn(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ep,r[o])}function iy(i,t,e){let n=this.cache,s=t.length,r=Xc(e,s);tn(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||bp,r[o])}function sy(i){switch(i){case 5126:return zv;case 35664:return kv;case 35665:return Vv;case 35666:return Hv;case 35674:return Gv;case 35675:return Wv;case 35676:return Xv;case 5124:case 35670:return qv;case 35667:case 35671:return $v;case 35668:case 35672:return Yv;case 35669:case 35673:return Zv;case 5125:return Jv;case 36294:return Kv;case 36295:return jv;case 36296:return Qv;case 35678:case 36198:case 36298:case 36306:case 35682:return ty;case 35679:case 36299:case 36307:return ey;case 35680:case 36300:case 36308:case 36293:return ny;case 36289:case 36303:case 36311:case 36292:return iy}}var ku=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Bv(e.type)}},Vu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=sy(e.type)}},Hu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Ou=/(\w+)(\])?(\[|\.)?/g;function lp(i,t){i.seq.push(t),i.map[t.id]=t}function ry(i,t,e){let n=i.name,s=n.length;for(Ou.lastIndex=0;;){let r=Ou.exec(n),o=Ou.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){lp(e,c===void 0?new ku(a,i,t):new Vu(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Hu(a),lp(e,d)),e=d}}}var Zr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);ry(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function cp(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var oy=37297,ay=0;function ly(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var hp=new ee;function cy(i){oe._getMatrix(hp,oe.workingColorSpace,i);let t=`mat3( ${hp.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(i)){case Ro:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return Zt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function up(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+ly(i.getShaderSource(t),a)}else return r}function hy(i,t){let e=cy(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var uy={[sa]:"Linear",[ra]:"Reinhard",[oa]:"Cineon",[tr]:"ACESFilmic",[la]:"AgX",[Ji]:"Neutral",[aa]:"Custom"};function dy(i,t){let e=uy[t];return e===void 0?(Zt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Hc=new P;function fy(){oe.getLuminanceCoefficients(Hc);let i=Hc.x.toFixed(4),t=Hc.y.toFixed(4),e=Hc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function py(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(va).join(`
`)}function my(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function gy(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function va(i){return i!==""}function dp(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function fp(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var xy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gu(i){return i.replace(xy,vy)}var _y=new Map;function vy(i,t){let e=se[t];if(e===void 0){let n=_y.get(t);if(n!==void 0)e=se[n],Zt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Gu(e)}var yy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pp(i){return i.replace(yy,My)}function My(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function mp(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Sy={[js]:"SHADOWMAP_TYPE_PCF",[Gr]:"SHADOWMAP_TYPE_VSM"};function by(i){return Sy[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var wy={[Es]:"ENVMAP_TYPE_CUBE",[er]:"ENVMAP_TYPE_CUBE",[ca]:"ENVMAP_TYPE_CUBE_UV"};function Ey(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":wy[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ty={[er]:"ENVMAP_MODE_REFRACTION"};function Ay(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Ty[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Ry={[jl]:"ENVMAP_BLENDING_MULTIPLY",[Pf]:"ENVMAP_BLENDING_MIX",[If]:"ENVMAP_BLENDING_ADD"};function Cy(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Ry[i.combine]||"ENVMAP_BLENDING_NONE"}function Py(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Iy(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=by(e),c=Ey(e),h=Ay(e),d=Cy(e),u=Py(e),f=py(e),m=my(r),v=s.createProgram(),g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(va).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(va).join(`
`),p.length>0&&(p+=`
`)):(g=[mp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(va).join(`
`),p=[mp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gi?"#define TONE_MAPPING":"",e.toneMapping!==gi?se.tonemapping_pars_fragment:"",e.toneMapping!==gi?dy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",se.colorspace_pars_fragment,hy("linearToOutputTexel",e.outputColorSpace),fy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(va).join(`
`)),o=Gu(o),o=dp(o,e),o=fp(o,e),a=Gu(a),a=dp(a,e),a=fp(a,e),o=pp(o),a=pp(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Eu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Eu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let T=_+g+o,y=_+p+a,S=cp(s,s.VERTEX_SHADER,T),E=cp(s,s.FRAGMENT_SHADER,y);s.attachShader(v,S),s.attachShader(v,E),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(L){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(v)||"",N=s.getShaderInfoLog(S)||"",U=s.getShaderInfoLog(E)||"",O=F.trim(),Y=N.trim(),X=U.trim(),ot=!0,H=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(ot=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,S,E);else{let Q=up(s,S,"vertex"),tt=up(s,E,"fragment");Jt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+O+`
`+Q+`
`+tt)}else O!==""?Zt("WebGLProgram: Program Info Log:",O):(Y===""||X==="")&&(H=!1);H&&(L.diagnostics={runnable:ot,programLog:O,vertexShader:{log:Y,prefix:g},fragmentShader:{log:X,prefix:p}})}s.deleteShader(S),s.deleteShader(E),x=new Zr(s,v),b=gy(s,v)}let x;this.getUniforms=function(){return x===void 0&&w(this),x};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(v,oy)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ay++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=E,this}var Ly=0,Wu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xu(t),e.set(t,n)),n}},Xu=class{constructor(t){this.id=Ly++,this.code=t,this.usedTimes=0}};function Dy(i){return i===Rs||i===ma||i===ga}function Uy(i,t,e,n,s,r){let o=new Lo,a=new Wu,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,b,R,L,F,N){let U=L.fog,O=F.geometry,Y=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?L.environment:null,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,ot=t.get(x.envMap||Y,X),H=ot&&ot.mapping===ca?ot.image.height:null,Q=f[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&Zt("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));let tt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,gt=tt!==void 0?tt.length:0,xt=0;O.morphAttributes.position!==void 0&&(xt=1),O.morphAttributes.normal!==void 0&&(xt=2),O.morphAttributes.color!==void 0&&(xt=3);let $t,Gt,G,I;if(Q){let Re=Cn[Q];$t=Re.vertexShader,Gt=Re.fragmentShader}else{$t=x.vertexShader,Gt=x.fragmentShader;let Re=a.getVertexShaderStage(x),me=a.getFragmentShaderStage(x);a.update(x,Re,me),G=Re.id,I=me.id}let D=i.getRenderTarget(),k=i.state.buffers.depth.getReversed(),W=F.isInstancedMesh===!0,$=F.isBatchedMesh===!0,ut=!!x.map,ht=!!x.matcap,Z=!!ot,et=!!x.aoMap,st=!!x.lightMap,ct=!!x.bumpMap&&x.wireframe===!1,pt=!!x.normalMap,Lt=!!x.displacementMap,It=!!x.emissiveMap,Wt=!!x.metalnessMap,Xt=!!x.roughnessMap,B=x.anisotropy>0,he=x.clearcoat>0,ne=x.dispersion>0,C=x.retroreflectivity>0,M=x.iridescence>0,q=x.sheen>0,J=x.transmission>0,it=B&&!!x.anisotropyMap,mt=he&&!!x.clearcoatMap,_t=he&&!!x.clearcoatNormalMap,rt=he&&!!x.clearcoatRoughnessMap,lt=M&&!!x.iridescenceMap,bt=M&&!!x.iridescenceThicknessMap,zt=q&&!!x.sheenColorMap,Mt=q&&!!x.sheenRoughnessMap,vt=!!x.specularMap,Dt=!!x.specularColorMap,Ht=!!x.specularIntensityMap,Kt=J&&!!x.transmissionMap,V=J&&!!x.thicknessMap,wt=!!x.gradientMap,at=!!x.alphaMap,Et=x.alphaTest>0,Rt=!!x.alphaHash,dt=!!x.extensions,qt=gi;x.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(qt=i.toneMapping);let Ot={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:$t,fragmentShader:Gt,defines:x.defines,customVertexShaderID:G,customFragmentShaderID:I,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:$,batchingColor:$&&F._colorsTexture!==null,instancing:W,instancingColor:W&&F.instanceColor!==null,instancingMorph:W&&F.morphTexture!==null,outputColorSpace:D===null?i.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:oe.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ut,matcap:ht,envMap:Z,envMapMode:Z&&ot.mapping,envMapCubeUVHeight:H,aoMap:et,lightMap:st,bumpMap:ct,normalMap:pt,displacementMap:Lt,emissiveMap:It,normalMapObjectSpace:pt&&x.normalMapType===Uf,normalMapTangentSpace:pt&&x.normalMapType===qr,packedNormalMap:pt&&x.normalMapType===qr&&Dy(x.normalMap.format),metalnessMap:Wt,roughnessMap:Xt,anisotropy:B,anisotropyMap:it,clearcoat:he,clearcoatMap:mt,clearcoatNormalMap:_t,clearcoatRoughnessMap:rt,dispersion:ne,retroreflection:C,iridescence:M,iridescenceMap:lt,iridescenceThicknessMap:bt,sheen:q,sheenColorMap:zt,sheenRoughnessMap:Mt,specularMap:vt,specularColorMap:Dt,specularIntensityMap:Ht,transmission:J,transmissionMap:Kt,thicknessMap:V,gradientMap:wt,opaque:x.transparent===!1&&x.blending===Wr&&x.alphaToCoverage===!1,alphaMap:at,alphaTest:Et,alphaHash:Rt,combine:x.combine,mapUv:ut&&m(x.map.channel),aoMapUv:et&&m(x.aoMap.channel),lightMapUv:st&&m(x.lightMap.channel),bumpMapUv:ct&&m(x.bumpMap.channel),normalMapUv:pt&&m(x.normalMap.channel),displacementMapUv:Lt&&m(x.displacementMap.channel),emissiveMapUv:It&&m(x.emissiveMap.channel),metalnessMapUv:Wt&&m(x.metalnessMap.channel),roughnessMapUv:Xt&&m(x.roughnessMap.channel),anisotropyMapUv:it&&m(x.anisotropyMap.channel),clearcoatMapUv:mt&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:_t&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:bt&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:zt&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&m(x.sheenRoughnessMap.channel),specularMapUv:vt&&m(x.specularMap.channel),specularColorMapUv:Dt&&m(x.specularColorMap.channel),specularIntensityMapUv:Ht&&m(x.specularIntensityMap.channel),transmissionMapUv:Kt&&m(x.transmissionMap.channel),thicknessMapUv:V&&m(x.thicknessMap.channel),alphaMapUv:at&&m(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(pt||B),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!O.attributes.uv&&(ut||at),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&pt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:k,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:xt,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:qt,decodeVideoTexture:ut&&x.map.isVideoTexture===!0&&oe.getTransfer(x.map.colorSpace)===fe,decodeVideoTextureEmissive:It&&x.emissiveMap.isVideoTexture===!0&&oe.getTransfer(x.emissiveMap.colorSpace)===fe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===jn,flipSided:x.side===Fe,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:dt&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(dt&&x.extensions.multiDraw===!0||$)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ot.vertexUv1s=l.has(1),Ot.vertexUv2s=l.has(2),Ot.vertexUv3s=l.has(3),l.clear(),Ot}function g(x){let b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)b.push(R),b.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(p(b,x),_(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function p(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numSunLights),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numSunLightShadows),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function _(x,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function T(x){let b=f[x.type],R;if(b){let L=Cn[b];R=Rn.clone(L.uniforms)}else R=x.uniforms;return R}function y(x,b){let R=h.get(b);return R!==void 0?++R.usedTimes:(R=new Iy(i,b,x,s),c.push(R),h.set(b,R)),R}function S(x){if(--x.usedTimes===0){let b=c.indexOf(x);c[b]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){a.remove(x)}function w(){a.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:T,acquireProgram:y,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:w}}function Ny(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Fy(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function gp(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function xp(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,m,v,g,p){let _=i[t];return _===void 0?(_={id:u.id,object:u,geometry:f,material:m,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:g,group:p},i[t]=_):(_.id=u.id,_.object=u,_.geometry=f,_.material=m,_.materialVariant=o(u),_.groupOrder=v,_.renderOrder=u.renderOrder,_.z=g,_.group=p),t++,_}function l(u,f,m,v,g,p,_){_.reversedDepth===!0&&(g=-g);let T=a(u,f,m,v,g,p);m.transmission>0?n.push(T):m.transparent===!0?s.push(T):e.push(T)}function c(u,f,m,v,g,p){let _=a(u,f,m,v,g,p);m.transmission>0?n.unshift(_):m.transparent===!0?s.unshift(_):e.unshift(_)}function h(u,f){e.length>1&&e.sort(u||Fy),n.length>1&&n.sort(f||gp),s.length>1&&s.sort(f||gp)}function d(){for(let u=t,f=i.length;u<f;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Oy(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new xp,i.set(n,[o])):s>=r.length?(o=new xp,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function By(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new P,color:new Yt};break;case"SpotLight":e={position:new P,direction:new P,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function zy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var ky=0;function Vy(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Hy(i){let t=new By,e=zy(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new jt,o=new jt;function a(c){let h=0,d=0,u=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,T=0,y=0,S=0,E=0,w=0,x=0,b=0,R=0;c.sort(Vy);for(let F=0,N=c.length;F<N;F++){let U=c[F],O=U.color,Y=U.intensity,X=U.distance,ot=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Rs?ot=U.shadow.map.texture:ot=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=O.r*Y,d+=O.g*Y,u+=O.b*Y;else if(U.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(U.sh.coefficients[H],Y);R++}else if(U.isSunLight){let H=t.get(U);if(H.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let Q=U.shadow,tt=e.get(U);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[m]=tt,n.sunShadowMap[m]=ot;let gt=Q.getViewportCount();for(let xt=0;xt<gt;xt++)n.sunShadowMatrix[v+xt]=Q.getMatrix(xt),n.sunShadowCascade[v+xt]=Q._cascadeData[xt];v+=gt,m++}n.sun[f]=H,f++}else if(U.isDirectionalLight){let H=t.get(U);if(H.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let Q=U.shadow,tt=e.get(U);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,n.directionalShadow[g]=tt,n.directionalShadowMap[g]=ot,n.directionalShadowMatrix[g]=U.shadow.matrix,S++}n.directional[g]=H,g++}else if(U.isSpotLight){let H=t.get(U);H.position.setFromMatrixPosition(U.matrixWorld),H.color.copy(O).multiplyScalar(Y),H.distance=X,H.coneCos=Math.cos(U.angle),H.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),H.decay=U.decay,n.spot[_]=H;let Q=U.shadow;if(U.map&&(n.spotLightMap[x]=U.map,x++,Q.updateMatrices(U),U.castShadow&&b++),n.spotLightMatrix[_]=Q.matrix,U.castShadow){let tt=e.get(U);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,n.spotShadow[_]=tt,n.spotShadowMap[_]=ot,w++}_++}else if(U.isRectAreaLight){let H=t.get(U);H.color.copy(O).multiplyScalar(Y),H.halfWidth.set(U.width*.5,0,0),H.halfHeight.set(0,U.height*.5,0),n.rectArea[T]=H,T++}else if(U.isPointLight){let H=t.get(U);if(H.color.copy(U.color).multiplyScalar(U.intensity),H.distance=U.distance,H.decay=U.decay,U.castShadow){let Q=U.shadow,tt=e.get(U);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,tt.shadowCameraNear=Q.camera.near,tt.shadowCameraFar=Q.camera.far,n.pointShadow[p]=tt,n.pointShadowMap[p]=ot,n.pointShadowMatrix[p]=U.shadow.matrix,E++}n.point[p]=H,p++}else if(U.isHemisphereLight){let H=t.get(U);H.skyColor.copy(U.color).multiplyScalar(Y),H.groundColor.copy(U.groundColor).multiplyScalar(Y),n.hemi[y]=H,y++}}T>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let L=n.hash;(L.sunLength!==f||L.directionalLength!==g||L.pointLength!==p||L.spotLength!==_||L.rectAreaLength!==T||L.hemiLength!==y||L.numSunShadows!==m||L.numDirectionalShadows!==S||L.numPointShadows!==E||L.numSpotShadows!==w||L.numSpotMaps!==x||L.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=g,n.spot.length=_,n.rectArea.length=T,n.point.length=p,n.hemi.length=y,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=w,n.spotShadowMap.length=w,n.spotLightMatrix.length=w+x-b,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,L.sunLength=f,L.directionalLength=g,L.pointLength=p,L.spotLength=_,L.rectAreaLength=T,L.hemiLength=y,L.numSunShadows=m,L.numDirectionalShadows=S,L.numPointShadows=E,L.numSpotShadows=w,L.numSpotMaps=x,L.numLightProbes=R,n.version=ky++)}function l(c,h){let d=0,u=0,f=0,m=0,v=0,g=0,p=h.matrixWorldInverse;for(let _=0,T=c.length;_<T;_++){let y=c[_];if(y.isSunLight){let S=n.sun[d];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(p),d++}else if(y.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),u++}else if(y.isSpotLight){let S=n.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(y.isRectAreaLight){let S=n.rectArea[v];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){let S=n.hemi[g];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:n}}function _p(i){let t=new Hy(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Gy(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new _p(i),t.set(s,[a])):r>=o.length?(a=new _p(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Wy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xy=`uniform sampler2D shadow_pass;
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
}`,qy=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],$y=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],vp=new jt,_a=new P,Bu=new P;function Yy(i,t,e){let n=new Fr,s=new ft,r=new ft,o=new xe,a=new Fl,l=new Ol,c={},h=e.maxTextureSize,d={[ws]:Fe,[Fe]:ws,[jn]:jn},u=new De({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Wy,fragmentShader:Xy}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let m=new we;m.setAttribute("position",new Ge(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Qt(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=js;let p=this.type;this.render=function(E,w,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===mf&&(Zt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=js);let b=i.getRenderTarget(),R=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),F=i.state;F.setBlending($e),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let N=p!==this.type;N&&w.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(O=>O.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,O=E.length;U<O;U++){let Y=E[U],X=Y.shadow;if(X===void 0){Zt("WebGLShadowMap:",Y,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let ot=X.getFrameExtents();s.multiply(ot),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ot.x),s.x=r.x*ot.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ot.y),s.y=r.y*ot.y,X.mapSize.y=r.y));let H=i.state.buffers.depth.getReversed();if(X.camera._reversedDepth=H,X.map===null||N===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Gr){if(Y.isPointLight){Zt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Xe(s.x,s.y,{format:Rs,type:an,minFilter:hn,magFilter:hn,generateMipmaps:!1}),X.map.texture.name=Y.name+".shadowMap",X.map.depthTexture=new Ni(s.x,s.y,ti),X.map.depthTexture.name=Y.name+".shadowMapDepth",X.map.depthTexture.format=Li,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=We,X.map.depthTexture.magFilter=We}else Y.isPointLight?(X.map=new Gc(s.x),X.map.depthTexture=new Pl(s.x,xi)):(X.map=new Xe(s.x,s.y),X.map.depthTexture=new Ni(s.x,s.y,xi)),X.map.depthTexture.name=Y.name+".shadowMap",X.map.depthTexture.format=Li,this.type===js?(X.map.depthTexture.compareFunction=H?kc:zc,X.map.depthTexture.minFilter=hn,X.map.depthTexture.magFilter=hn):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=We,X.map.depthTexture.magFilter=We);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==s.x||X.map.height!==s.y)&&X.map.setSize(s.x,s.y);let Q=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Y.isPointLight!==!0&&X.updateMatrices(Y,x);for(let tt=0;tt<Q;tt++){let gt=X.getCamera(tt);if(Y.isPointLight){let xt=X.camera,$t=X.matrix,Gt=Y.distance||xt.far;Gt!==xt.far&&(xt.far=Gt,xt.updateProjectionMatrix()),_a.setFromMatrixPosition(Y.matrixWorld),xt.position.copy(_a),Bu.copy(xt.position),Bu.add(qy[tt]),xt.up.copy($y[tt]),xt.lookAt(Bu),xt.updateMatrixWorld(),$t.makeTranslation(-_a.x,-_a.y,-_a.z),vp.multiplyMatrices(xt.projectionMatrix,xt.matrixWorldInverse),X._frustum.setFromProjectionMatrix(vp,xt.coordinateSystem,xt.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)i.setRenderTarget(X.map,tt),i.clear();else{tt===0&&(i.setRenderTarget(X.map),i.clear());let xt=X.getViewport(tt);o.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),F.viewport(o)}n=X.getFrustum(tt),y(w,x,gt,Y,this.type)}X.isPointLightShadow!==!0&&this.type===Gr&&_(X,x),X.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(b,R,L)};function _(E,w){let x=t.update(v);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Xe(s.x,s.y,{format:Rs,type:an}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(w,null,x,u,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(w,null,x,f,v,null)}function T(E,w,x,b){let R=null,L=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)R=L;else if(R=x.isPointLight===!0?l:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let F=R.uuid,N=w.uuid,U=c[F];U===void 0&&(U={},c[F]=U);let O=U[N];O===void 0&&(O=R.clone(),U[N]=O,w.addEventListener("dispose",S)),R=O}if(R.visible=w.visible,R.wireframe=w.wireframe,b===Gr?R.side=w.shadowSide!==null?w.shadowSide:w.side:R.side=w.shadowSide!==null?w.shadowSide:d[w.side],R.alphaMap=w.alphaMap,R.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,R.map=w.map,R.clipShadows=w.clipShadows,R.clippingPlanes=w.clippingPlanes,R.clipIntersection=w.clipIntersection,R.displacementMap=w.displacementMap,R.displacementScale=w.displacementScale,R.displacementBias=w.displacementBias,R.wireframeLinewidth=w.wireframeLinewidth,R.linewidth=w.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=i.properties.get(R);F.light=x}return R}function y(E,w,x,b,R){if(E.visible===!1)return;if(E.layers.test(w.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===Gr)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);let N=t.update(E),U=E.material;if(Array.isArray(U)){let O=N.groups;for(let Y=0,X=O.length;Y<X;Y++){let ot=O[Y],H=U[ot.materialIndex];if(H&&H.visible){let Q=T(E,H,b,R);E.onBeforeShadow(i,E,w,x,N,Q,ot),i.renderBufferDirect(x,null,N,Q,E,ot),E.onAfterShadow(i,E,w,x,N,Q,ot)}}}else if(U.visible){let O=T(E,U,b,R);E.onBeforeShadow(i,E,w,x,N,O,null),i.renderBufferDirect(x,null,N,O,E,null),E.onAfterShadow(i,E,w,x,N,O,null)}}let F=E.children;for(let N=0,U=F.length;N<U;N++)y(F[N],w,x,b,R)}function S(E){E.target.removeEventListener("dispose",S);for(let x in c){let b=c[x],R=E.target.uuid;R in b&&(b[R].dispose(),delete b[R])}}}function Zy(i,t){function e(){let V=!1,wt=new xe,at=null,Et=new xe(0,0,0,0);return{setMask:function(Rt){at!==Rt&&!V&&(i.colorMask(Rt,Rt,Rt,Rt),at=Rt)},setLocked:function(Rt){V=Rt},setClear:function(Rt,dt,qt,Ot,Re){Re===!0&&(Rt*=Ot,dt*=Ot,qt*=Ot),wt.set(Rt,dt,qt,Ot),Et.equals(wt)===!1&&(i.clearColor(Rt,dt,qt,Ot),Et.copy(wt))},reset:function(){V=!1,at=null,Et.set(-1,0,0,0)}}}function n(){let V=!1,wt=!1,at=null,Et=null,Rt=null;return{setReversed:function(dt){if(wt!==dt){let qt=t.get("EXT_clip_control");dt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT),wt=dt;let Ot=Rt;Rt=null,this.setClear(Ot)}},getReversed:function(){return wt},setTest:function(dt){dt?D(i.DEPTH_TEST):k(i.DEPTH_TEST)},setMask:function(dt){at!==dt&&!V&&(i.depthMask(dt),at=dt)},setFunc:function(dt){if(wt&&(dt=Xf[dt]),Et!==dt){switch(dt){case xl:i.depthFunc(i.NEVER);break;case _l:i.depthFunc(i.ALWAYS);break;case vl:i.depthFunc(i.LESS);break;case Cr:i.depthFunc(i.LEQUAL);break;case yl:i.depthFunc(i.EQUAL);break;case Ml:i.depthFunc(i.GEQUAL);break;case Sl:i.depthFunc(i.GREATER);break;case bl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Et=dt}},setLocked:function(dt){V=dt},setClear:function(dt){Rt!==dt&&(Rt=dt,wt&&(dt=1-dt),i.clearDepth(dt))},reset:function(){V=!1,at=null,Et=null,Rt=null,wt=!1}}}function s(){let V=!1,wt=null,at=null,Et=null,Rt=null,dt=null,qt=null,Ot=null,Re=null;return{setTest:function(me){V||(me?D(i.STENCIL_TEST):k(i.STENCIL_TEST))},setMask:function(me){wt!==me&&!V&&(i.stencilMask(me),wt=me)},setFunc:function(me,li,Ti){(at!==me||Et!==li||Rt!==Ti)&&(i.stencilFunc(me,li,Ti),at=me,Et=li,Rt=Ti)},setOp:function(me,li,Ti){(dt!==me||qt!==li||Ot!==Ti)&&(i.stencilOp(me,li,Ti),dt=me,qt=li,Ot=Ti)},setLocked:function(me){V=me},setClear:function(me){Re!==me&&(i.clearStencil(me),Re=me)},reset:function(){V=!1,wt=null,at=null,Et=null,Rt=null,dt=null,qt=null,Ot=null,Re=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,m=[],v=null,g=!1,p=null,_=null,T=null,y=null,S=null,E=null,w=null,x=new Yt(0,0,0),b=0,R=!1,L=null,F=null,N=null,U=null,O=null,Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,ot=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(ot=parseFloat(/^WebGL (\d)/.exec(H)[1]),X=ot>=1):H.indexOf("OpenGL ES")!==-1&&(ot=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),X=ot>=2);let Q=null,tt={},gt=i.getParameter(i.SCISSOR_BOX),xt=i.getParameter(i.VIEWPORT),$t=new xe().fromArray(gt),Gt=new xe().fromArray(xt);function G(V,wt,at,Et){let Rt=new Uint8Array(4),dt=i.createTexture();i.bindTexture(V,dt),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let qt=0;qt<at;qt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(wt,0,i.RGBA,1,1,Et,0,i.RGBA,i.UNSIGNED_BYTE,Rt):i.texImage2D(wt+qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Rt);return dt}let I={};I[i.TEXTURE_2D]=G(i.TEXTURE_2D,i.TEXTURE_2D,1),I[i.TEXTURE_CUBE_MAP]=G(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),I[i.TEXTURE_2D_ARRAY]=G(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),I[i.TEXTURE_3D]=G(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),D(i.DEPTH_TEST),o.setFunc(Cr),ct(!1),pt(uu),D(i.CULL_FACE),et($e);function D(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function k(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function W(V,wt){return u[V]!==wt?(i.bindFramebuffer(V,wt),u[V]=wt,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=wt),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=wt),!0):!1}function $(V,wt){let at=m,Et=!1;if(V){at=f.get(wt),at===void 0&&(at=[],f.set(wt,at));let Rt=V.textures;if(at.length!==Rt.length||at[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,qt=Rt.length;dt<qt;dt++)at[dt]=i.COLOR_ATTACHMENT0+dt;at.length=Rt.length,Et=!0}}else at[0]!==i.BACK&&(at[0]=i.BACK,Et=!0);Et&&i.drawBuffers(at)}function ut(V){return v!==V?(i.useProgram(V),v=V,!0):!1}let ht={[Qn]:i.FUNC_ADD,[gf]:i.FUNC_SUBTRACT,[xf]:i.FUNC_REVERSE_SUBTRACT};ht[_f]=i.MIN,ht[vf]=i.MAX;let Z={[Qs]:i.ZERO,[yf]:i.ONE,[Mf]:i.SRC_COLOR,[mu]:i.SRC_ALPHA,[Ef]:i.SRC_ALPHA_SATURATE,[ia]:i.DST_COLOR,[na]:i.DST_ALPHA,[Sf]:i.ONE_MINUS_SRC_COLOR,[gu]:i.ONE_MINUS_SRC_ALPHA,[wf]:i.ONE_MINUS_DST_COLOR,[bf]:i.ONE_MINUS_DST_ALPHA,[Tf]:i.CONSTANT_COLOR,[Af]:i.ONE_MINUS_CONSTANT_COLOR,[Rf]:i.CONSTANT_ALPHA,[Cf]:i.ONE_MINUS_CONSTANT_ALPHA};function et(V,wt,at,Et,Rt,dt,qt,Ot,Re,me){if(V===$e){g===!0&&(k(i.BLEND),g=!1);return}if(g===!1&&(D(i.BLEND),g=!0),V!==Kl){if(V!==p||me!==R){if((_!==Qn||S!==Qn)&&(i.blendEquation(i.FUNC_ADD),_=Qn,S=Qn),me)switch(V){case Wr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case du:i.blendFunc(i.ONE,i.ONE);break;case fu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Jt("WebGLState: Invalid blending: ",V);break}else switch(V){case Wr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case du:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case fu:Jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pu:Jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Jt("WebGLState: Invalid blending: ",V);break}T=null,y=null,E=null,w=null,x.set(0,0,0),b=0,p=V,R=me}return}Rt=Rt||wt,dt=dt||at,qt=qt||Et,(wt!==_||Rt!==S)&&(i.blendEquationSeparate(ht[wt],ht[Rt]),_=wt,S=Rt),(at!==T||Et!==y||dt!==E||qt!==w)&&(i.blendFuncSeparate(Z[at],Z[Et],Z[dt],Z[qt]),T=at,y=Et,E=dt,w=qt),(Ot.equals(x)===!1||Re!==b)&&(i.blendColor(Ot.r,Ot.g,Ot.b,Re),x.copy(Ot),b=Re),p=V,R=!1}function st(V,wt){V.side===jn?k(i.CULL_FACE):D(i.CULL_FACE);let at=V.side===Fe;wt&&(at=!at),ct(at),V.blending===Wr&&V.transparent===!1?et($e):et(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),r.setMask(V.colorWrite);let Et=V.stencilWrite;a.setTest(Et),Et&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),It(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?D(i.SAMPLE_ALPHA_TO_COVERAGE):k(i.SAMPLE_ALPHA_TO_COVERAGE)}function ct(V){L!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),L=V)}function pt(V){V!==ff?(D(i.CULL_FACE),V!==F&&(V===uu?i.cullFace(i.BACK):V===pf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):k(i.CULL_FACE),F=V}function Lt(V){V!==N&&(X&&i.lineWidth(V),N=V)}function It(V,wt,at){V?(D(i.POLYGON_OFFSET_FILL),(U!==wt||O!==at)&&(U=wt,O=at,o.getReversed()&&(wt=-wt),i.polygonOffset(wt,at))):k(i.POLYGON_OFFSET_FILL)}function Wt(V){V?D(i.SCISSOR_TEST):k(i.SCISSOR_TEST)}function Xt(V){V===void 0&&(V=i.TEXTURE0+Y-1),Q!==V&&(i.activeTexture(V),Q=V)}function B(V,wt,at){at===void 0&&(Q===null?at=i.TEXTURE0+Y-1:at=Q);let Et=tt[at];Et===void 0&&(Et={type:void 0,texture:void 0},tt[at]=Et),(Et.type!==V||Et.texture!==wt)&&(Q!==at&&(i.activeTexture(at),Q=at),i.bindTexture(V,wt||I[V]),Et.type=V,Et.texture=wt)}function he(){let V=tt[Q];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function ne(){try{i.compressedTexImage2D(...arguments)}catch(V){Jt("WebGLState:",V)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(V){Jt("WebGLState:",V)}}function M(){try{i.texSubImage2D(...arguments)}catch(V){Jt("WebGLState:",V)}}function q(){try{i.texSubImage3D(...arguments)}catch(V){Jt("WebGLState:",V)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(V){Jt("WebGLState:",V)}}function it(){try{i.compressedTexSubImage3D(...arguments)}catch(V){Jt("WebGLState:",V)}}function mt(){try{i.texStorage2D(...arguments)}catch(V){Jt("WebGLState:",V)}}function _t(){try{i.texStorage3D(...arguments)}catch(V){Jt("WebGLState:",V)}}function rt(){try{i.texImage2D(...arguments)}catch(V){Jt("WebGLState:",V)}}function lt(){try{i.texImage3D(...arguments)}catch(V){Jt("WebGLState:",V)}}function bt(V){return d[V]!==void 0?d[V]:i.getParameter(V)}function zt(V,wt){d[V]!==wt&&(i.pixelStorei(V,wt),d[V]=wt)}function Mt(V){$t.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),$t.copy(V))}function vt(V){Gt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Gt.copy(V))}function Dt(V,wt){let at=c.get(wt);at===void 0&&(at=new WeakMap,c.set(wt,at));let Et=at.get(V);Et===void 0&&(Et=i.getUniformBlockIndex(wt,V.name),at.set(V,Et))}function Ht(V,wt){let Et=c.get(wt).get(V);l.get(wt)!==Et&&(i.uniformBlockBinding(wt,Et,V.__bindingPointIndex),l.set(wt,Et))}function Kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},Q=null,tt={},u={},f=new WeakMap,m=[],v=null,g=!1,p=null,_=null,T=null,y=null,S=null,E=null,w=null,x=new Yt(0,0,0),b=0,R=!1,L=null,F=null,N=null,U=null,O=null,$t.set(0,0,i.canvas.width,i.canvas.height),Gt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:D,disable:k,bindFramebuffer:W,drawBuffers:$,useProgram:ut,setBlending:et,setMaterial:st,setFlipSided:ct,setCullFace:pt,setLineWidth:Lt,setPolygonOffset:It,setScissorTest:Wt,activeTexture:Xt,bindTexture:B,unbindTexture:he,compressedTexImage2D:ne,compressedTexImage3D:C,texImage2D:rt,texImage3D:lt,pixelStorei:zt,getParameter:bt,updateUBOMapping:Dt,uniformBlockBinding:Ht,texStorage2D:mt,texStorage3D:_t,texSubImage2D:M,texSubImage3D:q,compressedTexSubImage2D:J,compressedTexSubImage3D:it,scissor:Mt,viewport:vt,reset:Kt}}function Jy(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap,d=new Set,u,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,M){return m?new OffscreenCanvas(C,M):Co("canvas")}function g(C,M,q){let J=1,it=ne(C);if((it.width>q||it.height>q)&&(J=q/Math.max(it.width,it.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let mt=Math.floor(J*it.width),_t=Math.floor(J*it.height);u===void 0&&(u=v(mt,_t));let rt=M?v(mt,_t):u;return rt.width=mt,rt.height=_t,rt.getContext("2d").drawImage(C,0,0,mt,_t),Zt("WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+mt+"x"+_t+")."),rt}else return"data"in C&&Zt("WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),C;return C}function p(C){return C.generateMipmaps}function _(C){i.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,M,q,J,it,mt=!1){if(C!==null){if(i[C]!==void 0)return i[C];Zt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let _t;J&&(_t=t.get("EXT_texture_norm16"),_t||Zt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let rt=M;if(M===i.RED&&(q===i.FLOAT&&(rt=i.R32F),q===i.HALF_FLOAT&&(rt=i.R16F),q===i.UNSIGNED_BYTE&&(rt=i.R8),q===i.UNSIGNED_SHORT&&_t&&(rt=_t.R16_EXT),q===i.SHORT&&_t&&(rt=_t.R16_SNORM_EXT)),M===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(rt=i.R8UI),q===i.UNSIGNED_SHORT&&(rt=i.R16UI),q===i.UNSIGNED_INT&&(rt=i.R32UI),q===i.BYTE&&(rt=i.R8I),q===i.SHORT&&(rt=i.R16I),q===i.INT&&(rt=i.R32I)),M===i.RG&&(q===i.FLOAT&&(rt=i.RG32F),q===i.HALF_FLOAT&&(rt=i.RG16F),q===i.UNSIGNED_BYTE&&(rt=i.RG8),q===i.UNSIGNED_SHORT&&_t&&(rt=_t.RG16_EXT),q===i.SHORT&&_t&&(rt=_t.RG16_SNORM_EXT)),M===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(rt=i.RG8UI),q===i.UNSIGNED_SHORT&&(rt=i.RG16UI),q===i.UNSIGNED_INT&&(rt=i.RG32UI),q===i.BYTE&&(rt=i.RG8I),q===i.SHORT&&(rt=i.RG16I),q===i.INT&&(rt=i.RG32I)),M===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(rt=i.RGB8UI),q===i.UNSIGNED_SHORT&&(rt=i.RGB16UI),q===i.UNSIGNED_INT&&(rt=i.RGB32UI),q===i.BYTE&&(rt=i.RGB8I),q===i.SHORT&&(rt=i.RGB16I),q===i.INT&&(rt=i.RGB32I)),M===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(rt=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(rt=i.RGBA16UI),q===i.UNSIGNED_INT&&(rt=i.RGBA32UI),q===i.BYTE&&(rt=i.RGBA8I),q===i.SHORT&&(rt=i.RGBA16I),q===i.INT&&(rt=i.RGBA32I)),M===i.RGB&&(q===i.UNSIGNED_SHORT&&_t&&(rt=_t.RGB16_EXT),q===i.SHORT&&_t&&(rt=_t.RGB16_SNORM_EXT),q===i.UNSIGNED_INT_5_9_9_9_REV&&(rt=i.RGB9_E5),q===i.UNSIGNED_INT_10F_11F_11F_REV&&(rt=i.R11F_G11F_B10F)),M===i.RGBA){let lt=mt?Ro:oe.getTransfer(it);q===i.FLOAT&&(rt=i.RGBA32F),q===i.HALF_FLOAT&&(rt=i.RGBA16F),q===i.UNSIGNED_BYTE&&(rt=lt===fe?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT&&_t&&(rt=_t.RGBA16_EXT),q===i.SHORT&&_t&&(rt=_t.RGBA16_SNORM_EXT),q===i.UNSIGNED_SHORT_4_4_4_4&&(rt=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(rt=i.RGB5_A1)}return(rt===i.R16F||rt===i.R32F||rt===i.RG16F||rt===i.RG32F||rt===i.RGBA16F||rt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function S(C,M){let q;return C?M===null||M===xi||M===As?q=i.DEPTH24_STENCIL8:M===ti?q=i.DEPTH32F_STENCIL8:M===Xr&&(q=i.DEPTH24_STENCIL8,Zt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===xi||M===As?q=i.DEPTH_COMPONENT24:M===ti?q=i.DEPTH_COMPONENT32F:M===Xr&&(q=i.DEPTH_COMPONENT16),q}function E(C,M){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==We&&C.minFilter!==hn?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function w(C){let M=C.target;M.removeEventListener("dispose",w),b(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&d.delete(M)}function x(C){let M=C.target;M.removeEventListener("dispose",x),L(M)}function b(C){let M=n.get(C);if(M.__webglInit===void 0)return;let q=C.source,J=f.get(q);if(J){let it=J[M.__cacheKey];it.usedTimes--,it.usedTimes===0&&R(C),Object.keys(J).length===0&&f.delete(q)}n.remove(C)}function R(C){let M=n.get(C);i.deleteTexture(M.__webglTexture);let q=C.source,J=f.get(q);delete J[M.__cacheKey],o.memory.textures--}function L(C){let M=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(M.__webglFramebuffer[J]))for(let it=0;it<M.__webglFramebuffer[J].length;it++)i.deleteFramebuffer(M.__webglFramebuffer[J][it]);else i.deleteFramebuffer(M.__webglFramebuffer[J]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[J])}else{if(Array.isArray(M.__webglFramebuffer))for(let J=0;J<M.__webglFramebuffer.length;J++)i.deleteFramebuffer(M.__webglFramebuffer[J]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let J=0;J<M.__webglColorRenderbuffer.length;J++)M.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[J]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let q=C.textures;for(let J=0,it=q.length;J<it;J++){let mt=n.get(q[J]);mt.__webglTexture&&(i.deleteTexture(mt.__webglTexture),o.memory.textures--),n.remove(q[J])}n.remove(C)}let F=0;function N(){F=0}function U(){return F}function O(C){F=C}function Y(){let C=F;return C>=s.maxTextures&&Zt("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,C}function X(C){let M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function ot(C,M){let q=n.get(C);if(C.isVideoTexture&&B(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&q.__version!==C.version){let J=C.image;if(J===null)Zt("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Zt("WebGLRenderer: Texture marked for update but image is incomplete");else{k(q,C,M);return}}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+M)}function H(C,M){let q=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){k(q,C,M);return}else C.isExternalTexture&&(q.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+M)}function Q(C,M){let q=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){k(q,C,M);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+M)}function tt(C,M){let q=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&q.__version!==C.version){W(q,C,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+M)}let gt={[Ii]:i.REPEAT,[Ci]:i.CLAMP_TO_EDGE,[wl]:i.MIRRORED_REPEAT},xt={[We]:i.NEAREST,[Lf]:i.NEAREST_MIPMAP_NEAREST,[ha]:i.NEAREST_MIPMAP_LINEAR,[hn]:i.LINEAR,[ec]:i.LINEAR_MIPMAP_NEAREST,[Ts]:i.LINEAR_MIPMAP_LINEAR},$t={[Ff]:i.NEVER,[Vf]:i.ALWAYS,[Of]:i.LESS,[zc]:i.LEQUAL,[Bf]:i.EQUAL,[kc]:i.GEQUAL,[zf]:i.GREATER,[kf]:i.NOTEQUAL};function Gt(C,M){if(M.type===ti&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===hn||M.magFilter===ec||M.magFilter===ha||M.magFilter===Ts||M.minFilter===hn||M.minFilter===ec||M.minFilter===ha||M.minFilter===Ts)&&Zt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,gt[M.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,gt[M.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,gt[M.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,xt[M.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,xt[M.minFilter]),M.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,$t[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===We||M.minFilter!==ha&&M.minFilter!==Ts||M.type===ti&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){let q=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function G(C,M){let q=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",w));let J=M.source,it=f.get(J);it===void 0&&(it={},f.set(J,it));let mt=X(M);if(mt!==C.__cacheKey){it[mt]===void 0&&(it[mt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),it[mt].usedTimes++;let _t=it[C.__cacheKey];_t!==void 0&&(it[C.__cacheKey].usedTimes--,_t.usedTimes===0&&R(M)),C.__cacheKey=mt,C.__webglTexture=it[mt].texture}return q}function I(C,M,q){return Math.floor(Math.floor(C/q)/M)}function D(C,M,q,J){let mt=C.updateRanges;if(mt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,q,J,M.data);else{mt.sort((zt,Mt)=>zt.start-Mt.start);let _t=0;for(let zt=1;zt<mt.length;zt++){let Mt=mt[_t],vt=mt[zt],Dt=Mt.start+Mt.count,Ht=I(vt.start,M.width,4),Kt=I(Mt.start,M.width,4);vt.start<=Dt+1&&Ht===Kt&&I(vt.start+vt.count-1,M.width,4)===Ht?Mt.count=Math.max(Mt.count,vt.start+vt.count-Mt.start):(++_t,mt[_t]=vt)}mt.length=_t+1;let rt=e.getParameter(i.UNPACK_ROW_LENGTH),lt=e.getParameter(i.UNPACK_SKIP_PIXELS),bt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let zt=0,Mt=mt.length;zt<Mt;zt++){let vt=mt[zt],Dt=Math.floor(vt.start/4),Ht=Math.ceil(vt.count/4),Kt=Dt%M.width,V=Math.floor(Dt/M.width),wt=Ht,at=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Kt),e.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,Kt,V,wt,at,q,J,M.data)}C.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,rt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,lt),e.pixelStorei(i.UNPACK_SKIP_ROWS,bt)}}function k(C,M,q){let J=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=i.TEXTURE_3D);let it=G(C,M),mt=M.source;e.bindTexture(J,C.__webglTexture,i.TEXTURE0+q);let _t=n.get(mt);if(mt.version!==_t.__version||it===!0){if(e.activeTexture(i.TEXTURE0+q),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){let at=oe.getPrimaries(oe.workingColorSpace),Et=M.colorSpace===Ki?null:oe.getPrimaries(M.colorSpace),Rt=M.colorSpace===Ki||at===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt)}e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment);let lt=g(M.image,!1,s.maxTextureSize);lt=he(M,lt);let bt=r.convert(M.format,M.colorSpace),zt=r.convert(M.type),Mt=y(M.internalFormat,bt,zt,M.normalized,M.colorSpace,M.isVideoTexture);Gt(J,M);let vt,Dt=M.mipmaps,Ht=M.isVideoTexture!==!0,Kt=_t.__version===void 0||it===!0,V=mt.dataReady,wt=E(M,lt);if(M.isDepthTexture)Mt=S(M.format===Fi,M.type),Kt&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,Mt,lt.width,lt.height):e.texImage2D(i.TEXTURE_2D,0,Mt,lt.width,lt.height,0,bt,zt,null));else if(M.isDataTexture)if(Dt.length>0){Ht&&Kt&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Dt[0].width,Dt[0].height);for(let at=0,Et=Dt.length;at<Et;at++)vt=Dt[at],Ht?V&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,vt.width,vt.height,bt,zt,vt.data):e.texImage2D(i.TEXTURE_2D,at,Mt,vt.width,vt.height,0,bt,zt,vt.data);M.generateMipmaps=!1}else Ht?(Kt&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,lt.width,lt.height),V&&D(M,lt,bt,zt)):e.texImage2D(i.TEXTURE_2D,0,Mt,lt.width,lt.height,0,bt,zt,lt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ht&&Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,Dt[0].width,Dt[0].height,lt.depth);for(let at=0,Et=Dt.length;at<Et;at++)if(vt=Dt[at],M.format!==Ln)if(bt!==null)if(Ht){if(V)if(M.layerUpdates.size>0){let Rt=Lu(vt.width,vt.height,M.format,M.type);for(let dt of M.layerUpdates){let qt=vt.data.subarray(dt*Rt/vt.data.BYTES_PER_ELEMENT,(dt+1)*Rt/vt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,dt,vt.width,vt.height,1,bt,qt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,vt.width,vt.height,lt.depth,bt,vt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,at,Mt,vt.width,vt.height,lt.depth,0,vt.data,0,0);else Zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?V&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,vt.width,vt.height,lt.depth,bt,zt,vt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,at,Mt,vt.width,vt.height,lt.depth,0,bt,zt,vt.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{Ht&&Kt&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Dt[0].width,Dt[0].height);for(let at=0,Et=Dt.length;at<Et;at++)vt=Dt[at],M.format!==Ln?bt!==null?Ht?V&&e.compressedTexSubImage2D(i.TEXTURE_2D,at,0,0,vt.width,vt.height,bt,vt.data):e.compressedTexImage2D(i.TEXTURE_2D,at,Mt,vt.width,vt.height,0,vt.data):Zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?V&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,vt.width,vt.height,bt,zt,vt.data):e.texImage2D(i.TEXTURE_2D,at,Mt,vt.width,vt.height,0,bt,zt,vt.data)}else if(M.isDataArrayTexture)if(Ht){if(Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,lt.width,lt.height,lt.depth),V)if(M.layerUpdates.size>0){let at=Lu(lt.width,lt.height,M.format,M.type);for(let Et of M.layerUpdates){let Rt=lt.data.subarray(Et*at/lt.data.BYTES_PER_ELEMENT,(Et+1)*at/lt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Et,lt.width,lt.height,1,bt,zt,Rt)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,bt,zt,lt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Mt,lt.width,lt.height,lt.depth,0,bt,zt,lt.data);else if(M.isData3DTexture)Ht?(Kt&&e.texStorage3D(i.TEXTURE_3D,wt,Mt,lt.width,lt.height,lt.depth),V&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,bt,zt,lt.data)):e.texImage3D(i.TEXTURE_3D,0,Mt,lt.width,lt.height,lt.depth,0,bt,zt,lt.data);else if(M.isFramebufferTexture){if(Kt)if(Ht)e.texStorage2D(i.TEXTURE_2D,wt,Mt,lt.width,lt.height);else{let at=lt.width,Et=lt.height;for(let Rt=0;Rt<wt;Rt++)e.texImage2D(i.TEXTURE_2D,Rt,Mt,at,Et,0,bt,zt,null),at>>=1,Et>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in i){let at=i.canvas;if(at.hasAttribute("layoutsubtree")||at.setAttribute("layoutsubtree","true"),lt.parentNode!==at){at.appendChild(lt),d.add(M),at.onpaint=Et=>{let Rt=Et.changedElements;for(let dt of d)Rt.includes(dt.image)&&(dt.needsUpdate=!0)},at.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,lt);else{let Rt=i.RGBA,dt=i.RGBA,qt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Rt,dt,qt,lt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Dt.length>0){if(Ht&&Kt){let at=ne(Dt[0]);e.texStorage2D(i.TEXTURE_2D,wt,Mt,at.width,at.height)}for(let at=0,Et=Dt.length;at<Et;at++)vt=Dt[at],Ht?V&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,bt,zt,vt):e.texImage2D(i.TEXTURE_2D,at,Mt,bt,zt,vt);M.generateMipmaps=!1}else if(Ht){if(Kt){let at=ne(lt);e.texStorage2D(i.TEXTURE_2D,wt,Mt,at.width,at.height)}V&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,zt,lt)}else e.texImage2D(i.TEXTURE_2D,0,Mt,bt,zt,lt);p(M)&&_(J),_t.__version=mt.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function W(C,M,q){if(M.image.length!==6)return;let J=G(C,M),it=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+q);let mt=n.get(it);if(it.version!==mt.__version||J===!0){e.activeTexture(i.TEXTURE0+q);let _t=oe.getPrimaries(oe.workingColorSpace),rt=M.colorSpace===Ki?null:oe.getPrimaries(M.colorSpace),lt=M.colorSpace===Ki||_t===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);let bt=M.isCompressedTexture||M.image[0].isCompressedTexture,zt=M.image[0]&&M.image[0].isDataTexture,Mt=[];for(let dt=0;dt<6;dt++)!bt&&!zt?Mt[dt]=g(M.image[dt],!0,s.maxCubemapSize):Mt[dt]=zt?M.image[dt].image:M.image[dt],Mt[dt]=he(M,Mt[dt]);let vt=Mt[0],Dt=r.convert(M.format,M.colorSpace),Ht=r.convert(M.type),Kt=y(M.internalFormat,Dt,Ht,M.normalized,M.colorSpace),V=M.isVideoTexture!==!0,wt=mt.__version===void 0||J===!0,at=it.dataReady,Et=E(M,vt);Gt(i.TEXTURE_CUBE_MAP,M);let Rt;if(bt){V&&wt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,Kt,vt.width,vt.height);for(let dt=0;dt<6;dt++){Rt=Mt[dt].mipmaps;for(let qt=0;qt<Rt.length;qt++){let Ot=Rt[qt];M.format!==Ln?Dt!==null?V?at&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt,0,0,Ot.width,Ot.height,Dt,Ot.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt,Kt,Ot.width,Ot.height,0,Ot.data):Zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt,0,0,Ot.width,Ot.height,Dt,Ht,Ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt,Kt,Ot.width,Ot.height,0,Dt,Ht,Ot.data)}}}else{if(Rt=M.mipmaps,V&&wt){Rt.length>0&&Et++;let dt=ne(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,Kt,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(zt){V?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Mt[dt].width,Mt[dt].height,Dt,Ht,Mt[dt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Kt,Mt[dt].width,Mt[dt].height,0,Dt,Ht,Mt[dt].data);for(let qt=0;qt<Rt.length;qt++){let Re=Rt[qt].image[dt].image;V?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt+1,0,0,Re.width,Re.height,Dt,Ht,Re.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt+1,Kt,Re.width,Re.height,0,Dt,Ht,Re.data)}}else{V?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Dt,Ht,Mt[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Kt,Dt,Ht,Mt[dt]);for(let qt=0;qt<Rt.length;qt++){let Ot=Rt[qt];V?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt+1,0,0,Dt,Ht,Ot.image[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,qt+1,Kt,Dt,Ht,Ot.image[dt])}}}p(M)&&_(i.TEXTURE_CUBE_MAP),mt.__version=it.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function $(C,M,q,J,it,mt){let _t=r.convert(q.format,q.colorSpace),rt=r.convert(q.type),lt=y(q.internalFormat,_t,rt,q.normalized,q.colorSpace),bt=n.get(M),zt=n.get(q);if(zt.__renderTarget=M,!bt.__hasExternalTextures){let Mt=Math.max(1,M.width>>mt),vt=Math.max(1,M.height>>mt);it===i.TEXTURE_3D||it===i.TEXTURE_2D_ARRAY?e.texImage3D(it,mt,lt,Mt,vt,M.depth,0,_t,rt,null):e.texImage2D(it,mt,lt,Mt,vt,0,_t,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),Xt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,it,zt.__webglTexture,0,Wt(M)):(it===i.TEXTURE_2D||it>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,it,zt.__webglTexture,mt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(C,M,q){if(i.bindRenderbuffer(i.RENDERBUFFER,C),M.depthBuffer){let J=M.depthTexture,it=J&&J.isDepthTexture?J.type:null,mt=S(M.stencilBuffer,it),_t=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Xt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt(M),mt,M.width,M.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt(M),mt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,mt,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,C)}else{let J=M.textures;for(let it=0;it<J.length;it++){let mt=J[it],_t=r.convert(mt.format,mt.colorSpace),rt=r.convert(mt.type),lt=y(mt.internalFormat,_t,rt,mt.normalized,mt.colorSpace);Xt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt(M),lt,M.width,M.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt(M),lt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,lt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ht(C,M,q){let J=M.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let it=n.get(M.depthTexture);if(it.__renderTarget=M,(!it.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),J){if(it.__webglInit===void 0&&(it.__webglInit=!0,M.depthTexture.addEventListener("dispose",w)),it.__webglTexture===void 0){it.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),Gt(i.TEXTURE_CUBE_MAP,M.depthTexture);let bt=r.convert(M.depthTexture.format),zt=r.convert(M.depthTexture.type),Mt;M.depthTexture.format===Li?Mt=i.DEPTH_COMPONENT24:M.depthTexture.format===Fi&&(Mt=i.DEPTH24_STENCIL8);for(let vt=0;vt<6;vt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,Mt,M.width,M.height,0,bt,zt,null)}}else ot(M.depthTexture,0);let mt=it.__webglTexture,_t=Wt(M),rt=J?i.TEXTURE_CUBE_MAP_POSITIVE_X+q:i.TEXTURE_2D,lt=M.depthTexture.format===Fi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(M.depthTexture.format===Li)Xt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,rt,mt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,lt,rt,mt,0);else if(M.depthTexture.format===Fi)Xt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,rt,mt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,lt,rt,mt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Z(C){let M=n.get(C),q=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){let J=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),J){let it=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,J.removeEventListener("dispose",it)};J.addEventListener("dispose",it),M.__depthDisposeCallback=it}M.__boundDepthTexture=J}if(C.depthTexture&&!M.__autoAllocateDepthBuffer)if(q)for(let J=0;J<6;J++)ht(M.__webglFramebuffer[J],C,J);else{let J=C.texture.mipmaps;J&&J.length>0?ht(M.__webglFramebuffer[0],C,0):ht(M.__webglFramebuffer,C,0)}else if(q){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]===void 0)M.__webglDepthbuffer[J]=i.createRenderbuffer(),ut(M.__webglDepthbuffer[J],C,!1);else{let it=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=M.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,mt)}}else{let J=C.texture.mipmaps;if(J&&J.length>0?e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),ut(M.__webglDepthbuffer,C,!1);else{let it=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,mt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function et(C,M,q){let J=n.get(C);M!==void 0&&$(J.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&Z(C)}function st(C){let M=C.texture,q=n.get(C),J=n.get(M);C.addEventListener("dispose",x);let it=C.textures,mt=C.isWebGLCubeRenderTarget===!0,_t=it.length>1;if(_t||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=M.version,o.memory.textures++),mt){q.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(M.mipmaps&&M.mipmaps.length>0){q.__webglFramebuffer[rt]=[];for(let lt=0;lt<M.mipmaps.length;lt++)q.__webglFramebuffer[rt][lt]=i.createFramebuffer()}else q.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){q.__webglFramebuffer=[];for(let rt=0;rt<M.mipmaps.length;rt++)q.__webglFramebuffer[rt]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(_t)for(let rt=0,lt=it.length;rt<lt;rt++){let bt=n.get(it[rt]);bt.__webglTexture===void 0&&(bt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&Xt(C)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let rt=0;rt<it.length;rt++){let lt=it[rt];q.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[rt]);let bt=r.convert(lt.format,lt.colorSpace),zt=r.convert(lt.type),Mt=y(lt.internalFormat,bt,zt,lt.normalized,lt.colorSpace,C.isXRRenderTarget===!0),vt=Wt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,vt,Mt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,q.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),ut(q.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(mt){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Gt(i.TEXTURE_CUBE_MAP,M);for(let rt=0;rt<6;rt++)if(M.mipmaps&&M.mipmaps.length>0)for(let lt=0;lt<M.mipmaps.length;lt++)$(q.__webglFramebuffer[rt][lt],C,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,lt);else $(q.__webglFramebuffer[rt],C,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);p(M)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let rt=0,lt=it.length;rt<lt;rt++){let bt=it[rt],zt=n.get(bt),Mt=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Mt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,zt.__webglTexture),Gt(Mt,bt),$(q.__webglFramebuffer,C,bt,i.COLOR_ATTACHMENT0+rt,Mt,0),p(bt)&&_(Mt)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(rt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,J.__webglTexture),Gt(rt,M),M.mipmaps&&M.mipmaps.length>0)for(let lt=0;lt<M.mipmaps.length;lt++)$(q.__webglFramebuffer[lt],C,M,i.COLOR_ATTACHMENT0,rt,lt);else $(q.__webglFramebuffer,C,M,i.COLOR_ATTACHMENT0,rt,0);p(M)&&_(rt),e.unbindTexture()}C.depthBuffer&&Z(C)}function ct(C){let M=C.textures;for(let q=0,J=M.length;q<J;q++){let it=M[q];if(p(it)){let mt=T(C),_t=n.get(it).__webglTexture;e.bindTexture(mt,_t),_(mt),e.unbindTexture()}}}let pt=[],Lt=[];function It(C){if(C.samples>0){if(Xt(C)===!1){let M=C.textures,q=C.width,J=C.height,it=i.COLOR_BUFFER_BIT,mt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(C),rt=M.length>1;if(rt)for(let bt=0;bt<M.length;bt++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer);let lt=C.texture.mipmaps;lt&&lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let bt=0;bt<M.length;bt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(it|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(it|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[bt]);let zt=n.get(M[bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,q,J,0,0,q,J,it,i.NEAREST),l===!0&&(pt.length=0,Lt.length=0,pt.push(i.COLOR_ATTACHMENT0+bt),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(pt.push(mt),Lt.push(mt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Lt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let bt=0;bt<M.length;bt++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,_t.__webglColorRenderbuffer[bt]);let zt=n.get(M[bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let M=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Wt(C){return Math.min(s.maxSamples,C.samples)}function Xt(C){let M=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function B(C){let M=o.render.frame;h.get(C)!==M&&(h.set(C,M),C.update())}function he(C,M){let q=C.colorSpace,J=C.format,it=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||q!==Ao&&q!==Ki&&(oe.getTransfer(q)===fe?(J!==Ln||it!==vn)&&Zt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Jt("WebGLTextures: Unsupported texture color space:",q)),M}function ne(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=N,this.getTextureUnits=U,this.setTextureUnits=O,this.setTexture2D=ot,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=tt,this.rebindTextures=et,this.setupRenderTarget=st,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=$,this.useMultisampledRTT=Xt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Ky(i,t){function e(n,s=Ki){let r,o=oe.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===ic)return i.UNSIGNED_SHORT_4_4_4_4;if(n===sc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===yu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Mu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===_u)return i.BYTE;if(n===vu)return i.SHORT;if(n===Xr)return i.UNSIGNED_SHORT;if(n===nc)return i.INT;if(n===xi)return i.UNSIGNED_INT;if(n===ti)return i.FLOAT;if(n===an)return i.HALF_FLOAT;if(n===Su)return i.ALPHA;if(n===bu)return i.RGB;if(n===Ln)return i.RGBA;if(n===Li)return i.DEPTH_COMPONENT;if(n===Fi)return i.DEPTH_STENCIL;if(n===rc)return i.RED;if(n===oc)return i.RED_INTEGER;if(n===Rs)return i.RG;if(n===ac)return i.RG_INTEGER;if(n===lc)return i.RGBA_INTEGER;if(n===ua||n===da||n===fa||n===pa)if(o===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ua)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ua)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===fa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===pa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===cc||n===hc||n===uc||n===dc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===cc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===hc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===uc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===dc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fc||n===pc||n===mc||n===gc||n===xc||n===ma||n===_c)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fc||n===pc)return o===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===mc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===gc)return r.COMPRESSED_R11_EAC;if(n===xc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ma)return r.COMPRESSED_RG11_EAC;if(n===_c)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===vc||n===yc||n===Mc||n===Sc||n===bc||n===wc||n===Ec||n===Tc||n===Ac||n===Rc||n===Cc||n===Pc||n===Ic||n===Lc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===yc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Mc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===wc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ec)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Tc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ac)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Rc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Cc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Pc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ic)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Lc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Dc||n===Uc||n===Nc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Dc)return o===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Uc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Fc||n===Oc||n===ga||n===Bc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Fc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Oc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ga)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Bc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===As?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var jy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qy=`
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

}`,qu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Bo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new De({vertexShader:jy,fragmentShader:Qy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Qt(new _n(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},$u=class extends Di{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,m=null,v=typeof XRWebGLBinding<"u",g=new qu,p={},_=e.getContextAttributes(),T=null,y=null,S=[],E=[],w=new ft,x=null,b=null,R=new ke;R.viewport=new xe;let L=new ke;L.viewport=new xe;let F=[R,L],N=new Zl,U=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(I){let D=S[I];return D===void 0&&(D=new Ur,S[I]=D),D.getTargetRaySpace()},this.getControllerGrip=function(I){let D=S[I];return D===void 0&&(D=new Ur,S[I]=D),D.getGripSpace()},this.getHand=function(I){let D=S[I];return D===void 0&&(D=new Ur,S[I]=D),D.getHandSpace()};function Y(I){let D=E.indexOf(I.inputSource);if(D===-1)return;let k=S[D];k!==void 0&&(k.update(I.inputSource,I.frame,c||o),k.dispatchEvent({type:I.type,data:I.inputSource}))}function X(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",ot);for(let I=0;I<S.length;I++){let D=E[I];D!==null&&(E[I]=null,S[I].disconnect(D))}U=null,O=null,g.reset();for(let I in p)delete p[I];if(t.setRenderTarget(T),f=null,u=null,d=null,s=null,y=null,G.stop(),n.isPresenting=!1,t.setPixelRatio(x),t.setSize(w.width,w.height,!1),b!==null){let I=b.camera;I.fov=b.fov,I.zoom=b.zoom,I.updateProjectionMatrix(),b=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(I){r=I,n.isPresenting===!0&&Zt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(I){a=I,n.isPresenting===!0&&Zt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(I){c=I},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(I){if(s=I,s!==null){if(T=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",X),s.addEventListener("inputsourceschange",ot),_.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(w),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let k=null,W=null,$=null;_.depth&&($=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,k=_.stencil?Fi:Li,W=_.stencil?As:xi);let ut={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ut),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Xe(u.textureWidth,u.textureHeight,{format:Ln,type:vn,depthTexture:new Ni(u.textureWidth,u.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let k={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,k),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Xe(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:vn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),G.setContext(s),G.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ot(I){for(let D=0;D<I.removed.length;D++){let k=I.removed[D],W=E.indexOf(k);W>=0&&(E[W]=null,S[W].disconnect(k))}for(let D=0;D<I.added.length;D++){let k=I.added[D],W=E.indexOf(k);if(W===-1){for(let ut=0;ut<S.length;ut++)if(ut>=E.length){E.push(k),W=ut;break}else if(E[ut]===null){E[ut]=k,W=ut;break}if(W===-1)break}let $=S[W];$&&$.connect(k)}}let H=new P,Q=new P;function tt(I,D,k){H.setFromMatrixPosition(D.matrixWorld),Q.setFromMatrixPosition(k.matrixWorld);let W=H.distanceTo(Q),$=D.projectionMatrix.elements,ut=k.projectionMatrix.elements,ht=$[14]/($[10]-1),Z=$[14]/($[10]+1),et=($[9]+1)/$[5],st=($[9]-1)/$[5],ct=($[8]-1)/$[0],pt=(ut[8]+1)/ut[0],Lt=ht*ct,It=ht*pt,Wt=W/(-ct+pt),Xt=Wt*-ct;if(D.matrixWorld.decompose(I.position,I.quaternion,I.scale),I.translateX(Xt),I.translateZ(Wt),I.matrixWorld.compose(I.position,I.quaternion,I.scale),I.matrixWorldInverse.copy(I.matrixWorld).invert(),$[10]===-1)I.projectionMatrix.copy(D.projectionMatrix),I.projectionMatrixInverse.copy(D.projectionMatrixInverse);else{let B=ht+Wt,he=Z+Wt,ne=Lt-Xt,C=It+(W-Xt),M=et*Z/he*B,q=st*Z/he*B;I.projectionMatrix.makePerspective(ne,C,M,q,B,he),I.projectionMatrixInverse.copy(I.projectionMatrix).invert()}}function gt(I,D){D===null?I.matrixWorld.copy(I.matrix):I.matrixWorld.multiplyMatrices(D.matrixWorld,I.matrix),I.matrixWorldInverse.copy(I.matrixWorld).invert()}this.updateCamera=function(I){if(s===null)return;let D=I.near,k=I.far;g.texture!==null&&(g.depthNear>0&&(D=g.depthNear),g.depthFar>0&&(k=g.depthFar)),N.near=L.near=R.near=D,N.far=L.far=R.far=k,(U!==N.near||O!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),U=N.near,O=N.far),N.layers.mask=I.layers.mask|6,R.layers.mask=N.layers.mask&-5,L.layers.mask=N.layers.mask&-3;let W=I.parent,$=N.cameras;gt(N,W);for(let ut=0;ut<$.length;ut++)gt($[ut],W);$.length===2?tt(N,R,L):N.projectionMatrix.copy(R.projectionMatrix),b===null&&I.isPerspectiveCamera&&(b={camera:I,fov:I.fov,zoom:I.zoom}),xt(I,N,W)};function xt(I,D,k){k===null?I.matrix.copy(D.matrixWorld):(I.matrix.copy(k.matrixWorld),I.matrix.invert(),I.matrix.multiply(D.matrixWorld)),I.matrix.decompose(I.position,I.quaternion,I.scale),I.updateMatrixWorld(!0),I.projectionMatrix.copy(D.projectionMatrix),I.projectionMatrixInverse.copy(D.projectionMatrixInverse),I.isPerspectiveCamera&&(I.fov=Lr*2*Math.atan(1/I.projectionMatrix.elements[5]),I.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(I){l=I,u!==null&&(u.fixedFoveation=I),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=I)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(I){return p[I]};let $t=null;function Gt(I,D){if(h=D.getViewerPose(c||o),m=D,h!==null){let k=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let W=!1;k.length!==N.cameras.length&&(N.cameras.length=0,W=!0);for(let Z=0;Z<k.length;Z++){let et=k[Z],st=null;if(f!==null)st=f.getViewport(et);else{let pt=d.getViewSubImage(u,et);st=pt.viewport,Z===0&&(t.setRenderTargetTextures(y,pt.colorTexture,pt.depthStencilTexture),t.setRenderTarget(y))}let ct=F[Z];ct===void 0&&(ct=new ke,ct.layers.enable(Z),ct.viewport=new xe,F[Z]=ct),ct.matrix.fromArray(et.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(et.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(st.x,st.y,st.width,st.height),Z===0&&(N.matrix.copy(ct.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),W===!0&&N.cameras.push(ct)}let $=s.enabledFeatures;if($&&$.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let Z=d.getDepthInformation(k[0]);Z&&Z.isValid&&Z.texture&&g.init(Z,s.renderState)}if($&&$.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let Z=0;Z<k.length;Z++){let et=k[Z].camera;if(et){let st=p[et];st||(st=new Bo,p[et]=st);let ct=d.getCameraImage(et);st.sourceTexture=ct}}}}for(let k=0;k<S.length;k++){let W=E[k],$=S[k];W!==null&&$!==void 0&&$.update(W,D,c||o)}$t&&$t(I,D),D.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:D}),m=null}let G=new yp;G.setAnimationLoop(Gt),this.setAnimationLoop=function(I){$t=I},this.dispose=function(){}}},t1=new jt,Tp=new ee;Tp.set(-1,0,0,0,1,0,0,0,1);function e1(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Cu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,T,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,_,T):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Fe&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Fe&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let _=t.get(p),T=_.envMap,y=_.envMapRotation;T&&(g.envMap.value=T,g.envMapRotation.value.setFromMatrix4(t1.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Tp),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,_,T){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=T*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fe&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function n1(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,S){let E=S.program;n.uniformBlockBinding(y,E)}function c(y,S){let E=s[y.id];E===void 0&&(g(y),E=h(y),s[y.id]=E,y.addEventListener("dispose",_));let w=S.program;n.updateUBOMapping(y,w);let x=t.render.frame;r[y.id]!==x&&(u(y),r[y.id]=x)}function h(y){let S=d();y.__bindingPointIndex=S;let E=i.createBuffer(),w=y.__size,x=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,w,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,E),E}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return Jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let S=s[y.id],E=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let x=0,b=E.length;x<b;x++){let R=E[x];if(Array.isArray(R))for(let L=0,F=R.length;L<F;L++)f(R[L],x,L,w);else f(R,x,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,S,E,w){if(v(y,S,E,w)===!0){let x=y.__offset,b=y.value;if(Array.isArray(b)){let R=0;for(let L=0;L<b.length;L++){let F=b[L],N=p(F);m(F,y.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(b,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,y.__data)}}function m(y,S,E){typeof y=="number"||typeof y=="boolean"?S[0]=y:y.isMatrix3?(S[0]=y.elements[0],S[1]=y.elements[1],S[2]=y.elements[2],S[3]=0,S[4]=y.elements[3],S[5]=y.elements[4],S[6]=y.elements[5],S[7]=0,S[8]=y.elements[6],S[9]=y.elements[7],S[10]=y.elements[8],S[11]=0):ArrayBuffer.isView(y)?S.set(new y.constructor(y.buffer,y.byteOffset,S.length)):y.toArray(S,E)}function v(y,S,E,w){let x=y.value,b=S+"_"+E;if(w[b]===void 0)return typeof x=="number"||typeof x=="boolean"?w[b]=x:ArrayBuffer.isView(x)?w[b]=x.slice():w[b]=x.clone(),!0;{let R=w[b];if(typeof x=="number"||typeof x=="boolean"){if(R!==x)return w[b]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(R.equals(x)===!1)return R.copy(x),!0}}return!1}function g(y){let S=y.uniforms,E=0,w=16;for(let b=0,R=S.length;b<R;b++){let L=Array.isArray(S[b])?S[b]:[S[b]];for(let F=0,N=L.length;F<N;F++){let U=L[F],O=Array.isArray(U.value)?U.value:[U.value];for(let Y=0,X=O.length;Y<X;Y++){let ot=O[Y],H=p(ot),Q=E%w,tt=Q%H.boundary,gt=Q+tt;E+=tt,gt!==0&&w-gt<H.storage&&(E+=w-gt),U.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=H.storage}}}let x=E%w;return x>0&&(E+=w-x),y.__size=E,y.__cache={},this}function p(y){let S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?Zt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(S.boundary=16,S.storage=y.byteLength):Zt("WebGLRenderer: Unsupported uniform value type.",y),S}function _(y){let S=y.target;S.removeEventListener("dispose",_);let E=o.indexOf(S.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function T(){for(let y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:T}}var i1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Oi=null;function s1(){return Oi===null&&(Oi=new Yi(i1,16,16,Rs,an),Oi.name="DFG_LUT",Oi.minFilter=hn,Oi.magFilter=hn,Oi.wrapS=Ci,Oi.wrapT=Ci,Oi.generateMipmaps=!1,Oi.needsUpdate=!0),Oi}var Kr=class{constructor(t={}){let{canvas:e=Hf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=vn}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let v=f,g=new Set([lc,ac,oc]),p=new Set([vn,xi,Xr,As,ic,sc]),_=new Uint32Array(4),T=new Int32Array(4),y=new P,S=null,E=null,w=[],x=[],b=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,L=!1,F=null,N=null,U=null,O=null;this._outputColorSpace=ze;let Y=0,X=0,ot=null,H=-1,Q=null,tt=new xe,gt=new xe,xt=null,$t=new Yt(0),Gt=0,G=e.width,I=e.height,D=1,k=null,W=null,$=new xe(0,0,G,I),ut=new xe(0,0,G,I),ht=!1,Z=new Fr,et=!1,st=!1,ct=new jt,pt=new P,Lt=new xe,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Wt=!1;function Xt(){return ot===null?D:1}let B=n;function he(A,z){return e.getContext(A,z)}let ne,C,M,q,J,it,mt,_t,rt,lt,bt,zt,Mt,vt,Dt,Ht,Kt,V,wt,at,Et,Rt,dt;try{let A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jl}`),e.addEventListener("webglcontextlost",Re,!1),e.addEventListener("webglcontextrestored",me,!1),e.addEventListener("webglcontextcreationerror",li,!1),B===null){let z="webgl2";if(B=he(z,A),B===null)throw he(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}qt()}catch(A){throw e.removeEventListener("webglcontextlost",Re,!1),e.removeEventListener("webglcontextrestored",me,!1),e.removeEventListener("webglcontextcreationerror",li,!1),Jt("WebGLRenderer: "+A.message),A}function qt(){ne=new uv(B),ne.init(),Et=new Ky(B,ne),C=new ev(B,ne,t,Et),M=new Zy(B,ne),C.reversedDepthBuffer&&u&&M.buffers.depth.setReversed(!0),N=B.createFramebuffer(),U=B.createFramebuffer(),O=B.createFramebuffer(),q=new pv(B),J=new Ny,it=new Jy(B,ne,M,J,C,Et,q),mt=new hv(R),_t=new gg(B),Rt=new Q_(B,_t),rt=new dv(B,_t,q,Rt),lt=new gv(B,rt,_t,Rt,q),V=new mv(B,C,it),Dt=new nv(J),bt=new Uy(R,mt,ne,C,Rt,Dt),zt=new e1(R,J),Mt=new Oy,vt=new Gy(ne),Kt=new j_(R,mt,M,lt,m,l),Ht=new Yy(R,lt,C),dt=new n1(B,q,C,M),wt=new tv(B,ne,q),at=new fv(B,ne,q),q.programs=bt.programs,R.capabilities=C,R.extensions=ne,R.properties=J,R.renderLists=Mt,R.shadowMap=Ht,R.state=M,R.info=q}v!==vn&&(b=new _v(v,e.width,e.height,a,s,r));let Ot=new $u(R,B);this.xr=Ot,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let A=ne.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=ne.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(A){A!==void 0&&(D=A,this.setSize(G,I,!1))},this.getSize=function(A){return A.set(G,I)},this.setSize=function(A,z,nt=!0){if(Ot.isPresenting){Zt("WebGLRenderer: Can't change size while VR device is presenting.");return}G=A,I=z,e.width=Math.floor(A*D),e.height=Math.floor(z*D),nt===!0&&(e.style.width=A+"px",e.style.height=z+"px"),b!==null&&b.setSize(e.width,e.height),this.setViewport(0,0,A,z)},this.getDrawingBufferSize=function(A){return A.set(G*D,I*D).floor()},this.setDrawingBufferSize=function(A,z,nt){G=A,I=z,D=nt,e.width=Math.floor(A*nt),e.height=Math.floor(z*nt),this.setViewport(0,0,A,z)},this.setEffects=function(A){if(v===vn){Jt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let z=0;z<A.length;z++)if(A[z].isOutputPass===!0){Zt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(tt)},this.getViewport=function(A){return A.copy($)},this.setViewport=function(A,z,nt,K){A.isVector4?$.set(A.x,A.y,A.z,A.w):$.set(A,z,nt,K),M.viewport(tt.copy($).multiplyScalar(D).round())},this.getScissor=function(A){return A.copy(ut)},this.setScissor=function(A,z,nt,K){A.isVector4?ut.set(A.x,A.y,A.z,A.w):ut.set(A,z,nt,K),M.scissor(gt.copy(ut).multiplyScalar(D).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(A){M.setScissorTest(ht=A)},this.setOpaqueSort=function(A){k=A},this.setTransparentSort=function(A){W=A},this.getClearColor=function(A){return A.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor(...arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha(...arguments)},this.clear=function(A=!0,z=!0,nt=!0){let K=0;if(A){let j=!1;if(ot!==null){let At=ot.texture.format;j=g.has(At)}if(j){let At=ot.texture.type,Pt=p.has(At),Tt=Kt.getClearColor(),Ut=Kt.getClearAlpha(),kt=Tt.r,ie=Tt.g,le=Tt.b;Pt?(_[0]=kt,_[1]=ie,_[2]=le,_[3]=Ut,B.clearBufferuiv(B.COLOR,0,_)):(T[0]=kt,T[1]=ie,T[2]=le,T[3]=Ut,B.clearBufferiv(B.COLOR,0,T))}else K|=B.COLOR_BUFFER_BIT}z&&(K|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),nt&&(K|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K!==0&&B.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),F=A},this.dispose=function(){e.removeEventListener("webglcontextlost",Re,!1),e.removeEventListener("webglcontextrestored",me,!1),e.removeEventListener("webglcontextcreationerror",li,!1),Kt.dispose(),Mt.dispose(),vt.dispose(),J.dispose(),mt.dispose(),lt.dispose(),Rt.dispose(),dt.dispose(),bt.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",Ed),Ot.removeEventListener("sessionend",Td),ks.stop()};function Re(A){A.preventDefault(),Po("WebGLRenderer: Context Lost."),L=!0}function me(){Po("WebGLRenderer: Context Restored."),L=!1;let A=q.autoReset,z=Ht.enabled,nt=Ht.autoUpdate,K=Ht.needsUpdate,j=Ht.type;qt(),q.autoReset=A,Ht.enabled=z,Ht.autoUpdate=nt,Ht.needsUpdate=K,Ht.type=j}function li(A){Jt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Ti(A){let z=A.target;z.removeEventListener("dispose",Ti),Lm(z)}function Lm(A){Dm(A),J.remove(A)}function Dm(A){let z=J.get(A).programs;z!==void 0&&(z.forEach(function(nt){bt.releaseProgram(nt)}),A.isShaderMaterial&&bt.releaseShaderCache(A))}this.renderBufferDirect=function(A,z,nt,K,j,At){z===null&&(z=It);let Pt=j.isMesh&&j.matrixWorld.determinantAffine()<0,Tt=Fm(A,z,nt,K,j);M.setMaterial(K,Pt);let Ut=nt.index,kt=1;if(K.wireframe===!0){if(Ut=rt.getWireframeAttribute(nt),Ut===void 0)return;kt=2}let ie=nt.drawRange,le=nt.attributes.position,Nt=ie.start*kt,ge=(ie.start+ie.count)*kt;At!==null&&(Nt=Math.max(Nt,At.start*kt),ge=Math.min(ge,(At.start+At.count)*kt)),Ut!==null?(Nt=Math.max(Nt,0),ge=Math.min(ge,Ut.count)):le!=null&&(Nt=Math.max(Nt,0),ge=Math.min(ge,le.count));let Ze=ge-Nt;if(Ze<0||Ze===1/0)return;Rt.setup(j,K,Tt,nt,Ut);let Pe,Te=wt;if(Ut!==null&&(Pe=_t.get(Ut),Te=at,Te.setIndex(Pe)),j.isMesh)K.wireframe===!0?(M.setLineWidth(K.wireframeLinewidth*Xt()),Te.setMode(B.LINES)):Te.setMode(B.TRIANGLES);else if(j.isLine){let mn=K.linewidth;mn===void 0&&(mn=1),M.setLineWidth(mn*Xt()),j.isLineSegments?Te.setMode(B.LINES):j.isLineLoop?Te.setMode(B.LINE_LOOP):Te.setMode(B.LINE_STRIP)}else j.isPoints?Te.setMode(B.POINTS):j.isSprite&&Te.setMode(B.TRIANGLES);if(j.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))Te.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{let mn=j._multiDrawStarts,Ct=j._multiDrawCounts,wn=j._multiDrawCount,de=Ut?_t.get(Ut).bytesPerElement:1,$n=J.get(K).currentProgram.getUniforms();for(let Ai=0;Ai<wn;Ai++)$n.setValue(B,"_gl_DrawID",Ai),Te.render(mn[Ai]/de,Ct[Ai])}else if(j.isInstancedMesh)Te.renderInstances(Nt,Ze,j.count);else if(nt.isInstancedBufferGeometry){let mn=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,Ct=Math.min(nt.instanceCount,mn);Te.renderInstances(Nt,Ze,Ct)}else Te.render(Nt,Ze)};function wd(A,z,nt,K){F!==null&&A.isNodeMaterial&&F.setObject(K,A),et===!0&&Dt.setState(A,nt,!1),A.transparent===!0&&A.side===jn&&A.forceSinglePass===!1?(A.side=Fe,A.needsUpdate=!0,Xa(A,z,K),A.side=ws,A.needsUpdate=!0,Xa(A,z,K),A.side=jn):Xa(A,z,K)}this.compile=function(A,z,nt=null){nt===null&&(nt=A),F!==null&&F.renderStart(A,z,nt),E=vt.get(nt),E.init(z),x.push(E),nt.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(E.pushLight(j),j.castShadow&&E.pushShadow(j))}),A!==nt&&A.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(E.pushLight(j),j.castShadow&&E.pushShadow(j))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),st=this.localClippingEnabled,et=Dt.init(this.clippingPlanes,st),et===!0&&Dt.setGlobalState(this.clippingPlanes,z),F!==null&&Ht.render(E.state.shadowsArray,nt,z);let K=new Set;return A.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;let At=j.material;if(At)if(Array.isArray(At))for(let Pt=0;Pt<At.length;Pt++){let Tt=At[Pt];wd(Tt,nt,z,j),K.add(Tt)}else wd(At,nt,z,j),K.add(At)}),E=x.pop(),F!==null&&F.renderEnd(),K},this.compileAsync=function(A,z,nt=null){let K=this.compile(A,z,nt);return new Promise(j=>{function At(){if(K.forEach(function(Pt){let Ut=J.get(Pt).currentProgram;(Ut===void 0||Ut.isReady())&&K.delete(Pt)}),K.size===0){j(A);return}setTimeout(At,10)}ne.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let Th=null;function Um(A){Th&&Th(A)}function Ed(){ks.stop()}function Td(){ks.start()}let ks=new yp;ks.setAnimationLoop(Um),typeof self<"u"&&ks.setContext(self),this.setAnimationLoop=function(A){Th=A,Ot.setAnimationLoop(A),A===null?ks.stop():ks.start()},Ot.addEventListener("sessionstart",Ed),Ot.addEventListener("sessionend",Td),this.render=function(A,z){if(z!==void 0&&z.isCamera!==!0){Jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;F!==null&&F.renderStart(A,z);let nt=Ot.enabled===!0&&Ot.isPresenting===!0,K=b!==null&&(ot===null||nt)&&b.begin(R,ot);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(z),z=Ot.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,z,ot),E=vt.get(A,x.length),E.init(z),E.state.textureUnits=it.getTextureUnits(),x.push(E),ct.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Z.setFromProjectionMatrix(ct,pi,z.reversedDepth),st=this.localClippingEnabled,et=Dt.init(this.clippingPlanes,st),S=Mt.get(A,w.length),S.init(),w.push(S),Ot.enabled===!0&&Ot.isPresenting===!0){let Pt=R.xr.getDepthSensingMesh();Pt!==null&&Ah(Pt,z,-1/0,R.sortObjects)}Ah(A,z,0,R.sortObjects),S.finish(),F!==null&&F.updateLights(E.state.lightsArray),R.sortObjects===!0&&S.sort(k,W),Wt=Ot.enabled===!1||Ot.isPresenting===!1||Ot.hasDepthSensing()===!1,Wt&&Kt.addToRenderList(S,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),et===!0&&Dt.beginShadows();let j=E.state.shadowsArray;if(Ht.render(j,A,z),et===!0&&Dt.endShadows(),(K&&b.hasRenderPass())===!1){let Pt=S.opaque,Tt=S.transmissive;if(E.setupLights(),z.isArrayCamera){let Ut=z.cameras;if(Tt.length>0)for(let kt=0,ie=Ut.length;kt<ie;kt++){let le=Ut[kt];Rd(Pt,Tt,A,le)}Wt&&Kt.render(A);for(let kt=0,ie=Ut.length;kt<ie;kt++){let le=Ut[kt];Ad(S,A,le,le.viewport)}}else Tt.length>0&&Rd(Pt,Tt,A,z),Wt&&Kt.render(A),Ad(S,A,z)}ot!==null&&X===0&&(it.updateMultisampleRenderTarget(ot),it.updateRenderTargetMipmap(ot)),K&&b.end(R),A.isScene===!0&&A.onAfterRender(R,A,z),Rt.resetDefaultState(),H=-1,Q=null,x.pop(),x.length>0?(E=x[x.length-1],it.setTextureUnits(E.state.textureUnits),et===!0&&Dt.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,w.pop(),w.length>0?S=w[w.length-1]:S=null,F!==null&&F.renderEnd()};function Ah(A,z,nt,K){if(A.visible===!1)return;if(A.layers.test(z.layers)){if(A.isGroup)nt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(z);else if(A.isLightProbeGrid)E.pushLightProbeGrid(A);else if(A.isLight)E.pushLight(A),A.castShadow&&E.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(Z)){K&&Lt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ct);let Pt=lt.update(A),Tt=A.material;Tt.visible&&S.push(A,Pt,Tt,nt,Lt.z,null,z)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(Z))){let Pt=lt.update(A),Tt=A.material;if(K&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Lt.copy(A.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Lt.copy(Pt.boundingSphere.center)),Lt.applyMatrix4(A.matrixWorld).applyMatrix4(ct)),Array.isArray(Tt)){let Ut=Pt.groups;for(let kt=0,ie=Ut.length;kt<ie;kt++){let le=Ut[kt],Nt=Tt[le.materialIndex];Nt&&Nt.visible&&S.push(A,Pt,Nt,nt,Lt.z,le,z)}}else Tt.visible&&S.push(A,Pt,Tt,nt,Lt.z,null,z)}}let At=A.children;for(let Pt=0,Tt=At.length;Pt<Tt;Pt++)Ah(At[Pt],z,nt,K)}function Ad(A,z,nt,K){let{opaque:j,transmissive:At,transparent:Pt}=A;E.setupLightsView(nt),et===!0&&Dt.setGlobalState(R.clippingPlanes,nt),K&&M.viewport(tt.copy(K)),j.length>0&&Wa(j,z,nt),At.length>0&&Wa(At,z,nt),Pt.length>0&&Wa(Pt,z,nt),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Rd(A,z,nt,K){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[K.id]===void 0){let Nt=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[K.id]=new Xe(1,1,{generateMipmaps:!0,type:Nt?an:vn,minFilter:Ts,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:oe.workingColorSpace})}let At=E.state.transmissionRenderTarget[K.id],Pt=K.viewport||tt;At.setSize(Pt.z*R.transmissionResolutionScale,Pt.w*R.transmissionResolutionScale);let Tt=R.getRenderTarget(),Ut=R.getActiveCubeFace(),kt=R.getActiveMipmapLevel();R.setRenderTarget(At),R.getClearColor($t),Gt=R.getClearAlpha(),Gt<1&&R.setClearColor(16777215,.5),R.clear(),Wt&&Kt.render(nt);let ie=R.toneMapping;R.toneMapping=gi;let le=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),E.setupLightsView(K),et===!0&&Dt.setGlobalState(R.clippingPlanes,K),Wa(A,nt,K),it.updateMultisampleRenderTarget(At),it.updateRenderTargetMipmap(At),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let ge=0,Ze=z.length;ge<Ze;ge++){let Pe=z[ge],{object:Te,geometry:mn,material:Ct,group:wn}=Pe;if(Ct.side===jn&&Te.layers.test(K.layers)){let de=Ct.side;Ct.side=Fe,Ct.needsUpdate=!0,Cd(Te,nt,K,mn,Ct,wn),Ct.side=de,Ct.needsUpdate=!0,Nt=!0}}Nt===!0&&(it.updateMultisampleRenderTarget(At),it.updateRenderTargetMipmap(At))}R.setRenderTarget(Tt,Ut,kt),R.setClearColor($t,Gt),le!==void 0&&(K.viewport=le),R.toneMapping=ie}function Wa(A,z,nt){let K=z.isScene===!0?z.overrideMaterial:null;for(let j=0,At=A.length;j<At;j++){let Pt=A[j],{object:Tt,geometry:Ut,group:kt}=Pt,ie=Pt.material;ie.allowOverride===!0&&K!==null&&(ie=K),Tt.layers.test(nt.layers)&&Cd(Tt,z,nt,Ut,ie,kt)}}function Cd(A,z,nt,K,j,At){F!==null&&j.isNodeMaterial&&F.setObject(A,j),A.onBeforeRender(R,z,nt,K,j,At),A.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),j.onBeforeRender(R,z,nt,K,A,At),j.transparent===!0&&j.side===jn&&j.forceSinglePass===!1?(j.side=Fe,j.needsUpdate=!0,R.renderBufferDirect(nt,z,K,j,A,At),j.side=ws,j.needsUpdate=!0,R.renderBufferDirect(nt,z,K,j,A,At),j.side=jn):R.renderBufferDirect(nt,z,K,j,A,At),A.onAfterRender(R,z,nt,K,j,At)}function Xa(A,z,nt){z.isScene!==!0&&(z=It);let K=J.get(A),j=E.state.lights,At=E.state.shadowsArray,Pt=j.state.version,Tt=bt.getParameters(A,j.state,At,z,nt,E.state.lightProbeGridArray),Ut=bt.getProgramCacheKey(Tt),kt=K.programs;K.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?z.environment:null,K.fog=z.fog;let ie=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;K.envMap=mt.get(A.envMap||K.environment,ie),K.envMapRotation=K.environment!==null&&A.envMap===null?z.environmentRotation:A.envMapRotation,kt===void 0&&(A.addEventListener("dispose",Ti),kt=new Map,K.programs=kt);let le=kt.get(Ut);if(le!==void 0){if(K.currentProgram===le&&K.lightsStateVersion===Pt)return Id(A,Tt),le}else Tt.uniforms=bt.getUniforms(A),F!==null&&A.isNodeMaterial&&F.build(A,nt,Tt),A.onBeforeCompile(Tt,R),le=bt.acquireProgram(Tt,Ut),kt.set(Ut,le),K.uniforms=Tt.uniforms;let Nt=K.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Nt.clippingPlanes=Dt.uniform),Id(A,Tt),K.needsLights=Bm(A),K.lightsStateVersion=Pt,K.needsLights&&(Nt.ambientLightColor.value=j.state.ambient,Nt.lightProbe.value=j.state.probe,Nt.sunLights.value=j.state.sun,Nt.sunLightShadows.value=j.state.sunShadow,Nt.directionalLights.value=j.state.directional,Nt.directionalLightShadows.value=j.state.directionalShadow,Nt.spotLights.value=j.state.spot,Nt.spotLightShadows.value=j.state.spotShadow,Nt.rectAreaLights.value=j.state.rectArea,Nt.ltc_1.value=j.state.rectAreaLTC1,Nt.ltc_2.value=j.state.rectAreaLTC2,Nt.pointLights.value=j.state.point,Nt.pointLightShadows.value=j.state.pointShadow,Nt.hemisphereLights.value=j.state.hemi,Nt.sunShadowMatrix.value=j.state.sunShadowMatrix,Nt.sunShadowCascade.value=j.state.sunShadowCascade,Nt.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Nt.spotLightMatrix.value=j.state.spotLightMatrix,Nt.spotLightMap.value=j.state.spotLightMap,Nt.pointShadowMatrix.value=j.state.pointShadowMatrix),K.lightProbeGrid=E.state.lightProbeGridArray.length>0,K.currentProgram=le,K.uniformsList=null,le}function Pd(A){if(A.uniformsList===null){let z=A.currentProgram.getUniforms();A.uniformsList=Zr.seqWithValue(z.seq,A.uniforms)}return A.uniformsList}function Id(A,z){let nt=J.get(A);nt.outputColorSpace=z.outputColorSpace,nt.batching=z.batching,nt.batchingColor=z.batchingColor,nt.instancing=z.instancing,nt.instancingColor=z.instancingColor,nt.instancingMorph=z.instancingMorph,nt.skinning=z.skinning,nt.morphTargets=z.morphTargets,nt.morphNormals=z.morphNormals,nt.morphColors=z.morphColors,nt.morphTargetsCount=z.morphTargetsCount,nt.numClippingPlanes=z.numClippingPlanes,nt.numIntersection=z.numClipIntersection,nt.vertexAlphas=z.vertexAlphas,nt.vertexTangents=z.vertexTangents,nt.toneMapping=z.toneMapping}function Nm(A,z){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;y.setFromMatrixPosition(z.matrixWorld);for(let nt=0,K=A.length;nt<K;nt++){let j=A[nt];if(j.texture!==null&&j.boundingBox.containsPoint(y))return j}return null}function Fm(A,z,nt,K,j){z.isScene!==!0&&(z=It),it.resetTextureUnits();let At=z.fog,Pt=K.isMeshStandardMaterial||K.isMeshLambertMaterial||K.isMeshPhongMaterial?z.environment:null,Tt=ot===null?R.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:oe.workingColorSpace,Ut=K.isMeshStandardMaterial||K.isMeshLambertMaterial&&!K.envMap||K.isMeshPhongMaterial&&!K.envMap,kt=mt.get(K.envMap||Pt,Ut),ie=K.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,le=!!nt.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Nt=!!nt.morphAttributes.position,ge=!!nt.morphAttributes.normal,Ze=!!nt.morphAttributes.color,Pe=gi;K.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Pe=R.toneMapping);let Te=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,mn=Te!==void 0?Te.length:0,Ct=J.get(K),wn=E.state.lights;if(et===!0&&(st===!0||A!==Q)){let Ce=A===Q&&K.id===H;Dt.setState(K,A,Ce)}let de=!1;K.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==wn.state.version||Ct.outputColorSpace!==Tt||j.isBatchedMesh&&Ct.batching===!1||!j.isBatchedMesh&&Ct.batching===!0||j.isBatchedMesh&&Ct.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&Ct.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&Ct.instancing===!1||!j.isInstancedMesh&&Ct.instancing===!0||j.isSkinnedMesh&&Ct.skinning===!1||!j.isSkinnedMesh&&Ct.skinning===!0||j.isInstancedMesh&&Ct.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Ct.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Ct.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Ct.instancingMorph===!1&&j.morphTexture!==null||Ct.envMap!==kt||K.fog===!0&&Ct.fog!==At||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==Dt.numPlanes||Ct.numIntersection!==Dt.numIntersection)||Ct.vertexAlphas!==ie||Ct.vertexTangents!==le||Ct.morphTargets!==Nt||Ct.morphNormals!==ge||Ct.morphColors!==Ze||Ct.toneMapping!==Pe||Ct.morphTargetsCount!==mn||!!Ct.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(de=!0):(de=!0,Ct.__version=K.version);let $n=Ct.currentProgram;de===!0&&($n=Xa(K,z,j),F&&K.isNodeMaterial&&F.onUpdateProgram(K,$n,Ct));let Ai=!1,os=!1,hr=!1,be=$n.getUniforms(),He=Ct.uniforms;if(M.useProgram($n.program)&&(Ai=!0,os=!0,hr=!0),K.id!==H&&(H=K.id,os=!0),Ct.needsLights){let Ce=Nm(E.state.lightProbeGridArray,j);Ct.lightProbeGrid!==Ce&&(Ct.lightProbeGrid=Ce,os=!0)}if(Ai||Q!==A){M.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),be.setValue(B,"projectionMatrix",A.projectionMatrix),be.setValue(B,"viewMatrix",A.matrixWorldInverse);let ls=be.map.cameraPosition;ls!==void 0&&ls.setValue(B,pt.setFromMatrixPosition(A.matrixWorld)),C.logarithmicDepthBuffer&&be.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&be.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),Q!==A&&(Q=A,os=!0,hr=!0)}if(Ct.needsLights&&(wn.state.sunShadowMap.length>0&&be.setValue(B,"sunShadowMap",wn.state.sunShadowMap,it),wn.state.directionalShadowMap.length>0&&be.setValue(B,"directionalShadowMap",wn.state.directionalShadowMap,it),wn.state.spotShadowMap.length>0&&be.setValue(B,"spotShadowMap",wn.state.spotShadowMap,it),wn.state.pointShadowMap.length>0&&be.setValue(B,"pointShadowMap",wn.state.pointShadowMap,it)),j.isSkinnedMesh){be.setOptional(B,j,"bindMatrix"),be.setOptional(B,j,"bindMatrixInverse");let Ce=j.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),be.setValue(B,"boneTexture",Ce.boneTexture,it))}j.isBatchedMesh&&(be.setOptional(B,j,"batchingTexture"),be.setValue(B,"batchingTexture",j._matricesTexture,it),be.setOptional(B,j,"batchingIdTexture"),be.setValue(B,"batchingIdTexture",j._indirectTexture,it),be.setOptional(B,j,"batchingColorTexture"),j._colorsTexture!==null&&be.setValue(B,"batchingColorTexture",j._colorsTexture,it));let as=nt.morphAttributes;if((as.position!==void 0||as.normal!==void 0||as.color!==void 0)&&V.update(j,nt,$n),(os||Ct.receiveShadow!==j.receiveShadow)&&(Ct.receiveShadow=j.receiveShadow,be.setValue(B,"receiveShadow",j.receiveShadow)),(K.isMeshStandardMaterial||K.isMeshLambertMaterial||K.isMeshPhongMaterial)&&K.envMap===null&&z.environment!==null&&(He.envMapIntensity.value=z.environmentIntensity),He.dfgLUT!==void 0&&(He.dfgLUT.value=s1()),os){if(be.setValue(B,"toneMappingExposure",R.toneMappingExposure),Ct.needsLights&&Om(He,hr),At&&K.fog===!0&&zt.refreshFogUniforms(He,At),zt.refreshMaterialUniforms(He,K,D,I,E.state.transmissionRenderTarget[A.id]),Ct.needsLights&&Ct.lightProbeGrid){let Ce=Ct.lightProbeGrid;He.probesSH.value=Ce.texture,He.probesMin.value.copy(Ce.boundingBox.min),He.probesMax.value.copy(Ce.boundingBox.max),He.probesResolution.value.copy(Ce.resolution)}Zr.upload(B,Pd(Ct),He,it)}if(K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Zr.upload(B,Pd(Ct),He,it),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&be.setValue(B,"center",j.center),be.setValue(B,"modelViewMatrix",j.modelViewMatrix),be.setValue(B,"normalMatrix",j.normalMatrix),be.setValue(B,"modelMatrix",j.matrixWorld),K.uniformsGroups!==void 0){let Ce=K.uniformsGroups;for(let ls=0,ur=Ce.length;ls<ur;ls++){let Dd=Ce[ls];dt.update(Dd,$n),dt.bind(Dd,$n)}}return $n}function Om(A,z){A.ambientLightColor.needsUpdate=z,A.lightProbe.needsUpdate=z,A.sunLights.needsUpdate=z,A.sunLightShadows.needsUpdate=z,A.directionalLights.needsUpdate=z,A.directionalLightShadows.needsUpdate=z,A.pointLights.needsUpdate=z,A.pointLightShadows.needsUpdate=z,A.spotLights.needsUpdate=z,A.spotLightShadows.needsUpdate=z,A.rectAreaLights.needsUpdate=z,A.hemisphereLights.needsUpdate=z}function Bm(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return ot},this.setRenderTargetTextures=function(A,z,nt){let K=J.get(A);K.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),J.get(A.texture).__webglTexture=z,J.get(A.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:nt,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,z){let nt=J.get(A);nt.__webglFramebuffer=z,nt.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(A,z=0,nt=0){ot=A,Y=z,X=nt;let K=null,j=!1,At=!1;if(A){let Tt=J.get(A);if(Tt.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(B.FRAMEBUFFER,Tt.__webglFramebuffer),tt.copy(A.viewport),gt.copy(A.scissor),xt=A.scissorTest,M.viewport(tt),M.scissor(gt),M.setScissorTest(xt),H=-1;return}else if(Tt.__webglFramebuffer===void 0)it.setupRenderTarget(A);else if(Tt.__hasExternalTextures)it.rebindTextures(A,J.get(A.texture).__webglTexture,J.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let ie=A.depthTexture;if(Tt.__boundDepthTexture!==ie){if(ie!==null&&J.has(ie)&&(A.width!==ie.image.width||A.height!==ie.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");it.setupDepthRenderbuffer(A)}}let Ut=A.texture;(Ut.isData3DTexture||Ut.isDataArrayTexture||Ut.isCompressedArrayTexture)&&(At=!0);let kt=J.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(kt[z])?K=kt[z][nt]:K=kt[z],j=!0):A.samples>0&&it.useMultisampledRTT(A)===!1?K=J.get(A).__webglMultisampledFramebuffer:Array.isArray(kt)?K=kt[nt]:K=kt,tt.copy(A.viewport),gt.copy(A.scissor),xt=A.scissorTest}else tt.copy($).multiplyScalar(D).floor(),gt.copy(ut).multiplyScalar(D).floor(),xt=ht;if(nt!==0&&(K=N),M.bindFramebuffer(B.FRAMEBUFFER,K)&&M.drawBuffers(A,K),M.viewport(tt),M.scissor(gt),M.setScissorTest(xt),j){let Tt=J.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+z,Tt.__webglTexture,nt)}else if(At){let Tt=z;for(let Ut=0;Ut<A.textures.length;Ut++){let kt=J.get(A.textures[Ut]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ut,kt.__webglTexture,nt,Tt)}}else if(A!==null&&nt!==0){let Tt=J.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Tt.__webglTexture,nt)}H=-1};function Ld(A){let z=J.get(A);return(z.__readFormat!==A.format||z.__readType!==A.type)&&(z.__readFormat=A.format,z.__readType=A.type,z.__formatReadable=C.textureFormatReadable(A.format),z.__typeReadable=C.textureTypeReadable(A.type)),z}this.readRenderTargetPixels=function(A,z,nt,K,j,At,Pt,Tt=0){if(!(A&&A.isWebGLRenderTarget)){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=J.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Ut=Ut[Pt]),Ut){M.bindFramebuffer(B.FRAMEBUFFER,Ut);try{let kt=A.textures[Tt],ie=kt.format,le=kt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Tt);let Nt=Ld(kt);if(Nt.__formatReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Nt.__typeReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=A.width-K&&nt>=0&&nt<=A.height-j&&B.readPixels(z,nt,K,j,Et.convert(ie),Et.convert(le),At)}finally{let kt=ot!==null?J.get(ot).__webglFramebuffer:null;M.bindFramebuffer(B.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(A,z,nt,K,j,At,Pt,Tt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ut=J.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Ut=Ut[Pt]),Ut)if(z>=0&&z<=A.width-K&&nt>=0&&nt<=A.height-j){M.bindFramebuffer(B.FRAMEBUFFER,Ut);let kt=A.textures[Tt],ie=kt.format,le=kt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Tt);let Nt=Ld(kt);if(Nt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Nt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ge=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,ge),B.bufferData(B.PIXEL_PACK_BUFFER,At.byteLength,B.STREAM_READ),B.readPixels(z,nt,K,j,Et.convert(ie),Et.convert(le),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Ze=ot!==null?J.get(ot).__webglFramebuffer:null;M.bindFramebuffer(B.FRAMEBUFFER,Ze);let Pe=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Wf(B,Pe,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,ge),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,At),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(ge),B.deleteSync(Pe),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,z=null,nt=0){let K=Math.pow(2,-nt),j=Math.floor(A.image.width*K),At=Math.floor(A.image.height*K),Pt=z!==null?z.x:0,Tt=z!==null?z.y:0;it.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,nt,0,0,Pt,Tt,j,At),M.unbindTexture()},this.copyTextureToTexture=function(A,z,nt=null,K=null,j=0,At=0){let Pt,Tt,Ut,kt,ie,le,Nt,ge,Ze,Pe=A.isCompressedTexture?A.mipmaps[At]:A.image;if(nt!==null)Pt=nt.max.x-nt.min.x,Tt=nt.max.y-nt.min.y,Ut=nt.isBox3?nt.max.z-nt.min.z:1,kt=nt.min.x,ie=nt.min.y,le=nt.isBox3?nt.min.z:0;else{let He=Math.pow(2,-j);Pt=Math.floor(Pe.width*He),Tt=Math.floor(Pe.height*He),A.isDataArrayTexture?Ut=Pe.depth:A.isData3DTexture?Ut=Math.floor(Pe.depth*He):Ut=1,kt=0,ie=0,le=0}K!==null?(Nt=K.x,ge=K.y,Ze=K.z):(Nt=0,ge=0,Ze=0);let Te=Et.convert(z.format),mn=Et.convert(z.type),Ct;z.isData3DTexture?(it.setTexture3D(z,0),Ct=B.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(it.setTexture2DArray(z,0),Ct=B.TEXTURE_2D_ARRAY):(it.setTexture2D(z,0),Ct=B.TEXTURE_2D),M.activeTexture(B.TEXTURE0),M.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,z.flipY),M.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),M.pixelStorei(B.UNPACK_ALIGNMENT,z.unpackAlignment);let wn=M.getParameter(B.UNPACK_ROW_LENGTH),de=M.getParameter(B.UNPACK_IMAGE_HEIGHT),$n=M.getParameter(B.UNPACK_SKIP_PIXELS),Ai=M.getParameter(B.UNPACK_SKIP_ROWS),os=M.getParameter(B.UNPACK_SKIP_IMAGES);M.pixelStorei(B.UNPACK_ROW_LENGTH,Pe.width),M.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Pe.height),M.pixelStorei(B.UNPACK_SKIP_PIXELS,kt),M.pixelStorei(B.UNPACK_SKIP_ROWS,ie),M.pixelStorei(B.UNPACK_SKIP_IMAGES,le);let hr=A.isDataArrayTexture||A.isData3DTexture,be=z.isDataArrayTexture||z.isData3DTexture;if(A.isDepthTexture){let He=J.get(A),as=J.get(z),Ce=J.get(He.__renderTarget),ls=J.get(as.__renderTarget);M.bindFramebuffer(B.READ_FRAMEBUFFER,Ce.__webglFramebuffer),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,ls.__webglFramebuffer);for(let ur=0;ur<Ut;ur++)hr&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,J.get(A).__webglTexture,j,le+ur),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,J.get(z).__webglTexture,At,Ze+ur)),B.blitFramebuffer(kt,ie,Pt,Tt,Nt,ge,Pt,Tt,B.DEPTH_BUFFER_BIT,B.NEAREST);M.bindFramebuffer(B.READ_FRAMEBUFFER,null),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(j!==0||A.isRenderTargetTexture||J.has(A)){let He=J.get(A),as=J.get(z);M.bindFramebuffer(B.READ_FRAMEBUFFER,U),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,O);for(let Ce=0;Ce<Ut;Ce++)hr?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,He.__webglTexture,j,le+Ce):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,He.__webglTexture,j),be?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,as.__webglTexture,At,Ze+Ce):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,as.__webglTexture,At),j!==0?B.blitFramebuffer(kt,ie,Pt,Tt,Nt,ge,Pt,Tt,B.COLOR_BUFFER_BIT,B.NEAREST):be?B.copyTexSubImage3D(Ct,At,Nt,ge,Ze+Ce,kt,ie,Pt,Tt):B.copyTexSubImage2D(Ct,At,Nt,ge,kt,ie,Pt,Tt);M.bindFramebuffer(B.READ_FRAMEBUFFER,null),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else be?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(Ct,At,Nt,ge,Ze,Pt,Tt,Ut,Te,mn,Pe.data):z.isCompressedArrayTexture?B.compressedTexSubImage3D(Ct,At,Nt,ge,Ze,Pt,Tt,Ut,Te,Pe.data):B.texSubImage3D(Ct,At,Nt,ge,Ze,Pt,Tt,Ut,Te,mn,Pe):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,At,Nt,ge,Pt,Tt,Te,mn,Pe.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,At,Nt,ge,Pe.width,Pe.height,Te,Pe.data):B.texSubImage2D(B.TEXTURE_2D,At,Nt,ge,Pt,Tt,Te,mn,Pe);M.pixelStorei(B.UNPACK_ROW_LENGTH,wn),M.pixelStorei(B.UNPACK_IMAGE_HEIGHT,de),M.pixelStorei(B.UNPACK_SKIP_PIXELS,$n),M.pixelStorei(B.UNPACK_SKIP_ROWS,Ai),M.pixelStorei(B.UNPACK_SKIP_IMAGES,os),At===0&&z.generateMipmaps&&B.generateMipmap(Ct),M.unbindTexture()},this.initRenderTarget=function(A){J.get(A).__webglFramebuffer===void 0&&it.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?it.setTextureCube(A,0):A.isData3DTexture?it.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?it.setTexture2DArray(A,0):it.setTexture2D(A,0),M.unbindTexture()},this.resetState=function(){Y=0,X=0,ot=null,M.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}};var ya=new P;function ei(i,t,e,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;ya.copy(t),ya[n]=0,ya.normalize();let c=.5*o/(o+a),h=1-ya.angleTo(i)/l;return Math.sign(ya[e])===1?h*c:a/(o+a)+c+c*(1-h)}var qc=class i extends Ke{constructor(t=1,e=1,n=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new P,c=new P,h=new P(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,m=d.length/6,v=new P,g=.5/o;for(let p=0,_=0;p<d.length;p+=3,_+=2)switch(l.fromArray(d,p),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),d[p+0]=h.x*Math.sign(l.x)+c.x*r,d[p+1]=h.y*Math.sign(l.y)+c.y*r,d[p+2]=h.z*Math.sign(l.z)+c.z*r,u[p+0]=c.x,u[p+1]=c.y,u[p+2]=c.z,Math.floor(p/m)){case 0:v.set(1,0,0),f[_+0]=ei(v,c,"z","y",r,n),f[_+1]=1-ei(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[_+0]=1-ei(v,c,"z","y",r,n),f[_+1]=1-ei(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[_+0]=1-ei(v,c,"x","z",r,t),f[_+1]=ei(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[_+0]=1-ei(v,c,"x","z",r,t),f[_+1]=1-ei(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[_+0]=1-ei(v,c,"x","y",r,t),f[_+1]=1-ei(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[_+0]=ei(v,c,"x","y",r,t),f[_+1]=1-ei(v,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};var Qr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Gn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},r1=new Ss(-1,1,1,-1,0,1),Yu=class extends we{constructor(){super(),this.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ae([0,2,0,0,2,0],2))}},o1=new Yu,Cs=class{constructor(t){this._mesh=new Qt(o1,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,r1)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var $c=class extends Gn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof De?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Rn.clone(t.uniforms),this.material=new De({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Cs(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ma=class extends Gn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Yc=class extends Gn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var Zc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new ft);this._width=n.width,this._height=n.height,e=new Xe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:an}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $c(Qr),this.copyPass.material.blending=$e,this.timer=new ta}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ma!==void 0&&(o instanceof Ma?n=!0:o instanceof Yc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new ft);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Sa={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ft},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new jt},cameraProjectionMatrixInverse:{value:new jt},cameraWorldMatrix:{value:new jt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

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
		}`},ba={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},Jc={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function Ap(i=5){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=a1(t),n=e.length,s=new Uint8Array(n*4);for(let o=0;o<n;++o){let a=e[o],l=2*Math.PI*a/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new Yi(s,t,t);return r.wrapS=Ii,r.wrapT=Ii,r.needsUpdate=!0,r}function a1(i){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=t*t,n=Array(e).fill(0),s=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(s===-1&&r===t?(r=t-2,s=0):(r===t&&(r=0),s<0&&(s=t-1)),n[s*t+r]!==0){r-=2,s++;continue}else n[s*t+r]=o++;r++,s--}return n}var wa={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Zu(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ft},cameraProjectionMatrixInverse:{value:new jt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function Zu(i,t,e){let n=l1(i,t,e),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let o=n[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<i-1?",":")"}`}return s}function l1(i,t,e){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*t*s/i,o=Math.pow(s/(i-1),e);n.push(new P(Math.cos(r),Math.sin(r),o))}return n}var Kc=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,d=(l+c)*h,u=l-d,f=c-d,m=t-u,v=e-f,g,p;m>v?(g=1,p=0):(g=0,p=1);let _=m-g+h,T=v-p+h,y=m-1+2*h,S=v-1+2*h,E=l&255,w=c&255,x=this.perm[E+this.perm[w]]%12,b=this.perm[E+g+this.perm[w+p]]%12,R=this.perm[E+1+this.perm[w+1]]%12,L=.5-m*m-v*v;L<0?n=0:(L*=L,n=L*L*this._dot(this.grad3[x],m,v));let F=.5-_*_-T*T;F<0?s=0:(F*=F,s=F*F*this._dot(this.grad3[b],_,T));let N=.5-y*y-S*S;return N<0?r=0:(N*=N,r=N*N*this._dot(this.grad3[R],y,S)),70*(n+s+r)}noise3d(t,e,n){let s,r,o,a,c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),d=Math.floor(e+c),u=Math.floor(n+c),f=1/6,m=(h+d+u)*f,v=h-m,g=d-m,p=u-m,_=t-v,T=e-g,y=n-p,S,E,w,x,b,R;_>=T?T>=y?(S=1,E=0,w=0,x=1,b=1,R=0):_>=y?(S=1,E=0,w=0,x=1,b=0,R=1):(S=0,E=0,w=1,x=1,b=0,R=1):T<y?(S=0,E=0,w=1,x=0,b=1,R=1):_<y?(S=0,E=1,w=0,x=0,b=1,R=1):(S=0,E=1,w=0,x=1,b=1,R=0);let L=_-S+f,F=T-E+f,N=y-w+f,U=_-x+2*f,O=T-b+2*f,Y=y-R+2*f,X=_-1+3*f,ot=T-1+3*f,H=y-1+3*f,Q=h&255,tt=d&255,gt=u&255,xt=this.perm[Q+this.perm[tt+this.perm[gt]]]%12,$t=this.perm[Q+S+this.perm[tt+E+this.perm[gt+w]]]%12,Gt=this.perm[Q+x+this.perm[tt+b+this.perm[gt+R]]]%12,G=this.perm[Q+1+this.perm[tt+1+this.perm[gt+1]]]%12,I=.6-_*_-T*T-y*y;I<0?s=0:(I*=I,s=I*I*this._dot3(this.grad3[xt],_,T,y));let D=.6-L*L-F*F-N*N;D<0?r=0:(D*=D,r=D*D*this._dot3(this.grad3[$t],L,F,N));let k=.6-U*U-O*O-Y*Y;k<0?o=0:(k*=k,o=k*k*this._dot3(this.grad3[Gt],U,O,Y));let W=.6-X*X-ot*ot-H*H;return W<0?a=0:(W*=W,a=W*W*this._dot3(this.grad3[G],X,ot,H)),32*(s+r+o+a)}noise4d(t,e,n,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,d,u,f,m,v=(t+e+n+s)*l,g=Math.floor(t+v),p=Math.floor(e+v),_=Math.floor(n+v),T=Math.floor(s+v),y=(g+p+_+T)*c,S=g-y,E=p-y,w=_-y,x=T-y,b=t-S,R=e-E,L=n-w,F=s-x,N=b>R?32:0,U=b>L?16:0,O=R>L?8:0,Y=b>F?4:0,X=R>F?2:0,ot=L>F?1:0,H=N+U+O+Y+X+ot,Q=o[H][0]>=3?1:0,tt=o[H][1]>=3?1:0,gt=o[H][2]>=3?1:0,xt=o[H][3]>=3?1:0,$t=o[H][0]>=2?1:0,Gt=o[H][1]>=2?1:0,G=o[H][2]>=2?1:0,I=o[H][3]>=2?1:0,D=o[H][0]>=1?1:0,k=o[H][1]>=1?1:0,W=o[H][2]>=1?1:0,$=o[H][3]>=1?1:0,ut=b-Q+c,ht=R-tt+c,Z=L-gt+c,et=F-xt+c,st=b-$t+2*c,ct=R-Gt+2*c,pt=L-G+2*c,Lt=F-I+2*c,It=b-D+3*c,Wt=R-k+3*c,Xt=L-W+3*c,B=F-$+3*c,he=b-1+4*c,ne=R-1+4*c,C=L-1+4*c,M=F-1+4*c,q=g&255,J=p&255,it=_&255,mt=T&255,_t=a[q+a[J+a[it+a[mt]]]]%32,rt=a[q+Q+a[J+tt+a[it+gt+a[mt+xt]]]]%32,lt=a[q+$t+a[J+Gt+a[it+G+a[mt+I]]]]%32,bt=a[q+D+a[J+k+a[it+W+a[mt+$]]]]%32,zt=a[q+1+a[J+1+a[it+1+a[mt+1]]]]%32,Mt=.6-b*b-R*R-L*L-F*F;Mt<0?h=0:(Mt*=Mt,h=Mt*Mt*this._dot4(r[_t],b,R,L,F));let vt=.6-ut*ut-ht*ht-Z*Z-et*et;vt<0?d=0:(vt*=vt,d=vt*vt*this._dot4(r[rt],ut,ht,Z,et));let Dt=.6-st*st-ct*ct-pt*pt-Lt*Lt;Dt<0?u=0:(Dt*=Dt,u=Dt*Dt*this._dot4(r[lt],st,ct,pt,Lt));let Ht=.6-It*It-Wt*Wt-Xt*Xt-B*B;Ht<0?f=0:(Ht*=Ht,f=Ht*Ht*this._dot4(r[bt],It,Wt,Xt,B));let Kt=.6-he*he-ne*ne-C*C-M*M;return Kt<0?m=0:(Kt*=Kt,m=Kt*Kt*this._dot4(r[zt],he,ne,C,M)),27*(h+d+u+f+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}};var Ea=class i extends Gn{constructor(t,e,n=512,s=512,r,o,a){super(),this.width=n,this.height=s,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Ap(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Xe(this.width,this.height,{type:an,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new De({defines:Object.assign({},Sa.defines),uniforms:Rn.clone(Sa.uniforms),vertexShader:Sa.vertexShader,fragmentShader:Sa.fragmentShader,blending:$e,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new $o,this.normalMaterial.blending=$e,this.pdMaterial=new De({defines:Object.assign({},wa.defines),uniforms:Rn.clone(wa.uniforms),vertexShader:wa.vertexShader,fragmentShader:wa.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new De({defines:Object.assign({},ba.defines),uniforms:Rn.clone(ba.uniforms),vertexShader:ba.vertexShader,fragmentShader:ba.fragmentShader,blending:$e}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new De({uniforms:Rn.clone(Qr.uniforms),vertexShader:Qr.vertexShader,fragmentShader:Qr.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:ia,blendDst:Qs,blendEquation:Qn,blendSrcAlpha:na,blendDstAlpha:Qs,blendEquationAlpha:Qn}),this.blendMaterial=new De({uniforms:Rn.clone(Jc.uniforms),vertexShader:Jc.vertexShader,fragmentShader:Jc.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Kl,blendSrc:ia,blendDst:Qs,blendEquation:Qn,blendSrcAlpha:na,blendDstAlpha:Qs,blendEquationAlpha:Qn}),this._fsQuad=new Cs(null),this._originalClearColor=new Yt,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new Ni,this.depthTexture.format=Fi,this.depthTexture.type=As,this.normalRenderTarget=new Xe(this.width,this.height,{minFilter:We,magFilter:We,type:an,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Zu(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=$e,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=$e,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=$e,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=$e,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=$e,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new Kc,n=t*t*4,s=new Uint8Array(n);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let l=o,c=a;s[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,s[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,s[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,s[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}let r=new Yi(s,t,t,Ln,vn);return r.wrapS=Ii,r.wrapT=Ii,r.needsUpdate=!0,r}};Ea.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Ta={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var jc=class extends Gn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Rn.clone(Ta.uniforms),this.material=new Vr({name:Ta.name,uniforms:this.uniforms,vertexShader:Ta.vertexShader,fragmentShader:Ta.fragmentShader}),this._fsQuad=new Cs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},oe.getTransfer(this._outputColorSpace)===fe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===sa?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ra?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===oa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===tr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===la?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ji?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===aa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Qc=class extends Gn{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Yt}render(t,e,n){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var th=class extends $i{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new Ke;t.deleteAttribute("uv");let e=new on({side:Fe}),n=new on,s=new jo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Qt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new ms(t,n,6),a=new rn;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new Qt(t,to(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new Qt(t,to(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new Qt(t,to(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new Qt(t,to(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new Qt(t,to(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let f=new Qt(t,to(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function to(i){return new Yo({color:0,emissive:16777215,emissiveIntensity:i})}function Rp(i,{bg:t="#e6eaf4",fov:e=22}={}){let n=new Kr({canvas:i,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});n.outputColorSpace=ze,n.toneMapping=tr,n.toneMappingExposure=1.02,n.shadowMap.enabled=!0,n.shadowMap.type=js;let s=new $i;s.background=new Yt(t),s.fog=new Do(t,520,900);let r=new Jr(n);s.environment=r.fromScene(new th,.03).texture,s.environmentIntensity=.38;let o=new ke(e,16/9,5,2e3);s.add(new Js("#eef2ff","#b9c0cf",.7));let a=new Ks("#fff4e6",3.6);a.castShadow=!0,a.shadow.mapSize.set(4096,4096),a.shadow.bias=-4e-4,a.shadow.normalBias=.6,a.shadow.radius=4;let l=a.shadow.camera;l.left=-230,l.right=230,l.top=230,l.bottom=-230,l.near=10,l.far=900,l.updateProjectionMatrix(),s.add(a,a.target);let c=new P(-.78,1,-.36).normalize(),h=new Zc(n,new Xe(1,1,{type:an,samples:4}));h.addPass(new Qc(s,o));let d=new Ea(s,o,1,1);d.updateGtaoMaterial({radius:6,distanceExponent:1.4,thickness:3,scale:1.1,samples:16}),d.blendIntensity=.85,h.addPass(d),h.addPass(new jc);let u={w:1600,h:900,pr:1},f=(p,_,T)=>{Object.assign(u,{w:p,h:_,pr:T}),n.setPixelRatio(T),n.setSize(p,_,!1),h.setPixelRatio(T),h.setSize(p,_),o.aspect=p/_,o.updateProjectionMatrix()},m=p=>{let{tx:_,ty:T,tz:y,az:S,el:E,d:w}=p;o.position.set(_+w*Math.cos(E)*Math.sin(S),T+w*Math.sin(E),y+w*Math.cos(E)*Math.cos(S)),o.lookAt(_,T,y),p.fov&&p.fov!==o.fov&&(o.fov=p.fov,o.updateProjectionMatrix()),o.setViewOffset(u.w,u.h,-(p.sx??0),-(p.sy??0),u.w,u.h),o.updateMatrixWorld(),a.target.position.set(_,0,y),a.position.copy(a.target.position).addScaledVector(c,420),a.target.updateMatrixWorld(),h.render()},v=new P;return{renderer:n,scene:s,camera:o,composer:h,gtao:d,sun:a,resize:f,frame:m,project:p=>(v.copy(p).project(o),v.z>1?null:[(v.x*.5+.5)*u.w,(-v.y*.5+.5)*u.h]),size:u}}var yt={bg:"#dfe6fa",ground:"#d5def7",groundDeep:"#c3cff3",road:"#e6eaf8",lane:"#ffffff",bay:"#f2b33a",blue:"#3166ea",roof:"#4a85f0",blueDeep:"#2448c8",blueLight:"#8fb0f7",wall:"#7fa6f2",white:"#f6f8fd",panel:"#e9edf8",shade:"#c9d1ea",navy:"#1a2440",glass:"#22304f",yellow:"#f2b33a",teal:"#21b3a3",orange:"#ff8a3d",green:"#7fdaa0",greenDeep:"#4fbf7d",trunk:"#b08a6a",red:"#e5484d",cardboard:"#e3b07a"},Ju=new Map;function Bt(i,{rough:t=.55,metal:e=0,paint:n=!1,emissive:s=null,opacity:r=1}={}){let o=[i,t,e,n,s,r].join("|");if(Ju.has(o))return Ju.get(o);let a=n?new _s({color:i,roughness:t,metalness:e,clearcoat:.35,clearcoatRoughness:.35}):new on({color:i,roughness:t,metalness:e});return s&&(a.emissive=new Yt(s),a.emissiveIntensity=1),r<1&&(a.transparent=!0,a.opacity=r,a.depthWrite=!1),Ju.set(o,a),a}var Ku=new Map;function ue(i,t,e,n=Math.min(i,t,e)*.12,s=3){let r=[i,t,e,n,s].map(o=>+o.toFixed(3)).join("|");return Ku.has(r)||Ku.set(r,new qc(i,t,e,s,Math.min(n,Math.min(i,t,e)/2-.001))),Ku.get(r)}function re(i,t,e=0,n=0,s=0){let r=new Qt(i,t);return r.position.set(e,n,s),r.castShadow=r.receiveShadow=!0,r}function eo(i,{color:t=yt.blue,bg:e=null,w:n=1024,h:s=256,font:r="italic 800 150px Inter, system-ui, sans-serif",align:o="center"}={}){let a=document.createElement("canvas");a.width=n,a.height=s;let l=a.getContext("2d");e&&(l.fillStyle=e,l.fillRect(0,0,n,s)),l.fillStyle=t,l.font=r,l.textAlign=o,l.textBaseline="middle",l.fillText(i,o==="center"?n/2:24,s/2);let c=new gs(a);return c.colorSpace=ze,c.anisotropy=8,c}function Cp(i,{fov:t=28}={}){let e=Rp(i,{bg:yt.bg,fov:t});return e.scene.fog.near=700,e.scene.fog.far=1400,e.renderer.toneMapping=Ji,e.renderer.toneMappingExposure=.93,e.scene.traverse(n=>{n.isHemisphereLight&&(n.color.set("#f3f6ff"),n.groundColor.set("#c7d0ee"),n.intensity=1)}),e.sun.intensity=2.2,e.sun.color.set("#ffffff"),e.sun.shadow.radius=6,e.gtao.blendIntensity=.75,e}var Pp="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/><circle cx="44" cy="35" r="16" fill="#cfdcfb"/><path d="M13 88c3-19 15-28 31-28s28 9 31 28z" fill="#cfdcfb"/><path d="M27 31c1-11 8-17 17-17s16 6 17 17c-6-5-11-7-17-7s-11 2-17 7z" fill="#1a2440"/></svg>');var Wn="#3166ea",c1=`
.wt{position:absolute;inset:0;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#0f1730;font-feature-settings:"tnum"}
.wt *{box-sizing:border-box}
.wt .bar{position:absolute;left:0;right:0;top:0;height:74px;background:rgba(255,255,255,.94);border-bottom:1px solid #e4e8f3;display:flex;align-items:center;padding:0 28px;gap:16px}
.wt .logo{display:flex;align-items:center;gap:12px;font-weight:800;font-size:21px;letter-spacing:-.02em;width:260px}
.wt .search{width:450px;height:44px;border:1px solid #dfe4ef;border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 14px;color:#7b849b;font-size:14.5px;background:#fff}
.wt .search .k{margin-left:auto;border:1px solid #d9deea;border-radius:6px;font-size:11px;padding:1px 6px;color:#8b93a6}
.wt .sw{margin-left:auto;display:flex;align-items:stretch;height:48px;border:1px solid #dfe4ef;border-radius:12px;background:#fff;overflow:hidden}
.wt .sw .main{display:flex;align-items:center;gap:10px;padding:0 12px 0 7px;font-size:14px;font-weight:700;width:262px}
.wt .sw .main small{display:block;font-size:12px;font-weight:500;color:#6f7891;margin-top:1px}
.wt .sw .chip{min-width:42px;padding:0 6px;white-space:nowrap;height:34px;border-radius:8px;background:${Wn};color:#fff;font-size:12px;font-weight:800;display:grid;place-items:center;box-shadow:inset 0 -2px 0 rgba(0,0,0,.12)}
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
.wt .det .org{font-size:10.5px;font-weight:800;letter-spacing:.08em;color:${Wn}}
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
.wt .det .rw .ln{color:${Wn}}
.wt .det .sg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.wt .det .sb{background:#f4f6fb;border-radius:10px;padding:8px 10px}
.wt .det .sb small{display:block;font-size:11px;color:#4b5570}
.wt .det .sb b{display:block;font-size:15px;font-weight:800;margin:1px 0 4px}
.wt .det .sb b em{font-style:normal;font-size:12px;color:#6f7891;font-weight:600}
.wt .det .sb .pb{height:4px;border-radius:3px;background:#e2e7f2;overflow:hidden}.wt .det .sb .pb i{display:block;height:100%;background:${Wn}}
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
.wt .stp .fl{position:absolute;left:30px;top:16px;height:3px;background:${Wn}}
.wt .st{position:relative;width:110px;text-align:center;font-size:12.5px;font-weight:700}
.wt .st b{width:34px;height:34px;margin:0 auto 6px;border-radius:50%;display:grid;place-items:center;background:#eef1f7;border:2px solid #fff}
.wt .st.done b{background:${Wn}}
.wt .st.on b{background:${Wn};box-shadow:0 0 0 4px rgba(49,102,234,.18)}
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
.wt .seg em{font-style:normal;color:${Wn};margin-left:4px}
.wt .tbl .site{margin-left:auto;font-size:12px;color:#4b5570;font-weight:600}
.wt .tr{display:grid;grid-template-columns:96px 1fr 104px 66px 12px;align-items:center;font-size:13px;padding:7px 0;border-bottom:1px solid #f0f2f7}
.wt .tr:last-child{border:0}
.wt .tr b{font-weight:800;display:block}.wt .tr small{display:block;font-size:11px;color:#6f7891}
.wt .tr .wh{display:flex;align-items:center;gap:7px;color:#2b3550}.wt .tr .wh i{width:8px;height:8px;border-radius:50%}
.wt .tr .pp{font-size:12px;color:#4b5570}.wt .tr .pp .pb{height:5px;width:44px;border-radius:3px;background:#e9edf5;overflow:hidden;margin-bottom:3px}.wt .tr .pp .pb i{display:block;height:100%;background:#22b35f}
.wt .tags{position:absolute;inset:0}
.wt .pin{position:absolute;transform:translate(-50%,-100%)}
.wt .pin .h{width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${Wn};display:grid;place-items:center;box-shadow:0 6px 14px rgba(32,60,160,.35)}
.wt .pin .h i{width:13px;height:13px;border-radius:50%;background:#fff}
.wt .sel{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center}
.wt .sel .p{display:flex;align-items:center;gap:8px;background:#2547c9;color:#fff;font-size:13px;font-weight:800;border-radius:9px;padding:6px 11px;white-space:nowrap;box-shadow:0 8px 18px rgba(32,60,160,.35)}
.wt .sel .p small{font-weight:600;color:#c4d3ff;font-size:12px}
.wt .sel .t{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #2547c9}
.wt .drop{right:412px;top:80px;width:360px;padding:10px;transform-origin:top right}
.wt .drop .h{font-size:11px;font-weight:800;letter-spacing:.08em;color:#6f7891;padding:4px 8px 8px}
.wt .drop .it{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;font-size:13.5px;font-weight:700}
.wt .drop .it.on{background:#eef3ff}
.wt .drop .it .chip{width:38px;height:28px;border-radius:7px;background:${Wn};color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.wt .drop .it small{display:block;font-size:11.5px;color:#6f7891;font-weight:500}
.wt .drop .it .mb{margin-left:auto;width:64px;height:5px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .drop .it .mb i{display:block;height:100%;background:${Wn}}
.wt .cur{position:absolute;width:26px;height:26px;margin:-3px 0 0 -3px;z-index:9}
.wt .ring{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid ${Wn};opacity:0;z-index:8}
`,Mn=(i,t=18,e="#5b6680",n=2)=>`<svg viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="${e}" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Lp=(i=34)=>`<svg viewBox="0 0 40 40" width="${i}" height="${i}"><path d="M20 3l15 8.5v17L20 37 5 28.5v-17z" fill="#2448c8"/><path d="M20 3l15 8.5L20 20 5 11.5z" fill="#6f98f7"/><path d="M20 20l15-8.5v17L20 37z" fill="#3166ea"/><path d="M20 20v17L5 28.5v-17z" fill="#2448c8"/></svg>`,nh={cube:Lp(26),plane:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 22l14-3 8-13h4l-4 13 7 1 3-3h3l-2 6 2 6h-3l-3-3-7 1 4 13h-4l-8-13-14-3z" fill="#3166ea"/><path d="M18 19l8-13h4l-4 13z" fill="#6f98f7"/></svg>',bag:'<svg viewBox="0 0 40 40" width="26" height="26"><rect x="7" y="12" width="26" height="22" rx="5" fill="#3166ea"/><rect x="7" y="12" width="26" height="7" rx="3" fill="#6f98f7"/><path d="M15 12V7h10v5" stroke="#2448c8" stroke-width="3" fill="none"/></svg>',clock:'<svg viewBox="0 0 40 40" width="26" height="26"><circle cx="20" cy="20" r="15" fill="#3166ea"/><circle cx="20" cy="20" r="11" fill="#6f98f7"/><path d="M20 12v9l6 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',truck:'<svg viewBox="0 0 40 40" width="26" height="26"><rect x="3" y="10" width="21" height="17" rx="3" fill="#6f98f7"/><path d="M24 15h7l6 6v6H24z" fill="#3166ea"/><circle cx="11" cy="29" r="4" fill="#1a2440"/><circle cx="30" cy="29" r="4" fill="#1a2440"/></svg>'},eh={doc:Mn('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',16,"#fff"),box:Mn('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',16,"#fff"),load:Mn('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M10 14h4"/>',16,"#fff"),truck:Mn('<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',16,"#fff"),check:Mn('<path d="M5 12l5 5 9-10"/>',16,"#fff",2.6),plane:Mn('<path d="M3 13l7-1 4-7h2l-1 7 5 1 1-2h2l-1 3 1 3h-2l-1-2-5 1 1 7h-2l-4-7-7-1z"/>',16,"#fff",1.8)},h1=i=>eh[i].replace(/stroke="#fff"/,'stroke="#9aa2b6"'),u1={box:"#fbefdc",bin:"#e6eeff",helmet:"#fff1d6",tape:"#fbefdc",frozen:"#e9f6ff",water:"#e6eeff",gloves:"#e6eeff",pallet:"#fbefdc"},d1={box:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="#d9a35f"/><path d="M4 7.5l8 4.5 8-4.5L12 3z" fill="#ecc28a"/><path d="M12 12v9" stroke="#b9853f" stroke-width="1.2"/></svg>',bin:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 8h16l-1.6 11H5.6z" fill="#3166ea"/><rect x="3" y="5" width="18" height="4" rx="1.5" fill="#6f98f7"/></svg>',helmet:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16a8 8 0 0116 0z" fill="#f2b33a"/><rect x="2.5" y="15.5" width="19" height="3" rx="1.5" fill="#d9952a"/></svg>',tape:'<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="8" fill="#d9a35f"/><circle cx="12" cy="12" r="3.4" fill="#fbefdc"/></svg>',frozen:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" stroke="#3b8fe0" stroke-width="2.2" stroke-linecap="round"/></svg>',water:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" fill="#3166ea"/></svg>',gloves:'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 21V9a1.5 1.5 0 013 0V5a1.5 1.5 0 013 0v4a1.5 1.5 0 013 0v2a1.5 1.5 0 013 0v5a5 5 0 01-5 5z" fill="#3166ea"/></svg>',pallet:'<svg viewBox="0 0 24 24" width="16" height="16"><rect x="4" y="5" width="16" height="11" rx="1.5" fill="#d9a35f"/><rect x="3" y="17" width="18" height="3" rx="1" fill="#b9853f"/></svg>'},Ip='<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2.5l14.5 8.6-6.6 1.8-3 6.6z" fill="#0f1730" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',f1='<svg viewBox="0 0 24 24" width="26" height="26"><path d="M9 11V4.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v5c0 3.5-2.5 6-6 6h-1c-2.6 0-4-1.3-5.3-3.2L4.6 14.4a1.6 1.6 0 012.6-1.8L9 14.5" fill="#fff" stroke="#0f1730" stroke-width="1.6" stroke-linejoin="round"/></svg>';function Dp(i,t,{paint:e=n=>n}={}){Object.assign(eh,t.stepIcons??{});let n=document.createElement("style");n.textContent=e(c1),document.head.appendChild(n);let s=document.createElement("div");s.className="wt";let r=h=>`<div class="card kpi"><div class="ic">${nh[h.ic]??""}</div><div><div class="k">${h.k}</div><div class="v"><span data-k="kv_${h.key}">${h.v}</span><span class="d">${Mn('<path d="M12 19V5M6 11l6-6 6 6"/>',13,"#18884d",2.6)}<span data-k="kd_${h.key}">${h.d}</span></span></div><div class="s" data-k="ks_${h.key}">${h.s}</div></div></div>`;s.innerHTML=`
  <div class="bar">
    <div class="logo">${Lp(34)}${t.brand}</div>
    <div class="search">${Mn('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',19,"#0f1730")}<span data-k="search">${t.search}</span><span class="k">/</span></div>
    <div class="sw"><div class="main"><div class="chip" data-k="swChip"></div><div><span data-k="swName"></span><small data-k="swSub"></small></div><span class="gt">\u203A</span></div><div class="dd" data-k="dd">${Mn('<path d="M6 9l6 6 6-6"/>',16,"#0f1730")}</div></div>
    <div class="live"><i></i><span data-k="clock">Live 09:46</span></div>
    <div class="bell">${Mn('<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',22,"#0f1730")}<i></i></div>
    <div class="user"><div class="ava" style="background-image:url(${t.avatar??Pp})"></div><div>${t.user[0]}<small>${t.user[1]}</small></div>${Mn('<path d="M6 9l6 6 6-6"/>',16,"#0f1730")}</div>
  </div>
  <div class="kpis">${t.kpis.map(r).join("")}</div>
  <div class="card tools" data-k="tools">${['<path d="M12 5v14M5 12h14"/>','<path d="M5 12h14"/>',"hr",'<path d="M4 12a8 8 0 108-8H8"/><path d="M8 1v6h6" transform="translate(-4 0)"/>','<path d="M20 12a8 8 0 11-8-8h4"/><path d="M16 1v6h-6" transform="translate(4 0)"/>',"hr",'<path d="M4 11l8-7 8 7v9H4z"/>'].map((h,d)=>h==="hr"?"<hr>":`<b data-k="tool${d}">${Mn(h,18,"#0f1730")}</b>`).join("")}</div>
  <div class="card det" data-k="det">
    <div class="hd"><div class="th" data-k="dThumb"></div><div><div class="org" data-k="dOrg"></div><div class="ti" data-k="dTitle"></div><div class="su" data-k="dSub"></div></div>
      <div class="btns"><b>${Mn('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',15,"#0f1730")}</b><b>${Mn('<path d="M7 17L17 7M9 7h8v8"/>',15,"#0f1730")}</b><b>${Mn('<path d="M6 6l12 12M18 6L6 18"/>',15,"#0f1730")}</b></div></div>
    <div class="stat"><span class="pillg" data-k="dStat"></span><span data-k="dStatText"></span></div>
    <div class="pgr"><div class="pb"><i data-k="dBar"></i></div><span data-k="dProg"></span></div>
    <div class="rows" data-k="dRows"></div>
    <div data-k="dExtra"></div>
  </div>
  <div class="card trk">
    <div class="l"><div class="hd">${nh[t.trackIcon??"truck"]}<span style="margin:0;font-size:15.5px;color:#0f1730;font-weight:800" data-k="tTitle"></span><span data-k="tMeta"></span></div>
      <div class="stp" data-k="steps"></div></div>
    <div class="shp"><div class="th" data-k="sThumb"></div><div><b data-k="sId"></b><div class="to" data-k="sTo"></div><span class="pillg" data-k="sStat" style="font-size:11.5px;padding:3px 9px"></span><div class="m" data-k="sMeta"></div></div><span style="margin-left:auto;color:#0f1730;font-size:18px">\u203A</span></div>
  </div>
  <div class="card tbl"><div class="hd"><div style="width:28px;height:28px;border-radius:8px;background:#edf2ff;display:grid;place-items:center">${Mn('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',15,Wn)}</div><div class="seg" data-k="seg"></div><span class="site" data-k="tSite"></span></div><div data-k="rows"></div></div>
  <div class="card drop" data-k="drop"><div class="h">${t.dropTitle??"NETWORK OVERVIEW"}</div><div data-k="dropList"></div></div>
  <div class="tags" data-k="tags"></div>
  <div class="ring" data-k="ring"></div>
  <div class="cur" data-k="cur">${Ip}</div>`,s.innerHTML=e(s.innerHTML),i.appendChild(s);let o=h=>s.querySelector(`[data-k="${h}"]`),a=(h,d)=>{let u=o(h);u&&u.textContent!==String(d)&&(u.textContent=d)},l=(h,d)=>{let u=o(h);u&&u.dataset.v!==d&&(u.innerHTML=d,u.dataset.v=d)},c=(h,d)=>{let u=o(h),f=d?`url(${d})`:"";u.style.backgroundImage!==f&&(u.style.backgroundImage=f)};return{el:s,update(h){a("clock",h.live??`Live ${h.clock}`),a("swChip",h.site[0]),a("swName",h.site[1]),a("swSub",h.site[2]);for(let[w,x]of Object.entries(h.kpi??{}))a(`kv_${w}`,x[0]),a(`kd_${w}`,x[1]),x[2]&&a(`ks_${w}`,x[2]);let d=h.card;c("dThumb",d.thumb),a("dOrg",d.org),a("dTitle",d.title),a("dSub",d.sub);let u=o("dStat");u.className=`pillg ${d.statCls}`,a("dStat",d.stat),a("dStatText",d.statText),o("dBar").style.width=`${(100*d.prog).toFixed(1)}%`,a("dProg",d.progText),l("dRows",(d.rows??[]).map(([w,x,b])=>`<div class="rw"><span>${w}</span><span${b?' class="ln"':""}>${x}</span></div>`).join("")),o("dBar").parentElement.parentElement.style.display=d.stats?"none":"";let f="";d.stats&&(f+=`<div class="sg">${d.stats.map(([w,x,b,R,L])=>`<div class="sb"><small>${w}</small><b>${x}${b?` <em>${b}</em>`:""}</b>${R==null?"":`<div class="pb${L?" g":""}"><i style="width:${(100*R).toFixed(1)}%"></i></div>`}</div>`).join("")}</div>`),d.inv&&(f+='<div class="ih">Inventory<span>units</span></div>'+d.inv.map(([w,x,b,R,L])=>`<div class="iv"><i style="background:${u1[w]??"#eef2fb"}">${d1[w]??""}</i><span>${x}</span><b>${b}</b><span class="tg ${L}">${R}</span></div>`).join("")),d.fleet&&(f+=`<div class="fl"><div class="fh">${d.fleet.title}<span>${d.fleet.meta}</span></div>${d.fleet.rows.map(([w,x,b])=>`<div class="fr"><b>${w}</b><span>${x}</span><div class="pb"><i style="width:${(100*b).toFixed(0)}%"></i></div><span>${Math.round(100*b)}%</span></div>`).join("")}</div>`),l("dExtra",e(f)),o("det").style.transform=`translateY(${((1-d.pop)*10).toFixed(1)}px)`,o("det").style.opacity=(.25+.75*d.pop).toFixed(3);let m=h.track;a("tTitle",m.title),a("tMeta",m.meta),l("steps",e(`<div class="fl" style="width:calc((100% - 60px) * ${m.fill.toFixed(3)})"></div>`+m.steps.map(([w,x,b,R])=>`<div class="st ${R||"fut"}"><b>${R==="on"?eh.check:R==="done"?eh[b]:h1(b)}</b>${w}<small>${x}</small></div>`).join(""))),c("sThumb",m.ship.thumb),a("sId",m.ship.id),a("sTo",m.ship.to),o("sStat").className=`pillg ${m.ship.statCls}`,a("sStat",m.ship.stat),a("sMeta",m.ship.meta);let v=h.table;l("seg",v.tabs.map(([w,x],b)=>`<span${b===v.active?' class="a"':""}>${w}<em>${x}</em></span>`).join("")),a("tSite",v.site),l("rows",e(v.rows.map(w=>`<div class="tr"><div><b>${w.id}</b><small>${w.org}</small></div><div class="wh"><i style="background:${w.dot}"></i>${w.where}</div><div><span class="pillg ${w.cls}" style="font-size:12px;padding:4px 10px">${w.stat}</span></div><div class="pp">${w.p==null?w.pt:`<div class="pb"><i style="width:${w.p}%"></i></div>${w.pt}`}</div><span style="color:#0f1730">\u203A</span></div>`).join("")));let g=h.drop??{open:0,sites:[]},p=o("drop");p.style.opacity=g.open.toFixed(3),p.style.transform=`translateY(${((1-g.open)*-8).toFixed(1)}px) scale(${(.97+.03*g.open).toFixed(3)})`,o("dd").className=g.open>.05?"dd on":"dd",l("dropList",g.sites.map(([w,x,b,R],L)=>`<div class="it${L===g.on?" on":""}"><div class="chip">${w}</div><div>${x}<small>${b}</small></div><div class="mb"><i style="width:${R}%"></i></div></div>`).join(""));for(let w=0;w<7;w++){let x=o(`tool${w}`);x&&(x.className=h.tool===w?"on":"")}let _=o("tags"),T=h.tags??[];for(;_.children.length<T.length;)_.appendChild(document.createElement("div"));[..._.children].forEach((w,x)=>{let b=T[x];if(!b){w.style.display="none";return}w.style.display="";let R=b.kind==="pin"?"pin":"sel",L=b.kind==="pin"?'<div class="h"><i></i></div>':`<div class="p">${b.text}<small>${b.sub??""}</small></div><div class="t"></div>`;w.dataset.v!==R+L&&(w.className=R,w.innerHTML=L,w.dataset.v=R+L),w.style.left=`${b.x.toFixed(1)}px`,w.style.top=`${b.y.toFixed(1)}px`,w.style.opacity=(b.a??1).toFixed(3)});let y=o("cur"),S=h.hand?f1:Ip;y.dataset.v!==S&&(y.innerHTML=S,y.dataset.v=S),y.style.left=`${h.cursor[0]}px`,y.style.top=`${h.cursor[1]}px`;let E=o("ring");E.style.left=`${h.cursor[0]}px`,E.style.top=`${h.cursor[1]}px`,E.style.opacity=((h.click??0)*.9).toFixed(3),E.style.transform=`scale(${(.4+(1-(h.click??0))*1.2).toFixed(3)})`}}}St.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ft},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Cn.line={uniforms:Rn.merge([St.common,St.fog,St.line]),vertexShader:`
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
		`};var no=class extends De{constructor(t){super({type:"LineMaterial",uniforms:Rn.clone(Cn.line.uniforms),vertexShader:Cn.line.vertexShader,fragmentShader:Cn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0!==this.worldUnits&&(this.needsUpdate=!0),t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}};var Up=new Qe,ih=new P,sr=class extends Qo{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ae(t,3)),this.setAttribute("uv",new ae(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new bs(e,6,1);return this.setAttribute("instanceStart",new Kn(n,3,0)),this.setAttribute("instanceEnd",new Kn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new bs(e,6,1);return this.setAttribute("instanceColorStart",new Kn(n,3,0)),this.setAttribute("instanceColorEnd",new Kn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new qo(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qe);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Up.setFromBufferAttribute(e),this.boundingBox.union(Up))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jn),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ih.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ih)),ih.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(ih));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}};var ju=new xe,Np=new P,Fp=new P,un=new xe,dn=new xe,Bi=new xe,Qu=new P,td=new jt,fn=new ea,Op=new P,sh=new Qe,rh=new Jn,zi=new xe,ki,rr;function Bp(i,t,e){return zi.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),zi.multiplyScalar(1/zi.w),zi.x=rr/e.width,zi.y=rr/e.height,zi.applyMatrix4(i.projectionMatrixInverse),zi.multiplyScalar(1/zi.w),Math.abs(Math.max(zi.x,zi.y))}function p1(i,t){let e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){fn.start.fromBufferAttribute(s,a),fn.end.fromBufferAttribute(r,a),fn.applyMatrix4(e);let c=new P,h=new P;ki.distanceSqToSegment(fn.start,fn.end,h,c),h.distanceTo(c)<rr*.5&&t.push({point:h,pointOnLine:c,distance:ki.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function m1(i,t,e){let n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;ki.at(1,Bi),Bi.w=1,Bi.applyMatrix4(t.matrixWorldInverse),Bi.applyMatrix4(n),Bi.multiplyScalar(1/Bi.w),Bi.x*=r.x/2,Bi.y*=r.y/2,Bi.z=0,Qu.copy(Bi),td.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,f=h;u<f;u++){if(un.fromBufferAttribute(l,u),dn.fromBufferAttribute(c,u),un.w=1,dn.w=1,un.applyMatrix4(td),dn.applyMatrix4(td),un.z>d&&dn.z>d)continue;if(un.z>d){let T=un.z-dn.z,y=(un.z-d)/T;un.lerp(dn,y)}else if(dn.z>d){let T=dn.z-un.z,y=(dn.z-d)/T;dn.lerp(un,y)}un.applyMatrix4(n),dn.applyMatrix4(n),un.multiplyScalar(1/un.w),dn.multiplyScalar(1/dn.w),un.x*=r.x/2,un.y*=r.y/2,dn.x*=r.x/2,dn.y*=r.y/2,fn.start.copy(un),fn.start.z=0,fn.end.copy(dn),fn.end.z=0;let v=fn.closestPointToPointParameter(Qu,!0);fn.at(v,Op);let g=Au.lerp(un.z,dn.z,v),p=g>=-1&&g<=1,_=Qu.distanceTo(Op)<rr*.5;if(p&&_){fn.start.fromBufferAttribute(l,u),fn.end.fromBufferAttribute(c,u),fn.start.applyMatrix4(o),fn.end.applyMatrix4(o);let T=new P,y=new P;ki.distanceSqToSegment(fn.start,fn.end,y,T),e.push({point:y,pointOnLine:T,distance:ki.origin.distanceTo(y),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}var oh=class extends Qt{constructor(t=new sr,e=new no({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)Np.fromBufferAttribute(e,o),Fp.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Np.distanceTo(Fp);let r=new bs(s,2,1);return t.setAttribute("instanceDistanceStart",new Kn(r,1,0)),t.setAttribute("instanceDistanceEnd",new Kn(r,1,1)),this}raycast(t,e){let n=this.material.worldUnits,s=t.camera;if(s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;ki=t.ray;let o=this.matrixWorld,a=this.geometry,l=this.material;rr=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),rh.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=rr*.5;else{let d=Math.max(s.near,rh.distanceToPoint(ki.origin));c=Bp(s,d,l.resolution)}if(rh.radius+=c,ki.intersectsSphere(rh)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),sh.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=rr*.5;else{let d=Math.max(s.near,sh.distanceToPoint(ki.origin));h=Bp(s,d,l.resolution)}sh.expandByScalar(h),ki.intersectsBox(sh)!==!1&&(n?p1(this,e):m1(this,s,e))}onBeforeRender(t){let e=this.material.uniforms;e&&e.resolution&&(t.getViewport(ju),this.material.uniforms.resolution.value.set(ju.z,ju.w))}};var zp="#3f6ff0";function g1(){let i=document.createElement("canvas");i.width=i.height=256;let t=i.getContext("2d"),e=t.createRadialGradient(128,128,10,128,128,128);e.addColorStop(0,"rgba(72,118,245,0.55)"),e.addColorStop(.55,"rgba(72,118,245,0.22)"),e.addColorStop(1,"rgba(72,118,245,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new gs(i);return n.colorSpace=ze,n}function kp(i,t,{core:e=.9,halo:n=3.2,pad:s=.25}={}){let r=new no({color:zp,linewidth:1.6,transparent:!0,opacity:.95,depthTest:!0}),o=new oh(new sr,r);o.isLine2=!0,o.renderOrder=5,o.visible=!1,i.add(o);let a=new Qt(new _n(1,1).rotateX(-Math.PI/2),new mi({map:g1(),transparent:!0,depthWrite:!1}));a.renderOrder=1,a.visible=!1,i.add(a);let l=new Qt(new we,new mi({color:zp,transparent:!0,depthWrite:!1})),c=new Qt(new we,new mi({color:"#7da0f6",transparent:!0,opacity:.35,depthWrite:!1}));l.renderOrder=c.renderOrder=2,l.visible=c.visible=!1,i.add(c,l);let h=new Qe,d=null,u="",f=v=>{let{min:g,max:p}=v,_=[[g.x,g.y,g.z],[p.x,g.y,g.z],[p.x,g.y,p.z],[g.x,g.y,p.z],[g.x,p.y,g.z],[p.x,p.y,g.z],[p.x,p.y,p.z],[g.x,p.y,p.z]],T=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],y=[];for(let[S,E]of T)y.push(..._[S],..._[E]);return y},m=(v,g,p)=>{let _=[0];for(let x=1;x<v.length;x++)_.push(_[x-1]+v[x].distanceTo(v[x-1]));let T=_[_.length-1]*p,y=[];for(let x=0;x<v.length;x++)if(_[x]<=T)y.push(v[x]);else{let b=(T-_[x-1])/(_[x]-_[x-1]||1);y.push(v[x-1].clone().lerp(v[x],b));break}if(y.length<2)return null;let S=[],E=[];for(let x=0;x<y.length;x++){let b=y[Math.max(0,x-1)],R=y[Math.min(y.length-1,x+1)],L=new P().subVectors(R,b).setY(0).normalize(),F=new P(-L.z,0,L.x).multiplyScalar(g/2),N=y[x].y+.06;S.push(y[x].x+F.x,N,y[x].z+F.z,y[x].x-F.x,N,y[x].z-F.z),x&&E.push(2*x-2,2*x-1,2*x,2*x-1,2*x+1,2*x)}let w=new we;return w.setAttribute("position",new ae(S,3)),w.setIndex(E),w};return{box(v,g=1){if(d=v&&g>.001?v:null,o.visible=!!d,a.visible=!!d&&!d.userData.noGlow,!d)return;r.opacity=.95*g,a.material.opacity=g;let p=d.uuid;if(p!==u){u=p,d.updateMatrixWorld(!0);let _=new jt().copy(d.matrixWorld).invert();h.makeEmpty(),d.traverse(T=>{!T.isMesh||!T.geometry||(T.geometry.boundingBox||T.geometry.computeBoundingBox(),h.union(T.geometry.boundingBox.clone().applyMatrix4(new jt().multiplyMatrices(_,T.matrixWorld))))}),h.expandByScalar(d.userData.selPad??s),o.geometry.dispose(),o.geometry=new sr().setPositions(f(h)),o.userData.size=h.getSize(new P),o.userData.center=h.getCenter(new P)}},route(v,g=1,p=1){if(l.visible=c.visible=!!v&&g>.001&&p>.001,!l.visible)return;let _=m(v,e,g),T=m(v,n,g);if(!_){l.visible=c.visible=!1;return}l.geometry.dispose(),c.geometry.dispose(),l.geometry=_,c.geometry=T,l.material.opacity=.9*p,c.material.opacity=.32*p},update(){if(r.resolution.set(t.size.w,t.size.h),d){d.updateMatrixWorld(!0),o.matrixAutoUpdate=!1,o.matrix.copy(d.matrixWorld),o.matrixWorldNeedsUpdate=!0;let v=o.userData.size,g=o.userData.center.clone().applyMatrix4(d.matrixWorld);a.position.set(g.x,(d.userData.groundY??0)+.05,g.z);let p=d.getWorldScale(new P),_=new P(1,0,0).applyQuaternion(d.getWorldQuaternion(new Ve));a.rotation.y=Math.atan2(-_.z,_.x),a.scale.set(Math.max(.6,v.x*p.x)*1.9,1,Math.max(.6,v.z*p.z)*1.9)}}}}var ed=null;function nd(i,{size:t=160,az:e=38,el:n=26,pad:s=1.18}={}){if(!ed){let g=document.createElement("canvas"),p=new Kr({canvas:g,antialias:!0,alpha:!0,preserveDrawingBuffer:!0});p.outputColorSpace=ze,p.toneMapping=Ji,p.toneMappingExposure=.95;let _=new $i;_.add(new Js("#f3f6ff","#c7d0ee",1.3));let T=new Ks("#ffffff",2.2);T.position.set(-4,8,5),_.add(T),ed={renderer:p,scene:_,camera:new ke(24,1,.1,2e3)}}let{renderer:r,scene:o,camera:a}=ed;r.setSize(t,t,!1),r.setClearColor(0,0);let l=new Se;l.add(i),o.add(l),i.updateMatrixWorld(!0);let c=new Qe().setFromObject(i),h=c.getCenter(new P),u=c.getSize(new P).length()/2*s/Math.sin(a.fov*Math.PI/360),f=e*Math.PI/180,m=n*Math.PI/180;a.position.set(h.x+u*Math.cos(m)*Math.sin(f),h.y+u*Math.sin(m),h.z+u*Math.cos(m)*Math.cos(f)),a.lookAt(h),r.render(o,a);let v=r.domElement.toDataURL("image/png");return o.remove(l),v}var pe={flat:.26,kick:.19,kickAngle:.33,deck:.034,W:.24,truckX:.2,wheelR:.036,wheelW:.04,wheelZ:.105,axleY:-.08,grip:.116,hanger:.09,half:.44},ve={thigh:.43,shin:.43,hip:.115,hipDrop:.04,ankle:[-.06,.085],spine:.06,torso:[.4,.5,.25],shoulder:.2,upper:.29,fore:.27,neck:.07,head:.155},_e={zMin:-4,zMax:4,upper:{y:2.4,x0:-52,x1:-14},gap:{x0:-26,x1:-24.3,water:2.08,floor:1.9},four:{x0:-14,n:4,rise:.2,tread:.32},middle:{y:1.6,x0:-13.04,x1:4},ten:{x0:4,n:10,rise:.16,tread:.32},rail:{z:-.75,x0:3.95,x1:7,r:.025,posts:[3.95,5.44,7]},lower:{x0:6.88,x1:44}},io=Math.atan(.5);function Dn(i){let t=_e.rail;return i<t.x0||i>t.x1?null:2.32-.5*(i-_e.ten.x0)}function Ps(i,t=0){let e=_e;if(t<e.zMin||t>e.zMax||i<e.upper.x0)return 0;if(i<e.four.x0)return i>e.gap.x0&&i<e.gap.x1?e.gap.water:e.upper.y;let n=e.four;if(i<n.x0+(n.n-1)*n.tread)return e.upper.y-n.rise*(Math.floor((i-n.x0)/n.tread)+1);if(i<e.ten.x0)return e.middle.y;let s=e.ten;return i<s.x0+(s.n-1)*s.tread?e.middle.y-s.rise*(Math.floor((i-s.x0)/s.tread)+1):0}var Un=9.81,vi=pe.grip,yi=io,sd=pe.hanger/Math.cos(yi),Qi=_e.rail.z,x1=.1,ye={ride:.88,pop:.82,crouch:.6,tuck:.6,land:.84,lock:.72,grind:.66,off:.84},or=-.02,Is=-.03,Nn={a:4,stroke:.72,tmax:.46,lead:.16,ret:.34,between:.12,dip:.12,side:.27,hip:.07},ns={x:5.1,dv:.6,cross:[.185,.07],hold:-.585,reach:.12},ni=(i,t=0,e=1)=>Math.min(e,Math.max(t,i)),dh=i=>{let t=ni(i);return t*t*(3-2*t)},ld=i=>{let t=ni(i);return t*t*t*(t*(t*6-15)+10)},Ee=(i,t,e)=>ld((e-i)/(t-i)),je=(i,t,e)=>i+(t-i)*e,ro=(i,t,e)=>{let n=(e-i)/(t-i);return n<=0||n>=1?0:Math.sin(Math.PI*n)**2},is=(i,t,e,n,s)=>{let r=s*s,o=r*s;return(2*o-3*r+1)*i+(o-2*r+s)*t+(-2*o+3*r)*e+(o-r)*n},Aa=i=>je(ni(i),ld(i),.55),ce=(i=0,t=0,e=0)=>new P(i,t,e),ch=ce(1,0,0),Le=ce(0,1,0),so=ce(0,0,1),oo=i=>ce(Math.cos(i),0,-Math.sin(i)),hh=i=>ce(Math.sin(i),0,Math.cos(i)),Xn=(i,t)=>new Ve().setFromAxisAngle(i,t),_1=ve.thigh+ve.shin-.012,Vp=ve.ankle,Ls={x:-pe.truckX,y:pe.axleY},Wp=i=>[-Ls.x*Math.cos(i)+Ls.y*Math.sin(i),-Ls.x*Math.sin(i)-Ls.y*Math.cos(i)],ts=(()=>{let i=pe.kickAngle,t=[-(pe.flat+pe.kick*Math.cos(i))-pe.deck*Math.sin(i)-Ls.x,pe.kick*Math.sin(i)-pe.deck*Math.cos(i)-Ls.y],e=0,n=1.2;for(let a=0;a<60;a++){let l=(e+n)/2;t[0]*Math.sin(l)+t[1]*Math.cos(l)>-pe.wheelR?e=l:n=l}let s=(e+n)/2,[r,o]=Wp(s);return{pitch:s,lead:.07,dx:Ls.x+r,dy:pe.wheelR+o-vi}})(),Ft={front:{x:.17,z:0,yaw:.6},back:{x:-.22,z:0,yaw:-.12},tail:{x:-.355,z:.02,yaw:.05},push:{x:.12,z:.03,yaw:1.32},kick:{x:.06,z:-.04,yaw:.75},heel:{x:.1,z:.07,yaw:.25},hard:{x:.12,z:-.03,yaw:.55},tailToe:{x:-.35,z:.05,yaw:.1},grindF:{x:.2,z:0,yaw:.45},grindB:{x:-.21,z:0,yaw:-.1}};function v1(i,t){let e=pe.kickAngle,n=.1375*Math.abs(Math.sin(t))+.059*Math.abs(Math.cos(t)),s=Math.abs(i),r=Math.sign(i)||1,o=s+n-pe.flat;if(o<=0)return{y:0,n:[0,1]};if(s-n>=pe.flat)return{y:(s-pe.flat)*Math.tan(e),n:[-r*Math.sin(e),Math.cos(e)]};let a=o*Math.tan(e),l=Math.atan(a/(2*n));return{y:a/2,n:[-r*Math.sin(l),Math.cos(l)]}}function y1(){let i=_e,t=1/2e3,e={dt:t,xs:[0],vs:[0],pushes:[]},n=0,s=0,r=0,o=T=>{let y=0;for(let S of e.pushes)T>=S.p0&&T<S.p1&&(y+=Nn.a);return y},a=T=>e.brake&&T>=e.brake.t0&&T<e.brake.t1?e.brake.decel*Ee(e.brake.t0,e.brake.t0+.2,T):0,l=T=>{for(;!T();){let y=o(n)-(r>0?x1+a(n):0);r=Math.max(0,r+y*t),s+=r*t,n+=t,e.xs.push(s),e.vs.push(r)}},c=(T,y)=>{for(;n+t<=T+1e-9;)s+=y*t,n+=t,e.xs.push(s),e.vs.push(y)},h=(T,y=!1)=>{let S=y?T:T+Nn.lead;l(()=>n>=S-1e-9);let E=Math.min(Nn.tmax,(-r+Math.sqrt(r*r+2*Nn.a*Nn.stroke))/Nn.a),w={s:T,p0:S,p1:S+E,back:S+E+Nn.ret,dv:Nn.a*E,first:y};return e.pushes.push(w),w};e.idle=2.5;let d=e.idle;for(let T=0;T<5;T++)d=h(d,T===0).back+Nn.between;e.stance=[e.pushes.at(-1).back,e.pushes.at(-1).back+.45];let u={xp:i.gap.x0-.32,xl:i.gap.x1+.62,y0:i.upper.y,y1:i.upper.y,base0:0,base1:Math.PI};u.tp=e.stance[1]+1.2,l(()=>n>=u.tp-1e-9),e.x0=u.xp-s,e.xs=e.xs.map(T=>T+e.x0),s+=e.x0,u.vx=r,u.T=(u.xl-u.xp)/u.vx,u.pel0=u.y0+vi+ye.pop,u.pel1=u.y1+vi+ye.land,u.vy0=(u.pel1-u.pel0+.5*Un*u.T*u.T)/u.T,u.tl=u.tp+u.T,c(u.tl,u.vx),u.vyl=u.vy0-Un*u.T,r=u.vx*.985;let f={xp:i.four.x0-.42,y0:i.upper.y,y1:i.middle.y,vy0:2.05,base0:Math.PI,base1:Math.PI};l(()=>s>=f.xp),f.tp=n,f.vx=r,f.pel0=f.y0+vi+ye.pop,f.pel1=f.y1+vi+ye.land,f.T=(f.vy0+Math.sqrt(f.vy0*f.vy0+2*Un*(f.pel0-f.pel1)))/Un,f.xl=f.xp+f.vx*f.T,f.tl=f.tp+f.T,c(f.tl,f.vx),f.vyl=f.vy0-Un*f.T,r=f.vx*.97,h(f.tl+.85),e.stance2=[e.pushes.at(-1).back,e.pushes.at(-1).back+.4];let m={y0:i.middle.y,base0:Math.PI,base1:Math.PI},v={t:n,x:s,v:r,n:e.xs.length},g=2.6;for(let T=0;T<8;T++){n=v.t,s=v.x,r=v.v,e.xs.length=e.vs.length=v.n,l(()=>s>=g);let y=r,S=-.5*y-ns.dv,E=-S/Un,w=Dn(ns.x)+sd+ye.lock,x=w+.5*Un*E*E,b=m.y0+vi+ye.pop,R=Math.sqrt(2*Un*(x-b)),L=R/Un;Object.assign(m,{vx:y,vyl:S,tal:E,tpa:L,vy0:R,pel0:b,pelLock:w,apex:x,T:L+E}),g=ns.x-y*m.T}m.xp=s,m.tp=n,m.tl=m.tp+m.T,m.xbLock=m.xp+m.vx*m.T,c(m.tl,m.vx);let p={t0:m.tl,xb0:m.xbLock,xOff:6.72,a:2.2};for(p.v0=m.vx/Math.cos(yi),p.sOff=(p.xOff-p.xb0)/Math.cos(yi),p.T=(-p.v0+Math.sqrt(p.v0*p.v0+2*p.a*p.sOff))/p.a,p.t1=p.t0+p.T,p.vEnd=p.v0+p.a*p.T,p.xbAt=T=>{let y=ni(T-p.t0,0,p.T);return p.xb0+Math.cos(yi)*(p.v0*y+.5*p.a*y*y)};n+t<=p.t1+1e-9;)n+=t,s=p.xbAt(n),e.xs.push(s),e.vs.push(Math.cos(yi)*(p.v0+p.a*(n-p.t0)));let _={tp:p.t1,y1:0,base0:Math.PI,base1:Math.PI,popUp:.9};return _.vx=p.vEnd*Math.cos(yi),_.vy0=-p.vEnd*Math.sin(yi)+_.popUp,_.xp=p.xOff,_.pel0=Dn(p.xOff)+sd+ye.off,_.pel1=vi+ye.land,_.T=(_.vy0+Math.sqrt(_.vy0*_.vy0+2*Un*(_.pel0-_.pel1)))/Un,_.tl=_.tp+_.T,_.xl=_.xp+_.vx*_.T,_.vyl=_.vy0-Un*_.T,s=p.xOff,c(_.tl,_.vx),r=_.vx*.95,e.brake={t0:_.tl+1.15,t1:_.tl+3.55,decel:1.15},e.end=_.tl+9.6,l(()=>n>=e.end+.5),Object.assign(e,{S1:u,S2:f,S3:m,GR:p,OFF:_}),e}var Ae=y1();function rd(i){let t=ni(i,0,(Ae.xs.length-2)*Ae.dt)/Ae.dt,e=Math.floor(t),n=t-e;return{x:je(Ae.xs[e],Ae.xs[e+1],n),v:je(Ae.vs[e],Ae.vs[e+1],n)}}var qn={len:5,z:-.5,slope:-.08};function ao(i){let{S3:t,OFF:e}=Ae,n=t.xp-qn.len;if(i<=n)return 0;if(i<=t.xp)return qn.z*is(0,0,1,qn.slope*qn.len/qn.z,(i-n)/qn.len);if(i<e.xl)return qn.z+qn.slope*(i-t.xp);let s=ni((i-e.xl)/9.5);return je(Qi+.06,1.35,is(0,0,1,0,s))}var M1=i=>(ao(i+.01)-ao(i))/.01,od=i=>Math.atan(-M1(i)),ji=(i,t)=>{if(i<=t[0][0])return t[0][1];for(let e=0;e<t.length-1;e++){let[n,s]=t[e],[r,o]=t[e+1];if(i<=r){let a=dh((i-n)/(r-n));if(typeof s=="number")return je(s,o,a);let l={};for(let c of Object.keys(s))l[c]=je(s[c],o[c]??s[c],a);return l}}return t.at(-1)[1]},Vt=(i,t=0,e=0,n=0)=>({x:i.x+e,z:i.z+n,yaw:i.yaw,lift:t}),uh={S1:{name:"Hardflip",flip:[.05,.6],catch:.62,rot:i=>({phi:-2*Math.PI*Aa(i),psi:Math.PI*Aa(i),theta:1.22*Math.sin(Math.PI*ni(i))**1.6}),gap:i=>.24*Math.sin(Math.PI*ni(i))**1.5,e:()=>[[0,null],[.3,ye.tuck],[.56,ye.tuck+.02],[1,ye.land]],attF:[[0,Vt(Ft.hard)],[.08,Vt(Ft.hard,0,.1,-.02)]],attB:[[0,Vt(Ft.tailToe)],[.08,Vt(Ft.tailToe,0,0,.02)]],rel:[[.03,.12],[.04,.13]],front:[[0,Vt(Ft.hard)],[.12,Vt(Ft.hard,.14,.18,-.1)],[.24,Vt(Ft.hard,.26,.24,-.14)],[.44,Vt(Ft.front,.2,.12,-.04)],[.56,Vt(Ft.front,.07,.02,0)],[.62,Vt(Ft.front)]],back:[[0,Vt(Ft.tailToe)],[.13,Vt(Ft.tailToe,.12,0,.08)],[.28,Vt(Ft.back,.28,-.12,.06)],[.47,Vt(Ft.back,.3,-.1,.02)],[.56,Vt(Ft.back,.09,-.03,0)],[.62,Vt(Ft.back)]],twist:i=>-.18*ro(.02,.6,i),setup:{front:Ft.hard,back:Ft.tailToe}},S2:{name:"Laser flip",flip:[.03,.56],catch:.58,rot:i=>({phi:2*Math.PI*Aa(i),psi:2*Math.PI*Aa(i),theta:.12*Math.sin(2*Math.PI*ni(i))}),gap:i=>.17*Math.sin(Math.PI*ni(i))**.9,e:()=>[[0,null],[.28,ye.tuck],[.52,ye.tuck+.04],[.82,.8],[1,ye.land]],attF:[[0,Vt(Ft.heel)],[.06,Vt(Ft.heel,0,.08,.03)]],attB:[[0,Vt(Ft.tailToe)],[.07,Vt(Ft.tailToe,0,0,.02)]],rel:[[.02,.1],[.04,.12]],front:[[0,Vt(Ft.heel)],[.1,Vt(Ft.heel,.12,.16,.12)],[.24,Vt(Ft.heel,.2,.2,.16)],[.44,Vt(Ft.front,.14,.1,.02)],[.53,Vt(Ft.front,.05,.02,0)],[.58,Vt(Ft.front)]],back:[[0,Vt(Ft.tailToe)],[.12,Vt(Ft.tailToe,.1,.04,.14)],[.26,Vt(Ft.back,.2,-.12,.06)],[.44,Vt(Ft.back,.14,-.06,.02)],[.53,Vt(Ft.back,.05,-.02,0)],[.58,Vt(Ft.back)]],twist:i=>.34*ro(0,.62,i),setup:{front:Ft.heel,back:Ft.tailToe}},S3:{name:"Kickflip backside 50-50",flip:[.04,.46],catch:.5,rot:i=>({phi:-2*Math.PI*Aa(i),psi:0,theta:0}),gap:i=>.15*Math.sin(Math.PI*ni(i))**1.2,e:i=>[[0,null],[.3,ye.tuck],[1-ns.reach/i.T,ye.tuck+.01],[1,ye.lock]],attF:[[0,Vt(Ft.kick)],[.07,Vt(Ft.kick,0,.12,-.02)]],attB:[[0,Vt(Ft.tail)],[.08,Vt(Ft.tail)]],rel:[[.03,.11],[.05,.14]],front:[[0,Vt(Ft.kick)],[.11,Vt(Ft.kick,.1,.16,-.12)],[.24,Vt(Ft.kick,.18,.18,-.12)],[.4,Vt(Ft.grindF,.1,.04,0)],[.5,Vt(Ft.grindF)]],back:[[0,Vt(Ft.tail)],[.14,Vt(Ft.tail,.1,.04,0)],[.34,Vt(Ft.grindB,.1,-.04,0)],[.5,Vt(Ft.grindB)]],twist:i=>-.1*ro(0,.5,i),setup:{front:Ft.kick,back:Ft.tail}}},ME=Object.fromEntries(Object.entries(uh).map(([i,t])=>[i,t.name])),Ds=Object.fromEntries(Object.entries(uh).map(([i,t])=>{let e=t.rot(1);return[i,{name:t.name,flip:t.flip,catch:t.catch,phi:Math.abs(e.phi)*(180/Math.PI),psi:Math.abs(e.psi)*(180/Math.PI)}]}));function S1(i,t){for(let e=0;e<i.length-1;e++){let[n,s]=i[e],[r,o]=i[e+1];if(t<=r)return je(s,o,ld((t-n)/(r-n)))}return i.at(-1)[1]}function b1(i){let{pushes:t,brake:e}=Ae,n=0;for(let s of t)n=Math.max(n,Ee(s.s-.3,s.s,i)*(1-Ee(s.back-.1,s.back+.25,i)));return i<t[0].p0&&(n=1),n=Math.max(n,.8*Ee(e.t0-.35,e.t0,i)*(1-Ee(e.t1,e.t1+.4,i))),n}function w1(i){let t=0;for(let e of Ae.pushes){let n=e.first?1:Ee(e.p0-.14,e.p0+.02,i);t=Math.max(t,n*(1-Ee(e.p1-.02,e.p1+.16,i)))}return Nn.dip*t}function E1(i){let{S1:t,S2:e,S3:n,OFF:s,brake:r}=Ae,o=ye.ride-w1(i);o-=.06*Ee(r.t0-.2,r.t0+.2,i)*(1-Ee(r.t1-.1,r.t1+.3,i));for(let a of[t,e,s])if(i>=a.tl){let l=i-a.tl,c=9,h=ye.land-ye.ride,d=a.vyl+c*h;o+=(h+d*l)*Math.exp(-c*l)}for(let a of[t,e,n]){let l=a.tp-.42,c=a.tp-.15;i>l&&i<a.tp&&(i<c?o=je(o,ye.crouch,dh((i-l)/(c-l))):o=is(ye.crouch,0,ye.pop,a.vy0*(a.tp-c),(i-c)/(a.tp-c)))}return o}function Hp(i){let{S1:t,S2:e}=Ae;return i<t.tl?"S1":i<e.tl?"S2":i<Ae.OFF.tl?"S3":null}function es(i,t,e,n){let s=v1(e.x,e.yaw),r=ce(s.n[0],s.n[1],0),o=ce(e.x,s.y,e.z).addScaledVector(r,e.lift??0),a=ce(Math.sin(e.yaw),0,Math.cos(e.yaw));return a.addScaledVector(r,-a.dot(r)).normalize(),n.pos=o.applyQuaternion(t).add(i),n.dir=a.applyQuaternion(t),n.up=r.applyQuaternion(t),n}var T1=(i,t,e)=>({pos:i.pos.clone().lerp(t.pos,e),dir:i.dir.clone().lerp(t.dir,e).normalize(),up:i.up.clone().lerp(t.up,e).normalize()});function lh(i,t,e,n,s){let r=[i.clone().addScaledVector(t,.25).addScaledVector(e,-.02).addScaledVector(n,.1),i.clone().addScaledVector(t,-.25).addScaledVector(e,-.02).addScaledVector(n,.1)],o=[i.clone().addScaledVector(t,.62).addScaledVector(e,.36).addScaledVector(n,.16),i.clone().addScaledVector(t,-.58).addScaledVector(e,.34).addScaledVector(n,.02)],a=r.map((l,c)=>l.lerp(o[c],s.bal??0));return s.swing&&(a[0].addScaledVector(n,.22*s.swing).addScaledVector(e,.05*Math.abs(s.swing)),a[1].addScaledVector(n,-.26*s.swing).addScaledVector(e,.05*Math.abs(s.swing))),a}function ah(i,t,e){let n=i.clone().applyAxisAngle(t,e),s=new P().crossVectors(n,t).normalize();return{S:n,Fw:s}}function Xp(i,t,e){return{t:is(t.t,0,e.t,e.m??0,i),n:je(t.n,e.n,Ee(.1,.65,i)),h:je(t.h+.04*dh(i/.3),0,Ee(.45,1,i))}}var qp=(i,t,e,n,s)=>{let r=i.pos.clone().sub(t);return{t:r.dot(e),n:r.dot(n),h:i.pos.y-s}},ad=(i,t,e,n,s)=>{let r=t.clone().addScaledVector(e,i.t).addScaledVector(n,i.n);return r.y=s+i.h,r};function A1(i,t,e,n,s,r){for(let o of Ae.pushes){if(i<o.s&&!o.first||i>o.back)continue;let a=rd(o.p0),l=rd(o.p1),c=l.x-a.x,h=Nn.hip+.06+c/2,d=od(a.x),u=ce(a.x,0,ao(a.x)).addScaledVector(oo(d),h).addScaledVector(hh(d),Nn.side);u.y=Ps(u.x,u.z);let f=oo(d).applyAxisAngle(Le,-.18),m=qp(t,e,n,s,r),v,g;if(i<o.p0)g=(i-o.s)/(o.p0-o.s),v=ad(Xp(g,m,{t:h,n:Nn.side,m:-a.v*(o.p0-o.s)}),e,n,s,r);else if(i<=o.p1)g=1,v=u.clone();else{let p=(i-o.p1)/(o.back-o.p1);g=1-dh(p);let _={t:is(h-c,-l.v*(o.back-o.p1),m.t,0,p),n:je(Nn.side,m.n,Ee(.5,.95,p)),h:je(0,m.h,Ee(.3,1,p))+.14*Math.sin(Math.PI*p)**2};v=ad(_,e,n,s,r)}return o.first&&i<o.p0&&(g=1,v=u.clone()),{pos:v,dir:t.dir.clone().lerp(f,g).normalize(),up:t.up.clone().lerp(Le,g).normalize(),down:(i>=o.p0||o.first)&&i<=o.p1}}return null}function Gp(i,t,e=_1){let n=i.pos.clone().addScaledVector(i.dir,Vp[0]).addScaledVector(i.up,Vp[1]),s=n.distanceTo(t);if(s<=e)return i;let r=t.clone().add(n.clone().sub(t).multiplyScalar(e/s));return i.pos.add(r.sub(n)),i}function Us(i){let{S1:t,S2:e,S3:n,GR:s,OFF:r,pushes:o,brake:a}=Ae,l={tau:i},c=rd(i);l.speed=c.v;let h=[["S1",t],["S2",e],["S3",n],["OFF",r]],d=null;for(let[N,U]of h)i>=U.tp&&i<U.tl&&(d=[N,U]);let u=i>=s.t0&&i<s.t1,f=i<t.tl?0:Math.PI,m,v,g,p,_,T=Le.clone(),y,S,E=.12,w=.1,x=.06,b=0,R,L;if(l.flip={phi:0,psi:0,theta:0},d){let[N,U]=d,O=(i-U.tp)/U.T,Y=i-U.tp,X=uh[N];l.phase=N==="OFF"?"pop-off":O<X.catch?"flip":"air",l.u=O,l.station=N==="OFF"?"S3":N;let ot=N==="S3"?Math.atan(-qn.slope):od(U.xp),H=N==="S3"?je(ot,0,Ee(.1,.8,O)):N==="OFF"?0:ot;_=oo(H),y=hh(H);let Q=U.xp+or+U.vx*Y,tt=U.pel0+U.vy0*Y-.5*Un*Y*Y,gt;N==="S3"?gt=is(qn.z+Is,qn.slope*U.vx*U.T,Qi+Is,0,O):N==="OFF"?gt=je(Qi,ao(r.xl),Ee(0,1,O))+Is:gt=ao(U.xp)+Is,m=ce(Q,tt,gt);let xt,$t,Gt;N==="OFF"?(xt=ye.off,$t=or,Gt=-yi):(xt=U.pel0-(U.y0+vi+ts.dy),$t=or-ts.dx,Gt=ts.pitch);let G=X?X.e(U).map(([st,ct])=>[st,ct??xt]):[[0,xt],[.4,.68],[1,ye.land]],I=S1(G,O),D=je($t,or,Ee(0,.25,O)),k;if(N==="OFF"?k=-yi*(1-Ee(.05,.75,O)):k=Gt*(1-Ee(0,.24,O))-(N==="S3"?yi*Ee(.5,.68,O):0),g=Xn(Le,H).multiply(Xn(so,k)),v=m.clone().addScaledVector(T,-I).addScaledVector(_,-D).addScaledVector(y,-Is),N==="S3"){let st=1-ns.cross[0]/U.T,ct=1-ns.cross[1]/U.T,pt=qn.slope*U.vx*U.T;v.z=O<st?is(qn.z,pt*st,ns.hold,0,O/st):O<ct?is(ns.hold,0,Qi,0,(O-st)/(ct-st)):Qi}let W=new Ve,$=0;if(X){let st=(O-X.flip[0])/(X.flip[1]-X.flip[0]),ct=st<=0?{phi:0,psi:0,theta:0}:st>=1?X.rot(1):X.rot(st);l.flip=ct,l.flipS=ni(st),W=Xn(Le,ct.psi).multiply(Xn(so,ct.theta)).multiply(Xn(ch,ct.phi)),$=st>0&&st<1?X.gap(st):0}let ut=Le.clone().applyQuaternion(g),ht=v.clone().addScaledVector(ut,-$);if(p=g.clone().multiply(W).multiply(Xn(Le,f)),l.board={pos:ht,quat:p},X){let st=g.clone().multiply(W),ct=[ji(O,X.front),ji(O,X.back)].map(Lt=>es(v,g,Lt,{})),pt=[ji(O,X.attF),ji(O,X.attB)].map(Lt=>es(ht,st,Lt,{}));S=ct.map((Lt,It)=>T1(pt[It],Lt,Ee(X.rel[It][0],X.rel[It][1],O)))}else S=[ji(O,[[0,Vt(Ft.grindF)],[.5,Vt(Ft.front)]]),ji(O,[[0,Vt(Ft.grindB)],[.5,Vt(Ft.back)]])].map(st=>es(v,g,st,{}));E=.08,w=.22-.1*O,x=X?X.twist(O):0;let Z=N==="OFF"?1-.4*O:Ee(0,.2,O)*(1-.5*Ee(.75,1,O)),et=ah(_,T,E);R=lh(m,et.S,T,et.Fw,{bal:Z}),L=(X&&O<X.catch?ht.clone():v.clone()).addScaledVector(_,.4+2.2*O).addScaledVector(T,-.2),N==="S3"&&O>.4&&(L=ce(s.xOff,Dn(s.xOff),Qi))}else if(u){l.phase="grind",l.station="S3";let N=s.xbAt(i);_=ch.clone(),y=so.clone(),v=ce(N,Dn(N)+sd,Qi),g=Xn(so,-yi),p=g.clone().multiply(Xn(Le,f)),l.board={pos:v.clone(),quat:p};let U=i-s.t0,O=9,Y=ye.lock-ye.grind,X=-ns.dv+O*Y,ot=gt=>ye.grind+(Y+X*gt)*Math.exp(-O*gt),H=ot(U),Q=s.T-.1;if(U>Q){let gt=(X-O*(Y+X*Q))*Math.exp(-O*Q);H=is(ot(Q),gt*.1,ye.off,r.popUp*.1,(U-Q)/.1)}m=v.clone().addScaledVector(T,H).addScaledVector(_,or).addScaledVector(y,Is),S=[es(v,g,Vt(Ft.grindF),{}),es(v,g,Vt(Ft.grindB),{})],E=.08,w=.16,x=-.08,b=.06;let tt=ah(_,T,E);R=lh(m,tt.S,T,tt.Fw,{bal:1}),L=ce(s.xOff+1.6,.6,Qi),l.grindU=U/s.T}else{let N=c.x,U=od(N);_=oo(U),y=hh(U);let O=ao(N),Y=Ps(N,O),X=0,ot=ce(N,Y+vi,O);for(let $ of[t,e,n])if(i>=$.tp-ts.lead&&i<$.tp){X=ts.pitch*((i-($.tp-ts.lead))/ts.lead)**2;let[ut,ht]=Wp(X);ot=ce(N,Y+pe.wheelR,O).addScaledVector(_,Ls.x+ut).add(ce(0,ht,0))}g=Xn(Le,U).multiply(Xn(so,X)),p=g.clone().multiply(Xn(Le,f)),v=ot,l.board={pos:ot.clone(),quat:p},l.station=Hp(i);let H=E1(i),Q=b1(i);E=je(.12,1.18,Q),w=je(.1,.26,Q),x=je(.06,0,Q),m=ce(N,Y+vi+H,O).addScaledVector(_,je(or,.11,Q)).addScaledVector(y,je(Is,.1,Q));for(let $ of[t,e,n])w+=.22*ro($.tp-.5,$.tp+.05,i);let tt=Vt(Ft.front),gt=Vt(Ft.back);tt=ji(Q,[[0,tt],[1,Vt(Ft.push)]]);let xt=Hp(i),$t=xt?Ae[xt]:null;if($t&&i>$t.tp-1){let $=uh[xt],ut=Ee($t.tp-.95,$t.tp-.7,i),ht=Ee($t.tp-.78,$t.tp-.5,i);tt=ji(ut,[[0,tt],[1,Vt($.setup.front)]]),gt=ji(ht,[[0,gt],[1,Vt($.setup.back)]]),gt.lift=.05*ro($t.tp-.78,$t.tp-.5,i)}S=[es(ot,g,tt,{}),es(ot,g,gt,{})];let Gt=ah(_,T,E),G=m.clone().addScaledVector(Gt.S,-.115).addScaledVector(T,-.04),I=A1(i,S[1],ce(N,Y,O),_,y,Y);if(I&&(S[1]=I.down?I:Gp(I,G)),i>a.t0-.35&&i<a.t1+.4){let $=Ee(a.t0-.35,a.t0,i)*(1-Ee(a.t1,a.t1+.4,i)),ut=ce(N,Y,O),ht=S[1];S[1]=Gp({pos:ad(Xp($,qp(ht,ut,_,y,Y),{t:-.14,n:.27}),ut,_,y,Y),dir:ht.dir.clone().lerp(oo(U).applyAxisAngle(Le,-.5),$).normalize(),up:ht.up.clone().lerp(Le,$).normalize()},G),l.braking=$}let D=0;for(let $ of o)i>$.s&&i<$.back+.2&&(D=Math.sin(2*Math.PI*(i-$.s)/($.back+.2-$.s))*ro($.s,$.back+.2,i));let k=0;for(let $ of[t,e,n])k=Math.max(k,Ee($.tp-.35,$.tp,i));for(let $ of[t,e,r])i>=$.tl&&(k=Math.max(k,.6*(1-Ee($.tl,$.tl+.7,i))));R=lh(m,Gt.S,T,Gt.Fw,{bal:k,swing:D});let W=xt?{S1:ce(_e.gap.x0,_e.upper.y,0),S2:ce(_e.four.x0,_e.upper.y,0),S3:ce(_e.ten.x0+1,2.2,Qi)}[xt]:null;L=W&&W.x-N<9&&W.x>N?W:m.clone().addScaledVector(_,6).setY(Y+.4),l.phase=i<o[0].p0?"idle":l.braking>.5?"brake":Q>.5?"push":"roll";for(let $ of[t,e,n])i>=$.tp-.95&&i<$.tp&&(l.phase="setup");for(let $ of[t,e,r])i>=$.tl&&i<$.tl+.5&&(l.phase="land")}let F=ah(_,T,E);return l.pose={pelvis:m,side:F.S,up:T,twist:x,lean:w,bank:b,look:L,feet:S,hands:R},l.T=_,l.N=y,l}var Ca=new Br([[13.6,-5],[15.8,-8.9],[22,-9.7],[28.6,-8.5],[30.6,-5],[27.2,-3.1],[21,-2.9],[15.8,-3]].map(([i,t])=>ce(i,0,t)),!0,"centripetal"),Ra=Ca.getLength();function fh(i){let e=((i*3.1+7)%Ra+Ra)%Ra,n=Ca.getUtoTmapping(e/Ra),s=Ca.getPoint(n),r=Ca.getTangent(n),o=Ca.getTangent((n+.004)%1),a=Math.atan2(r.x*o.z-r.z*o.x,r.x*o.x+r.z*o.z)/(.004*Ra||1),l=Math.atan(3.1*3.1*a/Un),c=Math.atan2(-r.z,r.x),h=oo(c),d=hh(c),u=Xn(Le,c).multiply(Xn(ch,-l*.6)),f=s.clone().add(ce(0,vi,0)),m=f.clone().addScaledVector(Le,ye.ride).addScaledVector(h,or).addScaledVector(d,Is-l*.5),v=[es(f,u,Vt(Ft.front),{}),es(f,u,Vt(Ft.back),{})],g=h.clone().applyAxisAngle(Le,.12),p=new P().crossVectors(g,Le).normalize();return{board:{pos:f,quat:u},pose:{pelvis:m,side:g,up:Le.clone().applyAxisAngle(h,l*.5),twist:.05,lean:.1,bank:0,look:m.clone().addScaledVector(h,5).setY(.3),feet:v,hands:lh(m,g,Le,p,{bal:.25})},speed:3.1,pos:s}}var id=ce(9.4,0,2.5);function R1(i,t,{crouch:e=0,handsAt:n=null,look:s=null}={}){let r=t.clone().setY(0).normalize(),o=new P().crossVectors(Le,r).normalize(),a=i.clone().add(ce(0,.97-e,0)).addScaledVector(r,-.03),l=c=>({pos:i.clone().addScaledVector(o,c*.13).addScaledVector(r,c*.04),dir:r.clone().applyAxisAngle(Le,-c*.15),up:Le.clone()});return{pelvis:a,side:o,up:Le.clone(),twist:0,lean:.06+e*.4,bank:0,look:s??a.clone().addScaledVector(r,4),feet:[l(1),l(-1)],hands:n}}function $p(i,t){let e=t.clone().sub(id).setY(0),n=e.lengthSq()>1e-6?e.normalize():ce(-1,0,0),s=new P().crossVectors(Le,n).normalize(),r=id.clone().add(ce(0,1.18,0)).addScaledVector(n,.36),o=[r.clone().addScaledVector(s,.08).add(ce(0,-.05,0)),r.clone().addScaledVector(s,-.09).add(ce(0,-.06,0))];return{pose:R1(id,n,{crouch:.1,handsAt:o,look:t}),cam:r,aim:t.clone().sub(r).normalize(),rec:Math.floor(i*2)%2===0}}var C1=[ce(-5,_e.middle.y,_e.zMin+.7),ce(-3.8,_e.middle.y,_e.zMin+.7)];function Yp(i,t){return C1.map((e,n)=>{let s=e.clone().add(ce(0,.58,.02)),r=.5,o=l=>({pos:e.clone().add(ce(l*.14,0,r+.04)),dir:so.clone(),up:Le.clone()}),a=[s.clone().add(ce(.17,.02,.36)),s.clone().add(ce(-.17,.02,.36))];return{pelvis:s,side:ch.clone(),up:Le.clone(),twist:0,lean:.18+.04*Math.sin(i*.7+n),bank:0,look:t.clone().add(ce(0,.5,0)),feet:[o(1),o(-1)],hands:a}})}function Pa(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new we,c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let m=0;m<f.count;++m)d.push(f.getX(m)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=Zp(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][u]);let m=Zp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Zp(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ge(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/e;for(let u=0,f=h.count;u<f;u++)for(let m=0;m<e;m++){let v=h.getComponent(u,m);a.setComponent(u+d,m,v)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var Ue=Math.PI,Da=Ue*2,em=(i,t,e)=>Math.min(e,Math.max(t,i)),nm=(i,t,e)=>i+(t-i)*e,pd=i=>em(i,0,1),P1=i=>{let t=pd(i);return t*t*(3-2*t)},Ia=(i=0,t=0,e=0)=>new P(i,t,e),I1=new P,L1=new Ve,D1=new Zn,U1=new P,Oe=(i=0,t=0,e=0,n=0,s=0,r=0,o=1,a=1,l=1)=>new jt().compose(I1.set(i,t,e),L1.setFromEuler(D1.set(n,s,r)),U1.set(o,a,l)),Fn={wall:"#e8ecf7",interior:"#d3d9ee",interiorDeep:"#bcc5e3",wing:"#dce2f3",hub:"#e8ecf6",post:"#98a3c6",pane:"#eef1fb",window:"#9cb2ef",slat:"#dfe4f2",pallet:"#c99a62",tealLight:"#8fdcd2",tealDeep:"#178f83",steel:"#c3cbe3"},AE={aurora:{name:"AURORA",main:yt.blue,light:yt.blueLight,deep:yt.blueDeep,reg:"AU-NBA",mark:"aurora"},kestrel:{name:"KESTREL",main:yt.teal,light:Fn.tealLight,deep:Fn.tealDeep,reg:"KS-TRL",mark:"kestrel"}},ph=null;function On(){return ph||(ph={white:Bt(yt.white),paintWhite:Bt(yt.white,{paint:!0,rough:.5}),panel:Bt(yt.panel),wall:Bt(Fn.wall,{rough:.72}),roof:Bt(yt.roof,{rough:.62}),blue:Bt(yt.blue,{rough:.5}),blueDeep:Bt(yt.blueDeep,{rough:.5}),blueLight:Bt(yt.blueLight,{rough:.5}),navy:Bt(yt.navy,{rough:.7}),glass:Bt(yt.glass,{rough:.16}),shade:Bt(yt.shade,{rough:.6}),wing:Bt(Fn.wing,{paint:!0,rough:.5}),hub:Bt(Fn.hub,{rough:.42}),steel:Bt(Fn.steel,{rough:.45}),tyre:Bt(yt.navy,{rough:.82}),green:Bt(yt.green,{rough:.72}),greenDeep:Bt(yt.greenDeep,{rough:.72}),trunk:Bt(yt.trunk,{rough:.8}),post:Bt(Fn.post,{rough:.45}),pane:Bt(Fn.pane,{opacity:.55,rough:.3}),window:Bt(Fn.window,{rough:.4}),cardboard:Bt(yt.cardboard,{rough:.82}),pallet:Bt(Fn.pallet,{rough:.85}),slat:Bt(Fn.slat,{rough:.6}),fan:Bt("#2c3a5e",{rough:.5}),room:_h(Fn.interior,Fe,.9),roomDeep:_h(Fn.interiorDeep,Fe,.9),hold:_h("#9ba7cc",jn,.85)},ph)}var cd=new Map;function _h(i,t,e){let n=`${i}|${t}|${e}`;return cd.has(n)||cd.set(n,new on({color:i,roughness:e,side:t})),cd.get(n)}function ar(i){let t=i.index?i.toNonIndexed():i.clone();for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t.attributes.normal||t.computeVertexNormals(),t.attributes.uv||t.setAttribute("uv",new Ge(new Float32Array(t.attributes.position.count*2),2)),t.morphAttributes={},t.clearGroups(),t}var hd=new Map,Fs=(i,t)=>(hd.has(i)||hd.set(i,t()),hd.get(i));function vh(i,t,e,n=.12,s=32){return Fs(`rcyl|${i}|${t}|${e}|${n}|${s}`,()=>{let r=Math.min(n,e/2-.001,Math.min(i,t)-.001),o=[new ft(1e-4,-e/2)],a=(l,c,h,d)=>{for(let u=0;u<=4;u++){let f=nm(h,d,u/4);o.push(new ft(l+r*Math.cos(f),c+r*Math.sin(f)))}};return a(i-r,-e/2+r,-Ue/2,0),a(t-r,e/2-r,0,Ue/2),o.push(new ft(1e-4,e/2)),new kr(o,s)})}var md=(i,t=40)=>new kr(i.map(([e,n])=>new ft(e,n)),t),Pn=class{constructor(){this.parts=new Map}add(t,e,n){let s=ar(e);return n&&s.applyMatrix4(n),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(s),this}box(t,e,n,s,r,o,a,l=null,c=0,h=0,d=0){return this.add(t,ue(e,n,s,l??Math.min(e,n,s)*.2),Oe(r,o,a,c,h,d))}flat(t,e,n,s,r,o,a,l=0,c=0,h=0){return this.add(t,Fs(`box|${e}|${n}|${s}`,()=>new Ke(e,n,s)),Oe(r,o,a,l,c,h))}cyl(t,e,n,s,r,o,a,l="y",c=.12,h=32){let d=l==="x"?Oe(r,o,a,0,0,-Ue/2):l==="z"?Oe(r,o,a,Ue/2,0,0):Oe(r,o,a);return this.add(t,vh(e,n,s,c,h),d)}freeze(){return[...this.parts].map(([t,e])=>({mat:t,geo:Pa(e,!1)}))}build(){return gd(this.freeze())}};function gd(i,t=new Se){for(let{geo:e,mat:n}of i){let s=new Qt(e,n);s.castShadow=!n.transparent&&n.side!==Fe,s.receiveShadow=!n.userData.noShadow&&n.side!==Fe,t.add(s)}return t}function N1(i,t,e,n,s,r=.06){let o=new P().subVectors(n,e),a=o.length(),l=new Ve().setFromUnitVectors(Ia(0,1,0),o.multiplyScalar(1/a));i.add(t,ue(s,a,s,r,1),new jt().compose(e.clone().add(n).multiplyScalar(.5),l,Ia(1,1,1)))}var Mi=i=>{let t=null;return()=>t??=i()};var lr={R:3.5,Yc:6,nose:23,tail:-23,noseLen:6.5,tailLen:12.5,capLen:.9,rEnd:.72,droop:1.15,up:.6},Jp=3.2,Kp=5,F1=2.4,O1=2.4;function lo(i){let{R:t,Yc:e,nose:n,tail:s,noseLen:r,tailLen:o,capLen:a,rEnd:l,droop:c,up:h}=lr,d=n-r,u=s+o,f=s+a;if(i>=d){let v=pd((i-d)/r);return{r:t*Math.pow(Math.max(0,1-Math.pow(v,2.3)),1/2.3),yc:e-c*Math.pow(v,1.6)}}if(i>=u)return{r:t,yc:e};if(i>=f){let v=P1((u-i)/(u-f)),g=t-(t-l)*v;return{r:g,yc:e+t-h*v-g}}let m=pd((f-i)/a);return{r:l*Math.sqrt(Math.max(0,1-m*m)),yc:e+t-h-l}}function B1(i){let e=lo(i-.004),n=lo(i+.004);return{dr:(n.r-e.r)/(2*.004),dy:(n.yc-e.yc)/(2*.004)}}var mh=i=>Math.acos(em((i-lr.Yc)/lr.R,-1,1)),yh={cargoTop:mh(Jp+F1),cargoSill:mh(Jp),paxSill:mh(Kp),paxTop:mh(Kp+O1)},z1=[{x0:9.25,x1:12},{x0:-10.25,x1:-7.5}];var Ua=Mi(()=>{let{nose:i,tail:t,noseLen:e,tailLen:n,capLen:s}=lr,r=t+s,o=t+n,a=i-e,l=[],c=12;for(let _=0;_<c;_++)l.push(r-s*Math.cos(_/c*Ue/2));let h=Math.ceil((o-r)/.25);for(let _=0;_<h;_++)l.push(r+(o-r)*_/h);let d=Math.round((a-o)/.25);for(let _=0;_<d;_++)l.push(o+.25*_);let u=36;for(let _=0;_<=u;_++)l.push(a+e*Math.sin(_/u*Ue/2));let f=[],m=128;for(let _=0;_<=m;_++)f.push(_/m*Da);for(let _ of[yh.cargoTop,yh.cargoSill]){let T=0;for(let y=1;y<f.length;y++)Math.abs(f[y]-_)<Math.abs(f[T]-_)&&(T=y);Math.abs(f[T]-_)<.012?f[T]=_:f.push(_)}f.sort((_,T)=>_-T);let v=[0];for(let _=1;_<l.length;_++)v.push(v[_-1]+Math.hypot(l[_]-l[_-1],lo(l[_]).r-lo(l[_-1]).r));let g=v[v.length-1];return{xs:l,ths:f,S:v,Stot:g,uOf:_=>{if(_<=l[0])return 0;for(let T=1;T<l.length;T++)if(_<=l[T])return nm(v[T-1],v[T],(_-l[T-1])/(l[T]-l[T-1]))/g;return 1}}});function gh(i,t,e,n,{dr:s=0,flip:r=!1,skip:o=null}={}){let{xs:a,ths:l,S:c,Stot:h}=Ua(),d=t-i+1,u=n-e+1,f=new Float32Array(d*u*3),m=new Float32Array(d*u*3),v=new Float32Array(d*u*2);for(let _=0;_<d;_++){let T=a[i+_],{r:y,yc:S}=lo(T),{dr:E,dy:w}=B1(T),x=Math.max(0,y+s);for(let b=0;b<u;b++){let R=l[e+b],L=Math.cos(R),F=Math.sin(R),N=_*u+b;f.set([T,S+x*L,x*F],N*3);let U=-E-L*w,O=Math.hypot(U,L,F),Y=r?-1:1;m.set([Y*U/O,Y*L/O,Y*F/O],N*3),v.set([c[i+_]/h,R/Da],N*2)}}let g=[];for(let _=0;_<d-1;_++)for(let T=0;T<u-1;T++){if(o&&o(i+_,e+T))continue;let y=_*u+T,S=(_+1)*u+T;r?g.push(y,S,S+1,y,S+1,y+1):g.push(y,S+1,S,y,y+1,S+1)}let p=new we;return p.setAttribute("position",new Ge(f,3)),p.setAttribute("normal",new Ge(m,3)),p.setAttribute("uv",new Ge(v,2)),p.setIndex(g),p}var jp=i=>Ua().xs.findIndex(t=>Math.abs(t-i)<1e-6),Qp=i=>Ua().ths.findIndex(t=>Math.abs(t-i)<1e-9);function tm(i,t){let e=[];for(let s=0;s<i.length-1;s++)e.push(...i[s],...t[s],...t[s+1],...i[s],...t[s+1],...i[s+1]);let n=new we;return n.setAttribute("position",new ae(e,3)),n.computeVertexNormals(),n}var xh=(i,t,e)=>{let{r:n,yc:s}=lo(i);return[i,s+(n+e)*Math.cos(t),(n+e)*Math.sin(t)]};function ud(i,t,e,n,s){let{xs:r,ths:o}=Ua(),a=[],l=[],c=[],h=[];for(let d=i;d<=t;d++)a.push(xh(r[d],o[e],s)),l.push(xh(r[d],o[n],s));for(let d=e;d<=n;d++)h.push(xh(r[i],o[d],s)),c.push(xh(r[t],o[d],s));return{top:a,sill:l,fwd:c,aft:h}}var RE=Mi(()=>{let{xs:i,ths:t}=Ua(),e=z1.map(({x0:a,x1:l})=>({i0:jp(a),i1:jp(l),j0:Qp(yh.cargoTop),j1:Qp(yh.cargoSill)})),n=(a,l)=>e.some(c=>a>=c.i0&&a<c.i1&&l>=c.j0&&l<c.j1),s=gh(0,i.length-1,0,t.length-1,{skip:n}),r=[],o=e.map(a=>{let l=ud(a.i0,a.i1,a.j0,a.j1,0),c=ud(a.i0,a.i1,a.j0,a.j1,-1.1);for(let p of["top","sill","fwd","aft"])r.push(ar(tm(l[p],c[p])));r.push(ar(gh(a.i0,a.i1,a.j0,a.j1,{dr:-1.1})));let h=gh(a.i0,a.i1,a.j0,a.j1),d=ud(a.i0,a.i1,a.j0,a.j1,-.12),u=[ar(gh(a.i0,a.i1,a.j0,a.j1,{dr:-.12,flip:!0}))];for(let p of["top","sill","fwd","aft"])u.push(ar(tm(l[p],d[p])));let f=t[a.j0],m=Ia(0,lr.Yc+lr.R*Math.cos(f),lr.R*Math.sin(f)),v=new jt().makeTranslation(-m.x,-m.y,-m.z);h.applyMatrix4(v);let g=Pa(u,!1);return g.applyMatrix4(v),{outer:h,lining:g,hinge:m}});return{fuselage:s,hold:Pa(r,!1),panels:o}});var im={main:{x:-1,y:3.62,z:3.95,axle:.82},nose:{x:18.2,y:2.6,axle:.55}},k1=(i,t)=>Fs(`tyre|${i}|${t}`,()=>{let e=i*.56,n=t*.32,s=[[e,-t/2]];for(let r=0;r<=5;r++){let o=-Ue/2+r/5*(Ue/2);s.push([i-n+n*Math.cos(o),-t/2+n+n*Math.sin(o)])}for(let r=0;r<=5;r++){let o=r/5*(Ue/2);s.push([i-n+n*Math.cos(o),t/2-n+n*Math.sin(o)])}return s.push([e,t/2]),md(s,36).applyMatrix4(Oe(0,0,0,Ue/2,0,0))});function La(i,t,e,n,s,r){i.add(On().tyre,k1(t,e),Oe(n,s,r)),i.add(On().hub,vh(t*.58,t*.58,e*.82,.06,28),Oe(n,s,r,Ue/2,0,0)),i.add(On().steel,vh(t*.22,t*.22,e*.92,.04,20),Oe(n,s,r,Ue/2,0,0))}var CE=Mi(()=>{let i=On(),t=new Pn,{y:e,axle:n}=im.main,s=e-n;return t.cyl(i.steel,.24,.24,s+.2,0,-s/2,0,"y",.08,20),t.box(i.steel,.42,.34,1,0,-s,0,.12),t.box(i.steel,.16,1.2,.16,.34,-s*.55,0,.06,0,0,.5),La(t,.82,.62,0,-s,-.46),La(t,.82,.62,0,-s,.46),t.freeze()}),PE=Mi(()=>{let i=On(),t=new Pn,{y:e,axle:n}=im.nose,s=e-n;return t.cyl(i.steel,.18,.18,s+.2,0,-s/2,0,"y",.06,18),t.box(i.steel,.3,.26,.7,0,-s,0,.1),La(t,.55,.42,0,-s,-.34),La(t,.55,.42,0,-s,.34),t.freeze()}),IE=Mi(()=>{let i=new Pn;i.add(On().paintWhite,md([[.56,-.66],[.53,-.44],[.41,-.22],[.22,-.08],[.01,-.02]]),Oe(0,0,0,0,0,-Ue/2));for(let t=0;t<16;t++){let e=t/16*Da,n=Oe(0,0,0,e,0,0).multiply(Oe(-.58,.98,0,0,.55,0));i.add(On().fan,Fs("blade",()=>new Ke(.1,.88,.3)),n)}return i.freeze()});function dd(i,t,e,n,s,r,{pitch:o=.78,w:a=.17,d:l=.07,gaps:c=[],y0:h=0}={}){let d=Math.floor((s-n)/o),u=(s-n-d*o)/2;for(let f=0;f<=d;f++){let m=n+u+f*o;if(m<n+.25||m>s-.25)continue;let v=h;for(let[p,_,T]of c)m>p&&m<_&&(v=Math.max(v,T));let g=r(m)-.05;g-v<.15||i.add(t,Fs(`rib|${a}|${l}`,()=>new Ke(a,1,l)),e.clone().multiply(Oe(m,(v+g)/2,l/2,0,0,0,1,g-v,1)))}}function fd(i,t=[],e=.4){let n=new xs(i.map(([r,o])=>new ft(r,o)));for(let[r,o,a,l]of t)n.holes.push(new Ys([new ft(r,o),new ft(a,o),new ft(a,l),new ft(r,l)]));let s=new Zi(n,{depth:e,bevelEnabled:!1,curveSegments:4});return s.translate(0,0,-e),s}var V1=(i,t)=>Fs(`shutter|${i}|${t}`,()=>{let e=[ar(new Ke(i,t,.08))];for(let n=.3;n<t-.1;n+=.42)e.push(ar(new Ke(i,.07,.12)).translate(0,n-t/2,0));return Pa(e,!1)}),LE=Mi(()=>{let i=t=>{let e=new on({color:t,roughness:.82});return e.userData.noShadow=!0,e};return{cardboard:i(yt.cardboard),pallet:i(Fn.pallet)}});var ln={floor:5,rotR:2.5,pivotX:2.3,LA:10.5,LB:10,gap:.4,ov:1.4,cj:.4,front:3.45,hRange:[3,7.4],wA:2.9,hA:3.05,wB:3.3,hB:3.4},DE=Mi(()=>{let i=On(),t=new Pn;t.box(i.panel,2.6,.4,2.6,0,.2,0,.14),t.cyl(i.panel,.78,.7,ln.floor-.5,0,(ln.floor-.5)/2+.3,0,"y",.12),t.cyl(i.white,ln.rotR,ln.rotR,3.5,0,ln.floor-.4+1.75,0,"y",.3,40),t.cyl(i.blue,ln.rotR+.08,ln.rotR+.08,.55,0,ln.floor-.12,0,"y",.2,40),t.cyl(i.blue,ln.rotR+.16,ln.rotR+.1,.5,0,ln.floor+3.25,0,"y",.2,40);let e=(o,a,l,c)=>{let h=new Pn,d=-.25-(l-ln.hA)/2;return h.box(c,o,l,a,o/2,d+l/2,0,.32),h.box(i.blue,o+.02,.55,a+.06,o/2,d+.3,0,.2),h.box(i.glass,o-1.2,.56,a+.05,o/2,d+l*.62,0,.16),h.freeze()},n=new Pn;n.box(i.blue,3,3.6,3.9,1.15,-.3+1.8,0,.36),n.box(i.glass,1.3,1.1,3.94,2,2.05,0,.18);for(let o=0;o<3;o++)n.box(i.navy,.26,3.5-o*.12,3.75-o*.12,2.75+o*.24,-.3+1.8,0,.12);n.box(i.navy,.18,.5,3,3.36,-.12,0,.08);let s=new Pn;s.box(i.blue,.8,.55,3.1,0,1.05,0,.18);for(let o of[-1.05,1.05])La(s,.6,.48,0,.6,o);let r=new Pn;for(let o of[-.85,.85])r.box(i.blue,.42,1,.42,0,.5,o,.08);return{rot:t.freeze(),A:e(ln.LA,ln.wA,ln.hA,i.white),B:e(ln.LB,ln.wB,ln.hB,i.panel),cab:n.freeze(),col:s.freeze(),post:r.freeze()}});var UE=Mi(()=>{let i=On(),t=new Pn;t.box(i.white,10,4.6,10,0,2.3,0,.5),t.box(i.blue,10.3,.6,10.3,0,4.5,0,.24),t.box(i.glass,3.2,2.6,.3,0,1.3,5.02,.12),t.box(i.blue,3.8,.4,.5,0,2.75,5.05,.14),t.cyl(i.white,2.35,2.2,21,0,4.8+10.5,0,"y",.3,40);for(let n of[10,16,22])t.cyl(i.blue,2.42,2.42,.45,0,n,0,"y",.16,40);for(let n=7;n<24;n+=3)t.box(i.glass,.7,1.1,.3,0,n+1.2,2.25,.12);t.add(i.white,md([[2.2,25.6],[2.6,26.3],[3.6,27.1],[4.4,27.6]],40)),t.cyl(i.blue,4.9,4.9,.72,0,27.95,0,"y",.26,40);let e=10;t.add(i.glass,new An(4.85,4.35,3.3,e,1,!0),Oe(0,28.3+1.65,0));for(let n=0;n<e;n++){let s=n/e*Da;N1(t,i.white,Ia(Math.sin(s)*4.38,28.25,Math.cos(s)*4.38),Ia(Math.sin(s)*4.9,31.65,Math.cos(s)*4.9),.24)}return t.cyl(i.blue,5.3,5.3,.75,0,31.9,0,"y",.3,40),t.cyl(i.white,2.4,2.1,1.4,0,33,0,"y",.25,32),t.cyl(i.panel,.16,.12,3,.8,35,.6,"y",.05,12),t.box(i.white,3,.3,.7,-.6,34.1,-.2,.12),t.box(i.blue,.5,.5,.5,-.6,33.85,-.2,.12),t.freeze()});var H1={W:64,D:52,eave:11,top:24,doorW:50,doorH:15.5},NE=Mi(()=>{let i=On(),t=new Pn,{W:e,D:n,eave:s,top:r,doorW:o,doorH:a}=H1,l=r-s,c=(Math.pow(e/2,2)+l*l)/(2*l),h=r-c,d=S=>h+Math.sqrt(Math.max(0,c*c-S*S)),u=Math.asin(e/2/c),f=[[-e/2,0],[e/2,0],[e/2,s]];for(let S=1;S<40;S++){let E=e/2-e*S/40;f.push([E,d(E)])}f.push([-e/2,s]),t.add(i.wall,fd(f,[[-o/2,0,o/2,a]],.5)),dd(t,i.wall,new jt,-e/2,e/2,d,{gaps:[[-o/2-.9,o/2+.9,a+.9]],pitch:.82});let m=Oe(0,0,-n,0,Ue,0);t.add(i.wall,fd(f.map(([S,E])=>[S,E]),[],.5),m),dd(t,i.wall,m,-e/2,e/2,d,{pitch:.82});for(let S of[-1,1]){let E=Oe(S*e/2,0,-n/2,0,S*Ue/2,0);t.add(i.wall,fd([[-n/2,0],[n/2,0],[n/2,s],[-n/2,s]],[],.5),E),dd(t,i.wall,E,-n/2,n/2,()=>s,{pitch:.82});for(let w=-n+5;w<-3;w+=4.4)t.box(i.window,.3,1.5,3,S*e/2+S*.08,s-2.4,w,.12)}let v=(S,E,w)=>{let x=new xs;return x.absarc(0,h,E,Ue/2-w,Ue/2+w,!1),x.absarc(0,h,S,Ue/2+w,Ue/2-w,!0),x},g=new Zi(v(c-.1,c+.25,u+.012),{depth:n+1.2,bevelEnabled:!1,curveSegments:72});g.translate(0,0,-n-.6),t.add(i.roof,g);let p=new Zi(v(c+.2,c+.36,u+.01),{depth:.24,bevelEnabled:!1,curveSegments:72});for(let S=-n-.2;S<.3;S+=1)t.add(i.roof,p,Oe(0,0,S));let _=new Zi(v(c-.35,c+.55,u+.03),{depth:.6,bevelEnabled:!1,curveSegments:72});t.add(i.blueDeep,_,Oe(0,0,.2)),t.add(i.blueDeep,_,Oe(0,0,-n-.8));for(let[S,E]of[[-e/2,0],[e/2,0],[-e/2,-n],[e/2,-n]])t.box(i.blue,.8,s+.3,.8,S,s/2,E,.24);let T=.9;for(let S of[-1,1])t.box(i.blue,T,a+T,.7,S*(o/2+T/2-.05),(a+T)/2,.25,.28);t.box(i.blue,o+2*T,T,.7,0,a+T/2,.25,.28);for(let S of[-1,1]){let E=S*(o/2+3.4);t.add(i.shade,V1(6,a-.3),Oe(E,(a-.3)/2+.05,.62)),t.box(i.blue,6.3,.4,.36,E,a-.1,.66,.12),t.box(i.blue,6.3,.34,.36,E,.2,.66,.12);for(let w of[-1,1])t.box(i.blue,.3,a-.2,.36,E+w*3,a/2,.66,.1)}let y=new Zi(new xs(f.map(([S,E])=>new ft(S*.97,E*.97+.01))),{depth:n-1.2,bevelEnabled:!1,curveSegments:4});return t.add(_h("#a8b2d6",Fe,.9),y,Oe(0,0,-n+.6)),t.freeze()});var FE=Mi(()=>{let i=On(),t=new Pn;return t.box(i.panel,1.9,.7,1.9,0,.35,0,.22),t.cyl(i.white,.58,.4,22.6,0,.7+11.3,0,"y",.14,24),t.cyl(i.blue,.5,.5,.5,0,6,0,"y",.16,24),t.cyl(i.panel,1.5,1.5,.24,0,22.4,0,"y",.1,28),t.box(i.blue,4.4,2,.9,0,23.7,.35,.3,.32,0,0),t.box(i.blue,.4,1.2,.4,0,22.9,0,.12),t.freeze()});var Ns={trunkH:2.7,trunkR:.2,crown:[2,2.55,2],bush:[1.8,1.15,1.8]},G1=Mi(()=>({trunk:vh(Ns.trunkR,Ns.trunkR*.75,Ns.trunkH+.6,.05,12).clone().translate(0,(Ns.trunkH+.6)/2,0),crown:new qe(1,32,22).scale(...Ns.crown).translate(0,Ns.trunkH+Ns.crown[1]*.92,0),bush:new qe(1,28,14,0,Da,0,Ue/2).scale(...Ns.bush)}));function xd(i){let t=On(),e=G1(),n=new Se;n.name="trees";let s=i.filter(a=>(a.kind??"tree")==="tree"),r=i.filter(a=>a.kind==="bush"),o=(a,l,c)=>{if(!c.length)return;let h=new ms(a,l,c.length);c.forEach((d,u)=>h.setMatrixAt(u,Oe(d.x,0,d.z,0,d.rot??0,0,d.size??1,d.size??1,d.size??1))),h.castShadow=h.receiveShadow=!0,h.computeBoundingSphere(),n.add(h)};return o(e.trunk,t.trunk,s),o(e.crown,t.green,s),o(e.bush,t.greenDeep,r),n}function sm({length:i=30}={}){let t=On(),e=Math.max(1,Math.round(i/3)),n=i/e,s=Fs(`fence|${e}|${n.toFixed(3)}`,()=>{let o=new Pn,a=2.4;for(let l=0;l<=e;l++)o.box(t.post,.2,a+.1,.2,-i/2+l*n,(a+.1)/2,0,.07);o.box(t.post,i+.1,.12,.12,0,a,0,.05),o.box(t.post,i+.1,.12,.12,0,.18,0,.05);for(let l=0;l<e;l++)o.box(t.pane,n-.2,a-.32,.05,-i/2+(l+.5)*n,a/2+.09,0,.02);return o.freeze()}),r=gd(s);return r.name="fence",r}function rm({w:i=24,d:t=18,floors:e=5,seed:n=1}={}){let s=On(),r=3.3,o=e*r+1.4,a=Fs(`city|${i}|${t}|${e}`,()=>{let m=new Pn;return m.box(s.white,i,o,t,0,o/2,0,.5),m.box(s.white,i-1.6,.5,t-1.6,0,o+.2,0,.2),m.box(s.blue,3.4,3,.4,i*.18,1.5,t/2,.14),m.box(s.glass,2.6,2.4,.42,i*.18,1.3,t/2+.02,.1),m.freeze()}),l=gd(a);l.name="city-block";let c=[],h=[[i,t/2,0],[i,-t/2,Ue],[t,i/2,Ue/2],[t,-i/2,-Ue/2]],d=n*9301+49297,u=()=>(d=(d*9301+49297)%233280)/233280;for(let[m,v,g]of h){let p=Math.max(1,Math.floor((m-2.4)/2.6)),_=(m-2.4)/p;for(let T=1;T<e;T++)for(let y=0;y<p;y++){if(u()<.04)continue;let S=-m/2+1.2+_*(y+.5),E=1.2+T*r+r*.45;c.push(new jt().makeRotationY(g).multiply(Oe(S,E,Math.abs(v)+.03)))}}let f=new ms(ue(1.15,1.35,.14,.05),s.window,c.length);return c.forEach((m,v)=>f.setMatrixAt(v,m)),f.castShadow=!1,f.receiveShadow=!0,f.computeBoundingSphere(),l.add(f),l}var W1=i=>2.32-.5*(i-_e.ten.x0);function om(i,{x0:t,n:e,rise:n,tread:s},r,o){let a=_e.zMax-_e.zMin;for(let l=1;l<e;l++){let c=r-n*l,h=t+s*(l-.5);i.add(re(ue(s+.004,c,a,.035),o.step,h,c/2,0)),i.add(re(ue(.07,.025,a-.1,.01),o.nosing,t+s*l-.035,c-.008,0))}i.add(re(ue(.07,.025,a-.1,.01),o.nosing,t-.035,r-.008,0))}function X1(i=2.2){let t=new Se,e={seat:Bt(yt.white,{paint:!0,rough:.5}),leg:Bt(yt.blue,{paint:!0})};t.add(re(ue(i,.1,.5,.04),e.seat,0,.45,0));for(let n of[-1,1])t.add(re(ue(.12,.42,.42,.03),e.leg,n*(i/2-.25),.21,0));return t}function q1(i,t=.95){let e=new Se;e.add(re(ue(t,.02,t*.62,.008),Bt(yt.blue,{paint:!0}),0,.01,0));let n=new Qt(new _n(t*.86,t*.43).rotateX(-Math.PI/2),new on({map:eo(i,{color:yt.white,w:512,h:256,font:"italic 800 190px Inter, system-ui, sans-serif"}),transparent:!0,roughness:.6}));return n.position.y=.022,e.add(n),e}function am(){let i=_e,t=new Se;t.name="plaza";let e={ground:Bt(yt.ground,{rough:.95}),paving:Bt(yt.road,{rough:.9}),top:Bt("#eef1fb",{rough:.85}),side:Bt(yt.white,{rough:.7}),step:Bt(yt.white,{rough:.75}),nosing:Bt(yt.blueLight,{rough:.6}),coping:Bt(yt.blue,{paint:!0,rough:.45}),channel:Bt(yt.groundDeep,{rough:.8}),rail:Bt(yt.blueDeep,{paint:!0,rough:.32,metal:.25}),pad:Bt(yt.white,{rough:.7}),planter:Bt(yt.panel,{rough:.7})},n=i.zMax-i.zMin,s=new Qt(new _n(260,200).rotateX(-Math.PI/2),e.ground);s.position.set(-5,0,-30),s.receiveShadow=!0,t.add(s);let r=new Qt(new _n(108,30).rotateX(-Math.PI/2),e.paving);r.position.set(-4,.004,-2),r.receiveShadow=!0,t.add(r);let o=(w,x,b,{copeEnd:R=!1}={})=>{let L=x-w,F=(w+x)/2;t.add(re(ue(L,b-.03,n,.05),e.side,F,(b-.03)/2,0)),t.add(re(ue(L,.04,n-.04,.015),e.top,F,b-.02,0));for(let N of[i.zMin+.08,i.zMax-.08])t.add(re(ue(L,.1,.16,.04),e.coping,F,b-.03,N));R&&t.add(re(ue(.16,.1,n,.04),e.coping,w+.08,b-.03,0))};o(i.upper.x0,i.gap.x0,i.upper.y,{copeEnd:!0}),o(i.gap.x1,i.four.x0,i.upper.y),t.add(re(ue(i.gap.x1-i.gap.x0+.02,i.gap.floor,n,.04),e.channel,(i.gap.x0+i.gap.x1)/2,i.gap.floor/2,0));let a=new Qt(new Ke(i.gap.x1-i.gap.x0,.04,n-.02),new _s({color:"#7fa2f6",roughness:.12,metalness:0,transmission:0,transparent:!0,opacity:.82,clearcoat:1,clearcoatRoughness:.1}));a.position.set((i.gap.x0+i.gap.x1)/2,i.gap.water-.02,0),a.receiveShadow=!0,t.add(a);for(let w of[i.gap.x0,i.gap.x1])t.add(re(ue(.14,.06,n,.025),e.coping,w+(w===i.gap.x0?-.07:.07),i.upper.y-.03,0));let l=Bt("#f4f7ff",{rough:.25,opacity:.86}),c=[];for(let w=i.zMin+.75;w<=i.zMax-.7;w+=1.1){if(Math.abs(w)<.6)continue;let x=new Se,b=new Qt(new $s(.045,1,4,10),l),R=new Qt(new qe(.075,14,10),l);x.add(b,R),x.position.set((i.gap.x0+i.gap.x1)/2,i.gap.water,w),t.add(x),c.push({col:b,cap:R,phase:w*1.7})}om(t,i.four,i.upper.y,e),o(i.middle.x0,i.middle.x1,i.middle.y),om(t,i.ten,i.middle.y,e);let h=i.rail,d=h.r/Math.cos(io),u=new P(h.x0,Dn(h.x0)-d,h.z),f=new P(h.x1,Dn(h.x1)-d,h.z),m=re(new An(h.r,h.r,u.distanceTo(f),18),e.rail);m.position.copy(u).add(f).multiplyScalar(.5),m.quaternion.setFromUnitVectors(new P(0,1,0),f.clone().sub(u).normalize()),t.add(m);for(let w of[u,f])t.add(re(new qe(h.r,16,12),e.rail,w.x,w.y,w.z));for(let w of h.posts){let x=Ps(w+.001,h.z),b=W1(w)-d;t.add(re(new An(.022,.022,b-x,14),e.rail,w,(b+x)/2,h.z)),t.add(re(new An(.05,.055,.03,16),e.rail,w,x+.015,h.z))}let v={S1:new P(i.gap.x0-1.4,i.upper.y+0,2.6),S2:new P(i.four.x0-1.6,i.upper.y+0,2.6),S3:new P(i.ten.x0-1.6,i.middle.y+0,2.6)};for(let[w,x]of Object.entries(v)){let b=q1(w);b.position.copy(x),t.add(b)}let g=new Qt(new _n(7.2,.9),new on({map:eo("CIVIC PLAZA",{color:yt.blue,w:2048,h:256,font:"italic 800 190px Inter, system-ui, sans-serif"}),transparent:!0,roughness:.6}));g.position.set(-34,1.35,i.zMax+.012),t.add(g);let p=(w,x,b,R=2.6)=>{t.add(re(ue(R,.5,.9,.08),e.planter,w,x+.25,b))};for(let w of[-42,-36,-29,-17])p(w,i.upper.y,i.zMin+.75);for(let w of[-8.5,.2])p(w,i.middle.y,i.zMin+.75);let _=[{x:-4.4,y:i.middle.y,z:i.zMin+.7,rot:0},{x:13.5,y:0,z:6.2,rot:Math.PI},{x:26,y:0,z:6.2,rot:Math.PI}];for(let w of _){let x=X1();x.position.set(w.x,w.y,w.z),x.rotation.y=w.rot,t.add(x)}t.add(re(ue(4.2,.32,1.5,.06),e.pad,22,.16,-6.4)),t.add(re(ue(4.2,.06,.12,.03),e.coping,22,.32,-6.4+.69)),t.add(re(ue(4.2,.06,.12,.03),e.coping,22,.32,-6.4-.69));let T=[];for(let w=-54;w<=40;w+=6.5)T.push({x:w+w*7%3,z:-9.5-w*13%4*.4,size:.55+w*3%5*.04,rot:w});for(let[w,x,b]of[[33,-3,.6],[36,2,.55],[31,7,.5],[-58,-2,.6],[-56,4,.5]])T.push({x:w,z:x,size:b,rot:w});t.add(xd(T));let y=xd([...[-42,-36,-29,-17].map(w=>({x:w,z:i.zMin+.75,kind:"bush",size:.42})),...[-8.5,.2].map(w=>({x:w,z:i.zMin+.75,kind:"bush",size:.42}))]);y.children.forEach(w=>{for(let x=0;x<w.count;x++){let b=new jt;w.getMatrixAt(x,b);let R=new P().setFromMatrixPosition(b);b.setPosition(R.x,(R.x<-14?i.upper.y:i.middle.y)+.5,R.z),w.setMatrixAt(x,b)}w.instanceMatrix.needsUpdate=!0,w.computeBoundingSphere()}),t.add(y);for(let[w,x]of[[-38,48],[16,48]]){let b=sm({length:x});b.position.set(w,0,-14),t.add(b)}[[-60,-34,26,18,7],[-30,-38,30,20,5],[0,-34,22,18,9],[26,-36,28,18,6],[54,-32,22,18,8],[-86,-20,22,30,6],[74,-6,18,24,5]].forEach(([w,x,b,R,L],F)=>{let N=rm({w:b,d:R,floors:L,seed:F+3});N.position.set(w,0,x),t.add(N)});let E={S1:new P((i.gap.x0+i.gap.x1)/2,i.upper.y,0),S2:new P(i.four.x0+.5,i.upper.y-.4,0),S3:new P(i.ten.x0+1.5,i.middle.y-.2,h.z)};return{group:t,spots:E,marks:v,setTime(w){for(let x of c){let b=.34+.16*Math.sin(w*2.3+x.phase)+.06*Math.sin(w*5.1+x.phase*2);x.col.scale.set(1,b,1),x.col.position.y=b/2,x.cap.position.y=b+.02}}}}var $1=new P(1,0,0),Y1=new P(0,1,0);function _d(i,t,e,n,s,r){let o=new P().subVectors(t,i),a=o.length(),l=e+n-1e-4;a>l&&(o.multiplyScalar(l/a),a=l),a=Math.max(a,Math.abs(e-n)+.001);let c=o.clone().normalize(),h=(e*e-n*n+a*a)/(2*a),d=Math.sqrt(Math.max(0,e*e-h*h)),u=s.clone().addScaledVector(c,-s.dot(c));return u.lengthSq()<1e-8&&u.copy(Math.abs(c.y)<.9?Y1:$1).addScaledVector(c,-c.y),u.normalize(),r.copy(i).addScaledVector(c,h).addScaledVector(u,d),i.clone().add(o)}function lm(i,t,e){let n=i.side.clone().normalize(),s=i.up.clone().normalize(),r=new P().crossVectors(n,s).normalize(),o=i.feet[t],a=o.dir.clone().normalize(),l=o.up.clone().normalize(),c=t===0?1:-1,h=i.pelvis.clone().addScaledVector(n,c*e.hip).addScaledVector(s,-e.hipDrop),d=o.pos.clone().addScaledVector(a,e.ankle[0]).addScaledVector(l,e.ankle[1]),u=r.clone().addScaledVector(n,c*.25).addScaledVector(s,.1),f=new P,m=_d(h,d,e.thigh,e.shin,u,f);return{hip:h,knee:f,ankle:m,target:d,dir:a,fu:l,short:Math.max(0,h.distanceTo(d)-e.thigh-e.shin)}}var Z1="#e0a98a",J1=new P(1,0,0),co=new P(0,1,0),cm=new P(0,0,1);function ho({number:i="0712",bottom:t=yt.yellow}={}){let e=pe,n=new Se;n.name="board";let s=Bt(t,{paint:!0,rough:.5}),r=Bt(yt.navy,{rough:.9}),o=Bt("#c3cbe3",{rough:.4,metal:.2}),a=Bt(yt.shade,{rough:.55}),l=Bt(yt.white,{rough:.45}),c=Bt(yt.blue,{rough:.6}),h=(f,m,v,g)=>{let p=new Se;p.add(re(ue(f,e.deck,e.W,.014),s,0,-e.deck/2,0)),p.add(re(ue(f-.02,.006,e.W-.012,.003),r,0,.001,0)),p.position.set(m,v,0),p.rotation.z=g,n.add(p)};h(2*e.flat+.02,0,0,0);for(let f of[1,-1]){let m=e.kickAngle;h(e.kick,f*(e.flat+Math.cos(m)*e.kick/2),Math.sin(m)*e.kick/2,f*m)}let d=eo(`TRICKLINE \xB7 ${i}`,{color:yt.navy,w:1024,h:160,font:"italic 800 104px Inter, system-ui, sans-serif"}),u=new Qt(new _n(.5,.078).rotateX(Math.PI/2),new on({map:d,transparent:!0,roughness:.6}));u.position.set(0,-e.deck-.0015,0),u.rotation.y=Math.PI,n.add(u);for(let f of[1,-1]){let m=f*e.truckX;n.add(re(ue(.11,.014,.08,.005),a,m,-e.deck-.007,0)),n.add(re(new An(.02,.02,.028,14),c,m-f*.012,-e.deck-.026,0)),n.add(re(ue(.05,.03,.2,.012),o,m,e.axleY+.006,0));let v=re(new An(.007,.007,.25,8),o,m,e.axleY,0);v.rotation.x=Math.PI/2,n.add(v);for(let g of[1,-1]){let p=re(new An(e.wheelR,e.wheelR,e.wheelW,22),l,m,e.axleY,g*e.wheelZ);p.rotation.x=Math.PI/2,n.add(p)}}return{group:n}}function Os({tee:i=yt.white,number:t="07",cap:e=yt.blue,ink:n=yt.blue}={}){let s=new Se;s.name="rider";let r={tee:Bt(i,{paint:!0,rough:.62}),pants:Bt(yt.navy,{rough:.72}),skin:Bt(Z1,{rough:.62}),shoe:Bt(yt.white,{rough:.55}),sole:Bt(yt.navy,{rough:.8}),cap:Bt(e,{paint:!0,rough:.5}),eye:Bt(yt.navy,{rough:.4})},o=(H,Q)=>{let tt=re(H,Q);return s.add(tt),tt},a=(H,Q,tt)=>o(new $s(H,Q,6,14),tt),l=()=>{let H=new Se;return H.add(re(ue(.275,.024,.118,.01),r.sole,0,.012,0)),H.add(re(ue(.255,.078,.11,.035),r.shoe,-.008,.06,0)),s.add(H),H},c=[l(),l()],h=[a(.06,ve.shin,r.pants),a(.06,ve.shin,r.pants)],d=[a(.074,ve.thigh,r.pants),a(.074,ve.thigh,r.pants)],u=[o(new qe(.066,16,12),r.pants),o(new qe(.066,16,12),r.pants)],f=o(ue(.34,.17,.23,.07),r.pants),m=o(ue(...ve.torso,.09),r.tee),v=new Qt(new _n(.16,.16),new on({map:eo(t,{color:n,w:256,h:256,font:"italic 800 170px Inter, system-ui, sans-serif"}),transparent:!0,roughness:.6}));s.add(v);let g=[o(new qe(.075,16,12),r.tee),o(new qe(.075,16,12),r.tee)],p=[a(.054,ve.upper,r.skin),a(.054,ve.upper,r.skin)],_=[a(.066,.1,r.tee),a(.066,.1,r.tee)],T=[a(.047,ve.fore,r.skin),a(.047,ve.fore,r.skin)],y=[o(new qe(.056,14,10),r.skin),o(new qe(.056,14,10),r.skin)],S=a(.05,ve.neck,r.skin),E=new Se;E.add(re(new qe(ve.head,26,18),r.skin));let w=re(new qe(ve.head+.012,26,14,0,Math.PI*2,0,Math.PI*.5),r.cap);w.position.y=.02,w.rotation.z=-.18,E.add(w),E.add(re(ue(.13,.018,.2,.008),r.cap,ve.head*.92,.035,0));for(let H of[-1,1])E.add(re(new qe(.019,10,8),r.eye,ve.head*.93,-.012,H*.055));s.add(E);let x=()=>new P,b=x(),R=x(),L=x(),F=x(),N=new Ve,U=new jt,O=x(),Y=(H,Q,tt)=>{H.position.addVectors(Q,tt).multiplyScalar(.5);let gt=new P().subVectors(tt,Q);H.quaternion.setFromUnitVectors(co,gt.normalize())},X=(H,Q,tt)=>{let gt=new P().crossVectors(Q,tt).normalize(),xt=new P().crossVectors(gt,Q).normalize();U.makeBasis(Q.clone().normalize(),xt,gt),H.quaternion.setFromRotationMatrix(U)},ot=H=>{let Q=H.side.clone().normalize(),tt=H.up.clone().normalize();b.crossVectors(Q,tt).normalize(),f.position.copy(H.pelvis),X(f,Q,tt),N.setFromAxisAngle(tt,H.twist??0),R.copy(Q).applyQuaternion(N),F.copy(b).applyQuaternion(N),L.copy(tt),H.lean&&(N.setFromAxisAngle(R,H.lean),L.applyQuaternion(N),F.applyQuaternion(N)),H.bank&&(N.setFromAxisAngle(F,H.bank),L.applyQuaternion(N),R.applyQuaternion(N));let[gt,xt]=ve.torso,$t=H.pelvis.clone().addScaledVector(tt,ve.spine);m.position.copy($t).addScaledVector(L,xt/2),X(m,R,L),v.position.copy(m.position).addScaledVector(F,ve.torso[2]/2+.002).addScaledVector(L,.06),X(v,R.clone().negate(),L),v.quaternion.multiply(N.setFromAxisAngle(co,Math.PI/2));let Gt=$t.clone().addScaledVector(L,xt-.02),G=Gt.clone().addScaledVector(L,ve.neck);Y(S,Gt,G),E.position.copy(G).addScaledVector(L,ve.head*.92);let I=H.look?H.look.clone().sub(E.position):F.clone();I.addScaledVector(L,-I.dot(L)).normalize(),I.dot(F)<-.2&&I.addScaledVector(F,-I.dot(F)-.2).normalize(),I.addScaledVector(L,-.25).normalize(),X(E,I,L);for(let D=0;D<2;D++){let k=lm(H,D,ve);Y(d[D],k.hip,k.knee),Y(h[D],k.knee,k.ankle),u[D].position.copy(k.knee);let W=c[D];W.position.copy(k.ankle).addScaledVector(k.dir,-ve.ankle[0]).addScaledVector(k.fu,-ve.ankle[1]),X(W,k.dir,k.fu)}for(let D=0;D<2;D++){let k=D===0?1:-1,W=$t.clone().addScaledVector(L,xt-.09).addScaledVector(R,k*ve.shoulder);g[D].position.copy(W);let $=H.hands?.[D]??W.clone().addScaledVector(L,-.5).addScaledVector(R,k*.08).addScaledVector(F,.05),ut=L.clone().multiplyScalar(-.6).addScaledVector(F,-.5).addScaledVector(R,k*.4),ht=_d(W,$,ve.upper,ve.fore,ut,O);Y(p[D],W,O);let Z=W.clone().lerp(O,.42);Y(_[D],W,Z),Y(T[D],O,ht),y[D].position.copy(ht).addScaledVector(new P().subVectors(ht,O).normalize(),.03)}};return ot({pelvis:new P(0,.98,0),side:J1,up:co,look:new P(2,1.6,3),feet:[{pos:new P(.2,0,.02),dir:cm.clone().applyAxisAngle(co,.4),up:co},{pos:new P(-.22,0,.02),dir:cm.clone(),up:co}],hands:null}),{group:s,pose:ot}}var cn=(i=0,t=0,e=0)=>new P(i,t,e);function cr(i){let t=_e,e=(n,s)=>s-n.rise/n.tread*(i-n.x0);return i<t.four.x0?t.upper.y:i<t.four.x0+t.four.n*t.four.tread?Math.max(t.middle.y,e(t.four,t.upper.y)):i<t.ten.x0?t.middle.y:i<t.ten.x0+t.ten.n*t.ten.tread?Math.max(0,e(t.ten,t.middle.y)):0}function hm(i){let t=new Se;t.name=i;let e=new Qt(new Ke(1,1,1),new mi);return e.visible=!1,t.add(e),t.userData.selPad=0,t}function K1(){let i=new Se,t=Bt(yt.navy,{rough:.5}),e=Bt(yt.shade,{rough:.5});i.add(re(ue(.16,.1,.09,.02),t,-.02,0,0));let n=re(new An(.035,.04,.09,16),e,.09,0,0);n.rotation.z=Math.PI/2,i.add(n),i.add(re(ue(.12,.025,.03,.01),t,-.03,.065,0));let s=new Qt(new qe(.012,10,8),Bt(yt.red,{emissive:yt.red}));return s.position.set(.04,.03,.047),i.add(s),{group:i,rec:s}}function um(){let i=new Se,t=am();i.add(t.group);let e={rider:Os({tee:yt.blue,number:"07",cap:yt.white,ink:yt.white}),board:ho({number:"0712"})},n={rider:Os({tee:yt.teal,number:"02",cap:yt.blueLight,ink:yt.white}),board:ho({number:"0233",bottom:yt.white})},s=Os({tee:yt.white,number:"",cap:yt.navy}),r=K1(),o=[Os({tee:yt.blueLight,number:"",cap:yt.blue}),Os({tee:yt.white,number:"",cap:yt.teal})];i.add(e.rider.group,e.board.group,n.rider.group,n.board.group,s.group,r.group);for(let S of o)i.add(S.group);let a=hm("R-07");e.board.group.userData.selPad=.05;let l=_e,c=(S,E,w,x={})=>{let b=hm(S);return b.position.copy(E),b.scale.copy(w),Object.assign(b.userData,x),b},h={rider:a,board:e.board.group,S1:c("S1",cn((l.gap.x0+l.gap.x1)/2,(l.gap.floor+l.upper.y)/2+.06,0),cn(l.gap.x1-l.gap.x0+.34,l.upper.y-l.gap.floor+.22,l.zMax-l.zMin+.1),{groundY:l.gap.water}),S2:c("S2",cn(l.four.x0+(l.four.n-1)*l.four.tread*.5,(l.upper.y+l.middle.y)/2+.04,0),cn((l.four.n-1)*l.four.tread+.3,l.upper.y-l.middle.y+.18,l.zMax-l.zMin+.1),{noGlow:!0}),S3:c("S3",cn((l.rail.x0+l.rail.x1)/2,(Dn(l.rail.x0)+Dn(l.rail.x1))/2-.12,l.rail.z),cn(l.rail.x1-l.rail.x0+.2,Dn(l.rail.x0)-Dn(l.rail.x1)+.5,.26),{noGlow:!0})};i.add(a,h.S1,h.S2,h.S3);let d=(S,E,w=48)=>{let x=[];for(let b=0;b<=w;b++){let R=Us(S+(E-S)*b/w).board.pos;x.push(cn(R.x,cr(R.x),R.z))}return x},{S1:u,S2:f,S3:m,OFF:v}=Ae,g={S1:d(u.tp-.6,u.tl+.45),S2:d(f.tp-.6,f.tl+.45),S3:d(m.tp-.6,v.tl+.45,72)},p=S=>S.pelvis.clone().addScaledVector(S.up,1.02),_={rider:S=>p(S.pose).add(cn(0,.22,0)),board:S=>S.board.pos.clone().add(cn(0,.3,0)),S1:()=>cn((l.gap.x0+l.gap.x1)/2,l.upper.y+.05,1.1),S2:()=>cn(l.four.x0+.5,l.upper.y-.25,1.1),S3:()=>cn(l.ten.x0+1.2,cr(l.ten.x0+1.2)+.05,l.rail.z+2)},T={rider:S=>S.pose.pelvis.clone().add(cn(0,.2,0)),board:S=>S.board.pos.clone(),S1:()=>cn((l.gap.x0+l.gap.x1)/2+.2,l.gap.water,.3),S2:()=>cn(l.four.x0+.48,l.upper.y-.3,1.6),S3:()=>cn(l.ten.x0+.9,Dn(l.ten.x0+.9)+.02,l.rail.z)},y=new Ve;return{root:i,plaza:t,hero:e,anchors:_,clickAt:T,select:h,stationRoute:g,groundAt:cr,pose(S){t.setTime(S);let E=Us(S);e.rider.pose(E.pose),e.board.group.position.copy(E.board.pos),e.board.group.quaternion.copy(E.board.quat),e.board.group.userData.groundY=Ps(E.board.pos.x,E.board.pos.z);let w=p(E.pose).y+.06,x=Math.min(E.board.pos.y-pe.grip,E.pose.pelvis.y-1.05)-.03,b=E.pose.pelvis.clone().lerp(E.board.pos,.5);a.position.set(b.x,(w+x)/2,b.z),a.scale.set(pe.half*2+.16,w-x,.74),a.quaternion.copy(y.setFromUnitVectors(cn(1,0,0),E.T.clone().setY(0).normalize())),a.userData.groundY=Ps(b.x,b.z);let R=fh(S);n.rider.pose(R.pose),n.board.group.position.copy(R.board.pos),n.board.group.quaternion.copy(R.board.quat);let L=$p(S,E.pose.pelvis);return s.pose(L.pose),r.group.position.copy(L.cam),r.group.quaternion.setFromUnitVectors(cn(1,0,0),L.aim),r.rec.visible=L.rec,Yp(S,E.pose.pelvis).forEach((F,N)=>o[N].pose(F)),{hero:E,second:R}}}}var bi=Math.PI/180,In=(i,t=0,e=1)=>Math.min(e,Math.max(t,i)),_m=i=>{let t=In(i);return t*t*t*(t*(t*6-15)+10)},Ye=(i,t,e)=>_m((e-i)/(t-i)),pn=(i,t,e)=>i+(t-i)*e,ii=(i,t,e)=>In((e-i)/(t-i)),Bs=i=>(i*3.6).toFixed(1),Ba=i=>Math.round(i/bi),uo=(i=0,t=0,e=0)=>new P(i,t,e),{S1:Be,S2:nn,S3:ai,GR:si,OFF:Bn,pushes:j1,brake:Q1}=Ae,Ha={S1:Be,S2:nn,S3:ai},vm=pe.grip,po=si.sOff,ym=Math.round(io/bi*10)/10,Mm=[{a:Be.tp-.25,b:Be.tl+.2,r:.25},{a:nn.tp-.25,b:nn.tl+.2,r:.25},{a:ai.tp-.25,b:Bn.tl+.25,r:.2}],dm=.16,Sm=(i,t)=>Ye(i.a-dm,i.a,t)*(1-Ye(i.b,i.b+dm,t)),tM=i=>Mm.reduce((t,e)=>Math.min(t,1-(1-e.r)*Sm(e,i)),1),oi=(()=>{let t=Math.ceil(Ae.end/5e-4),e=new Float64Array(t+1);for(let n=1;n<=t;n++)e[n]=e[n-1]+5e-4/tM((n-.5)*5e-4);return{dt:5e-4,n:t,film:e}})(),za=oi.film[oi.n];function Ei(i){let t=In(i/oi.dt,0,oi.n),e=Math.min(oi.n-1,Math.floor(t));return pn(oi.film[e],oi.film[e+1],t-e)}function Na(i){let t=oi.film;if(i<=0)return 0;if(i>=za)return oi.n*oi.dt;let e=0,n=oi.n;for(;n-e>1;){let s=e+n>>1;t[s]<=i?e=s:n=s}return(e+(i-t[e])/(t[n]-t[e]))*oi.dt}var eM=i=>{for(let t of Mm)if(Sm(t,i)>.5)return Math.round(1/t.r);return 0},Sn=(()=>{let t=Math.ceil((Ae.end+.4)/.01),e=()=>new Float32Array(t+1),n={dt:.01,n:t,bx:e(),by:e(),bz:e(),px:e(),py:e(),pz:e(),sp:e(),peak:e()};for(let s=0;s<=t;s++){let r=Us(s*.01);n.bx[s]=r.board.pos.x,n.by[s]=r.board.pos.y,n.bz[s]=r.board.pos.z,n.px[s]=r.pose.pelvis.x,n.py[s]=r.pose.pelvis.y,n.pz[s]=r.pose.pelvis.z}for(let s=0;s<=t;s++){let r=Math.max(0,s-1),o=Math.min(t,s+1);n.sp[s]=Math.hypot(n.px[o]-n.px[r],n.py[o]-n.py[r],n.pz[o]-n.pz[r])/((o-r)*.01),n.peak[s]=Math.max(n.sp[s],s?n.peak[s-1]:0)}return n})(),ri=(i,t)=>{let e=In(t/Sn.dt,0,Sn.n),n=Math.min(Sn.n-1,Math.floor(e));return pn(i[n],i[n+1],e-n)},bm=i=>ri(Sn.by,i)-vm-cr(ri(Sn.bx,i)),fm=i=>{let t=0;for(let e=i.tp;e<=i.tl;e+=Sn.dt)t=Math.max(t,bm(e));return t},vd={S1:fm(Be),S2:fm(nn)},zs=(i,t)=>i.tp+t*i.T,Mh=i=>[Be,nn,ai,Bn].reduce((t,e)=>t+In(i-e.tp,0,e.T),0),pm=i=>[Be,nn,ai,Bn].filter(t=>i>=t.tl).length,nM=i=>[Be,nn,ai,Bn].filter(t=>i>=t.tl).reduce((t,e)=>Math.max(t,e.T),0),iM={S1:Be.tl+.3,S2:nn.tl+.3,S3:Bn.tl+.3},yd=i=>Object.values(iM).filter(t=>i>=t).length,sM=i=>i>=Bn.tl?"S3":i>=nn.tl?"S2":i>=Be.tl?"S1":null,ss={S1:Be.tl+.5,S2:nn.tl+.5,S3:Bn.tl+.5},wi={S1:Be.tp-.95,S2:nn.tp-.95,S3:ai.tp-.95},wm=(i,t,e)=>{let n=Ds[i],s=Ha[i];return t<zs(s,n.flip[0])?{phi:0,psi:0}:t>=s.tl||e.station!==i||!(e.phase==="flip"||e.phase==="air")?{phi:n.phi,psi:n.psi}:{phi:Math.abs(e.flip.phi)/bi,psi:Math.abs(e.flip.psi)/bi}},mm={S1:"Fountain gap",S2:"Four-stair",S3:"Ten-stair rail"},rs={S1:"Hardflip",S2:"Laser flip",S3:"Kickflip BS 50-50"};function Em(i,t,e){let n=Ha[i],s=Ds[i],r=["OP10",`Approach \xB7 ${Bs(ri(Sn.sp,Math.min(t,n.tp-.45)))} km/h`,ii(n.tp-3,n.tp-.42,t)],o=["OP20",`Pop \xB7 tail down ${Ba(ts.pitch)}\xB0`,ii(n.tp-.42,n.tp,t)],a=wm(i,t,e);if(i==="S3"){let c=In((t-si.t0)/si.T);return[["OP10","Approach \xB7 drift to the rail",ii(n.tp-3,n.tp-.42,t)],["OP20",`Pop \xB7 kickflip ${Math.round(a.phi)}\xB0`,ii(n.tp-.42,zs(n,s.flip[1]),t)],["OP30","Catch \xB7 over the rail",ii(zs(n,s.flip[1]),n.tl,t)],["OP40","Lock \xB7 both trucks on",ii(n.tl,n.tl+.1,t)],["OP50",`Grind \xB7 ${(c*po).toFixed(2)} m of ${po.toFixed(2)}`,c],["OP60","Pop off \xB7 land",ii(Bn.tp,Bn.tl+.5,t)]]}let l=i==="S1"?`Flip \xB7 ${Math.round(a.phi)}\xB0 + shove ${Math.round(a.psi)}\xB0`:`Flip \xB7 heel ${Math.round(a.phi)}\xB0 + shove ${Math.round(a.psi)}\xB0`;return[r,o,["OP30",l,ii(zs(n,s.flip[0]),zs(n,s.flip[1]),t)],["OP40","Catch \xB7 both feet back on",ii(zs(n,s.flip[1]),zs(n,s.catch),t)],["OP50",i==="S2"?`Land \xB7 ${(_e.upper.y-_e.middle.y).toFixed(1)} m down`:"Land \xB7 roll away",ii(n.tl,n.tl+.5,t)]]}var Sh=(i,t,e)=>{let n=Em(i,t,e);return n.reduce((s,r)=>s+r[2],0)/n.length},Md=(i,t)=>t<wi[i]?["Waiting","wait"]:t<ss[i]?["In process","in"]:["Passed","go"];function bh(i,t){let e=t.station,n=sM(i);switch(t.phase){case"idle":return["Ready","Upper terrace \xB7 one foot down","wait"];case"push":{let r=j1.findIndex(o=>i>=o.s-.3&&i<=o.back+.25);return["Pushing",`Push ${Math.max(1,r+1)} \xB7 ${Bs(ri(Sn.sp,i))} km/h`,"in"]}case"setup":return["Setting up",`${e} \xB7 feet set for the ${rs[e].toLowerCase()}`,"in"];case"flip":return["Flipping",`${e} \xB7 ${rs[e]}`,"in"];case"air":return["Caught",e==="S3"?"S3 \xB7 dropping onto the rail":`${e} \xB7 ${rs[e]} \xB7 landing`,"in"];case"grind":return["Grinding",`S3 \xB7 50-50 \xB7 ${(t.grindU*po).toFixed(2)} of ${po.toFixed(2)} m`,"in"];case"pop-off":return["Popping off","S3 \xB7 off the end of the rail","in"];case"land":return["Landed",`${n} \xB7 ${rs[n]} clean`,"go"];case"brake":return["Braking","Lower plaza \xB7 foot brake","go"]}if(!e)return["Line done","3 / 3 stations clean","go"];let s=Ha[e];return["Rolling",`To ${e} \xB7 ${rs[e]} \xB7 ${Math.max(0,s.xp-t.board.pos.x).toFixed(1)} m`,"in"]}var gm=i=>i<wi.S1?"Upper terrace":i<ss.S1?"S1 \xB7 gap":i<wi.S2?"Upper terrace":i<ss.S2?"S2 \xB7 4-stair":i<wi.S3?"Middle terrace":i<ss.S3?"S3 \xB7 rail":"Lower plaza",ka={x0:Ae.xs[0],x1:Ae.xs[Math.floor(Ae.end/Ae.dt)]},fo=i=>In((i.board.pos.x-ka.x0)/(ka.x1-ka.x0));Object.assign(nh,{stairs:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 35V27h8v-8h8v-8h8V3h8v32z" fill="#3166ea"/><path d="M4 27h8v-8h8v-8h8V3h8v3h-5v8h-8v8h-8v8H4z" fill="#6f98f7"/></svg>',gauge:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 29a16 16 0 0132 0z" fill="#6f98f7"/><path d="M9 29a11 11 0 0122 0z" fill="#3166ea"/><path d="M20 29l7-10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="29" r="3.2" fill="#2448c8"/></svg>',air:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M5 33C10 9 30 9 35 33" stroke="#6f98f7" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-dasharray="2 5"/><rect x="11" y="10" width="18" height="5.5" rx="2.75" fill="#3166ea" transform="rotate(-14 20 13)"/><circle cx="14" cy="19" r="2.4" fill="#2448c8"/><circle cx="25" cy="16.4" r="2.4" fill="#2448c8"/></svg>',deck:'<svg viewBox="0 0 40 40" width="26" height="26"><path d="M3 15c2 3 4 4 7 4h20c3 0 5-1 7-4" stroke="#6f98f7" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="7" y="16" width="26" height="5" rx="2.5" fill="#3166ea"/><circle cx="12" cy="26" r="4" fill="#1a2440"/><circle cx="28" cy="26" r="4" fill="#1a2440"/></svg>'});var wh=(i,t=2)=>`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="${t}" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,rM={push:wh('<path d="M3 12h13M12 7l5 5-5 5"/><path d="M3 18h6"/>'),flip:wh('<path d="M20 12a8 8 0 11-2.6-5.9"/><path d="M20 3v5h-5"/>'),rail:wh('<path d="M3 7l18 9M7 9v11M17 14v6"/>'),flag:wh('<path d="M5 21V4h12l-2.5 4.5L17 13H5"/>')},oM={brand:"Trickline",search:"Search riders, boards, spots, sheets...",user:["Juno Park","Session lead"],trackIcon:"deck",dropTitle:"LINE 1 \xB7 STATIONS",stepIcons:rM,kpis:[{ic:"stairs",k:"Stations passed",key:"a",v:"0 / 3",d:"0 clean",s:"Line 1 \xB7 S1 \xB7 S2 \xB7 S3"},{ic:"gauge",k:"Rider speed, km/h",key:"b",v:"0.0",d:"peak 0.0",s:"R-07 \xB7 board 0712"},{ic:"air",k:"Air time",key:"c",v:"0.00 s",d:"0 airs",s:"longest \u2014"}]},aM={L1:["L1","Civic Plaza \xB7 Line 1","3 stations \xB7 1 rider"],S1:["S1","S1 \xB7 Fountain gap","Hardflip \xB7 1.7 m of water"],S2:["S2","S2 \xB7 Four-stair",`Laser flip \xB7 ${(_e.upper.y-_e.middle.y).toFixed(1)} m drop`],S3:["S3","S3 \xB7 Ten-stair rail",`Kickflip BS 50-50 \xB7 ${ym}\xB0`]},lM=32,cM=26,Va=Ei(Be.tl+.5),Si=[{t:1.6,at:"rider",card:"rider"},{t:Ei(4.35),at:"board",card:"board"},{t:Ei(Be.tp-1.4),at:"S1",card:"S1",site:"S1"},{t:Va,ui:"dd",drop:"open"},{t:Va+.95,ui:"drop1",card:"S2",site:"S2"},{t:Ei(ai.tp-1.35),at:"S3",card:"S3",site:"S3"},{t:Ei(Bn.tl+2.55),at:"rider",card:"rider",site:"L1"},{t:za-4.75,ui:"home",tool:6,card:"site",site:"L1"}],aT=Si.map(i=>i.t),hM=[{key:"S1",label:"S1 \xB7 Hardflip",t:Ei(Be.tp-1.2)},{key:"S2",label:"S2 \xB7 Laser flip",t:Ei(nn.tp-1.2)},{key:"S3",label:"S3 \xB7 Kickflip BS 50-50",t:Ei(ai.tp-1.3)}],Fa=Si.at(-1).t,xm=[{pre:[Be.tp-3,Be.tp-2],pk:.55,pd:17,tin:[Be.tp-1.2,Be.tp-.3],tout:[Be.tl-.05,Be.tl+.95],x:(Be.xp+Be.xl)/2,y:_e.upper.y+.8,z:.1,d:11},{tin:[nn.tp-1.1,nn.tp-.3],tout:[nn.tl-.05,nn.tl+.95],x:(nn.xp+nn.xl)/2+.25,y:2.95,z:.1,d:12.5},{pre:[ai.tp-3.1,ai.tp-2.1],pk:.5,pd:19,tin:[ai.tp-1.5,ai.tp-.4],tout:[Bn.tl-.05,Bn.tl+.75],x:5,y:2,z:-.4,d:17.5}],Oa={x:-5,y:1,z:-1.5,d:148};async function Tm({app:i,canvas:t,capture:e=!1}){await Promise.race([Promise.all(["italic 800 64px Inter","800 16px Inter","700 16px Inter","600 16px Inter","500 16px Inter"].map(G=>document.fonts.load(G))),new Promise(G=>setTimeout(G,2500))]).catch(()=>{});let n=Cp(t,{fov:28});n.camera.near=.5,n.scene.fog.near=260,n.scene.fog.far=900,n.gtao.updateGtaoMaterial({radius:.55,thickness:.35,distanceExponent:1.3,scale:1}),n.gtao.blendIntensity=.7,n.sun.shadow.bias=-3e-4;let s=um();n.scene.add(s.root),s.pose(0);let r=uo(-.78,1,-.36).normalize(),o=(G,I,D)=>{let k=n.sun.shadow.camera;k.left=k.bottom=-D,k.right=k.top=D,k.updateProjectionMatrix(),n.sun.shadow.normalBias=D*.0011,n.sun.target.position.set(G,0,I),n.sun.position.copy(n.sun.target.position).addScaledVector(r,420),n.sun.target.updateMatrixWorld()},a=(G,I,{az:D=38,el:k=30,size:W=176}={})=>{let $=n.renderer;$.setPixelRatio(1),$.setSize(W,W,!1);let ut=new ke(24,1,.3,900);return ut.position.set(G.x+I*Math.cos(k*bi)*Math.sin(D*bi),G.y+I*Math.sin(k*bi),G.z+I*Math.cos(k*bi)*Math.cos(D*bi)),ut.lookAt(G),o(G.x,G.z,Math.max(10,I*.7)),$.render(n.scene,ut),$.domElement.toDataURL("image/png")},l=_e,c={S1:a(uo((l.gap.x0+l.gap.x1)/2,l.upper.y-.1,.3),7.2),S2:a(uo(l.four.x0+.45,(l.upper.y+l.middle.y)/2,.2),7.6),S3:a(uo(5.35,1.05,-.7),9.6),site:a(uo(-4,.5,-1),86,{el:34})};{let G=Os({tee:yt.blue,number:"07",cap:yt.white,ink:yt.white}),I=ho({number:"0712"}),D=Us(7),k=D.board.pos.clone().negate().setY(-(D.board.pos.y-vm)),W=D.pose;G.pose({...W,pelvis:W.pelvis.clone().add(k),look:W.look.clone().add(k),feet:W.feet.map(ht=>({pos:ht.pos.clone().add(k),dir:ht.dir,up:ht.up})),hands:W.hands?.map(ht=>ht.clone().add(k))}),I.group.position.copy(D.board.pos).add(k),I.group.quaternion.copy(D.board.quat);let $=new Se;$.add(G.group,I.group),c.rider=nd($,{pad:1.02});let ut=ho({number:"0712"});ut.group.rotation.set(-2.2,-.35,.18),c.board=nd(ut.group,{pad:1})}let h=document.createElement("style");h.textContent=".wt .live{width:140px;justify-content:center;white-space:nowrap}.wt .drop{z-index:4;background:#fff}",document.head.appendChild(h);let d=Dp(i,oM),u=kp(n.scene,n,{core:.14,halo:.5,pad:.05}),f=()=>{let G=Math.min(window.devicePixelRatio||1,2),I=Math.min(window.innerWidth/1600,window.innerHeight/900);return e?G:In(I*G,.6,1.5)},m=G=>n.resize(1600,900,G??f());m();let v=G=>{let I=0,D=0,k=0,W=9;for(let $=0;$<W;$++){let ut=G+($/(W-1)-.5)*.9,ht=ri(Sn.bx,ut);I+=ht,k+=ri(Sn.bz,ut),D+=cr(ht)}return{x:I/W+1.1,y:D/W+.95,z:k/W,d:pn(12.5,15.5,Ye(1.2,4.6,G))}},g=G=>{let I=Na(G),D=v(I);for(let W of xm){if(!W.pre)continue;let $=Ye(W.pre[0],W.pre[1],I)*(1-Ye(W.tout[0],W.tout[1],I));$<=0||(D.x=pn(D.x,W.x,W.pk*$),D.y=pn(D.y,W.y,W.pk*$),D.z=pn(D.z,W.z,W.pk*$),D.d=pn(D.d,Math.max(D.d,W.pd),$))}for(let W of xm){let $=Ye(W.tin[0],W.tin[1],I)*(1-Ye(W.tout[0],W.tout[1],I));$<=0||(D.x=pn(D.x,W.x,$),D.y=pn(D.y,W.y,$),D.z=pn(D.z,W.z,$),D.d=pn(D.d,W.d,$))}let k=Ye(Fa,Fa+2.9,G);if(k>0){let W=Math.exp(pn(Math.log(D.d),Math.log(Oa.d),k)),$=(W-D.d)/(Oa.d-D.d);D.x=pn(D.x,Oa.x,$),D.y=pn(D.y,Oa.y,$),D.z=pn(D.z,Oa.z,$),D.d=W}return{tx:D.x,ty:D.y,tz:D.z,az:lM*bi,el:cM*bi,d:D.d,fov:28,sx:-110,sy:26}},p=new ke(28,16/9,.5,2e3),_=(G,I)=>{let{tx:D,ty:k,tz:W,az:$,el:ut,d:ht}=I;p.position.set(D+ht*Math.cos(ut)*Math.sin($),k+ht*Math.sin(ut),W+ht*Math.cos(ut)*Math.cos($)),p.lookAt(D,k,W),p.setViewOffset(1600,900,-I.sx,-I.sy,1600,900),p.updateMatrixWorld();let Z=G.clone().project(p);return Z.z>1?null:[(Z.x*.5+.5)*1600,(-Z.y*.5+.5)*900]},T=null,y=(G,I,D)=>G.ui?null:s.clickAt[G.at](D??Us(I)),S=new Map,E=G=>{if(!S.has(G)){let I=Si[G];S.set(G,I.ui?T[I.ui]:_(y(I,Na(I.t)),g(I.t))??[800,450])}return S.get(G)},w=1,x=(G,I,D)=>{let k=[1050,620],W=!0;for(let $=0;$<Si.length;$++){let ut=Si[$];if(G<ut.t-w)return{p:k,hand:W};if(G<ut.t){let ht=ut.ui?T[ut.ui]:n.project(y(ut,I,D))??k,Z=_m((G-(ut.t-w))/w);return{p:[pn(k[0],ht[0],Z),pn(k[1],ht[1],Z)-16*Math.sin(Math.PI*Z)],hand:!ut.ui}}k=E($),W=!ut.ui}return{p:k,hand:W}},b=G=>{let I=0;for(let D of Si)G>=D.t&&G<D.t+.7&&(I=Math.max(I,1-(G-D.t)/.7));return I},R=Va+.95,L=G=>Ye(Va,Va+.3,G)*(1-Ye(R+.05,R+.3,G)),F=G=>{let I={kind:"site",t0:-1};for(let D of Si)D.card&&G>=D.t&&(I={kind:D.card,t0:D.t});return I},N=G=>{let I="L1";for(let D of Si)D.site&&G>=D.t&&(I=D.site);return I},U=G=>G.phase==="flip"?["Flipping","in"]:G.phase==="air"||G.phase==="pop-off"?["In the air","in"]:G.phase==="grind"?["Grinding","in"]:G.phase==="brake"?["Braking","go"]:G.phase==="idle"?["Parked","wait"]:["Rolling","go"],O=G=>["S1","S2","S3"].filter(I=>G>=zs(Ha[I],Ds[I].catch));function Y(G,I,D,k,W){let $=Ye(D,D+.35,G);if(I==="rider"){let[ht,Z,et]=bh(k,W),st=W.station?`${W.station} \xB7 ${rs[W.station]}`:"Done \xB7 ride away";return{pop:$,thumb:c.rider,org:"RIDER \xB7 LINE 1",title:"R-07",sub:"Board 0712 \xB7 regular stance",stat:ht,statCls:et,statText:Z,prog:fo(W),progText:`${Math.round(100*fo(W))}%`,rows:[["Speed",`${Bs(ri(Sn.sp,k))} km/h`],["Board","0712",1],["Stance","Regular \xB7 left foot forward"],["Next",st],["Clean",`${yd(k)} / 3 stations`],["Air time",`${Mh(k).toFixed(2)} s`]]}}if(I==="board"){let[ht,Z]=U(W),et=O(k);return{pop:$,thumb:c.board,org:"BOARD \xB7 R-07",title:"0712",sub:`Popsicle \xB7 ${(2*pe.half).toFixed(2)} m \xB7 ${Ba(pe.kickAngle)}\xB0 kicks`,stat:ht,statCls:Z,statText:`Trucks ${(2*pe.truckX).toFixed(2)} m apart \xB7 ${Math.round(2e3*pe.wheelR)} mm wheels`,prog:et.length/3,progText:`${et.length}/3 flips`,rows:[["Deck",`${(2*pe.half).toFixed(2)} \xD7 ${pe.W.toFixed(2)} m \xB7 ${Math.round(1e3*pe.deck)} mm`],["Flips logged",et.length?et.map(st=>rs[st].replace("Kickflip BS 50-50","Kickflip")).join(" \xB7 "):"none yet"],["Flip now",`${Ba(Math.abs(W.flip.phi))}\xB0 \xB7 shove ${Ba(Math.abs(W.flip.psi))}\xB0`],["Pitch now",`${Ba(Math.abs(W.flip.theta))}\xB0`],["Rider","R-07",1]]}}if(I==="S1"||I==="S2"||I==="S3"){let ht=Ha[I],[Z,et]=Md(I,k),st=Em(I,k,W),ct=In(k-ht.tp,0,ht.T),pt=wm(I,k,W),Lt=ht.tp-k,It=Z==="Waiting"?`R-07 in ${Lt.toFixed(1)} s \xB7 ${Math.max(0,ht.xp-W.board.pos.x).toFixed(1)} m out`:Z==="Passed"?`R-07 \xB7 clean \xB7 ${(I==="S3"?ht.T+Bn.T:ht.T).toFixed(2)} s in the air`:`R-07 \xB7 ${st.find(Xt=>Xt[2]<1)?.[1].split(" \xB7 ")[0]??"Land"}`,Wt;if(I==="S3"){let Xt=In((k-si.t0)/si.T),B=k<si.t0?null:k<si.t1?si.v0+si.a*(k-si.t0):si.vEnd;Wt=[["Air to the rail",`${ct.toFixed(2)} s`,`of ${ht.T.toFixed(2)}`,ct/ht.T],["Kickflip",`${Math.round(pt.phi)}\xB0`,"of 360\xB0",pt.phi/360,!0],["Grind",`${(Xt*po).toFixed(2)} m`,`of ${po.toFixed(2)}`,Xt,!0],["Rail speed",B==null?"\u2014":`${B.toFixed(1)} m/s`,B==null?"":k<si.t1?"down the rail":"at the pop-off",B==null?0:In((B-4)/2.2)]]}else{let Xt=k>=ht.tp&&k<ht.tl?Math.max(0,bm(k)):0,B=k>=ht.tl;Wt=[[I==="S1"?"Board height":"Over the steps",B?`${vd[I].toFixed(2)} m`:`${Xt.toFixed(2)} m`,B?"peak":`of ${vd[I].toFixed(2)}`,B?1:In(Xt/vd[I])],["Air time",`${ct.toFixed(2)} s`,`of ${ht.T.toFixed(2)}`,ct/ht.T],[I==="S1"?"Flip":"Heelflip",`${Math.round(pt.phi)}\xB0`,`of ${Math.round(Ds[I].phi)}\xB0`,pt.phi/Ds[I].phi,!0],["Shove",`${Math.round(pt.psi)}\xB0`,`of ${Math.round(Ds[I].psi)}\xB0`,pt.psi/Ds[I].psi,!0]]}return{pop:$,thumb:c[I],org:`${I} \xB7 ${mm[I].toUpperCase()}`,title:rs[I],sub:I==="S1"?`${(l.gap.x1-l.gap.x0).toFixed(1)} m channel \xB7 deck to deck`:I==="S2"?`${l.four.n} \xD7 ${l.four.rise.toFixed(1)} m risers \xB7 ${(l.upper.y-l.middle.y).toFixed(1)} m drop`:`${l.ten.n} stairs \xB7 rail at ${ym}\xB0`,stat:Z,statCls:et,statText:It,prog:0,progText:"",stats:Wt,fleet:{title:"Process sheet",meta:`${st[0][0]}\u2013${st.at(-1)[0]}`,rows:st}}}let ut=yd(k);return{pop:$,thumb:c.site,org:"CIVIC PLAZA",title:"Line 1",sub:"Push \u2192 S1 \u2192 S2 \u2192 S3 \u2192 ride away",stat:ut<3?"Running":"Complete",statCls:"go",statText:`1 rider on the line \xB7 ${ut} / 3 stations passed`,prog:fo(W),progText:`${Math.round(100*fo(W))}%`,rows:[["Rider on the line","R-07 \xB7 board 0712",1],["Stations","S1 gap \xB7 S2 4-stair \xB7 S3 rail"],["Line length",`${Math.round(ka.x1-ka.x0)} m \xB7 ${l.upper.y.toFixed(1)} m down`],["Air time",`${Mh(k).toFixed(2)} s \xB7 ${pm(k)} airs`],["Session","Juno Park \xB7 F-01 filming"]]}}let X=(G,I)=>{let D=(et,st)=>G<et?"":G<st?"on":"done",k=[["Push","Upper terrace","push",D(0,wi.S1)],["Hardflip","S1 \xB7 gap","flip",D(wi.S1,ss.S1)],["Laser flip","S2 \xB7 4-stair","flip",D(wi.S2,ss.S2)],["K-flip 50-50","S3 \xB7 rail","rail",D(wi.S3,ss.S3)],["Ride away","Lower plaza","flag",G<ss.S3?"":"on"]],W=[0,wi.S1,wi.S2,wi.S3,ss.S3],$=0;for(let et=0;et<4;et++)G>=W[et]&&($=(et+ii(W[et],W[et+1],G))/4);let[ut,ht,Z]=bh(G,I);return{title:"Run Tracking",meta:"R-07 \xB7 board 0712 \xB7 Line 1",fill:$,steps:k,ship:{thumb:c.rider,id:"R-07 \xB7 0712",to:"Line 1 \xB7 S1 \u2192 S2 \u2192 S3",stat:ut,statCls:Z,meta:`${Bs(ri(Sn.sp,G))} km/h \xB7 ${Mh(G).toFixed(2)} s air`}}},ot=(G,I,D,k)=>{let W=[["People","5"],["Boards","2"],["Spots","4"]];if(G==="S1"||G==="S2"||G==="S3"){let ht=(Z,et)=>{let[st,ct]=Md(Z,I),pt=Math.round(100*Sh(Z,I,D));return{id:Z,org:mm[Z],dot:yt.blue,where:et,stat:st,cls:ct,p:pt,pt:`${pt}%`}};return{tabs:W,active:2,site:"Civic Plaza",rows:[ht("S1","1.7 m of water"),ht("S2",`${l.four.n} \xD7 ${l.four.rise.toFixed(1)} m`),ht("S3",`${l.ten.n} stairs \xB7 rail`),{id:"P-1",org:"Manual pad",dot:yt.teal,where:"Lower plaza",stat:"Open",cls:"wait",p:null,pt:"R-02 near"}]}}if(G==="board"){let[ht,Z]=U(D);return{tabs:W,active:1,site:"Civic Plaza",rows:[{id:"0712",org:"R-07 \xB7 Line 1",dot:yt.yellow,where:gm(I),stat:ht,cls:Z,p:Math.round(100*O(I).length/3),pt:`${O(I).length}/3 flips`},{id:"0233",org:"R-02 \xB7 free ride",dot:yt.teal,where:"Lower plaza \xB7 loop",stat:"Rolling",cls:"go",p:null,pt:`${Bs(k.speed)} km/h`}]}}let[$,ut]=bh(I,D);return{tabs:W,active:0,site:"Civic Plaza",rows:[{id:"R-07",org:"Line 1",dot:yt.blue,where:gm(I),stat:$,cls:ut,p:Math.round(100*fo(D)),pt:`${Math.round(100*fo(D))}%`},{id:"R-02",org:"Free ride",dot:yt.teal,where:"Lower plaza \xB7 loop",stat:"Cruising",cls:"go",p:null,pt:`${Bs(k.speed)} km/h`},{id:"F-01",org:"Filmer",dot:yt.orange,where:"Lower plaza",stat:"Recording",cls:"in",p:null,pt:`${Math.floor(I/60)}:${String(Math.floor(I%60)).padStart(2,"0")}`},{id:"B-1",org:"Bench",dot:yt.shade,where:"Middle terrace",stat:"Watching",cls:"wait",p:null,pt:"2 people"}]}},H=G=>{let I=yd(G),D=pm(G);return{a:[`${I} / 3`,`${I} clean`,"Line 1 \xB7 S1 \xB7 S2 \xB7 S3"],b:[Bs(ri(Sn.sp,G)),`peak ${Bs(ri(Sn.peak,G))}`,"R-07 \xB7 board 0712"],c:[`${Mh(G).toFixed(2)} s`,`${D} air${D===1?"":"s"}`,D?`longest ${nM(G).toFixed(2)} s`:"longest \u2014"]}},Q=(G,I,D)=>({open:L(D),sites:[["S1","Fountain gap","Hardflip \xB7 1.7 m of water",Math.round(100*Sh("S1",G,I))],["S2","Four-stair",`Laser flip \xB7 ${(l.upper.y-l.middle.y).toFixed(1)} m drop`,Math.round(100*Sh("S2",G,I))],["S3","Ten-stair rail","Kickflip BS 50-50",Math.round(100*Sh("S3",G,I))],["L1","Lower plaza","Ride away \xB7 brake",Math.round(100*ii(Bn.tl,Q1.t1,G))]],on:D>R-.35?1:0}),tt=([G,I])=>G>1130&&I<520||G>1080&&I>650||G<1e3&&I>725||G<780&&I<185,gt=(G,I)=>{let D=[],k=(ht,Z=1)=>{let et=n.project(ht);Z>.001&&et&&et[0]>20&&et[0]<1580&&et[1]>80&&et[1]<880&&!tt(et)&&D.push({kind:"pin",x:et[0],y:et[1],a:Z})},W=Si;G<W[0].t&&k(s.anchors.rider(I),1-Ye(W[0].t-.3,W[0].t,G)),G>2.3&&G<W[2].t&&k(s.anchors.S1(),Ye(2.3,2.7,G)*(1-Ye(W[2].t-.3,W[2].t,G)));let $=Ei(Be.tl+.15);G>$&&G<W[4].t&&k(s.anchors.S2(),Ye($,$+.4,G)*(1-Ye(W[4].t-.3,W[4].t,G)));let ut=Ei(nn.tl+.5);if(G>ut&&G<W[5].t&&k(s.anchors.S3(),Ye(ut,ut+.4,G)*(1-Ye(W[5].t-.3,W[5].t,G))),G>Fa+1.6){let ht=Ye(Fa+1.6,Fa+2.2,G);for(let Z of["S1","S2","S3"])k(s.anchors[Z](),ht);k(s.anchors.rider(I),ht)}return D},xt=(G,I,D)=>G==="rider"?["R-07",bh(I,D)[0]]:G==="board"?["0712",U(D)[0]]:[`${G} \xB7 ${rs[G]}`,Md(G,I)[0]],$t=(G,I)=>{if(G==="rider"){let D=[];for(let k=0;k<=32;k++){let W=Math.min(Ae.end,I+k*.1),$=ri(Sn.bx,W);D.push(uo($,cr($),ri(Sn.bz,W)))}return D}return s.stationRoute[G]??null};function Gt(G,I=!1){let D=Na(G),{hero:k,second:W}=I?{hero:Us(D),second:fh(D)}:s.pose(D),$=F(G),ut=N(G),ht=eM(D),Z=52+Math.floor(D),et=ht?`Slow-mo ${ht}\xD7`:`Live 16:${41+Math.floor(Z/60)}:${String(Z%60).padStart(2,"0")}`,st=-1;for(let pt of Si)pt.tool!=null&&G>=pt.t&&G<pt.t+.6&&(st=pt.tool);let ct={live:et,site:aM[ut],kpi:H(D),card:Y(G,$.kind,$.t0,D,k),track:X(D,k),table:ot($.kind,D,k,W),drop:I?{...Q(D,k,G),open:1}:Q(D,k,G),tool:st,tags:[],cursor:[1050,620],hand:!0,click:0};return Object.assign(ct,{_tau:D,_h:k,_s:$})}return T=(()=>{let G=i.getBoundingClientRect(),I=G.width/1600||1,D=Z=>{let et=Z.getBoundingClientRect();return[(et.left+et.width/2-G.left)/I,(et.top+et.height/2-G.top)/I]},k=Z=>d.el.querySelector(`[data-k="${Z}"]`);d.update(Gt(0,!0));let W=k("drop"),$=W.style.transform;W.style.transform="none";let ut=W.querySelectorAll(".it")[1],ht={dd:D(k("dd")),drop1:ut?D(ut):[960,186],home:D(k("tool6"))};return W.style.transform=$,ht})(),window.TRICKLINE={st:n,W:s,camAt:g,projectWith:_,tauAt:Na,filmOf:Ei,DUR:za,CLICKS:Si},{DUR:za,CHAPTERS:hM,resize:m,tauAt:Na,render(G){G=In(G,0,za);let I=Gt(G),{_tau:D,_h:k,_s:W}=I,$=W.kind==="site"?null:s.select[W.kind],ut=Ye(W.t0,W.t0+.3,G);u.box($,ut),u.route($?$t(W.kind,D):null,Ye(W.t0,W.t0+.9,G),1),u.update();let ht=g(G);if(o(ht.tx,ht.tz,Math.max(12,.62*ht.d)),n.camera.near=In(ht.d*.04,.3,8),n.gtao.gtaoMaterial.uniforms.radius.value=In(.052*ht.d,.5,5),n.frame(ht),I.tags=gt(G,k),$){let et=n.project(s.anchors[W.kind](k)),[st,ct]=xt(W.kind,D,k);et&&!tt(et)&&I.tags.push({kind:"sel",x:et[0],y:et[1],text:st,sub:ct,a:ut})}let Z=x(G,D,k);return I.cursor=Z.p.map(et=>+et.toFixed(1)),I.hand=Z.hand,I.click=b(G),d.update(I),{tau:D}}}}var bd=new URLSearchParams(location.search),Eh=bd.has("still")?parseFloat(bd.get("still"))||0:null,Ga=bd.has("capture")||Eh!=null,Am=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,Cm=document.getElementById("app"),uM=document.getElementById("gl"),Sd=document.getElementById("frame"),Rm=document.getElementById("bar"),Pm=document.getElementById("status");Ga&&document.body.classList.add("capture");var Im=()=>{let i=Ga?0:Rm.offsetHeight+12,t=Ga?1:Math.min(window.innerWidth/1600,(window.innerHeight-i)/900);return Cm.style.transform=`scale(${t})`,Sd.style.width=`${Math.round(1600*t)}px`,Sd.style.height=`${Math.round(900*t)}px`,Rm.style.width=Sd.style.width,t};Im();var bn;try{bn=await Tm({app:Cm,canvas:uM,capture:Ga})}catch(i){throw Pm.textContent="This film needs WebGL, which this browser could not start.",i}Pm.remove();if(Ga)window.SIM={DUR:bn.DUR,render:i=>bn.render(i)},Eh!=null&&(bn.render(Eh),requestAnimationFrame(()=>{bn.render(Eh),document.body.dataset.ready="1"}));else{let i=document.getElementById("play"),t=document.getElementById("scrub"),e=document.getElementById("time"),n=document.getElementById("chapters");t.max=bn.DUR.toFixed(2);for(let f of bn.CHAPTERS){let m=document.createElement("button");m.type="button",m.textContent=f.key,m.title=`Jump to ${f.label}`,m.setAttribute("aria-label",`Jump to ${f.label}`),m.addEventListener("click",()=>h(f.t,!0)),n.appendChild(m)}let s=Am?bn.CHAPTERS[0].t+2.2:0,r=!Am,o=performance.now(),a=0,l=f=>`${Math.floor(f/60)}:${(f%60).toFixed(1).padStart(4,"0")}`,c=()=>{i.textContent=r?"Pause":"Play",i.setAttribute("aria-pressed",String(r)),t.value=s.toFixed(2),e.textContent=`${l(s)} / ${l(bn.DUR)}`},h=(f,m)=>{s=Math.min(bn.DUR,Math.max(0,f)),a=0,m!=null&&(r=m),d()},d=()=>{bn.render(s),c()},u=f=>{let m=Math.min(.1,(f-o)/1e3);o=f,r&&(s>=bn.DUR?(a+=m,a>1.6&&h(0)):(s=Math.min(bn.DUR,s+m),d())),requestAnimationFrame(u)};i.addEventListener("click",()=>{s>=bn.DUR&&h(0),r=!r,c()}),t.addEventListener("input",()=>h(parseFloat(t.value))),window.addEventListener("keydown",f=>{f.target instanceof HTMLInputElement&&f.key!==" "||(f.key===" "||f.key==="k"?(f.preventDefault(),i.click()):f.key==="ArrowRight"?h(s+2):f.key==="ArrowLeft"?h(s-2):f.key==="r"?h(0,!0):/^[1-3]$/.test(f.key)&&h(bn.CHAPTERS[+f.key-1].t,!0))}),document.addEventListener("visibilitychange",()=>{o=performance.now()}),window.addEventListener("resize",()=>{Im(),bn.resize(),d()}),d(),requestAnimationFrame(u)}
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
