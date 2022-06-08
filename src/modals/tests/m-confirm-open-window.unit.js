import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-confirm-open-window';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-confirm-open-window.vue', () => {
	let wp;
	let router;

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
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			stubs: {
				'l-modal': LModal,
				'c-button': CButton,
			},
		});
	});

	it('has a name equal m-confirm-open-window', () => {
		expect(wp.vm.$options.name).toBe('m-confirm-open-window');
	});

	it('should back and emit a close event on cancel modal', async () => {
		const back = jest.spyOn(router, 'back');

		expect(back).not.toHaveBeenCalled();
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="cancel"]').trigger('click');

		expect(back).toHaveBeenCalled();
		expect(wp.emitted().close).toBeTruthy();
	});

	it('should emit a close event on accept modal', async () => {
		const back = jest.spyOn(router, 'back');

		expect(back).not.toHaveBeenCalled();
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="accept"]').trigger('click');

		expect(back).not.toHaveBeenCalled();
		expect(wp.emitted().close).toBeTruthy();
	});
});
