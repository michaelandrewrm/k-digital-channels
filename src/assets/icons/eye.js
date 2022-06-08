/* eslint-disable object-shorthand */

const iconName = 'eye';
const width = 26;
const height = 26;
const svgPathData =
	'M13 5c5.122 0 9.595 2.983 11.855 7.392a1.35 1.35 0 0 1 0 1.216C22.597 18.015 18.122 21 13 21s-9.595-2.983-11.855-7.392a1.35 1.35 0 0 1 0-1.216C3.403 7.985 7.878 5 13 5zm0 2c-4.11 0-7.88 2.292-9.914 6C5.12 16.708 8.9 19 13 19s7.88-2.292 9.914-6C20.88 9.292 17.11 7 13 7zm0 1.333c2.003-.006 3.786 1.27 4.425 3.17s-.008 3.993-1.607 5.2-3.79 1.255-5.442.12-2.4-3.2-1.835-5.125A2.31 2.31 0 0 0 9.667 12C10.955 12 12 10.955 12 9.667a2.31 2.31 0 0 0-.302-1.125c.422-.13.86-.2 1.302-.208z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.eye = exports.definition;
