import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-feedback.vue';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';
import CInputRate from '@tests/stubs/generic-radio.stub';
import CTransferTextarea from '@tests/stubs/generic-textarea.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-feedback.vue', () => {
	let wp;
	let store;
	let router;

	const postFeedback = jest.fn().mockResolvedValue();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.mockModule('communications', { postFeedback });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton, CInputRate, CTransferTextarea },
		});
	});

	it('has a name equal to v-feedback', () => {
		expect(wp.vm.$options.name).toBe('v-feedback');
	});

	it('should enable the submit button after fill the fields', async () => {
		expect(wp.find('[data-testid="submit-button').element).not.toBeEnabled();

		await wp.find('[data-testid=review]').setValue('review');
		await wp
			.findAll('input[type="radio"]')
			.at(4)
			.setChecked();

		expect(wp.find('[data-testid="submit-button').element).toBeEnabled();
	});

	it('should request a feedback', async () => {
		await wp.find('[data-testid=review]').setValue('review');
		await wp
			.findAll('input[type="radio"]')
			.at(4)
			.setChecked();
		await wp.find('[data-testid="submit-button').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(postFeedback).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				review: 'review',
				rate: 5,
			})
		);

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
	});

	it('should show an error after request a feedback', async () => {
		const postFeedbackAction = jest.fn().mockRejectedValue();
		store.mockModule('communications', { postFeedback: postFeedbackAction });

		await wp.find('[data-testid=review]').setValue('review');
		await wp
			.findAll('input[type="radio"]')
			.at(0)
			.setChecked();
		await wp.find('[data-testid="submit-button').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});
});
