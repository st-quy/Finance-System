import React, { useState } from 'react';
import { sampleTransactionData } from "./TransactionListData.js";

const BudgetBar = ({ category, index }) => (
  <div
    className={`flex w-full h-8 ${category.color}`}
    role="img"
    aria-label={`${category.name} budget: ${category.percentage}%`}
  />
);

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
    <div className="flex-none w-32 p-4">{item.id}</div>
    <div className="flex-1 p-4">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-medium">{item.expense.name}</div>
          <div className="text-sm text-slate-500">{item.expense.additionalProducts}</div>
        </div>
      </div>
    </div>
    <div className="flex-none w-32 p-4">{item.date}</div>
    <div className="flex-1 p-4">
      <div className="font-medium">{item.description.name}</div>
      <div className="text-sm text-slate-500">{item.description.email}</div>
    </div>
    <div className="flex-none w-32 p-4">{item.amount}</div>
    <div className="flex-none w-32 p-4">{item.category}</div>
    <div className="flex-none w-32 p-4">
      <span className={`px-2 py-1 rounded-lg ${item.type === 'Income' ? 'bg-cyan-50 text-green-500' : 'bg-rose-50 text-rose-500'
        }`}>
        {item.type}
      </span>
    </div>
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
    <div className="flex-none w-32 p-4">ID</div>
    <div className="flex-1 p-4">Expense</div>
    <div className="flex-none w-32 p-4">Date</div>
    <div className="flex-1 p-4">Description</div>
    <div className="flex-none w-32 p-4">Amount</div>
    <div className="flex-none w-32 p-4">Category</div>
    <div className="flex-none w-32 p-4">Type</div>
  </div>
);

// Sample data
const sampleData = [
  {
    id: "#302012",
    expense: {
      name: "Handmade Pouch",
      additionalProducts: "+3 other products",
      image: "/api/placeholder/40/40"
    },
    date: "2024/12/21",
    description: {
      name: "Ilham Budi A",
      email: "ilahmbudi@mail.com"
    },
    amount: "$1,201.00",
    category: "Deposit",
    type: "Income"
  },
  {
    id: "#302013",
    expense: {
      name: "Digital Camera",
      additionalProducts: "+1 other product",
      image: "/api/placeholder/40/40"
    },
    date: "2024/12/20",
    description: {
      name: "Sarah Connor",
      email: "sarah.c@mail.com"
    },
    amount: "$899.00",
    category: "Electronics",
    type: "Expense"
  }
];

const ListView = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sampleTransactionData.length / itemsPerPage);

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
        {sampleTransactionData.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={() => handleItemSelect(item.id)}
          />
        ))}
        <div className="flex justify-between items-center p-4 bg-white border-t border-zinc-200">
          <div className="text-sm text-slate-500">
            Showing {Math.min(itemsPerPage, sampleTransactionData.length)} of {sampleTransactionData.length} items
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-indigo-800 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-indigo-800 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;