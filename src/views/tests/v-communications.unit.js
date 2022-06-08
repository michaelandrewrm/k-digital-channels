import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-communications.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-communications.vue', () => {
	let wp;
	let router;

	const LPage = {
		template: `
			<div class="l-page">
				<slot name="header" />
				<slot name="main-fixed-header" />
				<slot />
			</div>
		`,
	};

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		router.push({ name: 'communications', params: { type: 'alerts' } });

		wp = shallowMount(Component, { localVue, router, stubs: { LPage } });
	});

	it('has a name equal to v-communications', () => {
		expect(wp.vm.$options.name).toBe('v-communications');
	});

	it('should show the tabs', async () => {
		const replaceSpy = jest.spyOn(router, 'replace');
		const tabsNav = wp.findComponent({ name: 'c-tabs-nav' });

		expect(replaceSpy).not.toHaveBeenCalled();
		expect(wp.find('[data-testid="list-alert"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list-statement"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list-document"]').exists()).toBeFalsy();

		await tabsNav.vm.$emit('select', 1);
		await wp.setProps({ type: 'statements' });
		expect(replaceSpy).toHaveBeenCalledWith(
			expect.objectContaining({ params: { type: 'statements' } })
		);
		expect(wp.find('[data-testid="list-alert"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list-statement"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list-document"]').exists()).toBeFalsy();

		await tabsNav.vm.$emit('select', 2);
		await wp.setProps({ type: 'documents' });

		expect(replaceSpy).toHaveBeenCalledWith(
			expect.objectContaining({ params: { type: 'documents' } })
		);
		expect(wp.find('[data-testid="list-alert"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list-statement"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list-document"]').exists()).toBeTruthy();
	});
});
