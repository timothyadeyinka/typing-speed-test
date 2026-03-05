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
              <div> <input type="radio" id="easy" name="difficulty" value="Easy">
              <label for="Easy">Easy</label> </div>
             <div>  <input type="radio" id="medium" name="difficulty" value="Medium">
              <label for="Medium">Medium</label>
              </div>
             <div>
              <input type="radio" id="hard" name="difficulty" value="Hard" checked>
              <label for="Hard">Hard</label> </div>
            </form>
          </div>
`;
const diffLarge = `
<div>
            Difficulty:&nbsp;&nbsp;<input type="button" value="Easy">
            <input type="button" value="Medium"><input type="button" value="Hard">
          </div>`;
const modeSmall = `
  <div class="unlimited"><span>Timed(60s)</span><img src="assets/images/icon-down-arrow.svg" alt="dropdown icon-down-arrow"></div>
          <div class="options opt2 hidden">
            <form>
             <div> 
              <input type="radio" id="timed" name="mode" value="Timed (60s)" checked>
              <label for="Timed (60)">Timed (60s)</label> </div>
             <div> 
              <input type="radio" id="passage" name="mode" value="Passage">
              <label for="Passage">Passage</label></div>
            </form>
          </div>
`;
const modeLarge = `
 <div>
            Mode:&nbsp;&nbsp;
            <input type="button" value="Timed (60s)"><input type="button" value="Passage">
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

let data;

// Dropdown declarations must not be moved up because it will return value:null as it has not been inserted in the DOM until line 67 & 68;
const diffUpdate = document.querySelector("div.radio-button span");
const modeUpdate = document.querySelector("div.unlimited span");
const diffOption = document.querySelector("div.opt1");
const modeOption = document.querySelector("div.opt2");
const diffPicked = document.querySelectorAll("div.opt1 form div input");
const modePicked = document.querySelectorAll("div.opt2 form div input");
const diffDrop = document.querySelector("div.radio-button");
const modeDrop = document.querySelector("div.unlimited");

// fetch .json file
async function loadData() {
  const response = await fetch("data.json");

  data = await response.json();
  console.log(data);
  console.log(data["easy"]);
  return data;
}

function setupDropdown(dropdown, update, options, inputs, data) {
  // Drop down UI
  dropdown.addEventListener("click", (e) => {
    options.classList.toggle("hidden");
  });

  const closeUIOptions = (event) => {
    if (!event.target.checked) return;
    update.textContent = event.target.value;
    options.classList.add("hidden");
    const typingBoard = document.querySelector("#typing-board");
    console.log(data[event.target.value]);
    const text =
      data[event.target.value].Math.random() * data[event.target.value].length;
    typingBoard.textContent = text;
  };

  inputs.forEach((input) => {
    input.addEventListener("change", closeUIOptions);
  });
}

setupDropdown(diffDrop, diffUpdate, diffOption, diffPicked, loadData());
setupDropdown(modeDrop, modeUpdate, modeOption, modePicked, loadData());
