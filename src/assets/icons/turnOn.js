/* eslint-disable object-shorthand */

const iconName = 'turnOn';
const width = 14;
const height = 14;
const svgPathData =
	'M10.535,3.465c1.43,1.43,1.858,3.58,1.084,5.449C10.846,10.782,9.022,12,7,12  s-3.846-1.218-4.62-3.086C1.608,7.045,2.036,4.895,3.466,3.465L4.88,4.88c-1.171,1.171-1.171,3.07,0,4.242  c1.187,1.133,3.055,1.133,4.242,0c1.171-1.172,1.171-3.07,0-4.242L10.535,3.465z M8,2v4H6V2H8z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.turnOn = exports.definition;
