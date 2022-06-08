import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-product-actions';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-actions.vue', () => {
	let wp;
	let router;
	let store;

	const WActions = {
		template: `
			<div data-testid="actions-account">
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;
		router = localRouter;
		store = shallowStore;

		store.registerModule('resources', { namespaced: true, state: { hasResult: true } });

		wp = shallowMount(Component, {
			localVue,
			propsData: { type: 'account', product: { ...accounts[0], profiles: [] } },
			router,
			store,
			stubs: { WActions },
		});
	});

	it('has a name equal w-product-actions', () => {
		expect(wp.vm.$options.name).toBe('w-product-actions');
	});

	it('should return a widget', async () => {
		await flushPromises();
		expect(wp.find('[data-testid="actions-account"]').exists()).toBeTruthy();
	});

	it('should return nothing', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { product: { ...accounts[0], profiles: [] } },
			router,
			store,
			stubs: { WActions },
		});

		await flushPromises();
		expect(wp.find('[data-testid="actions-account"]').exists()).not.toBeTruthy();
	});
});
