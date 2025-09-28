const buttons = document.querySelectorAll(".oder-btn");
if (buttons.length > 0) {
  buttons[0].classList.add("active");
}
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => {
      b.classList.remove("active");
    });
    if (index === 2) {
      buttons[1].classList.add("active");
    } else {
      btn.classList.add("active");
    }
  });
});
