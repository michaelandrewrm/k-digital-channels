import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/account/w-detail-account.vue';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-account.vue', () => {
	let wp;
	let router;

	const fixture = {
		...accounts[0],
		interveners: [],
		productFamily: 'account',
		productId: 'account-1',
	};

	beforeEach(() => {
		const { shallowRouter } = newInstance;
		router = shallowRouter;
		router.addRoute({ name: 'product-profiles', path: 'product/:familyId/:productId/profiles' });

		wp = shallowMount(Component, { localVue, router, propsData: { detail: fixture } });
	});

	it('has a name equal to w-detail-account', () => {
		expect(wp.vm.$options.name).toBe('w-detail-account');
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="profiles"]').trigger('click');
		expect(router.currentRoute.name).toBe('product-profiles');
	});
});
