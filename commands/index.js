const inquirer = require('inquirer');
const { spawn } = require('child_process');
const { projectsMapped } = require('./projects');

const { log } = console;

const toLowerCase = (val) => val.toLowerCase();

inquirer
	.prompt([
		{
			type: 'list',
			name: 'what',
			message: 'What do you want to do?',
			choices: [
				{
					name: 'Serve',
					value: 'serve',
				},
				{
					name: 'Build',
					value: 'build',
				},
				{
					name: 'Unit Test',
					value: 'test:unit',
				},
				{
					name: 'E2E Test',
					value: 'test:e2e',
				},
				{
					name: 'Lint',
					value: 'lint',
				},
				{
					name: 'Audit',
					value: 'audit',
				},
			],
			filter: toLowerCase,
		},
	])
	.then(({ what }) => {
		return new Promise((resolve) => {
			return inquirer
				.prompt([
					{
						type: 'list',
						name: 'who',
						message: `Which project do you want to ${what}?`,
						choices: projectsMapped,
						when: () => ['serve', 'build', 'test:e2e', 'audit'].includes(what),
					},
					{
						type: 'list',
						name: 'where',
						message: 'In which environment?',
						choices: [
							{
								name: 'Mocks',
								value: 'mck',
							},
							{
								name: 'Develop [DEV]',
								value: 'dev',
							},
							{
								name: 'Pre-Production [TST]',
								value: 'tst',
							},
							{
								name: 'Production',
								value: 'pro',
							},
						],
						filter: toLowerCase,
						when: () => what === 'serve' || what === 'build',
					},
				])
				.then(({ who, where, which }) =>
					resolve({
						what,
						who,
						where,
						which,
					})
				);
		});
	})
	.then(({ what, who, where = what === 'test:e2e' ? 'mck' : null, which }) => {
		const args = [];
		let suggestedCommand = `npm run ${what}`;
		const endpoints = {
			dev: 'https://api-dev.grupocaminos.net',
			mck: 'https://api-mocks.grupocaminos.net',
			tst: 'https://api-tst.grupocaminos.net',
			pro: 'https://api.grupocaminos.es',
		};
		const endpoint = endpoints[where];

		if (what && who) {
			suggestedCommand = `npm run ${what}:${who}`;
		}

		if (what && which) {
			suggestedCommand = `npm run ${what}:${which}`;
		}

		log(suggestedCommand);

		spawn(suggestedCommand, args, {
			stdio: 'inherit',
			shell: true,
			env: {
				...process.env,
				VUE_APP_CURRENT_PROJECT: who,
				VUE_APP_ENDPOINT: endpoint,
				VUE_APP_ENDPOINT_MODE: where,
				VUE_APP_DEPLOY_ENVIRONMENT: 'dev',
			},
		});
	});
