import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-communication-detail.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-communication-detail.vue', () => {
	let wp;
	let store;

	const getMessage = jest.fn().mockResolvedValue({
		description: 'description',
		type: { id: 1 },
		creationDate: '2020-11-07T15:42:59.571Z',
		text: 'text',
	});

	const getDocument = jest.fn().mockResolvedValue({
		description: 'description',
		type: { id: 2 },
		creationDate: '2020-11-07T15:42:59.571Z',
		hasAttachment: true,
	});

	const downloadDocument = jest.fn().mockResolvedValue({
		pdf:
			'JVBERi0xLg10cmFpbGVyPDwvUm9vdDw8L1BhZ2VzPDwvS2lkc1s8PC9NZWRpYUJveFswIDAgMyAzXT4+XT4+Pj4+Pg==',
	});

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('communications', { getMessage, getDocument, downloadDocument });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'alerts', messageId: 'message-1' },
		});
	});

	it('has a name equal to v-communication-detail', async () => {
		await flushPromises();
		expect(wp.vm.$options.name).toBe('v-communication-detail');
	});

	it('renders an alert correctly', async () => {
		await flushPromises();
		expect(wp.element).toMatchSnapshot();
	});

	it('renders a document correctly', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'documents', messageId: 'message-1' },
		});

		await flushPromises();
		expect(wp.element).toMatchSnapshot();
	});

	it('should show an error when service fails', async () => {
		store.mockModule('communications', {
			getDocument,
			downloadDocument: jest.fn().mockRejectedValue(),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'documents', messageId: 'message-1' },
		});

		await flushPromises();
		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});

	it('should open a new window', async () => {
		const open = jest.spyOn(window, 'open');

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'documents', messageId: 'message-1' },
		});

		await flushPromises();
		await wp.find('[data-testid="view-document-button"]').trigger('click');

		expect(open).toHaveBeenCalled();
	});
});
