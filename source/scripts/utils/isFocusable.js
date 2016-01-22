const $ = require('jquery');
const isVisible = require('./isVisible');

module.exports = (el, isTabIndexNotNaNParam) => {
    const nodeName = el.nodeName.toLowerCase();
    const $el = $(el);
    const isTabIndexNotNaN = isTabIndexNotNaNParam || !isNaN($el.attr('tabindex'));
    let focusable = false;

    if (isVisible($el)) {
        if (/input|select|textarea|button|object/.test(nodeName)) focusable = !el.disabled;
        else if (isTabIndexNotNaN && nodeName === 'a') focusable = el.href;
    }

    return focusable;
};
