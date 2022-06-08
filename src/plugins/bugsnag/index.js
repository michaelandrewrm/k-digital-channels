import Vue from 'vue';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

const bugsnagAPIKey = '03d077791a2927cc8d354fcc3f75f9eb';
const bugsnagClient = Bugsnag.start({
	apiKey: bugsnagAPIKey,
	appVersion: window.VUE_APP_CONFIG.version || process.env.VUE_APP_VERSION,
	releaseStage: window.VUE_APP_CONFIG.env || process.env.VUE_APP_DEPLOY_ENVIRONMENT || 'dev',
	enabledReleaseStages: ['prd', 'tst'],
	enabledBreadcrumbTypes: ['request', 'process', 'log', 'user', 'state', 'error', 'manual'],
	plugins: [new BugsnagPluginVue(Vue)],
});

export default bugsnagClient;
