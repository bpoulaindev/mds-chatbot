document.querySelector(".burger-button").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.querySelector(".close-sidebar").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.remove("open");
});
