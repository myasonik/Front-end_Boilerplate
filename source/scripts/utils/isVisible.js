const $ = require('jquery');

module.exports = ($el) => {
    const isVisible = $el.is(':visible');
    const areParentsVisible = !$el.parents().addBack().filter(function() {
        return $.css(this, 'visibility') === 'hidden'; // eslint-disable-line
    }).length;

    return isVisible && areParentsVisible;
};
