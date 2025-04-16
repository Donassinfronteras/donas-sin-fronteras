document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor-mariposa");
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
});
