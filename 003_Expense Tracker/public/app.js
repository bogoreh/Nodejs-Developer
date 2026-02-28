// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');
const totalAmount = document.getElementById('totalAmount');
const totalItems = document.getElementById('totalItems');
const topCategory = document.getElementById('topCategory');
const periodButtons = document.querySelectorAll('.period-btn');

// Chart instances
let categoryChart = null;
let dailyChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    loadExpenses();
    loadCharts();
    
    // Period filter event listeners
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadExpenses(button.dataset.period);
        });
    });
});

// Load expenses from server
async function loadExpenses(period = 'all') {
    try {
        const response = await fetch('/api/expenses');
        const expenses = await response.json();
        
        // Filter expenses based on period
        let filteredExpenses = expenses;
        const now = new Date();
        
        if (period === 'month') {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            filteredExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            });
        } else if (period === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredExpenses = expenses.filter(expense => {
                return new Date(expense.date) >= oneWeekAgo;
            });
        }
        
        displayExpenses(filteredExpenses);
        updateDashboard(filteredExpenses);
    } catch (error) {
        console.error('Error loading expenses:', error);
        expensesList.innerHTML = '<div class="error">Failed to load expenses. Please try again.</div>';
    }
}

// Display expenses in the list
function displayExpenses(expenses) {
    if (expenses.length === 0) {
        expensesList.innerHTML = '<div class="loading">No expenses found. Add your first expense!</div>';
        return;
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    expensesList.innerHTML = sortedExpenses.map(expense => `
        <div class="expense-item" data-id="${expense.id}">
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">
                    <span class="expense-date">${formatDate(expense.date)}</span>
                    <span class="expense-category">${expense.category}</span>
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Update dashboard with summary
function updateDashboard(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = expenses.length;
    
    totalAmount.textContent = `$${total.toFixed(2)}`;
    totalItems.textContent = count;
    
    // Find top category
    if (expenses.length > 0) {
        const categories = {};
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });
        
        const topCategoryName = Object.entries(categories)
            .sort(([,a], [,b]) => b - a)[0][0];
        topCategory.textContent = topCategoryName;
    } else {
        topCategory.textContent = '-';
    }
}

// Load and display charts
async function loadCharts() {
    try {
        const [categoriesData, summaryData] = await Promise.all([
            fetch('/api/expenses/categories').then(r => r.json()),
            fetch('/api/expenses/summary').then(r => r.json())
        ]);
        
        createCategoryChart(categoriesData);
        createDailyChart(summaryData);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Create category pie chart
function createCategoryChart(categories) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ];
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                data: categories.map(c => c.total),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                    }
                }
            }
        }
    });
}

// Create daily expenses line chart
function createDailyChart(dailyData) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    
    if (dailyChart) {
        dailyChart.destroy();
    }
    
    // Sort data by date
    const sortedData = [...dailyData].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedData.map(d => formatDate(d.date, true)),
            datasets: [{
                label: 'Daily Expenses',
                data: sortedData.map(d => d.total),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: value => '$' + value
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Add new expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const expense = {
        description: document.getElementById('description').value.trim(),
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };
    
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
        
        if (response.ok) {
            const newExpense = await response.json();
            
            // Reset form
            expenseForm.reset();
            document.getElementById('date').valueAsDate = new Date();
            
            // Reload data
            const activePeriod = document.querySelector('.period-btn.active').dataset.period;
            loadExpenses(activePeriod);
            loadCharts();
            
            // Show success message (you could add a toast notification here)
            alert('Expense added successfully!');
        } else {
            alert('Failed to add expense. Please try again.');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense. Please check your connection.');
    }
});

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Reload data
            const activePeriod = document.querySelector('.period-btn.active').dataset.period;
            loadExpenses(activePeriod);
            loadCharts();
        } else {
            alert('Failed to delete expense.');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
    }
}

// Utility function to format dates
function formatDate(dateString, short = false) {
    const date = new Date(dateString);
    
    if (short) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}