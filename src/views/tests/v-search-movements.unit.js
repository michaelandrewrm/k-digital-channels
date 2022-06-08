import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-search-movements.vue';
import CButton from '@tests/stubs/c-button.stub';
import CTransferField from '@tests/stubs/c-text-field.stub';
import accounts from '@tests/fixtures/products/accounts';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-search-movements.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		store.registerModule('products', {
			namespaced: true,
			actions: {
				get: jest.fn().mockImplementation(() => accounts[0]),
			},
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,

			stubs: {
				CButton,
				CTransferField,
				'c-transfer-date-picker': {
					template: `<input
						v-bind="$attrs"
						type="text"
						@input="$emit('input', $event.target.value)"
					/>`,
				},
			},
		});
	});

	it('has a name equal to v-search-movements', () => {
		expect(wp.vm.$options.name).toBe('v-search-movements');
	});

	it('should show the alias of a product as a subtitle', async () => {
		await wp.setProps({ productId: 'account-1', familyId: 'account' });
		await flushPromises();
		expect(wp.find('[data-testid=subtitle]').text()).toBe('Cuenta Corriente');
	});

	it('should navigate to product with dateFrom param', async () => {
		await wp.setProps({ productId: 'account-1', familyId: 'account' });
		await flushPromises();
		await wp.find('[data-testid="date-from"]').setValue('2020-08-18');
		await wp.find('[data-testid="search"]').trigger('click');

		expect(router.history.current).toMatchObject({
			params: expect.objectContaining({
				productId: 'account-1',
			}),
			query: expect.objectContaining({
				dateFrom: '20200818',
			}),
		});
	});

	it.skip('should navigate to product with reason param', async () => {
		await wp.setProps({ productId: 'account-1', familyId: 'account' });
		await flushPromises();
		await wp.find('[data-testid="reason"]').setValue('reasonMovement');
		await wp.find('[data-testid="search"]').trigger('click');

		expect(router.history.current).toMatchObject({
			params: expect.objectContaining({
				productId: 'account-1',
			}),
			query: expect.objectContaining({
				reason: 'reasonMovement',
			}),
		});
	});

	it('should navigate to product with dateTo param', async () => {
		const prevPage = router.history.current;
		await wp.setProps({ productId: 'account-1', familyId: 'account' });
		await flushPromises();
		await wp.find('[data-testid="date-to"]').setValue('2020-08-18');
		await wp.find('[data-testid="search"]').trigger('click');

		expect(prevPage).not.toBe(router.history.current);
		expect(router.history.current).toMatchObject({
			params: expect.objectContaining({
				productId: 'account-1',
			}),
			query: expect.objectContaining({
				dateTo: '20200818',
			}),
		});
	});

	it('should navigate previous page if not date selected', async () => {
		const prevPage = router.history.current;
		await wp.setProps({ productId: 'account-1', familyId: 'account' });
		await flushPromises();
		await wp.find('[data-testid="search"]').trigger('click');

		expect(prevPage).toBe(router.history.current);
	});
});
