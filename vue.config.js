const path = require('path');
const { existsSync } = require('fs');
const zlib = require('zlib');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackScriptRemover = require('./commands/webpack-script-remover');
const WebpackServiceWorker = require('./commands/webpack-service-worker');
const { webpack: alias } = require('./aliases.config');
const CSP = require('./csp.config');
const { projects, projectsMapped } = require('./commands/projects');

if (!process.env.VUE_APP_CURRENT_PROJECT) {
	const [firstProjectDefined] = Object.keys(projects);
	process.env.VUE_APP_CURRENT_PROJECT = firstProjectDefined;
}

const { VUE_APP_CURRENT_PROJECT, NODE_ENV, VUE_APP_ENDPOINT_MODE } = process.env;
const PROD_MODE = NODE_ENV === 'production' && VUE_APP_ENDPOINT_MODE !== 'mck';
const projectDir = VUE_APP_CURRENT_PROJECT;
const localPublicDir = `./src/projects/${projectDir}/public`;
const manifest = require(`${localPublicDir}/manifest.json`);
const outputDir = `dist/${projectDir}`;
const possibleFavicon = `src/projects/${projectDir}/assets/img/favicon.ico`;
const defaultFavicon = 'public/img/icons/favicon-16x16.png';
const favicon = existsSync(possibleFavicon) ? possibleFavicon : defaultFavicon;

/**
 * @type import('@vue/cli-service').ProjectOptions
 */
module.exports = {
	outputDir,
	transpileDependencies: ['v-calendar', 'seamless-scroll-polyfill', 'vue-virtual-scroll-list'],
	configureWebpack: {
		devtool: 'source-map',
		resolve: { alias },
		optimization: {
			splitChunks: {
				chunks: 'all',
				minSize: 0,
				maxSize: 0,
				minChunks: 2,
				maxAsyncRequests: Infinity,
				cacheGroups: {
					bugsnag: {
						test: /[\\/]node_modules[\\/]@bugsnag[\\/]/,
						name: 'bugsnag',
						chunks: 'all',
						minChunks: 1,
					},
					hammerjs: {
						test: /[\\/]node_modules[\\/]hammerjs[\\/]/,
						name: 'hammerjs',
						chunks: 'all',
						minChunks: 1,
					},
					highcharts: {
						test: /[\\/]node_modules[\\/]highcharts[\\/]/,
						name: 'highcharts',
						chunks: 'all',
						minChunks: 1,
					},
					vue: {
						test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
						name: 'vue',
						chunks: 'all',
						minChunks: 1,
					},
					products: {
						enforce: true,
						test: /[\\/]widgets[\\/]products[\\/]/,
						name(module) {
							const moduleFileName = module
								.identifier()
								.split(/[\\/]/)
								.slice(1, -1)
								.reduceRight((item) => item);

							return `w-product-${moduleFileName}`;
						},
						chunks: 'all',
					},
				},
			},
		},
		plugins: PROD_MODE
			? [
					new WebpackScriptRemover(),
					new WebpackServiceWorker({
						entry: 'src/service-worker.js',
						output: 'service-worker.js',
					}),
					new CompressionPlugin({
						filename: '[path][base].gz',
						algorithm: 'gzip',
						test: /\.(js|css|html|svg)$/,
						minRatio: Number.MAX_SAFE_INTEGER,
					}),
					new CompressionPlugin({
						filename: '[path][base].br',
						algorithm: 'brotliCompress',
						test: /\.(js|css|html|svg)$/,
						minRatio: Number.MAX_SAFE_INTEGER,
						compressionOptions: {
							params: {
								[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
							},
						},
					}),
			  ]
			: [new WebpackScriptRemover()],
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: "@import '@/design/theme.scss';",
				sassOptions: { includePaths: ['./node_modules'] },
			},
		},
	},
	devServer: {
		host: '0.0.0.0',
		disableHostCheck: true,
	},
	pages: {
		index: {
			favicon,
			entry: `src/projects/${VUE_APP_CURRENT_PROJECT}/entry.js`,
			title: projectsMapped.find(({ value }) => value === VUE_APP_CURRENT_PROJECT).name,
			projectId: VUE_APP_CURRENT_PROJECT,
			ua: { bancofar: 'GTM-M565QJ3', caminos: 'GTM-KBMWHB8' }[VUE_APP_CURRENT_PROJECT],
			chunks: ['chunk-vendors', 'chunk-common', 'index', 'bugsnag', 'vue'],
			meta: {
				'Content-Security-Policy': {
					'http-equiv': 'Content-Security-Policy',
					'content': CSP,
				},
				'format-detection': {
					name: 'format-detection',
					content: 'telephone=no',
				},
			},
		},
	},
	pwa: {
		workboxPluginMode: 'GenerateSW',
		name: manifest.name,
		themeColor: manifest.theme_color,
		manifestOptions: manifest,
		workboxOptions: {
			swDest: 'workbox-service-worker.js',
			importWorkboxFrom: 'cdn',
			exclude: [/\.DS_Store$/, /robots\.txt$/, /\.map$/, /manifest\.json$/],
		},
		iconPaths: {
			favicon32: './favicon.ico',
			favicon16: './favicon.ico',
			appleTouchIcon: './icons/pwaIcon.png',
			maskIcon: './icons/pwaIcon.png',
			msTileImage: './icons/pwaIcon.png',
		},
	},
	chainWebpack: (config) => {
		config.module
			.rule('vue')
			.use('vue-loader')
			.loader('vue-loader')
			.tap((options) =>
				Object.assign(options, {
					transformAssetUrls: {
						...options.transformAssetUrls,
						'c-icon': 'src',
						'c-icon-button': 'icon',
						'c-list-icon-item': 'icon',
						'c-card-item': 'icon',
					},
					exposeFilename: true,
				})
			)
			.end();

		config
			.plugin('copy')
			.tap((options) => [[{ from: path.resolve(__dirname, localPublicDir) }, ...options[0]]]);

		config.plugins.delete('prefetch-index');

		if (PROD_MODE) {
			config.module
				.rule('exclude-mirage')
				.test(/node_modules\/miragejs\//)
				.use('null-loader')
				.loader('null-loader');

			config.module
				.rule('exclude-plugin-server')
				.test(/plugins\/server\/index/)
				.use('null-loader')
				.loader('null-loader');
		}
	},

	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false,
			analyzerMode: PROD_MODE ? 'static' : 'disabled',
			reportFilename: `../${projectDir}-reports/build/index.html`,
		},
	},
};
