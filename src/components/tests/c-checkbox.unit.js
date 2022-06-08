import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-checkbox';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-checkbox.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
		});
	});

	it('has a name equal to c-checkbox', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-checkbox');
	});

	it('init a checkbox checked when option is selected on mounted', () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { isChecked: false };
			},
			template: '<component-test name="test" v-model="isChecked" />',
		};

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});

		expect(shallowWrapper.find('input[type="checkbox"]').element.checked).toBeFalsy();
	});

	it('updates option on click', () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { isChecked: false };
			},
			template: '<component-test name="test" v-model="isChecked" />',
		};

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});

		expect(shallowWrapper.find('input[type="checkbox"]').element.checked).toBeFalsy();

		// Click en el segundo radio
		const input = shallowWrapper.find('input[type="checkbox"]');
		input.setChecked(true);

		expect(shallowWrapper.find('input[type="checkbox"]').element.checked).toBeTruthy();
		expect(shallowWrapper.vm.isChecked).toBeTruthy();
	});
});
