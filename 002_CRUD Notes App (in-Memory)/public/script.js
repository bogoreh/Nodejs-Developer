class NotesApp {
    constructor() {
        this.currentNoteId = null;
        this.initializeElements();
        this.bindEvents();
        this.loadNotes();
    }

    initializeElements() {
        // Form elements
        this.noteForm = document.getElementById('noteForm');
        this.titleInput = document.getElementById('title');
        this.contentInput = document.getElementById('content');
        this.cancelEditBtn = document.getElementById('cancelEdit');
        
        // Notes container
        this.notesContainer = document.getElementById('notesContainer');
        this.emptyState = document.getElementById('emptyState');
        
        // Modal elements
        this.deleteModal = document.getElementById('deleteModal');
        this.confirmDeleteBtn = document.getElementById('confirmDelete');
        this.cancelDeleteBtn = document.getElementById('cancelDelete');
    }

    bindEvents() {
        // Form submission
        this.noteForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Cancel edit
        this.cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        
        // Modal events
        this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.hideDeleteModal();
            }
        });
    }

    async loadNotes() {
        try {
            const response = await fetch('/api/notes');
            const notes = await response.json();
            this.renderNotes(notes);
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showNotification('Failed to load notes', 'error');
        }
    }

    renderNotes(notes) {
        if (notes.length === 0) {
            this.emptyState.style.display = 'block';
            this.notesContainer.innerHTML = '';
            this.notesContainer.appendChild(this.emptyState);
            return;
        }

        this.emptyState.style.display = 'none';
        
        const notesGrid = document.createElement('div');
        notesGrid.className = 'notes-grid';
        
        notes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            notesGrid.appendChild(noteElement);
        });
        
        this.notesContainer.innerHTML = '';
        this.notesContainer.appendChild(notesGrid);
    }

    createNoteElement(note) {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.dataset.id = note.id;
        
        const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        noteCard.innerHTML = `
            <h3>${this.escapeHtml(note.title)}</h3>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-meta">
                <span><i class="far fa-clock"></i> ${formattedDate}</span>
                ${note.updatedAt !== note.createdAt ? '<span><i class="fas fa-edit"></i> Edited</span>' : ''}
            </div>
            <div class="note-actions">
                <button class="btn btn-edit" onclick="app.editNote(${note.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="app.showDeleteModal(${note.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        return noteCard;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const title = this.titleInput.value.trim();
        const content = this.contentInput.value.trim();
        
        if (!title || !content) {
            this.showNotification('Please fill in both title and content', 'warning');
            return;
        }
        
        const noteData = { title, content };
        
        try {
            if (this.currentNoteId) {
                // Update existing note
                await this.updateNote(this.currentNoteId, noteData);
            } else {
                // Create new note
                await this.createNote(noteData);
            }
            
            this.resetForm();
            this.loadNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            this.showNotification('Failed to save note', 'error');
        }
    }

    async createNote(noteData) {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create note');
        }
        
        this.showNotification('Note created successfully!', 'success');
        return await response.json();
    }

    async updateNote(id, noteData) {
        const response = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update note');
        }
        
        this.showNotification('Note updated successfully!', 'success');
        return await response.json();
    }

    async deleteNote(id) {
        const response = await fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
        
        this.showNotification('Note deleted successfully!', 'success');
        return await response.json();
    }

    async editNote(id) {
        try {
            const response = await fetch(`/api/notes/${id}`);
            const note = await response.json();
            
            this.titleInput.value = note.title;
            this.contentInput.value = note.content;
            this.currentNoteId = note.id;
            
            this.cancelEditBtn.style.display = 'inline-flex';
            
            // Scroll to form
            this.noteForm.scrollIntoView({ behavior: 'smooth' });
            this.titleInput.focus();
            
            this.showNotification('You are now editing the note', 'info');
        } catch (error) {
            console.error('Error loading note for edit:', error);
            this.showNotification('Failed to load note for editing', 'error');
        }
    }

    cancelEdit() {
        this.resetForm();
        this.showNotification('Edit cancelled', 'info');
    }

    resetForm() {
        this.noteForm.reset();
        this.currentNoteId = null;
        this.cancelEditBtn.style.display = 'none';
    }

    showDeleteModal(id) {
        this.currentNoteId = id;
        this.deleteModal.style.display = 'flex';
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
        this.currentNoteId = null;
    }

    async confirmDelete() {
        if (this.currentNoteId) {
            try {
                await this.deleteNote(this.currentNoteId);
                this.loadNotes();
                this.hideDeleteModal();
            } catch (error) {
                console.error('Error deleting note:', error);
                this.showNotification('Failed to delete note', 'error');
                this.hideDeleteModal();
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }
            
            .notification-success {
                background-color: var(--success-color);
            }
            
            .notification-error {
                background-color: var(--danger-color);
            }
            
            .notification-warning {
                background-color: var(--warning-color);
            }
            
            .notification-info {
                background-color: var(--primary-color);
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 15px;
                font-size: 1.2rem;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NotesApp();
});