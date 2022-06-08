/* eslint-disable object-shorthand */

const iconName = 'crossCircle';
const width = 16;
const height = 16;
const svgPathData =
	'M7.428 0C3.53 0 .37 3.16.37 7.059c0 3.898 3.16 7.059 7.06 7.059 3.898 0 7.058-3.16 7.058-7.06C14.487 3.16 11.327 0 7.428 0zm0 1.47c1.246 0 2.397.409 3.326 1.098L7.428 5.894 4.102 2.568c.93-.69 2.08-1.098 3.326-1.098zM1.84 7.06c0-1.246.408-2.397 1.098-3.326l3.326 3.326-3.326 3.326c-.69-.93-1.098-2.08-1.098-3.326zm5.588 5.588c-1.246 0-2.396-.408-3.326-1.098l3.326-3.326 3.326 3.326c-.93.69-2.08 1.098-3.326 1.098zm4.49-2.262L8.594 7.059l3.326-3.326c.69.93 1.098 2.08 1.098 3.326s-.409 2.397-1.098 3.326z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.crossCircle = exports.definition;
