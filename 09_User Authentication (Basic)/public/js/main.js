// Handle registration form
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const alertDiv = document.getElementById('alert');
      
      // Disable button to prevent double submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering...';
      
      const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
      };
      
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        return;
      }
      
      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showAlert('Registration successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          showAlert(data.error || 'Registration failed', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Register';
        }
      } catch (error) {
        showAlert('An error occurred. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
      }
    });
  }
  
  // Handle login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const alertDiv = document.getElementById('alert');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';
      
      const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };
      
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          showAlert(data.error || 'Login failed', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }
      } catch (error) {
        showAlert('An error occurred. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
});

// Helper function to show alerts
function showAlert(message, type) {
  const alertDiv = document.getElementById('alert');
  if (alertDiv) {
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type} show`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
    }, 5000);
  }
}

// Check authentication status
async function checkAuth() {
  try {
    const response = await fetch('/auth/status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
}