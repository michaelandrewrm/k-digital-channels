import { shallowMount } from '@vue/test-utils';
import component from '@views/v-sirvase';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sirvase.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = [
		{
			id: 'request-1',
			type: {
				id: '01',
				name_es: 'Transferencias y Traspasos',
				name_en: 'Transfers',
			},
			requestDate: '01-01-2022 00:00:00',
			status: {
				id: '01',
				name_es: 'Solicitada',
				name_en: 'Requested',
			},
			description: 'description',
		},
	];

	const get = jest.fn().mockResolvedValue({ data: [] });

	beforeEach(async () => {
		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ path: '/main/sirvase-welcome', name: 'sirvase-welcome' });
		router.addRoute({ path: '/main/sirvase-dashboard', name: 'sirvase-dashboard' });

		store.mockModule('sirvase', { get });

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router });
	});

	it('has a name equal to v-sirvase', () => {
		expect(wp.vm.$options.name).toBe('v-sirvase');
	});

	it('should navigate to welcome sirvase page', () => {
		expect(router.currentRoute.name).toBe('sirvase-welcome');
	});

	it('should navigate to dashboard sirvase page', async () => {
		const getAction = jest.fn().mockResolvedValue({ data: fixture });
		store.mockModule('sirvase', { get: getAction });

		wp = shallowMount(component, { localVue, store, router });

		await flushPromises();

		expect(router.currentRoute.name).toBe('sirvase-dashboard');
	});
});
