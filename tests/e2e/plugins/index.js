// https://docs.cypress.io/guides/guides/plugins-guide.html

/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */
const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
	on(
		'file:preprocessor',
		webpack({
			webpackOptions: require('@vue/cli-service/webpack.config'),
			watchOptions: {},
		})
	);

	return {
		...config, // ===
		// General
		// https://docs.cypress.io/guides/references/configuration.html#Global
		// ===
		watchForFileChanges: true,
		// ===
		// Environment variables
		// https://docs.cypress.io/guides/guides/environment-variables.html#Option-1-cypress-json
		// ===
		env: {
			CI: process.env.CI,
		},
		// ===
		// Viewport
		// https://docs.cypress.io/guides/references/configuration.html#Viewport
		// ===
		viewportWidth: 375,
		viewportHeight: 812,
		// ===
		// Animations
		// https://docs.cypress.io/guides/references/configuration.html#Animations
		// ===
		waitForAnimations: true,
		animationDistanceThreshold: 2,
		// ===
		// Timeouts
		// https://docs.cypress.io/guides/references/configuration.html#Timeouts
		// ===
		defaultCommandTimeout: 4000,
		execTimeout: 60000,
		pageLoadTimeout: 60000,
		requestTimeout: 5000,
		responseTimeout: 30000,
		// ===
		// Main Directories
		// https://docs.cypress.io/guides/references/configuration.html#Folders-Files
		// ===
		supportFile: 'tests/e2e/support/index.js',
		integrationFolder: 'tests/e2e/specs',
		fixturesFolder: 'tests/e2e/fixtures',
		// ===
		// Videos & Screenshots
		// https://docs.cypress.io/guides/core-concepts/screenshots-and-videos.html
		// ===
		videoUploadOnPasses: false,
		videoCompression: 32,
		videosFolder: `dist/${process.env.VUE_APP_CURRENT_PROJECT}-reports/e2e/videos`,
		screenshotsFolder: `dist/${process.env.VUE_APP_CURRENT_PROJECT}-reports/e2e/screenshots`,
	};
};
