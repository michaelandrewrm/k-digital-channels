/* eslint-disable object-shorthand */

const iconName = 'search';
const width = 16;
const height = 16;
const svgPathData =
	'M10.264 9.165a5.13 5.13 0 1 0-1.099 1.1l4.499 4.498a.777.777 0 1 0 1.099-1.1l-4.499-4.498zM2.556 6.131a3.575 3.575 0 1 1 7.15 0 3.575 3.575 0 0 1-7.15 0z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.search = exports.definition;
