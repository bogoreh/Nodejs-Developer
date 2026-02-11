const fs = require('fs').promises;
const path = require('path');

const NOTES_DIR = path.join(__dirname, '..', 'notes');

// Ensure notes directory exists
const ensureNotesDir = async () => {
    try {
        await fs.access(NOTES_DIR);
    } catch (error) {
        await fs.mkdir(NOTES_DIR, { recursive: true });
    }
};

// Save a note to file
const saveNote = async (title, content) => {
    try {
        await ensureNotesDir();
        const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
        const filePath = path.join(NOTES_DIR, fileName);
        
        const note = {
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await fs.writeFile(filePath, JSON.stringify(note, null, 2));
        return { success: true, fileName };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get all notes
const getAllNotes = async () => {
    try {
        await ensureNotesDir();
        const files = await fs.readdir(NOTES_DIR);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        const notes = [];
        for (const file of jsonFiles) {
            const filePath = path.join(NOTES_DIR, file);
            const content = await fs.readFile(filePath, 'utf8');
            notes.push(JSON.parse(content));
        }
        
        return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        return [];
    }
};

// Read a specific note
const getNote = async (title) => {
    try {
        await ensureNotesDir();
        const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
        const filePath = path.join(NOTES_DIR, fileName);
        
        const content = await fs.readFile(filePath, 'utf8');
        return { success: true, note: JSON.parse(content) };
    } catch (error) {
        return { success: false, error: 'Note not found' };
    }
};

// Remove a note
const removeNote = async (title) => {
    try {
        await ensureNotesDir();
        const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
        const filePath = path.join(NOTES_DIR, fileName);
        
        await fs.unlink(filePath);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Note not found' };
    }
};

module.exports = {
    saveNote,
    getAllNotes,
    getNote,
    removeNote
};