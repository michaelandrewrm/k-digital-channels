import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-password-change-success.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-password-change-success.vue', () => {
	let wp;
	let store;
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

	const CButton = {
		template: `
			<button v-bind="$attrs" v-on="$listeners"><slot /></button>
		`,
	};

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: {
				'l-modal': LModal,
				'c-button': CButton,
			},
			sync: false,
		});
	});

	it('has a name equal m-password-change-success', () => {
		expect(wp.vm.$options.name).toBe('m-password-change-success');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="goto"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
