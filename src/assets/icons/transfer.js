/* eslint-disable object-shorthand */

const iconName = 'transfer';
const width = 21;
const height = 21;
const svgPathData =
	'M18.902 13c.445 0 .845.244 1.015.618s.074.805-.242 1.1l-3.3 2.998c-.43.39-1.123.39-1.552 0s-.43-1.024 0-1.414L16.254 15H4.097C3.49 15 3 14.55 3 14s.49-1 1.097-1zM5.615 4.293c.43-.39 1.123-.39 1.552 0s.43 1.024 0 1.414L5.746 7h12.157C18.51 7 19 7.45 19 8s-.49 1-1.097 1H3.098c-.445 0-.845-.244-1.015-.618s-.074-.805.242-1.1z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.transfer = exports.definition;
