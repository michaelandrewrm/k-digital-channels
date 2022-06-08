import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-correos-cash-dashboard';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-correos-cash-dashboard.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			stubs: {
				'w-actions': {
					props: ['options'],
					template: `
					<div>
						<button
							data-testid="button-main"
							class="w-actions__btn"
							@click="options[0].action"
						>
							{{ options[0].title }}
						</button>
					</div>
				`,
				},
			},
		});
	});

	it('has a name equal to v-correos-cash-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-correos-cash-dashboard');
	});

	it('should go to correos cash deposit', async () => {
		const push = jest.spyOn(router, 'push');
		await wp.find('[data-testid="button-main"]').trigger('click');
		expect(push).toHaveBeenCalledWith({ name: 'correos-cash-deposit' });
	});
});
