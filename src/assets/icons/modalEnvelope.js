/* eslint-disable object-shorthand */

const iconName = 'modalEnvelope';
const width = 40;
const height = 30;
const svgPathData =
	'M26.227 6.222H5.773C3.137 6.222 1 8.358 1 10.994v13.194C1 26.824 3.137 28.96 5.773 28.96h20.454c2.636 0 4.773-2.137 4.773-4.773V10.995c0-2.636-2.137-4.773-4.773-4.773zm-3.92 10.48l5.966-2.844v9.593l-5.966-6.75zM5.773 8.948h20.454c1.073-.004 1.966.822 2.046 1.892L16.03 16.677 3.758 10.524c.22-.932 1.057-1.587 2.015-1.575zM3.727 23.516v-9.968l6.092 3.068-6.092 6.9zm2.046 2.727c-.233-.003-.463-.045-.682-.126l7.26-8.24 2.63 1.32a2.39 2.39 0 0 0 2.1.02l2.67-1.285 7.203 8.182a2.05 2.05 0 0 1-.74.14l-20.44-.01z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.modalEnvelope = exports.definition;
