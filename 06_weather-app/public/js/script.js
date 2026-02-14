// Add loading state to form
document.getElementById('weatherForm').addEventListener('submit', function(e) {
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>Searching...</span> <span class="search-icon">⏳</span>';
    button.disabled = true;
    
    // Re-enable after 5 seconds (in case of network issues)
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 5000);
});

// Auto-capitalize city input
document.getElementById('cityInput').addEventListener('input', function(e) {
    let value = e.target.value;
    if (value.length > 0) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
        e.target.value = value;
    }
});

// Add animation to weather details
document.addEventListener('DOMContentLoaded', function() {
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        item.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s both`;
    });
});