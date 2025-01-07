import { useEffect } from "react";
import ApexCharts from "apexcharts";

const RadialBarChart = () => {
  useEffect(() => {
    const options2 = {
      chart: {
        height: 380,
        type: "radialBar",
      },
      series: [75.55],
      colors: ["#7366FF"],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#E0E0E0",
            startAngle: -90,
            endAngle: 90,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "30px",
              fontWeight: "bold",
              show: true,
              color: "#333",
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          gradientToColors: ["#A7D2FF"],
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              height: 300,
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  value: {
                    fontSize: "25px",
                  },
                },
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
              radialBar: {
                dataLabels: {
                  value: {
                    fontSize: "20px",
                  },
                },
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
              radialBar: {
                dataLabels: {
                  value: {
                    fontSize: "16px",
                  },
                },
              },
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart2"), options2);
    chart.render();

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg p-4 md:p-6 max-w-md bg-white w-full">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-800 text-base md:text-lg">
          Target
        </h2>
        <h4 className="text-gray-500 text-sm md:text-base">Profit Target</h4>
      </div>
      <div id="chart2" className="w-full max-w-full"></div>
      <div className="text-center mt-4">
        <p className="text-green-500 text-sm md:text-base font-medium">
          10% ▲ +$150 this month
        </p>
        <p className="text-gray-800 text-xs md:text-sm">
          You succeeded to earn <span className="font-semibold">$240</span> this
          month, it's higher than last month
        </p>
      </div>
      <div className="flex justify-between flex-wrap text-sm md:text-base text-gray-500 mt-4">
        <div className="text-center text-base md:text-lg w-1/3 md:w-auto">
          <p>Target</p>
          <p className="text-gray-800 font-bold">$20k</p>
        </div>
        <div className="text-center text-base md:text-lg w-1/3 md:w-auto">
          <p>Revenue</p>
          <p className="text-red-500 font-bold">$16k</p>
        </div>
        <div className="text-center text-base md:text-lg w-1/3 md:w-auto">
          <p>Today</p>
          <p className="text-green-500 font-bold">$1.5k</p>
        </div>
      </div>
    </div>
  );
};

export default RadialBarChart;
