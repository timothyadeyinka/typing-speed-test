/* ********************************************
 * Timothy Adeyinka
 * main.js
 * Typing speed project
 * 2nd March, 2026
 * ********************************************/

"use script";

// DOM manipulation
const diff = document.querySelector("div.diff");
const mode = document.querySelector("div.mode");

const imgLogo = document.querySelector(".header-top img");
const mediaQuery = window.matchMedia("(min-width: 600px)");
const userHighScore = document.querySelector(".p-best span.txt");
const large = "assets/images/logo-large.svg";
const small = "assets/images/logo-small.svg";

const diffSmall = `
 <div class="radio-button"><span>Hard </span><img src="assets/images/icon-down-arrow.svg" alt="dropdown icon-down-arrow">
          </div>
          <div class="options opt1 hidden">
            <form>
              <div> <input type="radio" id="Easy" name="difficulty" value="Easy">
              <label for="Easy">Easy</label> </div>
             <div>  <input type="radio" id="Medium" name="difficulty" value="Medium">
              <label for="Medium">Medium</label>
              </div>
             <div>
              <input type="radio" id="Hard" name="difficulty" value="Hard" checked>
              <label for="Hard">Hard</label> </div>
            </form>
          </div>
`;
const diffLarge = `
<div class="radio-button">Difficulty: </div>
<div class="options opt1">
<form>
<div>
<input type="button" value="Easy">
            <input type="button" value="Medium"><input type="button" value="Hard"></div>
</form>
          </div>`;
const modeSmall = `
  <div class="unlimited"><span>Timed(60s)</span><img src="assets/images/icon-down-arrow.svg" alt="dropdown icon-down-arrow"></div>
          <div class="options opt2 hidden">
            <form>
             <div> 
              <input type="radio" id="Timed (60s)" name="mode" value="Timed (60s)" checked>
              <label for="Timed (60)">Timed (60s)</label> </div>
             <div> 
              <input type="radio" id="Passage" name="mode" value="Passage">
              <label for="Passage">Passage</label></div>
            </form>
          </div>
`;
const modeLarge = `
<div class="unlimited"><span>Mode: </span></div>
 <div class="options opt2">
            <input type="button" value="Timed(60s)"><input type="button" value="Passage">
          </div>`;

// DOM manipulation
const applyLogo = (isLarge) => {
  const src = isLarge ? large : small;

  imgLogo.setAttribute("src", src);
  userHighScore.textContent = isLarge ? "Personal Best:" : "Best:";

  diff.innerHTML = isLarge ? diffLarge : diffSmall;
  mode.innerHTML = isLarge ? modeLarge : modeSmall;
};

// this cannot be done with a load event because the DOM only loads once
// this needs to come first in order to determine the value of statements in
// applyLogo function when a change occurs
mediaQuery.addEventListener("change", (e) => {
  applyLogo(e.matches);
});

// the order in which the above and the below are placed does not really matter!

// Run on load
applyLogo(mediaQuery.matches);

// Dropdown declarations must not be moved up because it will return value:null as it has not been inserted in the DOM until line 67 & 68;
const diffUpdate = document.querySelector("div.radio-button span");
const modeUpdate = document.querySelector("div.unlimited span");
const diffOption = document.querySelector("div.opt1");
const modeOption = document.querySelector("div.opt2");
const diffPicked = document.querySelectorAll("div.opt1 form div input");
const modePicked = document.querySelectorAll("div.opt2 form div input");
const diffDrop = document.querySelector("div.radio-button");
const modeDrop = document.querySelector("div.unlimited");
const typingBoard = document.querySelector("#typing-board");

const timerDisplay = document.querySelector("#timer");
const WPM = document.querySelector("#wpm");
const accuracy = document.querySelector("#acc");

const state = {
  difficulty: "hard",
  mode: "timed(60s)",
  lastIndex: null,
  currentIndex: 0,
  correctChars: 0,
  passages: null,
  timer: null,
  timeLeft: 60,
  startTime: null,
  elapsedTime: null,
};

// Rendering a Passage
function renderNewPassage() {
  const passages = state.passages[state.difficulty];

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * passages.length);
  } while (randomIndex === state.lastIndex);

  state.lastIndex = randomIndex;

  const text = passages[randomIndex].text;
  typingBoard.innerHTML = "";
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    typingBoard.appendChild(span);
  });

  state.currentIndex = 0;

  // 👇 add active cursor to first letter
  updateCursor();
}

// fetch .json file
async function loadData() {
  const response = await fetch("data.json");

  const data = await response.json();
  console.log(data);

  return data;
}

// styling the preselected input at first load
function styleChecked(value, options) {
  if (value) {
    options.forEach((opt) => {
      opt.value = opt.value.toLowerCase();
      if (opt.value === value) {
        opt.classList.add("checked");
      } else {
        opt.classList.remove("checked");
      }
    });
  } else {
    return;
  }
}

async function init() {
  styleChecked(state.difficulty, diffPicked);

  // if (state.mode) styleChecked(state.mode, modePicked);
  const data = await loadData();

  state.passages = data;

  setupDropdown(diffDrop, diffUpdate, diffOption, diffPicked, "difficulty");
  setupDropdown(modeDrop, modeUpdate, modeOption, modePicked, "mode");

  renderNewPassage();
}

// converting the time to minutes
function convertTime(elapsed, startTime) {
  if (startTime === null) startTime = Date.now();
  console.log(startTime);

  if (startTime !== null) elapsed = Date.now() - startTime;
  console.log(elapsed);
  return elapsed / 1000 / 60;
}

// Handle typing
typingBoard.addEventListener("keydown", handleTyping);
typingBoard.focus();
function handleTyping(e) {
  const spans = typingBoard.querySelectorAll("span");
  if (state.currentIndex >= spans.length) return;
  if (e.key.length > 1 && e.key !== "Backspace") return;
  if (e.key === "Backspace") {
    if (state.currentIndex === 0) return;

    state.currentIndex--;
    const span = spans[state.currentIndex];
    span.classList.remove("correct", "incorrect");

    updateCursor();
    return;
  }

  const currentSpan = spans[state.currentIndex];
  const typedChar = e.key;

  if (typedChar === currentSpan.textContent) {
    currentSpan.classList.add("correct");
  } else {
    currentSpan.classList.add("incorrect");
  }

  // dealing with the WPM
  if (typedChar === currentSpan.textContent) state.correctChars++;

  // console.log(state.correctChars);

  let time = convertTime(state.elapsedTime, state.startTime);
  console.log(time);

  WPM.textContent = state.correctChars / 5 / time;

  state.currentIndex++;

  updateCursor();
}

// Dropdown logic
function setupDropdown(dropdown, update, options, inputs, stateKey) {
  // Drop down UI
  dropdown.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  const closeUIOptions = (event) => {
    const value = event.target.value.toLowerCase();
    // update state
    state[stateKey] = value;

    // toggling the styling of clicked inputs
    styleChecked(state[stateKey], diffPicked);

    options.classList.add("hidden");
    renderNewPassage();
    typingBoard.focus(); // restore typing focus

    //update dropdown label
    if (update !== null) {
      update.textContent = event.target.value;
    } else {
      return;
    }
  };

  inputs.forEach((input) => {
    input.addEventListener("click", closeUIOptions);
  });
}

// Timer mode
function startTimer() {
  state.timeLeft = 60;
  state.timer = setInterval(() => {
    state.timeLeft--;
    timerDisplay.textContent = state.timeLeft;

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      endTest();
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", init);

function updateCursor() {
  const spans = typingBoard.querySelectorAll("span");
  spans.forEach((span) => span.classList.remove("active"));
  if (state.currentIndex < spans.length) {
    spans[state.currentIndex].classList.add("active");

    // scroll cursor into view automatically for long text
    spans[state.currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
