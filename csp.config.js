const csp = [
	[
		'frame-src',
		'localhost:*',

		'script-src',
		'data:',
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
	].join(' '),
];

if (process.env.NODE_ENV === 'production') {
	csp.push(
		[
			// type
			'connect-src',
			"'self'",
			"'unsafe-inline'",
			'blob:',
			'data:',
		].join(' ')
	);
}

module.exports = csp.join('; ');
