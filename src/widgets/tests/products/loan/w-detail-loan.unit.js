import { shallowMount, mount } from '@vue/test-utils';
import Component from '@widgets/products/loan/w-detail-loan.vue';
import { typesByTitle } from '@modules/products/product-types';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const detail = {
	id: 'abc123',
	productType: { id: typesByTitle.loan },
	productNumber: {
		value: '',
		format: { id: '' },
	},
	interveners: [],
	expirationDate: '2021-12-31',
	cvv: '178',
	pin: '1234',
};

describe('w-detail-loan.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			propsData: {
				detail,
			},
		});
	});

	it('has a name equal to w-detail-loan', () => {
		expect(wp.vm.$options.name).toBe('w-detail-loan');
	});

	it('emits close after showRepayments() is called', async () => {
		const wrapper = mount(Component, {
			localVue,
			router,
			propsData: {
				detail,
			},
		});

		const link = wrapper.find('[data-testid="show-repayments-link"]');
		link.trigger('click');
		await localVue.nextTick();
		expect(wrapper.emitted().close).toBeTruthy();
		expect(router.history.current.name).toEqual('amortization-table');
	});
});
