import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-step-progress';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-step-progress.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				current: 1,
				steps: ['Primer paso', 'Segundo paso', 'Tercer paso', 'Confirmación'],
			},
		});
	});

	it('has a name equal to c-step-progress', () => {
		expect(wp.vm.$options.name).toBe('c-step-progress');
	});

	/**
	 * El paso seleccionado debería ser el definido por el parámetro.
	 */
	it('select the first step when current is 1', async () => {
		await wp.setProps({ current: 1 });

		expect(
			wp
				.findAll('[data-testid="step"]')
				.at(0)
				.attributes('aria-current')
		).toBe('step');

		await wp.setProps({ current: 2 });

		expect(
			wp
				.findAll('[data-testid="step"]')
				.at(1)
				.attributes('aria-current')
		).toBe('step');
	});

	/**
	 * Si current es mayor a la cantidad de pasos, el último paso debería
	 * de estar seleccionado.
	 */
	it('select the final step when current is bigger than steps length', async () => {
		await wp.setProps({ current: 4 });

		expect(
			wp
				.findAll('[data-testid="step"]')
				.at(-1)
				.attributes('aria-current')
		).toBe('step');
	});
});
