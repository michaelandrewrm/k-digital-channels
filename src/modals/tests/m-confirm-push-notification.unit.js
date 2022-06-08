import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-confirm-push-notification';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-confirm-push-notification.vue', () => {
	let wp;

	const LModal = {
		template: `
			<div class="l-modal" @keydown.capture="keyHandler">
				<slot name="header" />
				<slot />
				<slot name="buttons" />
			</div>
		`,
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			stubs: {
				'l-modal': LModal,
				'c-button': CButton,
			},
		});
	});

	it('has a name equal m-confirm-push-notification', () => {
		expect(wp.vm.$options.name).toBe('m-confirm-push-notification');
	});

	it('should emit a close event on cancel modal', async () => {
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="cancel"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBeFalsy();
	});

	it('should emit a close event on accept modal', async () => {
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="accept"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBeTruthy();
	});
});
