/* eslint-disable object-shorthand */

const iconName = 'productFolder';
const width = 30;
const height = 27;
const svgPathData =
	'M26.5 4.275H12.494a.632.632 0 0 1-.51-.262l-1.15-1.582a1.896 1.896 0 0 0-1.532-.791H3.51c-1.058 0-1.915.885-1.915 1.977v19.765c0 1.093.856 1.977 1.915 1.977H26.49c1.057 0 1.915-.885 1.915-1.977V6.253c0-1.092-.858-1.978-1.916-1.978M3.5 2.96h5.584c.402 0 .78.196 1.02.528l1.15 1.58c.24.33.62.526 1.02.526h14.207a.65.65 0 0 1 .638.66V8.23H2.87V3.618a.65.65 0 0 1 .638-.66M26.5 24.04H3.5a.65.65 0 0 1-.638-.659V9.546h24.26v13.836a.65.65 0 0 1-.639.66';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.productFolder = exports.definition;
