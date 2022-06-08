/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */

const htmlWebpackPlugin = require('html-webpack-plugin');

const PLUGIN = 'WebpackScriptRemoverPlugin';
const EVENT = 'html-webpack-plugin-alter-asset-tags';

const isScript = ({ tagName }) => tagName === 'script';
const isStyle = (tag) =>
	tag.tagName === 'link' && tag.attributes && tag.attributes.rel === 'stylesheet';
const removeScriptElement = (tag) => !isScript(tag) && !isStyle(tag);

class WebpackScriptRemoverPlugin {
	apply(compiler) {
		const compile = this.compilationCallback.bind(this);
		const emit = this.emitCallback.bind(this);
		if (compiler.hooks) {
			compiler.hooks.compilation.tap(PLUGIN, compile);
			compiler.hooks.emit.tap(PLUGIN, emit);
		} else {
			compiler.plugin('compilation', compile);
			compiler.plugin('emit', emit);
		}
	}

	compilationCallback(compilation) {
		const alterAssetTags = this.alterAssetTagsCallback.bind(this, compilation);
		if (compilation.hooks) {
			const alterAssetTagGroups =
				compilation.hooks.htmlWebpackPluginAlterAssetTags ||
				htmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups;
			alterAssetTagGroups.tap(PLUGIN, alterAssetTags);
		} else {
			compilation.plugin(EVENT, alterAssetTags);
		}
	}

	alterAssetTagsCallback(compilation, pluginArgs, callback) {
		const headTagName = pluginArgs.hasOwnProperty('headTags') ? 'headTags' : 'head';
		const bodyTagName = pluginArgs.hasOwnProperty('bodyTags') ? 'bodyTags' : 'body';

		try {
			pluginArgs[headTagName] = pluginArgs[headTagName].filter(removeScriptElement);
			pluginArgs[bodyTagName] = pluginArgs[bodyTagName].filter(removeScriptElement);

			if (callback) {
				callback(null, pluginArgs);
			}
		} catch (err) {
			if (callback) {
				callback(err);
			} else {
				compilation.errors.push(err);
			}
		}
	}

	emitCallback(compilation, callback) {
		if (callback) {
			callback();
		}
	}
}

module.exports = WebpackScriptRemoverPlugin;
