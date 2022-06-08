import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/products/account/w-actions-account';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-account.vue', () => {
	let wp;
	let store;
	let router;

	const blob = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	const fixture = {
		id: 'account-1',
		productFamily: 'account',
		profiles: [],
		relationType: { id: '01' },
	};
	const WActions = {
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	const open = jest.fn();
	const getHolderCertificate = jest.fn().mockResolvedValue(blob);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('resources', { namespaced: true, state: { hasResult: true } });
		store.mockModule('modal', { open });
		store.mockModule('products', { getHolderCertificate });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WActions },
			propsData: { product: fixture },
		});
	});

	it('has a name equal to w-actions-account', () => {
		expect(wp.vm.$options.name).toBe('w-actions-account');
	});

	it('should navigate to transfer after click on transfer button', async () => {
		await wp.find('[data-testid="transfer"]').trigger('click');

		expect(router.currentRoute.name).toBe('transfer');
		expect(router.currentRoute.params).toMatchObject({ action: 'new' });
		expect(router.currentRoute.query).toMatchObject({ origin: 'account-1' });
	});

	it('should navigate to my transfers after click on my transfers button', async () => {
		await wp.find('[data-testid="my-transfers"]').trigger('click');

		expect(router.currentRoute.name).toBe('my-transfers');
		expect(router.currentRoute.params).toMatchObject({ productId: 'account-1' });
	});

	it('should emit a download document event after click on download pdf', async () => {
		await wp.find('[data-testid="download-pdf"]').trigger('click');

		expect(wp.emitted('download-document')[0][0]).toBe('pdf');
	});

	it('should emit a download document event after click on download xls', async () => {
		await wp.find('[data-testid="download-xls"]').trigger('click');

		expect(wp.emitted('download-document')[0][0]).toBe('xls');
	});

	it('should request for a ownership certificate download', async () => {
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('notification', { open: openAction });

		await wp.find('[data-testid="ownership-certificate"]').trigger('click');
		await flushPromises();

		expect(openAction).toHaveBeenCalled();
		expect(getHolderCertificate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ productId: 'account-1' })
		);
		expect(openAction.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		});
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'account',
			productId: 'account-1',
		});
	});
});
