const isFocusable = require('./isFocusable');

module.exports = (el) => {
    const tabIndex = el ? el.getAttribute('tabindex') : -1;
    const isTabIndexNaN = isNaN(tabIndex);

    return (isTabIndexNaN || tabIndex >= 0) && isFocusable(el, !isTabIndexNaN);
};
