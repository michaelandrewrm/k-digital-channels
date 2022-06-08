import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-register.vue';
import CButton from '@tests/stubs/c-button.stub';
import CCheckbox from '@tests/stubs/generic-checkbox.stub';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-register.vue', () => {
	let wp;
	let store;
	let router;

	const getTerms = jest.fn().mockResolvedValue({ template: '<div></div>', version: '1.0.2' });
	const getTermsInPDF = jest.fn().mockResolvedValue('pdfurl');
	const signUp = jest.fn().mockResolvedValue();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('bizum', { getTerms, signUp, getTermsInPDF });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-bizum-register', () => {
		expect(wp.vm.$options.name).toBe('v-bizum-register');
	});

	/**
	 * Debería mostrar los términos y condiciones, y si el usuario los
	 * acepta debería salir un botón para continuar. Si el usuario
	 * continúa debería mostrar una pantalla de éxito.
	 */
	it('accept terms and conditions with success', async () => {
		await flushPromises();

		await wp.find('[data-testid="accept-terms"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(store.mockedActions['bizum/signUp']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				productId: '1234',
				version: '1.0.2',
			})
		);

		await wp.find('[data-testid="continue"]').trigger('click');

		expect(router.currentRoute.name).toBe('bizum-dashboard');
	});

	/**
	 * Debería mostrar los términos y condiciones, pero si el usuario no
	 * los acepta, no debería mostrar ningún botón para continuar.
	 */
	it('not accept terms and conditions so user cant continue', async () => {
		await flushPromises();

		expect(wp.find('[data-testid="accept-terms"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
	});

	/**
	 * Debería mostrar los términos y condiciones, y el usuario debería
	 * aceptarlos, pero si ocurre un error al darse de alta, terminaría
	 * viendo una pantalla de error.
	 */
	it('accept terms and conditions, but if an error ocurred, see the error', async () => {
		const signUpAction = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getTerms, signUp: signUpAction, getTermsInPDF });

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});

		await flushPromises();

		await wp.find('[data-testid="accept-terms"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	/**
	 * Si existiese algún error al mostrar los términos y condiciones,
	 * el usuario debería ver una pantalla de error.
	 */
	it('an error ocurred requesting terms and conditions, see the error', async () => {
		const getTermsAction = jest.fn().mockRejectedValue();
		const signUpAction = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getTerms: getTermsAction, signUp: signUpAction, getTermsInPDF });

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});

		await flushPromises();

		expect(wp.find('[data-testid="accept-terms"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	/**
	 * Debería abrir la modal de portabilidad cuando el servicio
	 * devuelva 406 y el usuario debería aceptar la portabilidad.
	 */
	it('init portability when service returns 406 and user accepts', async () => {
		const signUpAction = jest.fn().mockRejectedValue({
			response: {
				status: 406,
				data: { signupId: 'abc' },
			},
		});
		const requestPortability = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue(true);
		const handle = jest.fn().mockResolvedValue({ response: { status: 200 } });

		store.mockModule('bizum', {
			getTerms,
			signUp: signUpAction,
			requestPortability,
			getTermsInPDF,
		});
		store.mockModule('modal', { open });
		store.mockModule('otp', { handle });
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});

		await flushPromises();

		await wp.find('[data-testid="accept-terms"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(store.mockedActions['modal/open']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-bizum-portability' }),
			})
		);
		expect(store.mockedActions['bizum/requestPortability']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ signupId: 'abc' })
		);
		expect(store.mockedActions['otp/handle']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-bizum-otp' }),
				props: { signupId: 'abc' },
			})
		);

		await wp.find('[data-testid="continue"]').trigger('click');

		expect(router.currentRoute.name).toBe('bizum-dashboard');
	});

	/**
	 * Debería abrir la modal de portabilidad cuando el servicio
	 * devuelva 406, pero si el usuario no acepta la portabilidad
	 * entonces mostraría un error.
	 */
	it('init portability when service returns 406 and user denies', async () => {
		const signUpAction = jest.fn().mockRejectedValue({
			response: {
				status: 406,
				data: { signupId: 'abc' },
			},
		});
		const requestPortability = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue(false);
		const handle = jest.fn().mockResolvedValue();

		store.mockModule('bizum', {
			getTerms,
			signUp: signUpAction,
			requestPortability,
			getTermsInPDF,
		});
		store.mockModule('modal', { open });
		store.mockModule('otp', { handle });
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});

		await flushPromises();

		await wp.find('[data-testid="accept-terms"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(store.mockedActions['modal/open']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-bizum-portability' }),
			})
		);

		expect(wp.find('[data-testid="accept-terms"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	/**
	 * Debería abrir la modal de portabilidad cuando el servicio
	 * devuelva 406, el usuario debería aceptar la portabilidad y
	 * luego meter la otp. Si no mete la otp correctamente no debería
	 * poder continuar. Debería mostrar un error.
	 */
	it('show error if user dont enter otp correctly on portability', async () => {
		const signUpAction = jest.fn().mockRejectedValue({
			response: {
				status: 406,
				data: { signupId: 'abc' },
			},
		});
		const requestPortability = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue(true);
		const handle = jest.fn().mockResolvedValue();

		store.mockModule('bizum', {
			getTerms,
			signUp: signUpAction,
			requestPortability,
			getTermsInPDF,
		});
		store.mockModule('modal', { open });
		store.mockModule('otp', { handle });
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: '1234' },
			stubs: { CButton, CCheckbox },
		});

		await flushPromises();

		await wp.find('[data-testid="accept-terms"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});
});
