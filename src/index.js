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
        const index = event.target.dataset.index;
        this.healdDice[index] = !this.healdDice[index];
        this.render();
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
      const dice = [...this.querySelectorAll(".Dice > button")];
      dice.forEach((die, dieIndex) => {
        die.classList.toggle("heald", this.healdDice[dieIndex]);
        die.textContent =
          this.yahtzee.dice[dieIndex] === null
            ? "\xa0"
            : this.yahtzee.dice[dieIndex];
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
