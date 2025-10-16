export async function weeklyChartDataLoad() {
  async function getWeeklySalesdata() {
    const response = await fetch(
      "https://billing-resturant-api.onrender.com/api/getdata/sales/weekly"
    );
    const WeeklydataSet = await response.json();
    console.log("weekly data set of graph is ", WeeklydataSet);
    return WeeklydataSet;
  }

  const ctx = document.getElementById("area-graph-weekly");

  if (!ctx) {
    console.error("Chart canvas #area-graph not found in the DOM!");
    return;
  }
  const datatoPlot = await getWeeklySalesdata();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
        "Day 8",
        "Day 9",
        "Day 10",
        "Day 11",
        "Day 12",
        "Day 13",
        "Day 14",
        "Day 15",
        "Day 16",
        "Day 17",
        "Day 18",
        "Day 19",
        "Day 20",
        "Day 21",
        "Day 22",
        "Day 23",
        "Day 24",
        "Day 25",
        "Day 26",
        "Day 27",
        "Day 28",
        "Day 29",
        "Day 30",
        "Day 31",
      ],
      datasets: [
        {
          label: "",
          data: datatoPlot,

          fill: true,
          backgroundColor: "#e1f0ff", // The semi-transparent fill color
          borderColor: "#6366f1", // The color of the line itself
          tension: 0.4, // This makes the line smooth and curved
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          // A B C
          grid: {
            display: false, // This will hide the horizontal grid lines
          },
        },
        x: {
          grid: {
            display: false, // This will hide the vertical grid lines
          },
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
