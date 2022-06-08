import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-signature-list.vue';
import flushPromises from 'flush-promises';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-signature-list.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to w-signature-list', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'pending' },
		});

		expect(wp.vm.$options.name).toBe('w-signature-list');
	});

	it('should fetch the movements', async () => {
		const fetchAction = jest
			.fn()
			.mockResolvedValue({ data: [{ signatureId: '1' }, { signatureId: '2' }] });

		store.mockModule('signatures', { fetch: fetchAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'pending' },
			stubs: { WList },
		});

		await flushPromises();

		expect(fetchAction).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				status: 'pending',
			})
		);

		await wp
			.findAll('[data-testid="list"] [status="pending"]')
			.at(0)
			.trigger('click');

		expect(router.history.current.name).toBe('signature-detail');
		expect(router.history.current.params).toMatchObject({
			signatureId: '1',
			type: 'pending',
		});
	});

	it('should show an error when service fails', async () => {
		const fetchAction = jest.fn().mockRejectedValue();

		store.mockModule('signatures', { fetch: fetchAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'pending' },
			stubs: { WList },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});
});
