"use strict";
const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const container = document.querySelector(".container");
const timerHead = document.querySelector(".timer");
const quote = document.querySelector(".container p");
const textArea = document.querySelector("textarea");
const scroeSpan = container.querySelector("span");
const messageContainer = document.querySelector(".message-container");
const overlay = document.querySelector(".overlay");
const message = document.querySelector(".message");
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
  textArea.value = "";
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
    const inputChars = textArea.value.split("");
    quoteLetters.forEach((quoteChar, index) => {
      if (!inputChars[index]) {
        quoteChar.classList.remove("incorrect");
        quoteChar.classList.remove("correct");
        winning = false;
      } else if (quoteChar.textContent === inputChars[index]) {
        quoteChar.classList.add("correct");
        quoteChar.classList.remove("incorrect");
      } else if (quoteChar.textContent !== inputChars[index]) {
        quoteChar.classList.add("incorrect");
        quoteChar.classList.remove("correct");
        winning = false;
      }
    });
    if (winning) {
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
  textArea.textContent = "";
  textArea.focus();
  renderNewQuote();
};

const resetCopy = (e) => {
  e.preventDefault();
  textArea.value = "Are You Serious?";
};
const showMessage = function (messageText) {
  message.innerHTML = messageText;
  messageContainer.classList.remove("hidden");
};

const stopGame = function () {
  clearInterval(timerCounter);
  textArea.setAttribute("disabled", "disabled");
};
const endGame = function (isWinning) {
  stopGame();
  if (isWinning) showMessage("🎉Congratulations you have won");
  else showMessage("Hard Luck<br>press tab to restart");
};

// prevent pasting
textArea.addEventListener("paste", resetCopy);
textArea.addEventListener("dragover", resetCopy);

// input event
textArea.addEventListener("input", checkLetters);

// restart game on tab
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    window.location.reload();
  }
});

// start game
init();
