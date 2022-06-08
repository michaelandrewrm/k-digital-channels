// https://docs.cypress.io/api/introduction/api.html
import { makeServer } from '@plugins/server';
import locale from '@locales/es';

describe('Transfer', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	it('Creates a new transfer', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		// GO TO TRANSFER
		cy.contains('[data-testid="toolbar"] label', locale['MENU.TRANSFERS']).click();
		cy.url().should('include', 'transfers');

		cy.contains('button', locale['TRANSFERS.NEW_TRANSFER.TITLE']).click();
		cy.url().should('include', 'transfer');

		// CLICK ON FIRST ORIGIN
		cy.getElementByTestid('form-origin', 'list').should('be.visible');
		cy.getElementByTestid('form-origin', 'list', 'product-card-item')
			.first()
			.click();

		// CLICK ON FIRST DESTINATION
		cy.getElementByTestid('form-destination', 'list').should('be.visible');
		cy.getElementByTestid('form-destination', 'list', 'product-card-item')
			.first()
			.click();
		cy.getElementByTestid('form-amount').should('be.visible');

		// GO BACK AND ENTER A NEW DESTINATION
		cy.getElementByTestid('section-destination', 'edit-destination').click();
		cy.getElementByTestid('form-destination', 'list').should('be.visible');
		cy.getElementByTestid('form-destination', 'sheet-buttons')
			.find('button')
			.click();

		// ENTER A NEW DESTINATION DATA
		cy.getElementByTestid('form-new-destination', 'name')
			.clear()
			.type('Esteban');

		cy.getElementByTestid('form-new-destination', 'iban')
			.clear()
			.type('ES7921000813610123456789');

		cy.getElementByTestid('form-new-destination', 'submit').click();
		cy.getElementByTestid('form-amount').should('be.visible');

		// ENTER AMOUNT
		cy.getElementByTestid('form-amount').should('be.visible');
		cy.getElementByTestid('form-amount', 'amount')
			.clear()
			.type('2.5');
		cy.getElementByTestid('form-amount', 'reason')
			.clear()
			.type('PAGO DEUDA');

		cy.getElementByTestid('form-amount', 'submit').click();

		cy.getElementByTestid('submit-transfer').click();

		// INSERT VALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);

		cy.getElementByTestid('otp-code-input').type('123456');
		cy.getElementByTestid('modal-buttons')
			.find('button')
			.click();

		cy.contains('h1', locale['TRANSFERS.RESPONSE.NEW.SUCCESS']).should('be.visible');
	});

	it('Schedules a new transfer and then cancels it', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		// GO TO TRANSFER
		cy.contains('[data-testid="toolbar"] label', locale['MENU.TRANSFERS']).click();
		cy.url().should('include', 'transfers');

		cy.contains('button', locale['TRANSFERS.NEW_TRANSFER.TITLE']).click();
		cy.url().should('include', 'transfer');

		// CLICK ON FIRST ORIGIN
		cy.getElementByTestid('form-origin', 'list').should('be.visible');
		cy.getElementByTestid('form-origin', 'list', 'product-card-item')
			.first()
			.click();

		// CLICK ON FIRST DESTINATION
		cy.getElementByTestid('form-destination', 'list').should('be.visible');
		cy.getElementByTestid('form-destination', 'list', 'product-card-item')
			.first()
			.click();

		// ENTER AMOUNT
		cy.getElementByTestid('form-amount').should('be.visible');
		cy.getElementByTestid('form-amount', 'amount')
			.clear()
			.type('1');

		// SCHEDULE IT
		cy.getElementByTestid('periodicity-periodic').check({ force: true });
		cy.getElementByTestid('frequency').select('Mensual');
		cy.getElementByTestid('date').type('31/12/2050', { force: true });
		cy.getElementByTestid('max-date').type('31/12/2051', { force: true });

		// SUBMIT TRANSFER
		cy.getElementByTestid('form-amount', 'submit').click();
		cy.getElementByTestid('submit-transfer').click();

		// INSERT VALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);

		cy.getElementByTestid('otp-code-input').type('123456');
		cy.getElementByTestid('modal-buttons')
			.find('button')
			.click();

		cy.contains('h1', locale['TRANSFERS.RESPONSE.SCHEDULED.SUCCESS']).should('be.visible');
		cy.getElementByTestid('confirmation-success', 'accept').click();

		// GO TO MY TRANSFERS
		cy.contains('button', locale['TRANSFERS.MY_TRANSFERS.TITLE']).click();
		cy.url().should('include', 'my-transfers');

		// SELECT SCHEDULED TRANSFERS
		cy.contains('[data-testid="tabs-nav"] a', locale['TRANSFERS.TYPE.SCHEDULED']).click();

		// CLICK ON TRANSFER WE MADE
		cy.get('[data-testid="list-scheduled"]').click();
		cy.url().should('include', 'transfer-detail');

		// TRY TO CANCEL THE TRANSFER
		cy.getElementByTestid('layout-buttons', 'main-button').click();
		cy.getElementByTestid('submit-transfer').click();

		// INSERT VALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);

		cy.getElementByTestid('otp-code-input').type('123456');
		cy.getElementByTestid('modal-buttons')
			.find('button')
			.click();

		// ASSERT TRANSFER IS CANCELED
		cy.contains('h1', locale['TRANSFERS.RESPONSE.CANCEL.SUCCESS']).should('be.visible');
		cy.getElementByTestid('confirmation-success', 'accept').click();

		cy.url().should('include', 'my-transfers');

		cy.contains('[data-testid="list-scheduled"]', '1,00 €  31/12/2050  Mensual').should(
			'not.exist'
		);

		cy.getElementByTestid('back-button')
			.should('have.length', 1)
			.and('be.visible')
			.click();
		cy.url().should('include', 'transfers');
	});
});
