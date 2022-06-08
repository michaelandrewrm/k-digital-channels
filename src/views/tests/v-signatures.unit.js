import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-signatures.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-signatures', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, { localVue, router });
	});

	it('has a name equal to v-signatures', () => {
		expect(wp.vm.$options.name).toBe('v-signatures');
	});

	it('should show last visited tab', async () => {
		await router.push({ name: 'signatures' });

		await router.push({
			name: 'signature-detail',
			params: {
				signatureId: 'signature-1',
				type: 'signed',
			},
		});

		const from = router.currentRoute;
		await router.back();

		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		expect(wp.vm.selectedTab).toBe(1);
	});
});
