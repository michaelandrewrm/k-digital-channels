import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-fullscreen-spinner';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const wrapperComponent = {
	components: { ComponentTest: Component },
	template: `
	  <div>
		<component-test v-bind="$attrs" v-on="$listeners" />
	  </div>
	`,
};

describe('c-fullscreen-spinner.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});
	});

	it('should correctly render the spinner', () => {
		expect(shallowWrapper.findComponent(Component).exists()).toBe(true);
	});
});
