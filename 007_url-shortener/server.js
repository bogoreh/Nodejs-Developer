const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 5000;

// In-memory storage for URLs
const urlMap = new Map();
// Store creation times for analytics
const urlMetadata = new Map();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Helper function to generate short code
function generateShortCode() {
    return nanoid(6); // 6 character unique ID
}

// API Routes

// Shorten URL
app.post('/api/shorten', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Generate unique short code
    let shortCode;
    do {
        shortCode = generateShortCode();
    } while (urlMap.has(shortCode));
    
    // Store URL and metadata
    urlMap.set(shortCode, url);
    urlMetadata.set(shortCode, {
        createdAt: new Date(),
        clicks: 0,
        originalUrl: url
    });
    
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    
    res.json({
        shortCode,
        shortUrl,
        originalUrl: url
    });
});

// Get all shortened URLs
app.get('/api/urls', (req, res) => {
    const urls = Array.from(urlMap.entries()).map(([code, url]) => ({
        shortCode: code,
        originalUrl: url,
        shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
        metadata: urlMetadata.get(code) || { clicks: 0 }
    }));
    
    res.json(urls);
});

// Redirect to original URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const originalUrl = urlMap.get(shortCode);
    
    if (originalUrl) {
        // Update click count
        const metadata = urlMetadata.get(shortCode);
        if (metadata) {
            metadata.clicks += 1;
            metadata.lastAccessed = new Date();
            urlMetadata.set(shortCode, metadata);
        }
        
        res.redirect(originalUrl);
    } else {
        res.status(404).sendFile(__dirname + '/public/404.html');
    }
});

// Delete URL
app.delete('/api/urls/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    
    if (urlMap.has(shortCode)) {
        urlMap.delete(shortCode);
        urlMetadata.delete(shortCode);
        res.json({ message: 'URL deleted successfully' });
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 URL Shortener running at http://localhost:${PORT}`);
});