const container = document.getElementById("order-viewer");
const handle = document.getElementById("drag-handle");

let isDragging = false;
let offsetX, offsetY;
handle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
  handle.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const newX = e.clientX - offsetX;
  const newY = e.clientY - offsetY;
  container.style.left = `${newX}px`;
  container.style.top = `${newY}px`;
  container.style.transform = "none";
});
document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    handle.style.cursor = "grab";
  }
});
