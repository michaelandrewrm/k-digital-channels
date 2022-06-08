/* eslint-disable object-shorthand */

const iconName = 'flag';
const width = 16;
const height = 16;
const svgPathData =
	'M11.021 0c.54 0 .979.438.979.979v13.123a.979.979 0 0 1-1.546.798l-3.887-2.766a.979.979 0 0 0-1.134 0L1.546 14.9A.979.979 0 0 1 0 14.102V.98C0 .439.438 0 .979 0H11.02zM10.5 1.5h-9v11.59l3.063-2.178a2.479 2.479 0 0 1 2.71-.108l.164.108L10.5 13.09V1.5z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.flag = exports.definition;
