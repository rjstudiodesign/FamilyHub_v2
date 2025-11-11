(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();var sc={};/**
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
 */const Lu=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},hm=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],a=n[t++],l=n[t++],c=((i&7)<<18|(s&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const s=n[t++],a=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Mu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],a=i+1<n.length,l=a?n[i+1]:0,c=i+2<n.length,d=c?n[i+2]:0,f=s>>2,p=(s&3)<<4|l>>4;let v=(l&15)<<2|d>>6,b=d&63;c||(b=64,a||(v=64)),r.push(t[f],t[p],t[v],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Lu(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):hm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const d=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||l==null||d==null||p==null)throw new fm;const v=s<<2|l>>4;if(r.push(v),d!==64){const b=l<<4&240|d>>2;if(r.push(b),p!==64){const C=d<<6&192|p;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class fm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const mm=function(n){const e=Lu(n);return Mu.encodeByteArray(e,!0)},Hi=function(n){return mm(n).replace(/\./g,"")},Vu=function(n){try{return Mu.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function pm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const gm=()=>pm().__FIREBASE_DEFAULTS__,_m=()=>{if(typeof process>"u"||typeof sc>"u")return;const n=sc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},ym=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Vu(n[1]);return e&&JSON.parse(e)},as=()=>{try{return gm()||_m()||ym()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ou=n=>{var e,t;return(t=(e=as())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Fu=n=>{const e=Ou(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Uu=()=>{var n;return(n=as())===null||n===void 0?void 0:n.config},Bu=n=>{var e;return(e=as())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class vm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function $u(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Hi(JSON.stringify(t)),Hi(JSON.stringify(a)),""].join(".")}/**
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
 */function Le(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function wm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Le())}function Em(){var n;const e=(n=as())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function bm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Im(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Tm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Am(){const n=Le();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Rm(){return!Em()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Cm(){try{return typeof indexedDB=="object"}catch{return!1}}function Sm(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
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
 */const km="FirebaseError";class dt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=km,Object.setPrototypeOf(this,dt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zr.prototype.create)}}class zr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Pm(s,r):"Error",l=`${this.serviceName}: ${a} (${i}).`;return new dt(i,l,r)}}function Pm(n,e){return n.replace(xm,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const xm=/\{\$([^}]+)}/g;function Dm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Vn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],a=e[i];if(oc(s)&&oc(a)){if(!Vn(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function oc(n){return n!==null&&typeof n=="object"}/**
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
 */function Wr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function vr(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function wr(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Nm(n,e){const t=new Lm(n,e);return t.subscribe.bind(t)}class Lm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Mm(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=so),i.error===void 0&&(i.error=so),i.complete===void 0&&(i.complete=so);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Mm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function so(){}/**
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
 */function ie(n){return n&&n._delegate?n._delegate:n}class qt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const en="[DEFAULT]";/**
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
 */class Vm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new vm;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Fm(e))try{this.getOrInitializeService({instanceIdentifier:en})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=en){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=en){return this.instances.has(e)}getOptions(e=en){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&a.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Om(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=en){return this.component?this.component.multipleInstances?e:en:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Om(n){return n===en?void 0:n}function Fm(n){return n.instantiationMode==="EAGER"}/**
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
 */class Um{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Vm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Q||(Q={}));const Bm={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},$m=Q.INFO,qm={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},jm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=qm[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ra{constructor(e){this.name=e,this._logLevel=$m,this._logHandler=jm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Bm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const Hm=(n,e)=>e.some(t=>n instanceof t);let ac,lc;function zm(){return ac||(ac=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Wm(){return lc||(lc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const qu=new WeakMap,Ro=new WeakMap,ju=new WeakMap,oo=new WeakMap,ia=new WeakMap;function Gm(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",a)},s=()=>{t(Ut(n.result)),i()},a=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&qu.set(t,n)}).catch(()=>{}),ia.set(e,n),e}function Km(n){if(Ro.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",a),n.removeEventListener("abort",a)},s=()=>{t(),i()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",a),n.addEventListener("abort",a)});Ro.set(n,e)}let Co={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Ro.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ju.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ut(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Qm(n){Co=n(Co)}function Xm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(ao(this),e,...t);return ju.set(r,e.sort?e.sort():[e]),Ut(r)}:Wm().includes(n)?function(...e){return n.apply(ao(this),e),Ut(qu.get(this))}:function(...e){return Ut(n.apply(ao(this),e))}}function Ym(n){return typeof n=="function"?Xm(n):(n instanceof IDBTransaction&&Km(n),Hm(n,zm())?new Proxy(n,Co):n)}function Ut(n){if(n instanceof IDBRequest)return Gm(n);if(oo.has(n))return oo.get(n);const e=Ym(n);return e!==n&&(oo.set(n,e),ia.set(e,n)),e}const ao=n=>ia.get(n);function Jm(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(n,e),l=Ut(a);return r&&a.addEventListener("upgradeneeded",c=>{r(Ut(a.result),c.oldVersion,c.newVersion,Ut(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Zm=["get","getKey","getAll","getAllKeys","count"],ep=["put","add","delete","clear"],lo=new Map;function cc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(lo.get(e))return lo.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=ep.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Zm.includes(t)))return;const s=async function(a,...l){const c=this.transaction(a,i?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),i&&c.done]))[0]};return lo.set(e,s),s}Qm(n=>({...n,get:(e,t,r)=>cc(e,t)||n.get(e,t,r),has:(e,t)=>!!cc(e,t)||n.has(e,t)}));/**
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
 */class tp{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(np(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function np(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const So="@firebase/app",uc="0.10.13";/**
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
 */const bt=new ra("@firebase/app"),rp="@firebase/app-compat",ip="@firebase/analytics-compat",sp="@firebase/analytics",op="@firebase/app-check-compat",ap="@firebase/app-check",lp="@firebase/auth",cp="@firebase/auth-compat",up="@firebase/database",dp="@firebase/data-connect",hp="@firebase/database-compat",fp="@firebase/functions",mp="@firebase/functions-compat",pp="@firebase/installations",gp="@firebase/installations-compat",_p="@firebase/messaging",yp="@firebase/messaging-compat",vp="@firebase/performance",wp="@firebase/performance-compat",Ep="@firebase/remote-config",bp="@firebase/remote-config-compat",Ip="@firebase/storage",Tp="@firebase/storage-compat",Ap="@firebase/firestore",Rp="@firebase/vertexai-preview",Cp="@firebase/firestore-compat",Sp="firebase",kp="10.14.1";/**
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
 */const ko="[DEFAULT]",Pp={[So]:"fire-core",[rp]:"fire-core-compat",[sp]:"fire-analytics",[ip]:"fire-analytics-compat",[ap]:"fire-app-check",[op]:"fire-app-check-compat",[lp]:"fire-auth",[cp]:"fire-auth-compat",[up]:"fire-rtdb",[dp]:"fire-data-connect",[hp]:"fire-rtdb-compat",[fp]:"fire-fn",[mp]:"fire-fn-compat",[pp]:"fire-iid",[gp]:"fire-iid-compat",[_p]:"fire-fcm",[yp]:"fire-fcm-compat",[vp]:"fire-perf",[wp]:"fire-perf-compat",[Ep]:"fire-rc",[bp]:"fire-rc-compat",[Ip]:"fire-gcs",[Tp]:"fire-gcs-compat",[Ap]:"fire-fst",[Cp]:"fire-fst-compat",[Rp]:"fire-vertex","fire-js":"fire-js",[Sp]:"fire-js-all"};/**
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
 */const zi=new Map,xp=new Map,Po=new Map;function dc(n,e){try{n.container.addComponent(e)}catch(t){bt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function an(n){const e=n.name;if(Po.has(e))return bt.debug(`There were multiple attempts to register component ${e}.`),!1;Po.set(e,n);for(const t of zi.values())dc(t,n);for(const t of xp.values())dc(t,n);return!0}function ls(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function rt(n){return n.settings!==void 0}/**
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
 */const Dp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Bt=new zr("app","Firebase",Dp);/**
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
 */class Np{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new qt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Bt.create("app-deleted",{appName:this._name})}}/**
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
 */const mn=kp;function Hu(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ko,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Bt.create("bad-app-name",{appName:String(i)});if(t||(t=Uu()),!t)throw Bt.create("no-options");const s=zi.get(i);if(s){if(Vn(t,s.options)&&Vn(r,s.config))return s;throw Bt.create("duplicate-app",{appName:i})}const a=new Um(i);for(const c of Po.values())a.addComponent(c);const l=new Np(t,r,a);return zi.set(i,l),l}function sa(n=ko){const e=zi.get(n);if(!e&&n===ko&&Uu())return Hu();if(!e)throw Bt.create("no-app",{appName:n});return e}function st(n,e,t){var r;let i=(r=Pp[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),bt.warn(l.join(" "));return}an(new qt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Lp="firebase-heartbeat-database",Mp=1,Lr="firebase-heartbeat-store";let co=null;function zu(){return co||(co=Jm(Lp,Mp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Lr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Bt.create("idb-open",{originalErrorMessage:n.message})})),co}async function Vp(n){try{const t=(await zu()).transaction(Lr),r=await t.objectStore(Lr).get(Wu(n));return await t.done,r}catch(e){if(e instanceof dt)bt.warn(e.message);else{const t=Bt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});bt.warn(t.message)}}}async function hc(n,e){try{const r=(await zu()).transaction(Lr,"readwrite");await r.objectStore(Lr).put(e,Wu(n)),await r.done}catch(t){if(t instanceof dt)bt.warn(t.message);else{const r=Bt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});bt.warn(r.message)}}}function Wu(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Op=1024,Fp=30*24*60*60*1e3;class Up{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new $p(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=fc();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=Fp}),this._storage.overwrite(this._heartbeatsCache))}catch(r){bt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=fc(),{heartbeatsToSend:r,unsentEntries:i}=Bp(this._heartbeatsCache.heartbeats),s=Hi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return bt.warn(t),""}}}function fc(){return new Date().toISOString().substring(0,10)}function Bp(n,e=Op){const t=[];let r=n.slice();for(const i of n){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),mc(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),mc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class $p{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Cm()?Sm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Vp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return hc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return hc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function mc(n){return Hi(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function qp(n){an(new qt("platform-logger",e=>new tp(e),"PRIVATE")),an(new qt("heartbeat",e=>new Up(e),"PRIVATE")),st(So,uc,n),st(So,uc,"esm2017"),st("fire-js","")}qp("");var jp="firebase",Hp="10.14.1";/**
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
 */st(jp,Hp,"app");var pc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var sn,Gu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function _(){}_.prototype=g.prototype,E.D=g.prototype,E.prototype=new _,E.prototype.constructor=E,E.C=function(w,I,A){for(var y=Array(arguments.length-2),ht=2;ht<arguments.length;ht++)y[ht-2]=arguments[ht];return g.prototype[I].apply(w,y)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,g,_){_||(_=0);var w=Array(16);if(typeof g=="string")for(var I=0;16>I;++I)w[I]=g.charCodeAt(_++)|g.charCodeAt(_++)<<8|g.charCodeAt(_++)<<16|g.charCodeAt(_++)<<24;else for(I=0;16>I;++I)w[I]=g[_++]|g[_++]<<8|g[_++]<<16|g[_++]<<24;g=E.g[0],_=E.g[1],I=E.g[2];var A=E.g[3],y=g+(A^_&(I^A))+w[0]+3614090360&4294967295;g=_+(y<<7&4294967295|y>>>25),y=A+(I^g&(_^I))+w[1]+3905402710&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(_^A&(g^_))+w[2]+606105819&4294967295,I=A+(y<<17&4294967295|y>>>15),y=_+(g^I&(A^g))+w[3]+3250441966&4294967295,_=I+(y<<22&4294967295|y>>>10),y=g+(A^_&(I^A))+w[4]+4118548399&4294967295,g=_+(y<<7&4294967295|y>>>25),y=A+(I^g&(_^I))+w[5]+1200080426&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(_^A&(g^_))+w[6]+2821735955&4294967295,I=A+(y<<17&4294967295|y>>>15),y=_+(g^I&(A^g))+w[7]+4249261313&4294967295,_=I+(y<<22&4294967295|y>>>10),y=g+(A^_&(I^A))+w[8]+1770035416&4294967295,g=_+(y<<7&4294967295|y>>>25),y=A+(I^g&(_^I))+w[9]+2336552879&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(_^A&(g^_))+w[10]+4294925233&4294967295,I=A+(y<<17&4294967295|y>>>15),y=_+(g^I&(A^g))+w[11]+2304563134&4294967295,_=I+(y<<22&4294967295|y>>>10),y=g+(A^_&(I^A))+w[12]+1804603682&4294967295,g=_+(y<<7&4294967295|y>>>25),y=A+(I^g&(_^I))+w[13]+4254626195&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(_^A&(g^_))+w[14]+2792965006&4294967295,I=A+(y<<17&4294967295|y>>>15),y=_+(g^I&(A^g))+w[15]+1236535329&4294967295,_=I+(y<<22&4294967295|y>>>10),y=g+(I^A&(_^I))+w[1]+4129170786&4294967295,g=_+(y<<5&4294967295|y>>>27),y=A+(_^I&(g^_))+w[6]+3225465664&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^_&(A^g))+w[11]+643717713&4294967295,I=A+(y<<14&4294967295|y>>>18),y=_+(A^g&(I^A))+w[0]+3921069994&4294967295,_=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(_^I))+w[5]+3593408605&4294967295,g=_+(y<<5&4294967295|y>>>27),y=A+(_^I&(g^_))+w[10]+38016083&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^_&(A^g))+w[15]+3634488961&4294967295,I=A+(y<<14&4294967295|y>>>18),y=_+(A^g&(I^A))+w[4]+3889429448&4294967295,_=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(_^I))+w[9]+568446438&4294967295,g=_+(y<<5&4294967295|y>>>27),y=A+(_^I&(g^_))+w[14]+3275163606&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^_&(A^g))+w[3]+4107603335&4294967295,I=A+(y<<14&4294967295|y>>>18),y=_+(A^g&(I^A))+w[8]+1163531501&4294967295,_=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(_^I))+w[13]+2850285829&4294967295,g=_+(y<<5&4294967295|y>>>27),y=A+(_^I&(g^_))+w[2]+4243563512&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^_&(A^g))+w[7]+1735328473&4294967295,I=A+(y<<14&4294967295|y>>>18),y=_+(A^g&(I^A))+w[12]+2368359562&4294967295,_=I+(y<<20&4294967295|y>>>12),y=g+(_^I^A)+w[5]+4294588738&4294967295,g=_+(y<<4&4294967295|y>>>28),y=A+(g^_^I)+w[8]+2272392833&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^_)+w[11]+1839030562&4294967295,I=A+(y<<16&4294967295|y>>>16),y=_+(I^A^g)+w[14]+4259657740&4294967295,_=I+(y<<23&4294967295|y>>>9),y=g+(_^I^A)+w[1]+2763975236&4294967295,g=_+(y<<4&4294967295|y>>>28),y=A+(g^_^I)+w[4]+1272893353&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^_)+w[7]+4139469664&4294967295,I=A+(y<<16&4294967295|y>>>16),y=_+(I^A^g)+w[10]+3200236656&4294967295,_=I+(y<<23&4294967295|y>>>9),y=g+(_^I^A)+w[13]+681279174&4294967295,g=_+(y<<4&4294967295|y>>>28),y=A+(g^_^I)+w[0]+3936430074&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^_)+w[3]+3572445317&4294967295,I=A+(y<<16&4294967295|y>>>16),y=_+(I^A^g)+w[6]+76029189&4294967295,_=I+(y<<23&4294967295|y>>>9),y=g+(_^I^A)+w[9]+3654602809&4294967295,g=_+(y<<4&4294967295|y>>>28),y=A+(g^_^I)+w[12]+3873151461&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^_)+w[15]+530742520&4294967295,I=A+(y<<16&4294967295|y>>>16),y=_+(I^A^g)+w[2]+3299628645&4294967295,_=I+(y<<23&4294967295|y>>>9),y=g+(I^(_|~A))+w[0]+4096336452&4294967295,g=_+(y<<6&4294967295|y>>>26),y=A+(_^(g|~I))+w[7]+1126891415&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~_))+w[14]+2878612391&4294967295,I=A+(y<<15&4294967295|y>>>17),y=_+(A^(I|~g))+w[5]+4237533241&4294967295,_=I+(y<<21&4294967295|y>>>11),y=g+(I^(_|~A))+w[12]+1700485571&4294967295,g=_+(y<<6&4294967295|y>>>26),y=A+(_^(g|~I))+w[3]+2399980690&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~_))+w[10]+4293915773&4294967295,I=A+(y<<15&4294967295|y>>>17),y=_+(A^(I|~g))+w[1]+2240044497&4294967295,_=I+(y<<21&4294967295|y>>>11),y=g+(I^(_|~A))+w[8]+1873313359&4294967295,g=_+(y<<6&4294967295|y>>>26),y=A+(_^(g|~I))+w[15]+4264355552&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~_))+w[6]+2734768916&4294967295,I=A+(y<<15&4294967295|y>>>17),y=_+(A^(I|~g))+w[13]+1309151649&4294967295,_=I+(y<<21&4294967295|y>>>11),y=g+(I^(_|~A))+w[4]+4149444226&4294967295,g=_+(y<<6&4294967295|y>>>26),y=A+(_^(g|~I))+w[11]+3174756917&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~_))+w[2]+718787259&4294967295,I=A+(y<<15&4294967295|y>>>17),y=_+(A^(I|~g))+w[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(I+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+I&4294967295,E.g[3]=E.g[3]+A&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var _=g-this.blockSize,w=this.B,I=this.h,A=0;A<g;){if(I==0)for(;A<=_;)i(this,E,A),A+=this.blockSize;if(typeof E=="string"){for(;A<g;)if(w[I++]=E.charCodeAt(A++),I==this.blockSize){i(this,w),I=0;break}}else for(;A<g;)if(w[I++]=E[A++],I==this.blockSize){i(this,w),I=0;break}}this.h=I,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var _=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=_&255,_/=256;for(this.u(E),E=Array(16),g=_=0;4>g;++g)for(var w=0;32>w;w+=8)E[_++]=this.g[g]>>>w&255;return E};function s(E,g){var _=l;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=g(E)}function a(E,g){this.h=g;for(var _=[],w=!0,I=E.length-1;0<=I;I--){var A=E[I]|0;w&&A==g||(_[I]=A,w=!1)}this.g=_}var l={};function c(E){return-128<=E&&128>E?s(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return p;if(0>E)return k(d(-E));for(var g=[],_=1,w=0;E>=_;w++)g[w]=E/_|0,_*=4294967296;return new a(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return k(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(g,8)),w=p,I=0;I<E.length;I+=8){var A=Math.min(8,E.length-I),y=parseInt(E.substring(I,I+A),g);8>A?(A=d(Math.pow(g,A)),w=w.j(A).add(d(y))):(w=w.j(_),w=w.add(d(y)))}return w}var p=c(0),v=c(1),b=c(16777216);n=a.prototype,n.m=function(){if(D(this))return-k(this).m();for(var E=0,g=1,_=0;_<this.g.length;_++){var w=this.i(_);E+=(0<=w?w:4294967296+w)*g,g*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(C(this))return"0";if(D(this))return"-"+k(this).toString(E);for(var g=d(Math.pow(E,6)),_=this,w="";;){var I=j(_,g).g;_=U(_,I.j(g));var A=((0<_.g.length?_.g[0]:_.h)>>>0).toString(E);if(_=I,C(_))return A+w;for(;6>A.length;)A="0"+A;w=A+w}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function C(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function D(E){return E.h==-1}n.l=function(E){return E=U(this,E),D(E)?-1:C(E)?0:1};function k(E){for(var g=E.g.length,_=[],w=0;w<g;w++)_[w]=~E.g[w];return new a(_,~E.h).add(v)}n.abs=function(){return D(this)?k(this):this},n.add=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],w=0,I=0;I<=g;I++){var A=w+(this.i(I)&65535)+(E.i(I)&65535),y=(A>>>16)+(this.i(I)>>>16)+(E.i(I)>>>16);w=y>>>16,A&=65535,y&=65535,_[I]=y<<16|A}return new a(_,_[_.length-1]&-2147483648?-1:0)};function U(E,g){return E.add(k(g))}n.j=function(E){if(C(this)||C(E))return p;if(D(this))return D(E)?k(this).j(k(E)):k(k(this).j(E));if(D(E))return k(this.j(k(E)));if(0>this.l(b)&&0>E.l(b))return d(this.m()*E.m());for(var g=this.g.length+E.g.length,_=[],w=0;w<2*g;w++)_[w]=0;for(w=0;w<this.g.length;w++)for(var I=0;I<E.g.length;I++){var A=this.i(w)>>>16,y=this.i(w)&65535,ht=E.i(I)>>>16,er=E.i(I)&65535;_[2*w+2*I]+=y*er,$(_,2*w+2*I),_[2*w+2*I+1]+=A*er,$(_,2*w+2*I+1),_[2*w+2*I+1]+=y*ht,$(_,2*w+2*I+1),_[2*w+2*I+2]+=A*ht,$(_,2*w+2*I+2)}for(w=0;w<g;w++)_[w]=_[2*w+1]<<16|_[2*w];for(w=g;w<2*g;w++)_[w]=0;return new a(_,0)};function $(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function F(E,g){this.g=E,this.h=g}function j(E,g){if(C(g))throw Error("division by zero");if(C(E))return new F(p,p);if(D(E))return g=j(k(E),g),new F(k(g.g),k(g.h));if(D(g))return g=j(E,k(g)),new F(k(g.g),g.h);if(30<E.g.length){if(D(E)||D(g))throw Error("slowDivide_ only works with positive integers.");for(var _=v,w=g;0>=w.l(E);)_=ne(_),w=ne(w);var I=J(_,1),A=J(w,1);for(w=J(w,2),_=J(_,2);!C(w);){var y=A.add(w);0>=y.l(E)&&(I=I.add(_),A=y),w=J(w,1),_=J(_,1)}return g=U(E,I.j(g)),new F(I,g)}for(I=p;0<=E.l(g);){for(_=Math.max(1,Math.floor(E.m()/g.m())),w=Math.ceil(Math.log(_)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),A=d(_),y=A.j(g);D(y)||0<y.l(E);)_-=w,A=d(_),y=A.j(g);C(A)&&(A=v),I=I.add(A),E=U(E,y)}return new F(I,E)}n.A=function(E){return j(this,E).h},n.and=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],w=0;w<g;w++)_[w]=this.i(w)&E.i(w);return new a(_,this.h&E.h)},n.or=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],w=0;w<g;w++)_[w]=this.i(w)|E.i(w);return new a(_,this.h|E.h)},n.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],w=0;w<g;w++)_[w]=this.i(w)^E.i(w);return new a(_,this.h^E.h)};function ne(E){for(var g=E.g.length+1,_=[],w=0;w<g;w++)_[w]=E.i(w)<<1|E.i(w-1)>>>31;return new a(_,E.h)}function J(E,g){var _=g>>5;g%=32;for(var w=E.g.length-_,I=[],A=0;A<w;A++)I[A]=0<g?E.i(A+_)>>>g|E.i(A+_+1)<<32-g:E.i(A+_);return new a(I,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Gu=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,sn=a}).apply(typeof pc<"u"?pc:typeof self<"u"?self:typeof window<"u"?window:{});var Ci=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ku,Er,Qu,Mi,xo,Xu,Yu,Ju;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ci=="object"&&Ci];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(o,u){if(u)e:{var h=r;o=o.split(".");for(var m=0;m<o.length-1;m++){var T=o[m];if(!(T in h))break e;h=h[T]}o=o[o.length-1],m=h[o],u=u(m),u!=m&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function s(o,u){o instanceof String&&(o+="");var h=0,m=!1,T={next:function(){if(!m&&h<o.length){var R=h++;return{value:u(R,o[R]),done:!1}}return m=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}i("Array.prototype.values",function(o){return o||function(){return s(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function p(o,u,h){if(!o)throw Error();if(2<arguments.length){var m=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,m),o.apply(u,T)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,v.apply(null,arguments)}function b(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var m=h.slice();return m.push.apply(m,arguments),o.apply(this,m)}}function C(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(m,T,R){for(var N=Array(arguments.length-2),re=2;re<arguments.length;re++)N[re-2]=arguments[re];return u.prototype[T].apply(m,N)}}function D(o){const u=o.length;if(0<u){const h=Array(u);for(let m=0;m<u;m++)h[m]=o[m];return h}return[]}function k(o,u){for(let h=1;h<arguments.length;h++){const m=arguments[h];if(c(m)){const T=o.length||0,R=m.length||0;o.length=T+R;for(let N=0;N<R;N++)o[T+N]=m[N]}else o.push(m)}}class U{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function $(o){return/^[\s\xa0]*$/.test(o)}function F(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function j(o){return j[" "](o),o}j[" "]=function(){};var ne=F().indexOf("Gecko")!=-1&&!(F().toLowerCase().indexOf("webkit")!=-1&&F().indexOf("Edge")==-1)&&!(F().indexOf("Trident")!=-1||F().indexOf("MSIE")!=-1)&&F().indexOf("Edge")==-1;function J(o,u,h){for(const m in o)u.call(h,o[m],m,o)}function E(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,u){let h,m;for(let T=1;T<arguments.length;T++){m=arguments[T];for(h in m)o[h]=m[h];for(let R=0;R<_.length;R++)h=_[R],Object.prototype.hasOwnProperty.call(m,h)&&(o[h]=m[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function y(){var o=Ms;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ht{constructor(){this.h=this.g=null}add(u,h){const m=er.get();m.set(u,h),this.h?this.h.next=m:this.g=m,this.h=m}}var er=new U(()=>new xf,o=>o.reset());class xf{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let tr,nr=!1,Ms=new ht,sl=()=>{const o=l.Promise.resolve(void 0);tr=()=>{o.then(Df)}};var Df=()=>{for(var o;o=y();){try{o.h.call(o.g)}catch(h){A(h)}var u=er;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}nr=!1};function St(){this.s=this.s,this.C=this.C}St.prototype.s=!1,St.prototype.ma=function(){this.s||(this.s=!0,this.N())},St.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Re(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}Re.prototype.h=function(){this.defaultPrevented=!0};var Nf=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function rr(o,u){if(Re.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,m=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(ne){e:{try{j(u.nodeName);var T=!0;break e}catch{}T=!1}T||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Lf[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&rr.aa.h.call(this)}}C(rr,Re);var Lf={2:"touch",3:"pen",4:"mouse"};rr.prototype.h=function(){rr.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var li="closure_listenable_"+(1e6*Math.random()|0),Mf=0;function Vf(o,u,h,m,T){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!m,this.ha=T,this.key=++Mf,this.da=this.fa=!1}function ci(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function ui(o){this.src=o,this.g={},this.h=0}ui.prototype.add=function(o,u,h,m,T){var R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);var N=Os(o,u,m,T);return-1<N?(u=o[N],h||(u.fa=!1)):(u=new Vf(u,this.src,R,!!m,T),u.fa=h,o.push(u)),u};function Vs(o,u){var h=u.type;if(h in o.g){var m=o.g[h],T=Array.prototype.indexOf.call(m,u,void 0),R;(R=0<=T)&&Array.prototype.splice.call(m,T,1),R&&(ci(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Os(o,u,h,m){for(var T=0;T<o.length;++T){var R=o[T];if(!R.da&&R.listener==u&&R.capture==!!h&&R.ha==m)return T}return-1}var Fs="closure_lm_"+(1e6*Math.random()|0),Us={};function ol(o,u,h,m,T){if(Array.isArray(u)){for(var R=0;R<u.length;R++)ol(o,u[R],h,m,T);return null}return h=cl(h),o&&o[li]?o.K(u,h,d(m)?!!m.capture:!1,T):Of(o,u,h,!1,m,T)}function Of(o,u,h,m,T,R){if(!u)throw Error("Invalid event type");var N=d(T)?!!T.capture:!!T,re=$s(o);if(re||(o[Fs]=re=new ui(o)),h=re.add(u,h,m,N,R),h.proxy)return h;if(m=Ff(),h.proxy=m,m.src=o,m.listener=h,o.addEventListener)Nf||(T=N),T===void 0&&(T=!1),o.addEventListener(u.toString(),m,T);else if(o.attachEvent)o.attachEvent(ll(u.toString()),m);else if(o.addListener&&o.removeListener)o.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Ff(){function o(h){return u.call(o.src,o.listener,h)}const u=Uf;return o}function al(o,u,h,m,T){if(Array.isArray(u))for(var R=0;R<u.length;R++)al(o,u[R],h,m,T);else m=d(m)?!!m.capture:!!m,h=cl(h),o&&o[li]?(o=o.i,u=String(u).toString(),u in o.g&&(R=o.g[u],h=Os(R,h,m,T),-1<h&&(ci(R[h]),Array.prototype.splice.call(R,h,1),R.length==0&&(delete o.g[u],o.h--)))):o&&(o=$s(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Os(u,h,m,T)),(h=-1<o?u[o]:null)&&Bs(h))}function Bs(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[li])Vs(u.i,o);else{var h=o.type,m=o.proxy;u.removeEventListener?u.removeEventListener(h,m,o.capture):u.detachEvent?u.detachEvent(ll(h),m):u.addListener&&u.removeListener&&u.removeListener(m),(h=$s(u))?(Vs(h,o),h.h==0&&(h.src=null,u[Fs]=null)):ci(o)}}}function ll(o){return o in Us?Us[o]:Us[o]="on"+o}function Uf(o,u){if(o.da)o=!0;else{u=new rr(u,this);var h=o.listener,m=o.ha||o.src;o.fa&&Bs(o),o=h.call(m,u)}return o}function $s(o){return o=o[Fs],o instanceof ui?o:null}var qs="__closure_events_fn_"+(1e9*Math.random()>>>0);function cl(o){return typeof o=="function"?o:(o[qs]||(o[qs]=function(u){return o.handleEvent(u)}),o[qs])}function Ce(){St.call(this),this.i=new ui(this),this.M=this,this.F=null}C(Ce,St),Ce.prototype[li]=!0,Ce.prototype.removeEventListener=function(o,u,h,m){al(this,o,u,h,m)};function Me(o,u){var h,m=o.F;if(m)for(h=[];m;m=m.F)h.push(m);if(o=o.M,m=u.type||u,typeof u=="string")u=new Re(u,o);else if(u instanceof Re)u.target=u.target||o;else{var T=u;u=new Re(m,o),w(u,T)}if(T=!0,h)for(var R=h.length-1;0<=R;R--){var N=u.g=h[R];T=di(N,m,!0,u)&&T}if(N=u.g=o,T=di(N,m,!0,u)&&T,T=di(N,m,!1,u)&&T,h)for(R=0;R<h.length;R++)N=u.g=h[R],T=di(N,m,!1,u)&&T}Ce.prototype.N=function(){if(Ce.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],m=0;m<h.length;m++)ci(h[m]);delete o.g[u],o.h--}}this.F=null},Ce.prototype.K=function(o,u,h,m){return this.i.add(String(o),u,!1,h,m)},Ce.prototype.L=function(o,u,h,m){return this.i.add(String(o),u,!0,h,m)};function di(o,u,h,m){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var T=!0,R=0;R<u.length;++R){var N=u[R];if(N&&!N.da&&N.capture==h){var re=N.listener,we=N.ha||N.src;N.fa&&Vs(o.i,N),T=re.call(we,m)!==!1&&T}}return T&&!m.defaultPrevented}function ul(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function dl(o){o.g=ul(()=>{o.g=null,o.i&&(o.i=!1,dl(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class Bf extends St{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:dl(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ir(o){St.call(this),this.h=o,this.g={}}C(ir,St);var hl=[];function fl(o){J(o.g,function(u,h){this.g.hasOwnProperty(h)&&Bs(u)},o),o.g={}}ir.prototype.N=function(){ir.aa.N.call(this),fl(this)},ir.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var js=l.JSON.stringify,$f=l.JSON.parse,qf=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Hs(){}Hs.prototype.h=null;function ml(o){return o.h||(o.h=o.i())}function pl(){}var sr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function zs(){Re.call(this,"d")}C(zs,Re);function Ws(){Re.call(this,"c")}C(Ws,Re);var Xt={},gl=null;function hi(){return gl=gl||new Ce}Xt.La="serverreachability";function _l(o){Re.call(this,Xt.La,o)}C(_l,Re);function or(o){const u=hi();Me(u,new _l(u))}Xt.STAT_EVENT="statevent";function yl(o,u){Re.call(this,Xt.STAT_EVENT,o),this.stat=u}C(yl,Re);function Ve(o){const u=hi();Me(u,new yl(u,o))}Xt.Ma="timingevent";function vl(o,u){Re.call(this,Xt.Ma,o),this.size=u}C(vl,Re);function ar(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function lr(){this.g=!0}lr.prototype.xa=function(){this.g=!1};function jf(o,u,h,m,T,R){o.info(function(){if(o.g)if(R)for(var N="",re=R.split("&"),we=0;we<re.length;we++){var Z=re[we].split("=");if(1<Z.length){var Se=Z[0];Z=Z[1];var ke=Se.split("_");N=2<=ke.length&&ke[1]=="type"?N+(Se+"="+Z+"&"):N+(Se+"=redacted&")}}else N=null;else N=R;return"XMLHTTP REQ ("+m+") [attempt "+T+"]: "+u+`
`+h+`
`+N})}function Hf(o,u,h,m,T,R,N){o.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+T+"]: "+u+`
`+h+`
`+R+" "+N})}function wn(o,u,h,m){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Wf(o,h)+(m?" "+m:"")})}function zf(o,u){o.info(function(){return"TIMEOUT: "+u})}lr.prototype.info=function(){};function Wf(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var m=h[o];if(!(2>m.length)){var T=m[1];if(Array.isArray(T)&&!(1>T.length)){var R=T[0];if(R!="noop"&&R!="stop"&&R!="close")for(var N=1;N<T.length;N++)T[N]=""}}}}return js(h)}catch{return u}}var fi={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},wl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Gs;function mi(){}C(mi,Hs),mi.prototype.g=function(){return new XMLHttpRequest},mi.prototype.i=function(){return{}},Gs=new mi;function kt(o,u,h,m){this.j=o,this.i=u,this.l=h,this.R=m||1,this.U=new ir(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new El}function El(){this.i=null,this.g="",this.h=!1}var bl={},Ks={};function Qs(o,u,h){o.L=1,o.v=yi(ft(u)),o.m=h,o.P=!0,Il(o,null)}function Il(o,u){o.F=Date.now(),pi(o),o.A=ft(o.v);var h=o.A,m=o.R;Array.isArray(m)||(m=[String(m)]),Ol(h.i,"t",m),o.C=0,h=o.j.J,o.h=new El,o.g=tc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new Bf(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,m=o.ca;var T="readystatechange";Array.isArray(T)||(T&&(hl[0]=T.toString()),T=hl);for(var R=0;R<T.length;R++){var N=ol(h,T[R],m||u.handleEvent,!1,u.h||u);if(!N)break;u.g[N.key]=N}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),or(),jf(o.i,o.u,o.A,o.l,o.R,o.m)}kt.prototype.ca=function(o){o=o.target;const u=this.M;u&&mt(o)==3?u.j():this.Y(o)},kt.prototype.Y=function(o){try{if(o==this.g)e:{const ke=mt(this.g);var u=this.g.Ba();const In=this.g.Z();if(!(3>ke)&&(ke!=3||this.g&&(this.h.h||this.g.oa()||Hl(this.g)))){this.J||ke!=4||u==7||(u==8||0>=In?or(3):or(2)),Xs(this);var h=this.g.Z();this.X=h;t:if(Tl(this)){var m=Hl(this.g);o="";var T=m.length,R=mt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Yt(this),cr(this);var N="";break t}this.h.i=new l.TextDecoder}for(u=0;u<T;u++)this.h.h=!0,o+=this.h.i.decode(m[u],{stream:!(R&&u==T-1)});m.length=0,this.h.g+=o,this.C=0,N=this.h.g}else N=this.g.oa();if(this.o=h==200,Hf(this.i,this.u,this.A,this.l,this.R,ke,h),this.o){if(this.T&&!this.K){t:{if(this.g){var re,we=this.g;if((re=we.g?we.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!$(re)){var Z=re;break t}}Z=null}if(h=Z)wn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ys(this,h);else{this.o=!1,this.s=3,Ve(12),Yt(this),cr(this);break e}}if(this.P){h=!0;let Ze;for(;!this.J&&this.C<N.length;)if(Ze=Gf(this,N),Ze==Ks){ke==4&&(this.s=4,Ve(14),h=!1),wn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ze==bl){this.s=4,Ve(15),wn(this.i,this.l,N,"[Invalid Chunk]"),h=!1;break}else wn(this.i,this.l,Ze,null),Ys(this,Ze);if(Tl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ke!=4||N.length!=0||this.h.h||(this.s=1,Ve(16),h=!1),this.o=this.o&&h,!h)wn(this.i,this.l,N,"[Invalid Chunked Response]"),Yt(this),cr(this);else if(0<N.length&&!this.W){this.W=!0;var Se=this.j;Se.g==this&&Se.ba&&!Se.M&&(Se.j.info("Great, no buffering proxy detected. Bytes received: "+N.length),ro(Se),Se.M=!0,Ve(11))}}else wn(this.i,this.l,N,null),Ys(this,N);ke==4&&Yt(this),this.o&&!this.J&&(ke==4?Yl(this.j,this):(this.o=!1,pi(this)))}else um(this.g),h==400&&0<N.indexOf("Unknown SID")?(this.s=3,Ve(12)):(this.s=0,Ve(13)),Yt(this),cr(this)}}}catch{}finally{}};function Tl(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Gf(o,u){var h=o.C,m=u.indexOf(`
`,h);return m==-1?Ks:(h=Number(u.substring(h,m)),isNaN(h)?bl:(m+=1,m+h>u.length?Ks:(u=u.slice(m,m+h),o.C=m+h,u)))}kt.prototype.cancel=function(){this.J=!0,Yt(this)};function pi(o){o.S=Date.now()+o.I,Al(o,o.I)}function Al(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=ar(v(o.ba,o),u)}function Xs(o){o.B&&(l.clearTimeout(o.B),o.B=null)}kt.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(zf(this.i,this.A),this.L!=2&&(or(),Ve(17)),Yt(this),this.s=2,cr(this)):Al(this,this.S-o)};function cr(o){o.j.G==0||o.J||Yl(o.j,o)}function Yt(o){Xs(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,fl(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Ys(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Js(h.h,o))){if(!o.K&&Js(h.h,o)&&h.G==3){try{var m=h.Da.g.parse(u)}catch{m=null}if(Array.isArray(m)&&m.length==3){var T=m;if(T[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Ti(h),bi(h);else break e;no(h),Ve(18)}}else h.za=T[1],0<h.za-h.T&&37500>T[2]&&h.F&&h.v==0&&!h.C&&(h.C=ar(v(h.Za,h),6e3));if(1>=Sl(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Zt(h,11)}else if((o.K||h.g==o)&&Ti(h),!$(u))for(T=h.Da.g.parse(u),u=0;u<T.length;u++){let Z=T[u];if(h.T=Z[0],Z=Z[1],h.G==2)if(Z[0]=="c"){h.K=Z[1],h.ia=Z[2];const Se=Z[3];Se!=null&&(h.la=Se,h.j.info("VER="+h.la));const ke=Z[4];ke!=null&&(h.Aa=ke,h.j.info("SVER="+h.Aa));const In=Z[5];In!=null&&typeof In=="number"&&0<In&&(m=1.5*In,h.L=m,h.j.info("backChannelRequestTimeoutMs_="+m)),m=h;const Ze=o.g;if(Ze){const Ri=Ze.g?Ze.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ri){var R=m.h;R.g||Ri.indexOf("spdy")==-1&&Ri.indexOf("quic")==-1&&Ri.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Zs(R,R.h),R.h=null))}if(m.D){const io=Ze.g?Ze.g.getResponseHeader("X-HTTP-Session-Id"):null;io&&(m.ya=io,se(m.I,m.D,io))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),m=h;var N=o;if(m.qa=ec(m,m.J?m.ia:null,m.W),N.K){kl(m.h,N);var re=N,we=m.L;we&&(re.I=we),re.B&&(Xs(re),pi(re)),m.g=N}else Ql(m);0<h.i.length&&Ii(h)}else Z[0]!="stop"&&Z[0]!="close"||Zt(h,7);else h.G==3&&(Z[0]=="stop"||Z[0]=="close"?Z[0]=="stop"?Zt(h,7):to(h):Z[0]!="noop"&&h.l&&h.l.ta(Z),h.v=0)}}or(4)}catch{}}var Kf=class{constructor(o,u){this.g=o,this.map=u}};function Rl(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Cl(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Sl(o){return o.h?1:o.g?o.g.size:0}function Js(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Zs(o,u){o.g?o.g.add(u):o.h=u}function kl(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Rl.prototype.cancel=function(){if(this.i=Pl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Pl(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return D(o.i)}function Qf(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,m=0;m<h;m++)u.push(o[m]);return u}u=[],h=0;for(m in o)u[h++]=o[m];return u}function Xf(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const m in o)u[h++]=m;return u}}}function xl(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=Xf(o),m=Qf(o),T=m.length,R=0;R<T;R++)u.call(void 0,m[R],h&&h[R],o)}var Dl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Yf(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var m=o[h].indexOf("="),T=null;if(0<=m){var R=o[h].substring(0,m);T=o[h].substring(m+1)}else R=o[h];u(R,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function Jt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Jt){this.h=o.h,gi(this,o.j),this.o=o.o,this.g=o.g,_i(this,o.s),this.l=o.l;var u=o.i,h=new hr;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),Nl(this,h),this.m=o.m}else o&&(u=String(o).match(Dl))?(this.h=!1,gi(this,u[1]||"",!0),this.o=ur(u[2]||""),this.g=ur(u[3]||"",!0),_i(this,u[4]),this.l=ur(u[5]||"",!0),Nl(this,u[6]||"",!0),this.m=ur(u[7]||"")):(this.h=!1,this.i=new hr(null,this.h))}Jt.prototype.toString=function(){var o=[],u=this.j;u&&o.push(dr(u,Ll,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(dr(u,Ll,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(dr(h,h.charAt(0)=="/"?em:Zf,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",dr(h,nm)),o.join("")};function ft(o){return new Jt(o)}function gi(o,u,h){o.j=h?ur(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function _i(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function Nl(o,u,h){u instanceof hr?(o.i=u,rm(o.i,o.h)):(h||(u=dr(u,tm)),o.i=new hr(u,o.h))}function se(o,u,h){o.i.set(u,h)}function yi(o){return se(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function ur(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function dr(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Jf),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Jf(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Ll=/[#\/\?@]/g,Zf=/[#\?:]/g,em=/[#\?]/g,tm=/[#\?@]/g,nm=/#/g;function hr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Pt(o){o.g||(o.g=new Map,o.h=0,o.i&&Yf(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=hr.prototype,n.add=function(o,u){Pt(this),this.i=null,o=En(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Ml(o,u){Pt(o),u=En(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Vl(o,u){return Pt(o),u=En(o,u),o.g.has(u)}n.forEach=function(o,u){Pt(this),this.g.forEach(function(h,m){h.forEach(function(T){o.call(u,T,m,this)},this)},this)},n.na=function(){Pt(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let m=0;m<u.length;m++){const T=o[m];for(let R=0;R<T.length;R++)h.push(u[m])}return h},n.V=function(o){Pt(this);let u=[];if(typeof o=="string")Vl(this,o)&&(u=u.concat(this.g.get(En(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return Pt(this),this.i=null,o=En(this,o),Vl(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Ol(o,u,h){Ml(o,u),0<h.length&&(o.i=null,o.g.set(En(o,u),D(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var m=u[h];const R=encodeURIComponent(String(m)),N=this.V(m);for(m=0;m<N.length;m++){var T=R;N[m]!==""&&(T+="="+encodeURIComponent(String(N[m]))),o.push(T)}}return this.i=o.join("&")};function En(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function rm(o,u){u&&!o.j&&(Pt(o),o.i=null,o.g.forEach(function(h,m){var T=m.toLowerCase();m!=T&&(Ml(this,m),Ol(this,T,h))},o)),o.j=u}function im(o,u){const h=new lr;if(l.Image){const m=new Image;m.onload=b(xt,h,"TestLoadImage: loaded",!0,u,m),m.onerror=b(xt,h,"TestLoadImage: error",!1,u,m),m.onabort=b(xt,h,"TestLoadImage: abort",!1,u,m),m.ontimeout=b(xt,h,"TestLoadImage: timeout",!1,u,m),l.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=o}else u(!1)}function sm(o,u){const h=new lr,m=new AbortController,T=setTimeout(()=>{m.abort(),xt(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:m.signal}).then(R=>{clearTimeout(T),R.ok?xt(h,"TestPingServer: ok",!0,u):xt(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(T),xt(h,"TestPingServer: error",!1,u)})}function xt(o,u,h,m,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),m(h)}catch{}}function om(){this.g=new qf}function am(o,u,h){const m=h||"";try{xl(o,function(T,R){let N=T;d(T)&&(N=js(T)),u.push(m+R+"="+encodeURIComponent(N))})}catch(T){throw u.push(m+"type="+encodeURIComponent("_badmap")),T}}function vi(o){this.l=o.Ub||null,this.j=o.eb||!1}C(vi,Hs),vi.prototype.g=function(){return new wi(this.l,this.j)},vi.prototype.i=function(o){return function(){return o}}({});function wi(o,u){Ce.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(wi,Ce),n=wi.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,mr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,fr(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,mr(this)),this.g&&(this.readyState=3,mr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Fl(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Fl(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?fr(this):mr(this),this.readyState==3&&Fl(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,fr(this))},n.Qa=function(o){this.g&&(this.response=o,fr(this))},n.ga=function(){this.g&&fr(this)};function fr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,mr(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function mr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(wi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Ul(o){let u="";return J(o,function(h,m){u+=m,u+=":",u+=h,u+=`\r
`}),u}function eo(o,u,h){e:{for(m in h){var m=!1;break e}m=!0}m||(h=Ul(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):se(o,u,h))}function he(o){Ce.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(he,Ce);var lm=/^https?$/i,cm=["POST","PUT"];n=he.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Gs.g(),this.v=this.o?ml(this.o):ml(Gs),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(R){Bl(this,R);return}if(o=h||"",h=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var T in m)h.set(T,m[T]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const R of m.keys())h.set(R,m.get(R));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),T=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(cm,u,void 0))||m||T||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,N]of h)this.g.setRequestHeader(R,N);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{jl(this),this.u=!0,this.g.send(o),this.u=!1}catch(R){Bl(this,R)}};function Bl(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,$l(o),Ei(o)}function $l(o){o.A||(o.A=!0,Me(o,"complete"),Me(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Me(this,"complete"),Me(this,"abort"),Ei(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ei(this,!0)),he.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?ql(this):this.bb())},n.bb=function(){ql(this)};function ql(o){if(o.h&&typeof a<"u"&&(!o.v[1]||mt(o)!=4||o.Z()!=2)){if(o.u&&mt(o)==4)ul(o.Ea,0,o);else if(Me(o,"readystatechange"),mt(o)==4){o.h=!1;try{const N=o.Z();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var m;if(m=N===0){var T=String(o.D).match(Dl)[1]||null;!T&&l.self&&l.self.location&&(T=l.self.location.protocol.slice(0,-1)),m=!lm.test(T?T.toLowerCase():"")}h=m}if(h)Me(o,"complete"),Me(o,"success");else{o.m=6;try{var R=2<mt(o)?o.g.statusText:""}catch{R=""}o.l=R+" ["+o.Z()+"]",$l(o)}}finally{Ei(o)}}}}function Ei(o,u){if(o.g){jl(o);const h=o.g,m=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Me(o,"ready");try{h.onreadystatechange=m}catch{}}}function jl(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function mt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<mt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),$f(u)}};function Hl(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function um(o){const u={};o=(o.g&&2<=mt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<o.length;m++){if($(o[m]))continue;var h=I(o[m]);const T=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=u[T]||[];u[T]=R,R.push(h)}E(u,function(m){return m.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function pr(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function zl(o){this.Aa=0,this.i=[],this.j=new lr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=pr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=pr("baseRetryDelayMs",5e3,o),this.cb=pr("retryDelaySeedMs",1e4,o),this.Wa=pr("forwardChannelMaxRetries",2,o),this.wa=pr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Rl(o&&o.concurrentRequestLimit),this.Da=new om,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=zl.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,m){Ve(0),this.W=o,this.H=u||{},h&&m!==void 0&&(this.H.OSID=h,this.H.OAID=m),this.F=this.X,this.I=ec(this,null,this.W),Ii(this)};function to(o){if(Wl(o),o.G==3){var u=o.U++,h=ft(o.I);if(se(h,"SID",o.K),se(h,"RID",u),se(h,"TYPE","terminate"),gr(o,h),u=new kt(o,o.j,u),u.L=2,u.v=yi(ft(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=tc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),pi(u)}Zl(o)}function bi(o){o.g&&(ro(o),o.g.cancel(),o.g=null)}function Wl(o){bi(o),o.u&&(l.clearTimeout(o.u),o.u=null),Ti(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ii(o){if(!Cl(o.h)&&!o.s){o.s=!0;var u=o.Ga;tr||sl(),nr||(tr(),nr=!0),Ms.add(u,o),o.B=0}}function dm(o,u){return Sl(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=ar(v(o.Ga,o,u),Jl(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const T=new kt(this,this.j,o);let R=this.o;if(this.S&&(R?(R=g(R),w(R,this.S)):R=this.S),this.m!==null||this.O||(T.H=R,R=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var m=this.i[h];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(u+=m,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Kl(this,T,u),h=ft(this.I),se(h,"RID",o),se(h,"CVER",22),this.D&&se(h,"X-HTTP-Session-Id",this.D),gr(this,h),R&&(this.O?u="headers="+encodeURIComponent(String(Ul(R)))+"&"+u:this.m&&eo(h,this.m,R)),Zs(this.h,T),this.Ua&&se(h,"TYPE","init"),this.P?(se(h,"$req",u),se(h,"SID","null"),T.T=!0,Qs(T,h,null)):Qs(T,h,u),this.G=2}}else this.G==3&&(o?Gl(this,o):this.i.length==0||Cl(this.h)||Gl(this))};function Gl(o,u){var h;u?h=u.l:h=o.U++;const m=ft(o.I);se(m,"SID",o.K),se(m,"RID",h),se(m,"AID",o.T),gr(o,m),o.m&&o.o&&eo(m,o.m,o.o),h=new kt(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Kl(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Zs(o.h,h),Qs(h,m,u)}function gr(o,u){o.H&&J(o.H,function(h,m){se(u,m,h)}),o.l&&xl({},function(h,m){se(u,m,h)})}function Kl(o,u,h){h=Math.min(o.i.length,h);var m=o.l?v(o.l.Na,o.l,o):null;e:{var T=o.i;let R=-1;for(;;){const N=["count="+h];R==-1?0<h?(R=T[0].g,N.push("ofs="+R)):R=0:N.push("ofs="+R);let re=!0;for(let we=0;we<h;we++){let Z=T[we].g;const Se=T[we].map;if(Z-=R,0>Z)R=Math.max(0,T[we].g-100),re=!1;else try{am(Se,N,"req"+Z+"_")}catch{m&&m(Se)}}if(re){m=N.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,m}function Ql(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;tr||sl(),nr||(tr(),nr=!0),Ms.add(u,o),o.v=0}}function no(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=ar(v(o.Fa,o),Jl(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Xl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=ar(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ve(10),bi(this),Xl(this))};function ro(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Xl(o){o.g=new kt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=ft(o.qa);se(u,"RID","rpc"),se(u,"SID",o.K),se(u,"AID",o.T),se(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&se(u,"TO",o.ja),se(u,"TYPE","xmlhttp"),gr(o,u),o.m&&o.o&&eo(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=yi(ft(u)),h.m=null,h.P=!0,Il(h,o)}n.Za=function(){this.C!=null&&(this.C=null,bi(this),no(this),Ve(19))};function Ti(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Yl(o,u){var h=null;if(o.g==u){Ti(o),ro(o),o.g=null;var m=2}else if(Js(o.h,u))h=u.D,kl(o.h,u),m=1;else return;if(o.G!=0){if(u.o)if(m==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var T=o.B;m=hi(),Me(m,new vl(m,h)),Ii(o)}else Ql(o);else if(T=u.s,T==3||T==0&&0<u.X||!(m==1&&dm(o,u)||m==2&&no(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),T){case 1:Zt(o,5);break;case 4:Zt(o,10);break;case 3:Zt(o,6);break;default:Zt(o,2)}}}function Jl(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Zt(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),m=o.Xa;const T=!m;m=new Jt(m||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||gi(m,"https"),yi(m),T?im(m.toString(),h):sm(m.toString(),h)}else Ve(2);o.G=0,o.l&&o.l.sa(u),Zl(o),Wl(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Ve(2)):(this.j.info("Failed to ping google.com"),Ve(1))};function Zl(o){if(o.G=0,o.ka=[],o.l){const u=Pl(o.h);(u.length!=0||o.i.length!=0)&&(k(o.ka,u),k(o.ka,o.i),o.h.i.length=0,D(o.i),o.i.length=0),o.l.ra()}}function ec(o,u,h){var m=h instanceof Jt?ft(h):new Jt(h);if(m.g!="")u&&(m.g=u+"."+m.g),_i(m,m.s);else{var T=l.location;m=T.protocol,u=u?u+"."+T.hostname:T.hostname,T=+T.port;var R=new Jt(null);m&&gi(R,m),u&&(R.g=u),T&&_i(R,T),h&&(R.l=h),m=R}return h=o.D,u=o.ya,h&&u&&se(m,h,u),se(m,"VER",o.la),gr(o,m),m}function tc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new he(new vi({eb:h})):new he(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function nc(){}n=nc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ai(){}Ai.prototype.g=function(o,u){return new We(o,u)};function We(o,u){Ce.call(this),this.g=new zl(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!$(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!$(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new bn(this)}C(We,Ce),We.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},We.prototype.close=function(){to(this.g)},We.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=js(o),o=h);u.i.push(new Kf(u.Ya++,o)),u.G==3&&Ii(u)},We.prototype.N=function(){this.g.l=null,delete this.j,to(this.g),delete this.g,We.aa.N.call(this)};function rc(o){zs.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}C(rc,zs);function ic(){Ws.call(this),this.status=1}C(ic,Ws);function bn(o){this.g=o}C(bn,nc),bn.prototype.ua=function(){Me(this.g,"a")},bn.prototype.ta=function(o){Me(this.g,new rc(o))},bn.prototype.sa=function(o){Me(this.g,new ic)},bn.prototype.ra=function(){Me(this.g,"b")},Ai.prototype.createWebChannel=Ai.prototype.g,We.prototype.send=We.prototype.o,We.prototype.open=We.prototype.m,We.prototype.close=We.prototype.close,Ju=function(){return new Ai},Yu=function(){return hi()},Xu=Xt,xo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},fi.NO_ERROR=0,fi.TIMEOUT=8,fi.HTTP_ERROR=6,Mi=fi,wl.COMPLETE="complete",Qu=wl,pl.EventType=sr,sr.OPEN="a",sr.CLOSE="b",sr.ERROR="c",sr.MESSAGE="d",Ce.prototype.listen=Ce.prototype.K,Er=pl,he.prototype.listenOnce=he.prototype.L,he.prototype.getLastError=he.prototype.Ka,he.prototype.getLastErrorCode=he.prototype.Ba,he.prototype.getStatus=he.prototype.Z,he.prototype.getResponseJson=he.prototype.Oa,he.prototype.getResponseText=he.prototype.oa,he.prototype.send=he.prototype.ea,he.prototype.setWithCredentials=he.prototype.Ha,Ku=he}).apply(typeof Ci<"u"?Ci:typeof self<"u"?self:typeof window<"u"?window:{});const gc="@firebase/firestore";/**
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
 */class xe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}xe.UNAUTHENTICATED=new xe(null),xe.GOOGLE_CREDENTIALS=new xe("google-credentials-uid"),xe.FIRST_PARTY=new xe("first-party-uid"),xe.MOCK_USER=new xe("mock-user");/**
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
 */let Gn="10.14.0";/**
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
 */const ln=new ra("@firebase/firestore");function _r(){return ln.logLevel}function V(n,...e){if(ln.logLevel<=Q.DEBUG){const t=e.map(oa);ln.debug(`Firestore (${Gn}): ${n}`,...t)}}function It(n,...e){if(ln.logLevel<=Q.ERROR){const t=e.map(oa);ln.error(`Firestore (${Gn}): ${n}`,...t)}}function On(n,...e){if(ln.logLevel<=Q.WARN){const t=e.map(oa);ln.warn(`Firestore (${Gn}): ${n}`,...t)}}function oa(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
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
 */function H(n="Unexpected state"){const e=`FIRESTORE (${Gn}) INTERNAL ASSERTION FAILED: `+n;throw It(e),new Error(e)}function te(n,e){n||H()}function W(n,e){return n}/**
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
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class M extends dt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class vt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Zu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class zp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(xe.UNAUTHENTICATED))}shutdown(){}}class Wp{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Gp{constructor(e){this.t=e,this.currentUser=xe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){te(this.o===void 0);let r=this.i;const i=c=>this.i!==r?(r=this.i,t(c)):Promise.resolve();let s=new vt;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new vt,e.enqueueRetryable(()=>i(this.currentUser))};const a=()=>{const c=s;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new vt)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(te(typeof r.accessToken=="string"),new Zu(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return te(e===null||typeof e=="string"),new xe(e)}}class Kp{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=xe.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Qp{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new Kp(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(xe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Xp{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Yp{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){te(this.o===void 0);const r=s=>{s.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.R;return this.R=s.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(te(typeof t.token=="string"),this.R=t.token,new Xp(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Jp(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class ed{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=Jp(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%e.length))}return r}}function ee(n,e){return n<e?-1:n>e?1:0}function Fn(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}/**
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
 */class ge{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new M(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ge.fromMillis(Date.now())}static fromDate(e){return ge.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ge(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ee(this.nanoseconds,e.nanoseconds):ee(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class z{constructor(e){this.timestamp=e}static fromTimestamp(e){return new z(e)}static min(){return new z(new ge(0,0))}static max(){return new z(new ge(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class Mr{constructor(e,t,r){t===void 0?t=0:t>e.length&&H(),r===void 0?r=e.length-t:r>e.length-t&&H(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Mr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Mr?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=e.get(i),a=t.get(i);if(s<a)return-1;if(s>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class oe extends Mr{construct(e,t,r){return new oe(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new M(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new oe(t)}static emptyPath(){return new oe([])}}const Zp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class be extends Mr{construct(e,t,r){return new be(e,t,r)}static isValidIdentifier(e){return Zp.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new be(["__name__"])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new M(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new M(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new M(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,i+=2}else l==="`"?(a=!a,i++):l!=="."||a?(r+=l,i++):(s(),i++)}if(s(),a)throw new M(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new be(t)}static emptyPath(){return new be([])}}/**
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
 */class O{constructor(e){this.path=e}static fromPath(e){return new O(oe.fromString(e))}static fromName(e){return new O(oe.fromString(e).popFirst(5))}static empty(){return new O(oe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&oe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return oe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new O(new oe(e.slice()))}}function eg(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=z.fromTimestamp(r===1e9?new ge(t+1,0):new ge(t,r));return new jt(i,O.empty(),e)}function tg(n){return new jt(n.readTime,n.key,-1)}class jt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new jt(z.min(),O.empty(),-1)}static max(){return new jt(z.max(),O.empty(),-1)}}function ng(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=O.comparator(n.documentKey,e.documentKey),t!==0?t:ee(n.largestBatchId,e.largestBatchId))}/**
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
 */const rg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ig{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function Gr(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==rg)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&H(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let i=0,s=0,a=!1;e.forEach(l=>{++i,l.next(()=>{++s,a&&s===i&&t()},c=>r(c))}),a=!0,s===i&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(i=>i?P.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new P((r,i)=>{const s=e.length,a=new Array(s);let l=0;for(let c=0;c<s;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===s&&r(a)},f=>i(f))}})}static doWhile(e,t){return new P((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}function sg(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Kr(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class aa{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}aa.oe=-1;function cs(n){return n==null}function Wi(n){return n===0&&1/n==-1/0}function og(n){return typeof n=="number"&&Number.isInteger(n)&&!Wi(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function _c(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function pn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function td(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class ue{constructor(e,t){this.comparator=e,this.root=t||Ee.EMPTY}insert(e,t){return new ue(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ee.BLACK,null,null))}remove(e){return new ue(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ee.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Si(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Si(this.root,e,this.comparator,!1)}getReverseIterator(){return new Si(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Si(this.root,e,this.comparator,!0)}}class Si{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ee{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??Ee.RED,this.left=i??Ee.EMPTY,this.right=s??Ee.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new Ee(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Ee.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Ee.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ee.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ee.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw H();const e=this.left.check();if(e!==this.right.check())throw H();return e+(this.isRed()?0:1)}}Ee.EMPTY=null,Ee.RED=!0,Ee.BLACK=!1;Ee.EMPTY=new class{constructor(){this.size=0}get key(){throw H()}get value(){throw H()}get color(){throw H()}get left(){throw H()}get right(){throw H()}copy(e,t,r,i,s){return this}insert(e,t,r){return new Ee(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Ie{constructor(e){this.comparator=e,this.data=new ue(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new yc(this.data.getIterator())}getIteratorFrom(e){return new yc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof Ie)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ie(this.comparator);return t.data=e,t}}class yc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Ge{constructor(e){this.fields=e,e.sort(be.comparator)}static empty(){return new Ge([])}unionWith(e){let t=new Ie(be.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Ge(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Fn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class nd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ae{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new nd("Invalid base64 string: "+s):s}}(e);return new Ae(t)}static fromUint8Array(e){const t=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new Ae(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ee(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ae.EMPTY_BYTE_STRING=new Ae("");const ag=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ht(n){if(te(!!n),typeof n=="string"){let e=0;const t=ag.exec(n);if(te(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:fe(n.seconds),nanos:fe(n.nanos)}}function fe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function cn(n){return typeof n=="string"?Ae.fromBase64String(n):Ae.fromUint8Array(n)}/**
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
 */function la(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function ca(n){const e=n.mapValue.fields.__previous_value__;return la(e)?ca(e):e}function Vr(n){const e=Ht(n.mapValue.fields.__local_write_time__.timestampValue);return new ge(e.seconds,e.nanos)}/**
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
 */class lg{constructor(e,t,r,i,s,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Or{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Or("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Or&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const ki={mapValue:{}};function un(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?la(n)?4:ug(n)?9007199254740991:cg(n)?10:11:H()}function ut(n,e){if(n===e)return!0;const t=un(n);if(t!==un(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Vr(n).isEqual(Vr(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=Ht(i.timestampValue),l=Ht(s.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return cn(i.bytesValue).isEqual(cn(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return fe(i.geoPointValue.latitude)===fe(s.geoPointValue.latitude)&&fe(i.geoPointValue.longitude)===fe(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return fe(i.integerValue)===fe(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=fe(i.doubleValue),l=fe(s.doubleValue);return a===l?Wi(a)===Wi(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return Fn(n.arrayValue.values||[],e.arrayValue.values||[],ut);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},l=s.mapValue.fields||{};if(_c(a)!==_c(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!ut(a[c],l[c])))return!1;return!0}(n,e);default:return H()}}function Fr(n,e){return(n.values||[]).find(t=>ut(t,e))!==void 0}function Un(n,e){if(n===e)return 0;const t=un(n),r=un(e);if(t!==r)return ee(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return ee(n.booleanValue,e.booleanValue);case 2:return function(s,a){const l=fe(s.integerValue||s.doubleValue),c=fe(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return vc(n.timestampValue,e.timestampValue);case 4:return vc(Vr(n),Vr(e));case 5:return ee(n.stringValue,e.stringValue);case 6:return function(s,a){const l=cn(s),c=cn(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(s,a){const l=s.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=ee(l[d],c[d]);if(f!==0)return f}return ee(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,a){const l=ee(fe(s.latitude),fe(a.latitude));return l!==0?l:ee(fe(s.longitude),fe(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return wc(n.arrayValue,e.arrayValue);case 10:return function(s,a){var l,c,d,f;const p=s.fields||{},v=a.fields||{},b=(l=p.value)===null||l===void 0?void 0:l.arrayValue,C=(c=v.value)===null||c===void 0?void 0:c.arrayValue,D=ee(((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0,((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0);return D!==0?D:wc(b,C)}(n.mapValue,e.mapValue);case 11:return function(s,a){if(s===ki.mapValue&&a===ki.mapValue)return 0;if(s===ki.mapValue)return 1;if(a===ki.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let p=0;p<c.length&&p<f.length;++p){const v=ee(c[p],f[p]);if(v!==0)return v;const b=Un(l[c[p]],d[f[p]]);if(b!==0)return b}return ee(c.length,f.length)}(n.mapValue,e.mapValue);default:throw H()}}function vc(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ee(n,e);const t=Ht(n),r=Ht(e),i=ee(t.seconds,r.seconds);return i!==0?i:ee(t.nanos,r.nanos)}function wc(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=Un(t[i],r[i]);if(s)return s}return ee(t.length,r.length)}function Bn(n){return Do(n)}function Do(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Ht(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return cn(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return O.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=Do(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of r)s?s=!1:i+=",",i+=`${a}:${Do(t.fields[a])}`;return i+"}"}(n.mapValue):H()}function Ec(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function No(n){return!!n&&"integerValue"in n}function ua(n){return!!n&&"arrayValue"in n}function bc(n){return!!n&&"nullValue"in n}function Ic(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Vi(n){return!!n&&"mapValue"in n}function cg(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Rr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return pn(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Rr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Rr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function ug(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class $e{constructor(e){this.value=e}static empty(){return new $e({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Vi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Rr(t)}setAll(e){let t=be.emptyPath(),r={},i=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,r,i),r={},i=[],t=l.popLast()}a?r[l.lastSegment()]=Rr(a):i.push(l.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());Vi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ut(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];Vi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){pn(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new $e(Rr(this.value))}}function rd(n){const e=[];return pn(n.fields,(t,r)=>{const i=new be([t]);if(Vi(r)){const s=rd(r.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)}),new Ge(e)}/**
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
 */class De{constructor(e,t,r,i,s,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=l}static newInvalidDocument(e){return new De(e,0,z.min(),z.min(),z.min(),$e.empty(),0)}static newFoundDocument(e,t,r,i){return new De(e,1,t,z.min(),r,i,0)}static newNoDocument(e,t){return new De(e,2,t,z.min(),z.min(),$e.empty(),0)}static newUnknownDocument(e,t){return new De(e,3,t,z.min(),z.min(),$e.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(z.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=$e.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=$e.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=z.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof De&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new De(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Gi{constructor(e,t){this.position=e,this.inclusive=t}}function Tc(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],a=n.position[i];if(s.field.isKeyField()?r=O.comparator(O.fromName(a.referenceValue),t.key):r=Un(a,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Ac(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ut(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Ur{constructor(e,t="asc"){this.field=e,this.dir=t}}function dg(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class id{}class pe extends id{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new fg(e,t,r):t==="array-contains"?new gg(e,r):t==="in"?new _g(e,r):t==="not-in"?new yg(e,r):t==="array-contains-any"?new vg(e,r):new pe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new mg(e,r):new pg(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Un(t,this.value)):t!==null&&un(this.value)===un(t)&&this.matchesComparison(Un(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return H()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tt extends id{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new tt(e,t)}matches(e){return sd(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function sd(n){return n.op==="and"}function od(n){return hg(n)&&sd(n)}function hg(n){for(const e of n.filters)if(e instanceof tt)return!1;return!0}function Lo(n){if(n instanceof pe)return n.field.canonicalString()+n.op.toString()+Bn(n.value);if(od(n))return n.filters.map(e=>Lo(e)).join(",");{const e=n.filters.map(t=>Lo(t)).join(",");return`${n.op}(${e})`}}function ad(n,e){return n instanceof pe?function(r,i){return i instanceof pe&&r.op===i.op&&r.field.isEqual(i.field)&&ut(r.value,i.value)}(n,e):n instanceof tt?function(r,i){return i instanceof tt&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,a,l)=>s&&ad(a,i.filters[l]),!0):!1}(n,e):void H()}function ld(n){return n instanceof pe?function(t){return`${t.field.canonicalString()} ${t.op} ${Bn(t.value)}`}(n):n instanceof tt?function(t){return t.op.toString()+" {"+t.getFilters().map(ld).join(" ,")+"}"}(n):"Filter"}class fg extends pe{constructor(e,t,r){super(e,t,r),this.key=O.fromName(r.referenceValue)}matches(e){const t=O.comparator(e.key,this.key);return this.matchesComparison(t)}}class mg extends pe{constructor(e,t){super(e,"in",t),this.keys=cd("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class pg extends pe{constructor(e,t){super(e,"not-in",t),this.keys=cd("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function cd(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>O.fromName(r.referenceValue))}class gg extends pe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ua(t)&&Fr(t.arrayValue,this.value)}}class _g extends pe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Fr(this.value.arrayValue,t)}}class yg extends pe{constructor(e,t){super(e,"not-in",t)}matches(e){if(Fr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Fr(this.value.arrayValue,t)}}class vg extends pe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ua(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Fr(this.value.arrayValue,r))}}/**
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
 */class wg{constructor(e,t=null,r=[],i=[],s=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=l,this.ue=null}}function Rc(n,e=null,t=[],r=[],i=null,s=null,a=null){return new wg(n,e,t,r,i,s,a)}function da(n){const e=W(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Lo(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),cs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Bn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Bn(r)).join(",")),e.ue=t}return e.ue}function ha(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!dg(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!ad(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ac(n.startAt,e.startAt)&&Ac(n.endAt,e.endAt)}function Mo(n){return O.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Kn{constructor(e,t=null,r=[],i=[],s=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Eg(n,e,t,r,i,s,a,l){return new Kn(n,e,t,r,i,s,a,l)}function us(n){return new Kn(n)}function Cc(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ud(n){return n.collectionGroup!==null}function Cr(n){const e=W(n);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new Ie(be.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new Ur(s,r))}),t.has(be.keyField().canonicalString())||e.ce.push(new Ur(be.keyField(),r))}return e.ce}function ot(n){const e=W(n);return e.le||(e.le=bg(e,Cr(n))),e.le}function bg(n,e){if(n.limitType==="F")return Rc(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Ur(i.field,s)});const t=n.endAt?new Gi(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Gi(n.startAt.position,n.startAt.inclusive):null;return Rc(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Vo(n,e){const t=n.filters.concat([e]);return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Oo(n,e,t){return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ds(n,e){return ha(ot(n),ot(e))&&n.limitType===e.limitType}function dd(n){return`${da(ot(n))}|lt:${n.limitType}`}function An(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>ld(i)).join(", ")}]`),cs(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>Bn(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>Bn(i)).join(",")),`Target(${r})`}(ot(n))}; limitType=${n.limitType})`}function hs(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):O.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of Cr(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(a,l,c){const d=Tc(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,Cr(r),i)||r.endAt&&!function(a,l,c){const d=Tc(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,Cr(r),i))}(n,e)}function Ig(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function hd(n){return(e,t)=>{let r=!1;for(const i of Cr(n)){const s=Tg(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function Tg(n,e,t){const r=n.field.isKeyField()?O.comparator(e.key,t.key):function(s,a,l){const c=a.data.field(s),d=l.data.field(s);return c!==null&&d!==null?Un(c,d):H()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return H()}}/**
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
 */class Qn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){pn(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return td(this.inner)}size(){return this.innerSize}}/**
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
 */const Ag=new ue(O.comparator);function Tt(){return Ag}const fd=new ue(O.comparator);function br(...n){let e=fd;for(const t of n)e=e.insert(t.key,t);return e}function md(n){let e=fd;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function rn(){return Sr()}function pd(){return Sr()}function Sr(){return new Qn(n=>n.toString(),(n,e)=>n.isEqual(e))}const Rg=new ue(O.comparator),Cg=new Ie(O.comparator);function G(...n){let e=Cg;for(const t of n)e=e.add(t);return e}const Sg=new Ie(ee);function kg(){return Sg}/**
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
 */function fa(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Wi(e)?"-0":e}}function gd(n){return{integerValue:""+n}}function _d(n,e){return og(e)?gd(e):fa(n,e)}/**
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
 */class fs{constructor(){this._=void 0}}function Pg(n,e,t){return n instanceof Br?function(i,s){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&la(s)&&(s=ca(s)),s&&(a.fields.__previous_value__=s),{mapValue:a}}(t,e):n instanceof $n?vd(n,e):n instanceof qn?wd(n,e):function(i,s){const a=yd(i,s),l=Sc(a)+Sc(i.Pe);return No(a)&&No(i.Pe)?gd(l):fa(i.serializer,l)}(n,e)}function xg(n,e,t){return n instanceof $n?vd(n,e):n instanceof qn?wd(n,e):t}function yd(n,e){return n instanceof $r?function(r){return No(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class Br extends fs{}class $n extends fs{constructor(e){super(),this.elements=e}}function vd(n,e){const t=Ed(e);for(const r of n.elements)t.some(i=>ut(i,r))||t.push(r);return{arrayValue:{values:t}}}class qn extends fs{constructor(e){super(),this.elements=e}}function wd(n,e){let t=Ed(e);for(const r of n.elements)t=t.filter(i=>!ut(i,r));return{arrayValue:{values:t}}}class $r extends fs{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Sc(n){return fe(n.integerValue||n.doubleValue)}function Ed(n){return ua(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class ms{constructor(e,t){this.field=e,this.transform=t}}function Dg(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof $n&&i instanceof $n||r instanceof qn&&i instanceof qn?Fn(r.elements,i.elements,ut):r instanceof $r&&i instanceof $r?ut(r.Pe,i.Pe):r instanceof Br&&i instanceof Br}(n.transform,e.transform)}class Ng{constructor(e,t){this.version=e,this.transformResults=t}}class qe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new qe}static exists(e){return new qe(void 0,e)}static updateTime(e){return new qe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Oi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ps{}function bd(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new gs(n.key,qe.none()):new Qr(n.key,n.data,qe.none());{const t=n.data,r=$e.empty();let i=new Ie(be.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new Wt(n.key,r,new Ge(i.toArray()),qe.none())}}function Lg(n,e,t){n instanceof Qr?function(i,s,a){const l=i.value.clone(),c=Pc(i.fieldTransforms,s,a.transformResults);l.setAll(c),s.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Wt?function(i,s,a){if(!Oi(i.precondition,s))return void s.convertToUnknownDocument(a.version);const l=Pc(i.fieldTransforms,s,a.transformResults),c=s.data;c.setAll(Id(i)),c.setAll(l),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function kr(n,e,t,r){return n instanceof Qr?function(s,a,l,c){if(!Oi(s.precondition,a))return l;const d=s.value.clone(),f=xc(s.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Wt?function(s,a,l,c){if(!Oi(s.precondition,a))return l;const d=xc(s.fieldTransforms,c,a),f=a.data;return f.setAll(Id(s)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(p=>p.field))}(n,e,t,r):function(s,a,l){return Oi(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function Mg(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=yd(r.transform,i||null);s!=null&&(t===null&&(t=$e.empty()),t.set(r.field,s))}return t||null}function kc(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Fn(r,i,(s,a)=>Dg(s,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Qr extends ps{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Wt extends ps{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Id(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Pc(n,e,t){const r=new Map;te(n.length===t.length);for(let i=0;i<t.length;i++){const s=n[i],a=s.transform,l=e.data.field(s.field);r.set(s.field,xg(a,l,t[i]))}return r}function xc(n,e,t){const r=new Map;for(const i of n){const s=i.transform,a=t.data.field(i.field);r.set(i.field,Pg(s,a,e))}return r}class gs extends ps{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Vg extends ps{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Og{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Lg(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=kr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=kr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=pd();return this.mutations.forEach(i=>{const s=e.get(i.key),a=s.overlayedDocument;let l=this.applyToLocalView(a,s.mutatedFields);l=t.has(i.key)?null:l;const c=bd(a,l);c!==null&&r.set(i.key,c),a.isValidDocument()||a.convertToNoDocument(z.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),G())}isEqual(e){return this.batchId===e.batchId&&Fn(this.mutations,e.mutations,(t,r)=>kc(t,r))&&Fn(this.baseMutations,e.baseMutations,(t,r)=>kc(t,r))}}class ma{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){te(e.mutations.length===r.length);let i=function(){return Rg}();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new ma(e,t,r,i)}}/**
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
 */class Fg{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class Ug{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var me,Y;function Bg(n){switch(n){default:return H();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function Td(n){if(n===void 0)return It("GRPC error has no .code"),S.UNKNOWN;switch(n){case me.OK:return S.OK;case me.CANCELLED:return S.CANCELLED;case me.UNKNOWN:return S.UNKNOWN;case me.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case me.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case me.INTERNAL:return S.INTERNAL;case me.UNAVAILABLE:return S.UNAVAILABLE;case me.UNAUTHENTICATED:return S.UNAUTHENTICATED;case me.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case me.NOT_FOUND:return S.NOT_FOUND;case me.ALREADY_EXISTS:return S.ALREADY_EXISTS;case me.PERMISSION_DENIED:return S.PERMISSION_DENIED;case me.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case me.ABORTED:return S.ABORTED;case me.OUT_OF_RANGE:return S.OUT_OF_RANGE;case me.UNIMPLEMENTED:return S.UNIMPLEMENTED;case me.DATA_LOSS:return S.DATA_LOSS;default:return H()}}(Y=me||(me={}))[Y.OK=0]="OK",Y[Y.CANCELLED=1]="CANCELLED",Y[Y.UNKNOWN=2]="UNKNOWN",Y[Y.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Y[Y.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Y[Y.NOT_FOUND=5]="NOT_FOUND",Y[Y.ALREADY_EXISTS=6]="ALREADY_EXISTS",Y[Y.PERMISSION_DENIED=7]="PERMISSION_DENIED",Y[Y.UNAUTHENTICATED=16]="UNAUTHENTICATED",Y[Y.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Y[Y.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Y[Y.ABORTED=10]="ABORTED",Y[Y.OUT_OF_RANGE=11]="OUT_OF_RANGE",Y[Y.UNIMPLEMENTED=12]="UNIMPLEMENTED",Y[Y.INTERNAL=13]="INTERNAL",Y[Y.UNAVAILABLE=14]="UNAVAILABLE",Y[Y.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function $g(){return new TextEncoder}/**
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
 */const qg=new sn([4294967295,4294967295],0);function Dc(n){const e=$g().encode(n),t=new Gu;return t.update(e),new Uint8Array(t.digest())}function Nc(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new sn([t,r],0),new sn([i,s],0)]}class pa{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Ir(`Invalid padding: ${t}`);if(r<0)throw new Ir(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Ir(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Ir(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=sn.fromNumber(this.Ie)}Ee(e,t,r){let i=e.add(t.multiply(sn.fromNumber(r)));return i.compare(qg)===1&&(i=new sn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Dc(e),[r,i]=Nc(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(r,i,s);if(!this.de(a))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new pa(s,i,t);return r.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=Dc(e),[r,i]=Nc(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(r,i,s);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Ir extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class _s{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,Xr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new _s(z.min(),i,new ue(ee),Tt(),G())}}class Xr{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Xr(r,t,G(),G(),G())}}/**
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
 */class Fi{constructor(e,t,r,i){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=i}}class Ad{constructor(e,t){this.targetId=e,this.me=t}}class Rd{constructor(e,t,r=Ae.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class Lc{constructor(){this.fe=0,this.ge=Vc(),this.pe=Ae.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=G(),t=G(),r=G();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:H()}}),new Xr(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Vc()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,te(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class jg{constructor(e){this.Le=e,this.Be=new Map,this.ke=Tt(),this.qe=Mc(),this.Qe=new ue(ee)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:H()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,r=e.me.count,i=this.Je(t);if(i){const s=i.target;if(Mo(s))if(r===0){const a=new O(s.path);this.Ue(t,a,De.newNoDocument(a,z.min()))}else te(r===1);else{const a=this.Ye(t);if(a!==r){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let a,l;try{a=cn(r).toUint8Array()}catch(c){if(c instanceof nd)return On("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new pa(a,i,s)}catch(c){return On(c instanceof Ir?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,s,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((s,a)=>{const l=this.Je(a);if(l){if(s.current&&Mo(l.target)){const c=new O(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,De.newNoDocument(c,e))}s.be&&(t.set(a,s.ve()),s.Ce())}});let r=G();this.qe.forEach((s,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ke.forEach((s,a)=>a.setReadTime(e));const i=new _s(e,t,this.Qe,this.ke,r);return this.ke=Tt(),this.qe=Mc(),this.Qe=new ue(ee),i}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Lc,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Ie(ee),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||V("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Lc),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Mc(){return new ue(O.comparator)}function Vc(){return new ue(O.comparator)}const Hg={asc:"ASCENDING",desc:"DESCENDING"},zg={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Wg={and:"AND",or:"OR"};class Gg{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Fo(n,e){return n.useProto3Json||cs(e)?e:{value:e}}function Ki(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Cd(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Kg(n,e){return Ki(n,e.toTimestamp())}function at(n){return te(!!n),z.fromTimestamp(function(t){const r=Ht(t);return new ge(r.seconds,r.nanos)}(n))}function ga(n,e){return Uo(n,e).canonicalString()}function Uo(n,e){const t=function(i){return new oe(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Sd(n){const e=oe.fromString(n);return te(Nd(e)),e}function Bo(n,e){return ga(n.databaseId,e.path)}function uo(n,e){const t=Sd(e);if(t.get(1)!==n.databaseId.projectId)throw new M(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new O(Pd(t))}function kd(n,e){return ga(n.databaseId,e)}function Qg(n){const e=Sd(n);return e.length===4?oe.emptyPath():Pd(e)}function $o(n){return new oe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Pd(n){return te(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Oc(n,e,t){return{name:Bo(n,e),fields:t.value.mapValue.fields}}function Xg(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:H()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(d,f){return d.useProto3Json?(te(f===void 0||typeof f=="string"),Ae.fromBase64String(f||"")):(te(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ae.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?S.UNKNOWN:Td(d.code);return new M(f,d.message||"")}(a);t=new Rd(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=uo(n,r.document.name),s=at(r.document.updateTime),a=r.document.createTime?at(r.document.createTime):z.min(),l=new $e({mapValue:{fields:r.document.fields}}),c=De.newFoundDocument(i,s,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];t=new Fi(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=uo(n,r.document),s=r.readTime?at(r.readTime):z.min(),a=De.newNoDocument(i,s),l=r.removedTargetIds||[];t=new Fi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=uo(n,r.document),s=r.removedTargetIds||[];t=new Fi([],s,i,null)}else{if(!("filter"in e))return H();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,a=new Ug(i,s),l=r.targetId;t=new Ad(l,a)}}return t}function Yg(n,e){let t;if(e instanceof Qr)t={update:Oc(n,e.key,e.value)};else if(e instanceof gs)t={delete:Bo(n,e.key)};else if(e instanceof Wt)t={update:Oc(n,e.key,e.data),updateMask:o_(e.fieldMask)};else{if(!(e instanceof Vg))return H();t={verify:Bo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,a){const l=a.transform;if(l instanceof Br)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof $n)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof qn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof $r)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw H()}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Kg(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:H()}(n,e.precondition)),t}function Jg(n,e){return n&&n.length>0?(te(e!==void 0),n.map(t=>function(i,s){let a=i.updateTime?at(i.updateTime):at(s);return a.isEqual(z.min())&&(a=at(s)),new Ng(a,i.transformResults||[])}(t,e))):[]}function Zg(n,e){return{documents:[kd(n,e.path)]}}function e_(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=kd(n,i);const s=function(d){if(d.length!==0)return Dd(tt.create(d,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:Rn(v.field),direction:r_(v.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Fo(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:i}}function t_(n){let e=Qg(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){te(r===1);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=function(p){const v=xd(p);return v instanceof tt&&od(v)?v.getFilters():[v]}(t.where));let a=[];t.orderBy&&(a=function(p){return p.map(v=>function(C){return new Ur(Cn(C.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(v))}(t.orderBy));let l=null;t.limit&&(l=function(p){let v;return v=typeof p=="object"?p.value:p,cs(v)?null:v}(t.limit));let c=null;t.startAt&&(c=function(p){const v=!!p.before,b=p.values||[];return new Gi(b,v)}(t.startAt));let d=null;return t.endAt&&(d=function(p){const v=!p.before,b=p.values||[];return new Gi(b,v)}(t.endAt)),Eg(e,i,a,s,l,"F",c,d)}function n_(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return H()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function xd(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Cn(t.unaryFilter.field);return pe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Cn(t.unaryFilter.field);return pe.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Cn(t.unaryFilter.field);return pe.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Cn(t.unaryFilter.field);return pe.create(a,"!=",{nullValue:"NULL_VALUE"});default:return H()}}(n):n.fieldFilter!==void 0?function(t){return pe.create(Cn(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return H()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return tt.create(t.compositeFilter.filters.map(r=>xd(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return H()}}(t.compositeFilter.op))}(n):H()}function r_(n){return Hg[n]}function i_(n){return zg[n]}function s_(n){return Wg[n]}function Rn(n){return{fieldPath:n.canonicalString()}}function Cn(n){return be.fromServerFormat(n.fieldPath)}function Dd(n){return n instanceof pe?function(t){if(t.op==="=="){if(Ic(t.value))return{unaryFilter:{field:Rn(t.field),op:"IS_NAN"}};if(bc(t.value))return{unaryFilter:{field:Rn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ic(t.value))return{unaryFilter:{field:Rn(t.field),op:"IS_NOT_NAN"}};if(bc(t.value))return{unaryFilter:{field:Rn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rn(t.field),op:i_(t.op),value:t.value}}}(n):n instanceof tt?function(t){const r=t.getFilters().map(i=>Dd(i));return r.length===1?r[0]:{compositeFilter:{op:s_(t.op),filters:r}}}(n):H()}function o_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Nd(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class Ft{constructor(e,t,r,i,s=z.min(),a=z.min(),l=Ae.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new Ft(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class a_{constructor(e){this.ct=e}}function l_(n){const e=t_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Oo(e,e.limit,"L"):e}/**
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
 */class c_{constructor(){this.un=new u_}addToCollectionParentIndex(e,t){return this.un.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(jt.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(jt.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class u_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new Ie(oe.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Ie(oe.comparator)).toArray()}}/**
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
 */class jn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new jn(0)}static kn(){return new jn(-1)}}/**
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
 */class d_{constructor(){this.changes=new Qn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,De.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 *//**
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
 */class h_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class f_{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&kr(r.mutation,i,Ge.empty(),ge.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,G()).next(()=>r))}getLocalViewOfDocuments(e,t,r=G()){const i=rn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let a=br();return s.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=rn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,G()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,r,i){let s=Tt();const a=Sr(),l=function(){return Sr()}();return t.forEach((c,d)=>{const f=r.get(d.key);i.has(d.key)&&(f===void 0||f.mutation instanceof Wt)?s=s.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),kr(f.mutation,d,f.mutation.getFieldMask(),ge.now())):a.set(d.key,Ge.empty())}),this.recalculateAndSaveOverlays(e,s).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var p;return l.set(d,new h_(f,(p=a.get(d))!==null&&p!==void 0?p:null))}),l))}recalculateAndSaveOverlays(e,t){const r=Sr();let i=new ue((a,l)=>a-l),s=G();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=r.get(c)||Ge.empty();f=l.applyToLocalView(d,f),r.set(c,f);const p=(i.get(l.batchId)||G()).add(c);i=i.insert(l.batchId,p)})}).next(()=>{const a=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,p=pd();f.forEach(v=>{if(!s.has(v)){const b=bd(t.get(v),r.get(v));b!==null&&p.set(v,b),s=s.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,p))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(a){return O.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ud(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):P.resolve(rn());let l=-1,c=s;return a.next(d=>P.forEach(d,(f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),s.get(f)?P.resolve():this.remoteDocumentCache.getEntry(e,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,c,d,G())).next(f=>({batchId:l,changes:md(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new O(t)).next(r=>{let i=br();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let a=br();return this.indexManager.getCollectionParents(e,s).next(l=>P.forEach(l,c=>{const d=function(p,v){return new Kn(v,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,r,i).next(f=>{f.forEach((p,v)=>{a=a.insert(p,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(a=>{s.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,De.newInvalidDocument(f)))});let l=br();return a.forEach((c,d)=>{const f=s.get(c);f!==void 0&&kr(f.mutation,d,Ge.empty(),ge.now()),hs(t,d)&&(l=l.insert(c,d))}),l})}}/**
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
 */class m_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return P.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:at(i.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:l_(i.bundledQuery),readTime:at(i.readTime)}}(t)),P.resolve()}}/**
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
 */class p_{constructor(){this.overlays=new ue(O.comparator),this.Ir=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=rn();return P.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.ht(e,t,s)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const i=rn(),s=t.length+1,a=new O(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&c.largestBatchId>r&&i.set(c.getKey(),c)}return P.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new ue((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=s.get(d.largestBatchId);f===null&&(f=rn(),s=s.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=rn(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=i)););return P.resolve(l)}ht(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const a=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Fg(t,r));let s=this.Ir.get(t);s===void 0&&(s=G(),this.Ir.set(t,s)),this.Ir.set(t,s.add(r.key))}}/**
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
 */class g_{constructor(){this.sessionToken=Ae.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
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
 */class _a{constructor(){this.Tr=new Ie(_e.Er),this.dr=new Ie(_e.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new _e(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new _e(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new O(new oe([])),r=new _e(t,e),i=new _e(t,e+1),s=[];return this.dr.forEachInRange([r,i],a=>{this.Vr(a),s.push(a.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new O(new oe([])),r=new _e(t,e),i=new _e(t,e+1);let s=G();return this.dr.forEachInRange([r,i],a=>{s=s.add(a.key)}),s}containsKey(e){const t=new _e(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class _e{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return O.comparator(e.key,t.key)||ee(e.wr,t.wr)}static Ar(e,t){return ee(e.wr,t.wr)||O.comparator(e.key,t.key)}}/**
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
 */class __{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Ie(_e.Er)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Og(s,t,r,i);this.mutationQueue.push(a);for(const l of i)this.br=this.br.add(new _e(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.vr(r),s=i<0?0:i;return P.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new _e(t,0),i=new _e(t,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],a=>{const l=this.Dr(a.wr);s.push(l)}),P.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Ie(ee);return t.forEach(i=>{const s=new _e(i,0),a=new _e(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,a],l=>{r=r.add(l.wr)})}),P.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;O.isDocumentKey(s)||(s=s.child(""));const a=new _e(new O(s),0);let l=new Ie(ee);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===i&&(l=l.add(c.wr)),!0)},a),P.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){te(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return P.forEach(t.mutations,i=>{const s=new _e(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new _e(t,0),i=this.br.firstAfterOrEqual(r);return P.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class y_{constructor(e){this.Mr=e,this.docs=function(){return new ue(O.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():De.newInvalidDocument(t))}getEntries(e,t){let r=Tt();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():De.newInvalidDocument(i))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=Tt();const a=t.path,l=new O(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||ng(tg(f),r)<=0||(i.has(f.key)||hs(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return P.resolve(s)}getAllFromCollectionGroup(e,t,r,i){H()}Or(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new v_(this)}getSize(e){return P.resolve(this.size)}}class v_ extends d_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class w_{constructor(e){this.persistence=e,this.Nr=new Qn(t=>da(t),ha),this.lastRemoteSnapshotVersion=z.min(),this.highestTargetId=0,this.Lr=0,this.Br=new _a,this.targetCount=0,this.kr=jn.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,i)=>t(i)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),P.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new jn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Kn(t),P.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.Nr.delete(a),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),P.waitFor(s).next(()=>i)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),P.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.Br.containsKey(t))}}/**
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
 */class E_{constructor(e,t){this.qr={},this.overlays={},this.Qr=new aa(0),this.Kr=!1,this.Kr=!0,this.$r=new g_,this.referenceDelegate=e(this),this.Ur=new w_(this),this.indexManager=new c_,this.remoteDocumentCache=function(i){return new y_(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new a_(t),this.Gr=new m_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new p_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new __(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);const i=new b_(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,t){return P.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class b_ extends ig{constructor(e){super(),this.currentSequenceNumber=e}}class ya{constructor(e){this.persistence=e,this.Jr=new _a,this.Yr=null}static Zr(e){return new ya(e)}get Xr(){if(this.Yr)return this.Yr;throw H()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),P.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.Xr,r=>{const i=O.fromPath(r);return this.ei(e,i).next(s=>{s||t.removeEntry(i,z.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return P.or([()=>P.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class va{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=i}static Wi(e,t){let r=G(),i=G();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new va(e,t.fromCache,r,i)}}/**
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
 */class I_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class T_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Rm()?8:sg(Le())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.Yi(e,t).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.Zi(e,t,i,r).next(a=>{s.result=a})}).next(()=>{if(s.result)return;const a=new I_;return this.Xi(e,t,a).next(l=>{if(s.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>s.result)}es(e,t,r,i){return r.documentReadCount<this.ji?(_r()<=Q.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",An(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),P.resolve()):(_r()<=Q.DEBUG&&V("QueryEngine","Query:",An(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(_r()<=Q.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",An(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ot(t))):P.resolve())}Yi(e,t){if(Cc(t))return P.resolve(null);let r=ot(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Oo(t,null,"F"),r=ot(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const a=G(...s);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,Oo(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,r,i){return Cc(t)||i.isEqual(z.min())?P.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const a=this.ts(t,s);return this.ns(t,a,r,i)?P.resolve(null):(_r()<=Q.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),An(t)),this.rs(e,a,t,eg(i,-1)).next(l=>l))})}ts(e,t){let r=new Ie(hd(e));return t.forEach((i,s)=>{hs(e,s)&&(r=r.add(s))}),r}ns(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,t,r){return _r()<=Q.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",An(t)),this.Ji.getDocumentsMatchingQuery(e,t,jt.min(),r)}rs(e,t,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(a=>{s=s.insert(a.key,a)}),s))}}/**
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
 */class A_{constructor(e,t,r,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new ue(ee),this._s=new Qn(s=>da(s),ha),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new f_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function R_(n,e,t,r){return new A_(n,e,t,r)}async function Ld(n,e){const t=W(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const a=[],l=[];let c=G();for(const d of i){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of s){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function C_(n,e){const t=W(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const p=d.batch,v=p.keys();let b=P.resolve();return v.forEach(C=>{b=b.next(()=>f.getEntry(c,C)).next(D=>{const k=d.docVersions.get(C);te(k!==null),D.version.compareTo(k)<0&&(p.applyToRemoteDocument(D,d),D.isValidDocument()&&(D.setReadTime(d.commitVersion),f.addEntry(D)))})}),b.next(()=>l.mutationQueue.removeMutationBatch(c,p))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=G();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function Md(n){const e=W(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function S_(n,e){const t=W(n),r=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((f,p)=>{const v=i.get(p);if(!v)return;l.push(t.Ur.removeMatchingKeys(s,f.removedDocuments,p).next(()=>t.Ur.addMatchingKeys(s,f.addedDocuments,p)));let b=v.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?b=b.withResumeToken(Ae.EMPTY_BYTE_STRING,z.min()).withLastLimboFreeSnapshotVersion(z.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,r)),i=i.insert(p,b),function(D,k,U){return D.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=3e8?!0:U.addedDocuments.size+U.modifiedDocuments.size+U.removedDocuments.size>0}(v,b,f)&&l.push(t.Ur.updateTargetData(s,b))});let c=Tt(),d=G();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(k_(s,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(z.min())){const f=t.Ur.getLastRemoteSnapshotVersion(s).next(p=>t.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return P.waitFor(l).next(()=>a.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,c,d)).next(()=>c)}).then(s=>(t.os=i,s))}function k_(n,e,t){let r=G(),i=G();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let a=Tt();return t.forEach((l,c)=>{const d=s.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(z.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):V("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:i}})}function P_(n,e){const t=W(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function x_(n,e){const t=W(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.Ur.getTargetData(r,e).next(s=>s?(i=s,P.resolve(i)):t.Ur.allocateTargetId(r).next(a=>(i=new Ft(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function qo(n,e,t){const r=W(n),i=r.os.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,a=>r.persistence.referenceDelegate.removeTarget(a,i))}catch(a){if(!Kr(a))throw a;V("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function Fc(n,e,t){const r=W(n);let i=z.min(),s=G();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const p=W(c),v=p._s.get(f);return v!==void 0?P.resolve(p.os.get(v)):p.Ur.getTargetData(d,f)}(r,a,ot(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{s=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?i:z.min(),t?s:G())).next(l=>(D_(r,Ig(e),l),{documents:l,Ts:s})))}function D_(n,e,t){let r=n.us.get(e)||z.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.us.set(e,r)}class Uc{constructor(){this.activeTargetIds=kg()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class N_{constructor(){this.so=new Uc,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Uc,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class L_{_o(e){}shutdown(){}}/**
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
 */class Bc{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){V("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){V("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Pi=null;function ho(){return Pi===null?Pi=function(){return 268435456+Math.round(2147483648*Math.random())}():Pi++,"0x"+Pi.toString(16)}/**
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
 */const M_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class V_{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const Pe="WebChannelConnection";class O_ extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(t,r,i,s,a){const l=ho(),c=this.xo(t,r.toUriEncodedString());V("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,s,a),this.No(t,c,d,i).then(f=>(V("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw On("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",i),f})}Lo(t,r,i,s,a,l){return this.Mo(t,r,i,s,a)}Oo(t,r,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Gn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,a)=>t[a]=s),i&&i.headers.forEach((s,a)=>t[a]=s)}xo(t,r){const i=M_[t];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,i){const s=ho();return new Promise((a,l)=>{const c=new Ku;c.setWithCredentials(!0),c.listenOnce(Qu.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Mi.NO_ERROR:const f=c.getResponseJson();V(Pe,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),a(f);break;case Mi.TIMEOUT:V(Pe,`RPC '${e}' ${s} timed out`),l(new M(S.DEADLINE_EXCEEDED,"Request time out"));break;case Mi.HTTP_ERROR:const p=c.getStatus();if(V(Pe,`RPC '${e}' ${s} failed with status:`,p,"response text:",c.getResponseText()),p>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const b=v==null?void 0:v.error;if(b&&b.status&&b.message){const C=function(k){const U=k.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(U)>=0?U:S.UNKNOWN}(b.status);l(new M(C,b.message))}else l(new M(S.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new M(S.UNAVAILABLE,"Connection failed."));break;default:H()}}finally{V(Pe,`RPC '${e}' ${s} completed.`)}});const d=JSON.stringify(i);V(Pe,`RPC '${e}' ${s} sending request:`,i),c.send(t,"POST",d,r,15)})}Bo(e,t,r){const i=ho(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Ju(),l=Yu(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=s.join("");V(Pe,`Creating RPC '${e}' stream ${i}: ${f}`,c);const p=a.createWebChannel(f,c);let v=!1,b=!1;const C=new V_({Io:k=>{b?V(Pe,`Not sending because RPC '${e}' stream ${i} is closed:`,k):(v||(V(Pe,`Opening RPC '${e}' stream ${i} transport.`),p.open(),v=!0),V(Pe,`RPC '${e}' stream ${i} sending:`,k),p.send(k))},To:()=>p.close()}),D=(k,U,$)=>{k.listen(U,F=>{try{$(F)}catch(j){setTimeout(()=>{throw j},0)}})};return D(p,Er.EventType.OPEN,()=>{b||(V(Pe,`RPC '${e}' stream ${i} transport opened.`),C.yo())}),D(p,Er.EventType.CLOSE,()=>{b||(b=!0,V(Pe,`RPC '${e}' stream ${i} transport closed`),C.So())}),D(p,Er.EventType.ERROR,k=>{b||(b=!0,On(Pe,`RPC '${e}' stream ${i} transport errored:`,k),C.So(new M(S.UNAVAILABLE,"The operation could not be completed")))}),D(p,Er.EventType.MESSAGE,k=>{var U;if(!b){const $=k.data[0];te(!!$);const F=$,j=F.error||((U=F[0])===null||U===void 0?void 0:U.error);if(j){V(Pe,`RPC '${e}' stream ${i} received error:`,j);const ne=j.status;let J=function(_){const w=me[_];if(w!==void 0)return Td(w)}(ne),E=j.message;J===void 0&&(J=S.INTERNAL,E="Unknown error status: "+ne+" with message "+j.message),b=!0,C.So(new M(J,E)),p.close()}else V(Pe,`RPC '${e}' stream ${i} received:`,$),C.bo($)}}),D(l,Xu.STAT_EVENT,k=>{k.stat===xo.PROXY?V(Pe,`RPC '${e}' stream ${i} detected buffering proxy`):k.stat===xo.NOPROXY&&V(Pe,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{C.wo()},0),C}}function fo(){return typeof document<"u"?document:null}/**
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
 */function ys(n){return new Gg(n,!0)}/**
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
 */class Vd{constructor(e,t,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-r);i>0&&V("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class Od{constructor(e,t,r,i,s,a,l,c){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Vd(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(It(t.toString()),It("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===t&&this.P_(r,i)},r=>{e(()=>{const i=new M(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return V("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(V("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class F_ extends Od{constructor(e,t,r,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Xg(this.serializer,e),r=function(s){if(!("targetChange"in s))return z.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?z.min():a.readTime?at(a.readTime):z.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=$o(this.serializer),t.addTarget=function(s,a){let l;const c=a.target;if(l=Mo(c)?{documents:Zg(s,c)}:{query:e_(s,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Cd(s,a.resumeToken);const d=Fo(s,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(z.min())>0){l.readTime=Ki(s,a.snapshotVersion.toTimestamp());const d=Fo(s,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const r=n_(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=$o(this.serializer),t.removeTarget=e,this.a_(t)}}class U_ extends Od{constructor(e,t,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return te(!!e.streamToken),this.lastStreamToken=e.streamToken,te(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){te(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Jg(e.writeResults,e.commitTime),r=at(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=$o(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Yg(this.serializer,r))};this.a_(t)}}/**
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
 */class B_ extends class{}{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new M(S.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Mo(e,Uo(t,r),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new M(S.UNKNOWN,s.toString())})}Lo(e,t,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,Uo(t,r),i,a,l,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new M(S.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class $_{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(It(t),this.D_=!1):V("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class q_{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(a=>{r.enqueueAndForget(async()=>{gn(this)&&(V("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=W(c);d.L_.add(4),await Yr(d),d.q_.set("Unknown"),d.L_.delete(4),await vs(d)}(this))})}),this.q_=new $_(r,i)}}async function vs(n){if(gn(n))for(const e of n.B_)await e(!0)}async function Yr(n){for(const e of n.B_)await e(!1)}function Fd(n,e){const t=W(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Ia(t)?ba(t):Xn(t).r_()&&Ea(t,e))}function wa(n,e){const t=W(n),r=Xn(t);t.N_.delete(e),r.r_()&&Ud(t,e),t.N_.size===0&&(r.r_()?r.o_():gn(t)&&t.q_.set("Unknown"))}function Ea(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(z.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Xn(n).A_(e)}function Ud(n,e){n.Q_.xe(e),Xn(n).R_(e)}function ba(n){n.Q_=new jg({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),Xn(n).start(),n.q_.v_()}function Ia(n){return gn(n)&&!Xn(n).n_()&&n.N_.size>0}function gn(n){return W(n).L_.size===0}function Bd(n){n.Q_=void 0}async function j_(n){n.q_.set("Online")}async function H_(n){n.N_.forEach((e,t)=>{Ea(n,e)})}async function z_(n,e){Bd(n),Ia(n)?(n.q_.M_(e),ba(n)):n.q_.set("Unknown")}async function W_(n,e,t){if(n.q_.set("Online"),e instanceof Rd&&e.state===2&&e.cause)try{await async function(i,s){const a=s.cause;for(const l of s.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,a),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(r){V("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Qi(n,r)}else if(e instanceof Fi?n.Q_.Ke(e):e instanceof Ad?n.Q_.He(e):n.Q_.We(e),!t.isEqual(z.min()))try{const r=await Md(n.localStore);t.compareTo(r)>=0&&await function(s,a){const l=s.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.N_.get(d);f&&s.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=s.N_.get(c);if(!f)return;s.N_.set(c,f.withResumeToken(Ae.EMPTY_BYTE_STRING,f.snapshotVersion)),Ud(s,c);const p=new Ft(f.target,c,d,f.sequenceNumber);Ea(s,p)}),s.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){V("RemoteStore","Failed to raise snapshot:",r),await Qi(n,r)}}async function Qi(n,e,t){if(!Kr(e))throw e;n.L_.add(1),await Yr(n),n.q_.set("Offline"),t||(t=()=>Md(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{V("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await vs(n)})}function $d(n,e){return e().catch(t=>Qi(n,t,e))}async function ws(n){const e=W(n),t=zt(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;G_(e);)try{const i=await P_(e.localStore,r);if(i===null){e.O_.length===0&&t.o_();break}r=i.batchId,K_(e,i)}catch(i){await Qi(e,i)}qd(e)&&jd(e)}function G_(n){return gn(n)&&n.O_.length<10}function K_(n,e){n.O_.push(e);const t=zt(n);t.r_()&&t.V_&&t.m_(e.mutations)}function qd(n){return gn(n)&&!zt(n).n_()&&n.O_.length>0}function jd(n){zt(n).start()}async function Q_(n){zt(n).p_()}async function X_(n){const e=zt(n);for(const t of n.O_)e.m_(t.mutations)}async function Y_(n,e,t){const r=n.O_.shift(),i=ma.from(r,e,t);await $d(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await ws(n)}async function J_(n,e){e&&zt(n).V_&&await async function(r,i){if(function(a){return Bg(a)&&a!==S.ABORTED}(i.code)){const s=r.O_.shift();zt(r).s_(),await $d(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await ws(r)}}(n,e),qd(n)&&jd(n)}async function $c(n,e){const t=W(n);t.asyncQueue.verifyOperationInProgress(),V("RemoteStore","RemoteStore received new credentials");const r=gn(t);t.L_.add(3),await Yr(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await vs(t)}async function Z_(n,e){const t=W(n);e?(t.L_.delete(2),await vs(t)):e||(t.L_.add(2),await Yr(t),t.q_.set("Unknown"))}function Xn(n){return n.K_||(n.K_=function(t,r,i){const s=W(t);return s.w_(),new F_(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:j_.bind(null,n),Ro:H_.bind(null,n),mo:z_.bind(null,n),d_:W_.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Ia(n)?ba(n):n.q_.set("Unknown")):(await n.K_.stop(),Bd(n))})),n.K_}function zt(n){return n.U_||(n.U_=function(t,r,i){const s=W(t);return s.w_(),new U_(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Q_.bind(null,n),mo:J_.bind(null,n),f_:X_.bind(null,n),g_:Y_.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await ws(n)):(await n.U_.stop(),n.O_.length>0&&(V("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Ta{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new vt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const a=Date.now()+r,l=new Ta(e,t,a,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Aa(n,e){if(It("AsyncQueue",`${e}: ${n}`),Kr(n))return new M(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class Pn{constructor(e){this.comparator=e?(t,r)=>e(t,r)||O.comparator(t.key,r.key):(t,r)=>O.comparator(t.key,r.key),this.keyedMap=br(),this.sortedSet=new ue(this.comparator)}static emptySet(e){return new Pn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Pn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Pn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
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
 */class qc{constructor(){this.W_=new ue(O.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):H():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Hn{constructor(e,t,r,i,s,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,i,s){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Hn(e,t,Pn.emptySet(t),a,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ds(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
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
 */class ey{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class ty{constructor(){this.queries=jc(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const i=W(t),s=i.queries;i.queries=jc(),s.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new M(S.ABORTED,"Firestore shutting down"))}}function jc(){return new Qn(n=>dd(n),ds)}async function Ra(n,e){const t=W(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new ey,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await t.onListen(i,!0);break;case 1:s.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const l=Aa(a,`Initialization of query '${An(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,s),s.j_.push(e),e.Z_(t.onlineState),s.z_&&e.X_(s.z_)&&Sa(t)}async function Ca(n,e){const t=W(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const a=s.j_.indexOf(e);a>=0&&(s.j_.splice(a,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function ny(n,e){const t=W(n);let r=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const l of a.j_)l.X_(i)&&(r=!0);a.z_=i}}r&&Sa(t)}function ry(n,e,t){const r=W(n),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(t);r.queries.delete(e)}function Sa(n){n.Y_.forEach(e=>{e.next()})}var jo,Hc;(Hc=jo||(jo={})).ea="default",Hc.Cache="cache";class ka{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Hn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Hn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==jo.Cache}}/**
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
 */class Hd{constructor(e){this.key=e}}class zd{constructor(e){this.key=e}}class iy{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=G(),this.mutatedKeys=G(),this.Aa=hd(e),this.Ra=new Pn(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new qc,i=t?t.Ra:this.Ra;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,p)=>{const v=i.get(f),b=hs(this.query,p)?p:null,C=!!v&&this.mutatedKeys.has(v.key),D=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let k=!1;v&&b?v.data.isEqual(b.data)?C!==D&&(r.track({type:3,doc:b}),k=!0):this.ga(v,b)||(r.track({type:2,doc:b}),k=!0,(c&&this.Aa(b,c)>0||d&&this.Aa(b,d)<0)&&(l=!0)):!v&&b?(r.track({type:0,doc:b}),k=!0):v&&!b&&(r.track({type:1,doc:v}),k=!0,(c||d)&&(l=!0)),k&&(b?(a=a.add(b),s=D?s.add(f):s.delete(f)):(a=a.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:s}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,p)=>function(b,C){const D=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return H()}};return D(b)-D(C)}(f.type,p.type)||this.Aa(f.doc,p.doc)),this.pa(r),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Hn(this.query,e.Ra,s,a,e.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new qc,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=G(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new zd(r))}),this.da.forEach(r=>{e.has(r)||t.push(new Hd(r))}),t}ba(e){this.Ta=e.Ts,this.da=G();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Hn.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class sy{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class oy{constructor(e){this.key=e,this.va=!1}}class ay{constructor(e,t,r,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Qn(l=>dd(l),ds),this.Ma=new Map,this.xa=new Set,this.Oa=new ue(O.comparator),this.Na=new Map,this.La=new _a,this.Ba={},this.ka=new Map,this.qa=jn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function ly(n,e,t=!0){const r=Yd(n);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await Wd(r,e,t,!0),i}async function cy(n,e){const t=Yd(n);await Wd(t,e,!0,!1)}async function Wd(n,e,t,r){const i=await x_(n.localStore,ot(e)),s=i.targetId,a=n.sharedClientState.addLocalQueryTarget(s,t);let l;return r&&(l=await uy(n,e,s,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&Fd(n.remoteStore,i),l}async function uy(n,e,t,r,i){n.Ka=(p,v,b)=>async function(D,k,U,$){let F=k.view.ma(U);F.ns&&(F=await Fc(D.localStore,k.query,!1).then(({documents:E})=>k.view.ma(E,F)));const j=$&&$.targetChanges.get(k.targetId),ne=$&&$.targetMismatches.get(k.targetId)!=null,J=k.view.applyChanges(F,D.isPrimaryClient,j,ne);return Wc(D,k.targetId,J.wa),J.snapshot}(n,p,v,b);const s=await Fc(n.localStore,e,!0),a=new iy(e,s.Ts),l=a.ma(s.documents),c=Xr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),d=a.applyChanges(l,n.isPrimaryClient,c);Wc(n,t,d.wa);const f=new sy(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function dy(n,e,t){const r=W(n),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(a=>!ds(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await qo(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&wa(r.remoteStore,i.targetId),Ho(r,i.targetId)}).catch(Gr)):(Ho(r,i.targetId),await qo(r.localStore,i.targetId,!0))}async function hy(n,e){const t=W(n),r=t.Fa.get(e),i=t.Ma.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),wa(t.remoteStore,r.targetId))}async function fy(n,e,t){const r=wy(n);try{const i=await function(a,l){const c=W(a),d=ge.now(),f=l.reduce((b,C)=>b.add(C.key),G());let p,v;return c.persistence.runTransaction("Locally write mutations","readwrite",b=>{let C=Tt(),D=G();return c.cs.getEntries(b,f).next(k=>{C=k,C.forEach((U,$)=>{$.isValidDocument()||(D=D.add(U))})}).next(()=>c.localDocuments.getOverlayedDocuments(b,C)).next(k=>{p=k;const U=[];for(const $ of l){const F=Mg($,p.get($.key).overlayedDocument);F!=null&&U.push(new Wt($.key,F,rd(F.value.mapValue),qe.exists(!0)))}return c.mutationQueue.addMutationBatch(b,d,U,l)}).next(k=>{v=k;const U=k.applyToLocalDocumentSet(p,D);return c.documentOverlayCache.saveOverlays(b,k.batchId,U)})}).then(()=>({batchId:v.batchId,changes:md(p)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new ue(ee)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,i.batchId,t),await Jr(r,i.changes),await ws(r.remoteStore)}catch(i){const s=Aa(i,"Failed to persist write");t.reject(s)}}async function Gd(n,e){const t=W(n);try{const r=await S_(t.localStore,e);e.targetChanges.forEach((i,s)=>{const a=t.Na.get(s);a&&(te(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?a.va=!0:i.modifiedDocuments.size>0?te(a.va):i.removedDocuments.size>0&&(te(a.va),a.va=!1))}),await Jr(t,r,e)}catch(r){await Gr(r)}}function zc(n,e,t){const r=W(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Fa.forEach((s,a)=>{const l=a.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(a,l){const c=W(a);c.onlineState=l;let d=!1;c.queries.forEach((f,p)=>{for(const v of p.j_)v.Z_(l)&&(d=!0)}),d&&Sa(c)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function my(n,e,t){const r=W(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Na.get(e),s=i&&i.key;if(s){let a=new ue(O.comparator);a=a.insert(s,De.newNoDocument(s,z.min()));const l=G().add(s),c=new _s(z.min(),new Map,new ue(ee),a,l);await Gd(r,c),r.Oa=r.Oa.remove(s),r.Na.delete(e),Pa(r)}else await qo(r.localStore,e,!1).then(()=>Ho(r,e,t)).catch(Gr)}async function py(n,e){const t=W(n),r=e.batch.batchId;try{const i=await C_(t.localStore,e);Qd(t,r,null),Kd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Jr(t,i)}catch(i){await Gr(i)}}async function gy(n,e,t){const r=W(n);try{const i=await function(a,l){const c=W(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(p=>(te(p!==null),f=p.keys(),c.mutationQueue.removeMutationBatch(d,p))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,e);Qd(r,e,t),Kd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Jr(r,i)}catch(i){await Gr(i)}}function Kd(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Qd(n,e,t){const r=W(n);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function Ho(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||Xd(n,r)})}function Xd(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(wa(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Pa(n))}function Wc(n,e,t){for(const r of t)r instanceof Hd?(n.La.addReference(r.key,e),_y(n,r)):r instanceof zd?(V("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||Xd(n,r.key)):H()}function _y(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(V("SyncEngine","New document in limbo: "+t),n.xa.add(r),Pa(n))}function Pa(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new O(oe.fromString(e)),r=n.qa.next();n.Na.set(r,new oy(t)),n.Oa=n.Oa.insert(t,r),Fd(n.remoteStore,new Ft(ot(us(t.path)),r,"TargetPurposeLimboResolution",aa.oe))}}async function Jr(n,e,t){const r=W(n),i=[],s=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){const p=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(d){i.push(d);const p=va.Wi(c.targetId,d);s.push(p)}}))}),await Promise.all(a),r.Ca.d_(i),await async function(c,d){const f=W(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>P.forEach(d,v=>P.forEach(v.$i,b=>f.persistence.referenceDelegate.addReference(p,v.targetId,b)).next(()=>P.forEach(v.Ui,b=>f.persistence.referenceDelegate.removeReference(p,v.targetId,b)))))}catch(p){if(!Kr(p))throw p;V("LocalStore","Failed to update sequence numbers: "+p)}for(const p of d){const v=p.targetId;if(!p.fromCache){const b=f.os.get(v),C=b.snapshotVersion,D=b.withLastLimboFreeSnapshotVersion(C);f.os=f.os.insert(v,D)}}}(r.localStore,s))}async function yy(n,e){const t=W(n);if(!t.currentUser.isEqual(e)){V("SyncEngine","User change. New user:",e.toKey());const r=await Ld(t.localStore,e);t.currentUser=e,function(s,a){s.ka.forEach(l=>{l.forEach(c=>{c.reject(new M(S.CANCELLED,a))})}),s.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Jr(t,r.hs)}}function vy(n,e){const t=W(n),r=t.Na.get(e);if(r&&r.va)return G().add(r.key);{let i=G();const s=t.Ma.get(e);if(!s)return i;for(const a of s){const l=t.Fa.get(a);i=i.unionWith(l.view.Va)}return i}}function Yd(n){const e=W(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=vy.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=my.bind(null,e),e.Ca.d_=ny.bind(null,e.eventManager),e.Ca.$a=ry.bind(null,e.eventManager),e}function wy(n){const e=W(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=py.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=gy.bind(null,e),e}class Xi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ys(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return R_(this.persistence,new T_,e.initialUser,this.serializer)}Ga(e){return new E_(ya.Zr,this.serializer)}Wa(e){return new N_}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Xi.provider={build:()=>new Xi};class zo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>zc(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=yy.bind(null,this.syncEngine),await Z_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new ty}()}createDatastore(e){const t=ys(e.databaseInfo.databaseId),r=function(s){return new O_(s)}(e.databaseInfo);return function(s,a,l,c){return new B_(s,a,l,c)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,a,l){return new q_(r,i,s,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>zc(this.syncEngine,t,0),function(){return Bc.D()?new Bc:new L_}())}createSyncEngine(e,t){return function(i,s,a,l,c,d,f){const p=new ay(i,s,a,l,c,d);return f&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=W(i);V("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Yr(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}zo.provider={build:()=>new zo};/**
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
 *//**
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
 */class xa{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):It("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */class Ey{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=xe.UNAUTHENTICATED,this.clientId=ed.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async a=>{V("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(V("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new vt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Aa(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function mo(n,e){n.asyncQueue.verifyOperationInProgress(),V("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await Ld(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Gc(n,e){n.asyncQueue.verifyOperationInProgress();const t=await by(n);V("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>$c(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>$c(e.remoteStore,i)),n._onlineComponents=e}async function by(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V("FirestoreClient","Using user provided OfflineComponentProvider");try{await mo(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===S.FAILED_PRECONDITION||i.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;On("Error using user provided cache. Falling back to memory cache: "+t),await mo(n,new Xi)}}else V("FirestoreClient","Using default OfflineComponentProvider"),await mo(n,new Xi);return n._offlineComponents}async function Jd(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V("FirestoreClient","Using user provided OnlineComponentProvider"),await Gc(n,n._uninitializedComponentsProvider._online)):(V("FirestoreClient","Using default OnlineComponentProvider"),await Gc(n,new zo))),n._onlineComponents}function Iy(n){return Jd(n).then(e=>e.syncEngine)}async function Yi(n){const e=await Jd(n),t=e.eventManager;return t.onListen=ly.bind(null,e.syncEngine),t.onUnlisten=dy.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=cy.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=hy.bind(null,e.syncEngine),t}function Ty(n,e,t={}){const r=new vt;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,l,c,d){const f=new xa({next:v=>{f.Za(),a.enqueueAndForget(()=>Ca(s,p));const b=v.docs.has(l);!b&&v.fromCache?d.reject(new M(S.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&v.fromCache&&c&&c.source==="server"?d.reject(new M(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),p=new ka(us(l.path),f,{includeMetadataChanges:!0,_a:!0});return Ra(s,p)}(await Yi(n),n.asyncQueue,e,t,r)),r.promise}function Ay(n,e,t={}){const r=new vt;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,l,c,d){const f=new xa({next:v=>{f.Za(),a.enqueueAndForget(()=>Ca(s,p)),v.fromCache&&c.source==="server"?d.reject(new M(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),p=new ka(l,f,{includeMetadataChanges:!0,_a:!0});return Ra(s,p)}(await Yi(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Zd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Kc=new Map;/**
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
 */function eh(n,e,t){if(!t)throw new M(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Ry(n,e,t,r){if(e===!0&&r===!0)throw new M(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Qc(n){if(!O.isDocumentKey(n))throw new M(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Xc(n){if(O.isDocumentKey(n))throw new M(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Es(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":H()}function Qe(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Es(n);throw new M(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class Yc{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new M(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new M(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Ry("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Zd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new M(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new M(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new M(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class bs{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Yc({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Yc(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new zp;switch(r.type){case"firstParty":return new Qp(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new M(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Kc.get(t);r&&(V("ComponentProvider","Removing Datastore"),Kc.delete(t),r.terminate())}(this),Promise.resolve()}}function Cy(n,e,t,r={}){var i;const s=(n=Qe(n,bs))._getSettings(),a=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==a&&On("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=xe.MOCK_USER;else{l=$u(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new M(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new xe(d)}n._authCredentials=new Wp(new Zu(l,c))}}/**
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
 */class Gt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Gt(this.firestore,e,this._query)}}class Ue{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new $t(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ue(this.firestore,e,this._key)}}class $t extends Gt{constructor(e,t,r){super(e,t,us(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ue(this.firestore,null,new O(e))}withConverter(e){return new $t(this.firestore,e,this._path)}}function K(n,e,...t){if(n=ie(n),eh("collection","path",e),n instanceof bs){const r=oe.fromString(e,...t);return Xc(r),new $t(n,null,r)}{if(!(n instanceof Ue||n instanceof $t))throw new M(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(oe.fromString(e,...t));return Xc(r),new $t(n.firestore,null,r)}}function X(n,e,...t){if(n=ie(n),arguments.length===1&&(e=ed.newId()),eh("doc","path",e),n instanceof bs){const r=oe.fromString(e,...t);return Qc(r),new Ue(n,null,new O(r))}{if(!(n instanceof Ue||n instanceof $t))throw new M(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(oe.fromString(e,...t));return Qc(r),new Ue(n.firestore,n instanceof $t?n.converter:null,new O(r))}}/**
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
 */class Jc{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Vd(this,"async_queue_retry"),this.Vu=()=>{const r=fo();r&&V("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=fo();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=fo();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new vt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Kr(e))throw e;V("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw It("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=Ta.createAndSchedule(this,e,t,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&H()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function Zc(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(n,["next","error","complete"])}class At extends bs{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new Jc,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Jc(e),this._firestoreClient=void 0,await e}}}function Sy(n,e){const t=typeof n=="object"?n:sa(),r=typeof n=="string"?n:"(default)",i=ls(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=Fu("firestore");s&&Cy(i,...s)}return i}function Zr(n){if(n._terminated)throw new M(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||ky(n),n._firestoreClient}function ky(n){var e,t,r;const i=n._freezeSettings(),s=function(l,c,d,f){return new lg(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Zd(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new Ey(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class zn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new zn(Ae.fromBase64String(e))}catch(t){throw new M(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new zn(Ae.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class ei{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class _n{constructor(e){this._methodName=e}}/**
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
 */class Da{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new M(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ee(this._lat,e._lat)||ee(this._long,e._long)}}/**
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
 */class Na{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
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
 */const Py=/^__.*__$/;class xy{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Wt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Qr(e,this.data,t,this.fieldTransforms)}}class th{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Wt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function nh(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw H()}}class Is{constructor(e,t,r,i,s,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Is(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Ji(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(nh(this.Cu)&&Py.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Dy{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ys(e)}Qu(e,t,r,i=!1){return new Is({Cu:e,methodName:t,qu:r,path:be.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ts(n){const e=n._freezeSettings(),t=ys(n._databaseId);return new Dy(n._databaseId,!!e.ignoreUndefinedProperties,t)}function rh(n,e,t,r,i,s={}){const a=n.Qu(s.merge||s.mergeFields?2:0,e,t,i);Fa("Data must be an object, but it was:",a,r);const l=ah(r,a);let c,d;if(s.merge)c=new Ge(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const f=[];for(const p of s.mergeFields){const v=Wo(e,p,t);if(!a.contains(v))throw new M(S.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);ch(f,v)||f.push(v)}c=new Ge(f),d=a.fieldTransforms.filter(p=>c.covers(p.field))}else c=null,d=a.fieldTransforms;return new xy(new $e(l),c,d)}class As extends _n{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof As}}function ih(n,e,t){return new Is({Cu:3,qu:e.settings.qu,methodName:n._methodName,xu:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class La extends _n{_toFieldTransform(e){return new ms(e.path,new Br)}isEqual(e){return e instanceof La}}class Ma extends _n{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=ih(this,e,!0),r=this.Ku.map(s=>yn(s,t)),i=new $n(r);return new ms(e.path,i)}isEqual(e){return e instanceof Ma&&Vn(this.Ku,e.Ku)}}class Va extends _n{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=ih(this,e,!0),r=this.Ku.map(s=>yn(s,t)),i=new qn(r);return new ms(e.path,i)}isEqual(e){return e instanceof Va&&Vn(this.Ku,e.Ku)}}class Oa extends _n{constructor(e,t){super(e),this.$u=t}_toFieldTransform(e){const t=new $r(e.serializer,_d(e.serializer,this.$u));return new ms(e.path,t)}isEqual(e){return e instanceof Oa&&this.$u===e.$u}}function sh(n,e,t,r){const i=n.Qu(1,e,t);Fa("Data must be an object, but it was:",i,r);const s=[],a=$e.empty();pn(r,(c,d)=>{const f=Ua(e,c,t);d=ie(d);const p=i.Nu(f);if(d instanceof As)s.push(f);else{const v=yn(d,p);v!=null&&(s.push(f),a.set(f,v))}});const l=new Ge(s);return new th(a,l,i.fieldTransforms)}function oh(n,e,t,r,i,s){const a=n.Qu(1,e,t),l=[Wo(e,r,t)],c=[i];if(s.length%2!=0)throw new M(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<s.length;v+=2)l.push(Wo(e,s[v])),c.push(s[v+1]);const d=[],f=$e.empty();for(let v=l.length-1;v>=0;--v)if(!ch(d,l[v])){const b=l[v];let C=c[v];C=ie(C);const D=a.Nu(b);if(C instanceof As)d.push(b);else{const k=yn(C,D);k!=null&&(d.push(b),f.set(b,k))}}const p=new Ge(d);return new th(f,p,a.fieldTransforms)}function Ny(n,e,t,r=!1){return yn(t,n.Qu(r?4:3,e))}function yn(n,e){if(lh(n=ie(n)))return Fa("Unsupported field value:",e,n),ah(n,e);if(n instanceof _n)return function(r,i){if(!nh(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let a=0;for(const l of r){let c=yn(l,i.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),a++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=ie(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return _d(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ge.fromDate(r);return{timestampValue:Ki(i.serializer,s)}}if(r instanceof ge){const s=new ge(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ki(i.serializer,s)}}if(r instanceof Da)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof zn)return{bytesValue:Cd(i.serializer,r._byteString)};if(r instanceof Ue){const s=i.databaseId,a=r.firestore._databaseId;if(!a.isEqual(s))throw i.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:ga(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Na)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return fa(l.serializer,c)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${Es(r)}`)}(n,e)}function ah(n,e){const t={};return td(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):pn(n,(r,i)=>{const s=yn(i,e.Mu(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function lh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ge||n instanceof Da||n instanceof zn||n instanceof Ue||n instanceof _n||n instanceof Na)}function Fa(n,e,t){if(!lh(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const r=Es(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Wo(n,e,t){if((e=ie(e))instanceof ei)return e._internalPath;if(typeof e=="string")return Ua(n,e);throw Ji("Field path arguments must be of type string or ",n,!1,void 0,t)}const Ly=new RegExp("[~\\*/\\[\\]]");function Ua(n,e,t){if(e.search(Ly)>=0)throw Ji(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ei(...e.split("."))._internalPath}catch{throw Ji(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Ji(n,e,t,r,i){const s=r&&!r.isEmpty(),a=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||a)&&(c+=" (found",s&&(c+=` in field ${r}`),a&&(c+=` in document ${i}`),c+=")"),new M(S.INVALID_ARGUMENT,l+n+c)}function ch(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class uh{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ue(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new My(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Rs("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class My extends uh{data(){return super.data()}}function Rs(n,e){return typeof e=="string"?Ua(n,e):e instanceof ei?e._internalPath:e._delegate._internalPath}/**
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
 */function dh(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new M(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ba{}class hh extends Ba{}function ye(n,e,...t){let r=[];e instanceof Ba&&r.push(e),r=r.concat(t),function(s){const a=s.filter(c=>c instanceof $a).length,l=s.filter(c=>c instanceof Cs).length;if(a>1||a>0&&l>0)throw new M(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)n=i._apply(n);return n}class Cs extends hh{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Cs(e,t,r)}_apply(e){const t=this._parse(e);return fh(e._query,t),new Gt(e.firestore,e.converter,Vo(e._query,t))}_parse(e){const t=Ts(e.firestore);return function(s,a,l,c,d,f,p){let v;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new M(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){tu(p,f);const b=[];for(const C of p)b.push(eu(c,s,C));v={arrayValue:{values:b}}}else v=eu(c,s,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||tu(p,f),v=Ny(l,a,p,f==="in"||f==="not-in");return pe.create(d,f,v)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function pt(n,e,t){const r=e,i=Rs("where",n);return Cs._create(i,r,t)}class $a extends Ba{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new $a(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:tt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let a=i;const l=s.getFlattenedFilters();for(const c of l)fh(a,c),a=Vo(a,c)}(e._query,t),new Gt(e.firestore,e.converter,Vo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class qa extends hh{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new qa(e,t)}_apply(e){const t=function(i,s,a){if(i.startAt!==null)throw new M(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new M(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ur(s,a)}(e._query,this._field,this._direction);return new Gt(e.firestore,e.converter,function(i,s){const a=i.explicitOrderBy.concat([s]);return new Kn(i.path,i.collectionGroup,a,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function je(n,e="asc"){const t=e,r=Rs("orderBy",n);return qa._create(r,t)}function eu(n,e,t){if(typeof(t=ie(t))=="string"){if(t==="")throw new M(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ud(e)&&t.indexOf("/")!==-1)throw new M(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(oe.fromString(t));if(!O.isDocumentKey(r))throw new M(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Ec(n,new O(r))}if(t instanceof Ue)return Ec(n,t._key);throw new M(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Es(t)}.`)}function tu(n,e){if(!Array.isArray(n)||n.length===0)throw new M(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function fh(n,e){const t=function(i,s){for(const a of i)for(const l of a.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new M(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new M(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class Vy{convertValue(e,t="none"){switch(un(e)){case 0:return null;case 1:return e.booleanValue;case 2:return fe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(cn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw H()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return pn(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(a=>fe(a.doubleValue));return new Na(s)}convertGeoPoint(e){return new Da(fe(e.latitude),fe(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=ca(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Vr(e));default:return null}}convertTimestamp(e){const t=Ht(e);return new ge(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=oe.fromString(e);te(Nd(r));const i=new Or(r.get(1),r.get(3)),s=new O(r.popFirst(5));return i.isEqual(t)||It(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
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
 */function mh(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
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
 */class Tr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ph extends uh{constructor(e,t,r,i,s,a){super(e,t,r,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ui(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Rs("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Ui extends ph{data(e={}){return super.data(e)}}class gh{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Tr(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Ui(this._firestore,this._userDataWriter,r.key,r,new Tr(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map(l=>{const c=new Ui(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Tr(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const c=new Ui(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Tr(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:Oy(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Oy(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return H()}}/**
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
 */function Yn(n){n=Qe(n,Ue);const e=Qe(n.firestore,At);return Ty(Zr(e),n._key).then(t=>_h(e,n,t))}class ja extends Vy{constructor(e){super(),this.firestore=e}convertBytes(e){return new zn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ue(this.firestore,null,t)}}function et(n){n=Qe(n,Gt);const e=Qe(n.firestore,At),t=Zr(e),r=new ja(e);return dh(n._query),Ay(t,n._query).then(i=>new gh(e,r,n,i))}function He(n,e,t,...r){n=Qe(n,Ue);const i=Qe(n.firestore,At),s=Ts(i);let a;return a=typeof(e=ie(e))=="string"||e instanceof ei?oh(s,"updateDoc",n._key,e,t,r):sh(s,"updateDoc",n._key,e),Ss(i,[a.toMutation(n._key,qe.exists(!0))])}function ti(n){return Ss(Qe(n.firestore,At),[new gs(n._key,qe.none())])}function Xe(n,e){const t=Qe(n.firestore,At),r=X(n),i=mh(n.converter,e);return Ss(t,[rh(Ts(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,qe.exists(!1))]).then(()=>r)}function Ye(n,...e){var t,r,i;n=ie(n);let s={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||Zc(e[a])||(s=e[a],a++);const l={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Zc(e[a])){const p=e[a];e[a]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[a+1]=(r=p.error)===null||r===void 0?void 0:r.bind(p),e[a+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let c,d,f;if(n instanceof Ue)d=Qe(n.firestore,At),f=us(n._key.path),c={next:p=>{e[a]&&e[a](_h(d,n,p))},error:e[a+1],complete:e[a+2]};else{const p=Qe(n,Gt);d=Qe(p.firestore,At),f=p._query;const v=new ja(d);c={next:b=>{e[a]&&e[a](new gh(d,v,p,b))},error:e[a+1],complete:e[a+2]},dh(n._query)}return function(v,b,C,D){const k=new xa(D),U=new ka(b,k,C);return v.asyncQueue.enqueueAndForget(async()=>Ra(await Yi(v),U)),()=>{k.Za(),v.asyncQueue.enqueueAndForget(async()=>Ca(await Yi(v),U))}}(Zr(d),f,l,c)}function Ss(n,e){return function(r,i){const s=new vt;return r.asyncQueue.enqueueAndForget(async()=>fy(await Iy(r),i,s)),s.promise}(Zr(n),e)}function _h(n,e,t){const r=t.docs.get(e._key),i=new ja(n);return new ph(n,i,e._key,r,new Tr(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */class Fy{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ts(e)}set(e,t,r){this._verifyNotCommitted();const i=po(e,this._firestore),s=mh(i.converter,t,r),a=rh(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(a.toMutation(i._key,qe.none())),this}update(e,t,r,...i){this._verifyNotCommitted();const s=po(e,this._firestore);let a;return a=typeof(t=ie(t))=="string"||t instanceof ei?oh(this._dataReader,"WriteBatch.update",s._key,t,r,i):sh(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(a.toMutation(s._key,qe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=po(e,this._firestore);return this._mutations=this._mutations.concat(new gs(t._key,qe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new M(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function po(n,e){if((n=ie(n)).firestore!==e)throw new M(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}function ae(){return new La("serverTimestamp")}function Uy(...n){return new Ma("arrayUnion",n)}function By(...n){return new Va("arrayRemove",n)}function yh(n){return new Oa("increment",n)}/**
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
 */function ks(n){return Zr(n=Qe(n,At)),new Fy(n,e=>Ss(n,e))}(function(e,t=!0){(function(i){Gn=i})(mn),an(new qt("firestore",(r,{instanceIdentifier:i,options:s})=>{const a=r.getProvider("app").getImmediate(),l=new At(new Gp(r.getProvider("auth-internal")),new Yp(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new M(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Or(d.options.projectId,f)}(a,i),a);return s=Object.assign({useFetchStreams:t},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),st(gc,"4.7.3",e),st(gc,"4.7.3","esm2017")})();function Ha(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}function vh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const $y=vh,wh=new zr("auth","Firebase",vh());/**
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
 */const Zi=new ra("@firebase/auth");function qy(n,...e){Zi.logLevel<=Q.WARN&&Zi.warn(`Auth (${mn}): ${n}`,...e)}function Bi(n,...e){Zi.logLevel<=Q.ERROR&&Zi.error(`Auth (${mn}): ${n}`,...e)}/**
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
 */function nt(n,...e){throw za(n,...e)}function lt(n,...e){return za(n,...e)}function Eh(n,e,t){const r=Object.assign(Object.assign({},$y()),{[e]:t});return new zr("auth","Firebase",r).create(e,{appName:n.name})}function wt(n){return Eh(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function za(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return wh.create(n,...e)}function q(n,e,...t){if(!n)throw za(e,...t)}function gt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Bi(e),new Error(e)}function Rt(n,e){n||gt(e)}/**
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
 */function Go(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function jy(){return nu()==="http:"||nu()==="https:"}function nu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function Hy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(jy()||Im()||"connection"in navigator)?navigator.onLine:!0}function zy(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class ni{constructor(e,t){this.shortDelay=e,this.longDelay=t,Rt(t>e,"Short delay should be less than long delay!"),this.isMobile=wm()||Tm()}get(){return Hy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Wa(n,e){Rt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class bh{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;gt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;gt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;gt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Wy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Gy=new ni(3e4,6e4);function Kt(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Ct(n,e,t,r,i={}){return Ih(n,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const l=Wr(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},s);return bm()||(d.referrerPolicy="no-referrer"),bh.fetch()(Th(n,n.config.apiHost,t,l),d)})}async function Ih(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},Wy),e);try{const i=new Qy(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw xi(n,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const l=s.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw xi(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw xi(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw xi(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Eh(n,f,d);nt(n,f)}}catch(i){if(i instanceof dt)throw i;nt(n,"network-request-failed",{message:String(i)})}}async function ri(n,e,t,r,i={}){const s=await Ct(n,e,t,r,i);return"mfaPendingCredential"in s&&nt(n,"multi-factor-auth-required",{_serverResponse:s}),s}function Th(n,e,t,r){const i=`${e}${t}?${r}`;return n.config.emulator?Wa(n.config,i):`${n.config.apiScheme}://${i}`}function Ky(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Qy{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(lt(this.auth,"network-request-failed")),Gy.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function xi(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=lt(n,e,r);return i.customData._tokenResponse=t,i}function ru(n){return n!==void 0&&n.enterprise!==void 0}class Xy{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Ky(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Yy(n,e){return Ct(n,"GET","/v2/recaptchaConfig",Kt(n,e))}/**
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
 */async function Jy(n,e){return Ct(n,"POST","/v1/accounts:delete",e)}async function Ah(n,e){return Ct(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Pr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Zy(n,e=!1){const t=ie(n),r=await t.getIdToken(e),i=Ga(r);q(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Pr(go(i.auth_time)),issuedAtTime:Pr(go(i.iat)),expirationTime:Pr(go(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function go(n){return Number(n)*1e3}function Ga(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Bi("JWT malformed, contained fewer than 3 sections"),null;try{const i=Vu(t);return i?JSON.parse(i):(Bi("Failed to decode base64 JWT payload"),null)}catch(i){return Bi("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function iu(n){const e=Ga(n);return q(e,"internal-error"),q(typeof e.exp<"u","internal-error"),q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Wn(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof dt&&ev(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function ev({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class tv{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ko{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Pr(this.lastLoginAt),this.creationTime=Pr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function es(n){var e;const t=n.auth,r=await n.getIdToken(),i=await Wn(n,Ah(t,{idToken:r}));q(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Rh(s.providerUserInfo):[],l=rv(n.providerData,a),c=n.isAnonymous,d=!(n.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Ko(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,p)}async function nv(n){const e=ie(n);await es(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function rv(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Rh(n){return n.map(e=>{var{providerId:t}=e,r=Ha(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function iv(n,e){const t=await Ih(n,{},async()=>{const r=Wr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,a=Th(n,i,"/v1/token",`key=${s}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",bh.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function sv(n,e){return Ct(n,"POST","/v2/accounts:revokeToken",Kt(n,e))}/**
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
 */class xn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){q(e.idToken,"internal-error"),q(typeof e.idToken<"u","internal-error"),q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):iu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){q(e.length!==0,"internal-error");const t=iu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await iv(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,a=new xn;return r&&(q(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(q(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(q(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new xn,this.toJSON())}_performRefresh(){return gt("not implemented")}}/**
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
 */function Dt(n,e){q(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class _t{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=Ha(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new tv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ko(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Wn(this,this.stsTokenManager.getToken(this.auth,e));return q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Zy(this,e)}reload(){return nv(this)}_assign(e){this!==e&&(q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new _t(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await es(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(rt(this.auth.app))return Promise.reject(wt(this.auth));const e=await this.getIdToken();return await Wn(this,Jy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,a,l,c,d,f;const p=(r=t.displayName)!==null&&r!==void 0?r:void 0,v=(i=t.email)!==null&&i!==void 0?i:void 0,b=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,C=(a=t.photoURL)!==null&&a!==void 0?a:void 0,D=(l=t.tenantId)!==null&&l!==void 0?l:void 0,k=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,U=(d=t.createdAt)!==null&&d!==void 0?d:void 0,$=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:F,emailVerified:j,isAnonymous:ne,providerData:J,stsTokenManager:E}=t;q(F&&E,e,"internal-error");const g=xn.fromJSON(this.name,E);q(typeof F=="string",e,"internal-error"),Dt(p,e.name),Dt(v,e.name),q(typeof j=="boolean",e,"internal-error"),q(typeof ne=="boolean",e,"internal-error"),Dt(b,e.name),Dt(C,e.name),Dt(D,e.name),Dt(k,e.name),Dt(U,e.name),Dt($,e.name);const _=new _t({uid:F,auth:e,email:v,emailVerified:j,displayName:p,isAnonymous:ne,photoURL:C,phoneNumber:b,tenantId:D,stsTokenManager:g,createdAt:U,lastLoginAt:$});return J&&Array.isArray(J)&&(_.providerData=J.map(w=>Object.assign({},w))),k&&(_._redirectEventId=k),_}static async _fromIdTokenResponse(e,t,r=!1){const i=new xn;i.updateFromServerResponse(t);const s=new _t({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await es(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];q(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Rh(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new xn;l.updateFromIdToken(r);const c=new _t({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Ko(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,d),c}}/**
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
 */const su=new Map;function yt(n){Rt(n instanceof Function,"Expected a class definition");let e=su.get(n);return e?(Rt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,su.set(n,e),e)}/**
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
 */class Ch{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ch.type="NONE";const ou=Ch;/**
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
 */function $i(n,e,t){return`firebase:${n}:${e}:${t}`}class Dn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=$i(this.userKey,i.apiKey,s),this.fullPersistenceKey=$i("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?_t._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Dn(yt(ou),e,r);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||yt(ou);const a=$i(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const p=_t._fromJSON(e,f);d!==s&&(l=p),s=d;break}}catch{}const c=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new Dn(s,e,r):(s=c[0],l&&await s._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new Dn(s,e,r))}}/**
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
 */function au(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(xh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Sh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Nh(e))return"Blackberry";if(Lh(e))return"Webos";if(kh(e))return"Safari";if((e.includes("chrome/")||Ph(e))&&!e.includes("edge/"))return"Chrome";if(Dh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Sh(n=Le()){return/firefox\//i.test(n)}function kh(n=Le()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ph(n=Le()){return/crios\//i.test(n)}function xh(n=Le()){return/iemobile/i.test(n)}function Dh(n=Le()){return/android/i.test(n)}function Nh(n=Le()){return/blackberry/i.test(n)}function Lh(n=Le()){return/webos/i.test(n)}function Ka(n=Le()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ov(n=Le()){var e;return Ka(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function av(){return Am()&&document.documentMode===10}function Mh(n=Le()){return Ka(n)||Dh(n)||Lh(n)||Nh(n)||/windows phone/i.test(n)||xh(n)}/**
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
 */function Vh(n,e=[]){let t;switch(n){case"Browser":t=au(Le());break;case"Worker":t=`${au(Le())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${mn}/${r}`}/**
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
 */class lv{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((a,l)=>{try{const c=e(s);a(c)}catch(c){l(c)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function cv(n,e={}){return Ct(n,"GET","/v2/passwordPolicy",Kt(n,e))}/**
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
 */const uv=6;class dv{constructor(e){var t,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:uv,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class hv{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new lu(this),this.idTokenSubscription=new lu(this),this.beforeStateQueue=new lv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=wh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=yt(t)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await Dn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ah(this,{idToken:e}),r=await _t._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(rt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(i=c.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await es(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=zy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(rt(this.app))return Promise.reject(wt(this));const t=e?ie(e):null;return t&&q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return rt(this.app)?Promise.reject(wt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return rt(this.app)?Promise.reject(wt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(yt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await cv(this),t=new dv(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new zr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await sv(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&yt(e)||this._popupRedirectResolver;q(t,this,"argument-error"),this.redirectPersistenceManager=await Dn.create(this,[yt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(q(l,this,"internal-error"),l.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,r,i);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Vh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&qy(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function vn(n){return ie(n)}class lu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Nm(t=>this.observer=t)}get next(){return q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Ps={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function fv(n){Ps=n}function Oh(n){return Ps.loadJS(n)}function mv(){return Ps.recaptchaEnterpriseScript}function pv(){return Ps.gapiScript}function gv(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const _v="recaptcha-enterprise",yv="NO_RECAPTCHA";class vv{constructor(e){this.type=_v,this.auth=vn(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,l)=>{Yy(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new Xy(c);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function i(s,a,l){const c=window.grecaptcha;ru(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(d=>{a(d)}).catch(()=>{a(yv)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,a)=>{r(this.auth).then(l=>{if(!t&&ru(window.grecaptcha))i(l,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=mv();c.length!==0&&(c+=l),Oh(c).then(()=>{i(l,s,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function cu(n,e,t,r=!1){const i=new vv(n);let s;try{s=await i.verify(t)}catch{s=await i.verify(t,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:s}):Object.assign(a,{captchaResponse:s}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Qo(n,e,t,r){var i;if(!((i=n._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await cu(n,e,t,t==="getOobCode");return r(n,s)}else return r(n,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await cu(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(s)})}/**
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
 */function wv(n,e){const t=ls(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Vn(s,e??{}))return i;nt(i,"already-initialized")}return t.initialize({options:e})}function Ev(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(yt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function bv(n,e,t){const r=vn(n);q(r._canInitEmulator,r,"emulator-config-failed"),q(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Fh(e),{host:a,port:l}=Iv(e),c=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),Tv()}function Fh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Iv(n){const e=Fh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:uu(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:uu(a)}}}function uu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Tv(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Qa{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return gt("not implemented")}_getIdTokenResponse(e){return gt("not implemented")}_linkToIdToken(e,t){return gt("not implemented")}_getReauthenticationResolver(e){return gt("not implemented")}}async function Av(n,e){return Ct(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function Rv(n,e){return ri(n,"POST","/v1/accounts:signInWithPassword",Kt(n,e))}/**
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
 */async function Cv(n,e){return ri(n,"POST","/v1/accounts:signInWithEmailLink",Kt(n,e))}async function Sv(n,e){return ri(n,"POST","/v1/accounts:signInWithEmailLink",Kt(n,e))}/**
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
 */class qr extends Qa{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new qr(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new qr(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qo(e,t,"signInWithPassword",Rv);case"emailLink":return Cv(e,{email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qo(e,r,"signUpPassword",Av);case"emailLink":return Sv(e,{idToken:t,email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function Nn(n,e){return ri(n,"POST","/v1/accounts:signInWithIdp",Kt(n,e))}/**
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
 */const kv="http://localhost";class dn extends Qa{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new dn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=Ha(t,["providerId","signInMethod"]);if(!r||!i)return null;const a=new dn(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Nn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Nn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Nn(e,t)}buildRequest(){const e={requestUri:kv,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Wr(t)}return e}}/**
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
 */function Pv(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function xv(n){const e=vr(wr(n)).link,t=e?vr(wr(e)).deep_link_id:null,r=vr(wr(n)).deep_link_id;return(r?vr(wr(r)).link:null)||r||t||e||n}class Xa{constructor(e){var t,r,i,s,a,l;const c=vr(wr(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,p=Pv((i=c.mode)!==null&&i!==void 0?i:null);q(d&&f&&p,"argument-error"),this.apiKey=d,this.operation=p,this.code=f,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=xv(e);try{return new Xa(t)}catch{return null}}}/**
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
 */class Jn{constructor(){this.providerId=Jn.PROVIDER_ID}static credential(e,t){return qr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Xa.parseLink(t);return q(r,"argument-error"),qr._fromEmailAndCode(e,r.code,r.tenantId)}}Jn.PROVIDER_ID="password";Jn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Jn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Uh{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ii extends Uh{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Nt extends ii{constructor(){super("facebook.com")}static credential(e){return dn._fromParams({providerId:Nt.PROVIDER_ID,signInMethod:Nt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Nt.credentialFromTaggedObject(e)}static credentialFromError(e){return Nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Nt.credential(e.oauthAccessToken)}catch{return null}}}Nt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Nt.PROVIDER_ID="facebook.com";/**
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
 */class Lt extends ii{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return dn._fromParams({providerId:Lt.PROVIDER_ID,signInMethod:Lt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Lt.credentialFromTaggedObject(e)}static credentialFromError(e){return Lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Lt.credential(t,r)}catch{return null}}}Lt.GOOGLE_SIGN_IN_METHOD="google.com";Lt.PROVIDER_ID="google.com";/**
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
 */class Mt extends ii{constructor(){super("github.com")}static credential(e){return dn._fromParams({providerId:Mt.PROVIDER_ID,signInMethod:Mt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Mt.credentialFromTaggedObject(e)}static credentialFromError(e){return Mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Mt.credential(e.oauthAccessToken)}catch{return null}}}Mt.GITHUB_SIGN_IN_METHOD="github.com";Mt.PROVIDER_ID="github.com";/**
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
 */class Vt extends ii{constructor(){super("twitter.com")}static credential(e,t){return dn._fromParams({providerId:Vt.PROVIDER_ID,signInMethod:Vt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Vt.credentialFromTaggedObject(e)}static credentialFromError(e){return Vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Vt.credential(t,r)}catch{return null}}}Vt.TWITTER_SIGN_IN_METHOD="twitter.com";Vt.PROVIDER_ID="twitter.com";/**
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
 */async function Dv(n,e){return ri(n,"POST","/v1/accounts:signUp",Kt(n,e))}/**
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
 */class hn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await _t._fromIdTokenResponse(e,r,i),a=du(r);return new hn({user:s,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=du(r);return new hn({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function du(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class ts extends dt{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,ts.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new ts(e,t,r,i)}}function Bh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?ts._fromErrorAndOperation(n,s,e,r):s})}async function Nv(n,e,t=!1){const r=await Wn(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return hn._forOperation(n,"link",r)}/**
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
 */async function Lv(n,e,t=!1){const{auth:r}=n;if(rt(r.app))return Promise.reject(wt(r));const i="reauthenticate";try{const s=await Wn(n,Bh(r,i,e,n),t);q(s.idToken,r,"internal-error");const a=Ga(s.idToken);q(a,r,"internal-error");const{sub:l}=a;return q(n.uid===l,r,"user-mismatch"),hn._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&nt(r,"user-mismatch"),s}}/**
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
 */async function $h(n,e,t=!1){if(rt(n.app))return Promise.reject(wt(n));const r="signIn",i=await Bh(n,r,e),s=await hn._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function Mv(n,e){return $h(vn(n),e)}/**
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
 */async function qh(n){const e=vn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Vv(n,e,t){if(rt(n.app))return Promise.reject(wt(n));const r=vn(n),a=await Qo(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Dv).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&qh(n),c}),l=await hn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Ov(n,e,t){return rt(n.app)?Promise.reject(wt(n)):Mv(ie(n),Jn.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&qh(n),r})}/**
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
 */async function Fv(n,e){return Ct(n,"POST","/v1/accounts:update",e)}/**
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
 */async function Uv(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=ie(n),s={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await Wn(r,Fv(r.auth,s));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Bv(n,e,t,r){return ie(n).onIdTokenChanged(e,t,r)}function $v(n,e,t){return ie(n).beforeAuthStateChanged(e,t)}function qv(n,e,t,r){return ie(n).onAuthStateChanged(e,t,r)}function jh(n){return ie(n).signOut()}const ns="__sak";/**
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
 */class Hh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ns,"1"),this.storage.removeItem(ns),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const jv=1e3,Hv=10;class zh extends Hh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Mh(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);av()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Hv):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},jv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}zh.type="LOCAL";const zv=zh;/**
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
 */class Wh extends Hh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Wh.type="SESSION";const Gh=Wh;/**
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
 */function Wv(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class xs{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new xs(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(a).map(async d=>d(t.origin,s)),c=await Wv(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}xs.receivers=[];/**
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
 */function Ya(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class Gv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((l,c)=>{const d=Ya("",20);i.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(p){const v=p;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(v.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function ct(){return window}function Kv(n){ct().location.href=n}/**
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
 */function Kh(){return typeof ct().WorkerGlobalScope<"u"&&typeof ct().importScripts=="function"}async function Qv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Xv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Yv(){return Kh()?self:null}/**
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
 */const Qh="firebaseLocalStorageDb",Jv=1,rs="firebaseLocalStorage",Xh="fbase_key";class si{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ds(n,e){return n.transaction([rs],e?"readwrite":"readonly").objectStore(rs)}function Zv(){const n=indexedDB.deleteDatabase(Qh);return new si(n).toPromise()}function Xo(){const n=indexedDB.open(Qh,Jv);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(rs,{keyPath:Xh})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(rs)?e(r):(r.close(),await Zv(),e(await Xo()))})})}async function hu(n,e,t){const r=Ds(n,!0).put({[Xh]:e,value:t});return new si(r).toPromise()}async function ew(n,e){const t=Ds(n,!1).get(e),r=await new si(t).toPromise();return r===void 0?null:r.value}function fu(n,e){const t=Ds(n,!0).delete(e);return new si(t).toPromise()}const tw=800,nw=3;class Yh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Xo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>nw)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Kh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=xs._getInstance(Yv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Qv(),!this.activeServiceWorker)return;this.sender=new Gv(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Xv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Xo();return await hu(e,ns,"1"),await fu(e,ns),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>hu(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ew(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>fu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Ds(i,!1).getAll();return new si(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),tw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Yh.type="LOCAL";const rw=Yh;new ni(3e4,6e4);/**
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
 */function iw(n,e){return e?yt(e):(q(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Ja extends Qa{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Nn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Nn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Nn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function sw(n){return $h(n.auth,new Ja(n),n.bypassAuthState)}function ow(n){const{auth:e,user:t}=n;return q(t,e,"internal-error"),Lv(t,new Ja(n),n.bypassAuthState)}async function aw(n){const{auth:e,user:t}=n;return q(t,e,"internal-error"),Nv(t,new Ja(n),n.bypassAuthState)}/**
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
 */class Jh{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return sw;case"linkViaPopup":case"linkViaRedirect":return aw;case"reauthViaPopup":case"reauthViaRedirect":return ow;default:nt(this.auth,"internal-error")}}resolve(e){Rt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Rt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const lw=new ni(2e3,1e4);class kn extends Jh{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,kn.currentPopupAction&&kn.currentPopupAction.cancel(),kn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return q(e,this.auth,"internal-error"),e}async onExecution(){Rt(this.filter.length===1,"Popup operations only handle one event");const e=Ya();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(lt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(lt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,kn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(lt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,lw.get())};e()}}kn.currentPopupAction=null;/**
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
 */const cw="pendingRedirect",qi=new Map;class uw extends Jh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=qi.get(this.auth._key());if(!e){try{const r=await dw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}qi.set(this.auth._key(),e)}return this.bypassAuthState||qi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function dw(n,e){const t=mw(e),r=fw(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}function hw(n,e){qi.set(n._key(),e)}function fw(n){return yt(n._redirectPersistence)}function mw(n){return $i(cw,n.config.apiKey,n.name)}async function pw(n,e,t=!1){if(rt(n.app))return Promise.reject(wt(n));const r=vn(n),i=iw(r,e),a=await new uw(r,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const gw=10*60*1e3;class _w{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!yw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Zh(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(lt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=gw&&this.cachedEventUids.clear(),this.cachedEventUids.has(mu(e))}saveEventToCache(e){this.cachedEventUids.add(mu(e)),this.lastProcessedEventTime=Date.now()}}function mu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Zh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function yw(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Zh(n);default:return!1}}/**
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
 */async function vw(n,e={}){return Ct(n,"GET","/v1/projects",e)}/**
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
 */const ww=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ew=/^https?/;async function bw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await vw(n);for(const t of e)try{if(Iw(t))return}catch{}nt(n,"unauthorized-domain")}function Iw(n){const e=Go(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Ew.test(t))return!1;if(ww.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Tw=new ni(3e4,6e4);function pu(){const n=ct().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Aw(n){return new Promise((e,t)=>{var r,i,s;function a(){pu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{pu(),t(lt(n,"network-request-failed"))},timeout:Tw.get()})}if(!((i=(r=ct().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=ct().gapi)===null||s===void 0)&&s.load)a();else{const l=gv("iframefcb");return ct()[l]=()=>{gapi.load?a():t(lt(n,"network-request-failed"))},Oh(`${pv()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw ji=null,e})}let ji=null;function Rw(n){return ji=ji||Aw(n),ji}/**
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
 */const Cw=new ni(5e3,15e3),Sw="__/auth/iframe",kw="emulator/auth/iframe",Pw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},xw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Dw(n){const e=n.config;q(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Wa(e,kw):`https://${n.config.authDomain}/${Sw}`,r={apiKey:e.apiKey,appName:n.name,v:mn},i=xw.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${Wr(r).slice(1)}`}async function Nw(n){const e=await Rw(n),t=ct().gapi;return q(t,n,"internal-error"),e.open({where:document.body,url:Dw(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Pw,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=lt(n,"network-request-failed"),l=ct().setTimeout(()=>{s(a)},Cw.get());function c(){ct().clearTimeout(l),i(r)}r.ping(c).then(c,()=>{s(a)})}))}/**
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
 */const Lw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Mw=500,Vw=600,Ow="_blank",Fw="http://localhost";class gu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Uw(n,e,t,r=Mw,i=Vw){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Lw),{width:r.toString(),height:i.toString(),top:s,left:a}),d=Le().toLowerCase();t&&(l=Ph(d)?Ow:t),Sh(d)&&(e=e||Fw,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[b,C])=>`${v}${b}=${C},`,"");if(ov(d)&&l!=="_self")return Bw(e||"",l),new gu(null);const p=window.open(e||"",l,f);q(p,n,"popup-blocked");try{p.focus()}catch{}return new gu(p)}function Bw(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const $w="__/auth/handler",qw="emulator/auth/handler",jw=encodeURIComponent("fac");async function _u(n,e,t,r,i,s){q(n.config.authDomain,n,"auth-domain-config-required"),q(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:mn,eventId:i};if(e instanceof Uh){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Dm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))a[f]=p}if(e instanceof ii){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${jw}=${encodeURIComponent(c)}`:"";return`${Hw(n)}?${Wr(l).slice(1)}${d}`}function Hw({config:n}){return n.emulator?Wa(n,qw):`https://${n.authDomain}/${$w}`}/**
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
 */const _o="webStorageSupport";class zw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Gh,this._completeRedirectFn=pw,this._overrideRedirectResult=hw}async _openPopup(e,t,r,i){var s;Rt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await _u(e,t,r,Go(),i);return Uw(e,a,Ya())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await _u(e,t,r,Go(),i);return Kv(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(Rt(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Nw(e),r=new _w(e);return t.register("authEvent",i=>(q(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(_o,{type:_o},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[_o];a!==void 0&&t(!!a),nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=bw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Mh()||kh()||Ka()}}const Ww=zw;var yu="@firebase/auth",vu="1.7.9";/**
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
 */class Gw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Kw(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Qw(n){an(new qt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;q(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Vh(n)},d=new hv(r,i,s,c);return Ev(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),an(new qt("auth-internal",e=>{const t=vn(e.getProvider("auth").getImmediate());return(r=>new Gw(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),st(yu,vu,Kw(n)),st(yu,vu,"esm2017")}/**
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
 */const Xw=5*60,Yw=Bu("authIdTokenMaxAge")||Xw;let wu=null;const Jw=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Yw)return;const i=t==null?void 0:t.token;wu!==i&&(wu=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Zw(n=sa()){const e=ls(n,"auth");if(e.isInitialized())return e.getImmediate();const t=wv(n,{popupRedirectResolver:Ww,persistence:[rw,zv,Gh]}),r=Bu("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Jw(s.toString());$v(t,a,()=>a(t.currentUser)),Bv(t,l=>a(l))}}const i=Ou("auth");return i&&bv(t,`http://${i}`),t}function eE(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}fv({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=lt("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",eE().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Qw("Browser");/**
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
 */const ef="firebasestorage.googleapis.com",tf="storageBucket",tE=2*60*1e3,nE=10*60*1e3,rE=1e3;/**
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
 */class de extends dt{constructor(e,t,r=0){super(yo(e),`Firebase Storage: ${t} (${yo(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,de.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return yo(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var le;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(le||(le={}));function yo(n){return"storage/"+n}function Za(){const n="An unknown error occurred, please check the error payload for server response.";return new de(le.UNKNOWN,n)}function iE(n){return new de(le.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function sE(n){return new de(le.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function oE(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new de(le.UNAUTHENTICATED,n)}function aE(){return new de(le.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function lE(n){return new de(le.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function nf(){return new de(le.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function rf(){return new de(le.CANCELED,"User canceled the upload/download.")}function cE(n){return new de(le.INVALID_URL,"Invalid URL '"+n+"'.")}function uE(n){return new de(le.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function dE(){return new de(le.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+tf+"' property when initializing the app?")}function sf(){return new de(le.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function hE(){return new de(le.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function fE(){return new de(le.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function mE(n){return new de(le.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Yo(n){return new de(le.INVALID_ARGUMENT,n)}function of(){return new de(le.APP_DELETED,"The Firebase app was deleted.")}function pE(n){return new de(le.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function xr(n,e){return new de(le.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function yr(n){throw new de(le.INTERNAL_ERROR,"Internal error: "+n)}/**
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
 */class Ke{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Ke.makeFromUrl(e,t)}catch{return new Ke(e,"")}if(r.path==="")return r;throw uE(e)}static makeFromUrl(e,t){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(j){j.path.charAt(j.path.length-1)==="/"&&(j.path_=j.path_.slice(0,-1))}const a="(/(.*))?$",l=new RegExp("^gs://"+i+a,"i"),c={bucket:1,path:3};function d(j){j.path_=decodeURIComponent(j.path)}const f="v[A-Za-z0-9_]+",p=t.replace(/[.]/g,"\\."),v="(/([^?#]*).*)?$",b=new RegExp(`^https?://${p}/${f}/b/${i}/o${v}`,"i"),C={bucket:1,path:3},D=t===ef?"(?:storage.googleapis.com|storage.cloud.google.com)":t,k="([^?#]*)",U=new RegExp(`^https?://${D}/${i}/${k}`,"i"),F=[{regex:l,indices:c,postModify:s},{regex:b,indices:C,postModify:d},{regex:U,indices:{bucket:1,path:2},postModify:d}];for(let j=0;j<F.length;j++){const ne=F[j],J=ne.regex.exec(e);if(J){const E=J[ne.indices.bucket];let g=J[ne.indices.path];g||(g=""),r=new Ke(E,g),ne.postModify(r);break}}if(r==null)throw cE(e);return r}}class gE{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function _E(n,e,t){let r=1,i=null,s=null,a=!1,l=0;function c(){return l===2}let d=!1;function f(...k){d||(d=!0,e.apply(null,k))}function p(k){i=setTimeout(()=>{i=null,n(b,c())},k)}function v(){s&&clearTimeout(s)}function b(k,...U){if(d){v();return}if(k){v(),f.call(null,k,...U);return}if(c()||a){v(),f.call(null,k,...U);return}r<64&&(r*=2);let F;l===1?(l=2,F=0):F=(r+Math.random())*1e3,p(F)}let C=!1;function D(k){C||(C=!0,v(),!d&&(i!==null?(k||(l=2),clearTimeout(i),p(0)):k||(l=1)))}return p(0),s=setTimeout(()=>{a=!0,D(!0)},t),D}function yE(n){n(!1)}/**
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
 */function vE(n){return n!==void 0}function wE(n){return typeof n=="function"}function EE(n){return typeof n=="object"&&!Array.isArray(n)}function Ns(n){return typeof n=="string"||n instanceof String}function Eu(n){return el()&&n instanceof Blob}function el(){return typeof Blob<"u"}function bu(n,e,t,r){if(r<e)throw Yo(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw Yo(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
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
 */function oi(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function af(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const i=e(r)+"="+e(n[r]);t=t+i+"&"}return t=t.slice(0,-1),t}var on;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(on||(on={}));/**
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
 */function lf(n,e){const t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,s=e.indexOf(n)!==-1;return t||i||s}/**
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
 */class bE{constructor(e,t,r,i,s,a,l,c,d,f,p,v=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=a,this.callback_=l,this.errorCallback_=c,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=p,this.retry=v,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((b,C)=>{this.resolve_=b,this.reject_=C,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new Di(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const a=l=>{const c=l.loaded,d=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,d)};this.progressCallback_!==null&&s.addUploadProgressListener(a),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(a),this.pendingConnection_=null;const l=s.getErrorCode()===on.NO_ERROR,c=s.getStatus();if(!l||lf(c,this.additionalRetryCodes_)&&this.retry){const f=s.getErrorCode()===on.ABORT;r(!1,new Di(!1,null,f));return}const d=this.successCodes_.indexOf(c)!==-1;r(!0,new Di(d,s))})},t=(r,i)=>{const s=this.resolve_,a=this.reject_,l=i.connection;if(i.wasSuccessCode)try{const c=this.callback_(l,l.getResponse());vE(c)?s(c):s()}catch(c){a(c)}else if(l!==null){const c=Za();c.serverResponse=l.getErrorText(),this.errorCallback_?a(this.errorCallback_(l,c)):a(c)}else if(i.canceled){const c=this.appDelete_?of():rf();a(c)}else{const c=nf();a(c)}};this.canceled_?t(!1,new Di(!1,null,!0)):this.backoffId_=_E(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&yE(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Di{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function IE(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function TE(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function AE(n,e){e&&(n["X-Firebase-GMPID"]=e)}function RE(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function CE(n,e,t,r,i,s,a=!0){const l=af(n.urlParams),c=n.url+l,d=Object.assign({},n.headers);return AE(d,e),IE(d,t),TE(d,s),RE(d,r),new bE(c,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,a)}/**
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
 */function SE(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function kE(...n){const e=SE();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(el())return new Blob(n);throw new de(le.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function PE(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
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
 */function xE(n){if(typeof atob>"u")throw mE("base-64");return atob(n)}/**
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
 */const it={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class vo{constructor(e,t){this.data=e,this.contentType=t||null}}function DE(n,e){switch(n){case it.RAW:return new vo(cf(e));case it.BASE64:case it.BASE64URL:return new vo(uf(n,e));case it.DATA_URL:return new vo(LE(e),ME(e))}throw Za()}function cf(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const s=r,a=n.charCodeAt(++t);r=65536|(s&1023)<<10|a&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function NE(n){let e;try{e=decodeURIComponent(n)}catch{throw xr(it.DATA_URL,"Malformed data URL.")}return cf(e)}function uf(n,e){switch(n){case it.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw xr(n,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case it.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw xr(n,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=xE(e)}catch(i){throw i.message.includes("polyfill")?i:xr(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}class df{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw xr(it.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=VE(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function LE(n){const e=new df(n);return e.base64?uf(it.BASE64,e.rest):NE(e.rest)}function ME(n){return new df(n).contentType}function VE(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
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
 */class Ot{constructor(e,t){let r=0,i="";Eu(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,t){if(Eu(this.data_)){const r=this.data_,i=PE(r,e,t);return i===null?null:new Ot(i)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new Ot(r,!0)}}static getBlob(...e){if(el()){const t=e.map(r=>r instanceof Ot?r.data_:r);return new Ot(kE.apply(null,t))}else{const t=e.map(a=>Ns(a)?DE(it.RAW,a).data:a.data_);let r=0;t.forEach(a=>{r+=a.byteLength});const i=new Uint8Array(r);let s=0;return t.forEach(a=>{for(let l=0;l<a.length;l++)i[s++]=a[l]}),new Ot(i,!0)}}uploadData(){return this.data_}}/**
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
 */function hf(n){let e;try{e=JSON.parse(n)}catch{return null}return EE(e)?e:null}/**
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
 */function OE(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function FE(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function ff(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
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
 */function UE(n,e){return e}class Oe{constructor(e,t,r,i){this.server=e,this.local=t||e,this.writable=!!r,this.xform=i||UE}}let Ni=null;function BE(n){return!Ns(n)||n.length<2?n:ff(n)}function mf(){if(Ni)return Ni;const n=[];n.push(new Oe("bucket")),n.push(new Oe("generation")),n.push(new Oe("metageneration")),n.push(new Oe("name","fullPath",!0));function e(s,a){return BE(a)}const t=new Oe("name");t.xform=e,n.push(t);function r(s,a){return a!==void 0?Number(a):a}const i=new Oe("size");return i.xform=r,n.push(i),n.push(new Oe("timeCreated")),n.push(new Oe("updated")),n.push(new Oe("md5Hash",null,!0)),n.push(new Oe("cacheControl",null,!0)),n.push(new Oe("contentDisposition",null,!0)),n.push(new Oe("contentEncoding",null,!0)),n.push(new Oe("contentLanguage",null,!0)),n.push(new Oe("contentType",null,!0)),n.push(new Oe("metadata","customMetadata",!0)),Ni=n,Ni}function $E(n,e){function t(){const r=n.bucket,i=n.fullPath,s=new Ke(r,i);return e._makeStorageReference(s)}Object.defineProperty(n,"ref",{get:t})}function qE(n,e,t){const r={};r.type="file";const i=t.length;for(let s=0;s<i;s++){const a=t[s];r[a.local]=a.xform(r,e[a.server])}return $E(r,n),r}function pf(n,e,t){const r=hf(e);return r===null?null:qE(n,r,t)}function jE(n,e,t,r){const i=hf(e);if(i===null||!Ns(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const a=encodeURIComponent;return s.split(",").map(d=>{const f=n.bucket,p=n.fullPath,v="/b/"+a(f)+"/o/"+a(p),b=oi(v,t,r),C=af({alt:"media",token:d});return b+C})[0]}function gf(n,e){const t={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(t[s.server]=n[s.local])}return JSON.stringify(t)}class Zn{constructor(e,t,r,i){this.url=e,this.method=t,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
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
 */function Et(n){if(!n)throw Za()}function tl(n,e){function t(r,i){const s=pf(n,i,e);return Et(s!==null),s}return t}function HE(n,e){function t(r,i){const s=pf(n,i,e);return Et(s!==null),jE(s,i,n.host,n._protocol)}return t}function ai(n){function e(t,r){let i;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?i=aE():i=oE():t.getStatus()===402?i=sE(n.bucket):t.getStatus()===403?i=lE(n.path):i=r,i.status=t.getStatus(),i.serverResponse=r.serverResponse,i}return e}function _f(n){const e=ai(n);function t(r,i){let s=e(r,i);return r.getStatus()===404&&(s=iE(n.path)),s.serverResponse=i.serverResponse,s}return t}function zE(n,e,t){const r=e.fullServerUrl(),i=oi(r,n.host,n._protocol),s="GET",a=n.maxOperationRetryTime,l=new Zn(i,s,tl(n,t),a);return l.errorHandler=_f(e),l}function WE(n,e,t){const r=e.fullServerUrl(),i=oi(r,n.host,n._protocol),s="GET",a=n.maxOperationRetryTime,l=new Zn(i,s,HE(n,t),a);return l.errorHandler=_f(e),l}function GE(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function yf(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=GE(null,e)),r}function KE(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function l(){let F="";for(let j=0;j<2;j++)F=F+Math.random().toString().slice(2);return F}const c=l();a["Content-Type"]="multipart/related; boundary="+c;const d=yf(e,r,i),f=gf(d,t),p="--"+c+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+c+`\r
Content-Type: `+d.contentType+`\r
\r
`,v=`\r
--`+c+"--",b=Ot.getBlob(p,r,v);if(b===null)throw sf();const C={name:d.fullPath},D=oi(s,n.host,n._protocol),k="POST",U=n.maxUploadRetryTime,$=new Zn(D,k,tl(n,t),U);return $.urlParams=C,$.headers=a,$.body=b.uploadData(),$.errorHandler=ai(e),$}class is{constructor(e,t,r,i){this.current=e,this.total=t,this.finalized=!!r,this.metadata=i||null}}function nl(n,e){let t=null;try{t=n.getResponseHeader("X-Goog-Upload-Status")}catch{Et(!1)}return Et(!!t&&(e||["active"]).indexOf(t)!==-1),t}function QE(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),a=yf(e,r,i),l={name:a.fullPath},c=oi(s,n.host,n._protocol),d="POST",f={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${r.size()}`,"X-Goog-Upload-Header-Content-Type":a.contentType,"Content-Type":"application/json; charset=utf-8"},p=gf(a,t),v=n.maxUploadRetryTime;function b(D){nl(D);let k;try{k=D.getResponseHeader("X-Goog-Upload-URL")}catch{Et(!1)}return Et(Ns(k)),k}const C=new Zn(c,d,b,v);return C.urlParams=l,C.headers=f,C.body=p,C.errorHandler=ai(e),C}function XE(n,e,t,r){const i={"X-Goog-Upload-Command":"query"};function s(d){const f=nl(d,["active","final"]);let p=null;try{p=d.getResponseHeader("X-Goog-Upload-Size-Received")}catch{Et(!1)}p||Et(!1);const v=Number(p);return Et(!isNaN(v)),new is(v,r.size(),f==="final")}const a="POST",l=n.maxUploadRetryTime,c=new Zn(t,a,s,l);return c.headers=i,c.errorHandler=ai(e),c}const Iu=256*1024;function YE(n,e,t,r,i,s,a,l){const c=new is(0,0);if(a?(c.current=a.current,c.total=a.total):(c.current=0,c.total=r.size()),r.size()!==c.total)throw hE();const d=c.total-c.current;let f=d;i>0&&(f=Math.min(f,i));const p=c.current,v=p+f;let b="";f===0?b="finalize":d===f?b="upload, finalize":b="upload";const C={"X-Goog-Upload-Command":b,"X-Goog-Upload-Offset":`${c.current}`},D=r.slice(p,v);if(D===null)throw sf();function k(j,ne){const J=nl(j,["active","final"]),E=c.current+f,g=r.size();let _;return J==="final"?_=tl(e,s)(j,ne):_=null,new is(E,g,J==="final",_)}const U="POST",$=e.maxUploadRetryTime,F=new Zn(t,U,k,$);return F.headers=C,F.body=D.uploadData(),F.progressCallback=l||null,F.errorHandler=ai(n),F}const Be={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function wo(n){switch(n){case"running":case"pausing":case"canceling":return Be.RUNNING;case"paused":return Be.PAUSED;case"success":return Be.SUCCESS;case"canceled":return Be.CANCELED;case"error":return Be.ERROR;default:return Be.ERROR}}/**
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
 */class JE{constructor(e,t,r){if(wE(e)||t!=null||r!=null)this.next=e,this.error=t??void 0,this.complete=r??void 0;else{const s=e;this.next=s.next,this.error=s.error,this.complete=s.complete}}}/**
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
 */function Tn(n){return(...e)=>{Promise.resolve().then(()=>n(...e))}}class ZE{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=on.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=on.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=on.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,i){if(this.sent_)throw yr("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const s in i)i.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,i[s].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw yr("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw yr("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw yr("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw yr("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class eb extends ZE{initXhr(){this.xhr_.responseType="text"}}function Sn(){return new eb}/**
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
 */class tb{constructor(e,t,r=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=r,this._mappings=mf(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=i=>{if(this._request=void 0,this._chunkMultiplier=1,i._codeEquals(le.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const s=this.isExponentialBackoffExpired();if(lf(i.status,[]))if(s)i=nf();else{this.sleepTime=Math.max(this.sleepTime*2,rE),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=i,this._transition("error")}},this._metadataErrorHandler=i=>{this._request=void 0,i._codeEquals(le.CANCELED)?this.completeTransitions_():(this._error=i,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((i,s)=>{this._resolve=i,this._reject=s,this._start()}),this._promise.then(null,()=>{})}isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,r])=>{switch(this._state){case"running":e(t,r);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,t)=>{const r=QE(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),i=this._ref.storage._makeRequest(r,Sn,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._uploadUrl=s,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((t,r)=>{const i=XE(this._ref.storage,this._ref._location,e,this._blob),s=this._ref.storage._makeRequest(i,Sn,t,r);this._request=s,s.getPromise().then(a=>{a=a,this._request=void 0,this._updateProgress(a.current),this._needToFetchStatus=!1,a.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=Iu*this._chunkMultiplier,t=new is(this._transferred,this._blob.size()),r=this._uploadUrl;this._resolveToken((i,s)=>{let a;try{a=YE(this._ref._location,this._ref.storage,r,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(c){this._error=c,this._transition("error");return}const l=this._ref.storage._makeRequest(a,Sn,i,s,!1);this._request=l,l.getPromise().then(c=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(c.current),c.finalized?(this._metadata=c.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Iu*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{const r=zE(this._ref.storage,this._ref._location,this._mappings),i=this._ref.storage._makeRequest(r,Sn,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._metadata=s,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{const r=KE(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),i=this._ref.storage._makeRequest(r,Sn,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._metadata=s,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t=this._state==="paused";this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=rf(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=wo(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,r,i){const s=new JE(t||void 0,r||void 0,i||void 0);return this._addObserver(s),()=>{this._removeObserver(s)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);t!==-1&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(t=>{this._notifyObserver(t)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(wo(this._state)){case Be.SUCCESS:Tn(this._resolve.bind(null,this.snapshot))();break;case Be.CANCELED:case Be.ERROR:const t=this._reject;Tn(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(wo(this._state)){case Be.RUNNING:case Be.PAUSED:e.next&&Tn(e.next.bind(e,this.snapshot))();break;case Be.SUCCESS:e.complete&&Tn(e.complete.bind(e))();break;case Be.CANCELED:case Be.ERROR:e.error&&Tn(e.error.bind(e,this._error))();break;default:e.error&&Tn(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
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
 */class fn{constructor(e,t){this._service=e,t instanceof Ke?this._location=t:this._location=Ke.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new fn(e,t)}get root(){const e=new Ke(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return ff(this._location.path)}get storage(){return this._service}get parent(){const e=OE(this._location.path);if(e===null)return null;const t=new Ke(this._location.bucket,e);return new fn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw pE(e)}}function nb(n,e,t){return n._throwIfRoot("uploadBytesResumable"),new tb(n,new Ot(e),t)}function rb(n){n._throwIfRoot("getDownloadURL");const e=WE(n.storage,n._location,mf());return n.storage.makeRequestWithTokens(e,Sn).then(t=>{if(t===null)throw fE();return t})}function ib(n,e){const t=FE(n._location.path,e),r=new Ke(n._location.bucket,t);return new fn(n.storage,r)}/**
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
 */function sb(n){return/^[A-Za-z]+:\/\//.test(n)}function ob(n,e){return new fn(n,e)}function vf(n,e){if(n instanceof rl){const t=n;if(t._bucket==null)throw dE();const r=new fn(t,t._bucket);return e!=null?vf(r,e):r}else return e!==void 0?ib(n,e):n}function ab(n,e){if(e&&sb(e)){if(n instanceof rl)return ob(n,e);throw Yo("To use ref(service, url), the first argument must be a Storage instance.")}else return vf(n,e)}function Tu(n,e){const t=e==null?void 0:e[tf];return t==null?null:Ke.makeFromBucketSpec(t,n)}function lb(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:$u(i,n.app.options.projectId))}class rl{constructor(e,t,r,i,s){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=ef,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=tE,this._maxUploadRetryTime=nE,this._requests=new Set,i!=null?this._bucket=Ke.makeFromBucketSpec(i,this._host):this._bucket=Tu(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Ke.makeFromBucketSpec(this._url,e):this._bucket=Tu(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){bu("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){bu("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new fn(this,e)}_makeRequest(e,t,r,i,s=!0){if(this._deleted)return new gE(of());{const a=CE(e,this._appId,r,i,t,this._firebaseVersion,s);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,i).getPromise()}}const Au="@firebase/storage",Ru="0.13.2";/**
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
 */const wf="storage";function cb(n,e,t){return n=ie(n),nb(n,e,t)}function ub(n){return n=ie(n),rb(n)}function db(n,e){return n=ie(n),ab(n,e)}function hb(n=sa(),e){n=ie(n);const r=ls(n,wf).getImmediate({identifier:e}),i=Fu("storage");return i&&fb(r,...i),r}function fb(n,e,t,r={}){lb(n,e,t,r)}function mb(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new rl(t,r,i,e,mn)}function pb(){an(new qt(wf,mb,"PUBLIC").setMultipleInstances(!0)),st(Au,Ru,""),st(Au,Ru,"esm2017")}pb();const gb={apiKey:"AIzaSyBbx9pn_QARUqxFlvklgk31yHFACVVmjWw",authDomain:"family-hub-84c50.firebaseapp.com",projectId:"family-hub-84c50",storageBucket:"family-hub-84c50.appspot.com",messagingSenderId:"910534679848",appId:"1:910534679848:web:5604a70a93446fbe21041d",measurementId:"G-ESLX6SLENB"},il=Hu(gb),L=Sy(il),jr=Zw(il),_b=hb(il),Jo=document.getElementById("modal-container");function Je(n,e){if(!Jo){console.error("Architekt: #modal-container nicht im DOM gefunden!");return}const t=document.createElement("div");t.id=e,t.className="modal",t.innerHTML=n,t.addEventListener("click",i=>{i.target===t&&ve(e)}),t.querySelectorAll('[data-action="close-modal"], .btn-secondary').forEach(i=>{(i.textContent.toLowerCase()==="abbrechen"||i.dataset.action==="close-modal")&&(i.onclick=s=>{s.preventDefault(),ve(e)})}),Jo.appendChild(t),setTimeout(()=>t.classList.add("modal-open"),10),typeof lucide<"u"&&lucide.createIcons()}function ve(n=null){let e;n?e=document.getElementById(n):e=Jo.querySelector(".modal:last-child"),e&&(e.classList.remove("modal-open"),e.addEventListener("transitionend",()=>{e&&e.remove()},{once:!0}))}window.closeModal=ve;function x(n,e="info"){const t=document.createElement("div");t.className=`notification ${e}`,t.textContent=n,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>{t.classList.remove("show"),t.classList.add("fade-out"),t.addEventListener("transitionend",()=>t.remove())},3e3)}function ze(n){n.disabled=!0,n.classList.add("btn-loading");const e=n.querySelector(".btn-text");e&&(e.style.opacity="0");const t=document.createElement("div");t.className="spinner",n.appendChild(t)}function ce(n){n.disabled=!1,n.classList.remove("btn-loading");const e=n.querySelector(".btn-text");e&&(e.style.opacity="1");const t=n.querySelector(".spinner");t&&t.remove()}function Ne(n,e){e&&(e.innerHTML=n)}function yb(n){return!n||n.length===0?"":`
              <div class="flex items-center gap-4 pt-3 mt-4 border-t border-border-glass">
                  ${n.map(e=>`
                      <button 
                          class="action-button ${e.active?"active text-primary-rose":""} ${e.className||""}" 
                          onclick="${e.onClick}"
                          aria-label="${e.onClick.split("(")[0]}"
                      >
                          ${e.icon}
                          ${e.count!==null&&e.count!==void 0?`<span>${e.count}</span>`:""}
                      </button>
                  `).join("")}
              </div>
          `}function Ef(n){const{authorName:e,authorAvatar:t,timestamp:r,content:i,imageUrl:s,postId:a,actions:l,post:c}=n,d=`
              <div class="flex items-center gap-3 mb-4">
                  <div class="avatar-ring avatar-ring-clickable" onclick="window.openProfilePopup(event, '${n.authorId||""}')">
                      <img src="${t}" alt="${e}" class="post-avatar">
                  </div>
                  <div class="flex-1">
                      <p class="font-semibold text-white">${e}</p>
                      <p class="text-xs text-secondary">${r}</p>
                  </div>
                  <div class="post-menu-btn">
                      <button 
                          class="btn-icon-ghost" 
                          onclick="window.openPostMenu('${a}')"
                          aria-label="Beitragsmenü"
                      >
                          <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                      </button>
                  </div>
              </div>
          `;let f;const p=n.post||n;p.type==="poll"?f=window.PollCard(p):p.type==="gratitude"?f=window.GratitudeCard(p):p.type==="forecast"?f=window.ForecastCard({post:p}):p.type==="memory"?f=window.MemoryCard({post:p}):p.type==="gallery"?f=window.GalleryPostCard(p):f=`
              <div class="post-content mb-4">
                  <p class="text-white whitespace-pre-wrap break-words">${i||""}</p>
              </div>
              `;const v=s?`
              <div class="post-image-container rounded-lg overflow-hidden mb-4 border border-border-glass cursor-pointer" 
                   onclick="window.openImageModal('${s}')">
                  <img 
                      src="${s}" 
                      alt="Beitragsbild" 
                      class="w-full h-auto object-cover max-h-[500px]"
                      loading="lazy"
                  >
              </div>
          `:"",b=yb(l),C=c.type==="forecast"||c.type==="memory"||c.type==="gallery"?"":b;return`
              <div class="post-card" data-post-id="${a}">
                  ${d}
                  ${f}
                  ${v}
                  ${C}
              </div>
          `}function Qt(n,{variant:e="premium",padding:t="md",className:r=""}={}){return`
          <div class="${e==="premium"?"glass-premium":"bg-gray-900 border border-border-glass"} ${t==="lg"?"p-6 sm:p-8":"p-4 sm:p-6"} rounded-xl ${r}">
              ${n}
          </div>
          `}function Te(n,e,t,r){const i=`
              <div class="text-center animate-fade-in">
                  <div class="w-16 h-16 bg-primary-rose/10 text-primary-rose rounded-full mx-auto flex items-center justify-center mb-4 text-3xl">
                      ${t}
                  </div>
                  <h3 class="text-xl font-bold text-white mb-2">${n}</h3>
                  <p class="text-secondary mb-6">${e}</p>
                  ${r||""}
              </div>
          `;return Qt(i,{variant:"premium",padding:"lg"})}function vb({lines:n=3,hasImage:e=!1}={}){const t=Array(n).fill(0).map(()=>`
              <div class="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
          `).join("");return`<div class="post-card">${`
              <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div class="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
              </div>
              ${e?`
              <div class="h-48 bg-gray-700 rounded-lg w-full animate-pulse mb-4"></div>
          `:""}
              <div class="space-y-3">
                  ${t}
              </div>
          `}</div>`}let Fe={authUser:null,userData:null,familyId:null,membersData:null};function wb(n){qv(jr,async e=>{const t=document.getElementById("app-loader");if(t&&t.classList.remove("hidden"),e){Fe.authUser=e;try{const r=X(L,"users",e.uid),i=await Yn(r);if(!i.exists())throw new Error("Benutzerdokument nicht in Firestore gefunden.");if(Fe.userData=i.data(),Fe.familyId=Fe.userData.familyId,!Fe.familyId)throw new Error("Benutzer ist keiner Familie zugewiesen.");const s=K(L,"families",Fe.familyId,"membersData"),a=await et(s);Fe.membersData={},a.forEach(l=>{Fe.membersData[l.id]={uid:l.id,...l.data()}}),console.log("Auth: Erfolgreich angemeldet und ALLE Daten geladen.",Fe.userData.name),n(Fe)}catch(r){console.error("Auth-Fehler beim Laden der Benutzerdaten:",r.message);let i="Ein Fehler ist aufgetreten.";r.message.includes("Benutzerdokument nicht in Firestore")?i="Dein Benutzerkonto ist nicht korrekt in der Datenbank eingerichtet. Bitte kontaktiere den Support.":r.message.includes("keiner Familie zugewiesen")&&(i="Dein Benutzerkonto ist keiner Familie zugewiesen. Anmeldung nicht möglich."),sessionStorage.setItem("login_error",i),await jh(jr)}}else bb(),console.log("Auth-Status: Abgemeldet."),n(null)})}async function Eb(){await jh(jr)}function bb(){Fe={authUser:null,userData:null,familyId:null,membersData:null},console.log("Auth-Sitzung bereinigt.")}function B(){return{currentUser:Fe.authUser,currentUserData:Fe.userData,currentFamilyId:Fe.familyId,membersData:Fe.membersData}}function Ib(n){const{currentUser:e}=B(),t=n.votedBy&&n.votedBy.includes(e.uid),r=n.options.reduce((a,l)=>a+(l.votes||0),0);let i=-1;return t&&n.votesMap&&(i=n.votesMap[e.uid]),`
          <div class="poll-card-container mt-4">
              ${n.options.map((a,l)=>{const c=a.votes||0,d=r>0?c/r*100:0,f=t&&i===l;return t?`
                  <div class="poll-option relative overflow-hidden ${f?"voted-by-user":""}">
                      <div class="poll-result-bar" style="width: ${d}%;"></div>
                      <div class="relative flex justify-between z-10">
                          <span>${a.text}</span>
                          <span class="font-semibold">${c} (${d.toFixed(0)}%)</span>
                      </div>
                  </div>
                  `:`
                  <div class="poll-option" onclick="window.handlePollVote('${n.id}', ${l})">
                      ${a.text}
                  </div>
                  `}).join("")}
              <p class="text-xs text-secondary mt-2">${r} Stimme(n) gesamt</p>
          </div>
          `}function Tb(n){const{galleryTitle:e,thumbnailUrls:t=[]}=n,r=t.slice(0,4),i=r.map(s=>`
        <div class="gallery-post-item">
            <img src="${s}" alt="Galerie-Vorschau" loading="lazy" />
        </div>
    `).join("");return`
    <div class="gallery-post-card">
        <div class="mb-3">
            <h4 class="text-lg font-semibold text-white">${e||"Neue Fotos"}</h4>
            <p class="text-sm text-secondary">Neue Erinnerungen wurden in der Galerie hinzugefügt.</p>
        </div>
        
        <div class="gallery-post-grid count-${r.length}">
            ${i}
        </div>
        
        <button class="btn-secondary w-full mt-4" onclick="window.MapsTo('gallery')">
            <i data-lucide="images" class="w-4 h-4 mr-2"></i>
            Album ansehen
        </button>
    </div>
    `}function bf(n){const{membersData:e}=B(),t=(n.participants||[]).map(r=>e[r]).filter(Boolean).map(r=>`
                  <img class="expense-avatar" src="${r.photoURL||`https://ui-avatars.com/api/?name=${r.name.charAt(0)}`}" alt="${r.name}" title="${r.name}">
              `).join("");return`
          <div class="expense-card mt-4">
              <div class="flex justify-between items-center mb-2">
                  <span class="expense-private-badge">
                      <i data-lucide="lock" class="w-3 h-3"></i>
                      Private Ausgabe
                  </span>
                  <span class="text-xl font-bold text-white">€${n.amount.toFixed(2)}</span>
              </div>
              <p class="text-white mb-3">${n.text}</p>
              <div class="flex items-center gap-2">
                  <div class="expense-avatar-stack">
                      ${t}
                  </div>
                  <span class="text-xs text-secondary">${n.participants.length} Teilnehmer</span>
              </div>
          </div>
          `}function If(n){const{currentUser:e}=B(),t=n.uploaderId===e.uid,r=n.claimedBy&&n.claimedBy!==e.uid,i=n.claimedBy&&n.claimedBy===e.uid;let s="";t?s=`<button class="btn-secondary w-full text-xs" onclick="window.deleteWish('${n.id}')"><i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>Löschen</button>`:i?s=`<button class="btn-secondary w-full text-xs" onclick="window.unclaimWish('${n.id}')"><i data-lucide="x" class="w-4 h-4 mr-1"></i>Reservierung aufheben</button>`:r?s='<button class="btn-secondary w-full text-xs" disabled>Reserviert</button>':s=`<button class="btn-premium w-full text-xs" onclick="window.claimWish('${n.id}')"><i data-lucide="check" class="w-4 h-4 mr-1"></i>Reservieren</button>`;const a=n.price?`<p class="text-sm text-primary-rose font-semibold mb-2">${n.price}</p>`:"";return`
          <div class="glass-premium rounded-xl overflow-hidden flex flex-col animate-slide-in-up">
              <a href="${n.url||"#"}" target="_blank" rel="noopener noreferrer" class="block h-48 bg-white/5">
                  <img src="${n.imageUrl||"https://placehold.co/300x300/0a0a0a/ffffff?text=Wunsch"}" class="w-full h-full object-contain p-2">
              </a>
              <div class="p-4 flex-1 flex flex-col">
                  <h5 class="font-semibold text-white mb-1 truncate" title="${n.title}">${n.title}</h5>
                  ${a}
                  <p class="text-xs text-secondary mb-3 flex-1">${n.description||"Keine Beschreibung"}</p>
                  ${s}
              </div>
          </div>
          `}function Ab(n){return`
          <div class="gratitude-card-content">
              <img src="${n.fromAvatar}" alt="${n.fromName}" class="gratitude-avatar">
              <i data-lucide="heart" class="gratitude-arrow"></i>
              <img src="${n.toAvatar}" alt="${n.toName}" class="gratitude-avatar">
              <div class="flex-1">
                  <p class="text-white text-lg">
                      <span class="font-semibold">${n.fromName}</span>
                      ist dankbar für
                      <span class="font-semibold">${n.toName}</span>
                  </p>
                  <p class="text-secondary italic mt-1">"${n.text}"</p>
              </div>
          </div>
          `}function Rb(){return`
          <div class="glass-premium rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
              <p class="text-secondary">Für wen bist du heute dankbar?</p>
              <button class="cta-primary-glow" onclick="window.openGratitudeModal()">
                  <i data-lucide="gift" class="w-5 h-5 mr-2"></i>Dank senden
              </button>
          </div>
          `}function Cb(n){const e=new Date,t=new Date(n),r=Math.floor((e-t)/1e3);if(isNaN(r)||r<0)return"";if(r<60)return"gerade eben";const i=Math.floor(r/60);if(i<60)return`vor ${i} Minute${i===1?"":"n"}`;const s=Math.floor(i/60);if(s<24)return`vor ${s} Stunde${s===1?"":"n"}`;const a=Math.floor(s/24);if(a<7)return`vor ${a} Tag${a===1?"":"en"}`;const l=Math.floor(a/7);if(l<5)return`vor ${l} Woche${l===1?"":"n"}`;const c=Math.floor(a/30);if(c<12)return`vor ${c} Monat${c===1?"":"en"}`;const d=Math.floor(a/365);return`vor ${d} Jahr${d===1?"":"en"}`}function Sb({post:n}){const{memoryTitle:e,originalPost:t}=n;return t?(t.createdAt&&Cb(t.createdAt.toDate()),`
        <div class="memory-card">
            <div class="memory-card-header">
                <div class="memory-card-icon">
                    <i data-lucide="sparkles" class="w-6 h-6"></i>
                </div>
                <h3 class="memory-card-title">${e}</h3>
            </div>
            <div class="memory-card-content">
                ${Ef(t)}
            </div>
        </div>
    `):""}function kb(n){const e=Math.min(100,n.current/n.target*100);return`
          <div class="goal-item">
              <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-semibold text-white">${n.title}</span>
                  <span class="text-xs text-primary-rose">${e.toFixed(0)}%</span>
              </div>
              <div class="goal-progress-bar-bg">
                  <div class="goal-progress-bar-fg" style="width: ${e}%;"></div>
              </div>
          </div>
          `}function Pb(n){return!n||n.length===0?`
              <div class="goal-widget-card text-center">
                  <p class="text-sm text-secondary mb-3">Setzt euch gemeinsame Ziele!</p>
                  <button class="btn-secondary text-xs" onclick="window.navigateTo('settings', 'goals')">
                      Ziele verwalten
                  </button>
              </div>
              `:`
          <div class="goal-widget-card">
              <h4 class="text-lg font-semibold text-white mb-3">Unsere Ziele</h4>
              ${n.map(kb).join("")}
              <button class="text-xs text-primary-rose font-semibold mt-2 hover:underline" onclick="window.navigateTo('settings', 'goals')">
                  Alle Ziele verwalten...
              </button>
          </div>
          `}function xb(n){return`
        <div class="post-card">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-accent-glow/20 rounded-full flex items-center justify-center">
                    <i data-lucide="flag" class="w-6 h-6 text-accent-glow"></i>
                </div>
                <div>
                    <p class="text-white">${n.text}</p>
                    <p class="text-xs text-secondary">${new Date(n.createdAt.seconds*1e3).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `}function Db(n){const t={calendar:"fa-solid fa-calendar-day",task:"fa-solid fa-check-circle",weather:"fa-solid fa-cloud-sun"}[n]||"fa-solid fa-info-circle";return`<div class="forecast-icon ${n}"><i class="${t}"></i></div>`}function Nb({type:n,title:e,details:t}){return`
        <div class="forecast-item">
            ${Db(n)}
            <div class="forecast-item-content">
                <div class="forecast-item-title">${e}</div>
                <div class="forecast-item-details">${t}</div>
            </div>
        </div>
    `}function Lb({post:n}){const{summary:e,items:t=[]}=n;return`
        <div class="forecast-card">
            <h3 class="forecast-title">Diese Woche bei euch</h3>
            <p class="forecast-summary">${e}</p>
            <div class="forecast-list">
                ${t.map(r=>Nb(r)).join("")}
            </div>
        </div>
    `}function Mb(){const n="create-post-modal";openModal(Qt(`
        <form id="create-post-form" class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neuer Beitrag</h2>
            <div>
                <label for="create-post-textarea" class="form-label text-sm text-secondary mb-1 block">Was gibt's Neues?</label>
                <textarea id="create-post-textarea" class="form-input" placeholder="Teile etwas mit deiner Familie..." rows="4" required></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="save-post-button" class="cta-primary-glow">
                    <span class="btn-text">Posten</span>
                </button>
            </div>
        </form>
    `,{variant:"premium",className:"max-w-md w-full"}),n);const t=document.getElementById("create-post-form"),r=document.getElementById("save-post-button");t.addEventListener("submit",async i=>{i.preventDefault();const a=document.getElementById("create-post-textarea").value.trim();if(!a){x("Bitte gib einen Text ein.","error");return}ze(r);try{const{currentFamilyId:l,currentUser:c,currentUserData:d}=B();if(!l||!c)throw new Error("Benutzer ist nicht oder nicht korrekt angemeldet.");const f=K(L,"families",l,"posts"),p={type:"default",text:a,authorId:c.uid,authorName:d.name||"Benutzer",authorAvatar:d.avatarUrl||"",createdAt:ae(),likes:[],commentsCount:0};await Xe(f,p),x("Beitrag erfolgreich erstellt!","success"),closeModal(n)}catch(l){console.error("Fehler beim Speichern des Beitrags:",l),x("Fehler beim Speichern des Beitrags.","error")}finally{ce(r)}})}function Vb(n){const{currentFamilyId:e}=B(),t=document.getElementById("feed-posts-container"),r=document.getElementById("gratitude-trigger-container"),i=document.getElementById("goal-widget-container");if(!t){console.error("Entwickler-Fehler: Das #feed-container Element wurde nicht auf der Feed-Seite gefunden.");return}if(!e){t.innerHTML=Te("Keine Familie geladen","Bitte melde dich an oder wähle eine Familie in den Einstellungen.","alert-circle"),r&&(r.innerHTML=""),i&&(i.innerHTML="");return}try{const c=document.getElementById("fab-create-post");c?c.dataset.listenerAttached||(c.addEventListener("click",Mb),c.dataset.listenerAttached="true"):console.warn("Konnte den 'Neuer Beitrag'-Button (fab-create-post) nicht finden.")}catch(c){console.error("Fehler beim Binden des createPost-Buttons:",c)}if(r&&(r.innerHTML=Rb()),i){const c=ye(K(L,"families",e,"familyGoals"),je("createdAt","desc"));n.feedGoals=Ye(c,d=>{const f=d.docs.map(p=>({id:p.id,...p.data()}));i.innerHTML=Pb(f)},d=>{console.error("Fehler beim Laden der Ziele für das Widget:",d),i.innerHTML=""})}t.innerHTML=vb();const s=K(L,"families",e,"posts"),a=ye(s,je("createdAt","desc"));n.posts&&n.posts();let l=!0;n.posts=Ye(a,c=>{if(l&&c.empty){t.innerHTML=Te("Noch keine Beiträge","Erstelle den ersten Beitrag im Feed!","message-square"),l=!1;return}if(l){const d=t.querySelector(".skeleton-card");d&&(d.parentElement.innerHTML="")}c.docChanges().forEach(d=>{const f={id:d.doc.id,...d.doc.data()},p=`post-${f.id}`,v=document.getElementById(p);if(d.type==="added"){const b=Cu(f);b&&(l?t.appendChild(b):t.prepend(b))}if(d.type==="modified"&&v){const b=Cu(f);b&&v.replaceWith(b)}d.type==="removed"&&v&&v.remove()}),l=!1,t.childElementCount===0&&(t.innerHTML=Te("Noch keine Beiträge","Erstelle den ersten Beitrag im Feed!","message-square")),typeof lucide<"u"&&lucide.createIcons()})}function Cu(n){var t,r,i;const e=document.createElement("div");switch(e.id=`post-${n.id}`,n.type){case"poll":e.innerHTML=Ib(n);break;case"gallery":e.innerHTML=Tb(n);break;case"expense":e.innerHTML=bf(n);break;case"wishlist_item":e.innerHTML=If(n);break;case"gratitude":e.innerHTML=Ab(n);break;case"memory":e.innerHTML=Sb({post:n});break;case"goal_update":e.innerHTML=xb(n);break;case"forecast":e.innerHTML=Lb({post:n});break;default:const s={post:n,postId:n.id,authorName:n.authorName,authorAvatar:n.authorAvatar,timestamp:n.createdAt?new Date(n.createdAt.seconds*1e3).toLocaleString():"eben gerade",content:n.text,actions:[{icon:'<i data-lucide="heart" class="w-5 h-5"></i>',count:((t=n.likes)==null?void 0:t.length)||0,onClick:`window.toggleLike('${n.id}')`,className:"like-button",active:(i=n.likes)==null?void 0:i.includes((r=B().currentUser)==null?void 0:r.uid)},{icon:'<i data-lucide="message-circle" class="w-5 h-5"></i>',count:n.commentsCount||0,onClick:`window.openComments('${n.id}')`,className:"comment-button"}]};e.innerHTML=Ef(s)}return Ob(e,n),e}function Ob(n,e){const t=n.querySelector(".like-button");t&&t.addEventListener("click",()=>Fb(e.id));const r=n.querySelector(".comment-button");r&&r.addEventListener("click",()=>window.openComments(e.id));const i=n.querySelectorAll(".poll-option");i&&i.forEach(s=>{s.addEventListener("click",()=>Ub(e.id,s.dataset.option))})}async function Fb(n){const{currentFamilyId:e,currentUser:t}=B();if(!e||!t)return;const r=X(L,"families",e,"posts",n),i=await Yn(r);i.exists()&&((i.data().likes||[]).includes(t.uid)?await He(r,{likes:By(t.uid)}):await He(r,{likes:Uy(t.uid)}))}async function Ub(n,e){const{currentFamilyId:t,currentUser:r}=B();if(!t||!r)return;const i=X(L,"families",t,"posts",n),s=await Yn(i);if(s.exists()){const a=s.data(),l=`votes.${r.uid}`;if(a.votes&&a.votes[r.uid]){x("Du hast bereits abgestimmt.","info");return}const c={[l]:e,[`options.${e}`]:yh(1)};await He(i,c),x("Stimme wurde gezählt!","success")}}window.openComments||(window.openComments=async n=>{var p;const{currentUser:e,currentUserData:t,currentFamilyId:r}=B();if(!r)return;const i=document.getElementById("template-comments-modal");if(!i){console.error("DESIGNER-FEHLER: Das 'template-comments-modal' fehlt in Index.html!"),x("Kommentarfunktion ist derzeit nicht verfügbar.","error");return}const s=document.getElementById("modal-container");Ne(i.innerHTML,s);const a=s.querySelector(".modal-dialog-wrapper");s.querySelector(".modal-card");const l=a?a.parentElement:s.querySelector(".modal"),c=()=>{l==null||l.classList.add("page-fade-out"),setTimeout(()=>s.innerHTML="",300)};l==null||l.addEventListener("click",v=>{v.target===l&&c()}),(p=s.querySelector('button[data-action="close-modal-button"]'))==null||p.addEventListener("click",c);const d=s.querySelector("#comment-user-avatar");d&&t?(d.src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name||"U")}`,d.alt=t.name||"Benutzer"):d&&(d.src="https://ui-avatars.com/api/?name=U",d.alt="Benutzer");const f=s.querySelector("#comment-form");f&&(f.dataset.postId=n,f.onsubmit=async v=>{v.preventDefault(),await Bb(v.currentTarget.dataset.postId)}),Tf(n),typeof lucide<"u"&&lucide.createIcons()});async function Bb(n){const{currentFamilyId:e,currentUser:t,currentUserData:r}=B();if(!e||!t)return;const i=document.getElementById("comment-input"),s=i.value.trim();if(s){const a=K(L,"families",e,"posts",n,"comments");await Xe(a,{text:s,authorId:t.uid,authorName:r?r.name:"Anonym",authorAvatar:t.photoURL,createdAt:ae()}),i.value="",Tf(n)}}async function Tf(n){const{currentFamilyId:e}=B();if(!e)return;const t=document.getElementById("comments-list");if(!t)return;t.innerHTML="<p>Lade Kommentare...</p>";const r=K(L,"families",e,"posts",n,"comments"),i=ye(r,je("createdAt","asc")),s=await et(i);t.innerHTML="",s.empty?t.innerHTML='<p class="text-center text-sm text-text-secondary py-4">Noch keine Kommentare. Sei der Erste!</p>':s.forEach(a=>{const l=a.data(),c=document.createElement("div");c.className="comment-item flex items-start space-x-3 mb-4";const d=l.authorName||"Anonym";c.innerHTML=`
                <img src="${l.authorAvatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(d)}`}" alt="${d}" class="w-8 h-8 rounded-full">
                <div class="flex-1">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <p class="font-semibold text-sm text-text-main">${d}</p>
                        <p class="text-sm text-text-secondary">${l.text}</p>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">${l.createdAt?new Date(l.createdAt.seconds*1e3).toLocaleString():""}</span>
                </div>
            `,t.appendChild(c)})}let Ln=null,Mn=null;const $b=[{id:"todo",title:"To Do"},{id:"inprogress",title:"In Arbeit"},{id:"done",title:"Erledigt"}];function qb(n){n.pinnwand&&n.pinnwand(),Ln=null,Mn=null;const{currentFamilyId:e}=B();if(!e){Ne(Te("Fehler","Keine Familie geladen.","!",""),document.getElementById("app-content"));return}jb();const t=K(L,"families",e,"pinnwand"),r=ye(t,je("createdAt","asc"));n.pinnwand=Ye(r,i=>{if(i.empty){const s=document.getElementById("app-content");Ne(Te("Noch keine Aufgaben","Lege die erste Aufgabe an, um die Pinnwand zu nutzen.","inbox",`<button class="cta-primary-glow" onclick="window.openCreateTaskModal('todo')">
                            <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Aufgabe anlegen
                         </button>`),s),typeof lucide<"u"&&lucide.createIcons();return}i.docChanges().forEach(s=>{const a={id:s.doc.id,...s.doc.data()},l=`task-${a.id}`,c=document.getElementById(l);if(s.type==="added"){const d=document.querySelector(`.pinnwand-cards[data-column-id="${a.status}"]`);if(d){const f=Hb(a);d.appendChild(f)}}if(s.type==="modified"&&c){if(c.parentElement.dataset.columnId!==a.status){const d=document.querySelector(`.pinnwand-cards[data-column-id="${a.status}"]`);d&&d.appendChild(c)}c.querySelector("span").textContent=a.text}s.type==="removed"&&c&&c.remove()}),zb(),typeof lucide<"u"&&lucide.createIcons()},i=>{console.error("Pinnwand-Fehler:",i),Ne(Te("Fehler","Aufgaben konnten nicht geladen werden.","!",""),document.getElementById("app-content"))})}function jb(){const n=document.getElementById("app-content");n&&(n.innerHTML=`
    <div class="flex gap-4 lg:gap-6 overflow-x-auto py-4">
      ${$b.map(e=>`
        <div class="pinnwand-column" data-column="${e.id}">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg text-white flex items-center gap-2">
              ${e.title}
              <span class="column-count inline-block bg-white/10 text-xs px-2 py-0.5 rounded-full ml-1">0</span>
            </h2>
            <button class="icon-button-ghost" onclick="window.openCreateTaskModal('${e.id}')" title="Neue Aufgabe hinzufügen">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="pinnwand-cards" data-column-id="${e.id}">
            
          </div>
        </div>
      `).join("")}
    </div>
  `,document.querySelectorAll(".pinnwand-cards").forEach(e=>{e.addEventListener("dragover",Kb),e.addEventListener("drop",Xb),e.addEventListener("dragleave",Qb)}),typeof lucide<"u"&&lucide.createIcons())}function Hb(n){const e=r=>r.replace(/'/g,"&apos;").replace(/"/g,"&quot;"),t=document.createElement("div");return t.className="pinnwand-card",t.draggable=!0,t.id=`task-${n.id}`,t.dataset.cardId=n.id,t.innerHTML=`
        <span class="flex-1">${n.text}</span>
        <button class="icon-button-ghost" 
                title="Termin aus Aufgabe erstellen" 
                onclick="window.openCreateEventModal(undefined, '${e(n.text)}')"
        >
          <i data-lucide="calendar-plus" class="w-5 h-5"></i>
        </button>
        <button class="icon-button-ghost" 
                title="Aufgabe diskutieren" 
                onclick="window.startContextChat('pinnwandTask', '${n.id}', '${e(n.text)}')"
        >
          <i data-lucide="message-circle" class="w-5 h-5"></i>
        </button>
    `,t.addEventListener("dragstart",Wb),t.addEventListener("dragend",Gb),t}function zb(){document.querySelectorAll(".pinnwand-column").forEach(n=>{n.dataset.column;const e=n.querySelectorAll(".pinnwand-card").length,t=n.querySelector(".column-count");t&&(t.textContent=e)})}window.openCreateTaskModal||(window.openCreateTaskModal=n=>{const{membersData:e,currentUser:t}=B(),r=Object.values(e).map(a=>`<option value="${a.uid}">${a.name}</option>`).join(""),i="modal-create-task",s=`
        <form id="create-task-form" class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neue Aufgabe</h2>
            
            <div>
                <label for="task-text" class="form-label text-sm text-secondary mb-1 block">Was soll erledigt werden?</label>
                <textarea id="task-text" name="task-text" class="form-input" rows="3" required></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="task-assignedTo" class="form-label text-sm text-secondary mb-1 block">Zuweisen an:</label>
                    <select id="task-assignedTo" class="form-input">
                        <option value="">Niemanden</option>
                        ${r}
                    </select>
                </div>
                <div>
                    <label for="task-points" class="form-label text-sm text-secondary mb-1 block">Belohnung (Punkte)</label>
                    <input type="number" id="task-points" class="form-input" value="0" min="0" step="10">
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="create-task-submit" class="cta-primary-glow">
                    <span class="btn-text">Aufgabe erstellen</span>
                </button>
            </div>
        </form>
    `;Je(Qt(s,{variant:"premium",className:"max-w-md w-full"}),i),typeof lucide<"u"&&lucide.createIcons(),document.getElementById("task-assignedTo").value=t.uid,document.getElementById("create-task-form").onsubmit=async a=>{a.preventDefault();const l=document.getElementById("create-task-submit");ze(l);const c=document.getElementById("task-text").value.trim(),d=document.getElementById("task-assignedTo").value||null,f=parseInt(document.getElementById("task-points").value)||0;if(c)try{const{currentFamilyId:p}=B();await Xe(K(L,"families",p,"pinnwand"),{text:c,status:n,assignedTo:d,points:f,createdAt:ae()}),ve(i),x("Aufgabe erstellt!","success")}catch(p){x("Fehler beim Anlegen der Aufgabe.","error"),console.error(p)}finally{ce(l)}else ce(l)}});function Wb(n){Ln=n.target,Mn=n.target.closest(".pinnwand-cards").dataset.columnId,n.target.classList.add("dragging"),setTimeout(()=>n.target.classList.add("invisible"),0)}function Gb(n){n.target.classList.remove("dragging","invisible"),Ln=null,Mn=null,ss()}function Kb(n){n.preventDefault();const e=n.target.closest(".pinnwand-cards");e&&(ss(),e.classList.add("drag-over"))}function Qb(n){var e;(e=n.target.closest(".pinnwand-cards"))==null||e.classList.remove("drag-over")}async function Xb(n){n.preventDefault();const e=n.target.closest(".pinnwand-cards");if(!e||!Ln){ss();return}const t=e.dataset.columnId,r=Ln.dataset.cardId;if(Mn!==t&&n.stopPropagation(),e.appendChild(Ln),ss(),Mn!==t)try{const{currentFamilyId:i}=B(),s=X(L,"families",i,"pinnwand",r);if(await He(s,{status:t}),t==="done"&&Mn!=="done"){const a=await getDoc(s);if(a.exists()){const l=a.data();if(l&&l.assignedTo&&l.points>0){const c=X(L,"families",i,"membersData",l.assignedTo);await He(c,{points:yh(l.points)}),x(`${l.points} Punkte! Gut gemacht!`,"success")}}}}catch(i){console.error("Fehler beim Aktualisieren der Aufgabe oder Punkte:",i),window.listeners&&window.listeners.pinnwand}}function ss(){document.querySelectorAll(".pinnwand-cards").forEach(n=>n.classList.remove("drag-over"))}let Su=new Date,Zo="month",tn=[];function Yb(n){n.calendar&&n.calendar(),Jb();const{currentFamilyId:e}=B();if(!e){console.error("Kalender: Keine FamilyID gefunden.");return}const t=ye(K(L,"families",e,"calendar"),je("date","asc"));n.calendar=Ye(t,r=>{r.docChanges().forEach(i=>{const s={id:i.doc.id,...i.doc.data(),date:i.doc.data().date.toDate()};if(i.type==="added"&&tn.push(s),i.type==="modified"){const a=tn.findIndex(l=>l.id===s.id);a>-1&&(tn[a]=s)}if(i.type==="removed"){const a=tn.findIndex(l=>l.id===s.id);a>-1&&tn.splice(a,1)}}),Zb()},r=>{console.error("Kalender-Datenfehler:",r),x("Fehler beim Laden des Kalenders","error")})}function Jb(){const n=document.querySelector('[data-view="day"]'),e=document.querySelector('[data-view="week"]'),t=document.querySelector('[data-view="month"]'),r=document.getElementById("fab-create-event");n&&(n.onclick=()=>Li("day")),e&&(e.onclick=()=>Li("week")),t&&(t.onclick=()=>Li("month")),r&&(r.onclick=()=>window.openCreateEventModal()),Li("month")}function Zb(){Zo==="month"?Af():Rf(Zo),typeof lucide<"u"&&lucide.createIcons()}function Li(n){Zo=n,document.querySelectorAll("#calendar-view-controls .btn-filter").forEach(i=>i.classList.remove("active"));const e=document.querySelector(`[data-view="${n}"]`);e&&e.classList.add("active");const t=document.getElementById("calendar-grid"),r=document.getElementById("agenda-list-container");n==="month"?(t.classList.remove("hidden"),r.classList.add("hidden"),Af()):(t.classList.add("hidden"),r.classList.remove("hidden"),Rf(n))}function Af(){const n=document.getElementById("calendar-body");if(!n)return;n.innerHTML="";const e=Su.getFullYear(),t=Su.getMonth(),r=new Date(e,t,1),i=new Date(e,t+1,0),s=r.getDay()===0?6:r.getDay()-1,a=i.getDate();let l=document.createElement("div");l.className="calendar-row";for(let c=0;c<s;c++)l.appendChild(Eo(null));for(let c=1;c<=a;c++){const d=new Date(e,t,c);l.appendChild(Eo(d)),l.children.length===7&&(n.appendChild(l),l=document.createElement("div"),l.className="calendar-row")}if(l.children.length>0){for(;l.children.length<7;)l.appendChild(Eo(null));n.appendChild(l)}}function Eo(n){const e=document.createElement("div");if(!n)return e.className="calendar-cell empty",e;e.className="calendar-cell";const t=new Date;bo(n,t)&&e.classList.add("today");const r=document.createElement("span");r.className="calendar-date-label",bo(n,t)&&r.classList.add("today"),r.textContent=n.getDate(),e.appendChild(r);const i=document.createElement("div");return i.className="calendar-events",tn.filter(a=>bo(a.date,n)).slice(0,2).forEach(a=>{const l=document.createElement("div");l.className="event-bar",l.textContent=a.title,l.onclick=c=>{c.stopPropagation(),window.openEventDetails(a)},i.appendChild(l)}),e.appendChild(i),e.onclick=()=>window.openCreateEventModal(n.toISOString().split("T")[0]),e}function Rf(n){const e=document.getElementById("agenda-list-container");if(!e)return;const t=new Date;let r,i;if(n==="day")r=new Date(t.setHours(0,0,0,0)),i=new Date(t.setHours(23,59,59,999));else{const a=t.getDay()===0?6:t.getDay()-1;r=new Date(t.setDate(t.getDate()-a)),r.setHours(0,0,0,0),i=new Date(r),i.setDate(r.getDate()+6),i.setHours(23,59,59,999)}const s=tn.filter(a=>a.date>=r&&a.date<=i);if(s.length===0){Ne(Te("Keine Termine",`Für diese ${n==="day"?"Tagesansicht":"Wochenansicht"} sind keine Termine eingetragen.`,"calendar-x",""),e),typeof lucide<"u"&&lucide.createIcons();return}e.innerHTML=s.map(a=>eI(a)).join("")}function eI(n){const e=n.date,t=e.toLocaleString("de-DE",{month:"short"}).toUpperCase(),r=e.getDate(),i=n.allDay?"Ganztägig":e.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+" Uhr";return`
    <div class="agenda-item" onclick="window.openEventDetails(${JSON.stringify(n).replace(/"/g,"'")})">
        <div class="agenda-date-box">
            <span class="month">${t}</span>
            <span class="day">${r}</span>
        </div>
        <div class="agenda-info">
            <p class="title">${n.title}</p>
            <p class="time">${i}</p>
        </div>
    </div>
    `}function bo(n,e){return n.getFullYear()===e.getFullYear()&&n.getMonth()===e.getMonth()&&n.getDate()===e.getDate()}window.openCreateEventModal||(window.openCreateEventModal=(n=new Date().toISOString().split("T")[0],e="")=>{const t="modal-create-event",r=`
            <form id="create-event-form" class="space-y-4">
                <h2 class="text-2xl font-bold text-gradient mb-6">Neuer Termin</h2>
                <div>
                    <label for="event-title" class="form-label text-sm text-secondary mb-1 block">Titel</label>
                    <input type="text" id="event-title" name="event-title" class="form-input" required value="${e}" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="event-date" class="form-label text-sm text-secondary mb-1 block">Datum</label>
                        <input type="date" id="event-date" name="event-date" class="form-input" value="${n}" required />
                    </div>
                    <div>
                        <label for="event-time" class="form-label text-sm text-secondary mb-1 block">Startzeit (optional)</label>
                        <input type="time" id="event-time" name="event-time" class="form-input" />
                    </div>
                </div>
                <div>
                    <label for="event-description" class="form-label text-sm text-secondary mb-1 block">Beschreibung</label>
                    <textarea id="event-description" name="event-description" class="form-input" rows="3"></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-event-submit" class="cta-primary-glow">
                        <span class="btn-text">Termin speichern</span>
                    </button>
                </div>
            </form>
        `;Je(Qt(r,{variant:"premium",className:"max-w-lg w-full"}),t),typeof lucide<"u"&&lucide.createIcons(),document.getElementById("create-event-form").onsubmit=window.handleEventSubmit});window.handleEventSubmit||(window.handleEventSubmit=async n=>{n.preventDefault();const e=document.getElementById("create-event-submit");ze(e);try{const{currentUser:t,currentFamilyId:r}=B(),i=document.getElementById("event-title").value,s=document.getElementById("event-date").value,a=document.getElementById("event-time").value,l=document.getElementById("event-description").value,c=new Date(a?`${s}T${a}`:s);await Xe(K(L,"families",r,"calendar"),{title:i,description:l,date:c,allDay:!a,creatorId:t.uid,createdAt:ae()}),ve("modal-create-event"),x("Termin erstellt!","success")}catch(t){console.error("Fehler beim Erstellen des Termins:",t),x("Fehler beim Erstellen.","error")}finally{ce(e)}});window.openEventDetails||(window.openEventDetails=n=>{const e="modal-event-detail",t=n.date,r=n.allDay?"Ganztägig":t.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+" Uhr",i=`
            <h2 class="text-2xl font-bold text-gradient mb-4">${n.title}</h2>
            <div class="space-y-3">
                <div class="flex items-center gap-2 text-secondary">
                    <i data-lucide="calendar"></i>
                    <span>${t.toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span>
                </div>
                <div class="flex items-center gap-2 text-secondary">
                    <i data-lucide="clock"></i>
                    <span>${r}</span>
                </div>
                ${n.description?`<p class="text-white pt-4">${n.description}</p>`:""}
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Schließen</button>
                <button type="button" id="delete-event-btn" class="btn-secondary bg-red-500/20 text-red-400">
                    <i data-lucide="trash-2" class="w-5 h-5 mr-2"></i> Löschen
                </button>
            </div>
        `;Je(Qt(i,{variant:"premium",className:"max-w-md w-full"}),e),typeof lucide<"u"&&lucide.createIcons(),document.getElementById("delete-event-btn").onclick=()=>window.deleteEvent(n.id,e)});window.deleteEvent||(window.deleteEvent=async(n,e)=>{if(!confirm("Möchtest du diesen Termin wirklich löschen?"))return;const{currentFamilyId:t}=B(),r=X(L,"families",t,"calendar",n);try{await ti(r),x("Termin gelöscht","success"),ve(e)}catch(i){console.error("Error deleting event:",i),x("Fehler beim Löschen","error")}});let ku=null,nn=[];function tI(n){if(!n||typeof n!="object"){console.error("renderGallery must be called with a listeners object provided by navigation.js");return}const{currentFamilyId:e,membersData:t}=B();if(!e||!t){x("Fehler: Mitgliedsdaten fehlen für Galerieansicht.","error");return}nI(),n.gallery&&n.gallery();const r=ye(K(L,"families",e,"media"),je("createdAt","desc"));ku=Ye(r,i=>{if(i.empty){os(!0);const s=document.getElementById("gallery-skeleton");s&&s.classList.add("hidden");return}i.docChanges().forEach(s=>{const a={id:s.doc.id,...s.doc.data()};if(s.type==="added"&&nn.unshift(a),s.type==="modified"){const l=nn.findIndex(c=>c.id===a.id);l>-1&&(nn[l]=a)}if(s.type==="removed"){const l=nn.findIndex(c=>c.id===a.id);l>-1&&nn.splice(l,1)}}),iI(),typeof lucide<"u"&&lucide.createIcons()},i=>{console.error("Error loading media:",i),x("Fehler beim Laden der Galerie.","error"),os(!0)}),n.gallery=ku}function nI(){const n=document.getElementById("gallery-album-container"),e=document.getElementById("gallery-empty-state"),t=document.getElementById("gallery-skeleton");if(!n||!t||!e){console.error("Architekt: Galerie-DOM-Struktur in index.html ist fehlerhaft.");return}e.classList.add("hidden"),n.innerHTML="",t.innerHTML=`
      <div class="skeleton-album-card">
        <div class="skeleton-album-header animate-pulse"></div>
        <div class="gallery-album-grid">
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
        </div>
      </div>
    `,t.classList.remove("hidden")}function rI(n){const e={},t=new Intl.DateTimeFormat("de-DE",{month:"long",year:"numeric"});return n.forEach(r=>{if(r.createdAt&&r.createdAt.toDate){const i=r.createdAt.toDate(),s=t.format(i);e[s]||(e[s]=[]),e[s].push(r)}}),e}function iI(){const n=document.getElementById("gallery-album-container"),e=document.getElementById("gallery-skeleton");if(!n||!e)return;if(e.classList.add("hidden"),nn.length===0){n.innerHTML="",os(!0);return}os(!1),n.innerHTML="";const t=rI(nn);for(const r in t){const i=document.createElement("div");i.className="gallery-album-card";const s=document.createElement("h3");s.className="gallery-album-header",s.textContent=r,i.appendChild(s);const a=document.createElement("div");a.className="gallery-album-grid",t[r].forEach(l=>{a.appendChild(sI(l))}),i.appendChild(a),n.appendChild(i)}}function sI(n){const e=document.createElement("div");if(e.className="gallery-media-item",e.onclick=()=>window.openMediaDetail(n),!!(n.type&&n.type.startsWith&&n.type.startsWith("video/"))){const r=document.createElement("video");r.src=n.url,r.setAttribute("playsinline",""),r.setAttribute("muted",""),e.appendChild(r);const i=document.createElement("div");i.className="gallery-video-badge",i.innerHTML='<i data-lucide="play" style="fill: var(--text-primary);"></i>',e.appendChild(i)}else{const r=document.createElement("img");r.src=n.url,r.alt=n.fileName||"Galeriebild",r.loading="lazy",e.appendChild(r)}return e}function os(n){const e=document.getElementById("gallery-empty-state");e&&(n?e.classList.remove("hidden"):e.classList.add("hidden"))}window.triggerGalleryUpload=function(){var n;(n=document.getElementById("gallery-upload-input"))==null||n.click()};window.handleGalleryUpload=function(n){const e=Array.from(n.target.files||[]);e.length!==0&&(window.uploadFiles=e,Je(`
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Dateien hochladen</h2>
            <div id="upload-preview-container" class="grid grid-cols-3 gap-2 mb-4"></div>
            <textarea id="upload-description" class="form-input" rows="3" placeholder="Beschreibung (optional)"></textarea>
            <div class="flex justify-end gap-3 pt-4 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="button" id="upload-submit-btn" class="btn-premium" onclick="window.startUpload()">
                    <span class="btn-text" id="upload-btn-count">Datei(en) hochladen</span>
                </button>
            </div>
        </div>
    `,"template-upload-modal"),setTimeout(()=>{const t=document.getElementById("upload-preview-container");t.innerHTML="",e.forEach(r=>{const i=document.createElement("div");if(i.className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center",r.type.startsWith("image/")){const s=new FileReader;s.onload=a=>{i.innerHTML=`<img src="${a.target.result}" class="w-full h-full object-cover">`},s.readAsDataURL(r)}else r.type.startsWith("video/")?i.innerHTML='<i data-lucide="video" class="w-10 h-10 text-gray-500"></i>':i.innerHTML='<i data-lucide="file" class="w-10 h-10 text-gray-500"></i>';t.appendChild(i)}),document.getElementById("upload-btn-count").textContent=`${e.length} Datei(en) hochladen`,typeof lucide<"u"&&lucide.createIcons()},50))};window.startUpload=async function(){const n=document.getElementById("upload-submit-btn");ze(n);try{const{currentUser:e,currentUserData:t,currentFamilyId:r}=B();if(!window.uploadFiles||window.uploadFiles.length===0||!r)throw new Error("Keine Dateien oder keine Familie ausgewählt.");const i=window.uploadFiles,s=document.getElementById("upload-description").value.trim(),a=[],l=i.map(async c=>{const d=db(_b,`media/${r}/${Date.now()}_${c.name}`),f=await cb(d,c),p=await ub(f.ref);c.type.startsWith("image/")&&a.push(p),await Xe(K(L,"families",r,"media"),{fileName:c.name,url:p,type:c.type,size:c.size,description:s||null,uploaderId:e.uid,uploaderName:t.name,createdAt:ae()})});await Promise.all(l),ve("template-upload-modal"),x(`${i.length} Datei(en) erfolgreich hochgeladen!`,"success"),a.length>0&&await oI(a,e,r)}catch(e){console.error("Upload error:",e),x("Fehler beim Upload.","error")}finally{ce(n),window.uploadFiles=[];const e=document.getElementById("gallery-upload-input");e&&(e.value="")}};async function oI(n,e,t){try{const i=`Neue Fotos im ${new Intl.DateTimeFormat("de-DE",{month:"long",year:"numeric"}).format(new Date)}`,s=K(L,"families",t,"posts"),a=ye(s,pt("type","==","gallery"),pt("galleryTitle","==",i));(await et(a)).empty?(await Xe(s,{type:"gallery",galleryTitle:i,thumbnailUrls:n.slice(0,4),authorName:"FamilyHub Galerie",authorId:"system",authorAvatar:"https://ui-avatars.com/api/?name=Hub&background=A04668&color=F2F4F3&bold=true",createdAt:ae(),participants:null}),x("Neues Album im Feed geteilt!","success")):console.log(`Galerie-Post für '${i}' existiert bereits. Überspringe Erstellung.`)}catch(r){console.error("Fehler beim Erstellen des Galerie-Feed-Posts:",r)}}window.openMediaDetail=function(n){Je(`
        <div class="modal-content glass-premium max-w-2xl w-full">
            <button class="icon-button-ghost absolute top-4 right-4" data-action="close-modal">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <h2 class="text-xl font-bold text-gradient mb-4">${n.fileName||"Mediendetail"}</h2>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1 flex items-center justify-center bg-black/20 rounded-lg">
                    ${n.type.startsWith("video/")?`<video src="${n.url}" controls class="max-h-96 rounded-lg object-contain"></video>`:`<img src="${n.url}" alt="${n.fileName}" class="max-h-96 rounded-lg object-contain" />`}
                </div>
                <div class="md:w-60 flex flex-col gap-3">
                    <p class="text-sm text-text-secondary">Hochgeladen von: <span class="font-semibold text-text-main">${n.uploaderName||"Unbekannt"}</span></p>
                    <p class="text-sm text-text-secondary">Datum: <span class="font-semibold text-text-main">${n.createdAt?n.createdAt.toDate().toLocaleDateString("de-DE"):"Unbekannt"}</span></p>
                    ${n.description?`<p class="text-sm text-text-main mt-2">${n.description}</p>`:""}
                    <div class="flex gap-2 mt-auto pt-4 border-t border-border-glass">
                        <button class="btn-secondary flex-1" onclick="window.downloadMedia('${n.url}', '${n.fileName}')">
                            <i data-lucide="download" class="w-5 h-5"></i>
                        </button>
                        <button class="btn-secondary flex-1 bg-red-500/20 border-red-500/30 text-red-400" onclick="window.deleteMedia('${n.id}')">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,"template-media-detail-modal"),typeof lucide<"u"&&lucide.createIcons()};window.downloadMedia=function(n,e){const t=document.createElement("a");t.href=n,t.download=e||"download",document.body.appendChild(t),t.click(),document.body.removeChild(t)};window.deleteMedia=async function(n){if(!n||!confirm("Möchtest du diese Datei wirklich endgültig löschen?"))return;const{currentFamilyId:e}=B();if(e)try{const t=X(L,"families",e,"media",n);await ti(t),ve("template-media-detail-modal"),x("Datei gelöscht.","success")}catch(t){console.error("Error deleting media:",t),x("Fehler beim Löschen.","error")}};function aI(n){n&&n.settings&&n.settings(),n&&n.goals&&n.goals();const e=document.getElementById("settings-tab-content");if(!e){console.error("Einstellungs-Container nicht gefunden.");return}const{currentUser:t,currentUserData:r,currentFamilyId:i}=B();if(!t||!r||!i){e.innerHTML='<p class="text-text-secondary">Benutzerdaten nicht geladen.</p>';return}Sf(t,r),fI(i),lI(),cI(i,n);const s=document.getElementById("profile-form");s&&(s.onsubmit=mI);const a=document.getElementById("invite-form");a&&(a.onsubmit=pI)}function lI(){const n=document.getElementById("settings-nav"),e=document.querySelectorAll(".settings-tab-panel");if(!n||e.length===0){console.error("Architekt: Das neue Einstellungs-Layout (#settings-nav) wurde nicht gefunden.");return}const t=s=>{e.forEach(l=>{l.classList.toggle("hidden",l.id!==`settings-${s}`)}),n.querySelectorAll("button").forEach(l=>{l.classList.remove("active")});const a=n.querySelector(`button[data-tab="${s}"]`);a&&a.classList.add("active"),s==="goals"&&typeof lucide<"u"&&lucide.createIcons()};n.addEventListener("click",s=>{const a=s.target.closest("button[data-tab]");a&&!a.disabled&&t(a.dataset.tab)});const i=new URLSearchParams(window.location.search).get("tab")||"profile";t(i)}function cI(n,e){const t=document.getElementById("add-goal-btn");t&&(t.onclick=()=>Cf(null));const r=ye(K(L,"families",n,"familyGoals"),je("createdAt","desc"));e.goals=Ye(r,i=>{const s=i.docs.map(a=>({id:a.id,...a.data()}));uI(s)},i=>{console.error("Fehler beim Laden der Ziele:",i);const s=document.getElementById("goals-list-container");s&&(s.innerHTML='<p class="text-red-500">Ziele konnten nicht geladen werden.</p>')})}function uI(n){const e=document.getElementById("goals-list-container");e&&(n.length===0?e.innerHTML=`<div class="text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
            <i data-lucide="flag" class="w-12 h-12 mx-auto mb-4"></i>
            <h3 class="font-bold text-lg">Keine Ziele definiert</h3>
            <p class="text-sm">Erstellt euer erstes gemeinsames Familienziel!</p>
        </div>`:e.innerHTML=n.map(dI).join(""),typeof lucide<"u"&&lucide.createIcons())}function dI(n){const e=n.currentValue>0?n.currentValue/n.targetValue*100:0;return`
        <div class="glass-list-item p-4 rounded-lg">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-white">${n.title}</h4>
                    <p class="text-sm text-secondary mb-2">${n.description||""}</p>
                </div>
                <div class="flex gap-2">
                    <button class="icon-button-ghost" onclick="window.editGoal('${n.id}')">
                        <i data-lucide="pencil" class="w-5 h-5"></i>
                    </button>
                    <button class="icon-button-ghost text-red-500" onclick="window.deleteGoal('${n.id}')">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <div class="flex justify-between text-sm text-secondary mb-1">
                    <span>${n.currentValue} ${n.unit||""}</span>
                    <span>${n.targetValue} ${n.unit||""}</span>
                </div>
                <div class="goal-progress-bar-bg">
                    <div class="goal-progress-bar-fg" style="width: ${e}%"></div>
                </div>
            </div>
        </div>
    `}function Cf(n=null){const e="modal-goal",t=n!==null,r=`
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">${t?"Ziel bearbeiten":"Neues Ziel erstellen"}</h2>
            <form id="goal-form" class="space-y-4">
                <input type="hidden" id="goal-id" value="${t?n.id:""}">
                <div>
                    <label for="goal-title" class="form-label">Titel</label>
                    <input type="text" id="goal-title" class="form-input" required value="${t?n.title:""}">
                </div>
                <div>
                    <label for="goal-description" class="form-label">Beschreibung (optional)</label>
                    <textarea id="goal-description" class="form-input" rows="3">${t&&n.description||""}</textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="goal-current" class="form-label">Aktueller Wert</label>
                        <input type="number" id="goal-current" class="form-input" required value="${t?n.currentValue:"0"}">
                    </div>
                    <div>
                        <label for="goal-target" class="form-label">Zielwert</label>
                        <input type="number" id="goal-target" class="form-input" required value="${t?n.targetValue:""}">
                    </div>
                </div>
                <div>
                    <label for="goal-unit" class="form-label">Einheit (z.B. €, km, Bücher)</label>
                    <input type="text" id="goal-unit" class="form-input" value="${t&&n.unit||""}">
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="goal-submit-btn" class="cta-primary-glow">
                        <span class="btn-text">${t?"Speichern":"Erstellen"}</span>
                    </button>
                </div>
            </form>
        </div>
    `;Je(r,e),document.getElementById("goal-form").onsubmit=i=>{i.preventDefault(),hI()}}async function hI(){const n=document.getElementById("goal-submit-btn");ze(n);const{currentFamilyId:e}=B(),t=document.getElementById("goal-id").value,r=!!t,i={title:document.getElementById("goal-title").value.trim(),description:document.getElementById("goal-description").value.trim(),currentValue:parseFloat(document.getElementById("goal-current").value)||0,targetValue:parseFloat(document.getElementById("goal-target").value)||0,unit:document.getElementById("goal-unit").value.trim()};if(!i.title||!i.targetValue){x("Titel und Zielwert sind erforderlich.","error"),ce(n);return}try{if(r){const s=X(L,"families",e,"familyGoals",t);await He(s,i),x("Ziel aktualisiert!","success")}else{i.createdAt=ae();const s=K(L,"families",e,"familyGoals");await Xe(s,i),x("Ziel erstellt!","success")}ve("modal-goal")}catch(s){console.error("Fehler beim Speichern des Ziels:",s),x("Speichern fehlgeschlagen.","error")}finally{ce(n)}}window.editGoal=async n=>{const{currentFamilyId:e}=B(),t=X(L,"families",e,"familyGoals",n);try{const r=await Yn(t);r.exists()?Cf({id:r.id,...r.data()}):x("Ziel nicht gefunden.","error")}catch{x("Fehler beim Laden des Ziels.","error")}};window.deleteGoal=async n=>{if(!confirm("Möchtest du dieses Ziel wirklich löschen?"))return;const{currentFamilyId:e}=B(),t=X(L,"families",e,"familyGoals",n);try{await ti(t),x("Ziel gelöscht.","success")}catch(r){console.error("Fehler beim Löschen des Ziels:",r),x("Löschen fehlgeschlagen.","error")}};function Sf(n,e){const t=document.getElementById("profile-name"),r=document.getElementById("profile-email");t&&(t.value=e.name||""),r&&(r.value=n.email||"")}async function fI(n){const e=document.getElementById("family-members-list");if(e){e.innerHTML='<div class="flex justify-center items-center p-4"><div class="spinner"></div></div>';try{const t=K(L,"families",n,"membersData"),i=(await et(t)).docs.map(s=>({id:s.id,...s.data()}));if(i.length===0){e.innerHTML='<p class="text-text-secondary text-center">Keine Familienmitglieder gefunden.</p>';return}e.innerHTML=i.map(s=>`
            <div class="flex items-center justify-between p-3 bg-background-glass rounded-lg">
                <div class="flex items-center gap-3">
                    <img src="${s.photoURL||"img/default_avatar.png"}" alt="${s.name}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <p class="font-semibold">${s.name}</p>
                        <p class="text-sm text-text-secondary">${s.email}</p>
                    </div>
                </div>
                </div>
        `).join("")}catch(t){console.error("Fehler beim Laden der Familienmitglieder:",t),e.innerHTML='<p class="text-red-400 text-center">Fehler beim Laden der Mitglieder.</p>'}}}async function mI(n){n.preventDefault();const e=n.target.querySelector('button[type="submit"]');ze(e);const{currentUser:t,currentUserData:r,currentFamilyId:i}=B(),s=document.getElementById("profile-name").value.trim();if(!t||!i){x("Nicht angemeldet.","error"),ce(e);return}if(s===r.name){ce(e);return}try{const a=ks(L),l=X(L,"users",t.uid);a.set(l,{name:s},{merge:!0});const c=X(L,"families",i,"membersData",t.uid);a.update(c,{name:s}),await a.commit(),x("Profil aktualisiert!","success"),r.name=s,Sf(t,r)}catch(a){console.error("Fehler beim Profil-Update:",a),x("Fehler beim Speichern.","error")}finally{ce(e)}}async function pI(n){n.preventDefault();const e=n.target.querySelector('button[type="submit"]');ze(e);const t=document.getElementById("invite-email").value.trim(),{currentFamilyId:r,currentUserData:i}=B();if(!t||!r){x("E-Mail und Familien-ID benötigt.","error"),ce(e);return}try{const s=K(L,"invites");await Xe(s,{familyId:r,familyName:i.familyName,fromName:i.name,toEmail:t,status:"pending",createdAt:ae()}),x(`Einladung an ${t} gesendet!`,"success"),document.getElementById("invite-form").reset()}catch(s){console.error("Fehler beim Senden der Einladung:",s),x("Fehler beim Senden der Einladung.","error")}finally{ce(e)}}let Dr="all",ea=[];function Pu(){const n=document.getElementById("wishlist-grid"),e=document.getElementById("wishlist-empty-state");if(!n||!e)return;const t=Dr==="all"?ea:ea.filter(r=>r.uploaderId===Dr);if(t.length===0){const r=Dr==="all"?"Es gibt noch keine Wünsche.":"Dieses Mitglied hat noch keine Wünsche.";e.innerHTML=Te("Wunschliste leer",r,"gift"),e.classList.remove("hidden"),n.innerHTML=""}else n.innerHTML=t.map(If).join(""),e.classList.add("hidden");typeof lucide<"u"&&lucide.createIcons()}function gI(n){const{currentFamilyId:e,membersData:t,currentUser:r}=B();if(!e){console.warn("renderWishlist: keine currentFamilyId verfügbar — wahrscheinlich abgemeldet.");const l=document.getElementById("wishlist-grid"),c=document.getElementById("wishlist-empty-state");l&&(l.innerHTML=""),c&&(c.innerHTML=Te("Nicht angemeldet","Melde dich an, um die Wunschlisten zu sehen.","log-in"),c.classList.remove("hidden"));return}const i=document.getElementById("wishlist-member-tabs");let s=`<button class="feed-filter-btn active" onclick="window.filterWishlist(this, 'all')">Alle</button>`;t&&(s+=Object.values(t).map(l=>`<button class="feed-filter-btn" data-uid="${l.uid}" onclick="window.filterWishlist(this, '${l.uid}')">
                ${l.name}
            </button>`).join("")),i.innerHTML=s,Dr="all";const a=ye(K(L,"families",e,"wishlistItems"),je("createdAt","desc"));n.wishlist=Ye(a,l=>{ea=l.docs.map(c=>({id:c.id,...c.data()})),Pu()},l=>{console.error("Error loading wishlist:",l),x("Fehler beim Laden der Wunschliste","error")}),window.filterWishlist=(l,c)=>{Dr=c,document.querySelectorAll("#wishlist-member-tabs .feed-filter-btn").forEach(d=>d.classList.remove("active")),l.classList.add("active"),Pu()},window.claimWish=async l=>{const c=X(L,"families",e,"wishlistItems",l);try{await He(c,{claimedBy:r.uid}),x("Wunsch reserviert!","success")}catch{x("Fehler beim Reservieren","error")}},window.unclaimWish=async l=>{const c=X(L,"families",e,"wishlistItems",l);try{await He(c,{claimedBy:null}),x("Reservierung aufgehoben","info")}catch{x("Fehler","error")}},window.deleteWish=async l=>{if(!confirm("Möchtest du diesen Wunsch wirklich löschen?"))return;const c=X(L,"families",e,"wishlistItems",l);try{await ti(c),x("Wunsch gelöscht","success")}catch{x("Fehler beim Löschen","error")}},window.openAddWishModal=()=>{Je(`
          <div class="modal-content glass-premium max-w-lg w-full">
              <h2 class="text-xl font-bold text-gradient mb-6">Neuer Wunsch</h2>
              <form id="create-wish-form" class="space-y-4">
                  <div>
                      <label for="wish-url" class="form-label">Produkt-Link</label>
                      <input type="url" id="wish-url" class="form-input" placeholder="https://beispiel.de/produkt" required>
                      <p class="text-xs text-secondary mt-1">Füge einen Link ein. Details wie Titel, Preis und Bild werden automatisch abgerufen.</p>
                  </div>
                  <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                      <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                      <button type="submit" id="create-wish-submit" class="cta-primary-glow">
                          <span class="btn-text">Wunsch hinzufügen</span>
                      </button>
                  </div>
              </form>
          </div>
        `,"modal-add-wish");const d=document.getElementById("create-wish-form");d.onsubmit=window.handleWishSubmit},window.handleWishSubmit=async l=>{l.preventDefault();const c=document.getElementById("wish-url").value;if(!c){x("Ein Link ist erforderlich","warning");return}if(!c.startsWith("http://")&&!c.startsWith("https://")){x("Bitte gib einen gültigen Link ein (mit https://)","warning");return}const d={url:c,status:"parsing",uploaderId:r.uid,uploaderName:B().currentUserData.name,createdAt:ae(),claimedBy:null};try{await Xe(K(L,"families",e,"wishlistItems"),d),x("Wunsch hinzugefügt! Details werden abgerufen...","success"),ve("modal-add-wish")}catch{x("Fehler beim Speichern","error")}}}let ta=()=>{},Nr=null;function _I(n,e={}){const{currentUser:t,currentFamilyId:r,membersData:i}=B();if(!t)return;const s=document.getElementById("chat-list-container"),a=ye(K(L,"families",r,"chats"),pt("members","array-contains",t.uid),je("updatedAt","desc"));n.chats=Ye(a,c=>{const d=document.getElementById("chat-list-container");if(d){if(c.empty){d.innerHTML="<p class='text-secondary p-4 text-center text-sm'>Starte deine erste Konversation.</p>";return}c.docChanges().forEach(f=>{const p={id:f.doc.id,...f.doc.data()},v=`chat-list-item-${p.id}`;let b=document.getElementById(v);if(f.type==="removed"){b&&b.remove();return}const C=yI(p,t,i);if(b)b.innerHTML=new DOMParser().parseFromString(C,"text/html").body.firstChild.innerHTML;else{const D=document.createElement("div");D.innerHTML=C,b=D.firstChild,b.id=v}d.firstChild!==b&&d.prepend(b)}),typeof lucide<"u"&&lucide.createIcons()}},c=>{console.error("Error loading chats:",c),s.innerHTML="<p class='text-red-500 p-4'>Fehler beim Laden der Chats.</p>"});const l=document.getElementById("chat-input-form");l.onsubmit=async c=>{c.preventDefault();const d=document.getElementById("chat-message-input"),f=d.value.trim();if(!f||!Nr)return;const{currentUser:p,currentUserData:v,currentFamilyId:b}=B();d.value="";try{const C=K(L,"families",b,"chats",Nr,"messages");await Xe(C,{text:f,senderId:p.uid,senderName:v.name,createdAt:ae()});const D=X(L,"families",b,"chats",Nr);await He(D,{lastMessage:f,updatedAt:ae(),unread:!0}),kf()}catch(C){console.error("Error sending message:",C),x("Senden fehlgeschlagen","error"),d.value=f}},window.openChatWindow=(c,d,f)=>xu(c,d,f),window.closeChatWindow=()=>wI(),window.openNewChatModal=()=>{const{currentUser:c,membersData:d}=B(),f="modal-new-chat",v=`
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gradient">Neue Nachricht</h2>
                <button type="button" class="icon-button-ghost p-2 -mr-2 -mt-2" data-action="close-modal">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <p class="text-secondary mb-4">Wähle ein Mitglied aus, um eine private Konversation zu starten.</p>
            <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                ${Object.values(d).filter(b=>b.uid!==c.uid).map(b=>`
                <button type="button" class="member-select-item" onclick="window.startDirectChat(this, '${b.uid}', '${b.name}')">
                    <img src="${b.photoURL||`https://ui-avatars.com/api/?name=${b.name.charAt(0)}`}" alt="${b.name}" class="member-select-avatar">
                    <span class="font-semibold text-white">${b.name}</span>
                </button>
            `).join("")||'<p class="text-secondary text-sm">Keine anderen Mitglieder gefunden.</p>'}
            </div>
        `;Je(Qt(v,{variant:"premium",className:"animate-slide-in-up max-w-md w-full",padding:"lg"}),f),typeof lucide<"u"&&lucide.createIcons()},window.startDirectChat=async(c,d,f)=>{c&&ze(c);const{currentUser:p,currentFamilyId:v,membersData:b}=B();try{const C=K(L,"families",v,"chats"),D=ye(C,pt("type","==","direct"),pt("members","array-contains",p.uid)),k=await et(D);let U=null;k.forEach(ne=>{const J=ne.data();J.members.includes(d)&&J.members.length===2&&(U=ne.id)});const $=b[d],F=$.photoURL||`https://ui-avatars.com/api/?name=${$.name.charAt(0)}&background=0A0908&color=F2F4F3`;let j=U;U||(j=(await Xe(C,{type:"direct",members:[p.uid,d],createdAt:ae(),updatedAt:ae(),lastMessage:"Chat gestartet"})).id),ve("modal-new-chat"),xu(j,f,F)}catch(C){console.error("Error starting direct chat:",C),x("Fehler beim Starten des Chats.","error"),c&&ce(c)}},window.startContextChat=async(c,d,f)=>{const{currentUser:p,currentFamilyId:v,membersData:b}=B(),C=`${c}_${d}`;x("Suche nach Chat...","info");try{const D=K(L,"families",v,"chats"),k=ye(D,pt("contextId","==",C),pt("members","array-contains",p.uid)),U=await et(k);let $=null;U.empty||($={id:U.docs[0].id,...U.docs[0].data()});let F=null,j="",ne="";if($)F=$.id,j=$.name,ne=$.avatar||"https://ui-avatars.com/api/?name=G&background=0A0908&color=F2F4F3";else{const J=Object.keys(b),E=`Aufgabe: ${f.substring(0,20)}...`;ne="https://ui-avatars.com/api/?name=T&background=0A0908&color=F2F4F3",F=(await Xe(D,{type:"group",name:E,members:J,contextId:C,createdAt:ae(),updatedAt:ae(),lastMessage:`${p.name} hat eine Diskussion gestartet.`})).id,j=E}Hr("chat",{initialChat:{chatId:F,chatName:j,chatAvatar:ne}})}catch(D){console.error("Error starting context chat:",D),x("Fehler beim Starten des Chats.","error")}}}function yI(n,e,t){let r=n.name||"Gruppenchat",i=n.avatar||"https://ui-avatars.com/api/?name=G&background=0A0908&color=F2F4F3";if(n.type==="direct"){const s=n.members.find(l=>l!==e.uid),a=t[s];a?(r=a.name,i=a.photoURL||`https://ui-avatars.com/api/?name=${a.name.charAt(0)}&background=0A0908&color=F2F4F3`):r="Unbekannt"}return n.type==="group"&&n.contextId&&n.contextId.startsWith("pinnwandTask")&&(r=`[Aufgabe] ${n.name}`),`
    <div class="chat-list-item" onclick="window.openChatWindow('${n.id}', '${n.name||r}', '${i}')">
        <img src="${i}" alt="${r}" class="chat-list-avatar">
        <div class="flex-1 min-w-0">
            <p class="font-semibold text-white truncate">${r}</p>
            <p class="text-sm text-secondary truncate">${n.lastMessage||"Keine Nachrichten"}</p>
        </div>
        ${n.unread?'<div class="chat-list-unread-badge"></div>':""}
    </div>
    `}function vI(n,e){const t=n.senderId===e,r=t?"chat-bubble-own":"chat-bubble-other";return`
    <div class="chat-message-container">
        ${t?"":`<p class="chat-message-sender">${n.senderName||"Unbekannt"}</p>`}
        <div class="${r} chat-bubble">
            ${n.text}
        </div>
    </div>
    `}function kf(){const n=document.getElementById("chat-messages-container");n&&(n.scrollTop=n.scrollHeight)}function xu(n,e,t){const{currentUser:r,currentFamilyId:i}=B();if(!r)return;ta(),Nr=n,document.getElementById("chat-list-panel").classList.add("hidden","lg:flex"),document.getElementById("chat-window-panel").classList.remove("translate-x-full"),document.getElementById("chat-empty-state").classList.add("hidden");const s=document.getElementById("chat-window-active");s.classList.remove("hidden"),s.classList.add("flex"),document.getElementById("chat-header-avatar").src=t,document.getElementById("chat-header-name").textContent=e,document.getElementById("chat-header-status").textContent="Online";const a=document.getElementById("chat-messages-container");a.innerHTML='<div class="spinner mx-auto mt-10"></div>';const l=ye(K(L,"families",i,"chats",n,"messages"),je("createdAt","asc"));ta=Ye(l,c=>{if(c.empty){a.innerHTML='<p class="text-center text-secondary text-sm">Noch keine Nachrichten.</p>';return}c.docChanges().forEach(d=>{if(d.type==="added"){const f=d.doc.data(),p=`msg-${d.doc.id}`;if(!document.getElementById(p)){const v=document.createElement("div");v.id=p,v.innerHTML=vI(f,r.uid),a.appendChild(v)}}}),kf(),typeof lucide<"u"&&lucide.createIcons()},c=>{console.error("Error loading messages:",c),a.innerHTML="<p class='text-red-500 p-4'>Fehler beim Laden der Nachrichten.</p>"})}function wI(){document.getElementById("chat-list-panel").classList.remove("hidden"),document.getElementById("chat-window-panel").classList.add("translate-x-full"),ta(),Nr=null}function EI(n){const{currentFamilyId:e,membersData:t}=B(),r=document.getElementById("leaderboard-container"),i=document.getElementById("challenges-container");if(!r||!i){console.error("Challenges-DOM-Struktur nicht gefunden. `index.html` ist veraltet.");return}if(!e){r.innerHTML=Te("Keine Familien-ID","Bitte melde dich an, um das Leaderboard zu sehen.","award"),i.innerHTML=Te("Keine Familien-ID","Bitte melde dich an, um Challenges zu sehen.","award");return}!t||Object.keys(t).length===0?r.innerHTML=Te("Keine Familien-Daten","Bitte melde dich an oder warte, bis Familieninformationen geladen sind.","award"):bI(),II(n)}function bI(){const{membersData:n}=B(),e=document.getElementById("leaderboard-container");if(!e)return;if(!n||Object.keys(n).length===0){e.innerHTML=Te("Keine Familien-Daten","Warte, bis die Mitglieder geladen sind.","users");return}const r=Object.values(n).sort((i,s)=>(s.points||0)-(i.points||0)).map((i,s)=>`
        <div class="leaderboard-item">
            <span class="leaderboard-rank">${s+1}</span>
            <img src="${i.photoURL||`https://ui-avatars.com/api/?name=${i.name.charAt(0)}`}" alt="${i.name}" class="leaderboard-avatar">
            <p class="font-semibold text-white">${i.name}</p>
            <div class="leaderboard-points">
                ${i.points||0} <i data-lucide="sparkles"></i>
            </div>
        </div>
        `).join("");Ne(r,e),typeof lucide<"u"&&lucide.createIcons()}function II(n){const{currentFamilyId:e}=B(),t=document.getElementById("challenges-container");if(!t)return;t.innerHTML='<div class="spinner mx-auto"></div>';const r=ye(K(L,"families",e,"familyChallenges"));n.challenges=Ye(r,i=>{if(i.empty){const a=Te("Keine Challenges aktiv","Erstelle die erste Challenge für deine Familie!","award",`<button class="cta-primary-glow" onclick="window.openCreateChallengeModal()">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Challenge erstellen
                 </button>`);Ne(a,t),typeof lucide<"u"&&lucide.createIcons();return}const s=i.docs.map(a=>{const l={id:a.id,...a.data()};return AI(l)}).join("");Ne(s,t),typeof lucide<"u"&&lucide.createIcons()},i=>{console.error("Error loading challenges:",i),Ne("<p class='text-red-500 p-4'>Fehler beim Laden der Challenges.</p>",t)})}const na=["award","walk","run","flag","trophy","star","heart","check-circle"];function TI(n){return n&&na.includes(n)?n:"award"}function AI(n){const{currentUser:e}=B();let t=0,r="0/N.N.",i=!1;if(n.participants&&n.participants[e.uid]){i=!0;const a=n.participants[e.uid];n.target&&n.target>0&&(t=a.current/n.target*100,r=`${a.current} / ${n.target} ${n.unit||""}`)}return`
    <div class="challenge-card">
        <div class="challenge-icon">
            <i data-lucide="${TI(n.icon)}"></i>
        </div>
        <div class="flex-1">
            <h4 class="font-semibold text-white">${n.title}</h4>
            <p class="text-sm text-secondary">${n.description}</p>
            ${i?`
                <div class="challenge-progress-bar-bg">
                    <div class="challenge-progress-bar-fg" style="width: ${Math.min(100,t)}%;"></div>
                </div>
                <p class="text-xs text-secondary mt-1">${r}</p>
            `:""}
        </div>
        ${i?`
            <button class="btn-secondary" onclick="window.updateChallengeProgress('${n.id}')">
                Update
            </button>
        `:`
            <button class="cta-primary-glow" onclick="window.joinChallenge('${n.id}')">
                Mitmachen
            </button>
        `}
    </div>
    `}window.joinChallenge||(window.joinChallenge=async n=>{const{currentUser:e,currentUserData:t,currentFamilyId:r}=B(),i=X(L,"families",r,"familyChallenges",n),s=`participants.${e.uid}`;try{await He(i,{[s]:{current:0,name:t.name}}),x("Challenge beigetreten!","success")}catch(a){console.error("Error joining challenge:",a),x("Beitritt fehlgeschlagen","error")}});window.updateChallengeProgress||(window.updateChallengeProgress=n=>{const t=`
            <div class="modal animate-fade-in" onclick="if(event.target === this) closeModal()">
                ${Qt(`
            <form id="update-progress-form">
                <h2 class="text-2xl font-bold text-gradient mb-4">Fortschritt eintragen</h2>
                <input type="number" id="progress-value" class="form-input" placeholder="Neuer Wert (z.B. 5000)" required>
                <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Abbrechen</button>
                    <button type="submit" class="cta-primary-glow">Speichern</button>
                </div>
            </form>
        `,{variant:"premium",className:"animate-slide-in-up max-w-md w-full",padding:"lg"})}
            </div>
        `;Ne(t,document.getElementById("modal-container")),typeof lucide<"u"&&lucide.createIcons(),document.getElementById("update-progress-form").onsubmit=async r=>{r.preventDefault();const i=parseFloat(document.getElementById("progress-value").value);if(isNaN(i))return x("Ungültiger Wert","warning");const{currentUser:s,currentFamilyId:a}=B(),l=X(L,"families",a,"familyChallenges",n),c=`participants.${s.uid}.current`;try{await He(l,{[c]:i}),x("Fortschritt gespeichert!","success"),ve()}catch(d){console.error("Error updating progress:",d),x("Fehler beim Speichern","error")}}});window.openCreateChallengeModal||(window.openCreateChallengeModal=()=>{const e=`
            <div class="modal animate-fade-in" onclick="if(event.target === this) closeModal()">
                ${Qt(`
            <form id="create-challenge-form" class="space-y-4">
                <h2 class="text-2xl font-bold text-gradient mb-6">Neue Challenge erstellen</h2>
                
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-title">Titel der Challenge</label>
                    <input type="text" id="challenge-title" name="challenge-title" class="form-input" required>
                </div>
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-desc">Beschreibung</label>
                    <input type="text" id="challenge-desc" name="challenge-desc" class="form-input">
                </div>
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-icon">Icon (z.B. 'walk', 'star', 'trophy')</label>
                    <input type="text" id="challenge-icon" name="challenge-icon" class="form-input" value="award">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm text-secondary mb-1 block" for="challenge-target">Zielwert (z.B. 10000)</label>
                        <input type="number" id="challenge-target" name="challenge-target" class="form-input" required>
                    </div>
                    <div>
                        <label class="text-sm text-secondary mb-1 block" for="challenge-unit">Einheit (z.B. 'Schritte')</label>
                        <input type="text" id="challenge-unit" name="challenge-unit" class="form-input">
                    </div>
                </div>

                <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Abbrechen</button>
                    <button type="submit" class="cta-primary-glow">Challenge starten</button>
                </div>
            </form>
        `,{variant:"premium",className:"animate-slide-in-up max-w-lg w-full",padding:"lg"})}
            </div>
        `;Ne(e,document.getElementById("modal-container")),typeof lucide<"u"&&lucide.createIcons(),document.getElementById("create-challenge-form").onsubmit=window.handleCreateChallenge});window.handleCreateChallenge||(window.handleCreateChallenge=async n=>{n.preventDefault();const{currentFamilyId:e}=B(),t={title:document.getElementById("challenge-title").value,description:document.getElementById("challenge-desc").value,icon:document.getElementById("challenge-icon").value||"award",target:parseFloat(document.getElementById("challenge-target").value),unit:document.getElementById("challenge-unit").value,createdAt:ae(),status:"active",participants:{}};if(!t.title||isNaN(t.target))return x("Titel und Zielwert sind erforderlich","warning");if(!na.includes(t.icon)){x(`Ungültiges Icon. Wähle eines: ${na.join(", ")}`,"warning"),t.icon="award",document.getElementById("challenge-icon").value="award";return}try{await Xe(K(L,"families",e,"familyChallenges"),t),x("Challenge erstellt!","success"),ve()}catch(r){console.error("Error creating challenge:",r),x("Fehler beim Erstellen","error")}});function RI(n){n.finanzen&&n.finanzen();const{currentFamilyId:e,currentUser:t}=B();if(!e||!t)return;const r=document.getElementById("app-content");r.innerHTML=`
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2 class="text-xl font-bold text-gradient">Finanzübersicht</h2>
            
            <button class="cta-primary-glow w-full md:w-auto" onclick="window.openCreatePostModal()">
                <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                <span>Neue Ausgabe</span>
            </button>
        </div>
        
        <div id="finance-charts-container" class="mb-6">
            </div>

        <h3 class="text-lg font-semibold text-white mb-4">Alle Ausgaben</h3>
        <div id="finance-list-container" class="space-y-4">
            <div class="spinner mx-auto"></div>
        </div>
    `;const i=document.getElementById("finance-list-container"),s=ye(K(L,"families",e,"posts"),pt("type","==","expense"),pt("participants","array-contains",t.uid),je("createdAt","desc"));n.finanzen=Ye(s,a=>{if(a.empty){const c=Te("Keine Ausgaben erfasst",'Erfasse deine erste private Ausgabe über den Button "Neue Ausgabe".',"piggy-bank","");Ne(c,i),typeof lucide<"u"&&lucide.createIcons();return}const l=a.docs.map(c=>{const d={id:c.id,...c.data()};return bf(d)}).join("");Ne(l,i),typeof lucide<"u"&&lucide.createIcons()},a=>{console.error("Error loading expenses:",a),x("Fehler beim Laden der Finanzen","error"),Ne("<p class'text-red-500 p-4'>Fehler beim Laden der Ausgaben.</p>",i)})}function CI(n){const e={};return n.forEach(t=>{const r=t.date||(t.createdAt?t.createdAt.toDate():null);if(!r)return;const i=r.toISOString().split("T")[0];e[i]||(e[i]=[]),e[i].push(t)}),e}function SI(n){const e=(n.date||(n.createdAt?n.createdAt.toDate():new Date)).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});let t="message-circle",r=n.text||"Beitrag",i=`window.openPostMenu('${n.id}')`;return n.type==="gallery"?(t="image",r=n.galleryTitle||"Neue Fotos",i="window.MapsTo('gallery')"):n.date&&(t="calendar",r=n.title,i=`window.openEventDetails ? window.openEventDetails(${JSON.stringify(n).replace(/"/g,"'")}) : console.log('Event-Detail')`),`
    <div class="chronik-item" onclick="${i}">
        <div class="chronik-icon"><i data-lucide="${t}"></i></div>
        <div class="chronik-info">
            <p class="title">${r}</p>
            <p class="time">${e} Uhr</p>
        </div>
    </div>
    `}function kI(n,e){return`
    <div class="chronik-day-group">
        <h3 class="chronik-day-title">${new Date(n).toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</h3>
        <div class="space-y-2">
            ${e.map(SI).join("")}
        </div>
    </div>
    `}async function PI(n){const e=document.getElementById("app-content");e.innerHTML=`
        <h2 class="text-xl font-bold text-gradient mb-6">Chronik</h2>
        <p class="text-secondary mb-6">Ein durchsuchbares Archiv aller Ereignisse, Termine und Posts.</p>
        <div id="chronik-list-container">
            <div class="spinner mx-auto"></div>
        </div>
    `;const t=document.getElementById("chronik-list-container"),{currentFamilyId:r}=B();try{const i=ye(K(L,"families",r,"posts"),je("createdAt","desc")),s=ye(K(L,"families",r,"calendar"),je("date","desc")),[a,l]=await Promise.all([et(i),et(s)]),c=a.docs.map(b=>({id:b.id,...b.data()})),d=l.docs.map(b=>({id:b.id,...b.data(),date:b.data().date.toDate()})),f=[...c,...d].sort((b,C)=>{const D=b.date||(b.createdAt?b.createdAt.toDate():0);return(C.date||(C.createdAt?C.createdAt.toDate():0))-D});if(f.length===0){Ne(Te("Noch keine Einträge","Beginnt, den Feed oder Kalender zu nutzen, um die Chronik zu füllen.","history",""),t),typeof lucide<"u"&&lucide.createIcons();return}const p=CI(f),v=Object.keys(p).sort().reverse();t.innerHTML=v.map(b=>kI(b,p[b])).join(""),typeof lucide<"u"&&lucide.createIcons()}catch(i){console.error("Fehler beim Laden der Chronik:",i),x("Chronik konnte nicht geladen werden","error"),Ne(Te("Fehler","Beim Laden der Chronik ist ein Fehler aufgetreten.","alert-triangle",""),t)}}function xI(n,e){const t=e||document,r=t.querySelector("#login-form"),i=t.querySelector("#register-form"),s=t.querySelectorAll("[data-auth-toggle]");if(!r||!i){console.error("Login- oder Registrierungsformular nicht gefunden!");return}r.onsubmit=DI,i.onsubmit=NI,s.forEach(a=>{a.onclick=()=>{a.dataset.authToggle==="login"?(r.classList.remove("hidden"),i.classList.add("hidden")):(r.classList.add("hidden"),i.classList.remove("hidden"))}})}async function DI(n){n.preventDefault();const e=n.target.querySelector('button[type="submit"]');ze(e);const t=document.getElementById("login-email").value,r=document.getElementById("login-pass").value;try{await Ov(jr,t,r)}catch(i){console.error("Login-Fehler:",i),x("Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort.","error"),ce(e)}}async function NI(n){n.preventDefault();const e=n.target.querySelector('button[type="submit"]');ze(e);const t=document.getElementById("register-name").value,r=document.getElementById("register-email").value,i=document.getElementById("register-pass").value;if(t.length<2){x("Bitte gib einen gültigen Namen ein.","warning"),ce(e);return}try{const a=(await Vv(jr,r,i)).user;await Uv(a,{displayName:t}),await LI(a.uid,t,r)}catch(s){console.error("Registrierungs-Fehler:",s),s.code==="auth/email-already-in-use"?x("Diese E-Mail-Adresse wird bereits verwendet.","error"):x("Registrierung fehlgeschlagen.","error"),ce(e)}}async function LI(n,e,t){const r=ks(L),i=X(collection(L,"families")),s=i.id;r.set(i,{name:`${e}s Familie`,createdAt:ae(),ownerId:n});const a=X(L,"families",s,"membersData",n);r.set(a,{uid:n,name:e,email:t,role:"Admin",joinedAt:ae(),points:0,photoURL:null});const l=X(L,"users",n);r.set(l,{uid:n,name:e,email:t,familyId:s}),await r.commit()}function MI(n){const e=document.getElementById("app-content");if(!e){console.error("App content container not found");return}const{currentUser:t}=B();if(!t){e.innerHTML=Ls("Nicht angemeldet","Bitte melde dich an, um Familien zu verwalten.");return}e.innerHTML=VI(),OI(n)}function VI(){return`
        <div class="max-w-6xl mx-auto space-y-8">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gradient">Familienverwaltung</h1>
                    <p class="text-secondary mt-2">Verwalte deine Familie mit erweiterten Einstellungen und Bearbeitungsoptionen</p>
                </div>
                <button id="btn-create-family" class="cta-primary-glow">
                    <i data-lucide="users-plus" class="w-5 h-5 mr-2"></i>
                    Neue Familie erstellen
                </button>
            </div>

            <!-- Family Overview Section -->
            <div class="glass-premium p-6 rounded-xl">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="home" class="w-6 h-6 text-accent-glow"></i>
                        Aktuelle Familie
                    </h2>
                    <button id="btn-edit-family" class="btn-secondary">
                        <i data-lucide="settings" class="w-4 h-4 mr-2"></i>
                        Familie bearbeiten
                    </button>
                </div>
                <div id="current-family-info">
                    <div class="flex justify-center items-center p-8">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>

            <!-- Family Members Section -->
            <div class="glass-premium p-6 rounded-xl">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="users" class="w-6 h-6 text-accent-glow"></i>
                        Familienmitglieder
                    </h2>
                    <button id="btn-invite-member" class="btn-secondary">
                        <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
                        Mitglied einladen
                    </button>
                </div>
                <div id="family-members-list">
                    <div class="flex justify-center items-center p-8">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>

            <!-- Advanced Settings Section -->
            <div class="glass-premium p-6 rounded-xl">
                <h2 class="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <i data-lucide="sliders" class="w-6 h-6 text-accent-glow"></i>
                    Erweiterte Einstellungen
                </h2>
                <div id="advanced-settings-container" class="space-y-4">
                    <!-- Settings will be loaded here -->
                </div>
            </div>

            <!-- Family Statistics Section -->
            <div class="glass-premium p-6 rounded-xl">
                <h2 class="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <i data-lucide="bar-chart-3" class="w-6 h-6 text-accent-glow"></i>
                    Familienstatistiken
                </h2>
                <div id="family-statistics" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Statistics will be loaded here -->
                </div>
            </div>
        </div>
    `}function OI(n){const{currentFamilyId:e}=B();if(!e){document.getElementById("current-family-info").innerHTML=Ls("Keine Familie","Du bist noch keiner Familie zugeordnet. Erstelle eine neue Familie oder trete einer bestehenden bei.");return}FI(),UI(e,n),$I(e,n),jI(e),WI(e),typeof lucide<"u"&&lucide.createIcons()}function FI(){const n=document.getElementById("btn-create-family"),e=document.getElementById("btn-edit-family"),t=document.getElementById("btn-invite-member");n&&n.addEventListener("click",GI),e&&e.addEventListener("click",QI),t&&t.addEventListener("click",JI)}function UI(n,e){const t=document.getElementById("current-family-info"),r=X(L,"families",n);e.currentFamily=Ye(r,i=>{if(i.exists()){const s=i.data();t.innerHTML=BI(s,n),typeof lucide<"u"&&lucide.createIcons()}else t.innerHTML=Ls("Familie nicht gefunden","Die Familie konnte nicht geladen werden.")},i=>{console.error("Error loading family info:",i),t.innerHTML='<p class="text-red-400">Fehler beim Laden der Familieninformationen.</p>'})}function BI(n,e){const t=n.createdAt?new Date(n.createdAt.toDate()).toLocaleDateString("de-DE"):"Unbekannt";return`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <div>
                    <label class="text-sm text-secondary block mb-1">Familienname</label>
                    <p class="text-lg font-semibold text-white">${n.name||"Unbenannt"}</p>
                </div>
                <div>
                    <label class="text-sm text-secondary block mb-1">Erstellt am</label>
                    <p class="text-white">${t}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="text-sm text-secondary block mb-1">Familien-ID</label>
                    <div class="flex items-center gap-2">
                        <code class="text-sm text-secondary bg-background-glass px-3 py-1 rounded">${e}</code>
                        <button class="btn-icon-ghost" onclick="navigator.clipboard.writeText('${e}'); window.showNotification('ID kopiert!', 'success')">
                            <i data-lucide="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="text-sm text-secondary block mb-1">Status</label>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent-glow/20 text-accent-glow">
                        <i data-lucide="check-circle" class="w-4 h-4 mr-1"></i>
                        Aktiv
                    </span>
                </div>
            </div>
        </div>
    `}function $I(n,e){const t=document.getElementById("family-members-list"),r=K(L,"families",n,"membersData"),i=ye(r,je("joinedAt","asc"));e.familyMembers=Ye(i,s=>{const a=s.docs.map(l=>({id:l.id,...l.data()}));a.length===0?t.innerHTML=Ls("Keine Mitglieder","Lade Mitglieder ein, um deine Familie zu erweitern."):(t.innerHTML=`
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${a.map(l=>qI(l,n)).join("")}
                </div>
            `,typeof lucide<"u"&&lucide.createIcons())},s=>{console.error("Error loading family members:",s),t.innerHTML='<p class="text-red-400">Fehler beim Laden der Familienmitglieder.</p>'})}function qI(n,e){const t=n.joinedAt?new Date(n.joinedAt.toDate()).toLocaleDateString("de-DE"):"Unbekannt",r=n.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(n.name||"User")}&background=A04668&color=fff`,{currentUser:i}=B(),s=i&&i.uid===n.uid,a=n.role==="Admin"?"bg-accent-glow/20 text-accent-glow":"bg-gray-500/20 text-gray-400";return`
        <div class="glass-list-item p-4 rounded-lg hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                    <img src="${r}" alt="${n.name}" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <p class="font-semibold text-white flex items-center gap-2">
                            ${n.name||"Unbekannt"}
                            ${s?'<span class="text-xs text-accent-glow">(Du)</span>':""}
                        </p>
                        <p class="text-sm text-secondary">${n.email||""}</p>
                    </div>
                </div>
                ${s?"":`
                    <button class="btn-icon-ghost" onclick="window.openEditMemberModal('${n.id}', '${e}')">
                        <i data-lucide="more-vertical" class="w-4 h-4"></i>
                    </button>
                `}
            </div>
            <div class="flex items-center justify-between text-sm">
                <span class="inline-flex items-center px-2 py-1 rounded ${a} text-xs font-semibold">
                    ${n.role||"Mitglied"}
                </span>
                <span class="text-secondary">Beigetreten: ${t}</span>
            </div>
            ${n.points!==void 0?`
                <div class="mt-3 pt-3 border-t border-border-glass">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-secondary">Punkte</span>
                        <span class="text-lg font-bold text-accent-glow">${n.points||0}</span>
                    </div>
                </div>
            `:""}
        </div>
    `}function jI(n){const e=document.getElementById("advanced-settings-container");e.innerHTML=`
        <div class="space-y-4">
            <!-- Privacy Settings -->
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Familienkalender freigeben</p>
                    <p class="text-sm text-secondary">Erlaubt allen Mitgliedern Termine zu erstellen und zu bearbeiten</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-calendar-sharing" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Chat-Benachrichtigungen</p>
                    <p class="text-sm text-secondary">Push-Benachrichtigungen für neue Nachrichten</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-chat-notifications" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Finanz-Tracking aktivieren</p>
                    <p class="text-sm text-secondary">Ermöglicht gemeinsame Ausgabenverwaltung</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-finance-tracking">
                    <span class="slider"></span>
                </label>
            </div>
            
            <!-- Data Management -->
            <div class="pt-4 border-t border-border-glass">
                <h3 class="font-semibold text-white mb-4">Datenverwaltung</h3>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button class="btn-secondary flex-1" onclick="window.exportFamilyData()">
                        <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                        Daten exportieren
                    </button>
                    <button class="btn-secondary flex-1 text-red-400 hover:text-red-300" onclick="window.confirmDeleteFamily()">
                        <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i>
                        Familie löschen
                    </button>
                </div>
            </div>
        </div>
    `,HI(n),typeof lucide<"u"&&lucide.createIcons()}function HI(n){["calendar-sharing","chat-notifications","finance-tracking"].forEach(t=>{const r=document.getElementById(`setting-${t}`);r&&r.addEventListener("change",async i=>{await zI(n,t,i.target.checked)})})}async function zI(n,e,t){try{const r=X(L,"families",n);await He(r,{[`settings.${e}`]:t,updatedAt:ae()}),x("Einstellung gespeichert","success")}catch(r){console.error("Error updating setting:",r),x("Fehler beim Speichern der Einstellung","error")}}async function WI(n){const e=document.getElementById("family-statistics");try{const t=K(L,"families",n,"membersData"),i=(await et(t)).size,s=K(L,"families",n,"posts"),l=(await et(s)).size,c=K(L,"families",n,"events"),f=(await et(c)).size;e.innerHTML=`
            ${Io("Mitglieder",i,"users","text-blue-400")}
            ${Io("Beiträge",l,"message-square","text-green-400")}
            ${Io("Termine",f,"calendar","text-purple-400")}
        `,typeof lucide<"u"&&lucide.createIcons()}catch(t){console.error("Error loading statistics:",t),e.innerHTML='<p class="text-red-400">Fehler beim Laden der Statistiken.</p>'}}function Io(n,e,t,r){return`
        <div class="glass-list-item p-4 rounded-lg text-center">
            <i data-lucide="${t}" class="w-8 h-8 ${r} mx-auto mb-2"></i>
            <p class="text-3xl font-bold text-white mb-1">${e}</p>
            <p class="text-sm text-secondary">${n}</p>
        </div>
    `}function GI(){Je(`
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neue Familie erstellen</h2>
            <form id="create-family-form" class="space-y-4">
                <div>
                    <label for="family-name" class="form-label">Familienname</label>
                    <input type="text" id="family-name" class="form-input" required placeholder="z.B. Familie Müller">
                </div>
                <div>
                    <label class="form-label">Information</label>
                    <p class="text-sm text-secondary">Du wirst automatisch als Administrator der neuen Familie hinzugefügt.</p>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-family-submit" class="cta-primary-glow">
                        <span class="btn-text">Familie erstellen</span>
                    </button>
                </div>
            </form>
        </div>
    `,"modal-create-family"),document.getElementById("create-family-form").addEventListener("submit",KI)}async function KI(n){n.preventDefault();const e=document.getElementById("create-family-submit");ze(e);const{currentUser:t,currentUserData:r}=B(),i=document.getElementById("family-name").value.trim();if(!i){x("Bitte gib einen Familiennamen ein","error"),ce(e);return}try{const s=ks(L),a=X(K(L,"families")),l=a.id;s.set(a,{name:i,createdAt:ae(),ownerId:t.uid,settings:{"calendar-sharing":!0,"chat-notifications":!0,"finance-tracking":!1}});const c=X(L,"families",l,"membersData",t.uid);s.set(c,{uid:t.uid,name:r.name||"Unbekannt",email:t.email,role:"Admin",joinedAt:ae(),points:0,photoURL:r.photoURL||null});const d=X(L,"users",t.uid);s.update(d,{familyId:l}),await s.commit(),x("Familie erfolgreich erstellt!","success"),ve("modal-create-family"),setTimeout(()=>{window.location.reload()},1e3)}catch(s){console.error("Error creating family:",s),x("Fehler beim Erstellen der Familie","error")}finally{ce(e)}}function QI(){const{currentFamilyId:n}=B();if(!n){x("Keine Familie geladen","error");return}const e=X(L,"families",n);Yn(e).then(t=>{if(t.exists()){const r=t.data();XI(r,n)}else x("Familie nicht gefunden","error")}).catch(t=>{console.error("Error loading family:",t),x("Fehler beim Laden der Familie","error")})}function XI(n,e){const t=`
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Familie bearbeiten</h2>
            <form id="edit-family-form" class="space-y-4">
                <div>
                    <label for="edit-family-name" class="form-label">Familienname</label>
                    <input type="text" id="edit-family-name" class="form-input" required value="${n.name||""}">
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="edit-family-submit" class="cta-primary-glow">
                        <span class="btn-text">Speichern</span>
                    </button>
                </div>
            </form>
        </div>
    `;Je(t,"modal-edit-family"),document.getElementById("edit-family-form").addEventListener("submit",r=>{r.preventDefault(),YI(e)})}async function YI(n){const e=document.getElementById("edit-family-submit");ze(e);const t=document.getElementById("edit-family-name").value.trim();if(!t){x("Bitte gib einen Familiennamen ein","error"),ce(e);return}try{const r=X(L,"families",n);await He(r,{name:t,updatedAt:ae()}),x("Familie aktualisiert!","success"),ve("modal-edit-family")}catch(r){console.error("Error updating family:",r),x("Fehler beim Aktualisieren der Familie","error")}finally{ce(e)}}function JI(){Je(`
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Mitglied einladen</h2>
            <form id="invite-member-form" class="space-y-4">
                <div>
                    <label for="invite-email" class="form-label">E-Mail-Adresse</label>
                    <input type="email" id="invite-email" class="form-input" required placeholder="email@beispiel.de">
                </div>
                <div>
                    <label class="form-label">Information</label>
                    <p class="text-sm text-secondary">Die eingeladene Person erhält eine E-Mail mit einem Link zum Beitritt.</p>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="invite-member-submit" class="cta-primary-glow">
                        <span class="btn-text">Einladung senden</span>
                    </button>
                </div>
            </form>
        </div>
    `,"modal-invite-member"),document.getElementById("invite-member-form").addEventListener("submit",ZI)}async function ZI(n){n.preventDefault();const e=document.getElementById("invite-member-submit");ze(e);const{currentFamilyId:t,currentUserData:r}=B(),i=document.getElementById("invite-email").value.trim();if(!i){x("Bitte gib eine E-Mail-Adresse ein","error"),ce(e);return}try{const s=K(L,"invites");await addDoc(s,{familyId:t,toEmail:i,fromName:r.name||"Ein Familienmitglied",status:"pending",createdAt:ae()}),x(`Einladung an ${i} gesendet!`,"success"),ve("modal-invite-member")}catch(s){console.error("Error sending invite:",s),x("Fehler beim Senden der Einladung","error")}finally{ce(e)}}window.openEditMemberModal=async function(n,e){try{const t=X(L,"families",e,"membersData",n),r=await Yn(t);if(!r.exists()){x("Mitglied nicht gefunden","error");return}const i=r.data(),s=`
            <div class="modal-content glass-premium max-w-md w-full">
                <h2 class="text-xl font-bold text-gradient mb-6">Mitglied bearbeiten</h2>
                <form id="edit-member-form" class="space-y-4">
                    <div>
                        <label class="form-label">Name</label>
                        <p class="text-white">${i.name||"Unbekannt"}</p>
                    </div>
                    <div>
                        <label for="member-role" class="form-label">Rolle</label>
                        <select id="member-role" class="form-input">
                            <option value="Mitglied" ${i.role!=="Admin"?"selected":""}>Mitglied</option>
                            <option value="Admin" ${i.role==="Admin"?"selected":""}>Admin</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-3 pt-6 border-t border-border-glass">
                        <button type="submit" id="edit-member-submit" class="cta-primary-glow">
                            <span class="btn-text">Speichern</span>
                        </button>
                        <button type="button" class="btn-secondary text-red-400" onclick="window.confirmRemoveMember('${n}', '${e}')">
                            Aus Familie entfernen
                        </button>
                        <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    </div>
                </form>
            </div>
        `;Je(s,"modal-edit-member"),document.getElementById("edit-member-form").addEventListener("submit",a=>{a.preventDefault(),eT(n,e)})}catch(t){console.error("Error loading member:",t),x("Fehler beim Laden des Mitglieds","error")}};async function eT(n,e){const t=document.getElementById("edit-member-submit");ze(t);const r=document.getElementById("member-role").value;try{const i=X(L,"families",e,"membersData",n);await He(i,{role:r}),x("Mitglied aktualisiert!","success"),ve("modal-edit-member")}catch(i){console.error("Error updating member:",i),x("Fehler beim Aktualisieren des Mitglieds","error")}finally{ce(t)}}window.confirmRemoveMember=async function(n,e){if(confirm("Möchtest du dieses Mitglied wirklich aus der Familie entfernen?"))try{const t=X(L,"families",e,"membersData",n);await ti(t),x("Mitglied entfernt","success"),ve("modal-edit-member")}catch(t){console.error("Error removing member:",t),x("Fehler beim Entfernen des Mitglieds","error")}};window.exportFamilyData=async function(){const{currentFamilyId:n}=B();if(!n){x("Keine Familie geladen","error");return}x("Export wird vorbereitet...","info");try{x("Export-Funktion wird implementiert","info")}catch(e){console.error("Error exporting data:",e),x("Fehler beim Exportieren der Daten","error")}};window.confirmDeleteFamily=async function(){const{currentFamilyId:n}=B();if(!n){x("Keine Familie geladen","error");return}if(prompt('Bist du sicher? Gib "LÖSCHEN" ein, um die Familie permanent zu löschen:')==="LÖSCHEN")try{x("Diese Funktion erfordert Admin-Berechtigung und Cloud Function","error")}catch(t){console.error("Error deleting family:",t),x("Fehler beim Löschen der Familie","error")}};function Ls(n,e){return`
        <div class="flex flex-col items-center justify-center p-12 text-center">
            <i data-lucide="info" class="w-16 h-16 text-secondary opacity-30 mb-4"></i>
            <h3 class="text-lg font-semibold text-white mb-2">${n}</h3>
            <p class="text-secondary">${e}</p>
        </div>
    `}const Du={login:{templateId:"template-login",init:xI,title:"Anmelden",icon:"log-in"},feed:{templateId:"template-feed",init:Vb,title:"Feed",icon:"home"},chat:{templateId:"template-chat",init:_I,title:"Chat",icon:"message-circle"},calendar:{templateId:"template-calendar",init:Yb,title:"Kalender",icon:"calendar-days"},pinnwand:{templateId:"template-pinnwand",init:qb,title:"Pinnwand",icon:"kanban-square"},wishlist:{templateId:"template-wishlist",init:gI,title:"Wunschlisten",icon:"gift"},challenges:{templateId:"template-challenges",init:EI,title:"Challenges",icon:"award"},settings:{templateId:"template-settings",init:aI,title:"Einstellungen",icon:"settings"},gallery:{templateId:"template-gallery",init:tI,title:"Galerie",icon:"image"},finanzen:{templateId:"template-finanzen",init:RI,title:"Finanzen",icon:"piggy-bank"},chronik:{templateId:"template-chronik",init:PI,title:"Chronik",icon:"history"},"family-management":{templateId:"template-family-management",init:MI,title:"Familienverwaltung",icon:"users-cog"},menu:{templateId:"template-menu",init:null,title:"Mehr",icon:"layout-grid"}};let To=null;const Ao=document.getElementById("app-content"),tT=document.getElementById("auth-container"),Ar={};function nT(){Object.keys(Ar).forEach(n=>{typeof Ar[n]=="function"&&(Ar[n](),Ar[n]=null,console.log(`Listener für '${n}' wurde bereinigt.`))})}async function Hr(n,e={}){const t=Du[n]?n:"feed";if(To===t)return;nT(),To=t;const r=Du[t];if(!r)return console.error(`Keine Route für '${t}' gefunden.`),Hr("feed");try{rT(r.title,r.icon),iT(t);const i=document.getElementById(r.templateId);if(!i||i.tagName!=="TEMPLATE")throw new Error(`Template-Tag #${r.templateId} nicht gefunden.`);const s=t==="login"?tT:Ao;if(s)s.innerHTML=i.innerHTML;else{console.error(`Target container for page '${t}' not found.`);return}typeof r.init=="function"&&r.init(Ar,s,e),typeof lucide<"u"&&lucide.createIcons()}catch(i){console.error(`Fehler beim Navigieren zu ${t}:`,i),Ao&&(Ao.innerHTML=`<p>Seite '${t}' konnte nicht geladen werden.</p>`),To=null}}function rT(n,e){const t=document.getElementById("header-title"),r=document.getElementById("header-icon");t&&(t.textContent=n),r&&typeof lucide<"u"&&(r.setAttribute("data-lucide",e),lucide.createIcons({nodes:[r]}))}function iT(n){document.querySelectorAll("#bottom-nav .nav-item").forEach(r=>{r.classList.toggle("active",r.dataset.page===n)}),document.querySelectorAll(".nav-item-desktop").forEach(r=>{r.classList.toggle("active",r.dataset.page===n)})}const Nu=document.getElementById("app-shell"),sT=document.getElementById("app-loader"),oT=document.getElementById("auth-container");let Pf=!1;document.addEventListener("click",n=>{if(!Pf)return;const e=n.target.closest("[data-page]");if(e){n.preventDefault();const t=e.getAttribute("data-page");t&&Hr(t)}});wb(async n=>{sT.classList.add("hidden"),n&&n.authUser?(oT.innerHTML="",Nu.classList.remove("hidden"),await Hr("feed")):(Nu.classList.add("hidden"),await Hr("login")),Pf=!0});window.handleLogout=async()=>{console.log("Logout wird ausgeführt..."),await Eb()};window.createJagerFamily=async()=>{const n="d4VNKIKw0oNjxV6ic4iIv2jWuEb2",e="Jäger",t="Benutzer Jäger",r="jaeger@example.com";console.log(`Erstelle Familie '${e}' für Benutzer ${n}...`);try{const i=ks(L),s=X(K(L,"families")),a=s.id;i.set(s,{name:e,createdAt:ae(),ownerId:n}),console.log(`Familien-Dokument wird mit ID ${a} erstellt.`);const l=X(L,"families",a,"membersData",n);i.set(l,{uid:n,name:t,email:r,role:"Admin",joinedAt:ae(),points:0,photoURL:null}),console.log(`Mitglieds-Dokument für ${t} wird in Familie ${a} erstellt.`);const c=X(L,"users",n);i.update(c,{familyId:a}),console.log(`Benutzer-Dokument ${n} wird aktualisiert, um auf Familie ${a} zu verweisen.`),await i.commit(),console.log("ERFOLG! Familie Jäger wurde erstellt und dem Benutzer zugewiesen."),alert("Familie Jäger wurde erfolgreich erstellt!")}catch(i){console.error("FEHLER beim Erstellen der Familie:",i),alert("Ein Fehler ist aufgetreten. Siehe Konsole für Details.")}};
