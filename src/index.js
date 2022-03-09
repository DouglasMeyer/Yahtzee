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
        const el = document.createElement("div");
        el.dataset.category = category;
        el.innerHTML = `${category} <span>-</span>`;
        categories.appendChild(el);
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
        if (this.yahtzee.dice[index] === null) return;
        this.healdDice[index] = !this.healdDice[index];
        die.toggleAttribute("heald", this.healdDice[index]);
      });
      this.querySelector(".Roll").addEventListener("click", (event) => {
        if (this.yahtzee.gameOver) {
          this.startGame();
          return;
        }
        if (!this.yahtzee.remainingRolls) return;
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
      [...this.querySelectorAll(".Categories > *")].forEach((categoryEl) => {
        const category = categoryEl.dataset.category;
        categoryEl.textContent = category;
        const rolls = this.yahtzee.assignments[category];
        const button = document.createElement("button");
        button.textContent = "-";
        button.disabled = true;
        button.dataset.category = category;
        if (rolls) {
          button.textContent = Yahtzee.categoryScoring[category](rolls);
        } else if (this.yahtzee.dice[0] !== null) {
          button.disabled = false;
          button.textContent = Yahtzee.categoryScoring[category](
            this.yahtzee.dice
          );
        }
        categoryEl.appendChild(button);
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
        roll.textContent = `Roll - ${this.yahtzee.remainingRolls}`;
        roll.disabled = this.yahtzee.remainingRolls === 0;
      }
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

      this.getAnimations().forEach((animation) => {
        animation.commitStyles();
        animation.cancel();
      });
      const rotX = Math.floor(Math.random() * 360);
      const rotY = Math.floor(Math.random() * 360);
      const rotZ = Math.floor(Math.random() * 360);
      this.slowSpinAnimation = this.animate(
        [
          {
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          },
          {
            transform: `rotateX(${
              rotX + 360 * (Math.random() > 0.5 ? 1 : -1)
            }deg) rotateY(${
              rotY + 360 * (Math.random() > 0.5 ? 1 : -1)
            }deg) rotateZ(${rotZ + 360 * (Math.random() > 0.5 ? 1 : -1)}deg)`,
          },
        ],
        {
          duration: 10000 + Math.random() * 3000,
          iterations: Infinity,
        }
      );
    }
    connectedCallback() {
      this.innerHTML = `<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>`;

      if (!this.slowSpinAnimation) this.slowSpin();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const face = this.getAttribute("face");
      const heald = this.hasAttribute("heald");
      if (face === null) return;

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

      this.slowSpinAnimation.cancel();
      let delay = 0;
      if (name !== "heald") {
        delay = 300 + Math.random() * 700;
        this.animate(
          {
            transform: `rotateX(${rotX - 100}deg) rotateY(${
              rotY - 100
            }deg) rotateZ(${rotZ - 500}deg)`,
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
          duration: name === "heald" ? 300 : 1000 + Math.random() * 1000,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }
);
