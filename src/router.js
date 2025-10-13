import { initOrderWindow } from "./index.js";
import { initializeOrderView, ShowRevenue } from "./table.js";
import { parcel_Data } from "./index_parcel.js";
import { fetchAllData } from "./api_calls.js";
import socket from "./connection.js";

const parcelContainer = document.getElementById("parcel-container");
const rightPanel = document.getElementById("right-panel");
const parcelBTN = document.getElementById("parcel");

parcelBTN.addEventListener("click", () => {
  rightPanel.style.visibility = "hidden";
  parcelContainer.style.visibility = "visible";
  if (document.querySelectorAll(".parcel").length == 0) {
    const container = document.getElementById("parcel-container");
    if (container) {
      container.innerHTML = "";
      const nothingToShow = document.createElement("h2");
      nothingToShow.id = "nothing-to-show";
      nothingToShow.textContent = "Nothing to show here..";
      container.appendChild(nothingToShow);
      nothingToShow.style.visibility = "visible";
    }
  } else {
    const element = document.getElementById("nothing-to-show");
    if (element) {
      element.remove();
    }
  }
});

const orderBtn = document.getElementById("orders");
const tablePanel = document.querySelector("table-content");
orderBtn.addEventListener("click", () => {
  rightPanel.style.visibility = "visible";
  parcelContainer.style.visibility = "hidden";
  const nothingToShow = document.getElementById("nothing-to-show");
  if (nothingToShow) {
    nothingToShow.style.visibility = "hidden";
  }
  tablePanel.innerHTML = "";
  initOrderWindow();
});

socket.on("newParcel", (parcel) => {
  console.log(parcel);
  parcel_Data(parcel);
});

const refreshBtn = document.getElementById("refresh");
refreshBtn.addEventListener("click", async () => {
  await fetchAllData();
});

initOrderWindow();
initializeOrderView();
