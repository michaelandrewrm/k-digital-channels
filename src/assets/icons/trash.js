/* eslint-disable object-shorthand */

const iconName = 'trash';
const width = 16;
const height = 16;
const svgPathData =
	'M9.533.15c.234 0 .467.118.617.32l.783 1.105h4.25c.4 0 .734.335.75.737 0 .402-.333.737-.733.737h-.633L13.3 13.69c-.133 1.09-1.05 1.91-2.15 1.91H4.867c-1.1 0-2.017-.82-2.15-1.91L1.45 3.05H.817c-.4 0-.734-.335-.734-.737 0-.402.334-.737.734-.737h4.25L5.85.469c.133-.2.367-.318.617-.318zm3.55 2.9H2.933l1.25 10.455c.034.352.334.62.684.62h6.283c.35 0 .65-.268.683-.62l1.25-10.456zm-7.1 1.49c.4-.016.75.286.784.688l.466 6.735c.034.402-.283.754-.683.788H6.5c-.383 0-.7-.302-.733-.687L5.3 5.328c-.033-.402.283-.754.683-.787zm4.034-.016c.4.033.716.385.683.787l-.467 6.736c-.033.385-.35.687-.733.687h-.05c-.417-.017-.717-.369-.683-.787l.466-6.736c.034-.402.384-.704.784-.687z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.trash = exports.definition;
