import 'cypress-file-upload';
import locale from '@locales/es';

Cypress.Commands.add(
	'firstLogIn',
	({ username, password, rememberUser, waitUntilLogin = true } = {}) => {
		cy.visit('/');

		cy.get('#splash', { timeout: 10000 }).should('not.exist');

		cy.get('[data-testid=modal-cookies]').should('be.visible');
		cy.get('[data-testid=accept-cookies]').click();

		cy.logIn({ username, password, rememberUser, waitUntilLogin });
	}
);

Cypress.Commands.add('logIn', ({ username, password, rememberUser, waitUntilLogin } = {}) => {
	if (username) {
		cy.get('[data-testid="username"]')
			.clear()
			.type(username);
	}

	if (password) {
		cy.get('[data-testid="password"]')
			.clear()
			.type(password);
	}

	if (rememberUser) {
		cy.get('[data-testid="remember-user"]').click({ force: true });
		cy.get('[data-testid="modal"] [confirm]').click();
	}

	cy.contains(locale['ACTIONS.ENTER']).click();

	if (waitUntilLogin) {
		cy.getElementByTestid('spinner').should('be.visible');
		cy.getElementByTestid('spinner').should('not.be.visible');
	}
});

Cypress.Commands.add('logOut', () => {
	cy.getElementByTestid('more-button')
		.should('be.visible')
		.click();
	cy.getElementByTestid('logout-button')
		.should('be.visible')
		.click();
	cy.getElementByTestid('modal')
		.find('[confirm]')
		.should('be.visible')
		.click();
});

Cypress.Commands.add('getElementByTestid', (...args) => {
	return cy.get(args.map((id) => `[data-testid="${id}"]`).join(' '));
});

Cypress.Commands.add('resolveOTP', () => {
	cy.contains('Verifica tu teléfono').should('exist');
	cy.getElementByTestid('otp-code-input').type('123456');
	cy.getElementByTestid('modal-buttons')
		.contains('Aceptar')
		.click();
});
