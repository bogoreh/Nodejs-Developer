const express = require('express');
const router = express.Router();
const { 
    saveNote, 
    getAllNotes, 
    getNote, 
    removeNote 
} = require('../utils/fileManager');

// GET all notes
router.get('/', async (req, res) => {
    try {
        const notes = await getAllNotes();
        res.json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single note
router.get('/:title', async (req, res) => {
    try {
        const result = await getNote(req.params.title);
        if (result.success) {
            res.json({ success: true, note: result.note });
        } else {
            res.status(404).json({ success: false, error: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create note
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ 
                success: false, 
                error: 'Title and content are required' 
            });
        }
        
        const result = await saveNote(title, content);
        if (result.success) {
            res.status(201).json({ 
                success: true, 
                message: 'Note created successfully',
                fileName: result.fileName 
            });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE note
router.delete('/:title', async (req, res) => {
    try {
        const result = await removeNote(req.params.title);
        if (result.success) {
            res.json({ success: true, message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ success: false, error: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;