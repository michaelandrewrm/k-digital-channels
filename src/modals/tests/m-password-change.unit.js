import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-password-change.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const LModal = {
	template: `
		<div class="l-modal">
			<slot />
			<slot name="buttons" />
		</div>
	`,
};

const WPasswordChange = {
	template: `
		<div ref="passwordChangeWidget" class="w-password-change"></div>
	`,
	methods: {
		submit: jest.fn().mockResolvedValue({ status: 204 }),
	},
};

describe('m-password-change.vue', () => {
	let wp;
	let store;
	let open;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;
		open = jest.fn().mockResolvedValue();

		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { LModal, WPasswordChange, CButton },
		});
	});

	it('has a name equal to m-password-change', () => {
		expect(wp.vm.$options.name).toBe('m-password-change');
	});

	it('enables button after a valid password', async () => {
		const passwordChangeWidget = wp.findComponent({ ref: 'passwordChangeWidget' });
		const button = wp.find('button');

		expect(button.attributes().disabled).toBeTruthy();

		await passwordChangeWidget.vm.$emit('valid', true);

		expect(button.attributes().disabled).toBeFalsy();
	});

	it('shows a modal after a successfully password change', async () => {
		await wp.findComponent({ ref: 'passwordChangeWidget' }).vm.$emit('valid', true);
		await wp.find('button').trigger('click');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-password-change-success' })
		);
	});

	it('emits a close event after an unsuccessfully password change', async () => {
		const error = new Error('');
		const widget = {
			template: '<div ref="passwordChangeWidget" class="w-password-change"/>',
			methods: { submit: jest.fn().mockRejectedValue(error) },
		};
		wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { LModal, WPasswordChange: widget, CButton },
		});

		await wp.findComponent({ ref: 'passwordChangeWidget' }).vm.$emit('valid', true);
		await wp.find('button').trigger('click');
		await flushPromises();

		expect(wp.vm.value).toEqual(error);
		expect(wp.emitted().close).toBeTruthy();
	});

	it('does not emit a close event when user presses ENTER without a valid password', async () => {
		expect(wp.vm.value).toBeFalsy();
		expect(wp.emitted().close).toBeFalsy();

		await wp.trigger('keypress.enter');

		expect(wp.vm.value).toBeFalsy();
		expect(wp.emitted().close).toBeFalsy();
	});
});
