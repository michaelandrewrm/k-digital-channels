/* eslint-disable object-shorthand */

const iconName = 'circle';
const width = 512;
const height = 512;
const svgPathData = 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.circle = exports.definition;
