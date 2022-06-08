const fs = require('fs');
const http = require('http');
const { spawnSync } = require('child_process');
const handler = require('serve-handler');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const getPort = require('get-port');
const chalk = require('chalk');
const boxen = require('boxen');

function launchChromeAndRunLighthouse(url, server) {
	const opts = {
		chromeFlags: ['--show-paint-rects'],
	};
	return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome) => {
		Object.assign(opts, { port: chrome.port });
		const config = {
			extends: 'lighthouse:default',
			settings: {
				output: 'html',
				throttlingMethod: 'devtools',
			},
		};
		return lighthouse(url, opts, config).then((results) => {
			const dir = `${process.cwd()}/dist/${
				process.env.VUE_APP_CURRENT_PROJECT
			}-reports/performance/`;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			fs.writeFileSync(`${dir}/index.html`, results.report);
			return chrome.kill().then(() => {
				server.close();
				return results.lhr;
			});
		});
	});
}

(async () => {
	const PORT = await getPort({ port: getPort.makeRange(5000, 5100) });
	const localAddress = 'http://localhost:';
	spawnSync(`npm run build:${process.argv[2]}`, [], {
		stdio: 'inherit',
		shell: true,
	});

	const server = http.createServer((request, response) => {
		return handler(request, response, {
			public: `${process.cwd()}/dist/${process.argv[2]}/`,
		});
	});

	server.listen(PORT, () => {
		const color = process.argv[2] === 'bancofar' ? 'cyanBright' : 'yellow';
		let message = chalk[color](`Serving ${process.argv[2]}!`);
		message += `\n\n${chalk.bold('- Local:')}              ${localAddress}${PORT}`;
		console.log(
			boxen(message, {
				padding: 1,
				borderColor: color,
				margin: 1,
			})
		);
		return launchChromeAndRunLighthouse(`http://localhost:${PORT}`, server);
	});
})();
