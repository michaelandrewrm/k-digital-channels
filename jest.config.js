const aliases = require('./aliases.config').jest;

module.exports = {
	browser: true,
	testEnvironment: 'jest-environment-jsdom-sixteen',
	globals: {
		'vue-jest': {
			experimentalCSSCompile: false,
			resources: {
				scss: ['<rootDir>/src/design/$1'],
			},
		},
	},
	moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'scss'],
	moduleNameMapper: { ...aliases },
	modulePathIgnorePatterns: ['<rootDir>/src/locales/'],
	preset: '@vue/cli-plugin-unit-jest',
	setupFiles: ['<rootDir>/tests/unit/setup/'],
	setupFilesAfterEnv: ['@testing-library/jest-dom'],
	testMatch: ['**/**/*.unit.(js|jsx|ts|tsx)'],
	testURL: 'http://localhost/',
	transformIgnorePatterns: [
		'<rootDir>/node_modules/(?!@material|unibabel|hammerjs|vue-virtual-scroll-list)',
	],
	transform: {
		'.*\\.(vue)$': 'vue-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	collectCoverage: Boolean(process.env.VUE_APP_ENABLE_COVERAGE),
	collectCoverageFrom: [
		'src/components/*.{js,vue}',
		'src/layouts/*.{js,vue}',
		'src/modals/*.{js,vue}',
		'src/store/modules/**/*.{js,vue}',
		'src/views/*.{js,vue}',
		'src/widgets/**/*.{js,vue}',
		'src/projects/skyline/app.{js,vue}',
		'src/projects/assisted-channels/store/modules/**/*.{js,vue}',
		'src/projects/skyline/store/modules/**/*.{js,vue}',
		'src/plugins/i18nExtended/*.{js,vue}',
		'!src/services/*.{js,vue}',
		'!src/store/modules/mocks/**.*',
		'!src/store/modules/resources/m-resources.js',
		'!src/store/modules/products/m-repayments.js',
		'!src/store/modules/products/product-families.js',
		'!src/store/modules/products/product-icons.js',
		'!src/store/modules/products/product-image.js',
		'!src/store/modules/notification/m-notification.js',
		'!src/store/modules/move-money/frequency-types.js',
		'!src/components/c-parallax-header.vue',
		'!src/components/c-chart.vue',
		'!src/components/c-text-field-icon.vue',
		'!src/components/c-icon-button.vue',
		'!src/components/c-virtual-list.vue',
		'!src/components/c-virtual-item.vue',
		'!src/views/v-sso-rsi.vue',
		'!src/views/v-sso-rsi-form.vue',
		'!src/views/v-sso-skyline.vue',
		'!src/views/v-sso-lighthouse.vue',
		'!src/views/v-bizum-transfer.vue',
		'!src/views/v-correos-cash-qr.vue',
		'!src/views/v-sirvase-detail.vue',
		'!src/views/v-assisted-sirvase.vue',
	],
	coverageDirectory: `dist/${process.env.VUE_APP_CURRENT_PROJECT}-reports/coverage`,
	coverageReporters: ['html', 'text-summary'],
	coverageThreshold: {
		global: {
			statements: 95,
			branches: 90,
			functions: 94,
			lines: 95,
		},
	},
	errorOnDeprecated: true,
	snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue-tjw'],
	snapshotResolver: './tests/unit/setup/snapResolver.js',
	reporters: [
		'default',
		[
			'jest-junit',
			{ outputDirectory: `dist/${process.env.VUE_APP_CURRENT_PROJECT}-reports/junit` },
		],
	],
};
