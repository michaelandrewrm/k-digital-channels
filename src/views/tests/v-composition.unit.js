import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-composition.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-composition.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		router.push({
			name: 'composition',
			params: {
				familyId: 'investment-portfolio',
				productId: '826cdae7-8ae9-4121-885f-1e59b677b64e',
				type: 'RV',
				tab: 'composition',
			},
		});

		const fetch = jest.fn().mockResolvedValue();
		const get = jest.fn().mockResolvedValue({
			alias: 'Cuenta asesorada de inversiones',
			assets: [
				{
					productTypeCode: 'RV',
					marketPrice: { amount: 19.99, currency: { id: 'EUR' } },
					availableTitles: 32,
				},
				{
					productTypeCode: 'RV',
					marketPrice: { amount: 19.99, currency: { id: 'EUR' } },
					availableTitles: 99,
				},
				{
					productTypeCode: 'RF',
					marketPrice: { amount: 15.99, currency: { id: 'EUR' } },
					availableTitles: 12,
				},
			],
		});

		store.mockModule('products', { fetch, get });
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });
	});

	it('has a name equal to v-composition', () => {
		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-composition');
	});

	/**
	 * Debería mostrar la vista con dos tabs que puedan alternados desde
	 * la url y desde el slider.
	 */
	it('has two tabs and user can navigate through them', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				familyId: 'investment-portfolio',
				productId: '826cdae7-8ae9-4121-885f-1e59b677b64e',
				tab: 'composition',
				type: 'RV',
			},
			attachTo: document.body,
		});
		await flushPromises();

		expect(wp.find('[data-testid="data-composition"]').attributes('data-active')).toBeTruthy();
		expect(wp.find('[data-testid="data-movements"]').attributes('data-active')).toBeFalsy();

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 1);
		await wp.setProps({ tab: 'movements' });

		expect(wp.find('[data-testid="data-composition"]').attributes('data-active')).toBeFalsy();
		expect(wp.find('[data-testid="data-movements"]').attributes('data-active')).toBeTruthy();

		expect(router.currentRoute.name).toBe('composition');
		expect(router.currentRoute.params.tab).toBe('movements');
		expect(router.currentRoute.params.type).toBe('RV');

		await wp.find('[data-testid="slider"]').vm.$emit('change', 1);
		expect(router.currentRoute.params.type).toBe('RF');
	});
});
