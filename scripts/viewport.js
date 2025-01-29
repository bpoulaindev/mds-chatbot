function updateHeight() {
  document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
}

// Update on resize and orientation change
window.addEventListener('resize', updateHeight);
window.addEventListener('orientationchange', updateHeight);

// Initial update
updateHeight();