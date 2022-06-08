import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-premium.vue';
import categorizeProducts from '@modules/products/product-sort';

import accounts from '@tests/fixtures/products/accounts';
import cards from '@tests/fixtures/products/cards';
import deposits from '@tests/fixtures/products/deposits';

const fixture = categorizeProducts([...accounts, ...cards, ...deposits]);

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-premium.vue', () => {
	let wp;
	let store;

	const fetch = jest.fn().mockResolvedValue(fixture);

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('products', { fetch });
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { familyId: 'subscription' },
			sync: false,
		});
	});

	it('has a name equal to v-premium', () => {
		expect(wp.vm.$options.name).toBe('v-premium');
	});

	it('should sum just accounts and cards', () => {
		expect(
			wp
				.findComponent({ name: 'c-acrylic-sheet' })
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Suscripción premium 246,90 €');
	});
});
