import React, { useState, useEffect } from 'react';
import { Space, Button, Pagination, Input, DatePicker, Cascader } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from '../../../supabaseClient';
import ExpenseFilter from '../ExpenseFilter/expenseFilter';
import dayjs from 'dayjs';
import ExpenseAdd from '../ExpenseList/Add/ExpenseAdd';

const ListItem = ({ item, isSelected, onSelect, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleInputChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Update the item in the database
    const { error } = await supabase
      .from("expense")
      .update({
        expense_date: editedItem.expense_date,
        category: editedItem.category,
        description: editedItem.description,
        amount: editedItem.amount
      })
      .eq("expense_id", item.expense_id);

    if (error) {
      console.error("Error updating expense:", error);
    } else {
      onUpdate();
      setIsEditing(false);
    }
  };

  return (
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
      <div className="flex-1 p-4">
        {isEditing ? (
          <Cascader 
            options={[
              { value: 'Operations', label: 'Operations' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Technology', label: 'Technology' },
              { value: 'Personnel', label: 'Personnel' }
            ]}
            onChange={(value) => handleInputChange("category", value[0])}
            placeholder={item.category}
          />
        ) : (
          item.category
        )}
      </div>
      <div className="flex-none w-32 p-4">

        {isEditing ? (
          <DatePicker
            value={dayjs(editedItem.expense_date)}
            onChange={(date, dateString) => handleInputChange("expense_date", dateString)}
            format="YYYY-MM-DD"
            needConfirm />
        ) : (
          item.expense_date
        )}
      </div>
      <div className="flex-1 p-4">
        {isEditing ? (
          <Input
            value={editedItem.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        ) : (
          item.description
        )}
      </div>
      <div className="flex-none w-32 p-4">
        {isEditing ? (
          <Input
            value={editedItem.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        ) : (
          "$" + item.amount
        )}
      </div>
      <div className="flex-none w-32 p-4">
        <Space>
          {isEditing ? (
            <>
              <Button icon={<SaveOutlined />} onClick={handleSave} />
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} />
          )}
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(item.expense_id)}
          />
        </Space>
      </div>
    </div>
  );
};

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

const ListView = ({ projectId }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  async function fetchExpenses() {
    let { data: expense, error } = await supabase
      .from("expense")
      .select("*")
      .eq("project_id", projectId);

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
        return expenseDate >= dateRange.start && dateRange.end;
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
      <ExpenseFilter onFilterChange={handleFilterChange} onAddExpense={() => setIsAdding(true)} />

      <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 shadow-lg">
        <div className="min-w-[1024px]">
          <TableHeader />
          {isAdding && (
            <ExpenseAdd
              projectId={projectId}
              onAdd={() => {
                fetchExpenses();
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          )}
          {paginatedExpenses.map((item) => (
            <ListItem
              key={item.expense_id}
              item={item}
              isSelected={selectedItems.has(item.expense_id)}
              onSelect={() => handleItemSelect(item.expense_id)}
              onDelete={fetchExpenses}
              onUpdate={fetchExpenses}
            />
          ))}
        </div>
      </div>
      <Pagination
        defaultCurrent={1}
        total={filteredExpenses.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default ListView;