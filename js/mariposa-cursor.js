document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector('.cursor-mariposa');

  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
});
