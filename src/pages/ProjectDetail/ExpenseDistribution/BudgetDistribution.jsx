import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const BudgetDistribution = () => {
    const [expenses, setExpenses] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [profit, setProfit] = useState({ value: 0, percentage: 0 });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [expenseResponse, projectResponse] = await Promise.all([
                    supabase
                        .from("expense")
                        .select("category, amount")
                        .eq("project_id", 60),
                    supabase
                        .from("project")
                        .select("project_value")
                        .eq("project_id", 60)
                        .single()
                ]);

                if (expenseResponse.error) throw new Error(expenseResponse.error.message);
                if (projectResponse.error) throw new Error(projectResponse.error.message);

                setExpenses(expenseResponse.data);
                setProject(projectResponse.data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (expenses.length > 0 && project?.project_value) {
            const totalValue = project.project_value;
            const categorySums = expenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
                return acc;
            }, {});

            // Calculate total expenses
            const totalExpenses = Object.values(categorySums).reduce((sum, value) => sum + value, 0);
            
            // Calculate profit
            const profitValue = totalValue - totalExpenses;
            const profitPercentage = (profitValue / totalValue) * 10;

            setProfit({
                value: profitValue,
                percentage: profitPercentage.toFixed(2),
                percentageRaw: profitPercentage
            });

            const categories = Object.entries(categorySums).map(([category, sum]) => ({
                name: category,
                value: sum,
                percentage: ((sum / totalValue) * 1000).toFixed(2),
                percentageRaw: (sum / totalValue) * 1000,
                color: getColorForCategory(category),
            }));

            setBudgetCategories(categories);
        }
    }, [expenses, project]);

    const getColorForCategory = (category) => {
        const colors = {
            Personnel: 'bg-blue-500',
            Technology: 'bg-green-500',
            Marketing: 'bg-red-500',
            Operations: 'bg-yellow-500',
            Profit: 'bg-emerald-500', // Added color for profit
        };
        return colors[category] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <div className="w-full flex flex-col px-9 py-5 bg-white rounded-lg border shadow-sm border-zinc-200">
                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col px-9 py-5 bg-white rounded-lg border shadow-sm border-zinc-200">
                <div className="text-red-500">Error loading budget distribution: {error}</div>
            </div>
        );
    }

    if (!budgetCategories.length) {
        return (
            <div className="w-full flex flex-col px-9 py-5 bg-white rounded-lg border shadow-sm border-zinc-200">
                <div className="text-zinc-500">No budget data available</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col px-9 py-5 bg-white rounded-lg border shadow-sm border-zinc-200 max-md:px-5">
            <div className="text-sm font-bold text-zinc-500">Distribution of Budget</div>
            <div className="flex mt-2.5 w-full">
                <div className="flex w-full rounded-2xl overflow-hidden h-8">
                    {budgetCategories.map((category, index) => (
                        <div
                            key={`bar-${category.name}-${index}`}
                            className={`h-full ${category.color}`}
                            style={{ width: `${category.percentageRaw}%` }}
                            role="img"
                            aria-label={`${category.name}: ${category.percentage}%`}
                        />
                    ))}
                    {/* Profit bar */}
                    <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${profit.percentageRaw}%` }}
                        role="img"
                        aria-label={`Profit: ${profit.percentage}%`}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-zinc-500">
                {budgetCategories.map((category, index) => (
                    <div key={`legend-${category.name}-${index}`} className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${category.color} rounded-full`} aria-hidden="true" />
                        <div>{category.name} ({category.percentage}%)</div>
                    </div>
                ))}
                {/* Profit legend item */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full" aria-hidden="true" />
                    <div>Profit ({profit.percentage}%)</div>
                </div>
            </div>
        </div>
    );
};

export default BudgetDistribution;