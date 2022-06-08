const { readFileSync, readdirSync, statSync } = require('fs');
const { join, extname, basename } = require('path');

/**
 * Return an array with all the .vue and .js files in ./src
 */
const getProjectFiles = () => {
	const files = [];
	const recursive = (dirname) => {
		const dirs = readdirSync(dirname);
		dirs.forEach((dir) => {
			const newDirname = join(dirname, dir);
			const isDirectory = statSync(newDirname).isDirectory();
			if (isDirectory) {
				recursive(newDirname);
			}
			if (extname(newDirname) === '.vue' || extname(newDirname) === '.js') {
				const cmp = {
					name: basename(newDirname),
					version: '',
					path: newDirname,
					content: readFileSync(newDirname).toString(),
					dependencies: [],
					check: false,
				};
				files.push(cmp);
			}
		});
	};
	recursive('src');
	return files;
};

module.exports = {
	getProjectFiles,
};
