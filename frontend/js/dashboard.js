document.addEventListener('DOMContentLoaded', async () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const dashboardContent = document.getElementById('dashboardContent');
  const logoutBtn = document.getElementById('logoutBtn');

  const userNameEl = document.getElementById('userName');
  const navUserNameEl = document.getElementById('navUserName');
  const userEmailEl = document.getElementById('userEmail');
  const userPhoneEl = document.getElementById('userPhone');
  const userIdEl = document.getElementById('userId');
  const userCreatedAtEl = document.getElementById('userCreatedAt');

  try {
    const user = await apiFetch('/me');

    // Populate dashboard user info
    if (userNameEl) userNameEl.textContent = user.name;
    if (navUserNameEl) navUserNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userPhoneEl) userPhoneEl.textContent = user.phone;
    if (userIdEl) userIdEl.textContent = `#${user.id}`;
    if (userCreatedAtEl && user.created_at) {
      userCreatedAtEl.textContent = new Date(user.created_at).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }

    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (dashboardContent) dashboardContent.style.display = 'block';
  } catch {
    // Unauthenticated user -> redirect to login.html
    window.location.href = 'login.html';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await apiFetch('/logout', { method: 'POST' });
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        window.location.href = 'login.html';
      }
    });
  }
});
