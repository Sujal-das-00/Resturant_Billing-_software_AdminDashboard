
import { parcel_Data } from "./index_parcel.js";
const loader = document.getElementById("loader-wrapper");

export async function postRequestSalesData(userData) {
  try {
    const dataObject = userData;
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/api/update/bookingstatus",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObject),
      }
    );
    const data = await response.json();
    console.log(data);
    GetsalesReport();
  } catch (error) {
    alert("an error occured in freeing table wait and try agin");
    console.log(error);
  }
}

function formatIndianNumber(num) {
  if (typeof num !== "number" || isNaN(num)) {
    return num; 
  }
  const str = num.toString();
  const [integerPart, decimalPart] = str.split(".");
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + 
                    (otherNumbers ? "," : "") + lastThree;

  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

export async function GetsalesReport() {
  try {
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/getSalesData"
    );
    const data = await response.json();
    document.getElementsByClassName("revenue-number")[0].innerHTML = `₹${formatIndianNumber(data.monthlysale)}`;
    document.getElementsByClassName("revenue-number")[1].innerHTML =`₹${formatIndianNumber(data.monthlysale)}`;
    document.getElementsByClassName("revenue-number")[2].innerHTML = `₹${formatIndianNumber(data.monthlysale)}`;
  } catch (error) {
    alert("couldn't fetch salesdata from data base");
  }
}
export async function RejectOrder(tableNumber) {
  try {
    return await fetch(
      `https://billing-resturant-api.onrender.com/api/rejectOrder/${tableNumber}`,
      { method: "PATCH" }
    );
  } catch (error) {
    console.log("error occured in rejecting order", error);
  }
}

export async function compelteParcelorderSaveData(parcelOrder) {
  parcelOrder.Order_type = "Parcel";
  try {
    const response = await fetch(
      `https://billing-resturant-api.onrender.com/api/parcel/Save-And-delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parcelOrder),
      }
    );

    return response;
  } catch (error) {
    return console.log("error occured", error);
  }
}

export async function RejectParcel(parcelId) {
  try {
    return await fetch(
      `https://billing-resturant-api.onrender.com/api/reject/parcel/${parcelId}`,
      { method: "DELETE" }
    );
  } catch (error) {
    return error;
  }
}

export async function fetchAllData() {
  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/api/sync-data"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const parcelcont = document.getElementById("parcel-container");
    const data = await response.json(); // Get the { tables, orders } object
    console.log(data.orders);
    parcelcont.innerHTML = "";
    parcelcont.style.visibility = "visible";
    // Re-render the UI with the fresh data
    data.orders.forEach((orders) => {
      parcel_Data(orders);
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    alert("Could not refresh data. Please check your connection.");
  } finally {
    loader.classList.add("hidden");
  }
}

export async function generateTablesviaDB() {
  try {
    loader.classList.remove("hidden");
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/get"
    );
    return await response.json();
  } catch (error) {
    alert("an error occured in table fetching");
    console.log("an error occured", error);
  } finally {
    loader.classList.add("hidden");
  }
}
