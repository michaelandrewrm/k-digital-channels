import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-message-list.vue';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-message-list.vue', () => {
	let store;

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;
	});

	it('has a name equal to w-message-list', () => {
		const request = jest.fn().mockResolvedValue({ data: [] });

		store.registerModule('communications', {
			namespaced: true,
			actions: { getMessages: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'alerts' },
			stubs: { WList },
		});

		expect(wp.vm.$options.name).toBe('w-message-list');
	});

	it('renders an alert correctly', async () => {
		const request = jest.fn().mockResolvedValue({ data: [{ id: 1 }] });

		store.registerModule('communications', {
			namespaced: true,
			actions: { getMessages: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'alerts' },
			stubs: { WList },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
	});

	it('renders a document correctly', async () => {
		const request = jest.fn().mockResolvedValue({ data: [{ id: 1 }] });

		store.registerModule('communications', {
			namespaced: true,
			actions: { getDocuments: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'documents' },
			stubs: { WList },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
	});

	it('shows an error when the service fails', async () => {
		const request = jest.fn().mockRejectedValue();

		store.registerModule('communications', {
			namespaced: true,
			actions: { getMessages: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'alerts' },
			stubs: { WList },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	it('marks a message as read when it does not have a review date', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: [{ id: 1, type: { id: 1 } }] });
		const markMessageAsRead = jest.fn().mockRejectedValue();

		store.registerModule('communications', {
			namespaced: true,
			actions: { getMessages: request, markMessageAsRead },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'alerts' },
			stubs: { WList },
		});

		await flushPromises();
		await wp.find('[data-testid="list"] [type="alerts"]').trigger('click');

		expect(markMessageAsRead).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ id: 1, type: { id: 1 } })
		);
	});
});
