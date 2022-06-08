/* eslint-disable object-shorthand */

const iconName = 'paper';
const width = 16;
const height = 16;
const svgPathData =
	'M13.8 7.955h-2.1v-6.3a.7.7 0 0 0-.7-.7H1.2a.7.7 0 0 0-.7.7v11.2c0 1.16.94 2.1 2.1 2.1h9.8a2.1 2.1 0 0 0 2.1-2.1v-4.2a.7.7 0 0 0-.7-.7zm-11.9 4.9v-10.5h8.4v10.5a2.1 2.1 0 0 0 .126.7H2.6a.7.7 0 0 1-.7-.7zm10.5.7a.7.7 0 0 1-.7-.7v-3.5h1.4v3.5a.7.7 0 0 1-.7.7z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.paper = exports.definition;
