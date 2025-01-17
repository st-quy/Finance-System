import React, { useState, useEffect } from "react";
import {
  DollarOutlined,
  LineChartOutlined,
  WalletOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { supabase } from "../../../../supabaseClient";
import dayjs from "dayjs";

const DashboardStats = () => {
  const [statsData, setStatsData] = useState([
    {
      title: "Monthly Profit",
      value: "$0",
      icon: <DollarOutlined className="text-lg" />,
      comparison: "0%",
      comparisonText: "Compare to last month",
      variant: "cyan",
    },
    {
      title: "Revenue this year",
      value: "$0",
      icon: <LineChartOutlined className="text-lg" />,
      comparison: "0%",
      comparisonText: "Compare to last year",
      variant: "indigo",
    },
    {
      title: "Monthly Expense",
      value: "$0",
      icon: <WalletOutlined className="text-lg" />,
      comparison: "0%",
      comparisonText: "Compare to last month",
      variant: "rose",
    },
    {
      title: "Project In Progress",
      value: "0",
      icon: <ProjectOutlined className="text-lg" />,
      comparison: "0",
      comparisonText: "Total Value",
      variant: "orange",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const now = dayjs();
    const startOfMonth = now.startOf("month").format("YYYY-MM-DD");
    const startOfYear = now.startOf("year").format("YYYY-MM-DD");
    const startOfLastMonth = now
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const startOfLastYear = now
      .subtract(1, "year")
      .startOf("year")
      .format("YYYY-MM-DD");

    const { data: projects, error: projectError } = await supabase
      .from("project")
      .select("project_id, project_value, start_date, end_date");

    const { data: expenses, error: expenseError } = await supabase
      .from("expense")
      .select("project_id, amount, expense_date");

    if (projectError || expenseError) {
      console.error("Error fetching data:", projectError || expenseError);
      return;
    }

    const monthlyProjects = projects.filter((project) =>
      dayjs(project.start_date).isAfter(startOfMonth)
    );
    const yearlyProjects = projects.filter((project) =>
      dayjs(project.start_date).isAfter(startOfYear)
    );
    const lastMonthProjects = projects.filter(
      (project) =>
        dayjs(project.start_date).isAfter(startOfLastMonth) &&
        dayjs(project.start_date).isBefore(startOfMonth)
    );
    const lastYearProjects = projects.filter(
      (project) =>
        dayjs(project.start_date).isAfter(startOfLastYear) &&
        dayjs(project.start_date).isBefore(startOfYear)
    );
    const inProgressProjects = projects.filter((project) => !project.end_date);

    const monthlyExpenses = expenses.filter((expense) =>
      dayjs(expense.expense_date).isAfter(startOfMonth)
    );
    const yearlyExpenses = expenses.filter((expense) =>
      dayjs(expense.expense_date).isAfter(startOfYear)
    );
    const lastMonthExpenses = expenses.filter(
      (expense) =>
        dayjs(expense.expense_date).isAfter(startOfLastMonth) &&
        dayjs(expense.expense_date).isBefore(startOfMonth)
    );
    const lastYearExpenses = expenses.filter(
      (expense) =>
        dayjs(expense.expense_date).isAfter(startOfLastYear) &&
        dayjs(expense.expense_date).isBefore(startOfYear)
    );

    const monthlyProfit =
      monthlyProjects.reduce((sum, project) => sum + project.project_value, 0) -
      monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyProfit =
      yearlyProjects.reduce((sum, project) => sum + project.project_value, 0) -
      yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastMonthProfit =
      lastMonthProjects.reduce(
        (sum, project) => sum + project.project_value,
        0
      ) - lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastYearProfit =
      lastYearProjects.reduce(
        (sum, project) => sum + project.project_value,
        0
      ) - lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthlyExpense = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const lastMonthExpense = lastMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const monthlyProfitComparison = (
      ((monthlyProfit - lastMonthProfit) / (lastMonthProfit || 1)) *
      100
    ).toFixed(2);
    const yearlyProfitComparison = (
      ((yearlyProfit - lastYearProfit) / (lastYearProfit || 1)) *
      100
    ).toFixed(2);
    const monthlyExpenseComparison = (
      ((monthlyExpense - lastMonthExpense) / (lastMonthExpense || 1)) *
      100
    ).toFixed(2);

    setStatsData([
      {
        title: "Monthly Profit",
        value: `$${monthlyProfit.toLocaleString()}`,
        icon: <DollarOutlined className="text-lg" />,
        comparison: `${Number(monthlyProfitComparison)?.toFixed(0)}%`,
        comparisonText: "Compare to last month",
        variant: "cyan",
      },
      {
        title: "Revenue this year",
        value: `$${yearlyProfit.toLocaleString()}`,
        icon: <LineChartOutlined className="text-lg" />,
        comparison: `${yearlyProfitComparison}%`,
        comparisonText: "Compare to last year",
        variant: "indigo",
      },
      {
        title: "Monthly Expense",
        value: `$${monthlyExpense.toLocaleString()}`,
        icon: <WalletOutlined className="text-lg" />,
        comparison: `${Number(monthlyExpenseComparison).toFixed(0)}%`,
        comparisonText: "Compare to last month",
        variant: "rose",
      },
      {
        title: "Project In Progress",
        value: `${inProgressProjects.length}`,
        icon: <ProjectOutlined className="text-lg" />,
        comparison: `$${inProgressProjects.reduce((sum, project) => sum + project.project_value, 0).toLocaleString()}`,
        comparisonText: "Total Value",
        variant: "orange",
      },
    ]);
  };

  const cardIcons = {
    cyan: "https://cdn.builder.io/api/v1/image/assets/TEMP/8cf2b55e05bc254ba94a352858130d558f1bcfbcc043dcf1d627d8bcd4833a58",
    indigo: "https://cdn.builder.io/api/v1/image/assets/TEMP/9ebff3a9147747dd69efc0e7705093337c2d0166648d5b13f69f8fc858fb3693",
    rose: "https://cdn.builder.io/api/v1/image/assets/TEMP/2391184436fe032b8051e1f08bdb520a0a2057399113b437a2b74962618e010b",
    orange: "https://cdn.builder.io/api/v1/image/assets/TEMP/50f53249945e64edc353fa6e06e2a9bf04ce0fdf25cec1123e5cfca204e4a911"
  };

  const variantStyles = {
    cyan: {
      bg: "bg-cyan-50",
      border: "bg-teal-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "bg-indigo-800",
    },
    rose: {
      bg: "bg-rose-50",
      border: "bg-red-700",
    },
    orange: {
      bg: "bg-orange-50",
      border: "bg-amber-600",
    },
  };

  return (
    <div className="flex flex-wrap gap-6 items-start">
      {statsData.map((stat, index) => {
        const styles = variantStyles[stat.variant];
        return (
          <div 
            key={index}
            className="flex overflow-hidden relative flex-col flex-1 shrink bg-white rounded-2xl border border-solid border-zinc-200 min-w-[240px]"
            role="region"
            aria-label={stat.title}
          >
            <div className="flex z-0 flex-col px-5 pt-5 pb-4 w-full">
              <div className="flex gap-4 items-start w-full">
                <div className="flex flex-col flex-1 shrink basis-4">
                  <div className="text-base tracking-normal text-slate-500">
                    {stat.title}
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-normal leading-none text-neutral-950">
                    {stat.value}
                  </div>
                </div>
                <div className={`flex overflow-hidden gap-2 justify-center items-center px-2 w-10 h-10 ${styles.bg} min-h-[40px] rounded-[100px]`}>
                  <img
                    loading="lazy"
                    src={cardIcons[stat.variant]}
                    alt=""
                    className="object-contain self-stretch my-auto aspect-square w-[18px]"
                  />
                </div>
              </div>
              <div className="flex gap-1 items-center mt-4 w-full text-sm tracking-normal leading-none">
                {stat.title !== "Project In Progress" ? (
                  <>
                    <div className="flex gap-0.5 items-center self-stretch my-auto font-bold text-teal-500 whitespace-nowrap">
                      <div className="self-stretch my-auto">{stat.comparison}</div>
                    </div>
                    <div className="self-stretch my-auto text-[11px] text-slate-500">
                      {stat.comparisonText}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="gap-0.5 self-stretch my-auto font-bold whitespace-nowrap">
                      {stat.comparison}
                    </div>
                    <div className="self-stretch my-auto text-[11px] text-slate-500">
                      {stat.comparisonText}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={`flex absolute left-0 top-5 z-0 w-1.5 h-6 ${styles.border} min-h-[24px]`} />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
