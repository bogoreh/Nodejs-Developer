const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for notes
let notes = [];
let currentId = 1;

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Routes

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Get single note
app.get('/api/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

// Create new note
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const newNote = {
        id: currentId++,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    res.status(201).json(newNote);
});

// Update note
app.put('/api/notes/:id', (req, res) => {
    const { title, content } = req.body;
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    
    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    
    notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        content,
        updatedAt: new Date().toISOString()
    };
    
    res.json(notes[noteIndex]);
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    
    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    const deletedNote = notes.splice(noteIndex, 1)[0];
    res.json({ message: 'Note deleted successfully', note: deletedNote });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Notes app is ready!`);
});