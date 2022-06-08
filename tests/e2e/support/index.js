import './commands';

Cypress.on('window:before:load', (win) => {
	// eslint-disable-next-line no-param-reassign
	win.handleFromCypress = function handleFromCypress(request) {
		return fetch(request.url, {
			method: request.method,
			headers: request.requestHeaders,
			body: request.requestBody,
		}).then((res) => {
			const content =
				res.headers.map['content-type'] === 'application/json' ? res.json() : res.text();
			return new Promise((resolve) => {
				content.then((body) => resolve([res.status, res.headers, body]));
			});
		});
	};

	win.document.head.insertAdjacentHTML(
		'beforeend',
		`
		<style>
			* {
				animation-duration: 1ms !important;
				animation-delay: 1ms !important;
				transition-duration: 1ms !important;
				transition-delay: 1ms !important;
			}
		</style>
		`
	);
});
