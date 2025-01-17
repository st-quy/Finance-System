import React, { useState, useEffect } from 'react';
import { Space, Button, Input, DatePicker, Cascader, Modal, message, Table, Checkbox, Pagination } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from '../../../supabaseClient';
import ExpenseFilter from '../ExpenseFilter/expenseFilter';
import dayjs from 'dayjs';
import ExpenseAdd from '../ExpenseList/Add/ExpenseAdd';

const ListView = ({ projectId }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
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
      .eq("project_id", projectId)
      .order('expense_date', { ascending: false }); // Add this line for default sorting

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allIds = filteredExpenses.map(expense => expense.expense_id);
      setSelectedItems(new Set(allIds));
    }
    setSelectAll(!selectAll);
  };

  const handleItemSelect = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredExpenses.length);
  };

  const handleDeleteSelected = async () => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will permanently delete the selected expenses.',
      okText: 'Yes, delete them',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const idsToDelete = Array.from(selectedItems);
          let { error } = await supabase
            .from("expense")
            .delete()
            .in("expense_id", idsToDelete);

          if (error) {
            message.error('Failed to delete the selected expenses.');
            console.error('Error deleting expenses:', error);
          } else {
            fetchExpenses();
            setSelectedItems(new Set());
            message.success('Selected expenses deleted successfully.');
          }
        } catch (error) {
          console.error('Error in handleDeleteSelected:', error);
        }
      },
    });
  };

  const handleSave = async (record) => {
    const { error } = await supabase
      .from("expense")
      .update({
        expense_date: editedItem.expense_date,
        category: editedItem.category,
        description: editedItem.description,
        amount: editedItem.amount
      })
      .eq("expense_id", record.expense_id);

    if (error) {
      message.error("Failed to update expense");
    } else {
      message.success("Expense updated successfully");
      setEditingId(null);
      fetchExpenses();
    }
  };

  const columns = [
    {
      title: <Checkbox 
        checked={selectAll}
        onChange={handleSelectAll}
      />,
      dataIndex: 'select',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedItems.has(record.expense_id)}
          onChange={(e) => handleItemSelect(record.expense_id)}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'expense_id',
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (text, record) => {
        if (editingId === record.expense_id) {
          return (
            <Cascader
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Personnel', label: 'Personnel' }
              ]}
              onChange={(value) => setEditedItem({ ...editedItem, category: value[0] })}
              defaultValue={[text]}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'Date',
      dataIndex: 'expense_date',
      sorter: (a, b) => new Date(b.expense_date) - new Date(a.expense_date),
      defaultSortOrder: 'descend',
      render: (text, record) => {
        if (editingId === record.expense_id) {
          return (
            <DatePicker
              defaultValue={dayjs(text)}
              onChange={(date, dateString) => 
                setEditedItem({ ...editedItem, expense_date: dateString })}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text, record) => {
        if (editingId === record.expense_id) {
          return (
            <Input
              defaultValue={text}
              onChange={(e) => 
                setEditedItem({ ...editedItem, description: e.target.value })}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text, record) => {
        if (editingId === record.expense_id) {
          return (
            <Input
              defaultValue={text}
              onChange={(e) => 
                setEditedItem({ ...editedItem, amount: e.target.value })}
            />
          );
        }
        return `$${text}`;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {editingId === record.expense_id ? (
            <>
              <Button 
                icon={<SaveOutlined />} 
                onClick={() => handleSave(record)} 
              />
              <Button 
                onClick={() => {
                  setEditingId(null);
                  setEditedItem(null);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingId(record.expense_id);
                setEditedItem({ ...record });
              }}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.expense_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      <ExpenseFilter
        onFilterChange={handleFilterChange}
        onAddExpense={() => setIsAdding(true)}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedItems.size}
      />

      {isAdding && (
        <div className="w-full border border-solid border-zinc-200 rounded-lg p-4 bg-white">
          <ExpenseAdd
            projectId={projectId}
            onAdd={() => {
              fetchExpenses();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <div className="border bg-white border-solid border-zinc-200 rounded-lg overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredExpenses}
          rowKey="expense_id"
          pagination={{
            position: ['bottomCenter'],
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredExpenses.length,
            onChange: handlePageChange,
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ListView;