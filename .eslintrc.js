module.exports = {
	root: true,

	env: {
		node: true,
	},

	plugins: ['prettier'],

	extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier', 'plugin:vue-i18n/recommended'],

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 'off',
		'quotes': ['error', 'single', { avoidEscape: true }],
		'indent': [
			'error',
			'tab',
			{
				ignoredNodes: ['ConditionalExpression *', 'TemplateLiteral'],
				SwitchCase: 1,
			},
		],
		'func-names': 'off',
		'no-bitwise': 'off',
		'no-template-curly-in-string': 'off',
		'comma-dangle': [
			'error',
			{
				arrays: 'ignore',
				objects: 'only-multiline',
				imports: 'only-multiline',
				exports: 'never',
				functions: 'never',
			},
		],
		'linebreak-style': ['error', 'unix'],
		'import/no-extraneous-dependencies': 'off',
		'consistent-return': 'off',
		'no-unused-vars': [
			'error',
			{
				varsIgnorePattern: 'Vue',
				args: 'after-used',
				ignoreRestSiblings: true,
			},
		],
		'import/no-dynamic-require': 'off',
		'import/no-unresolved': 'off',
		'import/extensions': 'off',
		'object-curly-newline': [
			'error',
			{
				multiline: true,
				consistent: true,
			},
		],
		'curly': ['error', 'all'],
		'default-case': 'off',
		'vue-i18n/no-dynamic-keys': 'error',
		'vue-i18n/no-unused-keys': ['error'],
		'prettier/prettier': 'error',
	},

	parserOptions: {
		parser: 'babel-eslint',
	},

	settings: {
		'vue-i18n': {
			localeDir: './src/locales/*.json || ./src/projects/locales/*.json',
		},
	},

	overrides: [
		{
			files: ['**/tests/unit/**/*.unit.{j,t}s?(x)', '**/**/*.unit.{j,t}s?(x)', 'tests/unit/**/*.*'],
			env: {
				jest: true,
			},
			globals: {
				test: 'writable',
				describe: 'writable',
				it: 'writable',
				expect: 'writable',
				router: 'writable',
				store: 'writable',
				localVue: 'writable',
				mount: 'writable',
				shallowMount: 'writable',
				jest: 'writable',
				createPristineVue: 'writable',
			},
		},
	],
};
