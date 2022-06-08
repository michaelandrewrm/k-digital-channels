import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-list.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-list.vue', () => {
	let wp;
	let router;
	const transition = { template: '<div><slot></slot></div>' };
	const CVirtualList = {
		template: `
			<button
				v-bind="$attrs"
				@click="$emit('item:click')"
			>
				<component :is="dataComponent" v-for="(s, index) in items" :key="index" />
			</button>
		`,
		props: ['dataComponent', 'items'],
	};

	beforeEach(() => {
		jest.useFakeTimers();

		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, { localVue, router, stubs: { transition } });
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('has a name equal to w-list', () => {
		expect(wp.vm.$options.name).toBe('w-list');
	});

	it('should show the placeholders during loading', async () => {
		jest.runAllTimers();
		await wp.vm.$nextTick();

		expect(wp.findAllComponents({ name: 'c-placeholder-movement' })).toHaveLength(3);
		expect(wp.emitted('fetch')).toBeTruthy();
	});

	it('should show an error', async () => {
		jest.runAllTimers();
		await wp.vm.$nextTick();
		await wp.setProps({ error: true });

		expect(wp.find('[data-testid="error"]')).toBeTruthy();
	});

	it('should try to retrieve the items after click on error retry link', async () => {
		jest.runAllTimers();
		await wp.vm.$nextTick();
		await wp.setProps({ error: true });

		expect(wp.emitted('fetch')).toHaveLength(1);
		await wp.find('[data-testid="retry"]').trigger('click');
		expect(wp.emitted('fetch')).toHaveLength(2);
	});

	it('should load the next page', async () => {
		jest.runAllTimers();
		await wp.vm.$nextTick();

		expect(wp.emitted('fetch')).toHaveLength(1);

		await wp.setProps({
			messageNextPage: 'Cargar página siguiente',
			items: [{ a: 1 }],
			paginationKey: 'abc',
			itemComponent: { template: '<div />' },
		});

		await wp.find('[data-testid="load-more-button"]').trigger('click');

		expect(wp.emitted('fetch')).toHaveLength(2);
		expect(wp.emitted('fetch')[1][0]).toMatchObject({ paginationKey: 'abc' });
	});

	it('should emit an event when user clicks an item', async () => {
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			router,
			provide: { layout: { scrollingElement: document.body } },
			stubs: { CVirtualList },
			propsData: {
				items: [{ a: 1 }],
				itemComponent: { template: '<div />' },
			},
		});

		await wp.setProps({ items: [{ a: 1 }], itemComponent: { template: '<div />' } });

		jest.runAllTimers();
		await localVue.nextTick();

		await wp.find('[data-testid="list"]').trigger('click');

		expect(wp.emitted()['item-click']).toBeTruthy();
	});
});
