// https://docs.cypress.io/api/introduction/api.html
import { makeServer } from '@plugins/server';
import locale from '@locales/es';

describe('Personal Area', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	it('Changes the password', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		// GO TO PERSONAL AREA
		cy.getElementByTestid('more-button')
			.should('be.visible')
			.click();
		cy.contains('button', 'Mi área personal')
			.should('be.visible')
			.click();

		cy.url().should('include', 'personal-area');

		// // CHANGE PASSWORD
		cy.contains('button', 'Cambiar contraseña')
			.should('be.visible')
			.click();

		cy.url().should('include', 'change-password');

		// CREATE NEW PASSWORD
		cy.getElementByTestid('input-change-password').type('Mantra1000');
		cy.getElementByTestid('input-change-retry-password').type('Mantra1000');
		cy.contains('[data-testid="layout-buttons"] button', locale['ACTIONS.CHANGE_PWD']).click();

		cy.resolveOTP();

		cy.contains('[data-testid="success-title"]', locale['PASSWORD_CHANGE.CONFIRMATION.TITLE']);
		cy.getElementByTestid('continue').click();

		cy.url().should('include', 'personal-area');

		// LOGOUT
		cy.logOut();

		// LOGIN WITH NEW PASSWORD
		cy.logIn({ username: '62819644C', password: 'Mantra1000' });

		cy.url().should('include', 'main/global');
		cy.getElementByTestid('product-list').should('be.visible');
	});

	it('Shows the last login date', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		// GO TO PERSONAL AREA
		cy.getElementByTestid('more-button')
			.should('be.visible')
			.click();
		cy.contains('button', 'Mi área personal')
			.should('be.visible')
			.click();

		cy.url().should('include', 'personal-area');

		cy.contains('Último acceso')
			.next()
			.contains(Cypress.moment().format('DD/MM/YYYY'));
	});
});
