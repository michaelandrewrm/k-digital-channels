const csp = [
	[
		'frame-src',
		'localhost:*',
		'*.grupocaminos.net',
		'*.grupocaminos.es',
		'bancofaronline.es',
		'*.bancocaminosonline.es',
		'*.bancofaronline.es',
		'*.bolsacaminos.com',
		'*.lineacaminos.com',
		'*.eu40.force.com',
		'*.salesforceliveagent.com',
		'*.my.salesforce.com',
		'*.inversis.com',
		'inversis.com',
		'uat-caminos.cs88.force.com;',

		'script-src',
		'data:',
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
		'*.grupocaminos.net',
		'*.grupocaminos.es',
		'*.bancocaminosonline.es',
		'bancofaronline.es',
		'*.bancofaronline.es',
		'*.googletagmanager.com',
		'*.gstatic.com',
		'*.google-analytics.com',
		'*.salesforceliveagent.com',
		'*.my.salesforce.com',
		'tags.tiqcdn.com/utag/tiqapp/',
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
			'*.bugsnag.com',
			'reqres.in',
			'bancofaronline.es',
			'*.bancofaronline.es',
			'*.bancocaminos.es',
			'*.grupocaminos.net',
			'*.grupocaminos.es',
			'*.googletagmanager.com',
			'*.gstatic.com',
			'*.google-analytics.com',
			'*.bolsacaminos.com',
			'*.lineacaminos.com',
		].join(' ')
	);
}

module.exports = csp.join('; ');
