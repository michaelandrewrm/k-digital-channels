/* eslint-disable object-shorthand */

const iconName = 'card';
const width = 16;
const height = 16;
const svgPathData =
	'M13.927,3.5H2.073C1.48,3.5,1,3.948,1,4.5v7c0,0.552,0.48,1,1.073,1h11.854 c0.592,0,1.073-0.448,1.073-1v-7C15,3.948,14.52,3.5,13.927,3.5z M13.927,11.5H2.073v-4h11.854V11.5z M13.927,5.5H2.073v-1h11.854 V5.5z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.card = exports.definition;
