/* eslint-disable object-shorthand */

const iconName = 'home';
const width = 21;
const height = 21;
const svgPathData =
	'M11.056 2.217c-.32-.3-.803-.3-1.123 0l-8.648 7.817a.87.87 0 0 0-.072 1.215c.3.356.845.388 1.195.073L3.526 10.3v6.126C3.526 17.847 4.66 19 6.06 19h8.87c1.4 0 2.534-1.153 2.534-2.575V10.3l1.128 1.02c.35.315.885.283 1.195-.073a.87.87 0 0 0-.072-1.215l-8.66-7.813zm4.718 14.208c0 .474-.378.858-.845.858H6.06c-.467 0-.845-.384-.845-.858V8.773l5.28-4.764 5.28 4.764v7.652z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.home = exports.definition;
