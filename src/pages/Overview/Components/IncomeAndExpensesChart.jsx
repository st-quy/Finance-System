import { useEffect } from "react";
import ApexCharts from "apexcharts";

const IncomeExpensesChart = () => {
  useEffect(() => {
    const options = {
      colors: ["#1A56DB", "#3ABFF8", "#FACC15"], // Colors for Personal, Technology, Profit
      series: [
        {
          name: "Personal",
          data: [480, 400, 300, 500, 450, 480, 520, 490, 530, 550, 600, 450], // Monthly data for Personal
        },
        {
          name: "Technology",
          data: [280, 300, 320, 340, 360, 280, 260, 300, 320, 340, 380, 290], // Monthly data for Technology
        },
        {
          name: "Profit",
          data: [200, 250, 220, 180, 200, 230, 210, 190, 220, 250, 270, 200], // Monthly data for Profit
        },
      ],
      chart: {
        type: "bar",
        height: 380,
        stacked: true, // Enable stacked bars
        toolbar: {
          show: false,
        },
        fontFamily: "Inter, sans-serif",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          borderRadius: 8, // Rounded bar edges
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      xaxis: {
        categories: [
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
        ], // Monthly labels
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 10,
          right: 10,
          top: 10,
        },
      },
      legend: {
        position: "top", // Display legend at the top
        horizontalAlign: "center",
        labels: {
          useSeriesColors: true,
        },
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              height: 300,
            },
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 250,
            },
            plotOptions: {
              bar: {
                columnWidth: "80%",
              },
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 200,
            },
            plotOptions: {
              bar: {
                columnWidth: "90%",
              },
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(
      document.getElementById("column-chart"),
      options
    );
    chart.render();

    return () => {
      chart.destroy(); // Cleanup the chart on component unmount
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-6">
      <h2>Statistic</h2>
      <h4 className=" text-gray-500 font-semibold">Income and Expenses</h4>
      <div id="column-chart"></div>
    </div>
  );
};

export default IncomeExpensesChart;
