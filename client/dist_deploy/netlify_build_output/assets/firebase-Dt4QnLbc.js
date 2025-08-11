const aa=()=>{};var Lr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const As=function(i){const t=[];let n=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?t[n++]=o:o<2048?(t[n++]=o>>6|192,t[n++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),t[n++]=o>>18|240,t[n++]=o>>12&63|128,t[n++]=o>>6&63|128,t[n++]=o&63|128):(t[n++]=o>>12|224,t[n++]=o>>6&63|128,t[n++]=o&63|128)}return t},ha=function(i){const t=[];let n=0,r=0;for(;n<i.length;){const o=i[n++];if(o<128)t[r++]=String.fromCharCode(o);else if(o>191&&o<224){const h=i[n++];t[r++]=String.fromCharCode((o&31)<<6|h&63)}else if(o>239&&o<365){const h=i[n++],l=i[n++],m=i[n++],I=((o&7)<<18|(h&63)<<12|(l&63)<<6|m&63)-65536;t[r++]=String.fromCharCode(55296+(I>>10)),t[r++]=String.fromCharCode(56320+(I&1023))}else{const h=i[n++],l=i[n++];t[r++]=String.fromCharCode((o&15)<<12|(h&63)<<6|l&63)}}return t.join("")},bs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,t){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const h=i[o],l=o+1<i.length,m=l?i[o+1]:0,I=o+2<i.length,E=I?i[o+2]:0,A=h>>2,C=(h&3)<<4|m>>4;let S=(m&15)<<2|E>>6,x=E&63;I||(x=64,l||(S=64)),r.push(n[A],n[C],n[S],n[x])}return r.join("")},encodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(i):this.encodeByteArray(As(i),t)},decodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(i):ha(this.decodeStringToByteArray(i,t))},decodeStringToByteArray(i,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const h=n[i.charAt(o++)],m=o<i.length?n[i.charAt(o)]:0;++o;const E=o<i.length?n[i.charAt(o)]:64;++o;const C=o<i.length?n[i.charAt(o)]:64;if(++o,h==null||m==null||E==null||C==null)throw new ca;const S=h<<2|m>>4;if(r.push(S),E!==64){const x=m<<4&240|E>>2;if(r.push(x),C!==64){const P=E<<6&192|C;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class ca extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const la=function(i){const t=As(i);return bs.encodeByteArray(t,!0)},mn=function(i){return la(i).replace(/\./g,"")},Cs=function(i){try{return bs.decodeString(i,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ua(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const da=()=>ua().__FIREBASE_DEFAULTS__,fa=()=>{if(typeof process>"u"||typeof Lr>"u")return;const i=Lr.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},pa=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=i&&Cs(i[1]);return t&&JSON.parse(t)},_i=()=>{try{return aa()||da()||fa()||pa()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Ps=i=>{var t,n;return(n=(t=_i())==null?void 0:t.emulatorHosts)==null?void 0:n[i]},ga=i=>{const t=Ps(i);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return t[0]==="["?[t.substring(1,n-1),r]:[t.substring(0,n),r]},Rs=()=>{var i;return(i=_i())==null?void 0:i.config},ks=i=>{var t;return(t=_i())==null?void 0:t[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ns(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(i,t){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=t||"demo-project",o=i.iat||0,h=i.sub||i.user_id;if(!h)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l={iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:h,user_id:h,firebase:{sign_in_provider:"custom",identities:{}},...i};return[mn(JSON.stringify(n)),mn(JSON.stringify(l)),""].join(".")}const Ce={};function ya(){const i={prod:[],emulator:[]};for(const t of Object.keys(Ce))Ce[t]?i.emulator.push(t):i.prod.push(t);return i}function va(i){let t=document.getElementById(i),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",i),n=!0),{created:n,element:t}}let Mr=!1;function Os(i,t){if(typeof window>"u"||typeof document>"u"||!Me(window.location.host)||Ce[i]===t||Ce[i]||Mr)return;Ce[i]=t;function n(S){return`__firebase__banner__${S}`}const r="__firebase__banner",h=ya().prod.length>0;function l(){const S=document.getElementById(r);S&&S.remove()}function m(S){S.style.display="flex",S.style.background="#7faaf0",S.style.position="fixed",S.style.bottom="5px",S.style.left="5px",S.style.padding=".5em",S.style.borderRadius="5px",S.style.alignItems="center"}function I(S,x){S.setAttribute("width","24"),S.setAttribute("id",x),S.setAttribute("height","24"),S.setAttribute("viewBox","0 0 24 24"),S.setAttribute("fill","none"),S.style.marginLeft="-6px"}function E(){const S=document.createElement("span");return S.style.cursor="pointer",S.style.marginLeft="16px",S.style.fontSize="24px",S.innerHTML=" &times;",S.onclick=()=>{Mr=!0,l()},S}function A(S,x){S.setAttribute("id",x),S.innerText="Learn more",S.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",S.setAttribute("target","__blank"),S.style.paddingLeft="5px",S.style.textDecoration="underline"}function C(){const S=va(r),x=n("text"),P=document.getElementById(x)||document.createElement("span"),V=n("learnmore"),M=document.getElementById(V)||document.createElement("a"),Q=n("preprendIcon"),B=document.getElementById(Q)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(S.created){const $=S.element;m($),A(M,V);const ot=E();I(B,Q),$.append(B,P,M,ot),document.body.appendChild($)}h?(P.innerText="Preview backend disconnected.",B.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(B.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,P.innerText="Preview backend running in this workspace."),P.setAttribute("id",x)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",C):C()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function wa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Y())}function Ia(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ea(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Ta(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Sa(){const i=Y();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Aa(){try{return typeof indexedDB=="object"}catch{return!1}}function ba(){return new Promise((i,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var h;t(((h=o.error)==null?void 0:h.message)||"")}}catch(n){t(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca="FirebaseError";class It extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=Ca,Object.setPrototypeOf(this,It.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ue.prototype.create)}}class Ue{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},o=`${this.service}/${t}`,h=this.errors[t],l=h?Pa(h,r):"Error",m=`${this.serviceName}: ${l} (${o}).`;return new It(o,m,r)}}function Pa(i,t){return i.replace(Ra,(n,r)=>{const o=t[r];return o!=null?String(o):`<${r}?>`})}const Ra=/\{\$([^}]+)}/g;function ka(i){for(const t in i)if(Object.prototype.hasOwnProperty.call(i,t))return!1;return!0}function Gt(i,t){if(i===t)return!0;const n=Object.keys(i),r=Object.keys(t);for(const o of n){if(!r.includes(o))return!1;const h=i[o],l=t[o];if(Ur(h)&&Ur(l)){if(!Gt(h,l))return!1}else if(h!==l)return!1}for(const o of r)if(!n.includes(o))return!1;return!0}function Ur(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(i){const t=[];for(const[n,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(o))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function Na(i,t){const n=new Oa(i,t);return n.subscribe.bind(n)}class Oa{constructor(t,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(n=>{n.next(t)})}error(t){this.forEachObserver(n=>{n.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,n,r){let o;if(t===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Da(t,["next","error","complete"])?o=t:o={next:t,error:n,complete:r},o.next===void 0&&(o.next=Zn),o.error===void 0&&(o.error=Zn),o.complete===void 0&&(o.complete=Zn);const h=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),h}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,t)}sendOne(t,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{n(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Da(i,t){if(typeof i!="object"||i===null)return!1;for(const n of t)if(n in i&&typeof i[n]=="function")return!0;return!1}function Zn(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(i){return i&&i._delegate?i._delegate:i}class qt{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new ma;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){const n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(t==null?void 0:t.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Ua(t))try{this.getOrInitializeService({instanceIdentifier:Ft})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const h=this.getOrInitializeService({instanceIdentifier:o});r.resolve(h)}catch{}}}}clearInstance(t=Ft){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ft){return this.instances.has(t)}getOptions(t=Ft){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[h,l]of this.instancesDeferred.entries()){const m=this.normalizeInstanceIdentifier(h);r===m&&l.resolve(o)}return o}onInit(t,n){const r=this.normalizeInstanceIdentifier(n),o=this.onInitCallbacks.get(r)??new Set;o.add(t),this.onInitCallbacks.set(r,o);const h=this.instances.get(r);return h&&t(h,r),()=>{o.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const o of r)try{o(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ma(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Ft){return this.component?this.component.multipleInstances?t:Ft:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ma(i){return i===Ft?void 0:i}function Ua(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new La(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var D;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(D||(D={}));const Va={debug:D.DEBUG,verbose:D.VERBOSE,info:D.INFO,warn:D.WARN,error:D.ERROR,silent:D.SILENT},Fa=D.INFO,ja={[D.DEBUG]:"log",[D.VERBOSE]:"log",[D.INFO]:"info",[D.WARN]:"warn",[D.ERROR]:"error"},Ba=(i,t,...n)=>{if(t<i.logLevel)return;const r=new Date().toISOString(),o=ja[t];if(o)console[o](`[${r}]  ${i.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class yi{constructor(t){this.name=t,this._logLevel=Fa,this._logHandler=Ba,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in D))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Va[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,D.DEBUG,...t),this._logHandler(this,D.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,D.VERBOSE,...t),this._logHandler(this,D.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,D.INFO,...t),this._logHandler(this,D.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,D.WARN,...t),this._logHandler(this,D.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,D.ERROR,...t),this._logHandler(this,D.ERROR,...t)}}const Ha=(i,t)=>t.some(n=>i instanceof n);let xr,Vr;function $a(){return xr||(xr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Wa(){return Vr||(Vr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ds=new WeakMap,hi=new WeakMap,Ls=new WeakMap,ti=new WeakMap,vi=new WeakMap;function za(i){const t=new Promise((n,r)=>{const o=()=>{i.removeEventListener("success",h),i.removeEventListener("error",l)},h=()=>{n(Nt(i.result)),o()},l=()=>{r(i.error),o()};i.addEventListener("success",h),i.addEventListener("error",l)});return t.then(n=>{n instanceof IDBCursor&&Ds.set(n,i)}).catch(()=>{}),vi.set(t,i),t}function Ga(i){if(hi.has(i))return;const t=new Promise((n,r)=>{const o=()=>{i.removeEventListener("complete",h),i.removeEventListener("error",l),i.removeEventListener("abort",l)},h=()=>{n(),o()},l=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",h),i.addEventListener("error",l),i.addEventListener("abort",l)});hi.set(i,t)}let ci={get(i,t,n){if(i instanceof IDBTransaction){if(t==="done")return hi.get(i);if(t==="objectStoreNames")return i.objectStoreNames||Ls.get(i);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Nt(i[t])},set(i,t,n){return i[t]=n,!0},has(i,t){return i instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in i}};function qa(i){ci=i(ci)}function Ka(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=i.call(ei(this),t,...n);return Ls.set(r,t.sort?t.sort():[t]),Nt(r)}:Wa().includes(i)?function(...t){return i.apply(ei(this),t),Nt(Ds.get(this))}:function(...t){return Nt(i.apply(ei(this),t))}}function Ja(i){return typeof i=="function"?Ka(i):(i instanceof IDBTransaction&&Ga(i),Ha(i,$a())?new Proxy(i,ci):i)}function Nt(i){if(i instanceof IDBRequest)return za(i);if(ti.has(i))return ti.get(i);const t=Ja(i);return t!==i&&(ti.set(i,t),vi.set(t,i)),t}const ei=i=>vi.get(i);function Xa(i,t,{blocked:n,upgrade:r,blocking:o,terminated:h}={}){const l=indexedDB.open(i,t),m=Nt(l);return r&&l.addEventListener("upgradeneeded",I=>{r(Nt(l.result),I.oldVersion,I.newVersion,Nt(l.transaction),I)}),n&&l.addEventListener("blocked",I=>n(I.oldVersion,I.newVersion,I)),m.then(I=>{h&&I.addEventListener("close",()=>h()),o&&I.addEventListener("versionchange",E=>o(E.oldVersion,E.newVersion,E))}).catch(()=>{}),m}const Ya=["get","getKey","getAll","getAllKeys","count"],Qa=["put","add","delete","clear"],ni=new Map;function Fr(i,t){if(!(i instanceof IDBDatabase&&!(t in i)&&typeof t=="string"))return;if(ni.get(t))return ni.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=Qa.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(o||Ya.includes(n)))return;const h=async function(l,...m){const I=this.transaction(l,o?"readwrite":"readonly");let E=I.store;return r&&(E=E.index(m.shift())),(await Promise.all([E[n](...m),o&&I.done]))[0]};return ni.set(t,h),h}qa(i=>({...i,get:(t,n,r)=>Fr(t,n)||i.get(t,n,r),has:(t,n)=>!!Fr(t,n)||i.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(th(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function th(i){const t=i.getComponent();return(t==null?void 0:t.type)==="VERSION"}const li="@firebase/app",jr="0.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vt=new yi("@firebase/app"),eh="@firebase/app-compat",nh="@firebase/analytics-compat",ih="@firebase/analytics",rh="@firebase/app-check-compat",sh="@firebase/app-check",oh="@firebase/auth",ah="@firebase/auth-compat",hh="@firebase/database",ch="@firebase/data-connect",lh="@firebase/database-compat",uh="@firebase/functions",dh="@firebase/functions-compat",fh="@firebase/installations",ph="@firebase/installations-compat",gh="@firebase/messaging",mh="@firebase/messaging-compat",_h="@firebase/performance",yh="@firebase/performance-compat",vh="@firebase/remote-config",wh="@firebase/remote-config-compat",Ih="@firebase/storage",Eh="@firebase/storage-compat",Th="@firebase/firestore",Sh="@firebase/ai",Ah="@firebase/firestore-compat",bh="firebase",Ch="12.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui="[DEFAULT]",Ph={[li]:"fire-core",[eh]:"fire-core-compat",[ih]:"fire-analytics",[nh]:"fire-analytics-compat",[sh]:"fire-app-check",[rh]:"fire-app-check-compat",[oh]:"fire-auth",[ah]:"fire-auth-compat",[hh]:"fire-rtdb",[ch]:"fire-data-connect",[lh]:"fire-rtdb-compat",[uh]:"fire-fn",[dh]:"fire-fn-compat",[fh]:"fire-iid",[ph]:"fire-iid-compat",[gh]:"fire-fcm",[mh]:"fire-fcm-compat",[_h]:"fire-perf",[yh]:"fire-perf-compat",[vh]:"fire-rc",[wh]:"fire-rc-compat",[Ih]:"fire-gcs",[Eh]:"fire-gcs-compat",[Th]:"fire-fst",[Ah]:"fire-fst-compat",[Sh]:"fire-vertex","fire-js":"fire-js",[bh]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=new Map,Rh=new Map,di=new Map;function Br(i,t){try{i.container.addComponent(t)}catch(n){vt.debug(`Component ${t.name} failed to register with FirebaseApp ${i.name}`,n)}}function se(i){const t=i.name;if(di.has(t))return vt.debug(`There were multiple attempts to register component ${t}.`),!1;di.set(t,i);for(const n of _n.values())Br(n,i);for(const n of Rh.values())Br(n,i);return!0}function wi(i,t){const n=i.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),i.container.getProvider(t)}function nt(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ot=new Ue("app","Firebase",kh);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new qt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Ot.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const he=Ch;function Oh(i,t={}){let n=i;typeof t!="object"&&(t={name:t});const r={name:ui,automaticDataCollectionEnabled:!0,...t},o=r.name;if(typeof o!="string"||!o)throw Ot.create("bad-app-name",{appName:String(o)});if(n||(n=Rs()),!n)throw Ot.create("no-options");const h=_n.get(o);if(h){if(Gt(n,h.options)&&Gt(r,h.config))return h;throw Ot.create("duplicate-app",{appName:o})}const l=new xa(o);for(const I of di.values())l.addComponent(I);const m=new Nh(n,r,l);return _n.set(o,m),m}function Ms(i=ui){const t=_n.get(i);if(!t&&i===ui&&Rs())return Oh();if(!t)throw Ot.create("no-app",{appName:i});return t}function Dt(i,t,n){let r=Ph[i]??i;n&&(r+=`-${n}`);const o=r.match(/\s|\//),h=t.match(/\s|\//);if(o||h){const l=[`Unable to register library "${r}" with version "${t}":`];o&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),o&&h&&l.push("and"),h&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),vt.warn(l.join(" "));return}se(new qt(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh="firebase-heartbeat-database",Lh=1,Oe="firebase-heartbeat-store";let ii=null;function Us(){return ii||(ii=Xa(Dh,Lh,{upgrade:(i,t)=>{switch(t){case 0:try{i.createObjectStore(Oe)}catch(n){console.warn(n)}}}}).catch(i=>{throw Ot.create("idb-open",{originalErrorMessage:i.message})})),ii}async function Mh(i){try{const n=(await Us()).transaction(Oe),r=await n.objectStore(Oe).get(xs(i));return await n.done,r}catch(t){if(t instanceof It)vt.warn(t.message);else{const n=Ot.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});vt.warn(n.message)}}}async function Hr(i,t){try{const r=(await Us()).transaction(Oe,"readwrite");await r.objectStore(Oe).put(t,xs(i)),await r.done}catch(n){if(n instanceof It)vt.warn(n.message);else{const r=Ot.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});vt.warn(r.message)}}}function xs(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uh=1024,xh=30;class Vh{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new jh(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),h=$r();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===h||this._heartbeatsCache.heartbeats.some(l=>l.date===h))return;if(this._heartbeatsCache.heartbeats.push({date:h,agent:o}),this._heartbeatsCache.heartbeats.length>xh){const l=Bh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){vt.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=$r(),{heartbeatsToSend:r,unsentEntries:o}=Fh(this._heartbeatsCache.heartbeats),h=mn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),h}catch(n){return vt.warn(n),""}}}function $r(){return new Date().toISOString().substring(0,10)}function Fh(i,t=Uh){const n=[];let r=i.slice();for(const o of i){const h=n.find(l=>l.agent===o.agent);if(h){if(h.dates.push(o.date),Wr(n)>t){h.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),Wr(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class jh{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Aa()?ba().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Mh(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Hr(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Hr(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function Wr(i){return mn(JSON.stringify({version:2,heartbeats:i})).length}function Bh(i){if(i.length===0)return-1;let t=0,n=i[0].date;for(let r=1;r<i.length;r++)i[r].date<n&&(n=i[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hh(i){se(new qt("platform-logger",t=>new Za(t),"PRIVATE")),se(new qt("heartbeat",t=>new Vh(t),"PRIVATE")),Dt(li,jr,i),Dt(li,jr,"esm2020"),Dt("fire-js","")}Hh("");function Vs(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const $h=Vs,Fs=new Ue("auth","Firebase",Vs());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yn=new yi("@firebase/auth");function Wh(i,...t){yn.logLevel<=D.WARN&&yn.warn(`Auth (${he}): ${i}`,...t)}function un(i,...t){yn.logLevel<=D.ERROR&&yn.error(`Auth (${he}): ${i}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dt(i,...t){throw Ei(i,...t)}function st(i,...t){return Ei(i,...t)}function Ii(i,t,n){const r={...$h(),[t]:n};return new Ue("auth","Firebase",r).create(t,{appName:i.name})}function $t(i){return Ii(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function zh(i,t,n){const r=n;if(!(t instanceof r))throw r.name!==t.constructor.name&&dt(i,"argument-error"),Ii(i,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ei(i,...t){if(typeof i!="string"){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(n,...r)}return Fs.create(i,...t)}function b(i,t,...n){if(!i)throw Ei(t,...n)}function _t(i){const t="INTERNAL ASSERTION FAILED: "+i;throw un(t),new Error(t)}function wt(i,t){i||_t(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fi(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.href)||""}function Gh(){return zr()==="http:"||zr()==="https:"}function zr(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qh(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Gh()||Ea()||"connection"in navigator)?navigator.onLine:!0}function Kh(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(t,n){this.shortDelay=t,this.longDelay=n,wt(n>t,"Short delay should be less than long delay!"),this.isMobile=wa()||Ta()}get(){return qh()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ti(i,t){wt(i.emulator,"Emulator should always be set here");const{url:n}=i.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class js{static initialize(t,n,r){this.fetchImpl=t,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;_t("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;_t("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;_t("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xh=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Yh=new Ve(3e4,6e4);function Si(i,t){return i.tenantId&&!t.tenantId?{...t,tenantId:i.tenantId}:t}async function ce(i,t,n,r,o={}){return Bs(i,o,async()=>{let h={},l={};r&&(t==="GET"?l=r:h={body:JSON.stringify(r)});const m=xe({key:i.config.apiKey,...l}).slice(1),I=await i._getAdditionalHeaders();I["Content-Type"]="application/json",i.languageCode&&(I["X-Firebase-Locale"]=i.languageCode);const E={method:t,headers:I,...h};return Ia()||(E.referrerPolicy="no-referrer"),i.emulatorConfig&&Me(i.emulatorConfig.host)&&(E.credentials="include"),js.fetch()(await Hs(i,i.config.apiHost,n,m),E)})}async function Bs(i,t,n){i._canInitEmulator=!1;const r={...Jh,...t};try{const o=new Zh(i),h=await Promise.race([n(),o.promise]);o.clearNetworkTimeout();const l=await h.json();if("needConfirmation"in l)throw hn(i,"account-exists-with-different-credential",l);if(h.ok&&!("errorMessage"in l))return l;{const m=h.ok?l.errorMessage:l.error.message,[I,E]=m.split(" : ");if(I==="FEDERATED_USER_ID_ALREADY_LINKED")throw hn(i,"credential-already-in-use",l);if(I==="EMAIL_EXISTS")throw hn(i,"email-already-in-use",l);if(I==="USER_DISABLED")throw hn(i,"user-disabled",l);const A=r[I]||I.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw Ii(i,A,E);dt(i,A)}}catch(o){if(o instanceof It)throw o;dt(i,"network-request-failed",{message:String(o)})}}async function Qh(i,t,n,r,o={}){const h=await ce(i,t,n,r,o);return"mfaPendingCredential"in h&&dt(i,"multi-factor-auth-required",{_serverResponse:h}),h}async function Hs(i,t,n,r){const o=`${t}${n}?${r}`,h=i,l=h.config.emulator?Ti(i.config,o):`${i.config.apiScheme}://${o}`;return Xh.includes(n)&&(await h._persistenceManagerAvailable,h._getPersistenceType()==="COOKIE")?h._getPersistence()._getFinalTarget(l).toString():l}class Zh{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(st(this.auth,"network-request-failed")),Yh.get())})}}function hn(i,t,n){const r={appName:i.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const o=st(i,t,r);return o.customData._tokenResponse=n,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tc(i,t){return ce(i,"POST","/v1/accounts:delete",t)}async function vn(i,t){return ce(i,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(i){if(i)try{const t=new Date(Number(i));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function ec(i,t=!1){const n=Mt(i),r=await n.getIdToken(t),o=Ai(r);b(o&&o.exp&&o.auth_time&&o.iat,n.auth,"internal-error");const h=typeof o.firebase=="object"?o.firebase:void 0,l=h==null?void 0:h.sign_in_provider;return{claims:o,token:r,authTime:Pe(ri(o.auth_time)),issuedAtTime:Pe(ri(o.iat)),expirationTime:Pe(ri(o.exp)),signInProvider:l||null,signInSecondFactor:(h==null?void 0:h.sign_in_second_factor)||null}}function ri(i){return Number(i)*1e3}function Ai(i){const[t,n,r]=i.split(".");if(t===void 0||n===void 0||r===void 0)return un("JWT malformed, contained fewer than 3 sections"),null;try{const o=Cs(n);return o?JSON.parse(o):(un("Failed to decode base64 JWT payload"),null)}catch(o){return un("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function Gr(i){const t=Ai(i);return b(t,"internal-error"),b(typeof t.exp<"u","internal-error"),b(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function De(i,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof It&&nc(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function nc({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(t=!1){if(!this.isRunning)return;const n=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(t,n){this.createdAt=t,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Pe(this.lastLoginAt),this.creationTime=Pe(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wn(i){var C;const t=i.auth,n=await i.getIdToken(),r=await De(i,vn(t,{idToken:n}));b(r==null?void 0:r.users.length,t,"internal-error");const o=r.users[0];i._notifyReloadListener(o);const h=(C=o.providerUserInfo)!=null&&C.length?$s(o.providerUserInfo):[],l=sc(i.providerData,h),m=i.isAnonymous,I=!(i.email&&o.passwordHash)&&!(l!=null&&l.length),E=m?I:!1,A={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new pi(o.createdAt,o.lastLoginAt),isAnonymous:E};Object.assign(i,A)}async function rc(i){const t=Mt(i);await wn(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function sc(i,t){return[...i.filter(r=>!t.some(o=>o.providerId===r.providerId)),...t]}function $s(i){return i.map(({providerId:t,...n})=>({providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oc(i,t){const n=await Bs(i,{},async()=>{const r=xe({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:o,apiKey:h}=i.config,l=await Hs(i,o,"/v1/token",`key=${h}`),m=await i._getAdditionalHeaders();m["Content-Type"]="application/x-www-form-urlencoded";const I={method:"POST",headers:m,body:r};return i.emulatorConfig&&Me(i.emulatorConfig.host)&&(I.credentials="include"),js.fetch()(l,I)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function ac(i,t){return ce(i,"POST","/v2/accounts:revokeToken",Si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){b(t.idToken,"internal-error"),b(typeof t.idToken<"u","internal-error"),b(typeof t.refreshToken<"u","internal-error");const n="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):Gr(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,n)}updateFromIdToken(t){b(t.length!==0,"internal-error");const n=Gr(t);this.updateTokensAndExpiration(t,null,n)}async getToken(t,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(b(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,n){const{accessToken:r,refreshToken:o,expiresIn:h}=await oc(t,n);this.updateTokensAndExpiration(r,o,Number(h))}updateTokensAndExpiration(t,n,r){this.refreshToken=n||null,this.accessToken=t||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(t,n){const{refreshToken:r,accessToken:o,expirationTime:h}=n,l=new ee;return r&&(b(typeof r=="string","internal-error",{appName:t}),l.refreshToken=r),o&&(b(typeof o=="string","internal-error",{appName:t}),l.accessToken=o),h&&(b(typeof h=="number","internal-error",{appName:t}),l.expirationTime=h),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new ee,this.toJSON())}_performRefresh(){return _t("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bt(i,t){b(typeof i=="string"||typeof i>"u","internal-error",{appName:t})}class it{constructor({uid:t,auth:n,stsTokenManager:r,...o}){this.providerId="firebase",this.proactiveRefresh=new ic(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new pi(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(t){const n=await De(this,this.stsTokenManager.getToken(this.auth,t));return b(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(t){return ec(this,t)}reload(){return rc(this)}_assign(t){this!==t&&(b(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(n=>({...n})),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const n=new it({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(t){b(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,n=!1){let r=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),r=!0),n&&await wn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(nt(this.auth.app))return Promise.reject($t(this.auth));const t=await this.getIdToken();return await De(this,tc(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>({...t})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,n){const r=n.displayName??void 0,o=n.email??void 0,h=n.phoneNumber??void 0,l=n.photoURL??void 0,m=n.tenantId??void 0,I=n._redirectEventId??void 0,E=n.createdAt??void 0,A=n.lastLoginAt??void 0,{uid:C,emailVerified:S,isAnonymous:x,providerData:P,stsTokenManager:V}=n;b(C&&V,t,"internal-error");const M=ee.fromJSON(this.name,V);b(typeof C=="string",t,"internal-error"),bt(r,t.name),bt(o,t.name),b(typeof S=="boolean",t,"internal-error"),b(typeof x=="boolean",t,"internal-error"),bt(h,t.name),bt(l,t.name),bt(m,t.name),bt(I,t.name),bt(E,t.name),bt(A,t.name);const Q=new it({uid:C,auth:t,email:o,emailVerified:S,displayName:r,isAnonymous:x,photoURL:l,phoneNumber:h,tenantId:m,stsTokenManager:M,createdAt:E,lastLoginAt:A});return P&&Array.isArray(P)&&(Q.providerData=P.map(B=>({...B}))),I&&(Q._redirectEventId=I),Q}static async _fromIdTokenResponse(t,n,r=!1){const o=new ee;o.updateFromServerResponse(n);const h=new it({uid:n.localId,auth:t,stsTokenManager:o,isAnonymous:r});return await wn(h),h}static async _fromGetAccountInfoResponse(t,n,r){const o=n.users[0];b(o.localId!==void 0,"internal-error");const h=o.providerUserInfo!==void 0?$s(o.providerUserInfo):[],l=!(o.email&&o.passwordHash)&&!(h!=null&&h.length),m=new ee;m.updateFromIdToken(r);const I=new it({uid:o.localId,auth:t,stsTokenManager:m,isAnonymous:l}),E={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new pi(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(h!=null&&h.length)};return Object.assign(I,E),I}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qr=new Map;function yt(i){wt(i instanceof Function,"Expected a class definition");let t=qr.get(i);return t?(wt(t instanceof i,"Instance stored in cache mismatched with class"),t):(t=new i,qr.set(i,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,n){this.storage[t]=n}async _get(t){const n=this.storage[t];return n===void 0?null:n}async _remove(t){delete this.storage[t]}_addListener(t,n){}_removeListener(t,n){}}Ws.type="NONE";const Kr=Ws;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dn(i,t,n){return`firebase:${i}:${t}:${n}`}class ne{constructor(t,n,r){this.persistence=t,this.auth=n,this.userKey=r;const{config:o,name:h}=this.auth;this.fullUserKey=dn(this.userKey,o.apiKey,h),this.fullPersistenceKey=dn("persistence",o.apiKey,h),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const n=await vn(this.auth,{idToken:t}).catch(()=>{});return n?it._fromGetAccountInfoResponse(this.auth,n,t):null}return it._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,n,r="authUser"){if(!n.length)return new ne(yt(Kr),t,r);const o=(await Promise.all(n.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let h=o[0]||yt(Kr);const l=dn(r,t.config.apiKey,t.name);let m=null;for(const E of n)try{const A=await E._get(l);if(A){let C;if(typeof A=="string"){const S=await vn(t,{idToken:A}).catch(()=>{});if(!S)break;C=await it._fromGetAccountInfoResponse(t,S,A)}else C=it._fromJSON(t,A);E!==h&&(m=C),h=E;break}}catch{}const I=o.filter(E=>E._shouldAllowMigration);return!h._shouldAllowMigration||!I.length?new ne(h,t,r):(h=I[0],m&&await h._set(l,m.toJSON()),await Promise.all(n.map(async E=>{if(E!==h)try{await E._remove(l)}catch{}})),new ne(h,t,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jr(i){const t=i.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ks(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(zs(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Xs(t))return"Blackberry";if(Ys(t))return"Webos";if(Gs(t))return"Safari";if((t.includes("chrome/")||qs(t))&&!t.includes("edge/"))return"Chrome";if(Js(t))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function zs(i=Y()){return/firefox\//i.test(i)}function Gs(i=Y()){const t=i.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function qs(i=Y()){return/crios\//i.test(i)}function Ks(i=Y()){return/iemobile/i.test(i)}function Js(i=Y()){return/android/i.test(i)}function Xs(i=Y()){return/blackberry/i.test(i)}function Ys(i=Y()){return/webos/i.test(i)}function bi(i=Y()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function hc(i=Y()){var t;return bi(i)&&!!((t=window.navigator)!=null&&t.standalone)}function cc(){return Sa()&&document.documentMode===10}function Qs(i=Y()){return bi(i)||Js(i)||Ys(i)||Xs(i)||/windows phone/i.test(i)||Ks(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zs(i,t=[]){let n;switch(i){case"Browser":n=Jr(Y());break;case"Worker":n=`${Jr(Y())}-${i}`;break;default:n=i}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${he}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,n){const r=h=>new Promise((l,m)=>{try{const I=t(h);l(I)}catch(I){m(I)}});r.onAbort=n,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const n=[];try{for(const r of this.queue)await r(t),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const o of n)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uc(i,t={}){return ce(i,"GET","/v2/passwordPolicy",Si(i,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc=6;class fc{constructor(t){var r;const n=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??dc,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=t.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=t.forceUpgradeOnSignin??!1,this.schemaVersion=t.schemaVersion}validatePassword(t){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,n),this.validatePasswordCharacterOptions(t,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(t,n){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=t.length>=r),o&&(n.meetsMaxPasswordLength=t.length<=o)}validatePasswordCharacterOptions(t,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let o=0;o<t.length;o++)r=t.charAt(o),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(t,n,r,o,h){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(t,n,r,o){this.app=t,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Xr(this),this.idTokenSubscription=new Xr(this),this.beforeStateQueue=new lc(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Fs,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(h=>this._resolvePersistenceManagerAvailable=h)}_initializeWithPersistence(t,n){return n&&(this._popupRedirectResolver=yt(n)),this._initializationPromise=this.queue(async()=>{var r,o,h;if(!this._deleted&&(this.persistenceManager=await ne.create(this,t),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((h=this.currentUser)==null?void 0:h.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const n=await vn(this,{idToken:t}),r=await it._fromGetAccountInfoResponse(this,n,t);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var h;if(nt(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(m=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(m,m))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,o=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(h=this.redirectUser)==null?void 0:h._redirectEventId,m=r==null?void 0:r._redirectEventId,I=await this.tryRedirectSignIn(t);(!l||l===m)&&(I!=null&&I.user)&&(r=I.user,o=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(r)}catch(l){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return b(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(t){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(t){try{await wn(t)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Kh()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(nt(this.app))return Promise.reject($t(this));const n=t?Mt(t):null;return n&&b(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(t,n=!1){if(!this._deleted)return t&&b(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return nt(this.app)?Promise.reject($t(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return nt(this.app)?Promise.reject($t(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(yt(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await uc(this),n=new fc(t);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new Ue("auth","Firebase",t())}onAuthStateChanged(t,n,r){return this.registerStateListener(this.authStateSubscription,t,n,r)}beforeAuthStateChanged(t,n){return this.beforeStateQueue.pushCallback(t,n)}onIdTokenChanged(t,n,r){return this.registerStateListener(this.idTokenSubscription,t,n,r)}authStateReady(){return new Promise((t,n)=>{if(this.currentUser)t();else{const r=this.onAuthStateChanged(()=>{r(),t()},n)}})}async revokeAccessToken(t){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await ac(this,r)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)==null?void 0:t.toJSON()}}async _setRedirectUser(t,n){const r=await this.getOrInitRedirectPersistenceManager(n);return t===null?r.removeCurrentUser():r.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const n=t&&yt(t)||this._popupRedirectResolver;b(n,this,"argument-error"),this.redirectPersistenceManager=await ne.create(this,[yt(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===t?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,n,r,o){if(this._deleted)return()=>{};const h=typeof n=="function"?n:n.next.bind(n);let l=!1;const m=this._isInitialized?Promise.resolve():this._initializationPromise;if(b(m,this,"internal-error"),m.then(()=>{l||h(this.currentUser)}),typeof n=="function"){const I=t.addObserver(n,r,o);return()=>{l=!0,I()}}else{const I=t.addObserver(n);return()=>{l=!0,I()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return b(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Zs(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var n;if(nt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return t!=null&&t.error&&Wh(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Fe(i){return Mt(i)}class Xr{constructor(t){this.auth=t,this.observer=null,this.addObserver=Na(n=>this.observer=n)}get next(){return b(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ci={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function gc(i){Ci=i}function mc(i){return Ci.loadJS(i)}function _c(){return Ci.gapiScript}function yc(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(i,t){const n=wi(i,"auth");if(n.isInitialized()){const o=n.getImmediate(),h=n.getOptions();if(Gt(h,t??{}))return o;dt(o,"already-initialized")}return n.initialize({options:t})}function wc(i,t){const n=(t==null?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(yt);t!=null&&t.errorMap&&i._updateErrorMap(t.errorMap),i._initializeWithPersistence(r,t==null?void 0:t.popupRedirectResolver)}function Ic(i,t,n){const r=Fe(i);b(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const o=!1,h=to(t),{host:l,port:m}=Ec(t),I=m===null?"":`:${m}`,E={url:`${h}//${l}${I}/`},A=Object.freeze({host:l,port:m,protocol:h.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!r._canInitEmulator){b(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),b(Gt(E,r.config.emulator)&&Gt(A,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=E,r.emulatorConfig=A,r.settings.appVerificationDisabledForTesting=!0,Me(l)?(Ns(`${h}//${l}${I}`),Os("Auth",!0)):Tc()}function to(i){const t=i.indexOf(":");return t<0?"":i.substr(0,t+1)}function Ec(i){const t=to(i),n=/(\/\/)?([^?#/]+)/.exec(i.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const h=o[1];return{host:h,port:Yr(r.substr(h.length+1))}}else{const[h,l]=r.split(":");return{host:h,port:Yr(l)}}}function Yr(i){if(!i)return null;const t=Number(i);return isNaN(t)?null:t}function Tc(){function i(){const t=document.createElement("p"),n=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo{constructor(t,n){this.providerId=t,this.signInMethod=n}toJSON(){return _t("not implemented")}_getIdTokenResponse(t){return _t("not implemented")}_linkToIdToken(t,n){return _t("not implemented")}_getReauthenticationResolver(t){return _t("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ie(i,t){return Qh(i,"POST","/v1/accounts:signInWithIdp",Si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sc="http://localhost";class Kt extends eo{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const n=new Kt(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(n.idToken=t.idToken),t.accessToken&&(n.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(n.nonce=t.nonce),t.pendingToken&&(n.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(n.accessToken=t.oauthToken,n.secret=t.oauthTokenSecret):dt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const n=typeof t=="string"?JSON.parse(t):t,{providerId:r,signInMethod:o,...h}=n;if(!r||!o)return null;const l=new Kt(r,o);return l.idToken=h.idToken||void 0,l.accessToken=h.accessToken||void 0,l.secret=h.secret,l.nonce=h.nonce,l.pendingToken=h.pendingToken||null,l}_getIdTokenResponse(t){const n=this.buildRequest();return ie(t,n)}_linkToIdToken(t,n){const r=this.buildRequest();return r.idToken=n,ie(t,r)}_getReauthenticationResolver(t){const n=this.buildRequest();return n.autoCreate=!1,ie(t,n)}buildRequest(){const t={requestUri:Sc,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),t.postBody=xe(n)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je extends Pi{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct extends je{constructor(){super("facebook.com")}static credential(t){return Kt._fromParams({providerId:Ct.PROVIDER_ID,signInMethod:Ct.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Ct.credentialFromTaggedObject(t)}static credentialFromError(t){return Ct.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Ct.credential(t.oauthAccessToken)}catch{return null}}}Ct.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ct.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt extends je{constructor(){super("google.com"),this.addScope("profile")}static credential(t,n){return Kt._fromParams({providerId:Pt.PROVIDER_ID,signInMethod:Pt.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:n})}static credentialFromResult(t){return Pt.credentialFromTaggedObject(t)}static credentialFromError(t){return Pt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:n,oauthAccessToken:r}=t;if(!n&&!r)return null;try{return Pt.credential(n,r)}catch{return null}}}Pt.GOOGLE_SIGN_IN_METHOD="google.com";Pt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt extends je{constructor(){super("github.com")}static credential(t){return Kt._fromParams({providerId:Rt.PROVIDER_ID,signInMethod:Rt.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Rt.credentialFromTaggedObject(t)}static credentialFromError(t){return Rt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Rt.credential(t.oauthAccessToken)}catch{return null}}}Rt.GITHUB_SIGN_IN_METHOD="github.com";Rt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt extends je{constructor(){super("twitter.com")}static credential(t,n){return Kt._fromParams({providerId:kt.PROVIDER_ID,signInMethod:kt.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:n})}static credentialFromResult(t){return kt.credentialFromTaggedObject(t)}static credentialFromError(t){return kt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=t;if(!n||!r)return null;try{return kt.credential(n,r)}catch{return null}}}kt.TWITTER_SIGN_IN_METHOD="twitter.com";kt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,n,r,o=!1){const h=await it._fromIdTokenResponse(t,r,o),l=Qr(r);return new oe({user:h,providerId:l,_tokenResponse:r,operationType:n})}static async _forOperation(t,n,r){await t._updateTokensIfNecessary(r,!0);const o=Qr(r);return new oe({user:t,providerId:o,_tokenResponse:r,operationType:n})}}function Qr(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In extends It{constructor(t,n,r,o){super(n.code,n.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,In.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,n,r,o){return new In(t,n,r,o)}}function no(i,t,n,r){return(t==="reauthenticate"?n._getReauthenticationResolver(i):n._getIdTokenResponse(i)).catch(h=>{throw h.code==="auth/multi-factor-auth-required"?In._fromErrorAndOperation(i,h,t,r):h})}async function Ac(i,t,n=!1){const r=await De(i,t._linkToIdToken(i.auth,await i.getIdToken()),n);return oe._forOperation(i,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bc(i,t,n=!1){const{auth:r}=i;if(nt(r.app))return Promise.reject($t(r));const o="reauthenticate";try{const h=await De(i,no(r,o,t,i),n);b(h.idToken,r,"internal-error");const l=Ai(h.idToken);b(l,r,"internal-error");const{sub:m}=l;return b(i.uid===m,r,"user-mismatch"),oe._forOperation(i,o,h)}catch(h){throw(h==null?void 0:h.code)==="auth/user-not-found"&&dt(r,"user-mismatch"),h}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cc(i,t,n=!1){if(nt(i.app))return Promise.reject($t(i));const r="signIn",o=await no(i,r,t),h=await oe._fromIdTokenResponse(i,r,o);return n||await i._updateCurrentUser(h.user),h}function Pc(i,t,n,r){return Mt(i).onIdTokenChanged(t,n,r)}function Rc(i,t,n){return Mt(i).beforeAuthStateChanged(t,n)}function yu(i,t,n,r){return Mt(i).onAuthStateChanged(t,n,r)}function vu(i){return Mt(i).signOut()}const En="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(t,n){this.storageRetriever=t,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(En,"1"),this.storage.removeItem(En),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,n){return this.storage.setItem(t,JSON.stringify(n)),Promise.resolve()}_get(t){const n=this.storage.getItem(t);return Promise.resolve(n?JSON.parse(n):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kc=1e3,Nc=10;class ro extends io{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,n)=>this.onStorageEvent(t,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qs(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),o=this.localCache[n];r!==o&&t(n,o,r)}}onStorageEvent(t,n=!1){if(!t.key){this.forAllChangedKeys((l,m,I)=>{this.notifyListeners(l,I)});return}const r=t.key;n?this.detachListener():this.stopPolling();const o=()=>{const l=this.storage.getItem(r);!n&&this.localCache[r]===l||this.notifyListeners(r,l)},h=this.storage.getItem(r);cc()&&h!==t.newValue&&t.newValue!==t.oldValue?setTimeout(o,Nc):o()}notifyListeners(t,n){this.localCache[t]=n;const r=this.listeners[t];if(r)for(const o of Array.from(r))o(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:n,newValue:r}),!0)})},kc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,n){await super._set(t,n),this.localCache[t]=JSON.stringify(n)}async _get(t){const n=await super._get(t);return this.localCache[t]=JSON.stringify(n),n}async _remove(t){await super._remove(t),delete this.localCache[t]}}ro.type="LOCAL";const Oc=ro;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so extends io{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,n){}_removeListener(t,n){}}so.type="SESSION";const oo=so;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dc(i){return Promise.all(i.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const n=this.receivers.find(o=>o.isListeningto(t));if(n)return n;const r=new An(t);return this.receivers.push(r),r}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const n=t,{eventId:r,eventType:o,data:h}=n.data,l=this.handlersMap[o];if(!(l!=null&&l.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const m=Array.from(l).map(async E=>E(n.origin,h)),I=await Dc(m);n.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:I})}_subscribe(t,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(n)}_unsubscribe(t,n){this.handlersMap[t]&&n&&this.handlersMap[t].delete(n),(!n||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}An.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ri(i="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(Math.random()*10);return i+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,n,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let h,l;return new Promise((m,I)=>{const E=Ri("",20);o.port1.start();const A=setTimeout(()=>{I(new Error("unsupported_event"))},r);l={messageChannel:o,onMessage(C){const S=C;if(S.data.eventId===E)switch(S.data.status){case"ack":clearTimeout(A),h=setTimeout(()=>{I(new Error("timeout"))},3e3);break;case"done":clearTimeout(h),m(S.data.response);break;default:clearTimeout(A),clearTimeout(h),I(new Error("invalid_response"));break}}},this.handlers.add(l),o.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:t,eventId:E,data:n},[o.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(){return window}function Mc(i){ut().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(){return typeof ut().WorkerGlobalScope<"u"&&typeof ut().importScripts=="function"}async function Uc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function xc(){var i;return((i=navigator==null?void 0:navigator.serviceWorker)==null?void 0:i.controller)||null}function Vc(){return ao()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ho="firebaseLocalStorageDb",Fc=1,Tn="firebaseLocalStorage",co="fbase_key";class Be{constructor(t){this.request=t}toPromise(){return new Promise((t,n)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function bn(i,t){return i.transaction([Tn],t?"readwrite":"readonly").objectStore(Tn)}function jc(){const i=indexedDB.deleteDatabase(ho);return new Be(i).toPromise()}function gi(){const i=indexedDB.open(ho,Fc);return new Promise((t,n)=>{i.addEventListener("error",()=>{n(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(Tn,{keyPath:co})}catch(o){n(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(Tn)?t(r):(r.close(),await jc(),t(await gi()))})})}async function Zr(i,t,n){const r=bn(i,!0).put({[co]:t,value:n});return new Be(r).toPromise()}async function Bc(i,t){const n=bn(i,!1).get(t),r=await new Be(n).toPromise();return r===void 0?null:r.value}function ts(i,t){const n=bn(i,!0).delete(t);return new Be(n).toPromise()}const Hc=800,$c=3;class lo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await gi(),this.db)}async _withRetries(t){let n=0;for(;;)try{const r=await this._openDb();return await t(r)}catch(r){if(n++>$c)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ao()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=An._getInstance(Vc()),this.receiver._subscribe("keyChanged",async(t,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(t,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Uc(),!this.activeServiceWorker)return;this.sender=new Lc(this.activeServiceWorker);const t=await this.sender._send("ping",{},800);t&&(n=t[0])!=null&&n.fulfilled&&(r=t[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||xc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await gi();return await Zr(t,En,"1"),await ts(t,En),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Zr(r,t,n)),this.localCache[t]=n,this.notifyServiceWorker(t)))}async _get(t){const n=await this._withRetries(r=>Bc(r,t));return this.localCache[t]=n,n}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(n=>ts(n,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(o=>{const h=bn(o,!1).getAll();return new Be(h).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(t.length!==0)for(const{fbase_key:o,value:h}of t)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(h)&&(this.notifyListeners(o,h),n.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),n.push(o));return n}notifyListeners(t,n){this.localCache[t]=n;const r=this.listeners[t];if(r)for(const o of Array.from(r))o(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Hc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}lo.type="LOCAL";const Wc=lo;new Ve(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uo(i,t){return t?yt(t):(b(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki extends eo{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return ie(t,this._buildIdpRequest())}_linkToIdToken(t,n){return ie(t,this._buildIdpRequest(n))}_getReauthenticationResolver(t){return ie(t,this._buildIdpRequest())}_buildIdpRequest(t){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(n.idToken=t),n}}function zc(i){return Cc(i.auth,new ki(i),i.bypassAuthState)}function Gc(i){const{auth:t,user:n}=i;return b(n,t,"internal-error"),bc(n,new ki(i),i.bypassAuthState)}async function qc(i){const{auth:t,user:n}=i;return b(n,t,"internal-error"),Ac(n,new ki(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(t,n,r,o,h=!1){this.auth=t,this.resolver=r,this.user=o,this.bypassAuthState=h,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(t,n)=>{this.pendingPromise={resolve:t,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(t){const{urlResponse:n,sessionId:r,postBody:o,tenantId:h,error:l,type:m}=t;if(l){this.reject(l);return}const I={auth:this.auth,requestUri:n,sessionId:r,tenantId:h||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(m)(I))}catch(E){this.reject(E)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return zc;case"linkViaPopup":case"linkViaRedirect":return qc;case"reauthViaPopup":case"reauthViaRedirect":return Gc;default:dt(this.auth,"internal-error")}}resolve(t){wt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){wt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kc=new Ve(2e3,1e4);async function wu(i,t,n){if(nt(i.app))return Promise.reject(st(i,"operation-not-supported-in-this-environment"));const r=Fe(i);zh(i,t,Pi);const o=uo(r,n);return new Bt(r,"signInViaPopup",t,o).executeNotNull()}class Bt extends fo{constructor(t,n,r,o,h){super(t,n,o,h),this.provider=r,this.authWindow=null,this.pollId=null,Bt.currentPopupAction&&Bt.currentPopupAction.cancel(),Bt.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return b(t,this.auth,"internal-error"),t}async onExecution(){wt(this.filter.length===1,"Popup operations only handle one event");const t=Ri();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(st(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)==null?void 0:t.associatedEvent)||null}cancel(){this.reject(st(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Bt.currentPopupAction=null}pollUserCancellation(){const t=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(st(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Kc.get())};t()}}Bt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc="pendingRedirect",fn=new Map;class Xc extends fo{constructor(t,n,r=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let t=fn.get(this.auth._key());if(!t){try{const r=await Yc(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(r)}catch(n){t=()=>Promise.reject(n)}fn.set(this.auth._key(),t)}return this.bypassAuthState||fn.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const n=await this.auth._redirectUserForId(t.eventId);if(n)return this.user=n,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Yc(i,t){const n=tl(t),r=Zc(i);if(!await r._isAvailable())return!1;const o=await r._get(n)==="true";return await r._remove(n),o}function Qc(i,t){fn.set(i._key(),t)}function Zc(i){return yt(i._redirectPersistence)}function tl(i){return dn(Jc,i.config.apiKey,i.name)}async function Iu(i,t){return await Fe(i)._initializationPromise,po(i,t,!1)}async function po(i,t,n=!1){if(nt(i.app))return Promise.reject($t(i));const r=Fe(i),o=uo(r,t),l=await new Xc(r,o,n).execute();return l&&!n&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,t)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el=10*60*1e3;class nl{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(t,r)&&(n=!0,this.sendToConsumer(t,r),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!il(t)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=t,n=!0)),n}sendToConsumer(t,n){var r;if(t.error&&!go(t)){const o=((r=t.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(st(this.auth,o))}else n.onAuthEvent(t)}isEventForConsumer(t,n){const r=n.eventId===null||!!t.eventId&&t.eventId===n.eventId;return n.filter.includes(t.type)&&r}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=el&&this.cachedEventUids.clear(),this.cachedEventUids.has(es(t))}saveEventToCache(t){this.cachedEventUids.add(es(t)),this.lastProcessedEventTime=Date.now()}}function es(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(t=>t).join("-")}function go({type:i,error:t}){return i==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function il(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return go(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rl(i,t={}){return ce(i,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ol=/^https?/;async function al(i){if(i.config.emulator)return;const{authorizedDomains:t}=await rl(i);for(const n of t)try{if(hl(n))return}catch{}dt(i,"unauthorized-domain")}function hl(i){const t=fi(),{protocol:n,hostname:r}=new URL(t);if(i.startsWith("chrome-extension://")){const l=new URL(i);return l.hostname===""&&r===""?n==="chrome-extension:"&&i.replace("chrome-extension://","")===t.replace("chrome-extension://",""):n==="chrome-extension:"&&l.hostname===r}if(!ol.test(n))return!1;if(sl.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cl=new Ve(3e4,6e4);function ns(){const i=ut().___jsl;if(i!=null&&i.H){for(const t of Object.keys(i.H))if(i.H[t].r=i.H[t].r||[],i.H[t].L=i.H[t].L||[],i.H[t].r=[...i.H[t].L],i.CP)for(let n=0;n<i.CP.length;n++)i.CP[n]=null}}function ll(i){return new Promise((t,n)=>{var o,h,l;function r(){ns(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{ns(),n(st(i,"network-request-failed"))},timeout:cl.get()})}if((h=(o=ut().gapi)==null?void 0:o.iframes)!=null&&h.Iframe)t(gapi.iframes.getContext());else if((l=ut().gapi)!=null&&l.load)r();else{const m=yc("iframefcb");return ut()[m]=()=>{gapi.load?r():n(st(i,"network-request-failed"))},mc(`${_c()}?onload=${m}`).catch(I=>n(I))}}).catch(t=>{throw pn=null,t})}let pn=null;function ul(i){return pn=pn||ll(i),pn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl=new Ve(5e3,15e3),fl="__/auth/iframe",pl="emulator/auth/iframe",gl={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ml=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function _l(i){const t=i.config;b(t.authDomain,i,"auth-domain-config-required");const n=t.emulator?Ti(t,pl):`https://${i.config.authDomain}/${fl}`,r={apiKey:t.apiKey,appName:i.name,v:he},o=ml.get(i.config.apiHost);o&&(r.eid=o);const h=i._getFrameworks();return h.length&&(r.fw=h.join(",")),`${n}?${xe(r).slice(1)}`}async function yl(i){const t=await ul(i),n=ut().gapi;return b(n,i,"internal-error"),t.open({where:document.body,url:_l(i),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:gl,dontclear:!0},r=>new Promise(async(o,h)=>{await r.restyle({setHideOnLeave:!1});const l=st(i,"network-request-failed"),m=ut().setTimeout(()=>{h(l)},dl.get());function I(){ut().clearTimeout(m),o(r)}r.ping(I).then(I,()=>{h(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},wl=500,Il=600,El="_blank",Tl="http://localhost";class is{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Sl(i,t,n,r=wl,o=Il){const h=Math.max((window.screen.availHeight-o)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let m="";const I={...vl,width:r.toString(),height:o.toString(),top:h,left:l},E=Y().toLowerCase();n&&(m=qs(E)?El:n),zs(E)&&(t=t||Tl,I.scrollbars="yes");const A=Object.entries(I).reduce((S,[x,P])=>`${S}${x}=${P},`,"");if(hc(E)&&m!=="_self")return Al(t||"",m),new is(null);const C=window.open(t||"",m,A);b(C,i,"popup-blocked");try{C.focus()}catch{}return new is(C)}function Al(i,t){const n=document.createElement("a");n.href=i,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl="__/auth/handler",Cl="emulator/auth/handler",Pl=encodeURIComponent("fac");async function rs(i,t,n,r,o,h){b(i.config.authDomain,i,"auth-domain-config-required"),b(i.config.apiKey,i,"invalid-api-key");const l={apiKey:i.config.apiKey,appName:i.name,authType:n,redirectUrl:r,v:he,eventId:o};if(t instanceof Pi){t.setDefaultLanguage(i.languageCode),l.providerId=t.providerId||"",ka(t.getCustomParameters())||(l.customParameters=JSON.stringify(t.getCustomParameters()));for(const[A,C]of Object.entries({}))l[A]=C}if(t instanceof je){const A=t.getScopes().filter(C=>C!=="");A.length>0&&(l.scopes=A.join(","))}i.tenantId&&(l.tid=i.tenantId);const m=l;for(const A of Object.keys(m))m[A]===void 0&&delete m[A];const I=await i._getAppCheckToken(),E=I?`#${Pl}=${encodeURIComponent(I)}`:"";return`${Rl(i)}?${xe(m).slice(1)}${E}`}function Rl({config:i}){return i.emulator?Ti(i,Cl):`https://${i.authDomain}/${bl}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const si="webStorageSupport";class kl{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=oo,this._completeRedirectFn=po,this._overrideRedirectResult=Qc}async _openPopup(t,n,r,o){var l;wt((l=this.eventManagers[t._key()])==null?void 0:l.manager,"_initialize() not called before _openPopup()");const h=await rs(t,n,r,fi(),o);return Sl(t,h,Ri())}async _openRedirect(t,n,r,o){await this._originValidation(t);const h=await rs(t,n,r,fi(),o);return Mc(h),new Promise(()=>{})}_initialize(t){const n=t._key();if(this.eventManagers[n]){const{manager:o,promise:h}=this.eventManagers[n];return o?Promise.resolve(o):(wt(h,"If manager is not set, promise should be"),h)}const r=this.initAndGetManager(t);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(t){const n=await yl(t),r=new nl(t);return n.register("authEvent",o=>(b(o==null?void 0:o.authEvent,t,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:r},this.iframes[t._key()]=n,r}_isIframeWebStorageSupported(t,n){this.iframes[t._key()].send(si,{type:si},o=>{var l;const h=(l=o==null?void 0:o[0])==null?void 0:l[si];h!==void 0&&n(!!h),dt(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const n=t._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=al(t)),this.originValidationPromises[n]}get _shouldInitProactively(){return Qs()||Gs()||bi()}}const Nl=kl;var ss="@firebase/auth",os="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)==null?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const n=this.auth.onIdTokenChanged(r=>{t((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,n),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const n=this.internalListeners.get(t);n&&(this.internalListeners.delete(t),n(),this.updateProactiveRefresh())}assertAuthConfigured(){b(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dl(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Ll(i){se(new qt("auth",(t,{options:n})=>{const r=t.getProvider("app").getImmediate(),o=t.getProvider("heartbeat"),h=t.getProvider("app-check-internal"),{apiKey:l,authDomain:m}=r.options;b(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const I={apiKey:l,authDomain:m,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Zs(i)},E=new pc(r,o,h,I);return wc(E,n),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,n,r)=>{t.getProvider("auth-internal").initialize()})),se(new qt("auth-internal",t=>{const n=Fe(t.getProvider("auth").getImmediate());return(r=>new Ol(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Dt(ss,os,Dl(i)),Dt(ss,os,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml=5*60,Ul=ks("authIdTokenMaxAge")||Ml;let as=null;const xl=i=>async t=>{const n=t&&await t.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Ul)return;const o=n==null?void 0:n.token;as!==o&&(as=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function Eu(i=Ms()){const t=wi(i,"auth");if(t.isInitialized())return t.getImmediate();const n=vc(i,{popupRedirectResolver:Nl,persistence:[Wc,Oc,oo]}),r=ks("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const h=new URL(r,location.origin);if(location.origin===h.origin){const l=xl(h.toString());Rc(n,l,()=>l(n.currentUser)),Pc(n,m=>l(m))}}const o=Ps("auth");return o&&Ic(n,`http://${o}`),n}function Vl(){var i;return((i=document.getElementsByTagName("head"))==null?void 0:i[0])??document}gc({loadJS(i){return new Promise((t,n)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=t,r.onerror=o=>{const h=st("internal-error");h.customData=o,n(h)},r.type="text/javascript",r.charset="UTF-8",Vl().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Ll("Browser");var Fl="firebase",jl="12.1.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Dt(Fl,jl,"app");var hs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ni;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(_,u){function f(){}f.prototype=u.prototype,_.D=u.prototype,_.prototype=new f,_.prototype.constructor=_,_.C=function(p,g,v){for(var d=Array(arguments.length-2),ft=2;ft<arguments.length;ft++)d[ft-2]=arguments[ft];return u.prototype[g].apply(p,d)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(_,u,f){f||(f=0);var p=Array(16);if(typeof u=="string")for(var g=0;16>g;++g)p[g]=u.charCodeAt(f++)|u.charCodeAt(f++)<<8|u.charCodeAt(f++)<<16|u.charCodeAt(f++)<<24;else for(g=0;16>g;++g)p[g]=u[f++]|u[f++]<<8|u[f++]<<16|u[f++]<<24;u=_.g[0],f=_.g[1],g=_.g[2];var v=_.g[3],d=u+(v^f&(g^v))+p[0]+3614090360&4294967295;u=f+(d<<7&4294967295|d>>>25),d=v+(g^u&(f^g))+p[1]+3905402710&4294967295,v=u+(d<<12&4294967295|d>>>20),d=g+(f^v&(u^f))+p[2]+606105819&4294967295,g=v+(d<<17&4294967295|d>>>15),d=f+(u^g&(v^u))+p[3]+3250441966&4294967295,f=g+(d<<22&4294967295|d>>>10),d=u+(v^f&(g^v))+p[4]+4118548399&4294967295,u=f+(d<<7&4294967295|d>>>25),d=v+(g^u&(f^g))+p[5]+1200080426&4294967295,v=u+(d<<12&4294967295|d>>>20),d=g+(f^v&(u^f))+p[6]+2821735955&4294967295,g=v+(d<<17&4294967295|d>>>15),d=f+(u^g&(v^u))+p[7]+4249261313&4294967295,f=g+(d<<22&4294967295|d>>>10),d=u+(v^f&(g^v))+p[8]+1770035416&4294967295,u=f+(d<<7&4294967295|d>>>25),d=v+(g^u&(f^g))+p[9]+2336552879&4294967295,v=u+(d<<12&4294967295|d>>>20),d=g+(f^v&(u^f))+p[10]+4294925233&4294967295,g=v+(d<<17&4294967295|d>>>15),d=f+(u^g&(v^u))+p[11]+2304563134&4294967295,f=g+(d<<22&4294967295|d>>>10),d=u+(v^f&(g^v))+p[12]+1804603682&4294967295,u=f+(d<<7&4294967295|d>>>25),d=v+(g^u&(f^g))+p[13]+4254626195&4294967295,v=u+(d<<12&4294967295|d>>>20),d=g+(f^v&(u^f))+p[14]+2792965006&4294967295,g=v+(d<<17&4294967295|d>>>15),d=f+(u^g&(v^u))+p[15]+1236535329&4294967295,f=g+(d<<22&4294967295|d>>>10),d=u+(g^v&(f^g))+p[1]+4129170786&4294967295,u=f+(d<<5&4294967295|d>>>27),d=v+(f^g&(u^f))+p[6]+3225465664&4294967295,v=u+(d<<9&4294967295|d>>>23),d=g+(u^f&(v^u))+p[11]+643717713&4294967295,g=v+(d<<14&4294967295|d>>>18),d=f+(v^u&(g^v))+p[0]+3921069994&4294967295,f=g+(d<<20&4294967295|d>>>12),d=u+(g^v&(f^g))+p[5]+3593408605&4294967295,u=f+(d<<5&4294967295|d>>>27),d=v+(f^g&(u^f))+p[10]+38016083&4294967295,v=u+(d<<9&4294967295|d>>>23),d=g+(u^f&(v^u))+p[15]+3634488961&4294967295,g=v+(d<<14&4294967295|d>>>18),d=f+(v^u&(g^v))+p[4]+3889429448&4294967295,f=g+(d<<20&4294967295|d>>>12),d=u+(g^v&(f^g))+p[9]+568446438&4294967295,u=f+(d<<5&4294967295|d>>>27),d=v+(f^g&(u^f))+p[14]+3275163606&4294967295,v=u+(d<<9&4294967295|d>>>23),d=g+(u^f&(v^u))+p[3]+4107603335&4294967295,g=v+(d<<14&4294967295|d>>>18),d=f+(v^u&(g^v))+p[8]+1163531501&4294967295,f=g+(d<<20&4294967295|d>>>12),d=u+(g^v&(f^g))+p[13]+2850285829&4294967295,u=f+(d<<5&4294967295|d>>>27),d=v+(f^g&(u^f))+p[2]+4243563512&4294967295,v=u+(d<<9&4294967295|d>>>23),d=g+(u^f&(v^u))+p[7]+1735328473&4294967295,g=v+(d<<14&4294967295|d>>>18),d=f+(v^u&(g^v))+p[12]+2368359562&4294967295,f=g+(d<<20&4294967295|d>>>12),d=u+(f^g^v)+p[5]+4294588738&4294967295,u=f+(d<<4&4294967295|d>>>28),d=v+(u^f^g)+p[8]+2272392833&4294967295,v=u+(d<<11&4294967295|d>>>21),d=g+(v^u^f)+p[11]+1839030562&4294967295,g=v+(d<<16&4294967295|d>>>16),d=f+(g^v^u)+p[14]+4259657740&4294967295,f=g+(d<<23&4294967295|d>>>9),d=u+(f^g^v)+p[1]+2763975236&4294967295,u=f+(d<<4&4294967295|d>>>28),d=v+(u^f^g)+p[4]+1272893353&4294967295,v=u+(d<<11&4294967295|d>>>21),d=g+(v^u^f)+p[7]+4139469664&4294967295,g=v+(d<<16&4294967295|d>>>16),d=f+(g^v^u)+p[10]+3200236656&4294967295,f=g+(d<<23&4294967295|d>>>9),d=u+(f^g^v)+p[13]+681279174&4294967295,u=f+(d<<4&4294967295|d>>>28),d=v+(u^f^g)+p[0]+3936430074&4294967295,v=u+(d<<11&4294967295|d>>>21),d=g+(v^u^f)+p[3]+3572445317&4294967295,g=v+(d<<16&4294967295|d>>>16),d=f+(g^v^u)+p[6]+76029189&4294967295,f=g+(d<<23&4294967295|d>>>9),d=u+(f^g^v)+p[9]+3654602809&4294967295,u=f+(d<<4&4294967295|d>>>28),d=v+(u^f^g)+p[12]+3873151461&4294967295,v=u+(d<<11&4294967295|d>>>21),d=g+(v^u^f)+p[15]+530742520&4294967295,g=v+(d<<16&4294967295|d>>>16),d=f+(g^v^u)+p[2]+3299628645&4294967295,f=g+(d<<23&4294967295|d>>>9),d=u+(g^(f|~v))+p[0]+4096336452&4294967295,u=f+(d<<6&4294967295|d>>>26),d=v+(f^(u|~g))+p[7]+1126891415&4294967295,v=u+(d<<10&4294967295|d>>>22),d=g+(u^(v|~f))+p[14]+2878612391&4294967295,g=v+(d<<15&4294967295|d>>>17),d=f+(v^(g|~u))+p[5]+4237533241&4294967295,f=g+(d<<21&4294967295|d>>>11),d=u+(g^(f|~v))+p[12]+1700485571&4294967295,u=f+(d<<6&4294967295|d>>>26),d=v+(f^(u|~g))+p[3]+2399980690&4294967295,v=u+(d<<10&4294967295|d>>>22),d=g+(u^(v|~f))+p[10]+4293915773&4294967295,g=v+(d<<15&4294967295|d>>>17),d=f+(v^(g|~u))+p[1]+2240044497&4294967295,f=g+(d<<21&4294967295|d>>>11),d=u+(g^(f|~v))+p[8]+1873313359&4294967295,u=f+(d<<6&4294967295|d>>>26),d=v+(f^(u|~g))+p[15]+4264355552&4294967295,v=u+(d<<10&4294967295|d>>>22),d=g+(u^(v|~f))+p[6]+2734768916&4294967295,g=v+(d<<15&4294967295|d>>>17),d=f+(v^(g|~u))+p[13]+1309151649&4294967295,f=g+(d<<21&4294967295|d>>>11),d=u+(g^(f|~v))+p[4]+4149444226&4294967295,u=f+(d<<6&4294967295|d>>>26),d=v+(f^(u|~g))+p[11]+3174756917&4294967295,v=u+(d<<10&4294967295|d>>>22),d=g+(u^(v|~f))+p[2]+718787259&4294967295,g=v+(d<<15&4294967295|d>>>17),d=f+(v^(g|~u))+p[9]+3951481745&4294967295,_.g[0]=_.g[0]+u&4294967295,_.g[1]=_.g[1]+(g+(d<<21&4294967295|d>>>11))&4294967295,_.g[2]=_.g[2]+g&4294967295,_.g[3]=_.g[3]+v&4294967295}r.prototype.u=function(_,u){u===void 0&&(u=_.length);for(var f=u-this.blockSize,p=this.B,g=this.h,v=0;v<u;){if(g==0)for(;v<=f;)o(this,_,v),v+=this.blockSize;if(typeof _=="string"){for(;v<u;)if(p[g++]=_.charCodeAt(v++),g==this.blockSize){o(this,p),g=0;break}}else for(;v<u;)if(p[g++]=_[v++],g==this.blockSize){o(this,p),g=0;break}}this.h=g,this.o+=u},r.prototype.v=function(){var _=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);_[0]=128;for(var u=1;u<_.length-8;++u)_[u]=0;var f=8*this.o;for(u=_.length-8;u<_.length;++u)_[u]=f&255,f/=256;for(this.u(_),_=Array(16),u=f=0;4>u;++u)for(var p=0;32>p;p+=8)_[f++]=this.g[u]>>>p&255;return _};function h(_,u){var f=m;return Object.prototype.hasOwnProperty.call(f,_)?f[_]:f[_]=u(_)}function l(_,u){this.h=u;for(var f=[],p=!0,g=_.length-1;0<=g;g--){var v=_[g]|0;p&&v==u||(f[g]=v,p=!1)}this.g=f}var m={};function I(_){return-128<=_&&128>_?h(_,function(u){return new l([u|0],0>u?-1:0)}):new l([_|0],0>_?-1:0)}function E(_){if(isNaN(_)||!isFinite(_))return C;if(0>_)return M(E(-_));for(var u=[],f=1,p=0;_>=f;p++)u[p]=_/f|0,f*=4294967296;return new l(u,0)}function A(_,u){if(_.length==0)throw Error("number format error: empty string");if(u=u||10,2>u||36<u)throw Error("radix out of range: "+u);if(_.charAt(0)=="-")return M(A(_.substring(1),u));if(0<=_.indexOf("-"))throw Error('number format error: interior "-" character');for(var f=E(Math.pow(u,8)),p=C,g=0;g<_.length;g+=8){var v=Math.min(8,_.length-g),d=parseInt(_.substring(g,g+v),u);8>v?(v=E(Math.pow(u,v)),p=p.j(v).add(E(d))):(p=p.j(f),p=p.add(E(d)))}return p}var C=I(0),S=I(1),x=I(16777216);i=l.prototype,i.m=function(){if(V(this))return-M(this).m();for(var _=0,u=1,f=0;f<this.g.length;f++){var p=this.i(f);_+=(0<=p?p:4294967296+p)*u,u*=4294967296}return _},i.toString=function(_){if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(P(this))return"0";if(V(this))return"-"+M(this).toString(_);for(var u=E(Math.pow(_,6)),f=this,p="";;){var g=ot(f,u).g;f=Q(f,g.j(u));var v=((0<f.g.length?f.g[0]:f.h)>>>0).toString(_);if(f=g,P(f))return v+p;for(;6>v.length;)v="0"+v;p=v+p}},i.i=function(_){return 0>_?0:_<this.g.length?this.g[_]:this.h};function P(_){if(_.h!=0)return!1;for(var u=0;u<_.g.length;u++)if(_.g[u]!=0)return!1;return!0}function V(_){return _.h==-1}i.l=function(_){return _=Q(this,_),V(_)?-1:P(_)?0:1};function M(_){for(var u=_.g.length,f=[],p=0;p<u;p++)f[p]=~_.g[p];return new l(f,~_.h).add(S)}i.abs=function(){return V(this)?M(this):this},i.add=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],p=0,g=0;g<=u;g++){var v=p+(this.i(g)&65535)+(_.i(g)&65535),d=(v>>>16)+(this.i(g)>>>16)+(_.i(g)>>>16);p=d>>>16,v&=65535,d&=65535,f[g]=d<<16|v}return new l(f,f[f.length-1]&-2147483648?-1:0)};function Q(_,u){return _.add(M(u))}i.j=function(_){if(P(this)||P(_))return C;if(V(this))return V(_)?M(this).j(M(_)):M(M(this).j(_));if(V(_))return M(this.j(M(_)));if(0>this.l(x)&&0>_.l(x))return E(this.m()*_.m());for(var u=this.g.length+_.g.length,f=[],p=0;p<2*u;p++)f[p]=0;for(p=0;p<this.g.length;p++)for(var g=0;g<_.g.length;g++){var v=this.i(p)>>>16,d=this.i(p)&65535,ft=_.i(g)>>>16,le=_.i(g)&65535;f[2*p+2*g]+=d*le,B(f,2*p+2*g),f[2*p+2*g+1]+=v*le,B(f,2*p+2*g+1),f[2*p+2*g+1]+=d*ft,B(f,2*p+2*g+1),f[2*p+2*g+2]+=v*ft,B(f,2*p+2*g+2)}for(p=0;p<u;p++)f[p]=f[2*p+1]<<16|f[2*p];for(p=u;p<2*u;p++)f[p]=0;return new l(f,0)};function B(_,u){for(;(_[u]&65535)!=_[u];)_[u+1]+=_[u]>>>16,_[u]&=65535,u++}function $(_,u){this.g=_,this.h=u}function ot(_,u){if(P(u))throw Error("division by zero");if(P(_))return new $(C,C);if(V(_))return u=ot(M(_),u),new $(M(u.g),M(u.h));if(V(u))return u=ot(_,M(u)),new $(M(u.g),u.h);if(30<_.g.length){if(V(_)||V(u))throw Error("slowDivide_ only works with positive integers.");for(var f=S,p=u;0>=p.l(_);)f=We(f),p=We(p);var g=at(f,1),v=at(p,1);for(p=at(p,2),f=at(f,2);!P(p);){var d=v.add(p);0>=d.l(_)&&(g=g.add(f),v=d),p=at(p,1),f=at(f,1)}return u=Q(_,g.j(u)),new $(g,u)}for(g=C;0<=_.l(u);){for(f=Math.max(1,Math.floor(_.m()/u.m())),p=Math.ceil(Math.log(f)/Math.LN2),p=48>=p?1:Math.pow(2,p-48),v=E(f),d=v.j(u);V(d)||0<d.l(_);)f-=p,v=E(f),d=v.j(u);P(v)&&(v=S),g=g.add(v),_=Q(_,d)}return new $(g,_)}i.A=function(_){return ot(this,_).h},i.and=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],p=0;p<u;p++)f[p]=this.i(p)&_.i(p);return new l(f,this.h&_.h)},i.or=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],p=0;p<u;p++)f[p]=this.i(p)|_.i(p);return new l(f,this.h|_.h)},i.xor=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],p=0;p<u;p++)f[p]=this.i(p)^_.i(p);return new l(f,this.h^_.h)};function We(_){for(var u=_.g.length+1,f=[],p=0;p<u;p++)f[p]=_.i(p)<<1|_.i(p-1)>>>31;return new l(f,_.h)}function at(_,u){var f=u>>5;u%=32;for(var p=_.g.length-f,g=[],v=0;v<p;v++)g[v]=0<u?_.i(v+f)>>>u|_.i(v+f+1)<<32-u:_.i(v+f);return new l(g,_.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=E,l.fromString=A,Ni=l}).apply(typeof hs<"u"?hs:typeof self<"u"?self:typeof window<"u"?window:{});var cn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(e,s,a){return e==Array.prototype||e==Object.prototype||(e[s]=a.value),e};function n(e){e=[typeof globalThis=="object"&&globalThis,e,typeof window=="object"&&window,typeof self=="object"&&self,typeof cn=="object"&&cn];for(var s=0;s<e.length;++s){var a=e[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=n(this);function o(e,s){if(s)t:{var a=r;e=e.split(".");for(var c=0;c<e.length-1;c++){var y=e[c];if(!(y in a))break t;a=a[y]}e=e[e.length-1],c=a[e],s=s(c),s!=c&&s!=null&&t(a,e,{configurable:!0,writable:!0,value:s})}}function h(e,s){e instanceof String&&(e+="");var a=0,c=!1,y={next:function(){if(!c&&a<e.length){var w=a++;return{value:s(w,e[w]),done:!1}}return c=!0,{done:!0,value:void 0}}};return y[Symbol.iterator]=function(){return y},y}o("Array.prototype.values",function(e){return e||function(){return h(this,function(s,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},m=this||self;function I(e){var s=typeof e;return s=s!="object"?s:e?Array.isArray(e)?"array":s:"null",s=="array"||s=="object"&&typeof e.length=="number"}function E(e){var s=typeof e;return s=="object"&&e!=null||s=="function"}function A(e,s,a){return e.call.apply(e.bind,arguments)}function C(e,s,a){if(!e)throw Error();if(2<arguments.length){var c=Array.prototype.slice.call(arguments,2);return function(){var y=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(y,c),e.apply(s,y)}}return function(){return e.apply(s,arguments)}}function S(e,s,a){return S=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?A:C,S.apply(null,arguments)}function x(e,s){var a=Array.prototype.slice.call(arguments,1);return function(){var c=a.slice();return c.push.apply(c,arguments),e.apply(this,c)}}function P(e,s){function a(){}a.prototype=s.prototype,e.aa=s.prototype,e.prototype=new a,e.prototype.constructor=e,e.Qb=function(c,y,w){for(var T=Array(arguments.length-2),L=2;L<arguments.length;L++)T[L-2]=arguments[L];return s.prototype[y].apply(c,T)}}function V(e){const s=e.length;if(0<s){const a=Array(s);for(let c=0;c<s;c++)a[c]=e[c];return a}return[]}function M(e,s){for(let a=1;a<arguments.length;a++){const c=arguments[a];if(I(c)){const y=e.length||0,w=c.length||0;e.length=y+w;for(let T=0;T<w;T++)e[y+T]=c[T]}else e.push(c)}}class Q{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return 0<this.h?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function B(e){return/^[\s\xa0]*$/.test(e)}function $(){var e=m.navigator;return e&&(e=e.userAgent)?e:""}function ot(e){return ot[" "](e),e}ot[" "]=function(){};var We=$().indexOf("Gecko")!=-1&&!($().toLowerCase().indexOf("webkit")!=-1&&$().indexOf("Edge")==-1)&&!($().indexOf("Trident")!=-1||$().indexOf("MSIE")!=-1)&&$().indexOf("Edge")==-1;function at(e,s,a){for(const c in e)s.call(a,e[c],c,e)}function _(e,s){for(const a in e)s.call(void 0,e[a],a,e)}function u(e){const s={};for(const a in e)s[a]=e[a];return s}const f="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function p(e,s){let a,c;for(let y=1;y<arguments.length;y++){c=arguments[y];for(a in c)e[a]=c[a];for(let w=0;w<f.length;w++)a=f[w],Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a])}}function g(e){var s=1;e=e.split(":");const a=[];for(;0<s&&e.length;)a.push(e.shift()),s--;return e.length&&a.push(e.join(":")),a}function v(e){m.setTimeout(()=>{throw e},0)}function d(){var e=Cn;let s=null;return e.g&&(s=e.g,e.g=e.g.next,e.g||(e.h=null),s.next=null),s}class ft{constructor(){this.h=this.g=null}add(s,a){const c=le.get();c.set(s,a),this.h?this.h.next=c:this.g=c,this.h=c}}var le=new Q(()=>new So,e=>e.reset());class So{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let ue,de=!1,Cn=new ft,Ui=()=>{const e=m.Promise.resolve(void 0);ue=()=>{e.then(Ao)}};var Ao=()=>{for(var e;e=d();){try{e.h.call(e.g)}catch(a){v(a)}var s=le;s.j(e),100>s.h&&(s.h++,e.next=s.g,s.g=e)}de=!1};function Et(){this.s=this.s,this.C=this.C}Et.prototype.s=!1,Et.prototype.ma=function(){this.s||(this.s=!0,this.N())},Et.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function W(e,s){this.type=e,this.g=this.target=s,this.defaultPrevented=!1}W.prototype.h=function(){this.defaultPrevented=!0};var bo=function(){if(!m.addEventListener||!Object.defineProperty)return!1;var e=!1,s=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const a=()=>{};m.addEventListener("test",a,s),m.removeEventListener("test",a,s)}catch{}return e}();function fe(e,s){if(W.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var a=this.type=e.type,c=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=s,s=e.relatedTarget){if(We){t:{try{ot(s.nodeName);var y=!0;break t}catch{}y=!1}y||(s=null)}}else a=="mouseover"?s=e.fromElement:a=="mouseout"&&(s=e.toElement);this.relatedTarget=s,c?(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0):(this.clientX=e.clientX!==void 0?e.clientX:e.pageX,this.clientY=e.clientY!==void 0?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType=typeof e.pointerType=="string"?e.pointerType:Co[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&fe.aa.h.call(this)}}P(fe,W);var Co={2:"touch",3:"pen",4:"mouse"};fe.prototype.h=function(){fe.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var ze="closure_listenable_"+(1e6*Math.random()|0),Po=0;function Ro(e,s,a,c,y){this.listener=e,this.proxy=null,this.src=s,this.type=a,this.capture=!!c,this.ha=y,this.key=++Po,this.da=this.fa=!1}function Ge(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function qe(e){this.src=e,this.g={},this.h=0}qe.prototype.add=function(e,s,a,c,y){var w=e.toString();e=this.g[w],e||(e=this.g[w]=[],this.h++);var T=Rn(e,s,c,y);return-1<T?(s=e[T],a||(s.fa=!1)):(s=new Ro(s,this.src,w,!!c,y),s.fa=a,e.push(s)),s};function Pn(e,s){var a=s.type;if(a in e.g){var c=e.g[a],y=Array.prototype.indexOf.call(c,s,void 0),w;(w=0<=y)&&Array.prototype.splice.call(c,y,1),w&&(Ge(s),e.g[a].length==0&&(delete e.g[a],e.h--))}}function Rn(e,s,a,c){for(var y=0;y<e.length;++y){var w=e[y];if(!w.da&&w.listener==s&&w.capture==!!a&&w.ha==c)return y}return-1}var kn="closure_lm_"+(1e6*Math.random()|0),Nn={};function xi(e,s,a,c,y){if(Array.isArray(s)){for(var w=0;w<s.length;w++)xi(e,s[w],a,c,y);return null}return a=ji(a),e&&e[ze]?e.K(s,a,E(c)?!!c.capture:!1,y):ko(e,s,a,!1,c,y)}function ko(e,s,a,c,y,w){if(!s)throw Error("Invalid event type");var T=E(y)?!!y.capture:!!y,L=Dn(e);if(L||(e[kn]=L=new qe(e)),a=L.add(s,a,c,T,w),a.proxy)return a;if(c=No(),a.proxy=c,c.src=e,c.listener=a,e.addEventListener)bo||(y=T),y===void 0&&(y=!1),e.addEventListener(s.toString(),c,y);else if(e.attachEvent)e.attachEvent(Fi(s.toString()),c);else if(e.addListener&&e.removeListener)e.addListener(c);else throw Error("addEventListener and attachEvent are unavailable.");return a}function No(){function e(a){return s.call(e.src,e.listener,a)}const s=Oo;return e}function Vi(e,s,a,c,y){if(Array.isArray(s))for(var w=0;w<s.length;w++)Vi(e,s[w],a,c,y);else c=E(c)?!!c.capture:!!c,a=ji(a),e&&e[ze]?(e=e.i,s=String(s).toString(),s in e.g&&(w=e.g[s],a=Rn(w,a,c,y),-1<a&&(Ge(w[a]),Array.prototype.splice.call(w,a,1),w.length==0&&(delete e.g[s],e.h--)))):e&&(e=Dn(e))&&(s=e.g[s.toString()],e=-1,s&&(e=Rn(s,a,c,y)),(a=-1<e?s[e]:null)&&On(a))}function On(e){if(typeof e!="number"&&e&&!e.da){var s=e.src;if(s&&s[ze])Pn(s.i,e);else{var a=e.type,c=e.proxy;s.removeEventListener?s.removeEventListener(a,c,e.capture):s.detachEvent?s.detachEvent(Fi(a),c):s.addListener&&s.removeListener&&s.removeListener(c),(a=Dn(s))?(Pn(a,e),a.h==0&&(a.src=null,s[kn]=null)):Ge(e)}}}function Fi(e){return e in Nn?Nn[e]:Nn[e]="on"+e}function Oo(e,s){if(e.da)e=!0;else{s=new fe(s,this);var a=e.listener,c=e.ha||e.src;e.fa&&On(e),e=a.call(c,s)}return e}function Dn(e){return e=e[kn],e instanceof qe?e:null}var Ln="__closure_events_fn_"+(1e9*Math.random()>>>0);function ji(e){return typeof e=="function"?e:(e[Ln]||(e[Ln]=function(s){return e.handleEvent(s)}),e[Ln])}function z(){Et.call(this),this.i=new qe(this),this.M=this,this.F=null}P(z,Et),z.prototype[ze]=!0,z.prototype.removeEventListener=function(e,s,a,c){Vi(this,e,s,a,c)};function K(e,s){var a,c=e.F;if(c)for(a=[];c;c=c.F)a.push(c);if(e=e.M,c=s.type||s,typeof s=="string")s=new W(s,e);else if(s instanceof W)s.target=s.target||e;else{var y=s;s=new W(c,e),p(s,y)}if(y=!0,a)for(var w=a.length-1;0<=w;w--){var T=s.g=a[w];y=Ke(T,c,!0,s)&&y}if(T=s.g=e,y=Ke(T,c,!0,s)&&y,y=Ke(T,c,!1,s)&&y,a)for(w=0;w<a.length;w++)T=s.g=a[w],y=Ke(T,c,!1,s)&&y}z.prototype.N=function(){if(z.aa.N.call(this),this.i){var e=this.i,s;for(s in e.g){for(var a=e.g[s],c=0;c<a.length;c++)Ge(a[c]);delete e.g[s],e.h--}}this.F=null},z.prototype.K=function(e,s,a,c){return this.i.add(String(e),s,!1,a,c)},z.prototype.L=function(e,s,a,c){return this.i.add(String(e),s,!0,a,c)};function Ke(e,s,a,c){if(s=e.i.g[String(s)],!s)return!0;s=s.concat();for(var y=!0,w=0;w<s.length;++w){var T=s[w];if(T&&!T.da&&T.capture==a){var L=T.listener,H=T.ha||T.src;T.fa&&Pn(e.i,T),y=L.call(H,c)!==!1&&y}}return y&&!c.defaultPrevented}function Bi(e,s,a){if(typeof e=="function")a&&(e=S(e,a));else if(e&&typeof e.handleEvent=="function")e=S(e.handleEvent,e);else throw Error("Invalid listener argument");return 2147483647<Number(s)?-1:m.setTimeout(e,s||0)}function Hi(e){e.g=Bi(()=>{e.g=null,e.i&&(e.i=!1,Hi(e))},e.l);const s=e.h;e.h=null,e.m.apply(null,s)}class Do extends Et{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:Hi(this)}N(){super.N(),this.g&&(m.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function pe(e){Et.call(this),this.h=e,this.g={}}P(pe,Et);var $i=[];function Wi(e){at(e.g,function(s,a){this.g.hasOwnProperty(a)&&On(s)},e),e.g={}}pe.prototype.N=function(){pe.aa.N.call(this),Wi(this)},pe.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Mn=m.JSON.stringify,Lo=m.JSON.parse,Mo=class{stringify(e){return m.JSON.stringify(e,void 0)}parse(e){return m.JSON.parse(e,void 0)}};function Un(){}Un.prototype.h=null;function zi(e){return e.h||(e.h=e.i())}function Uo(){}var ge={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function xn(){W.call(this,"d")}P(xn,W);function Vn(){W.call(this,"c")}P(Vn,W);var Xt={},Gi=null;function Fn(){return Gi=Gi||new z}Xt.La="serverreachability";function qi(e){W.call(this,Xt.La,e)}P(qi,W);function me(e){const s=Fn();K(s,new qi(s))}Xt.STAT_EVENT="statevent";function Ki(e,s){W.call(this,Xt.STAT_EVENT,e),this.stat=s}P(Ki,W);function J(e){const s=Fn();K(s,new Ki(s,e))}Xt.Ma="timingevent";function Ji(e,s){W.call(this,Xt.Ma,e),this.size=s}P(Ji,W);function _e(e,s){if(typeof e!="function")throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){e()},s)}function ye(){this.g=!0}ye.prototype.xa=function(){this.g=!1};function xo(e,s,a,c,y,w){e.info(function(){if(e.g)if(w)for(var T="",L=w.split("&"),H=0;H<L.length;H++){var O=L[H].split("=");if(1<O.length){var G=O[0];O=O[1];var q=G.split("_");T=2<=q.length&&q[1]=="type"?T+(G+"="+O+"&"):T+(G+"=redacted&")}}else T=null;else T=w;return"XMLHTTP REQ ("+c+") [attempt "+y+"]: "+s+`
`+a+`
`+T})}function Vo(e,s,a,c,y,w,T){e.info(function(){return"XMLHTTP RESP ("+c+") [ attempt "+y+"]: "+s+`
`+a+`
`+w+" "+T})}function Yt(e,s,a,c){e.info(function(){return"XMLHTTP TEXT ("+s+"): "+jo(e,a)+(c?" "+c:"")})}function Fo(e,s){e.info(function(){return"TIMEOUT: "+s})}ye.prototype.info=function(){};function jo(e,s){if(!e.g)return s;if(!s)return null;try{var a=JSON.parse(s);if(a){for(e=0;e<a.length;e++)if(Array.isArray(a[e])){var c=a[e];if(!(2>c.length)){var y=c[1];if(Array.isArray(y)&&!(1>y.length)){var w=y[0];if(w!="noop"&&w!="stop"&&w!="close")for(var T=1;T<y.length;T++)y[T]=""}}}}return Mn(a)}catch{return s}}var jn={NO_ERROR:0,TIMEOUT:8},Bo={},Bn;function Je(){}P(Je,Un),Je.prototype.g=function(){return new XMLHttpRequest},Je.prototype.i=function(){return{}},Bn=new Je;function Tt(e,s,a,c){this.j=e,this.i=s,this.l=a,this.R=c||1,this.U=new pe(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Xi}function Xi(){this.i=null,this.g="",this.h=!1}var Yi={},Hn={};function $n(e,s,a){e.L=1,e.v=Ze(pt(s)),e.m=a,e.P=!0,Qi(e,null)}function Qi(e,s){e.F=Date.now(),Xe(e),e.A=pt(e.v);var a=e.A,c=e.R;Array.isArray(c)||(c=[String(c)]),dr(a.i,"t",c),e.C=0,a=e.j.J,e.h=new Xi,e.g=kr(e.j,a?s:null,!e.m),0<e.O&&(e.M=new Do(S(e.Y,e,e.g),e.O)),s=e.U,a=e.g,c=e.ca;var y="readystatechange";Array.isArray(y)||(y&&($i[0]=y.toString()),y=$i);for(var w=0;w<y.length;w++){var T=xi(a,y[w],c||s.handleEvent,!1,s.h||s);if(!T)break;s.g[T.key]=T}s=e.H?u(e.H):{},e.m?(e.u||(e.u="POST"),s["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,s)):(e.u="GET",e.g.ea(e.A,e.u,null,s)),me(),xo(e.i,e.u,e.A,e.l,e.R,e.m)}Tt.prototype.ca=function(e){e=e.target;const s=this.M;s&&gt(e)==3?s.j():this.Y(e)},Tt.prototype.Y=function(e){try{if(e==this.g)t:{const q=gt(this.g);var s=this.g.Ba();const te=this.g.Z();if(!(3>q)&&(q!=3||this.g&&(this.h.h||this.g.oa()||vr(this.g)))){this.J||q!=4||s==7||(s==8||0>=te?me(3):me(2)),Wn(this);var a=this.g.Z();this.X=a;e:if(Zi(this)){var c=vr(this.g);e="";var y=c.length,w=gt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ut(this),ve(this);var T="";break e}this.h.i=new m.TextDecoder}for(s=0;s<y;s++)this.h.h=!0,e+=this.h.i.decode(c[s],{stream:!(w&&s==y-1)});c.length=0,this.h.g+=e,this.C=0,T=this.h.g}else T=this.g.oa();if(this.o=a==200,Vo(this.i,this.u,this.A,this.l,this.R,q,a),this.o){if(this.T&&!this.K){e:{if(this.g){var L,H=this.g;if((L=H.g?H.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!B(L)){var O=L;break e}}O=null}if(a=O)Yt(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,zn(this,a);else{this.o=!1,this.s=3,J(12),Ut(this),ve(this);break t}}if(this.P){a=!0;let tt;for(;!this.J&&this.C<T.length;)if(tt=Ho(this,T),tt==Hn){q==4&&(this.s=4,J(14),a=!1),Yt(this.i,this.l,null,"[Incomplete Response]");break}else if(tt==Yi){this.s=4,J(15),Yt(this.i,this.l,T,"[Invalid Chunk]"),a=!1;break}else Yt(this.i,this.l,tt,null),zn(this,tt);if(Zi(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),q!=4||T.length!=0||this.h.h||(this.s=1,J(16),a=!1),this.o=this.o&&a,!a)Yt(this.i,this.l,T,"[Invalid Chunked Response]"),Ut(this),ve(this);else if(0<T.length&&!this.W){this.W=!0;var G=this.j;G.g==this&&G.ba&&!G.M&&(G.j.info("Great, no buffering proxy detected. Bytes received: "+T.length),Yn(G),G.M=!0,J(11))}}else Yt(this.i,this.l,T,null),zn(this,T);q==4&&Ut(this),this.o&&!this.J&&(q==4?br(this.j,this):(this.o=!1,Xe(this)))}else sa(this.g),a==400&&0<T.indexOf("Unknown SID")?(this.s=3,J(12)):(this.s=0,J(13)),Ut(this),ve(this)}}}catch{}finally{}};function Zi(e){return e.g?e.u=="GET"&&e.L!=2&&e.j.Ca:!1}function Ho(e,s){var a=e.C,c=s.indexOf(`
`,a);return c==-1?Hn:(a=Number(s.substring(a,c)),isNaN(a)?Yi:(c+=1,c+a>s.length?Hn:(s=s.slice(c,c+a),e.C=c+a,s)))}Tt.prototype.cancel=function(){this.J=!0,Ut(this)};function Xe(e){e.S=Date.now()+e.I,tr(e,e.I)}function tr(e,s){if(e.B!=null)throw Error("WatchDog timer not null");e.B=_e(S(e.ba,e),s)}function Wn(e){e.B&&(m.clearTimeout(e.B),e.B=null)}Tt.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(Fo(this.i,this.A),this.L!=2&&(me(),J(17)),Ut(this),this.s=2,ve(this)):tr(this,this.S-e)};function ve(e){e.j.G==0||e.J||br(e.j,e)}function Ut(e){Wn(e);var s=e.M;s&&typeof s.ma=="function"&&s.ma(),e.M=null,Wi(e.U),e.g&&(s=e.g,e.g=null,s.abort(),s.ma())}function zn(e,s){try{var a=e.j;if(a.G!=0&&(a.g==e||Gn(a.h,e))){if(!e.K&&Gn(a.h,e)&&a.G==3){try{var c=a.Da.g.parse(s)}catch{c=null}if(Array.isArray(c)&&c.length==3){var y=c;if(y[0]==0){t:if(!a.u){if(a.g)if(a.g.F+3e3<e.F)on(a),rn(a);else break t;Xn(a),J(18)}}else a.za=y[1],0<a.za-a.T&&37500>y[2]&&a.F&&a.v==0&&!a.C&&(a.C=_e(S(a.Za,a),6e3));if(1>=ir(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else Vt(a,11)}else if((e.K||a.g==e)&&on(a),!B(s))for(y=a.Da.g.parse(s),s=0;s<y.length;s++){let O=y[s];if(a.T=O[0],O=O[1],a.G==2)if(O[0]=="c"){a.K=O[1],a.ia=O[2];const G=O[3];G!=null&&(a.la=G,a.j.info("VER="+a.la));const q=O[4];q!=null&&(a.Aa=q,a.j.info("SVER="+a.Aa));const te=O[5];te!=null&&typeof te=="number"&&0<te&&(c=1.5*te,a.L=c,a.j.info("backChannelRequestTimeoutMs_="+c)),c=a;const tt=e.g;if(tt){const an=tt.g?tt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(an){var w=c.h;w.g||an.indexOf("spdy")==-1&&an.indexOf("quic")==-1&&an.indexOf("h2")==-1||(w.j=w.l,w.g=new Set,w.h&&(qn(w,w.h),w.h=null))}if(c.D){const Qn=tt.g?tt.g.getResponseHeader("X-HTTP-Session-Id"):null;Qn&&(c.ya=Qn,U(c.I,c.D,Qn))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-e.F,a.j.info("Handshake RTT: "+a.R+"ms")),c=a;var T=e;if(c.qa=Rr(c,c.J?c.ia:null,c.W),T.K){rr(c.h,T);var L=T,H=c.L;H&&(L.I=H),L.B&&(Wn(L),Xe(L)),c.g=T}else Sr(c);0<a.i.length&&sn(a)}else O[0]!="stop"&&O[0]!="close"||Vt(a,7);else a.G==3&&(O[0]=="stop"||O[0]=="close"?O[0]=="stop"?Vt(a,7):Jn(a):O[0]!="noop"&&a.l&&a.l.ta(O),a.v=0)}}me(4)}catch{}}var $o=class{constructor(e,s){this.g=e,this.map=s}};function er(e){this.l=e||10,m.PerformanceNavigationTiming?(e=m.performance.getEntriesByType("navigation"),e=0<e.length&&(e[0].nextHopProtocol=="hq"||e[0].nextHopProtocol=="h2")):e=!!(m.chrome&&m.chrome.loadTimes&&m.chrome.loadTimes()&&m.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function nr(e){return e.h?!0:e.g?e.g.size>=e.j:!1}function ir(e){return e.h?1:e.g?e.g.size:0}function Gn(e,s){return e.h?e.h==s:e.g?e.g.has(s):!1}function qn(e,s){e.g?e.g.add(s):e.h=s}function rr(e,s){e.h&&e.h==s?e.h=null:e.g&&e.g.has(s)&&e.g.delete(s)}er.prototype.cancel=function(){if(this.i=sr(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const e of this.g.values())e.cancel();this.g.clear()}};function sr(e){if(e.h!=null)return e.i.concat(e.h.D);if(e.g!=null&&e.g.size!==0){let s=e.i;for(const a of e.g.values())s=s.concat(a.D);return s}return V(e.i)}function Wo(e){if(e.V&&typeof e.V=="function")return e.V();if(typeof Map<"u"&&e instanceof Map||typeof Set<"u"&&e instanceof Set)return Array.from(e.values());if(typeof e=="string")return e.split("");if(I(e)){for(var s=[],a=e.length,c=0;c<a;c++)s.push(e[c]);return s}s=[],a=0;for(c in e)s[a++]=e[c];return s}function zo(e){if(e.na&&typeof e.na=="function")return e.na();if(!e.V||typeof e.V!="function"){if(typeof Map<"u"&&e instanceof Map)return Array.from(e.keys());if(!(typeof Set<"u"&&e instanceof Set)){if(I(e)||typeof e=="string"){var s=[];e=e.length;for(var a=0;a<e;a++)s.push(a);return s}s=[],a=0;for(const c in e)s[a++]=c;return s}}}function or(e,s){if(e.forEach&&typeof e.forEach=="function")e.forEach(s,void 0);else if(I(e)||typeof e=="string")Array.prototype.forEach.call(e,s,void 0);else for(var a=zo(e),c=Wo(e),y=c.length,w=0;w<y;w++)s.call(void 0,c[w],a&&a[w],e)}var ar=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Go(e,s){if(e){e=e.split("&");for(var a=0;a<e.length;a++){var c=e[a].indexOf("="),y=null;if(0<=c){var w=e[a].substring(0,c);y=e[a].substring(c+1)}else w=e[a];s(w,y?decodeURIComponent(y.replace(/\+/g," ")):"")}}}function xt(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof xt){this.h=e.h,Ye(this,e.j),this.o=e.o,this.g=e.g,Qe(this,e.s),this.l=e.l;var s=e.i,a=new Ee;a.i=s.i,s.g&&(a.g=new Map(s.g),a.h=s.h),hr(this,a),this.m=e.m}else e&&(s=String(e).match(ar))?(this.h=!1,Ye(this,s[1]||"",!0),this.o=we(s[2]||""),this.g=we(s[3]||"",!0),Qe(this,s[4]),this.l=we(s[5]||"",!0),hr(this,s[6]||"",!0),this.m=we(s[7]||"")):(this.h=!1,this.i=new Ee(null,this.h))}xt.prototype.toString=function(){var e=[],s=this.j;s&&e.push(Ie(s,cr,!0),":");var a=this.g;return(a||s=="file")&&(e.push("//"),(s=this.o)&&e.push(Ie(s,cr,!0),"@"),e.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&e.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&e.push("/"),e.push(Ie(a,a.charAt(0)=="/"?Jo:Ko,!0))),(a=this.i.toString())&&e.push("?",a),(a=this.m)&&e.push("#",Ie(a,Yo)),e.join("")};function pt(e){return new xt(e)}function Ye(e,s,a){e.j=a?we(s,!0):s,e.j&&(e.j=e.j.replace(/:$/,""))}function Qe(e,s){if(s){if(s=Number(s),isNaN(s)||0>s)throw Error("Bad port number "+s);e.s=s}else e.s=null}function hr(e,s,a){s instanceof Ee?(e.i=s,Qo(e.i,e.h)):(a||(s=Ie(s,Xo)),e.i=new Ee(s,e.h))}function U(e,s,a){e.i.set(s,a)}function Ze(e){return U(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function we(e,s){return e?s?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function Ie(e,s,a){return typeof e=="string"?(e=encodeURI(e).replace(s,qo),a&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function qo(e){return e=e.charCodeAt(0),"%"+(e>>4&15).toString(16)+(e&15).toString(16)}var cr=/[#\/\?@]/g,Ko=/[#\?:]/g,Jo=/[#\?]/g,Xo=/[#\?@]/g,Yo=/#/g;function Ee(e,s){this.h=this.g=null,this.i=e||null,this.j=!!s}function St(e){e.g||(e.g=new Map,e.h=0,e.i&&Go(e.i,function(s,a){e.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}i=Ee.prototype,i.add=function(e,s){St(this),this.i=null,e=Qt(this,e);var a=this.g.get(e);return a||this.g.set(e,a=[]),a.push(s),this.h+=1,this};function lr(e,s){St(e),s=Qt(e,s),e.g.has(s)&&(e.i=null,e.h-=e.g.get(s).length,e.g.delete(s))}function ur(e,s){return St(e),s=Qt(e,s),e.g.has(s)}i.forEach=function(e,s){St(this),this.g.forEach(function(a,c){a.forEach(function(y){e.call(s,y,c,this)},this)},this)},i.na=function(){St(this);const e=Array.from(this.g.values()),s=Array.from(this.g.keys()),a=[];for(let c=0;c<s.length;c++){const y=e[c];for(let w=0;w<y.length;w++)a.push(s[c])}return a},i.V=function(e){St(this);let s=[];if(typeof e=="string")ur(this,e)&&(s=s.concat(this.g.get(Qt(this,e))));else{e=Array.from(this.g.values());for(let a=0;a<e.length;a++)s=s.concat(e[a])}return s},i.set=function(e,s){return St(this),this.i=null,e=Qt(this,e),ur(this,e)&&(this.h-=this.g.get(e).length),this.g.set(e,[s]),this.h+=1,this},i.get=function(e,s){return e?(e=this.V(e),0<e.length?String(e[0]):s):s};function dr(e,s,a){lr(e,s),0<a.length&&(e.i=null,e.g.set(Qt(e,s),V(a)),e.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],s=Array.from(this.g.keys());for(var a=0;a<s.length;a++){var c=s[a];const w=encodeURIComponent(String(c)),T=this.V(c);for(c=0;c<T.length;c++){var y=w;T[c]!==""&&(y+="="+encodeURIComponent(String(T[c]))),e.push(y)}}return this.i=e.join("&")};function Qt(e,s){return s=String(s),e.j&&(s=s.toLowerCase()),s}function Qo(e,s){s&&!e.j&&(St(e),e.i=null,e.g.forEach(function(a,c){var y=c.toLowerCase();c!=y&&(lr(this,c),dr(this,y,a))},e)),e.j=s}function Zo(e,s){const a=new ye;if(m.Image){const c=new Image;c.onload=x(At,a,"TestLoadImage: loaded",!0,s,c),c.onerror=x(At,a,"TestLoadImage: error",!1,s,c),c.onabort=x(At,a,"TestLoadImage: abort",!1,s,c),c.ontimeout=x(At,a,"TestLoadImage: timeout",!1,s,c),m.setTimeout(function(){c.ontimeout&&c.ontimeout()},1e4),c.src=e}else s(!1)}function ta(e,s){const a=new ye,c=new AbortController,y=setTimeout(()=>{c.abort(),At(a,"TestPingServer: timeout",!1,s)},1e4);fetch(e,{signal:c.signal}).then(w=>{clearTimeout(y),w.ok?At(a,"TestPingServer: ok",!0,s):At(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(y),At(a,"TestPingServer: error",!1,s)})}function At(e,s,a,c,y){try{y&&(y.onload=null,y.onerror=null,y.onabort=null,y.ontimeout=null),c(a)}catch{}}function ea(){this.g=new Mo}function na(e,s,a){const c=a||"";try{or(e,function(y,w){let T=y;E(y)&&(T=Mn(y)),s.push(c+w+"="+encodeURIComponent(T))})}catch(y){throw s.push(c+"type="+encodeURIComponent("_badmap")),y}}function tn(e){this.l=e.Ub||null,this.j=e.eb||!1}P(tn,Un),tn.prototype.g=function(){return new en(this.l,this.j)},tn.prototype.i=function(e){return function(){return e}}({});function en(e,s){z.call(this),this.D=e,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(en,z),i=en.prototype,i.open=function(e,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=s,this.readyState=1,Se(this)},i.send=function(e){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const s={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(s.body=e),(this.D||m).fetch(new Request(this.A,s)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Te(this)),this.readyState=0},i.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,Se(this)),this.g&&(this.readyState=3,Se(this),this.g)))if(this.responseType==="arraybuffer")e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof m.ReadableStream<"u"&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;fr(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))};function fr(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}i.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var s=e.value?e.value:new Uint8Array(0);(s=this.v.decode(s,{stream:!e.done}))&&(this.response=this.responseText+=s)}e.done?Te(this):Se(this),this.readyState==3&&fr(this)}},i.Ra=function(e){this.g&&(this.response=this.responseText=e,Te(this))},i.Qa=function(e){this.g&&(this.response=e,Te(this))},i.ga=function(){this.g&&Te(this)};function Te(e){e.readyState=4,e.l=null,e.j=null,e.v=null,Se(e)}i.setRequestHeader=function(e,s){this.u.append(e,s)},i.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,e.push(a[0]+": "+a[1]),a=s.next();return e.join(`\r
`)};function Se(e){e.onreadystatechange&&e.onreadystatechange.call(e)}Object.defineProperty(en.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(e){this.m=e?"include":"same-origin"}});function pr(e){let s="";return at(e,function(a,c){s+=c,s+=":",s+=a,s+=`\r
`}),s}function Kn(e,s,a){t:{for(c in a){var c=!1;break t}c=!0}c||(a=pr(a),typeof e=="string"?a!=null&&encodeURIComponent(String(a)):U(e,s,a))}function F(e){z.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(F,z);var ia=/^https?$/i,ra=["POST","PUT"];i=F.prototype,i.Ha=function(e){this.J=e},i.ea=function(e,s,a,c){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);s=s?s.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Bn.g(),this.v=this.o?zi(this.o):zi(Bn),this.g.onreadystatechange=S(this.Ea,this);try{this.B=!0,this.g.open(s,String(e),!0),this.B=!1}catch(w){gr(this,w);return}if(e=a||"",a=new Map(this.headers),c)if(Object.getPrototypeOf(c)===Object.prototype)for(var y in c)a.set(y,c[y]);else if(typeof c.keys=="function"&&typeof c.get=="function")for(const w of c.keys())a.set(w,c.get(w));else throw Error("Unknown input type for opt_headers: "+String(c));c=Array.from(a.keys()).find(w=>w.toLowerCase()=="content-type"),y=m.FormData&&e instanceof m.FormData,!(0<=Array.prototype.indexOf.call(ra,s,void 0))||c||y||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[w,T]of a)this.g.setRequestHeader(w,T);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{yr(this),this.u=!0,this.g.send(e),this.u=!1}catch(w){gr(this,w)}};function gr(e,s){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=s,e.m=5,mr(e),nn(e)}function mr(e){e.A||(e.A=!0,K(e,"complete"),K(e,"error"))}i.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,K(this,"complete"),K(this,"abort"),nn(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),nn(this,!0)),F.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?_r(this):this.bb())},i.bb=function(){_r(this)};function _r(e){if(e.h&&typeof l<"u"&&(!e.v[1]||gt(e)!=4||e.Z()!=2)){if(e.u&&gt(e)==4)Bi(e.Ea,0,e);else if(K(e,"readystatechange"),gt(e)==4){e.h=!1;try{const T=e.Z();t:switch(T){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break t;default:s=!1}var a;if(!(a=s)){var c;if(c=T===0){var y=String(e.D).match(ar)[1]||null;!y&&m.self&&m.self.location&&(y=m.self.location.protocol.slice(0,-1)),c=!ia.test(y?y.toLowerCase():"")}a=c}if(a)K(e,"complete"),K(e,"success");else{e.m=6;try{var w=2<gt(e)?e.g.statusText:""}catch{w=""}e.l=w+" ["+e.Z()+"]",mr(e)}}finally{nn(e)}}}}function nn(e,s){if(e.g){yr(e);const a=e.g,c=e.v[0]?()=>{}:null;e.g=null,e.v=null,s||K(e,"ready");try{a.onreadystatechange=c}catch{}}}function yr(e){e.I&&(m.clearTimeout(e.I),e.I=null)}i.isActive=function(){return!!this.g};function gt(e){return e.g?e.g.readyState:0}i.Z=function(){try{return 2<gt(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(e){if(this.g){var s=this.g.responseText;return e&&s.indexOf(e)==0&&(s=s.substring(e.length)),Lo(s)}};function vr(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch{return null}}function sa(e){const s={};e=(e.g&&2<=gt(e)&&e.g.getAllResponseHeaders()||"").split(`\r
`);for(let c=0;c<e.length;c++){if(B(e[c]))continue;var a=g(e[c]);const y=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const w=s[y]||[];s[y]=w,w.push(a)}_(s,function(c){return c.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ae(e,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[e]||s}function wr(e){this.Aa=0,this.i=[],this.j=new ye,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ae("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ae("baseRetryDelayMs",5e3,e),this.cb=Ae("retryDelaySeedMs",1e4,e),this.Wa=Ae("forwardChannelMaxRetries",2,e),this.wa=Ae("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new er(e&&e.concurrentRequestLimit),this.Da=new ea,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=wr.prototype,i.la=8,i.G=1,i.connect=function(e,s,a,c){J(0),this.W=e,this.H=s||{},a&&c!==void 0&&(this.H.OSID=a,this.H.OAID=c),this.F=this.X,this.I=Rr(this,null,this.W),sn(this)};function Jn(e){if(Ir(e),e.G==3){var s=e.U++,a=pt(e.I);if(U(a,"SID",e.K),U(a,"RID",s),U(a,"TYPE","terminate"),be(e,a),s=new Tt(e,e.j,s),s.L=2,s.v=Ze(pt(a)),a=!1,m.navigator&&m.navigator.sendBeacon)try{a=m.navigator.sendBeacon(s.v.toString(),"")}catch{}!a&&m.Image&&(new Image().src=s.v,a=!0),a||(s.g=kr(s.j,null),s.g.ea(s.v)),s.F=Date.now(),Xe(s)}Pr(e)}function rn(e){e.g&&(Yn(e),e.g.cancel(),e.g=null)}function Ir(e){rn(e),e.u&&(m.clearTimeout(e.u),e.u=null),on(e),e.h.cancel(),e.s&&(typeof e.s=="number"&&m.clearTimeout(e.s),e.s=null)}function sn(e){if(!nr(e.h)&&!e.s){e.s=!0;var s=e.Ga;ue||Ui(),de||(ue(),de=!0),Cn.add(s,e),e.B=0}}function oa(e,s){return ir(e.h)>=e.h.j-(e.s?1:0)?!1:e.s?(e.i=s.D.concat(e.i),!0):e.G==1||e.G==2||e.B>=(e.Va?0:e.Wa)?!1:(e.s=_e(S(e.Ga,e,s),Cr(e,e.B)),e.B++,!0)}i.Ga=function(e){if(this.s)if(this.s=null,this.G==1){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const y=new Tt(this,this.j,e);let w=this.o;if(this.S&&(w?(w=u(w),p(w,this.S)):w=this.S),this.m!==null||this.O||(y.H=w,w=null),this.P)t:{for(var s=0,a=0;a<this.i.length;a++){e:{var c=this.i[a];if("__data__"in c.map&&(c=c.map.__data__,typeof c=="string")){c=c.length;break e}c=void 0}if(c===void 0)break;if(s+=c,4096<s){s=a;break t}if(s===4096||a===this.i.length-1){s=a+1;break t}}s=1e3}else s=1e3;s=Tr(this,y,s),a=pt(this.I),U(a,"RID",e),U(a,"CVER",22),this.D&&U(a,"X-HTTP-Session-Id",this.D),be(this,a),w&&(this.O?s="headers="+encodeURIComponent(String(pr(w)))+"&"+s:this.m&&Kn(a,this.m,w)),qn(this.h,y),this.Ua&&U(a,"TYPE","init"),this.P?(U(a,"$req",s),U(a,"SID","null"),y.T=!0,$n(y,a,null)):$n(y,a,s),this.G=2}}else this.G==3&&(e?Er(this,e):this.i.length==0||nr(this.h)||Er(this))};function Er(e,s){var a;s?a=s.l:a=e.U++;const c=pt(e.I);U(c,"SID",e.K),U(c,"RID",a),U(c,"AID",e.T),be(e,c),e.m&&e.o&&Kn(c,e.m,e.o),a=new Tt(e,e.j,a,e.B+1),e.m===null&&(a.H=e.o),s&&(e.i=s.D.concat(e.i)),s=Tr(e,a,1e3),a.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),qn(e.h,a),$n(a,c,s)}function be(e,s){e.H&&at(e.H,function(a,c){U(s,c,a)}),e.l&&or({},function(a,c){U(s,c,a)})}function Tr(e,s,a){a=Math.min(e.i.length,a);var c=e.l?S(e.l.Na,e.l,e):null;t:{var y=e.i;let w=-1;for(;;){const T=["count="+a];w==-1?0<a?(w=y[0].g,T.push("ofs="+w)):w=0:T.push("ofs="+w);let L=!0;for(let H=0;H<a;H++){let O=y[H].g;const G=y[H].map;if(O-=w,0>O)w=Math.max(0,y[H].g-100),L=!1;else try{na(G,T,"req"+O+"_")}catch{c&&c(G)}}if(L){c=T.join("&");break t}}}return e=e.i.splice(0,a),s.D=e,c}function Sr(e){if(!e.g&&!e.u){e.Y=1;var s=e.Fa;ue||Ui(),de||(ue(),de=!0),Cn.add(s,e),e.v=0}}function Xn(e){return e.g||e.u||3<=e.v?!1:(e.Y++,e.u=_e(S(e.Fa,e),Cr(e,e.v)),e.v++,!0)}i.Fa=function(){if(this.u=null,Ar(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=_e(S(this.ab,this),e)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,J(10),rn(this),Ar(this))};function Yn(e){e.A!=null&&(m.clearTimeout(e.A),e.A=null)}function Ar(e){e.g=new Tt(e,e.j,"rpc",e.Y),e.m===null&&(e.g.H=e.o),e.g.O=0;var s=pt(e.qa);U(s,"RID","rpc"),U(s,"SID",e.K),U(s,"AID",e.T),U(s,"CI",e.F?"0":"1"),!e.F&&e.ja&&U(s,"TO",e.ja),U(s,"TYPE","xmlhttp"),be(e,s),e.m&&e.o&&Kn(s,e.m,e.o),e.L&&(e.g.I=e.L);var a=e.g;e=e.ia,a.L=1,a.v=Ze(pt(s)),a.m=null,a.P=!0,Qi(a,e)}i.Za=function(){this.C!=null&&(this.C=null,rn(this),Xn(this),J(19))};function on(e){e.C!=null&&(m.clearTimeout(e.C),e.C=null)}function br(e,s){var a=null;if(e.g==s){on(e),Yn(e),e.g=null;var c=2}else if(Gn(e.h,s))a=s.D,rr(e.h,s),c=1;else return;if(e.G!=0){if(s.o)if(c==1){a=s.m?s.m.length:0,s=Date.now()-s.F;var y=e.B;c=Fn(),K(c,new Ji(c,a)),sn(e)}else Sr(e);else if(y=s.s,y==3||y==0&&0<s.X||!(c==1&&oa(e,s)||c==2&&Xn(e)))switch(a&&0<a.length&&(s=e.h,s.i=s.i.concat(a)),y){case 1:Vt(e,5);break;case 4:Vt(e,10);break;case 3:Vt(e,6);break;default:Vt(e,2)}}}function Cr(e,s){let a=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(a*=2),a*s}function Vt(e,s){if(e.j.info("Error code "+s),s==2){var a=S(e.fb,e),c=e.Xa;const y=!c;c=new xt(c||"//www.google.com/images/cleardot.gif"),m.location&&m.location.protocol=="http"||Ye(c,"https"),Ze(c),y?Zo(c.toString(),a):ta(c.toString(),a)}else J(2);e.G=0,e.l&&e.l.sa(s),Pr(e),Ir(e)}i.fb=function(e){e?(this.j.info("Successfully pinged google.com"),J(2)):(this.j.info("Failed to ping google.com"),J(1))};function Pr(e){if(e.G=0,e.ka=[],e.l){const s=sr(e.h);(s.length!=0||e.i.length!=0)&&(M(e.ka,s),M(e.ka,e.i),e.h.i.length=0,V(e.i),e.i.length=0),e.l.ra()}}function Rr(e,s,a){var c=a instanceof xt?pt(a):new xt(a);if(c.g!="")s&&(c.g=s+"."+c.g),Qe(c,c.s);else{var y=m.location;c=y.protocol,s=s?s+"."+y.hostname:y.hostname,y=+y.port;var w=new xt(null);c&&Ye(w,c),s&&(w.g=s),y&&Qe(w,y),a&&(w.l=a),c=w}return a=e.D,s=e.ya,a&&s&&U(c,a,s),U(c,"VER",e.la),be(e,c),c}function kr(e,s,a){if(s&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return s=e.Ca&&!e.pa?new F(new tn({eb:a})):new F(e.pa),s.Ha(e.J),s}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Nr(){}i=Nr.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function Z(e,s){z.call(this),this.g=new wr(s),this.l=e,this.h=s&&s.messageUrlParams||null,e=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(e?e["X-WebChannel-Content-Type"]=s.messageContentType:e={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.va&&(e?e["X-WebChannel-Client-Profile"]=s.va:e={"X-WebChannel-Client-Profile":s.va}),this.g.S=e,(e=s&&s.Sb)&&!B(e)&&(this.g.m=e),this.v=s&&s.supportsCrossDomainXhr||!1,this.u=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!B(s)&&(this.g.D=s,e=this.h,e!==null&&s in e&&(e=this.h,s in e&&delete e[s])),this.j=new Zt(this)}P(Z,z),Z.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Z.prototype.close=function(){Jn(this.g)},Z.prototype.o=function(e){var s=this.g;if(typeof e=="string"){var a={};a.__data__=e,e=a}else this.u&&(a={},a.__data__=Mn(e),e=a);s.i.push(new $o(s.Ya++,e)),s.G==3&&sn(s)},Z.prototype.N=function(){this.g.l=null,delete this.j,Jn(this.g),delete this.g,Z.aa.N.call(this)};function Or(e){xn.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var s=e.__sm__;if(s){t:{for(const a in s){e=a;break t}e=void 0}(this.i=e)&&(e=this.i,s=s!==null&&e in s?s[e]:void 0),this.data=s}else this.data=e}P(Or,xn);function Dr(){Vn.call(this),this.status=1}P(Dr,Vn);function Zt(e){this.g=e}P(Zt,Nr),Zt.prototype.ua=function(){K(this.g,"a")},Zt.prototype.ta=function(e){K(this.g,new Or(e))},Zt.prototype.sa=function(e){K(this.g,new Dr)},Zt.prototype.ra=function(){K(this.g,"b")},Z.prototype.send=Z.prototype.o,Z.prototype.open=Z.prototype.m,Z.prototype.close=Z.prototype.close,jn.NO_ERROR=0,jn.TIMEOUT=8,jn.HTTP_ERROR=6,Bo.COMPLETE="complete",Uo.EventType=ge,ge.OPEN="a",ge.CLOSE="b",ge.ERROR="c",ge.MESSAGE="d",z.prototype.listen=z.prototype.K,F.prototype.listenOnce=F.prototype.L,F.prototype.getLastError=F.prototype.Ka,F.prototype.getLastErrorCode=F.prototype.Ba,F.prototype.getStatus=F.prototype.Z,F.prototype.getResponseJson=F.prototype.Oa,F.prototype.getResponseText=F.prototype.oa,F.prototype.send=F.prototype.ea,F.prototype.setWithCredentials=F.prototype.Ha}).apply(typeof cn<"u"?cn:typeof self<"u"?self:typeof window<"u"?window:{});const cs="@firebase/firestore",ls="4.9.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}X.UNAUTHENTICATED=new X(null),X.GOOGLE_CREDENTIALS=new X("google-credentials-uid"),X.FIRST_PARTY=new X("first-party-uid"),X.MOCK_USER=new X("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let He="12.0.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=new yi("@firebase/firestore");function rt(i,...t){if(ae.logLevel<=D.DEBUG){const n=t.map(Oi);ae.debug(`Firestore (${He}): ${i}`,...n)}}function mo(i,...t){if(ae.logLevel<=D.ERROR){const n=t.map(Oi);ae.error(`Firestore (${He}): ${i}`,...n)}}function Bl(i,...t){if(ae.logLevel<=D.WARN){const n=t.map(Oi);ae.warn(`Firestore (${He}): ${i}`,...n)}}function Oi(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Le(i,t,n){let r="Unexpected state";typeof t=="string"?r=t:n=t,_o(i,r,n)}function _o(i,t,n){let r=`FIRESTORE (${He}) INTERNAL ASSERTION FAILED: ${t} (ID: ${i.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw mo(r),new Error(r)}function Re(i,t,n,r){let o="Unexpected state";typeof n=="string"?o=n:r=n,i||_o(t,o,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class N extends It{constructor(t,n){super(t,n),this.code=t,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(){this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(t,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Hl{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,n){t.enqueueRetryable(()=>n(X.UNAUTHENTICATED))}shutdown(){}}class $l{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,n){this.changeListener=n,t.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Wl{constructor(t){this.t=t,this.currentUser=X.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,n){Re(this.o===void 0,42304);let r=this.i;const o=I=>this.i!==r?(r=this.i,n(I)):Promise.resolve();let h=new ke;this.o=()=>{this.i++,this.currentUser=this.u(),h.resolve(),h=new ke,t.enqueueRetryable(()=>o(this.currentUser))};const l=()=>{const I=h;t.enqueueRetryable(async()=>{await I.promise,await o(this.currentUser)})},m=I=>{rt("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=I,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(I=>m(I)),setTimeout(()=>{if(!this.auth){const I=this.t.getImmediate({optional:!0});I?m(I):(rt("FirebaseAuthCredentialsProvider","Auth not yet detected"),h.resolve(),h=new ke)}},0),l()}getToken(){const t=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==t?(rt("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Re(typeof r.accessToken=="string",31837,{l:r}),new yo(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return Re(t===null||typeof t=="string",2055,{h:t}),new X(t)}}class zl{constructor(t,n,r){this.P=t,this.T=n,this.I=r,this.type="FirstParty",this.user=X.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Gl{constructor(t,n,r){this.P=t,this.T=n,this.I=r}getToken(){return Promise.resolve(new zl(this.P,this.T,this.I))}start(t,n){t.enqueueRetryable(()=>n(X.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class us{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ql{constructor(t,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,nt(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,n){Re(this.o===void 0,3512);const r=h=>{h.error!=null&&rt("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${h.error.message}`);const l=h.token!==this.m;return this.m=h.token,rt("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?n(h.token):Promise.resolve()};this.o=h=>{t.enqueueRetryable(()=>r(h))};const o=h=>{rt("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=h,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(h=>o(h)),setTimeout(()=>{if(!this.appCheck){const h=this.V.getImmediate({optional:!0});h?o(h):rt("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new us(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(n=>n?(Re(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new us(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kl(i){const t=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(i);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(n);else for(let r=0;r<i;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const o=Kl(40);for(let h=0;h<o.length;++h)r.length<20&&o[h]<n&&(r+=t.charAt(o[h]%62))}return r}}function Lt(i,t){return i<t?-1:i>t?1:0}function Xl(i,t){const n=Math.min(i.length,t.length);for(let r=0;r<n;r++){const o=i.charAt(r),h=t.charAt(r);if(o!==h)return oi(o)===oi(h)?Lt(o,h):oi(o)?1:-1}return Lt(i.length,t.length)}const Yl=55296,Ql=57343;function oi(i){const t=i.charCodeAt(0);return t>=Yl&&t<=Ql}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds="__name__";class ht{constructor(t,n,r){n===void 0?n=0:n>t.length&&Le(637,{offset:n,range:t.length}),r===void 0?r=t.length-n:r>t.length-n&&Le(1746,{length:r,range:t.length-n}),this.segments=t,this.offset=n,this.len=r}get length(){return this.len}isEqual(t){return ht.comparator(this,t)===0}child(t){const n=this.segments.slice(this.offset,this.limit());return t instanceof ht?t.forEach(r=>{n.push(r)}):n.push(t),this.construct(n)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}forEach(t){for(let n=this.offset,r=this.limit();n<r;n++)t(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,n){const r=Math.min(t.length,n.length);for(let o=0;o<r;o++){const h=ht.compareSegments(t.get(o),n.get(o));if(h!==0)return h}return Lt(t.length,n.length)}static compareSegments(t,n){const r=ht.isNumericId(t),o=ht.isNumericId(n);return r&&!o?-1:!r&&o?1:r&&o?ht.extractNumericId(t).compare(ht.extractNumericId(n)):Xl(t,n)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Ni.fromString(t.substring(4,t.length-2))}}class et extends ht{construct(t,n,r){return new et(t,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const n=[];for(const r of t){if(r.indexOf("//")>=0)throw new N(k.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(o=>o.length>0))}return new et(n)}static emptyPath(){return new et([])}}const Zl=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class jt extends ht{construct(t,n,r){return new jt(t,n,r)}static isValidIdentifier(t){return Zl.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),jt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ds}static keyField(){return new jt([ds])}static fromServerFormat(t){const n=[];let r="",o=0;const h=()=>{if(r.length===0)throw new N(k.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let l=!1;for(;o<t.length;){const m=t[o];if(m==="\\"){if(o+1===t.length)throw new N(k.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const I=t[o+1];if(I!=="\\"&&I!=="."&&I!=="`")throw new N(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=I,o+=2}else m==="`"?(l=!l,o++):m!=="."||l?(r+=m,o++):(h(),o++)}if(h(),l)throw new N(k.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new jt(n)}static emptyPath(){return new jt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t){this.path=t}static fromPath(t){return new Ht(et.fromString(t))}static fromName(t){return new Ht(et.fromString(t).popFirst(5))}static empty(){return new Ht(et.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&et.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,n){return et.comparator(t.path,n.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new Ht(new et(t.slice()))}}function tu(i,t,n,r){if(t===!0&&r===!0)throw new N(k.INVALID_ARGUMENT,`${i} and ${n} cannot be used together.`)}function eu(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function nu(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(i);return t?`a custom ${t} object`:"an object"}}return typeof i=="function"?"a function":Le(12329,{type:typeof i})}function iu(i,t){if("_delegate"in i&&(i=i._delegate),!(i instanceof t)){if(t.name===i.constructor.name)throw new N(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=nu(i);throw new N(k.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(i,t){const n={typeString:i};return t&&(n.value=t),n}function $e(i,t){if(!eu(i))throw new N(k.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const o=t[r].typeString,h="value"in t[r]?{value:t[r].value}:void 0;if(!(r in i)){n=`JSON missing required field: '${r}'`;break}const l=i[r];if(o&&typeof l!==o){n=`JSON field '${r}' must be a ${o}.`;break}if(h!==void 0&&l!==h.value){n=`Expected '${r}' field to equal '${h.value}'`;break}}if(n)throw new N(k.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs=-62135596800,ps=1e6;class ct{static now(){return ct.fromMillis(Date.now())}static fromDate(t){return ct.fromMillis(t.getTime())}static fromMillis(t){const n=Math.floor(t/1e3),r=Math.floor((t-1e3*n)*ps);return new ct(n,r)}constructor(t,n){if(this.seconds=t,this.nanoseconds=n,n<0)throw new N(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new N(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(t<fs)throw new N(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new N(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ps}_compareTo(t){return this.seconds===t.seconds?Lt(this.nanoseconds,t.nanoseconds):Lt(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ct._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if($e(t,ct._jsonSchema))return new ct(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-fs;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ct._jsonSchemaVersion="firestore/timestamp/1.0",ct._jsonSchema={type:j("string",ct._jsonSchemaVersion),seconds:j("number"),nanoseconds:j("number")};function ru(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t){this.binaryString=t}static fromBase64String(t){const n=function(o){try{return atob(o)}catch(h){throw typeof DOMException<"u"&&h instanceof DOMException?new su("Invalid base64 string: "+h):h}}(t);return new Jt(n)}static fromUint8Array(t){const n=function(o){let h="";for(let l=0;l<o.length;++l)h+=String.fromCharCode(o[l]);return h}(t);return new Jt(n)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let o=0;o<n.length;o++)r[o]=n.charCodeAt(o);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return Lt(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Jt.EMPTY_BYTE_STRING=new Jt("");const mi="(default)";class Sn{constructor(t,n){this.projectId=t,this.database=n||mi}static empty(){return new Sn("","")}get isDefaultDatabase(){return this.database===mi}isEqual(t){return t instanceof Sn&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{constructor(t,n=null,r=[],o=[],h=null,l="F",m=null,I=null){this.path=t,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=o,this.limit=h,this.limitType=l,this.startAt=m,this.endAt=I,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function au(i){return new ou(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gs,R;(R=gs||(gs={}))[R.OK=0]="OK",R[R.CANCELLED=1]="CANCELLED",R[R.UNKNOWN=2]="UNKNOWN",R[R.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",R[R.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",R[R.NOT_FOUND=5]="NOT_FOUND",R[R.ALREADY_EXISTS=6]="ALREADY_EXISTS",R[R.PERMISSION_DENIED=7]="PERMISSION_DENIED",R[R.UNAUTHENTICATED=16]="UNAUTHENTICATED",R[R.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",R[R.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",R[R.ABORTED=10]="ABORTED",R[R.OUT_OF_RANGE=11]="OUT_OF_RANGE",R[R.UNIMPLEMENTED=12]="UNIMPLEMENTED",R[R.INTERNAL=13]="INTERNAL",R[R.UNAVAILABLE=14]="UNAVAILABLE",R[R.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Ni([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hu=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cu=1048576;function ai(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(t,n,r=1e3,o=1.5,h=6e4){this.Mi=t,this.timerId=n,this.d_=r,this.A_=o,this.R_=h,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const n=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),o=Math.max(0,n-r);o>0&&rt("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.V_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,o,()=>(this.f_=Date.now(),t())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(t,n,r,o,h){this.asyncQueue=t,this.timerId=n,this.targetTimeMs=r,this.op=o,this.removalCallback=h,this.deferred=new ke,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,n,r,o,h){const l=Date.now()+r,m=new Di(t,n,l,o,h);return m.start(r),m}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(k.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var ms,_s;(_s=ms||(ms={})).Ma="default",_s.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uu(i){const t={};return i.timeoutSeconds!==void 0&&(t.timeoutSeconds=i.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ys=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vo="firestore.googleapis.com",vs=!0;class ws{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new N(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=vo,this.ssl=vs}else this.host=t.host,this.ssl=t.ssl??vs;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=hu;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<cu)throw new N(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}tu("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=uu(t.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,o){return r.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class wo{constructor(t,n,r,o){this._authCredentials=t,this._appCheckCredentials=n,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ws({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new N(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ws(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Hl;switch(r.type){case"firstParty":return new Gl(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=ys.get(n);r&&(rt("ComponentProvider","Removing Datastore"),ys.delete(n),r.terminate())}(this),Promise.resolve()}}function du(i,t,n,r={}){var E;i=iu(i,wo);const o=Me(t),h=i._getSettings(),l={...h,emulatorOptions:i._getEmulatorOptions()},m=`${t}:${n}`;o&&(Ns(`https://${m}`),Os("Firestore",!0)),h.host!==vo&&h.host!==m&&Bl("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const I={...h,host:m,ssl:o,emulatorOptions:r};if(!Gt(I,l)&&(i._setSettings(I),r.mockUserToken)){let A,C;if(typeof r.mockUserToken=="string")A=r.mockUserToken,C=X.MOCK_USER;else{A=_a(r.mockUserToken,(E=i._app)==null?void 0:E.options.projectId);const S=r.mockUserToken.sub||r.mockUserToken.user_id;if(!S)throw new N(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");C=new X(S)}i._authCredentials=new $l(new yo(A,C))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(t,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Li(this.firestore,t,this._query)}}class lt{constructor(t,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mi(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new lt(this.firestore,t,this._key)}toJSON(){return{type:lt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,n,r){if($e(n,lt._jsonSchema))return new lt(t,r||null,new Ht(et.fromString(n.referencePath)))}}lt._jsonSchemaVersion="firestore/documentReference/1.0",lt._jsonSchema={type:j("string",lt._jsonSchemaVersion),referencePath:j("string")};class Mi extends Li{constructor(t,n,r){super(t,n,au(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new lt(this.firestore,null,new Ht(t))}withConverter(t){return new Mi(this.firestore,t,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is="AsyncQueue";class Es{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new lu(this,"async_queue_retry"),this._c=()=>{const r=ai();r&&rt(Is,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const n=ai();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const n=ai();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise(()=>{});const n=new ke;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(t().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Xu.push(t),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!ru(t))throw t;rt(Is,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(t){const n=this.ac.then(()=>(this.rc=!0,t().catch(r=>{throw this.nc=r,this.rc=!1,mo("INTERNAL UNHANDLED ERROR: ",Ts(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=n,n}enqueueAfterDelay(t,n,r){this.uc(),this.oc.indexOf(t)>-1&&(n=0);const o=Di.createAndSchedule(this,t,n,r,h=>this.hc(h));return this.tc.push(o),o}uc(){this.nc&&Le(47125,{Pc:Ts(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const n of this.tc)if(n.timerId===t)return!0;return!1}Ec(t){return this.Tc().then(()=>{this.tc.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.tc)if(n.skipDelay(),t!=="all"&&n.timerId===t)break;return this.Tc()})}dc(t){this.oc.push(t)}hc(t){const n=this.tc.indexOf(t);this.tc.splice(n,1)}}function Ts(i){let t=i.message||"";return i.stack&&(t=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),t}class fu extends wo{constructor(t,n,r,o){super(t,n,r,o),this.type="firestore",this._queue=new Es,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Es(t),this._firestoreClient=void 0,await t}}}function Tu(i,t){const n=typeof i=="object"?i:Ms(),r=typeof i=="string"?i:mi,o=wi(n,"firestore").getImmediate({identifier:r});if(!o._initialized){const h=ga("firestore");h&&du(o,...h)}return o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new mt(Jt.fromBase64String(t))}catch(n){throw new N(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(t){return new mt(Jt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:mt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if($e(t,mt._jsonSchema))return mt.fromBase64String(t.bytes)}}mt._jsonSchemaVersion="firestore/bytes/1.0",mt._jsonSchema={type:j("string",mt._jsonSchemaVersion),bytes:j("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(...t){for(let n=0;n<t.length;++n)if(t[n].length===0)throw new N(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new jt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(t,n){if(!isFinite(t)||t<-90||t>90)throw new N(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(n)||n<-180||n>180)throw new N(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=t,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return Lt(this._lat,t._lat)||Lt(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Wt._jsonSchemaVersion}}static fromJSON(t){if($e(t,Wt._jsonSchema))return new Wt(t.latitude,t.longitude)}}Wt._jsonSchemaVersion="firestore/geoPoint/1.0",Wt._jsonSchema={type:j("string",Wt._jsonSchemaVersion),latitude:j("number"),longitude:j("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(t){this._values=(t||[]).map(n=>n)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,o){if(r.length!==o.length)return!1;for(let h=0;h<r.length;++h)if(r[h]!==o[h])return!1;return!0}(this._values,t._values)}toJSON(){return{type:zt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if($e(t,zt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(n=>typeof n=="number"))return new zt(t.vectorValues);throw new N(k.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}zt._jsonSchemaVersion="firestore/vectorValue/1.0",zt._jsonSchema={type:j("string",zt._jsonSchemaVersion),vectorValues:j("object")};const pu=new RegExp("[~\\*/\\[\\]]");function gu(i,t,n){if(t.search(pu)>=0)throw Ss(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new Io(...t.split("."))._internalPath}catch{throw Ss(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function Ss(i,t,n,r,o){let h=`Function ${t}() called with invalid data`;h+=". ";let l="";return new N(k.INVALID_ARGUMENT,h+i+l)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(t,n,r,o,h){this._firestore=t,this._userDataWriter=n,this._key=r,this._document=o,this._converter=h}get id(){return this._key.path.lastSegment()}get ref(){return new lt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new mu(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const n=this._document.data.field(To("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n)}}}class mu extends Eo{data(){return super.data()}}function To(i,t){return typeof t=="string"?gu(i,t):t instanceof Io?t._internalPath:t._delegate._internalPath}class ln{constructor(t,n){this.hasPendingWrites=t,this.fromCache=n}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class re extends Eo{constructor(t,n,r,o,h,l){super(t,n,r,o,l),this._firestore=t,this._firestoreImpl=t,this.metadata=h}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const n=new gn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,n={}){if(this._document){const r=this._document.data.field(To("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(k.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,n={};return n.type=re._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}re._jsonSchemaVersion="firestore/documentSnapshot/1.0",re._jsonSchema={type:j("string",re._jsonSchemaVersion),bundleSource:j("string","DocumentSnapshot"),bundleName:j("string"),bundle:j("string")};class gn extends re{data(t={}){return super.data(t)}}class Ne{constructor(t,n,r,o){this._firestore=t,this._userDataWriter=n,this._snapshot=o,this.metadata=new ln(o.hasPendingWrites,o.fromCache),this.query=r}get docs(){const t=[];return this.forEach(n=>t.push(n)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,n){this._snapshot.docs.forEach(r=>{t.call(n,new gn(this._firestore,this._userDataWriter,r.key,r,new ln(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const n=!!t.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new N(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(o,h){if(o._snapshot.oldDocs.isEmpty()){let l=0;return o._snapshot.docChanges.map(m=>{const I=new gn(o._firestore,o._userDataWriter,m.doc.key,m.doc,new ln(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);return m.doc,{type:"added",doc:I,oldIndex:-1,newIndex:l++}})}{let l=o._snapshot.oldDocs;return o._snapshot.docChanges.filter(m=>h||m.type!==3).map(m=>{const I=new gn(o._firestore,o._userDataWriter,m.doc.key,m.doc,new ln(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);let E=-1,A=-1;return m.type!==0&&(E=l.indexOf(m.doc.key),l=l.delete(m.doc.key)),m.type!==1&&(l=l.add(m.doc),A=l.indexOf(m.doc.key)),{type:_u(m.type),doc:I,oldIndex:E,newIndex:A}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(k.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=Ne._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Jl.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],o=[];return this.docs.forEach(h=>{h._document!==null&&(n.push(h._document),r.push(this._userDataWriter.convertObjectMap(h._document.data.value.mapValue.fields,"previous")),o.push(h.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function _u(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Le(61501,{type:i})}}Ne._jsonSchemaVersion="firestore/querySnapshot/1.0",Ne._jsonSchema={type:j("string",Ne._jsonSchemaVersion),bundleSource:j("string","QuerySnapshot"),bundleName:j("string"),bundle:j("string")};(function(t,n=!0){(function(o){He=o})(he),se(new qt("firestore",(r,{instanceIdentifier:o,options:h})=>{const l=r.getProvider("app").getImmediate(),m=new fu(new Wl(r.getProvider("auth-internal")),new ql(l,r.getProvider("app-check-internal")),function(E,A){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new N(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Sn(E.options.projectId,A)}(l,o),l);return h={useFetchStreams:n,...h},m._setSettings(h),m},"PUBLIC").setMultipleInstances(!0)),Dt(cs,ls,t),Dt(cs,ls,"esm2020")})();export{Pt as G,Eu as a,Iu as b,vu as c,Tu as g,Oh as i,yu as o,wu as s};
