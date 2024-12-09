document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('submitButton');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const usersList = document.getElementById('usersList');

  const validateUsername = () => {
    const error = document.getElementById('usernameError');
    if (usernameInput.value.length < 3) {
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  };

  const validateEmail = () => {
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  };

  const showError = (message) => {
    errorMessage.textContent = message || 'An error occurred. Please try again.';
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  };

  const showSuccess = (message) => {
    successMessage.textContent = message || 'Operation completed successfully!';
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  };

  const loadUsers = async () => {
    try {
      usersList.innerHTML = '<p>Loading users...</p>';
      
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to load users');
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      const users = data.data;
      
      if (users.length === 0) {
        usersList.innerHTML = '<p class="empty-message">No users registered yet.</p>';
        return;
      }
      
      usersList.innerHTML = users.map(user => `
        <div class="user-card">
          <div><strong>Username:</strong> ${user.username}</div>
          <div><strong>Email:</strong> ${user.email}</div>
          <div class="user-date">Registered: ${new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading users:', error);
      usersList.innerHTML = `
        <div class="error-state">
          <p>${error.message || 'Error loading users'}</p>
          <button onclick="loadUsers()">Try Again</button>
        </div>
      `;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername() || !validateEmail()) {
      return;
    }

    submitButton.disabled = true;
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          email: emailInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      if (data.success) {
        form.reset();
        showSuccess(data.message || 'User registered successfully!');
        await loadUsers();
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      showError(error.message);
    } finally {
      submitButton.disabled = false;
    }
  };

  usernameInput.addEventListener('input', validateUsername);
  emailInput.addEventListener('input', validateEmail);
  form.addEventListener('submit', handleFormSubmit);

  // Initialize users list with empty message
  usersList.innerHTML = '<p class="empty-message">No users registered yet.</p>';
});