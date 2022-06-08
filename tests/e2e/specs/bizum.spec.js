// https://docs.cypress.io/api/introduction/api.html
import { makeServer } from '@plugins/server';

describe('Bizum', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			bizum: true,
			products: [
				...server.createList('product', 2, 'account', {
					balance: { amount: 1000, currency: { id: 'EUR' } },
					postedBalance: { amount: 1000, currency: { id: 'EUR' } },
				}),
			],
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		// Click en el menu para ir a la vista de transferencias
		cy.contains('Enviar y solicitar dinero').click();
		cy.url().should('include', 'transfers');

		// Click en bizum desde transferencias
		cy.getElementByTestid('bizum-register').click();
		cy.url().should('include', 'bizum/dashboard');
	});

	afterEach(() => {
		server.shutdown();
	});

	/**
	 * Envía un bizum con contenido adicional
	 */
	it('Envía un Bizum', () => {
		// Click en el botón de enviar dinero
		cy.contains('Enviar dinero').click();

		// Completamos el formulario
		cy.getElementByTestid('recipient').type('657139900');
		cy.getElementByTestid('amount').type('10,99');
		cy.getElementByTestid('reason').type('test SENT');

		// Agregamos una imagen como contenido adicional
		cy.contains('Agregar imagen').should('be.visible');
		cy.get('input[type="file"]').attachFile({
			filePath: '../../../src/projects/caminos/public/icons/pwaIcon.png',
		});
		cy.contains('[data-testid="image"]', 'Imagen agregada');
		cy.contains('Continuar').click();

		cy.contains('Confirmar').click();

		cy.resolveOTP();

		cy.contains('Bizum realizado con éxito').should('exist');

		cy.contains('Aceptar').click();
		cy.url().should('include', 'bizum/dashboard');

		// Vamos a movimientos de bizum, para ver el movimiento recién realizado
		cy.getElementByTestid('list')
			.contains('test SENT')
			.should('exist')
			.click();

		cy.url().should('include', 'bizum/movement');

		cy.getElementByTestid('content').should('be.visible');

		cy.getElementByTestid('content')
			.contains('Enviado a')
			.parent()
			.contains('+34657139900')
			.should('exist');

		cy.getElementByTestid('content')
			.contains('Importe')
			.parent()
			.contains('10,99')
			.should('exist');

		cy.getElementByTestid('content')
			.contains('Concepto')
			.parent()
			.contains('test SENT')
			.should('exist');

		cy.getElementByTestid('additional-content-image').should('be.visible');
	});

	/**
	 * Solicita un bizum y luego lo cancela
	 */
	it('Solicita dinero desde Bizum y luego cancela la solicitud', () => {
		cy.getElementByTestid('more-button').click();
		cy.contains('Solicitar dinero')
			.should('be.visible')
			.click();

		cy.getElementByTestid('recipient').type('657139900');
		cy.getElementByTestid('amount').type('2,99');
		cy.getElementByTestid('reason').type('please REQUEST SENT');

		cy.contains('Continuar').click();
		cy.contains('Confirmar')
			.should('be.visible')
			.click();

		cy.resolveOTP();

		cy.contains('Solicitud realizada con éxito').should('be.visible');

		cy.contains('Aceptar').click();
		cy.url().should('include', 'bizum/dashboard');

		cy.getElementByTestid('tabs-nav')
			.contains('Pendiente')
			.click();

		cy.getElementByTestid('list-pending')
			.should('be.visible')
			.contains('please REQUEST SENT')
			.should('exist')
			.click();

		cy.url().should('include', 'bizum/movement');

		cy.getElementByTestid('content').should('be.visible');

		cy.getElementByTestid('content')
			.contains('Solicitado a')
			.parent()
			.contains('+34657139900')
			.should('exist');

		cy.getElementByTestid('content')
			.contains('Importe')
			.parent()
			.contains('2,99')
			.should('exist');

		cy.getElementByTestid('content')
			.contains('Concepto')
			.parent()
			.contains('please REQUEST SENT')
			.should('exist');

		cy.contains('Cancelar solicitud').click();

		cy.contains('Confirma los datos de la solicitud a cancelar').should('be.visible');
		cy.getElementByTestid('section-origin').should('not.be.visible');
		cy.getElementByTestid('section-recipient').should('be.visible');
		cy.getElementByTestid('section-amount').should('be.visible');

		cy.getElementByTestid('comment').type('me arrepentí');
		cy.contains('Continuar').click();

		cy.contains('Confirmar').click();
		cy.resolveOTP();

		cy.contains('Aceptar').click();

		cy.url().should('include', 'bizum/dashboard');
		cy.getElementByTestid('list-pending')
			.should('be.visible')
			.contains('please REQUEST SENT')
			.should('not.exist');
	});

	/**
	 * Da de baja la cuenta de bizum
	 */
	it('Da de baja Bizum', () => {
		cy.getElementByTestid('more-info-button')
			.should('be.visible')
			.click({ scrollBehavior: false });

		cy.contains('Dar de baja Bizum')
			.should('be.visible')
			.click();

		cy.contains('Confirma los datos para la baja').should('exist');

		cy.contains('Confirmar baja Bizum')
			.should('be.visible')
			.click();

		cy.resolveOTP();

		cy.contains('Aceptar')
			.should('be.visible')
			.click();

		cy.getElementByTestid('bizum-register').click();
		cy.url().should('include', 'bizum/welcome');
		cy.getElementByTestid('start').should('be.visible');
	});

	/**
	 * Prepara para enviar un bizum, pero lo edita antes de enviar
	 * y le agrega contenido adicional
	 */
	it('Envía un bizum pero lo edita antes', () => {
		cy.contains('Enviar dinero').click();

		cy.getElementByTestid('recipient').type('657139900');
		cy.getElementByTestid('amount').type('1');
		cy.getElementByTestid('reason').type('test edit SENT');

		cy.contains('Continuar').click();

		cy.getElementByTestid('edit-amount').click();
		cy.getElementByTestid('amount').type('2');

		cy.contains('Agregar imagen').should('be.visible');

		cy.get('input[type="file"]').attachFile({
			filePath: '../../../src/projects/caminos/public/icons/pwaIcon.png',
		});
		cy.contains('[data-testid="image"]', 'Imagen agregada');
		cy.contains('Continuar').click();

		cy.getElementByTestid('edit-additionalImage').click();
		cy.getElementByTestid('image').should('exist');
		cy.getElementByTestid('remove-file').click();
		cy.contains('button', 'Eliminar').click();
		cy.contains('Imagen eliminada').click();
		cy.getElementByTestid('comment').type('Mi comentario');

		cy.contains('Continuar').click();

		cy.getElementByTestid('section-origin').should('be.visible');
		cy.getElementByTestid('section-recipient').should('be.visible');
		cy.getElementByTestid('section-amount').should('be.visible');
		cy.getElementByTestid('section-additionalImage').should('not.be.visible');
		cy.getElementByTestid('section-additionalText').should('be.visible');

		cy.contains('Confirmar').click();

		cy.resolveOTP();

		cy.contains('Bizum realizado con éxito').should('exist');

		cy.contains('Ir a Posición Global ').click();
		cy.url().should('include', 'main/global');
		cy.getElementByTestid('product-list').should('be.visible');
	});

	it('Envía una donación desde Bizum', () => {
		cy.getElementByTestid('more-button').click();
		cy.contains('Hacer una donación')
			.should('be.visible')
			.click();

		cy.getElementByTestid('ong')
			.should('be.visible')
			.click();

		cy.getElementByTestid('list')
			.find('button')
			.first()
			.should('be.visible')
			.click();

		cy.getElementByTestid('amount').type('0,99');
		cy.getElementByTestid('reason').type('te lo mereces DONATION');

		cy.contains('Continuar').click();
		cy.contains('Confirmar').click();

		cy.resolveOTP();

		cy.contains('Donación realizada con éxito').should('exist');

		cy.contains('Aceptar').click();

		cy.url().should('include', 'bizum/dashboard');

		cy.contains('Finalizado').click();

		cy.getElementByTestid('list-completed')
			.should('be.visible')
			.contains('te lo mereces DONATION')
			.should('be.visible');
	});
});
