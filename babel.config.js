module.exports = (api) => {
	api.cache(true);

	const presets = ['@vue/cli-plugin-babel/preset'];
	const plugins = [];
	if (process.env.NODE_ENV === 'test') {
		presets.push([
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		]);
		plugins.push('@babel/plugin-syntax-dynamic-import');
		plugins.push('transform-require-context');
	}

	return {
		presets,
		plugins,
	};
};
