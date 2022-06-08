// https://docs.cypress.io/api/introduction/api.html
import { makeServer } from '@plugins/server';
import locale from '@locales/es';

describe('Session', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	it.skip('Shows the remember password modal', () => {
		cy.visit('/');

		cy.get('[data-testid=modal-cookies]').should('be.visible');
		cy.get('[data-testid=accept-cookies]').click();

		cy.get('#splash', { timeout: 10000 }).should('to.not.exist');

		cy.contains(locale['INFO.REMEMBER_PASSWORD.TITLE']).click();

		cy.get('[data-testid=modal]').should('be.visible');
		cy.get('[data-testid=modal]').invoke('css', 'position', 'absolute');
		cy.get('[data-testid=modal] h1').should('contain', '¿Has olvidado tu contraseña?');

		cy.get('[data-testid=modal-close-button]').click();

		cy.get('[data-testid=modal]').should('to.not.exist');
	});

	it("Can't login a user with invalid credentials", () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '', password: '', waitUntilLogin: false });

		cy.contains('[data-testid=username-validation]', locale['FORM.FIELD.REQUIRED']);
		cy.contains('[data-testid=password-validation]', locale['FORM.FIELD.REQUIRED']);

		cy.logIn({ username: '62819644C', password: 'PASSWORD' });

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']);

		cy.focused().should('be.empty');
	});

	it('Shows a temp blocked modal on 3 invalid login attempts', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '1Attempt' });

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']);
		cy.focused().should('be.empty');

		cy.logIn({ username: '62819644C', password: '2Attempt' });

		cy.contains('[data-testid=modal-header]', 'Error').should('be.visible');
		cy.get('[data-testid=modal-buttons]').click();

		cy.logIn({ username: '62819644C', password: '2Attempt', waitUntilLogin: false });

		cy.contains('[data-testid=modal-header]', locale.SIGN_BLOCKED_TEMP_TITLE).should('be.visible');
		cy.get('[data-testid=modal-buttons]').click();
	});

	it('Shows a temp blocked modal on 6 invalid login attempts', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			loginErrorCount: 3,
		});

		cy.firstLogIn({ username: '62819644C', password: '4Attempt' });

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']);
		cy.focused().should('be.empty');

		cy.logIn({ username: '62819644C', password: '5Attempt' });

		cy.contains('[data-testid=modal-header]', 'Error').should('be.visible');
		cy.get('[data-testid=modal-buttons]').click();

		cy.logIn({ username: '62819644C', password: '6Attempt' });

		cy.contains('[data-testid=modal-header]', locale.SIGN_BLOCKED_TEMP_TITLE).should('be.visible');
		cy.get('[data-testid=modal-buttons]').click();
	});

	it('Shows a permanently blocked modal on 9 invalid login attempts', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			loginErrorCount: 6,
		});

		cy.firstLogIn({ username: '62819644C', password: '7Attempt' });

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']);
		cy.focused().should('be.empty');

		cy.logIn({ username: '62819644C', password: '8Attempt' });

		cy.contains('[data-testid=modal-header]', 'Error').should('be.visible');
		cy.get('[data-testid=modal-buttons]').click();

		cy.logIn({ username: '62819644C', password: '9Attempt' });

		cy.contains('[data-testid=modal-header]', locale.SIGN_BLOCKED_TITLE).should('be.visible');

		cy.contains('[data-testid=modal-buttons] button', locale.CHANGE_USER).click();

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']).should(
			'not.exist'
		);

		cy.get('[data-testid=username]')
			.should('be.empty')
			.and('have.focus');
	});

	it('Login a user with the right user and password', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		cy.url().should('include', 'main/global');
		cy.getElementByTestid('product-list').should('be.visible');
	});

	it('Login a user and remember his username', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		server.create('user', {
			name: 'Daniela',
			documentId: '91216086H',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456', rememberUser: true });
		cy.url().should('include', 'main');
		cy.logOut();

		cy.get('[data-testid="username"]').should('not.exist');
		cy.get('[data-testid="welcome-back-user"]');
		cy.contains('[data-testid="welcome-back-user"]', 'Eusebio');

		cy.logIn({ password: '123456' });
		cy.url().should('include', 'main');
		cy.logOut();

		cy.get('[data-testid="remove-remembered-user-button"]').click();

		cy.logIn({ username: '91216086H', password: '123456' });
		cy.url().should('include', 'main');
		cy.logOut();

		cy.get('[data-testid="username"]').should('not.exist');
		cy.get('[data-testid="welcome-back-user"]');
		cy.contains('[data-testid="welcome-back-user"]', 'Eusebio');
	});

	it('Login a user who need to change his password', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			passwordChange: true,
		});

		cy.firstLogIn({ username: '62819644C', password: '123456', waitUntilLogin: false });

		// CHANGE PASSWORD
		cy.contains('[data-testid=modal-header]', locale['PASSWORD_CHANGE.TITLE']);

		cy.get('[data-testid="input-change-password"]').type('Mantra1000');
		cy.get('[data-testid="input-change-retry-password"]').type('Mantra1000');
		cy.get('[data-testid="modal-buttons"] button').click();

		// INSERT VALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);

		cy.get('[data-testid="otp-code-input"]').type('123456');
		cy.get('[data-testid="modal-buttons"] button').click();

		// PASSWORD CHANGED
		cy.contains('[data-testid=modal-header]', locale['PASSWORD_CHANGE.CONFIRMATION.TITLE']).should(
			'exist'
		);
		cy.get('[data-testid="modal-buttons"] button').click();

		cy.url().should('include', 'main/global');
		cy.getElementByTestid('product-list').should('be.visible');
	});

	it("Doesn't receive the right sms code", () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			forceSCA: true,
		});

		cy.firstLogIn({ username: '62819644C', password: '123456', waitUntilLogin: false });

		// INSERT AN INVALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW AN ERROR
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'be.visible'
		);
		cy.contains('[data-testid=modal]', '2 intentos').should('be.visible');

		cy.get('[data-testid="otp-code-input"]').clear();
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'have.css',
			'opacity',
			'0'
		);

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW AN ERROR
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'be.visible'
		);
		cy.contains('[data-testid=modal]', '1 intento').should('be.visible');

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').clear();
		cy.get('[data-testid="otp-code-input"]').type('111111');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW THE USER WAS BLOCKED
		cy.contains('[data-testid=modal-header]', locale.SIGN_BLOCKED_TITLE).should('be.visible');

		cy.contains('[data-testid=modal-buttons] button', locale.CHANGE_USER).click();

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']).should(
			'not.exist'
		);

		cy.get('[data-testid=username]')
			.should('be.empty')
			.and('have.focus');
	});

	it.skip('Asks for another sms code', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
			forceSCA: true,
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);
		cy.get('[data-testid="ask-for-a-new-otp-code"]').should('not.be.visible');

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		cy.log('Ask for a new OTP code');
		cy.get('[data-testid="ask-for-a-new-otp-code"]')
			.should('be.visible')
			.and('have.css', 'opacity', '1');
		cy.get('[data-testid="ask-for-a-new-otp-code"]').click();
		cy.get('[data-testid="asking-otp-code-icon"]')
			.should('be.visible')
			.and('have.css', 'opacity', '1');

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		cy.log('Ask for a new OTP code');
		cy.get('[data-testid="ask-for-a-new-otp-code"]')
			.should('be.visible')
			.and('have.css', 'opacity', '1');
		cy.get('[data-testid="ask-for-a-new-otp-code"]').click();
		cy.get('[data-testid="asking-otp-code-icon"]')
			.should('be.visible')
			.and('have.css', 'opacity', '1');
		cy.get('[data-testid="asking-otp-code-icon"]').should('not.be.visible');

		// SHOW OTP HELP
		cy.contains('[data-testid="modal-actions"]', locale.OTP_SHOW_HELP).click();
		cy.contains('[data-testid="modal"]', locale.OTP_INVALID_TITLE);
		cy.get('[data-testid="modal-close-button"]').click();

		// INSERT A VALID OTP
		cy.get('[data-testid="otp-code-input"]')
			.clear()
			.type('123456');
		cy.get('[data-testid="modal-buttons"] button').click();

		cy.url().should('include', 'main/global');
		cy.getElementByTestid('product-list').should('be.visible');
	});

	it.skip('Expires the session after 10 minutes of network inactivity', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });

		cy.url().should('include', 'main');

		cy.get('[data-testid=product-list]').should('not.be.empty');

		cy.clock(Date.now());
		cy.tick(11 * 60 * 1000);

		cy.contains('[data-testid=modal-header]', locale.SESSION_EXPIRED_TITLE);

		cy.get('[data-testid="modal-buttons"] button').click();

		cy.url().should('include', 'login');

		cy.go('back');

		cy.url().should('include', 'login');
	});

	it('Greets the user every time they login', () => {
		server.create('user', {
			name: 'Eusebio',
			documentId: '62819644C',
			password: '123456',
		});

		server.create('user', {
			name: 'Daniela',
			documentId: '91216086H',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456' });
		cy.url().should('include', 'main');
		cy.get('[data-testid="greeting-message"]')
			.contains('Hola', { matchCase: false })
			.contains('Eusebio')
			.should('be.visible');
		cy.logOut();

		cy.logIn({ username: '62819644C', password: '123456' });
		cy.url().should('include', 'main');
		cy.get('[data-testid="greeting-message"]')
			.contains('Hola', { matchCase: false })
			.contains('Eusebio')
			.should('be.visible');
		cy.logOut();

		cy.logIn({ username: '91216086H', password: '123456' });
		cy.url().should('include', 'main');
		cy.get('[data-testid="greeting-message"]')
			.contains('Hola', { matchCase: false })
			.contains('Daniela')
			.should('be.visible');
	});

	it('Should block the user when he tries to change his password and fail [CD-2458]', () => {
		server.create('user', {
			name: 'Pablo',
			documentId: '62819644C',
			password: '123456',
			passwordChange: true,
		});

		cy.firstLogIn({ username: '62819644C', password: '123456', waitUntilLogin: false });

		// CHANGE PASSWORD
		cy.contains('[data-testid=modal-header]', locale['PASSWORD_CHANGE.TITLE']);

		cy.get('[data-testid="input-change-password"]').type('Mantra1000');
		cy.get('[data-testid="input-change-retry-password"]').type('Mantra1000');
		cy.get('[data-testid="modal-buttons"] button').click();

		// INSERT AN INVALID OTP
		cy.contains('[data-testid=modal-header]', locale.OTP_TITLE);
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW AN ERROR
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'be.visible'
		);
		cy.contains('[data-testid=modal]', '2 intentos').should('be.visible');

		cy.get('[data-testid="otp-code-input"]').clear();
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'have.css',
			'opacity',
			'0'
		);

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').type('666666');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW AN ERROR
		cy.contains('[data-testid="otp-code-validation"]', locale.OTP_ERROR_MESSAGE).should(
			'be.visible'
		);
		cy.contains('[data-testid=modal]', '1 intento').should('be.visible');

		// INSERT AN INVALID OTP
		cy.get('[data-testid="otp-code-input"]').clear();
		cy.get('[data-testid="otp-code-input"]').type('111111');
		cy.get('[data-testid="modal-buttons"] button').click();

		// SHOULD SHOW THE USER WAS BLOCKED
		cy.contains('[data-testid=modal-header]', locale.SIGN_BLOCKED_TITLE).should('be.visible');

		cy.contains('[data-testid=modal-buttons] button', locale.CHANGE_USER).click();

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']).should(
			'not.exist'
		);

		cy.get('[data-testid=username]')
			.should('be.empty')
			.and('have.focus');
	});

	it('Should reset the form from errors after clicking remove remembered user [CD-2460]', () => {
		server.create('user', {
			name: 'Pablo',
			documentId: '62819644C',
			password: '123456',
		});

		cy.firstLogIn({ username: '62819644C', password: '123456', rememberUser: true });
		cy.url().should('include', 'main');
		cy.logOut();

		cy.logIn({ password: 'badPassword' });

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']).should(
			'exist'
		);

		cy.get('[data-testid="remove-remembered-user-button"]').click();

		cy.contains('[data-testid=password-validation]', locale['FORM.ERROR.INVALID_ACCESS']).should(
			'not.exist'
		);
	});
});
