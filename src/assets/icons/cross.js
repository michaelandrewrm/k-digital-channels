/* eslint-disable object-shorthand */

const iconName = 'cross';
const width = 26;
const height = 26;
const svgPathData =
	'M13.5 4.5c.287 0 .52.228.52.52l-.001 7.979 8.327.001c.246 0 .45.183.492.412l.008.088a.5.5 0 0 1-.5.5l-8.327-.001v7.982c0 .287-.24.519-.519.519a.516.516 0 0 1-.52-.52V14L4.654 14a.5.5 0 1 1 0-1l8.326-.001v-7.98c0-.255.191-.467.429-.51L13.5 4.5z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.cross = exports.definition;
