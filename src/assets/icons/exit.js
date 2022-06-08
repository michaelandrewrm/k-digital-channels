/* eslint-disable object-shorthand */

const iconName = 'exit';
const width = 16;
const height = 16;
const svgPathData =
	'M8.442 2.199c.317 0 .573.234.573.527s-.256.528-.573.528L3.3 3.253v9.495h5.188a.527.527 0 1 1 0 1.055H2.685a.527.527 0 0 1-.527-.527V2.746a.5.5 0 0 1 0-.022c0-.29.252-.524.566-.527l5.718.002zm2.406 2.807l2.828 2.61a.5.5 0 0 1 0 .746l-2.828 2.624a.606.606 0 0 1-.808 0 .5.5 0 0 1 0-.746l1.853-1.71H5.299c-.315 0-.57-.234-.57-.527s.257-.527.57-.527l6.593-.001-1.852-1.7a.5.5 0 0 1 0-.746.606.606 0 0 1 .808 0v-.023z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.exit = exports.definition;
