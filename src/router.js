import { initOrderWindow } from "./index.js";
import { initializeOrderView } from "./table.js";
import { parcel_Data } from "./index_parcel.js";
import { fetchAllData } from "./api_calls.js";
import socket from "./connection.js";
import { loadReportpanel } from "./loadReport.js";

const parcelContainer = document.getElementById("parcel-container");
const rightPanel = document.getElementById("right-panel");
const parcelBTN = document.getElementById("parcel");
const reports = document.getElementById("Reports");
const reportpanel = document.getElementById("report-panel");


if(parcelBTN){
parcelBTN.addEventListener("click", async () => {

  rightPanel.style.visibility = "hidden";
  parcelContainer.style.visibility = "visible";
  reportpanel.style.visibility = "hidden";
  await fetchAllData();
  if (document.querySelectorAll(".parcel").length == 0) {
    console.log("parcel container data ",document.querySelectorAll(".parcel").length);

    const container = document.getElementById("parcel-container");
    if (container) {
      container.innerHTML = "";
      const nothingToShow = document.createElement("h2");
      nothingToShow.id = "nothing-to-show";
      nothingToShow.textContent = "Nothing to show here..";
      container.appendChild(nothingToShow);
      nothingToShow.style.visibility = "visible";
    }
    else{
      console.log("inside else block");
    }
  } else {
    const element = document.getElementById("nothing-to-show");
    if (element) {
      element.remove();
    }
    
  }
});
}

const orderBtn = document.getElementById("orders");
const tablePanel = document.querySelector(".table-content");
if(orderBtn){
orderBtn.addEventListener("click", async () => {
  rightPanel.style.visibility = "visible";
  parcelContainer.style.visibility = "hidden";
  reportpanel.style.visibility = "hidden";
  const nothingToShow = document.getElementById("nothing-to-show");
  if (nothingToShow) {
    nothingToShow.style.visibility = "hidden";
  }
  
  
  const tablePanel = document.querySelector(".table-content");
  tablePanel.innerHTML = "";
  await initOrderWindow();
});
}

socket.on("newParcel", (parcel) => {
  console.log(parcel);
  parcel_Data(parcel);
});


const refreshBtn = document.getElementById("refresh");
if(refreshBtn){
  refreshBtn.addEventListener("click", async () => {
  const wantsToReload = confirm("Do you want to reload? ");
  if (wantsToReload) {
    location.reload(true);
  }
  else{
  rightPanel.style.visibility = "visible";
  parcelContainer.style.visibility = "hidden";
  const nothingToShow = document.getElementById("nothing-to-show");
  if (nothingToShow) {
    nothingToShow.style.visibility = "hidden";
  }
  tablePanel.innerHTML = "";
  initOrderWindow();
  }
});
}


if(reports){
reports.addEventListener('click',async()=>{
  rightPanel.style.visibility = "hidden";
  reportpanel.style.visibility = "visible";
  reportpanel.innerHTML="";
  loadReportpanel();
})
}
initOrderWindow();
initializeOrderView();
