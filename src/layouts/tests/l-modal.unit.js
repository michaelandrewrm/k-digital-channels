import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-modal';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-modal.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to l-modal', () => {
		expect(wp.vm.$options.name).toBe('l-modal');
	});

	it('emits a close event when user clicks the close button', () => {
		const callback = jest.fn();
		const button = wp.find('[data-testid="modal-close-button"]');

		wp.vm.$el.addEventListener('close', callback);

		expect(callback).not.toBeCalled();
		button.trigger('click');
		expect(callback).toBeCalled();
	});

	it('emits a close event when user presses ESC', () => {
		const callback = jest.fn();

		wp.vm.$el.addEventListener('close', callback);

		expect(callback).not.toBeCalled();
		wp.trigger('keydown.esc');
		expect(callback).toBeCalled();
	});

	it("doesn't emit a close event when user presses ESC and its in modal mode", () => {
		const callback = jest.fn();

		wp.setProps({ modal: true });
		wp.vm.$el.addEventListener('close', callback);

		expect(callback).not.toBeCalled();
		wp.trigger('keydown.esc');
		expect(callback).not.toBeCalled();
	});

	it('should not action the confirm button when a cancel button is focused', async () => {
		const Modal = {
			template: `
				<l-modal>
					<button class="button" data-testid="cancel" raised @click="$emit('close')" slot="buttons">
						{{ $t('ACTIONS.CANCEL') }}
					</button>
					<button class="button" data-testid="confirm" raised confirm @click="handler" slot="buttons">
						{{ $t('ACTIONS.LOGOUT') }}
					</button>
				</l-modal>
			`,
			methods: {
				handler: jest.fn(),
			},
		};

		const wrapper = shallowMount(Modal, {
			localVue,
			attachTo: document.body,
			stubs: { 'l-modal': Component },
		});

		wrapper.find('[data-testid="cancel"]').element.focus();
		await wrapper.trigger('keydown.enter');
		await wrapper.vm.$nextTick();
		expect(wrapper.emitted().close).toBeTruthy();
		expect(Modal.methods.handler).not.toHaveBeenCalled();
	});

	it('should not displays an empty h1 when there isnt a title available', () => {
		expect(wp.find('[data-testid="modal-header"]').exists()).toBeFalsy();

		const slots = { header: '<span>test</span>' };

		wp = shallowMount(Component, { localVue, slots });

		expect(wp.find('[data-testid="modal-header"]').exists()).toBeTruthy();
	});
});
