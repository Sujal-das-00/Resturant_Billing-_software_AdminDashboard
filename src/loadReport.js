import { renderChart } from "./reports.js"
import { weeklyChartDataLoad } from "./weeklyReport.js";
import { GetsalesReport } from "./api_calls.js";
export async function loadReportpanel(){
    const data = await GetsalesReport();
    const reportpanel = document.getElementById("report-panel")
    reportpanel.innerHTML=`<div class="header-reports">
        <h2>Restaurant Analytics</h2>
        <p>Monitor your restaurant's performance</p>
    </div>

    <div class="reports-container">
        <div class="card-report">
            <div class="card-content">
                <p class="card-title">Total Revenue</p>
                <h2 class="card-value">${data.TotalSale}</h2>
            </div>
            <div class="card-icon-container">
                <div class="icon">
                    <span class="material-symbols-outlined">
                        currency_rupee
                    </span>
                </div>
            </div>
        </div>
        <div class="card-report">
            <div class="card-content">
                <p class="card-title">Month Revenue</p>
                <h2 class="card-value">${data.MonthlySale}</h2>
            </div>
            <div class="card-icon-container">
                <div class="icon">
                    <span class="material-symbols-outlined">
                        finance
                    </span>
                </div>
            </div>
        </div>
        <div class="card-report">
            <div class="card-content">
                <p class="card-title">Total Orders</p>
                <h2 class="card-value">200</h2>
            </div>
            <div class="card-icon-container">
                <div class="icon">
                    <span class="material-symbols-outlined">
                        shopping_cart
                    </span>
                </div>
            </div>
        </div>
        <div class="card-report">
            <div class="card-content">
                <p class="card-title">Total Parcel</p>
                <h2 class="card-value">100</h2>
            </div>
            <div class="card-icon-container">
                <div class="icon">
                    <span class="material-symbols-outlined">
                        delivery_truck_speed
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="graph-container">
        <div class="graph-wrapper">
            <div class="wraper">
                <h2>Monthly Sales Performance</h2>
                <p>Revenue and order trends throughout the year</p>
            </div>
            <div class="monthly-sales-graph">
                <canvas class="area-graph" id="area-graph"></canvas>
            </div>
        </div>
    </div>
    <div class="graph-container">
        <div class="graph-wrapper">
            <div class="wraper">
                <h2>Daily Sales Performance</h2>
                <p>Revenue and order trends throughout the month</p>
            </div>
            <div class="monthly-sales-graph">
                <canvas class="area-graph" id="area-graph-weekly"></canvas>
            </div>
        </div>
    </div>`
    renderChart();
    weeklyChartDataLoad();
}