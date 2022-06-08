/* eslint-disable object-shorthand */

const iconName = 'moon';
const width = 16;
const height = 16;
const svgPathData =
	'M7.698 2.038a.667.667 0 0 0-.13.009 6.007 6.007 0 0 0-5.009 5.915 6.01 6.01 0 0 0 6 6 6.002 6.002 0 0 0 4.742-2.334.667.667 0 0 0-.64-1.066 4.657 4.657 0 0 1-5.436-4.599 4.663 4.663 0 0 1 .978-2.85.667.667 0 0 0-.506-1.075h.001zM6.283 3.9a5.973 5.973 0 0 0-.39 2.06v.002c0 3.007 2.265 5.402 5.156 5.83-.747.488-1.575.835-2.5.837a4.657 4.657 0 0 1-4.666-4.667c0-1.732.95-3.258 2.4-4.062z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.moon = exports.definition;
