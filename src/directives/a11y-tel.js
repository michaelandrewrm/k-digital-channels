export default (el, { value }) => {
	el.setAttribute(
		'aria-label',
		value
			.split(' ')
			.join('.')
			.split('')
			.join(' ')
	);
};
