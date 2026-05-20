
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


function NewChart() {
  const barData = {
    labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    datasets: [
      {
        label: "Stock Full",
        data: [500, 220, 540, 480, 580, 270, 80, 460, 5],
        backgroundColor: "rgba(3, 201, 180, 0.95)", // teal-like
        barThickness: 20,
        borderRadius: 6,
      },
      // optional: you can add Stockout Risk / Dead Stock series if needed
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: "Inventory Stock",
        align: "start",
        color: "#2aa7b2",
        font: { size: 14, weight: 600 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#7b8b8b" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#7b8b8b" },
        grid: {
          color: "rgba(200,200,200,0.08)",
        },
      },
    },
  };

  // DOUGHNUT chart data (Inventory %)
  const doughnutData = {
    labels: ["A","B","C","D","E","F","G","H","I"],
    datasets: [
      {
        data: [20, 15, 8, 10, 10, 3, 30, 10, 4], // sample percentages to match look
        backgroundColor: [
          "#9be564",
          "#5cc2d6",
          "#6c6fcf",
          "#d58ef0",
          "#f3a6e2",
          "#ff7f7f",
          "#e59a63",
          "#8fd9a8",
          "#f1d86a"
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "55%", // creates the white hole in middle
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: { usePointStyle: true, boxWidth: 10, padding: 12 },
      },
      datalabels: {
        color: "#2b2b2b",
        formatter: (value, ctx) => {
          // show percent (rounded)
          const sum = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
          return Math.round((value / sum) * 100) + "%";
        },
        anchor: "center",
        align: "center",
        font: { weight: "600", size: 12 },
      },
      title: {
        display: true,
        text: "Inventory %",
        align: "start",
        color: "#2aa7b2",
        font: { size: 14, weight: 600 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const val = context.raw;
            return `${label}: ${val}%`;
          },
        },
      },
    },
  };

  return (
   <div className="charts-page">
      <div className="design-ref">
        <img
          src="/mnt/data/9c19013c-45cd-41fe-80e7-2101705e1066.png"
          alt="design reference"
        />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-inner">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-inner doughnut-wrap">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewChart