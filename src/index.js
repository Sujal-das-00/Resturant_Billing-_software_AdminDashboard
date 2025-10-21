import { generateTables, updateTDom } from "./table.js";

import socket from "./connection.js";
import { GetsalesReport,generateTablesviaDB} from "./api_calls.js"
export const tablesData = await generateTablesviaDB();

export async function initOrderWindow() {
  document.getElementById("parcel-container").style.visibility="hidden"
  
  socket.on('tableOrder', (orderInfo) => {
    console.log(orderInfo);
    updateTable(orderInfo);
  })
 

  const updateTable = async (orderInf) => {
    tablesData[orderInf.tableNumber - 1].tableStatus = orderInf.tableStatus;
    tablesData[orderInf.tableNumber - 1].paymentStatus = orderInf.paymentStatus;
    tablesData[orderInf.tableNumber - 1].customerName = orderInf.customerName;
    tablesData[orderInf.tableNumber - 1].items = orderInf.items;
    tablesData[orderInf.tableNumber - 1].totalPrice = orderInf.totalPrice;
    tablesData[orderInf.tableNumber - 1].paymentMethod = orderInf.paymentMethod;
    tablesData[orderInf.tableNumber - 1].tempToken = orderInf.tempToken;
    const container = document.getElementById("table-container");
    container.innerHTML = "";
    console.log(tablesData);
    generateTables(tablesData);
    updateTDom(tablesData);
  }
  await GetsalesReport();
  generateTables(tablesData);
  updateTDom(tablesData);

}