import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-interveners.vue';
import { intervenersByTitle } from '@modules/products/product-interveners';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-interveners.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to w-interveners', () => {
		expect(wp.vm.$options.name).toBe('w-interveners');
	});

	it('expect grouped interveners by type', async () => {
		expect.assertions(4);

		await wp.setProps({
			interveners: [
				{
					id: 1,
					name: 'Evaristo',
					relationType: {
						id: intervenersByTitle.holder,
						name: 'holder',
					},
				},
				{
					id: 2,
					name: 'María',
					relationType: {
						id: intervenersByTitle.usufructuary,
						name: 'usufructuary',
					},
				},
				{
					id: 3,
					name: 'Joel',
					relationType: {
						id: intervenersByTitle.usufructuary,
						name: 'usufructuary',
					},
				},
			],
		});

		expect(wp.find('[title="Titular"]').exists()).toBeTruthy();
		expect(wp.find('[title="Usufructuarios"]').exists()).toBeTruthy();
		expect(wp.element.childElementCount).toBe(2);

		// Prueba de control
		expect(wp.find('[title="Titulares"]').exists()).toBeFalsy();
	});
});
