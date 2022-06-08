import { makeServer } from '@plugins/server';
import locale from '@locales/es';

describe('Products', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	it.skip('Should show the movement detail of a managed fund [CD-3507]', () => {
		server.create('user', {
			name: 'Alejandro',
			documentId: '62819644C',
			password: '123456',
			products: [
				...server.createList('product', 1, 'managedPortfolio', {
					products: [...server.createList('product', 1, 'delegatedFund')],
				}),
			],
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		cy.url().should('include', 'main/global');

		cy.getElementByTestid('product-list').should('not.be.empty');

		cy.getElementByTestid('product-list', 'product-card-item').click();

		cy.get('header h1').should('contain', 'Mi cartera gestionada');

		cy.getElementByTestid('page-details-body', 'product-card-item').click();

		cy.getElementByTestid('list').should('not.be.empty');
		cy.get('header h1').should('contain', 'Mi fondo de inversión gestionado');

		cy.get(
			'[role="tabpanel"]:first-child [data-testid=list] [role="listitem"]:first-child button'
		).click();

		cy.get('header h1').should('contain', 'Mis fondos');

		cy.get('[role="listitem"]:first-child [data-testid=movement-fund-asset]').click();
		cy.get('header h1').should('contain', 'Detalle de movimiento');

		const OPERATION_DATE = locale['MOVEMENT.OPERATION_DATE'];
		cy.contains('[data-testid=page-details-body]', OPERATION_DATE).should('be.visible');
	});
});
