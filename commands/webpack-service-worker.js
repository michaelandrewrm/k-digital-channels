/* eslint-disable */
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const path = require('path');
const getManifestEntriesFromCompilation = require('workbox-webpack-plugin/build/lib/get-manifest-entries-from-compilation');
const ConcatSource = require('webpack-sources/lib/ConcatSource');

class ServiceWorkerPlugin {
	constructor(options) {
		this.options = Object.assign(
			{
				entry: 'src/sw.js',
				output: 'sw.js',
			},
			options
		);
	}

	apply(compiler) {
		compiler.hooks.make.tapAsync(this.constructor.name, async (compilation, callback) => {
			const swSrc = path.join(compiler.context, this.options.entry);
			const swKey = 'sw';

			const childOptions = {
				...compiler.options,
				devtool: false,
				entry: { [swKey]: swSrc },
				target: 'webworker',
				output: {
					...compiler.options.output,
					filename: this.options.output,
				},
			};

			const childCompiler = compilation.createChildCompiler(
				this.constructor.name,
				childOptions.output
			);

			childCompiler.context = compiler.context;
			childCompiler.options = childOptions;
			childCompiler.outputFileSystem = compiler.outputFileSystem;

			new SingleEntryPlugin(compiler.context, swSrc, swKey).apply(childCompiler);

			compilation.hooks.additionalAssets.tapAsync(this.constructor.name, (childProcessDone) => {
				childCompiler.hooks.make.tapAsync(this.constructor.name, (childCompilation, callback) => {
					childCompilation.hooks.afterHash.tap(this.constructor.name, () => {
						childCompilation.hash = compilation.hash;
						childCompilation.fullHash = compilation.fullHash;
					});
					callback();
				});

				childCompiler.runAsChild((err, entries, childCompilation) => {
					if (err) {
						return childProcessDone(err);
					}

					if (childCompilation.errors.length > 0) {
						return childProcessDone(childCompilation.errors[0]);
					}

					compilation.assets = Object.assign(childCompilation.assets, compilation.assets);

					compilation.namedChunkGroups = Object.assign(
						childCompilation.namedChunkGroups,
						compilation.namedChunkGroups
					);

					const childChunkFileMap = childCompilation.chunks.reduce((chunkMap, chunk) => {
						chunkMap[chunk.name] = chunk.files;
						return chunkMap;
					}, {});

					compilation.chunks.forEach((chunk) => {
						const childChunkFiles = childChunkFileMap[chunk.name];

						if (childChunkFiles) {
							chunk.files.push(...childChunkFiles.filter((v) => !chunk.files.includes(v)));
						}
					});

					childProcessDone();
				});
			});
			callback();
		});

		compiler.hooks.emit.tapAsync(this.constructor.name, async (compilation, callback) => {
			const manifestEntries = await getManifestEntriesFromCompilation(compilation, {
				chunks: [],
				excludeChunks: [],
			});
			const manifestUrls = manifestEntries.map(({ url }) => url);
			const preparedArray = JSON.stringify(manifestUrls).replace(/"/g, `'`);
			const manifestString = `self.__precacheManifest = ${preparedArray};\n`;

			compilation.assets[this.options.output] = new ConcatSource(
				manifestString,
				compilation.assets[this.options.output]
			);
			callback();
		});
	}
}

module.exports = ServiceWorkerPlugin;
