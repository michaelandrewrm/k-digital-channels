import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-radio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-radio.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
		});
	});

	it('has a name equal to c-transfer-radio', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-transfer-radio');
	});

	it('init a radio checked when option is selected on mounted', () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { option: '2' };
			},
			template: `<div>
				<component-test name="test" value="1" :model.sync="option" />
				<component-test name="test" value="2" :model.sync="option" />
			</div>`,
		};

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});

		expect(shallowWrapper.find('input[type="radio"][value="1"]').element.checked).toBeFalsy();
		expect(shallowWrapper.find('input[type="radio"][value="2"]').element.checked).toBeTruthy();
	});

	it('updates option on click', async () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { option: '1' };
			},
			template: `<div>
				<component-test name="test" value="1" :model.sync="option" />
				<component-test name="test" value="2" :model.sync="option" />
			</div>`,
		};

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});

		expect(shallowWrapper.find('input[type="radio"][value="1"]').element.checked).toBeTruthy();
		expect(shallowWrapper.find('input[type="radio"][value="2"]').element.checked).toBeFalsy();

		// Click en el segundo radio
		const radio2 = shallowWrapper.find('input[type="radio"][value="2"]');
		radio2.element.checked = true;
		await radio2.trigger('click');
		await radio2.trigger('change');

		expect(shallowWrapper.find('input[type="radio"][value="1"]').element.checked).toBeFalsy();
		expect(shallowWrapper.find('input[type="radio"][value="2"]').element.checked).toBeTruthy();
		expect(shallowWrapper.vm.option).toBe('2');
	});

	it('updates v-model on button click', async () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { option: '1' };
			},
			template: `<div>
				<component-test name="test" value="1" type="button" v-model="option" />
				<component-test name="test" value="2" type="button" v-model="option" />
			</div>`,
		};

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			sync: false,
			stubs: { componentTest: Component },
		});

		expect(shallowWrapper.find('input[type="radio"][value="1"]').element.checked).toBeTruthy();
		expect(shallowWrapper.find('input[type="radio"][value="2"]').element.checked).toBeFalsy();

		// Click en el segundo radio
		const radio2 = shallowWrapper.find('input[type="radio"][value="2"]');
		radio2.element.checked = true;
		await radio2.trigger('click');
		await radio2.trigger('change');

		expect(shallowWrapper.find('input[type="radio"][value="1"]').element.checked).toBeFalsy();
		expect(shallowWrapper.find('input[type="radio"][value="2"]').element.checked).toBeTruthy();
		expect(shallowWrapper.vm.option).toBe('2');
	});
});
