/* eslint-disable object-shorthand */

const iconName = 'cancel';
const width = 16;
const height = 16;
const svgPathData =
	'M7.428 0a7.059 7.059 0 1 0 0 14.118A7.059 7.059 0 0 0 7.428 0zm0 1.47c1.246 0 2.397.409 3.326 1.098L7.428 5.894 4.102 2.568A5.562 5.562 0 0 1 7.428 1.47zM1.84 7.06c0-1.246.408-2.397 1.098-3.326l3.326 3.326-3.326 3.326A5.563 5.563 0 0 1 1.84 7.059zm5.588 5.588a5.563 5.563 0 0 1-3.326-1.098l3.326-3.326 3.326 3.326a5.564 5.564 0 0 1-3.326 1.098zm4.49-2.262L8.594 7.059l3.326-3.326c.69.93 1.098 2.08 1.098 3.326a5.562 5.562 0 0 1-1.098 3.326z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.cancel = exports.definition;
