 async function renderChart() {
    
  async function getdata() {
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/api/getdata/sales"
    );
    const response2 =await fetch("https://billing-resturant-api.onrender.com/api/getdata/sales/weekly");
    const dataSet = await response.json();
    const dataSet2 = await response2.json();
    console.log("data set of graph is ", dataSet);
    return dataSet;
  }

  const ctx = document.getElementById("area-graph");

  if (!ctx) {
    console.error("Chart canvas #area-graph not found in the DOM!");
    return;
  }
  const datatoPlot = await getdata();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "",
          data: datatoPlot,

          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)", // The semi-transparent fill color
          borderColor: "rgba(54, 162, 235, 1)", // The color of the line itself
          tension: 0.4, // This makes the line smooth and curved
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: "#18181b", // A dark color
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#6366f1",
          borderWidth: 1,
          callbacks: {
            label: function (tooltipItem) {
              // Get the raw data value
              let value = tooltipItem.raw;
              // Return a custom string with a dollar sign
              return `Revenue: ₹${value}`;
            },
          },
        },
      },
      interaction: {
        mode: "index", // Find items by their x-axis index
        intersect: false, // Trigger tooltip even when not directly over an item
      },
    },
  });
}
renderChart();