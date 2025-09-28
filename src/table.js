// import { orderView } from "./ViewOrders.js";
import {
  RejectOrder,
  postRequestSalesData,
  compelteParcelorderSaveData,
  RejectParcel,
} from "./api_calls.js";


export function ShowRevenue(revenue, SaleTxt) {
  const container = document.getElementById("right-panel");
  let revenuePanel = document.getElementById("revenue-panel");
  if (!revenuePanel) {
    revenuePanel = document.createElement("div");
    revenuePanel.className = "revenue-panel";
    revenuePanel.id = "revenue-panel";
    revenuePanel.innerHTML = "";
    container.appendChild(revenuePanel);
  }

  const saleItem = document.createElement("div");
  saleItem.className = "sale-panel"; // Set the class directly on the item
  saleItem.innerHTML = `
        <div class="revenue-text">${SaleTxt} Revenue</div>
        <div class="revenue-number">₹0</div>
    `;
  revenuePanel.appendChild(saleItem);
}

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
    tableDiv.id = `table-${table.tableNumber}`;
    // inner box
    tableDiv.innerHTML = `
      <div class="table-box">
        <h2 class="Table-name">Table ${table.tableNumber}</h2>
        <h2 class="status" id = "tableStatus-${table.tableNumber}">${
      table.tableStatus
    }</h2>
        <h2 class="payment-status" id = "paymentStatus-${
          table.tableNumber
        }" >Payment status: ${table.paymentStatus}</h2>
      </div>
      <div class="buttons">
        <button class="table-btn view-orders-btn" id= "${
          table.tableNumber - 1
        }" >View Orders</button>
        <button class="table-btn free-table";">Free Table</button>
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
        console.log(tables, "hehe haah !!!!!!!", dataObject);
        postRequestSalesData(dataObject);
        dataObject.tableStatus = "Vacant";
        dataObject.paymentStatus = null;
        dataObject.items = [];
        document.getElementById(`tableStatus-${table.tableNumber}`).innerText =
          "Vacant";
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
    if (!table) return;
    table.style.color = "";
    if (data.tableStatus == "Booked") {
      table.querySelector(".table-box").style.color = "red";
    }
    if (data.tableStatus == "Booked" && data.paymentStatus == "Paid") {
      table.querySelector(".table-box").style.color = "blue";
    }
    if (data.tableStatus == "Vacant" && data.paymentStatus == null) {
      table.querySelector(".table-box").style.color = "green";
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
        console.log("hello world");
        const dataObject = currentOrderData;
        //backend querry to persons table to delete one with id use crypto id
        dataObject.tableStatus = "Vacant";
        dataObject.paymentStatus = null;
        dataObject.items = [];
        document.getElementById(
          `tableStatus-${dataObject.tableNumber}`
        ).innerText = "Vacant";
        document.getElementById(
          `paymentStatus-${dataObject.tableNumber}`
        ).innerText = null;
        const response = await RejectOrder(dataObject.tableNumber);
        if (response.ok) {
          alert(`order rejected for table ${dataObject.tableNumber}`);
        }
        const arr = [dataObject];
        updateTDom(arr);
      }
    }
  });

  // Listener for the print button
  document.getElementById("PrintOrder").addEventListener("click", async () => {
    if (!currentOrderData) return;
    if (currentOrderType === "Parcel") {

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

    if ((currentOrderType = "Table Order")) {
      console.log("current order ----",currentOrderData);
      const printData = {
        order: "Table No "+currentOrderData.tableNumber,
        items: currentOrderData.items,
        totalPrice: currentOrderData.totalPrice,
      };
      console.log("----------------------------------------------------------------"+printData);
      window.electronAPI.send('print-bill', printData); 
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
  console.log("--------------------------------------", type);
  if (orderData.items.length == 0) {
    return alert("no orders found");
  }
  // if (type === "Parcel") {
  //   const parcel = document.querySelector(".parcel");
  //   parcel.id = `parcel[data-id='${orderData.id}']`;
  // }
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
    order_container.innerText = `Table: ${orderData.tableNumber} Customer name: ${orderData.customerName} `;
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
