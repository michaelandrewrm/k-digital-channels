const { existsSync, readdirSync, statSync, readFileSync } = require('fs');
const { join } = require('path');

const getDirectories = (path) =>
	readdirSync(path).filter((f) => statSync(join(path, f)).isDirectory());

const projectsDir = './src/projects';
const projects = getDirectories(projectsDir);

const projectsMapped = projects
	.map((value) => {
		const file = join(projectsDir, value, 'public', 'manifest.json');

		if (existsSync(file)) {
			const { name } = JSON.parse(readFileSync(file));

			return { name, value };
		}

		return false;
	})
	.filter(Boolean);

module.exports = {
	projects,
	projectsMapped,
};
