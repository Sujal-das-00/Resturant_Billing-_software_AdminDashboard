// This function will take the data and build the HTML
async function populateBill(data) {
  // Set Order ID
  document.querySelector(".order").textContent = `Order : ${data.order}`;

  // Find the container for all the items
  const itemsContainer = document.querySelector(".item-info");
  itemsContainer.innerHTML = ""; // Clear any placeholder items

  // Loop through each item in the data and create elements for it
  data.items.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "order-details-wrapper";

    const dish = document.createElement("div");
    dish.className = "dish";
    dish.textContent = item.item_name;

    const quantity = document.createElement("div");
    quantity.className = "i-quantity";
    quantity.textContent = `${item.quantity}x`;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `₹${item.price.toFixed(2)}`;

    wrapper.appendChild(dish);
    wrapper.appendChild(quantity);
    wrapper.appendChild(price);
    itemsContainer.appendChild(wrapper);
  });

  // Set Total Price
  document.querySelector(
    ".total-price"
  ).textContent = `₹${data.totalPrice.toFixed(2)}`;
  const text = `upi://pay?pa=9430798527@omni&pn=Sujal&am=${data.totalPrice}&cu=INR&tn=Invoice+Test&tr=INV001`;
  const dataUrl = await QRCode.toDataURL(text, { width: 100 });
  document.getElementById("pqymentqr").src = dataUrl;
}

// Listen for the 'bill-data' event from the main process
// window.electronAPI.on("bill-data", (dataObject) => {
//   console.log("Received bill data!", dataObject);
//   populateBill(dataObject);
// });

window.addEventListener("message", async (event) => {
  const data = event.data;
  console.log("Bill data received:", data);
  await populateBill(data);
  window.print();
});
