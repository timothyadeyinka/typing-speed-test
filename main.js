/* ********************************************
 * Timothy Adeyinka
 * main.js
 * Typing speed project
 * 2nd March, 2026
 * ********************************************/

"use script";

const diff = document.querySelector("div.diff");
const mode = document.querySelector("div.mode");

const imgLogo = document.querySelector(".header-top img");
const mediaQuery = window.matchMedia("(min-width: 600px)");
const userHighScore = document.querySelector(".p-best span.txt");
const large = "assets/images/logo-large.svg";
const small = "assets/images/logo-small.svg";
const diffSmall = `
 <div class="radio-button">Hard <img src="assets/images/icon-down-arrow.svg" alt="dropdown icon-down-arrow">
          </div>
          <div class="options">
            <form>
              <input type="radio" id="easy" name="easy" value="easy">
              <label for="easy">Easy</label>
              <input type="radio" id="medium" name="medium" value="medium">
              <label for="medium">Medium</label>
              <input type="radio" id="hard" name="hard" value="hard">
              <label for="hard">Hard</label>
            </form>
          </div>
`;
const diffLarge = `
<div>
            Difficulty:&nbsp;&nbsp;<input type="button" value="Easy">
            <input type="button" value="Medium"><input type="button" value="Hard">
          </div>`;
const modeSmall = `
  <div>Timed(60s) <img src="assets/images/icon-down-arrow.svg" alt="dropdown icon-down-arrow"></div>
          <div class="options">
            <form>
              <input type="radio" id="timed" name="timed" value="timed">
              <label for="timed">Timed (60s)</label>
              <input type="radio" id="passage" name="passage" value="passage">
              <label for="passage">Passage</label>
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
