import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) {
                    console.error("No token found in local storage.");
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                });
                setExpenses(response.data);
                const total = response.data.reduce((acc, expense) => acc + expense.amount, 0);
                setTotalAmount(total);
            } catch (error) {
                console.error('Failed to fetch expenses:', error);
            }
        };

        fetchExpenses();
    }, []);
 
    useEffect(() => {
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalAmount(total);
    }, [expenses]);
    const handleDelete = async (id) => {
        console.log('Deleting expense with ID:', id);
        if (id) {
            try {
                const token = localStorage.getItem('token'); 
                await axios.delete(`http://localhost:8000/api/expenses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }, 
                });
                setExpenses(expenses.filter(expense => expense._id !== id));
            } catch (error) {
                console.error('Failed to delete expense:', error);
            }
        } else {
            console.error('No ID provided for deletion');
        }
    };
    
    return (
       <div className="Expensecontainer mt-5">
        <h2 className="mb-4 text-start">Expense List</h2>
        <table className="table table-striped table-hover border shadow">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Comments</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by Created At date
              .map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.category}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{expense.comments || "N/A"}</td>
                  <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(expense.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="btn btn-danger btn-sm me-2">Delete</button>
                    <button onClick={() => navigate(`/edit-expense`, { state: { expense } })} className="btn btn-primary btn-sm">Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <h4 className="text-start mt-4">
          Total Amount: <span className="text-success">${totalAmount.toFixed(2)}</span>
        </h4>
      </div>
    );
};
export default ExpenseList;
