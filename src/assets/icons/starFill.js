/* eslint-disable object-shorthand */

const iconName = 'starFill';
const width = 16;
const height = 16;
const svgPathData =
	'M9.746 1.328l.065.177.958 2.9 3.126-.006c2.038-.005 2.784 1.887 1.395 3.139l-.132.112-.144.108-2.533 1.785.973 2.897c.636 1.894-.989 3.172-2.642 2.257l-.146-.086-.142-.095L8 12.719l-2.524 1.797c-1.65 1.175-3.399.063-3.018-1.753l.04-.162.048-.161.972-2.897L.986 7.758c-1.652-1.165-1.115-3.124.764-3.34l.174-.015.182-.004 3.124.006.96-2.9C6.832-.441 9.01-.5 9.745 1.328z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.starFill = exports.definition;
