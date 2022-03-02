import Yahtzee from "./yahtzee";

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


customElements.define(
  "yahtzee-game",
  class extends HTMLElement {
    connectedCallback() {
      const categories = this.querySelector(".Categories");
      Object.keys(Yahtzee.categoryScoring).forEach((category) => {
        const button = document.createElement("button");
        button.textContent = button.dataset.category = category;
        categories.appendChild(button);
      });
      categories.addEventListener("click", (event) => {
        const category = event.target.dataset.category;
        if (!category) return;
        this.yahtzee.assign(category);
        this.healdDice = [false, false, false, false, false];
        this.render();
      });
      this.querySelector(".Dice").addEventListener("click", (event) => {
        let die = event.target;
        if (die.tagName !== "YAHTZEE-DIE") die = die.parentElement;
        if (die.tagName !== "YAHTZEE-DIE") return;
        const index = die.dataset.index;
        this.healdDice[index] = !this.healdDice[index];
        die.toggleAttribute("heald", this.healdDice[index]);
      });
      this.querySelector(".Roll").addEventListener("click", (event) => {
        this.yahtzee.roll(
          ...this.healdDice
            .map((heald, index) => (heald ? false : index))
            .filter((n) => n !== false)
        );
        this.render();
      });
      this.startGame();
    }
    startGame() {
      window.yahtzee = this.yahtzee = new Yahtzee();
      this.healdDice = [false, false, false, false, false];
      this.render();
    }
    render() {
      [...this.querySelectorAll(".Categories > button")].forEach(
        (categoryEl) => {
          const category = categoryEl.dataset.category;
          categoryEl.textContent = category;
          const rolls = this.yahtzee.assignments[category];
          categoryEl.disabled = Boolean(rolls);
          if (!rolls) return;
          categoryEl.textContent +=
            " - " + Yahtzee.categoryScoring[category](rolls);
        }
      );
      const dice = [...this.querySelectorAll(".Dice > yahtzee-die")];
      dice.forEach((die, dieIndex) => {
        die.toggleAttribute("heald", this.healdDice[dieIndex]);
        if (!this.healdDice[dieIndex])
          die.setAttribute("face", this.yahtzee.dice[dieIndex]);
      });
      this.querySelector(".RemainingRolls").textContent =
        this.yahtzee.remainingRolls;
      this.querySelector(".UpperBonus").textContent = this.yahtzee.upperBonus;
      this.querySelector(".AdditionalYahtzees").textContent =
        this.yahtzee.additionalYahtzees;
      this.querySelector(".Score").textContent = this.yahtzee.score;
    }
  }
);

customElements.define(
  "yahtzee-die",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["face", "heald"];
    }
    slowSpin() {
      this.getAnimations()[0]?.commitStyles();
      this.getAnimations().forEach((a) => a.cancel());
      const style = window.getComputedStyle(this, null);
      const transformation =
        style.getPropertyValue("-webkit-transform") ||
        style.getPropertyPriority("-moz-transform") ||
        style.getPropertyPriority("-ms-transform") ||
        style.getPropertyPriority("-o-transform") ||
        style.getPropertyPriority("transform");
      let x, y, z, angle;
      if (!transformation || !transformation.startsWith("matrix3d(")) {
        x = Math.random() - 0.5;
        y = Math.random() - 0.5;
        z = Math.random() - 0.5;
        angle = Math.floor(Math.random() * 360);
      } else {
        const [a, b, c, _a, d, e, f, _b, g, h, i, _c, _j, _k, _l, _d] =
          transformation.slice(9, -1).split(",").map(parseFloat);
        x = h - f;
        y = c - g;
        z = d - b;
        angle = Math.floor(Math.atan((a + e + h - 1) / 2) / Math.PI) * 180;
      }

      this.animate(
        {
          transform: `rotate3d(${x}, ${y}, ${z}, ${angle + 360}deg)`,
        },
        {
          duration: 10000 + Math.random() * 3000,
          iterations: Infinity,
        }
      );
    }
    connectedCallback() {
      this.innerHTML = `<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>`;

      this.slowSpin();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      console.log("attributeChangedCallback", name, oldValue, newValue);
      const face = this.getAttribute("face");
      const heald = this.hasAttribute("heald");
      if (face === "null") return this.slowSpin();

      let rotX = 0,
        rotY = 0,
        rotZ = 0;

      if (face === "1") {
        // noop
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
      }

      let delay = 0;
      if (name !== "heald") {
        delay = 1000 + Math.random() * 1000;
        this.animate(
          {
            transform: `rotateX(${rotX * -10}deg) rotateY(${
              rotY * -10
            }deg) rotateZ(${rotZ * -10}deg)`,
          },
          {
            duration: delay,
            easing: "linear",
            fill: "forwards",
          }
        );
      }
      this.animate(
        {
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        },
        {
          delay,
          duration: name === "heald" ? 300 : 2000 + Math.random() * 1000,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }
);
