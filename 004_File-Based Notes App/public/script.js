// DOM Elements
const noteForm = document.getElementById('noteForm');
const notesContainer = document.getElementById('notesContainer');
const notification = document.getElementById('notification');
const noteModal = document.getElementById('noteModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalDate = document.getElementById('modalDate');
const noteCount = document.getElementById('noteCount');

let currentNoteTitle = '';

// Load notes on page load
document.addEventListener('DOMContentLoaded', loadNotes);

// Form submission
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const submitBtn = noteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('✨ Note created successfully!', 'success');
            noteForm.reset();
            loadNotes();
        } else {
            showNotification(data.error || 'Failed to create note', 'error');
        }
    } catch (error) {
        showNotification('Error creating note', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Load all notes
async function loadNotes() {
    notesContainer.innerHTML = '<div class="loading-message">Loading your notes</div>';
    
    try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        
        if (data.success && data.notes) {
            displayNotes(data.notes);
            updateNoteCount(data.notes.length);
        } else {
            notesContainer.innerHTML = '<div class="empty-state">No notes yet. Create your first note!</div>';
        }
    } catch (error) {
        notesContainer.innerHTML = '<div class="empty-state">Error loading notes. Please refresh.</div>';
        console.error('Error:', error);
    }
}

// Display notes in grid
function displayNotes(notes) {
    if (!notes || notes.length === 0) {
        notesContainer.innerHTML = '<div class="empty-state">No notes yet. Create your first note!</div>';
        return;
    }
    
    notesContainer.innerHTML = notes.map(note => {
        const date = new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const preview = note.content.substring(0, 120) + (note.content.length > 120 ? '...' : '');
        
        return `
            <div class="note-card" onclick="openNote('${note.title.replace(/'/g, "\\'")}')">
                <h3>📌 ${escapeHtml(note.title)}</h3>
                <div class="note-date">
                    <span>📅 ${date}</span>
                </div>
                <div class="note-preview">${escapeHtml(preview)}</div>
                <div class="note-footer">
                    <button class="delete-btn" onclick="deleteNote('${note.title.replace(/'/g, "\\'")}', event)">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open note in modal
async function openNote(title) {
    try {
        const response = await fetch(`/api/notes/${encodeURIComponent(title)}`);
        const data = await response.json();
        
        if (data.success) {
            currentNoteTitle = data.note.title;
            modalTitle.textContent = `📌 ${data.note.title}`;
            modalContent.textContent = data.note.content;
            
            const date = new Date(data.note.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            modalDate.innerHTML = `📅 Created: ${date}`;
            noteModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        showNotification('Error opening note', 'error');
        console.error('Error:', error);
    }
}

// Close modal
function closeModal() {
    noteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentNoteTitle = '';
}

// Delete current note from modal
async function deleteCurrentNote() {
    if (currentNoteTitle) {
        await deleteNote(currentNoteTitle);
        closeModal();
    }
}

// Delete note
async function deleteNote(title, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/notes/${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('🗑️ Note deleted successfully!', 'info');
            loadNotes();
        } else {
            showNotification(data.error || 'Failed to delete note', 'error');
        }
    } catch (error) {
        showNotification('Error deleting note', 'error');
        console.error('Error:', error);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update note count
function updateNoteCount(count) {
    if (noteCount) {
        noteCount.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === noteModal) {
        closeModal();
    }
}

// Escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && noteModal.style.display === 'block') {
        closeModal();
    }
});