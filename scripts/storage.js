window.localStorageHandler = function (key, value) {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    return JSON.parse(localStorage.getItem(key)) || null;
  }
};
