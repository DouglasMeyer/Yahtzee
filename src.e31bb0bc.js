// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"yahtzee.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const sum = (a, b) => a + b;

class Yahtzee {
  constructor() {
    _defineProperty(this, "assignments", {
      Ones: null,
      Twos: null,
      Threes: null,
      Fours: null,
      Fives: null,
      Sixes: null,
      "Three of a Kind": null,
      "Four of a Kind": null,
      "Full House": null,
      "Small Straight": null,
      "Large Straight": null,
      Chance: null,
      Yahtzee: null
    });

    _defineProperty(this, "dice", [null, null, null, null, null]);

    _defineProperty(this, "remainingRolls", 3);
  }

  roll() {
    if (this.remainingRolls === 0) return;

    for (var _len = arguments.length, indexes = new Array(_len), _key = 0; _key < _len; _key++) {
      indexes[_key] = arguments[_key];
    }

    for (const index of indexes) {
      this.dice[index] = Math.floor(Math.random() * 6) + 1;
    }

    this.remainingRolls--;
  }

  assign(category) {
    if (this.assignments[category] || this.dice[0] === null) return;
    this.assignments[category] = this.dice;
    this.dice = new Array(5).fill(null);
    this.remainingRolls = 3;
    delete this._score;
    delete this._upperBonus;
    delete this._additionalYahtzees;
    delete this._gameOver;
  }

  get gameOver() {
    if (this._gameOver !== undefined) return this._gameOver;
    this._gameOver = Object.values(this.assignments).every(dice => dice !== null);
    return this._gameOver;
  }

  get upperBonus() {
    if (this._upperBonus !== undefined) return this._upperBonus;
    this.score;
    return this._upperBonus;
  }

  get additionalYahtzees() {
    if (this._additionalYahtzees !== undefined) return this._additionalYahtzees;
    this.score;
    return this._additionalYahtzees;
  }

  get score() {
    if (this._score !== undefined) return this._score;
    let upper = 0;
    let lower = 0;
    this._additionalYahtzees = 0;
    const isAYahtzee = Yahtzee.categoryScoring["Yahtzee"];
    const hasYahtzee = this.assignments["Yahtzee"] && isAYahtzee(this.assignments["Yahtzee"]) !== 0;
    Object.entries(this.assignments).forEach((_ref, index) => {
      let [category, dice] = _ref;
      if (!dice) return;
      if (hasYahtzee && category !== "Yahtzee" && isAYahtzee(dice)) this._additionalYahtzees++;
      const score = Yahtzee.categoryScoring[category](dice);
      if (index < 6) upper += score;else lower += score;
    });
    this._upperBonus = upper >= 63 ? 35 : 0;
    this._score = upper + this._upperBonus + lower + this._additionalYahtzees * 100;
    return this._score;
  }

}

_defineProperty(Yahtzee, "categoryScoring", {
  Ones: rolls => rolls.filter(roll => roll === 1).reduce(sum, 0),
  Twos: rolls => rolls.filter(roll => roll === 2).reduce(sum, 0),
  Threes: rolls => rolls.filter(roll => roll === 3).reduce(sum, 0),
  Fours: rolls => rolls.filter(roll => roll === 4).reduce(sum, 0),
  Fives: rolls => rolls.filter(roll => roll === 5).reduce(sum, 0),
  Sixes: rolls => rolls.filter(roll => roll === 6).reduce(sum, 0),
  "Three of a Kind": rolls => {
    return rolls.slice(0, -2).some((el, index) => rolls.filter(e => e === el).length >= 3) ? rolls.reduce(sum, 0) : 0;
  },
  "Four of a Kind": rolls => {
    return rolls.slice(0, -3).some((el, index) => rolls.filter(e => e === el).length >= 4) ? rolls.reduce(sum, 0) : 0;
  },
  "Full House": rolls => {
    const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i).length;
    if (uniqueRolls !== 2) return 0;
    const matchedRolls = rolls.filter(roll => roll === rolls[0]).length;
    if (matchedRolls === 2 || matchedRolls === 3) return 25;
    return 0;
  },
  "Small Straight": rolls => {
    const sortedRolls = [...rolls].sort();
    const roleDeltas = sortedRolls.reduce((acc, now, index) => [...(Array.isArray(acc) ? acc : []), now - sortedRolls[index - 1]]);
    const oneDeltaCount = roleDeltas.filter(delta => delta === 1).length;
    return oneDeltaCount >= 3 ? 30 : 0;
  },
  "Large Straight": rolls => {
    const sortedRolls = [...rolls].sort();
    const roleDeltas = sortedRolls.reduce((acc, now, index) => [...(Array.isArray(acc) ? acc : []), now - sortedRolls[index - 1]]);
    const oneDeltaCount = roleDeltas.filter(delta => delta === 1).length;
    return oneDeltaCount === 4 ? 40 : 0;
  },
  Chance: rolls => rolls.reduce(sum, 0),
  Yahtzee: rolls => {
    const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i);
    return uniqueRolls.length === 1 && uniqueRolls[0] !== null ? 50 : 0;
  }
});

var _default = Yahtzee;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _yahtzee = _interopRequireDefault(require("./yahtzee"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Icon framework
// ==============
// {
//   const img = document.querySelector("img");
//   function drawCanvases() {
//     for (let canvas of document.querySelectorAll("canvas[data-size]")) {
//       canvas.width = canvas.height = canvas.dataset.size;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
//   }
//   img.onload = drawCanvases;
//   if (img.complete && img.naturalHeight) drawCanvases();
// }
// new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
// navigator.onLine === false
// window.addEventListener("offline", (e) => {});
// window.addEventListener("online", (e) => {});
// navigator.serviceWorker.register(
//   new URL("service-worker.js", import.meta.url),
//   { type: "module" }
// );
// navigator.serviceWorker.register("./service-worker.js");
customElements.define("yahtzee-game", class extends HTMLElement {
  // constructor() {
  //   super();
  //   // const shadowRoot =
  //   // this.attachShadow({ mode: "open" });
  // }
  connectedCallback() {
    const categories = this.querySelector(".Categories");
    [...categories.querySelectorAll("[data-category]")].forEach(categoryEl => {
      const button = categoryEl.querySelector("button");
      button.dataset.category = categoryEl.dataset.category;
    });
    categories.addEventListener("click", event => {
      const category = event.target.dataset.category;
      if (!category) return;
      this.yahtzee.assign(category);
      this.healdDice = [false, false, false, false, false];
      this.render();
    });
    this.querySelector(".Dice").addEventListener("click", event => {
      let die = event.target;
      if (die.tagName !== "YAHTZEE-DIE") die = die.parentElement;
      if (die.tagName !== "YAHTZEE-DIE") return;
      const index = die.dataset.index;
      if (this.yahtzee.dice[index] === null) return;
      this.healdDice[index] = !this.healdDice[index];
      die.toggleAttribute("heald", this.healdDice[index]);
    });
    this.querySelector(".Roll").addEventListener("click", event => {
      if (this.yahtzee.gameOver) {
        this.startGame();
        return;
      }

      if (!this.yahtzee.remainingRolls) return;
      this.yahtzee.roll(...this.healdDice.map((heald, index) => heald ? false : index).filter(n => n !== false));
      this.render();
    });
    this.startGame();
  }

  startGame() {
    // FIXME: recover from storage
    window.yahtzee = this.yahtzee = new _yahtzee.default();
    this.healdDice = [false, false, false, false, false];
    this.render();
  }

  render() {
    [...this.querySelectorAll(".Categories > [data-category]")].forEach(categoryEl => {
      const category = categoryEl.dataset.category;
      const rolls = this.yahtzee.assignments[category];
      const button = categoryEl.querySelector("button");
      const span = categoryEl.querySelector("span");
      button.disabled = true;

      if (rolls) {
        span.textContent = _yahtzee.default.categoryScoring[category](rolls);
      } else if (this.yahtzee.dice[0] !== null) {
        button.disabled = false;
        span.textContent = "-";
      }
    });
    const dice = [...this.querySelectorAll(".Dice > yahtzee-die")];
    dice.forEach((die, dieIndex) => {
      die.toggleAttribute("heald", this.healdDice[dieIndex]);

      if (this.yahtzee.dice[dieIndex] === null) {
        die.removeAttribute("face");
      } else if (!this.healdDice[dieIndex]) {
        die.setAttribute("face", this.yahtzee.dice[dieIndex]);
      }
    });
    const roll = this.querySelector(".Roll");

    if (this.yahtzee.gameOver) {
      roll.textContent = "New Game";
      roll.disabled = false;
    } else {
      roll.textContent = "Roll - ".concat(this.yahtzee.remainingRolls);
      roll.disabled = this.yahtzee.remainingRolls === 0;
    }

    this.querySelector(".UpperBonus > span:last-child").textContent = this.yahtzee.upperBonus || "-";

    if (this.yahtzee.additionalYahtzees) {
      const yahtzeeCategorySpan = this.querySelector('.Categories > [data-category="Yahtzee"] > span');
      yahtzeeCategorySpan.textContent += " + 100";

      if (this.yahtzee.additionalYahtzees > 1) {
        yahtzeeCategorySpan.textContent += " x".concat(this.yahtzee.additionalYahtzees);
      }
    }

    this.querySelector(".Score").textContent = "Total - ".concat(this.yahtzee.score);
  }

});
customElements.define("yahtzee-die", class extends HTMLElement {
  static get observedAttributes() {
    return ["face", "heald"];
  }

  slowSpin() {
    // const style = window.getComputedStyle(this, null);
    // const transformation =
    //   style.getPropertyValue("-webkit-transform") ||
    //   style.getPropertyPriority("-moz-transform") ||
    //   style.getPropertyPriority("-ms-transform") ||
    //   style.getPropertyPriority("-o-transform") ||
    //   style.getPropertyPriority("transform");
    // let x, y, z, angle;
    // if (!transformation || !transformation.startsWith("matrix3d(")) {
    //   x = Math.random() - 0.5;
    //   y = Math.random() - 0.5;
    //   z = Math.random() - 0.5;
    //   angle = 0; // Math.floor(Math.random() * 360);
    // } else {
    //   const [a, b, c, _a, d, e, f, _b, g, h, i, _c, _j, _k, _l, _d] =
    //     transformation.slice(9, -1).split(",").map(parseFloat);
    //   x = h - f;
    //   y = c - g;
    //   z = d - b;
    //   angle = (Math.atan((a + e + h - 1) / 2) / Math.PI) * 180;
    // }
    // this.animate(
    //   {
    //     transform: `rotate3d(${x}, ${y}, ${z}, ${angle + 360}deg)`,
    //   },
    //   {
    //     duration: 10000 + Math.random() * 3000,
    //     iterations: Infinity,
    //   }
    // );
    this.getAnimations().forEach(animation => {
      animation.commitStyles();
      animation.cancel();
    });
    const rotX = Math.floor(Math.random() * 360);
    const rotY = Math.floor(Math.random() * 360);
    const rotZ = Math.floor(Math.random() * 360); // this.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;

    this.slowSpinAnimation = this.animate([{
      transform: "rotateX(".concat(rotX, "deg) rotateY(").concat(rotY, "deg) rotateZ(").concat(rotZ, "deg)")
    }, {
      transform: "rotateX(".concat(rotX + 360 * (Math.random() > 0.5 ? 1 : -1), "deg) rotateY(").concat(rotY + 360 * (Math.random() > 0.5 ? 1 : -1), "deg) rotateZ(").concat(rotZ + 360 * (Math.random() > 0.5 ? 1 : -1), "deg)")
    }], {
      duration: 10000 + Math.random() * 3000,
      iterations: Infinity
    });
  }

  connectedCallback() {
    // console.log("connectedCallback", this.isConnected);
    this.innerHTML = "<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>";
    if (!this.slowSpinAnimation) this.slowSpin();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("attributeChangedCallback", name, oldValue, newValue);
    const face = this.getAttribute("face");
    const heald = this.hasAttribute("heald"); // console.log({ face, heald });

    if (face === null) return; // this.slowSpin();

    let rotX = 0,
        rotY = 0,
        rotZ = 0;

    if (face === "1") {// noop
    } else if (face === "2") {
      rotY = 180;
    } else if (face === "3") {
      rotY = -90;
    } else if (face === "4") {
      rotY = 90;
    } else if (face === "5") {
      rotX = -90;
    } else if (face === "6") {
      rotX = 90;
    }

    if (!heald) {
      rotX += (Math.random() * 6 + 5) * (Math.random() > 0.5 ? 1 : -1);
      rotY += (Math.random() * 6 + 5) * (Math.random() > 0.5 ? 1 : -1);
      rotZ += (Math.random() * 6 + 5) * (Math.random() > 0.5 ? 1 : -1);
    } // this.getAnimations().forEach((animation) => {
    //   animation.commitStyles();
    //   // debugger;
    //   animation.cancel();
    //   // debugger;
    // });


    this.slowSpinAnimation.cancel();
    let delay = 0;

    if (name !== "heald") {
      delay = 300 + Math.random() * 700;
      this.animate({
        transform: "rotateX(".concat(rotX - 100, "deg) rotateY(").concat(rotY - 100, "deg) rotateZ(").concat(rotZ - 500, "deg)")
      }, {
        duration: delay,
        easing: "linear",
        fill: "forwards"
      });
    }

    this.animate({
      transform: "rotateX(".concat(rotX, "deg) rotateY(").concat(rotY, "deg) rotateZ(").concat(rotZ, "deg)")
    }, {
      delay,
      duration: name === "heald" ? 300 : 1000 + Math.random() * 1000,
      easing: "ease-out",
      fill: "forwards"
    });
  }

});
},{"./yahtzee":"yahtzee.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65255" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map