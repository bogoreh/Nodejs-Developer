const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
} = require('../controllers/taskController');

// Validation middleware
const validateTask = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'done']).withMessage('Status must be either pending or done'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

const validateId = [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

// Routes
router.route('/')
    .get(getTasks)
    .post(validateTask, createTask);

router.route('/:id')
    .get(validateId, getTask)
    .put(validateId, validateTask, updateTask)
    .delete(validateId, deleteTask);

router.patch('/:id/toggle', validateId, toggleTaskStatus);

module.exports = router;