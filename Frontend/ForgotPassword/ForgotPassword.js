document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('.submit-btn');
    const messageContainer = document.getElementById('message');

    let attempts = 0;
    const maxAttempts = 3;

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Clear previous messages
        clearMessage();

        if (email === '') {
            showMessage('Please enter your email address.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            attempts++;

            if (attempts >= maxAttempts) {
                showMessage('Too many failed attempts. Please try again later.', 'error');
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.disabled = false;
                    attempts = 0;
                    clearMessage();
                }, 60000); // 1 minute cooldown

                return;
            }

            showMessage('Invalid email format. Please check and try again.', 'error');
            return;
        }

        // Valid email, reset attempt count
        attempts = 0;

        simulatePasswordResetRequest(email);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function simulatePasswordResetRequest(email) {
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate a network request (80% success rate)
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;

            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;

            if (isSuccess) {
                showMessage(`Verification email sent to ${email}. Please check your inbox.`, 'success');
                emailInput.value = '';
            } else {
                showMessage('An error occurred while sending the request. Please try again later.', 'error');
            }
        }, 1500);
    }

    function showMessage(text, type) {
        messageContainer.textContent = text;
        messageContainer.className = `message ${type}`;

        if (type === 'error') {
            setTimeout(() => {
                clearMessage();
            }, 5000);
        }
    }

    function clearMessage() {
        messageContainer.textContent = '';
        messageContainer.className = 'message';
    }
});
