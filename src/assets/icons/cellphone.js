/* eslint-disable object-shorthand */

const iconName = 'cellphone';
const width = 18;
const height = 18;
const svgPathData =
	'M1.409 16.1c-.55 0-1.364-.4-1.364-1.5v-13C.045.993.41.1 1.41.1H8.68c.549 0 1.364.399 1.364 1.5v13c0 .604-.364 1.5-1.364 1.5zm7.548-3.952H1.132v2.37c0 .248.098.361.273.389l.08.007H8.61c.214 0 .316-.11.341-.31l.007-.09-.001-2.366zm-1.684.79l.098.1v.987l-.054.054v.02h-.02l-.024.025H2.817l-.025-.025h-.02v-.02l-.053-.054v-.988l.098-.098h4.456zm1.684-8.69H1.132v6.715h7.825V4.247zm-.355-2.964H1.48c-.214 0-.316.11-.341.31l-.007.09v1.378h7.825V1.679c0-.246-.097-.359-.274-.387l-.081-.008z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.cellphone = exports.definition;
