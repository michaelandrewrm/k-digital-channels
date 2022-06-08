import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-sirvase-icon';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-sirvase-icon.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { shallowRouter } = newInstance;
		router = shallowRouter;

		router.addRoute({ path: '/main/sirvase', name: 'sirvase' });

		wp = shallowMount(Component, { localVue, router });
	});

	it('has a name equal to c-sirvase-icon', () => {
		expect(wp.vm.$options.name).toBe('c-sirvase-icon');
	});

	it('redirects to sirvase-efectuar', async () => {
		const push = jest.spyOn(router, 'push');
		const button = wp.find('[data-testid="button"]');

		await button.trigger('click');

		expect(push).toHaveBeenCalledWith({ name: 'sirvase' });
	});
});
