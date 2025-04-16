const cursor = document.querySelector('.cursor-mariposa');

document.addEventListener('mousemove', (e) => {
  const offsetX = 10; // ajusta si quieres que esté más cerca
  const offsetY = 10;
  cursor.style.left = `${e.clientX + offsetX}px`;
  cursor.style.top = `${e.clientY + offsetY}px`;
});
