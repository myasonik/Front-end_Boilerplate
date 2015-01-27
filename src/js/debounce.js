function debounce(fn) {
	var timeout;

	return function() {
		var context = this, args = arguments;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(function() {
			fn.apply(context, args);
		}, 200);
	};
}

module.exports = debounce;
