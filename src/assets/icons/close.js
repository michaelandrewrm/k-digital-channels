/* eslint-disable object-shorthand */

const iconName = 'close';
const width = 15;
const height = 15;
const svgPathData =
	'M1.725.306L7.5 6.082 13.275.306a.985.985 0 0 1 1.3-.082l.093.082a.985.985 0 0 1 0 1.393L8.891 7.476l5.84 5.842a.976.976 0 0 1-1.38 1.38L7.5 8.847l-5.852 5.851a.976.976 0 1 1-1.38-1.38L6.11 7.476.332 1.699A.985.985 0 0 1 1.725.306z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.close = exports.definition;
