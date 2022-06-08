/* eslint-disable object-shorthand */

const iconName = 'info';
const width = 18;
const height = 18;
const svgPathData =
	'M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0zm0 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm0 6.373c.432 0 .788.323.84.74l.007.107v5.307a.847.847 0 0 1-1.687.106l-.007-.106V8.22c0-.468.38-.847.847-.847zm-.032-3.1c.534 0 .967.433.967.967v.065a.968.968 0 0 1-1.935 0V5.24c0-.534.433-.967.968-.967z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.info = exports.definition;
