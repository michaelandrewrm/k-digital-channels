/* eslint-disable object-shorthand */

const iconName = 'folder';
const width = 30;
const height = 27;
const svgPathData =
	'M24.334 2.555H10.762a.613.613 0 0 1-.495-.254L9.153.767A1.839 1.839 0 0 0 7.667 0H2.049C1.023 0 .192.858.192 1.917v19.166c0 1.06.83 1.917 1.857 1.917h22.286c1.025 0 1.857-.858 1.857-1.917V4.473c0-1.059-.832-1.918-1.858-1.918M2.05 1.278h5.415c.39 0 .756.19.99.512L9.57 3.323c.234.32.6.51.99.51h13.776a.63.63 0 0 1 .619.64v1.916H1.43V1.917a.63.63 0 0 1 .619-.64m22.285 20.445H2.05a.63.63 0 0 1-.619-.639V7.666h23.524v13.417a.63.63 0 0 1-.62.64';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.folder = exports.definition;
