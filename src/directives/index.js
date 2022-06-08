import Vue from 'vue';

const requireDirective = require.context(
	// Look for files in the current directory
	'.',
	// Do not look in subdirectories
	false,
	// Only include "a11y-" prefixed .js files
	/a11y-[\w-]+\.js$/
);

// For each matching file name...
requireDirective.keys().forEach((fileName) => {
	// Get the component config
	const directiveConfig = requireDirective(fileName);
	const directiveName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '');

	Vue.directive(directiveName, directiveConfig.default || directiveConfig);
});
