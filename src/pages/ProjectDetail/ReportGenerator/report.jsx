import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { supabase } from '../../../supabaseClient';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import ApexCharts from 'apexcharts';
import { useParams } from "react-router-dom";


const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 10,
    },
    chart: {
        marginTop: 20,
    },
});

const ReportDocument = ({ project, expenses, budgetData, totalBudget }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>{project.project_name}</Text>
                <Text style={styles.subtitle}>{project.client_name}</Text>
                <Text style={styles.text}>Created at: {project.start_date}</Text>
                <Text style={styles.text}>End date: {project.end_date || 'In Processing'}</Text>
                <Text style={styles.text}>Tags: {project.project_type}</Text>
                <Text style={styles.text}>Number of people working on: 5</Text>
                <Text style={styles.text}>Value: ${project.project_value}</Text>
                <Text style={styles.text}>Target Profit: ${project.project_value - totalBudget}</Text>
                <View style={styles.chart} id="budget-chart"></View>
                <Text style={styles.subtitle}>Expenses</Text>
                <View>
                    {expenses.map(expense => (
                        <Text key={expense.expense_id} style={styles.text}>
                            {expense.expense_date}: {expense.description} - ${expense.amount}
                        </Text>
                    ))}
                </View>
                <Text style={styles.text}>This report was generated on {dayjs().format('YYYY-MM-DD HH:mm')}</Text>
            </View>
        </Page>
    </Document>
);

const Report = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);


    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        const { data: projectData, error: projectError } = await supabase
            .from('project')
            .select('*')
            .eq('project_id', projectId)
            .single()

        const { data: expenseData, error: expenseError } = await supabase
            .from('expense')
            .select('*')
            .eq('project_id', projectId)
            .order('expense_date', { ascending: false });

        const { data: budgetData, error: budgetError } = await supabase
            .from('budget')
            .select('*')
            .eq('project_id', projectId)
            .single();

        if (projectError || expenseError || budgetError) {
            console.error('Error fetching data:', projectError || expenseError || budgetError);
            return;
        }

        setProject(projectData);
        setExpenses(expenseData);
        setTotalBudget(budgetData.total_budget);

        const categories = ['Operations', 'Marketing', 'Technology', 'Personnel'];
        const budgetDataArray = categories.map(category => {
            const allocated = budgetData[`allocated_to_${category.toLowerCase()}`] || 0;
            const totalExpense = expenseData
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
            return { category, allocated, totalExpense };
        });

        setBudgetData(budgetDataArray);

        const chartOptions = {
            series: [
                {
                    name: 'Allocated',
                    data: budgetDataArray.map(data => data.allocated),
                },
                {
                    name: 'Total Expense',
                    data: budgetDataArray.map(data => data.totalExpense),
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: budgetDataArray.map(data => data.category),
            },
            yaxis: {
                title: {
                    text: 'Amount ($)'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `$ ${val}`;
                    }
                }
            }
        };

        const chart = new ApexCharts(document.querySelector("#budget-chart"), chartOptions);
        chart.render();
    };

    return (
        <div>
            <PDFDownloadLink
                document={<ReportDocument project={project} expenses={expenses} budgetData={budgetData} totalBudget={totalBudget} />}
                fileName={`report_${project.project_name}.pdf`}
            >
                {({ loading }) => (loading ? 'Loading document...' : <Button>Generate PDF</Button>)}
            </PDFDownloadLink>
            <div id="report-content">
                {project && (
                    <div>
                        <h1>{project.project_name}</h1>
                        <h2>{project.client_name}</h2>
                        <p>Created at: {project.start_date}</p>
                        <p>End date: {project.end_date || 'In Processing'}</p>
                        <p>Tags: {project.project_type}</p>
                        <p>Number of people working on: 5</p>
                        <p>Value: ${project.project_value}</p>
                        <p>Target Profit: ${project.project_value - totalBudget}</p>
                        <div id="budget-chart"></div>
                        <h3>Expenses</h3>
                        <ul>
                            {expenses.map(expense => (
                                <li key={expense.expense_id}>
                                    {expense.expense_date}: {expense.description} - ${expense.amount}
                                </li>
                            ))}
                        </ul>
                        <p>This report was generated on {dayjs().format('YYYY-MM-DD HH:mm')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;