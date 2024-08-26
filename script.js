"use strict";
const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const timerHead = document.querySelector(".timer");
const quote = document.querySelector("p");
const scroeSpan = document.querySelector(".score span");
const messageContainer = document.querySelector(".message-container");
const overlay = document.querySelector(".overlay");
const message = document.querySelector(".message");
let inputLetters = [];
let quoteLetters,
  timer = 60,
  timerCounter,
  score = 0,
  gameRunning = false;

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}
async function renderNewQuote() {
  quote.textContent = "";
  const quoteOnline = await getRandomQuote();
  quoteOnline.split("").forEach((character) => {
    quote.insertAdjacentHTML("beforeend", `<span>${character}</span>`);
  });
  quoteLetters = quote.querySelectorAll("span");
}

const checkLetters = function (e) {
  // checks if the game started or not to start the counter
  if (!gameRunning) {
    gameRunning = true;
    timerCounter = setInterval(function () {
      if (timer > 0) timerHead.textContent = --timer;
      else endGame(false);
    }, 1000);
  }
  if (gameRunning) {
    let winning = true;
    quoteLetters.forEach((quoteChar, index) => {
      if (!inputLetters[index]) {
        quoteChar.classList.remove("incorrect");
        quoteChar.classList.remove("correct");
        winning = false;
      } else if (quoteChar.textContent === inputLetters[index]) {
        quoteChar.classList.add("correct");
        quoteChar.classList.remove("incorrect");
      } else if (quoteChar.textContent !== inputLetters[index]) {
        quoteChar.classList.add("incorrect");
        quoteChar.classList.remove("correct");
        winning = false;
      }
    });
    if (winning) {
      inputLetters = [];
      scroeSpan.textContent = ++score;
      if (score === 5) {
        endGame(true);
      } else init();
    }
  }
};

// intial state
const init = function () {
  timerHead.textContent = timer;
  renderNewQuote();
};

const showMessage = function (messageText) {
  message.innerHTML = messageText;
  messageContainer.classList.remove("hidden");
};

const stopGame = function () {
  clearInterval(timerCounter);
};
const endGame = function (isWinning) {
  stopGame();
  if (isWinning) showMessage("🎉Congratulations you have won");
  else showMessage("Hard Luck<br>press tab to restart");
};

// input event
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    window.location.reload();
    return;
  }
  if (e.key === "Backspace") {
    inputLetters.pop();
  } else if (e.key.length === 1) {
    inputLetters.push(e.key);
  }
  checkLetters();
});

// start game
init();
