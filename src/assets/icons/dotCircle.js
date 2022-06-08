/* eslint-disable object-shorthand */

const iconName = 'dot-circle';
const width = 512;
const height = 512;
const svgPathData =
	'M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.dotCircle = exports.definition;
