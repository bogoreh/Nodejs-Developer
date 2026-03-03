const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch users...');
        const users = await User.find().sort({ createdAt: -1 });
        console.log(`Successfully fetched ${users.length} users`);
        res.render('index', { 
            users: users,
            title: 'User Management System'
        });
    } catch (err) {
        console.error('Error fetching users:', err.message);
        console.error('Full error:', err);
        
        // Check for specific MongoDB errors
        if (err.name === 'MongoNetworkError') {
            return res.status(500).render('error', {
                title: 'Database Connection Error',
                message: 'Cannot connect to MongoDB. Please make sure MongoDB is running.',
                error: err
            });
        }
        
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error fetching users from database',
            error: err
        });
    }
});

// GET add user form
router.get('/add', (req, res) => {
    res.render('add-user', { 
        title: 'Add New User',
        error: null,
        user: null
    });
});

// POST create new user
router.post('/add', async (req, res) => {
    try {
        console.log('Creating new user:', req.body);
        
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            city: req.body.city,
            occupation: req.body.occupation
        });
        
        await newUser.save();
        console.log('User created successfully:', newUser);
        res.redirect('/');
    } catch (err) {
        console.error('Error creating user:', err);
        
        if (err.name === 'ValidationError') {
            return res.render('add-user', {
                title: 'Add New User',
                error: Object.values(err.errors).map(e => e.message).join(', '),
                user: req.body
            });
        }
        
        if (err.code === 11000) {
            return res.render('add-user', {
                title: 'Add New User',
                error: 'Email already exists. Please use a different email.',
                user: req.body
            });
        }
        
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error creating user',
            error: err
        });
    }
});

// GET edit user form
router.get('/edit/:id', async (req, res) => {
    try {
        console.log('Fetching user for edit:', req.params.id);
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).render('error', {
                title: 'Invalid ID',
                message: 'Invalid user ID format',
                error: null
            });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', {
                title: 'User Not Found',
                message: 'User not found in database',
                error: null
            });
        }
        
        res.render('edit-user', {
            title: 'Edit User',
            user: user,
            error: null
        });
    } catch (err) {
        console.error('Error fetching user for edit:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error fetching user details',
            error: err
        });
    }
});

// PUT update user
router.put('/edit/:id', async (req, res) => {
    try {
        console.log('Updating user:', req.params.id, req.body);
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid user ID format');
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                city: req.body.city,
                occupation: req.body.occupation
            },
            { 
                new: true,
                runValidators: true 
            }
        );
        
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        console.log('User updated successfully:', user);
        res.redirect('/');
    } catch (err) {
        console.error('Error updating user:', err);
        
        if (err.name === 'ValidationError') {
            const user = req.body;
            user._id = req.params.id;
            return res.render('edit-user', {
                title: 'Edit User',
                user: user,
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        
        if (err.code === 11000) {
            const user = req.body;
            user._id = req.params.id;
            return res.render('edit-user', {
                title: 'Edit User',
                user: user,
                error: 'Email already exists'
            });
        }
        
        res.status(500).send('Error updating user');
    }
});

// DELETE user
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Deleting user:', req.params.id);
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid user ID format');
        }
        
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        console.log('User deleted successfully');
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

module.exports = router;