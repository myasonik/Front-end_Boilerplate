module.exports = {
	watch: false,
	prod: false,
	src: 'src/',
	dest: './output/',
	outputJadeIncludes: true,
	watchDest: ['output/**.*', '!output/includes']
};