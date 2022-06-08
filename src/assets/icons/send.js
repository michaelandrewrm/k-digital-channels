/* eslint-disable object-shorthand */

const iconName = 'send';
const width = 16;
const height = 16;
const svgPathData =
	'M14.897 3.191a.478.478 0 0 0-.484-.18l-13.036 3a.495.495 0 0 0-.372.417c-.03.205.07.407.244.51l4.096 2.357V12.5c0 .279.216.5.483.5.123 0 .247-.05.341-.146l1.23-1.272 1.931 2.25a.474.474 0 0 0 .792-.108l4.828-10a.52.52 0 0 0-.053-.533zM11.791 4.64l-5.975 3.78-2.988-1.718 8.963-2.062zM6.31 11.29v-.978l.444.518-.444.46zm3.267 1.322-3.005-3.5 6.761-4.28-3.756 7.78z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.send = exports.definition;
