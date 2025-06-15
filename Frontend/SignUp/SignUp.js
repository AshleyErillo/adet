// Modified version of SignUp.js with password toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const signupForm = document.getElementById('signupForm');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const middleNameInput = document.getElementById('middleName');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const privacyCheckbox = document.getElementById('privacy');

    // Get error elements
    const lastNameError = document.getElementById('lastName-error');
    const firstNameError = document.getElementById('firstName-error');
    const middleNameError = document.getElementById('middleName-error');
    const emailError = document.getElementById('email-error');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirmPassword-error');
    const termsError = document.getElementById('terms-error');
    const privacyError = document.getElementById('privacy-error');

    // Add password toggle functionality
    function setupPasswordToggle(passwordField, toggleIcon) {
        toggleIcon.addEventListener('click', function() {
            // Toggle the password field type
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle the icon class
            if (type === 'password') {
                toggleIcon.classList.remove('visible');
                toggleIcon.classList.add('hidden');
            } else {
                toggleIcon.classList.remove('hidden');
                toggleIcon.classList.add('visible');
            }
        });
    }

    // Setup password toggles if elements exist
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    
    if (passwordToggle) {
        setupPasswordToggle(passwordInput, passwordToggle);
    }
    
    if (confirmPasswordToggle) {
        setupPasswordToggle(confirmPasswordInput, confirmPasswordToggle);
    }

    // Modal elements
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const openTermsBtn = document.getElementById('openTerms');
    const openPrivacyBtn = document.getElementById('openPrivacy');
    const termsCloseBtn = document.getElementById('termsClose');
    const privacyCloseBtn = document.getElementById('privacyClose');
    
    // Track if user has opened and agreed to terms and privacy
    const userAgreementStatus = {
        termsOpened: false,
        termsAgreed: false,
        privacyOpened: false,
        privacyAgreed: false
    };

    // Disable checkboxes initially and make them read-only
    termsCheckbox.disabled = true;
    privacyCheckbox.disabled = true;

    // Add custom message for read-only checkboxes
    termsCheckbox.parentElement.addEventListener('click', (e) => {
        if (!userAgreementStatus.termsAgreed) {
            e.preventDefault();
            openTermsBtn.click();
        }
    });

    privacyCheckbox.parentElement.addEventListener('click', (e) => {
        if (!userAgreementStatus.privacyAgreed) {
            e.preventDefault();
            openPrivacyBtn.click();
        }
    });

    // Modal handling
    openTermsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
        userAgreementStatus.termsOpened = true;
    });

    openPrivacyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'flex';
        userAgreementStatus.privacyOpened = true;
    });

    termsCloseBtn.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    privacyCloseBtn.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });

    // Handle agree buttons in modals
    const agreeTermsBtn = document.getElementById('agreeTerms');
    const agreePrivacyBtn = document.getElementById('agreePrivacy');
    
    agreeTermsBtn.addEventListener('click', () => {
        userAgreementStatus.termsAgreed = true;
        termsCheckbox.disabled = false;
        termsCheckbox.checked = true;
        validationState.terms = true;
        termsModal.style.display = 'none';
        termsError.textContent = '';
    });
    
    agreePrivacyBtn.addEventListener('click', () => {
        userAgreementStatus.privacyAgreed = true;
        privacyCheckbox.disabled = false;
        privacyCheckbox.checked = true;
        validationState.privacy = true;
        privacyModal.style.display = 'none';
        privacyError.textContent = '';
    });

    // Store validation state
    const validationState = {
        lastName: false,
        firstName: false,
        middleName: true,  // middle name optional, so start as valid
        email: false,
        username: false,
        password: false,
        confirmPassword: false,
        terms: false,
        privacy: false
    };

    // Validate a required name field
    const validateName = (input, errorElement, fieldName) => {
        const value = input.value.trim();
        errorElement.textContent = '';
        input.classList.remove('invalid');
        
        if (value === '') {
            errorElement.textContent = `${fieldName} is required`;
            input.classList.add('invalid');
            return false;
        }
        
        if (value.length < 2) {
            errorElement.textContent = `${fieldName} must be at least 2 characters`;
            input.classList.add('invalid');
            return false;
        }
        
        const nameRegex = /^[A-Za-z\s\-']+$/;
        if (!nameRegex.test(value)) {
            errorElement.textContent = `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
            input.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate the optional middle name
    const validateMiddleName = () => {
        const value = middleNameInput.value.trim();
        middleNameError.textContent = '';
        middleNameInput.classList.remove('invalid');
        
        if (value === '') {
            // Optional, so valid if empty
            return true;
        }
        
        if (value.length < 2) {
            middleNameError.textContent = 'Middle name must be at least 2 characters';
            middleNameInput.classList.add('invalid');
            return false;
        }
        
        const nameRegex = /^[A-Za-z\s\-']+$/;
        if (!nameRegex.test(value)) {
            middleNameError.textContent = 'Middle name can only contain letters, spaces, hyphens, and apostrophes';
            middleNameInput.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate email
    const validateEmail = (input, errorElement) => {
        const value = input.value.trim();
        errorElement.textContent = '';
        input.classList.remove('invalid');
        
        if (value === '') {
            errorElement.textContent = 'Email address is required';
            input.classList.add('invalid');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorElement.textContent = 'Please enter a valid email address';
            input.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate username
    const validateUsername = (input, errorElement) => {
        const value = input.value.trim();
        errorElement.textContent = '';
        input.classList.remove('invalid');
        
        if (value === '') {
            errorElement.textContent = 'Username is required';
            input.classList.add('invalid');
            return false;
        }
        
        if (value.length < 4) {
            errorElement.textContent = 'Username must be at least 4 characters';
            input.classList.add('invalid');
            return false;
        }
        
        const usernameRegex = /^[A-Za-z0-9_-]+$/;
        if (!usernameRegex.test(value)) {
            errorElement.textContent = 'Username can only contain letters, numbers, underscores, and hyphens';
            input.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate password
    const validatePassword = (input, errorElement) => {
        const value = input.value;
        errorElement.textContent = '';
        input.classList.remove('invalid');
        
        if (value === '') {
            errorElement.textContent = 'Password is required';
            input.classList.add('invalid');
            return false;
        }
        
        if (value.length < 8) {
            errorElement.textContent = 'Password must be at least 8 characters long';
            input.classList.add('invalid');
            return false;
        }
        
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        
        if (!hasUppercase || !hasLowercase || !hasNumber) {
            errorElement.textContent = 'Password must include at least one uppercase letter, one lowercase letter, and one number';
            input.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate confirm password
    const validateConfirmPassword = (confirmInput, passwordInput, errorElement) => {
        const confirmValue = confirmInput.value;
        const passwordValue = passwordInput.value;
        errorElement.textContent = '';
        confirmInput.classList.remove('invalid');
        
        if (confirmValue === '') {
            errorElement.textContent = 'Please confirm your password';
            confirmInput.classList.add('invalid');
            return false;
        }
        
        if (confirmValue !== passwordValue) {
            errorElement.textContent = 'Passwords do not match';
            confirmInput.classList.add('invalid');
            return false;
        }
        
        return true;
    };

    // Validate checkbox
    const validateCheckbox = (checkbox, errorElement, message) => {
        errorElement.textContent = '';
        if (!checkbox.checked) {
            errorElement.textContent = message;
            return false;
        }
        return true;
    };

    // Event listeners for blur events (real-time validation)
    lastNameInput.addEventListener('blur', () => {
        validationState.lastName = validateName(lastNameInput, lastNameError, 'Last name');
    });
    
    firstNameInput.addEventListener('blur', () => {
        validationState.firstName = validateName(firstNameInput, firstNameError, 'First name');
    });
    
    middleNameInput.addEventListener('blur', () => {
        validationState.middleName = validateMiddleName();
    });
    
    emailInput.addEventListener('blur', () => {
        validationState.email = validateEmail(emailInput, emailError);
    });
    
    usernameInput.addEventListener('blur', () => {
        validationState.username = validateUsername(usernameInput, usernameError);
    });
    
    passwordInput.addEventListener('blur', () => {
        validationState.password = validatePassword(passwordInput, passwordError);
        if (confirmPasswordInput.value !== '') {
            validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput, passwordInput, confirmPasswordError);
        }
    });
    
    confirmPasswordInput.addEventListener('blur', () => {
        validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput, passwordInput, confirmPasswordError);
    });
    
    termsCheckbox.addEventListener('change', () => {
        validationState.terms = validateCheckbox(termsCheckbox, termsError, 'You must agree to the Terms & Conditions');
    });
    
    privacyCheckbox.addEventListener('change', () => {
        validationState.privacy = validateCheckbox(privacyCheckbox, privacyError, 'You must agree to the Privacy Policy');
    });

    // Clear error on input
    const clearErrorOnInput = (input, errorElement) => {
        input.addEventListener('input', () => {
            errorElement.textContent = '';
            input.classList.remove('invalid');
        });
    };
    
    clearErrorOnInput(lastNameInput, lastNameError);
    clearErrorOnInput(firstNameInput, firstNameError);
    clearErrorOnInput(middleNameInput, middleNameError);
    clearErrorOnInput(emailInput, emailError);
    clearErrorOnInput(usernameInput, usernameError);
    clearErrorOnInput(passwordInput, passwordError);
    clearErrorOnInput(confirmPasswordInput, confirmPasswordError);

    // Create a success modal
    const createSuccessModal = () => {
        // Create modal elements
        const successModal = document.createElement('div');
        successModal.id = 'successModal';
        successModal.className = 'modal';
        successModal.style.display = 'none';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Account Created Successfully';
        
        const modalMessage = document.createElement('p');
        modalMessage.textContent = 'Your account has been created successfully! Click Continue to proceed to the login page.';
        
        const continueButton = document.createElement('button');
        continueButton.className = 'btn-agree';
        continueButton.textContent = 'Continue';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-button-container';
        buttonContainer.appendChild(continueButton);
        
        // Assemble modal
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(buttonContainer);
        successModal.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(successModal);
        
        // Continue button functionality
        continueButton.addEventListener('click', () => {
            successModal.style.display = 'none';
            window.location.href = '../SignIn/SignIn.html';
        });
        
        return successModal;
    };
    
    // Get or create success modal
    let successModal = document.getElementById('successModal');
    if (!successModal) {
        successModal = createSuccessModal();
    }

    // Handle form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        validationState.lastName = validateName(lastNameInput, lastNameError, 'Last name');
        validationState.firstName = validateName(firstNameInput, firstNameError, 'First name');
        validationState.middleName = validateMiddleName();
        validationState.email = validateEmail(emailInput, emailError);
        validationState.username = validateUsername(usernameInput, usernameError);
        validationState.password = validatePassword(passwordInput, passwordError);
        validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput, passwordInput, confirmPasswordError);
        validationState.terms = validateCheckbox(termsCheckbox, termsError, 'You must agree to the Terms & Conditions');
        validationState.privacy = validateCheckbox(privacyCheckbox, privacyError, 'You must agree to the Privacy Policy');
        
        const isFormValid = Object.values(validationState).every(v => v);
        
        if (isFormValid) {
            const submitButton = signupForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Creating account...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                const user = {
                    lastName: lastNameInput.value.trim(),
                    firstName: firstNameInput.value.trim(),
                    middleName: middleNameInput.value.trim(),
                    ext: document.getElementById('ext').value.trim(),
                    email: emailInput.value.trim(),
                    username: usernameInput.value.trim()
                };
                
                localStorage.setItem('petHealthUser', JSON.stringify(user));
                
                // Show success modal
                successModal.style.display = 'flex';
            }, 1500);
        } else {
            signupForm.classList.add('shake');
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => signupForm.classList.remove('shake'), 500);
        }
    });
});