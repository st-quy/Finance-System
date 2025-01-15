import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { supabase } from '../../../supabaseClient';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import ApexCharts from 'apexcharts';
import { useParams } from "react-router-dom";
import html2canvas from 'html2canvas';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 24,
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 24,
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#e0f2fe',
    color: '#1d4ed8',
    padding: '4 8',
    borderRadius: 9999,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  chartSection: {
    marginVertical: 24,
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  expenseTable: {
    width: '100%',
    marginTop: 16,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  tableHeaderCell: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  tableCell: {
    fontSize: 12,
    color: '#374151',
  },
  dateColumn: { flex: 2 },
  descriptionColumn: { flex: 3 },
  amountColumn: { flex: 1, textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 16,
  },
});

const ReportDocument = ({ project, expenses, budgetData, totalBudget, chartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.project_name}</Text>
        <Text style={styles.subtitle}>Project Report</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridColumn}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Created at</Text>
            <Text style={styles.value}>{project.start_date}</Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>End date</Text>
            <Text style={styles.value}>{project.end_date || 'In Processing'}</Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Project Type</Text>
            <Text style={styles.tag}>{project.project_type}</Text>
          </View>
        </View>
        <View style={styles.gridColumn}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Number of people</Text>
            <Text style={styles.value}>5</Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Value</Text>
            <Text style={[styles.value, { color: '#059669' }]}>${project.project_value?.toLocaleString()}</Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Target Profit</Text>
            <Text style={[styles.value, { color: '#059669' }]}>${(project.project_value - totalBudget)?.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {chartImage && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Budget Distribution</Text>
          <Image src={chartImage} style={{ width: '100%', height: 300 }} />
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Text style={styles.chartTitle}>Expenses</Text>
        <View style={styles.expenseTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Description</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Category</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Amount</Text>
          </View>
          {expenses.map((expense, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }]}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{expense.expense_date}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{expense.description}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{expense.category}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>${expense.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>
        Generated on {dayjs().format('YYYY-MM-DD HH:mm')}
      </Text>
    </Page>
  </Document>
);

const Report = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [chartImage, setChartImage] = useState(null);

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

        // Wait for chart to render then capture it as an image
        setTimeout(async () => {
            const chartElement = document.querySelector("#budget-chart");
            if (chartElement) {
                const canvas = await html2canvas(chartElement);
                const chartImageUrl = canvas.toDataURL('image/png');
                setChartImage(chartImageUrl);
            }
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PDFDownloadLink
                document={<ReportDocument project={project} expenses={expenses} budgetData={budgetData} totalBudget={totalBudget} chartImage={chartImage} />}
                fileName={`report_${project.project_name}.pdf`}
            >
                {({ loading }) => (loading ? 'Loading document...' : <Button className="mb-6">Generate PDF</Button>)}
            </PDFDownloadLink>
            <div id="report-content" className="bg-white shadow-lg rounded-lg p-8">
                {project && (
                    <div className="space-y-6">
                        <div className="text-center border-b pb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.project_name}</h1>
                            <h2 className="text-xl text-gray-600">{project.client_name}</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-b pb-6">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Created at: <span className="font-semibold text-gray-800">{project.start_date}</span></p>
                                <p className="text-sm text-gray-600">End date: <span className="font-semibold text-gray-800">{project.end_date || 'In Processing'}</span></p>
                                <p className="text-sm text-gray-600">Tags: <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{project.project_type}</span></p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Number of people: <span className="font-semibold text-gray-800">5</span></p>
                                <p className="text-sm text-gray-600">Value: <span className="font-semibold text-green-600">${project.project_value?.toLocaleString()}</span></p>
                                <p className="text-sm text-gray-600">Target Profit: <span className="font-semibold text-green-600">${(project.project_value - totalBudget)?.toLocaleString()}</span></p>
                            </div>
                        </div>

                        <div className="border-b pb-6">
                            <h3 className="text-xl font-semibold mb-4">Budget Distribution</h3>
                            <div id="budget-chart" className="w-full h-[350px]"></div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">Expenses</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {expenses.map(expense => (
                                            <tr key={expense.expense_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.expense_date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{expense.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">${expense.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 pt-6 border-t">
                            This report was generated on {dayjs().format('YYYY-MM-DD HH:mm')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;