import React, { useState } from "react";
import { render } from "react-dom";

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

const initBoard = {
  "Family Together": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "what is meeting eachother3": "hello",
  },
  "Family Together2": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "What is Anne st3": "We live on this street",
  },
  "Family Together3": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "What is Anne st3": "We live on this street",
  },
  "Family Together4": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "What is Anne st3": "We live on this street",
  },
  "Family Together5": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "What is Anne st3": "We live on this street",
  },
  "Family Together6": {
    "What is pizza": "We eat this at Nicks",
    "What is Anne st": "We live on this street",
    "What is pizza2": "We eat this at Nicks",
    "What is Anne st2": "We live on this street",
    "What is pizza3": "We eat this at Nicks",
    "What is Anne st3": "We live on this street",
  },
};

const Board = () => {
  const categories = Object.keys(board);
  const questions = Object.values(board);
  const values = [...Array(5).keys()].map((v) => (v + 1) * 100);
  return (
    <div className="Board">
      {categories.map((c) => (
        <div>{c}</div>
      ))}
      {[...Array(5).keys()].map((row) =>
        categories.map(() => <div>${(row + 1) * 100}</div>)
      )}
    </div>
  );
};
const Score = ({ name, score }) => {
  return (
    <div className="Score">
      <div>{name}</div>
      <div>${Math.floor(Math.random() * 50) * 100}</div>
    </div>
  );
};
const storageKey = "Jeopardy_key";
const App = () => {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch (e) {
      console.error(e);
    }
    return {
      board: initBoard,
      players: [
        { name: "Norah", score: 0 },
        { name: "Doug", score: 0 },
        { name: "Katy", score: 0 },
      ],
    };
  });

  return (
    <div>
      <h1>JEOPARDY</h1>
      <Board />
      <div className="Scores">
        <Score name="Norah" />
        <Score name="Dad" />
        <Score name="Mom" />
      </div>
    </div>
  );
};
render(<App />, window.root);
