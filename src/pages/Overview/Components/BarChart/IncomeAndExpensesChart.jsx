import { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { supabase } from "../../../../supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const IncomeExpensesChart = () => {
  const [chartData, setChartData] = useState({ expenses: [], profits: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const now = dayjs();
    const startOfLastYear = now
      .subtract(1, "year")
      .startOf("month")
      .format("YYYY-MM-DD");

    const { data: projects, error: projectError } = await supabase
      .from("project")
      .select("project_id, project_value, start_date");

    const { data: expenses, error: expenseError } = await supabase
      .from("expense")
      .select("project_id, amount, expense_date");

    if (projectError || expenseError) {
      console.error("Error fetching data:", projectError || expenseError);
      return;
    }

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = now.subtract(i, "month").startOf("month");
      const monthLabel = month.format("MMM");
      const monthStart = month.format("YYYY-MM-DD");
      const monthEnd = month.endOf("month").format("YYYY-MM-DD");

      const monthlyProjects = projects.filter((project) =>
        dayjs(project.start_date).isBetween(monthStart, monthEnd)
      );
      const monthlyExpenses = expenses.filter((expense) =>
        dayjs(expense.expense_date).isBetween(monthStart, monthEnd)
      );

      const monthlyProjectValue = monthlyProjects.reduce(
        (sum, project) => sum + project.project_value,
        0
      );
      const monthlyExpenseValue = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const monthlyProfit = monthlyProjectValue - monthlyExpenseValue;

      return {
        monthLabel,
        expense: monthlyExpenseValue,
        profit: monthlyProfit,
      };
    }).reverse();

    setChartData({
      expenses: monthlyData.map((data) => data.expense),
      profits: monthlyData.map((data) => data.profit),
    });

    const options = {
      colors: ["#351E99", "#00B3A7"], // Colors for Expense, Profit
      series: [
        {
          name: "Expense",
          data: monthlyData.map((data) => data.expense),
        },
        {
          name: "Profit",
          data: monthlyData.map((data) => data.profit),
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
          borderRadius: 5, // Rounded bar edges
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
        categories: monthlyData.map((data) => data.monthLabel), // Monthly labels
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
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2>Statistic</h2>
      <h4 className=" text-gray-500 font-semibold">Income and Expenses</h4>
      <div id="column-chart"></div>
    </div>
  );
};

export default IncomeExpensesChart;
