/* eslint-disable object-shorthand */

const iconName = 'mail';
const width = 15;
const height = 15;
const svgPathData =
	'M3.152 4.111c-1.25 0-2.263.96-2.263 2.146v5.93c0 1.186 1.013 2.146 2.263 2.146h9.696c1.25 0 2.263-.96 2.263-2.145V6.257c0-1.185-1.013-2.146-2.263-2.146H3.152zm7.838 4.711 2.828-1.278v4.313L10.99 8.822zm1.858-3.485c.509-.001.932.37.97.85L8.015 8.812 2.196 6.045c.105-.419.502-.713.956-.708h9.696zM2.182 11.886V7.405L5.07 8.784l-2.888 3.102zm.97 1.226c-.11-.001-.22-.02-.324-.057l3.443-3.704 1.246.593c.312.149.68.152.995.01l1.266-.579 3.415 3.679c-.112.041-.231.062-.351.062l-9.69-.004z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.shield = exports.definition;
