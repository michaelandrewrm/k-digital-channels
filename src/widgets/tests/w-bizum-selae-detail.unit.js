import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-bizum-selae-detail.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-bizum-selae-detail', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				source: {
					date: '2022-02-18 10:22:03.0',
					amount: {
						amount: '2.00',
						currency: {
							id: 'EUR',
							code: '978',
						},
					},
					reason: 'test',
				},
			},
		});
	});

	it("has a name equal 'w-bizum-selae-detail'", () => {
		expect(wp.vm.$options.name).toBe('w-bizum-selae-detail');
	});

	it('should render correctly', () => {
		expect(wp.find('[data-testid="content"]')).toBeTruthy();

		expect(wp.find('[data-testid="date"]')).toBeTruthy();

		expect(wp.find('[data-testid="amount"]')).toBeTruthy();

		expect(wp.find('[data-testid="reason"]')).toBeTruthy();
	});
});
