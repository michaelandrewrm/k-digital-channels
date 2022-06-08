import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-change-password';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const submitOK = jest.fn().mockResolvedValue({ status: 204 });
const submitKO = jest.fn().mockRejectedValue();

const WPasswordChange = {
	template: '<div ref="passwordChangeWidget" class="w-password-change"></div>',
	methods: {
		submit: submitOK,
		reset: jest.fn(),
	},
};

describe('v-change-password.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		jest.useFakeTimers();

		const { localRouter } = newInstance;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			stubs: { WPasswordChange, CButton },
		});

		router.push({ name: 'personal-area' });
	});

	it('has a name equal to v-change-password', () => {
		expect(wp.vm.$options.name).toBe('v-change-password');
	});

	it('should enable the change password button on valid passwords', async () => {
		const widget = wp.findComponent({ name: 'w-password-change' });
		const button = wp.find('[data-testid="action-button"]');

		expect(button.element).toBeDisabled();

		await widget.vm.$emit('valid', true);

		expect(button.element).not.toBeDisabled();
	});

	it('should request a password change without error', async () => {
		await wp.findComponent({ name: 'w-password-change' }).vm.$emit('valid', true);
		await wp.find('[data-testid="action-button"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeFalsy();
	});

	it('should show an error after request a password change', async () => {
		const widget = {
			template: '<div ref="passwordChangeWidget" class="w-password-change"></div>',
			methods: {
				submit: submitKO,
				reset: jest.fn(),
			},
		};

		wp = shallowMount(Component, {
			localVue,
			router,
			stubs: { WPasswordChange: widget, CButton },
		});

		await wp.findComponent({ name: 'w-password-change' }).vm.$emit('valid', true);
		await wp.find('[data-testid="action-button"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeFalsy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});
});
