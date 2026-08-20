document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const alertError = document.getElementById('alertError');
  const alertSuccess = document.getElementById('alertSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // Password visibility toggles
  setupPasswordToggle('togglePassword', 'password');
  setupPasswordToggle('toggleConfirmPassword', 'confirm_password');

  function setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (btn && input) {
      btn.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        btn.innerHTML = type === 'password'
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
      });
    }
  }

  function showError(msg) {
    alertError.textContent = msg;
    alertError.classList.add('visible');
    alertSuccess.classList.remove('visible');
  }

  function showSuccess(msg) {
    alertSuccess.textContent = msg;
    alertSuccess.classList.add('visible');
    alertError.classList.remove('visible');
  }

  function clearAlerts() {
    alertError.classList.remove('visible');
    alertSuccess.classList.remove('visible');
  }

  function showFieldError(fieldId, msg) {
    const errorEl = document.getElementById(`error_${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl && inputEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      inputEl.classList.add('error-border');
    }
  }

  function clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('error-border'));
  }

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlerts();
    clearFieldErrors();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    let hasError = false;

    if (!name) {
      showFieldError('name', 'Full Name is required');
      hasError = true;
    }

    const phoneClean = phone.replace(/[\s\-\(\)\+]/g, '');
    if (!phone) {
      showFieldError('phone', 'Phone number is required');
      hasError = true;
    } else if (!/^\d{7,15}$/.test(phoneClean)) {
      showFieldError('phone', 'Phone number must contain between 7 and 15 digits');
      hasError = true;
    }

    if (!email) {
      showFieldError('email', 'Email address is required');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showFieldError('email', 'Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      showFieldError('password', 'Password is required');
      hasError = true;
    } else if (password.length < 8) {
      showFieldError('password', 'Password must be at least 8 characters long');
      hasError = true;
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      showFieldError('password', 'Password must contain both letters and numbers');
      hasError = true;
    }

    if (!confirm_password) {
      showFieldError('confirm_password', 'Please confirm your password');
      hasError = true;
    } else if (password !== confirm_password) {
      showFieldError('confirm_password', 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Creating Account...`;

      await apiFetch('/signup', {
        method: 'POST',
        body: { name, phone, email, password, confirm_password }
      });

      showSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = `login.html?registered=${encodeURIComponent(email)}`;
      }, 1500);
    } catch (err) {
      showError(err.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Create Account`;
    }
  });
});
