import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-password-change.vue';
import CTextField from '@tests/stubs/c-text-field.stub';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-password-change.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { CTextField },
		});
	});

	it("has a name equal 'w-password-change'", () => {
		expect(wp.vm.$options.name).toBe('w-password-change');
	});

	it('validates a password with numbers', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('asd123');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');

		expect(strengthLevel).toBe('MEDIUM_PASS');
	});

	it('validates a password with special chars', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('~!_123');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('MEDIUM_PASS');
	});

	it('validates a password with uppercase chars and numbers', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('ABC123');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('HIGH_PASS');
	});

	it('validates a password with uppercase chars', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('ABCabc');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('MEDIUM_PASS');
	});

	it("don't validates a basic password with letters", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('qwerty');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('LOW_PASS');
	});

	it("don't validates a basic password with numbers", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('123456');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('TOO_LOW_PASS');
	});

	it("don't validates an empty password", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('');

		expect(wp.find('[id="password-validation"]').exists()).toBeTruthy();

		await wp.find('[data-testid="input-change-password"]').setValue('asd123');

		expect(wp.find('[id="password-validation"]').exists()).toBeFalsy();
	});

	it("don't validates short password", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('123');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('TOO_LOW_PASS');
	});

	it("don't validates white spaces password", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('  123  ');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('TOO_LOW_PASS');
	});

	it("don't validates repeated chars password", async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('aaaaaa');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');
		expect(strengthLevel).toBe('TOO_LOW_PASS');
	});

	it('validates passwords equality and inequality', async () => {
		const changePassword = jest.fn().mockResolvedValue();

		store.mockModule('user', { changePassword });
		await wp.find('[data-testid="input-change-password"]').setValue('ASD123');
		await wp.find('[data-testid="input-change-retry-password"]').setValue('ASD124');

		wp.vm.submit();
		await flushPromises();

		expect(changePassword).not.toHaveBeenCalled();

		await wp.find('[data-testid="input-change-retry-password"]').setValue('ASD123');

		wp.vm.submit();
		await flushPromises();

		expect(changePassword).toHaveBeenCalledWith(expect.anything(), 'ASD123');
	});

	it('resets the form', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('123rata');
		await wp.find('[data-testid="input-change-retry-password"]').setValue('123rata');

		wp.vm.reset();
		await localVue.nextTick();

		expect(wp.find('[data-testid="input-change-password"]').element.value).toBe('');
		expect(wp.find('[data-testid="input-change-retry-password"]').element.value).toBe('');
	});

	it('expands a password strength message', async () => {
		expect(wp.find('[data-testid="password-strength"]').exists()).toBeFalsy();
		await wp.find('[data-testid="input-change-password"]').setValue('1234gato');
		expect(wp.find('[data-testid="password-strength"]').exists()).toBeTruthy();

		expect(wp.find('[data-testid="password-requirements"]').exists()).toBeFalsy();
		await wp.find('[data-testid="password-strength"] i').trigger('click');
		expect(wp.find('[data-testid="password-strength-requirements"]').exists()).toBeTruthy();
	});

	it('validates password length greater than 10', async () => {
		await wp.find('[data-testid="input-change-password"]').setValue('asd123qweXs');
		const strengthLevel = wp.find('[data-testid="password-strength"]').attributes('data-strength');

		expect(strengthLevel).toBe('TOO_LOW_PASS');
	});
});
