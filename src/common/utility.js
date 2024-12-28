function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // 清除之前的 timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 設置新的 timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export {
  debounce
}
