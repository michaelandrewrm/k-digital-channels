/* eslint-disable object-shorthand */

const iconName = 'calendar';
const width = 16;
const height = 16;
const svgPathData =
	'M13.5 5.403v-2.33l-1.75-.001v.58a.583.583 0 1 1-1.167 0v-.58L4.75 3.068v.582a.583.583 0 1 1-1.167 0v-.582H1.836l-.001 2.334H13.5zm0 1.166H1.834v6.414c0 .002 11.663.003 11.663.003L13.5 6.57zm-1.75-4.666h1.747a1.17 1.17 0 0 1 1.17 1.169v9.91a1.17 1.17 0 0 1-1.17 1.17H1.837a1.17 1.17 0 0 1-1.17-1.17v-9.91a1.17 1.17 0 0 1 1.17-1.17h1.746V.74a.583.583 0 1 1 1.167 0v1.165h5.833V.738a.583.583 0 1 1 1.167 0v1.165z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.calendar = exports.definition;
