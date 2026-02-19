const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// API Routes
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Task Manager API',
        version: '1.0.0',
        endpoints: {
            getAllTasks: {
                method: 'GET',
                url: '/api/tasks',
                description: 'Get all tasks (optional query: ?status=pending/done&sort=newest/oldest/title)'
            },
            getTaskById: {
                method: 'GET',
                url: '/api/tasks/:id',
                description: 'Get a single task by ID'
            },
            createTask: {
                method: 'POST',
                url: '/api/tasks',
                description: 'Create a new task',
                body: {
                    title: 'string (required)',
                    description: 'string (required)',
                    status: 'string (optional, default: "pending")'
                }
            },
            updateTask: {
                method: 'PUT',
                url: '/api/tasks/:id',
                description: 'Update a task'
            },
            toggleStatus: {
                method: 'PATCH',
                url: '/api/tasks/:id/toggle',
                description: 'Toggle task status between pending and done'
            },
            deleteTask: {
                method: 'DELETE',
                url: '/api/tasks/:id',
                description: 'Delete a task'
            }
        }
    });
});

// 404 handler for undefined routes - FIXED VERSION
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;