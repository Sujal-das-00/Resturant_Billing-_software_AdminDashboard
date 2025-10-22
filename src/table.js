// import { orderView } from "./ViewOrders.js";
import {
  RejectOrder,
  postRequestSalesData,
  compelteParcelorderSaveData,
  RejectParcel,
} from "./api_calls.js";

// export function ShowRevenue(revenue, SaleTxt) {
//   const container = document.getElementById("right-panel");
//   const revenuePanel = document.querySelector(".revenue-panel");
//   if (!revenuePanel) {
//     revenuePanel = document.createElement("div");
//     revenuePanel.className = "revenue-panel";
//     revenuePanel.id = "revenue-panel";
//     revenuePanel.innerHTML = "";
//     container.appendChild(revenuePanel);
//   }

//   const saleItem = document.createElement("div");
//   saleItem.className = "sale-panel"; // Set the class directly on the item
//   saleItem.innerHTML = `
//         <div class="revenue-text">${SaleTxt} Revenue</div>
//         <div class="revenue-number">₹0</div>
//     `;
//   revenuePanel.appendChild(saleItem);
// }

export function generateTables(tables) {
  console.log("inside generate table");
  const container = document.getElementById("right-panel");
  let table_container = document.getElementById("table-container");

  if (!table_container) {
    table_container = document.createElement("div");
    table_container.className = "table-content";
    table_container.id = "table-container";
    container.appendChild(table_container);
  }
  tables.forEach((table) => {
    const tableDiv = document.createElement("div");
    tableDiv.className = "table";
    // inner box
    tableDiv.innerHTML = `
       <div class="table-box" id="table-${table.tableNumber}" >
        <div class="card-header" >
            <h3 class = "Table-name" id = "tableStatus-${
              table.tableNumber
            }">Table ${table.tableNumber} </h3>
            <span class="status" id = "BookingStatus-${table.tableNumber}" > ${
      table.tableStatus
    } </span>
        </div>
        <div class="card-body">
            <p class = "payment-status" id = "paymentStatus-${
              table.tableNumber
            }" >Payment Status: ${table.paymentStatus}</p>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
            <button class="btn-card btn-secondary view-orders-btn " id= "${
              table.tableNumber - 1
            }">
                <!-- Eye Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                View Orders
            </button>
            <button class="btn-card btn-primary free-table">
                <!-- Checkmark Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                 <span class="btn-text">Available</span> 
            </button>
        </div>
    </div>
    `;
    const viewOrderButton = tableDiv.querySelector(".view-orders-btn");
    const FreeTable = tableDiv.querySelector(".free-table");
    viewOrderButton.addEventListener("click", () => {
      console.log(`hello from view order ${table.tableNumber}`);
      orderView(tables[table.tableNumber - 1], "Table Order");
      console.log("hello from order view");
    });

    FreeTable.addEventListener("click", async () => {
      const dataObject = tables[table.tableNumber - 1];
      if (dataObject.tableStatus != "Booked") {
        alert("Oh! No booking Found");
        return window.event.preventDefault();
      }
      if (window.confirm("Do you want to Free the table")) {
        dataObject.Order_type = "On Resturant";
        await postRequestSalesData(dataObject);
        dataObject.tableStatus = "Vacant";
        dataObject.paymentStatus = null;
        dataObject.items = [];
        document.getElementById(
          `BookingStatus-${table.tableNumber}`
        ).innerText = "Vacant";
        document.getElementById(
          `paymentStatus-${table.tableNumber}`
        ).innerText = null;
        const arr = [dataObject];
        updateTDom(arr);
      }
    });

    // append to container
    table_container.appendChild(tableDiv);
  });
}

export function updateTDom(data) {
  data.forEach((data) => {
    console.log("hello from dom update", data);
    const table = document.getElementById(`table-${data.tableNumber}`);
    const bookingSpan = document.getElementById(
      `BookingStatus-${data.tableNumber}`
    );
    const freeTableBtn = table.querySelector(".free-table");
    const spantext = table.querySelector(".btn-text");
    if (!table) return;
    table.style.color = "";

    if (data.tableStatus == "Booked") {
      table.style.color = "red";
      table.style.backgroundColor = "#f6edf0";
      table.style.borderColor = "#f4d2d4";
      bookingSpan.style.backgroundColor = "red";
      freeTableBtn.style.backgroundColor = "#283c55";
      freeTableBtn.style.borderColor = "#1c2a3b";
      spantext.textContent = "Free Table";
    }
    if (data.tableStatus == "Vacant") {
      table.style.color = "green";
      table.style.backgroundColor = "";
      table.style.borderColor = "";
      bookingSpan.style.backgroundColor = "";
      freeTableBtn.style.backgroundColor = "";
      freeTableBtn.style.borderColor = "";
      spantext.textContent = "Available";
    }
    // table.querySelector(".status").textContent = data.status;
    table.querySelector(
      ".payment-status"
    ).textContent = `Payment Status: ${data.paymentStatus}`;
    console.log(data);
  });
}
//global variable for having the object of the order and determining the order type to determine the event listner of print and reject order
let currentOrderData = null;
let currentOrderType = null;
const viewContainer = document.querySelector(".view-order-container");
const mainContainer = document.querySelector(".main-container");
const billFrame = document.getElementById("billframe");
export function initializeOrderView() {
  // Listener for the main close button
  document.getElementById("closebtn").addEventListener("click", () => {
    viewContainer.style.visibility = "hidden";
    mainContainer.style.filter = "blur(0px)";
  });

  // Listener for the reject button
  document.getElementById("close").addEventListener("click", async () => {
    if (!currentOrderData) return; // when the initilizeorderwindow loads to prevent event listner
    //if user clicks ok to cancel
    if (window.confirm("Do you want to Reject the Order")) {
      viewContainer.style.visibility = "hidden";
      mainContainer.style.filter = "blur(0px)";

      if (currentOrderType === "Parcel") {
        const response = await RejectParcel(currentOrderData.parcelId);
        if (response.ok) {
          alert("parcel rejected sucessfully");
          const parcelToRemove = document.querySelector(
            `[data-id="${currentOrderData.parcelId}"]`
          ); //adding id to a particular parcel to delete it if the orderis rejected
          if (parcelToRemove) parcelToRemove.remove();
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
          }
        } else {
          alert("parcel couldnot rejected");
        }
      }
      if (currentOrderType === "Table Order") {
        const dataObject = currentOrderData;
        try {
          dataObject.tableStatus = "Vacant";
          dataObject.paymentStatus = "null";
          dataObject.items = [];
          const response = await RejectOrder(dataObject.tableNumber);

          if (response.ok) {
            alert(`order rejected for table ${dataObject.tableNumber}`);
          }
          document.getElementById(
            `BookingStatus-${dataObject.tableNumber}`
          ).innerText = "Vacant";
          document.getElementById(
            `paymentStatus-${dataObject.tableNumber}`
          ).innerText = "null";

          const arr = [dataObject];
          updateTDom(arr);
        } catch (error) {
          alert("an error ocured to reject the order ");
          console.log("error occurred in rejecting the order", error);
        }
      }
    }
  });

  // Listener for the print button
  document.getElementById("PrintOrder").addEventListener("click", async () => {
    if (!currentOrderData) return;
    if (currentOrderType === "Parcel") {
      viewContainer.style.visibility = "hidden";
      mainContainer.style.filter = "blur(0px)";
      //logic to handel nothing to show and to remove parcel from the dom
      while (true) {
        const response = await compelteParcelorderSaveData(currentOrderData);
        const result = await response.json();
        if (response.ok) {
          const parcelToRemove = document.querySelector(
            `[data-id="${currentOrderData.parcelId}"]`
          ); //adding id to a particular parcel to delete it if the orderis rejected
          if (parcelToRemove) parcelToRemove.remove();
          if (document.querySelectorAll(".parcel").length == 0) {
            document.getElementById("nothing-to-show").style.visibility =
              "visible";
          }
          alert(result.message);
          break;
        }
      }
    }

    if ((currentOrderType === "Table Order")) {
      console.log("current order ----", currentOrderData);
      const printData = {
        order: "Table No " + currentOrderData.tableNumber,
        items: currentOrderData.items,
        totalPrice: currentOrderData.totalPrice,
      };

       //iframe based bill routing web app
      billFrame.onload = () => {
        billFrame.contentWindow.postMessage(printData, "*");
      };
      billFrame.src = "bill.html";
      // window.electronAPI.send("print-bill", printData); electron api calling to access printer
    }
    viewContainer.style.visibility = "hidden";
    mainContainer.style.filter = "blur(0px)";

    // request to the kernel to print, using 'currentOrderData'
  });
}

//billing window logic called by generate tables too add event listner
export function orderView(orderData, type) {
  //setting the global variable value for the event listner refrence
  currentOrderData = orderData;
  currentOrderType = type;

  if (orderData.items.length == 0) {
    return alert("no orders found");
  }
  document.querySelector(".main-container").style.filter = "blur(8px)";
  document.querySelector(".view-order-container").style.visibility = "visible";
  const order_container = document.querySelector(".oder-text");
  const orderStatus = document.querySelector(".status-view");
  const order_wraper = document.querySelector(".oder-container");
  const total_price = document.getElementById("totalbill");
  order_wraper.innerHTML = "";

  if (type === "Parcel") {
    order_container.innerText = `Parcel from ${orderData.customerName}`;
  } else {
    order_container.innerHTML = `<h3>Table: ${orderData.tableNumber}</h3> 
    <p>Customer name: ${orderData.customerName}</p>`;
  }
  orderStatus.innerText = `${orderData.paymentStatus}`;
  for (let index = 0; index < orderData.items.length; index++) {
    let element = orderData.items[index];
    order_wraper.innerHTML += `<div class="order-details-wrapper">
           <div class="dish">${element.item_name}</div>
           <div class="quantity">${element.quantity}plate</div>
            <div class="price">₹${element.price}</div>
        </div>`;
  }
  total_price.innerText = `₹${orderData.totalPrice}`;
}
