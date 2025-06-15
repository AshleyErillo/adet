// Get form elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const passwordToggle = document.getElementById('passwordToggle');
const eyeOpen = passwordToggle.querySelector('.eye-open');
const eyeClose = passwordToggle.querySelector('.eye-close');
const passwordError = document.getElementById('password-error');
const usernameError = document.getElementById('username-error');

// Simple validation functions
function validateUsername() {
    if (!usernameInput.value.trim()) {
        usernameError.textContent = 'Username is required';
        return false;
    }
    usernameError.textContent = '';
    return true;
}

function validatePassword() {
    if (!passwordInput.value.trim()) {
        passwordError.textContent = 'Password is required';
        return false;
    }
    passwordError.textContent = '';
    return true;
}

// Toggle password visibility
passwordToggle.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';

    // Toggle eye icons
    eyeOpen.style.display = isPasswordVisible ? 'block' : 'none';
    eyeClose.style.display = isPasswordVisible ? 'none' : 'block';
});

// Initially set the correct eye icons
eyeOpen.style.display = 'block';
eyeClose.style.display = 'none';

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                loginBtn.textContent = 'Signing in...';
                loginBtn.disabled = true;
                setTimeout(() => {
                    window.location.href = '../WelcomePage/WelcomePage.html';
                }, 1500);
            } else {
                loginForm.classList.add('shake');
                passwordError.textContent = 'Invalid Credentials';
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        } catch (err) {
            console.error('Login request failed:', err);
            passwordError.textContent = 'Server error';
        }
    }
});
