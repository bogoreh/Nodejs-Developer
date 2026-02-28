const API_BASE = '/api';
let urls = [];

// DOM Elements
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const result = document.getElementById('result');
const shortUrlElement = document.getElementById('shortUrl');
const originalUrlElement = document.getElementById('originalUrl');
const copyBtn = document.getElementById('copyBtn');
const urlListContainer = document.getElementById('urlListContainer');
const urlCount = document.getElementById('urlCount');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Event Listeners
shortenBtn.addEventListener('click', shortenUrl);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') shortenUrl();
});
copyBtn.addEventListener('click', copyToClipboard);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUrls();
});

// Functions
async function shortenUrl() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showToast('Please enter a URL');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResult(data);
            urlInput.value = '';
            fetchUrls(); // Refresh the list
            showToast('URL shortened successfully!');
        } else {
            showToast(data.error || 'Failed to shorten URL');
        }
    } catch (error) {
        showToast('Error: Could not connect to server');
        console.error('Error:', error);
    }
}

function showResult(data) {
    shortUrlElement.textContent = data.shortUrl;
    shortUrlElement.href = data.shortUrl;
    originalUrlElement.textContent = data.originalUrl;
    result.classList.remove('hidden');
}

async function copyToClipboard() {
    const text = shortUrlElement.textContent;
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
        
        // Visual feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
    } catch (err) {
        showToast('Failed to copy');
    }
}

async function fetchUrls() {
    try {
        const response = await fetch(`${API_BASE}/urls`);
        urls = await response.json();
        renderUrlList();
        updateUrlCount();
    } catch (error) {
        console.error('Error fetching URLs:', error);
    }
}

function renderUrlList() {
    if (!urlListContainer) return;
    
    if (urls.length === 0) {
        urlListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <h3>No URLs yet</h3>
                <p>Shorten your first URL above!</p>
            </div>
        `;
        return;
    }
    
    urlListContainer.innerHTML = urls.map(url => `
        <div class="url-item">
            <div class="url-info">
                <div class="url-short">
                    <a href="${url.shortUrl}" target="_blank">${url.shortUrl}</a>
                </div>
                <div class="url-original" title="${url.originalUrl}">
                    ${url.originalUrl}
                </div>
            </div>
            <div class="url-stats">
                <span class="clicks-badge">
                    <i class="fas fa-eye"></i>
                    ${url.metadata.clicks || 0}
                </span>
                <button onclick="deleteUrl('${url.shortCode}')" class="delete-btn" title="Delete URL">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateUrlCount() {
    if (urlCount) {
        urlCount.textContent = urls.length;
    }
}

async function deleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this URL?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/urls/${shortCode}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchUrls();
            showToast('URL deleted successfully');
        } else {
            showToast('Failed to delete URL');
        }
    } catch (error) {
        console.error('Error deleting URL:', error);
        showToast('Error deleting URL');
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Make deleteUrl globally accessible
window.deleteUrl = deleteUrl;