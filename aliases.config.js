const path = require('path');
const { existsSync, writeFile } = require('fs');
const prettier = require('prettier');
const prettierRc = require('./prettier.config');
const jsconfigTemplate = require('./jsconfig.template');

const { error } = console;

const projectDir = process.env.VUE_APP_CURRENT_PROJECT;
const aliases = {
	'@assets': 'src/assets',
	'@components': 'src/components',
	'@design': 'src/design',
	'@directives': 'src/directives',
	'@theme': 'src/design/_theme-export.scss',
	'@icons': 'src/assets/icons',
	'@layouts': 'src/layouts',
	'@modals': 'src/modals',
	'@modules': 'src/store/modules',
	'@plugins': 'src/plugins',
	'@project': `src/projects/${projectDir}`,
	'@providers': 'src/providers',
	'@services': 'src/services',
	'@store': 'src/store',
	'@tests': 'tests/unit',
	'@utils': 'src/utils',
	'@views': 'src/views',
	'@widgets': 'src/widgets',
	'@locales': 'src/locales',
	'@skyline': 'src/projects/skyline',
	'@assisted': 'src/projects/assisted-channels',
};

const templateLocale = (p, d) => `src/projects/${p}/${d}`;

const localeAliases = {
	'@local-assets': 'assets',
	'@local-design': 'design',
	'@local-locales': 'locales',
	'@local-router': 'router',
	'@local-store': 'store',
	'@local-views': 'views',
};

// Load project aliases only if they exists
Object.entries(localeAliases).forEach(([alias, dir]) => {
	const localePath = templateLocale(projectDir, dir);

	if (existsSync(localePath)) {
		Object.assign(aliases, { [alias]: localePath });
	} else {
		// Load caminos as default
		Object.assign(aliases, { [alias]: templateLocale('caminos', dir) });
	}
});

module.exports = {
	webpack: {},
	jest: {},
	jsconfig: {},
};

function resolveSrc(_path) {
	return path.resolve(__dirname, _path);
}

Object.entries(aliases).forEach(([alias, aliasTo]) => {
	module.exports.webpack[alias] = resolveSrc(aliasTo);
	const aliasHasExtension = /\.\w+$/.test(aliasTo);
	module.exports.jest[`^${alias}$`] = aliasHasExtension
		? `<rootDir>/${aliasTo}`
		: `<rootDir>/${aliasTo}/index.js`;
	module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`;
	module.exports.jsconfig[`${alias}/*`] = [`${aliasTo}/*`];
	module.exports.jsconfig[alias] = aliasTo.includes('/index.')
		? [aliasTo]
		: [
				`${aliasTo}/index.js`,
				`${aliasTo}/index.json`,
				`${aliasTo}/index.vue`,
				`${aliasTo}/index.scss`,
				`${aliasTo}/index.css`,
		  ];
});

const jsconfigPath = resolveSrc('jsconfig.json');

writeFile(
	jsconfigPath,
	prettier.format(
		JSON.stringify({
			...jsconfigTemplate,
			compilerOptions: {
				...(jsconfigTemplate.compilerOptions || {}),
				paths: module.exports.jsconfig,
			},
		}),
		{
			...prettierRc,
			parser: 'json',
		}
	),
	(err) => {
		if (err) {
			error('Error while creating jsconfig.json from aliases.config.js.');
			throw err;
		}
	}
);
