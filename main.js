/* ********************************************
 * Timothy Adeyinka
 * main.js
 * Typing speed project
 * 2nd March, 2026
 * ********************************************/

"use script";

const imgLogo = document.querySelector(".header-top img");
const mediaQuery = window.matchMedia("(min-width: 600px)");
const userHighScore = document.querySelector(".p-best span.txt");
const large = "assets/images/logo-large.svg";
const small = "assets/images/logo-small.svg";

// DOM manipulation
const applyLogo = (isLarge) => {
  const src = isLarge ? large : small;

  imgLogo.setAttribute("src", src);
  userHighScore.textContent = isLarge ? "Personal Best:" : "Best:";
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
