import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-correos-cash-detail.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-correos-cash-detail.vue', () => {
	let wp;
	let store;
	let router;
	const fixture = {
		id: '1',
		operationDate: '2021-09-24',
		beneficiary: {
			productNumber: 'ES3102340098375445122708',
			name: 'Voldemort',
		},
		totalAmount: 123.45,
		details: [{ operationId: '1' }],
		detailsCount: 1,
	};
	const WActions = {
		props: ['options'],
		template: `
			<div>
				<button
					:data-testid="opt.id"
					class="w-actions__btn"
					v-for="opt in options"
					:key="opt.id"
					@click="select(opt)"
				>
					{{ opt.title }}
				</button>
			</div>
		`,
		methods: {
			select: (option) => (option.action ? option.action() : null),
		},
	};
	const get = jest.fn().mockResolvedValue(fixture);
	const getQRCodesFromDeposit = jest.fn().mockResolvedValue([
		{
			id: '1',
			amount: 123.45,
			base64Image: 'data:image/png;base64,...',
			canvas: document.createElement('canvas'),
		},
	]);
	const open = jest.fn();
	const closeAll = jest.fn();

	beforeEach(() => {
		window.navigator.share = jest.fn();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('correos-cash', { get, getQRCodesFromDeposit });
		store.mockModule('notification', { open, closeAll });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { depositId: '1' },
			stubs: { WActions },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-correos-cash-detail', () => {
		expect(wp.vm.$options.name).toBe('v-correos-cash-detail');
	});

	it('should render correctly', async () => {
		await flushPromises();

		expect(
			wp
				.find('[data-testid="sheet"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('**** **** **** **** **** 2708 123,45 €');
	});

	it('should open a modal', async () => {
		const modalOpen = jest.fn();
		store.mockModule('modal', { open: modalOpen });

		await flushPromises();
		await wp.find('[data-testid="info-modal"]').trigger('click');

		expect(modalOpen).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-correos-cash-codes' })
		);
	});

	it('should open a new window after click on find office', async () => {
		const windowOpen = jest.spyOn(window, 'open');
		await wp.find('[data-testid="find-office"]').trigger('click');
		expect(windowOpen).toHaveBeenCalled();
	});

	it('should emit a custom event after click on find office', async () => {
		await wp.setData({ isHybrid: true });
		await wp.find('[data-testid="find-office"]').trigger('click');

		window.addEventListener('open-external-browser', (event) => {
			expect(event.detail.url).toBe(
				'https://www.correos.es/es/es/herramientas/oficinas-buzones-citypaq/detalle'
			);
		});
	});

	it('should open a notification after click on download', async () => {
		await flushPromises();
		await wp.find('[data-testid="download"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="download"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);
	});

	it('should open a notification after click on share', async () => {
		await flushPromises();
		await wp.find('[data-testid="share"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="share"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);
	});

	it('should not show the share option when is not supported', async () => {
		window.navigator.share = undefined;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { depositId: '1' },
			stubs: { WActions },
		});

		await flushPromises();

		expect(wp.find('[data-testid="share"]').exists()).toBeFalsy();
	});

	it('should go back when no data is received', async () => {
		const back = jest.spyOn(router, 'back');

		store.mockModule('correos-cash', { get: jest.fn().mockResolvedValue({}) });

		wp = shallowMount(Component, { localVue, store, router, propsData: { depositId: '1' } });
		await flushPromises();

		expect(back).toHaveBeenCalled();
	});
});
