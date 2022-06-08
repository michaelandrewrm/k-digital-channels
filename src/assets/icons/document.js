/* eslint-disable object-shorthand */

const iconName = 'document';
const width = 16;
const height = 16;
const svgPathData =
	'M6.147.083H1.96c-.828 0-1.5.65-1.5 1.455v13.09c0 .803.672 1.455 1.5 1.455h9c.828 0 1.5-.65 1.5-1.455V6.203c0-.386-.158-.756-.44-1.03L7.21.51C6.927.236 6.545.083 6.147.083zm1 2.425l2.81 2.724c.02.02.027.052.016.08s-.038.045-.068.045h-2.51a.37.37 0 0 1-.375-.364V2.56c0-.03.02-.055.046-.066s.06-.005.08.015zm-5.2 11.756V1.902a.37.37 0 0 1 .375-.364h2.812a.37.37 0 0 1 .375.364v3.455c0 .803.672 1.455 1.5 1.455h3.562a.37.37 0 0 1 .375.364v7.09a.37.37 0 0 1-.375.364h-8.25a.37.37 0 0 1-.375-.364z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.document = exports.definition;
