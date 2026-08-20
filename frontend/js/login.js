document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const alertError = document.getElementById('alertError');
  const alertSuccess = document.getElementById('alertSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const emailInput = document.getElementById('email');

  // Check query string for registered email
  const urlParams = new URLSearchParams(window.location.search);
  const registered = urlParams.get('registered');
  if (registered && emailInput) {
    emailInput.value = registered;
    alertSuccess.textContent = 'Account created! Please sign in with your credentials.';
    alertSuccess.classList.add('visible');
  }

  // Password visibility toggle
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.innerHTML = type === 'password'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    });
  }

  function showError(msg) {
    alertError.textContent = msg;
    alertError.classList.add('visible');
    alertSuccess.classList.remove('visible');
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertError.classList.remove('visible');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError('Please enter both email address and password');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Signing In...`;

      await apiFetch('/login', {
        method: 'POST',
        body: { email, password }
      });

      window.location.href = 'dashboard.html';
    } catch (err) {
      showError(err.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Sign In`;
    }
  });
});
