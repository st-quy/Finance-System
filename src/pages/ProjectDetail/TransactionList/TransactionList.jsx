import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

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
    <div className="flex-none w-32 p-4">{item.amount}</div>
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
  </div>
);

const ListView = () => {
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    async function fetchExpense() {
      let { data: expense, error } = await supabase
        .from("expense")
        .select("*")
        .eq("project_id", 2); // Filter for project ID 1

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpense(expense);
      }
    }

    fetchExpense();
  }, []);

  const [selectedItems, setSelectedItems] = useState(new Set());

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
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 shadow-lg">
      <div className="min-w-[1024px]">
        <TableHeader />
        {expense.map((item) => (
          <ListItem
            key={item.expense_id}
            item={item}
            isSelected={selectedItems.has(item.expense_id)}
            onSelect={() => handleItemSelect(item.expense_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListView;
