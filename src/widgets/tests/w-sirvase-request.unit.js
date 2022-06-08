import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-sirvase-request.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-sirvase-request.vue', () => {
	let wp;
	let store;
	let router;

	const item1 = {
		id: '1',
		type: {
			id: '01',
			name_es: 'Transferencias y traspasos',
			name_en: 'Transfers',
		},
		requestDate: '12-04-2022 23:00:00',
		status: {
			id: '01',
			name_es: 'Solicitada',
			name_en: 'Requested',
		},
	};

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.registerModule('session', { namespaced: true, state: { lang: 'es' } });
	});

	it('has a name equal to w-sirvase-request', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				source: item1,
			},
		});

		expect(wp.vm.$options.name).toBe('w-sirvase-request');
	});

	it('should render a request properly', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				source: item1,
			},
		});

		expect(
			wp
				.find('[data-testid="type"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Transferencias y traspasos');

		expect(
			wp
				.find('[data-testid="date"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('12 / 04 / 2022 - 23:00');

		expect(
			wp
				.find('[data-testid="status"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Solicitada');
	});
});
