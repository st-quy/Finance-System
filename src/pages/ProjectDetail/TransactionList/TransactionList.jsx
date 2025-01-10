import React, { useState, useEffect } from 'react';
import { Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from '../../../supabaseClient';
import ProjectFilter from '../ProjectFilter/ProjectFilter';

const ListItem = ({ item, isSelected, onSelect }) => (
  <div className="flex w-full border-b border-zinc-200 hover:bg-gray-50">
    <div className="flex items-center p-4 w-14">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-5 h-5 rounded-md border-2 border-neutral-300"
      />
    </div>
    <div className="flex-none w-32 p-4">{item.expense_id}</div>
    <div className="flex-1 p-4">{item.category}</div>
    <div className="flex-none w-32 p-4">{item.expense_date}</div>
    <div className="flex-1 p-4">{item.description}</div>
    <div className="flex-none w-32 p-4">{"$" + item.amount}</div>
    <div className="flex-none w-32 p-4">{
        <Space>
          <Button icon={<EditOutlined  />} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
    }</div>
  </div>
);

const TableHeader = () => (
  <div className="flex w-full bg-white border-b border-zinc-200 text-sm font-medium text-slate-500">
    <div className="flex items-center p-4 w-14">
      <input
        type="checkbox"
        className="w-5 h-5 rounded-md border-2 border-neutral-300"
      />
    </div>
    <div className="flex-none w-32 p-4">Expense ID</div>
    <div className="flex-1 p-4">Category</div>
    <div className="flex-none w-32 p-4">Date</div>
    <div className="flex-1 p-4">Description</div>
    <div className="flex-none w-32 p-4">Amount</div>
    <div className="flex-none w-32 p-4">Action</div>
  </div>
);

const ListView = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    let { data: expense, error } = await supabase
      .from("expense")
      .select("*")
      .eq("project_id", 90);

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(expense);
      setFilteredExpenses(expense);
    }
  }

  const handleFilterChange = ({ dateRange, categories }) => {
    let filtered = [...expenses];

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.expense_date);
        return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
      });
    }

    // Apply category filter
    if (categories && categories.length > 0) {
      filtered = filtered.filter(expense =>
        categories.includes(expense.category)
      );
    }

    setFilteredExpenses(filtered);
  };

  const handleItemSelect = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="space-y-4">
      <ProjectFilter onFilterChange={handleFilterChange} />

      <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 shadow-lg">
        <div className="min-w-[1024px]">
          <TableHeader />
          {filteredExpenses.map((item) => (
            <ListItem
              key={item.expense_id}
              item={item}
              isSelected={selectedItems.has(item.expense_id)}
              onSelect={() => handleItemSelect(item.expense_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListView;