/* ********************************************
 * Timothy Adeyinka
 * main.js
 * Typing speed project
 * 2nd March, 2026
 * ********************************************/

"use strict";

// DOM manipulation
const diff = document.querySelector("div.diff");
const mode = document.querySelector("div.mode");

const imgLogo = document.querySelector(".header-top img");
const mediaQuery = window.matchMedia("(min-width: 600px)");
const userHighScore = document.querySelector(".p-best span.txt");
const large = "assets/images/logo-large.svg";
const small = "assets/images/logo-small.svg";
const body = document.querySelector("body");
const typingBoard = document.querySelector("#typing-board");
const timerDisplay = document.querySelector("#timer");
const WPM = document.querySelector("#wpm");
const accuracy = document.querySelector("#acc");
const resultAccuracy = document.querySelector("span.result-acc");
const resultCorrectChar = document.querySelector("span.result-correct");
const resultIncorrectChar = document.querySelector("span.result-incorrect");
// const restart = document.querySelector("div.restart");
const resultWPM = document.querySelector("span.result-achieved");
const bestWPM = document.querySelector("span.achieved");
const headerBottom = document.querySelector(".header-bottom");
const testResults = document.querySelector(".first-test-result");
const footer = document.querySelector("footer");
const feedbackHeader = document.querySelector("h2.feedback-header");
const feedback = document.querySelector("p.feedback");
const restart = document.querySelector("div.restart");
const imgMain = document.querySelector("div.images img.main");
const starr = document.querySelector("img.starr");
const smallImg = document.querySelector("img.small");

// DOM manipulation
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
              <input type="radio" id="Hard" name="difficulty" value="Hard">
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
              <input type="radio" id="Timed (60s)" name="mode" value="Timed (60s)">
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
            <form>
            <div><input type="button" value="Timed(60s)"><input type="button" value="Passage"></div>
            </form>
          </div>`;

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
  setupUI();
});

// the order in which the above and the below are placed does not really matter!

// Run on load
applyLogo(mediaQuery.matches);

const state = {
  difficulty: "Hard",
  mode: "Timed(60s)",
  lastIndex: null,
  currentIndex: 0,
  correctChars: 0,
  passages: null,
  timer: null,
  timeLeft: 60,
  startTime: null,
  elapsedTime: null,
  totalTyped: 0,
  mistakes: 0,
};

function setupUI() {
  const diffUpdate = document.querySelector("div.radio-button span");
  const modeUpdate = document.querySelector("div.unlimited span");
  const diffOption = document.querySelector("div.opt1");
  const modeOption = document.querySelector("div.opt2");
  const diffPicked = document.querySelectorAll("div.opt1 form div input");
  const modePicked = document.querySelectorAll("div.opt2 form div input");
  const diffDrop = document.querySelector("div.radio-button");
  const modeDrop = document.querySelector("div.unlimited");

  setupDropdown(diffDrop, diffUpdate, diffOption, diffPicked, "difficulty");
  setupDropdown(modeDrop, modeUpdate, modeOption, modePicked, "mode");

  styleChecked(state.difficulty, diffPicked);
  styleChecked(state.mode, modePicked);

  if (diffUpdate) diffUpdate.textContent = state.difficulty;
  if (modeUpdate) modeUpdate.textContent = state.mode;

  // Dropdown declarations must not be moved up because it will return value:null as it has not been inserted in the DOM until line 67 & 68; REVIEW: this has changed due to this helper function.
}

// Rendering a Passage
function renderNewPassage() {
  if (!typingBoard) return;
  state.currentIndex = 0;
  state.correctChars = 0;
  state.totalTyped = 0;
  state.mistakes = 0;
  state.startTime = null;
  state.timeLeft = 60;

  timerDisplay.textContent = `0:${String(state.timeLeft).padStart(2, "0")}`;
  WPM.textContent = "0";
  accuracy.textContent = "100%";

  if (state.mode === "Passage") timerDisplay.textContent = "--";

  // DONE: tricky section here but I resolved this section by making the first character of the difficulty state a capital letter and using the toLowerCase() here, brilliant!
  const passages = state.passages[state.difficulty.toLowerCase()];

  console.log(passages);
  let randomIndex;

  if (passages.length === 1) {
    randomIndex = 0;
  } else {
    do {
      randomIndex = Math.floor(Math.random() * passages.length);
    } while (randomIndex === state.lastIndex);
  }

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

  return data;
}

// styling the preselected input at first load
function styleChecked(value, options) {
  if (value) {
    options.forEach((opt) => {
      if (opt.value === value) {
        opt.classList.add("checked");
        opt.checked = true;
      } else {
        opt.classList.remove("checked");
      }
    });
  }
}

async function init() {
  const savedBest = localStorage.getItem("storedBestWPM");

  if (savedBest) {
    bestWPM.textContent = savedBest;
  }

  const data = await loadData();

  state.passages = data;

  setupUI();

  renderNewPassage();
}

// Handle typing
function watchTyping() {
  if (!typingBoard) return;

  typingBoard.addEventListener("keydown", handleTyping);
  typingBoard.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      restartTest();
    }
    // this resets the stored user's achievement.
    if (e.key === "Delete" && e.shiftKey && e.ctrlKey) {
      e.preventDefault();
      localStorage.removeItem("storedBestWPM");
      bestWPM.textContent = 0;
    }
  });
  typingBoard.focus();
}
watchTyping();

function handleTyping(e) {
  const spans = typingBoard.querySelectorAll("span");
  if (state.currentIndex >= spans.length) return;
  if (e.key.length > 1 && e.key !== "Backspace") return;

  // to stop the space-bar auto scroll effect on the typing board.
  e.preventDefault();

  if (e.key === "Backspace") {
    if (state.currentIndex === 0) return;

    state.currentIndex--;
    const span = spans[state.currentIndex];
    if (span.classList.contains("correct")) {
      state.correctChars--;
    }
    if (span.classList.contains("incorrect")) {
      state.mistakes--;
    }

    state.totalTyped--;

    span.classList.remove("correct", "incorrect");

    updateCursor();
    return;
  }

  const currentSpan = spans[state.currentIndex];

  if (state.currentIndex === 0) {
    if (!state.startTime) {
      state.startTime = Date.now();
      if (state.mode !== "Passage") startTimer();
    }
  }

  const typedChar = e.key;

  if (typedChar === currentSpan.textContent) {
    currentSpan.classList.add("correct");
    state.correctChars++;
  } else {
    currentSpan.classList.add("incorrect");
    state.mistakes++;
  }

  state.totalTyped++;

  state.currentIndex++;

  updateStats();
  updateCursor();
  if (state.currentIndex === spans.length) endTest();
}

// Dropdown logic
function setupDropdown(dropdown, update, options, inputs, stateKey) {
  // Drop down UI
  dropdown.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  const closeUIOptions = (event) => {
    event.stopPropagation();
    const value = event.target.value;
    // update state
    state[stateKey] = value;

    // toggling the styling of clicked inputs
    styleChecked(state[stateKey], inputs);

    mediaQuery.matches
      ? options.classList.remove("hidden")
      : options.classList.add("hidden");

    renderNewPassage();
    typingBoard.focus(); // restore typing focus

    // update dropdown label
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
  if (state.timer) return;

  state.timer = setInterval(() => {
    state.timeLeft--;
    timerDisplay.textContent = `0: ${String(state.timeLeft).padStart(2, "0")}`;

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      endTest();
    }
  }, 1000);
}

function updateStats() {
  if (!state.startTime && state.mode === "Timed(60s)") return;

  const elapsed = (Date.now() - state.startTime) / 1000;
  const minutes = elapsed / 60;

  if (elapsed <= 0) return;
  if (elapsed < 1) return;

  const wpm = Math.round(state.correctChars / 5 / minutes);
  const acc =
    state.totalTyped === 0
      ? 100
      : Math.round((state.correctChars / state.totalTyped) * 100);

  WPM.textContent = wpm;
  accuracy.textContent = `${acc}%`;
}

function endTest() {
  clearInterval(state.timer);

  const currentWPM = parseInt(WPM.textContent);
  const storedBestWPM = Number(localStorage.getItem("storedBestWPM") || 0);

  if (storedBestWPM === 0) {
    localStorage.setItem("storedBestWPM", currentWPM);
    bestWPM.textContent = currentWPM;
  }

  if (currentWPM <= storedBestWPM) {
    bestWPM.textContent = storedBestWPM;
    feedbackHeader.textContent = "Test Complete!";
    feedback.textContent = "Solid run. Keep pushing to beat your high score.";
    restart.textContent = "Go Again";
  }

  if (currentWPM > storedBestWPM && storedBestWPM > 0) {
    localStorage.setItem("storedBestWPM", currentWPM);
    bestWPM.textContent = currentWPM;
    feedbackHeader.textContent = "High Score Smashed!";
    feedback.textContent = "You're getting faster. That was incredible typing.";
    restart.textContent = "Go Again";
    imgMain.setAttribute("src", "assets/images/icon-new-pb.svg");
    imgMain.setAttribute("alt", "personal-best");
    body.classList.add("confetti");
    starr.classList.add("hidden");
    smallImg.classList.add("hidden");
  }

  typingBoard.removeEventListener("keydown", handleTyping);

  const finalAcc = accuracy.textContent;

  typingBoard.classList.add("hidden");
  footer.classList.add("hidden");
  headerBottom.classList.add("hidden");
  testResults.classList.remove("hidden");

  resultWPM.textContent = currentWPM;
  resultAccuracy.textContent = finalAcc;
  resultAccuracy.textContent !== "100%"
    ? resultAccuracy.classList.add("incorrect")
    : resultAccuracy.classList.add("correct");
  resultCorrectChar.textContent = state.correctChars;
  resultIncorrectChar.textContent = state.mistakes;
}

function restartTest() {
  clearInterval(state.timer);

  state.timer = null;
  state.startTime = null;
  state.timeLeft = 60;

  state.currentIndex = 0;
  state.totalTyped = 0;
  state.correctChars = 0;
  state.mistakes = 0;

  WPM.textContent = 0;
  accuracy.textContent = 100;
  timerDisplay.textContent = `0:${String(state.timeLeft).padStart(2, "0")}`;

  typingBoard.addEventListener("keydown", handleTyping);

  typingBoard.classList.remove("hidden");
  footer.classList.remove("hidden");
  headerBottom.classList.remove("hidden");
  testResults.classList.add("hidden");
  body.classList.remove("confetti");

  renderNewPassage();
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
      block: "nearest",
    });
  }
}
