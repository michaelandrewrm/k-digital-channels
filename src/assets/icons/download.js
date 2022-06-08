/* eslint-disable object-shorthand */

const iconName = 'download';
const width = 16;
const height = 16;
const svgPathData =
	'm1.896 7.754 5 4.923a.829.829 0 0 0 .583.246.794.794 0 0 0 .583-.246l5-4.923a.809.809 0 0 0 0-1.17.84.84 0 0 0-1.187 0l-3.542 3.55V.82A.83.83 0 0 0 7.5 0a.83.83 0 0 0-.833.82v9.313L3.083 6.605a.84.84 0 0 0-1.187 0 .82.82 0 0 0 0 1.149zM.833 16h13.334a.83.83 0 0 0 .833-.82.83.83 0 0 0-.833-.821H.833a.83.83 0 0 0-.833.82c0 .452.375.821.833.821z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.download = exports.definition;
