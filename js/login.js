'use strict';

function setupLogin() {
  const form = byId('login-form');
  const userFor = () => form.elements.role.value === 'Administrador' ? 'admin' : 'personal';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.elements.user.value.trim().toLowerCase() !== userFor() || form.elements.password.value !== 'demo123') {
      showFeedback(byId('feedback'), 'Revisa el perfil, el usuario y la contraseña.');
      return;
    }
    profile(form.elements.role.value);
    location.href = '02_panel.html';
  });
}

const passwordInput = byId('login-form').elements.password;
const passwordToggle = byId('toggle-password');
passwordToggle.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  passwordToggle.textContent = show ? 'Ocultar' : 'Mostrar';
  passwordToggle.setAttribute('aria-pressed', String(show));
});

setupLogin();
