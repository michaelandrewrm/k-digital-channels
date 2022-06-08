import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-bizum-movement.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-bizum-movement.vue', () => {
	let wp;
	const fixture = {
		type: { name: 'SENT' },
		status: { name: 'PENDING' },
		operationDate: '2019-12-25',
		reason: 'Comida',
		beneficiary: { name: 'Eduardo' },
		sender: { name: 'Francisco' },
		amount: { amount: 29.99, currency: { id: 'EUR' } },
	};

	it("has a name equal 'w-bizum-movement'", () => {
		wp = shallowMount(Component, { localVue, propsData: { status: 'completed', source: fixture } });

		expect(wp.vm.$options.name).toBe('w-bizum-movement');
	});

	/**
	 * Debería pintarse el movimiento con todos los datos
	 */
	it('should render correctly', async () => {
		wp = shallowMount(Component, { localVue, propsData: { status: 'completed', source: fixture } });

		expect(wp.text().replace(/\s+/g, ' ')).toBe(
			'Enviado a Eduardo 25/12/2019 Comida 29,99 € Pendiente'
		);
	});
});
