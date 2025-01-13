import React, { useState } from "react";
import { Button, Input, DatePicker, Space, Cascader } from "antd";
import dayjs from "dayjs";
import { supabase } from "../../../../supabaseClient";

const ExpenseAdd = ({ projectId, onAdd, onCancel }) => {
  const [newTransaction, setNewTransaction] = useState({
    expense_id: "",
    category: "",
    expense_date: dayjs().format("YYYY-MM-DD"),
    description: "",
    amount: "",
    project_id: projectId
  });

  const handleInputChange = (field, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTransaction = async () => {
    const { error } = await supabase
      .from("expense")
      .insert([newTransaction]);

    if (error) {
      console.error("Error adding transaction:", error);
    } else {
      onAdd(); // Notify parent to refresh data
      setNewTransaction({
        expense_id: "",
        category: "",
        expense_date: dayjs().format("YYYY-MM-DD"),
        description: "",
        amount: "",
        project_id: projectId
      });
    }
  };

  return (
    <div className="flex w-full border-b border-zinc-200 bg-gray-100">
      <div className="flex-none w-32 p-4">
        <Input
          placeholder="Expense ID"
          value={newTransaction.expense_id}
          onChange={(e) => handleInputChange("expense_id", e.target.value)}
        />
      </div>
      <div className="flex-1 p-4">
        <Cascader 
            options={[
              { value: 'Operations', label: 'Operations' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Technology', label: 'Technology' },
              { value: 'Personnel', label: 'Personnel' }
            ]}
            onChange={(value) => handleInputChange("category", value[0])}
            placeholder="Select category"
          />
      </div>
      <div className="flex-none w-32 p-4">
        <DatePicker
          value={dayjs(newTransaction.expense_date)}
          onChange={(date, dateString) =>
            handleInputChange("expense_date", dateString)
          }
          format="YYYY-MM-DD"
        />
      </div>
      <div className="flex-1 p-4">
        <Input
          placeholder="Description"
          value={newTransaction.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div className="flex-none w-32 p-4">
        <Input
          placeholder="Amount"
          type="number"
          value={newTransaction.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
        />
      </div>
      <div className="flex-none w-32 p-4">
        <Space>
          <Button type="primary" onClick={handleAddTransaction}>
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </div>
    </div>
  );
};

export default ExpenseAdd;
