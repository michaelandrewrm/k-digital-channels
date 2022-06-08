import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-options.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-options.vue', () => {
	let wp;

	const fixtureOptions = [
		{ id: 1, icon: '', title: 'opt1' },
		{ id: 2, icon: '', title: 'opt2' },
		{ id: 3, icon: '', title: 'opt3' },
	];

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				options: fixtureOptions,
			},
		});
	});

	it('has a name equal to m-options', () => {
		expect(wp.vm.$options.name).toBe('m-options');
	});

	it('should emit a close event after select an option', async () => {
		await wp.find('[data-testid="option-1"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
	});
});
