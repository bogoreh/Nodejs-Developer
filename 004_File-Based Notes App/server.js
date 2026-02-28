const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/notes', notesRouter);

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✨ Notes app running at http://localhost:${PORT}`);
    console.log(`📝 Your notes are saved in: ${path.join(__dirname, 'notes')}`);
});