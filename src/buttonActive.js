const hamburger = document.getElementById("hamburgerBTN");
const leftPanel = document.getElementById("leftpanel");
hamburger.addEventListener("click", () => {
  leftPanel.style.visibility = "visible";
});
const close = document.getElementById("hamburger-close");
close.addEventListener("click", () => {
  leftPanel.style.visibility = "hidden";
});
