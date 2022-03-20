parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ylPE":[function(require,module,exports) {
"use strict";function e(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;const t=(e,t)=>e+t;class s{constructor(){e(this,"assignments",{Ones:null,Twos:null,Threes:null,Fours:null,Fives:null,Sixes:null,"Three of a Kind":null,"Four of a Kind":null,"Full House":null,"Small Straight":null,"Large Straight":null,Chance:null,Yahtzee:null}),e(this,"dice",[null,null,null,null,null]),e(this,"remainingRolls",3)}roll(){if(0!==this.remainingRolls){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];for(const e of t)this.dice[e]=Math.floor(6*Math.random())+1;this.remainingRolls--}}assign(e){this.assignments[e]||null===this.dice[0]||(this.assignments[e]=this.dice,this.dice=new Array(5).fill(null),this.remainingRolls=3,delete this._score,delete this._upperBonus,delete this._additionalYahtzees,delete this._gameOver)}get gameOver(){return void 0!==this._gameOver?this._gameOver:(this._gameOver=Object.values(this.assignments).every(e=>null!==e),this._gameOver)}get upperBonus(){return void 0!==this._upperBonus?this._upperBonus:(this.score,this._upperBonus)}get additionalYahtzees(){return void 0!==this._additionalYahtzees?this._additionalYahtzees:(this.score,this._additionalYahtzees)}get score(){if(void 0!==this._score)return this._score;let e=0,t=0;this._additionalYahtzees=0;const i=s.categoryScoring.Yahtzee,r=this.assignments.Yahtzee&&0!==i(this.assignments.Yahtzee);return Object.entries(this.assignments).forEach((n,l)=>{let[a,o]=n;if(!o)return;r&&"Yahtzee"!==a&&i(o)&&this._additionalYahtzees++;const u=s.categoryScoring[a](o);l<6?e+=u:t+=u}),this._upperBonus=e>=63?35:0,this._score=e+this._upperBonus+t+100*this._additionalYahtzees,this._score}}e(s,"categoryScoring",{Ones:e=>e.filter(e=>1===e).reduce(t,0),Twos:e=>e.filter(e=>2===e).reduce(t,0),Threes:e=>e.filter(e=>3===e).reduce(t,0),Fours:e=>e.filter(e=>4===e).reduce(t,0),Fives:e=>e.filter(e=>5===e).reduce(t,0),Sixes:e=>e.filter(e=>6===e).reduce(t,0),"Three of a Kind":e=>e.slice(0,-2).some((t,s)=>e.filter(e=>e===t).length>=3)?e.reduce(t,0):0,"Four of a Kind":e=>e.slice(0,-3).some((t,s)=>e.filter(e=>e===t).length>=4)?e.reduce(t,0):0,"Full House":e=>{if(2!==e.filter((e,t,s)=>s.indexOf(e)===t).length)return 0;const t=e.filter(t=>t===e[0]).length;return 2===t||3===t?25:0},"Small Straight":e=>{const t=[...e].sort();return t.reduce((e,s,i)=>[...Array.isArray(e)?e:[],s-t[i-1]]).filter(e=>1===e).length>=3?30:0},"Large Straight":e=>{const t=[...e].sort();return 4===t.reduce((e,s,i)=>[...Array.isArray(e)?e:[],s-t[i-1]]).filter(e=>1===e).length?40:0},Chance:e=>e.reduce(t,0),Yahtzee:e=>{const t=e.filter((e,t,s)=>s.indexOf(e)===t);return 1===t.length&&null!==t[0]?50:0}});var i=s;exports.default=i;
},{}],"Focm":[function(require,module,exports) {
"use strict";var t=e(require("./yahtzee"));function e(t){return t&&t.__esModule?t:{default:t}}customElements.define("yahtzee-game",class extends HTMLElement{connectedCallback(){const t=this.querySelector(".Categories");[...t.querySelectorAll("[data-category]")].forEach(t=>{t.querySelector("button").dataset.category=t.dataset.category}),t.addEventListener("click",t=>{const e=t.target.dataset.category;e&&(this.yahtzee.assign(e),this.healdDice=[!1,!1,!1,!1,!1],this.render())}),this.querySelector(".Dice").addEventListener("click",t=>{let e=t.target;if("YAHTZEE-DIE"!==e.tagName&&(e=e.parentElement),"YAHTZEE-DIE"!==e.tagName)return;const a=e.dataset.index;null!==this.yahtzee.dice[a]&&(this.healdDice[a]=!this.healdDice[a],e.toggleAttribute("heald",this.healdDice[a]))}),this.querySelector(".Roll").addEventListener("click",t=>{this.yahtzee.gameOver?this.startGame():this.yahtzee.remainingRolls&&(this.yahtzee.roll(...this.healdDice.map((t,e)=>!t&&e).filter(t=>!1!==t)),this.render())}),this.startGame()}startGame(){window.yahtzee=this.yahtzee=new t.default,this.healdDice=[!1,!1,!1,!1,!1],this.render()}render(){[...this.querySelectorAll(".Categories > [data-category]")].forEach(e=>{const a=e.dataset.category,i=this.yahtzee.assignments[a],n=e.querySelector("button"),o=e.querySelector("span");n.disabled=!0,i?o.textContent=t.default.categoryScoring[a](i):null!==this.yahtzee.dice[0]&&(n.disabled=!1,o.textContent="-")}),[...this.querySelectorAll(".Dice > yahtzee-die")].forEach((t,e)=>{t.toggleAttribute("heald",this.healdDice[e]),null===this.yahtzee.dice[e]?t.removeAttribute("face"):this.healdDice[e]||t.setAttribute("face",this.yahtzee.dice[e])});const e=this.querySelector(".Roll");if(this.yahtzee.gameOver?(e.textContent="New Game",e.disabled=!1):(e.textContent="Roll - ".concat(this.yahtzee.remainingRolls),e.disabled=0===this.yahtzee.remainingRolls),this.querySelector(".UpperBonus > span:last-child").textContent=this.yahtzee.upperBonus||"-",this.yahtzee.additionalYahtzees){const t=this.querySelector('.Categories > [data-category="Yahtzee"] > span');t.textContent+=" + 100",this.yahtzee.additionalYahtzees>1&&(t.textContent+=" x".concat(this.yahtzee.additionalYahtzees))}this.querySelector(".Score").textContent="Total - ".concat(this.yahtzee.score)}}),customElements.define("yahtzee-die",class extends HTMLElement{static get observedAttributes(){return["face","heald"]}slowSpin(){this.getAnimations().forEach(t=>{t.commitStyles(),t.cancel()});const t=Math.floor(360*Math.random()),e=Math.floor(360*Math.random()),a=Math.floor(360*Math.random());this.slowSpinAnimation=this.animate([{transform:"rotateX(".concat(t,"deg) rotateY(").concat(e,"deg) rotateZ(").concat(a,"deg)")},{transform:"rotateX(".concat(t+360*(Math.random()>.5?1:-1),"deg) rotateY(").concat(e+360*(Math.random()>.5?1:-1),"deg) rotateZ(").concat(a+360*(Math.random()>.5?1:-1),"deg)")}],{duration:1e4+3e3*Math.random(),iterations:1/0})}connectedCallback(){this.innerHTML="<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>",this.slowSpinAnimation||this.slowSpin()}attributeChangedCallback(t,e,a){const i=this.getAttribute("face"),n=this.hasAttribute("heald");if(null===i)return;let o=0,r=0,s=0;"1"===i||("2"===i?r=180:"3"===i?r=-90:"4"===i?r=90:"5"===i?o=-90:"6"===i&&(o=90)),n||(o+=(6*Math.random()+5)*(Math.random()>.5?1:-1),r+=(6*Math.random()+5)*(Math.random()>.5?1:-1),s+=(6*Math.random()+5)*(Math.random()>.5?1:-1)),this.slowSpinAnimation.cancel();let h=0;"heald"!==t&&(h=300+700*Math.random(),this.animate({transform:"rotateX(".concat(o-100,"deg) rotateY(").concat(r-100,"deg) rotateZ(").concat(s-500,"deg)")},{duration:h,easing:"linear",fill:"forwards"})),this.animate({transform:"rotateX(".concat(o,"deg) rotateY(").concat(r,"deg) rotateZ(").concat(s,"deg)")},{delay:h,duration:"heald"===t?300:1e3+1e3*Math.random(),easing:"ease-out",fill:"forwards"})}});
},{"./yahtzee":"ylPE"}]},{},["Focm"], null)
//# sourceMappingURL=src.e21a566e.js.map