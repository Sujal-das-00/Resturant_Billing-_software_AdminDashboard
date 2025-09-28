import { orderView } from "./table.js";
let parcelContainer = document.getElementsByClassName("parcel-container")[0];
function loadParcels(name, paymentStatus) {
  const parcel = document.createElement("div");
  parcel.className = "parcel";
  parcel.innerHTML = `
          <h3 class="parcel-name">${name}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp${paymentStatus}</h3>
          <button class="viewParcelBtn">view order</button>`
  return parcel;
}
export function parcel_Data(parcelData) {
  const element = document.getElementById("nothing-to-show")
  if (element) element.remove();
  const newParcel = loadParcels(parcelData.customerName, parcelData.paymentStatus);
  newParcel.dataset.id = parcelData.parcelId;
  newParcel.querySelector('.viewParcelBtn').addEventListener('click', () => {
    orderView(parcelData, "Parcel");
  })
  parcelContainer.appendChild(newParcel);
}
