import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-input-rate';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-input-rate.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it("has a name equal 'c-input-rate'", () => {
		expect(wp.vm.$options.name).toBe('c-input-rate');
	});

	it('updates v-model on button click', async () => {
		const wrapperComponent = {
			components: { ComponentTest: Component },
			data() {
				return { option: 1 };
			},
			template: `<div>
				<component-test name="test" :value="1" v-model="option" />
				<component-test name="test" :value="2" v-model="option" />
			</div>`,
		};

		wp = shallowMount(wrapperComponent, {
			localVue,
			stubs: { componentTest: Component },
		});

		expect(wp.find('input[type="radio"][value="1"]').element.checked).toBeTruthy();
		expect(wp.find('input[type="radio"][value="2"]').element.checked).toBeFalsy();

		// Click en el segundo radio
		const radio2 = wp.find('input[type="radio"][value="2"]');
		radio2.element.checked = true;
		await radio2.trigger('click');
		await radio2.trigger('change');

		expect(wp.find('input[type="radio"][value="1"]').element.checked).toBeFalsy();
		expect(wp.find('input[type="radio"][value="2"]').element.checked).toBeTruthy();
		expect(wp.vm.option).toBe(2);
	});
});
