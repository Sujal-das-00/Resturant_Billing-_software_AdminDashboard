import { orderView } from "./table.js";
let parcelContainer = document.getElementsByClassName("parcel-container")[0];


function loadParcels(name, paymentStatus,parcelId,location) {
  const parcel = document.createElement("div");
  parcel.className = "order-card-wrapper parcel";
  parcel.innerHTML = `
    <div class="order-card">
        <div class="order-info-left">
            <div class="order-icon-name">
                <div class="order-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8.62v6.88a2 2 0 0 1-1 1.73l-7 4.04a2 2 0 0 1-2 0l-7-4.04a2 2 0 0 1-1-1.73V8.62a2 2 0 0 1 1-1.73l7-4.04a2 2 0 0 1 2 0l7 4.04a2 2 0 0 1 1 1.73z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
                <div class="customer-details">
                    <div class="customer-name">${name}</div>
                    <div class="order-id">ID: ${parcelId}</div>
                </div>
            </div>
            <div class="order-location-date">
                <div class="order-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M12 12v8"/><path d="M8 16c-1-1-3-2-3-2s-1.5-1.5-1.5-3c0-1.5 1-3 3-3 2 0 3 1 3 3"/><path d="M16 16c1-1 3-2 3-2s1.5-1.5 1.5-3c0-1.5-1-3-3-3-2 0-3 1-3 3"/></svg>
                    ${location}
                </div>
                <div class="order-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                    Jan 15, 2025
                </div>
            </div>
        </div>
        
        <div class="order-actions-right">
            <div class="order-status pending">${paymentStatus}</div>
            <button class="view-order-button viewParcelBtn">View Order</button>
        </div>
    </div>`
  return parcel;
}




export function parcel_Data(parcelData) {
    console.log("parcel data is ",parcelData);
  const element = document.getElementById("nothing-to-show")
  if (element) element.remove();
  const newParcel = loadParcels(parcelData.customerName,parcelData.paymentStatus,parcelData.parcelId);
  newParcel.dataset.id = parcelData.parcelId;
  newParcel.querySelector('.viewParcelBtn').addEventListener('click', () => {
    orderView(parcelData, "Parcel");
  })
  parcelContainer.appendChild(newParcel);
}
