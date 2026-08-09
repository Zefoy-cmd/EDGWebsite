const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});
