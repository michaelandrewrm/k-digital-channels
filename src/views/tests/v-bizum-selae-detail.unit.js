import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-selae-detail.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-qr', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		const source = {
			date: '2022-02-18 10:22:03.0',
			amount: {
				amount: '2.00',
				currency: {
					id: 'EUR',
					code: '978',
				},
			},
			reason: 'test',
			operationType: 'PAGO-PREMIO',
		};

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				success: true,
				source,
			},
		});
	});

	it('has a name equal to v-bizum-prize', () => {
		expect(wp.vm.$options.name).toBe('v-bizum-selae-detail');
	});

	it('should render correctly when success', () => {
		expect(wp.find('[data-testid="operation-success"]').exists()).toBeTruthy();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeFalsy();
	});

	it('should render correctly when error', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				error: true,
				errorTitle: 'error',
				errorDetail: 'error',
			},
		});

		expect(wp.find('[data-testid="operation-success"]').exists()).toBeFalsy();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	it('should go back when no source', async () => {
		const go = jest.spyOn(router, 'go');

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		expect(go).toHaveBeenCalledWith(-1);
	});

	it('should go back when clicked on continue', async () => {
		const replace = jest.spyOn(router, 'replace');

		const childWrapper = wp.find('[data-testid="continue"');

		await childWrapper.vm.$emit('click');

		expect(replace).toHaveBeenCalled();
	});
});
