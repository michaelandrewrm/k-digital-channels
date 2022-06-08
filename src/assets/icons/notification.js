/* eslint-disable object-shorthand */

const iconName = 'notification';
const width = 23;
const height = 23;
const svgPathData =
	'M6.582 19.268H8.52c0 .976.78 1.768 1.742 1.768s1.742-.792 1.742-1.768h1.936c0 2.061-1.647 3.732-3.678 3.732-2.032 0-3.679-1.67-3.679-3.732zm13.94-2.75v.393c0 .98-.78 1.768-1.743 1.768H1.743C.78 18.679 0 17.888 0 16.91v-.394c0-1.424.998-2.612 2.323-2.886V9.053C2.323 4.604 5.877 1 10.261 1s7.938 3.605 7.938 8.053v4.578a2.935 2.935 0 0 1 2.323 2.886zm-1.936 0a.974.974 0 0 0-.972-.982 1.364 1.364 0 0 1-1.351-1.372v-5.11c0-3.364-2.687-6.09-6.002-6.09S4.259 5.69 4.259 9.054v5.11c0 .757-.607 1.372-1.351 1.372a.977.977 0 0 0-.972.981v.197h16.65v-.197z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.notification = exports.definition;
