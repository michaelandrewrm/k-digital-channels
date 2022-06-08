import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-deposits.vue';
import flushPromises from 'flush-promises';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-deposits.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to w-correos-cash-deposits', () => {
		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('w-correos-cash-deposits');
	});

	it('should fetch the list', async () => {
		const get = jest.fn().mockResolvedValue({ data: [{ id: '1' }, { id: '2' }] });

		store.mockModule('correos-cash', { get });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList },
		});

		await flushPromises();

		expect(get).toHaveBeenCalled();

		await wp.findComponent({ name: 'w-correos-cash-deposit' }).trigger('click');
		expect(router.history.current.name).toBe('correos-cash-detail');
		expect(router.history.current.params).toMatchObject({ depositId: '1' });
	});

	it('should show an error when service fails', async () => {
		const get = jest.fn().mockRejectedValue();
		store.mockModule('correos-cash', { get });
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList },
		});
		await flushPromises();
		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});
});
